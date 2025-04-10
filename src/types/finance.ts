
export type InvoiceStatus = "paid" | "pending" | "overdue" | "cancelled";
export type PaymentMethod = "cash" | "card" | "bank-transfer" | "razorpay" | "other";
export type ExpenseCategory = "rent" | "salary" | "utilities" | "equipment" | "maintenance" | "marketing" | "other";
export type IncomeCategory = "membership" | "personal-training" | "product-sales" | "class-fees" | "other";
export type TransactionType = "income" | "expense";
export type RecurringPeriod = "daily" | "weekly" | "monthly" | "quarterly" | "yearly" | "none";

export interface Invoice {
  id: string;
  memberId: string;
  memberName: string;
  amount: number;
  status: InvoiceStatus;
  dueDate: string;
  issuedDate: string;
  paidDate?: string;
  paymentMethod?: PaymentMethod;
  items: InvoiceItem[];
  notes?: string;
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
}

export interface InvoiceItem {
  id: string;
  name: string;
  description?: string;
  quantity: number;
  unitPrice: number;
}

export interface FinancialTransaction {
  id: string;
  type: TransactionType;
  amount: number;
  date: string;
  category: ExpenseCategory | IncomeCategory;
  description: string;
  recurring: boolean;
  recurringPeriod: RecurringPeriod;
  relatedInvoiceId?: string;
  paymentMethod?: PaymentMethod;
  attachment?: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface FinancialSummary {
  totalIncome: number;
  totalExpense: number;
  netProfit: number;
  period: "daily" | "weekly" | "monthly" | "yearly";
  categories: {
    name: string;
    amount: number;
    percentage: number;
  }[];
}
