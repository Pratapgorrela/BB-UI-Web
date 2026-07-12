import type { Money } from '../../../types/common';
import type { Pagination } from '../../../types/api';

type ServiceType = 'COMBO' | 'SINGLE';

type ServiceSortBy = 'price_asc' | 'price_desc' | 'rating' | 'name';

interface ServiceCategory {
  id: string;
  name: string;
  slug: string;
  description: string;
  imageUrl: string;
  heroImageUrl: string;
  serviceCount: number;
  sortOrder: number;
}

interface Service {
  id: string;
  categoryId: string;
  type: ServiceType;
  name: string;
  description: string;
  shortDescription: string;
  imageUrl: string;
  galleryUrls: string[];
  price: Money;
  originalPrice: Money | null;
  discountPercent: number | null;
  includedServiceIds: string[];
  duration: number;
  isPopular: boolean;
  rating: number;
  reviewCount: number;
  tags: string[];
  createdAt: string;
}

interface ServiceFilters {
  categoryId?: string;
  type?: ServiceType;
  search?: string;
  isPopular?: boolean;
  minPrice?: number;
  maxPrice?: number;
  sortBy?: ServiceSortBy;
  page?: number;
  limit?: number;
}

interface ServicesPage {
  services: Service[];
  pagination: Pagination;
}

export type {
  Service,
  ServiceCategory,
  ServiceFilters,
  ServiceSortBy,
  ServicesPage,
  ServiceType,
};
