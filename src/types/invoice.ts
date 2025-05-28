
export interface InvoiceFormData {
  member_id: string;
  amount: number;
  due_date: string;
  items: InvoiceItem[];
  description?: string;
  notes?: string;
}

export interface InvoiceFormDialogProps {
  isOpen: boolean;
  onClose: () => void;
  invoice?: Invoice | null;
  onComplete: () => void;
}

export interface InvoiceMember {
  id: string;
  name: string;
  email: string;
}

export interface InvoiceFormHeaderProps {
  isEdit: boolean;
  invoice?: Invoice;
}

export interface InvoiceItemListProps {
  items: InvoiceItem[];
  onItemsChange: (items: InvoiceItem[]) => void;
}

export interface InvoiceItemProps {
  item: InvoiceItem;
  onUpdate: (item: InvoiceItem) => void;
  onRemove: () => void;
}

export interface InvoiceMemberSelectProps {
  value: string;
  onValueChange: (value: string) => void;
  members: InvoiceMember[];
}

export interface InvoiceTotalProps {
  items: InvoiceItem[];
  subtotal: number;
  tax: number;
  total: number;
}

export interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  unit_price?: number;
  price?: number;
  total: number;
  name?: string;
}

export interface Invoice {
  id: string;
  invoice_number?: string;
  member_id: string;
  member_name?: string;
  amount: number;
  tax_amount?: number;
  total_amount?: number;
  status: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled' | 'pending';
  due_date: string;
  issued_date?: string;
  payment_date?: string;
  items: InvoiceItem[];
  notes?: string;
  branch_id?: string;
  created_at?: string;
  updated_at?: string;
  description?: string;
  payment_method?: string;
  membership_plan_id?: string;
}
