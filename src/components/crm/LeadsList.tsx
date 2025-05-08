import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, Edit, Trash2, Search, UserPlus, Filter } from 'lucide-react';
import { Lead } from '@/types/crm';
import { crmService } from '@/services/crmService';
import { useBranch } from '@/hooks/use-branch';
import { toast } from 'sonner';

interface LeadsListProps {
  onEdit: (lead: Lead) => void;
  onAddNew: () => void;
}

export default function LeadsList({ onEdit, onAddNew }: LeadsListProps) {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [funnelFilter, setFunnelFilter] = useState('all');
  const { currentBranch } = useBranch();

  useEffect(() => {
    fetchLeads();
  }, [currentBranch?.id]);

  const fetchLeads = async () => {
    setIsLoading(true);
    try {
      // Get leads for current branch or all leads if no branch selected
      const fetchedLeads = await crmService.getLeads(currentBranch?.id);
      setLeads(fetchedLeads);
    } catch (error) {
      console.error('Error fetching leads:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteLead = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (window.confirm('Are you sure you want to delete this lead?')) {
      try {
        const success = await crmService.deleteLead(id);
        if (success) {
          setLeads(leads.filter(lead => lead.id !== id));
          toast.success('Lead deleted successfully');
        }
      } catch (error) {
        console.error('Error deleting lead:', error);
      }
    }
  };

  const handleEditLead = (lead: Lead, e: React.MouseEvent) => {
    e.stopPropagation();
    onEdit(lead);
  };

  const filteredLeads = leads.filter(lead => {
    const matchesSearch = 
      lead.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (lead.email && lead.email.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (lead.phone && lead.phone.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesFunnel = funnelFilter === 'all' || lead.funnel_stage === funnelFilter;
    
    return matchesSearch && matchesFunnel;
  });

  // Function to generate badge variant based on funnel stage
  const getFunnelStageBadge = (stage: string) => {
    switch (stage) {
      case 'new':
        return <Badge variant="secondary">New</Badge>;
      case 'contacted':
        return <Badge variant="outline">Contacted</Badge>;
      case 'qualified':
        return <Badge variant="default">Qualified</Badge>;
      case 'proposal':
        return <Badge variant="secondary">Proposal</Badge>;
      case 'negotiation':
        return <Badge className="bg-amber-500">Negotiation</Badge>;
      case 'won':
        return <Badge className="bg-green-500">Won</Badge>;
      case 'lost':
        return <Badge variant="destructive">Lost</Badge>;
      default:
        return <Badge variant="outline">{stage}</Badge>;
    }
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search leads..." 
            className="pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Select 
            value={funnelFilter} 
            onValueChange={setFunnelFilter}
          >
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Filter stage" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Stages</SelectItem>
              <SelectItem value="new">New</SelectItem>
              <SelectItem value="contacted">Contacted</SelectItem>
              <SelectItem value="qualified">Qualified</SelectItem>
              <SelectItem value="proposal">Proposal</SelectItem>
              <SelectItem value="negotiation">Negotiation</SelectItem>
              <SelectItem value="won">Won</SelectItem>
              <SelectItem value="lost">Lost</SelectItem>
            </SelectContent>
          </Select>
          
          <Button onClick={onAddNew}>
            <UserPlus className="h-4 w-4 mr-2" />
            Add Lead
          </Button>
        </div>
      </div>
      
      {isLoading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : !currentBranch?.id ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">Please select a branch to view leads</p>
        </div>
      ) : leads.length === 0 ? (
        <div className="text-center py-12 border rounded-lg">
          <h3 className="font-medium text-lg">No leads found</h3>
          <p className="text-muted-foreground mb-6">Get started by adding your first lead</p>
          <Button onClick={onAddNew}>
            <UserPlus className="h-4 w-4 mr-2" />
            Add Lead
          </Button>
        </div>
      ) : filteredLeads.length === 0 ? (
        <div className="text-center py-12 border rounded-lg">
          <h3 className="font-medium text-lg">No matching leads</h3>
          <p className="text-muted-foreground">Try adjusting your search or filters</p>
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead>Stage</TableHead>
              <TableHead>Source</TableHead>
              <TableHead className="hidden md:table-cell">Created</TableHead>
              <TableHead className="hidden md:table-cell">Follow-up</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredLeads.map((lead) => (
              <TableRow 
                key={lead.id} 
                className="cursor-pointer"
                onClick={(e) => handleEditLead(lead, e)}
              >
                <TableCell className="font-medium">{lead.name}</TableCell>
                <TableCell>
                  <div className="text-sm">
                    {lead.email && <div>{lead.email}</div>}
                    {lead.phone && <div>{lead.phone}</div>}
                  </div>
                </TableCell>
                <TableCell>{getFunnelStageBadge(lead.funnel_stage)}</TableCell>
                <TableCell>{lead.source}</TableCell>
                <TableCell className="hidden md:table-cell">{formatDate(lead.created_at || '')}</TableCell>
                <TableCell className="hidden md:table-cell">{lead.follow_up_date ? formatDate(lead.follow_up_date) : 'N/A'}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={(e) => handleEditLead(lead, e)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={(e) => handleDeleteLead(lead.id, e)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}
