
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useBranch } from './use-branches';
import { toast } from 'sonner';

export interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  content: string;
  category: string;
  variables?: Record<string, string>;
  branch_id?: string;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface SmsTemplate {
  id: string;
  name: string;
  content: string;
  category: string;
  dlt_template_id?: string;
  variables?: Record<string, string>;
  branch_id?: string;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

export const useMessageTemplates = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  const { currentBranch } = useBranch();

  const fetchEmailTemplates = async () => {
    setIsLoading(true);
    setError(null);

    try {
      let query = supabase.from('email_templates').select('*');

      if (currentBranch?.id) {
        query = query.or(`branch_id.is.null,branch_id.eq.${currentBranch.id}`);
      }

      const { data: templates, error: fetchError } = await query;

      if (fetchError) throw fetchError;

      return templates || [];
    } catch (err: any) {
      setError(err);
      console.error('Error fetching email templates:', err);
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  const fetchSmsTemplates = async () => {
    setIsLoading(true);
    setError(null);

    try {
      let query = supabase.from('sms_templates').select('*');

      if (currentBranch?.id) {
        query = query.or(`branch_id.is.null,branch_id.eq.${currentBranch.id}`);
      }

      const { data: templates, error: fetchError } = await query;

      if (fetchError) throw fetchError;

      return templates || [];
    } catch (err: any) {
      setError(err);
      console.error('Error fetching SMS templates:', err);
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  const saveEmailTemplate = async (template: Partial<EmailTemplate>) => {
    setIsLoading(true);
    setError(null);

    try {
      const { id, ...templateData } = template;
      let result;

      if (id) {
        // Update
        const { data, error: updateError } = await supabase
          .from('email_templates')
          .update({ 
            ...templateData, 
            branch_id: templateData.branch_id || currentBranch?.id || null,
            updated_at: new Date().toISOString()
          })
          .eq('id', id)
          .select()
          .single();

        if (updateError) throw updateError;
        result = data;
        toast.success('Email template updated successfully');
      } else {
        // Insert
        const { data, error: insertError } = await supabase
          .from('email_templates')
          .insert([{ 
            ...templateData, 
            branch_id: templateData.branch_id || currentBranch?.id || null 
          }])
          .select()
          .single();

        if (insertError) throw insertError;
        result = data;
        toast.success('Email template created successfully');
      }

      return result;
    } catch (err: any) {
      setError(err);
      console.error('Error saving email template:', err);
      toast.error(`Failed to save email template: ${err.message}`);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const saveSmsTemplate = async (template: Partial<SmsTemplate>) => {
    setIsLoading(true);
    setError(null);

    try {
      const { id, ...templateData } = template;
      let result;

      if (id) {
        // Update
        const { data, error: updateError } = await supabase
          .from('sms_templates')
          .update({ 
            ...templateData, 
            branch_id: templateData.branch_id || currentBranch?.id || null,
            updated_at: new Date().toISOString()
          })
          .eq('id', id)
          .select()
          .single();

        if (updateError) throw updateError;
        result = data;
        toast.success('SMS template updated successfully');
      } else {
        // Insert
        const { data, error: insertError } = await supabase
          .from('sms_templates')
          .insert([{ 
            ...templateData, 
            branch_id: templateData.branch_id || currentBranch?.id || null 
          }])
          .select()
          .single();

        if (insertError) throw insertError;
        result = data;
        toast.success('SMS template created successfully');
      }

      return result;
    } catch (err: any) {
      setError(err);
      console.error('Error saving SMS template:', err);
      toast.error(`Failed to save SMS template: ${err.message}`);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteEmailTemplate = async (id: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const { error: deleteError } = await supabase
        .from('email_templates')
        .delete()
        .eq('id', id);

      if (deleteError) throw deleteError;
      toast.success('Email template deleted successfully');
      return true;
    } catch (err: any) {
      setError(err);
      console.error('Error deleting email template:', err);
      toast.error(`Failed to delete email template: ${err.message}`);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteSmsTemplate = async (id: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const { error: deleteError } = await supabase
        .from('sms_templates')
        .delete()
        .eq('id', id);

      if (deleteError) throw deleteError;
      toast.success('SMS template deleted successfully');
      return true;
    } catch (err: any) {
      setError(err);
      console.error('Error deleting SMS template:', err);
      toast.error(`Failed to delete SMS template: ${err.message}`);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    fetchEmailTemplates,
    fetchSmsTemplates,
    saveEmailTemplate,
    saveSmsTemplate,
    deleteEmailTemplate,
    deleteSmsTemplate,
    isLoading,
    error
  };
};
