import React, { useEffect, useRef, useState } from 'react';
import { Check, ChevronDown, Globe } from 'lucide-react';
import {
  getLanguageMeta,
  LanguageCode,
  SUPPORTED_LANGUAGES,
} from '../i18n/translations';

interface LanguageSelectorProps {
  currentLang: LanguageCode;
  onChangeLang: (lang: LanguageCode) => void;
  title: string;
}

const EXTRA_WORLD_LANGUAGES = [
  { code: 'ur', label: 'اردو (Urdu)' },
  { code: 'fa', label: 'فارسی (Persian)' },
  { code: 'bn', label: 'বাংলা (Bengali)' },
  { code: 'vi', label: 'Tiếng Việt (Vietnamese)' },
  { code: 'th', label: 'ไทย (Thai)' },
  { code: 'uk', label: 'Українська (Ukrainian)' },
  { code: 'sv', label: 'Svenska (Swedish)' },
  { code: 'el', label: 'Ελληνικά (Greek)' },
  { code: 'ro', label: 'Română (Romanian)' },
  { code: 'he', label: 'עברית (Hebrew)' },
  { code: 'ms', label: 'Bahasa Melayu (Malay)' },
  { code: 'sw', label: 'Kiswahili (Swahili)' },
];

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  currentLang,
  onChangeLang,
  title,
}) => {
  const [open, setOpen] = useState(false);
  const [extraLang, setExtraLang] = useState('');
  const containerRef = useRef<HTMLDivElement | null>(null);
  const meta = getLanguageMeta(currentLang);

  useEffect(() => {
    if (!open) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    window.addEventListener('keydown', handleEsc);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('keydown', handleEsc);
    };
  }, [open]);

  const handleExtraTranslate = (targetCode: string) => {
    if (!targetCode) return;
    setExtraLang(targetCode);
    setOpen(false);
    const currentUrl = window.location.href;
    const translateUrl = `https://translate.google.com/translate?sl=auto&tl=${encodeURIComponent(
      targetCode
    )}&u=${encodeURIComponent(currentUrl)}`;
    window.open(translateUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div ref={containerRef} className="relative shrink-0">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={title}
        className="flex items-center gap-1 px-2 py-1.5 rounded-sm border border-transparent hover:border-white text-white text-xs font-bold transition-colors cursor-pointer shrink-0"
      >
        <span aria-hidden="true" className="text-sm leading-none">
          {meta.flag}
        </span>
        <span>{meta.shortLabel}</span>
        <ChevronDown className="w-3.5 h-3.5 text-emerald-100" />
      </button>

      {open && (
        <div
          role="dialog"
          aria-label={title}
          className="absolute end-0 mt-1.5 w-72 bg-white text-zinc-950 border border-zinc-200 rounded-lg shadow-xl p-3.5 z-50"
        >
          <div className="flex items-center gap-2 pb-2 border-b border-zinc-200">
            <Globe className="w-4 h-4 text-[#00453E]" />
            <span className="font-display text-xs font-extrabold text-zinc-950">
              {title}
            </span>
          </div>

          <div className="mt-2.5 grid grid-cols-2 gap-1 max-h-64 overflow-y-auto">
            {SUPPORTED_LANGUAGES.map((lang) => {
              const selected = lang.code === currentLang;
              return (
                <button
                  key={lang.code}
                  type="button"
                  onClick={() => {
                    onChangeLang(lang.code);
                    setOpen(false);
                  }}
                  className={`flex items-center justify-between gap-1.5 px-2.5 py-2 rounded-md text-left text-xs transition-colors cursor-pointer ${
                    selected
                      ? 'bg-[#00453E] text-white font-bold'
                      : 'hover:bg-zinc-100 text-zinc-800 font-medium'
                  }`}
                >
                  <span className="flex items-center gap-1.5 min-w-0">
                    <span aria-hidden="true">{lang.flag}</span>
                    <span className="truncate">{lang.nativeName}</span>
                  </span>
                  {selected && <Check className="w-3.5 h-3.5 shrink-0" />}
                </button>
              );
            })}
          </div>

          <div className="mt-3 pt-2.5 border-t border-zinc-200">
            <label
              htmlFor="extra-world-lang"
              className="block text-[11px] font-semibold text-zinc-600 mb-1.5"
            >
              More world languages (100+ via Translate):
            </label>
            <select
              id="extra-world-lang"
              value={extraLang}
              onChange={(e) => handleExtraTranslate(e.target.value)}
              className="w-full px-2.5 py-1.5 text-xs bg-zinc-50 border border-zinc-300 rounded-md text-zinc-900 focus:outline-none focus:border-[#00453E] cursor-pointer"
            >
              <option value="">Select another language...</option>
              {EXTRA_WORLD_LANGUAGES.map((item) => (
                <option key={item.code} value={item.code}>
                  {item.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}
    </div>
  );
};
