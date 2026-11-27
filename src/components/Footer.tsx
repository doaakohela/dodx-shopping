import React from 'react';
import {
  LanguageCode,
  SUPPORTED_LANGUAGES,
  TranslationDict,
} from '../i18n/translations';

interface FooterProps {
  t: TranslationDict;
  currentLang: LanguageCode;
  onChangeLang: (lang: LanguageCode) => void;
  onNavigateHome: (sectionId?: string) => void;
  onNavigateProducts: (deptId?: string) => void;
  onNavigateCoupons: () => void;
  onNavigateCars: (carId?: string) => void;
  onNavigateLegal: (route: 'disclosure' | 'privacy') => void;
  onOpenInstallModal: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  t,
  currentLang,
  onChangeLang,
  onNavigateHome,
  onNavigateProducts,
  onNavigateCoupons,
  onNavigateCars,
  onNavigateLegal,
  onOpenInstallModal,
}) => {
  return (
    <footer className="text-white">
      <button
        type="button"
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className="w-full py-3.5 bg-[#37475A] hover:bg-[#485769] text-xs font-semibold text-white text-center transition-colors cursor-pointer"
      >
        {t.backToTop}
      </button>

      <div className="bg-[#232F3E] py-10 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-8 text-sm">
          <div>
            <h3 className="font-display font-bold text-white text-sm">{t.getToKnowDodx}</h3>
            <ul className="mt-3 space-y-2 text-xs text-zinc-300">
              <li>
                <button
                  type="button"
                  onClick={() => onNavigateCoupons()}
                  className="hover:underline cursor-pointer text-start text-[#FFD814] font-semibold"
                >
                  {t.couponsNav}
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigateProducts()}
                  className="hover:underline cursor-pointer text-start"
                >
                  {t.productsNav}
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigateCars()}
                  className="hover:underline cursor-pointer text-start text-[#99F6E4] font-semibold"
                >
                  {t.carsNav}
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigateHome('top-stores')}
                  className="hover:underline cursor-pointer text-start"
                >
                  {t.liveCouponFeed}
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigateHome('hot-deals')}
                  className="hover:underline cursor-pointer text-start"
                >
                  {t.hotVerifiedDeals}
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-display font-bold text-white text-sm">{t.browserCompanion}</h3>
            <ul className="mt-3 space-y-2 text-xs text-zinc-300">
              <li>
                <a
                  href="https://chromewebstore.google.com/detail/cllebmldcnbpmjbjifjphnljgfohjgih?utm_source=item-share-cb"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline text-start inline-block"
                >
                  {t.installFromChromeStore}
                </a>
              </li>
              <li>
                <button
                  type="button"
                  onClick={onOpenInstallModal}
                  className="hover:underline cursor-pointer text-start"
                >
                  {t.dodxBrowserExtension}
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-display font-bold text-white text-sm">{t.partnerNetworks}</h3>
            <ul className="mt-3 space-y-2 text-xs text-zinc-300">
              <li>Amazon (US · EG · UAE · JP · PL)</li>
              <li>AliExpress · Alibaba</li>
              <li>eBay · Noon ({currentLang === 'ar' ? 'قريباً' : 'Soon'})</li>
              <li>HONOR · Huawei · Lenovo · Canon</li>
            </ul>
          </div>

          <div>
            <h3 className="font-display font-bold text-white text-sm">{t.legalCompliance}</h3>
            <ul className="mt-3 space-y-2 text-xs text-zinc-300">
              <li>
                <button
                  type="button"
                  onClick={() => onNavigateLegal('disclosure')}
                  className="hover:underline cursor-pointer text-start"
                >
                  {t.affiliateDisclosure}
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigateLegal('privacy')}
                  className="hover:underline cursor-pointer text-start"
                >
                  {t.privacyPolicy}
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="bg-[#131A22] py-6 px-4 text-center text-xs text-zinc-400">
        <div className="max-w-4xl mx-auto space-y-3">
          <div className="flex flex-wrap items-center justify-center gap-4">
            <div className="font-display text-base font-extrabold text-white tracking-tight" dir="ltr">
              dodx<span className="text-[#FF9900]">.shop</span>
            </div>

            <select
              aria-label={t.languageTitle}
              value={currentLang}
              onChange={(e) => onChangeLang(e.target.value as LanguageCode)}
              className="px-3 py-1.5 text-xs font-semibold bg-[#232F3E] text-white border border-zinc-600 rounded cursor-pointer focus:outline-none focus:border-white"
            >
              {SUPPORTED_LANGUAGES.map((lang) => (
                <option key={lang.code} value={lang.code}>
                  {lang.flag} {lang.nativeName}
                </option>
              ))}
            </select>
          </div>

          <p>{t.affiliateStatement}</p>
          <p>© {new Date().getFullYear()} Dodx · dodx.shop</p>
        </div>
      </div>
    </footer>
  );
};
