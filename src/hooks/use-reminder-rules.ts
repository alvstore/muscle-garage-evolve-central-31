
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/services/supabaseClient';
import { ReminderRule } from '@/types/notification';
import { toast } from 'sonner';

export const useReminderRules = (branchId?: string) => {
  const [rules, setRules] = useState<ReminderRule[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchRules = useCallback(async () => {
    try {
      setIsLoading(true);
      const query = supabase.from('reminder_rules').select('*');
      
      if (branchId) {
        query.eq('branch_id', branchId);
      }
      
      const { data, error } = await query.order('created_at', { ascending: false });
      
      if (error) throw error;
      
      // Transform DB fields to match our frontend types
      const transformedRules: ReminderRule[] = (data || []).map(rule => ({
        id: rule.id,
        title: rule.title,
        description: rule.description || '',
        triggerType: rule.trigger_type,
        triggerValue: rule.trigger_value,
        notificationChannel: rule.notification_channel,
        conditions: rule.conditions || {},
        isActive: rule.is_active,
        createdAt: rule.created_at,
        updatedAt: rule.updated_at,
        message: rule.message,
        sendVia: rule.send_via || [],
        targetRoles: rule.target_roles || [],
      }));
      
      setRules(transformedRules);
    } catch (error) {
      console.error('Error fetching reminder rules:', error);
      toast.error('Failed to load reminder rules');
    } finally {
      setIsLoading(false);
    }
  }, [branchId]);

  const createRule = async (rule: Omit<ReminderRule, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      // Transform frontend data to match DB schema
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
        target_roles: rule.targetRoles,
        branch_id: branchId
      };
      
      const { error } = await supabase.from('reminder_rules').insert([dbRule]);
      
      if (error) throw error;
      
      toast.success('Reminder rule created successfully');
      await fetchRules();
      return true;
    } catch (error) {
      console.error('Error creating reminder rule:', error);
      toast.error('Failed to create reminder rule');
      return false;
    }
  };

  const updateRule = async (id: string, updates: Partial<Omit<ReminderRule, 'id' | 'createdAt' | 'updatedAt'>>) => {
    try {
      // Transform frontend data to match DB schema
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
      
      toast.success('Reminder rule updated successfully');
      await fetchRules();
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
      
      toast.success('Reminder rule deleted successfully');
      await fetchRules();
      return true;
    } catch (error) {
      console.error('Error deleting reminder rule:', error);
      toast.error('Failed to delete reminder rule');
      return false;
    }
  };

  useEffect(() => {
    fetchRules();
  }, [fetchRules]);

  return {
    rules,
    isLoading,
    fetchRules,
    createRule,
    updateRule,
    deleteRule,
  };
};
