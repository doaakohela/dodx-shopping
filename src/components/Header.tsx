import React, { useEffect, useRef, useState } from 'react';
import {
  ArrowLeft,
  ChevronDown,
  Chrome,
  LayoutGrid,
  MapPin,
  Menu,
  Search,
  Tag,
  X,
} from 'lucide-react';
import { AppRoute, Store } from '../types/coupons';
import { LanguageCode, TranslationDict } from '../i18n/translations';
import { LanguageSelector } from './LanguageSelector';

interface HeaderProps {
  stores: Store[];
  searchQuery: string;
  onSearchChange: (value: string) => void;
  searchStoreFilter: string;
  onSearchStoreFilterChange: (storeId: string) => void;
  onSearchSubmit: () => void;
  selectedRegion: string;
  onRegionChange: (region: string) => void;
  copiedCount: number;
  currentLang: LanguageCode;
  onChangeLang: (lang: LanguageCode) => void;
  t: TranslationDict;
  activeRoute: AppRoute;
  onNavigateHome: (sectionId?: string) => void;
  onNavigateProducts: (deptId?: string) => void;
  onSelectStore: (storeId: string) => void;
  onNavigateLegal: (route: 'disclosure' | 'privacy') => void;
  onOpenInstallModal: () => void;
  onOpenDrawer: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  stores,
  searchQuery,
  onSearchChange,
  searchStoreFilter,
  onSearchStoreFilterChange,
  onSearchSubmit,
  selectedRegion,
  onRegionChange,
  copiedCount,
  currentLang,
  onChangeLang,
  t,
  activeRoute,
  onNavigateHome,
  onNavigateProducts,
  onSelectStore,
  onNavigateLegal,
  onOpenInstallModal,
  onOpenDrawer,
}) => {
  const [mobileSearchExpanded, setMobileSearchExpanded] = useState(false);
  const searchFormRef = useRef<HTMLFormElement | null>(null);
  const searchInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (!mobileSearchExpanded) return;
    const handleOutside = (e: MouseEvent | TouchEvent) => {
      if (
        searchFormRef.current &&
        !searchFormRef.current.contains(e.target as Node)
      ) {
        setMobileSearchExpanded(false);
      }
    };
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setMobileSearchExpanded(false);
        searchInputRef.current?.blur();
      }
    };
    document.addEventListener('mousedown', handleOutside);
    document.addEventListener('touchstart', handleOutside, { passive: true });
    window.addEventListener('keydown', handleEsc);
    return () => {
      document.removeEventListener('mousedown', handleOutside);
      document.removeEventListener('touchstart', handleOutside);
      window.removeEventListener('keydown', handleEsc);
    };
  }, [mobileSearchExpanded]);

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setMobileSearchExpanded(false);
    searchInputRef.current?.blur();
    onSearchSubmit();
  };

  return (
    <header className="sticky top-0 z-40 text-white shadow-sm">
      {/* Tier 1: Primary Deep Forest Green Header (#00453E) */}
      <div className="bg-[#00453E]">
        <div className="max-w-[1520px] mx-auto px-2 sm:px-4 h-[62px] sm:h-[60px] flex items-center gap-1.5 sm:gap-3">
          {/* Mobile Menu Trigger (collapses when mobile search is expanded) */}
          <button
            type="button"
            onClick={onOpenDrawer}
            aria-label="Open stores and categories menu"
            className={`${
              mobileSearchExpanded ? 'hidden sm:hidden' : 'inline-flex lg:hidden'
            } p-1.5 rounded-sm border border-transparent hover:border-white text-white cursor-pointer shrink-0`}
          >
            <Menu className="w-6 h-6" />
          </button>

          {/* Brand Logo: Dodx with signature smile arrow strictly under 'dodx' from first 'd' to second 'd' */}
          <a
            href="/"
            onClick={(e) => {
              e.preventDefault();
              onNavigateHome();
            }}
            className={`${
              mobileSearchExpanded ? 'hidden sm:flex' : 'flex'
            } items-center px-1 sm:px-2 py-1 rounded-sm border border-transparent hover:border-white transition-colors shrink-0`}
          >
            <div className="flex items-start gap-0.5 leading-none" dir="ltr">
              <span className="inline-flex flex-col items-start">
                <span className="font-display text-[19px] sm:text-[22px] font-extrabold tracking-tight text-white leading-none">
                  dodx
                </span>
                <svg
                  viewBox="0 0 64 12"
                  className="w-[74%] ms-[2px] h-[9px] -mt-0.5"
                  fill="none"
                  aria-hidden="true"
                >
                  <path
                    d="M3 2.5C18 9.5 42 9.5 57 2.5"
                    stroke="#FF9900"
                    strokeWidth="2.6"
                    strokeLinecap="round"
                  />
                  <path
                    d="M52.5 1.2L58.5 2.4L55.5 7.8"
                    stroke="#FF9900"
                    strokeWidth="2.3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
              <span className="text-[10px] sm:text-[11px] font-bold text-[#FF9900] mt-[5px] sm:mt-[7px]">
                .shop
              </span>
            </div>
          </a>

          {/* Region Selector */}
          <div className="hidden xl:flex items-center gap-1.5 px-2 py-1 rounded-sm border border-transparent hover:border-white shrink-0">
            <MapPin className="w-4 h-4 text-white mt-2 shrink-0" />
            <div className="leading-tight">
              <span className="block text-[11px] text-emerald-100/90 whitespace-nowrap">
                {t.dealsActiveIn}
              </span>
              <select
                aria-label="Select shopping region"
                value={selectedRegion}
                onChange={(e) => onRegionChange(e.target.value)}
                className="bg-transparent text-xs font-bold text-white focus:outline-none cursor-pointer pr-1"
              >
                <option value="US & Global" className="text-zinc-950">
                  US &amp; Global
                </option>
                <option value="UAE & KSA" className="text-zinc-950">
                  UAE &amp; KSA
                </option>
                <option value="Europe & UK" className="text-zinc-950">
                  Europe &amp; UK
                </option>
              </select>
            </div>
          </div>

          {/* Wide Search Bar (expands full-width on mobile tap/focus) */}
          <form
            ref={searchFormRef}
            onSubmit={handleFormSubmit}
            className={`flex-1 min-w-0 flex items-stretch rounded-md overflow-hidden bg-white focus-within:ring-2 focus-within:ring-[#FF9900] transition-all duration-150 ${
              mobileSearchExpanded ? 'h-11 sm:h-10 shadow-md' : 'h-10'
            }`}
          >
            {mobileSearchExpanded && (
              <button
                type="button"
                onClick={() => {
                  setMobileSearchExpanded(false);
                  searchInputRef.current?.blur();
                }}
                aria-label={t.close}
                className="sm:hidden px-2.5 bg-zinc-100 hover:bg-zinc-200 border-e border-zinc-200 text-zinc-700 flex items-center justify-center shrink-0 cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4 rtl:rotate-180" />
              </button>
            )}

            <div className="relative hidden sm:flex items-center bg-[#E6E6E6] hover:bg-[#D4D4D4] border-e border-zinc-300 text-zinc-800 transition-colors shrink-0">
              <select
                aria-label="Filter search by store"
                value={searchStoreFilter}
                onChange={(e) => onSearchStoreFilterChange(e.target.value)}
                className="appearance-none bg-transparent ps-3 pe-7 h-full text-xs font-medium text-zinc-800 focus:outline-none cursor-pointer"
              >
                <option value="all">{t.allOption}</option>
                {stores.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-zinc-600 absolute end-2 pointer-events-none" />
            </div>

            <label htmlFor="dodx-header-search" className="sr-only">
              {t.searchPlaceholder}
            </label>
            <input
              ref={searchInputRef}
              id="dodx-header-search"
              type="search"
              value={searchQuery}
              onFocus={() => setMobileSearchExpanded(true)}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder={t.searchPlaceholder}
              className="flex-1 min-w-0 px-2.5 sm:px-3 text-base sm:text-sm text-zinc-950 placeholder:text-zinc-500 focus:outline-none"
            />

            {mobileSearchExpanded && searchQuery && (
              <button
                type="button"
                onClick={() => {
                  onSearchChange('');
                  searchInputRef.current?.focus();
                }}
                aria-label={t.clearAllFilters}
                className="sm:hidden px-2 text-zinc-500 hover:text-zinc-800 flex items-center justify-center shrink-0 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            )}

            <button
              type="submit"
              aria-label="Search coupons"
              className={`${
                mobileSearchExpanded ? 'w-12' : 'w-10 sm:w-12'
              } bg-[#B12767] hover:bg-[#991E57] text-white flex items-center justify-center transition-colors cursor-pointer shrink-0`}
            >
              <Search className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </form>

          {/* Universal Language Switcher (hidden on < sm while mobile search is expanded) */}
          <div className={mobileSearchExpanded ? 'hidden sm:block' : 'block'}>
            <LanguageSelector
              currentLang={currentLang}
              onChangeLang={onChangeLang}
              title={t.languageTitle}
            />
          </div>

          {/* Right Account / Action Links (Tablet & Desktop) */}
          <div className="hidden md:flex items-center gap-0.5 lg:gap-1 shrink-0">
            <button
              type="button"
              onClick={onOpenInstallModal}
              className="text-start px-2 py-1 rounded-sm border border-transparent hover:border-white transition-colors cursor-pointer shrink-0 whitespace-nowrap"
            >
              <span className="block text-[11px] text-emerald-100/90 leading-tight whitespace-nowrap">
                {t.chromeExtension}
              </span>
              <span className="flex items-center gap-1 text-xs font-bold text-white leading-tight whitespace-nowrap">
                <Chrome className="w-3.5 h-3.5 text-[#FF9900] shrink-0" />
                {t.addDodxFree}
              </span>
            </button>

            <button
              type="button"
              onClick={() => onNavigateLegal('disclosure')}
              className="hidden lg:block text-start px-2 py-1 rounded-sm border border-transparent hover:border-white transition-colors cursor-pointer shrink-0 whitespace-nowrap"
            >
              <span className="block text-[11px] text-emerald-100/90 leading-tight whitespace-nowrap">
                {t.affiliate}
              </span>
              <span className="block text-xs font-bold text-white leading-tight whitespace-nowrap">
                {t.disclosure}
              </span>
            </button>

            <button
              type="button"
              onClick={() => onNavigateHome('hot-deals')}
              className="flex items-center gap-1.5 px-2 py-1 rounded-sm border border-transparent hover:border-white transition-colors cursor-pointer shrink-0 whitespace-nowrap"
            >
              <div className="relative shrink-0">
                <Tag className="w-5 h-5 text-white" />
                <span className="absolute -top-2 -end-2 min-w-[18px] h-[18px] px-1 rounded-full bg-[#FF9900] text-zinc-950 font-mono text-[11px] font-extrabold flex items-center justify-center tabular-nums">
                  {copiedCount}
                </span>
              </div>
              <span className="text-xs font-bold text-white whitespace-nowrap ms-1">
                {t.claimed}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Tier 2: Secondary Sub-Navbar (#005A50) */}
      <div className="bg-[#005A50] border-t border-white/10">
        <div className="max-w-[1520px] mx-auto px-3 sm:px-4 h-[39px] flex items-center gap-1 overflow-x-auto no-scrollbar">
          <button
            type="button"
            onClick={onOpenDrawer}
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-sm border border-transparent hover:border-white text-[13px] font-bold text-white whitespace-nowrap shrink-0 cursor-pointer"
          >
            <Menu className="w-4 h-4" />
            <span>{t.navAll}</span>
          </button>

          <button
            type="button"
            onClick={() => onNavigateHome('hot-deals')}
            className="px-2.5 py-1 rounded-sm border border-transparent hover:border-white text-[13px] font-medium text-white whitespace-nowrap shrink-0 cursor-pointer"
          >
            {t.todaysDeals}
          </button>

          <button
            type="button"
            onClick={() => onNavigateProducts()}
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-sm border text-[13px] font-bold whitespace-nowrap shrink-0 cursor-pointer transition-colors ${
              activeRoute === 'products'
                ? 'bg-white/15 border-white text-[#FFD814]'
                : 'border-transparent hover:border-white text-[#FFD814]'
            }`}
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            <span>{t.productsNav}</span>
          </button>

          {stores.map((store) => (
            <button
              key={store.id}
              type="button"
              onClick={() => onSelectStore(store.id)}
              className="px-2.5 py-1 rounded-sm border border-transparent hover:border-white text-[13px] font-medium text-white whitespace-nowrap shrink-0 cursor-pointer"
            >
              {store.name}
            </button>
          ))}

          <button
            type="button"
            onClick={onOpenInstallModal}
            className="px-2.5 py-1 rounded-sm border border-transparent hover:border-white text-[13px] font-medium text-[#FFD814] whitespace-nowrap shrink-0 cursor-pointer"
          >
            {t.chromeExtension}
          </button>

          <button
            type="button"
            onClick={() => onNavigateLegal('disclosure')}
            className="px-2.5 py-1 rounded-sm border border-transparent hover:border-white text-[13px] font-medium text-white whitespace-nowrap shrink-0 cursor-pointer"
          >
            {t.affiliateDisclosure}
          </button>
        </div>
      </div>
    </header>
  );
};
