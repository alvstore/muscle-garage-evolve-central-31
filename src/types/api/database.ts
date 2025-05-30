
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface DatabaseInvoiceItem {
  id: string;
  name: string;
  quantity: number;
  unitPrice: number;
  description?: string;
}

export type DatabaseJsonItem = Json;
