export type LanguageCode =
  | 'en'
  | 'ar'
  | 'es'
  | 'fr'
  | 'de'
  | 'pt'
  | 'zh'
  | 'ja'
  | 'ko'
  | 'hi'
  | 'tr'
  | 'ru'
  | 'it'
  | 'id'
  | 'nl'
  | 'pl';

export interface LanguageMeta {
  code: LanguageCode;
  shortLabel: string;
  nativeName: string;
  englishName: string;
  flag: string;
  dir: 'ltr' | 'rtl';
}

export const SUPPORTED_LANGUAGES: LanguageMeta[] = [
  { code: 'en', shortLabel: 'EN', nativeName: 'English', englishName: 'English', flag: '🇺🇸', dir: 'ltr' },
  { code: 'ar', shortLabel: 'AR', nativeName: 'العربية', englishName: 'Arabic', flag: '🇸🇦', dir: 'rtl' },
  { code: 'es', shortLabel: 'ES', nativeName: 'Español', englishName: 'Spanish', flag: '🇪🇸', dir: 'ltr' },
  { code: 'fr', shortLabel: 'FR', nativeName: 'Français', englishName: 'French', flag: '🇫🇷', dir: 'ltr' },
  { code: 'de', shortLabel: 'DE', nativeName: 'Deutsch', englishName: 'German', flag: '🇩🇪', dir: 'ltr' },
  { code: 'pt', shortLabel: 'PT', nativeName: 'Português', englishName: 'Portuguese', flag: '🇧🇷', dir: 'ltr' },
  { code: 'zh', shortLabel: 'ZH', nativeName: '简体中文', englishName: 'Chinese', flag: '🇨🇳', dir: 'ltr' },
  { code: 'ja', shortLabel: 'JA', nativeName: '日本語', englishName: 'Japanese', flag: '🇯🇵', dir: 'ltr' },
  { code: 'ko', shortLabel: 'KO', nativeName: '한국어', englishName: 'Korean', flag: '🇰🇷', dir: 'ltr' },
  { code: 'hi', shortLabel: 'HI', nativeName: 'हिन्दी', englishName: 'Hindi', flag: '🇮🇳', dir: 'ltr' },
  { code: 'tr', shortLabel: 'TR', nativeName: 'Türkçe', englishName: 'Turkish', flag: '🇹🇷', dir: 'ltr' },
  { code: 'ru', shortLabel: 'RU', nativeName: 'Русский', englishName: 'Russian', flag: '🇷🇺', dir: 'ltr' },
  { code: 'it', shortLabel: 'IT', nativeName: 'Italiano', englishName: 'Italian', flag: '🇮🇹', dir: 'ltr' },
  { code: 'id', shortLabel: 'ID', nativeName: 'Bahasa Indonesia', englishName: 'Indonesian', flag: '🇮🇩', dir: 'ltr' },
  { code: 'nl', shortLabel: 'NL', nativeName: 'Nederlands', englishName: 'Dutch', flag: '🇳🇱', dir: 'ltr' },
  { code: 'pl', shortLabel: 'PL', nativeName: 'Polski', englishName: 'Polish', flag: '🇵🇱', dir: 'ltr' },
];

export interface TranslationDict {
  dealsActiveIn: string;
  searchPlaceholder: string;
  allOption: string;
  chromeExtension: string;
  addDodxFree: string;
  addChromeShort: string;
  affiliate: string;
  disclosure: string;
  claimed: string;
  navAll: string;
  todaysDeals: string;
  productsNav: string;
  productsPageTitle: string;
  productsPageSubtitle: string;
  searchBrandsPlaceholder: string;
  allDepartmentsLabel: string;
  subcategoriesLabel: string;
  brandsLabel: string;
  officialPartnerBanner: string;
  matchingProductsHeading: string;
  exploreAllProducts: string;
  affiliateDisclosure: string;
  helloShopper: string;
  verifiedDealsSub: string;
  topStores: string;
  shopByDepartment: string;
  allVerifiedDeals: string;
  globalMarketplaces: string;
  electronicsHome: string;
  fashionApparel: string;
  dealsUnder25: string;
  dealsUnder50: string;
  helpInformation: string;
  dodxBrowserExtension: string;
  privacyPolicy: string;
  languageTitle: string;
  showingPrefix: string;
  verifiedProductDeals: string;
  clearAllFilters: string;
  liveFeedTitle: string;
  liveFeedHint: string;
  pause: string;
  play: string;
  limitedTimeDeal: string;
  autoDeal: string;
  copyAndShop: string;
  claimDeal: string;
  verifiedCouponsHeading: string;
  verifiedOffersReady: string;
  promoCodeLabel: string;
  activationLabel: string;
  noCodeNeeded: string;
  copyCodeAndGo: string;
  activateDeal: string;
  noCouponsMatch: string;
  resetSearch: string;
  saveAutoHeading: string;
  saveAutoSub: string;
  addDodxToChromeCta: string;
  affiliateStatement: string;
  readFullDisclosure: string;
  backToDodx: string;
  switchStore: string;
  dealUnlocked: string;
  verifiedCouponsAndDeals: string;
  verifiedOffersCount: string;
  shopNow: string;
  noCodeRequiredNote: string;
  copyCodeAndActivate: string;
  storeNotFound: string;
  storeNotFoundSub: string;
  backToTop: string;
  getToKnowDodx: string;
  liveCouponFeed: string;
  hotVerifiedDeals: string;
  browserCompanion: string;
  partnerNetworks: string;
  legalCompliance: string;
  close: string;
  browseTodaysDeals: string;
  modalSub: string;
  modalDesc: string;
  modalBullet1: string;
  modalBullet2: string;
  modalBullet3: string;
  modalNote: string;
  installFromChromeStore: string;
  copiedToastPrefix: string;
  useCodeToastPrefix: string;
  dealActivatedToast: string;
  openingStoreToast: string;
  openManually: string;
  heroCards: Array<{ eyebrow: string; title: string; ctaLabel: string }>;
  quickStrip: Array<{ title: string; subtitle: string }>;
  bentoHeadings: string[];
  bentoLinks: string[];
  catAll: string;
  catMarketplaces: string;
  catFashion: string;
  catElectronics: string;
  bfKicker: string;
  bfTitle: string;
  bfSubtitle: string;
  bfPrimaryCta: string;
  bfSecondaryCta: string;
  couponsNav: string;
  buyNow: string;
  endsIn: string;
  flashHeroTitle: string;
  flashHeroSub: string;
  whiteFridayHeader: string;
  comingSoonTitle: string;
  comingSoonSub: string;
  categoriesHeading: string;
  storesHeading: string;
  allPricesLabel: string;
  bfBannerBadge: string;
  bfBannerTitle: string;
  bfBannerSub: string;
  bfBannerCta: string;
  bfGifCaption: string;
  vehiclesBannerKicker: string;
  vehiclesBannerTitle: string;
  vehiclesBannerSub: string;
  vehiclesBannerCta: string;
  vehiclesShowcase: Array<{ label: string; title: string; spec: string }>;
}

const EN: TranslationDict = {
  dealsActiveIn: 'Deals active in',
  searchPlaceholder: 'Search products, brands & coupons in any language (phones, HONOR, Alibaba, Amazon)...',
  allOption: 'All',
  chromeExtension: 'Chrome Extension',
  addDodxFree: 'Add Dodx – Free',
  addChromeShort: 'Add Chrome',
  affiliate: 'Verified',
  disclosure: 'Savings Guide',
  claimed: 'Claimed',
  navAll: 'All',
  todaysDeals: "Today's Deals",
  affiliateDisclosure: 'Verified Savings Guide',
  helloShopper: 'Hello, Shopper',
  verifiedDealsSub: 'dodx.shop Verified Deals',
  topStores: 'Top Stores',
  shopByDepartment: 'Shop by Department',
  allVerifiedDeals: 'All Verified Deals',
  globalMarketplaces: 'Global Marketplaces',
  electronicsHome: 'Electronics & Home',
  fashionApparel: 'Fashion & Apparel',
  dealsUnder25: 'Deals Under $25',
  dealsUnder50: 'Deals Under $50',
  helpInformation: 'Help & Information',
  dodxBrowserExtension: 'Dodx Browser Extension',
  privacyPolicy: 'Privacy Policy',
  languageTitle: 'Choose Language',
  showingPrefix: 'Showing',
  verifiedProductDeals: 'verified product deals',
  clearAllFilters: 'Clear all filters',
  liveFeedTitle: "Today's Live Coupon & Product Feed",
  liveFeedHint: 'Hover any product to pause · Click to unlock discount & deal',
  pause: 'Pause',
  play: 'Play',
  limitedTimeDeal: 'Limited time deal',
  autoDeal: 'Direct Discount',
  copyAndShop: 'Copy & Shop',
  claimDeal: 'Claim Offer',
  verifiedCouponsHeading: 'Verified Coupons, Promo Codes & Hot Deals',
  verifiedOffersReady: 'verified deals & coupons ready',
  promoCodeLabel: 'Promo Code:',
  activationLabel: 'Activation:',
  noCodeNeeded: 'Direct Discount · Instant Savings',
  copyCodeAndGo: 'Copy Code & Go to Store',
  activateDeal: 'Get Deal & Save',
  noCouponsMatch: 'No offers match your search.',
  resetSearch: 'Reset search',
  saveAutoHeading: 'Save automatically at global stores with Dodx',
  saveAutoSub: 'Instant access to verified coupons and deals for Amazon US, UAE, Egypt & Japan, AliExpress, Alibaba, HONOR, Huawei, Lenovo, and Canon.',
  addDodxToChromeCta: "Add Dodx to Chrome – It's Free",
  affiliateStatement:
    'Dodx curates verified promo codes, clip coupons, bank discounts, and direct store offers across top global retailers so shoppers get instant savings at checkout.',
  readFullDisclosure: 'Read Savings Guide',
  backToDodx: 'Back to Dodx Home',
  switchStore: 'Switch store:',
  dealUnlocked: 'Store Discounts & Verified Coupons Ready',
  verifiedCouponsAndDeals: 'Verified Coupons & Deals',
  verifiedOffersCount: 'verified offers',
  shopNow: 'Shop Now',
  noCodeRequiredNote: 'Instant offer — discount applies directly on store checkout',
  copyCodeAndActivate: 'Copy Code & Activate Deal',
  storeNotFound: 'Store not found',
  storeNotFoundSub: 'Choose one of our verified stores below to unlock active coupons and deals.',
  backToTop: 'Back to top',
  getToKnowDodx: 'Get to Know Dodx',
  liveCouponFeed: 'Live Coupon Feed',
  hotVerifiedDeals: 'Hot Verified Deals',
  browserCompanion: 'Browser Companion',
  partnerNetworks: 'Featured Stores',
  legalCompliance: 'Guides & Privacy',
  close: 'Close',
  browseTodaysDeals: "Browse Today's Deals",
  modalSub: 'Free Chrome Browser Companion',
  modalDesc: 'Our Chrome extension alerts you automatically whenever verified promo codes, clip coupons, and instant discounts are available at supported stores.',
  modalBullet1: 'Instant coupon and discount alerts when visiting supported stores',
  modalBullet2: 'One-click access to verified promo codes & storewide markdowns',
  modalBullet3: 'Privacy-first — no browsing history tracking',
  modalNote: 'Available now on the official Chrome Web Store. Free, lightweight, and privacy-first.',
  installFromChromeStore: 'Install from Chrome Web Store',
  copiedToastPrefix: 'Code copied to clipboard:',
  useCodeToastPrefix: 'Use promo code at checkout:',
  dealActivatedToast: 'discount offer opened',
  openingStoreToast: 'Opening store in a new tab...',
  openManually: 'Open store offer manually',
  heroCards: [
    { eyebrow: 'Shop featured deals now', title: "Amazon US Today's Deals & Daily Offers", ctaLabel: 'Shop Amazon Deals' },
    { eyebrow: 'Computers & Electronics', title: 'Laptops, Audio & Smart Tech on Amazon', ctaLabel: 'Explore Tech Deals' },
    { eyebrow: 'Global Direct Savings', title: 'AliExpress Choice Tech & Everyday Finds', ctaLabel: 'Shop AliExpress' },
    { eyebrow: 'Official UAE Store', title: 'HONOR UAE Smartphones, Tablets & Books', ctaLabel: 'Shop HONOR UAE' },
    { eyebrow: 'Wholesale Direct', title: 'Alibaba Direct Manufacturer Sourcing', ctaLabel: 'Shop Alibaba' },
  ],
  quickStrip: [
    { title: 'Keep shopping for tech', subtitle: 'Amazon US · Daily Deals' },
    { title: 'Global tech & gadgets', subtitle: 'AliExpress · Choice Store' },
    { title: 'Factory direct wholesale', subtitle: 'Alibaba · Trade Assurance' },
    { title: 'HONOR Smartphones', subtitle: 'HONOR UAE · Official Store' },
    { title: 'Huawei Devices & Watch', subtitle: 'Huawei AE · Official Store' },
    { title: 'ThinkPad & Legion PCs', subtitle: 'Lenovo India · Official Store' },
    { title: 'Cameras & PIXMA Printers', subtitle: 'Canon UAE · Official Store' },
  ],
  bentoHeadings: [
    'Amazon US & Tech Picks',
    'Official Brand Stores (HONOR, Huawei, Canon, Lenovo)',
    'AliExpress & Alibaba Global Picks',
    'Software, Audio & Exclusive Offers',
  ],
  bentoLinks: [
    'See all Amazon US deals',
    'Visit HONOR UAE Official Store',
    'Explore AliExpress deals',
    'Get Parallels WW & Software',
  ],
  catAll: 'All',
  catMarketplaces: 'Marketplaces',
  catFashion: 'Fashion',
  catElectronics: 'Electronics & Home',
  bfKicker: 'Verified Coupons & Direct Savings · Live Worldwide',
  bfTitle: 'Verified Store Deals & Coupons — Amazon, AliExpress, Alibaba, HONOR, Huawei & More',
  bfSubtitle:
    'Unlock active promo codes, clip coupons, and instant storewide markdowns on Amazon US, UAE, Egypt & Japan, AliExpress, Alibaba, HONOR UAE, Huawei AE, Lenovo India, Canon UAE, Parallels WW, AdGuard, and Admitad Shop.',
  bfPrimaryCta: 'Shop Amazon Deals',
  bfSecondaryCta: 'Browse All Store Deals',
  productsNav: 'Products',
  productsPageTitle: 'Product Departments & Global Brands',
  productsPageSubtitle:
    'Browse shopping departments, visual categories, and top global brands.',
  searchBrandsPlaceholder: 'Search any product or brand in any language (e.g. HONOR, phones, laptop)...',
  allDepartmentsLabel: 'Shop by Department',
  subcategoriesLabel: 'Subcategories',
  brandsLabel: 'Global Brands',
  officialPartnerBanner: 'Featured Coupons & Store Offers',
  matchingProductsHeading: 'Matching Products & Global Brands',
  exploreAllProducts: 'Browse All Products',
  couponsNav: 'Coupons',
  buyNow: 'Buy Now',
  endsIn: 'Ends in',
  flashHeroTitle: 'Biggest Discounts — Ending in Hours',
  flashHeroSub: 'Limited-time White & Black Friday price drops on top electronics and phones.',
  whiteFridayHeader: 'Best Deals — Massive White Friday Discounts',
  comingSoonTitle: 'Biggest Discounts Coming Very Soon',
  comingSoonSub: 'We are preparing verified direct product links and exclusive discounts for this store.',
  categoriesHeading: 'Categories',
  storesHeading: 'Global Stores',
  allPricesLabel: 'All Prices',
  bfBannerBadge: 'BLACK FRIDAY SPOTLIGHT',
  bfBannerTitle: "Today's Big Deals — Amazon US Black Friday",
  bfBannerSub: 'Amazon US top-selling discounts on smartphones, laptops, TVs, audio, smart home, kitchen appliances & watches — direct links & instant savings.',
  bfBannerCta: 'Shop Amazon US Deals',
  bfGifCaption: "Today's Big Deals · Amazon US",
  vehiclesBannerKicker: 'Dodx Automotive Showcase · Launching Soon',
  vehiclesBannerTitle: 'Coming Soon: Latest Vehicles',
  vehiclesBannerSub:
    'Flagship electric luxury sedans, commanding performance SUVs, and sculpted grand tourer coupes — explore verified automotive arrivals launching soon.',
  vehiclesBannerCta: 'Explore Cars & Automotive',
  vehiclesShowcase: [
    {
      label: 'Electric Sedan',
      title: '2026 Flagship Electric Luxury Sedan',
      spec: 'Dual-Motor AWD · Glass Panoramic Canopy · Next-Gen Fast Charging',
    },
    {
      label: 'Performance SUV',
      title: '2026 Obsidian Luxury Flagship SUV',
      spec: 'All-Terrain Air Suspension · Signature Alloy Wheels · Executive Cabin',
    },
    {
      label: 'Grand Tourer',
      title: '2026 Pearl Grand Tourer Coupe',
      spec: 'Aerodynamic Sculpted Chassis · Adaptive Sport Dynamics · Handcrafted Trim',
    },
  ],
};

const AR: TranslationDict = {
  dealsActiveIn: 'العروض متاحة في',
  searchPlaceholder: 'ابحث عن أي منتج أو كوبون أو شركة بكل اللغات (هواتف، هونر، علي بابا، أمازون)...',
  allOption: 'الكل',
  chromeExtension: 'إضافة كروم',
  addDodxFree: 'أضف Dodx – مجاناً',
  addChromeShort: 'أضف لكروم',
  affiliate: 'تخفيضات',
  disclosure: 'موثّقة',
  claimed: 'المفعّلة',
  navAll: 'الكل',
  todaysDeals: 'عروض اليوم',
  affiliateDisclosure: 'دليل العروض والتوفير الموثّق',
  helloShopper: 'مرحباً بك في Dodx',
  verifiedDealsSub: 'كوبونات dodx.shop الموثقة',
  topStores: 'أهم المتاجر',
  shopByDepartment: 'تصفح حسب القسم',
  allVerifiedDeals: 'جميع العروض الموثقة',
  globalMarketplaces: 'المتاجر العالمية',
  electronicsHome: 'الإلكترونيات والمنزل',
  fashionApparel: 'الأزياء والملابس',
  dealsUnder25: 'عروض أقل من 25$',
  dealsUnder50: 'عروض أقل من 50$',
  helpInformation: 'المساعدة والمعلومات',
  dodxBrowserExtension: 'إضافة Dodx للمتصفح',
  privacyPolicy: 'سياسة الخصوصية',
  languageTitle: 'اختر اللغة',
  showingPrefix: 'عرض',
  verifiedProductDeals: 'عرض منتجات وكوبونات موثقة',
  clearAllFilters: 'مسح جميع الفلاتر',
  liveFeedTitle: 'معرض الكوبونات والمنتجات المباشر لليوم',
  liveFeedHint: 'مرر الفأرة على أي منتج للإيقاف · اضغط للاستفادة من الخصم والعرض',
  pause: 'إيقاف',
  play: 'تشغيل',
  limitedTimeDeal: 'عرض خصم محدود',
  autoDeal: 'خصم مباشر',
  copyAndShop: 'انسخ وتسوق',
  claimDeal: 'احصل على العرض',
  verifiedCouponsHeading: 'أقوى الكوبونات وأكواد الخصم وعروض المتاجر',
  verifiedOffersReady: 'عروض وكوبونات جاهزة للتوفير',
  promoCodeLabel: 'كود الخصم:',
  activationLabel: 'التفعيل:',
  noCodeNeeded: 'عرض مباشر · خصم فوري',
  copyCodeAndGo: 'نسخ الكود والذهاب للمتجر',
  activateDeal: 'احصل على العرض الآن',
  noCouponsMatch: 'لا توجد عروض مطابقة لبحثك.',
  resetSearch: 'إعادة ضبط البحث',
  saveAutoHeading: 'وفّر تلقائياً مع كوبونات وعروض Dodx',
  saveAutoSub: 'أكواد خصم وكوبونات موثوقة وتخفيضات مباشرة على أمازون أمريكا والإمارات ومصر واليابان وعلي إكسبريس وعلي بابا وهونر وهواوي ولينوفو وكانون.',
  addDodxToChromeCta: 'أضف Dodx إلى Chrome – مجاناً',
  affiliateStatement:
    'يجمع موقع Dodx أحدث أكواد الخصم الموثّقة والكوبونات الحصرية وأقوى التخفيضات المباشرة من المتاجر العالمية لمساعدتك على التوفير الفوري عند الشراء.',
  readFullDisclosure: 'عرض دليل التوفير',
  backToDodx: 'العودة إلى الرئيسية',
  switchStore: 'تبديل المتجر:',
  dealUnlocked: 'المتجر المعتمد / الكوبونات والتخفيضات المتاحة',
  verifiedCouponsAndDeals: 'الكوبونات والعروض الموثّقة',
  verifiedOffersCount: 'عروض موثّقة',
  shopNow: 'تسوق الآن',
  noCodeRequiredNote: 'عرض مباشر — يسري الخصم والتوفير فور انتقالك للمتجر',
  copyCodeAndActivate: 'نسخ الكود وتفعيل الخصم',
  storeNotFound: 'المتجر غير موجود',
  storeNotFoundSub: 'اختر أحد المتاجر المعتمدة أدناه لتصفح الكوبونات والعروض المتاحة.',
  backToTop: 'العودة للأعلى',
  getToKnowDodx: 'تعرف على Dodx',
  liveCouponFeed: 'شريط الكوبونات المباشر',
  hotVerifiedDeals: 'أقوى العروض الموثقة',
  browserCompanion: 'مساعد المتصفح',
  partnerNetworks: 'المتاجر المعتمدة',
  legalCompliance: 'الإرشادات والخصوصية',
  close: 'إغلاق',
  browseTodaysDeals: 'تصفح عروض اليوم',
  modalSub: 'مساعد المتصفح المجاني للتسوق الذكي',
  modalDesc: 'تنبهك إضافة Chrome تلقائياً عند توفر كوبونات خصم وعروض وتخفيضات في المتاجر المدعومة بموقعنا.',
  modalBullet1: 'تنبيهات فورية بالكوبونات والخصومات عند زيارة المتاجر المدعومة',
  modalBullet2: 'وصول سريع لأحدث أكواد الخصم وعروض التوفير المباشرة',
  modalBullet3: 'حماية كاملة للخصوصية دون تتبع سجل التصفح',
  modalNote: 'متوفرة الآن رسمياً على سوق Chrome الإلكتروني. مجانية وخفيفة وتحفظ خصوصيتك.',
  installFromChromeStore: 'تثبيت من سوق Chrome الآن',
  copiedToastPrefix: 'تم نسخ الكود:',
  useCodeToastPrefix: 'استخدم الكود عند الدفع:',
  dealActivatedToast: 'تم فتح عرض التوفير',
  openingStoreToast: 'جاري فتح المتجر في تبويب جديد...',
  openManually: 'افتح رابط المتجر يدوياً',
  heroCards: [
    { eyebrow: 'تصفح أقوى العروض الآن', title: 'أبرز عروض أمازون اليومية والموسمية', ctaLabel: 'افتح عروض أمازون' },
    { eyebrow: 'الإلكترونيات واللابتوب', title: 'عروض أجهزة التقنية والسماعات على أمازون', ctaLabel: 'استكشف عروض التقنية' },
    { eyebrow: 'توفير عالمي مباشر', title: 'عروض علي إكسبريس Choice على الأجهزة والإكسسوارات', ctaLabel: 'تسوق AliExpress' },
    { eyebrow: 'المتجر الرسمي بالإمارات', title: 'هواتف وتابلت ولابتوب HONOR الإمارات الرسمي', ctaLabel: 'تسوق هونر الإمارات' },
    { eyebrow: 'الاستيراد والجملة من المصانع', title: 'منصة Alibaba الرسمية للتسوق المباشر والجملة', ctaLabel: 'تسوق Alibaba' },
  ],
  quickStrip: [
    { title: 'تصفح عروض التقنية', subtitle: 'أمازون أمريكا · عروض اليوم' },
    { title: 'إلكترونيات وإكسسوارات', subtitle: 'AliExpress · متجر Choice' },
    { title: 'عروض المصانع والجملة', subtitle: 'Alibaba · ضمان التجارة' },
    { title: 'هواتف HONOR', subtitle: 'HONOR الإمارات · الرسمي' },
    { title: 'أجهزة Huawei', subtitle: 'Huawei الإمارات · الرسمي' },
    { title: 'لابتوبات Lenovo', subtitle: 'Lenovo الهند · الرسمي' },
    { title: 'كاميرات وطابعات Canon', subtitle: 'Canon الإمارات · الرسمي' },
  ],
  bentoHeadings: [
    'عروض أمازون والتقنية',
    'المتاجر الرسمية (HONOR و Huawei و Canon و Lenovo)',
    'عروض AliExpress و Alibaba العالمية',
    'البرامج والصوتيات والعروض الحصرية',
  ],
  bentoLinks: [
    'عرض كل عروض أمازون',
    'زيارة متجر HONOR الإمارات الرسمي',
    'استكشف عروض AliExpress',
    'احصل على Parallels WW الرسمي',
  ],
  catAll: 'الكل',
  catMarketplaces: 'المتاجر الشاملة',
  catFashion: 'الأزياء',
  catElectronics: 'الإلكترونيات والمنزل',
  bfKicker: 'كوبونات موثّقة وتخفيضات مباشرة · عروض يومية',
  bfTitle: 'أقوى العروض والكوبونات — Amazon و AliExpress و Alibaba و HONOR و Huawei وغيرها',
  bfSubtitle:
    'احصل على أحدث أكواد الخصم وكوبونات التوفير والعروض اليومية عبر Amazon US وأمازون الإمارات ومصر واليابان وAliExpress وAlibaba وHONOR UAE وHuawei AE وLenovo India وCanon UAE وParallels WW وAdGuard وAdmitad Shop.',
  bfPrimaryCta: 'تسوق عروض أمازون الآن',
  bfSecondaryCta: 'تصفح كل العروض والكوبونات',
  productsNav: 'المنتجات',
  productsPageTitle: 'أقسام المنتجات والماركات العالمية',
  productsPageSubtitle:
    'تصفح أقسام المنتجات والفئات الفرعية وأشهر الشركات العالمية عبر بطاقات مرئية منظمة.',
  searchBrandsPlaceholder: 'ابحث عن أي منتج أو شركة بأي لغة (مثل: هونر، هواتف، لابتوب، عطور، دايسون)...',
  allDepartmentsLabel: 'تصفح حسب القسم',
  subcategoriesLabel: 'الأقسام الفرعية',
  brandsLabel: 'الشركات العالمية',
  officialPartnerBanner: 'أبرز الكوبونات والعروض الحصرية',
  matchingProductsHeading: 'المنتجات والماركات المطابقة لبحثك',
  exploreAllProducts: 'تصفح كل الأقسام والمنتجات',
  couponsNav: 'كوبونات',
  buyNow: 'اشترِ الآن',
  endsIn: 'ينتهي خلال',
  flashHeroTitle: 'أقوى الخصومات — تنتهي خلال ساعات',
  flashHeroSub: 'عروض الجمعة البيضاء والسوداء لفترة محدودة على أحدث الهواتف واللابتوبات والإلكترونيات.',
  whiteFridayHeader: 'أفضل الصفقات — خصومات كبيرة جداً بمناسبة الجمعة البيضاء',
  comingSoonTitle: 'انتظر أقوى الخصومات قريباً جداً',
  comingSoonSub: 'نقوم حالياً بتجهيز روابط الشراء المباشرة وأقوى الخصومات الحصرية لهذا المتجر.',
  categoriesHeading: 'الأقسام والفئات',
  storesHeading: 'المتاجر العالمية',
  allPricesLabel: 'كل الأسعار',
  bfBannerBadge: 'عروض الجمعة السوداء الحصرية',
  bfBannerTitle: 'أقوى عروض اليوم — الجمعة السوداء على أمازون أمريكا',
  bfBannerSub: 'أقوى خصومات أمازون أمريكا على أهم المنتجات الأكثر طلباً: الهواتف، اللابتوب، الشاشات، الصوتيات، أجهزة المنزل والمطبخ والساعات.',
  bfBannerCta: 'تسوق عروض أمازون أمريكا',
  bfGifCaption: 'عروض اليوم الكبرى · أمازون أمريكا',
  vehiclesBannerKicker: 'صالة عرض Dodx للسيارات · إطلاق قريب',
  vehiclesBannerTitle: 'قريباً أحدث المركبات',
  vehiclesBannerSub:
    'أفخم سيارات السيدان الكهربائية، وسيارات الدفع الرباعي الفارهة، وكوبيه الجران تورر الرياضية — عروض وموديلات حديثة تصل قريباً.',
  vehiclesBannerCta: 'تصفح قسم السيارات الآن',
  vehiclesShowcase: [
    {
      label: 'سيدان كهربائية',
      title: 'سيدان كهربائية فاخرة إصدار 2026',
      spec: 'دفع كلي بمحركين · سقف بانورامي زجاجي · شحن فائق السرعة',
    },
    {
      label: 'دفع رباعي SUV',
      title: 'سيارة دفع رباعي فاخرة سوداء إصدار 2026',
      spec: 'تعليق هوائي متكيف · جنوط رياضية مصقولة · مقصورة تنفيذية رحبة',
    },
    {
      label: 'كوبيه رياضية',
      title: 'كوبيه جران تورر رياضية لؤلؤية 2026',
      spec: 'تصميم ديناميكي انسيابي · أداء رياضي متطور · تجهيزات داخلية فاخرة',
    },
  ],
};

const ES: TranslationDict = {
  ...EN,
  dealsActiveIn: 'Ofertas activas en',
  searchPlaceholder: 'Buscar productos y marcas en Dodx (Amazon, AliExpress, HONOR, Alibaba)...',
  allOption: 'Todo',
  chromeExtension: 'Extensión Chrome',
  addDodxFree: 'Añadir Dodx – Gratis',
  addChromeShort: 'Añadir Chrome',
  affiliate: 'Ahorro',
  disclosure: 'Verificado',
  claimed: 'Usados',
  navAll: 'Todo',
  todaysDeals: 'Ofertas de Hoy',
  productsNav: 'Productos',
  affiliateDisclosure: 'Guía de Ahorro Verificado',
  helloShopper: 'Hola, Comprador',
  topStores: 'Tiendas Principales',
  shopByDepartment: 'Comprar por Departamento',
  allVerifiedDeals: 'Todas las Ofertas',
  globalMarketplaces: 'Tiendas Globales',
  electronicsHome: 'Electrónica y Hogar',
  fashionApparel: 'Moda y Ropa',
  dealsUnder25: 'Ofertas menos de $25',
  dealsUnder50: 'Ofertas menos de $50',
  helpInformation: 'Ayuda e Información',
  dodxBrowserExtension: 'Extensión Dodx',
  privacyPolicy: 'Política de Privacidad',
  languageTitle: 'Elegir idioma',
  liveFeedTitle: 'Galería en Vivo de Ofertas y Productos',
  liveFeedHint: 'Pasa el cursor para pausar · Haz clic para ver la oferta',
  pause: 'Pausar',
  play: 'Reproducir',
  limitedTimeDeal: 'Oferta por tiempo limitado',
  autoDeal: 'Descuento Directo',
  copyAndShop: 'Copiar y Comprar',
  claimDeal: 'Ver Oferta',
  verifiedCouponsHeading: 'Cupones Verificados y Ofertas Destacadas',
  copyCodeAndGo: 'Copiar Código e Ir a la Tienda',
  activateDeal: 'Ir a la Oferta',
  saveAutoHeading: 'Ahorra en tiendas globales verificadas con Dodx',
  addDodxToChromeCta: 'Añadir Dodx a Chrome – Es Gratis',
  backToDodx: 'Volver al inicio de Dodx',
  dealUnlocked: 'Cupones y Ofertas Verificadas',
  copyCodeAndActivate: 'Copiar Código y Activar Oferta',
  backToTop: 'Volver arriba',
  catAll: 'Todo',
  catMarketplaces: 'Tiendas',
  catFashion: 'Moda',
  catElectronics: 'Electrónica y Hogar',
  bfKicker: 'Cupones Verificados y Ahorro Directo · En Vivo',
  bfTitle: 'Cupones y Ofertas Oficiales — Amazon, AliExpress, Alibaba, HONOR, Huawei y Más',
  bfSubtitle: 'Descuentos verificados en Amazon US, UAE, Egipto y Japón, AliExpress, Alibaba, HONOR UAE, Huawei AE, Lenovo India y Canon UAE.',
  bfPrimaryCta: 'Ver Ofertas Amazon',
  bfSecondaryCta: 'Explorar Todas las Ofertas',
  bfBannerBadge: 'ESPECIAL BLACK FRIDAY',
  bfBannerTitle: 'Grandes Ofertas de Hoy — Black Friday Amazon US',
  bfBannerSub: 'Descuentos directos seleccionados del Black Friday con enlaces directos a cada producto.',
  bfBannerCta: 'Comprar en Amazon US',
  bfGifCaption: 'Grandes Ofertas · Amazon US',
  vehiclesBannerKicker: 'Exhibición Automotriz Dodx · Próximo Lanzamiento',
  vehiclesBannerTitle: 'Próximamente: Los Últimos Vehículos',
  vehiclesBannerSub:
    'Sedanes eléctricos de lujo, SUVs de alto rendimiento y coupés deportivos — descubre los próximos lanzamientos automotrices.',
  vehiclesBannerCta: 'Explorar Autos y Accesorios',
  vehiclesShowcase: [
    {
      label: 'Sedán Eléctrico',
      title: 'Sedán Eléctrico de Lujo 2026',
      spec: 'Tracción Integral Dual · Techo Panorámico · Carga Ultrarrápida',
    },
    {
      label: 'SUV Premium',
      title: 'SUV Insignia de Alto Rendimiento 2026',
      spec: 'Suspensión Neumática · Rines Deportivos · Cabina Ejecutiva',
    },
    {
      label: 'Coupé GT',
      title: 'Coupé Grand Tourer Blanco Perla 2026',
      spec: 'Aerodinámica Esculpida · Dinámica Deportiva · Acabados Artesanales',
    },
  ],
};

const FR: TranslationDict = {
  ...EN,
  dealsActiveIn: 'Offres actives en',
  searchPlaceholder: 'Rechercher sur Dodx (Amazon, AliExpress, HONOR, Alibaba)...',
  allOption: 'Tout',
  chromeExtension: 'Extension Chrome',
  addDodxFree: 'Ajouter Dodx – Gratuit',
  addChromeShort: 'Ajouter Chrome',
  affiliate: 'Promos',
  disclosure: 'Vérifiées',
  claimed: 'Activés',
  navAll: 'Tout',
  todaysDeals: 'Offres du Jour',
  productsNav: 'Produits',
  affiliateDisclosure: 'Guide des Offres Vérifiées',
  helloShopper: 'Bonjour, Client',
  topStores: 'Meilleures Boutiques',
  shopByDepartment: 'Parcourir par Rayon',
  allVerifiedDeals: 'Toutes les Offres',
  globalMarketplaces: 'Boutiques Mondiales',
  electronicsHome: 'Électronique & Maison',
  fashionApparel: 'Mode & Vêtements',
  dealsUnder25: 'Offres moins de 25 $',
  dealsUnder50: 'Offres moins de 50 $',
  helpInformation: 'Aide et Informations',
  dodxBrowserExtension: 'Extension Dodx',
  privacyPolicy: 'Confidentialité',
  languageTitle: 'Choisir la langue',
  liveFeedTitle: 'Galerie en Direct des Offres et Produits',
  liveFeedHint: "Survolez pour mettre en pause · Cliquez pour profiter de l'offre",
  pause: 'Pause',
  play: 'Lire',
  limitedTimeDeal: 'Offre limitée',
  autoDeal: 'Remise Directe',
  copyAndShop: 'Copier & Acheter',
  claimDeal: "Voir l'Offre",
  verifiedCouponsHeading: 'Coupons Vérifiés & Bons Plans Produits',
  copyCodeAndGo: 'Copier le Code et Aller sur le Site',
  activateDeal: "Profiter de l'Offre",
  saveAutoHeading: 'Économisez sur vos boutiques préférées avec Dodx',
  addDodxToChromeCta: "Ajouter Dodx à Chrome – C'est Gratuit",
  backToDodx: "Retour à l'accueil Dodx",
  dealUnlocked: 'Coupons & Offres Vérifiées',
  copyCodeAndActivate: "Copier le Code et Activer l'Offre",
  backToTop: 'Retour en haut',
  catAll: 'Tout',
  catMarketplaces: 'Boutiques',
  catFashion: 'Mode',
  catElectronics: 'Électronique & Maison',
  bfKicker: 'Coupons Vérifiés & Économies Directes · En Direct',
  bfTitle: 'Coupons & Offres Officielles — Amazon, AliExpress, Alibaba, HONOR, Huawei & Plus',
  bfSubtitle: 'Codes promo et remises vérifiés sur Amazon US, EAU, Égypte & Japon, AliExpress, Alibaba, HONOR UAE, Huawei AE, Lenovo India et Canon UAE.',
  bfPrimaryCta: 'Voir les Offres Amazon',
  bfSecondaryCta: 'Toutes les Offres',
  bfBannerBadge: 'SPÉCIAL BLACK FRIDAY',
  bfBannerTitle: 'Offres du Jour — Black Friday Amazon US',
  bfBannerSub: 'Sélection de remises directes Black Friday avec liens produits vérifiés et économies immédiates.',
  bfBannerCta: 'Voir Amazon US',
  bfGifCaption: 'Offres du Jour · Amazon US',
  vehiclesBannerKicker: 'Vitrine Automobile Dodx · Lancement Imminent',
  vehiclesBannerTitle: 'Bientôt Disponible : Les Derniers Véhicules',
  vehiclesBannerSub:
    'Berlines électriques de prestige, SUV haute performance et coupés Grand Tourisme — découvrez nos prochaines arrivées.',
  vehiclesBannerCta: 'Explorer Auto & Mobilité',
  vehiclesShowcase: [
    {
      label: 'Berline Électrique',
      title: 'Berline Électrique de Prestige 2026',
      spec: 'Transmission Intégrale · Toit Panoramique · Recharge Ultra-Rapide',
    },
    {
      label: 'SUV Prestige',
      title: 'SUV Statutaire Noir Obsidienne 2026',
      spec: 'Suspension Pneumatique · Jantes Alliage · Habitacle Exécutif',
    },
    {
      label: 'Coupé GT',
      title: 'Coupé Grand Tourisme Blanc Nacré 2026',
      spec: 'Ligne Aérodynamique · Châssis Sport Adaptatif · Finition Sur Mesure',
    },
  ],
};

const DE: TranslationDict = {
  ...EN,
  dealsActiveIn: 'Angebote aktiv in',
  searchPlaceholder: 'Dodx-Angebote suchen (Amazon, AliExpress, HONOR, Alibaba)...',
  allOption: 'Alle',
  chromeExtension: 'Chrome-Erweiterung',
  addDodxFree: 'Dodx hinzufügen – Gratis',
  addChromeShort: 'Für Chrome',
  affiliate: 'Geprüfte',
  disclosure: 'Rabatte',
  claimed: 'Aktiviert',
  navAll: 'Alle',
  todaysDeals: 'Heutige Angebote',
  productsNav: 'Produkte',
  affiliateDisclosure: 'Geprüfte Spar-Hinweise',
  helloShopper: 'Hallo, Käufer',
  topStores: 'Top-Shops',
  shopByDepartment: 'Nach Kategorie',
  allVerifiedDeals: 'Alle Geprüften Deals',
  globalMarketplaces: 'Globale Marktplätze',
  electronicsHome: 'Elektronik & Haushalt',
  fashionApparel: 'Mode & Kleidung',
  dealsUnder25: 'Deals unter 25 $',
  dealsUnder50: 'Deals unter 50 $',
  helpInformation: 'Hilfe & Infos',
  dodxBrowserExtension: 'Dodx Browser-Erweiterung',
  privacyPolicy: 'Datenschutz',
  languageTitle: 'Sprache wählen',
  liveFeedTitle: 'Live-Angebote- & Produktgalerie',
  liveFeedHint: 'Zum Pausieren Maus drüberfahren · Klicken für das Angebot',
  pause: 'Pause',
  play: 'Start',
  limitedTimeDeal: 'Zeitlich begrenztes Angebot',
  autoDeal: 'Direktrabatt',
  copyAndShop: 'Kopieren & Shoppen',
  claimDeal: 'Zum Angebot',
  verifiedCouponsHeading: 'Geprüfte Gutscheine & Top-Produktdeals',
  copyCodeAndGo: 'Code kopieren & zum Shop',
  activateDeal: 'Angebot sichern',
  saveAutoHeading: 'Spare bei globalen Top-Shops mit Dodx',
  addDodxToChromeCta: 'Dodx zu Chrome hinzufügen – Kostenlos',
  backToDodx: 'Zurück zu Dodx',
  dealUnlocked: 'Geprüfte Gutscheine & Angebote',
  copyCodeAndActivate: 'Code kopieren & Deal aktivieren',
  backToTop: 'Nach oben',
  catAll: 'Alle',
  catMarketplaces: 'Marktplätze',
  catFashion: 'Mode',
  catElectronics: 'Elektronik & Haushalt',
  bfKicker: 'Geprüfte Gutscheine & Direktrabatte · Weltweit Live',
  bfTitle: 'Gutscheine & Top-Deals — Amazon, AliExpress, Alibaba, HONOR, Huawei & Mehr',
  bfSubtitle: 'Aktive Gutscheine und Direktangebote für Amazon US, VAE, Ägypten & Japan, AliExpress, Alibaba, HONOR UAE, Huawei AE, Lenovo India und Canon UAE.',
  bfPrimaryCta: 'Amazon Deals ansehen',
  bfSecondaryCta: 'Alle Angebote ansehen',
  bfBannerBadge: 'BLACK FRIDAY SPOTLIGHT',
  bfBannerTitle: 'Heutige Top-Deals — Amazon US Black Friday',
  bfBannerSub: 'Ausgewählte Black-Friday-Rabatte mit direkten Produktlinks und sofortiger Ersparnis.',
  bfBannerCta: 'Amazon US Deals ansehen',
  bfGifCaption: 'Top-Deals · Amazon US',
  vehiclesBannerKicker: 'Dodx Automobil-Showroom · Demnächst Verfügbar',
  vehiclesBannerTitle: 'Demnächst: Die Neuesten Fahrzeuge',
  vehiclesBannerSub:
    'Elektrische Luxuslimousinen, souveräne Performance-SUVs und sportliche Grand-Tourer-Coupés — bald bei uns verfügbar.',
  vehiclesBannerCta: 'Bereich Autos entdecken',
  vehiclesShowcase: [
    {
      label: 'E-Limousine',
      title: 'Elektrische Flaggschiff-Limousine 2026',
      spec: 'Dual-Motor Allrad · Panorama-Glasdach · Schnellladetechnologie',
    },
    {
      label: 'Performance-SUV',
      title: 'Luxus-SUV in Obsidianschwarz 2026',
      spec: 'Adaptives Luftfahrwerk · Leichtmetallräder · Executive-Interieur',
    },
    {
      label: 'Grand Tourer',
      title: 'Perlweißes Grand-Tourer-Coupé 2026',
      spec: 'Aerodynamische Karosserie · Sportfahrwerk · Exklusive Ausstattung',
    },
  ],
};

const PT: TranslationDict = {
  ...EN,
  dealsActiveIn: 'Ofertas ativas em',
  searchPlaceholder: 'Buscar ofertas e marcas no Dodx (Amazon, AliExpress, HONOR, Alibaba)...',
  allOption: 'Todos',
  chromeExtension: 'Extensão Chrome',
  addDodxFree: 'Adicionar Dodx – Grátis',
  claimed: 'Usados',
  navAll: 'Todos',
  todaysDeals: 'Ofertas de Hoje',
  productsNav: 'Produtos',
  affiliateDisclosure: 'Guia de Ofertas Verificadas',
  topStores: 'Principais Lojas',
  shopByDepartment: 'Comprar por Categoria',
  privacyPolicy: 'Política de Privacidade',
  languageTitle: 'Escolher Idioma',
  liveFeedTitle: 'Vitrine Ao Vivo de Cupons e Produtos',
  pause: 'Pausar',
  play: 'Reproduzir',
  copyAndShop: 'Copiar e Comprar',
  claimDeal: 'Ativar Oferta',
  copyCodeAndGo: 'Copiar Código e Ir para a Loja',
  activateDeal: 'Ativar Oferta',
  backToTop: 'Voltar ao topo',
  bfBannerBadge: 'DESTAQUE BLACK FRIDAY',
  bfBannerTitle: 'Grandes Ofertas de Hoje — Black Friday Amazon US',
  bfBannerSub: 'Descontos diretos selecionados da Black Friday com links diretos e economia imediata.',
  bfBannerCta: 'Ver Amazon US',
  bfGifCaption: 'Grandes Ofertas · Amazon US',
  vehiclesBannerKicker: 'Vitrine Automotiva Dodx · Em Breve',
  vehiclesBannerTitle: 'Em Breve: Os Veículos Mais Recentes',
  vehiclesBannerSub:
    'Sedãs elétricos de luxo, SUVs de alta performance e coupés grand tourer — novidades automotivas chegando em breve.',
  vehiclesBannerCta: 'Explorar Carros e Automotivo',
  vehiclesShowcase: [
    {
      label: 'Sedã Elétrico',
      title: 'Sedã Elétrico de Luxo 2026',
      spec: 'Tração Integral · Teto Panorâmico · Recarga Ultrarrápida',
    },
    {
      label: 'SUV Premium',
      title: 'SUV Flagship Preto Obsidiana 2026',
      spec: 'Suspensão a Ar · Rodas de Liga Leve · Cabine Executiva',
    },
    {
      label: 'Grand Tourer',
      title: 'Coupé Grand Tourer Branco Pérola 2026',
      spec: 'Design Aerodinâmico · Dinâmica Esportiva · Acabamento Premium',
    },
  ],
};

const ZH: TranslationDict = {
  ...EN,
  dealsActiveIn: '优惠适用地区',
  searchPlaceholder: '搜索 Dodx 商品与官方品牌 (Amazon, AliExpress, HONOR, Alibaba)...',
  allOption: '全部',
  chromeExtension: 'Chrome 扩展',
  addDodxFree: '免费添加 Dodx',
  addChromeShort: '添加到 Chrome',
  affiliate: '官方',
  disclosure: '省钱指南',
  claimed: '已领取',
  navAll: '全部',
  todaysDeals: '今日优惠',
  productsNav: '全部商品',
  affiliateDisclosure: '已验证优惠指南',
  helloShopper: '您好，欢迎购物',
  topStores: '热门商店',
  shopByDepartment: '按分类浏览',
  allVerifiedDeals: '全部已验证优惠',
  globalMarketplaces: '全球商城',
  electronicsHome: '数码与家居',
  fashionApparel: '时尚服饰',
  dealsUnder25: '$25 以下优惠',
  dealsUnder50: '$50 以下优惠',
  helpInformation: '帮助与信息',
  dodxBrowserExtension: 'Dodx 浏览器扩展',
  privacyPolicy: '隐私政策',
  languageTitle: '选择语言',
  liveFeedTitle: '今日实时优惠券与商品精选',
  liveFeedHint: '悬停暂停 · 点击直达折扣优惠',
  pause: '暂停',
  play: '播放',
  limitedTimeDeal: '限时特惠',
  autoDeal: '直降优惠',
  copyAndShop: '复制并购买',
  claimDeal: '查看优惠',
  verifiedCouponsHeading: '已验证优惠券与热门商品',
  copyCodeAndGo: '复制优惠码并前往商店',
  activateDeal: '领取限时优惠',
  saveAutoHeading: '使用 Dodx 获取全球商城直降优惠',
  addDodxToChromeCta: '免费添加 Dodx 到 Chrome',
  backToDodx: '返回 Dodx 首页',
  dealUnlocked: '官方商店 / 已验证优惠券',
  copyCodeAndActivate: '复制优惠码并激活优惠',
  backToTop: '返回顶部',
  catAll: '全部',
  catMarketplaces: '综合商城',
  catFashion: '时尚',
  catElectronics: '数码与家居',
  bfKicker: '已验证优惠券与直接立减 · 全球同步',
  bfTitle: '精选优惠与折扣券 — Amazon、AliExpress、Alibaba、HONOR、Huawei 等',
  bfSubtitle: '立即获取 Amazon 美国/阿联酋/埃及/日本、AliExpress、Alibaba、HONOR UAE、Huawei AE、Lenovo India 和 Canon UAE 最新优惠券。',
  bfPrimaryCta: '浏览 Amazon 优惠',
  bfSecondaryCta: '浏览全部精选优惠',
  bfBannerBadge: '黑色星期五精选特辑',
  bfBannerTitle: '今日超值特惠 — Amazon 美国黑五专场',
  bfBannerSub: '精选黑五直降爆款商品，点击直达官方购买页面立享折扣。',
  bfBannerCta: '选购 Amazon 美国黑五',
  bfGifCaption: '今日超值特惠 · Amazon 美国',
  vehiclesBannerKicker: 'Dodx 汽车展厅 · 即将上线',
  vehiclesBannerTitle: '即将推出：最新车型精选',
  vehiclesBannerSub:
    '旗舰级纯电豪华轿车、高性能豪华 SUV 及优雅双门 GT 跑车 — 更多汽车新品与专属优惠即将发布。',
  vehiclesBannerCta: '探索汽车专区',
  vehiclesShowcase: [
    {
      label: '纯电轿车',
      title: '2026 旗舰纯电豪华轿车',
      spec: '双电机四驱 · 全景天幕 · 超快充平台',
    },
    {
      label: '豪华 SUV',
      title: '2026 曜石黑高性能豪华 SUV',
      spec: '空气悬架系统 · 精工轮毂 · 行政级座舱',
    },
    {
      label: 'GT 跑车',
      title: '2026 珍珠白双门 GT 跑车',
      spec: '流线空气动力学 · 自适应运动底盘 · 匠心内饰',
    },
  ],
};

const JA: TranslationDict = {
  ...EN,
  dealsActiveIn: '対象地域',
  searchPlaceholder: 'Dodx で商品・ブランドを検索 (Amazon, AliExpress, HONOR, Alibaba)...',
  allOption: 'すべて',
  chromeExtension: 'Chrome拡張機能',
  addDodxFree: 'Dodxを追加 – 無料',
  claimed: '獲得済み',
  navAll: 'すべて',
  todaysDeals: '本日のセール',
  productsNav: '製品一覧',
  affiliateDisclosure: 'クーポン＆お得情報ガイド',
  topStores: '人気ストア',
  shopByDepartment: 'カテゴリーから探す',
  privacyPolicy: 'プライバシーポリシー',
  languageTitle: '言語を選択',
  liveFeedTitle: '本日のライブクーポン＆商品フィード',
  pause: '一時停止',
  play: '再生',
  copyAndShop: 'コピーして購入',
  claimDeal: '割引を有効化',
  copyCodeAndGo: 'コードをコピーしてストアへ',
  activateDeal: 'セールを有効化',
  backToTop: 'トップへ戻る',
  bfBannerBadge: 'ブラックフライデー特集',
  bfBannerTitle: '本日の特選セール — Amazon US ブラックフライデー',
  bfBannerSub: '厳選されたブラックフライデー直結セールの特別価格を今すぐチェック。',
  bfBannerCta: 'Amazon US セールを見る',
  bfGifCaption: '本日のビッグセール · Amazon US',
  vehiclesBannerKicker: 'Dodx オートモーティブ · まもなく登場',
  vehiclesBannerTitle: '近日公開：最新モデル車両',
  vehiclesBannerSub:
    '高級電動セダン、パフォーマンス SUV、洗練されたグランドツアラークーペなど最新ラインナップがまもなく登場。',
  vehiclesBannerCta: '自動車コーナーを見る',
  vehiclesShowcase: [
    {
      label: '電動セダン',
      title: '2026 フラッグシップ電動セダン',
      spec: 'デュアルモーター AWD · パノラマルーフ · 超急速充電',
    },
    {
      label: '大型 SUV',
      title: '2026 ブラック ラグジュアリー SUV',
      spec: 'エアサスペンション · アルミホイール · エグゼクティブ空間',
    },
    {
      label: 'GT クーペ',
      title: '2026 パールホワイト GT クーペ',
      spec: '空力ボディデザイン · スポーツダイナミクス · 上質な内装',
    },
  ],
};

const KO: TranslationDict = {
  ...EN,
  dealsActiveIn: '할인 지역',
  searchPlaceholder: 'Dodx 상품 및 브랜드 검색 (Amazon, AliExpress, HONOR, Alibaba)...',
  allOption: '전체',
  chromeExtension: 'Chrome 확장 프로그램',
  addDodxFree: 'Dodx 추가 – 무료',
  claimed: '적용됨',
  navAll: '전체',
  todaysDeals: '오늘의 특가',
  productsNav: '제품',
  affiliateDisclosure: '검증된 할인 가이드',
  topStores: '인기 스토어',
  shopByDepartment: '카테고리별 보기',
  privacyPolicy: '개인정보처리방침',
  languageTitle: '언어 선택',
  liveFeedTitle: '실시간 쿠폰 및 상품 특가 피드',
  pause: '일시정지',
  play: '재생',
  copyAndShop: '복사 후 쇼핑',
  claimDeal: '할인 받기',
  copyCodeAndGo: '코드 복사 및 스토어 이동',
  activateDeal: '할인 활성화',
  backToTop: '맨 위로',
  bfBannerBadge: '블랙 프라이데이 스포트라이트',
  bfBannerTitle: '오늘의 빅 세일 — Amazon US 블랙 프라이데이',
  bfBannerSub: '엄선된 블랙 프라이데이 직접 할인 상품과 즉시 할인을 만나보세요.',
  bfBannerCta: 'Amazon US 특가 보기',
  bfGifCaption: '오늘의 빅 세일 · Amazon US',
  vehiclesBannerKicker: 'Dodx 오토모티브 쇼케이스 · 출시 예정',
  vehiclesBannerTitle: '출시 예정: 최신 차량 라인업',
  vehiclesBannerSub:
    '프리미엄 전기 세단, 퍼포먼스 SUV, 세련된 그랜드 투어러 쿠페까지 곧 공개될 최신 차량을 만나보세요.',
  vehiclesBannerCta: '자동차 카테고리 보기',
  vehiclesShowcase: [
    {
      label: '전기 세단',
      title: '2026 플래그십 전기 럭셔리 세단',
      spec: '듀얼 모터 AWD · 파노라마 글래스 루프 · 초고속 충전',
    },
    {
      label: '플래그십 SUV',
      title: '2026 옵시디언 퍼포먼스 SUV',
      spec: '에어 서스펜션 · 알로이 휠 · 프리미엄 실내',
    },
    {
      label: 'GT 쿠페',
      title: '2026 펄 화이트 그랜드 투어러 쿠페',
      spec: '에어로다이내믹 바디 · 어댑티브 스포츠 주행 · 수공예 트림',
    },
  ],
};

const HI: TranslationDict = {
  ...EN,
  dealsActiveIn: 'डील क्षेत्र',
  searchPlaceholder: 'Dodx डील्स खोजें (Amazon, AliExpress, HONOR, Alibaba)...',
  allOption: 'सभी',
  chromeExtension: 'Chrome एक्सटेंशन',
  addDodxFree: 'Dodx जोड़ें – मुफ़्त',
  claimed: 'लागू',
  navAll: 'सभी',
  todaysDeals: 'आज की डील्स',
  productsNav: 'उत्पाद',
  affiliateDisclosure: 'सत्यापित बचत गाइड',
  topStores: 'प्रमुख स्टोर्स',
  shopByDepartment: 'श्रेणी के अनुसार',
  privacyPolicy: 'गोपनीयता नीति',
  languageTitle: 'भाषा चुनें',
  liveFeedTitle: 'लाइव कूपन और प्रोडक्ट गैलरी',
  pause: 'रोकें',
  play: 'चलाएं',
  copyAndShop: 'कॉपी करें और खरीदें',
  claimDeal: 'डील पाएं',
  copyCodeAndGo: 'कोड कॉपी करें और स्टोर पर जाएं',
  activateDeal: 'डील सक्रिय करें',
  backToTop: 'ऊपर जाएं',
  bfBannerBadge: 'ब्लैक फ़्राइडे स्पॉटलाइट',
  bfBannerTitle: 'आज की बड़ी डील्स — Amazon US ब्लैक फ़्राइडे',
  bfBannerSub: 'डायरेक्ट उत्पाद लिंक और तुरंत बचत के साथ चुनिंदा ब्लैक फ़्राइडे छूट।',
  bfBannerCta: 'Amazon US डील्स देखें',
  bfGifCaption: 'आज की बड़ी डील्स · Amazon US',
  vehiclesBannerKicker: 'Dodx ऑटोमोटिव शोकेस · जल्द आ रहा है',
  vehiclesBannerTitle: 'जल्द आ रही हैं: नवीनतम गाड़ियाँ',
  vehiclesBannerSub:
    'लग्ज़री इलेक्ट्रिक सेडान, दमदार परफॉर्मेंस SUV और स्पोर्ट्स ग्रैंड टूरर कूपे — नए मॉडल जल्द उपलब्ध होंगे।',
  vehiclesBannerCta: 'ऑटोमोटिव सेक्शन देखें',
  vehiclesShowcase: [
    {
      label: 'इलेक्ट्रिक सेडान',
      title: '2026 फ्लैगशिप इलेक्ट्रिक सेडान',
      spec: 'डुअल-मोटर AWD · पैनोरमिक रूफ · फास्ट चार्जिंग',
    },
    {
      label: 'लग्ज़री SUV',
      title: '2026 परफॉर्मेंस ब्लैक SUV',
      spec: 'एयर सस्पेंशन · अलॉय व्हील्स · प्रीमियम केबिन',
    },
    {
      label: 'स्पोर्ट्स कूपे',
      title: '2026 पर्ल व्हाइट ग्रैंड टूरर कूपे',
      spec: 'एयरोडायनामिक डिज़ाइन · स्पोर्ट डायनामिक्स · लग्ज़री इंटीरियर',
    },
  ],
};

const TR: TranslationDict = {
  ...EN,
  dealsActiveIn: 'Fırsat bölgesi',
  searchPlaceholder: 'Dodx fırsatlarını ara (Amazon, AliExpress, HONOR, Alibaba)...',
  allOption: 'Tümü',
  chromeExtension: 'Chrome Uzantısı',
  addDodxFree: 'Dodx Ekle – Ücretsiz',
  claimed: 'Alındı',
  navAll: 'Tümü',
  todaysDeals: 'Günün Fırsatları',
  productsNav: 'Ürünler',
  affiliateDisclosure: 'Doğrulanmış İndirim Rehberi',
  topStores: 'Popüler Mağazalar',
  shopByDepartment: 'Kategoriye Göre',
  privacyPolicy: 'Gizlilik Politikası',
  languageTitle: 'Dil Seçin',
  liveFeedTitle: 'Canlı Kupon ve Ürün Vitrini',
  pause: 'Duraklat',
  play: 'Oynat',
  copyAndShop: 'Kopyala ve Alışveriş Yap',
  claimDeal: 'Fırsatı Al',
  copyCodeAndGo: 'Kodu Kopyala ve Mağazaya Git',
  activateDeal: 'Fırsatı Etkinleştir',
  backToTop: 'Başa dön',
  bfBannerBadge: 'KARA CUMA ÖZEL',
  bfBannerTitle: 'Günün Büyük Fırsatları — Amazon US Kara Cuma',
  bfBannerSub: 'Doğrudan ürün bağlantılarıyla seçilmiş Kara Cuma indirimleri ve anında tasarruf.',
  bfBannerCta: 'Amazon US Fırsatlarını Gör',
  bfGifCaption: 'Günün Büyük Fırsatları · Amazon US',
  vehiclesBannerKicker: 'Dodx Otomotiv Vitrini · Çok Yakında',
  vehiclesBannerTitle: 'Çok Yakında: En Yeni Araçlar',
  vehiclesBannerSub:
    'Lüks elektrikli sedanlar, yüksek performanslı SUV modeller ve zarif grand tourer coupeler çok yakında sizlerle.',
  vehiclesBannerCta: 'Otomotiv Bölümünü Keşfet',
  vehiclesShowcase: [
    {
      label: 'Elektrikli Sedan',
      title: '2026 Amiral Gemisi Elektrikli Sedan',
      spec: 'Çift Motor AWD · Panoramik Cam Tavan · Hızlı Şarj',
    },
    {
      label: 'Lüks SUV',
      title: '2026 Obsidyen Siyah Performans SUV',
      spec: 'Havalı Süspansiyon · Alaşım Jantlar · Geniş İç Hacim',
    },
    {
      label: 'Grand Tourer',
      title: '2026 İnci Beyazı Grand Tourer Coupe',
      spec: 'Aerodinamik Tasarım · Sportif Sürüş · Özel İç Mekan',
    },
  ],
};

const RU: TranslationDict = {
  ...EN,
  dealsActiveIn: 'Скидки для региона',
  searchPlaceholder: 'Поиск товаров и брендов Dodx (Amazon, AliExpress, HONOR, Alibaba)...',
  allOption: 'Все',
  chromeExtension: 'Расширение Chrome',
  addDodxFree: 'Добавить Dodx – Бесплатно',
  claimed: 'Выбрано',
  navAll: 'Все',
  todaysDeals: 'Предложения дня',
  productsNav: 'Товары',
  affiliateDisclosure: 'Гид по скидкам и купонам',
  topStores: 'Популярные магазины',
  shopByDepartment: 'Категории',
  privacyPolicy: 'Политика конфиденциальности',
  languageTitle: 'Выберите язык',
  liveFeedTitle: 'Живая лента купонов и товаров',
  pause: 'Пауза',
  play: 'Старт',
  copyAndShop: 'Копировать и купить',
  claimDeal: 'Активировать',
  copyCodeAndGo: 'Копировать код и перейти',
  activateDeal: 'Активировать скидку',
  backToTop: 'Наверх',
  bfBannerBadge: 'ХИТЫ ЧЁРНОЙ ПЯТНИЦЫ',
  bfBannerTitle: 'Главные скидки дня — Amazon US Black Friday',
  bfBannerSub: 'Отобранные скидки Чёрной пятницы с прямыми ссылками на товары.',
  bfBannerCta: 'Смотреть скидки Amazon US',
  bfGifCaption: 'Главные скидки · Amazon US',
  vehiclesBannerKicker: 'Автосалон Dodx · Скоро в продаже',
  vehiclesBannerTitle: 'Скоро: Новейшие Автомобили',
  vehiclesBannerSub:
    'Флагманские электроседаны, мощные премиальные внедорожники и спортивные купе Grand Tourer — новинки уже скоро.',
  vehiclesBannerCta: 'Перейти в раздел Авто',
  vehiclesShowcase: [
    {
      label: 'Электроседан',
      title: 'Флагманский Электроседан 2026',
      spec: 'Полный привод · Панорамная крыша · Быстрая зарядка',
    },
    {
      label: 'Премиум SUV',
      title: 'Флагманский Внедорожник SUV 2026',
      spec: 'Пневмоподвеска · Литые диски · Премиальный салон',
    },
    {
      label: 'Купе GT',
      title: 'Спортивное Купе Grand Tourer 2026',
      spec: 'Аэродинамичный кузов · Адаптивное шасси · Отделка люкс',
    },
  ],
};

const IT: TranslationDict = {
  ...EN,
  dealsActiveIn: 'Offerte attive in',
  searchPlaceholder: 'Cerca offerte e brand Dodx (Amazon, AliExpress, HONOR, Alibaba)...',
  allOption: 'Tutte',
  chromeExtension: 'Estensione Chrome',
  addDodxFree: 'Aggiungi Dodx – Gratis',
  claimed: 'Attivati',
  navAll: 'Tutte',
  todaysDeals: 'Offerte di Oggi',
  productsNav: 'Prodotti',
  affiliateDisclosure: 'Guida alle Offerte Verificate',
  topStores: 'Negozi Principali',
  shopByDepartment: 'Categorie',
  privacyPolicy: 'Privacy Policy',
  languageTitle: 'Scegli Lingua',
  liveFeedTitle: 'Galleria Live di Coupon e Prodotti',
  pause: 'Pausa',
  play: 'Avvia',
  copyAndShop: 'Copia e Acquista',
  claimDeal: 'Attiva Offerta',
  copyCodeAndGo: 'Copia Codice e Vai al Negozio',
  activateDeal: 'Attiva Offerta',
  backToTop: 'Torna su',
  bfBannerBadge: 'SPECIALE BLACK FRIDAY',
  bfBannerTitle: 'Grandi Offerte di Oggi — Black Friday Amazon US',
  bfBannerSub: 'Sconti diretti selezionati per il Black Friday con link diretti ai prodotti.',
  bfBannerCta: 'Vai su Amazon US',
  bfGifCaption: 'Grandi Offerte · Amazon US',
  vehiclesBannerKicker: 'Vetrina Automotive Dodx · In Arrivo',
  vehiclesBannerTitle: 'In Arrivo: I Veicoli Più Recenti',
  vehiclesBannerSub:
    'Berline elettriche di lusso, SUV ad alte prestazioni e coupé Grand Tourer — scopri le novità automotive in arrivo.',
  vehiclesBannerCta: 'Esplora Auto e Motori',
  vehiclesShowcase: [
    {
      label: 'Berlina Elettrica',
      title: 'Berlina Elettrica di Lusso 2026',
      spec: 'Trazione Integrale · Tetto Panoramico · Ricarica Rapida',
    },
    {
      label: 'SUV Prestige',
      title: 'SUV Flagship Nero Ossidiana 2026',
      spec: 'Sospensioni Pneumatiche · Cerchi in Lega · Abitacolo Executive',
    },
    {
      label: 'Coupé GT',
      title: 'Coupé Grand Tourer Bianco Perla 2026',
      spec: 'Linee Aerodinamiche · Dinamica Sportiva · Interni Artigianali',
    },
  ],
};

const ID: TranslationDict = {
  ...EN,
  dealsActiveIn: 'Promo aktif di',
  searchPlaceholder: 'Cari promo & merek Dodx (Amazon, AliExpress, HONOR, Alibaba)...',
  allOption: 'Semua',
  chromeExtension: 'Ekstensi Chrome',
  addDodxFree: 'Tambah Dodx – Gratis',
  claimed: 'Diklaim',
  navAll: 'Semua',
  todaysDeals: 'Promo Hari Ini',
  productsNav: 'Produk',
  affiliateDisclosure: 'Panduan Promo Terverifikasi',
  topStores: 'Toko Populer',
  shopByDepartment: 'Belanja per Kategori',
  privacyPolicy: 'Kebijakan Privasi',
  languageTitle: 'Pilih Bahasa',
  liveFeedTitle: 'Galeri Kupon & Produk Langsung',
  pause: 'Jeda',
  play: 'Putar',
  copyAndShop: 'Salin & Belanja',
  claimDeal: 'Klaim Promo',
  copyCodeAndGo: 'Salin Kode & Ke Toko',
  activateDeal: 'Aktifkan Promo',
  backToTop: 'Kembali ke atas',
  bfBannerBadge: 'SOROTAN BLACK FRIDAY',
  bfBannerTitle: 'Promo Besar Hari Ini — Black Friday Amazon US',
  bfBannerSub: 'Diskon langsung Black Friday pilihan dengan tautan produk resmi.',
  bfBannerCta: 'Lihat Promo Amazon US',
  bfGifCaption: 'Promo Besar · Amazon US',
  vehiclesBannerKicker: 'Galeri Otomotif Dodx · Segera Hadir',
  vehiclesBannerTitle: 'Segera Hadir: Kendaraan Terbaru',
  vehiclesBannerSub:
    'Sedan listrik mewah, SUV bertenaga tinggi, dan coupe grand tourer modern — nantikan kehadiran koleksi otomotif terbaru.',
  vehiclesBannerCta: 'Jelajahi Kategori Mobil',
  vehiclesShowcase: [
    {
      label: 'Sedan Listrik',
      title: 'Sedan Listrik Mewah 2026',
      spec: 'Penggerak AWD · Atap Panoramik · Pengisian Daya Cepat',
    },
    {
      label: 'SUV Premium',
      title: 'SUV Flagship Hitam Obsidian 2026',
      spec: 'Suspensi Udara · Velg Alloy · Kabin Eksekutif',
    },
    {
      label: 'Coupe GT',
      title: 'Coupe Grand Tourer Putih Mutiara 2026',
      spec: 'Desain Aerodinamis · Performa Sport · Interior Mewah',
    },
  ],
};

const NL: TranslationDict = {
  ...EN,
  dealsActiveIn: 'Deals actief in',
  searchPlaceholder: 'Zoek Dodx aanbiedingen (Amazon, AliExpress, HONOR, Alibaba)...',
  allOption: 'Alle',
  chromeExtension: 'Chrome-extensie',
  addDodxFree: 'Dodx toevoegen – Gratis',
  claimed: 'Geclaimd',
  navAll: 'Alle',
  todaysDeals: 'Deals van vandaag',
  productsNav: 'Producten',
  affiliateDisclosure: 'Gecontroleerde Besparingen',
  topStores: 'Topwinkels',
  shopByDepartment: 'Categorieën',
  privacyPolicy: 'Privacybeleid',
  languageTitle: 'Kies taal',
  liveFeedTitle: 'Live Kortingscodes & Productgalerij',
  pause: 'Pauzeren',
  play: 'Afspelen',
  copyAndShop: 'Kopieer & Shop',
  claimDeal: 'Claim Deal',
  copyCodeAndGo: 'Kopieer code & ga naar winkel',
  activateDeal: 'Deal activeren',
  backToTop: 'Terug naar boven',
  bfBannerBadge: 'BLACK FRIDAY SPOTLIGHT',
  bfBannerTitle: 'Topdeals van Vandaag — Amazon US Black Friday',
  bfBannerSub: 'Geselecteerde Black Friday-kortingen met directe productlinks en direct voordeel.',
  bfBannerCta: 'Bekijk Amazon US Deals',
  bfGifCaption: 'Topdeals · Amazon US',
  vehiclesBannerKicker: 'Dodx Automotive Showcase · Binnenkort Verwacht',
  vehiclesBannerTitle: 'Binnenkort: De Nieuwste Voertuigen',
  vehiclesBannerSub:
    'Luxe elektrische sedans, krachtige performance-SUV’s en stijlvolle grand tourer coupés — binnenkort beschikbaar.',
  vehiclesBannerCta: 'Bekijk Auto & Automotive',
  vehiclesShowcase: [
    {
      label: 'Elektrische Sedan',
      title: 'Luxe Elektrische Sedan 2026',
      spec: 'Dual-Motor AWD · Panoramadak · Ultrasnel Laden',
    },
    {
      label: 'Performance SUV',
      title: 'Obsidiaanzwarte Flagship SUV 2026',
      spec: 'Luchtvering · Lichtmetalen Velgen · Ruim Interieur',
    },
    {
      label: 'Grand Tourer',
      title: 'Parelwitte Grand Tourer Coupé 2026',
      spec: 'Aerodynamisch Ontwerp · Sportonderstel · Luxe Afwerking',
    },
  ],
};

const PL: TranslationDict = {
  ...EN,
  dealsActiveIn: 'Oferty w',
  searchPlaceholder: 'Szukaj ofert i marek Dodx (Amazon, AliExpress, HONOR, Alibaba)...',
  allOption: 'Wszystkie',
  chromeExtension: 'Rozszerzenie Chrome',
  addDodxFree: 'Dodaj Dodx – Za darmo',
  claimed: 'Użyte',
  navAll: 'Wszystkie',
  todaysDeals: 'Okazje dnia',
  productsNav: 'Produkty',
  affiliateDisclosure: 'Przewodnik Oszczędności',
  topStores: 'Najlepsze sklepy',
  shopByDepartment: 'Kategorie',
  privacyPolicy: 'Polityka prywatności',
  languageTitle: 'Wybierz język',
  liveFeedTitle: 'Galeria Kuponów i Produktów na Żywo',
  pause: 'Pauza',
  play: 'Start',
  copyAndShop: 'Kopiuj i kupuj',
  claimDeal: 'Odbierz okazję',
  copyCodeAndGo: 'Kopiuj kod i przejdź do sklepu',
  activateDeal: 'Aktywuj okazję',
  backToTop: 'Powrót na górę',
  bfBannerBadge: 'HIT BLACK FRIDAY',
  bfBannerTitle: 'Wielkie Okazje Dnia — Amazon US Black Friday',
  bfBannerSub: 'Wybrane promocje Black Friday z bezpośrednimi linkami do produktów.',
  bfBannerCta: 'Zobacz okazje Amazon US',
  bfGifCaption: 'Wielkie Okazje · Amazon US',
  vehiclesBannerKicker: 'Salon Motoryzacyjny Dodx · Wkrótce Dostępne',
  vehiclesBannerTitle: 'Wkrótce: Najnowsze Pojazdy',
  vehiclesBannerSub:
    'Luksusowe sedany elektryczne, wydajne SUV-y i sportowe coupé Grand Tourer — najnowsze premiery już wkrótce.',
  vehiclesBannerCta: 'Przeglądaj Dział Samochody',
  vehiclesShowcase: [
    {
      label: 'Sedan Elektryczny',
      title: 'Flagowy Sedan Elektryczny 2026',
      spec: 'Napęd AWD · Dach Panoramiczny · Szybkie Ładowanie',
    },
    {
      label: 'Luksusowy SUV',
      title: 'Czarny SUV Flagship Performance 2026',
      spec: 'Zawieszenie Pneumatyczne · Alufelgi · Przestronna Kabina',
    },
    {
      label: 'Grand Tourer',
      title: 'Perłowe Coupé Grand Tourer 2026',
      spec: 'Aerodynamiczna Sylwetka · Sportowa Dynamika · Luksusowe Wnętrze',
    },
  ],
};

const DICTIONARIES: Record<LanguageCode, TranslationDict> = {
  en: EN,
  ar: AR,
  es: ES,
  fr: FR,
  de: DE,
  pt: PT,
  zh: ZH,
  ja: JA,
  ko: KO,
  hi: HI,
  tr: TR,
  ru: RU,
  it: IT,
  id: ID,
  nl: NL,
  pl: PL,
};

export function getTranslation(code: LanguageCode): TranslationDict {
  return DICTIONARIES[code] || EN;
}

export function getLanguageMeta(code: LanguageCode): LanguageMeta {
  return SUPPORTED_LANGUAGES.find((l) => l.code === code) || SUPPORTED_LANGUAGES[0];
}

export function detectInitialLanguage(): LanguageCode {
  try {
    const saved = localStorage.getItem('dodx_lang') as LanguageCode | null;
    if (saved && DICTIONARIES[saved]) return saved;
  } catch {
    // Ignore storage access errors
  }

  if (typeof navigator !== 'undefined' && navigator.language) {
    const base = navigator.language.split('-')[0].toLowerCase() as LanguageCode;
    if (DICTIONARIES[base]) return base;
  }

  return 'en';
}
