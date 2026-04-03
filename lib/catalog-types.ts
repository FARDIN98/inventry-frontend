export interface Category {
  id: string;
  name: string;
  created_at: string;
  updated_at: string;
}

export type ProductStatus = 'active' | 'low_stock' | 'out_of_stock';

export interface Product {
  id: string;
  name: string;
  category_id: string;
  category_name: string;
  price: number;
  stock_quantity: number;
  min_stock_threshold: number;
  status: ProductStatus;
  created_at: string;
  updated_at: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
