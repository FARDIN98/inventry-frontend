import type { ProductStatus } from '@/lib/catalog-types';

export interface DashboardStats {
  orders_today: number;
  pending_count: number;
  completed_count: number;
  revenue_today: number;
  low_stock_count: number;
}

export interface LowStockProduct {
  id: string;
  name: string;
  stock_quantity: number;
  status: Extract<ProductStatus, 'low_stock' | 'out_of_stock'>;
}

export interface ActivityEntry {
  timestamp: string; // ISO 8601 string from backend
  action_type: string; // e.g. "Order Placed", "Order Confirmed"
  description: string; // e.g. "Order #ORD-ABCD1234 for John Smith — $150.00"
}

export interface ChartDataPoint {
  date: string; // ISO date string e.g. "2026-03-15"
  count: number; // number of orders on that date
}
