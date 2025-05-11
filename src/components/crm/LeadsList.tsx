
import React, { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Lead } from '@/types/crm';
import { useLeads } from '@/hooks/use-leads';
import { formatDistanceToNow } from 'date-fns';
import { Edit, Loader2, MoreHorizontal, Plus, Search } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface LeadsListProps {
  onEdit?: (lead: Lead) => void;
  onAddNew?: () => void;
}

const LeadsList: React.FC<LeadsListProps> = ({ onEdit, onAddNew }) => {
  const { leads, isLoading, error, deleteLead } = useLeads();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sourceFilter, setSourceFilter] = useState('all');

  const filteredLeads = leads.filter(lead => {
    const matchesSearch = 
      lead.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      (lead.email && lead.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (lead.phone && lead.phone.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesStatus = statusFilter === 'all' || lead.status === statusFilter;
    const matchesSource = sourceFilter === 'all' || lead.source === sourceFilter;
    
    return matchesSearch && matchesStatus && matchesSource;
  });

  // Extract unique statuses and sources for filters
  const statuses = [...new Set(leads.map(lead => lead.status))];
  const sources = [...new Set(leads.map(lead => lead.source))];

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this lead?')) {
      await deleteLead(id);
    }
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'new': return 'bg-blue-500';
      case 'contacted': return 'bg-yellow-500';
      case 'qualified': return 'bg-indigo-500';
      case 'converted': return 'bg-green-500';
      case 'lost': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };
  
  if (error) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center text-red-500">
            <p>Error loading leads: {error}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle>Leads Management</CardTitle>
        <Button onClick={onAddNew}>
          <Plus className="mr-2 h-4 w-4" />
          Add New Lead
        </Button>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search leads..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              {statuses.map(status => (
                <SelectItem key={status} value={status}>{status}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={sourceFilter} onValueChange={setSourceFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by source" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Sources</SelectItem>
              {sources.map(source => (
                <SelectItem key={source} value={source}>{source}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : filteredLeads.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <p>No leads found matching your criteria.</p>
          </div>
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Source</TableHead>
                  <TableHead>Last Contact</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLeads.map((lead) => (
                  <TableRow key={lead.id}>
                    <TableCell className="font-medium">{lead.name}</TableCell>
                    <TableCell>
                      <div>{lead.email}</div>
                      <div className="text-sm text-muted-foreground">{lead.phone}</div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusBadgeColor(lead.status)}>
                        {lead.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{lead.source}</TableCell>
                    <TableCell>
                      {lead.last_contact_date ? (
                        formatDistanceToNow(new Date(lead.last_contact_date), { addSuffix: true })
                      ) : (
                        'Never'
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => onEdit && onEdit(lead)}>
                            <Edit className="mr-2 h-4 w-4" /> Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => handleDelete(lead.id)}
                            className="text-red-600"
                          >
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
      </CardContent>
    </Card>
  );
};

export default LeadsList;
