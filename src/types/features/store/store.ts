
// Store and product management types
export type ProductStatus = 'active' | 'inactive' | 'out_of_stock';
export type OrderStatus = 'pending' | 'confirmed' | 'preparing' | 'ready' | 'completed' | 'cancelled';

export interface Product {
  id: string;
  name: string;
  description?: string;
  category: string;
  price: number;
  salePrice?: number;
  cost?: number;
  sku: string;
  barcode?: string;
  quantity: number;
  reorderLevel: number;
  status: ProductStatus;
  images?: string[];
  branch_id: string;
  supplier?: string;
  supplier_contact?: string;
  created_at: string;
  updated_at: string;
}

export interface CartItem {
  productId: string;
  product: Product;
  quantity: number;
  price: number;
}

export interface Order {
  id: string;
  customer_id?: string;
  customer_name?: string;
  customer_phone?: string;
  branch_id: string;
  items: OrderItem[];
  subtotal: number;
  tax: number;
  total: number;
  status: OrderStatus;
  payment_method?: string;
  payment_status?: string;
  notes?: string;
  created_by?: string;
  created_at: string;
  updated_at: string;
}

export interface OrderItem {
  id: string;
  product_id: string;
  product_name: string;
  quantity: number;
  unit_price: number;
  total_price: number;
}

export interface CreateProductInput {
  name: string;
  description?: string;
  category: string;
  price: number;
  salePrice?: number;
  cost?: number;
  sku: string;
  barcode?: string;
  quantity: number;
  reorderLevel: number;
  status?: ProductStatus;
  images?: string[];
  supplier?: string;
  supplier_contact?: string;
  branch_id: string;
}
