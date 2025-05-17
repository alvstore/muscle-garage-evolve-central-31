import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent } from '@/components/ui/card';
import { useAuth } from '@/hooks/auth/use-auth';
import { toast } from 'sonner';
import { Loader2, Download, FileText } from 'lucide-react';
import backupService from '@/services/settings/backupService';

interface ExportDataSectionProps {
  onExportComplete: () => void;
}

// Define the valid table types to match the ones in backupService
type ValidTable = 
  | 'members' 
  | 'announcements' 
  | 'branches' 
  | 'backup_logs'
  | 'body_measurements' 
  | 'class_bookings' 
  | 'classes'
  | 'class_schedules' 
  | 'diet_plans' 
  | 'email_settings'
  | 'exercises' 
  | 'expense_categories' 
  | 'feedback'
  | 'global_settings' 
  | 'income_categories' 
  | 'inventory_items'
  | 'invoices' 
  | 'meal_items' 
  | 'meal_plans'
  | 'measurements' 
  | 'member_attendance' 
  | 'member_memberships'
  | 'member_progress' 
  | 'memberships' 
  | 'motivational_messages'
  | 'orders' 
  | 'payment_gateway_settings' 
  | 'payment_settings'
  | 'payments' 
  | 'profiles' 
  | 'promo_codes'
  | 'referrals' 
  | 'reminder_rules' 
  | 'staff_attendance'
  | 'store_products' 
  | 'trainer_assignments' 
  | 'transactions'
  | 'webhook_logs' 
  | 'workout_days' 
  | 'workout_plans';

const ExportDataSection: React.FC<ExportDataSectionProps> = ({ onExportComplete }) => {
  const [selectedModules, setSelectedModules] = useState<ValidTable[]>([]);
  const [exporting, setExporting] = useState(false);
  const { user } = useAuth();

  const handleModuleSelect = (module: ValidTable) => {
    setSelectedModules((prev) =>
      prev.includes(module) ? prev.filter((m) => m !== module) : [...prev, module]
    );
  };

  const modules: ValidTable[] = [
    'members', 'announcements', 'branches', 'backup_logs',
    'body_measurements', 'class_bookings', 'classes',
    'class_schedules', 'diet_plans', 'email_settings',
    'exercises', 'expense_categories', 'feedback',
    'global_settings', 'income_categories', 'inventory_items',
    'invoices', 'meal_items', 'meal_plans',
    'measurements', 'member_attendance', 'member_memberships',
    'member_progress', 'memberships', 'motivational_messages',
    'orders', 'payment_gateway_settings', 'payment_settings',
    'payments', 'profiles', 'promo_codes',
    'referrals', 'reminder_rules', 'staff_attendance',
    'store_products', 'trainer_assignments', 'transactions',
    'webhook_logs', 'workout_days', 'workout_plans'
  ];

  const handleExport = async () => {
    if (selectedModules.length === 0) {
      toast.error('Please select at least one module to export');
      return;
    }

    setExporting(true);

    try {
      const result = await backupService.createFullBackup(
        user?.id || '',
        user?.full_name || user?.name || 'System',
        selectedModules
      );

      if (result.success) {
        const backupData = JSON.stringify(result.data);
        const blob = new Blob([backupData], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `backup-${new Date().toISOString()}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        toast.success('Data exported successfully');
        onExportComplete();
      } else {
        toast.error('Failed to create backup');
      }
    } catch (error) {
      console.error('Export error:', error);
      toast.error('An error occurred during export');
    } finally {
      setExporting(false);
    }
  };

  return (
    <CardContent className="grid gap-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {modules.map((module) => (
          <Card key={module} className="shadow-sm hover:shadow-md transition-shadow duration-200">
            <CardContent className="flex items-center justify-between p-3">
              <label
                htmlFor={module}
                className="font-medium text-sm text-gray-700 cursor-pointer"
              >
                {module}
              </label>
              <Checkbox
                id={module}
                checked={selectedModules.includes(module)}
                onCheckedChange={() => handleModuleSelect(module)}
              />
            </CardContent>
          </Card>
        ))}
      </div>

      <Button
        onClick={handleExport}
        disabled={exporting}
        className="w-full"
      >
        {exporting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Exporting...
          </>
        ) : (
          <>
            <Download className="mr-2 h-4 w-4" />
            Export Data
          </>
        )}
      </Button>
    </CardContent>
  );
};

export default ExportDataSection;
