
export type InvoiceStatus = 'pending' | 'paid' | 'partial' | 'cancelled' | 'overdue';

export interface InvoiceItem {
  id: string;
  name: string;
  quantity: number;
  unitPrice: number;
}

export interface Invoice {
  id: string;
  memberId: string;
  memberName: string;
  amount: number;
  status: InvoiceStatus;
  issuedDate: string;
  dueDate: string;
  paidDate: string | null;
  items: InvoiceItem[];
  branchId?: string;
  membershipPlanId?: string;
  description?: string;
  paymentMethod?: string;
}
