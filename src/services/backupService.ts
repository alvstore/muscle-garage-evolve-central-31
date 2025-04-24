import { supabase } from '@/services/supabaseClient';
import { toast } from 'sonner';
import { v4 as uuidv4 } from 'uuid';

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
      // Simulate invoice data (replace with actual query)
      return mockInvoiceData;
      
    case 'transactions':
      query = supabase
        .from('transactions')
        .select('*');
      break;
      
    case 'crm':
      // Simulate CRM data (replace with actual query)
      return mockCrmData;
      
    case 'inventory':
      // Simulate inventory data (replace with actual query)
      return mockInventoryData;
      
    case 'website':
      // Simulate website content data (replace with actual query)
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

// Validate import data against required columns and data types
export const validateImportData = (
  data: any[],
  requiredColumns: string[]
) => {
  const errors: { row: number; errors: string[] }[] = [];
  
  data.forEach((row, index) => {
    const rowErrors: string[] = [];
    
    // Check for required columns
    for (const col of requiredColumns) {
      if (row[col] === undefined || row[col] === null || row[col] === '') {
        rowErrors.push(`Missing required field: ${col}`);
      }
    }
    
    // Add row to errors if there are any
    if (rowErrors.length > 0) {
      errors.push({ row: index, errors: rowErrors });
    }
  });
  
  return { valid: errors.length === 0, errors };
};

// Import data into the database
export const importData = async (
  moduleId: string,
  data: any[]
) => {
  try {
    let successCount = 0;
    
    switch (moduleId) {
      case 'members':
        // Insert member data
        const { data: memberData, error: memberError } = await supabase
          .from('profiles')
          .upsert(
            data.map(row => ({
              // Map CSV data to table schema
              full_name: row.name,
              email: row.email,
              phone: row.phone,
              role: 'member',
              // ...other fields
            })),
            { onConflict: 'email' }
          );
          
        if (memberError) throw memberError;
        successCount = data.length;
        break;
        
      case 'staffTrainers':
        // Insert staff/trainer data
        const { data: staffData, error: staffError } = await supabase
          .from('profiles')
          .upsert(
            data.map(row => ({
              // Map CSV data to table schema
              full_name: row.name,
              email: row.email,
              phone: row.phone,
              role: row.role,
              // ...other fields
            })),
            { onConflict: 'email' }
          );
          
        if (staffError) throw staffError;
        successCount = data.length;
        break;
        
      case 'profiles':
        // Insert profiles data
        const { data: profileData, error: profileError } = await importProfiles(data);
        
        if (profileError) throw profileError;
        successCount = data.length;
        break;
        
      // Add other module import handlers here
      
      default:
        // For demo purposes, simulate successful import for other modules
        await new Promise(resolve => setTimeout(resolve, 1000));
        successCount = data.length;
        break;
    }
    
    return { success: true, successCount, failedCount: data.length - successCount };
  } catch (error) {
    console.error('Import error:', error);
    return { success: false, message: 'Failed to import data', successCount: 0, failedCount: data.length };
  }
};

// Fetch backup logs
export const getBackupLogs = async () => {
  try {
    // In a real implementation, fetch logs from your database
    // For demo, returning mock data
    await new Promise(resolve => setTimeout(resolve, 800));
    
    return mockBackupLogs;
  } catch (error) {
    console.error('Failed to fetch backup logs:', error);
    return [];
  }
};

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

const mockBackupLogs = [
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
  },
  {
    id: '3',
    action: 'export',
    userId: '456',
    userName: 'Manager User',
    timestamp: '2023-07-12T09:15:32',
    modules: ['workoutPlans', 'dietPlans'],
    success: true
  },
  {
    id: '4',
    action: 'import',
    userId: '123',
    userName: 'Admin User',
    timestamp: '2023-07-10T16:45:21',
    modules: ['inventory'],
    success: false,
    totalRecords: 75,
    successCount: 0,
    failedCount: 75
  }
];

// Inside the importData function, fix the profiles insertion
const importProfiles = async (profiles: any[]) => {
  try {
    // Create profiles with proper ids
    if (profiles && profiles.length > 0) {
      // Add required 'id' field to each profile
      const profilesWithId = profiles.map(profile => ({
        id: profile.id || uuidv4(),  // Use existing id if available or generate new one
        full_name: profile.full_name,
        email: profile.email,
        phone: profile.phone,
        role: profile.role || 'member',
        // Include other required fields with reasonable defaults
        branch_id: profile.branch_id || null,
        department: profile.department || null,
        // Any other required fields for profiles table
      }));
      
      const { data, error } = await supabase
        .from('profiles')
        .upsert(profilesWithId as any, { onConflict: 'id' });
      
      if (error) throw error;
      return data;
    }
    return [];
  } catch (error) {
    console.error('Error importing profiles:', error);
    throw error;
  }
};

// Inside the restoreBackup function
// Fix the profiles restore part
if (data.profiles && data.profiles.length > 0) {
  // Add ids to profiles for proper insertion
  const profilesWithIds = data.profiles.map(profile => ({
    id: profile.id || uuidv4(),
    full_name: profile.full_name,
    email: profile.email,
    phone: profile.phone,
    role: profile.role || 'member',
    // Include other required fields with reasonable defaults
    branch_id: profile.branch_id || null,
    department: profile.department || null,
    // Any other required fields for profiles table
  }));
  
  await supabase
    .from('profiles')
    .upsert(profilesWithIds as any, { onConflict: 'id' });
}
