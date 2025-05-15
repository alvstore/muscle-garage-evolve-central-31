import React, { useState, useEffect, useCallback } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Lead } from '@/types/crm';
import { MoreHorizontal, Edit, Trash2, Eye, Plus } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { useToast } from "@/hooks/use-toast"
import { Skeleton } from '@/components/ui/skeleton';
import LeadForm from './LeadForm';
import BulkLeadActions from "./BulkLeadActions";
import { useBranch } from '@/hooks/use-branch';
import { leadService } from '@/services/leadService';

// Creating a hook for leads outside of the component
export const useLeads = () => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { currentBranch } = useBranch();

  const fetchLeads = async () => {
    setIsLoading(true);
    setError('');
    try {
      const data = await leadService.getLeads(currentBranch?.id);
      setLeads(data as Lead[]);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch leads');
      console.error('Error fetching leads:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const addLead = async (lead: Omit<Lead, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const newLead = await leadService.createLead(lead);
      if (newLead) {
        setLeads(prevLeads => [newLead, ...prevLeads]);
        return newLead;
      } else {
        throw new Error('Failed to create lead');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to create lead');
      console.error('Error creating lead:', err);
      throw err;
    }
  };

  const updateLead = async (id: string, updates: Partial<Lead>) => {
    try {
      const updatedLead = await leadService.updateLead(id, updates);
      if (updatedLead) {
        setLeads(prevLeads =>
          prevLeads.map(lead => (lead.id === id ? { ...lead, ...updatedLead } : lead))
        );
        return updatedLead;
      } else {
        throw new Error('Failed to update lead');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to update lead');
      console.error('Error updating lead:', err);
      throw err;
    }
  };

  const deleteLead = async (id: string) => {
    try {
      await leadService.deleteLead(id);
      setLeads(prevLeads => prevLeads.filter(lead => lead.id !== id));
    } catch (err: any) {
      setError(err.message || 'Failed to delete lead');
      console.error('Error deleting lead:', err);
      throw err;
    }
  };

  const refetch = fetchLeads;

  useEffect(() => {
    if (currentBranch?.id) {
      fetchLeads();
    }
  }, [currentBranch?.id]);

  return { leads, isLoading, error, fetchLeads, addLead, updateLead, deleteLead, refetch };
};

interface LeadsListProps {
  onEdit?: (lead: Lead) => void;
  onView?: (lead: Lead) => void;
  onAddNew?: () => void;
}

const LeadsList: React.FC<LeadsListProps> = ({ onEdit, onView, onAddNew }) => {
  const { leads, isLoading, error, deleteLead, refetch } = useLeads();
  const { toast } = useToast();
  const [selectedLeads, setSelectedLeads] = useState<string[]>([]);
  const [isBulkActionsOpen, setIsBulkActionsOpen] = useState(false);

  const handleCheckboxChange = (leadId: string) => {
    setSelectedLeads(prev =>
      prev.includes(leadId) ? prev.filter(id => id !== leadId) : [...prev, leadId]
    );
  };

  const handleSelectAll = () => {
    if (selectedLeads.length === leads.length) {
      setSelectedLeads([]);
    } else {
      setSelectedLeads(leads.map(lead => lead.id));
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteLead(id);
      toast({
        title: "Success",
        description: "Lead deleted successfully.",
      })
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete lead.",
        variant: "destructive",
      })
    }
  };

  const LeadRow = ({ lead }: { lead: Lead }) => (
    <TableRow key={lead.id}>
      <TableCell className="w-[50px]">
        <Input
          type="checkbox"
          checked={selectedLeads.includes(lead.id)}
          onChange={() => handleCheckboxChange(lead.id)}
        />
      </TableCell>
      <TableCell className="font-medium">{lead.name || `${lead.first_name} ${lead.last_name}`}</TableCell>
      <TableCell>{lead.email}</TableCell>
      <TableCell>{lead.phone}</TableCell>
      <TableCell>
        <Badge variant="outline">{lead.status}</Badge>
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
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem onClick={() => onView?.(lead)}>
              <Eye className="mr-2 h-4 w-4" />
              View
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onEdit?.(lead)}>
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <DropdownMenuItem className="text-red-500 focus:text-red-500">
                  <Trash2 className="mr-2 h-4 w-4 text-red-500" />
                  Delete
                </DropdownMenuItem>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete this lead from our
                    servers.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={() => handleDelete(lead.id)}>Delete</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  );

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[50px]">
              <Input
                type="checkbox"
                checked={selectedLeads.length === leads.length && leads.length > 0}
                onChange={handleSelectAll}
              />
            </TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Phone</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <>
              <TableRow>
                <TableCell className="text-center" colSpan={6}>
                  <div className="flex flex-col items-center justify-center space-y-2">
                    <Skeleton className="h-4 w-[200px]" />
                    <Skeleton className="h-4 w-[250px]" />
                    <Skeleton className="h-4 w-[150px]" />
                  </div>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="text-center" colSpan={6}>
                  <div className="flex flex-col items-center justify-center space-y-2">
                    <Skeleton className="h-4 w-[200px]" />
                    <Skeleton className="h-4 w-[250px]" />
                    <Skeleton className="h-4 w-[150px]" />
                  </div>
                </TableCell>
              </TableRow>
            </>
          ) : leads.length === 0 ? (
            <TableRow>
              <TableCell className="text-center" colSpan={6}>
                No leads found.
              </TableCell>
            </TableRow>
          ) : (
            leads.map((lead) => (
              <LeadRow key={lead.id} lead={lead} />
            ))
          )}
        </TableBody>
      </Table>

      {selectedLeads.length > 0 && (
        <div className="mt-4">
          <Button onClick={() => setIsBulkActionsOpen(true)}>
            Bulk Actions ({selectedLeads.length} selected)
          </Button>
        </div>
      )}

      {isBulkActionsOpen && (
        <BulkLeadActions
          selectedLeads={selectedLeads}
          onSuccess={() => {
            refetch();
            setSelectedLeads([]);
            setIsBulkActionsOpen(false);
          }}
          onClose={() => setIsBulkActionsOpen(false)}
        />
      )}
    </>
  );
};

export default LeadsList;
