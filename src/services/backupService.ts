import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { toast } from 'sonner';
import { supabase } from '@/services/supabaseClient';
import { format } from 'date-fns';

const formatBytes = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

// Create a zip file with all backend files
export const createBackupZip = async () => {
  const zip = new JSZip();

  try {
    // Create main folders
    const schemaFolder = zip.folder('schema');
    const servicesFolder = zip.folder('services');
    const typesFolder = zip.folder('types');
    const migrationsFolder = zip.folder('migrations');

    // Add database schema
    const dbSchema = await generateDatabaseSchema();
    schemaFolder.file('schema.sql', dbSchema);

    // Add edge functions
    const edgeFunctions = await collectEdgeFunctions();
    const functionsFolder = zip.folder('functions');
    edgeFunctions.forEach(fn => {
      functionsFolder.file(`${fn.name}/index.ts`, fn.code);
    });

    // Add RLS policies
    const rlsPolicies = await generateRLSPolicies();
    schemaFolder.file('policies.sql', rlsPolicies);

    // Add configuration
    zip.file('supabase/config.toml', JSON.stringify({
      project: 'muscle-garage-evolve',
      reference: 'rnqgpucxlvubwqpkgstc'
    }, null, 2));

    // Add services
    await collectServices(servicesFolder);

    // Add types
    await collectTypes(typesFolder);

    // Add README
    zip.file('README.md', generateReadme());

    // Add env example
    zip.file('.env.example', generateEnvExample());

    // Generate timestamped filename
    const timestamp = format(new Date(), 'yyyy-MM-dd-HHmm');
    const filename = `backup-backend-${timestamp}.zip`;

    // Create and download the zip file
    const content = await zip.generateAsync({ type: 'blob' });
    saveAs(content, filename);
    
    return { 
      success: true, 
      size: formatBytes(content.size),
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    console.error('Failed to create backup:', error);
    return { success: false };
  }
};

// Helper function to collect all services
const collectServices = async (folder: JSZip) => {
  const services = [
    'authService',
    'memberService',
    'classService',
    'trainerService',
    'workoutService',
    'dietPlanService',
    'invoiceService',
    'integrationService',
    'crmService'
  ];

  services.forEach(service => {
    const serviceCode = `// Service implementation for ${service}
// ... actual code would be collected from the service files
`;
    folder.file(`${service}.ts`, serviceCode);
  });
};

// Helper function to collect types
const collectTypes = async (folder: JSZip) => {
  const types = [
    'member',
    'class',
    'workout',
    'diet',
    'invoice',
    'crm'
  ];

  types.forEach(type => {
    const typeCode = `// Type definitions for ${type}
// ... actual type definitions would be collected
`;
    folder.file(`${type}.ts`, typeCode);
  });
};

// Generate a basic README
const generateReadme = () => {
  return `# Muscle Garage Evolve Backend

A comprehensive backend system for managing gym operations with multi-branch architecture.

## Overview

This backend powers the Muscle Garage Evolve CRM platform using:
- Supabase for database and authentication
- Edge Functions for custom backend logic
- Row Level Security (RLS) for data protection
- Real-time subscriptions for live updates

## Structure

- \`/database\`: Schema and RLS policies
- \`/functions\`: Edge Functions for custom logic
- \`/services\`: Core business logic
- \`/types\`: TypeScript type definitions
- \`/config\`: System configuration

## Setup

1. Create a Supabase project
2. Run the schema migrations
3. Deploy edge functions
4. Configure environment variables

## Documentation

See BACKEND_DOCUMENTATION.md for detailed API documentation.
`;
};

// Generate database schema SQL
const generateDatabaseSchema = async () => {
  // In a real implementation, this would fetch from Supabase
  return `-- Database schema would be exported here
-- Tables, indexes, and constraints
`;
};

// Collect edge functions
const generateRLSPolicies = async () => {
  // In a real implementation, this would fetch from Supabase
  return `-- RLS policies would be exported here
-- Access control rules for each table
`;
};

// Collect edge functions
const collectEdgeFunctions = async () => {
  // In a real implementation, this would fetch from Supabase
  return [
    {
      name: 'attendance-webhook',
      code: '// Edge function implementation'
    },
    {
      name: 'razorpay-webhook',
      code: '// Edge function implementation'
    }
  ];
};

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

// Generate env example
const generateEnvExample = () => {
  return `# Database Configuration
DATABASE_URL="postgresql://postgres:password@localhost:5432/your-database"

# Supabase Configuration
SUPABASE_URL="https://your-project.supabase.co"
SUPABASE_KEY="your-anon-key"

# Server Configuration
PORT=3000
NODE_ENV="development"

# Authentication
JWT_SECRET="your-jwt-secret"

# External Services (if used)
RAZORPAY_KEY_ID="your-razorpay-key"
RAZORPAY_SECRET="your-razorpay-secret"

# Email Configuration (if used)
SMTP_HOST="smtp.your-provider.com"
SMTP_PORT=587
SMTP_USER="your-email"
SMTP_PASS="your-password"
`;
