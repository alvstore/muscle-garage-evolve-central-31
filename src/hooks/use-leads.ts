
import { useState, useEffect } from 'react';
import { useBranch } from './use-branch';
import { Lead } from '@/types/crm';
import leadService from '@/services/leadService';

export const useLeads = () => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { currentBranch } = useBranch();

  const fetchLeads = async () => {
    if (!currentBranch?.id) {
      setLeads([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const data = await leadService.getLeads(currentBranch.id);
      setLeads(data);
    } catch (err) {
      console.error('Error fetching leads:', err);
      setError('Failed to load leads');
    } finally {
      setIsLoading(false);
    }
  };

  const addLead = async (lead: Omit<Lead, 'id' | 'created_at' | 'updated_at'>) => {
    if (!currentBranch?.id) {
      throw new Error('No branch selected');
    }
    
    const leadWithBranch = {
      ...lead,
      branch_id: currentBranch.id
    };
    
    const newLead = await leadService.createLead(leadWithBranch);
    if (newLead) {
      setLeads(prev => [newLead, ...prev]);
    }
    return newLead;
  };

  const updateLead = async (id: string, updates: Partial<Lead>) => {
    const updatedLead = await leadService.updateLead(id, updates);
    if (updatedLead) {
      setLeads(prev => prev.map(lead => lead.id === id ? updatedLead : lead));
    }
    return updatedLead;
  };

  const deleteLead = async (id: string) => {
    const success = await leadService.deleteLead(id);
    if (success) {
      setLeads(prev => prev.filter(lead => lead.id !== id));
    }
    return success;
  };

  useEffect(() => {
    fetchLeads();
  }, [currentBranch?.id]);

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
