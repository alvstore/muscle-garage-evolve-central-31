
import { Invoice, InvoiceItem, InvoiceStatus } from './finance';

export interface InvoiceItemProps {
  item: InvoiceItem;
  onUpdate: (id: string, field: keyof InvoiceItem, value: string | number) => void;
  onRemove: (id: string) => void;
  canDelete: boolean;
}

export interface InvoiceFormHeaderProps {
  isEditing: boolean;
}

export interface InvoiceMemberSelectProps {
  memberId: string;
  onMemberSelect: (memberId: string) => void;
}

export interface InvoiceItemListProps {
  items: InvoiceItem[];
  onAddItem: () => void;
  onUpdateItem: (id: string, field: keyof InvoiceItem, value: string | number) => void;
  onRemoveItem: (id: string) => void;
}

export interface InvoiceDateSelectorProps {
  issuedDate: string;
  dueDate: string;
  onDateChange: (name: string, date: Date | undefined) => void;
}

export interface InvoiceTotalProps {
  amount: number;
}

