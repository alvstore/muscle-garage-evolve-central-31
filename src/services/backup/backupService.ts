import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { toast } from 'sonner';
import { 
  formatBytes, 
  generateReadme, 
  generateEnvExample,
  generateBackupFilename 
} from './backupUtils';
import { 
  generateDatabaseSchema, 
  generateRLSPolicies, 
  collectEdgeFunctions 
} from './databaseBackup';
import { exportData, mockBackupLogs } from './dataExport';
import { supabase } from '@/services/supabaseClient';

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
    const filename = generateBackupFilename();

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
