import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface SettingsManagementOptions {
  tableName: string;
  idField?: string;
  defaultBranchId?: string | null;
  initialData?: any;
}

export function useSettingsManagement<T>({
  tableName,
  idField = 'id',
  defaultBranchId = null,
  initialData = {}
}: SettingsManagementOptions) {
  const [data, setData] = useState<T | null>(initialData as T);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const fetchSettings = async () => {
    try {
      setIsLoading(true);
      setError(null);

      let query = supabase.from(tableName).select('*');

      // If we have a branch ID, filter by it
      if (defaultBranchId) {
        query = query.eq('branch_id', defaultBranchId);
      }

      // Limit to 1 record for settings tables that should have only one record per branch
      const { data: result, error: queryError } = await query.limit(1).maybeSingle();

      if (queryError) throw queryError;

      setData(result as T);
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
      setError(err instanceof Error ? err : new Error(errorMessage));
      console.error(`Error fetching ${tableName} settings:`, err);
      toast.error(`Failed to load settings: ${errorMessage}`);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const saveSettings = async (newData: Partial<T>): Promise<boolean> => {
    try {
      setIsSaving(true);
      setError(null);

      let response;
      const currentData = data as any;
      
      // If we have existing data with an ID, update it
      if (currentData && currentData[idField]) {
        const { data: updatedData, error: updateError } = await supabase
          .from(tableName)
          .update(newData as any)
          .eq(idField, currentData[idField])
          .select();

        if (updateError) throw updateError;
        response = updatedData?.[0];
      } else {
        // Otherwise, insert new data
        const insertData = {
          ...newData,
          branch_id: defaultBranchId || null
        };

        const { data: insertedData, error: insertError } = await supabase
          .from(tableName)
          .insert(insertData as any)
          .select();

        if (insertError) throw insertError;
        response = insertedData?.[0];
      }

      if (response) {
        setData(response);
        toast.success('Settings saved successfully');
        return true;
      }
      
      return false;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
      setError(err instanceof Error ? err : new Error(errorMessage));
      console.error(`Error saving ${tableName} settings:`, err);
      toast.error(`Failed to save settings: ${errorMessage}`);
      return false;
    } finally {
      setIsSaving(false);
    }
  };

  // Update a specific field in the settings
  const updateField = (field: string, value: any) => {
    if (!data) return;
    setData({ ...data as object, [field]: value } as T);
  };

  // Initial data fetch
  useEffect(() => {
    fetchSettings();
  }, [tableName, defaultBranchId]);

  return {
    data,
    isLoading,
    error,
    isSaving,
    fetchSettings,
    saveSettings,
    updateField
  };
}
