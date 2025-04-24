
import { Invoice, InvoiceItem } from '@/types/finance';

/**
 * Normalizes invoice data to handle both snake_case and camelCase property names
 */
export function normalizeInvoiceData(invoice: Invoice): Invoice {
  return {
    ...invoice,
    // Ensure all property formats exist
    member_id: invoice.member_id || invoice.memberId,
    memberId: invoice.member_id || invoice.memberId,
    due_date: invoice.due_date || invoice.dueDate,
    dueDate: invoice.due_date || invoice.dueDate,
    issued_date: invoice.issued_date || invoice.issuedDate,
    issuedDate: invoice.issued_date || invoice.issuedDate,
    branch_id: invoice.branch_id || invoice.branchId,
    branchId: invoice.branch_id || invoice.branchId
  };
}

/**
 * Normalizes invoice item data to handle both price and unitPrice properties
 */
export function normalizeInvoiceItemData(item: InvoiceItem): InvoiceItem {
  return {
    ...item,
    price: item.price || item.unitPrice || 0,
    unitPrice: item.price || item.unitPrice || 0
  };
}
