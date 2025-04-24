
import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { ReminderRule } from '@/types/notification';
import { toast } from 'sonner';

export const useReminderRules = () => {
  const [rules, setRules] = useState<ReminderRule[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchRules = useCallback(async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('reminder_rules')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      const formattedRules: ReminderRule[] = data.map(rule => ({
        id: rule.id,
        title: rule.title,
        description: rule.description || '',
        triggerType: rule.trigger_type as ReminderTriggerType,
        triggerValue: rule.trigger_value,
        notificationChannel: rule.notification_channel as NotificationChannel,
        conditions: rule.conditions as Record<string, any>,
        isActive: rule.is_active,
        createdAt: rule.created_at,
        updatedAt: rule.updated_at,
        message: rule.message || '',
        sendVia: rule.send_via || [],
        targetRoles: rule.target_roles || []
      }));

      setRules(formattedRules);
    } catch (error) {
      console.error('Error fetching reminder rules:', error);
      toast.error('Failed to fetch reminder rules');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createRule = async (rule: Omit<ReminderRule, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const { data, error } = await supabase
        .from('reminder_rules')
        .insert({
          title: rule.title,
          description: rule.description,
          trigger_type: rule.triggerType,
          trigger_value: rule.triggerValue,
          notification_channel: rule.notificationChannel,
          conditions: rule.conditions,
          is_active: rule.isActive,
          message: rule.message,
          send_via: rule.sendVia,
          target_roles: rule.targetRoles
        })
        .select();

      if (error) throw error;
      
      const newRule: ReminderRule = {
        id: data[0].id,
        title: data[0].title,
        description: data[0].description || '',
        triggerType: data[0].trigger_type,
        triggerValue: data[0].trigger_value,
        notificationChannel: data[0].notification_channel,
        conditions: data[0].conditions,
        isActive: data[0].is_active,
        createdAt: data[0].created_at,
        updatedAt: data[0].updated_at,
        message: data[0].message || '',
        sendVia: data[0].send_via || [],
        targetRoles: data[0].target_roles || []
      };
      
      setRules([newRule, ...rules]);
      toast.success('Reminder rule created successfully');
      return true;
    } catch (error) {
      console.error('Error creating reminder rule:', error);
      toast.error('Failed to create reminder rule');
      return false;
    }
  };

  const updateRule = async (id: string, updates: Partial<Omit<ReminderRule, 'id' | 'createdAt' | 'updatedAt'>>) => {
    try {
      const dbUpdates: any = {};
      
      if (updates.title !== undefined) dbUpdates.title = updates.title;
      if (updates.description !== undefined) dbUpdates.description = updates.description;
      if (updates.triggerType !== undefined) dbUpdates.trigger_type = updates.triggerType;
      if (updates.triggerValue !== undefined) dbUpdates.trigger_value = updates.triggerValue;
      if (updates.notificationChannel !== undefined) dbUpdates.notification_channel = updates.notificationChannel;
      if (updates.conditions !== undefined) dbUpdates.conditions = updates.conditions;
      if (updates.isActive !== undefined) dbUpdates.is_active = updates.isActive;
      if (updates.message !== undefined) dbUpdates.message = updates.message;
      if (updates.sendVia !== undefined) dbUpdates.send_via = updates.sendVia;
      if (updates.targetRoles !== undefined) dbUpdates.target_roles = updates.targetRoles;

      const { error } = await supabase
        .from('reminder_rules')
        .update(dbUpdates)
        .eq('id', id);

      if (error) throw error;
      
      setRules(rules.map(rule => 
        rule.id === id ? { ...rule, ...updates } : rule
      ));
      
      toast.success('Reminder rule updated successfully');
      return true;
    } catch (error) {
      console.error('Error updating reminder rule:', error);
      toast.error('Failed to update reminder rule');
      return false;
    }
  };

  const deleteRule = async (id: string) => {
    try {
      const { error } = await supabase
        .from('reminder_rules')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      setRules(rules.filter(rule => rule.id !== id));
      toast.success('Reminder rule deleted successfully');
      return true;
    } catch (error) {
      console.error('Error deleting reminder rule:', error);
      toast.error('Failed to delete reminder rule');
      return false;
    }
  };

  const toggleRuleStatus = async (id: string, isActive: boolean) => {
    return updateRule(id, { isActive });
  };

  return {
    rules,
    isLoading,
    fetchRules,
    createRule,
    updateRule,
    deleteRule,
    toggleRuleStatus
  };
};
