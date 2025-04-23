
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DatePicker } from '@/components/ui/date-picker';
import { Archive, Check, Database, Download } from 'lucide-react';
import { toast } from 'sonner';
import { exportData } from '@/services/backupService';
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';

interface DataModule {
  id: string;
  label: string;
  description: string;
  icon: React.ReactNode;
  selected: boolean;
}

const ExportDataSection = () => {
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [exportFormat, setExportFormat] = useState('xlsx');
  const [isExporting, setIsExporting] = useState(false);
  const [selectAll, setSelectAll] = useState(false);
  const [dataModules, setDataModules] = useState<DataModule[]>([
    { 
      id: 'members', 
      label: 'Member List', 
      description: 'Export all member data including contact details and membership status',
      icon: <Users className="h-4 w-4" />,
      selected: false 
    },
    { 
      id: 'staffTrainers', 
      label: 'Staff & Trainers', 
      description: 'Export staff and trainer profiles, roles and assignments',
      icon: <Users className="h-4 w-4" />,
      selected: false 
    },
    { 
      id: 'branches', 
      label: 'Branches', 
      description: 'Export all branch locations and details',
      icon: <Building2 className="h-4 w-4" />,
      selected: false 
    },
    { 
      id: 'workoutPlans', 
      label: 'Workout Plans', 
      description: 'Export all workout plans and their details',
      icon: <Dumbbell className="h-4 w-4" />,
      selected: false 
    },
    { 
      id: 'dietPlans', 
      label: 'Diet Plans', 
      description: 'Export all diet plans and their details',
      icon: <FileText className="h-4 w-4" />,
      selected: false 
    },
    { 
      id: 'attendance', 
      label: 'Attendance Logs', 
      description: 'Export member and staff attendance records',
      icon: <Clock className="h-4 w-4" />,
      selected: false 
    },
    { 
      id: 'invoices', 
      label: 'Invoices', 
      description: 'Export all invoice records',
      icon: <CreditCard className="h-4 w-4" />,
      selected: false 
    },
    { 
      id: 'transactions', 
      label: 'Transactions', 
      description: 'Export all financial transactions (income & expenses)',
      icon: <Wallet className="h-4 w-4" />,
      selected: false 
    },
    { 
      id: 'crm', 
      label: 'CRM Data', 
      description: 'Export leads, referrals, and follow-up tasks',
      icon: <UserPlus className="h-4 w-4" />,
      selected: false 
    },
    { 
      id: 'inventory', 
      label: 'Inventory & Orders', 
      description: 'Export inventory items and store orders',
      icon: <Package className="h-4 w-4" />,
      selected: false 
    },
    { 
      id: 'website', 
      label: 'Website Content', 
      description: 'Export website pages, content, and settings',
      icon: <Globe className="h-4 w-4" />,
      selected: false 
    },
    { 
      id: 'settings', 
      label: 'System Settings', 
      description: 'Export all system configurations as JSON',
      icon: <Settings className="h-4 w-4" />,
      selected: false 
    }
  ]);
  
  const handleToggleModule = (id: string) => {
    setDataModules(dataModules.map(module => 
      module.id === id ? { ...module, selected: !module.selected } : module
    ));
    
    // Update "Select All" checkbox state
    const updatedModules = dataModules.map(module => 
      module.id === id ? { ...module, selected: !module.selected } : module
    );
    const allSelected = updatedModules.every(module => module.selected);
    setSelectAll(allSelected);
  };

  const handleSelectAll = () => {
    const newSelectAll = !selectAll;
    setSelectAll(newSelectAll);
    setDataModules(dataModules.map(module => ({ ...module, selected: newSelectAll })));
  };

  const handleExport = async () => {
    const selectedModules = dataModules.filter(module => module.selected).map(module => module.id);
    
    if (selectedModules.length === 0) {
      toast.error('Please select at least one data module to export');
      return;
    }
    
    setIsExporting(true);
    
    try {
      const result = await exportData(selectedModules, startDate, endDate);
      
      if (selectedModules.length === 1) {
        // Single module export
        const moduleId = selectedModules[0];
        const moduleData = result[moduleId];
        const fileName = `${moduleId}_export_${new Date().toISOString().split('T')[0]}`;
        
        if (exportFormat === 'xlsx') {
          const wb = XLSX.utils.book_new();
          const ws = XLSX.utils.json_to_sheet(moduleData);
          XLSX.utils.book_append_sheet(wb, ws, moduleId);
          const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
          const data = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
          saveAs(data, `${fileName}.xlsx`);
        } else {
          // CSV export
          const csvContent = convertToCSV(moduleData);
          const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8' });
          saveAs(blob, `${fileName}.csv`);
        }
        
      } else if (selectedModules.length > 1) {
        // Create a zip file with multiple exports
        const JSZip = (await import('jszip')).default;
        const zip = new JSZip();
        
        for (const moduleId of selectedModules) {
          const moduleData = result[moduleId];
          const fileName = `${moduleId}_export`;
          
          if (exportFormat === 'xlsx') {
            const wb = XLSX.utils.book_new();
            const ws = XLSX.utils.json_to_sheet(moduleData);
            XLSX.utils.book_append_sheet(wb, ws, moduleId);
            const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
            zip.file(`${fileName}.xlsx`, excelBuffer);
          } else {
            // CSV export
            const csvContent = convertToCSV(moduleData);
            zip.file(`${fileName}.csv`, csvContent);
          }
        }
        
        const content = await zip.generateAsync({ type: 'blob' });
        const date = new Date().toISOString().split('T')[0];
        saveAs(content, `muscle_garage_export_${date}.zip`);
      }
      
      // Log the export activity
      await logBackupActivity('export', selectedModules);
      
      toast.success('Data exported successfully');
    } catch (error) {
      console.error('Export failed:', error);
      toast.error('Failed to export data. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  const convertToCSV = (data: any[]) => {
    if (!data || !data.length) return '';
    
    const headers = Object.keys(data[0]);
    const csvRows = [];
    
    // Add the headers
    csvRows.push(headers.join(','));
    
    // Add the data
    for (const row of data) {
      const values = headers.map(header => {
        const value = row[header];
        // Properly handle values with commas, quotes, etc.
        return `"${String(value).replace(/"/g, '""')}"`;
      });
      csvRows.push(values.join(','));
    }
    
    return csvRows.join('\n');
  };

  const logBackupActivity = async (action: string, modules: string[]) => {
    try {
      // This would normally call the backend API to log the activity
      console.log('Backup activity:', { action, modules, timestamp: new Date() });
    } catch (error) {
      console.error('Failed to log backup activity:', error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-4 items-center justify-between">
        <div className="space-y-1">
          <h3 className="text-xl font-medium">Export Data</h3>
          <p className="text-sm text-muted-foreground">
            Select which data modules you want to export for backup
          </p>
        </div>
        
        <div className="flex flex-wrap gap-2">
          <div>
            <Select value={exportFormat} onValueChange={setExportFormat}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Export Format" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="xlsx">Excel (.xlsx)</SelectItem>
                <SelectItem value="csv">CSV (.csv)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <Button 
            variant="default" 
            onClick={handleExport} 
            disabled={isExporting}
            className="flex items-center gap-2"
          >
            {isExporting ? (
              <>
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-r-transparent" />
                <span>Exporting...</span>
              </>
            ) : (
              <>
                <Download className="h-4 w-4" />
                <span>Download Export</span>
              </>
            )}
          </Button>
        </div>
      </div>

      <div className="flex items-center space-x-2 mb-4">
        <Checkbox 
          id="selectAll" 
          checked={selectAll}
          onCheckedChange={handleSelectAll}
        />
        <label
          htmlFor="selectAll"
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          Select All Modules
        </label>
      </div>
      
      <div className="mb-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {dataModules.map((module) => (
          <Card key={module.id} className={`overflow-hidden ${module.selected ? 'ring-2 ring-primary' : ''}`}>
            <CardContent className="p-4 flex items-start space-x-4">
              <Checkbox 
                id={`module-${module.id}`} 
                checked={module.selected}
                onCheckedChange={() => handleToggleModule(module.id)}
                className="mt-1"
              />
              <div className="space-y-1">
                <label 
                  htmlFor={`module-${module.id}`}
                  className="block text-sm font-medium cursor-pointer flex items-center gap-2"
                >
                  <span className="text-muted-foreground">{module.icon}</span>
                  {module.label}
                </label>
                <p className="text-xs text-muted-foreground">{module.description}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      <div className="bg-muted/50 rounded-lg p-4">
        <h4 className="text-sm font-medium mb-2">Optional: Filter by Date Range</h4>
        <div className="flex flex-wrap gap-4">
          <div className="space-y-1">
            <label htmlFor="startDate" className="text-sm">Start Date</label>
            <DatePicker
              id="startDate"
              selected={startDate}
              onSelect={setStartDate}
              className="w-full"
            />
          </div>
          <div className="space-y-1">
            <label htmlFor="endDate" className="text-sm">End Date</label>
            <DatePicker
              id="endDate"
              selected={endDate}
              onSelect={setEndDate}
              className="w-full"
            />
          </div>
          <div className="flex items-end">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => {
                setStartDate(undefined);
                setEndDate(undefined);
              }}
            >
              Clear Dates
            </Button>
          </div>
        </div>
        <p className="mt-2 text-xs text-muted-foreground">
          If no date range is selected, all available data will be exported
        </p>
      </div>
      
      <div className="flex justify-end">
        <Button 
          onClick={handleExport} 
          disabled={isExporting}
          className="flex items-center gap-2"
        >
          {isExporting ? (
            <>
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-r-transparent" />
              <span>Exporting...</span>
            </>
          ) : (
            <>
              <Download className="h-4 w-4" />
              <span>Export Selected Data</span>
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default ExportDataSection;
