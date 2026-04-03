export type RestockPriority = 'priority_high' | 'priority_medium' | 'priority_low';

export interface RestockItem {
  id: string;
  name: string;
  price: string;
  stock_quantity: number;
  min_stock_threshold: number;
  category_id: string;
  category_name: string;
  priority: 'high' | 'medium' | 'low';
}
