
// Inventory management types
export interface InventoryItem {
  id: string;
  name: string;
  category?: string;
  description?: string;
  sku: string;
  barcode?: string;
  quantity: number;
  reorder_level: number;
  price: number;
  cost_price: number;
  status: string;
  supplier?: string;
  supplier_contact?: string;
  location?: string;
  image?: string;
  manufacture_date?: string;
  expiry_date?: string;
  last_stock_update?: string;
  branch_id?: string;
  created_at: string;
  updated_at: string;
}

export interface InventoryAlert {
  id?: string;
  name?: string;
  quantity?: number;
  reorder_level?: number;
  stock_status?: string;
  is_low_stock?: boolean;
  branch_id?: string;
}
