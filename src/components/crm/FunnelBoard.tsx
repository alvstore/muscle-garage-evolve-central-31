
import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { leadService } from '@/services/leadService';
import { useBranch } from '@/hooks/use-branch';
import { Lead, FunnelStage } from '@/types/crm';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import { 
  MoreHorizontal, 
  Phone, 
  Mail, 
  Calendar, 
  MessageSquare, 
  Plus, 
  User,
  Tag
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { getInitials } from '@/lib/utils';
import { format } from 'date-fns';

// Define the item type for drag and drop
const ItemTypes = {
  LEAD: 'lead',
};

// Define the stages for the funnel
const funnelStages: FunnelStage[] = ['cold', 'warm', 'hot', 'proposal', 'negotiation', 'closed_won', 'closed_lost'];

// Component for a draggable lead card
const LeadCard = ({ lead, onEdit, onDelete, onFollowUp }: { 
  lead: Lead, 
  onEdit: (lead: Lead) => void,
  onDelete: (id: string) => void,
  onFollowUp: (lead: Lead) => void
}) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: ItemTypes.LEAD,
    item: { id: lead.id, currentStage: lead.funnel_stage },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  return (
    <div
      ref={drag}
      className={`mb-2 ${isDragging ? 'opacity-50' : 'opacity-100'}`}
    >
      <Card className="cursor-move">
        <CardContent className="p-4">
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-2">
              <Avatar className="h-8 w-8">
                <AvatarFallback>{getInitials(lead.name)}</AvatarFallback>
              </Avatar>
              <div>
                <h4 className="font-medium text-sm">{lead.name}</h4>
                {lead.email && (
                  <p className="text-xs text-muted-foreground">{lead.email}</p>
                )}
              </div>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onEdit(lead)}>
                  Edit Lead
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onFollowUp(lead)}>
                  Schedule Follow-up
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => onDelete(lead.id)}
                  className="text-destructive focus:text-destructive"
                >
                  Delete Lead
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          
          <div className="mt-3 flex flex-wrap gap-1">
            {lead.source && (
              <Badge variant="outline" className="text-xs">
                {lead.source}
              </Badge>
            )}
            {lead.tags && lead.tags.length > 0 && lead.tags.slice(0, 2).map((tag, i) => (
              <Badge key={i} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
          
          <div className="mt-3 flex justify-between text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              <span>{lead.created_at ? format(new Date(lead.created_at), 'MMM d') : 'N/A'}</span>
            </div>
            {lead.follow_up_date && (
              <div className="flex items-center gap-1">
                <MessageSquare className="h-3 w-3" />
                <span>{format(new Date(lead.follow_up_date), 'MMM d')}</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// Component for a stage column that can receive dropped leads
const StageColumn = ({ 
  stage, 
  leads, 
  onDrop, 
  onEdit, 
  onDelete, 
  onFollowUp, 
  onAddLead 
}: { 
  stage: FunnelStage, 
  leads: Lead[],
  onDrop: (leadId: string, targetStage: FunnelStage) => void,
  onEdit: (lead: Lead) => void,
  onDelete: (id: string) => void,
  onFollowUp: (lead: Lead) => void,
  onAddLead: (stage: FunnelStage) => void
}) => {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: ItemTypes.LEAD,
    drop: (item: { id: string }) => onDrop(item.id, stage),
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  }));

  // Format stage name for display
  const formatStageName = (stage: string) => {
    return stage.replace(/_/g, ' ').split(' ').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  // Get background color for stage header
  const getStageColor = (stage: FunnelStage) => {
    switch (stage) {
      case 'cold':
        return 'bg-blue-50 text-blue-700';
      case 'warm':
        return 'bg-yellow-50 text-yellow-700';
      case 'hot':
        return 'bg-orange-50 text-orange-700';
      case 'proposal':
        return 'bg-purple-50 text-purple-700';
      case 'negotiation':
        return 'bg-indigo-50 text-indigo-700';
      case 'closed_won':
        return 'bg-green-50 text-green-700';
      case 'closed_lost':
        return 'bg-red-50 text-red-700';
      default:
        return 'bg-gray-50 text-gray-700';
    }
  };

  return (
    <div 
      ref={drop} 
      className={`flex-1 min-w-[250px] max-w-[300px] rounded-md ${isOver ? 'bg-gray-100' : 'bg-transparent'}`}
    >
      <div className={`p-2 rounded-t-md ${getStageColor(stage)}`}>
        <div className="flex justify-between items-center">
          <h3 className="font-medium">{formatStageName(stage)}</h3>
          <Badge variant="outline">{leads.length}</Badge>
        </div>
      </div>
      <div className="p-2 h-[calc(100vh-220px)] overflow-y-auto">
        {leads.map((lead) => (
          <LeadCard 
            key={lead.id} 
            lead={lead} 
            onEdit={onEdit}
            onDelete={onDelete}
            onFollowUp={onFollowUp}
          />
        ))}
        <Button 
          variant="ghost" 
          className="w-full border border-dashed mt-2 text-muted-foreground"
          onClick={() => onAddLead(stage)}
        >
          <Plus className="h-4 w-4 mr-1" /> Add Lead
        </Button>
      </div>
    </div>
  );
};

const FunnelBoard = () => {
  const { currentBranch } = useBranch();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [isAddingLead, setIsAddingLead] = useState(false);
  const [initialStage, setInitialStage] = useState<FunnelStage>('cold');

  // Fetch leads using React Query
  const { data: leadsData, isLoading, refetch } = useQuery({
    queryKey: ['leads', currentBranch?.id],
    queryFn: () => leadService.getLeads(currentBranch?.id),
    enabled: !!currentBranch?.id
  });

  useEffect(() => {
    if (leadsData) {
      setLeads(leadsData);
    }
  }, [leadsData]);

  // Filter leads by stage for each column
  const getLeadsByStage = (stage: FunnelStage): Lead[] => {
    if (!leads || leads.length === 0) return [];
    return leads.filter(lead => lead.funnel_stage === stage);
  };

  // Handle dropping a lead into a new stage
  const handleDrop = async (leadId: string, targetStage: FunnelStage) => {
    const lead = leads.find(l => l.id === leadId);
    if (!lead || lead.funnel_stage === targetStage) return;

    try {
      const updatedLead = await leadService.updateLead(leadId, {
        funnel_stage: targetStage,
        updated_at: new Date().toISOString()
      });

      if (updatedLead) {
        // Update the local state
        setLeads(prevLeads => 
          prevLeads.map(l => l.id === leadId ? { ...l, funnel_stage: targetStage } : l)
        );
        toast.success(`Lead moved to ${targetStage.replace('_', ' ')}`);
      }
    } catch (error) {
      console.error('Error updating lead stage:', error);
      toast.error('Failed to update lead stage');
    }
  };

  // Handle editing a lead
  const handleEditLead = (lead: Lead) => {
    setSelectedLead(lead);
    // Additional logic for opening edit modal would go here
  };

  // Handle deleting a lead
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

  // Handle scheduling a follow-up
  const handleFollowUp = (lead: Lead) => {
    // Logic for opening follow-up scheduling modal would go here
  };

  // Handle adding a new lead
  const handleAddLead = (stage: FunnelStage) => {
    setInitialStage(stage);
    setIsAddingLead(true);
    // Logic for opening add lead modal would go here
  };

  if (isLoading) {
    return (
      <div className="p-4">
        <div className="flex space-x-4 overflow-x-auto pb-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex-1 min-w-[250px]">
              <Skeleton className="h-10 w-full mb-2" />
              <div className="space-y-2">
                <Skeleton className="h-24 w-full" />
                <Skeleton className="h-24 w-full" />
                <Skeleton className="h-24 w-full" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="p-4">
        <div className="flex space-x-4 overflow-x-auto pb-4">
          {funnelStages.map((stage) => (
            <StageColumn
              key={stage}
              stage={stage}
              leads={getLeadsByStage(stage)}
              onDrop={handleDrop}
              onEdit={handleEditLead}
              onDelete={handleDeleteLead}
              onFollowUp={handleFollowUp}
              onAddLead={handleAddLead}
            />
          ))}
        </div>
      </div>
      
      {/* Modals for editing, adding leads, and scheduling follow-ups would be added here */}
    </DndProvider>
  );
};

export default FunnelBoard;
