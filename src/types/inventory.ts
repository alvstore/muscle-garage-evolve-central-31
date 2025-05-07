
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
  reorderLevel?: number;
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
  
  // Adding camelCase aliases
  itemId?: string;
  itemName?: string;
  referenceId?: string;
  createdBy?: string;
  branchId?: string;
  createdAt?: string | Date;
}

export interface InventoryAlert {
  id: string;
  name: string;
  branch_id?: string;
  quantity: number;
  reorder_level: number;
  is_low_stock: boolean;
  stock_status: string;
  
  // Adding fields needed by the components
  item_id?: string;
  itemId?: string;
  type?: string;
  status?: string;
  message?: string;
  created_at?: string | Date;
  createdAt?: string | Date;
  itemName?: string;
  acknowledgedBy?: string;
  acknowledgedAt?: string | Date;
  resolvedBy?: string;
  resolvedAt?: string | Date;
  
  // Adding camelCase aliases
  branchId?: string;
  reorderLevel?: number;
  isLowStock?: boolean;
  stockStatus?: string;
}

// Adding missing interfaces needed by components
export interface InventoryTransaction {
  id: string;
  item_id: string;
  quantity: number;
  type: StockTransactionType;
  date: string | Date;
  notes?: string;
  item_name?: string;
  reference_id?: string;
  branch_id?: string;
  created_by?: string;
  
  // Adding camelCase aliases
  itemId?: string;
  itemName?: string;
  referenceId?: string;
  branchId?: string;
  createdBy?: string;
}

export interface Supplier {
  id: string;
  name: string;
  contact_name?: string;
  email?: string;
  phone?: string;
  address?: string;
  created_at?: string | Date;
  updated_at?: string | Date;
  
  // Adding camelCase aliases
  contactName?: string;
  createdAt?: string | Date;
  updatedAt?: string | Date;
}
