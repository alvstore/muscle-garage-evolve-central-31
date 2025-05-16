
import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { leadService } from '@/services/leadService';
import { useBranch } from '@/hooks/use-branch';
import { Lead } from '@/types/crm';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { PlusCircle, Edit, Trash2 } from 'lucide-react';

interface LeadsListProps {
  onEdit?: (lead: Lead) => void;
  onAddNew?: () => void;
}

const LeadsList: React.FC<LeadsListProps> = ({ onEdit, onAddNew }) => {
  const { currentBranch } = useBranch();
  const [leads, setLeads] = useState<Lead[]>([]);

  // Fetch leads data
  const { data: leadsData, isLoading, refetch } = useQuery({
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

  return (
    <div>
      <div className="mb-4 flex justify-end">
        {onAddNew && (
          <Button onClick={onAddNew} size="sm">
            <PlusCircle className="mr-2 h-4 w-4" />
            Add New Lead
          </Button>
        )}
      </div>
      
      {!leads || leads.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-muted-foreground">No leads found. Create your first lead to get started.</p>
        </div>
      ) : (
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
                {onEdit && <th className="text-left py-3 px-2">Actions</th>}
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
                  <td className="py-3 px-2">{lead.funnel_stage?.replace('_', ' ')}</td>
                  {onEdit && (
                    <td className="py-3 px-2">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => onEdit(lead)}
                        className="h-8 w-8 p-0 mr-1"
                      >
                        <Edit className="h-4 w-4" />
                        <span className="sr-only">Edit</span>
                      </Button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default LeadsList;
