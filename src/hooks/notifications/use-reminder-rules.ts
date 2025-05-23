
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { ReminderRule, adaptReminderRuleFromDB } from '@/types/communication/reminder';

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

      // Transform database fields to match our frontend type
      const transformedRules: ReminderRule[] = (data || []).map(rule => adaptReminderRuleFromDB(rule));

      setRules(transformedRules);
      return transformedRules;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
      setError(err instanceof Error ? err : new Error(errorMessage));
      console.error('Error fetching reminder rules:', err);
      toast.error(`Failed to load reminder rules: ${errorMessage}`);
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  const saveRule = async (rule: ReminderRule): Promise<boolean> => {
    try {
      setIsSaving(true);
      setError(null);

      // Transform frontend fields to match database schema
      const dbRule = {
        title: rule.title,
        description: rule.description,
        trigger_type: rule.trigger_type,
        trigger_value: rule.trigger_value,
        conditions: rule.conditions || {},
        message: rule.message,
        notification_channel: rule.notification_channel,
        is_active: rule.is_active,
        send_via: rule.send_via,
        target_roles: rule.target_roles
      };

      let response;
      if (rule.id) {
        // Update existing rule
        const { data, error: updateError } = await supabase
          .from('reminder_rules')
          .update(dbRule)
          .eq('id', rule.id)
          .select();

        if (updateError) throw updateError;
        response = data?.[0];
      } else {
        // Insert new rule
        const { data, error: insertError } = await supabase
          .from('reminder_rules')
          .insert(dbRule)
          .select();

        if (insertError) throw insertError;
        response = data?.[0];
      }

      if (response) {
        // Transform the response back to our frontend type
        const savedRule = adaptReminderRuleFromDB(response);

        // Update rules array
        const updatedRules = [...rules];
        const index = updatedRules.findIndex(r => r.id === savedRule.id);
        
        if (index >= 0) {
          updatedRules[index] = savedRule;
        } else {
          updatedRules.push(savedRule);
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
        .update({ is_active: !isActive })
        .eq('id', id)
        .select();

      if (updateError) throw updateError;

      if (data && data[0]) {
        // Update rules array
        const updatedRules = rules.map(rule => 
          rule.id === id ? adaptReminderRuleFromDB({
            ...rule,
            is_active: data[0].is_active
          }) : rule
        );
        
        setRules(updatedRules);
        toast.success(`Reminder rule ${data[0].is_active ? 'activated' : 'deactivated'} successfully`);
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
