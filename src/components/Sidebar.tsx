import React, { useEffect } from 'react';
import {
  ChevronRight,
  Chrome,
  FileText,
  Flame,
  Home,
  Laptop,
  LayoutGrid,
  ShieldCheck,
  Shirt,
  ShoppingBag,
  Sparkles,
  X,
} from 'lucide-react';
import { AppRoute, Store } from '../types/coupons';
import {
  LanguageCode,
  SUPPORTED_LANGUAGES,
  TranslationDict,
} from '../i18n/translations';
import { StoreLogo } from './StoreLogo';

interface SidebarProps {
  stores: Store[];
  activeStoreId: string | null;
  activeCategory: string;
  currentLang: LanguageCode;
  onChangeLang: (lang: LanguageCode) => void;
  t: TranslationDict;
  activeRoute: AppRoute;
  onSelectCategory: (category: string) => void;
  onNavigateProducts: (deptId?: string) => void;
  onSelectStore: (storeId: string) => void;
  onNavigateLegal: (route: 'disclosure' | 'privacy') => void;
  onOpenInstallModal: () => void;
  desktopOpen: boolean;
  onCloseDesktop: () => void;
  drawerOpen: boolean;
  onCloseDrawer: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  stores,
  activeStoreId,
  activeCategory,
  currentLang,
  onChangeLang,
  t,
  activeRoute,
  onSelectCategory,
  onNavigateProducts,
  onSelectStore,
  onNavigateLegal,
  onOpenInstallModal,
  desktopOpen,
  onCloseDesktop,
  drawerOpen,
  onCloseDrawer,
}) => {
  useEffect(() => {
    if (!drawerOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onCloseDrawer();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [drawerOpen, onCloseDrawer]);

  const departmentLinks: Array<{
    id: string;
    label: string;
    icon: typeof Flame;
    productDeptId?: string;
  }> = [
    { id: 'All', label: t.allVerifiedDeals, icon: Flame },
    { id: 'Marketplaces', label: t.globalMarketplaces, icon: ShoppingBag },
    { id: 'Electronics & Home', label: t.electronicsHome, icon: Laptop },
    { id: 'fashion-dept', label: t.fashionApparel, icon: Shirt, productDeptId: 'fashion' },
    { id: 'home-dept', label: currentLang === 'ar' ? 'المنزل والمطبخ' : 'Home & Kitchen', icon: Home, productDeptId: 'home-kitchen' },
    { id: 'beauty-dept', label: currentLang === 'ar' ? 'الجمال والعطور' : 'Beauty & Perfume', icon: Sparkles, productDeptId: 'beauty' },
  ];

  const sidebarContent = (isDrawer: boolean) => (
    <div className="flex flex-col h-full">
      {isDrawer && (
        <div className="bg-[#00453E] text-white px-5 py-4 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-full bg-white text-[#00453E] flex items-center justify-center font-display font-extrabold text-sm">
              D
            </div>
            <div>
              <p className="font-display text-sm font-bold leading-tight">
                {t.helloShopper}
              </p>
              <p className="text-[11px] text-emerald-100">{t.verifiedDealsSub}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onCloseDrawer}
            aria-label={t.close}
            className="p-1 text-white/80 hover:text-white rounded cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      )}

      <div className="flex-1 overflow-y-auto divide-y divide-zinc-200">
        {/* Stores Section */}
        <div className="p-3.5">
          <div className="flex items-center justify-between gap-2 px-2">
            <h3 className="font-display text-xs font-extrabold uppercase tracking-wider text-zinc-900">
              {t.topStores}
            </h3>
            {!isDrawer && (
              <button
                type="button"
                onClick={onCloseDesktop}
                aria-label={t.close}
                title={t.close}
                className="p-1 text-zinc-500 hover:text-zinc-950 hover:bg-zinc-100 rounded-md transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
          <ul className="mt-2 space-y-0.5">
            {stores.map((store) => {
              const isActive = activeStoreId === store.id;
              return (
                <li key={store.id}>
                  <button
                    type="button"
                    onClick={() => {
                      onSelectStore(store.id);
                      if (isDrawer) onCloseDrawer();
                    }}
                    className={`w-full flex items-center justify-between gap-2 px-2 py-2 rounded-md text-start text-[13px] transition-colors cursor-pointer ${
                      isActive
                        ? 'bg-emerald-50 text-emerald-900 font-bold'
                        : 'text-zinc-800 hover:bg-zinc-100 font-medium'
                    }`}
                  >
                    <span className="flex items-center gap-2.5 min-w-0">
                      <StoreLogo storeId={store.id} name={store.name} size="sm" />
                      <span className="truncate">{store.name}</span>
                    </span>
                    <span className="text-[11px] font-mono font-semibold text-zinc-500 tabular-nums shrink-0">
                      {store.deals.length}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>

        {/* Departments / Categories */}
        <div className="p-3.5">
          <h3 className="px-2 font-display text-xs font-extrabold uppercase tracking-wider text-zinc-900">
            {t.shopByDepartment}
          </h3>
          <ul className="mt-2 space-y-0.5">
            <li>
              <button
                type="button"
                onClick={() => {
                  onNavigateProducts();
                  if (isDrawer) onCloseDrawer();
                }}
                className={`w-full flex items-center justify-between gap-2 px-2.5 py-2 rounded-md text-[13px] transition-colors cursor-pointer ${
                  activeRoute === 'products'
                    ? 'bg-[#00453E] text-white font-bold'
                    : 'bg-emerald-50/70 text-emerald-950 hover:bg-emerald-100 font-semibold'
                }`}
              >
                <span className="flex items-center gap-2.5 truncate">
                  <LayoutGrid className="w-4 h-4 shrink-0" />
                  <span className="truncate">{t.productsNav}</span>
                </span>
                <ChevronRight className="w-3.5 h-3.5 opacity-70 shrink-0 rtl:rotate-180" />
              </button>
            </li>
            {departmentLinks.map((dept) => {
              const Icon = dept.icon;
              const isSelected = activeCategory === dept.id;
              return (
                <li key={dept.id}>
                  <button
                    type="button"
                    onClick={() => {
                      if (dept.productDeptId) {
                        onNavigateProducts(dept.productDeptId);
                      } else {
                        onSelectCategory(dept.id);
                      }
                      if (isDrawer) onCloseDrawer();
                    }}
                    className={`w-full flex items-center justify-between gap-2 px-2.5 py-2 rounded-md text-[13px] transition-colors cursor-pointer ${
                      isSelected
                        ? 'bg-zinc-900 text-white font-semibold'
                        : 'text-zinc-700 hover:bg-zinc-100 font-medium'
                    }`}
                  >
                    <span className="flex items-center gap-2.5 truncate">
                      <Icon className="w-4 h-4 shrink-0 opacity-80" />
                      <span className="truncate">{dept.label}</span>
                    </span>
                    <ChevronRight className="w-3.5 h-3.5 opacity-60 shrink-0 rtl:rotate-180" />
                  </button>
                </li>
              );
            })}
          </ul>
        </div>

        {/* Quick Language Switcher in Drawer/Sidebar */}
        <div className="p-3.5">
          <h3 className="px-2 font-display text-xs font-extrabold uppercase tracking-wider text-zinc-900 mb-2">
            {t.languageTitle}
          </h3>
          <select
            aria-label={t.languageTitle}
            value={currentLang}
            onChange={(e) => {
              onChangeLang(e.target.value as LanguageCode);
              if (isDrawer) onCloseDrawer();
            }}
            className="w-full px-2.5 py-2 text-xs font-semibold bg-zinc-50 border border-zinc-300 rounded-md text-zinc-900 focus:outline-none focus:border-[#00453E] cursor-pointer"
          >
            {SUPPORTED_LANGUAGES.map((lang) => (
              <option key={lang.code} value={lang.code}>
                {lang.flag} {lang.nativeName} ({lang.englishName})
              </option>
            ))}
          </select>
        </div>

        {/* Consumer Information & Legal */}
        <div className="p-3.5">
          <h3 className="px-2 font-display text-xs font-extrabold uppercase tracking-wider text-zinc-900">
            {t.helpInformation}
          </h3>
          <ul className="mt-2 space-y-0.5 text-[13px]">
            <li>
              <button
                type="button"
                onClick={() => {
                  onOpenInstallModal();
                  if (isDrawer) onCloseDrawer();
                }}
                className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-md text-emerald-800 bg-emerald-50/80 hover:bg-emerald-100 font-semibold transition-colors cursor-pointer text-start"
              >
                <Chrome className="w-4 h-4 shrink-0" />
                <span>{t.dodxBrowserExtension}</span>
              </button>
            </li>
            <li>
              <button
                type="button"
                onClick={() => {
                  onNavigateLegal('disclosure');
                  if (isDrawer) onCloseDrawer();
                }}
                className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-md text-zinc-700 hover:bg-zinc-100 font-medium transition-colors cursor-pointer text-start"
              >
                <ShieldCheck className="w-4 h-4 shrink-0 opacity-75" />
                <span>{t.affiliateDisclosure}</span>
              </button>
            </li>
            <li>
              <button
                type="button"
                onClick={() => {
                  onNavigateLegal('privacy');
                  if (isDrawer) onCloseDrawer();
                }}
                className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-md text-zinc-700 hover:bg-zinc-100 font-medium transition-colors cursor-pointer text-start"
              >
                <FileText className="w-4 h-4 shrink-0 opacity-75" />
                <span>{t.privacyPolicy}</span>
              </button>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {desktopOpen && (
        <aside
          aria-label="Stores and Departments Sidebar"
          className="hidden lg:block w-[236px] shrink-0 bg-white border-e border-zinc-200"
        >
          <div className="sticky top-[99px] max-h-[calc(100vh-99px)] overflow-y-auto">
            {sidebarContent(false)}
          </div>
        </aside>
      )}

      {drawerOpen && (
        <div
          className="fixed inset-0 z-50 flex"
          role="dialog"
          aria-modal="true"
          aria-label="Dodx Full Menu"
        >
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-[1px]"
            onClick={onCloseDrawer}
          />
          <div className="relative z-10 w-[300px] max-w-[85vw] bg-white h-full shadow-2xl">
            {sidebarContent(true)}
          </div>
        </div>
      )}
    </>
  );
};
