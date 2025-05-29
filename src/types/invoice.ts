
import { Invoice, InvoiceItem, InvoiceStatus, PaymentMethod } from '@/types/finance';

export interface InvoiceFormDialogProps {
  invoice: Invoice | null;
  onComplete: () => void;
}

export interface InvoiceFormHeaderProps {
  isEdit: boolean;
}

export interface InvoiceItemProps {
  item: InvoiceItem;
  onUpdate: (id: string, field: string, value: any) => void;
  onRemove: (id: string) => void;
}

export interface InvoiceItemListProps {
  items: InvoiceItem[];
  onAdd: () => void;
  onUpdate: (id: string, field: string, value: any) => void;
  onRemove: (id: string) => void;
}

export interface InvoiceMemberSelectProps {
  value: string;
  onChange: (value: string) => void;
}

export interface InvoiceTotalProps {
  total: number;
}

export interface InvoiceDetailsFieldsProps {
  description: string;
  amount: number;
  status: InvoiceStatus;
  dueDate: string;
  paymentMethod: PaymentMethod;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onStatusChange: (value: string) => void;
  onPaymentMethodChange: (value: string) => void;
}

export interface InvoiceMemberFieldsProps {
  member_id: string;
  member_name: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSelectMember: (id: string, name: string) => void;
}
