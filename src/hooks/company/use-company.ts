
// Company/branch management hook
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface Company {
  id: string;
  name: string;
  logo?: string;
  address?: string;
  phone?: string;
  email?: string;
  website?: string;
  branches: Branch[];
}

export interface Branch {
  id: string;
  name: string;
  company_id: string;
  address?: string;
  phone?: string;
  email?: string;
  is_active: boolean;
}

export const useCompany = () => {
  const [company, setCompany] = useState<Company | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchCompany();
  }, []);

  const fetchCompany = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Fetch company and branches data
      const { data: branches, error: branchError } = await supabase
        .from('branches')
        .select('*')
        .eq('is_active', true);

      if (branchError) throw branchError;

      // Mock company data since we don't have a companies table
      const mockCompany: Company = {
        id: '1',
        name: 'Muscle Garage',
        email: 'info@musclegarage.com',
        branches: branches || []
      };

      setCompany(mockCompany);
    } catch (err) {
      console.error('Error fetching company:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setIsLoading(false);
    }
  };

  return {
    company,
    isLoading,
    error,
    refetch: fetchCompany
  };
};
