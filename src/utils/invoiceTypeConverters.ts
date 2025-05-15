
import { Invoice as FinanceInvoice } from '@/types/finance';
import { Invoice as NotificationInvoice } from '@/types/notification';

/**
 * Converts an invoice from notification type to finance type
 */
export const notificationToFinanceInvoice = (invoice: NotificationInvoice): FinanceInvoice => {
  return {
    ...invoice,
    items: Array.isArray(invoice.items) ? invoice.items : [],
  };
};

/**
 * Converts an invoice from finance type to notification type
 */
export const financeToNotificationInvoice = (invoice: FinanceInvoice): NotificationInvoice => {
  return {
    ...invoice,
    items: Array.isArray(invoice.items) ? invoice.items : [],
  };
};
