import React from 'react';
import { ArrowLeft, ShieldCheck } from 'lucide-react';
import { TranslationDict } from '../i18n/translations';

interface LegalViewProps {
  mode: 'disclosure' | 'privacy';
  t: TranslationDict;
  onBackHome: () => void;
  onSwitchMode: (mode: 'disclosure' | 'privacy') => void;
}

export const LegalView: React.FC<LegalViewProps> = ({
  mode,
  t,
  onBackHome,
  onSwitchMode,
}) => {
  return (
    <section className="max-w-3xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <button
          type="button"
          onClick={onBackHome}
          className="inline-flex items-center gap-2 text-sm font-semibold text-[#007185] hover:text-[#C7511F] hover:underline transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 rtl:rotate-180" />
          {t.backToDodx}
        </button>

        <div className="flex items-center gap-1 p-1 bg-white rounded-lg border border-zinc-200">
          <button
            type="button"
            onClick={() => onSwitchMode('disclosure')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors cursor-pointer whitespace-nowrap ${
              mode === 'disclosure'
                ? 'bg-[#00453E] text-white'
                : 'text-zinc-600 hover:text-zinc-950'
            }`}
          >
            {t.affiliateDisclosure}
          </button>
          <button
            type="button"
            onClick={() => onSwitchMode('privacy')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors cursor-pointer whitespace-nowrap ${
              mode === 'privacy'
                ? 'bg-[#00453E] text-white'
                : 'text-zinc-600 hover:text-zinc-950'
            }`}
          >
            {t.privacyPolicy}
          </button>
        </div>
      </div>

      {mode === 'disclosure' ? (
        <article className="mt-6 bg-white border border-zinc-200 rounded-md p-7 sm:p-10">
          <div className="inline-flex items-center gap-2 text-xs font-semibold text-emerald-700">
            <ShieldCheck className="w-4 h-4" />
            <span>Verified Coupons &amp; Shopper Transparency</span>
          </div>
          <h1 className="mt-2 font-display text-3xl font-bold tracking-tight text-zinc-950">
            {t.affiliateDisclosure}
          </h1>
          <p className="mt-2 text-sm text-zinc-500">Last updated: November 19, 2026 · dodx.shop</p>

          <div className="mt-6 space-y-5 text-[15px] leading-relaxed text-zinc-700">
            <p className="p-5 bg-zinc-50 border border-zinc-200 rounded-lg font-medium text-zinc-900">
              {t.affiliateStatement}
            </p>

            <h2 className="font-display text-lg font-semibold text-zinc-950 pt-2">
              How Dodx Curates Verified Coupons &amp; Deals
            </h2>
            <p>
              Dodx connects shoppers directly with verified offers, clip coupons, bank card promo codes, and seasonal price drops across Amazon US, Amazon UAE, Amazon Egypt, Amazon Japan, AliExpress WW, Alibaba WW, HONOR UAE, Huawei AE, Canon UAE, Lenovo India, Parallels WW, AdGuard, and Admitad Shop.
            </p>

            <h2 className="font-display text-lg font-semibold text-zinc-950 pt-2">
              Direct Checkout Savings — Zero Extra Cost
            </h2>
            <p>
              Both the dodx.shop website and the Dodx browser companion direct you to official store pages only when you choose to click an offer or apply a coupon. Discounts, bank promo codes, and clip coupons apply directly at checkout without raising product prices.
            </p>

            <h2 className="font-display text-lg font-semibold text-zinc-950 pt-2">
              Real-Time Deal Verification
            </h2>
            <p>
              Coupons and deals featured on Dodx are reviewed regularly for active savings value, valid bank promotions, and direct availability across regional stores.
            </p>
          </div>
        </article>
      ) : (
        <article className="mt-6 bg-white border border-zinc-200 rounded-md p-7 sm:p-10">
          <div className="inline-flex items-center gap-2 text-xs font-semibold text-emerald-700">
            <ShieldCheck className="w-4 h-4" />
            <span>Data Minimization Commitment</span>
          </div>
          <h1 className="mt-2 font-display text-3xl font-bold tracking-tight text-zinc-950">
            {t.privacyPolicy}
          </h1>
          <p className="mt-2 text-sm text-zinc-500">Last updated: November 19, 2026 · dodx.shop</p>

          <div className="mt-6 space-y-5 text-[15px] leading-relaxed text-zinc-700">
            <p>
              At Dodx (dodx.shop), your privacy is foundational. We designed our deals platform and browser companion to deliver verified savings without collecting or selling personal browsing history.
            </p>

            <h2 className="font-display text-lg font-semibold text-zinc-950 pt-2">
              1. Information Accessed
            </h2>
            <p>
              When you use the Dodx Chrome companion, it stores our public store directory JSON locally using <code>storage</code>, refreshes it periodically via <code>alarms</code>, and uses <code>activeTab</code> only when you click the extension icon to detect locally whether you are browsing a supported store. We do not log, transmit, or sell your browsing history, search queries, form inputs, or personal account data.
            </p>

            <h2 className="font-display text-lg font-semibold text-zinc-950 pt-2">
              2. No Hidden Background Redirects
            </h2>
            <p>
              Dodx never loads hidden frames or silently redirects pages in the background. Store deal links are activated only after you intentionally click a store, product card, or coupon offer.
            </p>

            <h2 className="font-display text-lg font-semibold text-zinc-950 pt-2">
              3. Local Preferences
            </h2>
            <p>
              Temporary preferences such as selected language or dismissing an on-screen deal notification are saved strictly in your browser&apos;s local preferences.
            </p>

            <h2 className="font-display text-lg font-semibold text-zinc-950 pt-2">
              4. Contact Us
            </h2>
            <p>
              Questions regarding privacy, savings guides, or store listings can be directed to <span className="font-medium text-zinc-950">privacy@dodx.shop</span>.
            </p>
          </div>
        </article>
      )}
    </section>
  );
};
