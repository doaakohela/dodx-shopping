import { useCallback, useEffect, useRef, useState } from 'react';
import { AppRoute, CouponsPayload, Store } from './types/coupons';
import { CatalogCategoryId } from './data/unifiedCatalog';
import { EV_VEHICLES } from './data/evVehiclesCatalog';
import {
  detectInitialLanguage,
  getLanguageMeta,
  getTranslation,
  LanguageCode,
} from './i18n/translations';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { HomeView } from './components/HomeView';
import { DealsView } from './components/DealsView';
import { CouponsView } from './components/CouponsView';
import { ProductsView } from './components/ProductsView';
import { CarsView } from './components/CarsView';
import { ProductDetailView } from './components/ProductDetailView';
import { LegalView } from './components/LegalViews';
import { Footer } from './components/Footer';
import { ExtensionInstallModal } from './components/ExtensionInstallModal';

function parseLocation(): { route: AppRoute; storeParam: string | null } {
  const params = new URLSearchParams(window.location.search);
  const productQuery = params.get('product');
  const store = params.get('store');
  const rawPath = window.location.pathname;
  const path = rawPath.toLowerCase().replace(/\/+$/, '') || '/';

  if (path.startsWith('/p/')) {
    const slug = rawPath.slice(3).replace(/\/+$/, '');
    if (slug) {
      const decoded = decodeURIComponent(slug);
      if (EV_VEHICLES.some((v) => v.id === decoded)) {
        return { route: 'cars', storeParam: decoded };
      }
      return { route: 'product', storeParam: decoded };
    }
  }
  if (productQuery) {
    return { route: 'product', storeParam: productQuery };
  }
  if (path === '/coupons') {
    return { route: 'coupons', storeParam: null };
  }
  if (path === '/cars' || path.startsWith('/cars/')) {
    return { route: 'cars', storeParam: params.get('model') };
  }
  if (store || path === '/deals' || path.startsWith('/deals/')) {
    return { route: 'deals', storeParam: store || 'amazon' };
  }
  if (path === '/products' || path.startsWith('/products/')) {
    return { route: 'products', storeParam: params.get('dept') };
  }
  if (path === '/disclosure' || path === '/affiliate-disclosure') {
    return { route: 'disclosure', storeParam: null };
  }
  if (path === '/privacy' || path === '/privacy-policy') {
    return { route: 'privacy', storeParam: null };
  }
  return { route: 'home', storeParam: null };
}

export default function App() {
  const initial = parseLocation();
  const [route, setRoute] = useState<AppRoute>(initial.route);
  const [storeParam, setStoreParam] = useState<string | null>(initial.storeParam);
  const [stores, setStores] = useState<Store[]>([]);
  const [installModalOpen, setInstallModalOpen] = useState(false);

  const [lang, setLang] = useState<LanguageCode>(() => detectInitialLanguage());
  const t = getTranslation(lang);
  const langMeta = getLanguageMeta(lang);

  const [searchQuery, setSearchQuery] = useState('');
  const [searchStoreFilter, setSearchStoreFilter] = useState('all');
  const [activeCategory, setActiveCategory] = useState<CatalogCategoryId>('all');
  const [selectedRegion, setSelectedRegion] = useState('US & Global');
  const [desktopSidebarOpen, setDesktopSidebarOpen] = useState(true);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleToggleMenu = useCallback(() => {
    if (window.innerWidth >= 1024) {
      setDesktopSidebarOpen((prev) => !prev);
    } else {
      setDrawerOpen(true);
    }
  }, []);

  useEffect(() => {
    document.documentElement.lang = langMeta.code;
    document.documentElement.dir = langMeta.dir;
    try {
      localStorage.setItem('dodx_lang', langMeta.code);
    } catch {
      // Ignore storage access errors
    }
  }, [langMeta]);

  const isInitialRouteMount = useRef(true);

  useEffect(() => {
    if (isInitialRouteMount.current) {
      isInitialRouteMount.current = false;
      return;
    }
    const gtagFn = (window as Window & { gtag?: (...args: unknown[]) => void }).gtag;
    if (typeof gtagFn === 'function') {
      gtagFn('config', 'G-E4EE0Z7PC8', {
        page_path: window.location.pathname + window.location.search,
      });
    }
  }, [route, storeParam]);

  useEffect(() => {
    const onPopState = () => {
      const parsed = parseLocation();
      setRoute(parsed.route);
      setStoreParam(parsed.storeParam);
    };
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  // Load legacy coupons.json silently for ProductDetailView store lookup fallback
  useEffect(() => {
    let active = true;
    fetch('/coupons.json', { cache: 'no-cache' })
      .then((res) => (res.ok ? res.json() : null))
      .then((data: CouponsPayload | null) => {
        if (active && data?.stores) {
          setStores(data.stores);
        }
      })
      .catch(() => {
        // Unified catalog operates independently
      });
    return () => {
      active = false;
    };
  }, []);

  const navigateHome = useCallback((sectionId?: string) => {
    window.history.pushState({}, '', '/');
    setRoute('home');
    setStoreParam(null);
    if (sectionId) {
      window.setTimeout(() => {
        const el = document.getElementById(sectionId);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 60);
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, []);

  const navigateStore = useCallback((storeId: string) => {
    const nextUrl = `/deals?store=${encodeURIComponent(storeId)}`;
    window.history.pushState({}, '', nextUrl);
    setRoute('deals');
    setStoreParam(storeId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const navigateCoupons = useCallback(() => {
    window.history.pushState({}, '', '/coupons');
    setRoute('coupons');
    setStoreParam(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const navigateProducts = useCallback((deptId?: string) => {
    const nextUrl = deptId
      ? `/products?dept=${encodeURIComponent(deptId)}`
      : '/products';
    window.history.pushState({}, '', nextUrl);
    setRoute('products');
    setStoreParam(deptId || null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const navigateCars = useCallback((carId?: string) => {
    const nextUrl = carId
      ? `/cars?model=${encodeURIComponent(carId)}`
      : '/cars';
    window.history.pushState({}, '', nextUrl);
    setRoute('cars');
    setStoreParam(carId || null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const navigateLegal = useCallback((legalRoute: 'disclosure' | 'privacy') => {
    const nextUrl = legalRoute === 'disclosure' ? '/disclosure' : '/privacy';
    window.history.pushState({}, '', nextUrl);
    setRoute(legalRoute);
    setStoreParam(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const navigateProduct = useCallback((productId: string) => {
    const nextUrl = `/p/${encodeURIComponent(productId)}`;
    window.history.pushState({}, '', nextUrl);
    setRoute('product');
    setStoreParam(productId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleSelectCatalogCategory = useCallback(
    (categoryId: CatalogCategoryId) => {
      setActiveCategory(categoryId);
      if (route !== 'home') {
        navigateHome('hot-deals');
      } else if (categoryId !== 'all') {
        window.setTimeout(() => {
          const el = document.getElementById('hot-deals');
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }, 40);
      }
    },
    [route, navigateHome]
  );

  const handleSearchSubmit = useCallback(() => {
    if (route !== 'home') {
      navigateHome('hot-deals');
    } else {
      const el = document.getElementById('hot-deals');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  }, [route, navigateHome]);

  const handleClearSearch = useCallback(() => {
    setSearchQuery('');
    setSearchStoreFilter('all');
    setActiveCategory('all');
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-[#EAEDED] text-zinc-950">
      <Header
        searchQuery={searchQuery}
        onSearchChange={(val) => {
          setSearchQuery(val);
          if (route !== 'home') setRoute('home');
        }}
        searchStoreFilter={searchStoreFilter}
        onSearchStoreFilterChange={(val) => {
          setSearchStoreFilter(val);
          if (route !== 'home') setRoute('home');
        }}
        onSearchSubmit={handleSearchSubmit}
        selectedRegion={selectedRegion}
        onRegionChange={setSelectedRegion}
        copiedCount={3}
        currentLang={lang}
        onChangeLang={setLang}
        t={t}
        activeRoute={route}
        activeStoreId={route === 'deals' ? storeParam : null}
        onNavigateHome={navigateHome}
        onNavigateProducts={navigateProducts}
        onNavigateCoupons={navigateCoupons}
        onNavigateCars={navigateCars}
        onSelectStore={navigateStore}
        onNavigateLegal={navigateLegal}
        onOpenInstallModal={() => setInstallModalOpen(true)}
        onOpenDrawer={handleToggleMenu}
      />

      <div className="flex-1 flex max-w-[1520px] w-full mx-auto">
        <Sidebar
          activeStoreId={route === 'deals' ? storeParam : null}
          activeCatalogCategory={activeCategory}
          currentLang={lang}
          onChangeLang={setLang}
          t={t}
          activeRoute={route}
          onSelectCatalogCategory={handleSelectCatalogCategory}
          onNavigateProducts={navigateProducts}
          onNavigateCoupons={navigateCoupons}
          onNavigateCars={navigateCars}
          onSelectStore={navigateStore}
          onNavigateLegal={navigateLegal}
          onOpenInstallModal={() => setInstallModalOpen(true)}
          desktopOpen={desktopSidebarOpen}
          onCloseDesktop={() => setDesktopSidebarOpen(false)}
          drawerOpen={drawerOpen}
          onCloseDrawer={() => setDrawerOpen(false)}
        />

        <main className="flex-1 min-w-0 @container/main">
          {route === 'product' && storeParam ? (
            <ProductDetailView
              productId={storeParam}
              stores={stores}
              t={t}
              isAr={lang === 'ar'}
              onBackHome={() => navigateHome()}
              onSelectStore={navigateStore}
              onOpenProduct={navigateProduct}
            />
          ) : route === 'coupons' ? (
            <CouponsView
              t={t}
              isAr={lang === 'ar'}
              onBackHome={() => navigateHome()}
              onSelectStore={navigateStore}
            />
          ) : route === 'cars' ? (
            <CarsView
              lang={lang}
              t={t}
              initialCarId={storeParam}
              onSelectCar={navigateCars}
              onBackHome={() => navigateHome()}
            />
          ) : route === 'products' ? (
            <ProductsView
              lang={lang}
              t={t}
              initialDeptId={storeParam}
              onBackHome={() => navigateHome()}
              onSelectStore={navigateStore}
            />
          ) : route === 'deals' && storeParam ? (
            <DealsView
              storeParam={storeParam}
              isAr={lang === 'ar'}
              t={t}
              onBackHome={() => navigateHome()}
              onSelectStore={navigateStore}
              onNavigateCoupons={navigateCoupons}
              onOpenProduct={navigateProduct}
            />
          ) : route === 'disclosure' || route === 'privacy' ? (
            <LegalView
              mode={route}
              t={t}
              onBackHome={() => navigateHome()}
              onSwitchMode={navigateLegal}
            />
          ) : (
            <HomeView
              lang={lang}
              searchQuery={searchQuery}
              searchStoreFilter={searchStoreFilter}
              activeCategory={activeCategory}
              t={t}
              onSelectCategory={handleSelectCatalogCategory}
              onSelectStore={navigateStore}
              onNavigateCoupons={navigateCoupons}
              onNavigateProducts={navigateProducts}
              onNavigateCars={navigateCars}
              onOpenProduct={navigateProduct}
              onOpenInstallModal={() => setInstallModalOpen(true)}
              onClearSearch={handleClearSearch}
            />
          )}
        </main>
      </div>

      <Footer
        t={t}
        currentLang={lang}
        onChangeLang={setLang}
        onNavigateHome={navigateHome}
        onNavigateProducts={navigateProducts}
        onNavigateCoupons={navigateCoupons}
        onNavigateCars={navigateCars}
        onNavigateLegal={navigateLegal}
        onOpenInstallModal={() => setInstallModalOpen(true)}
      />

      <ExtensionInstallModal
        isOpen={installModalOpen}
        onClose={() => setInstallModalOpen(false)}
        onBrowseDeals={() => navigateHome('hot-deals')}
        t={t}
      />
    </div>
  );
}
