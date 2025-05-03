
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface ReminderRule {
  id?: string;
  title: string;
  description?: string;
  trigger_type: string;
  trigger_value?: number;
  conditions: Record<string, any>;
  message?: string;
  notification_channel?: string;
  send_via: string[];
  target_roles: string[];
  is_active: boolean;
  // Backwards compatibility fields
  name?: string;
  triggerType?: string;
  triggerValue?: number;
  active?: boolean;
  channels?: string[];
  targetRoles?: string[];
  targetType?: string;
}

export const useReminderRules = () => {
  const [rules, setRules] = useState<ReminderRule[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const fetchRules = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const { data, error: queryError } = await supabase
        .from('reminder_rules')
        .select('*');

      if (queryError) throw queryError;

      setRules(data || []);
      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
      setError(err instanceof Error ? err : new Error(errorMessage));
      console.error('Error fetching reminder rules:', err);
      toast.error(`Failed to load reminder rules: ${errorMessage}`);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const saveRule = async (rule: ReminderRule): Promise<boolean> => {
    try {
      setIsSaving(true);
      setError(null);

      let response;
      if (rule.id) {
        // Update existing rule
        const { data, error: updateError } = await supabase
          .from('reminder_rules')
          .update(rule)
          .eq('id', rule.id)
          .select();

        if (updateError) throw updateError;
        response = data?.[0];
      } else {
        // Insert new rule
        const { data, error: insertError } = await supabase
          .from('reminder_rules')
          .insert(rule)
          .select();

        if (insertError) throw insertError;
        response = data?.[0];
      }

      if (response) {
        // Update rules array
        const updatedRules = [...rules];
        const index = updatedRules.findIndex(r => r.id === response.id);
        
        if (index >= 0) {
          updatedRules[index] = response;
        } else {
          updatedRules.push(response);
        }
        
        setRules(updatedRules);
        toast.success(`Reminder rule "${rule.title}" saved successfully`);
        return true;
      }
      
      return false;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
      setError(err instanceof Error ? err : new Error(errorMessage));
      console.error('Error saving reminder rule:', err);
      toast.error(`Failed to save reminder rule: ${errorMessage}`);
      return false;
    } finally {
      setIsSaving(false);
    }
  };

  const deleteRule = async (id: string): Promise<boolean> => {
    try {
      setIsSaving(true);
      setError(null);

      const { error: deleteError } = await supabase
        .from('reminder_rules')
        .delete()
        .eq('id', id);

      if (deleteError) throw deleteError;

      // Update rules array
      setRules(rules.filter(rule => rule.id !== id));
      toast.success('Reminder rule deleted successfully');
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
      setError(err instanceof Error ? err : new Error(errorMessage));
      console.error('Error deleting reminder rule:', err);
      toast.error(`Failed to delete reminder rule: ${errorMessage}`);
      return false;
    } finally {
      setIsSaving(false);
    }
  };

  const toggleRuleStatus = async (id: string, isActive: boolean): Promise<boolean> => {
    try {
      setIsSaving(true);
      setError(null);

      const { data, error: updateError } = await supabase
        .from('reminder_rules')
        .update({ is_active: isActive })
        .eq('id', id)
        .select();

      if (updateError) throw updateError;

      if (data && data[0]) {
        // Update rules array
        const updatedRules = rules.map(rule => 
          rule.id === id ? { ...rule, is_active: isActive } : rule
        );
        
        setRules(updatedRules);
        toast.success(`Reminder rule ${isActive ? 'activated' : 'deactivated'} successfully`);
        return true;
      }

      return false;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
      setError(err instanceof Error ? err : new Error(errorMessage));
      console.error('Error toggling reminder rule status:', err);
      toast.error(`Failed to update reminder rule status: ${errorMessage}`);
      return false;
    } finally {
      setIsSaving(false);
    }
  };

  // Initial fetch of rules
  useEffect(() => {
    fetchRules();
  }, []);

  return {
    rules,
    isLoading,
    error,
    isSaving,
    fetchRules,
    saveRule,
    deleteRule,
    toggleRuleStatus
  };
};
