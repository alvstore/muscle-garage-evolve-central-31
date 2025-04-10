
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
