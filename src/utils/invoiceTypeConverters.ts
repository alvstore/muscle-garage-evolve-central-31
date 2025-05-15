
import { Invoice as FinanceInvoice } from '@/types/finance';
import { Invoice as NotificationInvoice } from '@/types/notification';

export const notificationToFinanceInvoice = (invoice: NotificationInvoice): FinanceInvoice => {
  return {
    id: invoice.id,
    member_id: invoice.member_id,
    memberName: invoice.memberName,
    amount: invoice.amount,
    status: invoice.status,
    dueDate: invoice.dueDate,
    issuedDate: invoice.issuedDate,
    paidDate: invoice.paidDate,
    items: invoice.items || [],
    branchId: invoice.branchId,
    notes: invoice.notes,
    subtotal: invoice.subtotal,
    discount: invoice.discount,
    tax: invoice.tax,
    total: invoice.total,
    description: invoice.description
  };
};

export const financeToNotificationInvoice = (invoice: FinanceInvoice): NotificationInvoice => {
  return {
    id: invoice.id,
    member_id: invoice.member_id,
    memberName: invoice.memberName,
    amount: invoice.amount,
    status: invoice.status,
    dueDate: invoice.dueDate,
    issuedDate: invoice.issuedDate,
    paidDate: invoice.paidDate,
    items: invoice.items,
    branchId: invoice.branchId,
    notes: invoice.notes,
    subtotal: invoice.subtotal,
    discount: invoice.discount,
    tax: invoice.tax,
    total: invoice.total
  };
};
