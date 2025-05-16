
import React, { useState, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MoreVertical, Plus, Calendar, Phone, Mail, User, ArrowRight, Edit } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { toast } from 'sonner';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import LeadDialog from './LeadDialog';
import LeadForm from './LeadForm';
import { formatDistanceToNow } from 'date-fns';

interface Lead {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  status: string;
  funnel_stage: string;
  source?: string;
  created_at?: string;
  last_contact_date?: string;
  follow_up_date?: string;
  tags?: string[];
}

interface FunnelStage {
  id: string;
  name: string;
  description?: string;
  order: number;
  color?: string;
}

interface FunnelBoardProps {
  leads: Lead[];
  stages: FunnelStage[];
  onUpdateLead: (id: string, data: Partial<Lead>) => Promise<void>;
  onAddLead: (lead: Partial<Lead>) => Promise<void>;
  isLoading?: boolean;
}

export default function FunnelBoard({ leads, stages, onUpdateLead, onAddLead, isLoading = false }: FunnelBoardProps) {
  const [draggedLead, setDraggedLead] = useState<Lead | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState<boolean>(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState<boolean>(false);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [scrollX, setScrollX] = useState(0);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  
  // Sort stages by order
  const sortedStages = [...stages].sort((a, b) => a.order - b.order);
  
  // Group leads by funnel stage
  const leadsByStage: Record<string, Lead[]> = {};
  
  sortedStages.forEach(stage => {
    leadsByStage[stage.id] = leads.filter(lead => lead.funnel_stage === stage.id);
  });
  
  const handleDragStart = (lead: Lead) => {
    setDraggedLead(lead);
  };
  
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };
  
  const handleDrop = async (stageId: string) => {
    if (draggedLead && draggedLead.funnel_stage !== stageId) {
      try {
        await onUpdateLead(draggedLead.id, { funnel_stage: stageId });
        toast.success(`Moved ${draggedLead.name} to ${stages.find(s => s.id === stageId)?.name || 'new stage'}`);
      } catch (error) {
        console.error('Error moving lead:', error);
        toast.error('Failed to move lead');
      }
    }
    setDraggedLead(null);
  };
  
  const handleViewLead = (lead: Lead) => {
    setSelectedLead(lead);
    setIsViewDialogOpen(true);
  };
  
  const handleAddNewLead = (stageId: string) => {
    setSelectedLead({ id: '', name: '', status: 'new', funnel_stage: stageId } as Lead);
    setIsAddDialogOpen(true);
  };
  
  const handleSaveNewLead = async (leadData: Partial<Lead>) => {
    try {
      await onAddLead(leadData);
      setIsAddDialogOpen(false);
      toast.success('Lead added successfully');
    } catch (error) {
      console.error('Error adding lead:', error);
      toast.error('Failed to add lead');
    }
  };
  
  const handleLeadUpdate = async (id: string, data: Partial<Lead>) => {
    try {
      await onUpdateLead(id, data);
      setIsViewDialogOpen(false);
      toast.success('Lead updated successfully');
    } catch (error) {
      console.error('Error updating lead:', error);
      toast.error('Failed to update lead');
    }
  };
  
  // Handle horizontal scrolling
  const checkForScrollPosition = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setScrollX(scrollLeft);
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 5); // 5px buffer
    }
  };
  
  const handleScroll = () => {
    checkForScrollPosition();
  };
  
  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -300, behavior: 'smooth' });
    }
  };
  
  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 300, behavior: 'smooth' });
    }
  };

  React.useEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    if (scrollContainer) {
      checkForScrollPosition();
      scrollContainer.addEventListener('scroll', handleScroll);
      return () => {
        scrollContainer.removeEventListener('scroll', handleScroll);
      };
    }
  }, []);

  return (
    <div className="relative">
      {/* Scroll buttons */}
      {canScrollLeft && (
        <Button
          variant="outline"
          size="icon"
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-card shadow-md"
          onClick={scrollLeft}
        >
          <ArrowRight className="h-4 w-4 rotate-180" />
        </Button>
      )}
      
      {canScrollRight && (
        <Button
          variant="outline"
          size="icon"
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-card shadow-md"
          onClick={scrollRight}
        >
          <ArrowRight className="h-4 w-4" />
        </Button>
      )}
      
      <div 
        ref={scrollContainerRef}
        className="flex gap-4 overflow-x-auto pb-6 pt-1 px-1 no-scrollbar"
        style={{ scrollbarWidth: 'none' }}
      >
        {isLoading ? (
          <div className="flex justify-center items-center h-96 w-full">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : (
          sortedStages.map(stage => (
            <div 
              key={stage.id} 
              className="flex-shrink-0 w-80"
              onDragOver={handleDragOver}
              onDrop={() => handleDrop(stage.id)}
            >
              <Card className="h-full">
                <CardHeader className={`bg-${stage.color || 'muted'}/10`}>
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle>{stage.name}</CardTitle>
                      <CardDescription>{stage.description}</CardDescription>
                    </div>
                    <Badge variant="outline">{leadsByStage[stage.id]?.length || 0}</Badge>
                  </div>
                </CardHeader>
                <CardContent className="p-3">
                  <div className="space-y-3 max-h-[65vh] overflow-y-auto pr-1">
                    {leadsByStage[stage.id]?.map(lead => (
                      <Card
                        key={lead.id}
                        draggable
                        onDragStart={() => handleDragStart(lead)}
                        className={`p-3 cursor-grab active:cursor-grabbing hover:shadow-md transition-shadow ${draggedLead?.id === lead.id ? 'opacity-50' : ''}`}
                      >
                        <div className="flex justify-between items-start">
                          <h4 className="font-medium">{lead.name}</h4>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                <span className="sr-only">Open menu</span>
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => handleViewLead(lead)}>
                                <Edit className="mr-2 h-4 w-4" />
                                <span>Edit</span>
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                        
                        <div className="text-sm text-muted-foreground mt-1">
                          {lead.email && (
                            <div className="flex items-center gap-1">
                              <Mail className="h-3 w-3" />
                              <span>{lead.email}</span>
                            </div>
                          )}
                          {lead.phone && (
                            <div className="flex items-center gap-1">
                              <Phone className="h-3 w-3" />
                              <span>{lead.phone}</span>
                            </div>
                          )}
                          {lead.source && (
                            <div className="flex items-center gap-1">
                              <User className="h-3 w-3" />
                              <span>{lead.source}</span>
                            </div>
                          )}
                        </div>
                        
                        {(lead.follow_up_date || lead.last_contact_date) && (
                          <div className="mt-2 text-xs">
                            {lead.follow_up_date && (
                              <Badge variant={new Date(lead.follow_up_date) < new Date() ? "destructive" : "outline"} className="mr-2">
                                <Calendar className="mr-1 h-3 w-3" />
                                Follow-up: {formatDistanceToNow(new Date(lead.follow_up_date), { addSuffix: true })}
                              </Badge>
                            )}
                            {lead.last_contact_date && (
                              <div className="text-xs text-muted-foreground mt-1">
                                Last contacted: {formatDistanceToNow(new Date(lead.last_contact_date), { addSuffix: true })}
                              </div>
                            )}
                          </div>
                        )}
                        
                        {lead.tags && lead.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-2">
                            {lead.tags.map((tag) => (
                              <Badge key={tag} variant="secondary" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </Card>
                    ))}
                    
                    <Button 
                      variant="ghost" 
                      className="w-full border border-dashed justify-start"
                      onClick={() => handleAddNewLead(stage.id)}
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Add Lead
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          ))
        )}
      </div>
      
      {/* Add Lead Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="max-w-md">
          <LeadForm 
            lead={selectedLead || undefined}
            onSave={handleSaveNewLead}
            onCancel={() => setIsAddDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>
      
      {/* View/Edit Lead Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-4xl">
          {selectedLead && (
            <LeadDialog 
              lead={selectedLead}
              onUpdateLead={handleLeadUpdate}
              onClose={() => setIsViewDialogOpen(false)}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
