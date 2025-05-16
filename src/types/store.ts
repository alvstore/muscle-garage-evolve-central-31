
export interface StoreProduct {
  id: string;
  name: string;
  description?: string;
  sku?: string;
  price: number;
  cost_price?: number;
  inventory_count?: number;
  category?: string;
  image_url?: string;
  is_active?: boolean;
  branch_id?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Order {
  id: string;
  order_number?: string;
  member_id?: string;
  total_amount: number;
  status?: OrderStatus;
  payment_method?: string;
  order_date?: string;
  completed_date?: string;
  notes?: string;
  branch_id: string;
  created_by?: string;
  created_at?: string;
  updated_at?: string;
  items?: OrderItem[];
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  quantity: number;
  price_per_unit: number;
  total_price: number;
  created_at?: string;
  updated_at?: string;
  product?: StoreProduct;
}

export type OrderStatus = 'pending' | 'paid' | 'completed' | 'cancelled' | 'refunded';
