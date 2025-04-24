
import { useState, useCallback } from 'react';
import { supabase } from '@/services/supabaseClient';
import { toast } from 'sonner';
import { ReminderRule } from '@/types/notification';

export function useReminderRules() {
  const [isLoading, setIsLoading] = useState(false);
  const [rules, setRules] = useState<ReminderRule[]>([]);

  const fetchRules = useCallback(async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('reminder_rules')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Map from database format to our app format
      const formattedRules: ReminderRule[] = data.map(rule => ({
        id: rule.id,
        title: rule.title,
        description: rule.description || '',
        triggerType: rule.trigger_type as ReminderTriggerType,
        triggerValue: rule.trigger_value || undefined,
        notificationChannel: rule.notification_channel as NotificationChannel,
        conditions: rule.conditions as Record<string, any>,
        isActive: rule.is_active,
        createdAt: rule.created_at,
        updatedAt: rule.updated_at,
        message: rule.message || undefined,
        sendVia: rule.send_via || [],
        targetRoles: rule.target_roles || []
      }));

      setRules(formattedRules);
    } catch (error: any) {
      console.error('Error fetching reminder rules:', error);
      toast.error('Failed to load reminder rules');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createRule = async (rule: Omit<ReminderRule, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      setIsLoading(true);
      
      // Convert from app format to database format
      const dbRule = {
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
      };
      
      const { data, error } = await supabase
        .from('reminder_rules')
        .insert([dbRule])
        .select()
        .single();

      if (error) throw error;
      
      const newRule: ReminderRule = {
        id: data.id,
        title: data.title,
        description: data.description || '',
        triggerType: data.trigger_type,
        triggerValue: data.trigger_value || undefined,
        notificationChannel: data.notification_channel,
        conditions: data.conditions,
        isActive: data.is_active,
        createdAt: data.created_at,
        updatedAt: data.updated_at,
        message: data.message || undefined,
        sendVia: data.send_via || [],
        targetRoles: data.target_roles || []
      };
      
      setRules(prev => [newRule, ...prev]);
      toast.success('Reminder rule created successfully');
      return newRule;
    } catch (error: any) {
      console.error('Error creating reminder rule:', error);
      toast.error('Failed to create reminder rule');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const updateRule = async (id: string, updates: Partial<Omit<ReminderRule, 'id' | 'createdAt' | 'updatedAt'>>) => {
    try {
      setIsLoading(true);
      
      // Convert from app format to database format
      const dbUpdates: Record<string, any> = {};
      
      if ('title' in updates) dbUpdates.title = updates.title;
      if ('description' in updates) dbUpdates.description = updates.description;
      if ('triggerType' in updates) dbUpdates.trigger_type = updates.triggerType;
      if ('triggerValue' in updates) dbUpdates.trigger_value = updates.triggerValue;
      if ('notificationChannel' in updates) dbUpdates.notification_channel = updates.notificationChannel;
      if ('conditions' in updates) dbUpdates.conditions = updates.conditions;
      if ('isActive' in updates) dbUpdates.is_active = updates.isActive;
      if ('message' in updates) dbUpdates.message = updates.message;
      if ('sendVia' in updates) dbUpdates.send_via = updates.sendVia;
      if ('targetRoles' in updates) dbUpdates.target_roles = updates.targetRoles;
      
      const { data, error } = await supabase
        .from('reminder_rules')
        .update(dbUpdates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      
      const updatedRule: ReminderRule = {
        id: data.id,
        title: data.title,
        description: data.description || '',
        triggerType: data.trigger_type,
        triggerValue: data.trigger_value || undefined,
        notificationChannel: data.notification_channel,
        conditions: data.conditions,
        isActive: data.is_active,
        createdAt: data.created_at,
        updatedAt: data.updated_at,
        message: data.message || undefined,
        sendVia: data.send_via || [],
        targetRoles: data.target_roles || []
      };
      
      setRules(prev => prev.map(rule => rule.id === id ? updatedRule : rule));
      toast.success('Reminder rule updated successfully');
      return true;
    } catch (error: any) {
      console.error('Error updating reminder rule:', error);
      toast.error('Failed to update reminder rule');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteRule = async (id: string) => {
    try {
      setIsLoading(true);
      
      const { error } = await supabase
        .from('reminder_rules')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      setRules(prev => prev.filter(rule => rule.id !== id));
      toast.success('Reminder rule deleted successfully');
      return true;
    } catch (error: any) {
      console.error('Error deleting reminder rule:', error);
      toast.error('Failed to delete reminder rule');
      return false;
    } finally {
      setIsLoading(false);
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
}
