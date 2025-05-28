
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
