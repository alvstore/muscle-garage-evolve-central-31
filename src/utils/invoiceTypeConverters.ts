
// Update imports
import { Invoice } from '@/types/notification';
import { Invoice as FinanceInvoice } from '@/types/finance';

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

// Fix the property mapping
export const notificationToFinanceInvoice = (invoice: Invoice): FinanceInvoice => {
  return {
    id: invoice.id,
    member_id: invoice.member_id,
    amount: invoice.amount,
    status: invoice.status,
    due_date: invoice.due_date,
    issued_date: invoice.issued_date,
    paid_date: invoice.paid_date,
    payment_method: invoice.payment_method,
    razorpay_payment_id: invoice.razorpay_payment_id,
    razorpay_order_id: invoice.razorpay_order_id,
    branch_id: invoice.branch_id,
    items: invoice.items,
    description: invoice.description,
    notes: invoice.notes,
    created_at: invoice.created_at,
    updated_at: invoice.updated_at,
    // Match the property name in Invoice type
    created_at: invoice.created_by // changed from created_by
  };
};
