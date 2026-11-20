import React from 'react';
import { ArrowLeft, CheckCircle2, Copy, ExternalLink, Store as StoreIcon } from 'lucide-react';
import { Deal, Store } from '../types/coupons';
import { TranslationDict } from '../i18n/translations';
import { StoreLogo } from './StoreLogo';
import { ShareButton } from './ShareButton';

interface DealsViewProps {
  storeParam: string;
  stores: Store[];
  t: TranslationDict;
  onBackHome: () => void;
  onSelectStore: (storeId: string) => void;
  onActivateDeal: (deal: Deal, store: Store) => void;
}

const DEAL_THUMBNAILS: Record<string, string> = {
  'amz-1': '/assets/images/promo_blackfriday_gifts_1794811010711.jpg',
  'amz-2': '/assets/images/promo_electronics_tech_1794811009540.jpg',
  'amz-3': '/assets/images/deal_home_organize_1794811011993.jpg',
  'amz-4': '/assets/images/hero_smart_shopping_1794810594006.jpg',
  'amz-5': '/assets/banners/amazon-laptop-screen-extender.jpg',
  'amz-6': '/assets/banners/amazon-macbook-pro-2026.jpg',
  'amz-7': '/assets/banners/amazon-iphone-17-pro-max.jpg',
  'amz-8': '/assets/banners/amazon-tagry-headphones.jpg',
  'amz-9': '/assets/banners/amazon-bf-nothing-phone-3.jpg',
  'amz-bf-phones': '/assets/banners/amazon-bf-moto-g-stylus-2025.jpg',
  'amz-bf-moto-stylus-25': '/assets/banners/amazon-bf-moto-g-stylus-2025.jpg',
  'amz-bf-moto-play': '/assets/banners/amazon-bf-moto-g-play.jpg',
  'amz-bf-nuu-b40': '/assets/banners/amazon-bf-nuu-b40-5g.jpg',
  'amz-bf-moto-stylus-26': '/assets/banners/amazon-bf-moto-g-stylus-2026.jpg',
  'amz-bf-razr-plus': '/assets/banners/amazon-bf-moto-razr-plus-2024.jpg',
  'amz-bf-razr-ultra-26': '/assets/banners/amazon-bf-moto-razr-ultra-2026.jpg',
  'amz-bf-samsung': '/assets/banners/amazon-bf-samsung-xcover7-pro.jpg',
  'amz-bf-samsung-xcover7': '/assets/banners/amazon-bf-samsung-xcover7-pro.jpg',
  'amz-bf-samsung-zfold8': '/assets/banners/amazon-bf-samsung-z-fold8.jpg',
  'amz-bf-samsung-s26fe': '/assets/banners/amazon-bf-samsung-s26-fe.jpg',
  'amz-bf-samsung-a37': '/assets/banners/amazon-bf-samsung-a37.jpg',
  'amz-bf-pixel-11-pro': '/assets/banners/amazon-bf-google-pixel-11-pro.jpg',
  'amz-bf-fairphone-6p': '/assets/banners/amazon-bf-fairphone-6-plus.jpg',
  'amz-bf-tcl-nxtpaper': '/assets/banners/amazon-bf-tcl-nxtpaper-70-pro.jpg',
  'amz-bf-blackview-w10': '/assets/banners/amazon-bf-blackview-wave-10.jpg',
  'amz-bf-ulefone-x16p': '/assets/banners/amazon-bf-ulefone-armor-x16-pro.jpg',
  'amz-bf-nothing-4ap': '/assets/banners/amazon-bf-nothing-phone-4a-pro.jpg',
  'amz-ae-store': '/assets/images/hero_smart_shopping_1794810594006.jpg',
  'amz-ae-1': '/assets/banners/amazon-ae-iphone-duo.jpg',
  'amz-ae-2': '/assets/banners/amazon-ae-galaxy-s26-ultra.jpg',
  'amz-eg-store': '/assets/images/promo_blackfriday_gifts_1794811010711.jpg',
  'amz-eg-swype': '/assets/images/promo_blackfriday_gifts_1794811010711.jpg',
  'amz-eg-abk': '/assets/images/hero_smart_shopping_1794810594006.jpg',
  'amz-eg-qnb': '/assets/images/promo_electronics_tech_1794811009540.jpg',
  'amz-eg-3': '/assets/banners/amazon-eg-sokany-sk100a.jpg',
  'amz-eg-4': '/assets/banners/amazon-eg-iphone-17e.jpg',
  'amz-eg-5': '/assets/banners/amazon-eg-iphone-duo-sky.jpg',
  'amz-eg-wf-mobiles': '/assets/banners/amazon-eg-samsung-a37.jpg',
  'amz-eg-samsung-a37': '/assets/banners/amazon-eg-samsung-a37.jpg',
  'amz-eg-infinix-smart20': '/assets/banners/amazon-eg-infinix-smart-20.jpg',
  'amz-eg-redmi-17': '/assets/banners/amazon-eg-redmi-17.jpg',
  'amz-eg-honor-x9d': '/assets/banners/amazon-eg-honor-x9d.jpg',
  'amz-eg-redmi-17-5g': '/assets/banners/amazon-eg-redmi-17-5g.jpg',
  'amz-eg-samsung-a08': '/assets/banners/amazon-eg-samsung-a08.jpg',
  'amz-eg-samsung-a57': '/assets/banners/amazon-eg-samsung-a57.jpg',
  'amz-eg-oppo-reno16f': '/assets/banners/amazon-eg-oppo-reno-16f.jpg',
  'amz-eg-samsung-a17': '/assets/banners/amazon-eg-samsung-a17.jpg',
  'amz-eg-realme-c85pro': '/assets/banners/amazon-eg-realme-c85-pro.jpg',
  'amz-eg-oppo-a6': '/assets/banners/amazon-eg-oppo-a6.jpg',
  'amz-eg-samsung-s25u': '/assets/banners/amazon-eg-samsung-s25-ultra.jpg',
  'amz-eg-xiaomi-17t': '/assets/banners/amazon-eg-xiaomi-17t.jpg',
  'amz-eg-honor-600lite': '/assets/banners/amazon-eg-honor-600-lite.jpg',
  'amz-eg-honor-x5c': '/assets/banners/amazon-eg-honor-x5c-plus.jpg',
  'amz-eg-redmi-note17pro': '/assets/banners/amazon-eg-redmi-note-17-pro.jpg',
  'amz-eg-iphone-17': '/assets/banners/amazon-eg-iphone-17.jpg',
  'amz-eg-apple-wf': '/assets/banners/amazon-eg-iphone17-promax.jpg',
  'amz-eg-iphone17-promax': '/assets/banners/amazon-eg-iphone17-promax.jpg',
  'amz-eg-iphone17-pro': '/assets/banners/amazon-eg-iphone17-pro.jpg',
  'amz-eg-iphone17e-512': '/assets/banners/amazon-eg-iphone17e-512.jpg',
  'amz-eg-iphone-air': '/assets/banners/amazon-eg-iphone-air.jpg',
  'amz-eg-iphone16-plus': '/assets/banners/amazon-eg-iphone16-plus.jpg',
  'amz-eg-iphone16-pink': '/assets/banners/amazon-eg-iphone16-pink.jpg',
  'amz-eg-apple-60w': '/assets/banners/amazon-eg-apple-60w-adapter.jpg',
  'amz-eg-apple-20w': '/assets/banners/amazon-eg-apple-20w-adapter.jpg',
  'amz-eg-apple-cable': '/assets/banners/amazon-eg-apple-usbc-cable.jpg',
  'amz-jp-blackfriday-dates': '/assets/aistudio/image_b648bbfa.png',
  'amz-jp-store': '/assets/aistudio/image_a7d4a6c8.png',
  'amz-jp-coupons': '/assets/aistudio/image_a7d4a6c8.png',
  'amz-jp-miracase-13': '/assets/banners/amazon-jp-miracase-iphone13.jpg',
  'amz-jp-poco-x8': '/assets/banners/amazon-jp-xiaomi-poco-x8-pro.jpg',
  'amz-jp-xiaomi-17t': '/assets/banners/amazon-jp-xiaomi-17t-pro.jpg',
  'amz-jp-iphone-16': '/assets/banners/amazon-jp-iphone-16.jpg',
  'amz-jp-galaxy-s25': '/assets/banners/amazon-jp-galaxy-s25.jpg',
  'amz-jp-aquos-sense9': '/assets/banners/amazon-jp-aquos-sense9.jpg',
  'amz-jp-moto-edge60': '/assets/banners/amazon-jp-moto-edge-60-pro.jpg',
  'amz-jp-xperia-10': '/assets/banners/amazon-jp-xperia-10-vi.jpg',
  'amz-jp-galaxy-a25': '/assets/banners/amazon-jp-galaxy-a25.jpg',
  'ali-1': '/assets/images/deal_gadgets_audio_1794811011337.jpg',
  'ali-2': '/assets/images/promo_electronics_tech_1794811009540.jpg',
  'ali-3': '/assets/images/deal_accessories_bag_1794811012527.jpg',
  'alib-1': '/assets/images/hero_smart_shopping_1794810594006.jpg',
  'alib-2': '/assets/images/promo_blackfriday_gifts_1794811010711.jpg',
  'alib-3': '/assets/images/promo_electronics_tech_1794811009540.jpg',
  'lenovo-1': '/assets/images/promo_electronics_tech_1794811009540.jpg',
  'lenovo-2': '/assets/images/hero_smart_shopping_1794810594006.jpg',
  'parallels-1': '/assets/images/promo_electronics_tech_1794811009540.jpg',
  'adguard-1': '/assets/images/promo_electronics_tech_1794811009540.jpg',
  'canon-1': '/assets/images/promo_electronics_tech_1794811009540.jpg',
  'huawei-1': '/assets/images/deal_gadgets_audio_1794811011337.jpg',
  'honor-1': '/assets/images/deal_gadgets_audio_1794811011337.jpg',
  'admitad-1': '/assets/images/admitad_earbuds_banner_1795014382533.jpg',
};

export const DealsView: React.FC<DealsViewProps> = ({
  storeParam,
  stores,
  t,
  onBackHome,
  onSelectStore,
  onActivateDeal,
}) => {
  const isAr = t.shopNow === 'تسوق الآن';
  const normalized = storeParam.trim().toLowerCase();
  const matchedStore = stores.find(
    (s) =>
      s.id.toLowerCase() === normalized ||
      s.domain.toLowerCase() === normalized ||
      s.name.toLowerCase() === normalized
  );

  if (!matchedStore) {
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
          <p className="mt-2 text-sm text-zinc-600 max-w-md mx-auto">
            {t.storeNotFoundSub}
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-2">
            {stores.map((store) => (
              <button
                key={store.id}
                type="button"
                onClick={() => onSelectStore(store.id)}
                className="px-4 py-2 text-sm font-semibold bg-[#FFD814] hover:bg-[#F7CA00] text-zinc-950 border border-[#FCD200] rounded-full cursor-pointer whitespace-nowrap"
              >
                {store.name}
              </button>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-[#EAEDED] min-h-screen px-3 sm:px-5 py-6">
      <div className="max-w-5xl mx-auto">
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
            {stores.map((s) => (
              <button
                key={s.id}
                type="button"
                onClick={() => onSelectStore(s.id)}
                className={`px-2.5 py-1 rounded-sm text-xs font-semibold border cursor-pointer whitespace-nowrap ${
                  s.id === matchedStore.id
                    ? 'bg-[#00453E] text-white border-[#00453E]'
                    : 'bg-white text-zinc-800 border-zinc-300 hover:bg-zinc-100'
                }`}
              >
                {s.name}
              </button>
            ))}
          </div>
        </div>

        {/* Deal Unlocked / Coupons Ready Banner */}
        <div className="mt-4 bg-white border border-emerald-300 rounded-md overflow-hidden shadow-xs">
          <div className="bg-[#00453E] text-white px-5 py-2.5 flex items-center gap-2 text-xs sm:text-sm font-bold">
            <CheckCircle2 className="w-4 h-4 text-[#FFD814] shrink-0" />
            <span>
              {t.dealUnlocked} — {matchedStore.name}
            </span>
          </div>

          <div className="p-5 sm:p-6 flex flex-col md:flex-row md:items-center justify-between gap-5">
            <div className="flex items-start sm:items-center gap-4">
              <StoreLogo storeId={matchedStore.id} name={matchedStore.name} size="lg" />
              <div>
                <h1 className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight text-zinc-950">
                  {matchedStore.name} — {t.verifiedCouponsAndDeals}
                </h1>
                <div className="mt-1 flex flex-wrap items-center gap-2 text-xs sm:text-sm text-zinc-600">
                  <span className="font-medium text-zinc-800">{matchedStore.domain}</span>
                  <span aria-hidden="true">·</span>
                  <span className="font-semibold text-[#007600] tabular-nums">
                    {matchedStore.deals.length} {t.verifiedOffersCount}
                  </span>
                  <span aria-hidden="true">·</span>
                  <span>{matchedStore.network}</span>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 shrink-0">
              <a
                href={matchedStore.affiliateUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 min-h-[44px] bg-[#FFD814] hover:bg-[#F7CA00] text-zinc-950 border border-[#FCD200] text-sm font-bold rounded-full transition-colors whitespace-nowrap shrink-0"
              >
                {t.shopNow} · {matchedStore.name}
                <ExternalLink className="w-4 h-4" />
              </a>
              <ShareButton
                url={matchedStore.affiliateUrl}
                shareId={matchedStore.id}
                title={matchedStore.name}
                discount={`${matchedStore.deals.length} ${t.verifiedOffersCount}`}
                isAr={isAr}
                dropDirection="down"
              />
            </div>
          </div>
        </div>

        {/* Store Coupons List */}
        <div className="mt-5 space-y-3">
          {matchedStore.deals.map((deal) => {
            const thumb =
              DEAL_THUMBNAILS[deal.id] ||
              '/assets/images/hero_smart_shopping_1794810594006.jpg';
            return (
              <article
                key={deal.id}
                className="bg-white border border-zinc-200 rounded-md p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-5"
              >
                <div className="flex items-start gap-4 min-w-0">
                  <a
                    href={deal.affiliateUrl || matchedStore.affiliateUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => {
                      e.preventDefault();
                      onActivateDeal(deal, matchedStore);
                    }}
                    className="relative w-24 h-24 sm:w-28 sm:h-28 shrink-0 rounded-md overflow-hidden border border-zinc-200 bg-zinc-100 block group cursor-pointer"
                  >
                    <img
                      src={thumb}
                      alt={deal.title}
                      referrerPolicy="no-referrer"
                      className={`w-full h-full group-hover:scale-105 transition-transform duration-200 ${
                        (deal.id.startsWith('amz-jp-') && deal.id !== 'amz-jp-coupons' && deal.id !== 'amz-jp-store' && deal.id !== 'amz-jp-blackfriday-dates') ||
                        (deal.id.startsWith('amz-eg-') && !['amz-eg-store', 'amz-eg-swype', 'amz-eg-abk', 'amz-eg-qnb', 'amz-eg-3'].includes(deal.id))
                          ? 'object-contain bg-white p-1'
                          : 'object-cover'
                      }`}
                    />
                    <span className="absolute bottom-1 left-1 right-1 bg-[#CC0C39] text-white text-[11px] font-extrabold text-center py-0.5 rounded-xs tabular-nums">
                      {deal.discountLabel}
                    </span>
                  </a>

                  <div className="min-w-0">
                    <div className="text-xs text-zinc-500 flex items-center gap-2">
                      <span className="font-semibold text-zinc-800">{matchedStore.name}</span>
                      <span aria-hidden="true">·</span>
                      <span>{deal.verifiedDate}</span>
                    </div>
                    <h2 className="mt-1 font-display text-base sm:text-lg font-bold text-zinc-950">
                      <a
                        href={deal.affiliateUrl || matchedStore.affiliateUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => {
                          e.preventDefault();
                          onActivateDeal(deal, matchedStore);
                        }}
                        className="hover:text-[#C7511F] hover:underline"
                      >
                        {deal.title}
                      </a>
                    </h2>
                    {deal.price && (
                      <div className="mt-1.5 flex flex-wrap items-baseline gap-2">
                        <span className="font-display text-lg font-extrabold text-[#B12704]">
                          {deal.price}
                        </span>
                        {deal.oldPrice && (
                          <span className="text-xs text-zinc-500 line-through">
                            {deal.oldPrice}
                          </span>
                        )}
                      </div>
                    )}
                    <p className="mt-1 text-sm text-zinc-600 leading-relaxed">
                      {deal.description}
                    </p>
                    {deal.code ? (
                      <div className="mt-2.5 inline-flex items-center gap-2 text-xs text-zinc-700">
                        <span>{t.promoCodeLabel}</span>
                        <code className="font-mono font-bold text-zinc-950 bg-zinc-100 border border-dashed border-zinc-400 px-2.5 py-1 rounded">
                          {deal.code}
                        </code>
                      </div>
                    ) : (
                      <p className="mt-2 text-xs font-semibold text-[#007600]">
                        {t.noCodeRequiredNote}
                      </p>
                    )}
                  </div>
                </div>

                <div className="shrink-0 flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={() => onActivateDeal(deal, matchedStore)}
                    className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-5 py-2.5 min-h-[42px] bg-[#FFD814] hover:bg-[#F7CA00] active:bg-[#F0B800] text-zinc-950 border border-[#FCD200] text-sm font-bold rounded-full transition-colors whitespace-nowrap cursor-pointer"
                  >
                    {deal.code ? (
                      <>
                        <Copy className="w-4 h-4" />
                        {t.copyCodeAndActivate}
                      </>
                    ) : (
                      <>
                        <ExternalLink className="w-4 h-4" />
                        {t.activateDeal}
                      </>
                    )}
                  </button>
                  <ShareButton
                    url={deal.affiliateUrl || matchedStore.affiliateUrl}
                    shareId={deal.id}
                    title={deal.title}
                    price={deal.price}
                    oldPrice={deal.oldPrice}
                    discount={deal.discountLabel}
                    isAr={isAr}
                    dropDirection="up"
                  />
                </div>
              </article>
            );
          })}
        </div>

        <p className="mt-6 text-xs text-zinc-600 leading-relaxed">
          {t.affiliateStatement}
        </p>
      </div>
    </section>
  );
};
