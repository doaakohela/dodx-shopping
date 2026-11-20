import React, { useEffect, useMemo, useState } from 'react';
import {
  ArrowLeft,
  ExternalLink,
  LayoutGrid,
  Search,
  X,
} from 'lucide-react';
import {
  PRODUCT_DEPARTMENTS,
  ProductBrand,
  ProductDepartment,
  ProductSubcategory,
} from '../data/productCatalog';
import { LanguageCode, TranslationDict } from '../i18n/translations';
import { ShareButton } from './ShareButton';
import {
  matchesMultilingualQuery,
  scoreMultilingualMatch,
} from '../utils/multilingualSearch';

interface ProductsViewProps {
  lang: LanguageCode;
  t: TranslationDict;
  initialDeptId?: string | null;
  onBackHome: () => void;
  onSelectStore: (storeId: string) => void;
}

export const ProductsView: React.FC<ProductsViewProps> = ({
  lang,
  t,
  initialDeptId,
  onBackHome,
  onSelectStore,
}) => {
  const isAr = lang === 'ar';
  const [selectedDeptId, setSelectedDeptId] = useState<string>(
    initialDeptId && PRODUCT_DEPARTMENTS.some((d) => d.id === initialDeptId)
      ? initialDeptId
      : 'tech'
  );
  const [selectedSubId, setSelectedSubId] = useState<string>('all');
  const [brandQuery, setBrandQuery] = useState('');

  useEffect(() => {
    if (initialDeptId && PRODUCT_DEPARTMENTS.some((d) => d.id === initialDeptId)) {
      setSelectedDeptId(initialDeptId);
      setSelectedSubId('all');
    }
  }, [initialDeptId]);

  const activeDept: ProductDepartment = useMemo(
    () =>
      PRODUCT_DEPARTMENTS.find((d) => d.id === selectedDeptId) ||
      PRODUCT_DEPARTMENTS[0],
    [selectedDeptId]
  );

  const trimmedQuery = brandQuery.trim();

  const displayedGroups = useMemo(() => {
    if (trimmedQuery) {
      const scored: Array<{
        score: number;
        dept: ProductDepartment;
        sub: ProductSubcategory;
        brands: ProductBrand[];
      }> = [];

      for (const dept of PRODUCT_DEPARTMENTS) {
        const deptText = `${dept.id} ${dept.nameEn} ${dept.nameAr} ${dept.descriptionEn} ${dept.descriptionAr}`;
        const deptScore = scoreMultilingualMatch(deptText, trimmedQuery);

        for (const sub of dept.subcategories) {
          const subText = `${sub.id} ${sub.nameEn} ${sub.nameAr} ${sub.descriptionEn} ${sub.descriptionAr}`;
          const subScore = scoreMultilingualMatch(subText, trimmedQuery);

          const matchedBrands = sub.brands
            .map((b) => {
              const brandText = `${b.id} ${b.name} ${b.taglineEn} ${b.taglineAr} ${b.partnerLabelEn} ${b.partnerLabelAr}`;
              const bScore = scoreMultilingualMatch(brandText, trimmedQuery);
              const total = Math.max(bScore, subScore > 0 ? subScore : 0, deptScore > 0 ? Math.min(deptScore, 40) : 0);
              return { brand: b, score: total };
            })
            .filter(({ score }) => score > 0 || matchesMultilingualQuery(`${deptText} ${subText}`, trimmedQuery))
            .sort((a, b) => b.score - a.score);

          if (matchedBrands.length > 0) {
            const groupScore = Math.max(
              subScore,
              deptScore,
              ...matchedBrands.map((m) => m.score)
            );
            scored.push({
              score: groupScore,
              dept,
              sub,
              brands: matchedBrands.map((m) => m.brand),
            });
          }
        }
      }

      return scored.sort((a, b) => b.score - a.score);
    }

    const subs =
      selectedSubId === 'all'
        ? activeDept.subcategories
        : activeDept.subcategories.filter((s) => s.id === selectedSubId);

    return subs.map((sub) => ({
      score: 1,
      dept: activeDept,
      sub,
      brands: sub.brands,
    }));
  }, [activeDept, selectedSubId, trimmedQuery]);

  const handleSelectDept = (deptId: string) => {
    setSelectedDeptId(deptId);
    setSelectedSubId('all');
    setBrandQuery('');
  };

  return (
    <section className="bg-[#EAEDED] min-h-screen px-3 sm:px-5 py-5">
      <div className="max-w-7xl mx-auto space-y-4">
        {/* Top Breadcrumb + Multilingual Search */}
        <div className="bg-white border border-zinc-200 rounded-sm p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <button
              type="button"
              onClick={onBackHome}
              className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-[#007185] hover:text-[#C7511F] hover:underline cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4 rtl:rotate-180" />
              {t.backToDodx}
            </button>
            <h1 className="mt-1 font-display text-xl sm:text-2xl font-extrabold tracking-tight text-zinc-950">
              {t.productsPageTitle}
            </h1>
          </div>

          <div className="w-full md:w-96 shrink-0">
            <label htmlFor="products-brand-search" className="sr-only">
              {t.searchBrandsPlaceholder}
            </label>
            <div className="relative flex items-center bg-[#FAFAFA] border border-zinc-300 rounded-md overflow-hidden focus-within:bg-white focus-within:ring-2 focus-within:ring-[#00453E]">
              <Search className="w-4 h-4 text-zinc-500 ms-3 shrink-0" />
              <input
                id="products-brand-search"
                type="search"
                value={brandQuery}
                onChange={(e) => setBrandQuery(e.target.value)}
                placeholder={t.searchBrandsPlaceholder}
                className="w-full px-2.5 py-2.5 text-base sm:text-xs text-zinc-950 placeholder:text-zinc-500 bg-transparent focus:outline-none"
              />
              {brandQuery && (
                <button
                  type="button"
                  onClick={() => setBrandQuery('')}
                  aria-label={t.clearAllFilters}
                  className="px-2.5 text-zinc-500 hover:text-zinc-900 cursor-pointer shrink-0"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* All Departments: Clean Image + Short Label Visual Grid */}
        <div className="bg-white border border-zinc-200 rounded-sm p-4 sm:p-5">
          <div className="flex items-center justify-between gap-2 mb-3">
            <div className="flex items-center gap-2">
              <LayoutGrid className="w-4 h-4 text-[#00453E]" />
              <h2 className="font-display text-base sm:text-lg font-extrabold text-zinc-950">
                {t.allDepartmentsLabel}
              </h2>
            </div>
          </div>

          <div className="grid grid-cols-2 @md/main:grid-cols-4 @4xl/main:grid-cols-8 gap-2.5">
            {PRODUCT_DEPARTMENTS.map((dept) => {
              const active = !trimmedQuery && dept.id === activeDept.id;
              return (
                <button
                  key={dept.id}
                  type="button"
                  onClick={() => handleSelectDept(dept.id)}
                  className={`group text-start rounded-sm overflow-hidden border transition-all cursor-pointer flex flex-col bg-white ${
                    active
                      ? 'border-[#00453E] ring-2 ring-[#00453E]/25 shadow-sm'
                      : 'border-zinc-200 hover:border-[#007185] hover:shadow-xs'
                  }`}
                >
                  <div className="aspect-[4/3] w-full overflow-hidden bg-zinc-100">
                    <img
                      src={dept.image}
                      alt={isAr ? dept.nameAr : dept.nameEn}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                    />
                  </div>
                  <div
                    className={`px-2 py-2 flex-1 flex items-center justify-center text-center ${
                      active ? 'bg-[#00453E] text-white' : 'bg-white text-zinc-900'
                    }`}
                  >
                    <span className="text-[11px] sm:text-xs font-bold leading-snug line-clamp-2">
                      {isAr ? dept.nameAr : dept.nameEn}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Active Department Subcategories Visual Grid (Photo + Short Name) */}
        {!trimmedQuery && (
          <div className="bg-white border border-zinc-200 rounded-sm p-4 sm:p-5">
            <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-zinc-200">
              <h2 className="font-display text-lg sm:text-xl font-extrabold text-zinc-950">
                {isAr ? activeDept.nameAr : activeDept.nameEn}
              </h2>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedSubId('all')}
                  className={`px-3 py-1 rounded-full text-xs font-bold border transition-colors cursor-pointer whitespace-nowrap ${
                    selectedSubId === 'all'
                      ? 'bg-[#00453E] text-white border-[#00453E]'
                      : 'bg-zinc-100 text-zinc-800 border-zinc-300 hover:bg-zinc-200'
                  }`}
                >
                  {t.allOption} ({activeDept.subcategories.length})
                </button>
                <button
                  type="button"
                  onClick={() => onSelectStore('amazon')}
                  className="px-3 py-1 text-xs font-bold bg-zinc-100 hover:bg-zinc-200 text-zinc-900 border border-zinc-300 rounded-full cursor-pointer whitespace-nowrap"
                >
                  Amazon US
                </button>
                <button
                  type="button"
                  onClick={() => onSelectStore('amazon-uae')}
                  className="px-3 py-1 text-xs font-bold bg-[#131921] hover:bg-zinc-800 text-[#FF9900] border border-[#FF9900]/50 rounded-full cursor-pointer whitespace-nowrap"
                >
                  Amazon UAE
                </button>
                <button
                  type="button"
                  onClick={() => onSelectStore('amazon-eg')}
                  className="px-3 py-1 text-xs font-bold bg-[#131921] hover:bg-zinc-800 text-[#FF9900] border border-[#FF9900]/50 rounded-full cursor-pointer whitespace-nowrap"
                >
                  Amazon Egypt
                </button>
                <button
                  type="button"
                  onClick={() => onSelectStore('amazon-jp')}
                  className="px-3 py-1 text-xs font-bold bg-[#131921] hover:bg-zinc-800 text-[#FF9900] border border-[#FF9900]/50 rounded-full cursor-pointer whitespace-nowrap"
                >
                  Amazon Japan
                </button>
                <button
                  type="button"
                  onClick={() => onSelectStore('aliexpress')}
                  className="px-3 py-1 text-xs font-bold bg-zinc-100 hover:bg-zinc-200 text-zinc-900 border border-zinc-300 rounded-full cursor-pointer whitespace-nowrap"
                >
                  AliExpress WW
                </button>
                <a
                  href="https://rzekl.com/g/pm1aev55cld2ceec5c68219aa26f6f/"
                  target="_blank"
                  rel="nofollow noopener noreferrer"
                  className="px-3 py-1 text-xs font-bold bg-[#FF6A00] hover:bg-[#e85f00] text-white border border-[#FF6A00] rounded-full cursor-pointer whitespace-nowrap"
                >
                  Alibaba WW
                </a>
                <a
                  href="https://tjzuh.com/g/ea3sq3dsmld2ceec5c68e452830f0f/"
                  target="_blank"
                  rel="nofollow noopener noreferrer"
                  className="px-3 py-1 text-xs font-bold bg-[#E2231A] hover:bg-[#c51c14] text-white border border-[#E2231A] rounded-full cursor-pointer whitespace-nowrap"
                >
                  Lenovo India
                </a>
              </div>
            </div>

            <div className="mt-3.5 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
              {activeDept.subcategories.map((sub) => {
                const isSelected = selectedSubId === sub.id;
                return (
                  <button
                    key={sub.id}
                    type="button"
                    onClick={() =>
                      setSelectedSubId((prev) => (prev === sub.id ? 'all' : sub.id))
                    }
                    className={`group text-start rounded-sm overflow-hidden border transition-all cursor-pointer flex flex-col ${
                      isSelected
                        ? 'border-[#00453E] ring-2 ring-[#FF9900]/70 bg-emerald-50/30'
                        : 'border-zinc-200 hover:border-[#007185] bg-[#FAFAFA] hover:bg-white'
                    }`}
                  >
                    <div className="aspect-square w-full overflow-hidden bg-zinc-100">
                      <img
                        src={sub.image}
                        alt={isAr ? sub.nameAr : sub.nameEn}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                      />
                    </div>
                    <div className="p-2.5 flex items-center justify-between gap-1.5">
                      <span className="text-xs font-bold text-zinc-900 group-hover:text-[#C7511F] leading-snug line-clamp-2">
                        {isAr ? sub.nameAr : sub.nameEn}
                      </span>
                      <span className="text-[10px] font-bold text-zinc-500 bg-zinc-100 px-1.5 py-0.5 rounded shrink-0 tabular-nums">
                        {sub.brands.length}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Subcategories & Global Brands Cards */}
        {displayedGroups.length === 0 ? (
          <div className="bg-white border border-zinc-200 rounded-sm p-10 text-center">
            <p className="text-sm font-semibold text-zinc-900">
              {t.noCouponsMatch}
            </p>
            <button
              type="button"
              onClick={() => setBrandQuery('')}
              className="mt-3 px-4 py-2 bg-[#FFD814] hover:bg-[#F7CA00] text-zinc-950 text-xs font-bold rounded-full border border-[#FCD200] cursor-pointer"
            >
              {t.resetSearch}
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {displayedGroups.map(({ dept, sub, brands }) => {
              const bannerBrands = brands.filter((b) => b.featuredAdmitadBanner);
              return (
                <div
                  key={`${dept.id}-${sub.id}`}
                  className="bg-white border border-zinc-200 rounded-sm p-4 sm:p-5"
                >
                  {/* Crisp Header with Subcategory Thumbnail + Short Title */}
                  <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-zinc-200">
                    <div className="flex items-center gap-3 min-w-0">
                      <img
                        src={sub.image}
                        alt={isAr ? sub.nameAr : sub.nameEn}
                        className="w-12 h-12 rounded-sm object-cover border border-zinc-200 shrink-0"
                      />
                      <div className="min-w-0">
                        <span className="text-[11px] font-bold text-[#007185]">
                          {isAr ? dept.nameAr : dept.nameEn}
                        </span>
                        <h3 className="font-display text-base sm:text-lg font-extrabold text-zinc-950 truncate">
                          {isAr ? sub.nameAr : sub.nameEn}
                        </h3>
                      </div>
                    </div>

                    <span className="text-xs font-bold text-zinc-600 tabular-nums">
                      {brands.length} {t.brandsLabel}
                    </span>
                  </div>

                  {/* Official Partner Subsections with Admitad Banners */}
                  {bannerBrands.map((partnerBrand) => {
                    const banner = partnerBrand.featuredAdmitadBanner!;
                    return (
                      <div
                        key={partnerBrand.id}
                        id={`${partnerBrand.id}-banner`}
                        className="mt-4 rounded-md border border-[#00453E]/25 bg-[#F8FAF9] p-3.5 sm:p-4"
                      >
                        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                          <div className="space-y-2 max-w-md">
                            <span className="inline-block px-2 py-0.5 text-[11px] font-extrabold bg-[#00453E] text-[#FFD814] rounded">
                              {t.officialPartnerBanner} · {banner.alt}
                            </span>
                            <h4 className="font-display text-lg sm:text-xl font-extrabold text-zinc-950">
                              {partnerBrand.name}
                            </h4>
                            {(isAr ? partnerBrand.priceAr : partnerBrand.priceEn) && (
                              <div className="flex flex-wrap items-baseline gap-2">
                                <span className="font-display text-lg font-extrabold text-[#B12704]">
                                  {isAr ? partnerBrand.priceAr : partnerBrand.priceEn}
                                </span>
                                {(isAr ? partnerBrand.oldPriceAr : partnerBrand.oldPriceEn) && (
                                  <span className="text-xs text-zinc-500 line-through">
                                    {isAr ? partnerBrand.oldPriceAr : partnerBrand.oldPriceEn}
                                  </span>
                                )}
                              </div>
                            )}
                            <p className="text-xs text-zinc-700">
                              {isAr ? partnerBrand.taglineAr : partnerBrand.taglineEn}
                            </p>
                            <div className="flex flex-wrap items-center gap-2 pt-0.5">
                              <a
                                href={partnerBrand.affiliateUrl}
                                target="_blank"
                                rel="nofollow noopener noreferrer"
                                className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#FFD814] hover:bg-[#F7CA00] text-zinc-950 border border-[#FCD200] text-xs font-bold rounded-full transition-colors whitespace-nowrap"
                              >
                                <span>
                                  {isAr
                                    ? partnerBrand.partnerLabelAr
                                    : partnerBrand.partnerLabelEn}
                                </span>
                                <ExternalLink className="w-3.5 h-3.5" />
                              </a>
                              <ShareButton
                                url={partnerBrand.affiliateUrl}
                                shareId={partnerBrand.id}
                                title={partnerBrand.name}
                                price={isAr ? partnerBrand.priceAr : partnerBrand.priceEn}
                                oldPrice={isAr ? partnerBrand.oldPriceAr : partnerBrand.oldPriceEn}
                                discount={isAr ? partnerBrand.partnerLabelAr : partnerBrand.partnerLabelEn}
                                isAr={isAr}
                                dropDirection="down"
                              />
                            </div>
                          </div>

                          <div className="flex justify-center lg:justify-end">
                            <a
                              target="_blank"
                              rel="nofollow noopener noreferrer"
                              href={banner.href}
                              className={`block ${
                                banner.imgHeight > banner.imgWidth * 2
                                  ? 'max-w-[130px]'
                                  : banner.imgHeight > banner.imgWidth
                                    ? 'max-w-[200px]'
                                    : banner.imgWidth <= 320
                                      ? 'max-w-[300px]'
                                      : 'max-w-[380px]'
                              } w-full rounded-md overflow-hidden border border-zinc-200 shadow-xs hover:shadow-md transition-shadow bg-white`}
                            >
                              <img
                                width={banner.imgWidth}
                                height={banner.imgHeight}
                                src={banner.imgSrc}
                                alt={banner.alt}
                                referrerPolicy="no-referrer"
                                className="w-full h-auto block border-0"
                              />
                            </a>
                          </div>
                        </div>
                      </div>
                    );
                  })}

                  {/* Clean Global Brands Bento Cards */}
                  <div className="mt-4 grid grid-cols-2 @md/main:grid-cols-3 @3xl/main:grid-cols-4 @5xl/main:grid-cols-5 gap-3">
                    {brands.map((brand) => (
                      <div
                        key={brand.id}
                        className="group border border-zinc-200 hover:border-[#00453E] bg-[#FAFAFA] hover:bg-white rounded-sm p-3 flex flex-col justify-between gap-2.5 transition-all hover:shadow-xs"
                      >
                        <a
                          href={brand.affiliateUrl}
                          target="_blank"
                          rel={
                            brand.featuredAdmitadBanner
                              ? 'nofollow noopener noreferrer'
                              : 'noopener noreferrer'
                          }
                          className="block"
                        >
                          <div className="flex items-center justify-between gap-1.5">
                            <h4 className="font-display text-xs sm:text-sm font-extrabold text-zinc-950 group-hover:text-[#00453E] line-clamp-1">
                              {brand.name}
                            </h4>
                            <ExternalLink className="w-3.5 h-3.5 text-zinc-400 group-hover:text-[#00453E] shrink-0" />
                          </div>
                          {(isAr ? brand.priceAr : brand.priceEn) && (
                            <div className="mt-1 flex flex-wrap items-baseline gap-1.5">
                              <span className="font-display text-xs sm:text-sm font-extrabold text-[#B12704]">
                                {isAr ? brand.priceAr : brand.priceEn}
                              </span>
                              {(isAr ? brand.oldPriceAr : brand.oldPriceEn) && (
                                <span className="text-[11px] text-zinc-500 line-through">
                                  {isAr ? brand.oldPriceAr : brand.oldPriceEn}
                                </span>
                              )}
                            </div>
                          )}
                          <p className="mt-1 text-[11px] text-zinc-600 leading-snug line-clamp-2">
                            {isAr ? brand.taglineAr : brand.taglineEn}
                          </p>
                        </a>

                        <div className="flex items-center gap-1.5">
                          <a
                            href={brand.affiliateUrl}
                            target="_blank"
                            rel={
                              brand.featuredAdmitadBanner
                                ? 'nofollow noopener noreferrer'
                                : 'noopener noreferrer'
                            }
                            className="flex-1 inline-flex items-center justify-center py-1.5 px-2.5 bg-[#FFD814] hover:bg-[#F7CA00] text-zinc-950 border border-[#FCD200] text-[11px] font-bold rounded-full transition-colors truncate"
                          >
                            {isAr ? brand.partnerLabelAr : brand.partnerLabelEn}
                          </a>
                          <ShareButton
                            url={brand.affiliateUrl}
                            shareId={brand.id}
                            title={brand.name}
                            price={isAr ? brand.priceAr : brand.priceEn}
                            oldPrice={isAr ? brand.oldPriceAr : brand.oldPriceEn}
                            discount={isAr ? brand.partnerLabelAr : brand.partnerLabelEn}
                            isAr={isAr}
                            compact
                            dropDirection="up"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};
