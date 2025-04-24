
import { supabase } from '@/services/supabaseClient';

// Mock data for demonstration
const mockInvoiceData = [
  {
    id: 'INV-001',
    member_name: 'John Doe',
    amount: 999,
    status: 'paid',
    issue_date: '2023-05-15',
    due_date: '2023-05-30',
  },
  {
    id: 'INV-002',
    member_name: 'Jane Smith',
    amount: 499,
    status: 'pending',
    issue_date: '2023-06-01',
    due_date: '2023-06-15',
  },
];

const mockCrmData = [
  {
    id: 'LEAD-001',
    name: 'Robert Brown',
    email: 'robert@example.com',
    phone: '1234567890',
    source: 'Website',
    status: 'new',
    created_at: '2023-06-10',
  },
  {
    id: 'LEAD-002',
    name: 'Lisa Garcia',
    email: 'lisa@example.com',
    phone: '9876543210',
    source: 'Referral',
    status: 'contacted',
    created_at: '2023-06-12',
  },
];

const mockInventoryData = [
  {
    id: 'PROD-001',
    name: 'Protein Powder',
    category: 'supplement',
    price: 29.99,
    quantity: 50,
    reorder_level: 10,
  },
  {
    id: 'PROD-002',
    name: 'Resistance Band',
    category: 'equipment',
    price: 15.99,
    quantity: 30,
    reorder_level: 5,
  },
];

const mockWebsiteData = [
  {
    id: 'PAGE-001',
    title: 'Home Page',
    content: 'Welcome to Muscle Garage',
    updated_at: '2023-05-20',
  },
  {
    id: 'PAGE-002',
    title: 'About Us',
    content: 'Our fitness journey began in 2010...',
    updated_at: '2023-05-22',
  },
];

// Export data from the database
export const exportData = async (
  modules: string[],
  startDate?: Date,
  endDate?: Date
): Promise<Record<string, any[]>> => {
  const result: Record<string, any[]> = {};
  
  try {
    // Export each selected module
    for (const moduleId of modules) {
      result[moduleId] = await fetchModuleData(moduleId, startDate, endDate);
    }
    
    return result;
  } catch (error) {
    console.error('Export error:', error);
    throw new Error('Failed to export data');
  }
};

// Fetch data for a specific module
const fetchModuleData = async (
  moduleId: string, 
  startDate?: Date,
  endDate?: Date
): Promise<any[]> => {
  let query;
  
  // Apply date filters if provided
  const dateFilter = {};
  if (startDate) {
    dateFilter['created_at_gte'] = startDate.toISOString();
  }
  if (endDate) {
    dateFilter['created_at_lte'] = endDate.toISOString();
  }
  
  switch (moduleId) {
    case 'members':
      query = supabase
        .from('profiles')
        .select('*')
        .eq('role', 'member');
      break;
      
    case 'staffTrainers':
      query = supabase
        .from('profiles')
        .select('*')
        .in('role', ['staff', 'trainer', 'admin']);
      break;
      
    case 'branches':
      query = supabase
        .from('branches')
        .select('*');
      break;
      
    case 'workoutPlans':
      query = supabase
        .from('workout_plans')
        .select('*, workout_days(*, exercises(*))');
      break;
      
    case 'dietPlans':
      query = supabase
        .from('diet_plans')
        .select('*, meal_plans(*, meal_items(*))');
      break;
      
    case 'attendance':
      query = supabase
        .from('member_attendance')
        .select('*');
      break;
      
    case 'invoices':
      return mockInvoiceData;
      
    case 'transactions':
      query = supabase
        .from('transactions')
        .select('*');
      break;
      
    case 'crm':
      return mockCrmData;
      
    case 'inventory':
      return mockInventoryData;
      
    case 'website':
      return mockWebsiteData;
      
    case 'settings':
      query = supabase
        .from('global_settings')
        .select('*');
      break;
      
    default:
      return [];
  }

  // Apply date filters if applicable
  if (startDate && query.gte) {
    query = query.gte('created_at', startDate.toISOString());
  }
  if (endDate && query.lte) {
    query = query.lte('created_at', endDate.toISOString());
  }
  
  const { data, error } = await query;
  
  if (error) {
    console.error(`Error fetching ${moduleId} data:`, error);
    throw error;
  }
  
  return data || [];
};

export const mockBackupLogs = [
  {
    id: '1',
    action: 'export',
    userId: '123',
    userName: 'Admin User',
    timestamp: '2023-07-15T10:30:45',
    modules: ['members', 'staff', 'branches'],
    success: true
  },
  {
    id: '2',
    action: 'import',
    userId: '123',
    userName: 'Admin User',
    timestamp: '2023-07-14T14:22:10',
    modules: ['members'],
    success: true,
    totalRecords: 150,
    successCount: 148,
    failedCount: 2
  }
];
