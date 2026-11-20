import { useCallback, useEffect, useRef, useState } from 'react';
import { CheckCircle2, ExternalLink } from 'lucide-react';
import { AppRoute, CouponsPayload, Deal, Store } from './types/coupons';
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
import { ProductsView } from './components/ProductsView';
import { ProductDetailView } from './components/ProductDetailView';
import { LegalView } from './components/LegalViews';
import { Footer } from './components/Footer';
import { ExtensionInstallModal } from './components/ExtensionInstallModal';

interface ToastState {
  id: number;
  title: string;
  subtitle: string;
  url?: string;
}

function parseLocation(): { route: AppRoute; storeParam: string | null } {
  const params = new URLSearchParams(window.location.search);
  const productQuery = params.get('product');
  const store = params.get('store');
  const rawPath = window.location.pathname;
  const path = rawPath.toLowerCase();

  if (path.startsWith('/p/')) {
    const slug = rawPath.slice(3).replace(/\/+$/, '');
    if (slug) {
      return { route: 'product', storeParam: decodeURIComponent(slug) };
    }
  }
  if (productQuery) {
    return { route: 'product', storeParam: productQuery };
  }
  if (store || path.startsWith('/deals')) {
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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [toast, setToast] = useState<ToastState | null>(null);
  const [installModalOpen, setInstallModalOpen] = useState(false);

  // Global i18n language state
  const [lang, setLang] = useState<LanguageCode>(() => detectInitialLanguage());
  const t = getTranslation(lang);
  const langMeta = getLanguageMeta(lang);

  // Header search, sidebar, & drawer states
  const [searchQuery, setSearchQuery] = useState('');
  const [searchStoreFilter, setSearchStoreFilter] = useState('all');
  const [activeCategory, setActiveCategory] = useState('All');
  const [selectedRegion, setSelectedRegion] = useState('US & Global');
  const [copiedCount, setCopiedCount] = useState(0);
  const [desktopSidebarOpen, setDesktopSidebarOpen] = useState(true);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleToggleMenu = useCallback(() => {
    if (window.innerWidth >= 1024) {
      setDesktopSidebarOpen((prev) => !prev);
    } else {
      setDrawerOpen(true);
    }
  }, []);

  // Sync <html lang="..." dir="..."> and persist choice
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

  useEffect(() => {
    let active = true;
    const loadCoupons = async () => {
      try {
        setLoading(true);
        const res = await fetch('/coupons.json', { cache: 'no-cache' });
        if (!res.ok) {
          throw new Error(`Failed to load deals (${res.status})`);
        }
        const data: CouponsPayload = await res.json();
        if (active) {
          setStores(data.stores || []);
          setError(null);
        }
      } catch (err) {
        if (active) {
          setError(err instanceof Error ? err.message : 'Unable to load deals.');
        }
      } finally {
        if (active) setLoading(false);
      }
    };
    loadCoupons();
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(null), 5000);
    return () => window.clearTimeout(timer);
  }, [toast]);

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

  const navigateProducts = useCallback((deptId?: string) => {
    const nextUrl = deptId
      ? `/products?dept=${encodeURIComponent(deptId)}`
      : '/products';
    window.history.pushState({}, '', nextUrl);
    setRoute('products');
    setStoreParam(deptId || null);
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

  const handleSelectCategory = useCallback(
    (category: string) => {
      setActiveCategory(category);
      if (route !== 'home') {
        navigateHome('hot-deals');
      } else {
        const el = document.getElementById('hot-deals');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }
    },
    [route, navigateHome]
  );

  const handleSearchSubmit = useCallback(() => {
    const targetId = searchQuery.trim() ? 'search-results' : 'hot-deals';
    if (route !== 'home') {
      navigateHome(targetId);
    } else {
      const el = document.getElementById(targetId) || document.getElementById('hot-deals');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  }, [route, searchQuery, navigateHome]);

  const handleClearSearch = useCallback(() => {
    setSearchQuery('');
    setSearchStoreFilter('all');
    setActiveCategory('All');
  }, []);

  const handleActivateDeal = useCallback(
    async (deal: Deal, store: Store) => {
      const targetUrl = deal.affiliateUrl || store.affiliateUrl;
      let copied = false;

      if (deal.code && navigator.clipboard?.writeText) {
        try {
          await navigator.clipboard.writeText(deal.code);
          copied = true;
        } catch {
          copied = false;
        }
      }

      setCopiedCount((c) => c + 1);
      window.open(targetUrl, '_blank', 'noopener,noreferrer');

      setToast({
        id: Date.now(),
        title: deal.code
          ? copied
            ? `${t.copiedToastPrefix} "${deal.code}"`
            : `${t.useCodeToastPrefix} "${deal.code}"`
          : `${store.name} — ${t.dealActivatedToast}`,
        subtitle: `${store.name} · ${t.openingStoreToast}`,
        url: targetUrl,
      });
    },
    [t]
  );

  return (
    <div className="min-h-screen flex flex-col bg-[#EAEDED] text-zinc-950">
      <Header
        stores={stores}
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
        copiedCount={copiedCount}
        currentLang={lang}
        onChangeLang={setLang}
        t={t}
        activeRoute={route}
        onNavigateHome={navigateHome}
        onNavigateProducts={navigateProducts}
        onSelectStore={navigateStore}
        onNavigateLegal={navigateLegal}
        onOpenInstallModal={() => setInstallModalOpen(true)}
        onOpenDrawer={handleToggleMenu}
      />

      <div className="flex-1 flex max-w-[1520px] w-full mx-auto">
        <Sidebar
          stores={stores}
          activeStoreId={route === 'deals' ? storeParam : null}
          activeCategory={activeCategory}
          currentLang={lang}
          onChangeLang={setLang}
          t={t}
          activeRoute={route}
          onSelectCategory={handleSelectCategory}
          onNavigateProducts={navigateProducts}
          onSelectStore={navigateStore}
          onNavigateLegal={navigateLegal}
          onOpenInstallModal={() => setInstallModalOpen(true)}
          desktopOpen={desktopSidebarOpen}
          onCloseDesktop={() => setDesktopSidebarOpen(false)}
          drawerOpen={drawerOpen}
          onCloseDrawer={() => setDrawerOpen(false)}
        />

        <main className="flex-1 min-w-0 @container/main">
          {loading ? (
            <div className="p-6 space-y-4">
              <div className="h-72 bg-white border border-zinc-200 rounded-xl animate-pulse" />
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[1, 2, 3].map((n) => (
                  <div
                    key={n}
                    className="h-44 bg-white border border-zinc-200 rounded-md animate-pulse"
                  />
                ))}
              </div>
            </div>
          ) : error ? (
            <div className="max-w-xl mx-auto px-4 py-16 text-center">
              <h1 className="font-display text-2xl font-bold text-zinc-950">
                Unable to load deals catalog
              </h1>
              <p className="mt-2 text-sm text-zinc-600">{error}</p>
              <button
                type="button"
                onClick={() => window.location.reload()}
                className="mt-5 px-5 py-2 bg-[#FFD814] hover:bg-[#F7CA00] text-zinc-950 text-sm font-bold rounded-full border border-[#FCD200] cursor-pointer"
              >
                Retry
              </button>
            </div>
          ) : route === 'product' && storeParam ? (
            <ProductDetailView
              productId={storeParam}
              stores={stores}
              t={t}
              isAr={lang === 'ar'}
              onBackHome={() => navigateHome()}
              onSelectStore={navigateStore}
              onOpenProduct={navigateProduct}
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
              stores={stores}
              t={t}
              onBackHome={() => navigateHome()}
              onSelectStore={navigateStore}
              onActivateDeal={handleActivateDeal}
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
              stores={stores}
              lang={lang}
              searchQuery={searchQuery}
              searchStoreFilter={searchStoreFilter}
              activeCategory={activeCategory}
              t={t}
              onSelectCategory={handleSelectCategory}
              onSelectStore={navigateStore}
              onNavigateProducts={navigateProducts}
              onActivateDeal={handleActivateDeal}
              onOpenInstallModal={() => setInstallModalOpen(true)}
              onNavigateLegal={navigateLegal}
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
        onNavigateLegal={navigateLegal}
        onOpenInstallModal={() => setInstallModalOpen(true)}
      />

      <ExtensionInstallModal
        isOpen={installModalOpen}
        onClose={() => setInstallModalOpen(false)}
        onBrowseDeals={() => navigateHome('hot-deals')}
        t={t}
      />

      {/* Accessible Confirmation Toast */}
      {toast && (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-5 end-5 z-50 max-w-sm w-[calc(100%-2.5rem)] bg-[#00453E] text-white border border-emerald-700 rounded-xl p-4 shadow-xl"
        >
          <div className="flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-[#FFD814] shrink-0 mt-0.5" />
            <div className="min-w-0 flex-1">
              <p className="text-sm font-bold">{toast.title}</p>
              <p className="mt-0.5 text-xs text-emerald-100">{toast.subtitle}</p>
              {toast.url && (
                <a
                  href={toast.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 inline-flex items-center gap-1 text-xs font-bold text-[#FFD814] hover:underline"
                >
                  {t.openManually}
                  <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </div>
            <button
              type="button"
              onClick={() => setToast(null)}
              className="text-xs text-emerald-200 hover:text-white cursor-pointer"
            >
              {t.close}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
