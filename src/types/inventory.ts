
// Add missing types for inventory

export interface InventoryItem {
  id: string;
  name: string;
  description?: string;
  category?: string;
  sku: string;
  barcode?: string;
  quantity: number;
  price: number;
  cost_price: number;
  status: InventoryStatus;
  supplier?: string;
  supplier_contact?: string;
  reorder_level: number;
  manufacture_date?: string | Date;
  expiry_date?: string | Date;
  image?: string;
  location?: string;
  last_stock_update?: string | Date;
  branch_id?: string;
  created_at?: string | Date;
  updated_at?: string | Date;
  
  // Adding camelCase aliases for compatibility
  costPrice?: number;
  supplierContact?: string;
  manufactureDate?: string | Date;
  expiryDate?: string | Date;
  lastStockUpdate?: string | Date;
  branchId?: string;
  createdAt?: string | Date;
  updatedAt?: string | Date;
}

export type InventoryStatus = 'in-stock' | 'low-stock' | 'out-of-stock' | 'discontinued';

export type InventoryCategory = 'equipment' | 'supplements' | 'apparel' | 'accessories' | 'other';

export type StockTransactionType = 'purchase' | 'sale' | 'adjustment' | 'return' | 'stock-in' | 'stock-out' | 'damaged';

export interface StockTransaction {
  id: string;
  item_id: string;
  item_name?: string;
  quantity: number;
  type: StockTransactionType;
  notes?: string;
  reference_id?: string;
  date: string | Date;
  created_by?: string;
  branch_id?: string;
  created_at?: string | Date;
}

export interface InventoryAlert {
  id: string;
  name: string;
  branch_id?: string;
  quantity: number;
  reorder_level: number;
  is_low_stock: boolean;
  stock_status: string;
}
