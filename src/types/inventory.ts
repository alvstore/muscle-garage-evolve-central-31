
export type InventoryCategory = "supplement" | "equipment" | "merchandise";
export type StockStatus = "in-stock" | "low-stock" | "out-of-stock" | "expired";

export interface InventoryItem {
  id: string;
  name: string;
  sku: string;
  category: InventoryCategory;
  description?: string;
  quantity: number;
  price: number;
  costPrice: number;
  supplier?: string;
  supplierContact?: string;
  manufactureDate?: string;
  expiryDate?: string;
  reorderLevel: number;
  location?: string;
  image?: string;
  barcode?: string;
  status: StockStatus;
  lastStockUpdate: string;
  createdAt: string;
  updatedAt: string;
}

export interface InventoryTransaction {
  id: string;
  itemId: string;
  itemName: string;
  type: "stock-in" | "stock-out" | "adjustment" | "return" | "damaged";
  quantity: number;
  previousQuantity: number;
  newQuantity: number;
  notes?: string;
  conductedBy: string;
  conductedAt: string;
  relatedInvoiceId?: string;
  batchNumber?: string;
}

export interface InventoryAlert {
  id: string;
  itemId: string;
  itemName: string;
  type: "low-stock" | "expiring-soon" | "expired" | "out-of-stock"; // Added out-of-stock
  message: string;
  status: "active" | "acknowledged" | "resolved";
  createdAt: string;
  acknowledgedBy?: string;
  acknowledgedAt?: string;
  resolvedBy?: string;
  resolvedAt?: string;
}

export interface Supplier {
  id: string;
  name: string;
  contactPerson: string;
  email?: string;
  phone: string;
  address?: string;
  items: string[]; // Array of itemIds
  paymentTerms?: string;
  status: "active" | "inactive";
  notes?: string;
}
