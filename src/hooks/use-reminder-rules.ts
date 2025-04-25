
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useBranch } from './use-branch';
import { toast } from 'sonner';
import { ReminderRule, ReminderTriggerType, NotificationChannel, adaptReminderRuleFromDB } from '@/types/notification';

export const useReminderRules = () => {
  const [reminderRules, setReminderRules] = useState<ReminderRule[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { currentBranch } = useBranch();

  const fetchReminderRules = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const { data, error } = await supabase
        .from('reminder_rules')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        throw error;
      }
      
      if (data) {
        const rules: ReminderRule[] = data.map(rule => adaptReminderRuleFromDB(rule));
        setReminderRules(rules);
      }
    } catch (err: any) {
      console.error('Error fetching reminder rules:', err);
      setError(err);
      toast.error('Failed to load reminder rules');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createReminderRule = async (rule: Omit<ReminderRule, 'id' | 'createdAt' | 'updatedAt'>): Promise<ReminderRule | null> => {
    try {
      const { data, error } = await supabase
        .from('reminder_rules')
        .insert({
          title: rule.title,
          description: rule.description,
          trigger_type: rule.triggerType,
          trigger_value: rule.triggerValue,
          notification_channel: rule.notificationChannel,
          send_via: rule.sendVia,
          target_roles: rule.targetRoles,
          message: rule.message,
          conditions: rule.conditions,
          is_active: rule.isActive
        })
        .select()
        .single();
      
      if (error) {
        throw error;
      }
      
      const newRule = adaptReminderRuleFromDB(data);
      setReminderRules(prev => [newRule, ...prev]);
      toast.success('Reminder rule created successfully');
      return newRule;
    } catch (err: any) {
      console.error('Error creating reminder rule:', err);
      toast.error('Failed to create reminder rule');
      return null;
    }
  };

  const updateReminderRule = async (id: string, updates: Partial<ReminderRule>): Promise<boolean> => {
    try {
      // Convert camelCase to snake_case for DB
      const dbUpdates: any = {};
      
      if (updates.title) dbUpdates.title = updates.title;
      if (updates.description !== undefined) dbUpdates.description = updates.description;
      if (updates.triggerType) dbUpdates.trigger_type = updates.triggerType;
      if (updates.triggerValue !== undefined) dbUpdates.trigger_value = updates.triggerValue;
      if (updates.notificationChannel) dbUpdates.notification_channel = updates.notificationChannel;
      if (updates.sendVia) dbUpdates.send_via = updates.sendVia;
      if (updates.targetRoles) dbUpdates.target_roles = updates.targetRoles;
      if (updates.message !== undefined) dbUpdates.message = updates.message;
      if (updates.conditions) dbUpdates.conditions = updates.conditions;
      if (updates.isActive !== undefined) dbUpdates.is_active = updates.isActive;
      
      const { error } = await supabase
        .from('reminder_rules')
        .update(dbUpdates)
        .eq('id', id);
      
      if (error) {
        throw error;
      }
      
      // Update the local state
      setReminderRules(prev => 
        prev.map(rule => 
          rule.id === id 
            ? { ...rule, ...updates, updatedAt: new Date().toISOString() } 
            : rule
        )
      );
      
      toast.success('Reminder rule updated successfully');
      return true;
    } catch (err: any) {
      console.error('Error updating reminder rule:', err);
      toast.error('Failed to update reminder rule');
      return false;
    }
  };

  const deleteReminderRule = async (id: string): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('reminder_rules')
        .delete()
        .eq('id', id);
      
      if (error) {
        throw error;
      }
      
      setReminderRules(prev => prev.filter(rule => rule.id !== id));
      toast.success('Reminder rule deleted successfully');
      return true;
    } catch (err: any) {
      console.error('Error deleting reminder rule:', err);
      toast.error('Failed to delete reminder rule');
      return false;
    }
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
    deleteReminderRule
  };
};
