import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from '@/hooks/use-auth';
import { supabase } from '@/services/supabaseClient';
import { BackupLogEntry } from '@/types/notification';

interface ExportDataSectionProps {
  onExportComplete: () => void;
}

const ExportDataSection = ({ onExportComplete }: ExportDataSectionProps) => {
  const [selectedModules, setSelectedModules] = useState<string[]>([]);
  const { toast } = useToast();
  const { user } = useAuth();

  const modules = [
    { name: 'Members', value: 'members' },
    { name: 'Classes', value: 'classes' },
    { name: 'Trainers', value: 'trainers' },
    { name: 'Announcements', value: 'announcements' },
    { name: 'Reminder Rules', value: 'reminder_rules' },
    { name: 'Motivational Messages', value: 'motivational_messages' },
    { name: 'Feedback', value: 'feedback' },
  ];

  const toggleModule = (moduleValue: string) => {
    setSelectedModules(prev =>
      prev.includes(moduleValue)
        ? prev.filter(item => item !== moduleValue)
        : [...prev, moduleValue]
    );
  };

  const handleExport = async () => {
    try {
      if (selectedModules.length === 0) {
        toast({
          title: "No modules selected.",
          description: "Please select at least one module to export.",
          variant: "destructive",
        });
        return;
      }

      let allData: { [key: string]: any[] } = {};

      for (const module of selectedModules) {
        const { data, error } = await supabase
          .from(module)
          .select('*');

        if (error) {
          throw new Error(`Failed to fetch ${module}: ${error.message}`);
        }

        allData[module] = data || [];
      }

      const filename = `export-${new Date().toISOString()}.json`;
      const json = JSON.stringify(allData, null, 2);
      const blob = new Blob([json], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      // Log the backup activity
      const logEntry: Omit<BackupLogEntry, "id" | "created_at" | "updated_at"> = {
        action: 'export',
        user_id: user?.id,
        user_name: user?.name || 'Unknown',
        timestamp: new Date().toISOString(),
        modules: selectedModules,
        success: true,
        total_records: Object.values(allData).flat().length,
        success_count: Object.values(allData).flat().length
      };

      const { error: logError } = await supabase
        .from('backup_logs')
        .insert([logEntry]);

      if (logError) {
        console.error('Failed to log backup activity:', logError);
      }

      toast({
        title: "Export successful!",
        description: `Data exported to ${filename}`,
      });

      onExportComplete();
    } catch (error: any) {
      console.error('Export failed:', error);
      toast({
        title: "Export failed.",
        description: error.message || "An unexpected error occurred.",
        variant: "destructive",
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Export Data</CardTitle>
        <CardDescription>
          Select the modules you want to export.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        {modules.map(module => (
          <div key={module.value} className="flex items-center space-x-2">
            <Checkbox
              id={module.value}
              checked={selectedModules.includes(module.value)}
              onCheckedChange={() => toggleModule(module.value)}
            />
            <label
              htmlFor={module.value}
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              {module.name}
            </label>
          </div>
        ))}
        <Button onClick={handleExport}>Export</Button>
      </CardContent>
    </Card>
  );
};

export default ExportDataSection;
