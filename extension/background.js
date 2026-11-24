'use strict';

const OFFERS_API_ENDPOINTS = [
  'https://www.dodx.shop/api/offers.json',
  'https://dodx.shop/api/offers.json'
];
const SITE_HOME_URL = 'https://www.dodx.shop';
const SITE_PRODUCTS_URL = 'https://www.dodx.shop/products';
const SITE_COUPONS_URL = 'https://www.dodx.shop/coupons';
const CACHE_STORAGE_KEY = 'dodx_offers_cache_v8';
const REFRESH_ALARM_NAME = 'dodx_refresh_offers';
const CACHE_TTL_MS = 2 * 60 * 60 * 1000;
const REFRESH_PERIOD_MINUTES = 120;

const OFFLINE_DIRECTORY_FALLBACK = {
  version: 'offline-3.2',
  updatedAt: null,
  siteUrl: SITE_HOME_URL,
  productsUrl: SITE_PRODUCTS_URL,
  couponsUrl: SITE_COUPONS_URL,
  disclosure:
    'As an affiliate, dodx.shop may earn a commission from qualifying purchases at no extra cost to you.',
  isOfflineFallback: true,
  storeGroups: [
    { id: 'amazon', nameEn: 'Amazon', nameAr: 'أمازون', defaultStoreId: 'amazon' },
    { id: 'aliexpress', nameEn: 'AliExpress', nameAr: 'علي إكسبريس', defaultStoreId: 'aliexpress' },
    { id: 'alibaba', nameEn: 'Alibaba', nameAr: 'علي بابا', defaultStoreId: 'alibaba' },
    { id: 'ebay', nameEn: 'eBay', nameAr: 'إيباي eBay', defaultStoreId: 'ebay', comingSoon: true },
    { id: 'noon', nameEn: 'Noon', nameAr: 'نون Noon', defaultStoreId: 'noon', comingSoon: true },
    { id: 'honor', nameEn: 'HONOR', nameAr: 'هونر', defaultStoreId: 'honor-uae' },
    { id: 'huawei', nameEn: 'Huawei', nameAr: 'هواوي', defaultStoreId: 'huawei-ae' },
    { id: 'lenovo', nameEn: 'Lenovo', nameAr: 'لينوفو', defaultStoreId: 'lenovo-india' },
    { id: 'canon', nameEn: 'Canon', nameAr: 'كانون', defaultStoreId: 'canon-uae' },
    { id: 'parallels', nameEn: 'Parallels', nameAr: 'باراليلز', defaultStoreId: 'parallels-ww' },
    { id: 'adguard', nameEn: 'AdGuard', nameAr: 'أدجارد', defaultStoreId: 'adguard-many-geos' }
  ],
  categories: [
    { id: 'all', nameEn: 'All Categories', nameAr: 'كل الأقسام' },
    { id: 'smartphones', nameEn: 'Smartphones & Mobiles', nameAr: 'الموبايلات' },
    { id: 'laptops', nameEn: 'Laptops & Computers', nameAr: 'اللابتوب والكمبيوتر' },
    { id: 'tablets-wearables', nameEn: 'Tablets & Wearables', nameAr: 'التابلت والساعات' },
    { id: 'audio', nameEn: 'Audio & Headphones', nameAr: 'السماعات والصوتيات' },
    { id: 'tv-monitors', nameEn: 'TVs & Monitors', nameAr: 'الشاشات والتلفزيونات' },
    { id: 'men-fashion', nameEn: "Men's Fashion", nameAr: 'أزياء رجالي' },
    { id: 'women-fashion', nameEn: "Women's Fashion", nameAr: 'أزياء نسائي' },
    { id: 'accessories', nameEn: 'Accessories & Gear', nameAr: 'الإكسسوارات' },
    { id: 'watches-jewelry', nameEn: 'Watches & Jewelry', nameAr: 'الساعات والمجوهرات' },
    { id: 'beauty-health', nameEn: 'Health & Beauty', nameAr: 'الصحة والجمال' },
    { id: 'home-furniture', nameEn: 'Home & Furniture', nameAr: 'المنزل والأثاث' },
    { id: 'food-grocery', nameEn: 'Food & Grocery', nameAr: 'الأغذية والمشروبات' },
    { id: 'cars', nameEn: 'Cars & Auto', nameAr: 'السيارات' },
    { id: 'motorcycles', nameEn: 'Motorcycles', nameAr: 'الموتوسيكلات' },
    { id: 'software', nameEn: 'Software', nameAr: 'البرامج والحماية' }
  ],
  featuredProducts: [
    {
      id: 'amz-8',
      storeId: 'amazon',
      storeName: 'Amazon US',
      storeNameAr: 'أمازون أمريكا',
      categoryId: 'audio',
      category: 'audio',
      title: 'TAGRY Hybrid ANC Bluetooth Headphones (100H Playtime)',
      titleAr: 'سماعات TAGRY لاسلكية بعزل الضوضاء النشط ANC (100 ساعة)',
      badge: '50% COUPON',
      badgeAr: 'خصم 50%',
      badgeColor: '#CC0C39',
      price: '~$24.50 USD',
      oldPrice: '$149.99',
      numericPrice: 24.5,
      imageUrl: 'images/smartphones-audio.jpg',
      fallbackImage: 'images/smartphones-audio.jpg',
      keywords: 'tagry headphones audio amazon سماعات',
      affiliateUrl: 'https://link.amazon/B0aAG3AU7',
      dodxPageUrl: 'https://www.dodx.shop/p/amz-8'
    },
    {
      id: 'amz-eg-3',
      storeId: 'amazon-eg',
      storeName: 'Amazon Egypt',
      storeNameAr: 'أمازون مصر',
      categoryId: 'home-furniture',
      category: 'home-furniture',
      title: 'Sokany SK-100A Single Electric Burner Hot Plate (1000W)',
      titleAr: 'سخان كهربائي مفرد سوكاني SK-100A بقوة 1000 واط',
      badge: '22% OFF',
      badgeAr: 'خصم 22%',
      badgeColor: '#CC0C39',
      price: '639.00 EGP',
      oldPrice: '819.00 EGP',
      numericPrice: 639,
      imageUrl: 'images/home-kitchen.jpg',
      fallbackImage: 'images/home-kitchen.jpg',
      keywords: 'amazon egypt sokany امازون مصر سوكاني',
      affiliateUrl: 'https://link.amazon/B03bXQEs9',
      dodxPageUrl: 'https://www.dodx.shop/p/amz-eg-3'
    }
  ],
  coupons: [
    {
      id: 'amz-eg-swype',
      storeId: 'amazon-eg',
      storeName: 'Amazon Egypt · CIB Swype',
      storeNameAr: 'أمازون مصر · بطاقة CIB Swype',
      type: 'bank',
      title: '25% Instant Bank Discount up to 250 EGP (CIB Swype)',
      titleAr: 'خصم بنكي فوري 25% حتى 250 جنيه مع بطاقة CIB Swype',
      description: 'Min order 1,000 EGP on Amazon.eg',
      descriptionAr: 'حد أدنى للطلب 1,000 جنيه على أمازون مصر · استخدم الكود SWYPE25 عند الدفع.',
      code: 'SWYPE25',
      badge: '25% OFF',
      badgeAr: 'خصم 25%',
      imageUrl: 'images/featured-deals.jpg',
      fallbackImage: 'images/featured-deals.jpg',
      affiliateUrl: 'https://link.amazon/B02evOzAd',
      dodxPageUrl: 'https://www.dodx.shop/p/amz-eg-swype'
    }
  ],
  stores: [
    {
      id: 'amazon',
      groupId: 'amazon',
      groupName: 'Amazon',
      groupNameAr: 'أمازون',
      name: 'Amazon US ($)',
      nameAr: 'أمازون أمريكا ($)',
      flag: '🇺🇸',
      currencySymbol: '$',
      currencyCode: 'USD',
      domain: 'amazon.com',
      matchDomains: ['amazon.com', 'www.amazon.com'],
      badgeColor: '#FF9900',
      dodxPageUrl: 'https://www.dodx.shop/deals?store=amazon',
      affiliateUrl: 'https://link.amazon/B08F6a0wD',
      offers: []
    },
    {
      id: 'amazon-eg',
      groupId: 'amazon',
      groupName: 'Amazon',
      groupNameAr: 'أمازون',
      name: 'Amazon Egypt (EGP)',
      nameAr: 'أمازون مصر (جنيه)',
      flag: '🇪🇬',
      currencySymbol: 'EGP',
      currencyCode: 'EGP',
      domain: 'amazon.eg',
      matchDomains: ['amazon.eg', 'www.amazon.eg'],
      badgeColor: '#FF9900',
      dodxPageUrl: 'https://www.dodx.shop/deals?store=amazon-eg',
      affiliateUrl: 'https://link.amazon/B02evOzAd',
      offers: []
    },
    {
      id: 'amazon-pl',
      groupId: 'amazon',
      groupName: 'Amazon',
      groupNameAr: 'أمازون',
      name: 'Amazon Poland (zł)',
      nameAr: 'أمازون بولندا (زلوطي)',
      flag: '🇵🇱',
      currencySymbol: 'zł',
      currencyCode: 'PLN',
      domain: 'amazon.pl',
      matchDomains: ['amazon.pl', 'www.amazon.pl'],
      badgeColor: '#FF9900',
      dodxPageUrl: 'https://www.dodx.shop/deals?store=amazon-pl',
      affiliateUrl: 'https://link.amazon/B0itJTCyS',
      offers: []
    },
    {
      id: 'ebay',
      groupId: 'ebay',
      groupName: 'eBay',
      groupNameAr: 'إيباي eBay',
      name: 'eBay Global ($)',
      nameAr: 'إيباي العالمي ($)',
      flag: '🌐',
      currencySymbol: '$',
      currencyCode: 'USD',
      domain: 'ebay.com',
      comingSoon: true,
      matchDomains: ['ebay.com', 'www.ebay.com'],
      badgeColor: '#E53238',
      dodxPageUrl: 'https://www.dodx.shop/deals?store=ebay',
      affiliateUrl: 'https://www.dodx.shop/deals?store=ebay',
      offers: []
    },
    {
      id: 'noon',
      groupId: 'noon',
      groupName: 'Noon',
      groupNameAr: 'نون Noon',
      name: 'Noon Regional',
      nameAr: 'نون الإقليمي',
      flag: '🟡',
      currencySymbol: 'AED',
      currencyCode: 'AED',
      domain: 'noon.com',
      comingSoon: true,
      matchDomains: ['noon.com', 'www.noon.com'],
      badgeColor: '#FEEE00',
      dodxPageUrl: 'https://www.dodx.shop/deals?store=noon',
      affiliateUrl: 'https://www.dodx.shop/deals?store=noon',
      offers: []
    }
  ]
};

function sanitizeHttpsUrl(rawUrl, fallbackUrl = SITE_HOME_URL) {
  if (typeof rawUrl !== 'string') return fallbackUrl;
  try {
    const parsed = new URL(rawUrl.trim());
    if (parsed.protocol === 'https:') {
      return parsed.toString();
    }
  } catch {
    // Invalid URL
  }
  return fallbackUrl;
}

function sanitizeLocalImage(rawPath, defaultLocal = 'images/featured-deals.jpg') {
  if (typeof rawPath === 'string' && /^images\/[a-zA-Z0-9._-]+\.(jpg|jpeg|png|webp)$/.test(rawPath.trim())) {
    return rawPath.trim();
  }
  return defaultLocal;
}

function sanitizeImageSource(rawImageUrl, fallbackLocal = 'images/featured-deals.jpg') {
  if (typeof rawImageUrl === 'string') {
    const trimmed = rawImageUrl.trim();
    try {
      const parsed = new URL(trimmed);
      if (parsed.protocol === 'https:') {
        return parsed.toString();
      }
    } catch {
      // Check if local asset
    }
    if (/^images\/[a-zA-Z0-9._-]+\.(jpg|jpeg|png|webp)$/.test(trimmed)) {
      return trimmed;
    }
  }
  return sanitizeLocalImage(fallbackLocal);
}

function sanitizeColor(rawColor) {
  if (typeof rawColor === 'string' && /^#[0-9a-fA-F]{3,8}$/.test(rawColor.trim())) {
    return rawColor.trim();
  }
  return '#00453E';
}

function sanitizePayload(rawPayload) {
  if (!rawPayload || typeof rawPayload !== 'object' || !Array.isArray(rawPayload.stores)) {
    return null;
  }

  const stores = rawPayload.stores
    .filter((s) => s && typeof s === 'object' && typeof s.id === 'string' && typeof s.name === 'string')
    .map((store) => {
      const dodxFallback = `${SITE_HOME_URL}/deals?store=${encodeURIComponent(store.id)}`;
      const dodxPageUrl = sanitizeHttpsUrl(store.dodxPageUrl, dodxFallback);
      const storeUrl = sanitizeHttpsUrl(store.affiliateUrl, dodxPageUrl);
      const offers = Array.isArray(store.offers)
        ? store.offers
            .filter((o) => o && typeof o === 'object' && typeof o.title === 'string')
            .slice(0, 1000)
            .map((offer) => {
              const fallbackImage = sanitizeLocalImage(offer.fallbackImage, 'images/featured-deals.jpg');
              return {
                id: typeof offer.id === 'string' ? offer.id.slice(0, 80) : `${store.id}-offer`,
                title: offer.title.slice(0, 180),
                titleAr: typeof offer.titleAr === 'string' ? offer.titleAr.slice(0, 180) : '',
                categoryId: typeof offer.categoryId === 'string' ? offer.categoryId.slice(0, 40) : 'all',
                discountLabel:
                  typeof offer.discountLabel === 'string'
                    ? offer.discountLabel.slice(0, 40)
                    : 'Official Partner',
                discountLabelAr:
                  typeof offer.discountLabelAr === 'string' ? offer.discountLabelAr.slice(0, 40) : '',
                price: typeof offer.price === 'string' ? offer.price.slice(0, 60) : '',
                oldPrice: typeof offer.oldPrice === 'string' ? offer.oldPrice.slice(0, 40) : '',
                numericPrice: typeof offer.numericPrice === 'number' ? offer.numericPrice : 0,
                imageUrl: sanitizeImageSource(offer.imageUrl, fallbackImage),
                fallbackImage,
                affiliateUrl: sanitizeHttpsUrl(offer.affiliateUrl, storeUrl),
                dodxPageUrl: sanitizeHttpsUrl(offer.dodxPageUrl, dodxPageUrl),
                featured: Boolean(offer.featured)
              };
            })
        : [];

      return {
        id: store.id.slice(0, 60),
        groupId: typeof store.groupId === 'string' ? store.groupId.slice(0, 40) : store.id,
        groupName: typeof store.groupName === 'string' ? store.groupName.slice(0, 60) : store.name,
        groupNameAr: typeof store.groupNameAr === 'string' ? store.groupNameAr.slice(0, 60) : store.name,
        name: store.name.slice(0, 80),
        nameAr: typeof store.nameAr === 'string' ? store.nameAr.slice(0, 80) : store.name,
        flag: typeof store.flag === 'string' ? store.flag.slice(0, 12) : '',
        currencySymbol: typeof store.currencySymbol === 'string' ? store.currencySymbol.slice(0, 10) : '$',
        currencyCode: typeof store.currencyCode === 'string' ? store.currencyCode.slice(0, 10) : 'USD',
        domain: typeof store.domain === 'string' ? store.domain.slice(0, 100) : '',
        matchDomains: Array.isArray(store.matchDomains)
          ? store.matchDomains.filter((d) => typeof d === 'string').slice(0, 20)
          : [],
        category: typeof store.category === 'string' ? store.category.slice(0, 80) : 'Partner Store',
        comingSoon: Boolean(store.comingSoon),
        keywords: typeof store.keywords === 'string' ? store.keywords.slice(0, 240) : '',
        badgeColor: sanitizeColor(store.badgeColor),
        dodxPageUrl,
        affiliateUrl: storeUrl,
        offers
      };
    });

  if (stores.length === 0) return null;

  const featuredProducts = Array.isArray(rawPayload.featuredProducts)
    ? rawPayload.featuredProducts
        .filter((p) => p && typeof p === 'object' && typeof p.title === 'string')
        .slice(0, 2000)
        .map((product, index) => {
          const fallbackImage = sanitizeLocalImage(product.fallbackImage, 'images/featured-deals.jpg');
          return {
            id: typeof product.id === 'string' ? product.id.slice(0, 80) : `prod-${index}`,
            storeId: typeof product.storeId === 'string' ? product.storeId.slice(0, 60) : 'amazon',
            storeName: typeof product.storeName === 'string' ? product.storeName.slice(0, 60) : 'Partner',
            storeNameAr: typeof product.storeNameAr === 'string' ? product.storeNameAr.slice(0, 60) : '',
            categoryId: typeof product.categoryId === 'string' ? product.categoryId.slice(0, 40) : 'all',
            category: typeof product.category === 'string' ? product.category.slice(0, 50) : 'Featured',
            title: product.title.slice(0, 140),
            titleAr: typeof product.titleAr === 'string' ? product.titleAr.slice(0, 140) : '',
            brand: typeof product.brand === 'string' ? product.brand.slice(0, 50) : '',
            badge: typeof product.badge === 'string' ? product.badge.slice(0, 30) : 'Featured',
            badgeAr: typeof product.badgeAr === 'string' ? product.badgeAr.slice(0, 30) : '',
            badgeColor: sanitizeColor(product.badgeColor),
            price: typeof product.price === 'string' ? product.price.slice(0, 60) : '',
            oldPrice: typeof product.oldPrice === 'string' ? product.oldPrice.slice(0, 40) : '',
            numericPrice: typeof product.numericPrice === 'number' ? product.numericPrice : 0,
            discountPercent: typeof product.discountPercent === 'number' ? product.discountPercent : 0,
            imageUrl: sanitizeImageSource(product.imageUrl, fallbackImage),
            fallbackImage,
            keywords: typeof product.keywords === 'string' ? product.keywords.slice(0, 280) : '',
            affiliateUrl: sanitizeHttpsUrl(product.affiliateUrl, SITE_HOME_URL),
            dodxPageUrl: sanitizeHttpsUrl(product.dodxPageUrl, SITE_PRODUCTS_URL),
            isFlashDeal: Boolean(product.isFlashDeal)
          };
        })
    : [];

  const coupons = Array.isArray(rawPayload.coupons)
    ? rawPayload.coupons
        .filter((c) => c && typeof c === 'object' && typeof c.title === 'string')
        .slice(0, 60)
        .map((coupon, index) => {
          const fallbackImage = sanitizeLocalImage(coupon.fallbackImage, 'images/featured-deals.jpg');
          return {
            id: typeof coupon.id === 'string' ? coupon.id.slice(0, 80) : `cpn-${index}`,
            storeId: typeof coupon.storeId === 'string' ? coupon.storeId.slice(0, 60) : 'amazon',
            storeName: typeof coupon.storeName === 'string' ? coupon.storeName.slice(0, 80) : 'Dodx Partner',
            storeNameAr: typeof coupon.storeNameAr === 'string' ? coupon.storeNameAr.slice(0, 80) : '',
            type: typeof coupon.type === 'string' ? coupon.type.slice(0, 20) : 'portal',
            title: coupon.title.slice(0, 160),
            titleAr: typeof coupon.titleAr === 'string' ? coupon.titleAr.slice(0, 160) : '',
            description: typeof coupon.description === 'string' ? coupon.description.slice(0, 220) : '',
            descriptionAr: typeof coupon.descriptionAr === 'string' ? coupon.descriptionAr.slice(0, 220) : '',
            code: typeof coupon.code === 'string' ? coupon.code.slice(0, 40) : null,
            badge: typeof coupon.badge === 'string' ? coupon.badge.slice(0, 40) : 'DEAL',
            badgeAr: typeof coupon.badgeAr === 'string' ? coupon.badgeAr.slice(0, 40) : '',
            imageUrl: sanitizeImageSource(coupon.imageUrl, fallbackImage),
            fallbackImage,
            affiliateUrl: sanitizeHttpsUrl(coupon.affiliateUrl, SITE_COUPONS_URL),
            dodxPageUrl: sanitizeHttpsUrl(coupon.dodxPageUrl, SITE_COUPONS_URL)
          };
        })
    : [];

  const storeGroups = Array.isArray(rawPayload.storeGroups) ? rawPayload.storeGroups : OFFLINE_DIRECTORY_FALLBACK.storeGroups;
  const categories = Array.isArray(rawPayload.categories) ? rawPayload.categories : OFFLINE_DIRECTORY_FALLBACK.categories;

  return {
    version: typeof rawPayload.version === 'string' ? rawPayload.version : '3.1.0',
    updatedAt: typeof rawPayload.updatedAt === 'string' ? rawPayload.updatedAt : null,
    siteUrl: sanitizeHttpsUrl(rawPayload.siteUrl, SITE_HOME_URL),
    productsUrl: sanitizeHttpsUrl(rawPayload.productsUrl, SITE_PRODUCTS_URL),
    couponsUrl: sanitizeHttpsUrl(rawPayload.couponsUrl, SITE_COUPONS_URL),
    disclosure:
      typeof rawPayload.disclosure === 'string'
        ? rawPayload.disclosure.slice(0, 220)
        : 'As an affiliate, dodx.shop may earn a commission from qualifying purchases at no extra cost to you.',
    isOfflineFallback: false,
    storeGroups,
    categories,
    featuredProducts,
    coupons,
    stores
  };
}

function normalizeHostname(hostname) {
  return (hostname || '').toLowerCase().replace(/^www\./, '').trim();
}

function findMatchingStore(stores, rawHostname) {
  const host = normalizeHostname(rawHostname);
  if (!host || !Array.isArray(stores)) return null;

  return (
    stores.find((store) => {
      const candidates =
        Array.isArray(store.matchDomains) && store.matchDomains.length > 0
          ? store.matchDomains
          : [store.domain];

      return candidates.some((candidate) => {
        const cleanCandidate = normalizeHostname(candidate);
        return cleanCandidate && (host === cleanCandidate || host.endsWith('.' + cleanCandidate));
      });
    }) || null
  );
}

async function readCacheEntry() {
  try {
    const result = await chrome.storage.local.get(CACHE_STORAGE_KEY);
    const entry = result[CACHE_STORAGE_KEY];
    if (entry && entry.payload && Array.isArray(entry.payload.stores)) {
      return entry;
    }
  } catch {
    // Ignore storage read errors
  }
  return null;
}

async function writeCacheEntry(payload) {
  const entry = {
    timestamp: Date.now(),
    payload
  };
  try {
    await chrome.storage.local.set({ [CACHE_STORAGE_KEY]: entry });
  } catch {
    // Ignore storage write errors
  }
  return entry;
}

async function fetchAndCacheOffers() {
  let lastError = null;
  for (const endpoint of OFFERS_API_ENDPOINTS) {
    try {
      const response = await fetch(endpoint, {
        method: 'GET',
        cache: 'no-store',
        headers: { Accept: 'application/json' }
      });

      if (!response.ok) {
        lastError = new Error(`HTTP ${response.status}`);
        continue;
      }

      const rawJson = await response.json();
      const sanitized = sanitizePayload(rawJson);
      if (!sanitized) {
        lastError = new Error('Invalid offers JSON schema');
        continue;
      }

      await writeCacheEntry(sanitized);
      return { payload: sanitized, cachedAt: Date.now(), fromCache: false };
    } catch (err) {
      lastError = err;
    }
  }

  throw lastError || new Error('Unable to fetch offers');
}

async function getOffersData(forceRefresh = false) {
  const cached = await readCacheEntry();

  if (!forceRefresh && cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
    return {
      payload: cached.payload,
      cachedAt: cached.timestamp,
      fromCache: true
    };
  }

  try {
    return await fetchAndCacheOffers();
  } catch {
    if (cached && cached.payload) {
      return {
        payload: { ...cached.payload, isStaleCache: true },
        cachedAt: cached.timestamp,
        fromCache: true
      };
    }

    return {
      payload: OFFLINE_DIRECTORY_FALLBACK,
      cachedAt: null,
      fromCache: false
    };
  }
}

async function ensureRefreshAlarm() {
  try {
    const existing = await chrome.alarms.get(REFRESH_ALARM_NAME);
    if (!existing) {
      chrome.alarms.create(REFRESH_ALARM_NAME, {
        delayInMinutes: REFRESH_PERIOD_MINUTES,
        periodInMinutes: REFRESH_PERIOD_MINUTES
      });
    }
  } catch {
    // Ignore alarm registration errors
  }
}

chrome.runtime.onInstalled.addListener(() => {
  ensureRefreshAlarm();
  getOffersData(true).catch(() => {});
});

chrome.runtime.onStartup.addListener(() => {
  ensureRefreshAlarm();
  getOffersData(false).catch(() => {});
});

chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm && alarm.name === REFRESH_ALARM_NAME) {
    getOffersData(true).catch(() => {});
  }
});

chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (!message || typeof message !== 'object') return false;

  if (message.type === 'GET_OFFERS' || message.type === 'FORCE_REFRESH_OFFERS') {
    const forceRefresh = message.type === 'FORCE_REFRESH_OFFERS';
    (async () => {
      const { payload, cachedAt, fromCache } = await getOffersData(forceRefresh);
      const matchedStore = message.hostname
        ? findMatchingStore(payload.stores, message.hostname)
        : null;

      sendResponse({
        payload,
        matchedStore,
        cachedAt,
        fromCache
      });
    })();
    return true;
  }

  return false;
});
