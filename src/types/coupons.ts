export interface Deal {
  id: string;
  title: string;
  description: string;
  code: string | null;
  discountLabel: string;
  price?: string;
  oldPrice?: string;
  affiliateUrl: string;
  featured: boolean;
  verifiedDate: string;
}

export interface Store {
  id: string;
  name: string;
  domain: string;
  matchDomains: string[];
  category: 'Marketplaces' | 'Fashion' | 'Electronics & Home';
  network: string;
  brandColor: string;
  affiliateUrl: string;
  tagline: string;
  deals: Deal[];
}

export interface CouponsPayload {
  version: string;
  updatedAt: string;
  siteUrl: string;
  stores: Store[];
}

export interface ShareProductItem {
  id: string;
  title: string;
  titleAr?: string;
  description: string;
  descriptionAr?: string;
  price?: string;
  oldPrice?: string;
  discount?: string;
  savingsEn?: string;
  savingsAr?: string;
  code?: string | null;
  image: string;
  storeId: string;
  storeName: string;
  affiliateUrl: string;
}

export type AppRoute = 'home' | 'deals' | 'products' | 'product' | 'disclosure' | 'privacy';
