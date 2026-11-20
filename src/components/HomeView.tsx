import React, { useMemo, useRef, useState } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Chrome,
  Copy,
  ExternalLink,
  Pause,
  Play,
  Search,
  Tag,
} from 'lucide-react';
import { Deal, Store } from '../types/coupons';
import { LanguageCode, TranslationDict } from '../i18n/translations';
import {
  PRODUCT_DEPARTMENTS,
  ProductBrand,
  ProductDepartment,
  ProductSubcategory,
} from '../data/productCatalog';
import {
  matchesMultilingualQuery,
  scoreMultilingualMatch,
} from '../utils/multilingualSearch';
import { ShareButton } from './ShareButton';

interface HomeViewProps {
  stores: Store[];
  lang: LanguageCode;
  searchQuery: string;
  searchStoreFilter: string;
  activeCategory: string;
  t: TranslationDict;
  onSelectCategory: (category: string) => void;
  onSelectStore: (storeId: string) => void;
  onNavigateProducts: (deptId?: string) => void;
  onActivateDeal: (deal: Deal, store: Store) => void;
  onOpenInstallModal: () => void;
  onNavigateLegal: (route: 'disclosure' | 'privacy') => void;
  onClearSearch: () => void;
}

const DEAL_THUMBNAILS: Record<string, string> = {
  'amz-us-bf-week': '/assets/aistudio/image_87e4ff49.png',
  'amz-1': '/assets/images/promo_blackfriday_gifts_1794811010711.jpg',
  'amz-2': '/assets/images/promo_electronics_tech_1794811009540.jpg',
  'amz-3': '/assets/images/deal_home_organize_1794811011993.jpg',
  'amz-4': '/assets/images/hero_smart_shopping_1794810594006.jpg',
  'amz-5': '/assets/banners/amazon-laptop-screen-extender.jpg',
  'amz-6': '/assets/banners/amazon-macbook-pro-2026.jpg',
  'amz-7': '/assets/banners/amazon-iphone-17-pro-max.jpg',
  'amz-8': '/assets/banners/amazon-tagry-headphones.jpg',
  'amz-9': '/assets/banners/amazon-bf-nothing-phone-3.jpg',
  'amz-bf-phones': '/assets/banners/amazon-bf-moto-g-stylus-2025.jpg',
  'amz-bf-moto-stylus-25': '/assets/banners/amazon-bf-moto-g-stylus-2025.jpg',
  'amz-bf-moto-play': '/assets/banners/amazon-bf-moto-g-play.jpg',
  'amz-bf-nuu-b40': '/assets/banners/amazon-bf-nuu-b40-5g.jpg',
  'amz-bf-moto-stylus-26': '/assets/banners/amazon-bf-moto-g-stylus-2026.jpg',
  'amz-bf-razr-plus': '/assets/banners/amazon-bf-moto-razr-plus-2024.jpg',
  'amz-bf-razr-ultra-26': '/assets/banners/amazon-bf-moto-razr-ultra-2026.jpg',
  'amz-bf-samsung': '/assets/banners/amazon-bf-samsung-xcover7-pro.jpg',
  'amz-bf-samsung-xcover7': '/assets/banners/amazon-bf-samsung-xcover7-pro.jpg',
  'amz-bf-samsung-zfold8': '/assets/banners/amazon-bf-samsung-z-fold8.jpg',
  'amz-bf-samsung-s26fe': '/assets/banners/amazon-bf-samsung-s26-fe.jpg',
  'amz-bf-samsung-a37': '/assets/banners/amazon-bf-samsung-a37.jpg',
  'amz-bf-pixel-11-pro': '/assets/banners/amazon-bf-google-pixel-11-pro.jpg',
  'amz-bf-fairphone-6p': '/assets/banners/amazon-bf-fairphone-6-plus.jpg',
  'amz-bf-tcl-nxtpaper': '/assets/banners/amazon-bf-tcl-nxtpaper-70-pro.jpg',
  'amz-bf-blackview-w10': '/assets/banners/amazon-bf-blackview-wave-10.jpg',
  'amz-bf-ulefone-x16p': '/assets/banners/amazon-bf-ulefone-armor-x16-pro.jpg',
  'amz-bf-nothing-4ap': '/assets/banners/amazon-bf-nothing-phone-4a-pro.jpg',
  'amz-bf-laptops': '/assets/banners/amazon-bf-lenovo-chromebook-2in1.jpg',
  'amz-bf-lenovo-chromebook': '/assets/banners/amazon-bf-lenovo-chromebook-2in1.jpg',
  'amz-bf-acer-spin-314': '/assets/banners/amazon-bf-acer-chromebook-spin-314.jpg',
  'amz-bf-acer-aspire-14': '/assets/banners/amazon-bf-acer-aspire-lite-14-ai.jpg',
  'amz-bf-book4-edge': '/assets/banners/amazon-bf-samsung-galaxy-book4-edge.jpg',
  'amz-bf-book5-pro-360': '/assets/banners/amazon-bf-samsung-galaxy-book5-pro-360.jpg',
  'amz-bf-hp-omnibook-2tb': '/assets/banners/amazon-bf-hp-omnibook-x-flip-16-2tb.jpg',
  'amz-bf-hp-omnibook-14': '/assets/banners/amazon-bf-hp-omnibook-x-flip-14-oled.jpg',
  'amz-bf-hp-omnibook-ai9': '/assets/banners/amazon-bf-hp-omnibook-x-flip-16-ai9.jpg',
  'amz-bf-yoga-7i-14': '/assets/banners/amazon-bf-lenovo-yoga-7i-14-oled.jpg',
  'amz-bf-yoga-7i-16': '/assets/banners/amazon-bf-lenovo-yoga-7i-16-ultra5.jpg',
  'amz-bf-yoga-7a-16': '/assets/banners/amazon-bf-lenovo-yoga-7a-16-oled.jpg',
  'amz-bf-nimo-173': '/assets/banners/amazon-bf-nimo-173-ai-copilot.jpg',
  'amz-ae-store': '/assets/images/hero_smart_shopping_1794810594006.jpg',
  'amz-ae-1': '/assets/banners/amazon-ae-iphone-duo.jpg',
  'amz-ae-2': '/assets/banners/amazon-ae-galaxy-s26-ultra.jpg',
  'amz-eg-store': '/assets/images/promo_blackfriday_gifts_1794811010711.jpg',
  'amz-eg-swype': '/assets/images/promo_blackfriday_gifts_1794811010711.jpg',
  'amz-eg-abk': '/assets/images/hero_smart_shopping_1794810594006.jpg',
  'amz-eg-qnb': '/assets/images/promo_electronics_tech_1794811009540.jpg',
  'amz-eg-3': '/assets/banners/amazon-eg-sokany-sk100a.jpg',
  'amz-eg-4': '/assets/banners/amazon-eg-iphone-17e.jpg',
  'amz-eg-5': '/assets/banners/amazon-eg-iphone-duo-sky.jpg',
  'amz-eg-wf-mobiles': '/assets/banners/amazon-eg-samsung-a37.jpg',
  'amz-eg-samsung-a37': '/assets/banners/amazon-eg-samsung-a37.jpg',
  'amz-eg-infinix-smart20': '/assets/banners/amazon-eg-infinix-smart-20.jpg',
  'amz-eg-redmi-17': '/assets/banners/amazon-eg-redmi-17.jpg',
  'amz-eg-honor-x9d': '/assets/banners/amazon-eg-honor-x9d.jpg',
  'amz-eg-redmi-17-5g': '/assets/banners/amazon-eg-redmi-17-5g.jpg',
  'amz-eg-samsung-a08': '/assets/banners/amazon-eg-samsung-a08.jpg',
  'amz-eg-samsung-a57': '/assets/banners/amazon-eg-samsung-a57.jpg',
  'amz-eg-oppo-reno16f': '/assets/banners/amazon-eg-oppo-reno-16f.jpg',
  'amz-eg-samsung-a17': '/assets/banners/amazon-eg-samsung-a17.jpg',
  'amz-eg-realme-c85pro': '/assets/banners/amazon-eg-realme-c85-pro.jpg',
  'amz-eg-oppo-a6': '/assets/banners/amazon-eg-oppo-a6.jpg',
  'amz-eg-samsung-s25u': '/assets/banners/amazon-eg-samsung-s25-ultra.jpg',
  'amz-eg-xiaomi-17t': '/assets/banners/amazon-eg-xiaomi-17t.jpg',
  'amz-eg-honor-600lite': '/assets/banners/amazon-eg-honor-600-lite.jpg',
  'amz-eg-honor-x5c': '/assets/banners/amazon-eg-honor-x5c-plus.jpg',
  'amz-eg-redmi-note17pro': '/assets/banners/amazon-eg-redmi-note-17-pro.jpg',
  'amz-eg-iphone-17': '/assets/banners/amazon-eg-iphone-17.jpg',
  'amz-eg-apple-wf': '/assets/banners/amazon-eg-iphone17-promax.jpg',
  'amz-eg-iphone17-promax': '/assets/banners/amazon-eg-iphone17-promax.jpg',
  'amz-eg-iphone17-pro': '/assets/banners/amazon-eg-iphone17-pro.jpg',
  'amz-eg-iphone17e-512': '/assets/banners/amazon-eg-iphone17e-512.jpg',
  'amz-eg-iphone-air': '/assets/banners/amazon-eg-iphone-air.jpg',
  'amz-eg-iphone16-plus': '/assets/banners/amazon-eg-iphone16-plus.jpg',
  'amz-eg-iphone16-pink': '/assets/banners/amazon-eg-iphone16-pink.jpg',
  'amz-eg-apple-60w': '/assets/banners/amazon-eg-apple-60w-adapter.jpg',
  'amz-eg-apple-20w': '/assets/banners/amazon-eg-apple-20w-adapter.jpg',
  'amz-eg-apple-cable': '/assets/banners/amazon-eg-apple-usbc-cable.jpg',
  'amz-jp-blackfriday-dates': '/assets/aistudio/image_b648bbfa.png',
  'amz-jp-store': '/assets/aistudio/image_a7d4a6c8.png',
  'amz-jp-coupons': '/assets/aistudio/image_a7d4a6c8.png',
  'amz-jp-miracase-13': '/assets/banners/amazon-jp-miracase-iphone13.jpg',
  'amz-jp-poco-x8': '/assets/banners/amazon-jp-xiaomi-poco-x8-pro.jpg',
  'amz-jp-xiaomi-17t': '/assets/banners/amazon-jp-xiaomi-17t-pro.jpg',
  'amz-jp-iphone-16': '/assets/banners/amazon-jp-iphone-16.jpg',
  'amz-jp-galaxy-s25': '/assets/banners/amazon-jp-galaxy-s25.jpg',
  'amz-jp-aquos-sense9': '/assets/banners/amazon-jp-aquos-sense9.jpg',
  'amz-jp-moto-edge60': '/assets/banners/amazon-jp-moto-edge-60-pro.jpg',
  'amz-jp-xperia-10': '/assets/banners/amazon-jp-xperia-10-vi.jpg',
  'amz-jp-galaxy-a25': '/assets/banners/amazon-jp-galaxy-a25.jpg',
  'ali-1': '/assets/images/deal_gadgets_audio_1794811011337.jpg',
  'ali-2': '/assets/images/promo_electronics_tech_1794811009540.jpg',
  'ali-3': '/assets/images/deal_accessories_bag_1794811012527.jpg',
  'alib-1': '/assets/images/hero_smart_shopping_1794810594006.jpg',
  'alib-2': '/assets/images/promo_blackfriday_gifts_1794811010711.jpg',
  'alib-3': '/assets/images/promo_electronics_tech_1794811009540.jpg',
  'lenovo-1': '/assets/images/promo_electronics_tech_1794811009540.jpg',
  'lenovo-2': '/assets/images/hero_smart_shopping_1794810594006.jpg',
  'parallels-1': '/assets/images/promo_electronics_tech_1794811009540.jpg',
  'adguard-1': '/assets/images/promo_electronics_tech_1794811009540.jpg',
  'canon-1': '/assets/images/promo_electronics_tech_1794811009540.jpg',
  'huawei-1': '/assets/images/deal_gadgets_audio_1794811011337.jpg',
  'honor-1': '/assets/images/deal_gadgets_audio_1794811011337.jpg',
  'admitad-1': '/assets/images/admitad_earbuds_banner_1795014382533.jpg',
};

const HERO_BASE: Array<{
  id: string;
  storeId: string;
  externalUrl: string;
  image: string;
  bgClass: string;
  textClass: string;
}> = [
  {
    id: 'hero-bf',
    storeId: 'amazon',
    externalUrl: 'https://link.amazon/B0dtiM0VU',
    image: '/assets/images/promo_blackfriday_gifts_1794811010711.jpg',
    bgClass: 'bg-[#FF6200]',
    textClass: 'text-white',
  },
  {
    id: 'hero-tech',
    storeId: 'amazon',
    externalUrl: 'https://link.amazon/B003EiArL',
    image: '/assets/images/promo_electronics_tech_1794811009540.jpg',
    bgClass: 'bg-[#FF5500]',
    textClass: 'text-white',
  },
  {
    id: 'hero-audio',
    storeId: 'aliexpress',
    externalUrl: 'https://rzekl.com/g/1e8d114494d2ceec5c6816525dc3e8/',
    image: '/assets/images/deal_gadgets_audio_1794811011337.jpg',
    bgClass: 'bg-[#00453E]',
    textClass: 'text-white',
  },
  {
    id: 'hero-honor',
    storeId: 'honor-uae',
    externalUrl: 'https://zallj.com/g/d4cxpno5ddd2ceec5c685d13f15f75/',
    image: '/assets/images/deal_accessories_bag_1794811012527.jpg',
    bgClass: 'bg-[#E5DFD5]',
    textClass: 'text-zinc-950',
  },
  {
    id: 'hero-home',
    storeId: 'alibaba',
    externalUrl: 'https://rzekl.com/g/pm1aev55cld2ceec5c68219aa26f6f/',
    image: '/assets/images/deal_home_organize_1794811011993.jpg',
    bgClass: 'bg-[#F5EBD9]',
    textClass: 'text-zinc-950',
  },
];

const QUICK_STRIP_BASE: Array<{
  storeId: string;
  externalUrl: string;
  bg: string;
  text: string;
  image: string;
}> = [
  {
    storeId: 'amazon',
    externalUrl: 'https://link.amazon/B0dtiM0VU',
    bg: 'bg-[#F4F4F5]',
    text: 'text-zinc-950',
    image: '/assets/images/hero_smart_shopping_1794810594006.jpg',
  },
  {
    storeId: 'aliexpress',
    externalUrl: 'https://rzekl.com/g/1e8d114494d2ceec5c6816525dc3e8/',
    bg: 'bg-[#003B32]',
    text: 'text-white',
    image: '/assets/images/deal_gadgets_audio_1794811011337.jpg',
  },
  {
    storeId: 'alibaba',
    externalUrl: 'https://rzekl.com/g/pm1aev55cld2ceec5c68219aa26f6f/',
    bg: 'bg-[#FF6A00]',
    text: 'text-white',
    image: '/assets/images/hero_smart_shopping_1794810594006.jpg',
  },
  {
    storeId: 'honor-uae',
    externalUrl: 'https://zallj.com/g/d4cxpno5ddd2ceec5c685d13f15f75/',
    bg: 'bg-[#00453E]',
    text: 'text-white',
    image: '/assets/images/deal_gadgets_audio_1794811011337.jpg',
  },
  {
    storeId: 'huawei-ae',
    externalUrl: 'https://ficca2021.com/g/2k0ixkhyhod2ceec5c68fc61652cc0/',
    bg: 'bg-[#CF0A2C]',
    text: 'text-white',
    image: '/assets/images/promo_electronics_tech_1794811009540.jpg',
  },
  {
    storeId: 'lenovo-india',
    externalUrl: 'https://tjzuh.com/g/ea3sq3dsmld2ceec5c68e452830f0f/',
    bg: 'bg-[#E2231A]',
    text: 'text-white',
    image: '/assets/images/hero_smart_shopping_1794810594006.jpg',
  },
  {
    storeId: 'canon-uae',
    externalUrl: 'https://dhwnh.com/g/nf984sc59wd2ceec5c68697a6f5f74/',
    bg: 'bg-[#18181B]',
    text: 'text-white',
    image: '/assets/images/promo_electronics_tech_1794811009540.jpg',
  },
];

export const HomeView: React.FC<HomeViewProps> = ({
  stores,
  lang,
  searchQuery,
  searchStoreFilter,
  activeCategory,
  t,
  onSelectCategory,
  onSelectStore,
  onNavigateProducts,
  onActivateDeal,
  onOpenInstallModal,
  onNavigateLegal,
  onClearSearch,
}) => {
  const isAr = lang === 'ar';
  const heroScrollRef = useRef<HTMLDivElement | null>(null);
  const stripScrollRef = useRef<HTMLDivElement | null>(null);
  const [marqueePaused, setMarqueePaused] = useState(false);
  const [bfPhoneBrand, setBfPhoneBrand] = useState<string>('all');
  const [showAllBfPhones, setShowAllBfPhones] = useState<boolean>(false);
  const [bfLaptopBrand, setBfLaptopBrand] = useState<string>('all');
  const [showAllBfLaptops, setShowAllBfLaptops] = useState<boolean>(false);
  const [egPhoneBrand, setEgPhoneBrand] = useState<string>('all');
  const [showAllEgPhones, setShowAllEgPhones] = useState<boolean>(false);

  const rawQuery = searchQuery.trim();
  const normalizedQuery = rawQuery.toLowerCase();

  const scrollTrack = (
    ref: React.RefObject<HTMLDivElement | null>,
    direction: 'left' | 'right'
  ) => {
    if (!ref.current) return;
    const offset = direction === 'left' ? -360 : 360;
    ref.current.scrollBy({ left: offset, behavior: 'smooth' });
  };

  const allDeals = useMemo(() => {
    const items: Array<{ deal: Deal; store: Store }> = [];
    for (const store of stores) {
      for (const deal of store.deals) {
        items.push({ deal, store });
      }
    }
    return items;
  }, [stores]);

  const filteredDeals = useMemo(() => {
    const items: Array<{ deal: Deal; store: Store; score: number }> = [];
    for (const store of stores) {
      if (searchStoreFilter !== 'all' && store.id !== searchStoreFilter) {
        continue;
      }
      if (activeCategory !== 'All' && store.category !== activeCategory) {
        continue;
      }
      for (const deal of store.deals) {
        let score = 1;
        if (rawQuery) {
          const hay = `${store.id} ${store.name} ${store.domain} ${store.category} ${deal.id} ${deal.title} ${deal.description} ${deal.discountLabel} ${deal.code || ''}`;
          score = scoreMultilingualMatch(hay, rawQuery);
          if (score <= 0 && !matchesMultilingualQuery(hay, rawQuery)) continue;
        }
        items.push({ deal, store, score });
      }
    }
    if (rawQuery) {
      items.sort((a, b) => b.score - a.score);
    }
    return items.map(({ deal, store }) => ({ deal, store }));
  }, [stores, searchStoreFilter, activeCategory, rawQuery]);

  const matchedCatalogBrands = useMemo(() => {
    if (!rawQuery) return [];
    const results: Array<{
      score: number;
      dept: ProductDepartment;
      sub: ProductSubcategory;
      brand: ProductBrand;
    }> = [];

    for (const dept of PRODUCT_DEPARTMENTS) {
      const deptText = `${dept.id} ${dept.nameEn} ${dept.nameAr} ${dept.descriptionEn} ${dept.descriptionAr}`;
      const deptScore = scoreMultilingualMatch(deptText, rawQuery);

      for (const sub of dept.subcategories) {
        const subText = `${sub.id} ${sub.nameEn} ${sub.nameAr} ${sub.descriptionEn} ${sub.descriptionAr}`;
        const subScore = scoreMultilingualMatch(subText, rawQuery);

        for (const brand of sub.brands) {
          const brandText = `${brand.id} ${brand.name} ${brand.taglineEn} ${brand.taglineAr} ${brand.partnerLabelEn} ${brand.partnerLabelAr}`;
          const bScore = scoreMultilingualMatch(brandText, rawQuery);
          const totalScore = Math.max(
            bScore,
            subScore > 0 ? subScore : 0,
            deptScore > 0 ? Math.min(deptScore, 40) : 0
          );
          if (totalScore > 0) {
            results.push({ score: totalScore, dept, sub, brand });
          }
        }
      }
    }

    return results.sort((a, b) => b.score - a.score);
  }, [rawQuery]);

  const marqueeItems = useMemo(() => {
    const source = filteredDeals.length > 0 ? filteredDeals : allDeals;
    if (source.length === 0) return [];
    const base = source.length < 6 ? [...source, ...source] : source;
    return [...base, ...base];
  }, [filteredDeals, allDeals]);

  const isFiltering =
    Boolean(normalizedQuery) ||
    searchStoreFilter !== 'all' ||
    activeCategory !== 'All';

  const totalMatches = filteredDeals.length + matchedCatalogBrands.length;

  const bentoQuadrants: Array<{
    heading: string;
    storeId: string;
    linkLabel: string;
    linkUrl: string;
    tiles: Array<{
      id: string;
      label: string;
      img: string;
      url: string;
    }>;
  }> = [
    {
      heading: t.bentoHeadings[0],
      storeId: 'amazon',
      linkLabel: t.bentoLinks[0],
      linkUrl: 'https://link.amazon/B0dtiM0VU',
      tiles: [
        {
          id: 'amz-1',
          label: isAr ? 'عروض أمازون اليومية' : "Amazon Today's Deals",
          img: '/assets/images/promo_blackfriday_gifts_1794811010711.jpg',
          url: 'https://link.amazon/B0dtiM0VU',
        },
        {
          id: 'amz-2',
          label: isAr ? 'أجهزة اللابتوب والإلكترونيات' : 'Laptops & Pro Electronics',
          img: '/assets/images/promo_electronics_tech_1794811009540.jpg',
          url: 'https://link.amazon/B003EiArL',
        },
        {
          id: 'amz-3',
          label: isAr ? 'أجهزة المنزل والمطبخ' : 'Home & Kitchen Favorites',
          img: '/assets/images/deal_home_organize_1794811011993.jpg',
          url: 'https://link.amazon/A0iDndN9l',
        },
        {
          id: 'amz-jp-blackfriday-dates',
          label: isAr ? 'مواعيد بلاك فرايدي أمازون اليابان (30 نوفمبر – 7 ديسمبر)' : 'Amazon Japan Black Friday (Nov 30 – Dec 7)',
          img: '/assets/aistudio/image_b648bbfa.png',
          url: 'https://link.amazon/B0g6Fde52',
        },
      ],
    },
    {
      heading: t.bentoHeadings[1],
      storeId: 'honor-uae',
      linkLabel: t.bentoLinks[1],
      linkUrl: 'https://zallj.com/g/d4cxpno5ddd2ceec5c685d13f15f75/',
      tiles: [
        {
          id: 'honor-1',
          label: isAr ? 'متجر HONOR UAE الرسمي' : 'HONOR UAE Official Store',
          img: '/assets/images/deal_gadgets_audio_1794811011337.jpg',
          url: 'https://zallj.com/g/d4cxpno5ddd2ceec5c685d13f15f75/',
        },
        {
          id: 'huawei-1',
          label: isAr ? 'متجر Huawei AE الرسمي' : 'Huawei AE Phones & Tablets',
          img: '/assets/images/promo_electronics_tech_1794811009540.jpg',
          url: 'https://ficca2021.com/g/2k0ixkhyhod2ceec5c68fc61652cc0/',
        },
        {
          id: 'canon-1',
          label: isAr ? 'كاميرات وطابعات Canon UAE' : 'Canon UAE Cameras & Printers',
          img: '/assets/images/hero_smart_shopping_1794810594006.jpg',
          url: 'https://dhwnh.com/g/nf984sc59wd2ceec5c68697a6f5f74/',
        },
        {
          id: 'lenovo-1',
          label: isAr ? 'أجهزة لابتوب Lenovo India' : 'Lenovo India Laptops',
          img: '/assets/images/deal_home_organize_1794811011993.jpg',
          url: 'https://tjzuh.com/g/ea3sq3dsmld2ceec5c68e452830f0f/',
        },
      ],
    },
    {
      heading: t.bentoHeadings[2],
      storeId: 'aliexpress',
      linkLabel: t.bentoLinks[2],
      linkUrl: 'https://rzekl.com/g/1e8d114494d2ceec5c6816525dc3e8/',
      tiles: [
        {
          id: 'ali-1',
          label: isAr ? 'سماعات وإلكترونيات AliExpress' : 'AliExpress Tech & Audio',
          img: '/assets/images/deal_gadgets_audio_1794811011337.jpg',
          url: 'https://rzekl.com/g/1e8d114494d2ceec5c6816525dc3e8/',
        },
        {
          id: 'ali-3',
          label: isAr ? 'أزياء وإكسسوارات AliExpress' : 'AliExpress Fashion & Bags',
          img: '/assets/images/promo_fashion_apparel_1794811010861.jpg',
          url: 'https://rzekl.com/g/1e8d114494d2ceec5c6816525dc3e8/',
        },
        {
          id: 'alib-1',
          label: isAr ? 'جملة ومصانع Alibaba' : 'Alibaba · Direct Wholesale',
          img: '/assets/images/promo_blackfriday_gifts_1794811010711.jpg',
          url: 'https://rzekl.com/g/pm1aev55cld2ceec5c68219aa26f6f/',
        },
        {
          id: 'ali-2',
          label: isAr ? 'عروض AliExpress Choice' : 'AliExpress Choice Deals',
          img: '/assets/images/hero_smart_shopping_1794810594006.jpg',
          url: 'https://rzekl.com/g/1e8d114494d2ceec5c6816525dc3e8/',
        },
      ],
    },
    {
      heading: t.bentoHeadings[3],
      storeId: 'parallels-ww',
      linkLabel: t.bentoLinks[3],
      linkUrl: 'https://ficca2021.com/g/5ermu17f1nd2ceec5c68ad29faedc4/',
      tiles: [
        {
          id: 'parallels-1',
          label: isAr ? 'برنامج Parallels Desktop' : 'Parallels WW · Mac Software',
          img: '/assets/images/promo_electronics_tech_1794811009540.jpg',
          url: 'https://ficca2021.com/g/5ermu17f1nd2ceec5c68ad29faedc4/',
        },
        {
          id: 'adguard-1',
          label: isAr ? 'حماية ومانع إعلانات AdGuard' : 'AdGuard Privacy & Ad Blocker',
          img: '/assets/images/hero_smart_shopping_1794810594006.jpg',
          url: 'https://dhwnh.com/g/xc497owldvd2ceec5c68a9584d7a68/',
        },
        {
          id: 'admitad-1',
          label: isAr ? 'سماعات بلوتوث Admitad (€29.99)' : 'Admitad Shop Earbuds (€29.99)',
          img: '/assets/images/admitad_earbuds_banner_1795014382533.jpg',
          url: 'https://ytebb.com/g/h0cdgv41zqd2ceec5c6862c6909e0c/',
        },
        {
          id: 'alib-2',
          label: isAr ? 'المنتجات العالمية على Alibaba' : 'Alibaba Trade Assurance',
          img: '/assets/images/deal_accessories_bag_1794811012527.jpg',
          url: 'https://rzekl.com/g/pm1aev55cld2ceec5c68219aa26f6f/',
        },
      ],
    },
  ];

  const categoryTabs = [
    { key: 'All', label: t.catAll },
    { key: 'Marketplaces', label: t.catMarketplaces },
    { key: 'Electronics & Home', label: t.catElectronics },
  ];

  return (
    <div className="bg-[#EAEDED] min-h-screen pb-10">
      {/* Search / Filter Active Notice */}
      {isFiltering && (
        <div className="bg-white border-b border-zinc-200 px-4 py-2.5 flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2 text-zinc-700">
            <Search className="w-4 h-4 text-[#B12767]" />
            <span>
              {t.showingPrefix}{' '}
              <strong className="text-zinc-950 tabular-nums">
                {rawQuery ? totalMatches : filteredDeals.length}
              </strong>{' '}
              {t.verifiedProductDeals}
              {normalizedQuery ? ` "${searchQuery}"` : ''}
            </span>
          </div>
          <button
            type="button"
            onClick={onClearSearch}
            className="text-[#007185] hover:text-[#C7511F] hover:underline font-semibold cursor-pointer"
          >
            {t.clearAllFilters}
          </button>
        </div>
      )}

      {/* Multilingual Unified Search Results (Products & Global Brands + Quick Jump to Matching Coupons) */}
      {rawQuery && (
        <section id="search-results" aria-label="Search Results" className="px-3 sm:px-4 pt-3">
          <div className="bg-white border border-zinc-200 rounded-sm p-4 sm:p-5">
            {totalMatches === 0 ? (
              <div className="py-6 text-center">
                <p className="text-sm font-semibold text-zinc-900">
                  {t.noCouponsMatch}
                </p>
                <button
                  type="button"
                  onClick={onClearSearch}
                  className="mt-3 px-4 py-2 bg-[#FFD814] hover:bg-[#F7CA00] text-zinc-950 text-xs font-bold rounded-full border border-[#FCD200] cursor-pointer"
                >
                  {t.resetSearch}
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {matchedCatalogBrands.length > 0 && (
                  <div>
                    <div className="flex flex-wrap items-center justify-between gap-2 pb-2.5 border-b border-zinc-200">
                      <h2 className="font-display text-base sm:text-lg font-extrabold text-zinc-950">
                        {t.matchingProductsHeading} ({matchedCatalogBrands.length})
                      </h2>
                      <button
                        type="button"
                        onClick={() => onNavigateProducts(matchedCatalogBrands[0]?.dept.id)}
                        className="text-xs font-bold text-[#007185] hover:text-[#C7511F] hover:underline cursor-pointer"
                      >
                        {t.exploreAllProducts}
                      </button>
                    </div>

                    {/* Show Official Admitad Banners when matching featured brands */}
                    {matchedCatalogBrands
                      .filter((m) => m.brand.featuredAdmitadBanner)
                      .map((item) => {
                        const banner = item.brand.featuredAdmitadBanner!;
                        return (
                          <div
                            key={`search-banner-${item.brand.id}`}
                            className="mt-3 rounded-md border border-[#00453E]/25 bg-[#F8FAF9] p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                          >
                            <div className="space-y-2">
                              <span className="inline-block px-2 py-0.5 text-[10px] font-extrabold bg-[#00453E] text-[#FFD814] rounded">
                                {t.officialPartnerBanner} · {banner.alt}
                              </span>
                              <h3 className="font-display text-base font-extrabold text-zinc-950">
                                {item.brand.name}
                              </h3>
                              {(isAr ? item.brand.priceAr : item.brand.priceEn) && (
                                <div className="flex flex-wrap items-baseline gap-2">
                                  <span className="font-display text-sm font-extrabold text-[#B12704]">
                                    {isAr ? item.brand.priceAr : item.brand.priceEn}
                                  </span>
                                  {(isAr ? item.brand.oldPriceAr : item.brand.oldPriceEn) && (
                                    <span className="text-xs text-zinc-500 line-through">
                                      {isAr ? item.brand.oldPriceAr : item.brand.oldPriceEn}
                                    </span>
                                  )}
                                </div>
                              )}
                              <p className="text-xs text-zinc-700">
                                {isAr ? item.brand.taglineAr : item.brand.taglineEn}
                              </p>
                              <div className="pt-1 flex flex-wrap items-center gap-2">
                                <a
                                  target="_blank"
                                  rel="nofollow noopener noreferrer"
                                  href={banner.href}
                                  className="inline-flex items-center gap-1 px-3 py-1 bg-[#FFD814] hover:bg-[#F7CA00] text-zinc-950 border border-[#FCD200] text-xs font-bold rounded-full"
                                >
                                  <span>{isAr ? item.brand.partnerLabelAr : item.brand.partnerLabelEn}</span>
                                  <ExternalLink className="w-3 h-3" />
                                </a>
                                <ShareButton
                                  url={banner.href}
                                  shareId={item.brand.id}
                                  title={item.brand.name}
                                  price={isAr ? item.brand.priceAr : item.brand.priceEn}
                                  oldPrice={isAr ? item.brand.oldPriceAr : item.brand.oldPriceEn}
                                  discount={isAr ? item.brand.partnerLabelAr : item.brand.partnerLabelEn}
                                  isAr={isAr}
                                  dropDirection="down"
                                  align="start"
                                />
                              </div>
                            </div>
                            <a
                              target="_blank"
                              rel="nofollow noopener noreferrer"
                              href={banner.href}
                              className={`block ${
                                banner.imgWidth <= 220 ? 'max-w-[200px]' : 'max-w-[260px]'
                              } w-full rounded overflow-hidden border border-zinc-200 bg-white shrink-0`}
                            >
                              <img
                                width={banner.imgWidth}
                                height={banner.imgHeight}
                                src={banner.imgSrc}
                                alt={banner.alt}
                                referrerPolicy="no-referrer"
                                className="w-full h-auto block border-0"
                              />
                            </a>
                          </div>
                        );
                      })}

                    <div className="mt-3 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
                      {matchedCatalogBrands.slice(0, 12).map(({ dept, sub, brand }) => (
                        <div
                          key={`${sub.id}-${brand.id}`}
                          className="group border border-zinc-200 hover:border-[#00453E] bg-[#FAFAFA] hover:bg-white rounded-sm flex flex-col justify-between transition-all hover:shadow-xs"
                        >
                          <a
                            href={brand.affiliateUrl}
                            target="_blank"
                            rel={
                              brand.featuredAdmitadBanner
                                ? 'nofollow noopener noreferrer'
                                : 'noopener noreferrer'
                            }
                            className="block"
                          >
                            <div className="aspect-[4/3] w-full overflow-hidden rounded-t-sm bg-zinc-100">
                              <img
                                src={sub.image}
                                alt={brand.name}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                              />
                            </div>
                            <div className="p-2.5">
                              <span className="block text-[10px] font-bold text-[#007185] truncate">
                                {isAr ? dept.nameAr : dept.nameEn}
                              </span>
                              <h3 className="font-display text-xs font-extrabold text-zinc-950 group-hover:text-[#00453E] line-clamp-1 mt-0.5">
                                {brand.name}
                              </h3>
                              {(isAr ? brand.priceAr : brand.priceEn) && (
                                <div className="mt-1 flex flex-wrap items-baseline gap-1">
                                  <span className="font-display text-xs font-extrabold text-[#B12704]">
                                    {isAr ? brand.priceAr : brand.priceEn}
                                  </span>
                                  {(isAr ? brand.oldPriceAr : brand.oldPriceEn) && (
                                    <span className="text-[10px] text-zinc-500 line-through">
                                      {isAr ? brand.oldPriceAr : brand.oldPriceEn}
                                    </span>
                                  )}
                                </div>
                              )}
                            </div>
                          </a>
                          <div className="px-2.5 pb-2.5 flex items-center gap-1.5">
                            <a
                              href={brand.affiliateUrl}
                              target="_blank"
                              rel={
                                brand.featuredAdmitadBanner
                                  ? 'nofollow noopener noreferrer'
                                  : 'noopener noreferrer'
                              }
                              className="flex-1 min-w-0 inline-flex items-center justify-center py-1 px-2 bg-[#FFD814] hover:bg-[#F7CA00] text-zinc-950 border border-[#FCD200] text-[11px] font-bold rounded-full truncate"
                            >
                              {isAr ? brand.partnerLabelAr : brand.partnerLabelEn}
                            </a>
                            <ShareButton
                              url={brand.affiliateUrl}
                              shareId={brand.id}
                              title={brand.name}
                              price={isAr ? brand.priceAr : brand.priceEn}
                              oldPrice={isAr ? brand.oldPriceAr : brand.oldPriceEn}
                              discount={isAr ? brand.partnerLabelAr : brand.partnerLabelEn}
                              isAr={isAr}
                              compact
                              dropDirection="up"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </section>
      )}

      {/* Top Amazon US Black Friday Week Hero Banner (Authentic Amazon US Orange Palette, Above Purple Section) */}
      <section aria-label="Amazon US Black Friday Week" className="px-3 sm:px-4 pt-3">
        <div className="rounded-xl bg-gradient-to-r from-[#FF5500] via-[#FF6F00] to-[#C84300] text-white border border-orange-300/45 shadow-md p-4 sm:p-6">
          <div className="grid grid-cols-1 @5xl/main:grid-cols-12 gap-5 items-center">
            {/* Left/Start Campaign Zone: Authentic Amazon Black Friday Orange & Plaque */}
            <div className="@5xl/main:col-span-5 flex flex-col justify-between gap-4">
              <div className="space-y-3">
                <div className="flex flex-wrap items-center gap-2 text-xs font-extrabold tracking-wide text-white/95">
                  <span>Amazon.com (US)</span>
                  <span aria-hidden="true">·</span>
                  <span>
                    {isAr ? 'أسبوع البلاك فرايدي — أمازون أمريكا' : 'Black Friday Week'}
                  </span>
                  <span aria-hidden="true">·</span>
                  <span className="bg-[#131921] text-[#FFD814] px-2 py-0.5 rounded-xs text-[11px] font-extrabold whitespace-nowrap">
                    {isAr ? 'خصومات تصل إلى 55%' : 'UP TO 55% OFF'}
                  </span>
                </div>

                {/* Seamless Original Amazon "Black Friday Week" Artwork (Cropped 2px anti-alias rim) */}
                <a
                  href="https://link.amazon/B08F6a0wD"
                  target="_blank"
                  rel="nofollow noopener noreferrer"
                  className="block w-full max-w-[330px] rounded-lg overflow-hidden bg-[#FF5500] shadow-md ring-1 ring-white/25 hover:scale-[1.015] transition-transform"
                >
                  <img
                    src="/assets/aistudio/image_87e4ff49.png"
                    alt={
                      isAr
                        ? 'أسبوع البلاك فرايدي أمازون أمريكا — خصومات تصل إلى 55%'
                        : 'Amazon US Black Friday Week — Save big all week long'
                    }
                    referrerPolicy="no-referrer"
                    className="w-full h-auto block border-0 scale-[1.03]"
                  />
                </a>

                <div className="space-y-1.5">
                  <h2 className="font-display text-xl sm:text-2xl font-extrabold text-white leading-tight">
                    {isAr
                      ? 'أسبوع البلاك فرايدي أمازون أمريكا — خصومات تصل إلى 55%'
                      : 'Amazon US Black Friday Week — Save Up to 55% Off'}
                  </h2>
                  <p className="text-xs sm:text-sm text-white/95 leading-relaxed">
                    {isAr
                      ? 'تخفيضات أسبوع البلاك فرايدي الرسمية على متجر أمازون أمريكا (Amazon.com) طوال الأسبوع — خصومات تصل إلى 55% على الهواتف الذكية، اللابتوبات، السماعات، والإلكترونيات.'
                      : 'Official Amazon.com (US) Black Friday Week event — save up to 55% all week long on unlocked smartphones, laptops, noise-cancelling headphones, and top tech.'}
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2.5">
                <a
                  href="https://link.amazon/B08F6a0wD"
                  target="_blank"
                  rel="nofollow noopener noreferrer"
                  className="inline-flex items-center justify-center gap-1.5 px-5 py-2.5 min-h-[42px] bg-[#FFD814] hover:bg-[#F7CA00] text-[#0F1111] border border-[#FCD200] text-xs sm:text-sm font-extrabold rounded-full shadow-sm transition-colors whitespace-nowrap shrink-0"
                >
                  <span>
                    {isAr
                      ? 'تسوق أسبوع البلاك فرايدي أمازون أمريكا'
                      : 'Shop Amazon US Black Friday'}
                  </span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>

                <ShareButton
                  url="https://link.amazon/B08F6a0wD"
                  shareId="amz-us-bf-week"
                  title={
                    isAr
                      ? 'أسبوع البلاك فرايدي أمازون أمريكا (Amazon US Black Friday Week)'
                      : 'Amazon US Black Friday Week — Save Big All Week Long'
                  }
                  price={isAr ? 'تبدأ من ~$24.50 USD' : 'From ~$24.50 USD'}
                  discount={isAr ? 'خصومات تصل إلى 55%' : 'Up to 55% OFF'}
                  isAr={isAr}
                  dropDirection="down"
                  align="start"
                  tone="dark"
                />
              </div>
            </div>

            {/* Right/End Zone: 4 Crisp White Product Showcase Cards Floating on Amazon Orange */}
            <div className="@5xl/main:col-span-7 flex flex-col gap-3">
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs sm:text-sm font-extrabold text-white drop-shadow-xs">
                  {isAr
                    ? 'أبرز منتجات أسبوع البلاك فرايدي على أمازون أمريكا (حتى 55% خصم)'
                    : 'Featured Products in Amazon US Black Friday Week (Up to 55% Off)'}
                </span>
                <a
                  href="https://link.amazon/B08F6a0wD"
                  target="_blank"
                  rel="nofollow noopener noreferrer"
                  className="text-xs font-extrabold text-[#FFD814] hover:text-white hover:underline whitespace-nowrap shrink-0"
                >
                  {isAr ? 'عرض جميع العروض ←' : 'All Deals →'}
                </a>
              </div>

              <div className="grid grid-cols-2 @2xl/main:grid-cols-4 gap-3 items-stretch">
                {[
                  {
                    id: 'bf-week-moto-stylus',
                    titleEn: 'Motorola Moto G Stylus (2025) 256GB',
                    titleAr: 'موتورولا Moto G Stylus 2025 (256GB)',
                    price: '$199.99',
                    oldPrice: '$399.99',
                    badge: '50% OFF',
                    image: '/assets/banners/amazon-bf-moto-g-stylus-2025.jpg',
                  },
                  {
                    id: 'bf-week-nothing-3',
                    titleEn: 'Nothing Phone (3) 5G Unlocked 512GB',
                    titleAr: 'نوثينج Phone (3) 5G سعة 512GB',
                    price: '$599.00',
                    oldPrice: '$799.00',
                    badge: '25% OFF',
                    image: '/assets/banners/amazon-bf-nothing-phone-3.jpg',
                  },
                  {
                    id: 'bf-week-tagry-anc',
                    titleEn: 'TAGRY Noise Cancelling Headphones',
                    titleAr: 'سماعات TAGRY لعزل الضوضاء',
                    price: '~$24.50',
                    oldPrice: '$149.99',
                    badge: '50% COUPON',
                    image: '/assets/banners/amazon-tagry-headphones.jpg',
                  },
                  {
                    id: 'bf-week-macbook-pro',
                    titleEn: 'Apple MacBook Pro 14.2" M5 Pro',
                    titleAr: 'آبل ماك بوك برو 14.2 إنش M5 Pro',
                    price: '$2,699.00',
                    oldPrice: '',
                    badge: isAr ? 'حتى 55%' : 'BLACK FRIDAY US',
                    image: '/assets/banners/amazon-macbook-pro-2026.jpg',
                  },
                ].map((item) => (
                  <div
                    key={item.id}
                    className="group rounded-xl bg-white text-[#0F1111] shadow-md hover:shadow-xl hover:-translate-y-0.5 transition-all flex flex-col justify-between border border-white/60"
                  >
                    <a
                      href="https://link.amazon/B08F6a0wD"
                      target="_blank"
                      rel="nofollow noopener noreferrer"
                      className="block flex-1 p-2.5 pb-1.5"
                    >
                      <div className="relative h-28 sm:h-32 bg-white flex items-center justify-center rounded-lg overflow-hidden">
                        <span className="absolute top-1 start-1 z-10 px-1.5 py-0.5 text-[10px] font-extrabold bg-[#CC0C39] text-white rounded-xs leading-none whitespace-nowrap">
                          {item.badge}
                        </span>
                        <img
                          src={item.image}
                          alt={isAr ? item.titleAr : item.titleEn}
                          referrerPolicy="no-referrer"
                          className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-200"
                        />
                      </div>

                      <h3 className="mt-2 text-xs font-bold text-[#0F1111] leading-snug line-clamp-2 min-h-[32px]">
                        {isAr ? item.titleAr : item.titleEn}
                      </h3>

                      <div className="mt-1.5 flex flex-wrap items-baseline gap-1.5 tabular-nums">
                        <span className="text-sm sm:text-base font-extrabold text-[#B12704]">
                          {item.price}
                        </span>
                        {item.oldPrice && (
                          <span className="text-[11px] text-zinc-500 line-through">
                            {item.oldPrice}
                          </span>
                        )}
                      </div>
                    </a>

                    <div className="px-2.5 pb-2.5 pt-1.5 border-t border-zinc-100 flex items-center justify-between gap-1.5">
                      <a
                        href="https://link.amazon/B08F6a0wD"
                        target="_blank"
                        rel="nofollow noopener noreferrer"
                        className="text-[11px] font-extrabold text-[#007185] hover:text-[#C7511F] hover:underline whitespace-nowrap"
                      >
                        {isAr ? 'تسوق العرض ←' : 'Shop Deal →'}
                      </a>
                      <ShareButton
                        url="https://link.amazon/B08F6a0wD"
                        shareId={item.id}
                        title={isAr ? item.titleAr : item.titleEn}
                        price={item.price}
                        oldPrice={item.oldPrice}
                        discount={item.badge}
                        isAr={isAr}
                        compact
                        dropDirection="down"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Compact Violet/Purple November Black Friday Multi-Store Banner */}
      <section aria-label="November Black Friday Deals" className="px-3 sm:px-4 pt-3">
        <div className="rounded-xl bg-gradient-to-r from-[#4C1D95] via-[#6D28D9] to-[#7C3AED] text-white border border-violet-300/30 shadow-sm px-4 py-3.5 sm:px-5 sm:py-4">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3.5">
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[11px] font-extrabold tracking-wide text-[#FFD814]">
                  {t.bfKicker}
                </span>
              </div>

              <h1 className="mt-0.5 font-display text-lg sm:text-xl font-extrabold tracking-tight leading-snug text-white">
                {t.bfTitle}
              </h1>

              <div className="mt-2 flex flex-wrap items-center gap-1.5">
                {[
                  { id: 'bf-us-samsung', label: isAr ? '📱 عروض سامسونج بلاك فرايدي أمريكا' : '📱 Samsung Black Friday US Deals', url: 'https://link.amazon/B032r8aKv' },
                  { id: 'bf-us-phones', label: isAr ? '🔥 خصومات بلاك فرايدي الهواتف (حتى 50%)' : '🔥 Amazon US Phone Deals (Up to 50% Off)', url: 'https://link.amazon/B0exwvhyr' },
                  { id: 'bf-us-laptops', label: isAr ? '💻 عروض لابتوبات 2-in-1 بلاك فرايدي أمريكا (حتى 43%)' : '💻 Amazon US 2-in-1 Laptop Deals (Up to 43% Off)', url: 'https://link.amazon/B05atly2N' },
                  { id: 'bf-nothing-phone', label: isAr ? '🔥 Nothing Phone (3) — $599 بدلاً من $799' : '🔥 Nothing Phone (3) — $599 (25% Off)', url: 'https://link.amazon/B00QLHLCZ' },
                  { id: 'amazon', label: 'Amazon US · Daily Deals', url: 'https://link.amazon/A0iDndN9l' },
                  { id: 'amazon-uae', label: isAr ? 'Amazon UAE · أمازون الإمارات' : 'Amazon UAE · Official Store', url: 'https://link.amazon/A0bb8XnUS' },
                  { id: 'amazon-eg', label: isAr ? 'Amazon Egypt · أمازون مصر' : 'Amazon Egypt · Official Store', url: 'https://link.amazon/B02evOzAd' },
                  { id: 'amazon-eg-mobiles', label: isAr ? '🇪🇬 موبايلات الجمعة البيضاء أمازون مصر (خصم 26%)' : '🇪🇬 Amazon Egypt White Friday Mobiles (26% Off)', url: 'https://link.amazon/B00vB9BZN' },
                  { id: 'amazon-eg-apple', label: isAr ? '🍎 عروض آبل الجمعة البيضاء أمازون مصر (حتى 49%)' : '🍎 Amazon Egypt Apple White Friday (Up to 49% Off)', url: 'https://link.amazon/B0dzulgsu' },
                  { id: 'amazon-jp', label: isAr ? 'Amazon Japan · أمازون اليابان' : 'Amazon Japan · Official Store', url: 'https://link.amazon/A0fp80WvH' },
                  { id: 'amazon-jp-bf', label: isAr ? '🗓️ مواعيد الجمعة البيضاء / السوداء اليابان (30 نوفمبر – 7 ديسمبر)' : '🗓️ Amazon Japan Black Friday: Nov 30 – Dec 7', url: 'https://link.amazon/B0g6Fde52' },
                  { id: 'amazon-jp-miracase', label: isAr ? '🛡️ جراب Miracase iPhone 13 العسكري (¥2,399)' : '🛡️ Miracase iPhone 13 Military Case (¥2,399)', url: 'https://link.amazon/B03dPuy6Z' },
                  { id: 'amazon-jp-phones', label: isAr ? '🇯🇵 هواتف أمازون اليابان SIM-Free (خصم 31%)' : '🇯🇵 Amazon Japan Unlocked Phones (Up to 31% Off)', url: 'https://link.amazon/B08EQakmz' },
                  { id: 'amazon-jp-coupons', label: isAr ? '🎟️ كوبونات هواتف أمازون اليابان' : '🎟️ Amazon Japan Phone Coupons & Deals', url: 'https://link.amazon/B0g6Fde52' },
                  { id: 'aliexpress', label: 'AliExpress WW · Global Store', url: 'https://rzekl.com/g/1e8d114494d2ceec5c6816525dc3e8/' },
                  { id: 'alibaba', label: 'Alibaba WW · Wholesale Direct', url: 'https://rzekl.com/g/pm1aev55cld2ceec5c68219aa26f6f/' },
                  { id: 'lenovo-india', label: 'Lenovo India · Laptops', url: 'https://tjzuh.com/g/ea3sq3dsmld2ceec5c68e452830f0f/' },
                  { id: 'parallels-ww', label: 'Parallels WW · Mac Software', url: 'https://ficca2021.com/g/5ermu17f1nd2ceec5c68ad29faedc4/' },
                  { id: 'adguard-many-geos', label: 'AdGuard · Ad Blocker & Privacy', url: 'https://dhwnh.com/g/xc497owldvd2ceec5c68a9584d7a68/' },
                  { id: 'canon-uae', label: 'Canon UAE · Cameras & Printers', url: 'https://dhwnh.com/g/nf984sc59wd2ceec5c68697a6f5f74/' },
                  { id: 'huawei-ae', label: 'Huawei AE · Phones & Tablets', url: 'https://ficca2021.com/g/2k0ixkhyhod2ceec5c68fc61652cc0/' },
                  { id: 'honor-uae', label: 'HONOR UAE · Official Store', url: 'https://zallj.com/g/d4cxpno5ddd2ceec5c685d13f15f75/' },
                  { id: 'admitad-shop', label: 'Admitad Shop · Wireless Earbuds', url: 'https://ytebb.com/g/h0cdgv41zqd2ceec5c6862c6909e0c/' },
                ].map((chip) => (
                  <a
                    key={chip.id}
                    href={chip.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-2 py-0.5 text-[11px] font-bold bg-white/15 hover:bg-white/25 text-white border border-white/20 rounded transition-colors cursor-pointer whitespace-nowrap"
                  >
                    {chip.label}
                  </a>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <div className="hidden sm:flex items-center gap-1.5">
                <a
                  href="https://link.amazon/A0iDndN9l"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-14 h-14 rounded-lg overflow-hidden border border-white/25 shrink-0 cursor-pointer hover:scale-105 transition-transform"
                  aria-label="Amazon Black Friday Deals"
                >
                  <img
                    src="/assets/images/promo_blackfriday_gifts_1794811010711.jpg"
                    alt="Black Friday gift deals"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                </a>
                <a
                  href="https://link.amazon/B003EiArL"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-14 h-14 rounded-lg overflow-hidden border border-white/25 shrink-0 cursor-pointer hover:scale-105 transition-transform"
                  aria-label="Electronics Black Friday Deals"
                >
                  <img
                    src="/assets/images/promo_electronics_tech_1794811009540.jpg"
                    alt="Black Friday tech deals"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                </a>
              </div>

              <a
                href="https://link.amazon/A0iDndN9l"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center px-4 py-2 min-h-[38px] bg-[#FFD814] hover:bg-[#F7CA00] text-zinc-950 border border-[#FCD200] text-xs sm:text-sm font-extrabold rounded-full transition-colors cursor-pointer whitespace-nowrap"
              >
                {t.bfPrimaryCta}
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Top Amazon US Black Friday Cell Phones Discounts (Samsung + All Verified Brands) */}
      <section aria-label="Amazon US Black Friday Smartphone Discounts" className="px-3 sm:px-4 mt-3">
        <div className="bg-white border border-zinc-200/90 rounded-sm p-4 sm:p-5 shadow-xs">
          {/* Brand Selector Tabs */}
          <div className="flex flex-wrap items-center gap-1.5">
            {[
              { id: 'all', labelEn: 'All Brands (17)', labelAr: 'كل الماركات (17)' },
              { id: 'samsung', labelEn: 'Samsung (4)', labelAr: 'سامسونج (4)' },
              { id: 'motorola', labelEn: 'Motorola (4)', labelAr: 'موتورولا (4)' },
              { id: 'nothing', labelEn: 'Nothing (3)', labelAr: 'نوثينج (3)' },
              { id: 'google', labelEn: 'Google Pixel', labelAr: 'جوجل بكسل' },
              { id: 'other', labelEn: 'NUU · Blackview · Ulefone · TCL · Fairphone', labelAr: 'NUU · Blackview · Ulefone · TCL · Fairphone' },
            ].map((tab) => {
              const active = bfPhoneBrand === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setBfPhoneBrand(tab.id)}
                  className={`px-3 py-1.5 rounded-full text-xs font-bold border transition-colors cursor-pointer whitespace-nowrap ${
                    active
                      ? 'bg-[#131921] text-white border-[#131921]'
                      : 'bg-zinc-100 hover:bg-zinc-200 text-zinc-800 border-zinc-200'
                  }`}
                >
                  {isAr ? tab.labelAr : tab.labelEn}
                </button>
              );
            })}
          </div>

          <div className="mt-4 grid grid-cols-1 @lg/main:grid-cols-2 @4xl/main:grid-cols-3 gap-3.5">
            {[
              {
                id: 'bf-samsung-xcover7-pro',
                brandGroup: 'samsung',
                brandLabel: 'Samsung',
                discount: '23% OFF',
                savingsAr: 'وفّر $140',
                savingsEn: 'Save $140',
                dealPrice: '$459.99',
                listPrice: '$599.99',
                titleEn: 'Samsung Galaxy XCover7 Pro 5G Unlocked · 128GB · IP68 Rugged US Version',
                titleAr: 'سامسونج Galaxy XCover7 Pro 5G غير مقفل — 128 جيجابايت ومقاومة IP68 (إصدار أمريكا)',
                specs: '5G + Wi-Fi 6E · Dual SIM (Nano + eSIM) · US Version · Rugged IP68',
                image: '/assets/banners/amazon-bf-samsung-xcover7-pro.jpg',
                url: 'https://link.amazon/B032r8aKv',
              },
              {
                id: 'bf-samsung-z-fold8',
                brandGroup: 'samsung',
                brandLabel: 'Samsung',
                discount: '16% OFF · -$300',
                savingsAr: 'وفّر $300',
                savingsEn: 'Save $300',
                dealPrice: '$1,599.99',
                listPrice: '$1,899.99',
                titleEn: 'Samsung Galaxy Z Fold8 Unlocked Android Smartphone · 512GB Graphite',
                titleAr: 'سامسونج Galaxy Z Fold8 القابل للطي غير مقفل — 512 جيجابايت جرافيت',
                specs: '12GB RAM · Dual 50MP Camera · 4800mAh · Customized Processor',
                image: '/assets/banners/amazon-bf-samsung-z-fold8.jpg',
                url: 'https://link.amazon/B032r8aKv',
              },
              {
                id: 'bf-samsung-s26-fe',
                brandGroup: 'samsung',
                brandLabel: 'Samsung',
                discount: isAr ? 'عرض سامسونج' : 'SAMSUNG DEAL',
                savingsAr: 'وفّر ~$100',
                savingsEn: 'Save ~$100',
                dealPrice: '~$600.00',
                listPrice: '$700+',
                titleEn: 'Samsung Galaxy S26 FE Unlocked Phone · 256GB Graphite · Galaxy AI',
                titleAr: 'سامسونج Galaxy S26 FE غير مقفل — 256 جيجابايت مع Galaxy AI وكاميرا 50MP',
                specs: '8GB RAM · 50MP Camera · AI Photo Editor · 4900mAh Battery',
                image: '/assets/banners/amazon-bf-samsung-s26-fe.jpg',
                url: 'https://link.amazon/B032r8aKv',
              },
              {
                id: 'bf-samsung-a37',
                brandGroup: 'samsung',
                brandLabel: 'Samsung',
                discount: isAr ? 'عرض سامسونج' : 'SAMSUNG DEAL',
                savingsAr: 'سعر أمازون',
                savingsEn: 'US Retail',
                dealPrice: '~$490.00',
                listPrice: '',
                titleEn: 'Samsung Galaxy A37 5G (2026) Unlocked · 128GB AMOLED · IP68 US Version',
                titleAr: 'سامسونج Galaxy A37 5G (2026) غير مقفل — 128 جيجابايت شاشة AMOLED ومقاومة IP68',
                specs: 'Triple Camera · 5000mAh Battery · US 1-Yr Warranty · Awesome Charcoal',
                image: '/assets/banners/amazon-bf-samsung-a37.jpg',
                url: 'https://link.amazon/B032r8aKv',
              },
              {
                id: 'bf-moto-stylus-2025',
                brandGroup: 'motorola',
                brandLabel: 'Motorola',
                discount: '50% OFF',
                savingsAr: 'وفّر $200',
                savingsEn: 'Save $200',
                dealPrice: '$199.99',
                listPrice: '$399.99',
                titleEn: 'Motorola Moto G Stylus (2025) Unlocked · 8GB / 256GB · 50MP Camera',
                titleAr: 'موتورولا Moto G Stylus 2025 غير مقفل — 256 جيجابايت و8GB رام وكاميرا 50MP',
                specs: 'Unlocked · 256GB · Pantone Gibraltar Sea · Built-in Stylus',
                image: '/assets/banners/amazon-bf-moto-g-stylus-2025.jpg',
                url: 'https://link.amazon/B0exwvhyr',
              },
              {
                id: 'bf-moto-g-play',
                brandGroup: 'motorola',
                brandLabel: 'Motorola',
                discount: '33% OFF',
                savingsAr: 'وفّر $50',
                savingsEn: 'Save $50',
                dealPrice: '$99.99',
                listPrice: '$149.99',
                titleEn: 'Motorola Moto G Play LTE Unlocked · 64GB · 50MP Camera',
                titleAr: 'موتورولا Moto G Play غير مقفل — سعة 64 جيجابايت وكاميرا 50MP',
                specs: 'Unlocked · Made for US · 4GB/64GB · Sapphire Blue',
                image: '/assets/banners/amazon-bf-moto-g-play.jpg',
                url: 'https://link.amazon/B0exwvhyr',
              },
              {
                id: 'bf-nuu-b40-5g',
                brandGroup: 'other',
                brandLabel: 'NUU',
                discount: '32% OFF',
                savingsAr: 'وفّر $80',
                savingsEn: 'Save $80',
                dealPrice: '$169.99',
                listPrice: '$249.99',
                titleEn: 'NUU B40 5G Unlocked Smartphone · 8GB / 256GB · Dual 120Hz AMOLED',
                titleAr: 'هاتف NUU B40 5G غير مقفل — 256 جيجابايت وشاشة AMOLED مزدوجة 120Hz',
                specs: '5G · Dual SIM · 64MP Camera · Android 15 · US 1-Yr Warranty',
                image: '/assets/banners/amazon-bf-nuu-b40-5g.jpg',
                url: 'https://link.amazon/B0exwvhyr',
              },
              {
                id: 'bf-moto-stylus-2026',
                brandGroup: 'motorola',
                brandLabel: 'Motorola',
                discount: '30% OFF',
                savingsAr: 'وفّر $150',
                savingsEn: 'Save $150',
                dealPrice: '$349.99',
                listPrice: '$499.99',
                titleEn: 'Motorola Moto G Stylus (2026) Unlocked · 8GB / 128GB · 50MP Camera',
                titleAr: 'موتورولا Moto G Stylus 2026 غير مقفل — 128 جيجابايت وكاميرا 50MP',
                specs: 'Unlocked · Made for US · Pantone Lavender Mist',
                image: '/assets/banners/amazon-bf-moto-g-stylus-2026.jpg',
                url: 'https://link.amazon/B0exwvhyr',
              },
              {
                id: 'bf-nothing-phone-3-256',
                brandGroup: 'nothing',
                brandLabel: 'Nothing',
                discount: '29% OFF',
                savingsAr: 'وفّر $200',
                savingsEn: 'Save $200',
                dealPrice: '$499.00',
                listPrice: '$699.00',
                titleEn: 'Nothing Phone (3) 5G Unlocked 256GB · Snapdragon 8s Gen 4 · Glyph Interface',
                titleAr: 'هاتف Nothing Phone (3) 5G غير مقفل 256GB — معالج Snapdragon 8s Gen 4',
                specs: 'Android 15 · Four 50MP Cameras · AMOLED · 5150mAh',
                image: '/assets/banners/amazon-bf-nothing-phone-3-white.jpg',
                url: 'https://link.amazon/B0exwvhyr',
              },
              {
                id: 'bf-nothing-phone-3-512',
                brandGroup: 'nothing',
                brandLabel: 'Nothing',
                discount: '25% OFF',
                savingsAr: 'وفّر $200',
                savingsEn: 'Save $200',
                dealPrice: '$599.00',
                listPrice: '$799.00',
                titleEn: 'Nothing Phone (3) 5G Unlocked 512GB · Snapdragon 8s Gen 4 · Black',
                titleAr: 'هاتف Nothing Phone (3) 5G غير مقفل 512GB — أسود (Snapdragon 8s Gen 4)',
                specs: '16GB/512GB · Glyph Interface · Four 50MP Cameras · 5150mAh',
                image: '/assets/banners/amazon-bf-nothing-phone-3.jpg',
                url: 'https://link.amazon/B00QLHLCZ',
              },
              {
                id: 'bf-nothing-phone-4a-pro',
                brandGroup: 'nothing',
                brandLabel: 'Nothing',
                discount: isAr ? 'تخفيض Nothing' : 'BLACK FRIDAY DEAL',
                savingsAr: 'وفّر $15.50',
                savingsEn: 'Save $15.50',
                dealPrice: '$483.50',
                listPrice: '$499.00',
                titleEn: 'Nothing Phone (4a) Pro Unlocked · 12GB / 256GB · 6.83" 144Hz AMOLED',
                titleAr: 'هاتف Nothing Phone (4a) Pro غير مقفل — 12GB/256GB وشاشة 144Hz AMOLED',
                specs: 'Android 16 · Triple-Lens Camera · 5080mAh · Glyph Matrix',
                image: '/assets/banners/amazon-bf-nothing-phone-4a-pro.jpg',
                url: 'https://link.amazon/B0exwvhyr',
              },
              {
                id: 'bf-google-pixel-11-pro',
                brandGroup: 'google',
                brandLabel: 'Google',
                discount: '20% OFF · -$200',
                savingsAr: 'وفّر $200',
                savingsEn: 'Save $200',
                dealPrice: '$799.00',
                listPrice: '$999.00',
                titleEn: 'Google Pixel 11 Pro Unlocked Smartphone · 256GB Olive · Gemini AI',
                titleAr: 'جوجل Pixel 11 Pro غير مقفل — 256 جيجابايت زيتوني مع Gemini AI وزووم 120x',
                specs: '6.3" Super Actua Display · 120x Zoom · IP68 · 30+ Hr Battery',
                image: '/assets/banners/amazon-bf-google-pixel-11-pro.jpg',
                url: 'https://link.amazon/B0exwvhyr',
              },
              {
                id: 'bf-moto-razr-ultra-2026',
                brandGroup: 'motorola',
                brandLabel: 'Motorola',
                discount: '13% OFF · -$200',
                savingsAr: 'وفّر $200',
                savingsEn: 'Save $200',
                dealPrice: '$1,299.99',
                listPrice: '$1,499.99',
                titleEn: 'Motorola Razr Ultra (2026) Foldable Unlocked · 16GB / 512GB · 50MP Camera',
                titleAr: 'موتورولا Razr Ultra (2026) القابل للطي غير مقفل — 512 جيجابايت و16GB رام (مووف غامق)',
                specs: 'Unlocked Foldable · Made for US · Pantone Orient Blue',
                image: '/assets/banners/amazon-bf-moto-razr-ultra-2026.jpg',
                url: 'https://link.amazon/B0exwvhyr',
              },
              {
                id: 'bf-blackview-wave-10',
                brandGroup: 'other',
                brandLabel: 'Blackview',
                discount: '15% OFF',
                savingsAr: 'وفّر $30',
                savingsEn: 'Save $30',
                dealPrice: '$169.99',
                listPrice: '$199.99',
                titleEn: 'Blackview WAVE 10 Unlocked Phone · Android 16 · 6.88" 120Hz · 128GB',
                titleAr: 'هاتف Blackview WAVE 10 غير مقفل — أندرويد 16 وشاشة 120Hz وسعة 128GB',
                specs: '32GB RAM (Extended) + 128GB · 32MP+13MP · 3-Yr Warranty',
                image: '/assets/banners/amazon-bf-blackview-wave-10.jpg',
                url: 'https://link.amazon/B0exwvhyr',
              },
              {
                id: 'bf-ulefone-armor-x16-pro',
                brandGroup: 'other',
                brandLabel: 'Ulefone',
                discount: '15% OFF',
                savingsAr: 'وفّر $45',
                savingsEn: 'Save $45',
                dealPrice: '$254.99',
                listPrice: '$299.99',
                titleEn: 'Ulefone Armor X16 Pro 5G Rugged · 16GB+256GB · 10360mAh · Night Vision',
                titleAr: 'هاتف Ulefone Armor X16 Pro 5G المقاوم للصدمات — بطارية 10360mAh وكاميرا ليلية',
                specs: 'Dimensity 6300 · Android 16 · 64MP+25MP · Dual 5G · IP68/69K',
                image: '/assets/banners/amazon-bf-ulefone-armor-x16-pro.jpg',
                url: 'https://link.amazon/B0exwvhyr',
              },
              {
                id: 'bf-tcl-nxtpaper-70-pro',
                brandGroup: 'other',
                brandLabel: 'TCL',
                discount: '15% OFF · -$50',
                savingsAr: 'وفّر $50',
                savingsEn: 'Save $50',
                dealPrice: '$279.99',
                listPrice: '$329.99',
                titleEn: 'TCL NXTPAPER 70 Pro 5G Unlocked · 6.9" 120Hz NXTPAPER 4.0 · 8GB/128GB',
                titleAr: 'هاتف TCL NXTPAPER 70 Pro 5G غير مقفل — شاشة 6.9 إنش مريحة للعين 120Hz',
                specs: 'NXTPAPER 4.0 · AI Tools · 50MP Camera · IP68 · Dual 5G',
                image: '/assets/banners/amazon-bf-tcl-nxtpaper-70-pro.jpg',
                url: 'https://link.amazon/B0exwvhyr',
              },
              {
                id: 'bf-fairphone-6-plus',
                brandGroup: 'other',
                brandLabel: 'Fairphone',
                discount: isAr ? 'بلاك فرايدي' : 'BLACK FRIDAY DEAL',
                savingsAr: 'السعر الرسمي',
                savingsEn: 'US Retail',
                dealPrice: '$649.99',
                listPrice: '',
                titleEn: 'Fairphone Gen. 6+ Modular Unlocked Android · 12GB / 256GB · Forest Green',
                titleAr: 'هاتف Fairphone Gen. 6+ غير مقفل بقطع قابلة للاستبدال — 12GB/256GB أخضر',
                specs: 'Snapdragon 7s Gen 4 · Gorilla Glass 7i · 5-Yr US Warranty',
                image: '/assets/banners/amazon-bf-fairphone-6-plus.jpg',
                url: 'https://link.amazon/B0exwvhyr',
              },
            ]
              .filter((p) => bfPhoneBrand === 'all' || p.brandGroup === bfPhoneBrand)
              .slice(0, bfPhoneBrand === 'all' && !showAllBfPhones ? 9 : 20)
              .map((phone) => (
              <div
                key={phone.id}
                className="rounded-lg border border-zinc-200 bg-[#FAFAFA] hover:border-[#FF9900] hover:shadow-sm transition-all flex flex-col justify-between overflow-hidden"
              >
                <div className="relative bg-white p-4 border-b border-zinc-100">
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-1.5">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[11px] font-extrabold bg-[#CC0C39] text-white rounded">
                        {phone.discount}
                      </span>
                      <span className="px-2 py-0.5 text-[10px] font-bold bg-zinc-100 text-zinc-800 rounded">
                        {phone.brandLabel}
                      </span>
                    </div>
                    <ShareButton
                      url={phone.url}
                      shareId={phone.id}
                      title={isAr ? phone.titleAr : phone.titleEn}
                      price={phone.dealPrice}
                      oldPrice={phone.listPrice}
                      discount={phone.discount}
                      isAr={isAr}
                      compact
                      dropDirection="down"
                    />
                  </div>
                  <a
                    href={phone.url}
                    target="_blank"
                    rel="nofollow noopener noreferrer"
                    className="block w-full h-44 flex items-center justify-center"
                  >
                    <img
                      src={phone.image}
                      alt={phone.titleEn}
                      referrerPolicy="no-referrer"
                      className="max-h-full max-w-full object-contain"
                    />
                  </a>
                </div>

                <div className="p-3.5 flex-1 flex flex-col justify-between gap-2.5">
                  <div>
                    <div className="flex flex-wrap items-baseline gap-2">
                      <span className="font-display font-extrabold text-xl text-zinc-950">
                        {phone.dealPrice}
                      </span>
                      {phone.listPrice && (
                        <span className="text-xs text-zinc-500 line-through">
                          {phone.listPrice}
                        </span>
                      )}
                      <span className="px-1.5 py-0.5 text-[10px] font-extrabold bg-emerald-100 text-emerald-900 rounded">
                        {isAr ? phone.savingsAr : phone.savingsEn}
                      </span>
                    </div>

                    <h3 className="mt-1.5 font-display text-sm font-bold text-zinc-950 leading-snug line-clamp-2">
                      {isAr ? phone.titleAr : phone.titleEn}
                    </h3>
                    <p className="mt-1 text-[11px] text-zinc-600 line-clamp-1">
                      {phone.specs}
                    </p>
                  </div>

                  <a
                    href={phone.url}
                    target="_blank"
                    rel="nofollow noopener noreferrer"
                    className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-2 bg-[#FFD814] hover:bg-[#F7CA00] text-zinc-950 border border-[#FCD200] text-xs font-extrabold rounded-full transition-colors"
                  >
                    <span>
                      {phone.brandGroup === 'samsung'
                        ? isAr
                          ? 'تصفح عروض سامسونج على أمازون'
                          : 'Shop Samsung on Amazon US'
                        : isAr
                          ? 'احصل على الخصم في أمازون أمريكا'
                          : 'Shop Deal on Amazon US'}
                    </span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            ))}
          </div>

          {bfPhoneBrand === 'all' && (
            <div className="mt-4 flex justify-center">
              <button
                type="button"
                onClick={() => setShowAllBfPhones((prev) => !prev)}
                className="px-5 py-2 rounded-full bg-zinc-100 hover:bg-zinc-200 border border-zinc-300 text-xs font-extrabold text-zinc-900 transition-colors cursor-pointer"
              >
                {showAllBfPhones
                  ? isAr
                    ? 'عرض أهم 9 عروض فقط'
                    : 'Show Top 9 Deals'
                  : isAr
                    ? 'عرض جميع الـ 17 عرضاً (Samsung · Google · TCL · Fairphone · Blackview · Ulefone)'
                    : 'Show All 17 Brand Deals (Samsung · Google · TCL · Fairphone · Blackview · Ulefone)'}
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Top Amazon US Black Friday 2-in-1 Laptops & Copilot+ AI PCs Discounts */}
      <section aria-label="Amazon US Black Friday 2-in-1 Laptops Discounts" className="px-3 sm:px-4 mt-3">
        <div className="bg-white border border-zinc-200/90 rounded-sm p-4 sm:p-5 shadow-xs">
          <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-zinc-200">
            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-2.5 py-0.5 text-[11px] font-extrabold bg-[#FF9900] text-zinc-950 rounded whitespace-nowrap">
                  AMAZON US · 2-IN-1 LAPTOPS
                </span>
                <span className="px-2 py-0.5 text-[11px] font-extrabold bg-[#CC0C39] text-white rounded whitespace-nowrap">
                  {isAr ? 'خصومات حتى 43% في البلاك فرايدي' : 'BLACK FRIDAY · UP TO 43% OFF'}
                </span>
              </div>
              <h2 className="font-display text-lg sm:text-xl font-extrabold text-zinc-950">
                {isAr
                  ? 'عروض البلاك فرايدي على أجهزة اللابتوب 2-in-1 والذكاء الاصطناعي (أمازون أمريكا)'
                  : 'Amazon US Black Friday — 2-in-1 Laptops & Copilot+ AI PCs'}
              </h2>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <a
                href="https://link.amazon/B05atly2N"
                target="_blank"
                rel="nofollow noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#FFD814] hover:bg-[#F7CA00] text-zinc-950 border border-[#FCD200] text-xs font-extrabold rounded-full transition-colors whitespace-nowrap"
              >
                <span>
                  {isAr
                    ? 'تصفح كل عروض اللابتوب على أمازون أمريكا'
                    : 'Shop All 2-in-1 Laptops on Amazon US'}
                </span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
              <ShareButton
                url="https://link.amazon/B05atly2N"
                shareId="amz-bf-laptops"
                title={
                  isAr
                    ? 'عروض البلاك فرايدي على أجهزة اللابتوب 2-in-1 في أمازون أمريكا (حتى 43% خصم)'
                    : 'Amazon US Black Friday 2-in-1 Laptops & Copilot+ AI PCs (Up to 43% Off)'
                }
                price={isAr ? 'تبدأ من $329.99 USD' : 'From $329.99 USD'}
                discount={isAr ? 'خصومات حتى 43%' : 'UP TO 43% OFF'}
                isAr={isAr}
                dropDirection="down"
              />
            </div>
          </div>

          {/* Laptop Brand Selector Tabs */}
          <div className="mt-3 flex flex-wrap items-center gap-1.5">
            {[
              { id: 'all', labelEn: 'All Brands (12)', labelAr: 'كل الماركات (12)' },
              { id: 'lenovo', labelEn: 'Lenovo (4)', labelAr: 'لينوفو Lenovo (4)' },
              { id: 'hp', labelEn: 'HP OmniBook (3)', labelAr: 'إتش بي HP (3)' },
              { id: 'acer', labelEn: 'Acer (2)', labelAr: 'أيسر Acer (2)' },
              { id: 'samsung', labelEn: 'Samsung (2)', labelAr: 'سامسونج Samsung (2)' },
              { id: 'nimo', labelEn: 'NIMO (1)', labelAr: 'NIMO (1)' },
            ].map((tab) => {
              const active = bfLaptopBrand === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setBfLaptopBrand(tab.id)}
                  className={`px-3 py-1.5 rounded-full text-xs font-bold border transition-colors cursor-pointer whitespace-nowrap ${
                    active
                      ? 'bg-[#131921] text-white border-[#131921]'
                      : 'bg-zinc-100 hover:bg-zinc-200 text-zinc-800 border-zinc-200'
                  }`}
                >
                  {isAr ? tab.labelAr : tab.labelEn}
                </button>
              );
            })}
          </div>

          <div className="mt-4 grid grid-cols-1 @lg/main:grid-cols-2 @4xl/main:grid-cols-3 gap-3.5">
            {[
              {
                id: 'bf-laptop-lenovo-chromebook-2in1',
                brandGroup: 'lenovo',
                brandLabel: 'Lenovo',
                discount: '35% OFF',
                savingsAr: 'وفّر $180',
                savingsEn: 'Save $180',
                dealPrice: '$329.99',
                listPrice: '$509.99',
                titleEn: 'Lenovo Chromebook 2-in-1 14" WUXGA IPS Touch · Intel N150 · Google Gemini · 128GB',
                titleAr: 'لينوفو Chromebook 2-in-1 بشاشة لمس 14 بوصة WUXGA — معالج Intel N150 و128GB وGoogle Gemini',
                specs: '14" WUXGA IPS Touch · Intel N150 · 4GB RAM · 128GB UFS · Luna Grey',
                image: '/assets/banners/amazon-bf-lenovo-chromebook-2in1.jpg',
                url: 'https://link.amazon/B05atly2N',
              },
              {
                id: 'bf-laptop-acer-chromebook-spin-314',
                brandGroup: 'acer',
                brandLabel: 'Acer',
                discount: '32% OFF',
                savingsAr: 'وفّر $160',
                savingsEn: 'Save $160',
                dealPrice: '$339.99',
                listPrice: '$499.99',
                titleEn: 'Acer Chromebook Spin 314 Convertible 14" WUXGA Gorilla Glass Touch · Intel Core i3-N305',
                titleAr: 'أيسر Chromebook Spin 314 المتحول بشاشة لمس 14 بوصة — معالج Intel Core i3-N305 و8GB رام',
                specs: '14" WUXGA Touch · Corning Gorilla Glass · 8GB LPDDR5 · 128GB · Wi-Fi 6E',
                image: '/assets/banners/amazon-bf-acer-chromebook-spin-314.jpg',
                url: 'https://link.amazon/B05atly2N',
              },
              {
                id: 'bf-laptop-samsung-book4-edge',
                brandGroup: 'samsung',
                brandLabel: 'Samsung',
                discount: '43% OFF',
                savingsAr: 'وفّر ~$860',
                savingsEn: 'Save ~$860',
                dealPrice: '~$1,139.43',
                listPrice: '$1,999.00',
                titleEn: 'Samsung Galaxy Book4 Edge 16" 3K AMOLED Touch · Snapdragon X Elite · 16GB RAM',
                titleAr: 'سامسونج Galaxy Book4 Edge شاشة لمس 16 بوصة 3K AMOLED — معالج Snapdragon X Elite و16GB رام',
                specs: '16" 3K Touch Display · Snapdragon X Elite X1E-80-100 · 16GB RAM · Win 11 Pro',
                image: '/assets/banners/amazon-bf-samsung-galaxy-book4-edge.jpg',
                url: 'https://link.amazon/B05atly2N',
              },
              {
                id: 'bf-laptop-acer-aspire-lite-14',
                brandGroup: 'acer',
                brandLabel: 'Acer',
                discount: '16% OFF',
                savingsAr: 'وفّر $120',
                savingsEn: 'Save $120',
                dealPrice: '$629.99',
                listPrice: '$749.99',
                titleEn: 'Acer Aspire Lite 14 AI Copilot+ PC · Snapdragon X · 16GB LPDDR5 · 512GB SSD',
                titleAr: 'أيسر Aspire Lite 14 AI Copilot+ PC — معالج Snapdragon X و16GB رام و512GB SSD',
                specs: '14" WUXGA · Snapdragon X X1-26-100 · 45 TOPS NPU · 16GB LPDDR5 · 512GB SSD',
                image: '/assets/banners/amazon-bf-acer-aspire-lite-14-ai.jpg',
                url: 'https://link.amazon/B05atly2N',
              },
              {
                id: 'bf-laptop-samsung-book5-pro-360',
                brandGroup: 'samsung',
                brandLabel: 'Samsung',
                discount: '20% OFF',
                savingsAr: 'وفّر ~$350',
                savingsEn: 'Save ~$350',
                dealPrice: '~$1,399.99',
                listPrice: '$1,749.99',
                titleEn: 'Samsung 16" Galaxy Book5 Pro 360 AI Business Laptop · Intel Core Ultra 7 256V',
                titleAr: 'سامسونج Galaxy Book5 Pro 360 شاشة 16 بوصة 3K AMOLED — معالج Intel Core Ultra 7 256V',
                specs: '16" 3K AMOLED 120Hz Touch · Intel Core Ultra 7 256V · 16GB · 512GB SSD · Gray',
                image: '/assets/banners/amazon-bf-samsung-galaxy-book5-pro-360.jpg',
                url: 'https://link.amazon/B05atly2N',
              },
              {
                id: 'bf-laptop-hp-omnibook-16-2tb',
                brandGroup: 'hp',
                brandLabel: 'HP',
                discount: isAr ? 'بلاك فرايدي' : 'BLACK FRIDAY',
                savingsAr: 'عرض أمازون أمريكا',
                savingsEn: 'Amazon US Deal',
                dealPrice: '~$899.99',
                listPrice: '',
                titleEn: 'HP OmniBook X Flip 2-in-1 16" OLED Touch · Ryzen AI 5 430 · 16GB DDR5 · 2TB SSD w/ Stylus',
                titleAr: 'إتش بي HP OmniBook X Flip 2-in-1 شاشة 16 بوصة OLED لمس — معالج Ryzen AI 5 و2TB SSD مع قلم',
                specs: '16" OLED Touch · Copilot+ PC · 50 TOPS NPU · 16GB DDR5 · 2TB SSD · Wi-Fi 7',
                image: '/assets/banners/amazon-bf-hp-omnibook-x-flip-16-2tb.jpg',
                url: 'https://link.amazon/B05atly2N',
              },
              {
                id: 'bf-laptop-lenovo-yoga-7i-14-oled',
                brandGroup: 'lenovo',
                brandLabel: 'Lenovo',
                discount: isAr ? 'بلاك فرايدي' : 'BLACK FRIDAY',
                savingsAr: 'عرض أمازون أمريكا',
                savingsEn: 'Amazon US Deal',
                dealPrice: '~$949.99',
                listPrice: '',
                titleEn: 'Lenovo Yoga 7i 2-in-1 14" WUXGA OLED Touch · Intel Ultra 7 355 · 24GB RAM · 512GB SSD',
                titleAr: 'لينوفو Yoga 7i 2-in-1 شاشة 14 بوصة WUXGA OLED لمس — معالج Ultra 7 355 و24GB رام',
                specs: '14" WUXGA OLED · Ultra 7 355 · 24GB RAM · 512GB SSD · 49 TOPS NPU · Wi-Fi 7',
                image: '/assets/banners/amazon-bf-lenovo-yoga-7i-14-oled.jpg',
                url: 'https://link.amazon/B05atly2N',
              },
              {
                id: 'bf-laptop-hp-omnibook-14-oled',
                brandGroup: 'hp',
                brandLabel: 'HP',
                discount: isAr ? 'بلاك فرايدي' : 'BLACK FRIDAY',
                savingsAr: 'عرض أمازون أمريكا',
                savingsEn: 'Amazon US Deal',
                dealPrice: '~$749.99',
                listPrice: '',
                titleEn: 'HP OmniBook X Flip 2-in-1 14" 2K OLED Touch · Ryzen AI 5 430 · 16GB · 1TB SSD',
                titleAr: 'إتش بي HP OmniBook X Flip 2-in-1 شاشة 14 بوصة 2K OLED لمس — Ryzen AI 5 و1TB SSD',
                specs: '14" 2K OLED Touch · Ryzen AI 5 430 · 50 TOPS NPU · 16GB LPDDR5X · 1TB SSD',
                image: '/assets/banners/amazon-bf-hp-omnibook-x-flip-14-oled.jpg',
                url: 'https://link.amazon/B05atly2N',
              },
              {
                id: 'bf-laptop-lenovo-yoga-7i-16-ultra5',
                brandGroup: 'lenovo',
                brandLabel: 'Lenovo',
                discount: isAr ? 'بلاك فرايدي' : 'BLACK FRIDAY',
                savingsAr: 'عرض أمازون أمريكا',
                savingsEn: 'Amazon US Deal',
                dealPrice: '~$849.99',
                listPrice: '',
                titleEn: 'Lenovo Yoga 7i 16" 2-in-1 2K Touchscreen · Intel Core Ultra 5 226V · Win 11 Pro',
                titleAr: 'لينوفو Yoga 7i 2-in-1 شاشة 16 بوصة 2K لمس — معالج Intel Core Ultra 5 226V وويندوز 11 برو',
                specs: '16" 2K (1920x1200) Touch · Core Ultra 5 226V · Backlit KB · Fingerprint · Wi-Fi 7',
                image: '/assets/banners/amazon-bf-lenovo-yoga-7i-16-ultra5.jpg',
                url: 'https://link.amazon/B05atly2N',
              },
              {
                id: 'bf-laptop-lenovo-yoga-7a-16-oled',
                brandGroup: 'lenovo',
                brandLabel: 'Lenovo',
                discount: isAr ? 'بلاك فرايدي' : 'BLACK FRIDAY',
                savingsAr: 'عرض أمازون أمريكا',
                savingsEn: 'Amazon US Deal',
                dealPrice: '~$999.99',
                listPrice: '',
                titleEn: 'Lenovo Yoga 7a 2-in-1 16" 2K OLED Touch · AMD Ryzen AI 7 445 · 24GB RAM · 512GB SSD',
                titleAr: 'لينوفو Yoga 7a 2-in-1 شاشة 16 بوصة 2K OLED لمس — معالج AMD Ryzen AI 7 و24GB رام',
                specs: '16" 2K OLED Touch · Ryzen AI 7 445 · 50+ TOPS NPU · 24GB RAM · 512GB SSD',
                image: '/assets/banners/amazon-bf-lenovo-yoga-7a-16-oled.jpg',
                url: 'https://link.amazon/B05atly2N',
              },
              {
                id: 'bf-laptop-hp-omnibook-16-ai9',
                brandGroup: 'hp',
                brandLabel: 'HP',
                discount: isAr ? 'بلاك فرايدي' : 'BLACK FRIDAY',
                savingsAr: 'عرض أمازون أمريكا',
                savingsEn: 'Amazon US Deal',
                dealPrice: '~$1,199.99',
                listPrice: '',
                titleEn: 'HP OmniBook X Flip 2-in-1 16" FHD+ OLED Touch · AMD Ryzen AI 9 465 · 32GB LPDDR5X',
                titleAr: 'إتش بي HP OmniBook X Flip 2-in-1 شاشة 16 بوصة OLED لمس — معالج Ryzen AI 9 465 و32GB رام',
                specs: '16" FHD+ OLED Touch · AMD Ryzen AI 9 465 · 32GB LPDDR5X · Copilot+ PC',
                image: '/assets/banners/amazon-bf-hp-omnibook-x-flip-16-ai9.jpg',
                url: 'https://link.amazon/B05atly2N',
              },
              {
                id: 'bf-laptop-nimo-173-ai-copilot',
                brandGroup: 'nimo',
                brandLabel: 'NIMO',
                discount: isAr ? 'بلاك فرايدي' : 'BLACK FRIDAY',
                savingsAr: 'عرض أمازون أمريكا',
                savingsEn: 'Amazon US Deal',
                dealPrice: '~$1,299.99',
                listPrice: '',
                titleEn: 'NIMO 17.3" AI Copilot+ Laptop · 12-Core AI 9 HX 370 · 64GB DDR5 · 4TB SSD · 144Hz FHD',
                titleAr: 'لابتوب NIMO 17.3 بوصة AI Copilot+ — معالج 12 نواة AI 9 HX 370 و64GB رام و4TB SSD',
                specs: '17.3" 144Hz FHD · 12-Core AI 9 HX 370 (50 TOPS) · 64GB DDR5 · 4TB SSD · Radeon 890M',
                image: '/assets/banners/amazon-bf-nimo-173-ai-copilot.jpg',
                url: 'https://link.amazon/B05atly2N',
              },
            ]
              .filter((p) => bfLaptopBrand === 'all' || p.brandGroup === bfLaptopBrand)
              .slice(0, bfLaptopBrand === 'all' && !showAllBfLaptops ? 6 : 20)
              .map((laptop) => (
                <div
                  key={laptop.id}
                  className="rounded-lg border border-zinc-200 bg-[#FAFAFA] hover:border-[#FF9900] hover:shadow-sm transition-all flex flex-col justify-between overflow-hidden"
                >
                  <div className="relative bg-white p-4 border-b border-zinc-100">
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <div className="flex items-center gap-1.5">
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[11px] font-extrabold bg-[#CC0C39] text-white rounded">
                          {laptop.discount}
                        </span>
                        <span className="px-2 py-0.5 text-[10px] font-bold bg-zinc-100 text-zinc-800 rounded">
                          {laptop.brandLabel}
                        </span>
                      </div>
                      <ShareButton
                        url={laptop.url}
                        shareId={laptop.id}
                        title={isAr ? laptop.titleAr : laptop.titleEn}
                        price={laptop.dealPrice}
                        oldPrice={laptop.listPrice}
                        discount={laptop.discount}
                        isAr={isAr}
                        compact
                        dropDirection="down"
                      />
                    </div>
                    <a
                      href={laptop.url}
                      target="_blank"
                      rel="nofollow noopener noreferrer"
                      className="block w-full h-44 flex items-center justify-center"
                    >
                      <img
                        src={laptop.image}
                        alt={laptop.titleEn}
                        referrerPolicy="no-referrer"
                        className="max-h-full max-w-full object-contain"
                      />
                    </a>
                  </div>

                  <div className="p-3.5 flex-1 flex flex-col justify-between gap-2.5">
                    <div>
                      <div className="flex flex-wrap items-baseline gap-2">
                        <span className="font-display font-extrabold text-xl text-zinc-950">
                          {laptop.dealPrice}
                        </span>
                        {laptop.listPrice && (
                          <span className="text-xs text-zinc-500 line-through">
                            {laptop.listPrice}
                          </span>
                        )}
                        <span className="px-1.5 py-0.5 text-[10px] font-extrabold bg-emerald-100 text-emerald-900 rounded">
                          {isAr ? laptop.savingsAr : laptop.savingsEn}
                        </span>
                      </div>

                      <h3 className="mt-1.5 font-display text-sm font-bold text-zinc-950 leading-snug line-clamp-2">
                        {isAr ? laptop.titleAr : laptop.titleEn}
                      </h3>
                      <p className="mt-1 text-[11px] text-zinc-600 line-clamp-1">
                        {laptop.specs}
                      </p>
                    </div>

                    <a
                      href={laptop.url}
                      target="_blank"
                      rel="nofollow noopener noreferrer"
                      className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-2 bg-[#FFD814] hover:bg-[#F7CA00] text-zinc-950 border border-[#FCD200] text-xs font-extrabold rounded-full transition-colors"
                    >
                      <span>
                        {isAr
                          ? 'احصل على العرض في أمازون أمريكا'
                          : 'Shop Laptop Deal on Amazon US'}
                      </span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              ))}
          </div>

          {bfLaptopBrand === 'all' && (
            <div className="mt-4 flex justify-center">
              <button
                type="button"
                onClick={() => setShowAllBfLaptops((prev) => !prev)}
                className="px-5 py-2 rounded-full bg-zinc-100 hover:bg-zinc-200 border border-zinc-300 text-xs font-extrabold text-zinc-900 transition-colors cursor-pointer"
              >
                {showAllBfLaptops
                  ? isAr
                    ? 'عرض أهم 6 لابتوبات فقط'
                    : 'Show Top 6 Laptop Deals'
                  : isAr
                    ? 'عرض جميع الـ 12 عرض لابتوب 2-in-1 (Lenovo · HP · Acer · Samsung · NIMO)'
                    : 'Show All 12 2-in-1 Laptop Deals (Lenovo · HP · Acer · Samsung · NIMO)'}
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Official Global Partner Admitad Banners Showcase */}
      <section aria-label="Featured Store Deals & Banners" className="px-3 sm:px-4 mt-3">
        <div className="bg-white border border-zinc-200/90 rounded-sm p-4 sm:p-5">
          <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-zinc-200">
            <span className="inline-block px-2.5 py-0.5 text-[11px] font-extrabold bg-[#00453E] text-[#FFD814] rounded">
              {t.officialPartnerBanner}
            </span>
            <button
              type="button"
              onClick={() => onNavigateProducts('tech')}
              className="text-xs font-bold text-[#007185] hover:text-[#C7511F] hover:underline cursor-pointer"
            >
              {t.exploreAllProducts}
            </button>
          </div>

          <div className="mt-4 grid grid-cols-1 @3xl/main:grid-cols-2 gap-4 items-stretch">
            {/* Dedicated Amazon UAE (أمازون الإمارات) Official Store Section */}
            <div className="@3xl/main:col-span-2 rounded-md border border-[#FF9900]/45 bg-gradient-to-r from-[#131921] via-[#1D2733] to-[#232F3E] text-white p-4 sm:p-5 flex flex-col @4xl/main:flex-row items-center justify-between gap-5 shadow-xs">
              <div className="space-y-2 text-center @4xl/main:text-start max-w-xl">
                <div className="inline-flex flex-wrap items-center justify-center @4xl/main:justify-start gap-2">
                  <span className="px-2.5 py-0.5 text-[11px] font-extrabold bg-[#FF9900] text-zinc-950 rounded whitespace-nowrap">
                    AMAZON UAE · أمازون الإمارات
                  </span>
                  <span className="text-[11px] font-semibold text-amber-200 whitespace-nowrap">
                    amazon.ae · {isAr ? 'القسم الرسمي لدولة الإمارات' : 'Official UAE Marketplace'}
                  </span>
                </div>
                <h3 className="font-display text-lg sm:text-xl font-extrabold text-white leading-snug">
                  {isAr
                    ? 'قسم أمازون الإمارات الرسمي — عروض اليوم، الإلكترونيات والمنتجات الأصلية'
                    : 'Amazon UAE Official Section — Daily Deals, Tech & Fast UAE Delivery'}
                </h3>
                <p className="text-xs sm:text-sm text-zinc-200 leading-relaxed">
                  {isAr
                    ? 'اكتشف أقوى العروض اليومية والتخفيضات المباشرة في متجر أمازون الإمارات (Amazon.ae) على أحدث الهواتف واللابتوبات والأجهزة المنزلية والإلكترونيات.'
                    : 'Explore verified daily deals, price drops, and seasonal savings on Amazon UAE (Amazon.ae) across smartphones, laptops, home essentials, and top electronics.'}
                </p>
                <div className="pt-1 flex flex-wrap items-center justify-center @4xl/main:justify-start gap-2">
                  <a
                    href="https://link.amazon/A0bb8XnUS"
                    target="_blank"
                    rel="nofollow noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#FFD814] hover:bg-[#F7CA00] text-zinc-950 border border-[#FCD200] text-xs font-extrabold rounded-full transition-colors whitespace-nowrap"
                  >
                    <span>{isAr ? 'تسوق الآن على أمازون الإمارات' : 'Shop Amazon UAE Now'}</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                  <button
                    type="button"
                    onClick={() => onSelectStore('amazon-uae')}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-white/10 hover:bg-white/20 text-white border border-white/25 text-xs font-bold rounded-full transition-colors cursor-pointer whitespace-nowrap"
                  >
                    <span>{isAr ? 'عرض كل عروض أمازون الإمارات' : 'Browse Amazon UAE Deals'}</span>
                  </button>
                  <ShareButton
                    url="https://link.amazon/A0bb8XnUS"
                    shareId="amazon-uae"
                    title={isAr ? 'قسم أمازون الإمارات الرسمي - Amazon UAE' : 'Amazon UAE Official Section'}
                    isAr={isAr}
                    dropDirection="down"
                    tone="dark"
                  />
                </div>
              </div>

              <a
                target="_blank"
                rel="nofollow noopener noreferrer"
                href="https://link.amazon/A0bb8XnUS"
                className="block max-w-[340px] w-full rounded-md overflow-hidden border border-white/25 bg-white shadow-md hover:scale-[1.01] transition-transform shrink-0"
              >
                <img
                  width={1200}
                  height={800}
                  src="/assets/images/hero_smart_shopping_1794810594006.jpg"
                  alt={isAr ? 'أمازون الإمارات - تسوق رسمي' : 'Amazon UAE Official Shopping Section'}
                  className="w-full h-44 object-cover block border-0"
                />
              </a>
            </div>

            {/* Dedicated Amazon Egypt (أمازون مصر) Official Store & Verified Bank Promo Codes */}
            <div className="@3xl/main:col-span-2 rounded-md border border-[#FF9900]/45 bg-gradient-to-r from-[#0F172A] via-[#1E293B] to-[#131921] text-white p-4 sm:p-5 space-y-4 shadow-xs">
              <div className="flex flex-col items-stretch gap-3.5">
                <div className="space-y-2 text-start max-w-3xl">
                  <div className="flex flex-wrap items-center justify-start gap-2">
                    <span className="inline-flex items-center px-2.5 py-0.5 text-[11px] font-extrabold bg-[#FF9900] text-zinc-950 rounded whitespace-nowrap shrink-0">
                      AMAZON EGYPT · أمازون مصر
                    </span>
                    <span className="text-[11px] font-semibold text-amber-200 whitespace-nowrap">
                      amazon.eg · {isAr ? 'القسم الرسمي وأكواد خصم البنوك' : 'Official Egypt Store & Bank Codes'}
                    </span>
                  </div>
                  <h3 className="font-display text-lg sm:text-xl font-extrabold text-white leading-snug">
                    {isAr
                      ? 'قسم أمازون مصر الرسمي — تخفيضات الجمعة البيضاء وأكواد خصم البنوك'
                      : 'Amazon Egypt Official Section — White Friday & Verified Bank Promo Codes'}
                  </h3>
                  <p className="text-xs sm:text-sm text-zinc-200 leading-relaxed">
                    {isAr
                      ? 'استفد من تخفيضات متجر أمازون مصر (Amazon.eg) واستخدم أكواد خصم البطاقات البنكية المتاحة أدناه للحصول على خصم فوري وتوفير مضمون عند الدفع.'
                      : 'Unlock White Friday discounts on Amazon Egypt (Amazon.eg) and apply verified bank card promo codes below for instant savings at checkout.'}
                  </p>
                </div>

                <div className="flex flex-wrap items-center justify-start gap-2">
                  <a
                    href="https://link.amazon/B0dzulgsu"
                    target="_blank"
                    rel="nofollow noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-zinc-900 hover:bg-zinc-800 text-[#FFD814] border border-[#FFD814]/60 text-xs font-extrabold rounded-full transition-colors whitespace-nowrap"
                  >
                    <span>{isAr ? 'عروض آبل الجمعة البيضاء' : 'Apple White Friday Deals'}</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                  <a
                    href="https://link.amazon/B00vB9BZN"
                    target="_blank"
                    rel="nofollow noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#CC0C39] hover:bg-[#a8082d] text-white border border-rose-400/50 text-xs font-extrabold rounded-full transition-colors whitespace-nowrap"
                  >
                    <span>{isAr ? 'عروض موبايلات الجمعة البيضاء' : 'White Friday Mobile Deals'}</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                  <a
                    href="https://link.amazon/B02evOzAd"
                    target="_blank"
                    rel="nofollow noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#FFD814] hover:bg-[#F7CA00] text-zinc-950 border border-[#FCD200] text-xs font-extrabold rounded-full transition-colors whitespace-nowrap"
                  >
                    <span>{isAr ? 'تسوق الآن على أمازون مصر' : 'Shop Amazon Egypt Now'}</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                  <button
                    type="button"
                    onClick={() => onSelectStore('amazon-eg')}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-white/10 hover:bg-white/20 text-white border border-white/25 text-xs font-bold rounded-full transition-colors cursor-pointer whitespace-nowrap"
                  >
                    <span>{isAr ? 'عرض كل عروض أمازون مصر' : 'Browse Amazon Egypt Deals'}</span>
                  </button>
                  <ShareButton
                    url="https://link.amazon/B00vB9BZN"
                    shareId="amz-eg-wf-mobiles"
                    title={isAr ? 'عروض موبايلات الجمعة البيضاء أمازون مصر - Amazon Egypt' : 'Amazon Egypt White Friday Mobiles'}
                    discount={isAr ? 'حتى 49% خصم' : 'UP TO 49% OFF'}
                    isAr={isAr}
                    dropDirection="down"
                    tone="dark"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 @2xl/main:grid-cols-2 @4xl/main:grid-cols-3 gap-3">
                {[
                  {
                    dealId: 'amz-eg-swype',
                    bank: 'CIB Swype',
                    headline: isAr ? '25% خصم حتى 250 جنيه' : '25% Off up to 250 EGP',
                    code: 'SWYPE25',
                    condition: isAr ? 'حد أدنى للطلب 1,000 جنيه · تطبق الشروط والأحكام' : 'Min. order 1,000 EGP · T&Cs apply',
                  },
                  {
                    dealId: 'amz-eg-abk',
                    bank: isAr ? 'البنك الأهلي الكويتي | ماستركارد' : 'ABK Mastercard',
                    headline: isAr ? '20% خصم حتى 2,000 جنيه' : '20% Off up to 2,000 EGP',
                    code: 'ABK20',
                    condition: isAr ? 'حد أدنى للطلب 2,500 جنيه · تطبق الشروط والأحكام' : 'Min. order 2,500 EGP · T&Cs apply',
                  },
                  {
                    dealId: 'amz-eg-qnb',
                    bank: 'QNB',
                    headline: isAr ? '10% خصم حتى 200 جنيه' : '10% Off up to 200 EGP',
                    code: 'QNBC200',
                    condition: isAr ? 'حد أدنى للطلب 500 جنيه · تطبق الشروط والأحكام' : 'Min. order 500 EGP · T&Cs apply',
                  },
                ].map((promo) => {
                  const egStore = stores.find((s) => s.id === 'amazon-eg');
                  const matchedDeal = egStore?.deals.find((d) => d.id === promo.dealId);
                  return (
                    <div
                      key={promo.dealId}
                      className="rounded-md bg-white text-zinc-950 p-3.5 border border-white/20 flex flex-col justify-between gap-2.5 min-w-0"
                    >
                      <div>
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-[11px] font-extrabold text-[#007185] truncate">
                            {promo.bank}
                          </span>
                          <span className="px-2 py-0.5 text-[10px] font-extrabold bg-emerald-100 text-emerald-900 rounded shrink-0">
                            Amazon.eg
                          </span>
                        </div>
                        <p className="mt-1 font-display text-sm font-extrabold text-zinc-950">
                          {promo.headline}
                        </p>
                        <p className="mt-0.5 text-[11px] text-zinc-600">
                          {promo.condition}
                        </p>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-xs bg-zinc-50 border border-dashed border-zinc-400 rounded px-2.5 py-1.5">
                          <span className="text-zinc-600 font-medium whitespace-nowrap">{t.promoCodeLabel}</span>
                          <code className="font-mono font-extrabold text-zinc-950 tracking-wider">
                            {promo.code}
                          </code>
                        </div>

                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => {
                              if (egStore && matchedDeal) {
                                onActivateDeal(matchedDeal, egStore);
                              } else {
                                onActivateDeal(
                                  {
                                    id: promo.dealId,
                                    title: `${promo.bank} — ${promo.headline}`,
                                    description: promo.condition,
                                    code: promo.code,
                                    discountLabel: promo.headline,
                                    affiliateUrl: 'https://link.amazon/B02evOzAd',
                                    featured: true,
                                    verifiedDate: 'Verified Nov 2026',
                                  },
                                  {
                                    id: 'amazon-eg',
                                    name: 'Amazon Egypt',
                                    domain: 'amazon.eg',
                                    matchDomains: ['amazon.eg'],
                                    category: 'Marketplaces',
                                    network: 'Amazon Egypt Store',
                                    brandColor: '#FF9900',
                                    affiliateUrl: 'https://link.amazon/B02evOzAd',
                                    tagline: 'Amazon Egypt Official Store',
                                    deals: [],
                                  }
                                );
                              }
                            }}
                            className="flex-1 min-w-0 inline-flex items-center justify-center gap-1.5 px-3 py-1.5 bg-[#FFD814] hover:bg-[#F7CA00] text-zinc-950 border border-[#FCD200] text-xs font-bold rounded-full transition-colors cursor-pointer whitespace-nowrap"
                          >
                            <Copy className="w-3.5 h-3.5 shrink-0" />
                            <span className="truncate">{t.copyCodeAndGo}</span>
                          </button>
                          <ShareButton
                            url="https://link.amazon/B02evOzAd"
                            shareId={promo.dealId}
                            title={`${promo.bank} (${promo.code}) - ${promo.headline} | Amazon Egypt`}
                            discount={promo.headline}
                            isAr={isAr}
                            compact
                            dropDirection="up"
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Amazon Egypt White Friday Mobiles Showcase Across 7 Brands (linked to https://link.amazon/B00vB9BZN) */}
              {(() => {
                const egPhones = [
                  {
                    id: 'eg-samsung-a37',
                    brandGroup: 'samsung',
                    brand: 'Samsung',
                    discount: '26% OFF',
                    price: '23,149 EGP',
                    oldPrice: '31,360 EGP',
                    savingsEn: 'Save 8,211 EGP',
                    savingsAr: 'وفّر 8,211 ج.م',
                    titleEn: 'Samsung Galaxy A37 5G · 256GB / 8GB · Charcoal',
                    titleAr: 'سامسونج جالكسي A37 5G · سعة 256GB / رام 8GB · رمادي',
                    specs: '5G Dual SIM · Local Egypt Warranty',
                    image: '/assets/banners/amazon-eg-samsung-a37.jpg',
                    url: 'https://link.amazon/B00vB9BZN',
                  },
                  {
                    id: 'eg-infinix-smart20',
                    brandGroup: 'other',
                    brand: 'Infinix',
                    discount: '18% OFF',
                    price: '8,599 EGP',
                    oldPrice: '10,444 EGP',
                    savingsEn: 'Save 1,845 EGP',
                    savingsAr: 'وفّر 1,845 ج.م',
                    titleEn: 'Infinix Smart 20 · 128GB / 4GB · 5200mAh',
                    titleAr: 'انفينيكس سمارت 20 · سعة 128GB / رام 4GB · 5200mAh',
                    specs: '6.78" IPS · Android 16 · IP64',
                    image: '/assets/banners/amazon-eg-infinix-smart-20.jpg',
                    url: 'https://link.amazon/B00vB9BZN',
                  },
                  {
                    id: 'eg-redmi-17',
                    brandGroup: 'xiaomi',
                    brand: 'Xiaomi Redmi',
                    discount: '17% OFF',
                    price: '10,999 EGP',
                    oldPrice: '13,299 EGP',
                    savingsEn: 'Save 2,300 EGP',
                    savingsAr: 'وفّر 2,300 ج.م',
                    titleEn: 'Xiaomi Redmi 17 · 256GB / 4GB · 7500mAh',
                    titleAr: 'شاومي ريدمي 17 · سعة 256GB / رام 4GB · بطارية 7500mAh',
                    specs: '6.9" 120Hz FHD+ · 50MP AI Camera',
                    image: '/assets/banners/amazon-eg-redmi-17.jpg',
                    url: 'https://link.amazon/B00vB9BZN',
                  },
                  {
                    id: 'eg-honor-x9d',
                    brandGroup: 'honor',
                    brand: 'HONOR',
                    discount: '16% OFF',
                    price: '18,999 EGP',
                    oldPrice: '22,499 EGP',
                    savingsEn: 'Save 3,500 EGP',
                    savingsAr: 'وفّر 3,500 ج.م',
                    titleEn: 'HONOR X9d 5G · 256GB / 8GB · 66W SuperCharge',
                    titleAr: 'هونر X9d 5G · سعة 256GB / رام 8GB · شحن 66W',
                    specs: '6.79" 1.5K 120Hz AMOLED · Snapdragon 6 Gen 4',
                    image: '/assets/banners/amazon-eg-honor-x9d.jpg',
                    url: 'https://link.amazon/B00vB9BZN',
                  },
                  {
                    id: 'eg-redmi-17-5g',
                    brandGroup: 'xiaomi',
                    brand: 'Xiaomi Redmi',
                    discount: '16% OFF',
                    price: '13,999 EGP',
                    oldPrice: '16,599 EGP',
                    savingsEn: 'Save 2,600 EGP',
                    savingsAr: 'وفّر 2,600 ج.م',
                    titleEn: 'Xiaomi Redmi 17 5G · 256GB / 6GB · Snapdragon',
                    titleAr: 'شاومي ريدمي 17 5G · سعة 256GB / رام 6GB · سناب دراجون',
                    specs: '7500mAh · 45W Fast Charge · 6.9" 120Hz',
                    image: '/assets/banners/amazon-eg-redmi-17-5g.jpg',
                    url: 'https://link.amazon/B00vB9BZN',
                  },
                  {
                    id: 'eg-samsung-a08',
                    brandGroup: 'samsung',
                    brand: 'Samsung',
                    discount: '15% OFF',
                    price: '10,749 EGP',
                    oldPrice: '12,620 EGP',
                    savingsEn: 'Save 1,871 EGP',
                    savingsAr: 'وفّر 1,871 ج.م',
                    titleEn: 'Samsung Galaxy A08 LTE · 128GB / 4GB · 6000mAh',
                    titleAr: 'سامسونج جالكسي A08 · سعة 128GB / رام 4GB · بطارية 6000mAh',
                    specs: '6.7" Display · 50MP · 6 OS Upgrades',
                    image: '/assets/banners/amazon-eg-samsung-a08.jpg',
                    url: 'https://link.amazon/B00vB9BZN',
                  },
                  {
                    id: 'eg-samsung-a57',
                    brandGroup: 'samsung',
                    brand: 'Samsung',
                    discount: '13% OFF',
                    price: '31,049 EGP',
                    oldPrice: '35,805 EGP',
                    savingsEn: 'Save 4,756 EGP',
                    savingsAr: 'وفّر 4,756 ج.م',
                    titleEn: 'Samsung Galaxy A57 5G · 256GB / 12GB · Ice Blue',
                    titleAr: 'سامسونج جالكسي A57 5G · سعة 256GB / رام 12GB · أزرق',
                    specs: '50MP Triple Cam · 6 OS Upgrades · Local Warranty',
                    image: '/assets/banners/amazon-eg-samsung-a57.jpg',
                    url: 'https://link.amazon/B00vB9BZN',
                  },
                  {
                    id: 'eg-oppo-reno16f',
                    brandGroup: 'oppo',
                    brand: 'OPPO',
                    discount: '10% OFF',
                    price: '28,636.05 EGP',
                    oldPrice: '31,733.12 EGP',
                    savingsEn: 'Save 3,097 EGP',
                    savingsAr: 'وفّر 3,097 ج.م',
                    titleEn: 'OPPO Reno 16 F 5G · 256GB / 8GB · Pop White',
                    titleAr: 'أوبو رينو 16 F 5G · سعة 256GB / رام 8GB · أبيض',
                    specs: '5G Dual SIM · Local Egypt Warranty',
                    image: '/assets/banners/amazon-eg-oppo-reno-16f.jpg',
                    url: 'https://link.amazon/B00vB9BZN',
                  },
                  {
                    id: 'eg-samsung-a17',
                    brandGroup: 'samsung',
                    brand: 'Samsung',
                    discount: '10% OFF',
                    price: '16,599 EGP',
                    oldPrice: '18,355 EGP',
                    savingsEn: 'Save 1,756 EGP',
                    savingsAr: 'وفّر 1,756 ج.م',
                    titleEn: 'Samsung Galaxy A17 LTE · 256GB / 8GB · Blue',
                    titleAr: 'سامسونج جالكسي A17 · سعة 256GB / رام 8GB · أزرق',
                    specs: '50MP OIS Camera · 6 OS Upgrades',
                    image: '/assets/banners/amazon-eg-samsung-a17.jpg',
                    url: 'https://link.amazon/B00vB9BZN',
                  },
                  {
                    id: 'eg-realme-c85pro',
                    brandGroup: 'other',
                    brand: 'Realme',
                    discount: '9% OFF',
                    price: '16,282.21 EGP',
                    oldPrice: '17,910 EGP',
                    savingsEn: 'Save 1,628 EGP',
                    savingsAr: 'وفّر 1,628 ج.م',
                    titleEn: 'Realme C85 Pro AI · 256GB / 8GB · 108MP Quad',
                    titleAr: 'ريلمي C85 برو AI · سعة 256GB / رام 8GB · كاميرا 108MP',
                    specs: '67W Super Charge · 256GB Storage',
                    image: '/assets/banners/amazon-eg-realme-c85-pro.jpg',
                    url: 'https://link.amazon/B00vB9BZN',
                  },
                  {
                    id: 'eg-oppo-a6',
                    brandGroup: 'oppo',
                    brand: 'OPPO',
                    discount: '9% OFF',
                    price: '14,792.86 EGP',
                    oldPrice: '16,272 EGP',
                    savingsEn: 'Save 1,479 EGP',
                    savingsAr: 'وفّر 1,479 ج.م',
                    titleEn: 'OPPO A6 4G · 128GB / 6GB · 45W SUPERVOOC',
                    titleAr: 'أوبو A6 4G · سعة 128GB / رام 6GB · شحن 45W',
                    specs: '45W SUPERVOOC · Dual SIM · Local Warranty',
                    image: '/assets/banners/amazon-eg-oppo-a6.jpg',
                    url: 'https://link.amazon/B00vB9BZN',
                  },
                  {
                    id: 'eg-samsung-s25u',
                    brandGroup: 'samsung',
                    brand: 'Samsung',
                    discount: '8% OFF',
                    price: '67,999 EGP',
                    oldPrice: '73,825 EGP',
                    savingsEn: 'Save 5,826 EGP',
                    savingsAr: 'وفّر 5,826 ج.م',
                    titleEn: 'Samsung Galaxy S25 Ultra AI · 512GB / 12GB',
                    titleAr: 'سامسونج جالكسي S25 الترا AI · سعة 512GB / رام 12GB',
                    specs: '200MP Camera · S Pen · Local Egypt Warranty',
                    image: '/assets/banners/amazon-eg-samsung-s25-ultra.jpg',
                    url: 'https://link.amazon/B00vB9BZN',
                  },
                  {
                    id: 'eg-xiaomi-17t',
                    brandGroup: 'xiaomi',
                    brand: 'Xiaomi',
                    discount: '8% OFF',
                    price: '37,777 EGP',
                    oldPrice: '40,999 EGP',
                    savingsEn: 'Save 3,222 EGP',
                    savingsAr: 'وفّر 3,222 ج.م',
                    titleEn: 'Xiaomi 17T 5G · 512GB / 12GB · Leica + Watch',
                    titleAr: 'شاومي 17T 5G · سعة 512GB / رام 12GB · كاميرا لايكا + ساعة',
                    specs: '6500mAh · 67W + Free Redmi Watch 5 Active',
                    image: '/assets/banners/amazon-eg-xiaomi-17t.jpg',
                    url: 'https://link.amazon/B00vB9BZN',
                  },
                  {
                    id: 'eg-honor-600lite',
                    brandGroup: 'honor',
                    brand: 'HONOR',
                    discount: '8% OFF',
                    price: '17,999 EGP',
                    oldPrice: '19,549 EGP',
                    savingsEn: 'Save 1,550 EGP',
                    savingsAr: 'وفّر 1,550 ج.م',
                    titleEn: 'HONOR 600 Lite 5G · 128GB / 8GB · 6520mAh',
                    titleAr: 'هونر 600 لايت 5G · سعة 128GB / رام 8GB · بطارية 6520mAh',
                    specs: '108MP AI Camera · IP66 Water Resistant',
                    image: '/assets/banners/amazon-eg-honor-600-lite.jpg',
                    url: 'https://link.amazon/B00vB9BZN',
                  },
                  {
                    id: 'eg-honor-x5c',
                    brandGroup: 'honor',
                    brand: 'HONOR',
                    discount: '8% OFF',
                    price: '8,299 EGP',
                    oldPrice: '8,999 EGP',
                    savingsEn: 'Save 700 EGP',
                    savingsAr: 'وفّر 700 ج.م',
                    titleEn: 'HONOR X5c Plus 4G · 128GB / 4GB · 5260mAh',
                    titleAr: 'هونر X5c بلس 4G · سعة 128GB / رام 4GB · بطارية 5260mAh',
                    specs: '50MP AI Dual Cam · Ocean Cyan',
                    image: '/assets/banners/amazon-eg-honor-x5c-plus.jpg',
                    url: 'https://link.amazon/B00vB9BZN',
                  },
                  {
                    id: 'eg-redmi-note17pro',
                    brandGroup: 'xiaomi',
                    brand: 'Xiaomi Redmi',
                    discount: '7% OFF',
                    price: '26,666 EGP',
                    oldPrice: '28,799 EGP',
                    savingsEn: 'Save 2,133 EGP',
                    savingsAr: 'وفّر 2,133 ج.م',
                    titleEn: 'Redmi Note 17 Pro 5G · 256GB / 12GB + Buds',
                    titleAr: 'ريدمي نوت 17 برو 5G · سعة 256GB / رام 12GB + سماعة',
                    specs: '8340mAh · 67W + Free Redmi Buds 8 Active',
                    image: '/assets/banners/amazon-eg-redmi-note-17-pro.jpg',
                    url: 'https://link.amazon/B00vB9BZN',
                  },
                  {
                    id: 'eg-iphone-17',
                    brandGroup: 'apple',
                    brand: 'Apple',
                    discount: '4% OFF',
                    price: '69,900 EGP',
                    oldPrice: '72,900 EGP',
                    savingsEn: 'Save 3,000 EGP',
                    savingsAr: 'وفّر 3,000 ج.م',
                    titleEn: 'Apple iPhone 17 · 256GB White · Tax Paid Egypt',
                    titleAr: 'آبل آيفون 17 · سعة 256GB أبيض · مدفوع الضريبة (ضمان سنتين)',
                    specs: 'Face ID · Official 2-Yr Egypt Warranty',
                    image: '/assets/banners/amazon-eg-iphone-17.jpg',
                    url: 'https://link.amazon/B00vB9BZN',
                  },
                  {
                    id: 'amz-eg-iphone17-promax',
                    brandGroup: 'apple',
                    brand: 'Apple',
                    discount: '12% OFF',
                    price: '94,999 EGP',
                    oldPrice: '107,700 EGP',
                    savingsEn: 'Save 12,701 EGP',
                    savingsAr: 'وفّر 12,701 ج.م',
                    titleEn: 'Apple iPhone 17 Pro Max · 256GB Deep Blue · Tax Paid',
                    titleAr: 'آبل آيفون 17 برو ماكس · 256GB أزرق داكن · مدفوع الضريبة (ضمان سنتين)',
                    specs: 'White Friday Apple · Official 2-Yr Egypt Warranty',
                    image: '/assets/banners/amazon-eg-iphone17-promax.jpg',
                    url: 'https://link.amazon/B0dzulgsu',
                  },
                  {
                    id: 'amz-eg-iphone17-pro',
                    brandGroup: 'apple',
                    brand: 'Apple',
                    discount: '5% OFF',
                    price: '92,833 EGP',
                    oldPrice: '97,900 EGP',
                    savingsEn: 'Save 5,067 EGP',
                    savingsAr: 'وفّر 5,067 ج.م',
                    titleEn: 'Apple iPhone 17 Pro · 256GB Silver · Tax Paid',
                    titleAr: 'آبل آيفون 17 برو · 256GB فضي · مدفوع الضريبة (ضمان سنتين)',
                    specs: 'White Friday Apple · Official 2-Yr Egypt Warranty',
                    image: '/assets/banners/amazon-eg-iphone17-pro.jpg',
                    url: 'https://link.amazon/B0dzulgsu',
                  },
                  {
                    id: 'amz-eg-iphone17e-512',
                    brandGroup: 'apple',
                    brand: 'Apple',
                    discount: '5% OFF',
                    price: '69,354.49 EGP',
                    oldPrice: '73,300 EGP',
                    savingsEn: 'Save 3,945.51 EGP',
                    savingsAr: 'وفّر 3,945 ج.م',
                    titleEn: 'Apple iPhone 17e · 512GB Black · A19 Chip',
                    titleAr: 'آبل آيفون 17e · سعة 512GB أسود · شريحة A19 (ضمان سنتين)',
                    specs: '6.1" Super Retina XDR · 48MP Fusion',
                    image: '/assets/banners/amazon-eg-iphone17e-512.jpg',
                    url: 'https://link.amazon/B0dzulgsu',
                  },
                  {
                    id: 'amz-eg-iphone-air',
                    brandGroup: 'apple',
                    brand: 'Apple',
                    discount: '5% OFF',
                    price: '73,999 EGP',
                    oldPrice: '77,700 EGP',
                    savingsEn: 'Save 3,701 EGP',
                    savingsAr: 'وفّر 3,701 ج.م',
                    titleEn: 'Apple iPhone Air · 256GB Cloud White · Tax Paid',
                    titleAr: 'آبل آيفون Air · سعة 256GB أبيض سحابي · مدفوع الضريبة',
                    specs: 'Ultra-Slim Apple · Official 2-Yr Egypt Warranty',
                    image: '/assets/banners/amazon-eg-iphone-air.jpg',
                    url: 'https://link.amazon/B0dzulgsu',
                  },
                  {
                    id: 'amz-eg-iphone16-plus',
                    brandGroup: 'apple',
                    brand: 'Apple',
                    discount: 'WHITE FRIDAY',
                    price: '74,444 EGP',
                    oldPrice: '77,900 EGP',
                    savingsEn: '2-Yr Egypt Warranty',
                    savingsAr: 'ضمان سنتين · الجمعة البيضاء',
                    titleEn: 'Apple iPhone 16 Plus · 256GB Ultramarine · Tax Paid',
                    titleAr: 'آبل آيفون 16 بلس · 256GB ألترامارين · مدفوع الضريبة',
                    specs: 'Face ID · Official 2-Yr Egypt Warranty',
                    image: '/assets/banners/amazon-eg-iphone16-plus.jpg',
                    url: 'https://link.amazon/B0dzulgsu',
                  },
                  {
                    id: 'amz-eg-iphone16-pink',
                    brandGroup: 'apple',
                    brand: 'Apple',
                    discount: 'WHITE FRIDAY',
                    price: '65,699 EGP',
                    oldPrice: '68,900 EGP',
                    savingsEn: '2-Yr Egypt Warranty',
                    savingsAr: 'ضمان سنتين · الجمعة البيضاء',
                    titleEn: 'Apple iPhone 16 · 128GB Pink · Tax Paid Egypt',
                    titleAr: 'آبل آيفون 16 · 128GB وردي · مدفوع الضريبة (ضمان سنتين)',
                    specs: 'Face ID · Official 2-Yr Egypt Warranty',
                    image: '/assets/banners/amazon-eg-iphone16-pink.jpg',
                    url: 'https://link.amazon/B0dzulgsu',
                  },
                  {
                    id: 'amz-eg-apple-60w',
                    brandGroup: 'apple',
                    brand: 'Apple',
                    discount: '49% OFF',
                    price: '1,691 EGP',
                    oldPrice: '3,333 EGP',
                    savingsEn: 'Save 1,642 EGP',
                    savingsAr: 'وفّر 1,642 ج.م',
                    titleEn: 'Apple 40W–60W Dynamic Power Adapter · Original USB-C',
                    titleAr: 'شاحن آبل الديناميكي السريع 40W–60W · أصلي USB-C',
                    specs: 'Apple Genuine Accessory · White Friday 49% Off',
                    image: '/assets/banners/amazon-eg-apple-60w-adapter.jpg',
                    url: 'https://link.amazon/B0dzulgsu',
                  },
                  {
                    id: 'amz-eg-apple-20w',
                    brandGroup: 'apple',
                    brand: 'Apple',
                    discount: '49% OFF',
                    price: '645 EGP',
                    oldPrice: '1,260 EGP',
                    savingsEn: 'Save 615 EGP',
                    savingsAr: 'وفّر 615 ج.م',
                    titleEn: 'Apple 20W USB-C Power Adapter · Genuine Charger',
                    titleAr: 'رأس شاحن آبل 20 وات الأصلي USB-C · أمازون مصر',
                    specs: 'Fast Charge · White Friday 49% Off',
                    image: '/assets/banners/amazon-eg-apple-20w-adapter.jpg',
                    url: 'https://link.amazon/B0dzulgsu',
                  },
                  {
                    id: 'amz-eg-apple-cable',
                    brandGroup: 'apple',
                    brand: 'Apple',
                    discount: '17% OFF',
                    price: '750 EGP',
                    oldPrice: '899.99 EGP',
                    savingsEn: 'Save 150 EGP',
                    savingsAr: 'وفّر 150 ج.م',
                    titleEn: 'Apple 60W USB-C Woven Charge Cable (1m) · Original',
                    titleAr: 'كابل شحن آبل الأصلي المضفر USB-C بقدرة 60W (طول 1 متر)',
                    specs: 'Apple Woven Design · USB-C to USB-C 1m',
                    image: '/assets/banners/amazon-eg-apple-usbc-cable.jpg',
                    url: 'https://link.amazon/B0dzulgsu',
                  },
                ];

                const filteredEgPhones =
                  egPhoneBrand === 'all'
                    ? egPhones
                    : egPhones.filter((p) => p.brandGroup === egPhoneBrand);
                const visibleEgPhones =
                  egPhoneBrand === 'all' && !showAllEgPhones
                    ? filteredEgPhones.slice(0, 8)
                    : filteredEgPhones;

                return (
                  <div className="pt-4 border-t border-white/15 space-y-3">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="px-2 py-0.5 text-[11px] font-extrabold bg-[#CC0C39] text-white rounded whitespace-nowrap">
                          {isAr ? 'موبايلات وآبل الجمعة البيضاء · خصومات حتى 49%' : 'WHITE FRIDAY MOBILES & APPLE · UP TO 49% OFF'}
                        </span>
                        <span className="text-xs text-zinc-200 font-medium">
                          {isAr
                            ? 'خصومات متنوعة لكل ماركة موبايل وعروض آبل بالأسعار الحية بالجنيه المصري (EGP)'
                            : 'Live discounts across 7 mobile brands & Apple deals in Egyptian Pounds (EGP)'}
                        </span>
                      </div>
                      <div className="flex flex-wrap items-center gap-3">
                        <a
                          href="https://link.amazon/B0dzulgsu"
                          target="_blank"
                          rel="nofollow noopener noreferrer"
                          className="text-xs font-bold text-amber-300 hover:underline inline-flex items-center gap-1 whitespace-nowrap"
                        >
                          <span>{isAr ? 'تصفح عروض آبل على أمازون مصر' : 'Shop Apple Deals on Amazon.eg'}</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                        <a
                          href="https://link.amazon/B00vB9BZN"
                          target="_blank"
                          rel="nofollow noopener noreferrer"
                          className="text-xs font-bold text-[#FFD814] hover:underline inline-flex items-center gap-1 whitespace-nowrap"
                        >
                          <span>{isAr ? 'تصفح كل عروض الموبايلات على أمازون مصر' : 'View All Mobiles on Amazon.eg'}</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    </div>

                    {/* Brand Filter Tabs */}
                    <div className="flex flex-wrap items-center gap-1.5">
                      {[
                        { id: 'all', labelEn: 'All Brands (26)', labelAr: 'كل الماركات (26)' },
                        { id: 'apple', labelEn: 'Apple White Friday (10)', labelAr: 'آبل الجمعة البيضاء (10)' },
                        { id: 'samsung', labelEn: 'Samsung (5)', labelAr: 'سامسونج (5)' },
                        { id: 'xiaomi', labelEn: 'Xiaomi & Redmi (4)', labelAr: 'شاومي وريدمي (4)' },
                        { id: 'honor', labelEn: 'HONOR (3)', labelAr: 'هونر (3)' },
                        { id: 'oppo', labelEn: 'OPPO (2)', labelAr: 'أوبو (2)' },
                        { id: 'other', labelEn: 'Realme · Infinix (2)', labelAr: 'ريلمي · انفينيكس (2)' },
                      ].map((tab) => {
                        const active = egPhoneBrand === tab.id;
                        return (
                          <button
                            key={tab.id}
                            type="button"
                            onClick={() => setEgPhoneBrand(tab.id)}
                            className={`px-3 py-1.5 rounded-full text-[11px] font-extrabold border transition-colors cursor-pointer whitespace-nowrap ${
                              active
                                ? 'bg-[#FFD814] text-zinc-950 border-[#FCD200]'
                                : 'bg-white/10 text-white border-white/20 hover:bg-white/20'
                            }`}
                          >
                            {isAr ? tab.labelAr : tab.labelEn}
                          </button>
                        );
                      })}
                    </div>

                    <div className="grid grid-cols-1 @md/main:grid-cols-2 @3xl/main:grid-cols-3 @5xl/main:grid-cols-4 gap-3">
                      {visibleEgPhones.map((phone) => (
                        <div
                          key={phone.id}
                          className="rounded-lg bg-white text-zinc-950 border border-white/20 overflow-hidden shadow-xs flex flex-col justify-between hover:border-[#FFD814] transition-colors"
                        >
                          <div>
                            <div className="relative h-44 bg-white p-3 flex items-center justify-center border-b border-zinc-100">
                              <a
                                href={phone.url}
                                target="_blank"
                                rel="nofollow noopener noreferrer"
                                className="w-full h-full flex items-center justify-center group"
                              >
                                <img
                                  src={phone.image}
                                  alt={isAr ? phone.titleAr : phone.titleEn}
                                  referrerPolicy="no-referrer"
                                  className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-200"
                                />
                              </a>
                              <span className="absolute top-2 start-2 px-2 py-0.5 text-[11px] font-extrabold bg-[#CC0C39] text-white rounded-xs shadow-xs tabular-nums">
                                {phone.discount}
                              </span>
                              <span className="absolute bottom-2 start-2 px-2 py-0.5 text-[10px] font-bold bg-zinc-900 text-white rounded-xs">
                                {phone.brand}
                              </span>
                              <div className="absolute top-2 end-2">
                                <ShareButton
                                  url={phone.url}
                                  shareId={phone.id}
                                  title={isAr ? phone.titleAr : phone.titleEn}
                                  price={phone.price}
                                  oldPrice={phone.oldPrice}
                                  discount={phone.discount}
                                  isAr={isAr}
                                  compact
                                  dropDirection="down"
                                />
                              </div>
                            </div>

                            <div className="p-3 space-y-1.5">
                              <div className="flex flex-wrap items-baseline justify-between gap-1">
                                <div className="flex flex-wrap items-baseline gap-1.5">
                                  <span className="font-display text-base font-extrabold text-[#B12704] tabular-nums">
                                    {phone.price}
                                  </span>
                                  <span className="text-[11px] text-zinc-500 line-through tabular-nums">
                                    {phone.oldPrice}
                                  </span>
                                </div>
                                <span className="text-[10px] font-extrabold text-emerald-800 bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 rounded">
                                  {isAr ? phone.savingsAr : phone.savingsEn}
                                </span>
                              </div>
                              <h4 className="font-display text-xs font-extrabold text-zinc-950 leading-snug line-clamp-2">
                                <a
                                  href={phone.url}
                                  target="_blank"
                                  rel="nofollow noopener noreferrer"
                                  className="hover:text-[#C7511F] hover:underline"
                                >
                                  {isAr ? phone.titleAr : phone.titleEn}
                                </a>
                              </h4>
                              <p className="text-[11px] text-zinc-600 line-clamp-1">
                                {phone.specs}
                              </p>
                            </div>
                          </div>

                          <div className="px-3 pb-3">
                            <a
                              href={phone.url}
                              target="_blank"
                              rel="nofollow noopener noreferrer"
                              className="w-full py-1.5 px-3 bg-[#FFD814] hover:bg-[#F7CA00] text-zinc-950 border border-[#FCD200] text-xs font-bold rounded-full transition-colors flex items-center justify-center gap-1.5 whitespace-nowrap"
                            >
                              <span>{isAr ? 'تسوق العرض على أمازون مصر' : 'View Deal on Amazon.eg'}</span>
                              <ExternalLink className="w-3.5 h-3.5 shrink-0" />
                            </a>
                          </div>
                        </div>
                      ))}
                    </div>

                    {egPhoneBrand === 'all' && filteredEgPhones.length > 8 && (
                      <div className="flex justify-center pt-1">
                        <button
                          type="button"
                          onClick={() => setShowAllEgPhones((prev) => !prev)}
                          className="inline-flex items-center gap-1.5 px-5 py-2 bg-white/10 hover:bg-white/20 text-white border border-white/25 text-xs font-extrabold rounded-full transition-colors cursor-pointer"
                        >
                          <span>
                            {showAllEgPhones
                              ? isAr
                                ? 'عرض أهم 8 موبايلات فقط'
                                : 'Show Top 8 Mobiles Only'
                              : isAr
                              ? `عرض جميع الموبايلات وآبل (${filteredEgPhones.length} عرضاً)`
                              : `Show All ${filteredEgPhones.length} Brand Mobile & Apple Deals`}
                          </span>
                        </button>
                      </div>
                    )}
                  </div>
                );
              })()}
            </div>

            {/* Dedicated Amazon Japan (أمازون اليابان) Section */}
            <div className="@3xl/main:col-span-2 rounded-md border border-[#FF9900]/55 bg-gradient-to-br from-[#18181B] via-[#27272A] to-[#131921] text-white p-4 sm:p-5 space-y-5 shadow-xs">
              <div className="flex flex-col @5xl/main:flex-row items-center justify-between gap-5">
                <div className="space-y-2 text-center @5xl/main:text-start max-w-xl">
                  <div className="inline-flex flex-wrap items-center justify-center @5xl/main:justify-start gap-2">
                    <span className="px-2.5 py-0.5 text-[11px] font-extrabold bg-[#FF9900] text-zinc-950 rounded whitespace-nowrap">
                      AMAZON JAPAN · أمازون اليابان
                    </span>
                    <span className="px-2 py-0.5 text-[11px] font-extrabold bg-[#CC0C39] text-white rounded whitespace-nowrap">
                      {isAr ? 'مواعيد الجمعة السوداء / البيضاء: 30 نوفمبر – 7 ديسمبر' : 'BLACK FRIDAY: NOV 30 – DEC 7'}
                    </span>
                    <span className="text-[11px] font-semibold text-amber-200 whitespace-nowrap">
                      amazon.co.jp · SIM-Free &amp; Tech Deals
                    </span>
                  </div>
                  <h3 className="font-display text-lg sm:text-xl font-extrabold text-white leading-snug">
                    {isAr
                      ? 'قسم أمازون اليابان — مواعيد الجمعة البيضاء / السوداء (30 نوفمبر – 7 ديسمبر) وأفضل العروض'
                      : 'Amazon Japan Section — Black Friday Schedule (Nov 30 – Dec 7), SIM-Free Phones & Coupons'}
                  </h3>
                  <p className="text-xs sm:text-sm text-zinc-200 leading-relaxed">
                    {isAr
                      ? 'ترقّب عروض الجمعة البيضاء / السوداء على أمازون اليابان من 30 نوفمبر حتى 7 ديسمبر! استكشف أقوى تخفيضات الهواتف غير المقفلة (SIM-Free) واكسسوارات الحماية العسكرية بأسعار الين الياباني المباشرة.'
                      : 'Save the date! Amazon Japan Black Friday runs Nov 30 – Dec 7. Shop top unlocked SIM-free smartphones & US military-grade protective cases in JPY with clip coupons.'}
                  </p>
                  <div className="pt-1 flex flex-wrap items-center justify-center @5xl/main:justify-start gap-2">
                    <a
                      href="https://link.amazon/B08EQakmz"
                      target="_blank"
                      rel="nofollow noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#FFD814] hover:bg-[#F7CA00] text-zinc-950 border border-[#FCD200] text-xs font-extrabold rounded-full transition-colors whitespace-nowrap"
                    >
                      <span>{isAr ? 'تصفح أفضل الهواتف على أمازون اليابان' : 'Shop Amazon Japan SIM-Free Phones'}</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                    <a
                      href="https://link.amazon/B0g6Fde52"
                      target="_blank"
                      rel="nofollow noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#FF9900] hover:bg-[#e68a00] text-zinc-950 border border-[#FF9900] text-xs font-extrabold rounded-full transition-colors whitespace-nowrap"
                    >
                      <span>{isAr ? 'عروض وكوبونات الهواتف اليابان' : 'Amazon Japan Phone Coupons'}</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                    <a
                      href="https://link.amazon/A0fp80WvH"
                      target="_blank"
                      rel="nofollow noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-white/10 hover:bg-white/20 text-white border border-white/25 text-xs font-bold rounded-full transition-colors whitespace-nowrap"
                    >
                      <span>{isAr ? 'متجر أمازون اليابان' : 'Amazon Japan Store'}</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                    <button
                      type="button"
                      onClick={() => onSelectStore('amazon-jp')}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-white/10 hover:bg-white/20 text-white border border-white/25 text-xs font-bold rounded-full transition-colors cursor-pointer whitespace-nowrap"
                    >
                      <span>{isAr ? 'عرض قسم أمازون اليابان' : 'Browse Section'}</span>
                    </button>
                    <ShareButton
                      url="https://link.amazon/B0g6Fde52"
                      shareId="amz-jp-blackfriday-dates"
                      title={isAr ? 'مواعيد الجمعة السوداء / البيضاء أمازون اليابان (30 نوفمبر – 7 ديسمبر)' : 'Amazon Japan Black Friday Schedule (Nov 30 – Dec 7)'}
                      discount={isAr ? '30 نوفمبر – 7 ديسمبر' : 'Nov 30 – Dec 7'}
                      isAr={isAr}
                      dropDirection="down"
                      tone="dark"
                    />
                  </div>
                </div>

                {/* Black Friday Schedule Announcement Image + Japan Coupon Banner Side by Side */}
                <div className="grid grid-cols-1 @sm/main:grid-cols-2 gap-3 shrink-0 w-full @5xl/main:w-auto">
                  <a
                    target="_blank"
                    rel="nofollow noopener noreferrer"
                    href="https://link.amazon/B0g6Fde52"
                    className="group relative block max-w-[260px] mx-auto w-full rounded-lg overflow-hidden border-2 border-[#FFD814]/80 bg-zinc-900 shadow-lg hover:scale-[1.015] transition-transform"
                  >
                    <img
                      width={1200}
                      height={1200}
                      src="/assets/aistudio/image_b648bbfa.png"
                      alt={isAr ? 'مواعيد الجمعة البيضاء / السوداء أمازون اليابان 30 نوفمبر - 7 ديسمبر' : 'Amazon Japan Black Friday is back Nov 30 - Dec 7 Save the date'}
                      className="w-full h-52 object-cover block border-0"
                    />
                    <div className="bg-[#131921]/95 px-3 py-2 flex items-center justify-between gap-2 text-xs font-extrabold text-[#FFD814]">
                      <span>{isAr ? 'مواعيد البلاك فرايدي: 30 نوفمبر – 7 ديسمبر' : 'Black Friday: Nov 30 – Dec 7'}</span>
                      <ExternalLink className="w-3.5 h-3.5 shrink-0" />
                    </div>
                  </a>

                  <a
                    target="_blank"
                    rel="nofollow noopener noreferrer"
                    href="https://link.amazon/B0g6Fde52"
                    className="group relative block max-w-[260px] mx-auto w-full rounded-lg overflow-hidden border-2 border-[#FF9900]/70 bg-[#FF5E00] shadow-lg hover:scale-[1.015] transition-transform"
                  >
                    <img
                      width={1024}
                      height={1536}
                      src="/assets/aistudio/image_a7d4a6c8.png"
                      alt={isAr ? 'عروض وكوبونات الهواتف والإلكترونيات على أمازون اليابان' : 'Amazon Japan Goldbox Phone & Electronics Coupons'}
                      className="w-full h-52 object-cover object-bottom block border-0"
                    />
                    <div className="bg-[#131921]/95 px-3 py-2 flex items-center justify-between gap-2 text-xs font-extrabold text-[#FFD814]">
                      <span>{isAr ? 'عروض وكوبونات أمازون اليابان' : 'Shop Japan Coupon Deals'}</span>
                      <ExternalLink className="w-3.5 h-3.5 shrink-0" />
                    </div>
                  </a>
                </div>
              </div>

              {/* Curated Grid: Featured Amazon Japan Black Friday Case + Top 8 SIM-Free Smartphones */}
              <div className="pt-4 border-t border-white/15">
                <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="px-2 py-0.5 text-[11px] font-extrabold bg-[#FFD814] text-zinc-950 rounded whitespace-nowrap">
                      {isAr ? 'أفضل هواتف وعروض أمازون اليابان (SIM-Free)' : 'BEST AMAZON JAPAN SIM-FREE PHONES & DEALS'}
                    </span>
                    <span className="text-xs text-zinc-300 font-medium">
                      {isAr ? 'الأسعار بالين الياباني (JPY) · شاملة الضريبة' : 'Prices in Japanese Yen (JPY) · New & Unlocked'}
                    </span>
                  </div>
                  <a
                    href="https://link.amazon/B08EQakmz"
                    target="_blank"
                    rel="nofollow noopener noreferrer"
                    className="text-xs font-bold text-[#FFD814] hover:underline inline-flex items-center gap-1 whitespace-nowrap"
                  >
                    <span>{isAr ? 'عرض جميع الهواتف على أمازون اليابان' : 'View All Smartphones on Amazon.co.jp'}</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>

                <div className="grid grid-cols-1 @md/main:grid-cols-2 @3xl/main:grid-cols-3 @5xl/main:grid-cols-4 gap-3">
                  {[
                    {
                      id: 'amz-jp-miracase-13',
                      brand: 'Miracase',
                      discount: isAr ? 'وفر 5% عند شراء 2' : 'SAVE 5% ON 2',
                      price: '¥2,399',
                      oldPrice: '',
                      savingsEn: 'Buy 2 Save 5%',
                      savingsAr: 'خصم إضافي 5% عند شراء 2',
                      titleEn: 'Miracase iPhone 13 Case · US Military Standards · Shockproof',
                      titleAr: 'جراب Miracase لهاتف iPhone 13 · مقاوم للصدمات بمعيار عسكري أمريكي',
                      specs: 'MIL-STD Positioning Ring · Amazon.co.jp Black Friday',
                      image: '/assets/banners/amazon-jp-miracase-iphone13.jpg',
                      url: 'https://link.amazon/B03dPuy6Z',
                    },
                    {
                      id: 'jp-poco-x8-pro',
                      brand: 'Xiaomi POCO',
                      discount: '31% OFF',
                      price: '¥54,980',
                      oldPrice: '¥79,980',
                      savingsEn: 'Save ¥25,000',
                      savingsAr: 'وفّر ¥25,000',
                      titleEn: 'POCO X8 Pro 5G · 8GB+256GB · SIM-Free Japan',
                      titleAr: 'POCO X8 Pro 5G غير مقفل · 256GB · نسخة اليابان',
                      specs: '120Hz OLED · 90W Charge · SIM-Free',
                      image: '/assets/banners/amazon-jp-xiaomi-poco-x8-pro.jpg',
                      url: 'https://link.amazon/B08EQakmz',
                    },
                    {
                      id: 'jp-xiaomi-17t-pro',
                      brand: 'Xiaomi',
                      discount: '17% OFF',
                      price: '¥132,809',
                      oldPrice: '¥159,800',
                      savingsEn: 'Save ¥26,991',
                      savingsAr: 'وفّر ¥26,991',
                      titleEn: 'Xiaomi 17T Pro 5G · 12GB+512GB · FeliCa',
                      titleAr: 'شاومي 17T Pro 5G سعة 512GB · دعم FeliCa',
                      specs: 'Leica Optics · IP68 · Japan SIM-Free',
                      image: '/assets/banners/amazon-jp-xiaomi-17t-pro.jpg',
                      url: 'https://link.amazon/B08EQakmz',
                    },
                    {
                      id: 'jp-iphone-16',
                      brand: 'Apple',
                      discount: '15% OFF',
                      price: '¥118,900',
                      oldPrice: '¥139,800',
                      savingsEn: 'Save ¥20,900',
                      savingsAr: 'وفّر ¥20,900',
                      titleEn: 'Apple iPhone 16 · 256GB · SIM-Free Japan',
                      titleAr: 'آبل آيفون 16 سعة 256GB · غير مقفل (اليابان)',
                      specs: 'A18 Chip · 48MP Fusion · Unlocked',
                      image: '/assets/banners/amazon-jp-iphone-16.jpg',
                      url: 'https://link.amazon/B08EQakmz',
                    },
                    {
                      id: 'jp-galaxy-s25',
                      brand: 'Samsung',
                      discount: '10% OFF',
                      price: '¥116,100',
                      oldPrice: '¥129,000',
                      savingsEn: 'Save ¥12,900',
                      savingsAr: 'وفّر ¥12,900',
                      titleEn: 'Samsung Galaxy S25 · 256GB · SIM-Free Japan',
                      titleAr: 'سامسونج Galaxy S25 سعة 256GB · دعم FeliCa',
                      specs: 'Galaxy AI · 6.2" AMOLED · FeliCa',
                      image: '/assets/banners/amazon-jp-galaxy-s25.jpg',
                      url: 'https://link.amazon/B08EQakmz',
                    },
                    {
                      id: 'jp-aquos-sense9',
                      brand: 'SHARP',
                      discount: '13% OFF',
                      price: '¥54,800',
                      oldPrice: '¥62,700',
                      savingsEn: 'Save ¥7,900',
                      savingsAr: 'وفّر ¥7,900',
                      titleEn: 'SHARP AQUOS sense9 · Pro IGZO OLED · SIM-Free',
                      titleAr: 'شارب AQUOS sense9 الياباني غير مقفل · IP68',
                      specs: '240Hz IGZO · 5000mAh · Japan Edition',
                      image: '/assets/banners/amazon-jp-aquos-sense9.jpg',
                      url: 'https://link.amazon/B08EQakmz',
                    },
                    {
                      id: 'jp-moto-edge-60-pro',
                      brand: 'Motorola',
                      discount: '16% OFF',
                      price: '¥62,800',
                      oldPrice: '¥74,800',
                      savingsEn: 'Save ¥12,000',
                      savingsAr: 'وفّر ¥12,000',
                      titleEn: 'motorola edge 60 pro · Curved OLED · SIM-Free',
                      titleAr: 'موتورولا edge 60 pro غير مقفل · شاشة منحنية',
                      specs: '120Hz OLED · Pantone Camera · Fast Charge',
                      image: '/assets/banners/amazon-jp-moto-edge-60-pro.jpg',
                      url: 'https://link.amazon/B08EQakmz',
                    },
                    {
                      id: 'jp-xperia-10-vi',
                      brand: 'Sony',
                      discount: '26% OFF',
                      price: '¥53,900',
                      oldPrice: '¥72,800',
                      savingsEn: 'Save ¥18,900',
                      savingsAr: 'وفّر ¥18,900',
                      titleEn: 'Sony Xperia 10 VI · 5000mAh · FeliCa SIM-Free',
                      titleAr: 'سوني Xperia 10 VI الياباني · بطارية 5000mAh',
                      specs: '21:9 OLED · Stereo Speakers · IP68',
                      image: '/assets/banners/amazon-jp-xperia-10-vi.jpg',
                      url: 'https://link.amazon/B08EQakmz',
                    },
                    {
                      id: 'jp-galaxy-a25',
                      brand: 'Samsung',
                      discount: '15% OFF',
                      price: '¥29,446',
                      oldPrice: '¥34,800',
                      savingsEn: 'Save ¥5,354',
                      savingsAr: 'وفّر ¥5,354',
                      titleEn: 'Samsung Galaxy A25 5G · 50MP · SIM-Free Japan',
                      titleAr: 'سامسونج Galaxy A25 5G غير مقفل · كاميرا 50MP',
                      specs: '6.7" 120Hz · 5000mAh · FeliCa IP68',
                      image: '/assets/banners/amazon-jp-galaxy-a25.jpg',
                      url: 'https://link.amazon/B08EQakmz',
                    },
                  ].map((phone) => (
                    <div
                      key={phone.id}
                      className="rounded-lg bg-white text-zinc-950 border border-white/15 hover:border-[#FF9900] flex flex-col justify-between overflow-hidden shadow-xs transition-all"
                    >
                      <div className="p-3 bg-white border-b border-zinc-100">
                        <div className="flex items-center justify-between gap-1.5 mb-2">
                          <div className="flex items-center gap-1">
                            <span className="px-2 py-0.5 text-[10px] font-extrabold bg-[#CC0C39] text-white rounded">
                              {phone.discount}
                            </span>
                            <span className="px-1.5 py-0.5 text-[10px] font-bold bg-zinc-100 text-zinc-800 rounded">
                              {phone.brand}
                            </span>
                          </div>
                          <ShareButton
                            url={phone.url}
                            shareId={phone.id}
                            title={isAr ? phone.titleAr : phone.titleEn}
                            price={phone.price}
                            oldPrice={phone.oldPrice || undefined}
                            discount={phone.discount}
                            isAr={isAr}
                            compact
                            dropDirection="down"
                          />
                        </div>
                        <a
                          href={phone.url}
                          target="_blank"
                          rel="nofollow noopener noreferrer"
                          className="block w-full h-36 flex items-center justify-center bg-white"
                        >
                          <img
                            src={phone.image}
                            alt={phone.titleEn}
                            referrerPolicy="no-referrer"
                            className="max-h-full max-w-full object-contain"
                          />
                        </a>
                      </div>

                      <div className="p-3 flex-1 flex flex-col justify-between gap-2 bg-[#FAFAFA]">
                        <div>
                          <div className="flex flex-wrap items-baseline gap-1.5">
                            <span className="font-display text-lg font-extrabold text-[#B12704]">
                              {phone.price}
                            </span>
                            <span className="text-[11px] text-zinc-500 line-through">
                              {phone.oldPrice}
                            </span>
                            <span className="px-1.5 py-0.5 text-[10px] font-extrabold bg-emerald-100 text-emerald-900 rounded">
                              {isAr ? phone.savingsAr : phone.savingsEn}
                            </span>
                          </div>
                          <h4 className="mt-1 font-display text-xs sm:text-[13px] font-bold text-zinc-950 leading-snug line-clamp-2">
                            {isAr ? phone.titleAr : phone.titleEn}
                          </h4>
                          <p className="mt-0.5 text-[11px] text-zinc-600 line-clamp-1">
                            {phone.specs}
                          </p>
                        </div>

                        <a
                          href={phone.url}
                          target="_blank"
                          rel="nofollow noopener noreferrer"
                          className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-1.5 bg-[#FFD814] hover:bg-[#F7CA00] text-zinc-950 border border-[#FCD200] text-xs font-extrabold rounded-full transition-colors"
                        >
                          <span>{isAr ? 'تسوق من أمازون اليابان' : 'Shop on Amazon Japan'}</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Featured Black Friday Mega Deal: Nothing Phone (3) Unlocked 512GB */}
            <div className="@3xl/main:col-span-2 rounded-md border-2 border-[#7C3AED] bg-gradient-to-r from-[#1E1B4B] via-[#312E81] to-[#4C1D95] text-white p-4 sm:p-5 flex flex-col @4xl/main:flex-row items-center justify-between gap-5 shadow-sm">
              <div className="space-y-2 text-center @4xl/main:text-start max-w-xl">
                <div className="inline-flex flex-wrap items-center justify-center @4xl/main:justify-start gap-2">
                  <span className="px-2.5 py-0.5 text-[11px] font-extrabold bg-[#CC0C39] text-white rounded">
                    25% OFF · $599.00
                  </span>
                  <span className="px-2 py-0.5 text-[11px] font-extrabold bg-[#FFD814] text-zinc-950 rounded">
                    {isAr ? 'وفّر $200 · السعر الأصلي $799' : 'SAVE $200 · WAS $799.00'}
                  </span>
                  <span className="px-2 py-0.5 text-[11px] font-bold bg-white/15 text-violet-100 rounded">
                    512GB · Snapdragon 8s Gen 4 · Glyph Interface
                  </span>
                </div>
                <h3 className="font-display text-lg sm:text-xl font-extrabold text-white leading-snug">
                  {isAr
                    ? 'Nothing Phone (3) 5G غير مقفل 512 جيجابايت — $599 بدلاً من $799 (خصم البلاك فرايدي 25%)'
                    : 'Nothing Phone (3) 5G Unlocked 512GB — $599.00 (Was $799.00 · 25% Off Black Friday Deal)'}
                </h3>
                <div className="flex flex-wrap items-baseline justify-center @4xl/main:justify-start gap-2.5">
                  <span className="font-display text-2xl font-extrabold text-[#FFD814]">
                    $599.00 USD
                  </span>
                  <span className="text-sm text-violet-200 line-through">$799.00 USD</span>
                  <span className="px-2 py-0.5 text-[11px] font-extrabold bg-[#CC0C39] text-white rounded">
                    {isAr ? 'وفّر $200 (خصم 25%)' : 'Save $200 (25% OFF)'}
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-violet-100/95 leading-relaxed">
                  {isAr
                    ? 'معالج Snapdragon 8s Gen 4، أربع كاميرات بدقة 50 ميجابكسل، شاشة AMOLED، بطارية 5150mAh، أندرويد 15، وواجهة Glyph التفاعلية باللون الأسود على أمازون أمريكا.'
                    : 'Qualcomm Snapdragon 8s Gen 4, four 50MP AI cameras, bright AMOLED display, 5150mAh battery, Android 15 & iconic Glyph Interface in Black on Amazon US.'}
                </p>
                <div className="pt-1 flex flex-wrap items-center justify-center @4xl/main:justify-start gap-2">
                  <a
                    href="https://link.amazon/B00QLHLCZ"
                    target="_blank"
                    rel="nofollow noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#FFD814] hover:bg-[#F7CA00] text-zinc-950 border border-[#FCD200] text-xs font-extrabold rounded-full transition-colors whitespace-nowrap"
                  >
                    <span>{isAr ? 'احصل على خصم $200 الآن' : 'Claim $200 Off on Amazon US'}</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                  <ShareButton
                    url="https://link.amazon/B00QLHLCZ"
                    shareId="amz-bf-nothing-phone-3"
                    title={
                      isAr
                        ? 'خصم البلاك فرايدي: Nothing Phone (3) 512GB بسعر $599 بدلاً من $799 - Amazon US'
                        : 'Black Friday Deal: Nothing Phone (3) 512GB for $599 (25% Off) - Amazon US'
                    }
                    price="$599.00 USD"
                    oldPrice="$799.00 USD"
                    discount="25% OFF"
                    isAr={isAr}
                    dropDirection="down"
                    tone="dark"
                  />
                </div>
              </div>

              <a
                target="_blank"
                rel="nofollow noopener noreferrer"
                href="https://link.amazon/B00QLHLCZ"
                className="block max-w-[260px] w-full rounded-md overflow-hidden border border-white/30 bg-white p-2 shadow-md hover:scale-[1.01] transition-transform shrink-0"
              >
                <img
                  width={1010}
                  height={1010}
                  src="/assets/banners/amazon-bf-nothing-phone-3.jpg"
                  alt="Nothing Phone (3) 5G Unlocked 512GB Black - Black Friday Deal"
                  referrerPolicy="no-referrer"
                  className="w-full max-h-[220px] object-contain block border-0"
                />
              </a>
            </div>

            {/* TAGRY Noise Cancelling Headphones — 50% Clip Coupon Highlight */}
            <div className="@3xl/main:col-span-2 rounded-md border-2 border-emerald-500/70 bg-gradient-to-r from-[#064E3B] via-[#047857] to-[#065F46] text-white p-4 sm:p-5 flex flex-col @4xl/main:flex-row items-center justify-between gap-5 shadow-xs">
              <div className="space-y-2 text-center @4xl/main:text-start max-w-xl">
                <div className="inline-flex flex-wrap items-center justify-center @4xl/main:justify-start gap-2">
                  <span className="px-2.5 py-0.5 text-[11px] font-extrabold bg-[#FFD814] text-zinc-950 rounded">
                    50% CLIP COUPON
                  </span>
                  <span className="px-2 py-0.5 text-[11px] font-bold bg-white/15 text-emerald-100 rounded">
                    AMAZON US · Hybrid ANC · 100H Playtime
                  </span>
                </div>
                <h3 className="font-display text-lg sm:text-xl font-extrabold text-white leading-snug">
                  {isAr
                    ? 'سماعات TAGRY العازلة للضوضاء — خصم 50% (اضغط على مربع الكوبون الأخضر في صفحة أمازون)'
                    : 'TAGRY Noise Cancelling Headphones — Save 50% (Click the green coupon box on Amazon page)'}
                </h3>
                <div className="flex flex-wrap items-baseline justify-center @4xl/main:justify-start gap-2.5">
                  <span className="font-display text-2xl font-extrabold text-[#FFD814]">
                    ~$24.50 USD
                  </span>
                  <span className="text-sm text-emerald-200 line-through">~$49.00</span>
                  <span className="px-2 py-0.5 text-[11px] font-extrabold bg-[#FFD814] text-zinc-950 rounded">
                    {isAr ? 'بعد تفعيل كوبون 50% (الأصلي $149.99)' : 'With 50% Clip Coupon (List $149.99)'}
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-emerald-100 leading-relaxed">
                  {isAr
                    ? 'لتفعيل خصم 50%: افتح صفحة المنتج على أمازون ثم ضع علامة على مربع الكوبون الأخضر (Clip 50% Coupon) قبل الإضافة للسلة. عزل ضوضاء هجين وبطارية 100 ساعة وشحن سريع.'
                    : 'How to claim 50% off: Open the Amazon page and check the green Clip Coupon box right below the price before checkout. Hybrid Active Noise Cancellation, 100H battery & fast charging.'}
                </p>
                <div className="pt-1 flex flex-wrap items-center justify-center @4xl/main:justify-start gap-2">
                  <a
                    href="https://link.amazon/B0aAG3AU7"
                    target="_blank"
                    rel="nofollow noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#FFD814] hover:bg-[#F7CA00] text-zinc-950 border border-[#FCD200] text-xs font-extrabold rounded-full transition-colors whitespace-nowrap"
                  >
                    <span>{isAr ? 'احصل على خصم 50% الآن' : 'Claim 50% Clip Coupon on Amazon'}</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                  <ShareButton
                    url="https://link.amazon/B0aAG3AU7"
                    shareId="amz-tagry-anc"
                    title="TAGRY Noise Cancelling Headphones — Save 50% (Click the green coupon box on Amazon page)"
                    price="~$24.50 USD"
                    oldPrice="$149.99"
                    discount="50% CLIP COUPON"
                    isAr={isAr}
                    dropDirection="down"
                    tone="dark"
                  />
                </div>
              </div>

              <a
                target="_blank"
                rel="nofollow noopener noreferrer"
                href="https://link.amazon/B0aAG3AU7"
                className="block max-w-[280px] w-full rounded-md overflow-hidden border border-white/30 bg-white shadow-md hover:scale-[1.01] transition-transform shrink-0"
              >
                <img
                  width={1279}
                  height={1500}
                  src="/assets/banners/amazon-tagry-headphones.jpg"
                  alt="TAGRY Noise Cancelling Headphones — 50% Clip Coupon"
                  className="w-full max-h-[250px] object-contain block border-0"
                />
              </a>
            </div>

            <div className="rounded-md border border-zinc-200 bg-[#F8FAF9] p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="space-y-1.5 text-center sm:text-start">
                <span className="text-[11px] font-bold text-[#007185]">HONOR UAE Official</span>
                <h3 className="font-display text-base font-extrabold text-zinc-950">
                  HONOR Smartphones &amp; Tablets
                </h3>
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                  <a
                    href="https://zallj.com/g/d4cxpno5ddd2ceec5c685d13f15f75/"
                    target="_blank"
                    rel="nofollow noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-[#FFD814] hover:bg-[#F7CA00] text-zinc-950 border border-[#FCD200] text-xs font-bold rounded-full"
                  >
                    <span>HONOR UAE</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                  <ShareButton
                    url="https://zallj.com/g/d4cxpno5ddd2ceec5c685d13f15f75/"
                    shareId="honor-uae"
                    title="HONOR UAE Smartphones & Tablets"
                    discount="Verified Store"
                    isAr={isAr}
                    dropDirection="down"
                    align="start"
                  />
                </div>
              </div>
              {/* admitad.banner: 528gdkb23od2ceec5c685d13f15f75 HONOR UAE */}
              <a
                target="_blank"
                rel="nofollow noopener noreferrer"
                href="https://zallj.com/g/528gdkb23od2ceec5c685d13f15f75/?i=4"
                className="block max-w-[240px] w-full rounded overflow-hidden border border-zinc-200 bg-white shrink-0"
              >
                <img
                  width={600}
                  height={500}
                  src="/assets/banners/honor-uae.jpg"
                  alt="HONOR UAE"
                  className="w-full h-auto block border-0"
                />
              </a>
              {/* /admitad.banner */}
            </div>

            <div className="rounded-md border border-zinc-200 bg-[#F8FAF9] p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="space-y-1.5 text-center sm:text-start">
                <span className="text-[11px] font-bold text-[#D9272E]">Parallels WW Official</span>
                <h3 className="font-display text-base font-extrabold text-zinc-950">
                  Parallels Desktop for Mac &amp; Windows
                </h3>
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                  <a
                    href="https://ficca2021.com/g/5ermu17f1nd2ceec5c68ad29faedc4/"
                    target="_blank"
                    rel="nofollow noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-[#FFD814] hover:bg-[#F7CA00] text-zinc-950 border border-[#FCD200] text-xs font-bold rounded-full"
                  >
                    <span>Parallels WW</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                  <ShareButton
                    url="https://ficca2021.com/g/5ermu17f1nd2ceec5c68ad29faedc4/"
                    shareId="parallels-ww"
                    title="Parallels Desktop for Mac & Windows"
                    discount="Verified Store"
                    isAr={isAr}
                    dropDirection="down"
                    align="start"
                  />
                </div>
              </div>
              {/* admitad.banner: nhl2llkqj5d2ceec5c68ad29faedc4 Parallels WW */}
              <a
                target="_blank"
                rel="nofollow noopener noreferrer"
                href="https://ficca2021.com/g/nhl2llkqj5d2ceec5c68ad29faedc4/?i=4"
                className="block max-w-[240px] w-full rounded overflow-hidden border border-zinc-200 bg-white shrink-0"
              >
                <img
                  width={300}
                  height={250}
                  src="/assets/banners/parallels-ww.png"
                  alt="Parallels WW"
                  className="w-full h-auto block border-0"
                />
              </a>
              {/* /admitad.banner */}
            </div>

            <div className="rounded-md border border-zinc-200 bg-[#F8FAF9] p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="space-y-1.5 text-center sm:text-start">
                <span className="text-[11px] font-bold text-[#006E4E]">AdGuard Many GEOs</span>
                <h3 className="font-display text-base font-extrabold text-zinc-950">
                  AdGuard Ad Blocker &amp; Privacy
                </h3>
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                  <a
                    href="https://dhwnh.com/g/xc497owldvd2ceec5c68a9584d7a68/"
                    target="_blank"
                    rel="nofollow noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-[#FFD814] hover:bg-[#F7CA00] text-zinc-950 border border-[#FCD200] text-xs font-bold rounded-full"
                  >
                    <span>AdGuard</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                  <ShareButton
                    url="https://dhwnh.com/g/xc497owldvd2ceec5c68a9584d7a68/"
                    shareId="adguard-many-geos"
                    title="AdGuard Ad Blocker & Privacy"
                    discount="Verified Store"
                    isAr={isAr}
                    dropDirection="down"
                    align="start"
                  />
                </div>
              </div>
              {/* admitad.banner: qj2a008gzld2ceec5c68a9584d7a68 AdGuard Many GEOs */}
              <a
                target="_blank"
                rel="nofollow noopener noreferrer"
                href="https://dhwnh.com/g/qj2a008gzld2ceec5c68a9584d7a68/?i=4"
                className="block max-w-[160px] sm:max-w-[180px] w-full rounded overflow-hidden border border-zinc-200 bg-white shrink-0"
              >
                <img
                  width={200}
                  height={300}
                  src="/assets/banners/adguard-many-geos.png"
                  alt="AdGuard Many GEOs"
                  className="w-full h-auto block border-0"
                />
              </a>
              {/* /admitad.banner */}
            </div>

            <div className="rounded-md border border-zinc-200 bg-[#F8FAF9] p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="space-y-1.5 text-center sm:text-start">
                <span className="text-[11px] font-bold text-[#CC0000]">Canon UAE Official</span>
                <h3 className="font-display text-base font-extrabold text-zinc-950">
                  Canon EOS Cameras, Lenses &amp; Printers
                </h3>
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                  <a
                    href="https://dhwnh.com/g/nf984sc59wd2ceec5c68697a6f5f74/"
                    target="_blank"
                    rel="nofollow noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-[#FFD814] hover:bg-[#F7CA00] text-zinc-950 border border-[#FCD200] text-xs font-bold rounded-full"
                  >
                    <span>Canon UAE</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                  <ShareButton
                    url="https://dhwnh.com/g/nf984sc59wd2ceec5c68697a6f5f74/"
                    shareId="canon-uae"
                    title="Canon UAE EOS Cameras, Lenses & Printers"
                    discount="Verified Store"
                    isAr={isAr}
                    dropDirection="down"
                    align="start"
                  />
                </div>
              </div>
              {/* admitad.banner: hdzf8fy3nmd2ceec5c68697a6f5f74 Canon UAE */}
              <a
                target="_blank"
                rel="nofollow noopener noreferrer"
                href="https://dhwnh.com/g/hdzf8fy3nmd2ceec5c68697a6f5f74/?i=4"
                className="block max-w-[240px] w-full rounded overflow-hidden border border-zinc-200 bg-white shrink-0"
              >
                <img
                  width={300}
                  height={250}
                  src="/assets/banners/canon-uae.jpg"
                  alt="Canon UAE"
                  className="w-full h-auto block border-0"
                />
              </a>
              {/* /admitad.banner */}
            </div>

            <div className="@3xl/main:col-span-2 rounded-md border border-zinc-200 bg-[#F8FAF9] p-4 flex flex-col @4xl/main:flex-row items-center justify-between gap-4">
              <div className="space-y-1.5 text-center @4xl/main:text-start">
                <span className="text-[11px] font-bold text-[#CF0A2C]">Huawei AE Official</span>
                <h3 className="font-display text-base sm:text-lg font-extrabold text-zinc-950">
                  Huawei UAE Smartphones, MatePad, Watch &amp; MateBook
                </h3>
                <div className="flex flex-wrap items-center justify-center @4xl/main:justify-start gap-2">
                  <a
                    href="https://ficca2021.com/g/2k0ixkhyhod2ceec5c68fc61652cc0/"
                    target="_blank"
                    rel="nofollow noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-[#FFD814] hover:bg-[#F7CA00] text-zinc-950 border border-[#FCD200] text-xs font-bold rounded-full"
                  >
                    <span>Huawei AE</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                  <ShareButton
                    url="https://ficca2021.com/g/2k0ixkhyhod2ceec5c68fc61652cc0/"
                    shareId="huawei-ae"
                    title="Huawei UAE Smartphones, MatePad, Watch & MateBook"
                    discount="Verified Store"
                    isAr={isAr}
                    dropDirection="down"
                    align="start"
                  />
                </div>
              </div>
              <div className="flex flex-wrap sm:flex-nowrap items-center justify-center gap-3 shrink-0">
                {/* admitad.banner: aqhe7nfsmzd2ceec5c68fc61652cc0 Huawei AE Offline codes & Links */}
                <a
                  target="_blank"
                  rel="nofollow noopener noreferrer"
                  href="https://ficca2021.com/g/aqhe7nfsmzd2ceec5c68fc61652cc0/?i=4"
                  className="block max-w-[260px] sm:max-w-[280px] w-full rounded overflow-hidden border border-zinc-200 bg-white shrink-0"
                >
                  <img
                    width={336}
                    height={280}
                    src="/assets/banners/huawei-ae-tablet.jpg"
                    alt="Huawei AE Offline codes & Links"
                    className="w-full h-auto block border-0"
                  />
                </a>
                {/* /admitad.banner */}

                {/* admitad.banner: ivnww3kyuod2ceec5c68fc61652cc0 Huawei AE Offline codes & Links */}
                <a
                  target="_blank"
                  rel="nofollow noopener noreferrer"
                  href="https://ficca2021.com/g/ivnww3kyuod2ceec5c68fc61652cc0/?i=4"
                  className="block max-w-[260px] sm:max-w-[280px] w-full rounded overflow-hidden border border-zinc-200 bg-white shrink-0"
                >
                  <img
                    width={336}
                    height={280}
                    src="/assets/banners/huawei-ae-laptop.jpg"
                    alt="Huawei AE Offline codes & Links"
                    className="w-full h-auto block border-0"
                  />
                </a>
                {/* /admitad.banner */}
              </div>
            </div>

            <div className="@3xl/main:col-span-2 rounded-md border border-[#E62E04]/25 bg-[#F8FAF9] p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="space-y-1.5 text-center sm:text-start">
                <span className="text-[11px] font-bold text-[#E62E04]">AliExpress WW Official</span>
                <h3 className="font-display text-base sm:text-lg font-extrabold text-zinc-950">
                  AliExpress WW — Global Tech, Choice Deals, Fashion &amp; Home
                </h3>
                <p className="text-xs text-zinc-600 max-w-lg">
                  {isAr
                    ? 'تسوق مباشرة عبر الرابط الرسمي لـ AliExpress WW لجميع الإلكترونيات والإكسسوارات والمنتجات العالمية.'
                    : 'Shop global bestsellers, Choice electronics, wireless audio, and home accessories directly via AliExpress WW.'}
                </p>
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                  <a
                    href="https://rzekl.com/g/1e8d114494d2ceec5c6816525dc3e8/"
                    target="_blank"
                    rel="nofollow noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-[#FFD814] hover:bg-[#F7CA00] text-zinc-950 border border-[#FCD200] text-xs font-bold rounded-full"
                  >
                    <span>AliExpress WW</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                  <ShareButton
                    url="https://rzekl.com/g/1e8d114494d2ceec5c6816525dc3e8/"
                    shareId="aliexpress"
                    title="AliExpress WW Global Deals"
                    discount="Choice Deals"
                    isAr={isAr}
                    dropDirection="down"
                    align="start"
                  />
                </div>
              </div>
              {/* admitad.banner: qpw0xm1c34d2ceec5c6816525dc3e8 AliExpress WW */}
              <a
                target="_blank"
                rel="nofollow noopener noreferrer"
                href="https://rzekl.com/g/qpw0xm1c34d2ceec5c6816525dc3e8/?i=4"
                className="block max-w-[260px] w-full rounded overflow-hidden border border-zinc-200 bg-white shrink-0"
              >
                <img
                  width={300}
                  height={250}
                  src="/assets/banners/aliexpress-ww.jpg"
                  alt="AliExpress WW"
                  className="w-full h-auto block border-0"
                />
              </a>
              {/* /admitad.banner */}
            </div>

            <div className="@3xl/main:col-span-2 rounded-md border border-[#FF6A00]/30 bg-[#F8FAF9] p-4 flex flex-col @4xl/main:flex-row items-center justify-between gap-4">
              <div className="space-y-1.5 text-center @4xl/main:text-start">
                <span className="text-[11px] font-bold text-[#FF6A00]">Alibaba WW Official</span>
                <h3 className="font-display text-base sm:text-lg font-extrabold text-zinc-950">
                  Alibaba WW — Global Direct-from-Factory Wholesale &amp; Trade Assurance
                </h3>
                <p className="text-xs text-zinc-600 max-w-lg">
                  {isAr
                    ? 'استورد المنتجات والإلكترونيات والأجهزة مباشرة من المصانع والموردين الموثوقين عبر الرابط الرسمي لـ Alibaba WW.'
                    : 'Source electronics, tech hardware, and wholesale products directly from verified global manufacturers via Alibaba WW.'}
                </p>
                <div className="flex flex-wrap items-center justify-center @4xl/main:justify-start gap-2">
                  <a
                    href="https://rzekl.com/g/pm1aev55cld2ceec5c68219aa26f6f/"
                    target="_blank"
                    rel="nofollow noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-[#FFD814] hover:bg-[#F7CA00] text-zinc-950 border border-[#FCD200] text-xs font-bold rounded-full"
                  >
                    <span>Alibaba WW</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                  <ShareButton
                    url="https://rzekl.com/g/pm1aev55cld2ceec5c68219aa26f6f/"
                    shareId="alibaba"
                    title="Alibaba WW Global Wholesale"
                    discount="Factory Direct"
                    isAr={isAr}
                    dropDirection="down"
                    align="start"
                  />
                </div>
              </div>
              <div className="flex flex-wrap sm:flex-nowrap items-center justify-center gap-3 shrink-0">
                {/* admitad.banner: 2yynmq9ityd2ceec5c68219aa26f6f Alibaba WW */}
                <a
                  target="_blank"
                  rel="nofollow noopener noreferrer"
                  href="https://rzekl.com/g/2yynmq9ityd2ceec5c68219aa26f6f/?i=4"
                  className="block rounded overflow-hidden border border-zinc-200 bg-white shrink-0"
                >
                  <img
                    width={320}
                    height={480}
                    src="/assets/banners/alibaba-ww.jpg"
                    alt="Alibaba WW"
                    className="h-[300px] sm:h-[320px] w-auto block border-0"
                  />
                </a>
                {/* /admitad.banner */}

                {/* admitad.banner: xwa6jvbzpqd2ceec5c68219aa26f6f Alibaba WW */}
                <a
                  target="_blank"
                  rel="nofollow noopener noreferrer"
                  href="https://rzekl.com/g/xwa6jvbzpqd2ceec5c68219aa26f6f/?i=4"
                  className="block rounded overflow-hidden border border-zinc-200 bg-white shrink-0"
                >
                  <img
                    width={160}
                    height={600}
                    src="/assets/banners/alibaba-ww-skyscraper.jpg"
                    alt="Alibaba WW"
                    className="h-[300px] sm:h-[320px] w-auto block border-0"
                  />
                </a>
                {/* /admitad.banner */}
              </div>
            </div>

            <div className="@3xl/main:col-span-2 rounded-md border border-[#00453E]/30 bg-gradient-to-r from-[#003B34] via-[#00453E] to-[#065F46] text-white p-4 sm:p-5 flex flex-col @4xl/main:flex-row items-center justify-between gap-5 shadow-xs">
              <div className="space-y-2 text-center @4xl/main:text-start max-w-xl">
                <div className="inline-flex items-center gap-2">
                  <span className="px-2.5 py-0.5 text-[11px] font-extrabold bg-[#FFD814] text-zinc-950 rounded">
                    ADMITAD SHOP
                  </span>
                  <span className="text-[11px] font-semibold text-emerald-100">
                    €29.99 · Bluetooth 5.0 · 20h Playtime
                  </span>
                </div>
                <h3 className="font-display text-lg sm:text-xl font-extrabold text-white leading-snug">
                  Wireless Bluetooth Earbuds — Water-Resistant &amp; Touch Controls
                </h3>
                <div className="flex flex-wrap items-baseline justify-center @4xl/main:justify-start gap-2">
                  <span className="font-display text-2xl font-extrabold text-[#FFD814]">
                    €29.99 EUR
                  </span>
                  <span className="px-2 py-0.5 text-[11px] font-bold bg-white/15 text-emerald-100 rounded">
                    {isAr ? 'شحن عالمي مباشر' : 'Direct Store Offer'}
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-emerald-100/90 leading-relaxed">
                  {isAr
                    ? 'سماعات بلوتوث لاسلكية بتقنية Bluetooth 5.0 وبطارية تدوم 20 ساعة وتصميم مقاوم للماء عبر متجر Admitad الرسمي.'
                    : 'Enjoy high-quality sound with sleek, water-resistant wireless earbuds featuring Bluetooth 5.0, touch controls, and 20-hour battery life.'}
                </p>
                <div className="pt-1 flex flex-wrap items-center justify-center @4xl/main:justify-start gap-2">
                  <a
                    href="https://ytebb.com/g/h0cdgv41zqd2ceec5c6862c6909e0c/"
                    target="_blank"
                    rel="nofollow noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#FFD814] hover:bg-[#F7CA00] text-zinc-950 border border-[#FCD200] text-xs font-extrabold rounded-full transition-colors whitespace-nowrap"
                  >
                    <span>{isAr ? 'تسوق سماعات Admitad' : 'Shop Admitad Earbuds'}</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                  <ShareButton
                    url="https://ytebb.com/g/h0cdgv41zqd2ceec5c6862c6909e0c/"
                    shareId="admitad-earbuds"
                    title="Admitad Shop Wireless Bluetooth Earbuds"
                    price="€29.99 EUR"
                    discount="Direct Store Offer"
                    isAr={isAr}
                    dropDirection="down"
                    tone="dark"
                  />
                </div>
              </div>

              {/* admitad.banner: h0cdgv41zqd2ceec5c6862c6909e0c Admitad Shop */}
              <a
                target="_blank"
                rel="nofollow noopener noreferrer"
                href="https://ytebb.com/g/h0cdgv41zqd2ceec5c6862c6909e0c/"
                className="block max-w-[380px] w-full rounded-md overflow-hidden border border-white/25 bg-[#002924] shadow-md hover:scale-[1.01] transition-transform shrink-0"
              >
                <img
                  width={640}
                  height={360}
                  src="/assets/images/admitad_earbuds_banner_1795014382533.jpg"
                  alt="Admitad Shop — Wireless Bluetooth Earbuds 5.0"
                  referrerPolicy="no-referrer"
                  className="w-full h-auto block border-0"
                />
              </a>
              {/* /admitad.banner */}
            </div>

            <div className="@3xl/main:col-span-2 rounded-md border border-[#FF9900]/40 bg-gradient-to-r from-[#131921] via-[#1C2530] to-[#232F3E] text-white p-4 sm:p-5 flex flex-col @4xl/main:flex-row items-center justify-between gap-5 shadow-xs">
              <div className="space-y-2 text-center @4xl/main:text-start max-w-xl">
                <div className="inline-flex items-center gap-2">
                  <span className="px-2.5 py-0.5 text-[11px] font-extrabold bg-[#FF9900] text-zinc-950 rounded">
                    AMAZON US
                  </span>
                  <span className="text-[11px] font-semibold text-amber-200">
                    16&quot; 1200P FHD+ · Triple Monitor · USB-C / HDMI
                  </span>
                </div>
                <h3 className="font-display text-lg sm:text-xl font-extrabold text-white leading-snug">
                  16&quot; Laptop Screen Extender — Ultra-Slim Triple Portable Monitor
                </h3>
                <div className="flex flex-wrap items-baseline justify-center @4xl/main:justify-start gap-2">
                  <span className="font-display text-2xl font-extrabold text-[#FFD814]">
                    ~$250.00 – $400.00 USD
                  </span>
                  <span className="px-2 py-0.5 text-[11px] font-bold bg-white/15 text-amber-200 rounded">
                    {isAr ? 'أمازون أمريكا' : 'Amazon US Price'}
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-zinc-200 leading-relaxed">
                  {isAr
                    ? 'موسّع شاشة لابتوب 16 بوصة بدقة 1200P FHD+ فائق النحافة لأجهزة 12–17.3 بوصة مع توصيل فوري USB-C/HDMI لنظام Mac وWindows وAndroid وChrome.'
                    : 'Triple portable monitor for 12–17.3" laptops with 1200P FHD+ display and USB-C/HDMI Plug-Play compatibility for Mac, Windows, Android & Chrome.'}
                </p>
                <div className="pt-1 flex flex-wrap items-center justify-center @4xl/main:justify-start gap-2">
                  <a
                    href="https://link.amazon/B01LYDqhL"
                    target="_blank"
                    rel="nofollow noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#FFD814] hover:bg-[#F7CA00] text-zinc-950 border border-[#FCD200] text-xs font-extrabold rounded-full transition-colors whitespace-nowrap"
                  >
                    <span>{isAr ? 'عرض المنتج على Amazon US' : 'Shop on Amazon US'}</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                  <ShareButton
                    url="https://link.amazon/B01LYDqhL"
                    shareId="amz-screen-extender"
                    title='16" Laptop Screen Extender - Amazon US'
                    price="~$250.00 – $400.00 USD"
                    discount="AMAZON US"
                    isAr={isAr}
                    dropDirection="down"
                    tone="dark"
                  />
                </div>
              </div>

              <a
                target="_blank"
                rel="nofollow noopener noreferrer"
                href="https://link.amazon/B01LYDqhL"
                className="block max-w-[340px] w-full rounded-md overflow-hidden border border-white/25 bg-white shadow-md hover:scale-[1.01] transition-transform shrink-0"
              >
                <img
                  width={1500}
                  height={1115}
                  src="/assets/banners/amazon-laptop-screen-extender.jpg"
                  alt="16-inch Laptop Screen Extender 1200P FHD+ Triple Portable Monitor"
                  className="w-full h-auto block border-0"
                />
              </a>
            </div>

            <div className="@3xl/main:col-span-2 rounded-md border border-[#FF9900]/40 bg-gradient-to-r from-[#111827] via-[#1F2937] to-[#111827] text-white p-4 sm:p-5 flex flex-col @4xl/main:flex-row items-center justify-between gap-5 shadow-xs">
              <div className="space-y-2 text-center @4xl/main:text-start max-w-xl">
                <div className="inline-flex items-center gap-2">
                  <span className="px-2.5 py-0.5 text-[11px] font-extrabold bg-[#FF9900] text-zinc-950 rounded">
                    AMAZON US
                  </span>
                  <span className="text-[11px] font-semibold text-amber-200">
                    14.2&quot; PROLED XDR · M5 Pro · 24GB RAM · 1TB · Touch
                  </span>
                </div>
                <h3 className="font-display text-lg sm:text-xl font-extrabold text-white leading-snug">
                  {isAr
                    ? 'ابل ماك بوك برو 2026 بشاشة عرض بروليد اكس دي ار 14.2 بوصة - فضي | Amazon US'
                    : 'Apple 2026 MacBook Pro 14.2" PROLED XDR Display - Silver · M5 Pro'}
                </h3>
                <div className="flex flex-wrap items-baseline justify-center @4xl/main:justify-start gap-2">
                  <span className="font-display text-2xl font-extrabold text-[#FFD814]">
                    $2,699.00 USD
                  </span>
                  <span className="px-2 py-0.5 text-[11px] font-bold bg-white/15 text-amber-200 rounded">
                    {isAr ? 'سعر أمازون أمريكا الرسمي' : 'Official Amazon US Price'}
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-zinc-200 leading-relaxed">
                  {isAr
                    ? 'شاشة لمس PROLED XDR بسطوع 2000 شمعة، شريحة M5 Pro (معالج 15 نواة ومعالج رسومات 16 نواة)، ذاكرة موحدة 24GB وتخزين 1TB وبطارية حتى 22 ساعة عبر أمازون أمريكا.'
                    : 'Touch-enabled 14.2" tandem OLED PROLED XDR display (2000 nits), M5 Pro 15-core CPU & 16-core GPU, 24GB memory, 1TB storage & 22h battery on Amazon US.'}
                </p>
                <div className="pt-1 flex flex-wrap items-center justify-center @4xl/main:justify-start gap-2">
                  <a
                    href="https://link.amazon/B0a3jWWEh"
                    target="_blank"
                    rel="nofollow noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#FFD814] hover:bg-[#F7CA00] text-zinc-950 border border-[#FCD200] text-xs font-extrabold rounded-full transition-colors whitespace-nowrap"
                  >
                    <span>{isAr ? 'عرض المنتج على Amazon US' : 'Shop on Amazon US'}</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                  <ShareButton
                    url="https://link.amazon/B0a3jWWEh"
                    shareId="amz-macbook-pro-2026"
                    title={
                      isAr
                        ? 'ابل ماك بوك برو 2026 بشاشة بروليد اكس دي ار 14.2 بوصة (M5 Pro) - Amazon US'
                        : 'Apple 2026 MacBook Pro 14.2" PROLED XDR (M5 Pro) - Amazon US'
                    }
                    price="$2,699.00 USD"
                    discount="AMAZON US"
                    isAr={isAr}
                    dropDirection="down"
                    tone="dark"
                  />
                </div>
              </div>

              <a
                target="_blank"
                rel="nofollow noopener noreferrer"
                href="https://link.amazon/B0a3jWWEh"
                className="block max-w-[340px] w-full rounded-md overflow-hidden border border-white/25 bg-white shadow-md hover:scale-[1.01] transition-transform shrink-0"
              >
                <img
                  width={1500}
                  height={921}
                  src="/assets/banners/amazon-macbook-pro-2026.jpg"
                  alt="Apple 2026 MacBook Pro 14.2-inch PROLED XDR Display Silver"
                  className="w-full h-auto block border-0"
                />
              </a>
            </div>

            <div className="@3xl/main:col-span-2 rounded-md border border-[#FF9900]/40 bg-gradient-to-r from-[#0F172A] via-[#172554] to-[#0F172A] text-white p-4 sm:p-5 flex flex-col @4xl/main:flex-row items-center justify-between gap-5 shadow-xs">
              <div className="space-y-2 text-center @4xl/main:text-start max-w-xl">
                <div className="inline-flex items-center gap-2">
                  <span className="px-2.5 py-0.5 text-[11px] font-extrabold bg-[#FF9900] text-zinc-950 rounded">
                    AMAZON US
                  </span>
                  <span className="text-[11px] font-semibold text-amber-200">
                    256GB · US Version · eSIM · Deep Blue · Unlocked
                  </span>
                </div>
                <h3 className="font-display text-lg sm:text-xl font-extrabold text-white leading-snug">
                  {isAr
                    ? 'ابل ايفون 17 برو ماكس، إصدار أمريكي (256 جيجا، eSIM، أزرق داكن) - غير مقفل'
                    : 'Apple iPhone 17 Pro Max, US Version, 256GB, eSIM, Deep Blue · Unlocked'}
                </h3>
                <div className="flex flex-wrap items-baseline justify-center @4xl/main:justify-start gap-2">
                  <span className="font-display text-2xl font-extrabold text-[#FFD814]">
                    $1,199.00 USD
                  </span>
                  <span className="px-2 py-0.5 text-[11px] font-bold bg-white/15 text-amber-200 rounded">
                    {isAr ? 'أمازون أمريكا · غير مقفل' : 'Amazon US Retail'}
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-zinc-200 leading-relaxed">
                  {isAr
                    ? 'هاتف غير مقفل ومتوافق مع شبكات GSM وCDMA، سعة 256 جيجابايت بشريحة إلكترونية eSIM، يتضمن شاحن وكابل معتمد من MFi وفحص صحة البطارية بحد أدنى 80% عبر أمازون أمريكا.'
                    : 'Carrier-unlocked (GSM & CDMA) US version with 256GB storage, eSIM support, MFi-certified charger & cable, and minimum 80% verified battery health on Amazon US.'}
                </p>
                <div className="pt-1 flex flex-wrap items-center justify-center @4xl/main:justify-start gap-2">
                  <a
                    href="https://link.amazon/B0hrqzi9f"
                    target="_blank"
                    rel="nofollow noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#FFD814] hover:bg-[#F7CA00] text-zinc-950 border border-[#FCD200] text-xs font-extrabold rounded-full transition-colors whitespace-nowrap"
                  >
                    <span>{isAr ? 'عرض المنتج على Amazon US' : 'Shop on Amazon US'}</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                  <ShareButton
                    url="https://link.amazon/B0hrqzi9f"
                    shareId="amz-iphone-17-pro-max"
                    title={
                      isAr
                        ? 'ابل ايفون 17 برو ماكس 256 جيجا أزرق داكن - Amazon US'
                        : 'Apple iPhone 17 Pro Max 256GB Deep Blue - Amazon US'
                    }
                    price="$1,199.00 USD"
                    discount="AMAZON US"
                    isAr={isAr}
                    dropDirection="down"
                    tone="dark"
                  />
                </div>
              </div>

              <a
                target="_blank"
                rel="nofollow noopener noreferrer"
                href="https://link.amazon/B0hrqzi9f"
                className="block max-w-[300px] w-full rounded-md overflow-hidden border border-white/25 bg-white shadow-md hover:scale-[1.01] transition-transform shrink-0"
              >
                <img
                  width={958}
                  height={794}
                  src="/assets/banners/amazon-iphone-17-pro-max.jpg"
                  alt="Apple iPhone 17 Pro Max 256GB Deep Blue"
                  className="w-full max-h-[250px] object-contain block border-0"
                />
              </a>
            </div>

            <div className="@3xl/main:col-span-2 rounded-md border border-[#FF9900]/40 bg-gradient-to-r from-[#0F172A] via-[#1E293B] to-[#0F172A] text-white p-4 sm:p-5 flex flex-col @4xl/main:flex-row items-center justify-between gap-5 shadow-xs">
              <div className="space-y-2 text-center @4xl/main:text-start max-w-xl">
                <div className="inline-flex items-center gap-2">
                  <span className="px-2.5 py-0.5 text-[11px] font-extrabold bg-[#FF9900] text-zinc-950 rounded">
                    AMAZON UAE
                  </span>
                  <span className="text-[11px] font-semibold text-amber-200">
                    256GB · 7.6&quot; Inner + 5.4&quot; Super Retina XDR · A20 Pro
                  </span>
                </div>
                <h3 className="font-display text-lg sm:text-xl font-extrabold text-white leading-snug">
                  {isAr
                    ? 'ابل ايفون ديو (256 جيجابايت) - ابيض ستار | Amazon.ae'
                    : 'Apple iPhone Duo (256GB) - Star White · Amazon UAE'}
                </h3>
                <div className="flex flex-wrap items-baseline justify-center @4xl/main:justify-start gap-2">
                  <span className="font-display text-2xl font-extrabold text-[#FFD814]">
                    {isAr ? '8,499.00 درهم إماراتي' : 'AED 8,499.00'}
                  </span>
                  <span className="px-2 py-0.5 text-[11px] font-bold bg-white/15 text-amber-200 rounded">
                    {isAr ? 'أمازون الإمارات' : 'Amazon UAE Price'}
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-zinc-200 leading-relaxed">
                  {isAr
                    ? 'شاشة داخلية 7.6 إنش وشاشة خارجية سوبر ريتينا XDR بحجم 5.4 إنش، شريحة A20 Pro، كاميرا رئيسية احترافية وعمر بطارية يدوم طوال اليوم عبر أمازون الإمارات.'
                    : '7.6" inner display, 5.4" Super Retina XDR cover display, A20 Pro chip, main pro camera & all-day battery life via official Amazon UAE.'}
                </p>
                <div className="pt-1 flex flex-wrap items-center justify-center @4xl/main:justify-start gap-2">
                  <a
                    href="https://link.amazon/B098ugGO9"
                    target="_blank"
                    rel="nofollow noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#FFD814] hover:bg-[#F7CA00] text-zinc-950 border border-[#FCD200] text-xs font-extrabold rounded-full transition-colors whitespace-nowrap"
                  >
                    <span>{isAr ? 'عرض المنتج على Amazon UAE' : 'Shop on Amazon UAE'}</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                  <ShareButton
                    url="https://link.amazon/B098ugGO9"
                    shareId="amz-ae-iphone-duo"
                    title={isAr ? 'ابل ايفون ديو (256 جيجابايت) - أمازون الإمارات' : 'Apple iPhone Duo (256GB) - Amazon UAE'}
                    price={isAr ? '8,499.00 درهم إماراتي' : 'AED 8,499.00'}
                    discount="AMAZON UAE"
                    isAr={isAr}
                    dropDirection="down"
                    tone="dark"
                  />
                </div>
              </div>

              <a
                target="_blank"
                rel="nofollow noopener noreferrer"
                href="https://link.amazon/B098ugGO9"
                className="block max-w-[340px] w-full rounded-md overflow-hidden border border-white/25 bg-white shadow-md hover:scale-[1.01] transition-transform shrink-0"
              >
                <img
                  width={1500}
                  height={974}
                  src="/assets/banners/amazon-ae-iphone-duo.jpg"
                  alt="Apple iPhone Duo (256GB) - Star White"
                  className="w-full h-auto block border-0"
                />
              </a>
            </div>

            <div className="@3xl/main:col-span-2 rounded-md border border-[#FF9900]/40 bg-gradient-to-r from-[#1E1B4B] via-[#2E1065] to-[#1E1B4B] text-white p-4 sm:p-5 flex flex-col @4xl/main:flex-row items-center justify-between gap-5 shadow-xs">
              <div className="space-y-2 text-center @4xl/main:text-start max-w-xl">
                <div className="inline-flex items-center gap-2">
                  <span className="px-2.5 py-0.5 text-[11px] font-extrabold bg-[#FF9900] text-zinc-950 rounded">
                    AMAZON UAE
                  </span>
                  <span className="text-[11px] font-semibold text-amber-200">
                    512GB · 12GB RAM · Snapdragon 8 Elite Gen 5 · 5000mAh
                  </span>
                </div>
                <h3 className="font-display text-lg sm:text-xl font-extrabold text-white leading-snug">
                  {isAr
                    ? 'جوال سامسونج جالكسي S26 الترا كوبالت بنفسجي (512GB) | Amazon.ae'
                    : 'Samsung Galaxy S26 Ultra (512GB, 12GB RAM) - Cobalt Violet · Amazon UAE'}
                </h3>
                <div className="flex flex-wrap items-baseline justify-center @4xl/main:justify-start gap-2.5">
                  <span className="font-display text-2xl font-extrabold text-[#FFD814]">
                    {isAr ? '4,293.00 درهم' : 'AED 4,293.00'}
                  </span>
                  <span className="text-sm text-purple-200 line-through">
                    {isAr ? '5,899.00 درهم' : 'AED 5,899.00'}
                  </span>
                  <span className="px-2 py-0.5 text-[11px] font-extrabold bg-[#CC0C39] text-white rounded">
                    {isAr ? 'خصم 27% · وفّر 1,606 درهم' : '27% OFF · Save AED 1,606'}
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-zinc-200 leading-relaxed">
                  {isAr
                    ? 'هاتف ذكاء اصطناعي بمعالج Snapdragon 8 Elite Gen 5، شاشة خصوصية مدمجة، مساعد صور، تبريد بغرفة البخار وبطارية 5000mAh مع شحن فائق السرعة عبر أمازون الإمارات.'
                    : 'AI phone powered by Snapdragon 8 Elite Gen 5, built-in Privacy Display, Photo Assist, Vapor Chamber cooling & 5000mAh Super Fast Charging battery via Amazon UAE.'}
                </p>
                <div className="pt-1 flex flex-wrap items-center justify-center @4xl/main:justify-start gap-2">
                  <a
                    href="https://link.amazon/B0fIRBKga"
                    target="_blank"
                    rel="nofollow noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#FFD814] hover:bg-[#F7CA00] text-zinc-950 border border-[#FCD200] text-xs font-extrabold rounded-full transition-colors whitespace-nowrap"
                  >
                    <span>{isAr ? 'عرض المنتج على Amazon UAE' : 'Shop on Amazon UAE'}</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                  <ShareButton
                    url="https://link.amazon/B0fIRBKga"
                    shareId="amz-ae-galaxy-s26-ultra"
                    title={
                      isAr
                        ? 'جوال سامسونج جالكسي S26 الترا كوبالت بنفسجي 512GB - أمازون الإمارات'
                        : 'Samsung Galaxy S26 Ultra (512GB) Cobalt Violet - Amazon UAE'
                    }
                    price={isAr ? '4,293.00 درهم' : 'AED 4,293.00'}
                    oldPrice={isAr ? '5,899.00 درهم' : 'AED 5,899.00'}
                    discount="27% OFF"
                    isAr={isAr}
                    dropDirection="down"
                    tone="dark"
                  />
                </div>
              </div>

              <a
                target="_blank"
                rel="nofollow noopener noreferrer"
                href="https://link.amazon/B0fIRBKga"
                className="block max-w-[300px] w-full rounded-md overflow-hidden border border-white/25 bg-white shadow-md hover:scale-[1.01] transition-transform shrink-0"
              >
                <img
                  width={1480}
                  height={1500}
                  src="/assets/banners/amazon-ae-galaxy-s26-ultra.jpg"
                  alt="Samsung Galaxy S26 Ultra (512GB) - Cobalt Violet"
                  className="w-full max-h-[260px] object-contain block border-0"
                />
              </a>
            </div>

            {/* Amazon Egypt Product #1: Apple iPhone 17e 256GB White */}
            <div className="@3xl/main:col-span-2 rounded-md border border-[#FF9900]/40 bg-gradient-to-r from-[#0F172A] via-[#1E293B] to-[#0F172A] text-white p-4 sm:p-5 flex flex-col @4xl/main:flex-row items-center justify-between gap-5 shadow-xs">
              <div className="space-y-2 text-center @4xl/main:text-start max-w-xl">
                <div className="inline-flex items-center gap-2">
                  <span className="px-2.5 py-0.5 text-[11px] font-extrabold bg-[#FF9900] text-zinc-950 rounded whitespace-nowrap">
                    AMAZON EGYPT · أمازون مصر
                  </span>
                  <span className="text-[11px] font-semibold text-amber-200">
                    256GB · 6.1&quot; Super Retina XDR · A19 · 48MP
                  </span>
                </div>
                <h3 className="font-display text-lg sm:text-xl font-extrabold text-white leading-snug">
                  {isAr
                    ? 'آبل آيفون 17e سعة 256 جيجابايت — أبيض | Amazon.eg'
                    : 'Apple iPhone 17e 256GB (A19 Chip, 48MP Fusion Camera) - White · Amazon Egypt'}
                </h3>
                <div className="flex flex-wrap items-baseline justify-center @4xl/main:justify-start gap-2.5">
                  <span className="font-display text-2xl font-extrabold text-[#FFD814]">
                    {isAr ? '52,302.99 جنيه' : 'EGP 52,302.99'}
                  </span>
                  <span className="text-sm text-zinc-400 line-through">
                    {isAr ? '55,500.00 جنيه' : 'EGP 55,500.00'}
                  </span>
                  <span className="px-2 py-0.5 text-[11px] font-extrabold bg-[#CC0C39] text-white rounded">
                    {isAr ? 'خصم 6% · وفّر 3,197 جنيه' : '6% OFF · Save EGP 3,197'}
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-zinc-200 leading-relaxed">
                  {isAr
                    ? 'شاشة سوبر ريتينا XDR مقاس 6.1 بوصة، شريحة A19 السريعة، كاميرا فيوجن 48 ميجابكسل وبطارية تدوم طوال اليوم. وفّر حتى 2,000 جنيه بأكواد البنوك ABK20 و SWYPE25 على أمازون مصر.'
                    : '6.1" Super Retina XDR display, A19 chip, 48MP Fusion camera & all-day battery life on Amazon.eg. Save extra at checkout with bank codes ABK20 or SWYPE25.'}
                </p>
                <div className="pt-1 flex flex-wrap items-center justify-center @4xl/main:justify-start gap-2">
                  <a
                    href="https://link.amazon/B08Wer4Bh"
                    target="_blank"
                    rel="nofollow noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#FFD814] hover:bg-[#F7CA00] text-zinc-950 border border-[#FCD200] text-xs font-extrabold rounded-full transition-colors whitespace-nowrap"
                  >
                    <span>{isAr ? 'تسوق على أمازون مصر' : 'Shop on Amazon Egypt'}</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                  <ShareButton
                    url="https://link.amazon/B08Wer4Bh"
                    shareId="amz-eg-iphone-17e"
                    title={isAr ? 'آبل آيفون 17e سعة 256 جيجابايت - أمازون مصر' : 'Apple iPhone 17e 256GB White - Amazon Egypt'}
                    price={isAr ? '52,302.99 جنيه' : 'EGP 52,302.99'}
                    oldPrice={isAr ? '55,500.00 جنيه' : 'EGP 55,500.00'}
                    discount="6% OFF"
                    isAr={isAr}
                    dropDirection="down"
                    tone="dark"
                  />
                </div>
              </div>

              <a
                target="_blank"
                rel="nofollow noopener noreferrer"
                href="https://link.amazon/B08Wer4Bh"
                className="block max-w-[280px] w-full rounded-md overflow-hidden border border-white/25 bg-white shadow-md hover:scale-[1.01] transition-transform shrink-0"
              >
                <img
                  width={1440}
                  height={1500}
                  src="/assets/banners/amazon-eg-iphone-17e.jpg"
                  alt="Apple iPhone 17e 256GB White - Amazon Egypt"
                  className="w-full max-h-[250px] object-contain block border-0"
                />
              </a>
            </div>

            {/* Amazon Egypt Product #2: Apple iPhone Duo 256GB Night Sky */}
            <div className="@3xl/main:col-span-2 rounded-md border border-[#FF9900]/40 bg-gradient-to-r from-[#111827] via-[#1E1B4B] to-[#111827] text-white p-4 sm:p-5 flex flex-col @4xl/main:flex-row items-center justify-between gap-5 shadow-xs">
              <div className="space-y-2 text-center @4xl/main:text-start max-w-xl">
                <div className="inline-flex items-center gap-2">
                  <span className="px-2.5 py-0.5 text-[11px] font-extrabold bg-[#FF9900] text-zinc-950 rounded whitespace-nowrap">
                    AMAZON EGYPT · أمازون مصر
                  </span>
                  <span className="text-[11px] font-semibold text-amber-200">
                    256GB · 7.6&quot; Inner + 5.4&quot; Super Retina XDR · A20 Pro
                  </span>
                </div>
                <h3 className="font-display text-lg sm:text-xl font-extrabold text-white leading-snug">
                  {isAr
                    ? 'آيفون ديو 256 جيجابايت — نايت سكاي (تيتانيوم) | Amazon.eg'
                    : 'Apple iPhone Duo 256GB - Night Sky (A20 Pro · Titanium) · Amazon Egypt'}
                </h3>
                <div className="flex flex-wrap items-baseline justify-center @4xl/main:justify-start gap-2">
                  <span className="font-display text-2xl font-extrabold text-[#FFD814]">
                    {isAr ? '199,360.00 جنيه مصري' : 'EGP 199,360.00'}
                  </span>
                  <span className="px-2 py-0.5 text-[11px] font-bold bg-white/15 text-amber-200 rounded">
                    {isAr ? 'أمازون مصر' : 'Amazon Egypt Price'}
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-zinc-200 leading-relaxed">
                  {isAr
                    ? 'شاشة داخلية 7.6 إنش وخارجية 5.4 إنش سوبر ريتينا XDR، شريحة A20 Pro، إطار من التيتانيوم وبطارية طوال اليوم. متاح بخصم البنوك حتى 2,000 جنيه بكود ABK20 على أمازون مصر.'
                    : '7.6" inner + 5.4" Super Retina XDR display, A20 Pro chip, titanium build & all-day battery on Amazon.eg. Save up to 2,000 EGP with code ABK20.'}
                </p>
                <div className="pt-1 flex flex-wrap items-center justify-center @4xl/main:justify-start gap-2">
                  <a
                    href="https://link.amazon/B07dqJW1e"
                    target="_blank"
                    rel="nofollow noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#FFD814] hover:bg-[#F7CA00] text-zinc-950 border border-[#FCD200] text-xs font-extrabold rounded-full transition-colors whitespace-nowrap"
                  >
                    <span>{isAr ? 'تسوق على أمازون مصر' : 'Shop on Amazon Egypt'}</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                  <ShareButton
                    url="https://link.amazon/B07dqJW1e"
                    shareId="amz-eg-iphone-duo-sky"
                    title={isAr ? 'آيفون ديو 256 جيجابايت نايت سكاي - أمازون مصر' : 'Apple iPhone Duo 256GB Night Sky - Amazon Egypt'}
                    price={isAr ? '199,360.00 جنيه' : 'EGP 199,360.00'}
                    discount="AMAZON EGYPT"
                    isAr={isAr}
                    dropDirection="down"
                    tone="dark"
                  />
                </div>
              </div>

              <a
                target="_blank"
                rel="nofollow noopener noreferrer"
                href="https://link.amazon/B07dqJW1e"
                className="block max-w-[340px] w-full rounded-md overflow-hidden border border-white/25 bg-white shadow-md hover:scale-[1.01] transition-transform shrink-0"
              >
                <img
                  width={1500}
                  height={974}
                  src="/assets/banners/amazon-eg-iphone-duo-sky.jpg"
                  alt="Apple iPhone Duo 256GB Night Sky - Amazon Egypt"
                  className="w-full h-auto block border-0"
                />
              </a>
            </div>

            {/* Amazon Egypt Product #3: Sokany SK-100A Single Electric Burner */}
            <div className="@3xl/main:col-span-2 rounded-md border border-[#FF9900]/40 bg-gradient-to-r from-[#1E293B] via-[#0F172A] to-[#1E293B] text-white p-4 sm:p-5 flex flex-col @4xl/main:flex-row items-center justify-between gap-5 shadow-xs">
              <div className="space-y-2 text-center @4xl/main:text-start max-w-xl">
                <div className="inline-flex items-center gap-2">
                  <span className="px-2.5 py-0.5 text-[11px] font-extrabold bg-[#FF9900] text-zinc-950 rounded whitespace-nowrap">
                    AMAZON EGYPT · أمازون مصر
                  </span>
                  <span className="text-[11px] font-semibold text-amber-200">
                    1000W · SK-100A · Home &amp; Kitchen
                  </span>
                </div>
                <h3 className="font-display text-lg sm:text-xl font-extrabold text-white leading-snug">
                  {isAr
                    ? 'لوح تسخين كهربائي مفرد سوكاني SK-100A بقدرة 1000 وات | Amazon.eg'
                    : 'Sokany SK-100A Single Electric Burner Hot Plate (1000W) · Amazon Egypt'}
                </h3>
                <div className="flex flex-wrap items-baseline justify-center @4xl/main:justify-start gap-2.5">
                  <span className="font-display text-2xl font-extrabold text-[#FFD814]">
                    {isAr ? '639.00 جنيه' : 'EGP 639.00'}
                  </span>
                  <span className="text-sm text-zinc-400 line-through">
                    {isAr ? '819.00 جنيه' : 'EGP 819.00'}
                  </span>
                  <span className="px-2 py-0.5 text-[11px] font-extrabold bg-[#CC0C39] text-white rounded">
                    {isAr ? 'خصم 22% · وفّر 180 جنيه' : '22% OFF · Save EGP 180'}
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-zinc-200 leading-relaxed">
                  {isAr
                    ? 'سخان كهربائي عملي بقدرة 1000 وات وتصميم مدمج وتحكم بدرجات الحرارة ومؤشر ضوئي من سوكاني على أمازون مصر — مؤهل لأكواد خصم البنوك QNBC200 و SWYPE25.'
                    : 'Compact 1000W countertop single electric burner hot plate (SK-100A) by Sokany with adjustable thermostat on Amazon.eg — eligible for QNBC200 & SWYPE25 bank discounts.'}
                </p>
                <div className="pt-1 flex flex-wrap items-center justify-center @4xl/main:justify-start gap-2">
                  <a
                    href="https://link.amazon/B03bXQEs9"
                    target="_blank"
                    rel="nofollow noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#FFD814] hover:bg-[#F7CA00] text-zinc-950 border border-[#FCD200] text-xs font-extrabold rounded-full transition-colors whitespace-nowrap"
                  >
                    <span>{isAr ? 'تسوق على أمازون مصر' : 'Shop on Amazon Egypt'}</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                  <ShareButton
                    url="https://link.amazon/B03bXQEs9"
                    shareId="amz-eg-sokany-sk100a"
                    title={isAr ? 'لوح تسخين كهربائي سوكاني SK-100A - أمازون مصر' : 'Sokany SK-100A Electric Burner 1000W - Amazon Egypt'}
                    price={isAr ? '639.00 جنيه' : 'EGP 639.00'}
                    oldPrice={isAr ? '819.00 جنيه' : 'EGP 819.00'}
                    discount="22% OFF"
                    isAr={isAr}
                    dropDirection="down"
                    tone="dark"
                  />
                </div>
              </div>

              <a
                target="_blank"
                rel="nofollow noopener noreferrer"
                href="https://link.amazon/B03bXQEs9"
                className="block max-w-[320px] w-full rounded-md overflow-hidden border border-white/25 bg-white shadow-md hover:scale-[1.01] transition-transform shrink-0"
              >
                <img
                  width={1473}
                  height={941}
                  src="/assets/banners/amazon-eg-sokany-sk100a.jpg"
                  alt="Sokany SK-100A Single Electric Burner 1000W - Amazon Egypt"
                  className="w-full h-auto block border-0"
                />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Row 1: Visual Hero Carousel */}
      <section aria-label="Featured Coupon Campaigns" className="relative px-3 sm:px-4 pt-3">
        <div className="flex sm:hidden items-center justify-end gap-1.5 mb-1.5" dir="ltr">
          <button
            type="button"
            onClick={() => scrollTrack(heroScrollRef, 'left')}
            aria-label="Scroll hero deals left"
            className="w-8 h-8 bg-white border border-zinc-300 rounded-md flex items-center justify-center shadow-xs text-zinc-800 active:bg-zinc-100 cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => scrollTrack(heroScrollRef, 'right')}
            aria-label="Scroll hero deals right"
            className="w-8 h-8 bg-white border border-zinc-300 rounded-md flex items-center justify-center shadow-xs text-zinc-800 active:bg-zinc-100 cursor-pointer"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="relative" dir="ltr">
          <button
            type="button"
            onClick={() => scrollTrack(heroScrollRef, 'left')}
            aria-label="Scroll hero deals left"
            className="hidden sm:flex absolute left-2 top-1/2 -translate-y-1/2 z-20 w-10 h-20 bg-white/95 hover:bg-white border border-zinc-300 rounded-md items-center justify-center shadow-md text-zinc-800 cursor-pointer"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          <div
            ref={heroScrollRef}
            className="flex gap-3 overflow-x-auto pb-3 dodx-hscroll"
          >
            {HERO_BASE.map((card, i) => {
              const copy = t.heroCards[i] || t.heroCards[0];
              const cardClasses = `relative shrink-0 w-[250px] sm:w-[295px] h-[370px] sm:h-[410px] rounded-xl text-start shadow-sm hover:shadow-md transition-transform duration-150 hover:-translate-y-0.5 flex flex-col justify-between ${card.bgClass} ${card.textClass}`;
              const isDarkBg = card.bgClass !== 'bg-[#E5DFD5]' && card.bgClass !== 'bg-[#F5EBD9]';

              return (
                <div key={card.id} className={cardClasses}>
                  <div className="p-4 sm:p-5 z-20 flex items-start justify-between gap-2" dir="auto">
                    <a
                      href={card.externalUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="min-w-0 flex-1 cursor-pointer"
                    >
                      <span className="block text-xs font-semibold opacity-95">
                        {copy.eyebrow}
                      </span>
                      <h2 className="mt-1 font-display text-xl sm:text-[22px] font-extrabold leading-tight tracking-tight">
                        {copy.title}
                      </h2>
                      <span className="mt-2.5 inline-block px-2.5 py-1 rounded-md bg-black/15 backdrop-blur-xs text-[11px] font-bold">
                        {copy.ctaLabel}
                      </span>
                    </a>
                    <ShareButton
                      url={card.externalUrl}
                      shareId={card.storeId === 'amazon' ? 'amazon-us' : card.storeId}
                      title={copy.title}
                      discount={copy.ctaLabel}
                      isAr={isAr}
                      compact
                      dropDirection="down"
                      tone={isDarkBg ? 'dark' : 'light'}
                    />
                  </div>

                  <a
                    href={card.externalUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="relative flex-1 w-full overflow-hidden rounded-b-xl block cursor-pointer"
                  >
                    <img
                      src={card.image}
                      alt={copy.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover object-center"
                    />
                  </a>
                </div>
              );
            })}
          </div>

          <button
            type="button"
            onClick={() => scrollTrack(heroScrollRef, 'right')}
            aria-label="Scroll hero deals right"
            className="hidden sm:flex absolute right-2 top-1/2 -translate-y-1/2 z-20 w-10 h-20 bg-white/95 hover:bg-white border border-zinc-300 rounded-md items-center justify-center shadow-md text-zinc-800 cursor-pointer"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>
      </section>

      {/* Row 2: Second Visual Strip — Colorful Under $25 / Under $50 Deal Cards */}
      <section aria-label="Quick Coupon Categories" className="relative px-3 sm:px-4 mt-2">
        <div className="flex sm:hidden items-center justify-end gap-1.5 mb-1.5" dir="ltr">
          <button
            type="button"
            onClick={() => scrollTrack(stripScrollRef, 'left')}
            aria-label="Scroll category tiles left"
            className="w-8 h-8 bg-white border border-zinc-300 rounded-md flex items-center justify-center shadow-xs text-zinc-800 active:bg-zinc-100 cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => scrollTrack(stripScrollRef, 'right')}
            aria-label="Scroll category tiles right"
            className="w-8 h-8 bg-white border border-zinc-300 rounded-md flex items-center justify-center shadow-xs text-zinc-800 active:bg-zinc-100 cursor-pointer"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="relative" dir="ltr">
          <button
            type="button"
            onClick={() => scrollTrack(stripScrollRef, 'left')}
            aria-label="Scroll category tiles left"
            className="hidden sm:flex absolute left-2 top-1/2 -translate-y-1/2 z-20 w-9 h-16 bg-white/95 hover:bg-white border border-zinc-300 rounded-md items-center justify-center shadow-md text-zinc-800 cursor-pointer"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <div
            ref={stripScrollRef}
            className="flex gap-3 overflow-x-auto pb-3 dodx-hscroll"
          >
            {QUICK_STRIP_BASE.map((tile, i) => {
              const copy = t.quickStrip[i] || t.quickStrip[0];
              const tileClasses = `shrink-0 w-[175px] sm:w-[205px] h-[220px] rounded-xl overflow-hidden text-start border border-black/10 shadow-xs hover:shadow-md transition-transform duration-150 hover:-translate-y-0.5 cursor-pointer flex flex-col justify-between ${tile.bg} ${tile.text}`;
              const tileContent = (
                <>
                  <div className="p-3.5 pb-1" dir="auto">
                    <h3 className="font-display text-base font-extrabold leading-tight">
                      {copy.title}
                    </h3>
                    <p className="mt-0.5 text-[11px] font-semibold opacity-80">
                      {copy.subtitle}
                    </p>
                  </div>
                  <div className="h-[132px] w-full overflow-hidden">
                    <img
                      src={tile.image}
                      alt={copy.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </>
              );

              return (
                <a
                  key={tile.storeId + i}
                  href={tile.externalUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={tileClasses}
                >
                  {tileContent}
                </a>
              );
            })}
          </div>

          <button
            type="button"
            onClick={() => scrollTrack(stripScrollRef, 'right')}
            aria-label="Scroll category tiles right"
            className="hidden sm:flex absolute right-2 top-1/2 -translate-y-1/2 z-20 w-9 h-16 bg-white/95 hover:bg-white border border-zinc-300 rounded-md items-center justify-center shadow-md text-zinc-800 cursor-pointer"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </section>

      {/* Row 3: 4-Column White Bento Cards with 2x2 Coupon Photo Grids */}
      <section aria-label="Curated Store Coupon Collections" className="px-3 sm:px-4 mt-4">
        <div className="grid grid-cols-1 @md/main:grid-cols-2 @5xl/main:grid-cols-4 gap-4">
          {bentoQuadrants.map((quad) => (
              <div
                key={quad.storeId + quad.heading}
                className="bg-white border border-zinc-200/90 rounded-sm p-4 sm:p-5 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <h2 className="font-display text-lg font-extrabold text-zinc-950 tracking-tight">
                      {quad.heading}
                    </h2>
                    <ShareButton
                      url={quad.linkUrl}
                      shareId={quad.storeId === 'amazon' ? 'amazon-us' : quad.storeId}
                      title={quad.heading}
                      discount={quad.linkLabel}
                      isAr={isAr}
                      compact
                      dropDirection="down"
                    />
                  </div>
                  <div className="mt-3 grid grid-cols-2 gap-2.5">
                    {quad.tiles.map((item) => (
                      <div key={item.label} className="group text-start flex flex-col">
                        <a
                          href={item.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="cursor-pointer block flex-1"
                        >
                          <div className="aspect-square w-full overflow-hidden rounded-sm bg-zinc-100 border border-zinc-200/70">
                            <img
                              src={item.img}
                              alt={item.label}
                              referrerPolicy="no-referrer"
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                            />
                          </div>
                        </a>
                        <div className="mt-1.5 flex items-start justify-between gap-1">
                          <a
                            href={item.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs font-medium text-zinc-800 hover:text-[#C7511F] leading-snug line-clamp-2 flex-1"
                          >
                            {item.label}
                          </a>
                          <ShareButton
                            url={item.url}
                            shareId={item.id}
                            title={item.label}
                            discount={quad.linkLabel}
                            isAr={isAr}
                            compact
                            dropDirection="up"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <a
                  href={quad.linkUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-block text-start text-[13px] font-semibold text-[#007185] hover:text-[#C7511F] hover:underline cursor-pointer"
                >
                  {quad.linkLabel}
                </a>
              </div>
          ))}
        </div>
      </section>

      {/* Row 4: Interactive Auto-Scrolling Product & Coupon Ticker Marquee */}
      <section id="top-stores" className="px-3 sm:px-4 mt-5">
        <div className="bg-white border border-zinc-200/90 rounded-sm p-4 sm:p-5 overflow-hidden">
          <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-zinc-200">
            <div className="flex flex-wrap items-center gap-3">
              <h2 className="font-display text-lg sm:text-xl font-extrabold text-zinc-950">
                {t.liveFeedTitle}
              </h2>
              <span className="text-xs font-medium text-zinc-500">
                {t.liveFeedHint}
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-1.5">
              {categoryTabs.map((cat) => (
                <button
                  key={cat.key}
                  type="button"
                  onClick={() => onSelectCategory(cat.key)}
                  className={`px-2.5 py-1 text-xs font-semibold rounded-md border transition-colors cursor-pointer whitespace-nowrap ${
                    activeCategory === cat.key
                      ? 'bg-[#00453E] text-white border-[#00453E]'
                      : 'bg-zinc-50 text-zinc-700 border-zinc-300 hover:bg-zinc-100'
                  }`}
                >
                  {cat.label}
                </button>
              ))}

              <button
                type="button"
                onClick={() => setMarqueePaused((p) => !p)}
                aria-label={marqueePaused ? t.play : t.pause}
                className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold bg-zinc-100 hover:bg-zinc-200 text-zinc-900 border border-zinc-300 rounded-md cursor-pointer whitespace-nowrap ms-1"
              >
                {marqueePaused ? (
                  <>
                    <Play className="w-3.5 h-3.5" />
                    {t.play}
                  </>
                ) : (
                  <>
                    <Pause className="w-3.5 h-3.5" />
                    {t.pause}
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Continuous Ticker Gallery (kept dir="ltr" on track container for smooth CSS loop across RTL/LTR) */}
          <div className="dodx-marquee-wrap relative mt-4 overflow-hidden" dir="ltr">
            <div
              className={`dodx-marquee-track gap-3.5 ${
                marqueePaused ? 'is-paused' : ''
              }`}
            >
              {marqueeItems.map(({ deal, store }, index) => {
                const thumb =
                  DEAL_THUMBNAILS[deal.id] ||
                  '/assets/images/hero_smart_shopping_1794810594006.jpg';
                return (
                  <div
                    key={`${deal.id}-${index}`}
                    dir="auto"
                    className="w-[225px] sm:w-[245px] shrink-0 bg-[#FAFAFA] hover:bg-white border border-zinc-200 hover:border-[#007185] rounded-lg flex flex-col justify-between transition-colors shadow-2xs"
                  >
                    <div>
                      <a
                        href={deal.affiliateUrl || store.affiliateUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => {
                          e.preventDefault();
                          onActivateDeal(deal, store);
                        }}
                        className="relative w-full h-40 bg-zinc-100 overflow-hidden rounded-t-lg block cursor-pointer group"
                      >
                        <img
                          src={thumb}
                          alt={deal.title}
                          referrerPolicy="no-referrer"
                          className={`w-full h-full group-hover:scale-105 transition-transform duration-200 ${
                            (deal.id.startsWith('amz-jp-') && deal.id !== 'amz-jp-coupons' && deal.id !== 'amz-jp-store' && deal.id !== 'amz-jp-blackfriday-dates') ||
                            (deal.id.startsWith('amz-eg-') && !['amz-eg-store', 'amz-eg-swype', 'amz-eg-abk', 'amz-eg-qnb', 'amz-eg-3'].includes(deal.id))
                              ? 'object-contain bg-white p-1.5'
                              : 'object-cover'
                          }`}
                        />
                        <span className="absolute top-2 left-2 bg-[#CC0C39] text-white font-display text-[11px] font-extrabold px-2 py-0.5 rounded-xs shadow-xs tabular-nums">
                          {deal.discountLabel}
                        </span>
                        <span className="absolute bottom-2 left-2 bg-black/75 text-white text-[11px] font-semibold px-2 py-0.5 rounded-xs">
                          {store.name}
                        </span>
                      </a>

                      <div className="p-3">
                        <div className="flex items-center justify-between gap-2 text-[11px]">
                          <span className="font-bold text-[#CC0C39]">
                            {t.limitedTimeDeal}
                          </span>
                          {deal.code ? (
                            <code className="font-mono font-bold text-zinc-950 bg-amber-100/90 border border-amber-300 px-1.5 py-0.5 rounded-xs">
                              {deal.code}
                            </code>
                          ) : (
                            <span className="font-semibold text-[#007600]">
                              {t.autoDeal}
                            </span>
                          )}
                        </div>
                        <h3 className="mt-1.5 font-display text-[13px] font-bold text-zinc-950 leading-snug line-clamp-2">
                          {deal.title}
                        </h3>
                        {deal.price && (
                          <div className="mt-1 flex flex-wrap items-baseline gap-1.5">
                            <span className="font-display text-xs font-extrabold text-[#B12704]">
                              {deal.price}
                            </span>
                            {deal.oldPrice && (
                              <span className="text-[11px] text-zinc-500 line-through">
                                {deal.oldPrice}
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="px-3 pb-3 flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => onActivateDeal(deal, store)}
                        className="flex-1 min-w-0 py-1.5 px-3 bg-[#FFD814] hover:bg-[#F7CA00] text-zinc-950 border border-[#FCD200] text-xs font-bold rounded-full transition-colors cursor-pointer flex items-center justify-center gap-1.5 whitespace-nowrap"
                      >
                        {deal.code ? (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            {t.copyAndShop}
                          </>
                        ) : (
                          <>
                            <ExternalLink className="w-3.5 h-3.5" />
                            {t.claimDeal}
                          </>
                        )}
                      </button>
                      <ShareButton
                        url={deal.affiliateUrl || store.affiliateUrl}
                        shareId={deal.id}
                        title={deal.title}
                        price={deal.price}
                        oldPrice={deal.oldPrice}
                        discount={deal.discountLabel}
                        isAr={isAr}
                        compact
                        dropDirection="up"
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Row 5: Hot Verified Coupons & Deals Product Grid */}
      <section id="hot-deals" className="px-3 sm:px-4 mt-5">
        <div className="bg-white border border-zinc-200/90 rounded-sm p-4 sm:p-5">
          <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-zinc-200">
            <div className="flex items-center gap-2">
              <Tag className="w-5 h-5 text-[#CC0C39]" />
              <h2 className="font-display text-xl font-extrabold text-zinc-950">
                {t.verifiedCouponsHeading}
              </h2>
            </div>
            <span className="text-xs font-medium text-zinc-600 tabular-nums">
              {filteredDeals.length} {t.verifiedOffersReady}
            </span>
          </div>

          {filteredDeals.length === 0 ? (
            matchedCatalogBrands.length > 0 ? (
              <div className="py-6 text-center text-xs sm:text-sm text-zinc-600">
                <button
                  type="button"
                  onClick={() => onNavigateProducts(matchedCatalogBrands[0]?.dept.id)}
                  className="px-4 py-2 bg-[#FFD814] hover:bg-[#F7CA00] text-zinc-950 text-xs font-bold rounded-full border border-[#FCD200] cursor-pointer"
                >
                  {t.exploreAllProducts}
                </button>
              </div>
            ) : (
              <div className="py-10 text-center">
                <p className="text-sm font-semibold text-zinc-900">
                  {t.noCouponsMatch}
                </p>
                <button
                  type="button"
                  onClick={onClearSearch}
                  className="mt-3 px-4 py-2 bg-[#FFD814] hover:bg-[#F7CA00] text-zinc-950 text-xs font-bold rounded-full border border-[#FCD200] cursor-pointer"
                >
                  {t.resetSearch}
                </button>
              </div>
            )
          ) : (
            <div className="mt-4 grid grid-cols-1 @2xl/main:grid-cols-2 @5xl/main:grid-cols-3 gap-4">
              {filteredDeals.map(({ deal, store }) => {
                const thumb =
                  DEAL_THUMBNAILS[deal.id] ||
                  '/assets/images/hero_smart_shopping_1794810594006.jpg';
                return (
                  <article
                    key={deal.id}
                    className="border border-zinc-200 rounded-lg bg-white hover:shadow-md transition-shadow flex flex-col justify-between"
                  >
                    <div>
                      <div className="relative h-44 bg-zinc-100 overflow-hidden rounded-t-lg">
                        <a
                          href={deal.affiliateUrl || store.affiliateUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => {
                            e.preventDefault();
                            onActivateDeal(deal, store);
                          }}
                          className="block w-full h-full group cursor-pointer"
                        >
                          <img
                            src={thumb}
                            alt={deal.title}
                            referrerPolicy="no-referrer"
                            className={`w-full h-full group-hover:scale-105 transition-transform duration-200 ${
                              (deal.id.startsWith('amz-jp-') && deal.id !== 'amz-jp-coupons' && deal.id !== 'amz-jp-store' && deal.id !== 'amz-jp-blackfriday-dates') ||
                              (deal.id.startsWith('amz-eg-') && !['amz-eg-store', 'amz-eg-swype', 'amz-eg-abk', 'amz-eg-qnb', 'amz-eg-3'].includes(deal.id))
                                ? 'object-contain bg-white p-2'
                                : 'object-cover'
                            }`}
                          />
                          <div className="absolute top-2.5 start-2.5 bg-[#CC0C39] text-white font-display text-xs font-extrabold px-2.5 py-1 rounded-sm shadow-xs tabular-nums">
                            {deal.discountLabel}
                          </div>
                        </a>
                        <button
                          type="button"
                          onClick={() => onSelectStore(store.id)}
                          className="absolute top-2.5 end-2.5 z-10 bg-white/95 hover:bg-white text-zinc-950 text-xs font-bold px-2.5 py-1 rounded-sm shadow-xs border border-zinc-200 cursor-pointer"
                        >
                          {store.name}
                        </button>
                      </div>

                      <div className="p-4">
                        <div className="text-xs text-zinc-500 flex items-center gap-1.5">
                          <span>{store.domain}</span>
                          <span aria-hidden="true">·</span>
                          <span>{deal.verifiedDate}</span>
                        </div>
                        <h3 className="mt-1 font-display text-[15px] font-bold text-zinc-950 leading-snug">
                          <a
                            href={deal.affiliateUrl || store.affiliateUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => {
                              e.preventDefault();
                              onActivateDeal(deal, store);
                            }}
                            className="hover:text-[#C7511F] hover:underline"
                          >
                            {deal.title}
                          </a>
                        </h3>
                        {deal.price && (
                          <div className="mt-1.5 flex flex-wrap items-baseline gap-2">
                            <span className="font-display text-base sm:text-lg font-extrabold text-[#B12704]">
                              {deal.price}
                            </span>
                            {deal.oldPrice && (
                              <span className="text-xs text-zinc-500 line-through">
                                {deal.oldPrice}
                              </span>
                            )}
                          </div>
                        )}
                        <p className="mt-1.5 text-xs sm:text-sm text-zinc-600 leading-relaxed">
                          {deal.description}
                        </p>
                      </div>
                    </div>

                    <div className="px-4 pb-4 space-y-2.5">
                      {deal.code ? (
                        <div className="flex items-center justify-between text-xs bg-zinc-50 border border-dashed border-zinc-400 rounded-md px-3 py-2">
                          <span className="text-zinc-600 font-medium">
                            {t.promoCodeLabel}
                          </span>
                          <code className="font-mono font-bold text-zinc-950 tracking-wider">
                            {deal.code}
                          </code>
                        </div>
                      ) : (
                        <div className="flex items-center justify-between text-xs bg-emerald-50/70 border border-emerald-200 rounded-md px-3 py-2">
                          <span className="text-emerald-900 font-medium">
                            {t.activationLabel}
                          </span>
                          <span className="font-semibold text-emerald-800">
                            {t.noCodeNeeded}
                          </span>
                        </div>
                      )}

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => onActivateDeal(deal, store)}
                          className="flex-1 min-w-0 inline-flex items-center justify-center gap-2 px-4 py-2.5 min-h-[40px] bg-[#FFD814] hover:bg-[#F7CA00] active:bg-[#F0B800] text-zinc-950 border border-[#FCD200] text-xs sm:text-sm font-bold rounded-full transition-colors cursor-pointer whitespace-nowrap"
                        >
                          {deal.code ? (
                            <>
                              <Copy className="w-4 h-4" />
                              {t.copyCodeAndGo}
                            </>
                          ) : (
                            <>
                              <ExternalLink className="w-4 h-4" />
                              {t.activateDeal}
                            </>
                          )}
                        </button>
                        <ShareButton
                          url={deal.affiliateUrl || store.affiliateUrl}
                          shareId={deal.id}
                          title={deal.title}
                          price={deal.price}
                          oldPrice={deal.oldPrice}
                          discount={deal.discountLabel}
                          isAr={isAr}
                          dropDirection="up"
                        />
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Row 6: Consumer Chrome Companion Strip */}
      <section className="px-3 sm:px-4 mt-5">
        <div className="bg-[#00453E] text-white border border-emerald-900 rounded-sm p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start sm:items-center gap-4">
            <div className="w-11 h-11 rounded-xl bg-white/10 border border-white/15 flex items-center justify-center shrink-0">
              <Chrome className="w-6 h-6 text-[#FF9900]" />
            </div>
            <div>
              <h2 className="font-display text-base sm:text-lg font-extrabold text-white">
                {t.saveAutoHeading}
              </h2>
              <p className="mt-0.5 text-xs sm:text-sm text-emerald-100">
                {t.saveAutoSub}
              </p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <a
              href="https://chromewebstore.google.com/detail/cllebmldcnbpmjbjifjphnljgfohjgih?utm_source=item-share-cb"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-5 py-2.5 min-h-[42px] bg-[#FFD814] hover:bg-[#F7CA00] text-zinc-950 border border-[#FCD200] text-xs sm:text-sm font-bold rounded-full transition-colors whitespace-nowrap shrink-0"
            >
              <Chrome className="w-4 h-4" />
              <span>{t.addDodxToChromeCta}</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
            <button
              type="button"
              onClick={onOpenInstallModal}
              className="px-4 py-2.5 min-h-[42px] bg-white/10 hover:bg-white/20 text-white border border-white/25 text-xs font-semibold rounded-full transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              {t.chromeExtension}
            </button>
          </div>
        </div>
      </section>

      {/* Row 7: Affiliate Disclosure Strip */}
      <section className="px-3 sm:px-4 mt-5">
        <div className="bg-white border border-zinc-200 rounded-sm p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="max-w-4xl">
            <h2 className="font-display text-sm font-bold text-zinc-950">
              {t.affiliateDisclosure}
            </h2>
            <p className="mt-1 text-xs sm:text-sm text-zinc-600 leading-relaxed">
              {t.affiliateStatement}
            </p>
          </div>
          <div className="flex items-center gap-4 shrink-0 text-xs font-semibold">
            <button
              type="button"
              onClick={() => onNavigateLegal('disclosure')}
              className="text-[#007185] hover:text-[#C7511F] hover:underline cursor-pointer whitespace-nowrap"
            >
              {t.readFullDisclosure}
            </button>
            <button
              type="button"
              onClick={() => onNavigateLegal('privacy')}
              className="text-[#007185] hover:text-[#C7511F] hover:underline cursor-pointer whitespace-nowrap"
            >
              {t.privacyPolicy}
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
