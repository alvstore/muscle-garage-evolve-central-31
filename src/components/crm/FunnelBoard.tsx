import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Lead, FunnelStage } from "@/types/crm";
import { toast } from "sonner";
import { UserPlus, RefreshCw, MoreVertical, MessageCircle, Phone, Loader2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { leadService } from "@/services/leadService";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useBranch } from "@/hooks/use-branch";

// Define the structure for each column
interface FunnelColumn {
  id: FunnelStage;
  title: string;
  description: string;
  leads: Lead[];
}

const FunnelBoard = () => {
  const { currentBranch } = useBranch();
  const queryClient = useQueryClient();
  
  // Initial column structure
  const [columns, setColumns] = useState<FunnelColumn[]>([
    {
      id: "cold",
      title: "Cold Leads",
      description: "New and unqualified leads",
      leads: []
    },
    {
      id: "warm",
      title: "Warm Leads",
      description: "Contacted and showing interest",
      leads: []
    },
    {
      id: "hot",
      title: "Hot Leads",
      description: "Ready to convert",
      leads: []
    }
  ]);
  
  // Fetch leads from Supabase
  const { data: leads, isLoading, isError, refetch } = useQuery({
    queryKey: ['leads', currentBranch?.id],
    queryFn: () => leadService.getLeads(currentBranch?.id),
    enabled: !!currentBranch?.id,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
  
  // Update lead stage mutation
  const updateLeadMutation = useMutation({
    mutationFn: ({ id, updates }: { id: string, updates: Partial<Lead> }) => 
      leadService.updateLead(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leads'] });
      toast.success('Lead updated successfully');
    },
    onError: (error: any) => {
      toast.error(`Failed to update lead: ${error.message}`);
    }
  });
  
  // Organize leads into columns when data changes
  useEffect(() => {
    if (leads) {
      const organizedColumns = columns.map(column => {
        return {
          ...column,
          leads: leads.filter(lead => lead.funnel_stage === column.id)
        };
      });
      
      setColumns(organizedColumns);
    }
  }, [leads]);

  const handleDragEnd = (result: DropResult) => {
    const { source, destination } = result;
    
    // Dropped outside of a droppable area
    if (!destination) return;
    
    // No change in position
    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    ) return;
    
    // Find source and destination columns
    const sourceColIndex = columns.findIndex(col => col.id === source.droppableId);
    const destColIndex = columns.findIndex(col => col.id === destination.droppableId);
    
    // Create new arrays to avoid mutation
    const newColumns = [...columns];
    const sourceCol = { ...newColumns[sourceColIndex] };
    const destCol = { ...newColumns[destColIndex] };
    
    // Get the lead being moved
    const [movedLead] = sourceCol.leads.splice(source.index, 1);
    
    // If moving to a different column, update the lead's funnel stage
    if (source.droppableId !== destination.droppableId) {
      const newStage = destination.droppableId as FunnelStage;
      
      // Update the lead in Supabase
      updateLeadMutation.mutate({
        id: movedLead.id,
        updates: { funnel_stage: newStage }
      });
      
      // Update local state
      movedLead.funnel_stage = newStage;
      const leadName = movedLead.name || `${movedLead.first_name} ${movedLead.last_name}`;
      toast.success(`Moved ${leadName} to ${destCol.title}`);
    }
    
    // Add the lead to the destination column
    destCol.leads.splice(destination.index, 0, movedLead);
    
    // Update the columns state
    newColumns[sourceColIndex] = sourceCol;
    newColumns[destColIndex] = destCol;
    setColumns(newColumns);
  };

  const handleSendMessage = (lead: Lead) => {
    toast.info(`Preparing message for ${lead.name || `${lead.first_name} ${lead.last_name}`}`);
  };

  const handleCallLead = (lead: Lead) => {
    toast.info(`Initiating call to ${lead.name || `${lead.first_name} ${lead.last_name}`}`);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Sales Funnel</h2>
        <Button
          variant="outline"
          size="sm"
          className="flex items-center gap-1"
          onClick={() => refetch()}
          disabled={isLoading}
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <RefreshCw className="h-4 w-4" />
          )}
          <span>Refresh</span>
        </Button>
      </div>
      
      {isLoading && !leads ? (
        // Loading state for initial load
        <div className="col-span-3 flex justify-center items-center h-60">
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-sm text-muted-foreground">Loading leads...</p>
          </div>
        </div>
      ) : isError ? (
        // Error state
        <div className="col-span-3 flex justify-center items-center h-60">
          <div className="flex flex-col items-center gap-2 text-destructive">
            <p>Failed to load leads</p>
            <Button variant="outline" size="sm" onClick={() => refetch()}>
              Try Again
            </Button>
          </div>
        </div>
      ) : (
        // Loaded state with drag and drop
        <DragDropContext onDragEnd={handleDragEnd}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {columns.map(column => (
              <div key={column.id} className="space-y-4">
                <Card>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="flex items-center">
                          {column.title}
                          <Badge variant="secondary" className="ml-2">
                            {column.leads.length}
                          </Badge>
                        </CardTitle>
                        <CardDescription>{column.description}</CardDescription>
                      </div>
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        className="rounded-full p-0 h-8 w-8"
                        onClick={() => {
                          // TODO: Implement add lead functionality
                          toast.info('Add lead functionality coming soon');
                        }}
                      >
                        <UserPlus className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <Droppable droppableId={column.id}>
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.droppableProps}
                          className="min-h-[200px]"
                        >
                          {column.leads.map((lead, index) => (
                            <Draggable 
                              key={lead.id} 
                              draggableId={lead.id} 
                              index={index}
                            >
                              {(provided) => (
                                <div
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                  className="border bg-card rounded-md p-3 shadow-sm hover:shadow-md transition-shadow"
                                >
                                  <div className="flex justify-between items-start mb-2">
                                    <h3 className="font-medium">{lead.name || `${lead.first_name} ${lead.last_name}`}</h3>
                                    <DropdownMenu>
                                      <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" size="icon" className="h-8 w-8">
                                          <MoreVertical className="h-4 w-4" />
                                        </Button>
                                      </DropdownMenuTrigger>
                                      <DropdownMenuContent align="end">
                                        <DropdownMenuItem onClick={() => handleSendMessage(lead)}>
                                          <MessageCircle className="h-4 w-4 mr-2" />
                                          Send Message
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => handleCallLead(lead)}>
                                          <Phone className="h-4 w-4 mr-2" />
                                          Call Lead
                                        </DropdownMenuItem>
                                      </DropdownMenuContent>
                                    </DropdownMenu>
                                  </div>
                                  
                                  <div className="text-xs text-muted-foreground mb-2">
                                    {lead.email && <p>{lead.email}</p>}
                                    {lead.phone && <p>{lead.phone}</p>}
                                  </div>
                                  
                                  <div className="flex justify-between items-center">
                                    <Badge variant="outline" className="capitalize">
                                      {lead.status}
                                    </Badge>
                                    <span className="text-xs text-muted-foreground">
                                      {lead.assigned_to || "Unassigned"}
                                    </span>
                                  </div>
                                  
                                  {lead.notes && (
                                    <p className="text-xs mt-2 text-muted-foreground line-clamp-2">
                                      {lead.notes}
                                    </p>
                                  )}
                                </div>
                              )}
                            </Draggable>
                          ))}
                          {provided.placeholder}
                          
                          {column.leads.length === 0 && (
                            <div className="flex items-center justify-center h-20 border border-dashed rounded-md">
                              <p className="text-sm text-muted-foreground">
                                No leads in this stage
                              </p>
                            </div>
                          )}
                        </div>
                      )}
                    </Droppable>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </DragDropContext>
      )}
    </div>
  );
};

export default FunnelBoard;
