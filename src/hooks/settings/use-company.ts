
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface CompanySettings {
  id?: string;
  gym_name?: string;
  contact_email?: string;
  contact_phone?: string;
  business_hours_start?: string;
  business_hours_end?: string;
  currency?: string;
  currency_symbol?: string;
  tax_rate?: number;
  attendance_settings?: {
    hikvision_enabled?: boolean;
    device_config?: any;
    last_sync?: string | null;
    sync_status?: 'success' | 'failed' | null;
  };
}

export const useCompany = () => {
  const [company, setCompany] = useState<CompanySettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCompany = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('company_settings')
        .select('*')
        .single();

      if (error) throw error;
      setCompany(data);
    } catch (err: any) {
      console.error('Error fetching company settings:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const updateCompany = async (updates: Partial<CompanySettings>) => {
    try {
      if (!company?.id) {
        // Create if doesn't exist
        const { data, error } = await supabase
          .from('company_settings')
          .insert(updates)
          .select()
          .single();

        if (error) throw error;
        setCompany(data);
        return data;
      } else {
        // Update if exists
        const { data, error } = await supabase
          .from('company_settings')
          .update(updates)
          .eq('id', company.id)
          .select()
          .single();

        if (error) throw error;
        setCompany(data);
        return data;
      }
    } catch (err: any) {
      console.error('Error updating company settings:', err);
      throw err;
    }
  };

  useEffect(() => {
    fetchCompany();
  }, []);

  return {
    company,
    loading,
    error,
    fetchCompany,
    updateCompany
  };
};
