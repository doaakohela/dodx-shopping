import React, { useMemo, useState } from 'react';
import { ArrowLeft, CheckCircle2, Copy, ExternalLink, Landmark, Sparkles, Store, Tag } from 'lucide-react';
import { COUPONS_CATALOG, CouponOfferItem } from '../data/unifiedCatalog';
import { TranslationDict } from '../i18n/translations';
import { ShareButton } from './ShareButton';

interface CouponsViewProps {
  t: TranslationDict;
  isAr: boolean;
  onBackHome: () => void;
  onSelectStore: (storeId: string) => void;
}

type CouponFilter = 'all' | 'bank' | 'event' | 'portal';

export const CouponsView: React.FC<CouponsViewProps> = ({
  t,
  isAr,
  onBackHome,
  onSelectStore,
}) => {
  const [filter, setFilter] = useState<CouponFilter>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const filteredCoupons = useMemo(() => {
    if (filter === 'all') return COUPONS_CATALOG;
    if (filter === 'bank') {
      return COUPONS_CATALOG.filter((c) => c.type === 'bank' || c.type === 'code');
    }
    return COUPONS_CATALOG.filter((c) => c.type === filter);
  }, [filter]);

  const handleCopyAndGo = async (coupon: CouponOfferItem) => {
    if (coupon.code && navigator.clipboard?.writeText) {
      try {
        await navigator.clipboard.writeText(coupon.code);
        setCopiedId(coupon.id);
        window.setTimeout(() => setCopiedId((prev) => (prev === coupon.id ? null : prev)), 3000);
      } catch {
        // Fallback: still open store
      }
    }
    window.open(coupon.affiliateUrl, '_blank', 'noopener,noreferrer');
  };

  const tabs: Array<{ id: CouponFilter; labelEn: string; labelAr: string }> = [
    { id: 'all', labelEn: `All Coupons & Hubs (${COUPONS_CATALOG.length})`, labelAr: `كل الكوبونات والعروض (${COUPONS_CATALOG.length})` },
    { id: 'bank', labelEn: 'Bank Cards & Promo Codes', labelAr: 'أكواد البنوك والكوبونات' },
    { id: 'event', labelEn: 'White & Black Friday Hubs', labelAr: 'بوابات الجمعة البيضاء' },
    { id: 'portal', labelEn: 'Official Store Portals', labelAr: 'بوابات المتاجر الرسمية' },
  ];

  return (
    <section className="bg-[#EAEDED] min-h-screen px-3 sm:px-5 py-6">
      <div className="max-w-6xl mx-auto">
        <button
          type="button"
          onClick={onBackHome}
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#007185] hover:text-[#C7511F] hover:underline cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 rtl:rotate-180" />
          {t.backToDodx}
        </button>

        {/* Coupons Header Hero */}
        <div className="mt-4 bg-[#00453E] text-white rounded-xl p-5 sm:p-7 shadow-sm border border-emerald-900">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 bg-[#FFD814] text-zinc-950 text-xs font-extrabold px-3 py-1 rounded-sm">
                <Tag className="w-3.5 h-3.5" />
                <span>{isAr ? 'قسم الكوبونات والأكواد الموثقة' : 'VERIFIED COUPONS & BANK CODES'}</span>
              </div>
              <h1 className="mt-3 font-display text-2xl sm:text-3xl font-extrabold tracking-tight">
                {isAr
                  ? 'أحدث كوبونات الخصم وأكواد البطاقات البنكية وبوابات المتاجر'
                  : 'Verified Promo Codes, Bank Card Discounts & Store Portals'}
              </h1>
              <p className="mt-1.5 text-sm text-emerald-100 max-w-2xl">
                {isAr
                  ? 'انسخ كود الخصم بضغطة واحدة وانتقل مباشرة إلى المتجر الرسمي مع تطبيق خصومات الجمعة البيضاء وأكواد البنوك.'
                  : 'Copy verified promo codes in one click or explore official Black & White Friday event portals across our global partners.'}
              </p>
            </div>
            <button
              type="button"
              onClick={() => onSelectStore('amazon-eg')}
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-[#FFD814] hover:bg-[#F7CA00] text-zinc-950 text-sm font-extrabold rounded-full border border-[#FCD200] cursor-pointer shrink-0 whitespace-nowrap"
            >
              <Landmark className="w-4 h-4" />
              {isAr ? 'عروض أمازون مصر' : 'Browse Amazon Egypt'}
            </button>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="mt-5 flex flex-wrap items-center gap-2">
          {tabs.map((tab) => {
            const active = filter === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setFilter(tab.id)}
                className={`px-4 py-2 rounded-md text-xs sm:text-sm font-bold border transition-colors cursor-pointer ${
                  active
                    ? 'bg-[#00453E] text-white border-[#00453E]'
                    : 'bg-white text-zinc-800 border-zinc-300 hover:bg-zinc-50'
                }`}
              >
                {isAr ? tab.labelAr : tab.labelEn}
              </button>
            );
          })}
        </div>

        {/* Coupons Grid */}
        <div className="mt-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredCoupons.map((coupon) => {
            const title = isAr ? coupon.titleAr : coupon.titleEn;
            const desc = isAr ? coupon.descriptionAr : coupon.descriptionEn;
            const storeName = isAr ? coupon.storeNameAr : coupon.storeNameEn;
            const badge = isAr ? coupon.discountBadgeAr : coupon.discountBadgeEn;
            const isCopied = copiedId === coupon.id;

            return (
              <article
                key={coupon.id}
                className="bg-white border border-zinc-200 rounded-lg overflow-hidden shadow-xs flex flex-col justify-between hover:border-[#00453E] transition-colors"
              >
                <div>
                  <a
                    href={coupon.affiliateUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="relative block aspect-[16/9] bg-zinc-100 overflow-hidden group"
                  >
                    <img
                      src={coupon.image}
                      alt={title}
                      loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <span className="absolute top-2.5 start-2.5 bg-[#CC0C39] text-white text-xs font-extrabold px-2.5 py-1 rounded-xs shadow-xs">
                      {badge}
                    </span>
                    <span className="absolute bottom-2.5 start-2.5 inline-flex items-center gap-1 bg-zinc-950/80 text-white text-[11px] font-bold px-2 py-0.5 rounded-xs">
                      {coupon.type === 'bank' ? (
                        <Landmark className="w-3 h-3 text-[#FFD814]" />
                      ) : coupon.type === 'event' ? (
                        <Sparkles className="w-3 h-3 text-[#FFD814]" />
                      ) : (
                        <Store className="w-3 h-3 text-[#FFD814]" />
                      )}
                      {storeName}
                    </span>
                  </a>

                  <div className="p-4">
                    <h2 className="font-display text-base font-bold text-zinc-950 leading-snug">
                      <a
                        href={coupon.affiliateUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-[#C7511F] hover:underline"
                      >
                        {title}
                      </a>
                    </h2>
                    <p className="mt-1.5 text-xs sm:text-sm text-zinc-600 leading-relaxed">
                      {desc}
                    </p>

                    {coupon.code && (
                      <div className="mt-3 flex items-center justify-between gap-2 bg-emerald-50/70 border border-dashed border-emerald-400 rounded-md px-3 py-2">
                        <span className="text-xs font-semibold text-zinc-700">
                          {t.promoCodeLabel}
                        </span>
                        <code className="font-mono text-sm font-extrabold text-[#00453E] tracking-wider">
                          {coupon.code}
                        </code>
                      </div>
                    )}
                  </div>
                </div>

                <div className="px-4 pb-4 pt-1 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleCopyAndGo(coupon)}
                    className="flex-1 inline-flex items-center justify-center gap-1.5 px-4 py-2.5 min-h-[40px] bg-[#FFD814] hover:bg-[#F7CA00] text-zinc-950 border border-[#FCD200] text-xs sm:text-sm font-extrabold rounded-full transition-colors cursor-pointer whitespace-nowrap"
                  >
                    {coupon.code ? (
                      isCopied ? (
                        <>
                          <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                          {isAr ? `تم نسخ ${coupon.code}` : `Copied ${coupon.code}`}
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4" />
                          {t.copyCodeAndGo}
                        </>
                      )
                    ) : (
                      <>
                        <ExternalLink className="w-4 h-4" />
                        {t.buyNow}
                      </>
                    )}
                  </button>

                  <ShareButton
                    url={coupon.affiliateUrl}
                    shareId={coupon.id}
                    title={title}
                    discount={badge}
                    isAr={isAr}
                    dropDirection="up"
                  />
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
};
