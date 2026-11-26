import React, { useMemo, useRef, useState } from 'react';
import {
  ArrowDownWideNarrow,
  Car,
  ChevronLeft,
  ChevronRight,
  Chrome,
  Clock,
  ExternalLink,
  Flame,
  Search,
  Sparkles,
  Tag,
  Zap,
} from 'lucide-react';
import generalEvSedanImg from '../assets/images/side_new_ev_sedan_1795724505623.jpg';
import generalEvCrossoverImg from '../assets/images/side_new_ev_crossover_1795724506500.jpg';
import generalHybridSuvImg from '../assets/images/side_new_hybrid_suv_1795724507453.jpg';
import generalEvCoupeImg from '../assets/images/side_new_ev_coupe_1795724507612.jpg';
import {
  CATALOG_CATEGORIES,
  CatalogCategoryId,
  CATALOG_PRODUCTS,
  CatalogProduct,
  STORE_GROUPS,
} from '../data/unifiedCatalog';
import { LanguageCode, TranslationDict } from '../i18n/translations';
import { useFlashCountdown } from '../hooks/useFlashCountdown';
import {
  matchesMultilingualQuery,
  scoreMultilingualMatch,
} from '../utils/multilingualSearch';
import { ShareButton } from './ShareButton';
import { StoreLogo } from './StoreLogo';

const approxUsdPrice = (p: CatalogProduct): number => {
  if (p.storeId === 'amazon-eg') return p.numericPrice / 50;
  if (p.storeId === 'amazon-uae' || p.storeId === 'honor-uae' || p.storeId === 'huawei-ae' || p.storeId === 'canon-uae') {
    return p.numericPrice / 3.67;
  }
  if (p.storeId === 'amazon-jp') return p.numericPrice / 150;
  if (p.storeId === 'amazon-pl') return p.numericPrice / 4.0;
  if (p.storeId === 'lenovo-india') return p.numericPrice / 84;
  return p.numericPrice;
};

/**
 * Interleave products round-robin across store branches and categories
 * so every branch (US, Egypt, UAE, Japan, etc.) & category shines cleanly.
 */
const diversifyAcrossBranchesAndCategories = (
  sortedPool: CatalogProduct[],
  limit: number
): CatalogProduct[] => {
  const byStore = new Map<string, CatalogProduct[]>();
  for (const item of sortedPool) {
    const bucket = byStore.get(item.storeId) ?? [];
    bucket.push(item);
    byStore.set(item.storeId, bucket);
  }
  const storeKeys = Array.from(byStore.keys());
  const picked: CatalogProduct[] = [];
  const usedIds = new Set<string>();
  const categoryUsage = new Map<string, number>();

  // Pick highest-priority item per store round-robin while maximizing distinct categories
  while (picked.length < limit && storeKeys.length > 0) {
    let addedInRound = false;
    for (const storeId of storeKeys) {
      const bucket = byStore.get(storeId);
      if (!bucket || bucket.length === 0) continue;
      // Prefer least-represented category first from top candidates of this store
      let bestIdx = 0;
      let minCatCount = Infinity;
      const scanWindow = Math.min(bucket.length, 6);
      for (let i = 0; i < scanWindow; i++) {
        const count = categoryUsage.get(bucket[i].categoryId) ?? 0;
        if (count < minCatCount) {
          minCatCount = count;
          bestIdx = i;
        }
      }
      const chosen = bucket.splice(bestIdx, 1)[0];
      if (!usedIds.has(chosen.id)) {
        usedIds.add(chosen.id);
        picked.push(chosen);
        categoryUsage.set(chosen.categoryId, (categoryUsage.get(chosen.categoryId) ?? 0) + 1);
        addedInRound = true;
        if (picked.length >= limit) break;
      }
    }
    if (!addedInRound) break;
  }
  return picked;
};

const HIGH_DEMAND_TIER1_BRANDS = new Set([
  'apple',
  'samsung',
  'google',
  'amazon',
  'beats',
  'roborock',
  'tineco',
  'ninja',
  'breville',
  'anker',
  'hp',
  'asus',
  'acer',
  'lenovo',
  'canon',
  'hisense',
  'roku',
  'roku tv',
  'insignia',
  'motorola',
  'nothing',
  'tp-link tapo',
  'bulova',
  'stanley',
  'ugg',
  'belkin',
  'oxo',
  'joseph joseph',
  "l'oreal paris",
]);

const HIGH_DEMAND_TIER2_BRANDS = new Set([
  'bella',
  'chefman',
  'fullstar',
  'songmics',
  'flexispot',
  'popsockets',
  'anne klein',
  'cocokind',
  'casabrews',
  'magcubic',
  'tagry',
  'sapphero',
  'cozy bliss',
  'bedsure',
  'steamclean',
  'airpure',
  'portable display',
]);

const EXCLUDED_HERO_KEYWORDS =
  /\b(shirt|t-shirt|jeans|boots|booties|jacket|coat|chino|trouser|sweater|hoodie|fleece|legging|slippers|safety glasses|l\.o\.l\. surprise)\b/i;

/**
 * Pick top-discounted, high-demand Amazon US products (excluding clothing/apparel)
 * round-robin across distinct categories & brands so the top "Biggest Discounts" hero
 * showcases popular best-sellers with massive savings and rich product variety.
 */
const selectDiverseTopUsDiscounts = (
  newestFirstPool: CatalogProduct[],
  limit: number
): CatalogProduct[] => {
  const byCategory = new Map<CatalogCategoryId, Array<{ p: CatalogProduct; score: number }>>();

  newestFirstPool.forEach((p, idx) => {
    if (p.storeId !== 'amazon' || p.discountPercent <= 0) return;
    if (p.categoryId === 'men-fashion' || p.categoryId === 'women-fashion') return;
    if (EXCLUDED_HERO_KEYWORDS.test(p.titleEn)) return;

    const brandKey = p.brand.trim().toLowerCase();
    const isTier1 = HIGH_DEMAND_TIER1_BRANDS.has(brandKey);
    const isTier2 = HIGH_DEMAND_TIER2_BRANDS.has(brandKey);
    // Skip very cheap obscure items (< $8) or low-discount unknown brands
    if (p.numericPrice < 8 && !isTier1) return;
    if (!isTier1 && !isTier2 && p.discountPercent < 35) return;

    const demandBoost = isTier1 ? 105 : isTier2 ? 45 : 0;
    const exactPriceBonus = p.price.startsWith('~') ? 0 : 8;
    const recencyTieBreaker = Math.max(0, 120 - idx) * 0.05;
    const score = p.discountPercent * 1.9 + demandBoost + exactPriceBonus + recencyTieBreaker;

    const bucket = byCategory.get(p.categoryId) ?? [];
    bucket.push({ p, score });
    byCategory.set(p.categoryId, bucket);
  });

  for (const [, bucket] of byCategory.entries()) {
    bucket.sort((a, b) => b.score - a.score);
  }

  // Order category queues so flagship categories & strongest combined scores lead immediately
  const categoryQueues = Array.from(byCategory.entries())
    .sort(([, a], [, b]) => (b[0]?.score ?? 0) - (a[0]?.score ?? 0))
    .map(([, bucket]) => bucket.map((entry) => entry.p));

  const picked: CatalogProduct[] = [];
  const usedIds = new Set<string>();
  const globalBrandCounts = new Map<string, number>();

  while (picked.length < limit) {
    let addedInRound = false;
    for (const bucket of categoryQueues) {
      if (bucket.length === 0) continue;

      // Prefer a brand not yet seen in the strip (or used at most once across the strip)
      let pickIdx = bucket.findIndex(
        (item) => !usedIds.has(item.id) && (globalBrandCounts.get(item.brand.trim().toLowerCase()) ?? 0) === 0
      );
      if (pickIdx === -1) {
        pickIdx = bucket.findIndex(
          (item) => !usedIds.has(item.id) && (globalBrandCounts.get(item.brand.trim().toLowerCase()) ?? 0) < 2
        );
      }
      if (pickIdx === -1) {
        pickIdx = bucket.findIndex((item) => !usedIds.has(item.id));
      }
      if (pickIdx === -1) continue;

      const [chosen] = bucket.splice(pickIdx, 1);
      usedIds.add(chosen.id);
      const bKey = chosen.brand.trim().toLowerCase();
      globalBrandCounts.set(bKey, (globalBrandCounts.get(bKey) ?? 0) + 1);
      picked.push(chosen);
      addedInRound = true;
      if (picked.length >= limit) break;
    }
    if (!addedInRound) break;
  }

  return picked;
};

interface HomeViewProps {
  lang: LanguageCode;
  searchQuery: string;
  searchStoreFilter: string;
  activeCategory: CatalogCategoryId;
  t: TranslationDict;
  onSelectCategory: (categoryId: CatalogCategoryId) => void;
  onSelectStore: (storeId: string) => void;
  onNavigateCoupons: () => void;
  onNavigateProducts: (deptId?: string) => void;
  onOpenProduct: (productId: string) => void;
  onOpenInstallModal: () => void;
  onClearSearch: () => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  lang,
  searchQuery,
  searchStoreFilter,
  activeCategory,
  t,
  onSelectCategory,
  onSelectStore,
  onNavigateCoupons,
  onNavigateProducts,
  onOpenProduct,
  onOpenInstallModal,
  onClearSearch,
}) => {
  const isAr = lang === 'ar';
  const heroScrollRef = useRef<HTMLDivElement | null>(null);
  const newBestScrollRef = useRef<HTMLDivElement | null>(null);
  const [newDealStoreTab, setNewDealStoreTab] = useState<string>('all');
  const [newDealSortMode, setNewDealSortMode] = useState<'cheapest' | 'discount'>('discount');
  const [activeVehicleIdx, setActiveVehicleIdx] = useState<number>(0);
  const [failedVehicleImgs, setFailedVehicleImgs] = useState<Record<number, boolean>>({});
  const countdown = useFlashCountdown();

  const vehicleSlides = useMemo(
    () => [
      {
        image: generalEvSedanImg,
        ...(t.vehiclesShowcase[0] ?? {
          label: 'Electric Sedan',
          title: 'Modern All-Electric Sedan',
          spec: '100% Electric · Long-Range Battery · Fast Charging',
        }),
      },
      {
        image: generalEvCrossoverImg,
        ...(t.vehiclesShowcase[1] ?? {
          label: 'Electric Crossover',
          title: 'All-Electric Crossover SUV',
          spec: 'All-Electric SUV · 800V Ultra-Fast Charging · Smart Safety',
        }),
      },
      {
        image: generalHybridSuvImg,
        ...(t.vehiclesShowcase[2] ?? {
          label: 'Hybrid Family SUV',
          title: 'Modern Hybrid & Family SUV',
          spec: 'Plug-In Hybrid / AWD · Spacious 3-Row Interior · Panoramic Roof',
        }),
      },
      {
        image: generalEvCoupeImg,
        ...(t.vehiclesShowcase[3] ?? {
          label: 'Electric Sport Coupé',
          title: 'Executive Electric Gran Coupé',
          spec: '100% Electric · Dual-Motor AWD · Executive Comfort',
        }),
      },
    ],
    [t.vehiclesShowcase]
  );

  const activeVehicle = vehicleSlides[activeVehicleIdx] ?? vehicleSlides[0];

  const handleStepVehicle = (delta: number) => {
    setActiveVehicleIdx((prev) => (prev + delta + vehicleSlides.length) % vehicleSlides.length);
  };

  const rawQuery = searchQuery.trim();
  const isFilteredView = rawQuery.length > 0 || activeCategory !== 'all' || searchStoreFilter !== 'all';

  const newestFirstCatalog = useMemo(() => [...CATALOG_PRODUCTS].reverse(), []);

  // Top Hero Showcase: Amazon US biggest verified discounts diversified across all product categories
  const flashDeals = useMemo(
    () => selectDiverseTopUsDiscounts(newestFirstCatalog, 22),
    [newestFirstCatalog]
  );

  // Active store branches for the Best & Cheapest New Products switcher
  const activeBranchTabs = useMemo(() => {
    const countByStore = new Map<string, number>();
    for (const p of CATALOG_PRODUCTS) {
      countByStore.set(p.storeId, (countByStore.get(p.storeId) ?? 0) + 1);
    }
    const tabs: Array<{ id: string; labelEn: string; labelAr: string; flag: string; count: number }> = [];
    for (const group of STORE_GROUPS) {
      for (const b of group.branches) {
        const c = countByStore.get(b.id) ?? 0;
        if (c > 0) {
          tabs.push({
            id: b.id,
            labelEn: b.nameEn.split(' (')[0],
            labelAr: b.nameAr.split(' (')[0],
            flag: b.flag,
            count: c,
          });
        }
      }
    }
    return tabs;
  }, []);

  // Curated Best & Cheapest New Products across ALL store branches & categories
  const bestAndCheapestNewDeals = useMemo(() => {
    const pool =
      newDealStoreTab === 'all'
        ? newestFirstCatalog
        : newestFirstCatalog.filter((p) => p.storeId === newDealStoreTab);

    if (newDealSortMode === 'cheapest') {
      // Balance recency + low USD-equivalent price, then diversify across branches & categories when "All" selected
      const cheapestScored = pool
        .map((p, idx) => {
          const usd = approxUsdPrice(p);
          const recencyPenalty = idx * 0.08;
          const discountBonus = p.discountPercent * 0.35;
          return { p, costRank: usd - discountBonus + recencyPenalty };
        })
        .sort((a, b) => a.costRank - b.costRank)
        .map((x) => x.p);
      return newDealStoreTab === 'all'
        ? diversifyAcrossBranchesAndCategories(cheapestScored, 24)
        : cheapestScored.slice(0, 24);
    }

    const bestDiscounted = [...pool].sort((a, b) => {
      if (b.discountPercent !== a.discountPercent) return b.discountPercent - a.discountPercent;
      return approxUsdPrice(a) - approxUsdPrice(b);
    });
    return newDealStoreTab === 'all'
      ? diversifyAcrossBranchesAndCategories(bestDiscounted, 24)
      : bestDiscounted.slice(0, 24);
  }, [newestFirstCatalog, newDealStoreTab, newDealSortMode]);

  // Search + Category + Store Filter results (newest added products first by default)
  const filteredResults = useMemo(() => {
    if (!isFilteredView) return [];

    let list = newestFirstCatalog;

    if (activeCategory !== 'all') {
      list = list.filter((p) => p.categoryId === activeCategory);
    }

    if (searchStoreFilter !== 'all') {
      const matchedGroup = STORE_GROUPS.find((g) => g.id === searchStoreFilter);
      if (matchedGroup) {
        const branchIds = new Set(matchedGroup.branches.map((b) => b.id));
        list = list.filter((p) => branchIds.has(p.storeId));
      } else {
        list = list.filter((p) => p.storeId === searchStoreFilter);
      }
    }

    if (!rawQuery) return list;

    return list
      .map((product) => {
        const haystack = [
          product.titleEn,
          product.titleAr,
          product.brand,
          product.specsEn,
          product.specsAr,
          product.storeNameEn,
          product.storeNameAr,
          product.categoryId,
        ].join(' ');
        const primaryText = `${product.titleEn} ${product.titleAr} ${product.brand}`;
        return {
          product,
          matched: matchesMultilingualQuery(haystack, rawQuery),
          score: scoreMultilingualMatch(primaryText, rawQuery) * 2 + scoreMultilingualMatch(haystack, rawQuery),
        };
      })
      .filter((entry) => entry.matched)
      .sort((a, b) => b.score - a.score)
      .map((entry) => entry.product);
  }, [isFilteredView, newestFirstCatalog, activeCategory, searchStoreFilter, rawQuery]);

  // Categories for Shelf Rows on Home
  const shelfCategories = useMemo(
    () => CATALOG_CATEGORIES.filter((c) => c.id !== 'all'),
    []
  );

  const selectedCategoryMeta = useMemo(
    () => CATALOG_CATEGORIES.find((c) => c.id === activeCategory),
    [activeCategory]
  );

  const scrollHero = (dir: 'left' | 'right') => {
    if (!heroScrollRef.current) return;
    heroScrollRef.current.scrollBy({
      left: dir === 'left' ? -360 : 360,
      behavior: 'smooth',
    });
  };

  const scrollNewBest = (dir: 'left' | 'right') => {
    if (!newBestScrollRef.current) return;
    newBestScrollRef.current.scrollBy({
      left: dir === 'left' ? -360 : 360,
      behavior: 'smooth',
    });
  };

  return (
    <div className="bg-[#EAEDED] min-h-screen pb-10">
      <div className="max-w-[1440px] mx-auto px-3 sm:px-5 pt-4 space-y-6">
        {/* First Section: Upcoming Latest Vehicles Showroom Banner */}
        <section
          aria-labelledby="vehicles-upcoming-heading"
          className="rounded-xl overflow-hidden border border-[#24344D] bg-gradient-to-br from-[#0B1220] via-[#111B2E] to-[#18263E] text-white shadow-sm"
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch">
            {/* Editorial Copy & Electric Vehicle Selector */}
            <div className="lg:col-span-5 p-5 sm:p-7 flex flex-col justify-between gap-6 border-b lg:border-b-0 lg:border-e border-white/10">
              <div>
                <p className="inline-flex items-center gap-1.5 text-xs font-semibold tracking-wide text-[#FDE68A]">
                  <Zap className="w-3.5 h-3.5 text-[#FFD814] shrink-0" />
                  <span>{t.vehiclesBannerKicker}</span>
                </p>
                <h1
                  id="vehicles-upcoming-heading"
                  className="mt-2 font-display font-extrabold tracking-tight text-white leading-[1.15]"
                  style={{ fontSize: 'clamp(1.75rem, 3vw, 2.6rem)', textWrap: 'balance' }}
                >
                  {t.vehiclesBannerTitle}
                </h1>
                <p className="mt-3 text-sm text-slate-200 leading-relaxed max-w-xl">
                  {t.vehiclesBannerSub}
                </p>

                {/* Interactive Electric Vehicle Type Switcher */}
                <div
                  role="tablist"
                  aria-label={t.vehiclesBannerTitle}
                  className="mt-5 flex flex-wrap items-center gap-1.5"
                >
                  {vehicleSlides.map((vehicle, idx) => {
                    const isActive = idx === activeVehicleIdx;
                    return (
                      <button
                        key={vehicle.label}
                        type="button"
                        role="tab"
                        aria-selected={isActive}
                        onClick={() => setActiveVehicleIdx(idx)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap shrink-0 cursor-pointer transition-colors border ${
                          isActive
                            ? 'bg-[#FFD814] text-zinc-950 border-[#FFD814]'
                            : 'bg-white/10 text-slate-200 border-white/15 hover:bg-white/20 hover:text-white'
                        }`}
                      >
                        {vehicle.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="pt-3 flex flex-wrap items-center justify-between gap-3 border-t border-white/15">
                <button
                  type="button"
                  onClick={() => onSelectCategory('cars')}
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#FFD814] hover:bg-[#F7CA00] text-zinc-950 text-xs sm:text-sm font-extrabold rounded-lg cursor-pointer transition-colors whitespace-nowrap shrink-0"
                >
                  <Car className="w-4 h-4 shrink-0" />
                  <span>{t.vehiclesBannerCta}</span>
                </button>

                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => handleStepVehicle(-1)}
                    aria-label="Previous vehicle"
                    className="w-9 h-9 rounded-lg bg-white/10 hover:bg-white/20 border border-white/20 text-white flex items-center justify-center cursor-pointer transition-colors"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleStepVehicle(1)}
                    aria-label="Next vehicle"
                    className="w-9 h-9 rounded-lg bg-white/10 hover:bg-white/20 border border-white/20 text-white flex items-center justify-center cursor-pointer transition-colors"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Scenic Commercial Vehicle Photography Showcase + 4-Car Gallery Strip */}
            <div className="lg:col-span-7 p-4 sm:p-5 flex flex-col justify-between gap-3 bg-[#090E18]/65">
              <div className="relative w-full aspect-[16/9] rounded-lg overflow-hidden bg-[#0D1524] border border-white/15">
                {!failedVehicleImgs[activeVehicleIdx] ? (
                  <img
                    src={activeVehicle.image}
                    alt={activeVehicle.title}
                    loading="eager"
                    referrerPolicy="no-referrer"
                    onError={() =>
                      setFailedVehicleImgs((prev) => ({ ...prev, [activeVehicleIdx]: true }))
                    }
                    className="w-full h-full object-cover transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-[#0B1220] via-[#111B2E] to-[#18263E] flex flex-col items-center justify-center p-6 text-center">
                    <Car className="w-12 h-12 text-[#FFD814] mb-2" />
                    <p className="font-display text-base font-bold text-white">{activeVehicle.title}</p>
                  </div>
                )}
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/35 to-transparent p-4 sm:p-5">
                  <p className="font-display text-base sm:text-xl font-extrabold text-white tracking-tight">
                    {activeVehicle.title}
                  </p>
                  <p className="mt-1 text-xs sm:text-sm text-slate-200">
                    {activeVehicle.spec}
                  </p>
                </div>
              </div>

              {/* 4 Scenic Vehicles Gallery Strip */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3">
                {vehicleSlides.map((vehicle, idx) => {
                  const isActive = idx === activeVehicleIdx;
                  return (
                    <button
                      key={`thumb-${vehicle.label}`}
                      type="button"
                      onClick={() => setActiveVehicleIdx(idx)}
                      className={`group relative rounded-lg overflow-hidden border text-start cursor-pointer transition-all ${
                        isActive
                          ? 'border-[#FFD814] ring-1 ring-[#FFD814]/70'
                          : 'border-white/15 opacity-85 hover:opacity-100 hover:border-white/45'
                      }`}
                    >
                      <div className="aspect-[16/9] w-full bg-[#0D1524] overflow-hidden">
                        {!failedVehicleImgs[idx] ? (
                          <img
                            src={vehicle.image}
                            alt={vehicle.title}
                            loading="eager"
                            referrerPolicy="no-referrer"
                            onError={() =>
                              setFailedVehicleImgs((prev) => ({ ...prev, [idx]: true }))
                            }
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-[#0D1524]">
                            <Car className="w-5 h-5 text-[#FFD814]" />
                          </div>
                        )}
                      </div>
                      <div className="bg-[#0B1220]/95 px-2.5 py-1.5 border-t border-white/10">
                        <p className="text-[11px] font-bold text-white truncate">
                          {vehicle.label}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* Black Friday Animated GIF + Daily Updated Flash Deals Harmonized in GIF Orange */}
        <section
          aria-labelledby="flash-hero-heading"
          className="rounded-xl overflow-hidden shadow-sm border border-[#FF7E2E] bg-gradient-to-br from-[#FF5E00] via-[#FE6404] to-[#B83800] text-white"
        >
          <div className="px-4 sm:px-6 pt-4 pb-3 flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-white/20">
            <div>
              <div className="inline-flex items-center gap-2 bg-zinc-950 text-[#FFD814] px-2.5 py-1 rounded-xs text-[11px] font-extrabold uppercase tracking-wider shadow-xs">
                <Flame className="w-3.5 h-3.5 text-[#FE6404]" />
                <span>{t.bfBannerBadge}</span>
              </div>
              <h2
                id="flash-hero-heading"
                className="mt-1.5 font-display text-xl sm:text-3xl font-extrabold tracking-tight text-white"
              >
                {t.flashHeroTitle}
              </h2>
              <p className="mt-0.5 text-xs sm:text-sm text-orange-50">
                {t.bfBannerSub}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2.5 shrink-0">
              <div className="inline-flex items-center gap-2 bg-zinc-950/75 border border-[#FFD814]/70 px-3.5 py-2 rounded-lg">
                <Clock className="w-4 h-4 text-[#FFD814]" />
                <span className="text-xs font-bold text-orange-100">{t.endsIn}:</span>
                <span
                  className="font-mono text-base sm:text-lg font-extrabold text-[#FFD814] tracking-wider tabular-nums"
                  dir="ltr"
                >
                  {countdown.formatted}
                </span>
              </div>

              <div className="hidden sm:flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => scrollHero('left')}
                  aria-label="Scroll previous"
                  className="w-9 h-9 rounded-full bg-zinc-950/35 hover:bg-zinc-950/55 border border-white/25 text-white flex items-center justify-center cursor-pointer transition-colors"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  type="button"
                  onClick={() => scrollHero('right')}
                  aria-label="Scroll next"
                  className="w-9 h-9 rounded-full bg-zinc-950/35 hover:bg-zinc-950/55 border border-white/25 text-white flex items-center justify-center cursor-pointer transition-colors"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Side Animated GIF Card + Daily Updated Discount Offers */}
          <div className="flex flex-col lg:flex-row gap-3.5 px-4 sm:px-6 py-4 items-stretch">
            <button
              type="button"
              onClick={() => onSelectStore('amazon')}
              className="w-full lg:w-[224px] xl:w-[244px] shrink-0 rounded-xl overflow-hidden bg-[#FE6404] border-2 border-white/75 hover:border-white shadow-md flex flex-col justify-between text-start cursor-pointer group transition-transform duration-200 hover:-translate-y-0.5"
            >
              <div className="w-full flex-1 flex items-center justify-center bg-[#FE6404] p-2">
                <img
                  src="/assets/banners/amazon-us-bf-showcase.gif"
                  alt={t.bfGifCaption}
                  loading="eager"
                  referrerPolicy="no-referrer"
                  className="w-full max-w-[230px] lg:max-w-full max-h-[260px] lg:max-h-[300px] object-contain rounded-lg group-hover:scale-[1.02] transition-transform duration-300"
                />
              </div>
              <div className="bg-[#9A2D00]/95 px-3 py-2.5 border-t border-white/25 flex items-center justify-between gap-2 text-xs font-extrabold text-white">
                <span className="truncate">{t.bfBannerCta}</span>
                <ExternalLink className="w-3.5 h-3.5 text-[#FFD814] shrink-0" />
              </div>
            </button>

            <div
              ref={heroScrollRef}
              className="flex-1 min-w-0 flex gap-3.5 overflow-x-auto scroll-smooth no-scrollbar"
            >
              {flashDeals.map((product) => (
                <HomeProductCard
                  key={product.id}
                  product={product}
                  isAr={isAr}
                  buyNowLabel={t.buyNow}
                  onOpenProduct={onOpenProduct}
                  compactWidth="w-[240px] sm:w-[254px] shrink-0"
                  surfaceTone="gifWarm"
                />
              ))}
            </div>
          </div>
        </section>

        {/* Quick Category Chips Strip */}
        <div className="bg-white border border-zinc-200 rounded-lg p-3 shadow-xs">
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
            {CATALOG_CATEGORIES.map((cat) => {
              const selected = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => onSelectCategory(cat.id)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-bold border whitespace-nowrap shrink-0 cursor-pointer transition-colors ${
                    selected
                      ? 'bg-[#00453E] text-white border-[#00453E]'
                      : 'bg-zinc-50 text-zinc-800 border-zinc-300 hover:bg-zinc-100'
                  }`}
                >
                  {isAr ? cat.nameAr : cat.nameEn}
                </button>
              );
            })}
          </div>
        </div>

        {/* Filtered View (Search Query OR Specific Category Selected) */}
        {isFilteredView ? (
          <section id="hot-deals" className="space-y-4">
            <div className="bg-white border border-zinc-200 rounded-lg p-4 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <Search className="w-5 h-5 text-[#00453E]" />
                <div>
                  <h2 className="font-display text-lg sm:text-xl font-extrabold text-zinc-950">
                    {rawQuery
                      ? `${isAr ? 'نتائج البحث عن' : 'Results for'}: "${rawQuery}"`
                      : selectedCategoryMeta
                        ? isAr
                          ? selectedCategoryMeta.homeRowTitleAr
                          : selectedCategoryMeta.homeRowTitleEn
                        : t.matchingProductsHeading}
                  </h2>
                  <p className="text-xs text-zinc-600">
                    {filteredResults.length}{' '}
                    {isAr ? 'منتج موثق مطابق' : 'verified products found'}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={onClearSearch}
                className="px-4 py-2 bg-zinc-100 hover:bg-zinc-200 text-zinc-900 text-xs font-bold rounded-full cursor-pointer"
              >
                {t.clearAllFilters}
              </button>
            </div>

            {filteredResults.length === 0 ? (
              <div className="bg-white border-2 border-dashed border-amber-300 rounded-xl p-8 text-center">
                <Sparkles className="w-10 h-10 text-amber-600 mx-auto" />
                <h3 className="mt-3 font-display text-xl font-extrabold text-zinc-950">
                  {t.comingSoonTitle}
                </h3>
                <p className="mt-1.5 text-sm text-zinc-600 max-w-lg mx-auto">
                  {isAr
                    ? 'هذا القسم قيد التجهيز حالياً. انتظر أقوى الخصومات قريباً جداً أو تصفح كل العروض المتوفرة.'
                    : 'This category is launching soon with direct verified product discounts. Explore other available categories or coupons in the meantime.'}
                </p>
                <div className="mt-5 flex flex-wrap justify-center gap-2.5">
                  <button
                    type="button"
                    onClick={onClearSearch}
                    className="px-5 py-2.5 bg-[#FFD814] hover:bg-[#F7CA00] text-zinc-950 font-extrabold text-xs sm:text-sm rounded-full border border-[#FCD200] cursor-pointer"
                  >
                    {isAr ? 'عرض جميع المنتجات' : 'Show All Products'}
                  </button>
                  <button
                    type="button"
                    onClick={onNavigateCoupons}
                    className="px-5 py-2.5 bg-[#00453E] hover:bg-[#00342E] text-white font-extrabold text-xs sm:text-sm rounded-full cursor-pointer"
                  >
                    {t.couponsNav}
                  </button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {filteredResults.map((product) => (
                  <HomeProductCard
                    key={product.id}
                    product={product}
                    isAr={isAr}
                    buyNowLabel={t.buyNow}
                    onOpenProduct={onOpenProduct}
                  />
                ))}
              </div>
            )}
          </section>
        ) : (
          /* Best & Cheapest New Products Across All Branches & Categories + Category Shelf Rows */
          <section id="hot-deals" className="space-y-5">
            {/* Highlighted Multi-Branch Best & Cheapest New Arrivals */}
            <div className="bg-white border-2 border-[#00453E]/20 rounded-xl p-4 sm:p-5 shadow-xs">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 mb-3.5">
                <div>
                  <div className="inline-flex items-center gap-1.5 bg-emerald-50 text-[#00453E] border border-emerald-200 px-2.5 py-0.5 rounded-full text-[11px] font-extrabold">
                    <Sparkles className="w-3.5 h-3.5 text-[#FF5E00]" />
                    <span>
                      {isAr
                        ? 'محدّث يومياً · كل الفروع والأقسام'
                        : 'Updated Daily · All Branches & Departments'}
                    </span>
                  </div>
                  <h2 className="mt-1 font-display text-lg sm:text-xl font-extrabold text-zinc-950">
                    {isAr
                      ? 'أفضل وأرخص المنتجات الجديدة من كل الفروع والأقسام'
                      : 'Best & Cheapest New Arrivals Across All Stores & Categories'}
                  </h2>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <div className="inline-flex items-center rounded-full bg-zinc-100 p-0.5 border border-zinc-200">
                    <button
                      type="button"
                      onClick={() => setNewDealSortMode('discount')}
                      className={`px-3 py-1 rounded-full text-xs font-extrabold cursor-pointer transition-colors ${
                        newDealSortMode === 'discount'
                          ? 'bg-[#00453E] text-white'
                          : 'text-zinc-700 hover:text-zinc-950'
                      }`}
                    >
                      {isAr ? 'أقوى الخصومات' : 'Top Discounts'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setNewDealSortMode('cheapest')}
                      className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-extrabold cursor-pointer transition-colors ${
                        newDealSortMode === 'cheapest'
                          ? 'bg-[#00453E] text-white'
                          : 'text-zinc-700 hover:text-zinc-950'
                      }`}
                    >
                      <ArrowDownWideNarrow className="w-3.5 h-3.5" />
                      {isAr ? 'الأرخص سعراً' : 'Cheapest First'}
                    </button>
                  </div>

                  <div className="hidden sm:flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => scrollNewBest('left')}
                      aria-label="Scroll best new deals left"
                      className="w-7 h-7 rounded-full border border-zinc-300 bg-white hover:bg-zinc-100 flex items-center justify-center cursor-pointer"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => scrollNewBest('right')}
                      aria-label="Scroll best new deals right"
                      className="w-7 h-7 rounded-full border border-zinc-300 bg-white hover:bg-zinc-100 flex items-center justify-center cursor-pointer"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Branch Filter Strip */}
              <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-3 mb-3 border-b border-zinc-100">
                <button
                  type="button"
                  onClick={() => setNewDealStoreTab('all')}
                  className={`px-3 py-1 rounded-full text-xs font-bold border whitespace-nowrap shrink-0 cursor-pointer transition-colors ${
                    newDealStoreTab === 'all'
                      ? 'bg-zinc-950 text-[#FFD814] border-zinc-950'
                      : 'bg-zinc-50 text-zinc-700 border-zinc-300 hover:bg-zinc-100'
                  }`}
                >
                  {isAr ? `كل الفروع (${CATALOG_PRODUCTS.length})` : `All Branches (${CATALOG_PRODUCTS.length})`}
                </button>
                {activeBranchTabs.map((b) => (
                  <button
                    key={b.id}
                    type="button"
                    onClick={() => setNewDealStoreTab(b.id)}
                    className={`px-3 py-1 rounded-full text-xs font-bold border whitespace-nowrap shrink-0 cursor-pointer transition-colors ${
                      newDealStoreTab === b.id
                        ? 'bg-[#00453E] text-white border-[#00453E]'
                        : 'bg-white text-zinc-700 border-zinc-300 hover:bg-zinc-50'
                    }`}
                  >
                    {b.flag} {isAr ? b.labelAr : b.labelEn} ({b.count})
                  </button>
                ))}
              </div>

              <div
                ref={newBestScrollRef}
                className="flex gap-3.5 overflow-x-auto pb-1 scroll-smooth no-scrollbar"
              >
                {bestAndCheapestNewDeals.map((product) => (
                  <HomeProductCard
                    key={`best-${product.id}`}
                    product={product}
                    isAr={isAr}
                    buyNowLabel={t.buyNow}
                    onOpenProduct={onOpenProduct}
                    compactWidth="w-[228px] sm:w-[248px] shrink-0"
                  />
                ))}
              </div>
            </div>

            {shelfCategories.map((cat) => {
              const catPool = newestFirstCatalog.filter((p) => p.categoryId === cat.id);
              const prioritized = [...catPool].sort((a, b) => {
                const aScore = a.discountPercent * 2 + (approxUsdPrice(a) <= 25 ? 20 : 0);
                const bScore = b.discountPercent * 2 + (approxUsdPrice(b) <= 25 ? 20 : 0);
                return bScore - aScore;
              });
              const items = diversifyAcrossBranchesAndCategories(prioritized, catPool.length);
              const heading = isAr ? cat.homeRowTitleAr : cat.homeRowTitleEn;
              return (
                <CategoryShelfRow
                  key={cat.id}
                  title={heading}
                  items={items}
                  isAr={isAr}
                  buyNowLabel={t.buyNow}
                  comingSoonTitle={t.comingSoonTitle}
                  comingSoonSub={t.comingSoonSub}
                  onViewCategory={() => onSelectCategory(cat.id)}
                  onOpenProduct={onOpenProduct}
                  onNavigateCoupons={onNavigateCoupons}
                  isSoftware={cat.id === 'software'}
                />
              );
            })}
          </section>
        )}

        {/* Store Directory Section */}
        <section
          id="top-stores"
          aria-labelledby="stores-directory-heading"
          className="bg-white border border-zinc-200 rounded-xl p-5 shadow-xs"
        >
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
            <div>
              <h2
                id="stores-directory-heading"
                className="font-display text-lg sm:text-xl font-extrabold text-zinc-950"
              >
                {t.storesHeading}
              </h2>
              <p className="text-xs text-zinc-600">
                {isAr
                  ? 'تصفح متاجرنا العالمية أو ادخل إلى قسم الكوبونات وأكواد البنوك'
                  : 'Explore partner stores worldwide or visit Coupons for bank & promo codes'}
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={onNavigateCoupons}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#FFD814] hover:bg-[#F7CA00] text-zinc-950 text-xs font-extrabold rounded-full border border-[#FCD200] cursor-pointer"
              >
                <Tag className="w-3.5 h-3.5" />
                {t.couponsNav}
              </button>
              <button
                type="button"
                onClick={() => onNavigateProducts()}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#00453E] hover:bg-[#00342E] text-white text-xs font-bold rounded-full cursor-pointer"
              >
                {t.productsNav}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {STORE_GROUPS.map((group) => (
              <div
                key={group.id}
                className="border border-zinc-200 rounded-lg p-3 bg-zinc-50/70 hover:border-[#00453E] transition-colors flex flex-col justify-between gap-2.5"
              >
                <button
                  type="button"
                  onClick={() => onSelectStore(group.defaultStoreId)}
                  className="flex items-center gap-2.5 text-start cursor-pointer"
                >
                  <StoreLogo
                    storeId={group.defaultStoreId}
                    name={isAr ? group.nameAr : group.nameEn}
                    size="sm"
                  />
                  <div className="min-w-0">
                    <p className="text-xs sm:text-sm font-extrabold text-zinc-950 truncate">
                      {isAr ? group.nameAr : group.nameEn}
                    </p>
                    <p className="text-[11px] text-zinc-500 truncate">
                      {group.comingSoon
                        ? isAr
                          ? 'قريباً جداً'
                          : 'Coming Soon'
                        : group.branches.length > 1
                          ? `${group.branches.length} ${isAr ? 'دول' : 'Countries'}`
                          : group.branches[0].domain}
                    </p>
                  </div>
                </button>

                {group.branches.length > 1 ? (
                  <div className="flex flex-wrap gap-1">
                    {group.branches.map((branch) => (
                      <button
                        key={branch.id}
                        type="button"
                        onClick={() => onSelectStore(branch.id)}
                        className="px-2 py-0.5 text-[10px] font-bold bg-white hover:bg-[#00453E] hover:text-white text-zinc-800 border border-zinc-300 rounded cursor-pointer transition-colors"
                      >
                        {branch.flag} {branch.currencySymbol}
                      </button>
                    ))}
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => onSelectStore(group.defaultStoreId)}
                    className={`w-full py-1.5 text-[11px] font-bold rounded cursor-pointer ${
                      group.comingSoon
                        ? 'bg-amber-100 text-amber-900 hover:bg-amber-200'
                        : 'bg-white border border-zinc-300 text-zinc-900 hover:bg-[#00453E] hover:text-white'
                    }`}
                  >
                    {group.comingSoon
                      ? isAr
                        ? 'قريباً'
                        : 'Coming Soon'
                      : isAr
                        ? 'فتح المتجر'
                        : 'Open Store'}
                  </button>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Chrome Extension CTA */}
        <section className="bg-[#00453E] text-white rounded-xl p-5 sm:p-6 flex flex-col md:flex-row items-center justify-between gap-4 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center shrink-0">
              <Chrome className="w-6 h-6 text-[#FF9900]" />
            </div>
            <div>
              <h2 className="font-display text-base sm:text-lg font-extrabold">
                {t.saveAutoHeading}
              </h2>
              <p className="text-xs sm:text-sm text-emerald-100">{t.saveAutoSub}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onOpenInstallModal}
            className="px-6 py-2.5 bg-[#FFD814] hover:bg-[#F7CA00] text-zinc-950 font-extrabold text-xs sm:text-sm rounded-full border border-[#FCD200] cursor-pointer shrink-0 whitespace-nowrap"
          >
            {t.addDodxToChromeCta}
          </button>
        </section>
      </div>
    </div>
  );
};

interface CategoryShelfRowProps {
  title: string;
  items: CatalogProduct[];
  isAr: boolean;
  buyNowLabel: string;
  comingSoonTitle: string;
  comingSoonSub: string;
  onViewCategory: () => void;
  onOpenProduct: (id: string) => void;
  onNavigateCoupons: () => void;
  isSoftware?: boolean;
}

const CategoryShelfRow: React.FC<CategoryShelfRowProps> = ({
  title,
  items,
  isAr,
  buyNowLabel,
  comingSoonTitle,
  comingSoonSub,
  onViewCategory,
  onOpenProduct,
  onNavigateCoupons,
  isSoftware,
}) => {
  const rowRef = useRef<HTMLDivElement | null>(null);

  const scrollRow = (dir: 'left' | 'right') => {
    if (!rowRef.current) return;
    rowRef.current.scrollBy({
      left: dir === 'left' ? -340 : 340,
      behavior: 'smooth',
    });
  };

  return (
    <div className="bg-white border border-zinc-200 rounded-xl p-4 sm:p-5 shadow-xs">
      <div className="flex flex-wrap items-center justify-between gap-2 mb-3.5">
        <button
          type="button"
          onClick={onViewCategory}
          className="font-display text-base sm:text-xl font-extrabold text-zinc-950 hover:text-[#00453E] text-start cursor-pointer"
        >
          {title}
        </button>

        {items.length > 0 ? (
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onViewCategory}
              className="text-xs font-bold text-[#007185] hover:underline cursor-pointer"
            >
              {isAr ? `عرض الكل (${items.length})` : `See all (${items.length})`}
            </button>
            <div className="hidden sm:flex items-center gap-1">
              <button
                type="button"
                onClick={() => scrollRow('left')}
                aria-label="Scroll shelf left"
                className="w-7 h-7 rounded-full border border-zinc-300 bg-white hover:bg-zinc-100 flex items-center justify-center cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => scrollRow('right')}
                aria-label="Scroll shelf right"
                className="w-7 h-7 rounded-full border border-zinc-300 bg-white hover:bg-zinc-100 flex items-center justify-center cursor-pointer"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        ) : (
          <span className="text-[11px] font-bold bg-amber-100 text-amber-800 px-2.5 py-0.5 rounded">
            {isAr ? 'قريباً جداً' : 'Coming Very Soon'}
          </span>
        )}
      </div>

      {items.length > 0 ? (
        <div
          ref={rowRef}
          className="flex gap-3.5 overflow-x-auto pb-1 scroll-smooth no-scrollbar"
        >
          {items.map((product) => (
            <HomeProductCard
              key={product.id}
              product={product}
              isAr={isAr}
              buyNowLabel={buyNowLabel}
              onOpenProduct={onOpenProduct}
              compactWidth="w-[228px] sm:w-[248px] shrink-0"
            />
          ))}
        </div>
      ) : (
        <div className="rounded-lg border border-dashed border-amber-300 bg-amber-50/40 px-4 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Sparkles className="w-5 h-5 text-amber-600 shrink-0" />
            <div>
              <p className="text-sm font-extrabold text-zinc-900">{comingSoonTitle}</p>
              <p className="text-xs text-zinc-600">{comingSoonSub}</p>
            </div>
          </div>
          {isSoftware && (
            <button
              type="button"
              onClick={onNavigateCoupons}
              className="px-4 py-1.5 bg-[#FFD814] hover:bg-[#F7CA00] text-zinc-950 text-xs font-extrabold rounded-full border border-[#FCD200] cursor-pointer shrink-0"
            >
              {isAr ? 'عروض Parallels و AdGuard' : 'Parallels & AdGuard Deals'}
            </button>
          )}
        </div>
      )}
    </div>
  );
};

interface HomeProductCardProps {
  product: CatalogProduct;
  isAr: boolean;
  buyNowLabel: string;
  onOpenProduct: (id: string) => void;
  compactWidth?: string;
  surfaceTone?: 'default' | 'gifWarm';
}

const HomeProductCard: React.FC<HomeProductCardProps> = ({
  product,
  isAr,
  buyNowLabel,
  onOpenProduct,
  compactWidth = '',
  surfaceTone = 'default',
}) => {
  const title = isAr ? product.titleAr : product.titleEn;
  const storeName = isAr ? product.storeNameAr : product.storeNameEn;
  const badge = isAr ? product.discountBadgeAr : product.discountBadgeEn;

  const isGifWarm = surfaceTone === 'gifWarm';
  const cardSurfaceClass = isGifWarm
    ? 'bg-gradient-to-b from-[#FFF3EA] to-[#FFE2CC] border-[#FFB380] hover:border-white shadow-sm'
    : 'bg-white border-zinc-200 hover:border-[#FF9900] shadow-xs';
  const mediaSurfaceClass = isGifWarm
    ? 'bg-white border-b border-[#FFD0AD]'
    : 'bg-zinc-50 border-b border-zinc-100';

  return (
    <article
      className={`${compactWidth} ${cardSurfaceClass} border rounded-lg overflow-hidden flex flex-col justify-between transition-colors text-zinc-950`}
    >
      <div>
        <a
          href={product.affiliateUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={`relative block aspect-[16/10] ${mediaSurfaceClass} overflow-hidden group`}
        >
          <img
            src={product.image}
            alt={title}
            loading="lazy"
            className={`w-full h-full group-hover:scale-105 transition-transform duration-300 ${
              product.containImage ? 'object-contain bg-white p-2' : 'object-cover'
            }`}
          />
          <span className="absolute top-2 start-2 bg-[#CC0C39] text-white text-[11px] font-extrabold px-2 py-0.5 rounded-xs shadow-xs tabular-nums">
            {badge}
          </span>
        </a>

        <div className="p-3">
          <div className="flex items-center justify-between gap-1.5 text-[11px] font-semibold text-zinc-500">
            <span className="truncate">{storeName}</span>
            <button
              type="button"
              onClick={() => onOpenProduct(product.id)}
              className="text-[#007185] hover:underline shrink-0 cursor-pointer"
            >
              {isAr ? 'التفاصيل' : 'Details'}
            </button>
          </div>

          <h3 className="mt-1 font-display text-xs sm:text-sm font-bold text-zinc-950 leading-snug line-clamp-2 min-h-[2.4rem]">
            <a
              href={product.affiliateUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#C7511F] hover:underline"
            >
              {title}
            </a>
          </h3>

          <div className="mt-2 flex flex-wrap items-baseline gap-2" dir="ltr">
            <span className="font-display text-base sm:text-lg font-extrabold text-[#B12704] tabular-nums">
              {product.price}
            </span>
            {product.oldPrice && (
              <span className="text-[11px] text-zinc-500 line-through tabular-nums">
                {product.oldPrice}
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="px-3 pb-3 pt-0.5 flex items-center gap-1.5">
        <a
          href={product.affiliateUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 inline-flex items-center justify-center gap-1 px-3 py-2 min-h-[36px] bg-[#FFD814] hover:bg-[#F7CA00] active:bg-[#F0B800] text-zinc-950 border border-[#FCD200] text-xs font-extrabold rounded-full transition-colors whitespace-nowrap"
        >
          <span>{buyNowLabel}</span>
          <ExternalLink className="w-3 h-3" />
        </a>
        <ShareButton
          url={product.affiliateUrl}
          shareId={product.id}
          title={title}
          price={product.price}
          oldPrice={product.oldPrice}
          discount={badge}
          isAr={isAr}
          dropDirection="up"
        />
      </div>
    </article>
  );
};
