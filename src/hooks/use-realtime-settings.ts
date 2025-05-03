import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface RealtimeOptions<T> {
  table: string;
  defaultValue: T;
  branchId?: string | null;
  filter?: Record<string, any>;
  isArray?: boolean;
}

export function useRealtimeSettings<T>({ 
  table, 
  defaultValue, 
  branchId = null,
  filter = {}, 
  isArray = false
}: RealtimeOptions<T>) {
  const [data, setData] = useState<T>(defaultValue);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Function to fetch initial data
  const fetchData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      let query = supabase.from(table).select('*');
      
      // Apply branch filter if provided
      if (branchId) {
        query = query.eq('branch_id', branchId);
      } else if (branchId === null) {
        query = query.is('branch_id', null);
      }
      
      // Apply additional filters if provided
      Object.entries(filter).forEach(([key, value]) => {
        query = query.eq(key, value);
      });

      const { data: responseData, error: fetchError } = isArray
        ? await query
        : await query.maybeSingle();

      if (fetchError) throw fetchError;

      setData((responseData || defaultValue) as T);
      return responseData;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
      setError(err instanceof Error ? err : new Error(errorMessage));
      console.error(`Error fetching ${table}:`, err);
      toast.error(`Failed to load ${table}: ${errorMessage}`);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  // Function to update data
  const updateData = async (updates: Partial<T>): Promise<boolean> => {
    try {
      setIsSaving(true);
      setError(null);
      
      // For array data, update may need special handling depending on your use case
      if (isArray) {
        // This is simplified; you may need more complex logic depending on your specific requirements
        const { error: updateError } = await supabase
          .from(table)
          .upsert(updates);
          
        if (updateError) throw updateError;
      } else {
        // For single records
        const currentData = data as Record<string, any>;
        
        // If we have an ID, update the existing record
        if (currentData && currentData.id) {
          const { error: updateError } = await supabase
            .from(table)
            .update(updates)
            .eq('id', currentData.id);
            
          if (updateError) throw updateError;
        } else {
          // Otherwise insert a new record
          const newRecord = {
            ...defaultValue,
            ...updates,
            ...(branchId ? { branch_id: branchId } : {})
          };
          
          const { error: insertError } = await supabase
            .from(table)
            .insert([newRecord]);
            
          if (insertError) throw insertError;
        }
      }
      
      // Optimistic UI update
      if (isArray) {
        // Update array items - likely need more complex logic based on your specific case
        setData(prevData => ({ ...prevData, ...updates }));
      } else {
        // Update single record
        setData(prevData => ({ ...prevData, ...updates }));
      }
      
      toast.success(`${table} updated successfully`);
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
      setError(err instanceof Error ? err : new Error(errorMessage));
      console.error(`Error updating ${table}:`, err);
      toast.error(`Failed to update ${table}: ${errorMessage}`);
      return false;
    } finally {
      setIsSaving(false);
    }
  };

  // Set up realtime subscription
  useEffect(() => {
    // First, fetch initial data
    fetchData();

    // Then set up realtime subscription
    const channel = supabase
      .channel('settings-changes')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table 
      }, (payload) => {
        console.log(`Realtime update for ${table}:`, payload);
        
        // Handle different event types
        if (payload.eventType === 'INSERT' || payload.eventType === 'UPDATE') {
          if (isArray) {
            // For arrays, just refetch all data
            fetchData();
          } else {
            // For single items, update if it matches our filters
            const newData = payload.new as Record<string, any>;
            
            let matches = true;
            // Check if branch filter matches
            if (branchId !== undefined && newData.branch_id !== branchId) {
              matches = false;
            }
            
            // Check if other filters match
            Object.entries(filter).forEach(([key, value]) => {
              if (newData[key] !== value) matches = false;
            });
            
            if (matches) {
              setData(newData as T);
            }
          }
        } else if (payload.eventType === 'DELETE') {
          if (isArray) {
            // For arrays, just refetch all data
            fetchData();
          } else {
            // For single items, check if it's our item
            const oldData = payload.old as Record<string, any>;
            const currentData = data as Record<string, any>;
            
            if (currentData && currentData.id === oldData.id) {
              setData(defaultValue);
            }
          }
        }
      })
      .subscribe();

    // Clean up subscription
    return () => {
      supabase.removeChannel(channel);
    };
  }, [table, branchId, JSON.stringify(filter)]);

  return {
    data,
    isLoading,
    error,
    isSaving,
    updateData,
    refreshData: fetchData
  };
}

// Specialized hook for company settings
export function useCompanySettings() {
  return useRealtimeSettings({
    table: 'company_settings',
    defaultValue: {
      gym_name: 'Muscle Garage',
      contact_email: '',
      contact_phone: '',
      business_hours_start: '06:00',
      business_hours_end: '22:00',
      currency: 'INR',
      currency_symbol: '₹',
      tax_rate: 18
    },
    branchId: null
  });
}

// Specialized hook for integrations
export function useIntegrationStatuses() {
  return useRealtimeSettings({
    table: 'integration_statuses',
    defaultValue: [],
    isArray: true
  });
}

// Specialized hook for branches
export function useRealtimeBranches() {
  return useRealtimeSettings({
    table: 'branches',
    defaultValue: [],
    isArray: true
  });
}

// Specialized hook for attendance settings
export function useAttendanceSettings(branchId: string | null = null) {
  return useRealtimeSettings({
    table: 'attendance_settings',
    defaultValue: {
      hikvision_enabled: false,
      qr_enabled: true,
      device_config: {}
    },
    branchId: branchId
  });
}
