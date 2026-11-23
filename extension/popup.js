'use strict';

const SITE_HOME_URL = 'https://www.dodx.shop';
const LANG_STORAGE_KEY = 'dodx_ext_lang';
const isStandaloneWindow = new URLSearchParams(window.location.search).get('mode') === 'window';

let currentLang = 'en'; // Always defaults to English on first load
let currentPayload = null;
let currentMatchedStore = null;
let activeHostname = '';
let selectedGroupId = 'all';
let selectedBranchId = 'all';
let selectedCategoryId = 'all';
let selectedPriceTier = 'all';
let viewMode = 'products'; // 'products' | 'coupons'

const SUPPORTED_LANGUAGES = [
  { code: 'en', shortLabel: 'EN', nativeName: 'English', flag: '🇺🇸', dir: 'ltr' },
  { code: 'ar', shortLabel: 'AR', nativeName: 'العربية', flag: '🇸🇦', dir: 'rtl' },
  { code: 'es', shortLabel: 'ES', nativeName: 'Español', flag: '🇪🇸', dir: 'ltr' },
  { code: 'fr', shortLabel: 'FR', nativeName: 'Français', flag: '🇫🇷', dir: 'ltr' },
  { code: 'de', shortLabel: 'DE', nativeName: 'Deutsch', flag: '🇩🇪', dir: 'ltr' },
  { code: 'pt', shortLabel: 'PT', nativeName: 'Português', flag: '🇧🇷', dir: 'ltr' },
  { code: 'zh', shortLabel: 'ZH', nativeName: '简体中文', flag: '🇨🇳', dir: 'ltr' },
  { code: 'ja', shortLabel: 'JA', nativeName: '日本語', flag: '🇯🇵', dir: 'ltr' },
  { code: 'ko', shortLabel: 'KO', nativeName: '한국어', flag: '🇰🇷', dir: 'ltr' },
  { code: 'hi', shortLabel: 'HI', nativeName: 'हिन्दी', flag: '🇮🇳', dir: 'ltr' },
  { code: 'tr', shortLabel: 'TR', nativeName: 'Türkçe', flag: '🇹🇷', dir: 'ltr' },
  { code: 'ru', shortLabel: 'RU', nativeName: 'Русский', flag: '🇷🇺', dir: 'ltr' },
  { code: 'it', shortLabel: 'IT', nativeName: 'Italiano', flag: '🇮🇹', dir: 'ltr' },
  { code: 'id', shortLabel: 'ID', nativeName: 'Bahasa Indonesia', flag: '🇮🇩', dir: 'ltr' },
  { code: 'nl', shortLabel: 'NL', nativeName: 'Nederlands', flag: '🇳🇱', dir: 'ltr' },
  { code: 'pl', shortLabel: 'PL', nativeName: 'Polski', flag: '🇵🇱', dir: 'ltr' },
];

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

function makeTierLabels(rangeWord, toWord, overWord, topLabel, majorLabel, lightningLabel) {
  return {
    '1-30': `${rangeWord}1 ${toWord} 30 (${topLabel})`.trim(),
    '30-60': `${rangeWord}30 ${toWord} 60`.trim(),
    '60-100': `${rangeWord}60 ${toWord} 100`.trim(),
    '100-150': `${rangeWord}100 ${toWord} 150`.trim(),
    '150-500': `${rangeWord}150 ${toWord} 500`.trim(),
    '500-1000': `${rangeWord}500 ${toWord} 1,000`.trim(),
    '1000-2000': `${rangeWord}1,000 ${toWord} 2,000`.trim(),
    '2000-3000': `${rangeWord}2,000 ${toWord} 3,000`.trim(),
    '3000-5000': `${rangeWord}3,000 ${toWord} 5,000`.trim(),
    'over-5000': `${overWord} 5,000 (${majorLabel})`.trim(),
    'over-10000': `${overWord} 10,000 (⚡ ${lightningLabel})`.trim(),
  };
}

const I18N = {
  en: {
    pageTitle: 'Dodx – Official Shopping Partners & Verified Deals',
    langMenuTitle: 'Choose Language',
    langBtnTitle: 'Select display language',
    extraLangLabel: 'More world languages (Translate):',
    extraLangPlaceholder: 'Select another language...',
    flashTimerTitle: 'Flash Deal Countdown',
    popoutTitle: 'Open in standalone window',
    refreshTitle: 'Sync latest offers',
    taglineSuffix: 'Verified Deals',
    couponsBtn: 'Coupons',
    productsLink: 'Products',
    searchPlaceholder: 'Search iPhone, laptop, Samsung, Amazon...',
    searchAria: 'Search products and stores',
    catAria: 'Filter by category',
    priceAria: 'Filter by price bracket',
    allPriceTiers: 'All Price Tiers',
    allStores: 'All Stores',
    allPrefix: 'All',
    soonSuffix: '(Soon)',
    loadingText: 'Loading products & stores from dodx.shop...',
    offlineError: 'Unable to load offers. Visit https://www.dodx.shop directly.',
    disclosurePrefix: 'Affiliate Disclosure:',
    defaultDisclosure: 'As an affiliate, dodx.shop may earn a commission from qualifying purchases at no extra cost to you.',
    footerCoupons: 'Coupons',
    footerProducts: 'Products',
    footerDisclosure: 'Disclosure',
    couponsHeading: 'Verified Coupons & Bank Codes',
    offersCount: (n) => `${n} offers`,
    itemsCount: (n) => `${n} items`,
    noCoupons: 'No matching coupons found.',
    whiteFridayStrip: 'Best Deals — Huge White & Black Friday Discounts',
    comingSoonHeading: 'Biggest Discounts Coming Very Soon',
    comingSoonStoreBody: (name) => `${name} deals are coming very soon on dodx.shop.`,
    comingSoonFilterBody: 'No matching deals in this selection — try All Stores or switch price brackets.',
    openStorefront: (name) => `Open ${name} Storefront →`,
    topProductsHeading: 'Top Verified Deals & Flash Markdowns',
    storeProductsHeading: (name) => `${name} Products`,
    buyNow: 'Buy Now →',
    codeLabel: 'Code:',
    copyAndShop: (code) => `Copy ${code} & Shop →`,
    openOffer: 'Open Offer →',
    syncedNotice: 'Synced latest prices, categories & coupons from dodx.shop',
    partnerFallback: 'Dodx Partner',
    dealBadgeFallback: 'DEAL',
    couponBadgeFallback: 'COUPON',
    tierLabels: makeTierLabels('', '–', '>', 'Top Discounts', 'Major', 'Lightning'),
  },
  ar: {
    pageTitle: 'Dodx – شركاء التسوق الرسميون وأفضل العروض الموثقة',
    langMenuTitle: 'اختر اللغة',
    langBtnTitle: 'اختر لغة العرض',
    extraLangLabel: 'لغات عالمية أخرى (ترجمة فورية):',
    extraLangPlaceholder: 'اختر لغة أخرى...',
    flashTimerTitle: 'عد تنازلي لعروض البرق',
    popoutTitle: 'فتح في نافذة مستقلة',
    refreshTitle: 'تحديث أحدث العروض',
    taglineSuffix: 'عروض موثقة',
    couponsBtn: 'الكوبونات',
    productsLink: 'المنتجات',
    searchPlaceholder: 'ابحث عن آيفون، لابتوب، سامسونج، أمازون...',
    searchAria: 'البحث عن المنتجات والمتاجر',
    catAria: 'تصفية حسب القسم',
    priceAria: 'تصفية حسب نطاق السعر',
    allPriceTiers: 'كل نطاقات الأسعار',
    allStores: 'كل المتاجر',
    allPrefix: 'كل فروع',
    soonSuffix: '(قريباً)',
    loadingText: 'جاري تحميل المنتجات والمتاجر من dodx.shop...',
    offlineError: 'تعذر تحميل العروض. قم بزيارة https://www.dodx.shop مباشرة.',
    disclosurePrefix: 'إفصاح الشراكة:',
    defaultDisclosure: 'كموقع تسويق بالعمولة، قد يحصل dodx.shop على عمولة من المشتريات المؤهلة دون أي تكلفة إضافية عليك.',
    footerCoupons: 'الكوبونات',
    footerProducts: 'المنتجات',
    footerDisclosure: 'الإفصاح',
    couponsHeading: 'أكواد الخصم والبطاقات البنكية الموثقة',
    offersCount: (n) => `${n} عرض`,
    itemsCount: (n) => `${n} منتج`,
    noCoupons: 'لم يتم العثور على كوبونات مطابقة.',
    whiteFridayStrip: 'أفضل الصفقات — خصومات كبيرة جداً بمناسبة الجمعة البيضاء',
    comingSoonHeading: 'انتظر أقوى الخصومات قريباً جداً',
    comingSoonStoreBody: (name) => `عروض ${name} قيد الإضافة وستتوفر قريباً جداً على dodx.shop.`,
    comingSoonFilterBody: 'لا توجد منتجات مطابقة في هذا النطاق السعري — جرب كل المتاجر أو نطاق سعر آخر.',
    openStorefront: (name) => `فتح واجهة متجر ${name} ←`,
    topProductsHeading: 'أقوى العروض والخصومات الموثقة',
    storeProductsHeading: (name) => `منتجات ${name}`,
    buyNow: 'اشترِ الآن ←',
    codeLabel: 'الكود:',
    copyAndShop: (code) => `نسخ ${code} والتسوق ←`,
    openOffer: 'فتح العرض ←',
    syncedNotice: 'تم تحديث أحدث الأسعار والأقسام والكوبونات من dodx.shop',
    partnerFallback: 'شريك Dodx',
    dealBadgeFallback: 'عرض',
    couponBadgeFallback: 'كوبون',
    tierLabels: makeTierLabels('من ', 'إلى', 'أكبر من', 'أكبر الخصومات', 'خصومات كبيرة', 'عرض البرق'),
  },
  es: {
    pageTitle: 'Dodx – Tiendas Oficiales y Ofertas Verificadas',
    langMenuTitle: 'Elegir idioma',
    langBtnTitle: 'Seleccionar idioma de visualización',
    extraLangLabel: 'Más idiomas (Traducción):',
    extraLangPlaceholder: 'Selecciona otro idioma...',
    flashTimerTitle: 'Cuenta regresiva de ofertas relámpago',
    popoutTitle: 'Abrir en ventana independiente',
    refreshTitle: 'Sincronizar últimas ofertas',
    taglineSuffix: 'Ofertas Verificadas',
    couponsBtn: 'Cupones',
    productsLink: 'Productos',
    searchPlaceholder: 'Buscar iPhone, portátil, Samsung, Amazon...',
    searchAria: 'Buscar productos y tiendas',
    catAria: 'Filtrar por categoría',
    priceAria: 'Filtrar por rango de precio',
    allPriceTiers: 'Todos los precios',
    allStores: 'Todas las tiendas',
    allPrefix: 'Todo',
    soonSuffix: '(Pronto)',
    loadingText: 'Cargando productos y tiendas de dodx.shop...',
    offlineError: 'No se pudieron cargar las ofertas. Visita https://www.dodx.shop directamente.',
    disclosurePrefix: 'Aviso de afiliados:',
    defaultDisclosure: 'Como afiliado, dodx.shop puede obtener comisión por compras elegibles sin costo adicional para ti.',
    footerCoupons: 'Cupones',
    footerProducts: 'Productos',
    footerDisclosure: 'Aviso',
    couponsHeading: 'Cupones Verificados y Códigos Bancarios',
    offersCount: (n) => `${n} ofertas`,
    itemsCount: (n) => `${n} artículos`,
    noCoupons: 'No se encontraron cupones coincidentes.',
    whiteFridayStrip: 'Mejores Ofertas — Grandes Descuentos de Viernes Negro',
    comingSoonHeading: 'Mayores Descuentos Muy Pronto',
    comingSoonStoreBody: (name) => `Las ofertas de ${name} estarán disponibles muy pronto en dodx.shop.`,
    comingSoonFilterBody: 'Sin ofertas en esta selección — prueba Todas las tiendas o cambia el precio.',
    openStorefront: (name) => `Abrir tienda ${name} →`,
    topProductsHeading: 'Mejores Ofertas y Descuentos Verificados',
    storeProductsHeading: (name) => `Productos de ${name}`,
    buyNow: 'Comprar ahora →',
    codeLabel: 'Código:',
    copyAndShop: (code) => `Copiar ${code} y comprar →`,
    openOffer: 'Ver oferta →',
    syncedNotice: 'Precios, categorías y cupones sincronizados desde dodx.shop',
    partnerFallback: 'Tienda asociada',
    dealBadgeFallback: 'OFERTA',
    couponBadgeFallback: 'CUPÓN',
    tierLabels: makeTierLabels('De ', 'a', 'Más de', 'Mayores descuentos', 'Grandes ofertas', 'Relámpago'),
  },
  fr: {
    pageTitle: 'Dodx – Boutiques Officielles et Offres Vérifiées',
    langMenuTitle: 'Choisir la langue',
    langBtnTitle: "Sélectionner la langue d'affichage",
    extraLangLabel: "Plus de langues (Traduction) :",
    extraLangPlaceholder: 'Choisir une autre langue...',
    flashTimerTitle: 'Compte à rebours offres flash',
    popoutTitle: 'Ouvrir dans une fenêtre séparée',
    refreshTitle: 'Actualiser les offres',
    taglineSuffix: 'Offres Vérifiées',
    couponsBtn: 'Coupons',
    productsLink: 'Produits',
    searchPlaceholder: 'Rechercher iPhone, PC portable, Samsung, Amazon...',
    searchAria: 'Rechercher produits et boutiques',
    catAria: 'Filtrer par rayon',
    priceAria: 'Filtrer par tranche de prix',
    allPriceTiers: 'Tous les prix',
    allStores: 'Toutes les boutiques',
    allPrefix: 'Tout',
    soonSuffix: '(Bientôt)',
    loadingText: 'Chargement des offres depuis dodx.shop...',
    offlineError: 'Impossible de charger les offres. Visitez https://www.dodx.shop directement.',
    disclosurePrefix: 'Mention affiliation :',
    defaultDisclosure: "En tant que partenaire affilié, dodx.shop peut percevoir une commission sur les achats éligibles sans coût supplémentaire.",
    footerCoupons: 'Coupons',
    footerProducts: 'Produits',
    footerDisclosure: 'Mentions',
    couponsHeading: 'Coupons Vérifiés et Codes Bancaires',
    offersCount: (n) => `${n} offres`,
    itemsCount: (n) => `${n} articles`,
    noCoupons: 'Aucun coupon correspondant.',
    whiteFridayStrip: 'Meilleures Offres — Énormes Remises Black Friday',
    comingSoonHeading: 'Les Plus Grosses Remises Arrivent Bientôt',
    comingSoonStoreBody: (name) => `Les offres ${name} arrivent très bientôt sur dodx.shop.`,
    comingSoonFilterBody: 'Aucune offre pour cette sélection — essayez Toutes les boutiques ou un autre prix.',
    openStorefront: (name) => `Ouvrir ${name} →`,
    topProductsHeading: 'Meilleures Offres Vérifiées & Ventes Flash',
    storeProductsHeading: (name) => `Produits ${name}`,
    buyNow: 'Acheter →',
    codeLabel: 'Code :',
    copyAndShop: (code) => `Copier ${code} et acheter →`,
    openOffer: "Voir l'offre →",
    syncedNotice: 'Prix, rayons et coupons synchronisés depuis dodx.shop',
    partnerFallback: 'Partenaire Dodx',
    dealBadgeFallback: 'PROMO',
    couponBadgeFallback: 'COUPON',
    tierLabels: makeTierLabels('De ', 'à', 'Plus de', 'Top remises', 'Grandes offres', 'Offre Éclair'),
  },
  de: {
    pageTitle: 'Dodx – Offizielle Partner-Shops & Geprüfte Deals',
    langMenuTitle: 'Sprache wählen',
    langBtnTitle: 'Anzeigesprache auswählen',
    extraLangLabel: 'Weitere Sprachen (Übersetzer):',
    extraLangPlaceholder: 'Andere Sprache wählen...',
    flashTimerTitle: 'Blitzangebot-Countdown',
    popoutTitle: 'In eigenem Fenster öffnen',
    refreshTitle: 'Neueste Angebote laden',
    taglineSuffix: 'Geprüfte Deals',
    couponsBtn: 'Gutscheine',
    productsLink: 'Produkte',
    searchPlaceholder: 'Suche nach iPhone, Laptop, Samsung, Amazon...',
    searchAria: 'Produkte und Shops durchsuchen',
    catAria: 'Nach Kategorie filtern',
    priceAria: 'Nach Preisbereich filtern',
    allPriceTiers: 'Alle Preisstufen',
    allStores: 'Alle Shops',
    allPrefix: 'Alle',
    soonSuffix: '(Bald)',
    loadingText: 'Produkte und Shops werden von dodx.shop geladen...',
    offlineError: 'Angebote konnten nicht geladen werden. Besuche https://www.dodx.shop direkt.',
    disclosurePrefix: 'Partner-Hinweis:',
    defaultDisclosure: 'Als Affiliate-Partner verdient dodx.shop an qualifizierten Käufen ohne Mehrkosten für dich.',
    footerCoupons: 'Gutscheine',
    footerProducts: 'Produkte',
    footerDisclosure: 'Hinweis',
    couponsHeading: 'Geprüfte Gutscheine & Bank-Codes',
    offersCount: (n) => `${n} Angebote`,
    itemsCount: (n) => `${n} Artikel`,
    noCoupons: 'Keine passenden Gutscheine gefunden.',
    whiteFridayStrip: 'Top-Deals — Riesige Black-Friday-Rabatte',
    comingSoonHeading: 'Größte Rabatte kommen sehr bald',
    comingSoonStoreBody: (name) => `${name}-Angebote starten sehr bald auf dodx.shop.`,
    comingSoonFilterBody: 'Keine Treffer — versuche Alle Shops oder eine andere Preisstufe.',
    openStorefront: (name) => `${name} Shop öffnen →`,
    topProductsHeading: 'Top-Angebote & Geprüfte Rabatte',
    storeProductsHeading: (name) => `${name} Produkte`,
    buyNow: 'Jetzt kaufen →',
    codeLabel: 'Code:',
    copyAndShop: (code) => `${code} kopieren & shoppen →`,
    openOffer: 'Zum Angebot →',
    syncedNotice: 'Preise, Kategorien und Gutscheine von dodx.shop aktualisiert',
    partnerFallback: 'Dodx Partner',
    dealBadgeFallback: 'DEAL',
    couponBadgeFallback: 'CODE',
    tierLabels: makeTierLabels('', '–', 'Über', 'Top-Rabatte', 'Große Deals', 'Blitzangebot'),
  },
  pt: {
    pageTitle: 'Dodx – Lojas Oficiais e Ofertas Verificadas',
    langMenuTitle: 'Escolher Idioma',
    langBtnTitle: 'Selecionar idioma de exibição',
    extraLangLabel: 'Mais idiomas (Traduzir):',
    extraLangPlaceholder: 'Selecione outro idioma...',
    flashTimerTitle: 'Contagem regressiva de ofertas relâmpago',
    popoutTitle: 'Abrir em janela separada',
    refreshTitle: 'Sincronizar ofertas',
    taglineSuffix: 'Ofertas Verificadas',
    couponsBtn: 'Cupons',
    productsLink: 'Produtos',
    searchPlaceholder: 'Buscar iPhone, notebook, Samsung, Amazon...',
    searchAria: 'Buscar produtos e lojas',
    catAria: 'Filtrar por categoria',
    priceAria: 'Filtrar por faixa de preço',
    allPriceTiers: 'Todas as faixas',
    allStores: 'Todas as lojas',
    allPrefix: 'Todos',
    soonSuffix: '(Em breve)',
    loadingText: 'Carregando ofertas de dodx.shop...',
    offlineError: 'Erro ao carregar ofertas. Acesse https://www.dodx.shop diretamente.',
    disclosurePrefix: 'Divulgação de afiliados:',
    defaultDisclosure: 'Como afiliado, dodx.shop pode ganhar comissão por compras qualificadas sem custo extra.',
    footerCoupons: 'Cupons',
    footerProducts: 'Produtos',
    footerDisclosure: 'Divulgação',
    couponsHeading: 'Cupons Verificados e Códigos Bancários',
    offersCount: (n) => `${n} ofertas`,
    itemsCount: (n) => `${n} itens`,
    noCoupons: 'Nenhum cupom encontrado.',
    whiteFridayStrip: 'Melhores Ofertas — Grandes Descontos Black Friday',
    comingSoonHeading: 'Maiores Descontos Muito Em Breve',
    comingSoonStoreBody: (name) => `As ofertas de ${name} chegam muito em breve no dodx.shop.`,
    comingSoonFilterBody: 'Sem ofertas nesta seleção — tente Todas as lojas ou mude a faixa de preço.',
    openStorefront: (name) => `Abrir loja ${name} →`,
    topProductsHeading: 'Principais Ofertas Verificadas e Relâmpago',
    storeProductsHeading: (name) => `Produtos ${name}`,
    buyNow: 'Comprar agora →',
    codeLabel: 'Código:',
    copyAndShop: (code) => `Copiar ${code} e comprar →`,
    openOffer: 'Abrir oferta →',
    syncedNotice: 'Preços, categorias e cupons sincronizados de dodx.shop',
    partnerFallback: 'Parceiro Dodx',
    dealBadgeFallback: 'OFERTA',
    couponBadgeFallback: 'CUPOM',
    tierLabels: makeTierLabels('De ', 'a', 'Acima de', 'Maiores descontos', 'Grandes ofertas', 'Relâmpago'),
  },
  zh: {
    pageTitle: 'Dodx – 官方合作商城与真实优惠精选',
    langMenuTitle: '选择语言',
    langBtnTitle: '选择显示语言',
    extraLangLabel: '更多全球语言 (翻译)：',
    extraLangPlaceholder: '选择其他语言...',
    flashTimerTitle: '限时闪购倒计时',
    popoutTitle: '在独立窗口打开',
    refreshTitle: '同步最新优惠',
    taglineSuffix: '官方认证优惠',
    couponsBtn: '优惠券',
    productsLink: '全部商品',
    searchPlaceholder: '搜索 iPhone、笔记本、三星、亚马逊...',
    searchAria: '搜索商品和商店',
    catAria: '按分类筛选',
    priceAria: '按价格区间筛选',
    allPriceTiers: '所有价格区间',
    allStores: '全部商店',
    allPrefix: '全部',
    soonSuffix: '(即将上线)',
    loadingText: '正在从 dodx.shop 加载商品与商店...',
    offlineError: '无法加载优惠，请直接访问 https://www.dodx.shop。',
    disclosurePrefix: '联盟声明：',
    defaultDisclosure: '作为推广合作伙伴，dodx.shop 可能会从符合条件的购买中获得佣金，且不会增加您的费用。',
    footerCoupons: '优惠券',
    footerProducts: '商品',
    footerDisclosure: '声明',
    couponsHeading: '已验证优惠码与银行折扣',
    offersCount: (n) => `${n} 项优惠`,
    itemsCount: (n) => `${n} 件商品`,
    noCoupons: '未找到匹配的优惠券。',
    whiteFridayStrip: '精选特惠 — 黑色星期五超值大促',
    comingSoonHeading: '超强折扣即将上线',
    comingSoonStoreBody: (name) => `${name} 优惠即将上线 dodx.shop。`,
    comingSoonFilterBody: '该筛选条件下暂无商品 — 请尝试全部商店或切换价格区间。',
    openStorefront: (name) => `打开 ${name} 商城 →`,
    topProductsHeading: '热门认证折扣与限时直降',
    storeProductsHeading: (name) => `${name} 精选商品`,
    buyNow: '立即购买 →',
    codeLabel: '优惠码：',
    copyAndShop: (code) => `复制 ${code} 并选购 →`,
    openOffer: '查看优惠 →',
    syncedNotice: '已从 dodx.shop 同步最新价格、分类与优惠券',
    partnerFallback: 'Dodx 合作商家',
    dealBadgeFallback: '特惠',
    couponBadgeFallback: '礼券',
    tierLabels: makeTierLabels('', '–', '高于', '超值特惠', '大额商品', '限时闪购'),
  },
  ja: {
    pageTitle: 'Dodx – 公式パートナーストア＆厳選割引',
    langMenuTitle: '言語を選択',
    langBtnTitle: '表示言語を選択',
    extraLangLabel: 'その他の言語 (翻訳):',
    extraLangPlaceholder: '他の言語を選択...',
    flashTimerTitle: 'タイムセール終了まで',
    popoutTitle: '別ウィンドウで開く',
    refreshTitle: '最新セールを同期',
    taglineSuffix: '認証済みセール',
    couponsBtn: 'クーポン',
    productsLink: '製品一覧',
    searchPlaceholder: 'iPhone、ノートPC、Samsung、Amazonを検索...',
    searchAria: '商品とストアを検索',
    catAria: 'カテゴリーで絞り込む',
    priceAria: '価格帯で絞り込む',
    allPriceTiers: 'すべての価格帯',
    allStores: 'すべてのストア',
    allPrefix: 'すべて',
    soonSuffix: '(近日公開)',
    loadingText: 'dodx.shop から商品とストアを読み込み中...',
    offlineError: 'セールを読み込めません。https://www.dodx.shop に直接アクセスしてください。',
    disclosurePrefix: 'アフィリエイト開示:',
    defaultDisclosure: '提携サイトとして dodx.shop は適格な購入から紹介料を得る場合があります（追加費用なし）。',
    footerCoupons: 'クーポン',
    footerProducts: '製品一覧',
    footerDisclosure: '開示情報',
    couponsHeading: '認証済みクーポン＆銀行割引コード',
    offersCount: (n) => `${n} 件の特典`,
    itemsCount: (n) => `${n} 点の商品`,
    noCoupons: '一致するクーポンが見つかりません。',
    whiteFridayStrip: 'ベストディール — ブラックフライデー大型割引',
    comingSoonHeading: '最大級の割引がまもなく登場',
    comingSoonStoreBody: (name) => `${name} のセールは dodx.shop でまもなく開始されます。`,
    comingSoonFilterBody: '一致する商品がありません — すべてのストアや別の価格帯をお試しください。',
    openStorefront: (name) => `${name} ストアを開く →`,
    topProductsHeading: '注目セール＆タイムセール',
    storeProductsHeading: (name) => `${name} の商品`,
    buyNow: '今すぐ購入 →',
    codeLabel: 'コード:',
    copyAndShop: (code) => `${code} をコピーして購入 →`,
    openOffer: 'セールを見る →',
    syncedNotice: 'dodx.shop から最新価格・カテゴリ・クーポンを同期しました',
    partnerFallback: 'Dodx パートナー',
    dealBadgeFallback: 'お得',
    couponBadgeFallback: 'クーポン',
    tierLabels: makeTierLabels('', '～', '以上', '最大割引', '高額商品', 'タイムセール'),
  },
  ko: {
    pageTitle: 'Dodx – 공식 쇼핑 파트너 & 검증된 할인',
    langMenuTitle: '언어 선택',
    langBtnTitle: '표시 언어 선택',
    extraLangLabel: '더 많은 언어 (번역):',
    extraLangPlaceholder: '다른 언어 선택...',
    flashTimerTitle: '타임 특가 카운트다운',
    popoutTitle: '새 창에서 열기',
    refreshTitle: '최신 특가 동기화',
    taglineSuffix: '검증된 특가',
    couponsBtn: '쿠폰',
    productsLink: '제품',
    searchPlaceholder: 'iPhone, 노트북, 삼성, Amazon 검색...',
    searchAria: '상품 및 스토어 검색',
    catAria: '카테고리별 필터',
    priceAria: '가격대별 필터',
    allPriceTiers: '모든 가격대',
    allStores: '모든 스토어',
    allPrefix: '전체',
    soonSuffix: '(예정)',
    loadingText: 'dodx.shop에서 상품과 스토어를 불러오는 중...',
    offlineError: '특가를 불러올 수 없습니다. https://www.dodx.shop 에 직접 방문하세요.',
    disclosurePrefix: '제휴 안내:',
    defaultDisclosure: '제휴 파트너로서 dodx.shop은 적격 구매에 대해 추가 비용 없이 수수료를 받을 수 있습니다.',
    footerCoupons: '쿠폰',
    footerProducts: '제품',
    footerDisclosure: '안내',
    couponsHeading: '검증된 쿠폰 및 카드 할인 코드',
    offersCount: (n) => `${n}개 혜택`,
    itemsCount: (n) => `${n}개 상품`,
    noCoupons: '일치하는 쿠폰이 없습니다.',
    whiteFridayStrip: '최고의 특가 — 블랙 프라이데이 대규모 할인',
    comingSoonHeading: '최대 할인 혜택 곧 출시 예정',
    comingSoonStoreBody: (name) => `${name} 특가가 dodx.shop에 곧 출시됩니다.`,
    comingSoonFilterBody: '조건에 맞는 상품이 없습니다 — 모든 스토어나 다른 가격대를 선택하세요.',
    openStorefront: (name) => `${name} 스토어 열기 →`,
    topProductsHeading: '인기 검증 특가 및 번개 세일',
    storeProductsHeading: (name) => `${name} 상품`,
    buyNow: '지금 구매 →',
    codeLabel: '코드:',
    copyAndShop: (code) => `${code} 복사 및 쇼핑 →`,
    openOffer: '혜택 보기 →',
    syncedNotice: 'dodx.shop에서 최신 가격, 카테고리 및 쿠폰을 동기화했습니다',
    partnerFallback: 'Dodx 파트너',
    dealBadgeFallback: '특가',
    couponBadgeFallback: '쿠폰',
    tierLabels: makeTierLabels('', '~', '초과', '최대 할인', '고액 상품', '번개 특가'),
  },
  hi: {
    pageTitle: 'Dodx – आधिकारिक शॉपिंग पार्टनर और सत्यापित डील्स',
    langMenuTitle: 'भाषा चुनें',
    langBtnTitle: 'प्रदर्शन भाषा चुनें',
    extraLangLabel: 'अन्य विश्व भाषाएं (अनुवाद):',
    extraLangPlaceholder: 'कोई अन्य भाषा चुनें...',
    flashTimerTitle: 'फ़्लैश डील काउंटडाउन',
    popoutTitle: 'अलग विंडो में खोलें',
    refreshTitle: 'नवीनतम ऑफ़र सिंक करें',
    taglineSuffix: 'सत्यापित डील्स',
    couponsBtn: 'कूपन',
    productsLink: 'उत्पाद',
    searchPlaceholder: 'iPhone, लैपटॉप, Samsung, Amazon खोजें...',
    searchAria: 'उत्पाद और स्टोर खोजें',
    catAria: 'श्रेणी के अनुसार फ़िल्टर करें',
    priceAria: 'मूल्य सीमा के अनुसार फ़िल्टर करें',
    allPriceTiers: 'सभी मूल्य श्रेणियां',
    allStores: 'सभी स्टोर',
    allPrefix: 'सभी',
    soonSuffix: '(जल्द)',
    loadingText: 'dodx.shop से उत्पाद और स्टोर लोड हो रहे हैं...',
    offlineError: 'ऑफ़र लोड करने में असमर्थ। सीधे https://www.dodx.shop पर जाएं।',
    disclosurePrefix: 'संबद्ध प्रकटीकरण:',
    defaultDisclosure: 'एक संबद्ध के रूप में, dodx.shop बिना किसी अतिरिक्त लागत के योग्य खरीद से कमीशन कमा सकता है।',
    footerCoupons: 'कूपन',
    footerProducts: 'उत्पाद',
    footerDisclosure: 'प्रकटीकरण',
    couponsHeading: 'सत्यापित कूपन और बैंक कोड',
    offersCount: (n) => `${n} ऑफ़र`,
    itemsCount: (n) => `${n} आइटम`,
    noCoupons: 'कोई मेल खाने वाला कूपन नहीं मिला।',
    whiteFridayStrip: 'सर्वश्रेष्ठ डील्स — भारी ब्लैक फ़्राइडे छूट',
    comingSoonHeading: 'सबसे बड़ी छूट बहुत जल्द आ रही है',
    comingSoonStoreBody: (name) => `${name} डील्स बहुत जल्द dodx.shop पर आ रही हैं।`,
    comingSoonFilterBody: 'इस चयन में कोई डील नहीं — सभी स्टोर या अन्य मूल्य चुनें।',
    openStorefront: (name) => `${name} स्टोर खोलें →`,
    topProductsHeading: 'शीर्ष सत्यापित डील्स और फ़्लैश छूट',
    storeProductsHeading: (name) => `${name} उत्पाद`,
    buyNow: 'अभी खरीदें →',
    codeLabel: 'कोड:',
    copyAndShop: (code) => `${code} कॉपी करें और खरीदें →`,
    openOffer: 'ऑफ़र खोलें →',
    syncedNotice: 'dodx.shop से नवीनतम मूल्य, श्रेणियां और कूपन सिंक किए गए',
    partnerFallback: 'Dodx पार्टनर',
    dealBadgeFallback: 'डील',
    couponBadgeFallback: 'कूपन',
    tierLabels: makeTierLabels('', '–', 'से अधिक', 'शीर्ष छूट', 'बड़ी डील', 'लाइटनिंग'),
  },
  tr: {
    pageTitle: 'Dodx – Resmi Alışveriş Ortakları ve Doğrulanmış Fırsatlar',
    langMenuTitle: 'Dil Seçin',
    langBtnTitle: 'Görüntüleme dilini seçin',
    extraLangLabel: 'Diğer diller (Çeviri):',
    extraLangPlaceholder: 'Başka bir dil seçin...',
    flashTimerTitle: 'Flaş Fırsat Geri Sayımı',
    popoutTitle: 'Ayrı pencerede aç',
    refreshTitle: 'En yeni fırsatları senkronize et',
    taglineSuffix: 'Doğrulanmış Fırsatlar',
    couponsBtn: 'Kuponlar',
    productsLink: 'Ürünler',
    searchPlaceholder: 'iPhone, dizüstü bilgisayar, Samsung, Amazon ara...',
    searchAria: 'Ürün ve mağaza ara',
    catAria: 'Kategoriye göre filtrele',
    priceAria: 'Fiyat aralığına göre filtrele',
    allPriceTiers: 'Tüm Fiyat Aralıkları',
    allStores: 'Tüm Mağazalar',
    allPrefix: 'Tüm',
    soonSuffix: '(Yakında)',
    loadingText: 'dodx.shop üzerinden ürünler ve mağazalar yükleniyor...',
    offlineError: 'Fırsatlar yüklenemedi. Doğrudan https://www.dodx.shop adresini ziyaret edin.',
    disclosurePrefix: 'Ortaklık Açıklaması:',
    defaultDisclosure: 'Bir bağlı kuruluş olarak dodx.shop, size ek bir maliyet getirmeden uygun satın alımlardan komisyon kazanabilir.',
    footerCoupons: 'Kuponlar',
    footerProducts: 'Ürünler',
    footerDisclosure: 'Açıklama',
    couponsHeading: 'Doğrulanmış Kuponlar ve Banka Kodları',
    offersCount: (n) => `${n} fırsat`,
    itemsCount: (n) => `${n} ürün`,
    noCoupons: 'Eşleşen kupon bulunamadı.',
    whiteFridayStrip: 'En İyi Fırsatlar — Büyük Kara Cuma İndirimleri',
    comingSoonHeading: 'En Büyük İndirimler Çok Yakında',
    comingSoonStoreBody: (name) => `${name} fırsatları çok yakında dodx.shop üzerinde yayınlanacak.`,
    comingSoonFilterBody: 'Bu seçimde ürün bulunamadı — Tüm Mağazalar veya başka bir fiyat deneyin.',
    openStorefront: (name) => `${name} Mağazasını Aç →`,
    topProductsHeading: 'Öne Çıkan Doğrulanmış Fırsatlar',
    storeProductsHeading: (name) => `${name} Ürünleri`,
    buyNow: 'Şimdi Satın Al →',
    codeLabel: 'Kod:',
    copyAndShop: (code) => `${code} Kopyala ve Alışveriş Yap →`,
    openOffer: 'Fırsatı Aç →',
    syncedNotice: 'dodx.shop üzerindeki güncel fiyatlar, kategoriler ve kuponlar eşitlendi',
    partnerFallback: 'Dodx Ortağı',
    dealBadgeFallback: 'FIRSAT',
    couponBadgeFallback: 'KUPON',
    tierLabels: makeTierLabels('', '–', 'Üzeri', 'En Yüksek İndirim', 'Büyük', 'Flaş'),
  },
  ru: {
    pageTitle: 'Dodx – Официальные магазины и проверенные скидки',
    langMenuTitle: 'Выберите язык',
    langBtnTitle: 'Выбрать язык интерфейса',
    extraLangLabel: 'Другие языки (Перевод):',
    extraLangPlaceholder: 'Выберите другой язык...',
    flashTimerTitle: 'Обратный отсчёт горящих скидок',
    popoutTitle: 'Открыть в отдельном окне',
    refreshTitle: 'Обновить предложения',
    taglineSuffix: 'Проверенные скидки',
    couponsBtn: 'Купоны',
    productsLink: 'Товары',
    searchPlaceholder: 'Поиск iPhone, ноутбук, Samsung, Amazon...',
    searchAria: 'Поиск товаров и магазинов',
    catAria: 'Фильтр по категории',
    priceAria: 'Фильтр по цене',
    allPriceTiers: 'Любая цена',
    allStores: 'Все магазины',
    allPrefix: 'Все',
    soonSuffix: '(Скоро)',
    loadingText: 'Загрузка товаров и магазинов с dodx.shop...',
    offlineError: 'Не удалось загрузить предложения. Перейдите на https://www.dodx.shop.',
    disclosurePrefix: 'Партнёрское уведомление:',
    defaultDisclosure: 'Как партнёрский сервис, dodx.shop может получать комиссию с покупок без доплаты для вас.',
    footerCoupons: 'Купоны',
    footerProducts: 'Товары',
    footerDisclosure: 'Условия',
    couponsHeading: 'Проверенные купоны и банковские коды',
    offersCount: (n) => `${n} предл.`,
    itemsCount: (n) => `${n} товаров`,
    noCoupons: 'Подходящие купоны не найдены.',
    whiteFridayStrip: 'Лучшие предложения — Огромные скидки Чёрной пятницы',
    comingSoonHeading: 'Максимальные скидки совсем скоро',
    comingSoonStoreBody: (name) => `Скидки для ${name} появятся на dodx.shop совсем скоро.`,
    comingSoonFilterBody: 'Нет подходящих товаров — выберите Все магазины или другой ценовой диапазон.',
    openStorefront: (name) => `Открыть ${name} →`,
    topProductsHeading: 'Лучшие проверенные скидки и акции',
    storeProductsHeading: (name) => `Товары ${name}`,
    buyNow: 'Купить сейчас →',
    codeLabel: 'Код:',
    copyAndShop: (code) => `Копировать ${code} и купить →`,
    openOffer: 'Открыть акцию →',
    syncedNotice: 'Цены, категории и купоны обновлены с dodx.shop',
    partnerFallback: 'Партнёр Dodx',
    dealBadgeFallback: 'СКИДКА',
    couponBadgeFallback: 'КУПОН',
    tierLabels: makeTierLabels('От ', 'до', 'Более', 'Лучшие скидки', 'Крупные', 'Молния'),
  },
  it: {
    pageTitle: 'Dodx – Partner Ufficiali e Offerte Verificate',
    langMenuTitle: 'Scegli Lingua',
    langBtnTitle: 'Seleziona la lingua',
    extraLangLabel: 'Altre lingue (Traduzione):',
    extraLangPlaceholder: "Seleziona un'altra lingua...",
    flashTimerTitle: 'Conto alla rovescia offerte lampo',
    popoutTitle: 'Apri in finestra separata',
    refreshTitle: 'Sincronizza offerte',
    taglineSuffix: 'Offerte Verificate',
    couponsBtn: 'Coupon',
    productsLink: 'Prodotti',
    searchPlaceholder: 'Cerca iPhone, laptop, Samsung, Amazon...',
    searchAria: 'Cerca prodotti e negozi',
    catAria: 'Filtra per categoria',
    priceAria: 'Filtra per fascia di prezzo',
    allPriceTiers: 'Tutte le fasce',
    allStores: 'Tutti i negozi',
    allPrefix: 'Tutti',
    soonSuffix: '(Presto)',
    loadingText: 'Caricamento prodotti e negozi da dodx.shop...',
    offlineError: 'Impossibile caricare le offerte. Visita https://www.dodx.shop direttamente.',
    disclosurePrefix: 'Informativa affiliazione:',
    defaultDisclosure: 'In qualità di affiliato, dodx.shop può ricevere una commissione sugli acquisti idonei senza costi aggiuntivi.',
    footerCoupons: 'Coupon',
    footerProducts: 'Prodotti',
    footerDisclosure: 'Informativa',
    couponsHeading: 'Coupon Verificati e Codici Bancari',
    offersCount: (n) => `${n} offerte`,
    itemsCount: (n) => `${n} articoli`,
    noCoupons: 'Nessun coupon trovato.',
    whiteFridayStrip: 'Migliori Offerte — Grandi Sconti Black Friday',
    comingSoonHeading: 'Grandi Sconti in Arrivo Molto Presto',
    comingSoonStoreBody: (name) => `Le offerte ${name} arriveranno molto presto su dodx.shop.`,
    comingSoonFilterBody: 'Nessuna offerta corrispondente — prova Tutti i negozi o un altro prezzo.',
    openStorefront: (name) => `Apri negozio ${name} →`,
    topProductsHeading: 'Migliori Offerte Verificate & Sconti Lampo',
    storeProductsHeading: (name) => `Prodotti ${name}`,
    buyNow: 'Acquista ora →',
    codeLabel: 'Codice:',
    copyAndShop: (code) => `Copia ${code} e acquista →`,
    openOffer: 'Apri offerta →',
    syncedNotice: 'Prezzi, categorie e coupon sincronizzati da dodx.shop',
    partnerFallback: 'Partner Dodx',
    dealBadgeFallback: 'OFFERTA',
    couponBadgeFallback: 'COUPON',
    tierLabels: makeTierLabels('Da ', 'a', 'Oltre', 'Sconti Top', 'Grandi', 'Lampo'),
  },
  id: {
    pageTitle: 'Dodx – Mitra Belanja Resmi & Promo Terverifikasi',
    langMenuTitle: 'Pilih Bahasa',
    langBtnTitle: 'Pilih bahasa tampilan',
    extraLangLabel: 'Bahasa dunia lainnya (Terjemahan):',
    extraLangPlaceholder: 'Pilih bahasa lain...',
    flashTimerTitle: 'Hitung Mundur Flash Sale',
    popoutTitle: 'Buka di jendela terpisah',
    refreshTitle: 'Sinkronkan promo terbaru',
    taglineSuffix: 'Promo Terverifikasi',
    couponsBtn: 'Kupon',
    productsLink: 'Produk',
    searchPlaceholder: 'Cari iPhone, laptop, Samsung, Amazon...',
    searchAria: 'Cari produk dan toko',
    catAria: 'Filter berdasarkan kategori',
    priceAria: 'Filter berdasarkan harga',
    allPriceTiers: 'Semua Rentang Harga',
    allStores: 'Semua Toko',
    allPrefix: 'Semua',
    soonSuffix: '(Segera)',
    loadingText: 'Memuat produk & toko dari dodx.shop...',
    offlineError: 'Gagal memuat promo. Kunjungi https://www.dodx.shop langsung.',
    disclosurePrefix: 'Pengungkapan Afiliasi:',
    defaultDisclosure: 'Sebagai afiliasi, dodx.shop dapat memperoleh komisi dari pembelian yang memenuhi syarat tanpa biaya tambahan.',
    footerCoupons: 'Kupon',
    footerProducts: 'Produk',
    footerDisclosure: 'Info',
    couponsHeading: 'Kupon Terverifikasi & Kode Bank',
    offersCount: (n) => `${n} promo`,
    itemsCount: (n) => `${n} item`,
    noCoupons: 'Tidak ada kupon yang cocok.',
    whiteFridayStrip: 'Promo Terbaik — Diskon Besar Black Friday',
    comingSoonHeading: 'Diskon Terbesar Segera Hadir',
    comingSoonStoreBody: (name) => `Promo ${name} akan segera hadir di dodx.shop.`,
    comingSoonFilterBody: 'Tidak ada promo yang cocok — coba Semua Toko atau ganti rentang harga.',
    openStorefront: (name) => `Buka Toko ${name} →`,
    topProductsHeading: 'Promo Terverifikasi & Diskon Kilat',
    storeProductsHeading: (name) => `Produk ${name}`,
    buyNow: 'Beli Sekarang →',
    codeLabel: 'Kode:',
    copyAndShop: (code) => `Salin ${code} & Belanja →`,
    openOffer: 'Buka Promo →',
    syncedNotice: 'Harga, kategori & kupon terbaru disinkronkan dari dodx.shop',
    partnerFallback: 'Mitra Dodx',
    dealBadgeFallback: 'PROMO',
    couponBadgeFallback: 'KUPON',
    tierLabels: makeTierLabels('', '–', 'Di atas', 'Diskon Terbesar', 'Besar', 'Kilat'),
  },
  nl: {
    pageTitle: 'Dodx – Officiële Winkelpartners & Gecontroleerde Deals',
    langMenuTitle: 'Kies taal',
    langBtnTitle: 'Selecteer weergavetaal',
    extraLangLabel: 'Meer wereldtalen (Vertalen):',
    extraLangPlaceholder: 'Kies een andere taal...',
    flashTimerTitle: 'Flash Deal-aftelling',
    popoutTitle: 'Openen in los venster',
    refreshTitle: 'Nieuwste deals ophalen',
    taglineSuffix: 'Gecontroleerde Deals',
    couponsBtn: 'Kortingen',
    productsLink: 'Producten',
    searchPlaceholder: 'Zoek iPhone, laptop, Samsung, Amazon...',
    searchAria: 'Zoek producten en winkels',
    catAria: 'Filter op categorie',
    priceAria: 'Filter op prijsklasse',
    allPriceTiers: 'Alle prijsklassen',
    allStores: 'Alle winkels',
    allPrefix: 'Alle',
    soonSuffix: '(Binnenkort)',
    loadingText: 'Producten en winkels laden van dodx.shop...',
    offlineError: 'Kan deals niet laden. Bezoek https://www.dodx.shop rechtstreeks.',
    disclosurePrefix: 'Affiliate-verklaring:',
    defaultDisclosure: 'Als affiliate kan dodx.shop commissie verdienen op geldige aankopen zonder extra kosten voor jou.',
    footerCoupons: 'Kortingen',
    footerProducts: 'Producten',
    footerDisclosure: 'Verklaring',
    couponsHeading: 'Gecontroleerde Kortingscodes & Bankdeals',
    offersCount: (n) => `${n} deals`,
    itemsCount: (n) => `${n} artikelen`,
    noCoupons: 'Geen passende kortingscodes gevonden.',
    whiteFridayStrip: 'Beste Deals — Enorme Black Friday-kortingen',
    comingSoonHeading: 'Grootste Kortingen Komen Zeer Binnenkort',
    comingSoonStoreBody: (name) => `${name}-deals verschijnen zeer binnenkort op dodx.shop.`,
    comingSoonFilterBody: 'Geen resultaten — probeer Alle winkels of kies een andere prijsklasse.',
    openStorefront: (name) => `Open ${name}-winkel →`,
    topProductsHeading: 'Top Gecontroleerde Deals & Flash-kortingen',
    storeProductsHeading: (name) => `${name} Producten`,
    buyNow: 'Koop nu →',
    codeLabel: 'Code:',
    copyAndShop: (code) => `Kopieer ${code} & shop →`,
    openOffer: 'Deal openen →',
    syncedNotice: 'Nieuwste prijzen, categorieën en kortingscodes gesynchroniseerd',
    partnerFallback: 'Dodx Partner',
    dealBadgeFallback: 'DEAL',
    couponBadgeFallback: 'CODE',
    tierLabels: makeTierLabels('Van ', 'tot', 'Meer dan', 'Topkortingen', 'Groot', 'Bliksem'),
  },
  pl: {
    pageTitle: 'Dodx – Oficjalni Partnerzy i Zweryfikowane Okazje',
    langMenuTitle: 'Wybierz język',
    langBtnTitle: 'Wybierz język wyświetlania',
    extraLangLabel: 'Więcej języków (Tłumacz):',
    extraLangPlaceholder: 'Wybierz inny język...',
    flashTimerTitle: 'Odliczanie błyskawicznych okazji',
    popoutTitle: 'Otwórz w osobnym oknie',
    refreshTitle: 'Synchronizuj najnowsze okazje',
    taglineSuffix: 'Zweryfikowane Okazje',
    couponsBtn: 'Kupony',
    productsLink: 'Produkty',
    searchPlaceholder: 'Szukaj iPhone, laptop, Samsung, Amazon...',
    searchAria: 'Szukaj produktów i sklepów',
    catAria: 'Filtruj według kategorii',
    priceAria: 'Filtruj według przedziału cenowego',
    allPriceTiers: 'Wszystkie ceny',
    allStores: 'Wszystkie sklepy',
    allPrefix: 'Wszystkie',
    soonSuffix: '(Wkrótce)',
    loadingText: 'Ładowanie produktów i sklepów z dodx.shop...',
    offlineError: 'Nie udało się załadować ofert. Odwiedź bezpośrednio https://www.dodx.shop.',
    disclosurePrefix: 'Informacja partnerska:',
    defaultDisclosure: 'Jako partner afiliacyjny dodx.shop może otrzymywać prowizję od kwalifikujących się zakupów bez dodatkowych kosztów.',
    footerCoupons: 'Kupony',
    footerProducts: 'Produkty',
    footerDisclosure: 'Informacje',
    couponsHeading: 'Zweryfikowane Kupony i Kody Bankowe',
    offersCount: (n) => `${n} ofert`,
    itemsCount: (n) => `${n} produktów`,
    noCoupons: 'Nie znaleziono pasujących kuponów.',
    whiteFridayStrip: 'Najlepsze Okazje — Wielkie Zniżki Black Friday',
    comingSoonHeading: 'Największe Zniżki Już Wkrótce',
    comingSoonStoreBody: (name) => `Okazje ${name} pojawią się wkrótce na dodx.shop.`,
    comingSoonFilterBody: 'Brak pasujących okazji — wybierz Wszystkie sklepy lub inny zakres cen.',
    openStorefront: (name) => `Otwórz sklep ${name} →`,
    topProductsHeading: 'Najlepsze Zweryfikowane Okazje',
    storeProductsHeading: (name) => `Produkty ${name}`,
    buyNow: 'Kup teraz →',
    codeLabel: 'Kod:',
    copyAndShop: (code) => `Kopiuj ${code} i kupuj →`,
    openOffer: 'Otwórz okazję →',
    syncedNotice: 'Zsynchronizowano najnowsze ceny, kategorie i kupony z dodx.shop',
    partnerFallback: 'Partner Dodx',
    dealBadgeFallback: 'OKAZJA',
    couponBadgeFallback: 'KUPON',
    tierLabels: makeTierLabels('Od ', 'do', 'Powyżej', 'Największe zniżki', 'Duże', 'Błyskawica'),
  },
};

const CAT_I18N = {
  all: {
    es: 'Todas las categorías', fr: 'Toutes les catégories', de: 'Alle Kategorien', pt: 'Todas as categorias',
    zh: '全部分类', ja: 'すべてのカテゴリー', ko: '모든 카테고리', hi: 'सभी श्रेणियां',
    tr: 'Tüm Kategoriler', ru: 'Все категории', it: 'Tutte le categorie', id: 'Semua Kategori',
    nl: 'Alle categorieën', pl: 'Wszystkie kategorie',
  },
  smartphones: {
    es: 'Teléfonos y Móviles', fr: 'Smartphones et Mobiles', de: 'Smartphones & Handys', pt: 'Smartphones e Celulares',
    zh: '智能手机与通讯', ja: 'スマートフォン・携帯', ko: '스마트폰 및 모바일', hi: 'स्मार्टफ़ोन और मोबाइल',
    tr: 'Akıllı Telefonlar', ru: 'Смартфоны и телефоны', it: 'Smartphone e Cellulari', id: 'Smartphone & Ponsel',
    nl: 'Smartphones & Mobiel', pl: 'Smartfony i telefony',
  },
  laptops: {
    es: 'Portátiles y PC', fr: 'Ordinateurs portables & PC', de: 'Laptops & Computer', pt: 'Notebooks e PCs',
    zh: '笔记本与电脑', ja: 'ノートPC・パソコン', ko: '노트북 및 컴퓨터', hi: 'लैपटॉप और कंप्यूटर',
    tr: 'Dizüstü ve Bilgisayar', ru: 'Ноутбуки и ПК', it: 'Laptop e Computer', id: 'Laptop & Komputer',
    nl: 'Laptops & Computers', pl: 'Laptopy i komputery',
  },
  'tablets-wearables': {
    es: 'Tablets y Relojes', fr: 'Tablettes et Montres', de: 'Tablets & Wearables', pt: 'Tablets e Vestíveis',
    zh: '平板与智能穿戴', ja: 'タブレット・ウェアラブル', ko: '태블릿 및 웨어러블', hi: 'टैबलेट और वियरेबल्स',
    tr: 'Tablet ve Giyilebilir', ru: 'Планшеты и гаджеты', it: 'Tablet e Wearable', id: 'Tablet & Wearable',
    nl: 'Tablets & Wearables', pl: 'Tablety i smartwatch',
  },
  audio: {
    es: 'Audio y Auriculares', fr: 'Audio et Casques', de: 'Audio & Kopfhörer', pt: 'Áudio e Fones',
    zh: '音频与耳机', ja: 'オーディオ・ヘッドホン', ko: '오디오 및 헤드폰', hi: 'ऑडियो और हेडफ़ोन',
    tr: 'Ses ve Kulaklık', ru: 'Аудио и наушники', it: 'Audio e Cuffie', id: 'Audio & Headphone',
    nl: 'Audio & Koptelefoons', pl: 'Audio i słuchawki',
  },
  'tv-monitors': {
    es: 'TV y Monitores', fr: 'TV et Moniteurs', de: 'TVs & Monitore', pt: 'TVs e Monitores',
    zh: '电视与显示器', ja: 'テレビ・モニター', ko: 'TV 및 모니터', hi: 'टीवी और मॉनिटर',
    tr: 'TV ve Monitörler', ru: 'ТВ и мониторы', it: 'TV e Monitor', id: 'TV & Monitor',
    nl: 'TV’s & Monitoren', pl: 'Telewizory i monitory',
  },
  'men-fashion': {
    es: 'Moda Hombre', fr: 'Mode Homme', de: 'Herrenmode', pt: 'Moda Masculina',
    zh: '男装时尚', ja: 'メンズファッション', ko: '남성 패션', hi: 'पुरुष फ़ैशन',
    tr: 'Erkek Giyim', ru: 'Мужская одежда', it: 'Moda Uomo', id: 'Fesyen Pria',
    nl: 'Herenmode', pl: 'Moda męska',
  },
  'women-fashion': {
    es: 'Moda Mujer', fr: 'Mode Femme', de: 'Damenmode', pt: 'Moda Feminina',
    zh: '女装时尚', ja: 'レディースファッション', ko: '여성 패션', hi: 'महिला फ़ैशन',
    tr: 'Kadın Giyim', ru: 'Женская одежда', it: 'Moda Donna', id: 'Fesyen Wanita',
    nl: 'Damesmode', pl: 'Moda damska',
  },
  accessories: {
    es: 'Accesorios y Equipo', fr: 'Accessoires et Équipement', de: 'Zubehör & Ausrüstung', pt: 'Acessórios e Equipamentos',
    zh: '配件与装备', ja: 'アクセサリー・周辺機器', ko: '액세서리 및 장비', hi: 'एक्सेसरीज़ और गियर',
    tr: 'Aksesuarlar', ru: 'Аксессуары', it: 'Accessori', id: 'Aksesori & Perlengkapan',
    nl: 'Accessoires', pl: 'Akcesoria',
  },
  'watches-jewelry': {
    es: 'Relojes y Joyería', fr: 'Montres et Bijoux', de: 'Uhren & Schmuck', pt: 'Relógios e Joias',
    zh: '手表与珠宝', ja: '時計・ジュエリー', ko: '시계 및 주얼리', hi: 'घड़ियां और आभूषण',
    tr: 'Saat ve Mücevher', ru: 'Часы и украшения', it: 'Orologi e Gioielli', id: 'Jam Tangan & Perhiasan',
    nl: 'Horloges & Sieraden', pl: 'Zegarki i biżuteria',
  },
  'beauty-health': {
    es: 'Salud y Belleza', fr: 'Santé et Beauté', de: 'Gesundheit & Schönheit', pt: 'Saúde e Beleza',
    zh: '健康与美容', ja: '美容・ヘルスケア', ko: '뷰티 및 건강', hi: 'स्वास्थ्य और सौंदर्य',
    tr: 'Sağlık ve Güzellik', ru: 'Красота и здоровье', it: 'Salute e Bellezza', id: 'Kesehatan & Kecantikan',
    nl: 'Gezondheid & Beauty', pl: 'Zdrowie i uroda',
  },
  'home-furniture': {
    es: 'Hogar y Muebles', fr: 'Maison et Meubles', de: 'Haus & Möbel', pt: 'Casa e Móveis',
    zh: '家居与家具', ja: 'ホーム＆家具', ko: '홈 및 가구', hi: 'घर और फ़र्नीचर',
    tr: 'Ev ve Mobilya', ru: 'Дом и мебель', it: 'Casa e Arredamento', id: 'Rumah & Furnitur',
    nl: 'Wonen & Meubels', pl: 'Dom i meble',
  },
  'food-grocery': {
    es: 'Alimentos y Despensa', fr: 'Alimentation et Épicerie', de: 'Lebensmittel', pt: 'Alimentos e Mercado',
    zh: '食品与生鲜', ja: '食品・食料品', ko: '식품 및 식료품', hi: 'खाद्य और किराना',
    tr: 'Gıda ve Market', ru: 'Продукты питания', it: 'Alimentari e Spesa', id: 'Makanan & Kebutuhan',
    nl: 'Eten & Boodschappen', pl: 'Żywność i zakupy',
  },
  cars: {
    es: 'Autos y Accesorios', fr: 'Voitures et Auto', de: 'Autos & Zubehör', pt: 'Carros e Auto',
    zh: '汽车与配件', ja: '自動車・カー用品', ko: '자동차 용품', hi: 'कार और ऑटो',
    tr: 'Otomobil ve Aksesuar', ru: 'Автотовары', it: 'Auto e Accessori', id: 'Mobil & Otomotif',
    nl: 'Auto & Onderdelen', pl: 'Motoryzacja',
  },
  motorcycles: {
    es: 'Motocicletas', fr: 'Motos', de: 'Motorräder', pt: 'Motocicletas',
    zh: '摩托车配件', ja: 'バイク用品', ko: '오토바이', hi: 'मोटरसाइकिल',
    tr: 'Motosiklet', ru: 'Мотоциклы', it: 'Moto', id: 'Sepeda Motor',
    nl: 'Motoren', pl: 'Motocykle',
  },
  software: {
    es: 'Software y Seguridad', fr: 'Logiciels et Sécurité', de: 'Software & Sicherheit', pt: 'Software e Segurança',
    zh: '软件与安全工具', ja: 'ソフトウェア', ko: '소프트웨어', hi: 'सॉफ़्टवेयर',
    tr: 'Yazılım', ru: 'Программы', it: 'Software', id: 'Perangkat Lunak',
    nl: 'Software', pl: 'Oprogramowanie',
  },
};

function getDict() {
  return I18N[currentLang] || I18N.en;
}

function getLangMeta(code) {
  return SUPPORTED_LANGUAGES.find((l) => l.code === code) || SUPPORTED_LANGUAGES[0];
}

function isArLang() {
  return currentLang === 'ar';
}

function getLocalizedCategoryName(cat) {
  if (!cat) return '';
  if (isArLang()) return cat.nameAr || cat.nameEn;
  const localized = CAT_I18N[cat.id] && CAT_I18N[cat.id][currentLang];
  return localized || cat.nameEn || cat.nameAr;
}

function formatPriceForLang(rawPrice) {
  if (!rawPrice) return '';
  let text = String(rawPrice).trim();
  if (isArLang()) {
    text = text
      .replace(/\bUSD\b/gi, 'دولار')
      .replace(/\bEGP\b/gi, 'جنيه')
      .replace(/\bAED\b/gi, 'درهم')
      .replace(/\bJPY\b/gi, 'ين');
  } else {
    text = text
      .replace(/جنيه(?:\s+مصري)?/g, 'EGP')
      .replace(/درهم(?:\s+إماراتي)?/g, 'AED')
      .replace(/دولار(?:\s+أمريكي)?/g, 'USD')
      .replace(/\bين\b/g, 'JPY');
  }
  return text.replace(/\s{2,}/g, ' ').trim();
}

function isSafeHttpsUrl(rawUrl) {
  if (typeof rawUrl !== 'string') return false;
  try {
    return new URL(rawUrl).protocol === 'https:';
  } catch {
    return false;
  }
}

function isSafeLocalAsset(rawPath) {
  return typeof rawPath === 'string' && /^images\/[a-zA-Z0-9._-]+\.(jpg|jpeg|png|webp)$/.test(rawPath.trim());
}

function resolveImageSrc(imageUrl, fallbackImage) {
  if (isSafeHttpsUrl(imageUrl)) return imageUrl;
  if (isSafeLocalAsset(imageUrl)) return chrome.runtime.getURL(imageUrl.trim());
  if (isSafeLocalAsset(fallbackImage)) return chrome.runtime.getURL(fallbackImage.trim());
  return chrome.runtime.getURL('icons/icon128.png');
}

function createSafeImageElement(imageUrl, fallbackImage, altText, className) {
  const img = document.createElement('img');
  img.className = className;
  img.alt = altText || '';
  img.loading = 'lazy';

  const fallbackSrc = isSafeLocalAsset(fallbackImage)
    ? chrome.runtime.getURL(fallbackImage.trim())
    : chrome.runtime.getURL('icons/icon128.png');

  let usedFallback = false;
  img.addEventListener('error', () => {
    if (!usedFallback) {
      usedFallback = true;
      img.src = fallbackSrc;
    }
  });

  img.src = resolveImageSrc(imageUrl, fallbackImage);
  return img;
}

function normalizeText(input) {
  return String(input || '')
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u064B-\u065F\u0670\u0640]/g, '')
    .replace(/[أإآٱ]/g, 'ا')
    .replace(/ة/g, 'ه')
    .replace(/ى/g, 'ي')
    .trim();
}

function matchesPriceTier(numericPrice, tierId) {
  if (!tierId || tierId === 'all') return true;
  if (tierId === '1-30') return numericPrice >= 1 && numericPrice <= 30;
  if (tierId === '30-60') return numericPrice >= 30 && numericPrice <= 60;
  if (tierId === '60-100') return numericPrice >= 60 && numericPrice <= 100;
  if (tierId === '100-150') return numericPrice >= 100 && numericPrice <= 150;
  if (tierId === '150-500') return numericPrice >= 150 && numericPrice <= 500;
  if (tierId === '500-1000') return numericPrice >= 500 && numericPrice <= 1000;
  if (tierId === '1000-2000') return numericPrice >= 1000 && numericPrice <= 2000;
  if (tierId === '2000-3000') return numericPrice >= 2000 && numericPrice <= 3000;
  if (tierId === '3000-5000') return numericPrice >= 3000 && numericPrice <= 5000;
  if (tierId === 'over-5000') return numericPrice >= 5000 && numericPrice <= 10000;
  if (tierId === 'over-10000') return numericPrice > 10000;
  return true;
}

async function loadSavedLang() {
  try {
    if (chrome.storage?.local) {
      const res = await chrome.storage.local.get(LANG_STORAGE_KEY);
      if (res && typeof res[LANG_STORAGE_KEY] === 'string' && I18N[res[LANG_STORAGE_KEY]]) {
        return res[LANG_STORAGE_KEY];
      }
    }
  } catch {
    // Fallback to localStorage
  }
  try {
    const saved = localStorage.getItem(LANG_STORAGE_KEY);
    if (saved && I18N[saved]) return saved;
  } catch {
    // Ignore
  }
  return 'en';
}

async function saveLang(lang) {
  try {
    if (chrome.storage?.local) {
      await chrome.storage.local.set({ [LANG_STORAGE_KEY]: lang });
    }
  } catch {
    // Ignore
  }
  try {
    localStorage.setItem(LANG_STORAGE_KEY, lang);
  } catch {
    // Ignore
  }
}

function buildLanguageMenu() {
  const gridEl = document.getElementById('lang-options-grid');
  const extraSelect = document.getElementById('extra-lang-select');
  const langMenu = document.getElementById('lang-menu');
  const langBtn = document.getElementById('lang-btn');

  if (gridEl) {
    gridEl.replaceChildren();
    SUPPORTED_LANGUAGES.forEach((meta) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = meta.code === currentLang ? 'lang-option is-active' : 'lang-option';
      btn.setAttribute('data-lang', meta.code);
      btn.setAttribute('role', 'option');
      btn.setAttribute('aria-selected', meta.code === currentLang ? 'true' : 'false');

      const labelWrap = document.createElement('span');
      labelWrap.className = 'lang-option-label';
      const flagSpan = document.createElement('span');
      flagSpan.textContent = meta.flag;
      const textSpan = document.createElement('span');
      textSpan.className = 'lang-option-text';
      textSpan.textContent = meta.nativeName;
      labelWrap.appendChild(flagSpan);
      labelWrap.appendChild(textSpan);

      const checkSpan = document.createElement('span');
      checkSpan.className = 'lang-check';
      checkSpan.textContent = '✓';

      btn.appendChild(labelWrap);
      btn.appendChild(checkSpan);

      btn.addEventListener('click', async () => {
        currentLang = meta.code;
        await saveLang(meta.code);
        if (langMenu) langMenu.hidden = true;
        if (langBtn) langBtn.setAttribute('aria-expanded', 'false');
        applyLanguageUI();
      });

      gridEl.appendChild(btn);
    });
  }

  if (extraSelect) {
    const dict = getDict();
    extraSelect.replaceChildren();
    const defaultOpt = document.createElement('option');
    defaultOpt.value = '';
    defaultOpt.textContent = dict.extraLangPlaceholder;
    extraSelect.appendChild(defaultOpt);

    EXTRA_WORLD_LANGUAGES.forEach((item) => {
      const opt = document.createElement('option');
      opt.value = item.code;
      opt.textContent = item.label;
      extraSelect.appendChild(opt);
    });
  }
}

function applyLanguageUI() {
  const dict = getDict();
  const meta = getLangMeta(currentLang);
  document.documentElement.lang = currentLang;
  document.documentElement.dir = meta.dir;
  document.title = dict.pageTitle;

  const langFlag = document.getElementById('lang-flag');
  const langCode = document.getElementById('lang-code');
  const langBtn = document.getElementById('lang-btn');
  const langMenuTitle = document.getElementById('lang-menu-title');
  const extraLangLabel = document.getElementById('extra-lang-label');
  const extraLangSelect = document.getElementById('extra-lang-select');

  if (langFlag) langFlag.textContent = meta.flag;
  if (langCode) langCode.textContent = meta.shortLabel;
  if (langBtn) {
    langBtn.title = dict.langBtnTitle;
    langBtn.setAttribute('aria-label', dict.langBtnTitle);
  }
  if (langMenuTitle) langMenuTitle.textContent = dict.langMenuTitle;
  if (extraLangLabel) extraLangLabel.textContent = dict.extraLangLabel;
  if (extraLangSelect && extraLangSelect.options.length > 0) {
    extraLangSelect.options[0].textContent = dict.extraLangPlaceholder;
  }

  document.querySelectorAll('.lang-option').forEach((btn) => {
    const isSel = btn.getAttribute('data-lang') === currentLang;
    btn.classList.toggle('is-active', isSel);
    btn.setAttribute('aria-selected', isSel ? 'true' : 'false');
  });

  const flashPill = document.getElementById('flash-timer-pill');
  const popoutBtn = document.getElementById('popout-btn');
  const refreshBtn = document.getElementById('refresh-btn');
  const topTagline = document.getElementById('top-bar-tagline');
  const couponsBtn = document.getElementById('coupons-mode-btn');
  const topProducts = document.getElementById('top-products-link');
  const searchInput = document.getElementById('offer-search');
  const catSelect = document.getElementById('category-filter');
  const priceSelect = document.getElementById('price-filter');
  const loadingCard = document.getElementById('loading-card');
  const footerCoupons = document.getElementById('footer-coupons-link');
  const footerProducts = document.getElementById('footer-products-link');
  const footerDisclosure = document.getElementById('footer-disclosure-link');
  const disclosureEl = document.getElementById('affiliate-disclosure');

  if (flashPill) flashPill.title = dict.flashTimerTitle;
  if (popoutBtn) popoutBtn.title = dict.popoutTitle;
  if (refreshBtn) refreshBtn.title = dict.refreshTitle;
  if (topTagline) {
    const strongEl = document.createElement('strong');
    strongEl.textContent = 'dodx.shop';
    topTagline.replaceChildren(strongEl, document.createTextNode(` · ${dict.taglineSuffix}`));
  }
  if (couponsBtn) couponsBtn.textContent = dict.couponsBtn;
  if (topProducts) topProducts.textContent = dict.productsLink;
  if (searchInput) {
    searchInput.placeholder = dict.searchPlaceholder;
    searchInput.setAttribute('aria-label', dict.searchAria);
  }
  if (catSelect) catSelect.setAttribute('aria-label', dict.catAria);
  if (priceSelect) priceSelect.setAttribute('aria-label', dict.priceAria);
  if (loadingCard) loadingCard.textContent = dict.loadingText;
  if (footerCoupons) footerCoupons.textContent = dict.footerCoupons;
  if (footerProducts) footerProducts.textContent = dict.footerProducts;
  if (footerDisclosure) footerDisclosure.textContent = dict.footerDisclosure;
  if (disclosureEl) {
    disclosureEl.textContent = `${dict.disclosurePrefix} ${dict.defaultDisclosure}`;
  }

  populatePriceSelect();
  populateCategorySelect();
  renderStoreTabs();
  renderPopupContent();
}

async function openExternalUrl(rawUrl) {
  const safeUrl = isSafeHttpsUrl(rawUrl) ? rawUrl : SITE_HOME_URL;
  try {
    if (isStandaloneWindow && chrome.windows && chrome.windows.getAll) {
      const normalWindows = await chrome.windows.getAll({ windowTypes: ['normal'] });
      if (normalWindows && normalWindows.length > 0) {
        const targetWin = normalWindows[0];
        await chrome.tabs.create({ windowId: targetWin.id, url: safeUrl, active: true });
        await chrome.windows.update(targetWin.id, { focused: true });
        return;
      }
      await chrome.windows.create({ url: safeUrl, type: 'normal', focused: true });
      return;
    }
    await chrome.tabs.create({ url: safeUrl });
    if (!isStandaloneWindow) window.close();
  } catch {
    chrome.tabs.create({ url: safeUrl });
    if (!isStandaloneWindow) window.close();
  }
}

function openStandalonePopupWindow() {
  const popupUrl = chrome.runtime.getURL('popup.html?mode=window');
  chrome.windows.create(
    { url: popupUrl, type: 'popup', width: 432, height: 680, focused: true },
    () => window.close()
  );
}

function startFlashCountdown() {
  const el = document.getElementById('flash-countdown');
  if (!el) return;
  const update = () => {
    const windowSec = 6 * 3600;
    const rem = windowSec - (Math.floor(Date.now() / 1000) % windowSec);
    const pad = (n) => String(n).padStart(2, '0');
    el.textContent = `${pad(Math.floor(rem / 3600))}:${pad(Math.floor((rem % 3600) / 60))}:${pad(rem % 60)}`;
  };
  update();
  window.setInterval(update, 1000);
}

function showStatusNotice(message, isSuccess = false) {
  const statusEl = document.getElementById('status-bar');
  if (!statusEl) return;
  statusEl.textContent = message;
  statusEl.className = isSuccess ? 'status-bar is-success' : 'status-bar';
  statusEl.hidden = false;
}

function hideStatusNotice() {
  const statusEl = document.getElementById('status-bar');
  if (!statusEl) return;
  statusEl.textContent = '';
  statusEl.hidden = true;
}

function populatePriceSelect() {
  const selectEl = document.getElementById('price-filter');
  if (!selectEl) return;
  const dict = getDict();
  const prev = selectedPriceTier || 'all';
  selectEl.replaceChildren();

  const allOpt = document.createElement('option');
  allOpt.value = 'all';
  allOpt.textContent = dict.allPriceTiers;
  selectEl.appendChild(allOpt);

  Object.entries(dict.tierLabels).forEach(([id, label]) => {
    const opt = document.createElement('option');
    opt.value = id;
    opt.textContent = label;
    selectEl.appendChild(opt);
  });

  selectEl.value = prev;
}

function populateCategorySelect() {
  const selectEl = document.getElementById('category-filter');
  if (!selectEl) return;
  const categories = currentPayload && Array.isArray(currentPayload.categories)
    ? currentPayload.categories
    : [{ id: 'all', nameEn: 'All Categories', nameAr: 'كل الأقسام' }];

  selectEl.replaceChildren();
  categories.forEach((cat) => {
    const opt = document.createElement('option');
    opt.value = cat.id;
    opt.textContent = getLocalizedCategoryName(cat);
    selectEl.appendChild(opt);
  });
  selectEl.value = selectedCategoryId;
}

function renderStoreTabs() {
  const tabsEl = document.getElementById('store-tabs');
  const branchEl = document.getElementById('branch-tabs');
  if (!tabsEl || !currentPayload || !Array.isArray(currentPayload.storeGroups)) return;

  const dict = getDict();
  const ar = isArLang();
  tabsEl.replaceChildren();

  const allTab = document.createElement('button');
  allTab.type = 'button';
  allTab.className = viewMode === 'products' && selectedGroupId === 'all' ? 'store-tab is-active' : 'store-tab';
  allTab.textContent = dict.allStores;
  allTab.addEventListener('click', () => {
    viewMode = 'products';
    selectedGroupId = 'all';
    selectedBranchId = 'all';
    updateCouponsButtonState();
    renderStoreTabs();
    renderPopupContent();
  });
  tabsEl.appendChild(allTab);

  currentPayload.storeGroups.forEach((group) => {
    const tabBtn = document.createElement('button');
    tabBtn.type = 'button';
    tabBtn.className = viewMode === 'products' && selectedGroupId === group.id ? 'store-tab is-active' : 'store-tab';
    const gName = ar ? (group.nameAr || group.nameEn) : (group.nameEn || group.nameAr);
    tabBtn.textContent = group.comingSoon ? `${gName} ${dict.soonSuffix}` : gName;
    tabBtn.addEventListener('click', () => {
      viewMode = 'products';
      selectedGroupId = group.id;
      const branches = (currentPayload.stores || []).filter((s) => s.groupId === group.id);
      selectedBranchId = branches.length > 1 ? 'all' : (group.defaultStoreId || branches[0]?.id || group.id);
      updateCouponsButtonState();
      renderStoreTabs();
      renderPopupContent();
    });
    tabsEl.appendChild(tabBtn);
  });

  if (branchEl) {
    const branches = (currentPayload.stores || []).filter((s) => s.groupId === selectedGroupId);
    if (viewMode === 'products' && selectedGroupId !== 'all' && branches.length > 1) {
      branchEl.hidden = false;
      branchEl.replaceChildren();

      const groupLabel = ar
        ? (branches[0].groupNameAr || branches[0].groupName || '')
        : (branches[0].groupName || branches[0].groupNameAr || '');

      const allBranchBtn = document.createElement('button');
      allBranchBtn.type = 'button';
      allBranchBtn.className = selectedBranchId === 'all' ? 'branch-tab is-active' : 'branch-tab';
      allBranchBtn.textContent = `${dict.allPrefix} ${groupLabel}`.trim();
      allBranchBtn.addEventListener('click', () => {
        selectedBranchId = 'all';
        renderStoreTabs();
        renderPopupContent();
      });
      branchEl.appendChild(allBranchBtn);

      branches.forEach((branch) => {
        const bBtn = document.createElement('button');
        bBtn.type = 'button';
        bBtn.className = selectedBranchId === branch.id ? 'branch-tab is-active' : 'branch-tab';
        const bName = ar ? (branch.nameAr || branch.name) : (branch.name || branch.nameAr);
        bBtn.textContent = `${branch.flag || ''} ${bName}`.trim();
        bBtn.addEventListener('click', () => {
          selectedBranchId = branch.id;
          renderStoreTabs();
          renderPopupContent();
        });
        branchEl.appendChild(bBtn);
      });
    } else {
      branchEl.hidden = true;
      branchEl.replaceChildren();
    }
  }
}

function updateCouponsButtonState() {
  const cBtn = document.getElementById('coupons-mode-btn');
  if (cBtn) {
    cBtn.className = viewMode === 'coupons' ? 'top-coupons-btn is-active' : 'top-coupons-btn';
  }
}

function createProductCard(product) {
  const dict = getDict();
  const ar = isArLang();
  const titleText = ar ? (product.titleAr || product.title) : (product.title || product.titleAr);
  const storeText = ar
    ? (product.storeNameAr || product.storeName || dict.partnerFallback)
    : (product.storeName || product.storeNameAr || dict.partnerFallback);
  const badgeText = ar
    ? (product.badgeAr || product.badge || dict.dealBadgeFallback)
    : (product.badge || product.badgeAr || dict.dealBadgeFallback);

  const card = document.createElement('article');
  card.className = 'product-card';

  const mediaWrap = document.createElement('div');
  mediaWrap.className = 'product-media';
  mediaWrap.addEventListener('click', () => openExternalUrl(product.affiliateUrl));

  const imgEl = createSafeImageElement(
    product.imageUrl,
    product.fallbackImage,
    titleText,
    'product-img'
  );
  mediaWrap.appendChild(imgEl);

  const badge = document.createElement('span');
  badge.className = 'product-badge';
  badge.textContent = badgeText;
  mediaWrap.appendChild(badge);

  const body = document.createElement('div');
  body.className = 'product-body';

  const storeRow = document.createElement('div');
  storeRow.className = 'product-store-row';
  const dot = document.createElement('span');
  dot.className = 'store-dot';
  dot.style.backgroundColor = product.badgeColor || '#00453E';
  storeRow.appendChild(dot);
  storeRow.appendChild(document.createTextNode(storeText));

  const titleEl = document.createElement('h3');
  titleEl.className = 'product-title';
  titleEl.textContent = titleText;

  const priceRow = document.createElement('div');
  priceRow.className = 'price-badge-row';
  if (product.price) {
    const pricePill = document.createElement('span');
    pricePill.className = 'price-pill';
    pricePill.textContent = formatPriceForLang(product.price);
    priceRow.appendChild(pricePill);
  }
  if (product.oldPrice) {
    const oldEl = document.createElement('span');
    oldEl.className = 'old-price-text';
    oldEl.textContent = formatPriceForLang(product.oldPrice);
    priceRow.appendChild(oldEl);
  }

  const ctaBtn = document.createElement('button');
  ctaBtn.type = 'button';
  ctaBtn.className = 'product-cta-btn';
  ctaBtn.textContent = dict.buyNow;
  ctaBtn.addEventListener('click', () => openExternalUrl(product.affiliateUrl));

  body.appendChild(storeRow);
  body.appendChild(titleEl);
  if (priceRow.childElementCount > 0) body.appendChild(priceRow);
  body.appendChild(ctaBtn);

  card.appendChild(mediaWrap);
  card.appendChild(body);
  return card;
}

function createCouponCard(coupon) {
  const dict = getDict();
  const ar = isArLang();
  const storeText = ar
    ? (coupon.storeNameAr || coupon.storeName || dict.partnerFallback)
    : (coupon.storeName || coupon.storeNameAr || dict.partnerFallback);
  const badgeText = ar
    ? (coupon.badgeAr || coupon.badge || dict.couponBadgeFallback)
    : (coupon.badge || coupon.badgeAr || dict.couponBadgeFallback);
  const titleText = ar ? (coupon.titleAr || coupon.title) : (coupon.title || coupon.titleAr);

  const card = document.createElement('article');
  card.className = 'coupon-card';

  const top = document.createElement('div');
  top.className = 'coupon-top';
  const storeSpan = document.createElement('span');
  storeSpan.className = 'coupon-store';
  storeSpan.textContent = storeText;
  const badgeSpan = document.createElement('span');
  badgeSpan.className = 'coupon-badge';
  badgeSpan.textContent = badgeText;
  top.appendChild(storeSpan);
  top.appendChild(badgeSpan);

  const titleEl = document.createElement('div');
  titleEl.className = 'coupon-title';
  titleEl.textContent = titleText;

  card.appendChild(top);
  card.appendChild(titleEl);

  if (coupon.code) {
    const codeBox = document.createElement('code');
    codeBox.className = 'coupon-code-box';
    codeBox.textContent = `${dict.codeLabel} ${coupon.code}`;
    card.appendChild(codeBox);
  }

  const ctaBtn = document.createElement('button');
  ctaBtn.type = 'button';
  ctaBtn.className = 'product-cta-btn';
  ctaBtn.textContent = coupon.code ? dict.copyAndShop(coupon.code) : dict.openOffer;
  ctaBtn.addEventListener('click', async () => {
    if (coupon.code && navigator.clipboard?.writeText) {
      try {
        await navigator.clipboard.writeText(coupon.code);
      } catch {
        // Ignore clipboard denial
      }
    }
    openExternalUrl(coupon.affiliateUrl);
  });

  card.appendChild(ctaBtn);
  return card;
}

function renderPopupContent() {
  const container = document.getElementById('popup-content');
  const disclosureEl = document.getElementById('affiliate-disclosure');
  const searchInput = document.getElementById('offer-search');
  if (!container) return;

  const dict = getDict();
  const ar = isArLang();
  const query = normalizeText(searchInput ? searchInput.value : '');
  container.replaceChildren();

  if (!currentPayload || !Array.isArray(currentPayload.stores)) {
    const fallback = document.createElement('div');
    fallback.className = 'offline-card';
    fallback.textContent = dict.offlineError;
    container.appendChild(fallback);
    return;
  }

  if (disclosureEl) {
    const discBody = currentLang === 'en' ? (currentPayload.disclosure || dict.defaultDisclosure) : dict.defaultDisclosure;
    disclosureEl.textContent = `${dict.disclosurePrefix} ${discBody}`;
  }

  if (viewMode === 'coupons') {
    const header = document.createElement('div');
    header.className = 'section-header';
    const title = document.createElement('span');
    title.className = 'section-title';
    title.textContent = dict.couponsHeading;
    const coupons = Array.isArray(currentPayload.coupons) ? currentPayload.coupons : [];
    const filteredCoupons = coupons.filter((c) => {
      if (!query) return true;
      return normalizeText(`${c.title} ${c.titleAr} ${c.storeName} ${c.storeNameAr || ''} ${c.code || ''}`).includes(query);
    });
    const count = document.createElement('span');
    count.className = 'section-count';
    count.textContent = dict.offersCount(filteredCoupons.length);
    header.appendChild(title);
    header.appendChild(count);
    container.appendChild(header);

    if (filteredCoupons.length === 0) {
      const empty = document.createElement('div');
      empty.className = 'coming-soon-card';
      empty.textContent = dict.noCoupons;
      container.appendChild(empty);
      return;
    }

    filteredCoupons.forEach((c) => container.appendChild(createCouponCard(c)));
    return;
  }

  const wfStrip = document.createElement('div');
  wfStrip.className = 'white-friday-strip';
  const wfText = document.createElement('span');
  wfText.textContent = dict.whiteFridayStrip;
  wfStrip.appendChild(wfText);
  container.appendChild(wfStrip);

  const groupObj = (currentPayload.storeGroups || []).find((g) => g.id === selectedGroupId);
  if (groupObj && groupObj.comingSoon) {
    const gName = ar ? (groupObj.nameAr || groupObj.nameEn) : (groupObj.nameEn || groupObj.nameAr);
    const cs = document.createElement('div');
    cs.className = 'coming-soon-card';
    const h = document.createElement('h3');
    h.textContent = dict.comingSoonHeading;
    const p = document.createElement('p');
    p.textContent = dict.comingSoonStoreBody(gName);
    cs.appendChild(h);
    cs.appendChild(p);
    container.appendChild(cs);
    return;
  }

  let allowedStoreIds = null;
  if (selectedBranchId !== 'all') {
    allowedStoreIds = new Set([selectedBranchId]);
  } else if (selectedGroupId !== 'all') {
    const groupBranches = (currentPayload.stores || []).filter((s) => s.groupId === selectedGroupId);
    allowedStoreIds = new Set(groupBranches.map((b) => b.id));
  }

  const rawProducts = Array.isArray(currentPayload.featuredProducts)
    ? currentPayload.featuredProducts
    : [];

  const filteredProducts = rawProducts.filter((prod) => {
    if (allowedStoreIds && !allowedStoreIds.has(prod.storeId)) return false;
    if (selectedCategoryId !== 'all' && prod.categoryId !== selectedCategoryId) return false;
    if (!matchesPriceTier(Number(prod.numericPrice || 0), selectedPriceTier)) return false;
    if (!query) return true;
    const hay = normalizeText(`${prod.title} ${prod.titleAr} ${prod.brand} ${prod.storeName} ${prod.storeNameAr || ''} ${prod.keywords}`);
    return hay.includes(query);
  });

  const prodHeader = document.createElement('div');
  prodHeader.className = 'section-header';
  const prodTitle = document.createElement('span');
  prodTitle.className = 'section-title';
  const groupDisplayName = groupObj
    ? (ar ? (groupObj.nameAr || groupObj.nameEn) : (groupObj.nameEn || groupObj.nameAr))
    : dict.partnerFallback;
  prodTitle.textContent = selectedGroupId === 'all'
    ? dict.topProductsHeading
    : dict.storeProductsHeading(groupDisplayName);
  const prodCount = document.createElement('span');
  prodCount.className = 'section-count';
  prodCount.textContent = dict.itemsCount(filteredProducts.length);
  prodHeader.appendChild(prodTitle);
  prodHeader.appendChild(prodCount);
  container.appendChild(prodHeader);

  if (filteredProducts.length === 0) {
    const cs = document.createElement('div');
    cs.className = 'coming-soon-card';
    const h = document.createElement('h3');
    h.textContent = dict.comingSoonHeading;
    const p = document.createElement('p');
    p.textContent = dict.comingSoonFilterBody;
    cs.appendChild(h);
    cs.appendChild(p);

    if (selectedGroupId !== 'all' && currentMatchedStore === null) {
      const storeObj = (currentPayload.stores || []).find((s) => s.groupId === selectedGroupId);
      if (storeObj && isSafeHttpsUrl(storeObj.affiliateUrl)) {
        const sName = ar
          ? (storeObj.groupNameAr || storeObj.nameAr || storeObj.groupName || storeObj.name)
          : (storeObj.groupName || storeObj.name);
        const visitBtn = document.createElement('button');
        visitBtn.type = 'button';
        visitBtn.className = 'product-cta-btn';
        visitBtn.style.marginTop = '10px';
        visitBtn.textContent = dict.openStorefront(sName);
        visitBtn.addEventListener('click', () => openExternalUrl(storeObj.affiliateUrl));
        cs.appendChild(visitBtn);
      }
    }

    container.appendChild(cs);
    return;
  }

  const grid = document.createElement('div');
  grid.className = 'products-grid';
  filteredProducts.forEach((p) => grid.appendChild(createProductCard(p)));
  container.appendChild(grid);
}

function loadOffers(forceRefresh = false) {
  const refreshBtn = document.getElementById('refresh-btn');
  if (refreshBtn && forceRefresh) refreshBtn.classList.add('is-spinning');

  chrome.runtime.sendMessage(
    { type: forceRefresh ? 'FORCE_REFRESH_OFFERS' : 'GET_OFFERS', hostname: activeHostname },
    (response) => {
      if (refreshBtn) refreshBtn.classList.remove('is-spinning');
      if (chrome.runtime.lastError || !response || !response.payload) {
        return;
      }

      currentPayload = response.payload;
      currentMatchedStore = response.matchedStore || null;

      if (forceRefresh && !currentPayload.isOfflineFallback) {
        showStatusNotice(getDict().syncedNotice, true);
      } else {
        hideStatusNotice();
      }

      populateCategorySelect();
      renderStoreTabs();
      renderPopupContent();
    }
  );
}

document.addEventListener('DOMContentLoaded', async () => {
  currentLang = await loadSavedLang();
  buildLanguageMenu();
  startFlashCountdown();

  const domainEl = document.getElementById('active-domain');
  const searchInput = document.getElementById('offer-search');
  const categorySelect = document.getElementById('category-filter');
  const priceSelect = document.getElementById('price-filter');
  const couponsBtn = document.getElementById('coupons-mode-btn');
  const refreshBtn = document.getElementById('refresh-btn');
  const popoutBtn = document.getElementById('popout-btn');
  const langPicker = document.getElementById('lang-picker');
  const langBtn = document.getElementById('lang-btn');
  const langMenu = document.getElementById('lang-menu');
  const extraLangSelect = document.getElementById('extra-lang-select');

  if (isStandaloneWindow) {
    document.body.classList.add('is-standalone');
    if (popoutBtn) popoutBtn.hidden = true;
  } else if (popoutBtn) {
    popoutBtn.addEventListener('click', openStandalonePopupWindow);
  }

  if (langBtn && langMenu) {
    langBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const willOpen = langMenu.hidden;
      langMenu.hidden = !willOpen;
      langBtn.setAttribute('aria-expanded', willOpen ? 'true' : 'false');
    });

    document.addEventListener('click', (e) => {
      if (langPicker && !langPicker.contains(e.target)) {
        langMenu.hidden = true;
        langBtn.setAttribute('aria-expanded', 'false');
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && !langMenu.hidden) {
        langMenu.hidden = true;
        langBtn.setAttribute('aria-expanded', 'false');
      }
    });
  }

  if (extraLangSelect) {
    extraLangSelect.addEventListener('change', (e) => {
      const targetCode = e.target.value;
      if (!targetCode) return;
      if (langMenu) langMenu.hidden = true;
      if (langBtn) langBtn.setAttribute('aria-expanded', 'false');
      const translateUrl = `https://translate.google.com/translate?sl=auto&tl=${encodeURIComponent(targetCode)}&u=${encodeURIComponent(SITE_HOME_URL)}`;
      openExternalUrl(translateUrl);
    });
  }

  document.querySelectorAll('[data-external-url]').forEach((anchor) => {
    anchor.addEventListener('click', (e) => {
      e.preventDefault();
      openExternalUrl(anchor.getAttribute('data-external-url'));
    });
  });

  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (tab && tab.url) {
      const parsed = new URL(tab.url);
      if (parsed.protocol === 'http:' || parsed.protocol === 'https:') {
        activeHostname = parsed.hostname.replace(/^www\./, '');
      }
    }
  } catch {
    activeHostname = '';
  }

  if (domainEl) domainEl.textContent = activeHostname || 'dodx.shop';
  if (searchInput) searchInput.addEventListener('input', renderPopupContent);
  if (categorySelect) {
    categorySelect.addEventListener('change', (e) => {
      selectedCategoryId = e.target.value;
      viewMode = 'products';
      updateCouponsButtonState();
      renderPopupContent();
    });
  }
  if (priceSelect) {
    priceSelect.addEventListener('change', (e) => {
      selectedPriceTier = e.target.value;
      viewMode = 'products';
      updateCouponsButtonState();
      renderPopupContent();
    });
  }
  if (couponsBtn) {
    couponsBtn.addEventListener('click', () => {
      viewMode = viewMode === 'coupons' ? 'products' : 'coupons';
      updateCouponsButtonState();
      renderStoreTabs();
      renderPopupContent();
    });
  }
  if (refreshBtn) refreshBtn.addEventListener('click', () => loadOffers(true));

  applyLanguageUI();
  loadOffers(false);
});
