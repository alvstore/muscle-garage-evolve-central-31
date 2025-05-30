
import React, { useState, useEffect } from 'react';
import { Container } from '@/components/ui/container';
import FunnelBoard from '@/components/crm/FunnelBoard';
import { useBranch } from '@/hooks/settings/use-branches';
import { useQuery } from '@tanstack/react-query';
import { leadService } from '@/services/crm/leadService';
import { Lead } from '@/types/crm/crm';
import { Skeleton } from '@/components/ui/skeleton';

const FunnelPage = () => {
  const { currentBranch } = useBranch();
  const [leads, setLeads] = useState<Lead[]>([]);

  // Fetch leads data using React Query
  const { data: leadsData, isLoading } = useQuery({
    queryKey: ['leads', currentBranch?.id],
    queryFn: () => leadService.getLeads(currentBranch?.id),
    enabled: !!currentBranch?.id,
    refetchInterval: 30000, // Refetch every 30 seconds
  });

  // Update leads state when data changes
  useEffect(() => {
    if (leadsData) {
      setLeads(leadsData);
    }
  }, [leadsData]);

  // Define funnel stages
  const stages = [
    { id: 'cold', name: 'Cold', order: 1, color: '#3b82f6' },
    { id: 'warm', name: 'Warm', order: 2, color: '#f59e0b' },
    { id: 'hot', name: 'Hot', order: 3, color: '#ef4444' },
    { id: 'won', name: 'Won', order: 4, color: '#10b981' },
    { id: 'lost', name: 'Lost', order: 5, color: '#6b7280' },
  ];

  // Handle lead updates
  const handleUpdateLead = async (id: string, data: Partial<Lead>) => {
    try {
      await leadService.updateLead(id, data);
      // Refetch leads after update
      const updatedLeads = await leadService.getLeads(currentBranch?.id);
      setLeads(updatedLeads);
    } catch (error) {
      console.error('Error updating lead:', error);
    }
  };

  return (
    <Container>
      <div className="py-6">
        <h1 className="text-2xl font-bold mb-6">Lead Funnel System</h1>
        
        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-64 w-full" />
          </div>
        ) : (
          <FunnelBoard 
            leads={leads} 
            stages={stages}
            onUpdateLead={handleUpdateLead}
            isLoading={isLoading}
          />
        )}
      </div>
    </Container>
  );
};

export default FunnelPage;
