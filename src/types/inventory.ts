
export interface InventoryItem {
  id: string;
  name: string;
  description?: string;
  sku: string;
  barcode?: string;
  category?: string;
  supplier?: string;
  supplier_contact?: string;
  quantity: number;
  reorderLevel: number;
  price: number;
  cost_price: number;
  status: 'in-stock' | 'low-stock' | 'out-of-stock';
  location?: string;
  image?: string;
  manufacture_date?: string;
  expiry_date?: string;
  last_stock_update?: string;
  branch_id?: string;
  created_at?: string;
  updated_at?: string;
}

export interface InventoryCategory {
  id: string;
  name: string;
  description?: string;
  is_active: boolean;
  branch_id?: string;
}

export interface InventoryTransaction {
  id: string;
  item_id: string;
  type: 'purchase' | 'sale' | 'adjustment' | 'return';
  quantity: number;
  total_price: number;
  transaction_date: string;
  reference?: string;
  notes?: string;
  staff_id?: string;
  branch_id?: string;
}
