import React, { useEffect, useMemo, useState } from 'react';
import {
  ArrowLeft,
  Clock,
  ExternalLink,
  Flame,
  Landmark,
  Sparkles,
  Store as StoreIcon,
  Tag,
  Zap,
} from 'lucide-react';
import {
  CATALOG_PRODUCTS,
  CatalogProduct,
  COUPONS_CATALOG,
  getPriceTierForNumber,
  getStoreBranch,
  getStoreGroup,
  matchesPriceTier,
  PRICE_TIERS,
  PriceTierId,
  STORE_GROUPS,
} from '../data/unifiedCatalog';
import { TranslationDict } from '../i18n/translations';
import { useFlashCountdown } from '../hooks/useFlashCountdown';
import { StoreLogo } from './StoreLogo';
import { ShareButton } from './ShareButton';

interface DealsViewProps {
  storeParam: string;
  isAr: boolean;
  t: TranslationDict;
  onBackHome: () => void;
  onSelectStore: (storeId: string) => void;
  onNavigateCoupons: () => void;
  onOpenProduct: (productId: string) => void;
}

export const DealsView: React.FC<DealsViewProps> = ({
  storeParam,
  isAr,
  t,
  onBackHome,
  onSelectStore,
  onNavigateCoupons,
  onOpenProduct,
}) => {
  const [selectedTier, setSelectedTier] = useState<PriceTierId>('all');
  const countdown = useFlashCountdown();

  useEffect(() => {
    setSelectedTier('all');
  }, [storeParam]);

  const group = getStoreGroup(storeParam);
  const directBranch = getStoreBranch(storeParam);
  const activeBranch =
    directBranch || (group ? group.branches[0] : undefined);

  const products = useMemo(() => {
    if (!activeBranch) return [];
    return [...CATALOG_PRODUCTS].reverse().filter((p) => p.storeId === activeBranch.id);
  }, [activeBranch]);

  const filteredProducts = useMemo(() => {
    if (selectedTier === 'all') return products;
    return products.filter((p) => matchesPriceTier(p.numericPrice, selectedTier));
  }, [products, selectedTier]);

  const groupedByTier = useMemo(() => {
    const groups: Array<{
      tier: (typeof PRICE_TIERS)[number];
      items: CatalogProduct[];
    }> = [];
    for (const tier of PRICE_TIERS) {
      const items = products.filter((p) => getPriceTierForNumber(p.numericPrice) === tier.id);
      if (items.length > 0) {
        groups.push({ tier, items });
      }
    }
    return groups;
  }, [products]);

  const storeCoupons = useMemo(() => {
    if (!activeBranch) return [];
    return COUPONS_CATALOG.filter((c) => c.storeId === activeBranch.id);
  }, [activeBranch]);

  if (!group || !activeBranch) {
    return (
      <section className="max-w-4xl mx-auto px-4 py-12">
        <button
          type="button"
          onClick={onBackHome}
          className="inline-flex items-center gap-2 text-sm font-semibold text-[#007185] hover:text-[#C7511F] hover:underline cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 rtl:rotate-180" />
          {t.backToDodx}
        </button>

        <div className="mt-6 bg-white border border-zinc-200 rounded-md p-8 text-center">
          <div className="w-12 h-12 rounded-full bg-zinc-100 text-zinc-700 flex items-center justify-center mx-auto">
            <StoreIcon className="w-6 h-6" />
          </div>
          <h1 className="mt-4 font-display text-2xl font-bold text-zinc-950">
            {t.storeNotFound}: &ldquo;{storeParam}&rdquo;
          </h1>
          <div className="mt-6 flex flex-wrap justify-center gap-2">
            {STORE_GROUPS.map((g) => (
              <button
                key={g.id}
                type="button"
                onClick={() => onSelectStore(g.defaultStoreId)}
                className="px-4 py-2 text-sm font-semibold bg-[#FFD814] hover:bg-[#F7CA00] text-zinc-950 border border-[#FCD200] rounded-full cursor-pointer whitespace-nowrap"
              >
                {isAr ? g.nameAr : g.nameEn}
              </button>
            ))}
          </div>
        </div>
      </section>
    );
  }

  const branchName = isAr ? activeBranch.nameAr : activeBranch.nameEn;
  const currencyUnit = isAr ? activeBranch.currencyAr : activeBranch.currencySymbol;
  const isComingSoonStore = Boolean(group.comingSoon || activeBranch.comingSoon);
  const isEmptyProductStore = isComingSoonStore || products.length === 0;

  return (
    <section className="bg-[#EAEDED] min-h-screen px-3 sm:px-5 py-6">
      <div className="max-w-6xl mx-auto space-y-5">
        {/* Top Breadcrumb + Parent Store Switcher */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <button
            type="button"
            onClick={onBackHome}
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#007185] hover:text-[#C7511F] hover:underline cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 rtl:rotate-180" />
            {t.backToDodx}
          </button>

          <div className="flex flex-wrap items-center gap-1.5 text-xs">
            <span className="text-zinc-600 font-medium">{t.switchStore}</span>
            {STORE_GROUPS.map((g) => {
              const active = g.id === group.id;
              return (
                <button
                  key={g.id}
                  type="button"
                  onClick={() => onSelectStore(g.defaultStoreId)}
                  className={`px-2.5 py-1 rounded-sm text-xs font-semibold border cursor-pointer whitespace-nowrap ${
                    active
                      ? 'bg-[#00453E] text-white border-[#00453E]'
                      : 'bg-white text-zinc-800 border-zinc-300 hover:bg-zinc-100'
                  }`}
                >
                  {isAr ? g.nameAr : g.nameEn}
                </button>
              );
            })}
          </div>
        </div>

        {/* Country Sub-Branch Tabs when Parent Group has multiple countries (e.g., Amazon) */}
        {group.branches.length > 1 && (
          <div className="bg-white border border-zinc-200 rounded-lg p-3 flex flex-wrap items-center gap-2 shadow-xs">
            <span className="text-xs font-extrabold text-zinc-600 px-1">
              {isAr ? 'فروع الدول:' : 'Country Stores:'}
            </span>
            {group.branches.map((branch) => {
              const selected = branch.id === activeBranch.id;
              const branchCount = CATALOG_PRODUCTS.filter((p) => p.storeId === branch.id).length;
              return (
                <button
                  key={branch.id}
                  type="button"
                  onClick={() => onSelectStore(branch.id)}
                  className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-md text-xs sm:text-sm font-bold border transition-colors cursor-pointer ${
                    selected
                      ? 'bg-[#00453E] text-white border-[#00453E] shadow-xs'
                      : 'bg-zinc-50 text-zinc-800 border-zinc-300 hover:bg-zinc-100'
                  }`}
                >
                  <span>{branch.flag}</span>
                  <span>{isAr ? branch.nameAr : branch.nameEn}</span>
                  <span
                    className={`text-[11px] font-mono px-1.5 py-0.5 rounded ${
                      selected ? 'bg-[#FFD814] text-zinc-950' : 'bg-zinc-200 text-zinc-700'
                    }`}
                  >
                    {branchCount}
                  </span>
                </button>
              );
            })}
          </div>
        )}

        {/* Prominent White Friday & Flash Timer Store Hero */}
        <div className="bg-white border border-zinc-200 rounded-xl overflow-hidden shadow-xs">
          <div className="bg-gradient-to-r from-[#00453E] via-[#005A50] to-[#00453E] text-white px-5 py-3 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Flame className="w-5 h-5 text-[#FFD814] shrink-0" />
              <span className="font-display text-sm sm:text-base font-extrabold tracking-tight">
                {t.whiteFridayHeader}
              </span>
            </div>

            <div className="inline-flex items-center gap-2 bg-[#CC0C39] text-white px-3 py-1 rounded-sm text-xs font-extrabold shadow-xs">
              <Clock className="w-3.5 h-3.5 animate-pulse" />
              <span>{t.endsIn}:</span>
              <span className="font-mono tracking-wider tabular-nums" dir="ltr">
                {countdown.formatted}
              </span>
            </div>
          </div>

          <div className="p-5 sm:p-6 flex flex-col md:flex-row md:items-center justify-between gap-5">
            <div className="flex items-start sm:items-center gap-4">
              <StoreLogo storeId={activeBranch.id} name={branchName} size="lg" />
              <div>
                <h1 className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight text-zinc-950">
                  {branchName}
                </h1>
                <div className="mt-1 flex flex-wrap items-center gap-2 text-xs sm:text-sm text-zinc-600">
                  <span className="font-semibold text-zinc-900">{activeBranch.domain}</span>
                  <span aria-hidden="true">·</span>
                  <span className="font-bold text-[#007600]">
                    {products.length > 0
                      ? `${products.length} ${isAr ? 'منتج موثق بالخصم' : 'verified discounted products'}`
                      : isAr
                        ? 'قريباً جداً'
                        : 'Coming Very Soon'}
                  </span>
                  <span aria-hidden="true">·</span>
                  <span className="font-semibold text-zinc-800">
                    {isAr ? `العملة: ${activeBranch.currencyAr}` : `Currency: ${activeBranch.currencyCode}`}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 shrink-0">
              {!isComingSoonStore && activeBranch.affiliateUrl && (
                <a
                  href={activeBranch.affiliateUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 min-h-[44px] bg-[#FFD814] hover:bg-[#F7CA00] text-zinc-950 border border-[#FCD200] text-sm font-extrabold rounded-full transition-colors whitespace-nowrap"
                >
                  {t.buyNow} · {branchName}
                  <ExternalLink className="w-4 h-4" />
                </a>
              )}
              {storeCoupons.length > 0 && (
                <button
                  type="button"
                  onClick={onNavigateCoupons}
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 min-h-[44px] bg-emerald-50 hover:bg-emerald-100 text-[#00453E] border border-emerald-300 text-xs sm:text-sm font-extrabold rounded-full cursor-pointer whitespace-nowrap"
                >
                  <Tag className="w-4 h-4" />
                  {isAr ? `أكواد وكوبونات المتجر (${storeCoupons.length})` : `Store Coupons (${storeCoupons.length})`}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Amazon Egypt Bank Promo Codes Highlight Strip */}
        {activeBranch.id === 'amazon-eg' && (
          <div className="bg-gradient-to-r from-amber-50 to-emerald-50 border border-amber-300 rounded-lg p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-start sm:items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-[#00453E] text-[#FFD814] flex items-center justify-center shrink-0">
                <Landmark className="w-4 h-4" />
              </div>
              <div>
                <p className="text-sm font-extrabold text-zinc-950">
                  {isAr
                    ? 'أكواد خصم البطاقات البنكية متاحة الآن: SWYPE25 · ABK20 · QNBC200'
                    : 'Bank Promo Codes Available: SWYPE25 · ABK20 · QNBC200'}
                </p>
                <p className="text-xs text-zinc-700">
                  {isAr
                    ? 'وفر حتى 2,000 جنيه إضافية عند الدفع ببطاقات CIB أو ABK أو QNB من قسم الكوبونات.'
                    : 'Save up to 2,000 EGP extra at checkout using verified Egypt bank codes in Coupons.'}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={onNavigateCoupons}
              className="px-4 py-2 bg-[#00453E] hover:bg-[#00342E] text-white text-xs font-extrabold rounded-full cursor-pointer shrink-0 whitespace-nowrap"
            >
              {isAr ? 'فتح قسم الكوبونات ←' : 'Open Coupons →'}
            </button>
          </div>
        )}

        {/* Coming Soon Empty Store Notice OR 11-Tier Price Bracket Product View */}
        {isEmptyProductStore ? (
          <div className="bg-white border-2 border-dashed border-amber-300 rounded-xl p-8 sm:p-12 text-center shadow-xs">
            <div className="w-14 h-14 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center mx-auto">
              <Sparkles className="w-7 h-7" />
            </div>
            <h2 className="mt-4 font-display text-2xl sm:text-3xl font-extrabold text-zinc-950">
              {t.comingSoonTitle}
            </h2>
            <p className="mt-2 text-sm sm:text-base text-zinc-600 max-w-xl mx-auto leading-relaxed">
              {isComingSoonStore
                ? isAr
                  ? `متجر ${branchName} قيد الإضافة حالياً. انتظر أقوى الخصومات قريباً جداً فور تفعيل روابط الشراء الموثقة.`
                  : `${branchName} deals are being curated now. Biggest discounts coming very soon!`
                : isAr
                  ? `الروابط الفردية لمنتجات ${branchName} قيد التحديث حالياً (انتظر أقوى الخصومات قريباً جداً). يمكنك التسوق الآن من البوابة الرسمية للمتجر أو تصفح الكوبونات.`
                  : `Direct individual SKU deals for ${branchName} are coming very soon. In the meantime, visit the official store portal or check active coupons.`}
            </p>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              {!isComingSoonStore && activeBranch.affiliateUrl && (
                <a
                  href={activeBranch.affiliateUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-[#FFD814] hover:bg-[#F7CA00] text-zinc-950 border border-[#FCD200] text-sm font-extrabold rounded-full"
                >
                  {t.buyNow} · {branchName}
                  <ExternalLink className="w-4 h-4" />
                </a>
              )}
              <button
                type="button"
                onClick={onNavigateCoupons}
                className="inline-flex items-center gap-2 px-6 py-3 bg-[#00453E] hover:bg-[#00342E] text-white text-sm font-extrabold rounded-full cursor-pointer"
              >
                <Tag className="w-4 h-4 text-[#FFD814]" />
                {isAr ? 'تصفح قسم الكوبونات' : 'Browse Coupons'}
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* 11 Price Bracket Filter Bar */}
            <div className="bg-white border border-zinc-200 rounded-xl p-4 shadow-xs">
              <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                <h2 className="font-display text-sm sm:text-base font-extrabold text-zinc-950">
                  {isAr
                    ? `تقسيم الأسعار والخصومات (${currencyUnit})`
                    : `Browse by Price Bracket (${currencyUnit})`}
                </h2>
                <span className="text-xs text-zinc-500 font-semibold">
                  {filteredProducts.length} {isAr ? 'منتج معروض' : 'items shown'}
                </span>
              </div>

              <div className="flex flex-wrap gap-1.5">
                <button
                  type="button"
                  onClick={() => setSelectedTier('all')}
                  className={`px-3 py-1.5 rounded-md text-xs font-bold border transition-colors cursor-pointer ${
                    selectedTier === 'all'
                      ? 'bg-[#00453E] text-white border-[#00453E]'
                      : 'bg-zinc-50 text-zinc-800 border-zinc-300 hover:bg-zinc-100'
                  }`}
                >
                  {t.allPricesLabel} ({products.length})
                </button>

                {PRICE_TIERS.map((tier) => {
                  const count = products.filter((p) =>
                    matchesPriceTier(p.numericPrice, tier.id)
                  ).length;
                  const active = selectedTier === tier.id;
                  return (
                    <button
                      key={tier.id}
                      type="button"
                      onClick={() => setSelectedTier(tier.id)}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-bold border transition-colors cursor-pointer ${
                        active
                          ? tier.isFlashTier
                            ? 'bg-[#CC0C39] text-white border-[#CC0C39]'
                            : 'bg-[#00453E] text-white border-[#00453E]'
                          : tier.isFlashTier
                            ? 'bg-red-50 text-[#CC0C39] border-red-200 hover:bg-red-100'
                            : count > 0
                              ? 'bg-white text-zinc-900 border-zinc-300 hover:bg-zinc-100'
                              : 'bg-zinc-50 text-zinc-400 border-zinc-200 hover:bg-zinc-100'
                      }`}
                    >
                      {tier.isFlashTier && <Zap className="w-3.5 h-3.5 shrink-0" />}
                      <span>{isAr ? tier.labelAr(currencyUnit) : tier.labelEn(currencyUnit)}</span>
                      <span className="font-mono text-[10px] opacity-80">({count})</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Product Listing Area */}
            {selectedTier === 'all' ? (
              <div className="space-y-6">
                {groupedByTier.map(({ tier, items }) => (
                  <div key={tier.id} className="space-y-3">
                    <div
                      className={`flex flex-wrap items-center justify-between gap-2 px-4 py-2.5 rounded-lg border ${
                        tier.isFlashTier
                          ? 'bg-gradient-to-r from-[#CC0C39] to-[#99072A] text-white border-red-800'
                          : 'bg-white text-zinc-950 border-zinc-200'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        {tier.isFlashTier && <Zap className="w-4 h-4 text-[#FFD814]" />}
                        <h3 className="font-display text-sm sm:text-base font-extrabold">
                          {isAr ? tier.labelAr(currencyUnit) : tier.labelEn(currencyUnit)}
                        </h3>
                      </div>

                      {tier.isFlashTier ? (
                        <div className="inline-flex items-center gap-1.5 bg-black/30 px-2.5 py-1 rounded text-xs font-extrabold">
                          <Clock className="w-3.5 h-3.5 text-[#FFD814]" />
                          <span>{t.endsIn}:</span>
                          <span className="font-mono tabular-nums" dir="ltr">
                            {countdown.formatted}
                          </span>
                        </div>
                      ) : (
                        <span className="text-xs font-bold text-[#007600] tabular-nums">
                          {items.length} {isAr ? 'منتجات' : 'items'}
                        </span>
                      )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {items.map((product) => (
                        <DealProductCard
                          key={product.id}
                          product={product}
                          isAr={isAr}
                          buyNowLabel={t.buyNow}
                          onOpenProduct={onOpenProduct}
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="bg-white border border-dashed border-zinc-300 rounded-xl p-8 text-center">
                <p className="font-display text-lg font-extrabold text-zinc-900">
                  {t.comingSoonTitle}
                </p>
                <p className="mt-1 text-sm text-zinc-600">
                  {isAr
                    ? 'لا توجد منتجات في هذا النطاق السعري حالياً لهذا المتجر — انتظر أقوى الخصومات قريباً جداً.'
                    : 'No products in this exact price range for this store yet — check All Prices or wait for upcoming deals.'}
                </p>
                <button
                  type="button"
                  onClick={() => setSelectedTier('all')}
                  className="mt-4 px-5 py-2 bg-[#FFD814] hover:bg-[#F7CA00] text-zinc-950 font-extrabold text-xs sm:text-sm rounded-full border border-[#FCD200] cursor-pointer"
                >
                  {isAr ? 'عرض كل الأسعار المتوفرة' : 'Show All Available Prices'}
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredProducts.map((product) => (
                  <DealProductCard
                    key={product.id}
                    product={product}
                    isAr={isAr}
                    buyNowLabel={t.buyNow}
                    onOpenProduct={onOpenProduct}
                  />
                ))}
              </div>
            )}
          </>
        )}

        <p className="mt-6 text-xs text-zinc-600 leading-relaxed">{t.affiliateStatement}</p>
      </div>
    </section>
  );
};

interface DealProductCardProps {
  product: CatalogProduct;
  isAr: boolean;
  buyNowLabel: string;
  onOpenProduct: (id: string) => void;
}

const DealProductCard: React.FC<DealProductCardProps> = ({
  product,
  isAr,
  buyNowLabel,
  onOpenProduct,
}) => {
  const title = isAr ? product.titleAr : product.titleEn;
  const specs = isAr ? product.specsAr : product.specsEn;
  const badge = isAr ? product.discountBadgeAr : product.discountBadgeEn;

  return (
    <article className="bg-white border border-zinc-200 rounded-lg overflow-hidden flex flex-col justify-between shadow-xs hover:border-[#00453E] transition-colors">
      <div>
        <a
          href={product.affiliateUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="relative block aspect-[16/10] bg-zinc-50 border-b border-zinc-100 overflow-hidden group"
        >
          <img
            src={product.image}
            alt={title}
            loading="lazy"
            className={`w-full h-full group-hover:scale-105 transition-transform duration-300 ${
              product.containImage ? 'object-contain bg-white p-2.5' : 'object-cover'
            }`}
          />
          <span className="absolute top-2.5 start-2.5 bg-[#CC0C39] text-white text-[11px] font-extrabold px-2 py-0.5 rounded-xs shadow-xs tabular-nums">
            {badge}
          </span>
        </a>

        <div className="p-4">
          <div className="flex items-center justify-between gap-2 text-[11px] font-semibold text-zinc-500">
            <span>{product.brand}</span>
            <button
              type="button"
              onClick={() => onOpenProduct(product.id)}
              className="text-[#007185] hover:underline cursor-pointer"
            >
              {isAr ? 'صفحة المنتج' : 'Product Details'}
            </button>
          </div>

          <h4 className="mt-1 font-display text-sm sm:text-base font-bold text-zinc-950 leading-snug line-clamp-2">
            <a
              href={product.affiliateUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#C7511F] hover:underline"
            >
              {title}
            </a>
          </h4>

          <p className="mt-1 text-xs text-zinc-600 line-clamp-2">{specs}</p>

          <div className="mt-2.5 flex flex-wrap items-baseline gap-2" dir="ltr">
            <span className="font-display text-lg font-extrabold text-[#B12704] tabular-nums">
              {product.price}
            </span>
            {product.oldPrice && (
              <span className="text-xs text-zinc-500 line-through tabular-nums">
                {product.oldPrice}
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="px-4 pb-4 pt-1 flex items-center gap-2">
        <a
          href={product.affiliateUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 inline-flex items-center justify-center gap-1.5 px-4 py-2.5 min-h-[40px] bg-[#FFD814] hover:bg-[#F7CA00] active:bg-[#F0B800] text-zinc-950 border border-[#FCD200] text-xs sm:text-sm font-extrabold rounded-full transition-colors whitespace-nowrap"
        >
          <span>{buyNowLabel}</span>
          <ExternalLink className="w-3.5 h-3.5" />
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
