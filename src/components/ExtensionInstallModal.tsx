import React, { useEffect } from 'react';
import { Check, Chrome, ExternalLink, ShieldCheck, X } from 'lucide-react';
import { TranslationDict } from '../i18n/translations';

export const CHROME_WEB_STORE_URL =
  'https://chromewebstore.google.com/detail/cllebmldcnbpmjbjifjphnljgfohjgih?utm_source=item-share-cb';

interface ExtensionInstallModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBrowseDeals: () => void;
  t: TranslationDict;
}

export const ExtensionInstallModal: React.FC<ExtensionInstallModalProps> = ({
  isOpen,
  onClose,
  onBrowseDeals,
  t,
}) => {
  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/55 backdrop-blur-[2px]"
      role="dialog"
      aria-modal="true"
      aria-labelledby="extension-modal-title"
      onClick={onClose}
    >
      <div
        className="bg-white border border-zinc-200 rounded-2xl max-w-md w-full p-6 sm:p-7 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#00453E] text-white flex items-center justify-center shrink-0">
              <Chrome className="w-5 h-5 text-[#FF9900]" />
            </div>
            <div>
              <h2 id="extension-modal-title" className="font-display text-lg font-bold text-zinc-950">
                Dodx — Verified Coupons &amp; Deals
              </h2>
              <p className="text-xs text-zinc-500">{t.modalSub}</p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label={t.close}
            className="p-1.5 text-zinc-400 hover:text-zinc-950 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mt-5 space-y-4 text-sm text-zinc-700">
          <p className="leading-relaxed">{t.modalDesc}</p>

          <ul className="space-y-2.5 bg-zinc-50 border border-zinc-200 rounded-xl p-4 text-xs sm:text-sm">
            <li className="flex items-start gap-2">
              <Check className="w-4 h-4 text-emerald-700 mt-0.5 shrink-0" />
              <span>{t.modalBullet1}</span>
            </li>
            <li className="flex items-start gap-2">
              <Check className="w-4 h-4 text-emerald-700 mt-0.5 shrink-0" />
              <span>{t.modalBullet2}</span>
            </li>
            <li className="flex items-start gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-700 mt-0.5 shrink-0" />
              <span>{t.modalBullet3}</span>
            </li>
          </ul>

          <p className="text-xs text-emerald-800 font-medium">{t.modalNote}</p>
        </div>

        <div className="mt-6 flex flex-wrap items-center justify-end gap-2.5">
          <button
            type="button"
            onClick={onClose}
            className="px-3.5 py-2 text-xs sm:text-sm font-semibold text-zinc-700 hover:text-zinc-950 rounded-lg cursor-pointer"
          >
            {t.close}
          </button>
          <button
            type="button"
            onClick={() => {
              onClose();
              onBrowseDeals();
            }}
            className="px-4 py-2 text-xs sm:text-sm font-semibold text-zinc-800 bg-zinc-100 hover:bg-zinc-200 border border-zinc-300 rounded-full transition-colors cursor-pointer"
          >
            {t.browseTodaysDeals}
          </button>
          <a
            href={CHROME_WEB_STORE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-5 py-2 text-xs sm:text-sm font-bold bg-[#FFD814] hover:bg-[#F7CA00] text-zinc-950 border border-[#FCD200] rounded-full transition-colors"
          >
            <Chrome className="w-4 h-4" />
            <span>{t.installFromChromeStore}</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </div>
  );
};
