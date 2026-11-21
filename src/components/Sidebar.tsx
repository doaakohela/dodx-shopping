import React, { useEffect, useState } from 'react';
import {
  Bike,
  Car,
  ChevronDown,
  ChevronRight,
  Chrome,
  FileText,
  Flame,
  Gem,
  Headphones,
  Home,
  Laptop,
  LayoutGrid,
  Monitor,
  ShieldCheck,
  Shirt,
  ShoppingBag,
  Smartphone,
  Sparkles,
  Tag,
  Utensils,
  Watch,
  X,
} from 'lucide-react';
import { AppRoute } from '../types/coupons';
import {
  CATALOG_CATEGORIES,
  CatalogCategoryId,
  CATALOG_PRODUCTS,
  STORE_GROUPS,
} from '../data/unifiedCatalog';
import {
  LanguageCode,
  SUPPORTED_LANGUAGES,
  TranslationDict,
} from '../i18n/translations';
import { StoreLogo } from './StoreLogo';

interface SidebarProps {
  activeStoreId: string | null;
  activeCatalogCategory: CatalogCategoryId;
  currentLang: LanguageCode;
  onChangeLang: (lang: LanguageCode) => void;
  t: TranslationDict;
  activeRoute: AppRoute;
  onSelectCatalogCategory: (categoryId: CatalogCategoryId) => void;
  onNavigateProducts: (deptId?: string) => void;
  onNavigateCoupons: () => void;
  onSelectStore: (storeId: string) => void;
  onNavigateLegal: (route: 'disclosure' | 'privacy') => void;
  onOpenInstallModal: () => void;
  desktopOpen: boolean;
  onCloseDesktop: () => void;
  drawerOpen: boolean;
  onCloseDrawer: () => void;
}

const CATEGORY_ICON_MAP: Record<CatalogCategoryId, typeof Flame> = {
  all: Flame,
  smartphones: Smartphone,
  laptops: Laptop,
  'tablets-wearables': Watch,
  audio: Headphones,
  'tv-monitors': Monitor,
  'men-fashion': Shirt,
  'women-fashion': ShoppingBag,
  accessories: ShoppingBag,
  'watches-jewelry': Gem,
  'beauty-health': Sparkles,
  'home-furniture': Home,
  'food-grocery': Utensils,
  cars: Car,
  motorcycles: Bike,
  software: ShieldCheck,
};

export const Sidebar: React.FC<SidebarProps> = ({
  activeStoreId,
  activeCatalogCategory,
  currentLang,
  onChangeLang,
  t,
  activeRoute,
  onSelectCatalogCategory,
  onNavigateProducts,
  onNavigateCoupons,
  onSelectStore,
  onNavigateLegal,
  onOpenInstallModal,
  desktopOpen,
  onCloseDesktop,
  drawerOpen,
  onCloseDrawer,
}) => {
  const isAr = currentLang === 'ar';
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({
    amazon: true,
  });

  useEffect(() => {
    if (!drawerOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onCloseDrawer();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [drawerOpen, onCloseDrawer]);

  const toggleGroup = (groupId: string) => {
    setExpandedGroups((prev) => ({ ...prev, [groupId]: !prev[groupId] }));
  };

  const countProductsForStore = (storeId: string) =>
    CATALOG_PRODUCTS.filter((p) => p.storeId === storeId).length;

  const countProductsForCategory = (catId: CatalogCategoryId) =>
    catId === 'all'
      ? CATALOG_PRODUCTS.length
      : CATALOG_PRODUCTS.filter((p) => p.categoryId === catId).length;

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
        {/* Hierarchical Global Stores with Expandable Country Submenus */}
        <div className="p-3.5">
          <div className="flex items-center justify-between gap-2 px-2">
            <h3 className="font-display text-xs font-extrabold uppercase tracking-wider text-zinc-900">
              {t.storesHeading}
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

          <ul className="mt-2 space-y-1">
            {STORE_GROUPS.map((group) => {
              const hasBranches = group.branches.length > 1;
              const isExpanded = Boolean(expandedGroups[group.id]);
              const groupActive =
                activeRoute === 'deals' &&
                activeStoreId !== null &&
                (activeStoreId.toLowerCase() === group.id ||
                  group.branches.some((b) => b.id === activeStoreId.toLowerCase()));

              return (
                <li key={group.id}>
                  <button
                    type="button"
                    onClick={() => {
                      if (hasBranches) {
                        toggleGroup(group.id);
                      } else {
                        onSelectStore(group.defaultStoreId);
                        if (isDrawer) onCloseDrawer();
                      }
                    }}
                    className={`w-full flex items-center justify-between gap-2 px-2 py-2 rounded-md text-start text-[13px] transition-colors cursor-pointer ${
                      groupActive
                        ? 'bg-emerald-50 text-emerald-950 font-bold'
                        : 'text-zinc-800 hover:bg-zinc-100 font-semibold'
                    }`}
                  >
                    <span className="flex items-center gap-2.5 min-w-0">
                      <StoreLogo
                        storeId={group.defaultStoreId}
                        name={isAr ? group.nameAr : group.nameEn}
                        size="sm"
                      />
                      <span className="truncate">{isAr ? group.nameAr : group.nameEn}</span>
                    </span>

                    <span className="flex items-center gap-1 shrink-0">
                      {group.comingSoon ? (
                        <span className="text-[10px] font-bold bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded">
                          {isAr ? 'قريباً' : 'Soon'}
                        </span>
                      ) : hasBranches ? (
                        isExpanded ? (
                          <ChevronDown className="w-3.5 h-3.5 text-zinc-500" />
                        ) : (
                          <ChevronRight className="w-3.5 h-3.5 text-zinc-500 rtl:rotate-180" />
                        )
                      ) : null}
                    </span>
                  </button>

                  {hasBranches && isExpanded && (
                    <ul className="mt-1 ms-4 ps-2.5 border-s-2 border-emerald-200 space-y-0.5">
                      {group.branches.map((branch) => {
                        const branchActive =
                          activeRoute === 'deals' &&
                          activeStoreId?.toLowerCase() === branch.id.toLowerCase();
                        const count = countProductsForStore(branch.id);
                        return (
                          <li key={branch.id}>
                            <button
                              type="button"
                              onClick={() => {
                                onSelectStore(branch.id);
                                if (isDrawer) onCloseDrawer();
                              }}
                              className={`w-full flex items-center justify-between gap-2 px-2 py-1.5 rounded text-start text-xs transition-colors cursor-pointer ${
                                branchActive
                                  ? 'bg-[#00453E] text-white font-bold'
                                  : 'text-zinc-700 hover:bg-zinc-100 font-medium'
                              }`}
                            >
                              <span className="truncate">
                                {branch.flag} {isAr ? branch.nameAr : branch.nameEn}
                              </span>
                              {count > 0 && (
                                <span
                                  className={`text-[10px] font-mono tabular-nums shrink-0 ${
                                    branchActive ? 'text-[#FFD814]' : 'text-zinc-500'
                                  }`}
                                >
                                  {count}
                                </span>
                              )}
                            </button>
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </li>
              );
            })}
          </ul>
        </div>

        {/* Dedicated Coupons CTA + Visual Products Link */}
        <div className="p-3.5 space-y-1.5">
          <button
            type="button"
            onClick={() => {
              onNavigateCoupons();
              if (isDrawer) onCloseDrawer();
            }}
            className={`w-full flex items-center justify-between gap-2 px-2.5 py-2 rounded-md text-[13px] font-bold transition-colors cursor-pointer ${
              activeRoute === 'coupons'
                ? 'bg-[#FFD814] text-zinc-950 border border-[#FCD200]'
                : 'bg-amber-50 text-zinc-900 hover:bg-amber-100 border border-amber-200'
            }`}
          >
            <span className="flex items-center gap-2 truncate">
              <Tag className="w-4 h-4 shrink-0 text-[#B12704]" />
              <span className="truncate">{t.couponsNav}</span>
            </span>
            <ChevronRight className="w-3.5 h-3.5 opacity-75 shrink-0 rtl:rotate-180" />
          </button>

          <button
            type="button"
            onClick={() => {
              onNavigateProducts();
              if (isDrawer) onCloseDrawer();
            }}
            className={`w-full flex items-center justify-between gap-2 px-2.5 py-2 rounded-md text-[13px] font-semibold transition-colors cursor-pointer ${
              activeRoute === 'products'
                ? 'bg-[#00453E] text-white font-bold'
                : 'bg-emerald-50/70 text-emerald-950 hover:bg-emerald-100'
            }`}
          >
            <span className="flex items-center gap-2 truncate">
              <LayoutGrid className="w-4 h-4 shrink-0" />
              <span className="truncate">{t.productsNav}</span>
            </span>
            <ChevronRight className="w-3.5 h-3.5 opacity-70 shrink-0 rtl:rotate-180" />
          </button>
        </div>

        {/* Amazon-Style Product Categories */}
        <div className="p-3.5">
          <h3 className="px-2 font-display text-xs font-extrabold uppercase tracking-wider text-zinc-900">
            {t.categoriesHeading}
          </h3>
          <ul className="mt-2 space-y-0.5">
            {CATALOG_CATEGORIES.map((cat) => {
              const Icon = CATEGORY_ICON_MAP[cat.id] || ShoppingBag;
              const isSelected = activeRoute === 'home' && activeCatalogCategory === cat.id;
              const count = countProductsForCategory(cat.id);
              return (
                <li key={cat.id}>
                  <button
                    type="button"
                    onClick={() => {
                      onSelectCatalogCategory(cat.id);
                      if (isDrawer) onCloseDrawer();
                    }}
                    className={`w-full flex items-center justify-between gap-2 px-2.5 py-2 rounded-md text-[12.5px] transition-colors cursor-pointer text-start ${
                      isSelected
                        ? 'bg-zinc-900 text-white font-bold'
                        : 'text-zinc-700 hover:bg-zinc-100 font-medium'
                    }`}
                  >
                    <span className="flex items-center gap-2 min-w-0">
                      <Icon className="w-4 h-4 shrink-0 opacity-80" />
                      <span className="truncate">{isAr ? cat.nameAr : cat.nameEn}</span>
                    </span>
                    <span
                      className={`text-[10px] font-mono tabular-nums shrink-0 ${
                        isSelected ? 'text-[#FFD814]' : count > 0 ? 'text-[#007600] font-bold' : 'text-zinc-400'
                      }`}
                    >
                      {count > 0 ? count : isAr ? 'قريباً' : 'Soon'}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>

        {/* Quick Language Switcher */}
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

        {/* Consumer Info & Legal */}
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
          aria-label="Stores and Categories Sidebar"
          className="hidden lg:block w-[248px] shrink-0 bg-white border-e border-zinc-200"
        >
          <div className="sticky top-[100px] max-h-[calc(100vh-100px)] overflow-y-auto">
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
          <div className="relative z-10 w-[308px] max-w-[85vw] bg-white h-full shadow-2xl">
            {sidebarContent(true)}
          </div>
        </div>
      )}
    </>
  );
};
