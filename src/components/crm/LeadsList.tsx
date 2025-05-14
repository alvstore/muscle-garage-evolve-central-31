
import React, { useState, useEffect, useCallback } from 'react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { LeadsColumn } from './LeadsColumn';
import { Lead } from '@/types/crm';
import { useLeads } from '@/hooks/use-leads';
import { toast } from 'sonner';
import { Checkbox } from "@/components/ui/checkbox";
import { MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface LeadsListProps {
  onEdit?: (lead: Lead) => void;
  onAddNew?: () => void;
  initialData?: Lead[];
}

const LeadsList: React.FC<LeadsListProps> = ({ onEdit, onAddNew, initialData = [] }) => {
  const [leads, setLeads] = useState<Lead[]>(initialData);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLeads, setSelectedLeads] = useState<string[]>([]);
  const [isBulkActionsOpen, setIsBulkActionsOpen] = useState(false);
  
  const { fetchLeads, deleteLead, updateLead } = useLeads();
  const columns = React.useMemo(() => LeadsColumn, []);

  const handleFetchLeads = useCallback(async () => {
    try {
      const { data, error } = await fetchLeads();
      if (!error && data) {
        setLeads(data);
      }
    } catch (error) {
      console.error('Error fetching leads:', error);
      toast.error('Failed to fetch leads');
    }
  }, [fetchLeads]);

  useEffect(() => {
    handleFetchLeads();
  }, [handleFetchLeads]);

  const filteredLeads = React.useMemo(() => {
    const lowerCaseQuery = searchQuery.toLowerCase();
    return leads.filter(lead =>
      lead.name.toLowerCase().includes(lowerCaseQuery) ||
      (lead.email && lead.email.toLowerCase().includes(lowerCaseQuery)) ||
      (lead.phone && lead.phone.toLowerCase().includes(lowerCaseQuery))
    );
  }, [searchQuery, leads]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleRowSelection = (row: any) => {
    const leadId = row.id;
    setSelectedLeads(prevSelected => {
      if (prevSelected.includes(leadId)) {
        return prevSelected.filter(id => id !== leadId);
      } else {
        return [...prevSelected, leadId];
      }
    });
  };

  const isRowSelected = (id: string) => selectedLeads.includes(id);

  const handleSelectAll = (isSelected: boolean) => {
    if (isSelected) {
      setSelectedLeads(filteredLeads.map(lead => lead.id));
    } else {
      setSelectedLeads([]);
    }
  };

  const areAllRowsSelected = filteredLeads.length > 0 && selectedLeads.length === filteredLeads.length;

  const handleDeleteLead = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this lead?')) {
      try {
        await deleteLead(id);
        toast.success('Lead deleted successfully');
        handleFetchLeads();
      } catch (error) {
        console.error('Error deleting lead:', error);
        toast.error('Failed to delete lead');
      }
    }
  };

  const handleBulkActionComplete = () => {
    setSelectedLeads([]);
    setIsBulkActionsOpen(false);
    handleFetchLeads();
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Leads</CardTitle>
          <CardDescription>Manage your leads here</CardDescription>
        </div>
        {onAddNew && (
          <Button onClick={onAddNew}>Add New Lead</Button>
        )}
      </CardHeader>
      <CardContent>
        <div className="flex flex-col space-y-4">
          <div className="flex items-center space-x-2">
            <Label htmlFor="search">Search:</Label>
            <Input
              type="text"
              id="search"
              placeholder="Search leads..."
              value={searchQuery}
              onChange={handleSearchChange}
            />
          </div>

          {selectedLeads.length > 0 && (
            <BulkLeadActions
              selectedLeads={selectedLeads}
              onActionComplete={handleBulkActionComplete}
            />
          )}

          <div className="rounded-md border">
            <div className="relative w-full overflow-auto">
              <table className="w-full table-auto">
                <thead>
                  <tr>
                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0">
                      <Checkbox
                        id="selectAll"
                        checked={areAllRowsSelected}
                        onCheckedChange={handleSelectAll}
                        aria-label="Select all"
                      />
                    </th>
                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0">
                      Name
                    </th>
                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0">
                      Email
                    </th>
                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0">
                      Phone
                    </th>
                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredLeads.map((lead) => (
                    <tr key={lead.id}>
                      <td className="p-4 align-middle [&:has([role=checkbox])]:pr-0">
                        <Checkbox
                          id={lead.id}
                          checked={isRowSelected(lead.id)}
                          onCheckedChange={() => handleRowSelection(lead)}
                          aria-label={`Select row ${lead.id}`}
                        />
                      </td>
                      <td className="p-4 align-middle [&:has([role=checkbox])]:pr-0">{lead.name}</td>
                      <td className="p-4 align-middle [&:has([role=checkbox])]:pr-0">{lead.email}</td>
                      <td className="p-4 align-middle [&:has([role=checkbox])]:pr-0">{lead.phone}</td>
                      <td className="p-4 align-middle [&:has([role=checkbox])]:pr-0">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <span className="sr-only">Open menu</span>
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            {onEdit && (
                              <DropdownMenuItem onClick={() => onEdit(lead)}>
                                Edit
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuItem onClick={() => handleDeleteLead(lead.id)}>
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        {/* Add any additional footer content here */}
      </CardFooter>
    </Card>
  );
};

interface BulkLeadActionsProps {
  selectedLeads: string[];
  onActionComplete: () => void;
}

const BulkLeadActions: React.FC<BulkLeadActionsProps> = ({ selectedLeads, onActionComplete }) => {
  const { deleteLead, updateLead } = useLeads();

  const handleBulkDelete = async () => {
    if (window.confirm(`Are you sure you want to delete ${selectedLeads.length} leads?`)) {
      try {
        await Promise.all(selectedLeads.map(id => deleteLead(id)));
        toast.success('Selected leads deleted successfully');
        onActionComplete();
      } catch (error) {
        console.error('Error deleting leads:', error);
        toast.error('Failed to delete selected leads');
      }
    }
  };

  const handleMarkAsContacted = async () => {
    try {
      await Promise.all(selectedLeads.map(id => updateLead(id, { status: 'contacted' })));
      toast.success('Selected leads marked as contacted');
      onActionComplete();
    } catch (error) {
      console.error('Error marking leads as contacted:', error);
      toast.error('Failed to mark selected leads as contacted');
    }
  };

  return (
    <div className="flex items-center space-x-4">
      <Button variant="destructive" size="sm" onClick={handleBulkDelete}>
        Delete Selected
      </Button>
      <Button variant="outline" size="sm" onClick={handleMarkAsContacted}>
        Mark as Contacted
      </Button>
      <span>{selectedLeads.length} leads selected</span>
    </div>
  );
};

export default LeadsList;
