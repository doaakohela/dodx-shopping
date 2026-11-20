import React, { useEffect, useState } from 'react';
import { ArrowLeft, Check, Copy, ExternalLink, ShieldCheck, Store as StoreIcon, Tag } from 'lucide-react';
import { ShareProductItem, Store } from '../types/coupons';
import { TranslationDict } from '../i18n/translations';
import { ShareButton } from './ShareButton';

interface ProductDetailViewProps {
  productId: string;
  stores: Store[];
  t: TranslationDict;
  isAr: boolean;
  onBackHome: () => void;
  onSelectStore: (storeId: string) => void;
  onOpenProduct: (id: string) => void;
}

export const ProductDetailView: React.FC<ProductDetailViewProps> = ({
  productId,
  stores,
  t,
  isAr,
  onBackHome,
  onSelectStore,
  onOpenProduct,
}) => {
  const [catalog, setCatalog] = useState<Record<string, ShareProductItem>>({});
  const [loading, setLoading] = useState(true);
  const [copiedCode, setCopiedCode] = useState(false);

  useEffect(() => {
    let active = true;
    const loadCatalog = async () => {
      try {
        setLoading(true);
        const res = await fetch('/api/share-catalog.json', { cache: 'no-cache' });
        if (res.ok) {
          const data = await res.json();
          if (active && data?.items) {
            setCatalog(data.items);
          }
        }
      } catch {
        // Fallback to coupons.json store data below
      } finally {
        if (active) setLoading(false);
      }
    };
    loadCatalog();
    return () => {
      active = false;
    };
  }, [productId]);

  const item: ShareProductItem | null = React.useMemo(() => {
    const direct = catalog[productId];
    if (direct) return direct;

    for (const store of stores) {
      const deal = store.deals.find((d) => d.id === productId);
      if (deal) {
        return {
          id: deal.id,
          title: deal.title,
          description: deal.description,
          price: deal.price,
          oldPrice: deal.oldPrice,
          discount: deal.discountLabel,
          code: deal.code,
          image: '/assets/images/hero_smart_shopping_1794810594006.jpg',
          storeId: store.id,
          storeName: store.name,
          affiliateUrl: deal.affiliateUrl || store.affiliateUrl,
        };
      }
      if (store.id === productId) {
        return {
          id: store.id,
          title: `${store.name} — Verified Coupons & Deals`,
          description: store.tagline,
          discount: `${store.deals.length} Verified Deals`,
          image: '/assets/images/hero_smart_shopping_1794810594006.jpg',
          storeId: store.id,
          storeName: store.name,
          affiliateUrl: store.affiliateUrl,
        };
      }
    }
    return null;
  }, [catalog, productId, stores]);

  useEffect(() => {
    if (!item) return;
    const displayTitle = isAr && item.titleAr ? item.titleAr : item.title;
    const displayDesc = isAr && item.descriptionAr ? item.descriptionAr : item.description;
    document.title = `${displayTitle}${item.price ? ` — ${item.price}` : ''} | Dodx`;

    const setMeta = (attr: 'property' | 'name', key: string, content: string) => {
      let el = document.querySelector(`meta[${attr}="${key}"]`) as HTMLMetaElement | null;
      if (!el) {
        el = document.createElement('meta');
        el.setAttribute(attr, key);
        document.head.appendChild(el);
      }
      el.setAttribute('content', content);
    };

    const origin = window.location.origin;
    const absImage = item.image.startsWith('http') ? item.image : `${origin}${item.image}`;
    setMeta('property', 'og:title', `${displayTitle}${item.discount ? ` (${item.discount})` : ''}`);
    setMeta('property', 'og:description', `${item.price ? `${item.price} — ` : ''}${displayDesc}`);
    setMeta('property', 'og:image', absImage);
    setMeta('property', 'og:url', `${origin}/p/${encodeURIComponent(item.id)}`);
    setMeta('name', 'twitter:title', `${displayTitle}${item.price ? ` — ${item.price}` : ''}`);
    setMeta('name', 'twitter:description', displayDesc);
    setMeta('name', 'twitter:image', absImage);
  }, [item, isAr]);

  const relatedItems = React.useMemo(() => {
    if (!item) return [];
    return Object.values(catalog)
      .filter((other) => other.id !== item.id && other.storeId === item.storeId)
      .slice(0, 4);
  }, [catalog, item]);

  const handleCopyCode = async (code: string) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopiedCode(true);
      window.setTimeout(() => setCopiedCode(false), 2000);
    } catch {
      // Ignore copy errors
    }
  };

  if (loading && !item) {
    return (
      <section className="max-w-5xl mx-auto px-4 py-10">
        <div className="bg-white border border-zinc-200 rounded-xl p-6 animate-pulse grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="h-80 bg-zinc-100 rounded-lg" />
          <div className="space-y-4">
            <div className="h-6 w-32 bg-zinc-200 rounded" />
            <div className="h-10 w-3/4 bg-zinc-200 rounded" />
            <div className="h-8 w-44 bg-zinc-200 rounded" />
            <div className="h-24 w-full bg-zinc-100 rounded" />
          </div>
        </div>
      </section>
    );
  }

  if (!item) {
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
        <div className="mt-6 bg-white border border-zinc-200 rounded-xl p-8 text-center">
          <h1 className="font-display text-2xl font-extrabold text-zinc-950">
            {isAr ? 'المنتج غير متوفر حالياً' : 'Product Deal Not Found'}
          </h1>
          <p className="mt-2 text-sm text-zinc-600">
            {isAr
              ? 'يمكنك تصفح أحدث العروض والكوبونات الموثقة من الصفحة الرئيسية.'
              : 'Browse the latest verified offers and coupons on Dodx.'}
          </p>
          <button
            type="button"
            onClick={onBackHome}
            className="mt-5 px-5 py-2.5 bg-[#FFD814] hover:bg-[#F7CA00] text-zinc-950 text-sm font-bold rounded-full border border-[#FCD200] cursor-pointer"
          >
            {t.backToDodx}
          </button>
        </div>
      </section>
    );
  }

  const displayTitle = isAr && item.titleAr ? item.titleAr : item.title;
  const displayDesc = isAr && item.descriptionAr ? item.descriptionAr : item.description;
  const displaySavings = isAr ? item.savingsAr : item.savingsEn;

  return (
    <section className="bg-[#EAEDED] min-h-screen px-3 sm:px-5 py-6">
      <div className="max-w-5xl mx-auto space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <button
            type="button"
            onClick={onBackHome}
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#007185] hover:text-[#C7511F] hover:underline cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 rtl:rotate-180" />
            {t.backToDodx}
          </button>
          <button
            type="button"
            onClick={() => onSelectStore(item.storeId)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-zinc-50 text-zinc-900 border border-zinc-300 rounded-full text-xs font-bold cursor-pointer"
          >
            <StoreIcon className="w-3.5 h-3.5 text-[#00453E]" />
            <span>{item.storeName}</span>
          </button>
        </div>

        <article className="bg-white border border-zinc-200 rounded-xl shadow-xs overflow-hidden grid grid-cols-1 md:grid-cols-2">
          <div className="relative bg-white p-6 sm:p-8 flex items-center justify-center border-b md:border-b-0 md:border-e border-zinc-200 min-h-[290px] sm:min-h-[360px]">
            <img
              src={item.image}
              alt={displayTitle}
              referrerPolicy="no-referrer"
              className="max-h-[320px] w-auto max-w-full object-contain"
            />
            {item.discount && (
              <span className="absolute top-4 start-4 px-3 py-1 bg-[#CC0C39] text-white font-display text-xs sm:text-sm font-extrabold rounded shadow-xs tabular-nums">
                {item.discount}
              </span>
            )}
            <span className="absolute bottom-4 start-4 px-2.5 py-1 bg-zinc-900 text-white text-xs font-bold rounded">
              {item.storeName}
            </span>
          </div>

          <div className="p-5 sm:p-7 flex flex-col justify-between gap-5">
            <div className="space-y-3">
              <div className="flex flex-wrap items-center gap-2 text-xs">
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded bg-emerald-50 text-emerald-900 border border-emerald-200 font-bold">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  {isAr ? 'عرض موثق على Dodx' : 'Verified Deal on Dodx'}
                </span>
                <span className="text-zinc-500 font-semibold">{item.storeName}</span>
              </div>

              <h1 className="font-display text-xl sm:text-2xl font-extrabold text-zinc-950 leading-snug">
                {displayTitle}
              </h1>

              {(item.price || item.oldPrice || displaySavings) && (
                <div className="p-3.5 rounded-lg bg-[#FFFBEB] border border-amber-200 flex flex-wrap items-baseline justify-between gap-2">
                  <div className="flex flex-wrap items-baseline gap-2.5">
                    {item.price && (
                      <span className="font-display text-2xl sm:text-3xl font-extrabold text-[#B12704] tabular-nums">
                        {item.price}
                      </span>
                    )}
                    {item.oldPrice && (
                      <span className="text-sm text-zinc-500 line-through tabular-nums">
                        {item.oldPrice}
                      </span>
                    )}
                  </div>
                  {displaySavings && (
                    <span className="px-2.5 py-1 rounded bg-emerald-100 text-emerald-900 text-xs font-extrabold">
                      {displaySavings}
                    </span>
                  )}
                </div>
              )}

              <p className="text-sm text-zinc-700 leading-relaxed">{displayDesc}</p>

              {item.code && (
                <div className="flex items-center justify-between gap-3 bg-zinc-50 border border-dashed border-zinc-400 rounded-lg px-4 py-2.5">
                  <div>
                    <span className="block text-[11px] font-semibold text-zinc-500">
                      {t.promoCodeLabel}
                    </span>
                    <code className="font-mono text-base font-extrabold text-zinc-950 tracking-wider">
                      {item.code}
                    </code>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleCopyCode(item.code!)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-white hover:bg-zinc-100 border border-zinc-300 text-xs font-bold text-zinc-900 cursor-pointer"
                  >
                    {copiedCode ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span>{isAr ? 'تم النسخ' : 'Copied'}</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>{isAr ? 'نسخ الكود' : 'Copy Code'}</span>
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-2.5 pt-2 border-t border-zinc-200">
              <a
                href={item.affiliateUrl}
                target="_blank"
                rel="nofollow noopener noreferrer"
                className="flex-1 min-w-[200px] inline-flex items-center justify-center gap-2 px-5 py-3 bg-[#FFD814] hover:bg-[#F7CA00] text-zinc-950 border border-[#FCD200] text-sm font-extrabold rounded-full transition-colors whitespace-nowrap"
              >
                <Tag className="w-4 h-4" />
                <span>
                  {isAr ? `الانتقال للعرض في ${item.storeName}` : `Get Deal at ${item.storeName}`}
                </span>
                <ExternalLink className="w-4 h-4" />
              </a>

              <ShareButton
                url={item.affiliateUrl}
                shareId={item.id}
                title={displayTitle}
                price={item.price}
                oldPrice={item.oldPrice}
                discount={item.discount}
                isAr={isAr}
                dropDirection="up"
              />
            </div>
          </div>
        </article>

        {relatedItems.length > 0 && (
          <div className="bg-white border border-zinc-200 rounded-xl p-4 sm:p-5">
            <h2 className="font-display text-base sm:text-lg font-extrabold text-zinc-950 mb-3">
              {isAr ? `عروض أخرى من ${item.storeName}` : `More Deals from ${item.storeName}`}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {relatedItems.map((rel) => {
                const relTitle = isAr && rel.titleAr ? rel.titleAr : rel.title;
                return (
                  <button
                    key={rel.id}
                    type="button"
                    onClick={() => onOpenProduct(rel.id)}
                    className="text-start rounded-lg border border-zinc-200 hover:border-[#007185] p-3 flex flex-col justify-between gap-2 transition-colors cursor-pointer bg-white"
                  >
                    <div>
                      <div className="relative h-32 bg-white flex items-center justify-center mb-2">
                        <img
                          src={rel.image}
                          alt={relTitle}
                          referrerPolicy="no-referrer"
                          className="max-h-full max-w-full object-contain"
                        />
                        {rel.discount && (
                          <span className="absolute top-0 start-0 px-2 py-0.5 text-[10px] font-extrabold bg-[#CC0C39] text-white rounded">
                            {rel.discount}
                          </span>
                        )}
                      </div>
                      <h3 className="font-display text-xs font-bold text-zinc-950 line-clamp-2">
                        {relTitle}
                      </h3>
                    </div>
                    {rel.price && (
                      <p className="font-display text-sm font-extrabold text-[#B12704]">
                        {rel.price}
                      </p>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
