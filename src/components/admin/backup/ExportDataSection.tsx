
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { DatePicker } from '@/components/ui/date-picker';
import { Checkbox } from '@/components/ui/checkbox';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { toast } from 'sonner';
import { exportData, logBackupActivity } from '@/services/backupService';
import { FileDown, FileCheck, CalendarIcon, Info, RefreshCcw, FileText } from 'lucide-react';
import { format } from 'date-fns';

interface ExportModule {
  id: string;
  label: string;
  description?: string;
  table?: string;
}

const modules: ExportModule[] = [
  {
    id: 'members',
    label: 'Members Data',
    description: 'Export all member records including personal information and status',
    table: 'members'
  },
  {
    id: 'staffTrainers',
    label: 'Staff & Trainers',
    description: 'Export all staff and trainer profiles',
    table: 'profiles'
  },
  {
    id: 'branches',
    label: 'Branches',
    description: 'Export branch information including contact details',
    table: 'branches'
  },
  {
    id: 'workoutPlans',
    label: 'Workout Plans',
    description: 'Export workout plans and their exercises',
    table: 'workout_plans'
  },
  {
    id: 'dietPlans',
    label: 'Diet Plans',
    description: 'Export diet plans and their meal details',
    table: 'diet_plans'
  },
  {
    id: 'attendance',
    label: 'Attendance Records',
    description: 'Export check-in/check-out records',
    table: 'member_attendance'
  },
  {
    id: 'invoices',
    label: 'Invoices',
    description: 'Export invoice records including payment status',
    table: 'invoices'
  },
  {
    id: 'transactions',
    label: 'Financial Transactions',
    description: 'Export income and expense transactions',
    table: 'transactions'
  }
];

const ExportDataSection: React.FC = () => {
  const [selectedModules, setSelectedModules] = useState<string[]>([]);
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [isExporting, setIsExporting] = useState(false);

  const handleModuleToggle = (moduleId: string) => {
    setSelectedModules(prev =>
      prev.includes(moduleId)
        ? prev.filter(id => id !== moduleId)
        : [...prev, moduleId]
    );
  };

  const handleSelectAll = () => {
    const allModuleIds = modules.map(module => module.id);
    setSelectedModules(allModuleIds);
  };

  const handleClearSelection = () => {
    setSelectedModules([]);
  };

  const handleExport = async () => {
    if (selectedModules.length === 0) {
      toast.error('Please select at least one module to export');
      return;
    }

    setIsExporting(true);
    toast.info('Preparing export data...');

    try {
      // Map selected module IDs to their corresponding table names
      const tablesToExport = selectedModules.map(moduleId => {
        const module = modules.find(m => m.id === moduleId);
        return module?.table || moduleId;
      });
      
      const data = await exportData(tablesToExport, startDate, endDate);
      const totalRecords = Object.values(data).reduce((sum, records) => sum + records.length, 0);
      
      // Convert to JSON and create a downloadable file
      const jsonString = JSON.stringify(data, null, 2);
      const blob = new Blob([jsonString], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      
      // Create a link and trigger download
      const a = document.createElement('a');
      a.href = url;
      a.download = `gym-export-${format(new Date(), 'yyyy-MM-dd-HHmmss')}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      
      // Log the backup activity
      await logBackupActivity('export', selectedModules.join(','), totalRecords, totalRecords);
      
      toast.success(`Successfully exported ${totalRecords} records`);
    } catch (error) {
      console.error('Export error:', error);
      toast.error('Failed to export data');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <FileDown className="h-5 w-5" />
              Export Data
            </CardTitle>
            <CardDescription>
              Export your data in JSON format for backup or analysis
            </CardDescription>
          </div>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleSelectAll}
            >
              Select All
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleClearSelection}
            >
              Clear
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 space-y-2">
            <Label>Start Date (Optional)</Label>
            <DatePicker
              date={startDate}
              setDate={setStartDate}
              className="w-full"
              components={{
                IconLeft: () => <CalendarIcon className="h-4 w-4 mr-2" />
              }}
            />
          </div>
          <div className="flex-1 space-y-2">
            <Label>End Date (Optional)</Label>
            <DatePicker
              date={endDate}
              setDate={setEndDate}
              className="w-full"
              components={{
                IconLeft: () => <CalendarIcon className="h-4 w-4 mr-2" />
              }}
            />
          </div>
        </div>

        <div className="border rounded-md p-1">
          <Accordion type="multiple" className="w-full">
            {/* Member Management Section */}
            <AccordionItem value="member-data">
              <AccordionTrigger className="px-3">Member Management Data</AccordionTrigger>
              <AccordionContent className="space-y-3 px-3">
                {modules.slice(0, 3).map(module => (
                  <div key={module.id} className="flex items-start space-x-3 py-2">
                    <Checkbox
                      id={`module-${module.id}`}
                      checked={selectedModules.includes(module.id)}
                      onCheckedChange={() => handleModuleToggle(module.id)}
                    />
                    <div className="space-y-1">
                      <Label
                        htmlFor={`module-${module.id}`}
                        className="text-sm font-medium leading-none"
                      >
                        {module.label}
                      </Label>
                      <p className="text-sm text-gray-500">{module.description}</p>
                    </div>
                  </div>
                ))}
              </AccordionContent>
            </AccordionItem>
            
            {/* Fitness Programs Section */}
            <AccordionItem value="fitness-data">
              <AccordionTrigger className="px-3">Fitness Programs Data</AccordionTrigger>
              <AccordionContent className="space-y-3 px-3">
                {modules.slice(3, 5).map(module => (
                  <div key={module.id} className="flex items-start space-x-3 py-2">
                    <Checkbox
                      id={`module-${module.id}`}
                      checked={selectedModules.includes(module.id)}
                      onCheckedChange={() => handleModuleToggle(module.id)}
                    />
                    <div className="space-y-1">
                      <Label
                        htmlFor={`module-${module.id}`}
                        className="text-sm font-medium leading-none"
                      >
                        {module.label}
                      </Label>
                      <p className="text-sm text-gray-500">{module.description}</p>
                    </div>
                  </div>
                ))}
              </AccordionContent>
            </AccordionItem>
            
            {/* Operations Section */}
            <AccordionItem value="operations-data">
              <AccordionTrigger className="px-3">Operations Data</AccordionTrigger>
              <AccordionContent className="space-y-3 px-3">
                {modules.slice(5, 6).map(module => (
                  <div key={module.id} className="flex items-start space-x-3 py-2">
                    <Checkbox
                      id={`module-${module.id}`}
                      checked={selectedModules.includes(module.id)}
                      onCheckedChange={() => handleModuleToggle(module.id)}
                    />
                    <div className="space-y-1">
                      <Label
                        htmlFor={`module-${module.id}`}
                        className="text-sm font-medium leading-none"
                      >
                        {module.label}
                      </Label>
                      <p className="text-sm text-gray-500">{module.description}</p>
                    </div>
                  </div>
                ))}
              </AccordionContent>
            </AccordionItem>
            
            {/* Financial Data Section */}
            <AccordionItem value="financial-data">
              <AccordionTrigger className="px-3">Financial Data</AccordionTrigger>
              <AccordionContent className="space-y-3 px-3">
                {modules.slice(6, 8).map(module => (
                  <div key={module.id} className="flex items-start space-x-3 py-2">
                    <Checkbox
                      id={`module-${module.id}`}
                      checked={selectedModules.includes(module.id)}
                      onCheckedChange={() => handleModuleToggle(module.id)}
                    />
                    <div className="space-y-1">
                      <Label
                        htmlFor={`module-${module.id}`}
                        className="text-sm font-medium leading-none"
                      >
                        {module.label}
                      </Label>
                      <p className="text-sm text-gray-500">{module.description}</p>
                    </div>
                  </div>
                ))}
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
        
        <div className="bg-muted rounded-md p-4 flex items-start gap-3">
          <Info className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-0.5" />
          <div className="text-sm text-muted-foreground">
            <p className="font-medium mb-1">About Data Export</p>
            <p>
              Exported data will be in JSON format which can be imported back into the system.
              Date filters will be applied to all modules except branches and settings.
            </p>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={() => {
          setStartDate(undefined);
          setEndDate(undefined);
        }}>
          <RefreshCcw className="h-4 w-4 mr-2" />
          Reset Dates
        </Button>
        <Button onClick={handleExport} disabled={isExporting || selectedModules.length === 0}>
          {isExporting ? (
            <>
              <RefreshCcw className="h-4 w-4 mr-2 animate-spin" />
              Exporting...
            </>
          ) : (
            <>
              <FileText className="h-4 w-4 mr-2" />
              Export Selected Data
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ExportDataSection;
