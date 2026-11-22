'use strict';

const SITE_HOME_URL = 'https://www.dodx.shop';
const LANG_STORAGE_KEY = 'dodx_ext_lang';
const isStandaloneWindow = new URLSearchParams(window.location.search).get('mode') === 'window';

let currentLang = 'en'; // Always defaults to English on first load
let currentPayload = null;
let currentMatchedStore = null;
let activeHostname = '';
let selectedGroupId = 'all';
let selectedBranchId = 'all';
let selectedCategoryId = 'all';
let selectedPriceTier = 'all';
let viewMode = 'products'; // 'products' | 'coupons'

const I18N = {
  en: {
    pageTitle: 'Dodx – Official Shopping Partners & Verified Deals',
    langShort: 'EN',
    langFlag: '🇺🇸',
    langMenuTitle: 'Display Language',
    langBtnTitle: 'Select display language',
    flashTimerTitle: 'Flash Deal Countdown',
    popoutTitle: 'Open in standalone window',
    refreshTitle: 'Sync latest offers',
    topBarTagline: '<strong>dodx.shop</strong> · Verified Deals',
    couponsBtn: 'Coupons',
    productsLink: 'Products',
    searchPlaceholder: 'Search iPhone, laptop, Samsung, Amazon...',
    searchAria: 'Search products and stores',
    catAria: 'Filter by category',
    priceAria: 'Filter by price bracket',
    allPriceTiers: 'All Price Tiers',
    allStores: 'All Stores',
    allPrefix: 'All',
    soonSuffix: '(Soon)',
    loadingText: 'Loading products & stores from dodx.shop...',
    offlineError: 'Unable to load offers. Visit https://www.dodx.shop directly.',
    disclosurePrefix: 'Affiliate Disclosure:',
    defaultDisclosure: 'As an affiliate, dodx.shop may earn a commission from qualifying purchases at no extra cost to you.',
    footerCoupons: 'Coupons',
    footerProducts: 'Products',
    footerDisclosure: 'Disclosure',
    couponsHeading: 'Verified Coupons & Bank Codes',
    offersCount: (n) => `${n} offers`,
    itemsCount: (n) => `${n} items`,
    noCoupons: 'No matching coupons found.',
    whiteFridayStrip: 'Best Deals — Huge White & Black Friday Discounts',
    comingSoonHeading: 'Biggest Discounts Coming Very Soon',
    comingSoonStoreBody: (name) => `${name} deals are coming very soon on dodx.shop.`,
    comingSoonFilterBody: 'No matching deals in this selection — try All Stores or switch price brackets.',
    openStorefront: (name) => `Open ${name} Storefront →`,
    topProductsHeading: 'Top Verified Deals & Flash Markdowns',
    storeProductsHeading: (name) => `${name} Products`,
    buyNow: 'Buy Now →',
    codeLabel: 'Code:',
    copyAndShop: (code) => `Copy ${code} & Shop →`,
    openOffer: 'Open Offer →',
    syncedNotice: 'Synced latest prices, categories & coupons from dodx.shop',
    partnerFallback: 'Dodx Partner',
    dealBadgeFallback: 'DEAL',
    couponBadgeFallback: 'COUPON',
    tierLabels: {
      '1-30': '1 – 30 (Top Discounts)',
      '30-60': '30 – 60',
      '60-100': '60 – 100',
      '100-150': '100 – 150',
      '150-500': '150 – 500',
      '500-1000': '500 – 1,000',
      '1000-2000': '1,000 – 2,000',
      '2000-3000': '2,000 – 3,000',
      '3000-5000': '3,000 – 5,000',
      'over-5000': '> 5,000 (Major)',
      'over-10000': '> 10,000 (⚡ Lightning)',
    },
  },
  ar: {
    pageTitle: 'Dodx – شركاء التسوق الرسميون وأفضل العروض الموثقة',
    langShort: 'AR',
    langFlag: '🇸🇦',
    langMenuTitle: 'لغة العرض',
    langBtnTitle: 'اختر لغة العرض',
    flashTimerTitle: 'عد تنازلي لعروض البرق',
    popoutTitle: 'فتح في نافذة مستقلة',
    refreshTitle: 'تحديث أحدث العروض',
    topBarTagline: '<strong>dodx.shop</strong> · عروض موثقة',
    couponsBtn: 'الكوبونات',
    productsLink: 'الأقسام',
    searchPlaceholder: 'ابحث عن آيفون، لابتوب، سامسونج، أمازون...',
    searchAria: 'البحث عن المنتجات والمتاجر',
    catAria: 'تصفية حسب القسم',
    priceAria: 'تصفية حسب نطاق السعر',
    allPriceTiers: 'كل نطاقات الأسعار',
    allStores: 'كل المتاجر',
    allPrefix: 'كل فروع',
    soonSuffix: '(قريباً)',
    loadingText: 'جاري تحميل المنتجات والمتاجر من dodx.shop...',
    offlineError: 'تعذر تحميل العروض. قم بزيارة https://www.dodx.shop مباشرة.',
    disclosurePrefix: 'إفصاح الشراكة:',
    defaultDisclosure: 'كموقع تسويق بالعمولة، قد يحصل dodx.shop على عمولة من المشتريات المؤهلة دون أي تكلفة إضافية عليك.',
    footerCoupons: 'الكوبونات',
    footerProducts: 'الأقسام',
    footerDisclosure: 'الإفصاح',
    couponsHeading: 'أكواد الخصم والبطاقات البنكية الموثقة',
    offersCount: (n) => `${n} عرض`,
    itemsCount: (n) => `${n} منتج`,
    noCoupons: 'لم يتم العثور على كوبونات مطابقة.',
    whiteFridayStrip: 'أفضل الصفقات — خصومات كبيرة جداً بمناسبة الجمعة البيضاء',
    comingSoonHeading: 'انتظر أقوى الخصومات قريباً جداً',
    comingSoonStoreBody: (name) => `عروض ${name} قيد الإضافة وستتوفر قريباً جداً على dodx.shop.`,
    comingSoonFilterBody: 'لا توجد منتجات مطابقة في هذا النطاق السعري — جرب كل المتاجر أو نطاق سعر آخر.',
    openStorefront: (name) => `فتح واجهة متجر ${name} ←`,
    topProductsHeading: 'أقوى العروض والخصومات الموثقة',
    storeProductsHeading: (name) => `منتجات ${name}`,
    buyNow: 'اشترِ الآن ←',
    codeLabel: 'الكود:',
    copyAndShop: (code) => `نسخ ${code} والتسوق ←`,
    openOffer: 'فتح العرض ←',
    syncedNotice: 'تم تحديث أحدث الأسعار والأقسام والكوبونات من dodx.shop',
    partnerFallback: 'شريك Dodx',
    dealBadgeFallback: 'عرض',
    couponBadgeFallback: 'كوبون',
    tierLabels: {
      '1-30': '1 – 30 (أكبر الخصومات)',
      '30-60': 'من 30 إلى 60',
      '60-100': 'من 60 إلى 100',
      '100-150': 'من 100 إلى 150',
      '150-500': 'من 150 إلى 500',
      '500-1000': 'من 500 إلى 1,000',
      '1000-2000': 'من 1,000 إلى 2,000',
      '2000-3000': 'من 2,000 إلى 3,000',
      '3000-5000': 'من 3,000 إلى 5,000',
      'over-5000': 'أكبر من 5,000 (خصومات كبيرة)',
      'over-10000': 'أكبر من 10,000 (⚡ عرض البرق)',
    },
  },
};

function getDict() {
  return I18N[currentLang] || I18N.en;
}

function isArLang() {
  return currentLang === 'ar';
}

function formatPriceForLang(rawPrice) {
  if (!rawPrice) return '';
  let text = String(rawPrice).trim();
  if (isArLang()) {
    text = text
      .replace(/\bUSD\b/gi, 'دولار')
      .replace(/\bEGP\b/gi, 'جنيه')
      .replace(/\bAED\b/gi, 'درهم')
      .replace(/\bJPY\b/gi, 'ين');
  } else {
    text = text
      .replace(/جنيه(?:\s+مصري)?/g, 'EGP')
      .replace(/درهم(?:\s+إماراتي)?/g, 'AED')
      .replace(/دولار(?:\s+أمريكي)?/g, 'USD')
      .replace(/\bين\b/g, 'JPY');
  }
  return text.replace(/\s{2,}/g, ' ').trim();
}

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

async function loadSavedLang() {
  try {
    if (chrome.storage?.local) {
      const res = await chrome.storage.local.get(LANG_STORAGE_KEY);
      if (res && (res[LANG_STORAGE_KEY] === 'en' || res[LANG_STORAGE_KEY] === 'ar')) {
        return res[LANG_STORAGE_KEY];
      }
    }
  } catch {
    // Fallback to localStorage
  }
  try {
    const saved = localStorage.getItem(LANG_STORAGE_KEY);
    if (saved === 'en' || saved === 'ar') return saved;
  } catch {
    // Ignore
  }
  return 'en';
}

async function saveLang(lang) {
  try {
    if (chrome.storage?.local) {
      await chrome.storage.local.set({ [LANG_STORAGE_KEY]: lang });
    }
  } catch {
    // Ignore
  }
  try {
    localStorage.setItem(LANG_STORAGE_KEY, lang);
  } catch {
    // Ignore
  }
}

function applyLanguageUI() {
  const dict = getDict();
  document.documentElement.lang = currentLang;
  document.documentElement.dir = isArLang() ? 'rtl' : 'ltr';
  document.title = dict.pageTitle;

  const langFlag = document.getElementById('lang-flag');
  const langCode = document.getElementById('lang-code');
  const langBtn = document.getElementById('lang-btn');
  const langMenuTitle = document.getElementById('lang-menu-title');
  if (langFlag) langFlag.textContent = dict.langFlag;
  if (langCode) langCode.textContent = dict.langShort;
  if (langBtn) {
    langBtn.title = dict.langBtnTitle;
    langBtn.setAttribute('aria-label', dict.langBtnTitle);
  }
  if (langMenuTitle) langMenuTitle.textContent = dict.langMenuTitle;

  document.querySelectorAll('.lang-option').forEach((btn) => {
    btn.classList.toggle('is-active', btn.getAttribute('data-lang') === currentLang);
  });

  const flashPill = document.getElementById('flash-timer-pill');
  const popoutBtn = document.getElementById('popout-btn');
  const refreshBtn = document.getElementById('refresh-btn');
  const topTagline = document.getElementById('top-bar-tagline');
  const couponsBtn = document.getElementById('coupons-mode-btn');
  const topProducts = document.getElementById('top-products-link');
  const searchInput = document.getElementById('offer-search');
  const catSelect = document.getElementById('category-filter');
  const priceSelect = document.getElementById('price-filter');
  const loadingCard = document.getElementById('loading-card');
  const footerCoupons = document.getElementById('footer-coupons-link');
  const footerProducts = document.getElementById('footer-products-link');
  const footerDisclosure = document.getElementById('footer-disclosure-link');
  const disclosureEl = document.getElementById('affiliate-disclosure');

  if (flashPill) flashPill.title = dict.flashTimerTitle;
  if (popoutBtn) popoutBtn.title = dict.popoutTitle;
  if (refreshBtn) refreshBtn.title = dict.refreshTitle;
  if (topTagline) {
    const strongEl = document.createElement('strong');
    strongEl.textContent = 'dodx.shop';
    const suffixText = isArLang() ? ' · عروض موثقة' : ' · Verified Deals';
    topTagline.replaceChildren(strongEl, document.createTextNode(suffixText));
  }
  if (couponsBtn) couponsBtn.textContent = dict.couponsBtn;
  if (topProducts) topProducts.textContent = dict.productsLink;
  if (searchInput) {
    searchInput.placeholder = dict.searchPlaceholder;
    searchInput.setAttribute('aria-label', dict.searchAria);
  }
  if (catSelect) catSelect.setAttribute('aria-label', dict.catAria);
  if (priceSelect) priceSelect.setAttribute('aria-label', dict.priceAria);
  if (loadingCard) loadingCard.textContent = dict.loadingText;
  if (footerCoupons) footerCoupons.textContent = dict.footerCoupons;
  if (footerProducts) footerProducts.textContent = dict.footerProducts;
  if (footerDisclosure) footerDisclosure.textContent = dict.footerDisclosure;
  if (disclosureEl) {
    disclosureEl.textContent = `${dict.disclosurePrefix} ${dict.defaultDisclosure}`;
  }

  populatePriceSelect();
  populateCategorySelect();
  renderStoreTabs();
  renderPopupContent();
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

function populatePriceSelect() {
  const selectEl = document.getElementById('price-filter');
  if (!selectEl) return;
  const dict = getDict();
  const prev = selectedPriceTier || 'all';
  selectEl.replaceChildren();

  const allOpt = document.createElement('option');
  allOpt.value = 'all';
  allOpt.textContent = dict.allPriceTiers;
  selectEl.appendChild(allOpt);

  Object.entries(dict.tierLabels).forEach(([id, label]) => {
    const opt = document.createElement('option');
    opt.value = id;
    opt.textContent = label;
    selectEl.appendChild(opt);
  });

  selectEl.value = prev;
}

function populateCategorySelect() {
  const selectEl = document.getElementById('category-filter');
  if (!selectEl) return;
  const categories = currentPayload && Array.isArray(currentPayload.categories)
    ? currentPayload.categories
    : [{ id: 'all', nameEn: 'All Categories', nameAr: 'كل الأقسام' }];

  selectEl.replaceChildren();
  categories.forEach((cat) => {
    const opt = document.createElement('option');
    opt.value = cat.id;
    opt.textContent = isArLang() ? (cat.nameAr || cat.nameEn) : (cat.nameEn || cat.nameAr);
    selectEl.appendChild(opt);
  });
  selectEl.value = selectedCategoryId;
}

function renderStoreTabs() {
  const tabsEl = document.getElementById('store-tabs');
  const branchEl = document.getElementById('branch-tabs');
  if (!tabsEl || !currentPayload || !Array.isArray(currentPayload.storeGroups)) return;

  const dict = getDict();
  const ar = isArLang();
  tabsEl.replaceChildren();

  const allTab = document.createElement('button');
  allTab.type = 'button';
  allTab.className = viewMode === 'products' && selectedGroupId === 'all' ? 'store-tab is-active' : 'store-tab';
  allTab.textContent = dict.allStores;
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
    const gName = ar ? (group.nameAr || group.nameEn) : (group.nameEn || group.nameAr);
    tabBtn.textContent = group.comingSoon ? `${gName} ${dict.soonSuffix}` : gName;
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

      const groupLabel = ar
        ? (branches[0].groupNameAr || branches[0].groupName || '')
        : (branches[0].groupName || branches[0].groupNameAr || '');

      const allBranchBtn = document.createElement('button');
      allBranchBtn.type = 'button';
      allBranchBtn.className = selectedBranchId === 'all' ? 'branch-tab is-active' : 'branch-tab';
      allBranchBtn.textContent = `${dict.allPrefix} ${groupLabel}`.trim();
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
        const bName = ar ? (branch.nameAr || branch.name) : (branch.name || branch.nameAr);
        bBtn.textContent = `${branch.flag || ''} ${bName}`.trim();
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
  const dict = getDict();
  const ar = isArLang();
  const titleText = ar ? (product.titleAr || product.title) : (product.title || product.titleAr);
  const storeText = ar
    ? (product.storeNameAr || product.storeName || dict.partnerFallback)
    : (product.storeName || product.storeNameAr || dict.partnerFallback);
  const badgeText = ar
    ? (product.badgeAr || product.badge || dict.dealBadgeFallback)
    : (product.badge || product.badgeAr || dict.dealBadgeFallback);

  const card = document.createElement('article');
  card.className = 'product-card';

  const mediaWrap = document.createElement('div');
  mediaWrap.className = 'product-media';
  mediaWrap.addEventListener('click', () => openExternalUrl(product.affiliateUrl));

  const imgEl = createSafeImageElement(
    product.imageUrl,
    product.fallbackImage,
    titleText,
    'product-img'
  );
  mediaWrap.appendChild(imgEl);

  const badge = document.createElement('span');
  badge.className = 'product-badge';
  badge.textContent = badgeText;
  mediaWrap.appendChild(badge);

  const body = document.createElement('div');
  body.className = 'product-body';

  const storeRow = document.createElement('div');
  storeRow.className = 'product-store-row';
  const dot = document.createElement('span');
  dot.className = 'store-dot';
  dot.style.backgroundColor = product.badgeColor || '#00453E';
  storeRow.appendChild(dot);
  storeRow.appendChild(document.createTextNode(storeText));

  const titleEl = document.createElement('h3');
  titleEl.className = 'product-title';
  titleEl.textContent = titleText;

  const priceRow = document.createElement('div');
  priceRow.className = 'price-badge-row';
  if (product.price) {
    const pricePill = document.createElement('span');
    pricePill.className = 'price-pill';
    pricePill.textContent = formatPriceForLang(product.price);
    priceRow.appendChild(pricePill);
  }
  if (product.oldPrice) {
    const oldEl = document.createElement('span');
    oldEl.className = 'old-price-text';
    oldEl.textContent = formatPriceForLang(product.oldPrice);
    priceRow.appendChild(oldEl);
  }

  const ctaBtn = document.createElement('button');
  ctaBtn.type = 'button';
  ctaBtn.className = 'product-cta-btn';
  ctaBtn.textContent = dict.buyNow;
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
  const dict = getDict();
  const ar = isArLang();
  const storeText = ar
    ? (coupon.storeNameAr || coupon.storeName || dict.partnerFallback)
    : (coupon.storeName || coupon.storeNameAr || dict.partnerFallback);
  const badgeText = ar
    ? (coupon.badgeAr || coupon.badge || dict.couponBadgeFallback)
    : (coupon.badge || coupon.badgeAr || dict.couponBadgeFallback);
  const titleText = ar ? (coupon.titleAr || coupon.title) : (coupon.title || coupon.titleAr);

  const card = document.createElement('article');
  card.className = 'coupon-card';

  const top = document.createElement('div');
  top.className = 'coupon-top';
  const storeSpan = document.createElement('span');
  storeSpan.className = 'coupon-store';
  storeSpan.textContent = storeText;
  const badgeSpan = document.createElement('span');
  badgeSpan.className = 'coupon-badge';
  badgeSpan.textContent = badgeText;
  top.appendChild(storeSpan);
  top.appendChild(badgeSpan);

  const titleEl = document.createElement('div');
  titleEl.className = 'coupon-title';
  titleEl.textContent = titleText;

  card.appendChild(top);
  card.appendChild(titleEl);

  if (coupon.code) {
    const codeBox = document.createElement('code');
    codeBox.className = 'coupon-code-box';
    codeBox.textContent = `${dict.codeLabel} ${coupon.code}`;
    card.appendChild(codeBox);
  }

  const ctaBtn = document.createElement('button');
  ctaBtn.type = 'button';
  ctaBtn.className = 'product-cta-btn';
  ctaBtn.textContent = coupon.code ? dict.copyAndShop(coupon.code) : dict.openOffer;
  ctaBtn.addEventListener('click', async () => {
    if (coupon.code && navigator.clipboard?.writeText) {
      try {
        await navigator.clipboard.writeText(coupon.code);
      } catch {
        // Ignore clipboard denial
      }
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

  const dict = getDict();
  const ar = isArLang();
  const query = normalizeText(searchInput ? searchInput.value : '');
  container.replaceChildren();

  if (!currentPayload || !Array.isArray(currentPayload.stores)) {
    const fallback = document.createElement('div');
    fallback.className = 'offline-card';
    fallback.textContent = dict.offlineError;
    container.appendChild(fallback);
    return;
  }

  if (disclosureEl) {
    const discBody = ar ? dict.defaultDisclosure : (currentPayload.disclosure || dict.defaultDisclosure);
    disclosureEl.textContent = `${dict.disclosurePrefix} ${discBody}`;
  }

  if (viewMode === 'coupons') {
    const header = document.createElement('div');
    header.className = 'section-header';
    const title = document.createElement('span');
    title.className = 'section-title';
    title.textContent = dict.couponsHeading;
    const coupons = Array.isArray(currentPayload.coupons) ? currentPayload.coupons : [];
    const filteredCoupons = coupons.filter((c) => {
      if (!query) return true;
      return normalizeText(`${c.title} ${c.titleAr} ${c.storeName} ${c.storeNameAr || ''} ${c.code || ''}`).includes(query);
    });
    const count = document.createElement('span');
    count.className = 'section-count';
    count.textContent = dict.offersCount(filteredCoupons.length);
    header.appendChild(title);
    header.appendChild(count);
    container.appendChild(header);

    if (filteredCoupons.length === 0) {
      const empty = document.createElement('div');
      empty.className = 'coming-soon-card';
      empty.textContent = dict.noCoupons;
      container.appendChild(empty);
      return;
    }

    filteredCoupons.forEach((c) => container.appendChild(createCouponCard(c)));
    return;
  }

  // Unified language Deal Banner Strip
  const wfStrip = document.createElement('div');
  wfStrip.className = 'white-friday-strip';
  const wfText = document.createElement('span');
  wfText.textContent = dict.whiteFridayStrip;
  wfStrip.appendChild(wfText);
  container.appendChild(wfStrip);

  const groupObj = (currentPayload.storeGroups || []).find((g) => g.id === selectedGroupId);
  if (groupObj && groupObj.comingSoon) {
    const gName = ar ? (groupObj.nameAr || groupObj.nameEn) : (groupObj.nameEn || groupObj.nameAr);
    const cs = document.createElement('div');
    cs.className = 'coming-soon-card';
    const h = document.createElement('h3');
    h.textContent = dict.comingSoonHeading;
    const p = document.createElement('p');
    p.textContent = dict.comingSoonStoreBody(gName);
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
    const hay = normalizeText(`${prod.title} ${prod.titleAr} ${prod.brand} ${prod.storeName} ${prod.storeNameAr || ''} ${prod.keywords}`);
    return hay.includes(query);
  });

  const prodHeader = document.createElement('div');
  prodHeader.className = 'section-header';
  const prodTitle = document.createElement('span');
  prodTitle.className = 'section-title';
  const groupDisplayName = groupObj
    ? (ar ? (groupObj.nameAr || groupObj.nameEn) : (groupObj.nameEn || groupObj.nameAr))
    : dict.partnerFallback;
  prodTitle.textContent = selectedGroupId === 'all'
    ? dict.topProductsHeading
    : dict.storeProductsHeading(groupDisplayName);
  const prodCount = document.createElement('span');
  prodCount.className = 'section-count';
  prodCount.textContent = dict.itemsCount(filteredProducts.length);
  prodHeader.appendChild(prodTitle);
  prodHeader.appendChild(prodCount);
  container.appendChild(prodHeader);

  if (filteredProducts.length === 0) {
    const cs = document.createElement('div');
    cs.className = 'coming-soon-card';
    const h = document.createElement('h3');
    h.textContent = dict.comingSoonHeading;
    const p = document.createElement('p');
    p.textContent = dict.comingSoonFilterBody;
    cs.appendChild(h);
    cs.appendChild(p);

    if (selectedGroupId !== 'all' && currentMatchedStore === null) {
      const storeObj = (currentPayload.stores || []).find((s) => s.groupId === selectedGroupId);
      if (storeObj && isSafeHttpsUrl(storeObj.affiliateUrl)) {
        const sName = ar
          ? (storeObj.groupNameAr || storeObj.nameAr || storeObj.groupName || storeObj.name)
          : (storeObj.groupName || storeObj.name);
        const visitBtn = document.createElement('button');
        visitBtn.type = 'button';
        visitBtn.className = 'product-cta-btn';
        visitBtn.style.marginTop = '10px';
        visitBtn.textContent = dict.openStorefront(sName);
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
        showStatusNotice(getDict().syncedNotice, true);
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
  currentLang = await loadSavedLang();
  startFlashCountdown();

  const domainEl = document.getElementById('active-domain');
  const searchInput = document.getElementById('offer-search');
  const categorySelect = document.getElementById('category-filter');
  const priceSelect = document.getElementById('price-filter');
  const couponsBtn = document.getElementById('coupons-mode-btn');
  const refreshBtn = document.getElementById('refresh-btn');
  const popoutBtn = document.getElementById('popout-btn');
  const langPicker = document.getElementById('lang-picker');
  const langBtn = document.getElementById('lang-btn');
  const langMenu = document.getElementById('lang-menu');

  if (isStandaloneWindow) {
    document.body.classList.add('is-standalone');
    if (popoutBtn) popoutBtn.hidden = true;
  } else if (popoutBtn) {
    popoutBtn.addEventListener('click', openStandalonePopupWindow);
  }

  if (langBtn && langMenu) {
    langBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const willOpen = langMenu.hidden;
      langMenu.hidden = !willOpen;
      langBtn.setAttribute('aria-expanded', willOpen ? 'true' : 'false');
    });

    langMenu.querySelectorAll('.lang-option').forEach((optBtn) => {
      optBtn.addEventListener('click', async () => {
        const nextLang = optBtn.getAttribute('data-lang') === 'ar' ? 'ar' : 'en';
        currentLang = nextLang;
        await saveLang(nextLang);
        langMenu.hidden = true;
        langBtn.setAttribute('aria-expanded', 'false');
        applyLanguageUI();
      });
    });

    document.addEventListener('click', (e) => {
      if (langPicker && !langPicker.contains(e.target)) {
        langMenu.hidden = true;
        langBtn.setAttribute('aria-expanded', 'false');
      }
    });
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

  applyLanguageUI();
  loadOffers(false);
});
