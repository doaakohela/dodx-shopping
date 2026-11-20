'use strict';

const SITE_HOME_URL = 'https://www.dodx.shop';
const SITE_PRODUCTS_URL = 'https://www.dodx.shop/products';
const isStandaloneWindow = new URLSearchParams(window.location.search).get('mode') === 'window';

let currentPayload = null;
let currentMatchedStore = null;
let activeHostname = '';
let selectedStoreId = 'all';

function isSafeHttpsUrl(rawUrl) {
  if (typeof rawUrl !== 'string') return false;
  try {
    return new URL(rawUrl).protocol === 'https:';
  } catch {
    return false;
  }
}

function isSafeLocalAsset(rawPath) {
  return typeof rawPath === 'string' && /^images\/[a-zA-Z0-9._-]+\.(jpg|jpeg|png|webp)$/.test(rawPath.trim());
}

function resolveImageSrc(imageUrl, fallbackImage) {
  if (isSafeHttpsUrl(imageUrl)) {
    return imageUrl;
  }
  if (isSafeLocalAsset(imageUrl)) {
    return chrome.runtime.getURL(imageUrl.trim());
  }
  if (isSafeLocalAsset(fallbackImage)) {
    return chrome.runtime.getURL(fallbackImage.trim());
  }
  return chrome.runtime.getURL('icons/icon128.png');
}

function createSafeImageElement(imageUrl, fallbackImage, altText, className) {
  const img = document.createElement('img');
  img.className = className;
  img.alt = altText || '';
  img.loading = 'lazy';

  const fallbackSrc = isSafeLocalAsset(fallbackImage)
    ? chrome.runtime.getURL(fallbackImage.trim())
    : chrome.runtime.getURL('icons/icon128.png');

  let usedFallback = false;
  img.addEventListener('error', () => {
    if (!usedFallback) {
      usedFallback = true;
      img.src = fallbackSrc;
    }
  });

  img.src = resolveImageSrc(imageUrl, fallbackImage);
  return img;
}

function normalizeText(input) {
  return String(input || '')
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u064B-\u065F\u0670\u0640]/g, '')
    .replace(/[أإآٱ]/g, 'ا')
    .replace(/ة/g, 'ه')
    .replace(/ى/g, 'ي')
    .trim();
}

async function openExternalUrl(rawUrl) {
  const safeUrl = isSafeHttpsUrl(rawUrl) ? rawUrl : SITE_HOME_URL;

  try {
    if (isStandaloneWindow && chrome.windows && chrome.windows.getAll) {
      const normalWindows = await chrome.windows.getAll({ windowTypes: ['normal'] });
      if (normalWindows && normalWindows.length > 0) {
        const targetWin = normalWindows[0];
        await chrome.tabs.create({ windowId: targetWin.id, url: safeUrl, active: true });
        await chrome.windows.update(targetWin.id, { focused: true });
        return;
      }
      await chrome.windows.create({ url: safeUrl, type: 'normal', focused: true });
      return;
    }

    await chrome.tabs.create({ url: safeUrl });
    if (!isStandaloneWindow) {
      window.close();
    }
  } catch {
    chrome.tabs.create({ url: safeUrl });
    if (!isStandaloneWindow) {
      window.close();
    }
  }
}

function openStandalonePopupWindow() {
  const popupUrl = chrome.runtime.getURL('popup.html?mode=window');
  chrome.windows.create(
    {
      url: popupUrl,
      type: 'popup',
      width: 424,
      height: 670,
      focused: true
    },
    () => {
      window.close();
    }
  );
}

function showStatusNotice(message, isSuccess = false) {
  const statusEl = document.getElementById('status-bar');
  if (!statusEl) return;
  statusEl.textContent = message;
  statusEl.className = isSuccess ? 'status-bar is-success' : 'status-bar';
  statusEl.hidden = false;
}

function hideStatusNotice() {
  const statusEl = document.getElementById('status-bar');
  if (!statusEl) return;
  statusEl.textContent = '';
  statusEl.hidden = true;
}

function renderStoreTabs() {
  const tabsEl = document.getElementById('store-tabs');
  if (!tabsEl || !currentPayload || !Array.isArray(currentPayload.stores)) return;

  tabsEl.replaceChildren();

  const allTab = document.createElement('button');
  allTab.type = 'button';
  allTab.className = selectedStoreId === 'all' ? 'store-tab is-active' : 'store-tab';
  allTab.textContent = `All (${currentPayload.stores.length})`;
  allTab.addEventListener('click', () => {
    selectedStoreId = 'all';
    renderStoreTabs();
    const searchInput = document.getElementById('offer-search');
    renderPopupContent(searchInput ? searchInput.value : '');
  });
  tabsEl.appendChild(allTab);

  currentPayload.stores.forEach((store) => {
    const tabBtn = document.createElement('button');
    tabBtn.type = 'button';
    tabBtn.className = selectedStoreId === store.id ? 'store-tab is-active' : 'store-tab';
    tabBtn.textContent = store.name;
    tabBtn.addEventListener('click', () => {
      selectedStoreId = store.id;
      renderStoreTabs();
      const searchInput = document.getElementById('offer-search');
      renderPopupContent(searchInput ? searchInput.value : '');
    });
    tabsEl.appendChild(tabBtn);
  });
}

function extractPriceDisplay(item) {
  let currentPrice = typeof item?.price === 'string' ? item.price.trim() : '';
  let oldPrice = typeof item?.oldPrice === 'string' ? item.oldPrice.trim() : '';

  if (currentPrice) {
    const inlineWasMatch = currentPrice.match(/^(.*?)\s*\((?:Was|Before coupon)\s+([^)]+)\)\s*$/i);
    if (inlineWasMatch) {
      currentPrice = inlineWasMatch[1].trim();
      if (!oldPrice) oldPrice = inlineWasMatch[2].trim();
    }
  }

  if (!currentPrice) {
    const sourceText = `${item?.badge || ''} ${item?.discountLabel || ''} ${item?.title || ''}`;
    const priceMatch = sourceText.match(
      /(?:~?\$[\d,]+(?:\.\d{1,2})?(?:\s*[–-]\s*\$[\d,]+(?:\.\d{1,2})?)?(?:\s*USD)?|[\d,]+(?:\.\d{1,2})?(?:\s*[–-]\s*[\d,]+(?:\.\d{1,2})?)?\s*EGP|AED\s*[\d,]+(?:\.\d{1,2})?|¥[\d,]+(?:\s*[–-]\s*¥[\d,]+)?(?:\s*JPY)?|€[\d,]+(?:\.\d{1,2})?)/i
    );
    if (priceMatch) {
      currentPrice = priceMatch[0].trim();
    }
  }

  if (!oldPrice && typeof item?.title === 'string') {
    const wasMatch = item.title.match(/Was\s+((?:~?\$|AED\s*|¥|€)?[\d,]+(?:\.\d{1,2})?(?:\s*(?:EGP|USD|JPY))?)/i);
    if (wasMatch) {
      oldPrice = wasMatch[1].trim();
    }
  }

  return { currentPrice, oldPrice };
}

function createPriceBadgeRow(item) {
  const { currentPrice, oldPrice } = extractPriceDisplay(item);
  if (!currentPrice) return null;

  const row = document.createElement('div');
  row.className = 'price-badge-row';

  const pricePill = document.createElement('span');
  pricePill.className = 'price-pill';
  pricePill.textContent = currentPrice;
  row.appendChild(pricePill);

  if (oldPrice) {
    const oldEl = document.createElement('span');
    oldEl.className = 'old-price-text';
    oldEl.textContent = oldPrice;
    row.appendChild(oldEl);
  }

  return row;
}

function createProductCard(product) {
  const card = document.createElement('article');
  card.className = 'product-card';

  const mediaWrap = document.createElement('div');
  mediaWrap.className = 'product-media';
  mediaWrap.addEventListener('click', () => openExternalUrl(product.affiliateUrl));

  const imgEl = createSafeImageElement(
    product.imageUrl,
    product.fallbackImage,
    product.title,
    'product-img'
  );
  mediaWrap.appendChild(imgEl);

  const badge = document.createElement('span');
  badge.className = 'product-badge';
  const hasPriceInBadge = product.badge && product.price && product.badge.includes(product.price.split(' ')[0]);
  badge.textContent = product.badge && product.price && !hasPriceInBadge
    ? `${product.badge} · ${product.price}`
    : (product.badge || product.price || 'Featured');
  mediaWrap.appendChild(badge);

  const body = document.createElement('div');
  body.className = 'product-body';

  const storeRow = document.createElement('div');
  storeRow.className = 'product-store-row';

  const dot = document.createElement('span');
  dot.className = 'store-dot';
  dot.style.backgroundColor = product.badgeColor || '#00453E';

  storeRow.appendChild(dot);
  storeRow.appendChild(document.createTextNode(product.storeName || 'Partner'));

  const titleEl = document.createElement('h3');
  titleEl.className = 'product-title';
  titleEl.textContent = product.title;

  const priceRow = createPriceBadgeRow(product);

  const ctaBtn = document.createElement('button');
  ctaBtn.type = 'button';
  ctaBtn.className = 'product-cta-btn';
  ctaBtn.textContent = `Shop ${product.storeName || 'Now'} →`;
  ctaBtn.addEventListener('click', () => openExternalUrl(product.affiliateUrl));

  body.appendChild(storeRow);
  body.appendChild(titleEl);
  if (priceRow) {
    body.appendChild(priceRow);
  }
  body.appendChild(ctaBtn);

  card.appendChild(mediaWrap);
  card.appendChild(body);
  return card;
}

function createOfferCard(store, offer) {
  const card = document.createElement('article');
  card.className = 'offer-card';

  const mainRow = document.createElement('div');
  mainRow.className = 'offer-main-row';

  if (offer.imageUrl || offer.fallbackImage) {
    const thumbImg = createSafeImageElement(
      offer.imageUrl,
      offer.fallbackImage,
      offer.title,
      'offer-thumb'
    );
    thumbImg.addEventListener('click', () => openExternalUrl(offer.affiliateUrl || store.affiliateUrl));
    mainRow.appendChild(thumbImg);
  }

  const infoCol = document.createElement('div');
  infoCol.className = 'offer-info';

  const topRow = document.createElement('div');
  topRow.className = 'offer-top';

  const storePill = document.createElement('span');
  storePill.className = 'store-pill';

  const dot = document.createElement('span');
  dot.className = 'store-dot';
  dot.style.backgroundColor = store.badgeColor || '#00453E';

  storePill.appendChild(dot);
  storePill.appendChild(document.createTextNode(store.name));

  const badgeTag = document.createElement('span');
  badgeTag.className = 'discount-tag';
  badgeTag.textContent = offer.price
    ? `${offer.price}${offer.discountLabel && !offer.discountLabel.includes(offer.price) ? ` · ${offer.discountLabel}` : ''}`
    : (offer.discountLabel || 'Official Partner');

  topRow.appendChild(storePill);
  topRow.appendChild(badgeTag);

  const titleEl = document.createElement('p');
  titleEl.className = 'offer-title';
  titleEl.textContent = offer.title;

  const offerPriceRow = createPriceBadgeRow(offer);

  infoCol.appendChild(topRow);
  infoCol.appendChild(titleEl);
  if (offerPriceRow) {
    infoCol.appendChild(offerPriceRow);
  }
  mainRow.appendChild(infoCol);

  const actionsRow = document.createElement('div');
  actionsRow.className = 'offer-actions';

  const dodxPageUrl = isSafeHttpsUrl(store.dodxPageUrl)
    ? store.dodxPageUrl
    : `${SITE_HOME_URL}/deals?store=${encodeURIComponent(store.id)}`;

  const viewOnDodxBtn = document.createElement('button');
  viewOnDodxBtn.type = 'button';
  viewOnDodxBtn.className = 'dodx-secondary-btn';
  viewOnDodxBtn.textContent = 'View on dodx.shop';
  viewOnDodxBtn.addEventListener('click', () => openExternalUrl(dodxPageUrl));

  const ctaBtn = document.createElement('button');
  ctaBtn.type = 'button';
  ctaBtn.className = 'cta-btn';
  ctaBtn.textContent = `Visit ${store.name} →`;
  ctaBtn.addEventListener('click', () => {
    openExternalUrl(offer.affiliateUrl || store.affiliateUrl);
  });

  actionsRow.appendChild(viewOnDodxBtn);
  actionsRow.appendChild(ctaBtn);

  card.appendChild(mainRow);
  card.appendChild(actionsRow);

  return card;
}

function renderPopupContent(searchQuery = '') {
  const container = document.getElementById('popup-content');
  const disclosureEl = document.getElementById('affiliate-disclosure');
  if (!container) return;

  container.replaceChildren();

  if (!currentPayload || !Array.isArray(currentPayload.stores)) {
    const fallback = document.createElement('div');
    fallback.className = 'offline-card';
    fallback.textContent = 'Unable to load partner links right now. Visit dodx.shop directly.';
    container.appendChild(fallback);
    return;
  }

  if (disclosureEl && currentPayload.disclosure) {
    disclosureEl.textContent = `Affiliate Disclosure: ${currentPayload.disclosure}`;
  }

  if (currentPayload.isOfflineFallback) {
    showStatusNotice('Offline mode: Showing bundled showcase & direct links to dodx.shop.');
  } else if (currentPayload.isStaleCache) {
    showStatusNotice('Offline mode: Showing cached products from last sync.');
  }

  const normalizedQuery = normalizeText(searchQuery);

  // Highlight active tab's matched partner store when browsing "all" without search
  if (!normalizedQuery && selectedStoreId === 'all' && currentMatchedStore) {
    const matchedBanner = document.createElement('section');
    matchedBanner.className = 'matched-banner';

    const bannerTop = document.createElement('div');
    bannerTop.className = 'matched-banner-top';
    const topLabel = document.createElement('span');
    topLabel.textContent = 'Official Partner Site Active';
    const topBadge = document.createElement('span');
    topBadge.textContent = 'dodx.shop Verified';
    bannerTop.appendChild(topLabel);
    bannerTop.appendChild(topBadge);

    const bannerBody = document.createElement('div');
    bannerBody.className = 'matched-banner-body';
    const storeTitle = document.createElement('div');
    storeTitle.className = 'matched-store-name';
    storeTitle.textContent = currentMatchedStore.name;

    const shopMatchedBtn = document.createElement('button');
    shopMatchedBtn.type = 'button';
    shopMatchedBtn.className = 'matched-shop-btn';
    shopMatchedBtn.textContent = `Open ${currentMatchedStore.name} Link`;
    shopMatchedBtn.addEventListener('click', () => {
      openExternalUrl(currentMatchedStore.affiliateUrl);
    });

    bannerBody.appendChild(storeTitle);
    bannerBody.appendChild(shopMatchedBtn);

    matchedBanner.appendChild(bannerTop);
    matchedBanner.appendChild(bannerBody);
    container.appendChild(matchedBanner);
  }

  // Visual Product Cards Showcase (synced dynamically from dodx.shop/api/offers.json)
  const rawProducts = Array.isArray(currentPayload.featuredProducts)
    ? currentPayload.featuredProducts
    : [];

  const filteredProducts = rawProducts.filter((prod) => {
    const matchesStore = selectedStoreId === 'all' || prod.storeId === selectedStoreId;
    if (!matchesStore) return false;
    if (!normalizedQuery) return true;
    const searchable = normalizeText(
      `${prod.title} ${prod.storeName || ''} ${prod.category || ''} ${prod.badge || ''} ${prod.keywords || ''}`
    );
    return searchable.includes(normalizedQuery);
  });

  if (filteredProducts.length > 0) {
    const prodHeader = document.createElement('div');
    prodHeader.className = 'section-header';

    const prodTitle = document.createElement('span');
    prodTitle.className = 'section-title';
    prodTitle.textContent = normalizedQuery
      ? 'Matching Products'
      : selectedStoreId === 'all'
        ? 'Featured Products & Categories'
        : `${filteredProducts[0].storeName || 'Partner'} Products`;

    const prodCount = document.createElement('span');
    prodCount.className = 'section-count';
    prodCount.textContent = `${filteredProducts.length} items`;

    prodHeader.appendChild(prodTitle);
    prodHeader.appendChild(prodCount);
    container.appendChild(prodHeader);

    const productsGrid = document.createElement('div');
    productsGrid.className = 'products-grid';
    filteredProducts.forEach((product) => {
      productsGrid.appendChild(createProductCard(product));
    });
    container.appendChild(productsGrid);
  }

  // Quick 1-click Official Partner Tiles + dodx.shop Products Portal
  if (!normalizedQuery && selectedStoreId === 'all') {
    const partnerHead = document.createElement('div');
    partnerHead.className = 'section-header';
    const pTitle = document.createElement('span');
    pTitle.className = 'section-title';
    pTitle.textContent = 'Official Partner Stores';
    partnerHead.appendChild(pTitle);
    container.appendChild(partnerHead);

    const partnersGrid = document.createElement('div');
    partnersGrid.className = 'partners-grid';

    currentPayload.stores.forEach((store) => {
      const tile = document.createElement('button');
      tile.type = 'button';
      tile.className = 'partner-tile';

      const tileTop = document.createElement('div');
      tileTop.className = 'partner-tile-top';

      const pill = document.createElement('span');
      pill.className = 'store-pill';
      const dot = document.createElement('span');
      dot.className = 'store-dot';
      dot.style.backgroundColor = store.badgeColor || '#00453E';
      pill.appendChild(dot);
      pill.appendChild(document.createTextNode(store.name));

      tileTop.appendChild(pill);

      const cta = document.createElement('span');
      cta.className = 'partner-tile-cta';
      cta.textContent = `Open ${store.name} →`;

      tile.appendChild(tileTop);
      tile.appendChild(cta);
      tile.addEventListener('click', () => openExternalUrl(store.affiliateUrl));

      partnersGrid.appendChild(tile);
    });

    container.appendChild(partnersGrid);

    const portalStrip = document.createElement('div');
    portalStrip.className = 'portal-strip';

    const portalText = document.createElement('span');
    portalText.className = 'portal-strip-text';
    portalText.textContent = 'Explore All Categories on dodx.shop';

    const portalBtn = document.createElement('button');
    portalBtn.type = 'button';
    portalBtn.className = 'portal-strip-btn';
    portalBtn.textContent = 'All Products →';
    portalBtn.addEventListener('click', () => {
      openExternalUrl(currentPayload.productsUrl || SITE_PRODUCTS_URL);
    });

    portalStrip.appendChild(portalText);
    portalStrip.appendChild(portalBtn);
    container.appendChild(portalStrip);
  }

  const visibleStores =
    selectedStoreId === 'all'
      ? currentPayload.stores
      : currentPayload.stores.filter((s) => s.id === selectedStoreId);

  const allEntries = [];
  for (const store of visibleStores) {
    const storeOffers =
      Array.isArray(store.offers) && store.offers.length > 0
        ? store.offers
        : [
            {
              id: `${store.id}-default`,
              title: `Visit ${store.name} Official Partner Storefront`,
              discountLabel: 'Official Partner',
              imageUrl: 'images/featured-deals.jpg',
              fallbackImage: 'images/featured-deals.jpg',
              affiliateUrl: store.affiliateUrl,
              featured: true
            }
          ];

    for (const offer of storeOffers) {
      const searchable = normalizeText(
        `${store.name} ${store.domain} ${store.category} ${store.keywords || ''} ${offer.title}`
      );
      if (!normalizedQuery || searchable.includes(normalizedQuery)) {
        allEntries.push({ store, offer });
      }
    }
  }

  const headerRow = document.createElement('div');
  headerRow.className = 'section-header';

  const heading = document.createElement('span');
  heading.className = 'section-title';
  heading.textContent = normalizedQuery
    ? 'Matching Stores & Links'
    : selectedStoreId === 'all'
      ? 'Direct Partner Destinations'
      : `${visibleStores[0]?.name || 'Partner'} Links`;

  const countBadge = document.createElement('span');
  countBadge.className = 'section-count';
  countBadge.textContent = `${allEntries.length} ${allEntries.length === 1 ? 'link' : 'links'}`;

  headerRow.appendChild(heading);
  headerRow.appendChild(countBadge);
  container.appendChild(headerRow);

  if (allEntries.length === 0 && filteredProducts.length === 0) {
    const emptyCard = document.createElement('div');
    emptyCard.className = 'offline-card';
    emptyCard.textContent = 'No matching products or partners found. Try another keyword or visit dodx.shop.';
    container.appendChild(emptyCard);
    return;
  }

  allEntries.forEach(({ store, offer }) => {
    container.appendChild(createOfferCard(store, offer));
  });
}

function loadOffers(forceRefresh = false) {
  const refreshBtn = document.getElementById('refresh-btn');
  if (refreshBtn && forceRefresh) {
    refreshBtn.classList.add('is-spinning');
  }

  const msgType = forceRefresh ? 'FORCE_REFRESH_OFFERS' : 'GET_OFFERS';
  chrome.runtime.sendMessage({ type: msgType, hostname: activeHostname }, (response) => {
    if (refreshBtn) {
      refreshBtn.classList.remove('is-spinning');
    }

    if (chrome.runtime.lastError || !response || !response.payload) {
      const container = document.getElementById('popup-content');
      if (container) {
        container.replaceChildren();
        const errCard = document.createElement('div');
        errCard.className = 'offline-card';
        errCard.textContent = 'Unable to sync right now. Click retry or visit dodx.shop.';

        const retryBtn = document.createElement('button');
        retryBtn.type = 'button';
        retryBtn.className = 'cta-btn';
        retryBtn.style.marginTop = '10px';
        retryBtn.textContent = 'Retry Sync';
        retryBtn.addEventListener('click', () => loadOffers(true));

        errCard.appendChild(retryBtn);
        container.appendChild(errCard);
      }
      return;
    }

    currentPayload = response.payload;
    currentMatchedStore = response.matchedStore || null;

    if (forceRefresh && !currentPayload.isOfflineFallback) {
      showStatusNotice('Products & partner links synced from dodx.shop.', true);
    } else if (!currentPayload.isOfflineFallback && !currentPayload.isStaleCache) {
      hideStatusNotice();
    }

    renderStoreTabs();
    const searchInput = document.getElementById('offer-search');
    renderPopupContent(searchInput ? searchInput.value : '');
  });
}

document.addEventListener('DOMContentLoaded', async () => {
  const domainEl = document.getElementById('active-domain');
  const searchInput = document.getElementById('offer-search');
  const refreshBtn = document.getElementById('refresh-btn');
  const popoutBtn = document.getElementById('popout-btn');

  if (isStandaloneWindow) {
    document.body.classList.add('is-standalone');
    if (popoutBtn) {
      popoutBtn.hidden = true;
    }
  } else if (popoutBtn) {
    popoutBtn.addEventListener('click', openStandalonePopupWindow);
  }

  document.querySelectorAll('[data-external-url]').forEach((anchor) => {
    anchor.addEventListener('click', (e) => {
      e.preventDefault();
      const targetUrl = anchor.getAttribute('data-external-url');
      openExternalUrl(targetUrl);
    });
  });

  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (tab && tab.url) {
      const parsed = new URL(tab.url);
      if (parsed.protocol === 'http:' || parsed.protocol === 'https:') {
        activeHostname = parsed.hostname.replace(/^www\./, '');
      }
    }
  } catch {
    activeHostname = '';
  }

  if (domainEl) {
    domainEl.textContent = activeHostname || 'dodx.shop';
  }

  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      renderPopupContent(e.target.value);
    });
  }

  if (refreshBtn) {
    refreshBtn.addEventListener('click', () => loadOffers(true));
  }

  loadOffers(false);
});
