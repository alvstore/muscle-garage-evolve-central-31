
export type ExportType = 
  | 'members'
  | 'staff'
  | 'trainers'
  | 'branches'
  | 'workout_plans'
  | 'diet_plans'
  | 'attendance'
  | 'invoices'
  | 'transactions'
  | 'crm_leads'
  | 'referrals'
  | 'tasks'
  | 'inventory'
  | 'store_orders'
  | 'website_content'
  | 'settings'
  | 'all';

export type ImportType = 
  | 'members'
  | 'staff'
  | 'trainers'
  | 'workout_plans'
  | 'diet_plans'
  | 'crm_leads'
  | 'inventory';

export type DateRange = {
  startDate?: Date;
  endDate?: Date;
};

export type ExportFormat = 'csv' | 'xlsx';

export type BackupLogEntry = {
  id: string;
  userId: string;
  action: 'export' | 'import';
  type: ExportType | ImportType;
  timestamp: string;
  details: any;
  status: 'success' | 'failure' | 'partial';
  error?: string;
};
