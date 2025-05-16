
export type ProductCategory = "supplement" | "equipment" | "apparel" | "accessory" | "membership" | "other";
export type ProductStatus = "in-stock" | "low-stock" | "out-of-stock" | "discontinued";
export type OrderStatus = "pending" | "processing" | "completed" | "cancelled" | "refunded";
export type PaymentMethod = "cash" | "card" | "bank-transfer" | "wallet" | "other";

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  salePrice?: number;
  category: ProductCategory;
  status: ProductStatus;
  stock: number;
  inventoryId?: string; // reference to inventory item
  sku: string;
  barcode?: string;
  images: string[];
  features?: string[];
  brand?: string;
  featured: boolean;
  createdAt: string;
  updatedAt?: string;
}

export interface CartItem {
  productId: string;
  product: Product;
  quantity: number;
  price: number;
  discount?: number;
}

export interface Order {
  id: string;
  memberId?: string;
  customerName: string;
  customerEmail?: string;
  customerPhone?: string;
  items: CartItem[];
  subtotal: number;
  discount?: number;
  promoCodeId?: string;
  promoCode?: string;
  tax: number;
  total: number;
  status: OrderStatus;
  paymentMethod: PaymentMethod;
  paymentStatus: "pending" | "paid" | "failed" | "refunded";
  createdAt: string;
  updatedAt?: string;
  completedAt?: string;
  notes?: string;
  staffId?: string;
}

export interface Review {
  id: string;
  productId: string;
  memberId: string;
  rating: number;
  comment?: string;
  createdAt: string;
  helpful: number;
  reported: boolean;
}
