
import { useState } from 'react';
import { Lead } from '@/types/crm';
import { crmService } from '@/services/crmService';
import { useBranch } from '@/hooks/use-branch';

export const useLeads = () => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const { currentBranch } = useBranch();

  const fetchLeads = async () => {
    setIsLoading(true);
    setError('');
    try {
      const fetchedLeads = await crmService.getLeads(currentBranch?.id);
      setLeads(fetchedLeads);
      return { data: fetchedLeads, error: null };
    } catch (err: any) {
      setError(err.message || 'Failed to fetch leads');
      return { data: null, error: err };
    } finally {
      setIsLoading(false);
    }
  };

  const addLead = async (lead: Omit<Lead, 'id' | 'created_at' | 'updated_at'>) => {
    setIsLoading(true);
    try {
      const leadWithBranchId = {
        ...lead,
        branch_id: currentBranch?.id || ''
      };
      const newLead = await crmService.createLead(leadWithBranchId);
      if (newLead) {
        setLeads(prev => [newLead, ...prev]);
      }
      return newLead;
    } catch (err: any) {
      setError(err.message || 'Failed to add lead');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const updateLead = async (id: string, updates: Partial<Lead>) => {
    setIsLoading(true);
    try {
      const updatedLead = await crmService.updateLead(id, updates);
      if (updatedLead) {
        setLeads(prev => prev.map(lead => lead.id === id ? updatedLead : lead));
      }
      return updatedLead;
    } catch (err: any) {
      setError(err.message || 'Failed to update lead');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteLead = async (id: string) => {
    setIsLoading(true);
    try {
      const success = await crmService.deleteLead(id);
      if (success) {
        setLeads(prev => prev.filter(lead => lead.id !== id));
      }
      return success;
    } catch (err: any) {
      setError(err.message || 'Failed to delete lead');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    leads,
    isLoading,
    error,
    fetchLeads,
    addLead,
    updateLead,
    deleteLead
  };
};
