import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useBranch } from '@/hooks/use-branch';
import { leadService } from '@/services/leadService';
import { Lead } from '@/types/crm';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { 
  AlertCircle, 
  Check,
  Filter, 
  Plus, 
  Trash, 
  Edit,
  Phone,
  MoreHorizontal
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Skeleton } from '@/components/ui/skeleton';
import LeadDialog from './LeadDialog';
import LeadFilterDialog from './LeadFilterDialog';

export interface LeadsListProps {
  onSelectLead?: (lead: Lead) => void;
  showFilters?: boolean;
  maxItems?: number;
  showAddButton?: boolean;
}

export const LeadsList: React.FC<LeadsListProps> = ({
  onSelectLead,
  showFilters = true,
  maxItems,
  showAddButton = true,
}) => {
  const { currentBranch } = useBranch();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddLeadOpen, setIsAddLeadOpen] = useState(false);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filters, setFilters] = useState<any>({});

  // Fetch leads from API using React Query
  const { data: leadsData, isLoading, refetch } = useQuery({
    queryKey: ['leads', currentBranch?.id],
    queryFn: () => leadService.getLeads(currentBranch?.id),
    enabled: !!currentBranch?.id,
  });

  useEffect(() => {
    if (leadsData) {
      // Handle different response formats
      if (Array.isArray(leadsData)) {
        setLeads(leadsData);
      } else if (leadsData.data && Array.isArray(leadsData.data)) {
        setLeads(leadsData.data);
      }
    }
  }, [leadsData]);

  // Filter leads based on search term and filters
  const filteredLeads = React.useMemo(() => {
    return leads
      .filter(lead => {
        // Search filter
        if (searchTerm) {
          const searchLower = searchTerm.toLowerCase();
          return (
            lead.name?.toLowerCase().includes(searchLower) ||
            lead.email?.toLowerCase().includes(searchLower) ||
            lead.phone?.toLowerCase().includes(searchLower)
          );
        }
        return true;
      })
      .filter(lead => {
        // Apply filters
        if (filters.status && lead.status !== filters.status) return false;
        if (filters.source && lead.source !== filters.source) return false;
        if (filters.funnelStage && lead.funnel_stage !== filters.funnelStage) return false;
        return true;
      });
  }, [leads, searchTerm, filters]);

  // Lead display data with pagination if needed
  const displayLeads = maxItems ? filteredLeads.slice(0, maxItems) : filteredLeads;

  const handleDeleteLead = async (id: string) => {
    if (confirm('Are you sure you want to delete this lead?')) {
      try {
        const success = await leadService.deleteLead(id);
        if (success) {
          setLeads(prevLeads => prevLeads.filter(lead => lead.id !== id));
          toast.success('Lead deleted successfully');
        }
      } catch (error) {
        console.error('Error deleting lead:', error);
        toast.error('Failed to delete lead');
      }
    }
  };

  const handleEditLead = (lead: Lead) => {
    setSelectedLead(lead);
    setIsAddLeadOpen(true);
  };

  const handleLeadSave = (lead: Lead) => {
    if (selectedLead) {
      // Update existing lead
      setLeads(prevLeads => prevLeads.map(l => l.id === lead.id ? lead : l));
    } else {
      // Add new lead
      setLeads(prevLeads => [lead, ...prevLeads]);
    }
    setIsAddLeadOpen(false);
    setSelectedLead(null);
  };

  return (
    <div className="space-y-4">
      {/* Search and Filter Bar */}
      {showFilters && (
        <div className="flex flex-col sm:flex-row gap-2 justify-between">
          <div className="relative w-full sm:w-auto">
            <Input
              type="text"
              placeholder="Search leads..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full sm:w-[300px]"
            />
          </div>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setIsFilterOpen(true)}
            >
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
            {showAddButton && (
              <Button
                size="sm"
                onClick={() => {
                  setSelectedLead(null);
                  setIsAddLeadOpen(true);
                }}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Lead
              </Button>
            )}
          </div>
        </div>
      )}

      {/* Leads Table */}
      {isLoading ? (
        <div className="space-y-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center gap-4 p-4 border rounded-md">
              <Skeleton className="h-10 w-10 rounded-full" />
              <div className="space-y-2 flex-1">
                <Skeleton className="h-4 w-1/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
              <Skeleton className="h-8 w-16" />
            </div>
          ))}
        </div>
      ) : displayLeads.length === 0 ? (
        <div className="text-center py-10 border rounded-md">
          <AlertCircle className="h-8 w-8 mx-auto text-muted-foreground" />
          <h3 className="mt-2 text-lg font-medium">No leads found</h3>
          <p className="text-sm text-muted-foreground">
            {searchTerm || Object.keys(filters).length 
              ? 'Try adjusting your search or filters'
              : 'Start by adding a new lead'}
          </p>
          {showAddButton && (
            <Button 
              className="mt-4" 
              variant="outline" 
              onClick={() => {
                setSelectedLead(null);
                setIsAddLeadOpen(true);
              }}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add New Lead
            </Button>
          )}
        </div>
      ) : (
        <div className="border rounded-md overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Source</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Stage</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {displayLeads.map((lead) => (
                <TableRow key={lead.id}>
                  <TableCell className="font-medium">
                    <div 
                      className="cursor-pointer hover:underline"
                      onClick={() => onSelectLead ? onSelectLead(lead) : handleEditLead(lead)}
                    >
                      {lead.name}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      {lead.email && <span className="text-xs">{lead.email}</span>}
                      {lead.phone && <span className="text-xs">{lead.phone}</span>}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      {lead.source?.replace('_', ' ')}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={
                      lead.status === 'converted' ? 'success' : 
                      lead.status === 'unqualified' || lead.status === 'lost' ? 'destructive' : 
                      'secondary'
                    }>
                      {lead.status?.replace('_', ' ')}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={
                      lead.funnel_stage === 'hot' ? 'bg-orange-100 text-orange-800' : 
                      lead.funnel_stage === 'warm' ? 'bg-yellow-100 text-yellow-800' : 
                      lead.funnel_stage === 'cold' ? 'bg-blue-100 text-blue-800' : 
                      lead.funnel_stage === 'proposal' ? 'bg-purple-100 text-purple-800' : 
                      lead.funnel_stage === 'negotiation' ? 'bg-indigo-100 text-indigo-800' : 
                      lead.funnel_stage === 'closed_won' ? 'bg-green-100 text-green-800' : 
                      lead.funnel_stage === 'closed_lost' ? 'bg-red-100 text-red-800' : ''
                    }>
                      {lead.funnel_stage?.replace('_', ' ')}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleEditLead(lead)}>
                          <Edit className="h-4 w-4 mr-2" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDeleteLead(lead.id)}>
                          <Trash className="h-4 w-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Lead Dialog for adding/editing */}
      {isAddLeadOpen && (
        <LeadDialog
          open={isAddLeadOpen}
          onOpenChange={setIsAddLeadOpen}
          lead={selectedLead}
          title={selectedLead ? "Edit Lead" : "Add New Lead"}
        >
          <div className="p-4">
            {/* Lead form would go here */}
            <div className="text-center">Lead form placeholder</div>
          </div>
        </LeadDialog>
      )}
      
      {/* Filter Dialog */}
      <LeadFilterDialog
        open={isFilterOpen}
        onOpenChange={setIsFilterOpen}
        filters={filters}
        onApplyFilters={setFilters}
      />
    </div>
  );
};
