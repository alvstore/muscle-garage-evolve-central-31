
import { Invoice as NotificationInvoice } from '@/types/notification';
import { Invoice as FinanceInvoice } from '@/types/finance';

export function notificationToFinanceInvoice(invoice: NotificationInvoice): FinanceInvoice {
  return {
    id: invoice.id,
    member_id: invoice.member_id,
    amount: invoice.amount,
    description: invoice.description || '',
    status: invoice.status as any,
    due_date: invoice.due_date,
    issued_date: invoice.issued_date || invoice.created_at,
    paid_date: invoice.payment_date || invoice.paid_date,
    payment_method: invoice.payment_method as any,
    notes: invoice.notes || '',
    created_at: invoice.created_at || new Date().toISOString(),
    updated_at: invoice.updated_at || new Date().toISOString(),
    branch_id: invoice.branch_id || '',
    items: [],
    memberName: invoice.member_name || invoice.memberName || ''
  };
}

export function financeToNotificationInvoice(invoice: FinanceInvoice): NotificationInvoice {
  return {
    id: invoice.id,
    member_id: invoice.member_id,
    member_name: invoice.memberName || '',
    amount: invoice.amount,
    description: invoice.description || '',
    status: invoice.status as any,
    due_date: invoice.due_date,
    payment_date: invoice.paid_date,
    payment_method: invoice.payment_method as any,
    notes: invoice.notes || '',
    created_at: invoice.created_at || new Date().toISOString(),
    updated_at: invoice.updated_at || new Date().toISOString(),
    issued_date: invoice.issued_date || '',
    branch_id: invoice.branch_id || ''
  };
}
