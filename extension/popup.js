'use strict';

const SITE_HOME_URL = 'https://www.dodx.shop';
const isStandaloneWindow = new URLSearchParams(window.location.search).get('mode') === 'window';

let currentPayload = null;
let currentMatchedStore = null;
let activeHostname = '';
let selectedGroupId = 'all';
let selectedBranchId = 'all';
let selectedCategoryId = 'all';
let selectedPriceTier = 'all';
let viewMode = 'products'; // 'products' | 'coupons'

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
  if (isSafeHttpsUrl(imageUrl)) return imageUrl;
  if (isSafeLocalAsset(imageUrl)) return chrome.runtime.getURL(imageUrl.trim());
  if (isSafeLocalAsset(fallbackImage)) return chrome.runtime.getURL(fallbackImage.trim());
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

function matchesPriceTier(numericPrice, tierId) {
  if (!tierId || tierId === 'all') return true;
  if (tierId === '1-30') return numericPrice >= 1 && numericPrice <= 30;
  if (tierId === '30-60') return numericPrice >= 30 && numericPrice <= 60;
  if (tierId === '60-100') return numericPrice >= 60 && numericPrice <= 100;
  if (tierId === '100-150') return numericPrice >= 100 && numericPrice <= 150;
  if (tierId === '150-500') return numericPrice >= 150 && numericPrice <= 500;
  if (tierId === '500-1000') return numericPrice >= 500 && numericPrice <= 1000;
  if (tierId === '1000-2000') return numericPrice >= 1000 && numericPrice <= 2000;
  if (tierId === '2000-3000') return numericPrice >= 2000 && numericPrice <= 3000;
  if (tierId === '3000-5000') return numericPrice >= 3000 && numericPrice <= 5000;
  if (tierId === 'over-5000') return numericPrice >= 5000 && numericPrice <= 10000;
  if (tierId === 'over-10000') return numericPrice > 10000;
  return true;
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
    if (!isStandaloneWindow) window.close();
  } catch {
    chrome.tabs.create({ url: safeUrl });
    if (!isStandaloneWindow) window.close();
  }
}

function openStandalonePopupWindow() {
  const popupUrl = chrome.runtime.getURL('popup.html?mode=window');
  chrome.windows.create(
    { url: popupUrl, type: 'popup', width: 432, height: 680, focused: true },
    () => window.close()
  );
}

function startFlashCountdown() {
  const el = document.getElementById('flash-countdown');
  if (!el) return;
  const update = () => {
    const windowSec = 6 * 3600;
    const rem = windowSec - (Math.floor(Date.now() / 1000) % windowSec);
    const pad = (n) => String(n).padStart(2, '0');
    el.textContent = `${pad(Math.floor(rem / 3600))}:${pad(Math.floor((rem % 3600) / 60))}:${pad(rem % 60)}`;
  };
  update();
  window.setInterval(update, 1000);
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

function populateCategorySelect() {
  const selectEl = document.getElementById('category-filter');
  if (!selectEl || !currentPayload || !Array.isArray(currentPayload.categories)) return;
  selectEl.replaceChildren();
  currentPayload.categories.forEach((cat) => {
    const opt = document.createElement('option');
    opt.value = cat.id;
    opt.textContent = cat.nameAr ? `${cat.nameEn} · ${cat.nameAr}` : cat.nameEn;
    selectEl.appendChild(opt);
  });
  selectEl.value = selectedCategoryId;
}

function renderStoreTabs() {
  const tabsEl = document.getElementById('store-tabs');
  const branchEl = document.getElementById('branch-tabs');
  if (!tabsEl || !currentPayload || !Array.isArray(currentPayload.storeGroups)) return;

  tabsEl.replaceChildren();

  const allTab = document.createElement('button');
  allTab.type = 'button';
  allTab.className = viewMode === 'products' && selectedGroupId === 'all' ? 'store-tab is-active' : 'store-tab';
  allTab.textContent = 'All Stores';
  allTab.addEventListener('click', () => {
    viewMode = 'products';
    selectedGroupId = 'all';
    selectedBranchId = 'all';
    updateCouponsButtonState();
    renderStoreTabs();
    renderPopupContent();
  });
  tabsEl.appendChild(allTab);

  currentPayload.storeGroups.forEach((group) => {
    const tabBtn = document.createElement('button');
    tabBtn.type = 'button';
    tabBtn.className = viewMode === 'products' && selectedGroupId === group.id ? 'store-tab is-active' : 'store-tab';
    tabBtn.textContent = group.comingSoon ? `${group.nameEn} (Soon)` : group.nameEn;
    tabBtn.addEventListener('click', () => {
      viewMode = 'products';
      selectedGroupId = group.id;
      const branches = (currentPayload.stores || []).filter((s) => s.groupId === group.id);
      selectedBranchId = branches.length > 1 ? 'all' : (group.defaultStoreId || branches[0]?.id || group.id);
      updateCouponsButtonState();
      renderStoreTabs();
      renderPopupContent();
    });
    tabsEl.appendChild(tabBtn);
  });

  if (branchEl) {
    const branches = (currentPayload.stores || []).filter((s) => s.groupId === selectedGroupId);
    if (viewMode === 'products' && selectedGroupId !== 'all' && branches.length > 1) {
      branchEl.hidden = false;
      branchEl.replaceChildren();

      const allBranchBtn = document.createElement('button');
      allBranchBtn.type = 'button';
      allBranchBtn.className = selectedBranchId === 'all' ? 'branch-tab is-active' : 'branch-tab';
      allBranchBtn.textContent = `All ${branches[0].groupName || ''}`;
      allBranchBtn.addEventListener('click', () => {
        selectedBranchId = 'all';
        renderStoreTabs();
        renderPopupContent();
      });
      branchEl.appendChild(allBranchBtn);

      branches.forEach((branch) => {
        const bBtn = document.createElement('button');
        bBtn.type = 'button';
        bBtn.className = selectedBranchId === branch.id ? 'branch-tab is-active' : 'branch-tab';
        bBtn.textContent = `${branch.flag || ''} ${branch.name}`.trim();
        bBtn.addEventListener('click', () => {
          selectedBranchId = branch.id;
          renderStoreTabs();
          renderPopupContent();
        });
        branchEl.appendChild(bBtn);
      });
    } else {
      branchEl.hidden = true;
      branchEl.replaceChildren();
    }
  }
}

function updateCouponsButtonState() {
  const cBtn = document.getElementById('coupons-mode-btn');
  if (cBtn) {
    cBtn.className = viewMode === 'coupons' ? 'top-coupons-btn is-active' : 'top-coupons-btn';
  }
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
  badge.textContent = product.badge || 'DEAL';
  mediaWrap.appendChild(badge);

  const body = document.createElement('div');
  body.className = 'product-body';

  const storeRow = document.createElement('div');
  storeRow.className = 'product-store-row';
  const dot = document.createElement('span');
  dot.className = 'store-dot';
  dot.style.backgroundColor = product.badgeColor || '#00453E';
  storeRow.appendChild(dot);
  storeRow.appendChild(document.createTextNode(product.storeName || 'Dodx Partner'));

  const titleEl = document.createElement('h3');
  titleEl.className = 'product-title';
  titleEl.textContent = product.title;

  const priceRow = document.createElement('div');
  priceRow.className = 'price-badge-row';
  if (product.price) {
    const pricePill = document.createElement('span');
    pricePill.className = 'price-pill';
    pricePill.textContent = product.price;
    priceRow.appendChild(pricePill);
  }
  if (product.oldPrice) {
    const oldEl = document.createElement('span');
    oldEl.className = 'old-price-text';
    oldEl.textContent = product.oldPrice;
    priceRow.appendChild(oldEl);
  }

  const ctaBtn = document.createElement('button');
  ctaBtn.type = 'button';
  ctaBtn.className = 'product-cta-btn';
  ctaBtn.textContent = 'Buy Now · اشترِ الآن →';
  ctaBtn.addEventListener('click', () => openExternalUrl(product.affiliateUrl));

  body.appendChild(storeRow);
  body.appendChild(titleEl);
  if (priceRow.childElementCount > 0) body.appendChild(priceRow);
  body.appendChild(ctaBtn);

  card.appendChild(mediaWrap);
  card.appendChild(body);
  return card;
}

function createCouponCard(coupon) {
  const card = document.createElement('article');
  card.className = 'coupon-card';

  const top = document.createElement('div');
  top.className = 'coupon-top';
  const storeSpan = document.createElement('span');
  storeSpan.className = 'coupon-store';
  storeSpan.textContent = coupon.storeName || 'Dodx Partner';
  const badgeSpan = document.createElement('span');
  badgeSpan.className = 'coupon-badge';
  badgeSpan.textContent = coupon.badge || 'COUPON';
  top.appendChild(storeSpan);
  top.appendChild(badgeSpan);

  const titleEl = document.createElement('div');
  titleEl.className = 'coupon-title';
  titleEl.textContent = coupon.title;

  card.appendChild(top);
  card.appendChild(titleEl);

  if (coupon.code) {
    const codeBox = document.createElement('code');
    codeBox.className = 'coupon-code-box';
    codeBox.textContent = `Code: ${coupon.code}`;
    card.appendChild(codeBox);
  }

  const ctaBtn = document.createElement('button');
  ctaBtn.type = 'button';
  ctaBtn.className = 'product-cta-btn';
  ctaBtn.textContent = coupon.code ? `Copy ${coupon.code} & Shop →` : 'Open Offer →';
  ctaBtn.addEventListener('click', async () => {
    if (coupon.code && navigator.clipboard?.writeText) {
      try {
        await navigator.clipboard.writeText(coupon.code);
      } catch {}
    }
    openExternalUrl(coupon.affiliateUrl);
  });

  card.appendChild(ctaBtn);
  return card;
}

function renderPopupContent() {
  const container = document.getElementById('popup-content');
  const disclosureEl = document.getElementById('affiliate-disclosure');
  const searchInput = document.getElementById('offer-search');
  if (!container) return;

  const query = normalizeText(searchInput ? searchInput.value : '');
  container.replaceChildren();

  if (!currentPayload || !Array.isArray(currentPayload.stores)) {
    const fallback = document.createElement('div');
    fallback.className = 'offline-card';
    fallback.textContent = 'Unable to load offers. Visit https://www.dodx.shop directly.';
    container.appendChild(fallback);
    return;
  }

  if (disclosureEl && currentPayload.disclosure) {
    disclosureEl.textContent = `Affiliate Disclosure: ${currentPayload.disclosure}`;
  }

  if (viewMode === 'coupons') {
    const header = document.createElement('div');
    header.className = 'section-header';
    const title = document.createElement('span');
    title.className = 'section-title';
    title.textContent = 'Verified Coupons & Bank Codes · كوبونات الخصم';
    const coupons = Array.isArray(currentPayload.coupons) ? currentPayload.coupons : [];
    const filteredCoupons = coupons.filter((c) => {
      if (!query) return true;
      return normalizeText(`${c.title} ${c.titleAr} ${c.storeName} ${c.code || ''}`).includes(query);
    });
    const count = document.createElement('span');
    count.className = 'section-count';
    count.textContent = `${filteredCoupons.length} offers`;
    header.appendChild(title);
    header.appendChild(count);
    container.appendChild(header);

    if (filteredCoupons.length === 0) {
      const empty = document.createElement('div');
      empty.className = 'coming-soon-card';
      empty.textContent = 'No matching coupons found.';
      container.appendChild(empty);
      return;
    }

    filteredCoupons.forEach((c) => container.appendChild(createCouponCard(c)));
    return;
  }

  // White Friday Header Strip
  const wfStrip = document.createElement('div');
  wfStrip.className = 'white-friday-strip';
  const wfText = document.createElement('span');
  wfText.textContent = 'أفضل الصفقات — خصومات كبيرة جداً بمناسبة الجمعة البيضاء';
  wfStrip.appendChild(wfText);
  container.appendChild(wfStrip);

  // Determine allowed branch IDs for selectedGroupId / selectedBranchId
  const groupObj = (currentPayload.storeGroups || []).find((g) => g.id === selectedGroupId);
  if (groupObj && groupObj.comingSoon) {
    const cs = document.createElement('div');
    cs.className = 'coming-soon-card';
    const h = document.createElement('h3');
    h.textContent = 'انتظر أقوى الخصومات قريباً جداً';
    const p = document.createElement('p');
    p.textContent = `${groupObj.nameEn} deals are coming very soon on dodx.shop.`;
    cs.appendChild(h);
    cs.appendChild(p);
    container.appendChild(cs);
    return;
  }

  let allowedStoreIds = null;
  if (selectedBranchId !== 'all') {
    allowedStoreIds = new Set([selectedBranchId]);
  } else if (selectedGroupId !== 'all') {
    const groupBranches = (currentPayload.stores || []).filter((s) => s.groupId === selectedGroupId);
    allowedStoreIds = new Set(groupBranches.map((b) => b.id));
  }

  const rawProducts = Array.isArray(currentPayload.featuredProducts)
    ? currentPayload.featuredProducts
    : [];

  const filteredProducts = rawProducts.filter((prod) => {
    if (allowedStoreIds && !allowedStoreIds.has(prod.storeId)) return false;
    if (selectedCategoryId !== 'all' && prod.categoryId !== selectedCategoryId) return false;
    if (!matchesPriceTier(Number(prod.numericPrice || 0), selectedPriceTier)) return false;
    if (!query) return true;
    const hay = normalizeText(`${prod.title} ${prod.titleAr} ${prod.brand} ${prod.storeName} ${prod.keywords}`);
    return hay.includes(query);
  });

  const prodHeader = document.createElement('div');
  prodHeader.className = 'section-header';
  const prodTitle = document.createElement('span');
  prodTitle.className = 'section-title';
  prodTitle.textContent = selectedGroupId === 'all' ? 'Top White & Black Friday Products' : `${groupObj?.nameEn || 'Store'} Products`;
  const prodCount = document.createElement('span');
  prodCount.className = 'section-count';
  prodCount.textContent = `${filteredProducts.length} items`;
  prodHeader.appendChild(prodTitle);
  prodHeader.appendChild(prodCount);
  container.appendChild(prodHeader);

  if (filteredProducts.length === 0) {
    const cs = document.createElement('div');
    cs.className = 'coming-soon-card';
    const h = document.createElement('h3');
    h.textContent = 'انتظر أقوى الخصومات قريباً جداً';
    const p = document.createElement('p');
    p.textContent = 'Biggest Discounts Coming Very Soon — try All Stores or switch price brackets.';
    cs.appendChild(h);
    cs.appendChild(p);

    if (selectedGroupId !== 'all' && currentMatchedStore === null) {
      const storeObj = (currentPayload.stores || []).find((s) => s.groupId === selectedGroupId);
      if (storeObj && isSafeHttpsUrl(storeObj.affiliateUrl)) {
        const visitBtn = document.createElement('button');
        visitBtn.type = 'button';
        visitBtn.className = 'product-cta-btn';
        visitBtn.style.marginTop = '10px';
        visitBtn.textContent = `Open ${storeObj.groupName || storeObj.name} Storefront →`;
        visitBtn.addEventListener('click', () => openExternalUrl(storeObj.affiliateUrl));
        cs.appendChild(visitBtn);
      }
    }

    container.appendChild(cs);
    return;
  }

  const grid = document.createElement('div');
  grid.className = 'products-grid';
  filteredProducts.forEach((p) => grid.appendChild(createProductCard(p)));
  container.appendChild(grid);
}

function loadOffers(forceRefresh = false) {
  const refreshBtn = document.getElementById('refresh-btn');
  if (refreshBtn && forceRefresh) refreshBtn.classList.add('is-spinning');

  chrome.runtime.sendMessage(
    { type: forceRefresh ? 'FORCE_REFRESH_OFFERS' : 'GET_OFFERS', hostname: activeHostname },
    (response) => {
      if (refreshBtn) refreshBtn.classList.remove('is-spinning');
      if (chrome.runtime.lastError || !response || !response.payload) {
        return;
      }

      currentPayload = response.payload;
      currentMatchedStore = response.matchedStore || null;

      if (forceRefresh && !currentPayload.isOfflineFallback) {
        showStatusNotice('Synced latest prices, categories & coupons from dodx.shop', true);
      } else {
        hideStatusNotice();
      }

      populateCategorySelect();
      renderStoreTabs();
      renderPopupContent();
    }
  );
}

document.addEventListener('DOMContentLoaded', async () => {
  startFlashCountdown();

  const domainEl = document.getElementById('active-domain');
  const searchInput = document.getElementById('offer-search');
  const categorySelect = document.getElementById('category-filter');
  const priceSelect = document.getElementById('price-filter');
  const couponsBtn = document.getElementById('coupons-mode-btn');
  const refreshBtn = document.getElementById('refresh-btn');
  const popoutBtn = document.getElementById('popout-btn');

  if (isStandaloneWindow) {
    document.body.classList.add('is-standalone');
    if (popoutBtn) popoutBtn.hidden = true;
  } else if (popoutBtn) {
    popoutBtn.addEventListener('click', openStandalonePopupWindow);
  }

  document.querySelectorAll('[data-external-url]').forEach((anchor) => {
    anchor.addEventListener('click', (e) => {
      e.preventDefault();
      openExternalUrl(anchor.getAttribute('data-external-url'));
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

  if (domainEl) domainEl.textContent = activeHostname || 'dodx.shop';
  if (searchInput) searchInput.addEventListener('input', renderPopupContent);
  if (categorySelect) {
    categorySelect.addEventListener('change', (e) => {
      selectedCategoryId = e.target.value;
      viewMode = 'products';
      updateCouponsButtonState();
      renderPopupContent();
    });
  }
  if (priceSelect) {
    priceSelect.addEventListener('change', (e) => {
      selectedPriceTier = e.target.value;
      viewMode = 'products';
      updateCouponsButtonState();
      renderPopupContent();
    });
  }
  if (couponsBtn) {
    couponsBtn.addEventListener('click', () => {
      viewMode = viewMode === 'coupons' ? 'products' : 'coupons';
      updateCouponsButtonState();
      renderStoreTabs();
      renderPopupContent();
    });
  }
  if (refreshBtn) refreshBtn.addEventListener('click', () => loadOffers(true));

  loadOffers(false);
});
