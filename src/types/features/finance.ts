
// Finance and accounting types
export interface IncomeRecord {
  id: string;
  source: string;
  description: string;
  category: string;
  amount: number;
  payment_method: string;
  reference: string;
  branch_id: string;
  date: string;
  created_at: string;
  updated_at: string;
}

export interface ExpenseRecord {
  id: string;
  vendor: string;
  description: string;
  category: string;
  amount: number;
  payment_method: string;
  reference: string;
  status: string;
  branch_id: string;
  date: string;
  created_at: string;
  updated_at: string;
}

export interface IncomeCategory {
  id: string;
  name: string;
  description?: string;
  branch_id?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface ExpenseCategory {
  id: string;
  name: string;
  description?: string;
  branch_id?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface FinancialSummary {
  total_income: number;
  total_expenses: number;
  net_profit: number;
  membership_revenue: number;
  merchandise_revenue: number;
  supplements_revenue: number;
  period_start: string;
  period_end: string;
}
