
export interface InvoiceItem {
  id: string;
  name: string;
  description?: string;
  quantity: number;
  unitPrice: number;
  unit_price?: number;
  total: number;
}

export interface InvoiceFormDialogProps {
  invoice?: Invoice;
  onComplete?: () => void;
}

export interface InvoiceItemProps {
  item: InvoiceItem;
  onUpdate: (id: string, field: string, value: any) => void;
  onRemove: (id: string) => void;
}

export interface InvoiceMemberSelectProps {
  value?: string;
  onChange?: (value: string) => void;
}

export interface InvoiceTotalProps {
  items: InvoiceItem[];
  tax?: number;
}

export interface Invoice {
  id: string;
  member_id?: string;
  memberId?: string;
  member_name?: string;
  memberName?: string;
  amount: number;
  description?: string;
  status: 'pending' | 'paid' | 'overdue' | 'cancelled';
  due_date?: string;
  dueDate?: string;
  issued_date?: string;
  issuedDate?: string;
  paid_date?: string;
  payment_method?: 'cash' | 'card' | 'bank_transfer' | 'upi' | 'other';
  notes?: string;
  created_at?: string;
  updated_at?: string;
  branch_id?: string;
  items?: InvoiceItem[];
  membership_plan_id?: string;
  membershipPlanId?: string;
}
