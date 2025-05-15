import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { leadService } from '@/services/leadService';
import { useBranch } from '@/hooks/use-branch';
import { Lead } from '@/types/crm';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { 
  MoreHorizontal, 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Phone, 
  Mail, 
  MessageSquare,
  Filter
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { format } from 'date-fns';
import { LeadDialog } from './LeadDialog';
import { LeadFilterDialog } from './LeadFilterDialog';

interface LeadsListProps {
  searchTerm?: string;
  filterOptions?: {
    status?: string[];
    source?: string[];
    funnelStage?: string[];
  };
}

const LeadsList: React.FC<LeadsListProps> = ({ 
  searchTerm = '',
  filterOptions = {
    status: [],
    source: [],
    funnelStage: []
  }
}) => {
  const { currentBranch } = useBranch();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [filteredLeads, setFilteredLeads] = useState<Lead[]>([]);
  const [searchQuery, setSearchQuery] = useState(searchTerm);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isFilterDialogOpen, setIsFilterDialogOpen] = useState(false);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [filters, setFilters] = useState(filterOptions);
  const router = useRouter();
  
  // Fetch leads using React Query
  const { data: leadsData, isLoading, error, refetch } = useQuery({
    queryKey: ['leads', currentBranch?.id],
    queryFn: () => leadService.getLeads(currentBranch?.id),
    enabled: !!currentBranch?.id
  });

  // Process the leads data when it arrives
  useEffect(() => {
    if (leadsData) {
      // Convert the response to Lead[] type
      let processedLeads: Lead[];
      
      if (Array.isArray(leadsData)) {
        processedLeads = leadsData as Lead[];
      } else if ('data' in leadsData && Array.isArray(leadsData.data)) {
        processedLeads = leadsData.data as Lead[];
      } else {
        processedLeads = [];
      }
      
      setLeads(processedLeads);
    }
  }, [leadsData]);

  // Apply filters and search whenever leads, filters, or search query changes
  useEffect(() => {
    let result = [...leads];
    
    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(lead => 
        lead.name?.toLowerCase().includes(query) || 
        lead.email?.toLowerCase().includes(query) ||
        lead.phone?.toLowerCase().includes(query)
      );
    }
    
    // Apply status filter
    if (filters.status && filters.status.length > 0) {
      result = result.filter(lead => filters.status!.includes(lead.status));
    }
    
    // Apply source filter
    if (filters.source && filters.source.length > 0) {
      result = result.filter(lead => filters.source!.includes(lead.source));
    }
    
    // Apply funnel stage filter
    if (filters.funnelStage && filters.funnelStage.length > 0) {
      result = result.filter(lead => filters.funnelStage!.includes(lead.funnel_stage));
    }
    
    setFilteredLeads(result);
  }, [leads, filters, searchQuery]);

  // Handle lead creation
  const handleCreateLead = async (lead: Omit<Lead, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const newLead = await leadService.createLead({
        ...lead,
        branch_id: currentBranch?.id
      });
      
      if (newLead) {
        setLeads(prevLeads => [newLead, ...prevLeads]);
        setIsCreateDialogOpen(false);
        toast.success('Lead created successfully');
      }
    } catch (err) {
      console.error('Error creating lead:', err);
      toast.error('Failed to create lead');
    }
  };

  // Handle lead update
  const handleUpdateLead = async (lead: Lead) => {
    try {
      const updatedLead = await leadService.updateLead(lead.id, lead);
      
      if (updatedLead) {
        setLeads(prevLeads => 
          prevLeads.map(l => l.id === updatedLead.id ? updatedLead : l)
        );
        setIsEditDialogOpen(false);
        setSelectedLead(null);
        toast.success('Lead updated successfully');
      }
    } catch (err) {
      console.error('Error updating lead:', err);
      toast.error('Failed to update lead');
    }
  };

  // Handle lead deletion
  const handleDeleteLead = async (leadId: string) => {
    if (window.confirm('Are you sure you want to delete this lead?')) {
      try {
        const success = await leadService.deleteLead(leadId);
        if (success) {
          // Filter out the deleted lead instead of using the API response directly
          setLeads(prevLeads => prevLeads.filter(lead => lead.id !== leadId));
          toast.success('Lead deleted successfully');
        }
      } catch (err) {
        console.error('Error deleting lead:', err);
        toast.error('Failed to delete lead');
      }
    }
  };

  // Handle opening the edit dialog
  const handleEditClick = (lead: Lead) => {
    setSelectedLead(lead);
    setIsEditDialogOpen(true);
  };

  // Handle viewing lead details
  const handleViewLead = (lead: Lead) => {
    router.push(`/crm/leads/${lead.id}`);
  };

  // Handle filter changes
  const handleFilterChange = (newFilters: typeof filters) => {
    setFilters(newFilters);
    setIsFilterDialogOpen(false);
  };

  // Get badge color for lead status
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'new':
        return <Badge className="bg-blue-500">New</Badge>;
      case 'contacted':
        return <Badge className="bg-yellow-500">Contacted</Badge>;
      case 'qualified':
        return <Badge className="bg-green-500">Qualified</Badge>;
      case 'unqualified':
        return <Badge className="bg-red-500">Unqualified</Badge>;
      case 'converted':
        return <Badge className="bg-purple-500">Converted</Badge>;
      case 'lost':
        return <Badge className="bg-gray-500">Lost</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  // Get badge for funnel stage
  const getFunnelStageBadge = (stage: string) => {
    switch (stage) {
      case 'cold':
        return <Badge variant="outline" className="bg-blue-50 text-blue-700">Cold</Badge>;
      case 'warm':
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-700">Warm</Badge>;
      case 'hot':
        return <Badge variant="outline" className="bg-red-50 text-red-700">Hot</Badge>;
      case 'won':
        return <Badge variant="outline" className="bg-green-50 text-green-700">Won</Badge>;
      case 'lost':
        return <Badge variant="outline" className="bg-gray-50 text-gray-700">Lost</Badge>;
      default:
        return <Badge variant="outline">{stage}</Badge>;
    }
  };

  // Render loading state
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Leads</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map(i => (
              <div key={i} className="flex items-center space-x-4">
                <Skeleton className="h-12 w-12 rounded-full" />
                <div className="space-y-2 flex-1">
                  <Skeleton className="h-4 w-1/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
                <Skeleton className="h-8 w-24" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  // Render error state
  if (error) {
    return (
      <Card>
        <CardContent className="text-center py-10">
          <p className="text-red-500">Error loading leads: {(error as Error).message}</p>
          <Button onClick={() => refetch()} className="mt-4">
            Try Again
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search leads..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex space-x-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setIsFilterDialogOpen(true)}
          >
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
          <Button 
            size="sm"
            onClick={() => setIsCreateDialogOpen(true)}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Lead
          </Button>
        </div>
      </div>

      {filteredLeads.length === 0 ? (
        <Card>
          <CardContent className="text-center py-10">
            <p className="text-muted-foreground">No leads found</p>
            <Button 
              onClick={() => setIsCreateDialogOpen(true)} 
              className="mt-4"
            >
              Create your first lead
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="p-0">
            <div className="divide-y">
              {filteredLeads.map((lead) => (
                <div 
                  key={lead.id} 
                  className="p-4 hover:bg-muted/50 cursor-pointer"
                  onClick={() => handleViewLead(lead)}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium">{lead.name}</h3>
                      <div className="flex items-center text-sm text-muted-foreground space-x-4 mt-1">
                        {lead.email && (
                          <div className="flex items-center">
                            <Mail className="h-3.5 w-3.5 mr-1" />
                            <span>{lead.email}</span>
                          </div>
                        )}
                        {lead.phone && (
                          <div className="flex items-center">
                            <Phone className="h-3.5 w-3.5 mr-1" />
                            <span>{lead.phone}</span>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {getStatusBadge(lead.status)}
                      {getFunnelStageBadge(lead.funnel_stage)}
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={(e) => {
                            e.stopPropagation();
                            handleEditClick(lead);
                          }}>
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteLead(lead.id);
                          }}>
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                  <div className="flex justify-between items-center mt-2">
                    <div className="flex items-center text-xs text-muted-foreground">
                      <span>Source: {lead.source}</span>
                      {lead.created_at && (
                        <>
                          <span className="mx-2">•</span>
                          <span>Added {format(new Date(lead.created_at), 'MMM d, yyyy')}</span>
                        </>
                      )}
                    </div>
                    <div className="flex space-x-1">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-8 w-8 p-0" 
                        onClick={(e) => {
                          e.stopPropagation();
                          // Handle call action
                        }}
                      >
                        <Phone className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-8 w-8 p-0"
                        onClick={(e) => {
                          e.stopPropagation();
                          // Handle email action
                        }}
                      >
                        <Mail className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-8 w-8 p-0"
                        onClick={(e) => {
                          e.stopPropagation();
                          // Handle message action
                        }}
                      >
                        <MessageSquare className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Create Lead Dialog */}
      {isCreateDialogOpen && (
        <LeadDialog
          isOpen={isCreateDialogOpen}
          onClose={() => setIsCreateDialogOpen(false)}
          onSave={handleCreateLead}
        />
      )}

      {/* Edit Lead Dialog */}
      {isEditDialogOpen && selectedLead && (
        <LeadDialog
          isOpen={isEditDialogOpen}
          onClose={() => {
            setIsEditDialogOpen(false);
            setSelectedLead(null);
          }}
          onSave={handleUpdateLead}
          lead={selectedLead}
        />
      )}

      {/* Filter Dialog */}
      {isFilterDialogOpen && (
        <LeadFilterDialog
          isOpen={isFilterDialogOpen}
          onClose={() => setIsFilterDialogOpen(false)}
          filters={filters}
          onApplyFilters={handleFilterChange}
        />
      )}
    </div>
  );
};

export default LeadsList;
