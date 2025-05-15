
import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { leadService } from '@/services/leadService';
import { useBranch } from '@/hooks/use-branch';
import { Lead } from '@/types/crm';
import { Skeleton } from '@/components/ui/skeleton';

export const LeadsList: React.FC = () => {
  const { currentBranch } = useBranch();
  const [leads, setLeads] = useState<Lead[]>([]);

  // Fetch leads data
  const { data: leadsData, isLoading } = useQuery({
    queryKey: ['leads', currentBranch?.id],
    queryFn: () => leadService.getLeads(currentBranch?.id),
    enabled: !!currentBranch?.id,
  });

  useEffect(() => {
    if (leadsData) {
      setLeads(leadsData);
    }
  }, [leadsData]);

  if (isLoading) {
    return (
      <div className="space-y-3">
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-full" />
      </div>
    );
  }

  if (!leads || leads.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">No leads found. Create your first lead to get started.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b">
            <th className="text-left py-3 px-2">Name</th>
            <th className="text-left py-3 px-2">Email</th>
            <th className="text-left py-3 px-2">Phone</th>
            <th className="text-left py-3 px-2">Status</th>
            <th className="text-left py-3 px-2">Source</th>
            <th className="text-left py-3 px-2">Stage</th>
          </tr>
        </thead>
        <tbody>
          {leads.map((lead) => (
            <tr key={lead.id} className="border-b hover:bg-muted/50">
              <td className="py-3 px-2">{lead.name}</td>
              <td className="py-3 px-2">{lead.email || '-'}</td>
              <td className="py-3 px-2">{lead.phone || '-'}</td>
              <td className="py-3 px-2">{lead.status}</td>
              <td className="py-3 px-2">{lead.source}</td>
              <td className="py-3 px-2">{lead.funnel_stage.replace('_', ' ')}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
