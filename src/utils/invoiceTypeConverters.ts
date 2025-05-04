// Update imports
import { Invoice } from '@/types/notification';

export const convertInvoiceStatusToText = (status: string): string => {
  switch (status) {
    case 'paid':
      return 'Paid';
    case 'pending':
      return 'Pending';
    case 'overdue':
      return 'Overdue';
    case 'cancelled':
      return 'Cancelled';
    case 'draft':
      return 'Draft';
    default:
      return 'Unknown';
  }
};

export const convertInvoiceStatusToColor = (status: string): string => {
  switch (status) {
    case 'paid':
      return 'green';
    case 'pending':
      return 'amber';
    case 'overdue':
      return 'red';
    case 'cancelled':
      return 'gray';
    case 'draft':
      return 'zinc';
    default:
      return 'zinc';
  }
};
