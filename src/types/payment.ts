
export type PaymentStatus = "pending" | "completed" | "failed" | "refunded";
export type PaymentMode = "cash" | "card" | "upi" | "bank_transfer" | "razorpay" | "other";

export interface Payment {
  id: string;
  amount: number;
  currency: string;
  status: PaymentStatus;
  mode: PaymentMode;
  memberId: string;
  membershipPlanId?: string;
  invoiceId?: string;
  transactionId?: string;
  razorpayPaymentId?: string;
  razorpayOrderId?: string;
  createdAt: string;
  updatedAt: string;
  metadata?: Record<string, any>;
}
