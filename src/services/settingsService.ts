import { AutomationRule } from '@/types/crm';
import { supabase } from '@/integrations/supabase/client';

// Add the automation rules related methods
export const getAutomationRules = async (branchId?: string) => {
  try {
    let query = supabase.from('automation_rules').select('*');
    if (branchId) {
      query = query.eq('branch_id', branchId);
    }
    const { data, error } = await query.order('created_at', { ascending: false });
    return { data, error };
  } catch (error) {
    console.error('Error fetching automation rules:', error);
    return { data: null, error };
  }
};

export const saveAutomationRule = async (rule: Partial<AutomationRule>) => {
  try {
    if (rule.id) {
      // Update existing rule
      const { data, error } = await supabase
        .from('automation_rules')
        .update({
          name: rule.name,
          description: rule.description,
          trigger_type: rule.trigger_type,
          trigger_value: rule.trigger_value,
          trigger_condition: rule.trigger_condition,
          actions: rule.actions,
          is_active: rule.is_active,
          updated_at: new Date().toISOString()
        })
        .eq('id', rule.id);
      return { success: !error, data, error };
    } else {
      // Create new rule
      const { data, error } = await supabase
        .from('automation_rules')
        .insert({
          ...rule,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        });
      return { success: !error, data, error };
    }
  } catch (error) {
    console.error('Error saving automation rule:', error);
    return { success: false, error };
  }
};

export const deleteAutomationRule = async (ruleId: string) => {
  try {
    const { error } = await supabase
      .from('automation_rules')
      .delete()
      .eq('id', ruleId);
    return { success: !error, error };
  } catch (error) {
    console.error('Error deleting automation rule:', error);
    return { success: false, error };
  }
};
