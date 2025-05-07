
import { useState, useEffect } from 'react';
import settingsService from '@/services/settingsService';
import { useBranch } from './use-branch';

export interface MessageTemplate {
  id?: string;
  name: string;
  content: string;
  variables?: string[] | any;
  category: string;
  branch_id?: string;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
  
  // Type-specific fields
  subject?: string; // Email-specific
  dlt_template_id?: string; // SMS-specific
  header_text?: string; // WhatsApp-specific
  footer_text?: string; // WhatsApp-specific
  whatsapp_template_name?: string; // WhatsApp-specific
}

export const useMessageTemplates = (type: 'sms' | 'email' | 'whatsapp') => {
  const [templates, setTemplates] = useState<MessageTemplate[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const { currentBranch } = useBranch();

  const fetchTemplates = async () => {
    setIsLoading(true);
    try {
      const data = await settingsService.getTemplates(type, currentBranch?.id);
      setTemplates(data);
    } catch (err: any) {
      setError(err);
    } finally {
      setIsLoading(false);
    }
  };

  const saveTemplate = async (template: MessageTemplate) => {
    setIsSaving(true);
    try {
      // Ensure the branch_id is set
      const templateToSave = {
        ...template,
        branch_id: currentBranch?.id
      };
      
      const result = await settingsService.saveTemplate(type, templateToSave);
      if (result) {
        await fetchTemplates(); // Refresh the templates list
        return true;
      }
      return false;
    } catch (err: any) {
      setError(err);
      return false;
    } finally {
      setIsSaving(false);
    }
  };

  const deleteTemplate = async (templateId: string) => {
    try {
      const success = await settingsService.deleteTemplate(type, templateId);
      if (success) {
        setTemplates(templates.filter(template => template.id !== templateId));
      }
      return success;
    } catch (err: any) {
      setError(err);
      return false;
    }
  };

  useEffect(() => {
    if (currentBranch?.id) {
      fetchTemplates();
    }
  }, [currentBranch?.id, type]);

  return {
    templates,
    isLoading,
    error,
    isSaving,
    fetchTemplates,
    saveTemplate,
    deleteTemplate,
  };
};
