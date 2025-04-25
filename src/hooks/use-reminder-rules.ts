
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/services/supabaseClient';
import { ReminderRule, adaptReminderRuleFromDB } from '@/types/notification';
import { toast } from 'sonner';

export const useReminderRules = () => {
  const [reminderRules, setReminderRules] = useState<ReminderRule[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchReminderRules = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const { data, error: fetchError } = await supabase
        .from('reminder_rules')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (fetchError) throw new Error(fetchError.message);
      
      if (data) {
        const adaptedRules = data.map(adaptReminderRuleFromDB);
        setReminderRules(adaptedRules);
      }
    } catch (err: any) {
      setError(err);
      console.error('Error fetching reminder rules:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createReminderRule = async (rule: Omit<ReminderRule, "id" | "createdAt" | "updatedAt">) => {
    try {
      const { error: createError } = await supabase
        .from('reminder_rules')
        .insert([{
          title: rule.name,
          description: rule.description,
          trigger_type: rule.triggerType,
          trigger_value: rule.triggerValue,
          notification_channel: rule.notificationChannel,
          send_via: rule.sendVia,
          target_roles: rule.targetRoles,
          message: rule.message,
          is_active: rule.active,
          conditions: rule.conditions || {},
          target_type: rule.targetType || ''
        }]);
      
      if (createError) throw new Error(createError.message);
      
      await fetchReminderRules();
      return true;
    } catch (err: any) {
      console.error('Error creating reminder rule:', err);
      toast.error('Failed to create reminder rule');
      return false;
    }
  };

  const updateReminderRule = async (id: string, updates: Partial<Omit<ReminderRule, "id" | "createdAt" | "updatedAt">>) => {
    try {
      const updateData: any = {};
      
      if (updates.name !== undefined) updateData.title = updates.name;
      if (updates.description !== undefined) updateData.description = updates.description;
      if (updates.triggerType !== undefined) updateData.trigger_type = updates.triggerType;
      if (updates.triggerValue !== undefined) updateData.trigger_value = updates.triggerValue;
      if (updates.notificationChannel !== undefined) updateData.notification_channel = updates.notificationChannel;
      if (updates.sendVia !== undefined) updateData.send_via = updates.sendVia;
      if (updates.targetRoles !== undefined) updateData.target_roles = updates.targetRoles;
      if (updates.message !== undefined) updateData.message = updates.message;
      if (updates.active !== undefined) updateData.is_active = updates.active;
      if (updates.conditions !== undefined) updateData.conditions = updates.conditions;
      if (updates.targetType !== undefined) updateData.target_type = updates.targetType;
      
      const { error: updateError } = await supabase
        .from('reminder_rules')
        .update(updateData)
        .eq('id', id);
      
      if (updateError) throw new Error(updateError.message);
      
      await fetchReminderRules();
      return true;
    } catch (err: any) {
      console.error('Error updating reminder rule:', err);
      toast.error('Failed to update reminder rule');
      return false;
    }
  };

  const deleteReminderRule = async (id: string) => {
    try {
      const { error: deleteError } = await supabase
        .from('reminder_rules')
        .delete()
        .eq('id', id);
      
      if (deleteError) throw new Error(deleteError.message);
      
      await fetchReminderRules();
      return true;
    } catch (err: any) {
      console.error('Error deleting reminder rule:', err);
      toast.error('Failed to delete reminder rule');
      return false;
    }
  };

  const toggleRuleStatus = async (id: string, active: boolean) => {
    return await updateReminderRule(id, { active: !active });
  };

  useEffect(() => {
    fetchReminderRules();
  }, [fetchReminderRules]);

  return {
    reminderRules,
    isLoading,
    error,
    fetchReminderRules,
    createReminderRule,
    updateReminderRule,
    deleteReminderRule,
    toggleRuleStatus
  };
};
