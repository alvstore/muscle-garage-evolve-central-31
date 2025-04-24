
import { Json } from '@/integrations/supabase/types';

export interface InvoiceItem {
  id: string;
  name: string;
  description?: string;
  quantity: number;
  price: number;
  tax?: number;
  total?: number;
}

export interface Invoice {
  id: string;
  member_id?: string;
  amount: number;
  status: string;
  issued_date: string;
  due_date: string;
  paid_date?: string;
  payment_method?: string;
  notes?: string;
  items: InvoiceItem[];
  description?: string;
  branch_id?: string;
  created_at: string;
  updated_at: string;
  created_by?: string;
  membership_plan_id?: string;
  razorpay_order_id?: string;
  razorpay_payment_id?: string;
}

export interface IFinanceService {
  getInvoices(): Promise<Invoice[]>;
  getInvoiceById(id: string): Promise<Invoice | null>;
  createInvoice(invoice: Omit<Invoice, 'id'>): Promise<Invoice | null>;
  updateInvoice(id: string, invoice: Partial<Invoice>): Promise<Invoice | null>;
  deleteInvoice(id: string): Promise<boolean>;
  getInvoicesByMember(memberId: string): Promise<Invoice[]>;
}
