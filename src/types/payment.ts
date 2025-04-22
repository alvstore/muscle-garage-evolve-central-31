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

export interface PaymentGatewayConfig {
  razorpay?: {
    keyId: string;
    secretKey: string;
    webhookUrl: string;
    webhookSecret: string;
  };
  phonepe?: {
    merchantId: string;
    saltKey: string;
    webhookUrl: string;
  };
  ccavenue?: {
    accessCode: string;
    workingKey: string;
    merchantId: string;
    webhookUrl: string;
  };
  payu?: {
    merchantKey: string;
    salt: string;
    webhookUrl: string;
  };
}

export interface PaymentGatewaySetting {
  id: string;
  gateway_name: 'razorpay' | 'phonepe' | 'ccavenue' | 'payu';
  is_enabled: boolean;
  config: PaymentGatewayConfig;
  created_at: string;
  updated_at: string;
}
