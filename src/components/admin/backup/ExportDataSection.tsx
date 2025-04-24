
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { DatePicker } from '@/components/ui/date-picker';
import { CalendarRange, CalendarIcon, Download } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { useAuth } from '@/hooks/use-auth';
import { useBranch } from '@/hooks/use-branch';
import { createBackupLog } from '@/services/backupService';

const formSchema = z.object({
  modules: z.array(z.string()).min(1, 'Select at least one module to export'),
  startDate: z.date().optional(),
  endDate: z.date().optional(),
});

const exportModules = [
  { id: 'members', label: 'Members' },
  { id: 'staff', label: 'Staff' },
  { id: 'trainers', label: 'Trainers' },
  { id: 'classes', label: 'Classes' },
  { id: 'attendance', label: 'Attendance' },
  { id: 'payments', label: 'Payments & Invoices' },
  { id: 'memberships', label: 'Membership Plans' },
  { id: 'workout-plans', label: 'Workout Plans' },
  { id: 'diet-plans', label: 'Diet Plans' },
  { id: 'inventory', label: 'Inventory' },
  { id: 'settings', label: 'System Settings' },
];

const ExportDataSection = () => {
  const { user } = useAuth();
  const { currentBranch } = useBranch();
  const [isExporting, setIsExporting] = useState(false);
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      modules: ['members'],
    },
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    if (!user) {
      toast.error('You need to be logged in to export data');
      return;
    }
    
    setIsExporting(true);
    
    // Simulate export process
    try {
      // Log export operation
      await createBackupLog({
        action: 'export',
        userId: user.id,
        userName: user.name || user.email || 'Unknown User',
        timestamp: new Date().toISOString(),
        modules: data.modules,
        success: true,
        totalRecords: Math.floor(Math.random() * 500) + 50
      });
      
      // In a real implementation, we would call a function to actually export the data
      // For now, we'll just simulate it with a timeout
      setTimeout(() => {
        toast.success('Data export completed successfully', {
          description: `Exported ${data.modules.length} modules to CSV format.`,
        });
        setIsExporting(false);
        
        // Simulate download by creating a dummy CSV file
        const dummyData = 'id,name,email\n1,John Doe,john@example.com\n2,Jane Smith,jane@example.com';
        const blob = new Blob([dummyData], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.setAttribute('hidden', '');
        a.setAttribute('href', url);
        a.setAttribute('download', `gym-data-export-${format(new Date(), 'yyyy-MM-dd')}.csv`);
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      }, 2000);
    } catch (error) {
      console.error('Export error:', error);
      toast.error('Failed to export data');
      setIsExporting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Download className="h-5 w-5 mr-2" />
          Export Data
        </CardTitle>
        <CardDescription>
          Export your gym data for backup or analysis purposes
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="modules"
              render={() => (
                <FormItem>
                  <div className="mb-4">
                    <FormLabel>Select modules to export</FormLabel>
                    <FormDescription>
                      Choose which data you want to include in the export
                    </FormDescription>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {exportModules.map((module) => (
                      <FormField
                        key={module.id}
                        control={form.control}
                        name="modules"
                        render={({ field }) => {
                          return (
                            <FormItem
                              key={module.id}
                              className="flex flex-row items-start space-x-3 space-y-0"
                            >
                              <FormControl>
                                <Checkbox
                                  checked={field.value?.includes(module.id)}
                                  onCheckedChange={(checked) => {
                                    return checked
                                      ? field.onChange([...field.value, module.id])
                                      : field.onChange(
                                          field.value?.filter(
                                            (value) => value !== module.id
                                          )
                                        );
                                  }}
                                />
                              </FormControl>
                              <FormLabel className="font-normal">
                                {module.label}
                              </FormLabel>
                            </FormItem>
                          );
                        }}
                      />
                    ))}
                  </div>
                </FormItem>
              )}
            />

            <Separator />

            <div>
              <h3 className="text-sm font-medium mb-4">Date Range (Optional)</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="startDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Start Date</FormLabel>
                      <DatePicker
                        date={startDate}
                        setDate={(date) => {
                          setStartDate(date);
                          field.onChange(date);
                        }}
                        className="w-full"
                        components={{
                          IconLeft: () => <CalendarIcon className="h-4 w-4 mr-2" />,
                        }}
                      />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="endDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>End Date</FormLabel>
                      <DatePicker
                        date={endDate}
                        setDate={(date) => {
                          setEndDate(date);
                          field.onChange(date);
                        }}
                        className="w-full"
                        components={{
                          IconLeft: () => <CalendarIcon className="h-4 w-4 mr-2" />,
                        }}
                      />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div className="flex justify-between items-center">
              <div className="text-sm text-muted-foreground">
                {currentBranch ? (
                  <span>Exporting data for branch: <strong>{currentBranch.name}</strong></span>
                ) : (
                  <span>Exporting data for all branches</span>
                )}
              </div>
              <Button type="submit" disabled={isExporting}>
                {isExporting ? (
                  <>
                    <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent"></span>
                    Exporting...
                  </>
                ) : (
                  <>
                    <Download className="mr-2 h-4 w-4" />
                    Export Data
                  </>
                )}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default ExportDataSection;
