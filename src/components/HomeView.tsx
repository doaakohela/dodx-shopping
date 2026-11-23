import React, { useMemo, useRef } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Chrome,
  Clock,
  ExternalLink,
  Flame,
  Search,
  Sparkles,
  Tag,
} from 'lucide-react';
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
  const countdown = useFlashCountdown();

  const rawQuery = searchQuery.trim();
  const isFilteredView = rawQuery.length > 0 || activeCategory !== 'all' || searchStoreFilter !== 'all';

  const newestFirstCatalog = useMemo(() => [...CATALOG_PRODUCTS].reverse(), []);

  // Always prioritize the latest batch of newly added deals for the Hero Showcase
  const flashDeals = useMemo(() => {
    const latestWindow = newestFirstCatalog.slice(0, 45);
    const discountedLatest = latestWindow
      .filter((p) => p.discountPercent >= 10 || p.isFlashDeal)
      .sort((a, b) => b.discountPercent - a.discountPercent);
    if (discountedLatest.length >= 14) {
      return discountedLatest.slice(0, 16);
    }
    const seen = new Set(discountedLatest.map((p) => p.id));
    const fill = latestWindow.filter((p) => !seen.has(p.id));
    return [...discountedLatest, ...fill].slice(0, 16);
  }, [newestFirstCatalog]);

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

  return (
    <div className="bg-[#EAEDED] min-h-screen pb-10">
      <div className="max-w-[1440px] mx-auto px-3 sm:px-5 pt-4 space-y-6">
        {/* Top Hero: Black Friday Animated GIF + Daily Updated Flash Deals Harmonized in GIF Orange */}
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
              <h1
                id="flash-hero-heading"
                className="mt-1.5 font-display text-xl sm:text-3xl font-extrabold tracking-tight text-white"
              >
                {t.flashHeroTitle}
              </h1>
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
          /* Full Amazon-Style Category Shelf Rows (Newest Products First) */
          <section id="hot-deals" className="space-y-5">
            {shelfCategories.map((cat) => {
              const items = newestFirstCatalog.filter((p) => p.categoryId === cat.id);
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
