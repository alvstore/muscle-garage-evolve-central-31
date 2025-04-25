
import { useState, useCallback, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { ReminderRule, ReminderTriggerType, NotificationChannel } from '@/types/notification';

export const useReminderRules = () => {
  const [reminderRules, setReminderRules] = useState<ReminderRule[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchReminderRules = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase.from('reminder_rules').select('*');
      
      if (error) {
        throw error;
      }
      
      if (data) {
        const formattedRules: ReminderRule[] = data.map(rule => ({
          id: rule.id,
          title: rule.title,
          description: rule.description || '',
          triggerType: rule.trigger_type as ReminderTriggerType,
          triggerValue: rule.trigger_value,
          notificationChannel: rule.notification_channel as NotificationChannel,
          conditions: rule.conditions,
          isActive: rule.is_active,
          createdAt: rule.created_at,
          updatedAt: rule.updated_at,
          message: rule.message,
          sendVia: rule.send_via || [],
          targetRoles: rule.target_roles || []
        }));
        
        setReminderRules(formattedRules);
      }
    } catch (err: any) {
      console.error('Error fetching reminder rules:', err);
      setError(err);
      toast.error('Failed to fetch reminder rules');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createReminderRule = async (rule: Omit<ReminderRule, 'id' | 'createdAt' | 'updatedAt'>) => {
    setIsLoading(true);
    try {
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
        .insert(dbRule)
        .select()
        .single();
      
      if (error) {
        throw error;
      }
      
      const newRule: ReminderRule = {
        id: data.id,
        title: data.title,
        description: data.description || '',
        triggerType: data.trigger_type as ReminderTriggerType,
        triggerValue: data.trigger_value,
        notificationChannel: data.notification_channel as NotificationChannel,
        conditions: data.conditions,
        isActive: data.is_active,
        createdAt: data.created_at,
        updatedAt: data.updated_at,
        message: data.message,
        sendVia: data.send_via || [],
        targetRoles: data.target_roles || []
      };
      
      setReminderRules(prevRules => [newRule, ...prevRules]);
      toast.success('Reminder rule created successfully');
      
      return newRule;
    } catch (err: any) {
      console.error('Error creating reminder rule:', err);
      toast.error('Failed to create reminder rule');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const updateReminderRule = async (id: string, updates: Partial<ReminderRule>) => {
    setIsLoading(true);
    try {
      const dbUpdates: Record<string, any> = {};
      
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
      
      const { data, error } = await supabase
        .from('reminder_rules')
        .update(dbUpdates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) {
        throw error;
      }
      
      const updatedRule: ReminderRule = {
        id: data.id,
        title: data.title,
        description: data.description || '',
        triggerType: data.trigger_type as ReminderTriggerType,
        triggerValue: data.trigger_value,
        notificationChannel: data.notification_channel as NotificationChannel,
        conditions: data.conditions,
        isActive: data.is_active,
        createdAt: data.created_at,
        updatedAt: data.updated_at,
        message: data.message,
        sendVia: data.send_via || [],
        targetRoles: data.target_roles || []
      };
      
      setReminderRules(prevRules => 
        prevRules.map(rule => rule.id === id ? updatedRule : rule)
      );
      toast.success('Reminder rule updated successfully');
      
      return updatedRule;
    } catch (err: any) {
      console.error('Error updating reminder rule:', err);
      toast.error('Failed to update reminder rule');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteReminderRule = async (id: string) => {
    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('reminder_rules')
        .delete()
        .eq('id', id);
      
      if (error) {
        throw error;
      }
      
      setReminderRules(prevRules => 
        prevRules.filter(rule => rule.id !== id)
      );
      toast.success('Reminder rule deleted successfully');
    } catch (err: any) {
      console.error('Error deleting reminder rule:', err);
      toast.error('Failed to delete reminder rule');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const toggleReminderRuleStatus = async (id: string, isActive: boolean) => {
    return updateReminderRule(id, { isActive });
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
    toggleReminderRuleStatus
  };
};
