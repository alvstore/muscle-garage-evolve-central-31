
import { UserRole } from "@/types/index";

export interface Invoice {
  id: string;
  memberId: string;
  memberName: string;
  amount: number;
  status: "paid" | "pending" | "overdue" | "cancelled";
  dueDate: string;
  issuedDate: string;
  paidDate?: string;
  paymentMethod?: PaymentMethod;
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  items: InvoiceItem[];
}

export interface InvoiceItem {
  id: string;
  name: string;
  quantity: number;
  unitPrice: number;
}

export type TransactionType = "income" | "expense";
export type ExpenseCategory = "rent" | "salary" | "utilities" | "equipment" | "maintenance" | "marketing" | "other";
export type IncomeCategory = "membership" | "personal-training" | "product-sales" | "class-fees" | "other";
export type RecurringPeriod = "daily" | "weekly" | "monthly" | "quarterly" | "yearly" | "none";
export type PaymentMethod = "cash" | "card" | "bank-transfer" | "razorpay" | "other";

export interface FinancialTransaction {
  id: string;
  type: TransactionType;
  amount: number;
  date: string;
  category: ExpenseCategory | IncomeCategory;
  description: string;
  recurring: boolean;
  recurringPeriod: RecurringPeriod;
  createdBy: string; // User ID
  createdAt: string;
  updatedAt: string;
  paymentMethod?: PaymentMethod;
  memberId?: string; // For income from membership
  memberName?: string;
  invoiceId?: string; // Associated invoice if any
  razorpayPaymentId?: string; // Associated Razorpay payment ID if any
  razorpayRefundId?: string; // Associated Razorpay refund ID if any
}

export interface FinancialReport {
  totalIncome: number;
  totalExpenses: number;
  netProfit: number;
  incomeByCategory: Record<IncomeCategory, number>;
  expensesByCategory: Record<ExpenseCategory, number>;
  startDate: string;
  endDate: string;
  period: "daily" | "weekly" | "monthly" | "quarterly" | "yearly";
}

// Razorpay Webhook Types
export type RazorpayEventType = 
  | "payment.authorized"
  | "payment.captured"
  | "payment.failed"
  | "payment.refunded"
  | "payment.dispute.created"
  | "payment.dispute.won" 
  | "payment.dispute.lost"
  | "order.paid"
  | "subscription.authenticated"
  | "subscription.activated"
  | "subscription.charged"
  | "subscription.cancelled"
  | "subscription.halted"
  | "refund.created"
  | "refund.processed"
  | "refund.failed";

export interface RazorpayWebhookEvent {
  entity: "event";
  account_id: string;
  event: RazorpayEventType;
  contains: ("payment" | "order" | "refund" | "subscription")[];
  payload: {
    payment?: any;
    order?: any;
    refund?: any;
    subscription?: any;
  };
  created_at: number;
}

export interface WebhookLog {
  id: string;
  eventType: RazorpayEventType;
  payload: string; // JSON stringified payload
  status: "processed" | "failed" | "pending";
  error?: string;
  processedAt?: string;
  createdAt: string;
  razorpayId?: string; // ID of the Razorpay entity (payment/order/subscription)
  relatedEntityId?: string; // ID of the related entity in our system (invoice/subscription/transaction)
  retryCount?: number; // Number of times this webhook has been retried
}

export interface WebhookSettings {
  enableNotifications: boolean; // Whether to send notifications on webhook events
  autoRetry: boolean; // Whether to automatically retry failed webhooks
  retryAttempts: number; // Maximum number of retry attempts
  notifyAdminOnFailure: boolean; // Whether to notify admin on webhook failure
}

// SMS Template Types
export type SmsProvider = "msg91" | "twilio";
export type TriggerEvent = 
  | "member_registration" 
  | "payment_success" 
  | "payment_failure" 
  | "class_booking" 
  | "class_cancellation" 
  | "plan_expiry" 
  | "birthday" 
  | "motivation";

export interface SmsTemplate {
  id: string;
  name: string;
  description?: string;
  dltTemplateId: string;
  provider: SmsProvider;
  content: string;
  variables: string[]; // List of variables used in the template
  enabled: boolean;
  createdAt: string;
  updatedAt: string;
  triggerEvents: TriggerEvent[]; // When this template should be triggered
}

export interface SmsLog {
  id: string;
  templateId: string;
  templateName: string;
  recipient: string;
  content: string;
  status: "sent" | "failed" | "pending";
  provider: SmsProvider;
  error?: string;
  sentAt?: string;
  createdAt: string;
  retryCount?: number;
  memberData?: Record<string, string>; // Data used to populate template
  triggeredBy?: TriggerEvent;
  triggeredByUserId?: string; // If manually triggered by a user
}

// Email Template Types
export type EmailProvider = "sendgrid" | "mailgun" | "smtp";

export interface EmailTemplate {
  id: string;
  name: string;
  description?: string;
  subject: string;
  provider: EmailProvider;
  htmlContent: string;
  textContent?: string; // Plain text fallback
  variables: string[]; // List of variables used in the template
  enabled: boolean;
  createdAt: string;
  updatedAt: string;
  triggerEvents: TriggerEvent[]; // When this template should be triggered
}

export interface EmailLog {
  id: string;
  templateId: string;
  templateName: string;
  recipient: string;
  subject: string;
  htmlContent: string;
  textContent?: string;
  status: "sent" | "failed" | "pending";
  provider: EmailProvider;
  error?: string;
  sentAt?: string;
  createdAt: string;
  retryCount?: number;
  memberData?: Record<string, string>; // Data used to populate template
  triggeredBy?: TriggerEvent;
  triggeredByUserId?: string; // If manually triggered by a user
}
