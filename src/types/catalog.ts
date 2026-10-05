export type ProductAvailability = 'disponible' | 'por_encargo' | 'agotado';

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  iconName?: string;
  order: number;
  priceListImageUrl?: string;
}

export interface Product {
  id: string;
  title: string;
  categoryId: string;
  description: string;
  suggestedPrice: number;
  currency: string;
  imageUrl: string;
  galleryImages?: string[];
  includes?: string[];
  tags: string[];
  availability: ProductAvailability;
  isFeatured?: boolean;
  leadTimeHours?: number; // e.g. 24h
  createdAt: string;
}

export interface StoreSettings {
  storeName: string;
  tagline: string;
  whatsappNumber: string; // e.g., '573001234567' or '3101234567'
  instagramUsername: string;
  instagramUrl?: string;
  logoUrl: string;
  currencySymbol: string;
  currencyCode: string;
  deliveryCoverage: string;
  customGreetingMessage: string;
  adminPin: string;
  flowerPricesImageUrl?: string;
}

export interface FilterState {
  categoryId: string;
  searchQuery: string;
  priceRange: 'all' | 'under-50' | '50-100' | '100-200' | 'over-200';
  selectedTag: string;
  sortBy: 'featured' | 'price-asc' | 'price-desc' | 'name-asc';
}
