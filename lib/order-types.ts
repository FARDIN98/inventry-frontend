export type OrderStatus = 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  product_name: string;
  quantity: number;
  unit_price: number;
}

export interface Order {
  id: string;
  customer_name: string;
  status: OrderStatus;
  total_price: number;
  item_count: number;
  created_at: string;
  updated_at: string;
  items?: OrderItem[];
}

export interface CreateOrderPayload {
  customer_name: string;
  items: Array<{
    product_id: string;
    quantity: number;
  }>;
}

export interface PaginatedOrders {
  data: Order[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
