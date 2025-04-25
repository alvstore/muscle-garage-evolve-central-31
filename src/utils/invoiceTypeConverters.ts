
import { Invoice as FinanceInvoice } from '@/types/finance';
import { Invoice as NotificationInvoice } from '@/types/notification';

/**
 * Converts a Finance Invoice to a format compatible with Notification Invoice
 */
export function financeToNotificationInvoice(invoice: FinanceInvoice): NotificationInvoice {
  return {
    id: invoice.id,
    memberName: invoice.memberName || '',
    member_id: invoice.member_id || invoice.memberId || '',
    description: invoice.description || '',
    amount: invoice.amount,
    status: invoice.status,
    dueDate: invoice.due_date || invoice.dueDate || '',
    due_date: invoice.due_date || invoice.dueDate || '',
    paymentMethod: invoice.payment_method || '',
    payment_method: invoice.payment_method || '',
    notes: invoice.notes || '',
    createdAt: invoice.created_at || invoice.createdAt || '',
    created_at: invoice.created_at || invoice.createdAt || '',
    paidDate: invoice.paid_date || invoice.paidDate || '',
    paid_date: invoice.paid_date || invoice.paidDate || '',
    branchId: invoice.branch_id || invoice.branchId || '',
    branch_id: invoice.branch_id || invoice.branchId || '',
    razorpayOrderId: invoice.razorpay_order_id || '',
    razorpay_order_id: invoice.razorpay_order_id || '',
    razorpayPaymentId: invoice.razorpay_payment_id || '',
    razorpay_payment_id: invoice.razorpay_payment_id || ''
  };
}

/**
 * Converts a Notification Invoice to a format compatible with Finance Invoice
 */
export function notificationToFinanceInvoice(invoice: NotificationInvoice): FinanceInvoice {
  return {
    id: invoice.id,
    member_id: invoice.member_id || '',
    memberId: invoice.member_id || '',
    memberName: invoice.memberName || '',
    amount: invoice.amount,
    status: invoice.status as any,
    due_date: invoice.due_date || invoice.dueDate || '',
    dueDate: invoice.due_date || invoice.dueDate || '',
    issued_date: invoice.createdAt || invoice.created_at || new Date().toISOString(),
    issuedDate: invoice.createdAt || invoice.created_at || new Date().toISOString(),
    paid_date: invoice.paid_date || invoice.paidDate || undefined,
    paidDate: invoice.paid_date || invoice.paidDate || undefined,
    payment_method: invoice.payment_method || invoice.paymentMethod || undefined,
    items: [],
    razorpay_order_id: invoice.razorpay_order_id || invoice.razorpayOrderId || undefined,
    razorpay_payment_id: invoice.razorpay_payment_id || invoice.razorpayPaymentId || undefined,
    notes: invoice.notes || undefined,
    description: invoice.description || undefined,
    branch_id: invoice.branch_id || invoice.branchId || undefined,
    branchId: invoice.branch_id || invoice.branchId || undefined,
    created_at: invoice.created_at || invoice.createdAt || new Date().toISOString(),
    updated_at: new Date().toISOString()
  };
}
