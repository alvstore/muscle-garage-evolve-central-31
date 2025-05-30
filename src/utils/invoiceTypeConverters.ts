import { Invoice as FinanceInvoice } from '@/types/finance';

// Define a local interface for the notification invoice type
interface NotificationInvoice {
  id: string;
  member_id: string;
  member_name: string;
  amount: number;
  description?: string;
  status: string;
  due_date: string;
  issued_date?: string;
  created_at: string;
  updated_at?: string;
  payment_date?: string;
  paid_date?: string;
  payment_method?: string;
  notes?: string;
  branch_id?: string;
  items?: any[];
  membership_plan_id?: string;
  membershipPlanId?: string;
}

export function notificationToFinanceInvoice(invoice: NotificationInvoice): FinanceInvoice {
  return {
    id: invoice.id,
    member_id: invoice.member_id,
    memberId: invoice.member_id, // For backward compatibility
    member_name: invoice.member_name,
    memberName: invoice.member_name, // For backward compatibility
    amount: invoice.amount,
    description: invoice.description || '',
    status: invoice.status as any,
    due_date: invoice.due_date,
    dueDate: invoice.due_date, // For backward compatibility
    issued_date: invoice.issued_date || invoice.created_at,
    issuedDate: invoice.issued_date || invoice.created_at, // For backward compatibility
    paid_date: invoice.payment_date || invoice.paid_date,
    payment_method: invoice.payment_method as any,
    notes: invoice.notes || '',
    created_at: invoice.created_at || new Date().toISOString(),
    updated_at: invoice.updated_at || new Date().toISOString(),
    branch_id: invoice.branch_id || '',
    items: invoice.items || [],
    membership_plan_id: invoice.membership_plan_id || '',
    membershipPlanId: invoice.membership_plan_id || '' // For backward compatibility
  };
}

export function financeToNotificationInvoice(invoice: FinanceInvoice): NotificationInvoice {
  return {
    id: invoice.id,
    member_id: invoice.member_id || invoice.memberId || '',
    member_name: invoice.member_name || invoice.memberName || '',
    amount: invoice.amount,
    description: invoice.description || '',
    status: invoice.status as any,
    due_date: invoice.due_date || invoice.dueDate || '',
    payment_date: invoice.paid_date,
    payment_method: invoice.payment_method as any,
    notes: invoice.notes || '',
    created_at: invoice.created_at || new Date().toISOString(),
    updated_at: invoice.updated_at || new Date().toISOString(),
    issued_date: invoice.issued_date || invoice.issuedDate || '',
    branch_id: invoice.branch_id || '',
    items: invoice.items || [],
    membership_plan_id: invoice.membership_plan_id || invoice.membershipPlanId || ''
  };
}
