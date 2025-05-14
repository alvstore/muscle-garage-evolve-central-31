
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Download, Loader2 } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import { toast } from 'sonner';
import { saveAs } from 'file-saver';
import { supabase } from '@/integrations/supabase/client';

interface ExportDataSectionProps {
  onExportComplete: () => void;
}

type ModuleType = 
  | 'members' 
  | 'classes' 
  | 'profiles' 
  | 'announcements' 
  | 'reminder_rules' 
  | 'motivational_messages'
  | 'feedback';

interface Module {
  id: ModuleType;
  label: string;
  selected: boolean;
}

const ExportDataSection: React.FC<ExportDataSectionProps> = ({ onExportComplete }) => {
  const { user } = useAuth();
  const [isExporting, setIsExporting] = useState(false);
  
  const [modules, setModules] = useState<Module[]>([
    { id: 'members', label: 'Members', selected: true },
    { id: 'classes', label: 'Classes', selected: true },
    { id: 'profiles', label: 'Staff & Trainers', selected: true },
    { id: 'announcements', label: 'Announcements', selected: true },
    { id: 'reminder_rules', label: 'Reminder Rules', selected: true },
    { id: 'motivational_messages', label: 'Motivational Messages', selected: true },
    { id: 'feedback', label: 'Feedback', selected: true },
  ]);

  const toggleModule = (id: ModuleType) => {
    setModules(modules.map(module => 
      module.id === id ? { ...module, selected: !module.selected } : module
    ));
  };

  const selectAll = () => {
    setModules(modules.map(module => ({ ...module, selected: true })));
  };

  const deselectAll = () => {
    setModules(modules.map(module => ({ ...module, selected: false })));
  };

  const handleExport = async () => {
    const selectedModules = modules.filter(m => m.selected).map(m => m.id);
    
    if (selectedModules.length === 0) {
      toast.error("No modules selected. Please select at least one module to export.");
      return;
    }

    setIsExporting(true);
    const exportData: Record<string, any[]> = {};
    
    try {
      for (const module of selectedModules) {
        // Use the module as a type safe string for the query
        const { data, error } = await supabase
          .from(module)
          .select('*');
          
        if (error) {
          console.error(`Error exporting ${module}:`, error);
          toast.error(`Error exporting ${module}: ${error.message}`);
        } else if (data) {
          exportData[module] = data;
        }
      }
      
      // Create and download the JSON file
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const fileName = `gym-backup-${timestamp}.json`;
      const fileContent = JSON.stringify(exportData, null, 2);
      const blob = new Blob([fileContent], { type: 'application/json' });
      saveAs(blob, fileName);
      
      // Log the export activity
      await supabase.from('backup_logs').insert([
        {
          action: 'export',
          user_id: user?.id,
          user_name: user?.name || 'Unknown',
          timestamp: new Date().toISOString(),
          modules: selectedModules,
          success: true,
          total_records: Object.values(exportData).flat().length,
        }
      ]);
      
      toast.success(`Successfully exported data to ${fileName}`);
      
      if (onExportComplete) {
        onExportComplete();
      }
    } catch (error: any) {
      console.error('Export failed:', error);
      toast.error(error.message || "An unexpected error occurred during export");
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <Label className="text-base font-medium">Select modules to export</Label>
            <div className="space-x-2">
              <Button variant="outline" size="sm" onClick={selectAll}>Select All</Button>
              <Button variant="outline" size="sm" onClick={deselectAll}>Deselect All</Button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
            {modules.map((module) => (
              <div key={module.id} className="flex items-center space-x-2">
                <Checkbox
                  id={`module-${module.id}`}
                  checked={module.selected}
                  onCheckedChange={() => toggleModule(module.id)}
                />
                <Label
                  htmlFor={`module-${module.id}`}
                  className="text-sm font-normal cursor-pointer"
                >
                  {module.label}
                </Label>
              </div>
            ))}
          </div>
        </div>
        
        <Button
          onClick={handleExport}
          disabled={isExporting || modules.every(m => !m.selected)}
          className="w-full"
        >
          {isExporting ? (
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
    </Card>
  );
};

export default ExportDataSection;
