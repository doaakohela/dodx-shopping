'use strict';

const OFFERS_API_ENDPOINTS = [
  'https://www.dodx.shop/api/offers.json',
  'https://dodx.shop/api/offers.json'
];
const SITE_HOME_URL = 'https://www.dodx.shop';
const SITE_PRODUCTS_URL = 'https://www.dodx.shop/products';
const CACHE_STORAGE_KEY = 'dodx_offers_cache_v5';
const REFRESH_ALARM_NAME = 'dodx_refresh_offers';
const CACHE_TTL_MS = 2 * 60 * 60 * 1000; // Auto-sync every 2 hours
const REFRESH_PERIOD_MINUTES = 120; // 2 hours

const OFFLINE_DIRECTORY_FALLBACK = {
  version: 'offline',
  updatedAt: null,
  siteUrl: SITE_HOME_URL,
  productsUrl: SITE_PRODUCTS_URL,
  disclosure:
    'As an affiliate, dodx.shop may earn a commission from qualifying purchases at no extra cost to you.',
  isOfflineFallback: true,
  featuredProducts: [
    {
      id: 'offline-prod-amazon-eg',
      storeId: 'amazon-eg',
      storeName: 'Amazon Egypt',
      title: 'Sokany SK-100A Single Electric Burner Hot Plate (1000W) — 639.00 EGP (22% Off)',
      category: 'Amazon Egypt Deals',
      badge: '22% OFF · 639 EGP',
      badgeColor: '#CC0C39',
      price: '639.00 EGP',
      oldPrice: '819.00 EGP',
      imageUrl: 'images/home-kitchen.jpg',
      fallbackImage: 'images/home-kitchen.jpg',
      keywords: 'amazon egypt sokany امازون مصر الكترونيات شاشات موبايل لابتوب',
      affiliateUrl: 'https://link.amazon/B09i8b797',
      dodxPageUrl: 'https://www.dodx.shop/deals?store=amazon-eg'
    },
    {
      id: 'offline-prod-honor',
      storeId: 'honor-uae',
      storeName: 'HONOR UAE',
      title: 'HONOR Magic & X-Series 5G Smartphones',
      category: 'Smartphones',
      badge: 'Official UAE',
      badgeColor: '#00453E',
      imageUrl: 'images/smartphones-audio.jpg',
      fallbackImage: 'images/smartphones-audio.jpg',
      keywords: 'honor هونر هواتف موبايل',
      affiliateUrl: 'https://www.dodx.shop/products?dept=tech',
      dodxPageUrl: 'https://www.dodx.shop/products?dept=tech'
    },
    {
      id: 'offline-prod-laptops',
      storeId: 'amazon',
      storeName: 'Amazon',
      title: 'Laptops, MacBook & Pro Electronics',
      category: 'Computers & Tech',
      badge: 'Electronics',
      badgeColor: '#FF9900',
      imageUrl: 'images/electronics-tech.jpg',
      fallbackImage: 'images/electronics-tech.jpg',
      keywords: 'amazon laptop macbook لابتوب امازون',
      affiliateUrl: 'https://www.dodx.shop/deals?store=amazon',
      dodxPageUrl: 'https://www.dodx.shop/products?dept=tech'
    },
    {
      id: 'offline-prod-ali',
      storeId: 'aliexpress',
      storeName: 'AliExpress',
      title: 'Wireless Earbuds & Tech Accessories',
      category: 'Audio & Gadgets',
      badge: 'Global Store',
      badgeColor: '#E62E04',
      imageUrl: 'images/accessories-bags.jpg',
      fallbackImage: 'images/accessories-bags.jpg',
      keywords: 'aliexpress سماعات اكسسوارات علي اكسبريس',
      affiliateUrl: 'https://www.dodx.shop/deals?store=aliexpress',
      dodxPageUrl: 'https://www.dodx.shop/deals?store=aliexpress'
    },
    {
      id: 'offline-prod-alib',
      storeId: 'alibaba',
      storeName: 'Alibaba',
      title: 'Direct Factory Wholesale & Business Tech',
      category: 'Wholesale Direct',
      badge: 'Wholesale',
      badgeColor: '#FF6A00',
      imageUrl: 'images/laptops-deals.jpg',
      fallbackImage: 'images/laptops-deals.jpg',
      keywords: 'alibaba جملة مصانع علي بابا',
      affiliateUrl: 'https://www.dodx.shop/deals?store=alibaba',
      dodxPageUrl: 'https://www.dodx.shop/deals?store=alibaba'
    }
  ],
  stores: [
    {
      id: 'amazon-eg',
      name: 'Amazon Egypt',
      domain: 'amazon.eg',
      matchDomains: ['amazon.eg', 'www.amazon.eg'],
      category: 'Egypt Marketplace',
      keywords: 'amazon egypt amazon.eg امازون مصر أمازون مصر شاشات موبايل لابتوب تابلت',
      badgeColor: '#FF9900',
      dodxPageUrl: 'https://www.dodx.shop/deals?store=amazon-eg',
      affiliateUrl: 'https://link.amazon/B09i8b797',
      offers: [
        {
          id: 'offline-amz-eg-wf',
          title: 'Amazon Egypt White Friday Electronics — TVs, Mobiles, Laptops & Tablets (Up to 26% Off)',
          discountLabel: 'Up to 26% OFF',
          price: '8,299 – 69,900 EGP',
          imageUrl: 'images/electronics-tech.jpg',
          fallbackImage: 'images/electronics-tech.jpg',
          affiliateUrl: 'https://link.amazon/B09i8b797',
          featured: true
        }
      ]
    },
    {
      id: 'amazon',
      name: 'Amazon',
      domain: 'amazon.com',
      matchDomains: ['amazon.com', 'amazon.ae', 'amazon.sa', 'amazon.co.uk'],
      category: 'Global Marketplace',
      keywords: 'amazon امازون أمازون electronics tech deals',
      badgeColor: '#FF9900',
      dodxPageUrl: 'https://www.dodx.shop/deals?store=amazon',
      affiliateUrl: 'https://www.dodx.shop/deals?store=amazon',
      offers: [
        {
          id: 'offline-amz',
          title: 'Open Amazon Deals & Partner Storefront on dodx.shop',
          discountLabel: 'Amazon Partner',
          imageUrl: 'images/featured-deals.jpg',
          fallbackImage: 'images/featured-deals.jpg',
          affiliateUrl: 'https://www.dodx.shop/deals?store=amazon',
          featured: true
        }
      ]
    },
    {
      id: 'honor-uae',
      name: 'HONOR UAE',
      domain: 'honor.com',
      matchDomains: ['honor.com', 'hihonor.com'],
      category: 'Smartphones & Tech',
      keywords: 'honor هونر هواتف موبايل magicbook',
      badgeColor: '#00453E',
      dodxPageUrl: 'https://www.dodx.shop/products?dept=tech',
      affiliateUrl: 'https://www.dodx.shop/products?dept=tech',
      offers: [
        {
          id: 'offline-honor',
          title: 'Open Official HONOR UAE Smartphones & Tech on dodx.shop',
          discountLabel: 'Official Store',
          imageUrl: 'images/smartphones-audio.jpg',
          fallbackImage: 'images/smartphones-audio.jpg',
          affiliateUrl: 'https://www.dodx.shop/products?dept=tech',
          featured: true
        }
      ]
    },
    {
      id: 'aliexpress',
      name: 'AliExpress',
      domain: 'aliexpress.com',
      matchDomains: ['aliexpress.com', 'm.aliexpress.com'],
      category: 'Global Shopping',
      keywords: 'aliexpress علي اكسبريس على اكسبريس',
      badgeColor: '#E62E04',
      dodxPageUrl: 'https://www.dodx.shop/deals?store=aliexpress',
      affiliateUrl: 'https://www.dodx.shop/deals?store=aliexpress',
      offers: [
        {
          id: 'offline-ali',
          title: 'Open AliExpress Global Shopping Links on dodx.shop',
          discountLabel: 'Global Store',
          imageUrl: 'images/accessories-bags.jpg',
          fallbackImage: 'images/accessories-bags.jpg',
          affiliateUrl: 'https://www.dodx.shop/deals?store=aliexpress',
          featured: true
        }
      ]
    },
    {
      id: 'alibaba',
      name: 'Alibaba',
      domain: 'alibaba.com',
      matchDomains: ['alibaba.com', 'm.alibaba.com'],
      category: 'Wholesale & Direct Suppliers',
      keywords: 'alibaba علي بابا على بابا جملة',
      badgeColor: '#FF6A00',
      dodxPageUrl: 'https://www.dodx.shop/deals?store=alibaba',
      affiliateUrl: 'https://www.dodx.shop/deals?store=alibaba',
      offers: [
        {
          id: 'offline-alib',
          title: 'Open Alibaba Wholesale & Suppliers on dodx.shop',
          discountLabel: 'Wholesale',
          imageUrl: 'images/laptops-deals.jpg',
          fallbackImage: 'images/laptops-deals.jpg',
          affiliateUrl: 'https://www.dodx.shop/deals?store=alibaba',
          featured: true
        }
      ]
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
      // Check if local bundled asset
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
      const storeUrl = sanitizeHttpsUrl(store.affiliateUrl, SITE_HOME_URL);
      const dodxFallback = `${SITE_HOME_URL}/deals?store=${encodeURIComponent(store.id)}`;
      const dodxPageUrl = sanitizeHttpsUrl(store.dodxPageUrl, dodxFallback);
      const offers = Array.isArray(store.offers)
        ? store.offers
            .filter((o) => o && typeof o === 'object' && typeof o.title === 'string')
            .map((offer) => {
              const fallbackImage = sanitizeLocalImage(offer.fallbackImage, 'images/featured-deals.jpg');
              return {
                id: typeof offer.id === 'string' ? offer.id.slice(0, 60) : `${store.id}-offer`,
                title: offer.title.slice(0, 160),
                discountLabel:
                  typeof offer.discountLabel === 'string'
                    ? offer.discountLabel.slice(0, 40)
                    : 'Official Partner',
                price: typeof offer.price === 'string' ? offer.price.slice(0, 60) : '',
                oldPrice: typeof offer.oldPrice === 'string' ? offer.oldPrice.slice(0, 40) : '',
                imageUrl: sanitizeImageSource(offer.imageUrl, fallbackImage),
                fallbackImage,
                affiliateUrl: sanitizeHttpsUrl(offer.affiliateUrl, storeUrl),
                featured: Boolean(offer.featured)
              };
            })
        : [];

      return {
        id: store.id.slice(0, 60),
        name: store.name.slice(0, 80),
        domain: typeof store.domain === 'string' ? store.domain.slice(0, 100) : '',
        matchDomains: Array.isArray(store.matchDomains)
          ? store.matchDomains.filter((d) => typeof d === 'string').slice(0, 20)
          : [],
        category: typeof store.category === 'string' ? store.category.slice(0, 60) : 'Partner Store',
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
        .slice(0, 50)
        .map((product, index) => {
          const fallbackImage = sanitizeLocalImage(product.fallbackImage, 'images/featured-deals.jpg');
          return {
            id: typeof product.id === 'string' ? product.id.slice(0, 60) : `prod-${index}`,
            storeId: typeof product.storeId === 'string' ? product.storeId.slice(0, 60) : 'amazon',
            storeName: typeof product.storeName === 'string' ? product.storeName.slice(0, 60) : 'Partner',
            title: product.title.slice(0, 120),
            category: typeof product.category === 'string' ? product.category.slice(0, 50) : 'Featured',
            badge: typeof product.badge === 'string' ? product.badge.slice(0, 30) : 'Featured',
            badgeColor: sanitizeColor(product.badgeColor),
            price: typeof product.price === 'string' ? product.price.slice(0, 60) : '',
            oldPrice: typeof product.oldPrice === 'string' ? product.oldPrice.slice(0, 40) : '',
            imageUrl: sanitizeImageSource(product.imageUrl, fallbackImage),
            fallbackImage,
            keywords: typeof product.keywords === 'string' ? product.keywords.slice(0, 240) : '',
            affiliateUrl: sanitizeHttpsUrl(product.affiliateUrl, SITE_HOME_URL),
            dodxPageUrl: sanitizeHttpsUrl(product.dodxPageUrl, SITE_PRODUCTS_URL)
          };
        })
    : [];

  return {
    version: typeof rawPayload.version === 'string' ? rawPayload.version : '2.4.0',
    updatedAt: typeof rawPayload.updatedAt === 'string' ? rawPayload.updatedAt : null,
    siteUrl: sanitizeHttpsUrl(rawPayload.siteUrl, SITE_HOME_URL),
    productsUrl: sanitizeHttpsUrl(rawPayload.productsUrl, SITE_PRODUCTS_URL),
    disclosure:
      typeof rawPayload.disclosure === 'string'
        ? rawPayload.disclosure.slice(0, 220)
        : 'As an affiliate, dodx.shop may earn a commission from qualifying purchases at no extra cost to you.',
    isOfflineFallback: false,
    featuredProducts,
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
