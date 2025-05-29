
import { InvoiceItem, InvoiceStatus, PaymentMethod } from './finance';

export interface InvoiceFormHeaderProps {
  isEdit: boolean;
}

export interface InvoiceMemberFieldsProps {
  member_id: string;
  member_name: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSelectMember: (id: string, name: string) => void;
}

export interface InvoiceDetailsFieldsProps {
  description?: string;
  amount: number;
  status: InvoiceStatus;
  dueDate: string;
  paymentMethod: PaymentMethod;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onStatusChange: (value: string) => void;
  onPaymentMethodChange: (value: string) => void;
}

export interface InvoiceItemProps {
  item: InvoiceItem;
  onUpdate: (id: string, field: string, value: any) => void;
  onRemove: (id: string) => void;
  canDelete: boolean;
}

export interface InvoiceItemListProps {
  items: InvoiceItem[];
  onAdd: () => void;
  onUpdate: (id: string, field: string, value: any) => void;
  onRemove: (id: string) => void;
}

export interface InvoiceMemberSelectProps {
  member_id: string;
  onMemberSelect: (id: string) => void;
}

export interface InvoiceTotalProps {
  total: number;
}

export interface InvoiceFormDialogProps {
  invoice: Invoice | null;
  onSave: (invoice: Partial<Invoice>) => Promise<void>;
  onCancel: () => void;
}
