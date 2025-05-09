
import { useState, useEffect } from "react";
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
import { UserPlus, RefreshCw, MoreVertical, MessageCircle, Phone } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";

// Mock data for leads
const mockLeads: Lead[] = [
  {
    id: "1",
    name: "John Smith",
    email: "john.smith@example.com",
    phone: "+1234567890",
    source: "website",
    status: "new",
    funnel_stage: "cold",
    assigned_to: "Staff 1",
    notes: "Interested in membership plans",
    created_at: "2023-04-15T10:30:00Z",
    updated_at: "2023-04-15T10:30:00Z",
    follow_up_date: "2023-04-20T10:30:00Z",
    branch_id: "default-branch-id",
  },
  {
    id: "2",
    name: "Jane Doe",
    email: "jane.doe@example.com",
    phone: "+1987654321",
    source: "referral",
    status: "contacted",
    funnel_stage: "warm",
    assigned_to: "Staff 2",
    created_at: "2023-04-14T14:20:00Z",
    updated_at: "2023-04-16T09:15:00Z",
    last_contact_date: "2023-04-16T09:15:00Z",
    follow_up_date: "2023-04-22T10:00:00Z",
    branch_id: "default-branch-id",
  },
  {
    id: "3",
    name: "Michael Johnson",
    email: "michael.j@example.com",
    phone: "+1122334455",
    source: "walk_in",
    status: "qualified",
    funnel_stage: "hot",
    assigned_to: "Staff 1",
    notes: "Ready to sign up, waiting for spouse approval",
    created_at: "2023-04-10T11:45:00Z",
    updated_at: "2023-04-17T13:20:00Z",
    last_contact_date: "2023-04-17T13:20:00Z",
    follow_up_date: "2023-04-19T15:00:00Z",
    branch_id: "default-branch-id",
  },
  {
    id: "4",
    name: "Emily Wilson",
    email: "emily.w@example.com",
    phone: "+1566778899",
    source: "social_media",
    status: "qualified",
    funnel_stage: "hot",
    assigned_to: "Staff 3",
    created_at: "2023-04-05T09:10:00Z",
    updated_at: "2023-04-18T10:30:00Z",
    last_contact_date: "2023-04-18T10:30:00Z",
    conversion_date: "2023-04-18T10:30:00Z",
    conversion_value: 299.99,
    branch_id: "default-branch-id",
  },
  {
    id: "5",
    name: "Robert Brown",
    email: "rob.brown@example.com",
    phone: "+1112223344",
    source: "event",
    status: "new",
    funnel_stage: "cold",
    assigned_to: "Staff 2",
    created_at: "2023-04-01T15:20:00Z",
    updated_at: "2023-04-15T16:45:00Z",
    branch_id: "default-branch-id",
  },
  {
    id: "6",
    name: "Sarah Parker",
    email: "sarah.p@example.com",
    phone: "+1234567999",
    source: "website",
    status: "contacted",
    funnel_stage: "warm",
    assigned_to: "Staff 1",
    created_at: "2023-04-12T10:30:00Z",
    updated_at: "2023-04-16T11:20:00Z",
    last_contact_date: "2023-04-16T11:20:00Z",
    follow_up_date: "2023-04-23T14:00:00Z",
    branch_id: "default-branch-id",
  },
  {
    id: "7",
    name: "David Lee",
    email: "david.lee@example.com",
    phone: "+1444555666",
    source: "referral",
    status: "qualified",
    funnel_stage: "hot",
    assigned_to: "Staff 3",
    notes: "Very interested in personal training",
    created_at: "2023-04-08T09:15:00Z",
    updated_at: "2023-04-17T15:30:00Z",
    last_contact_date: "2023-04-17T15:30:00Z",
    follow_up_date: "2023-04-20T10:00:00Z",
    branch_id: "default-branch-id",
  }
];

// Define the structure for each column
interface FunnelColumn {
  id: FunnelStage;
  title: string;
  description: string;
  leads: Lead[];
}

const FunnelBoard = () => {
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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      // Organize leads into columns based on their funnel stage
      const organizedColumns = columns.map(column => {
        return {
          ...column,
          leads: mockLeads.filter(lead => lead.funnel_stage === column.id)
        };
      });
      
      setColumns(organizedColumns);
      setLoading(false);
    }, 1000);
  }, []);

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
    const sourceCpol = { ...newColumns[sourceColIndex] };
    const destCol = { ...newColumns[destColIndex] };
    
    // Get the lead being moved
    const [movedLead] = sourceCpol.leads.splice(source.index, 1);
    
    // Update the lead's funnel stage if moved to a different column
    if (source.droppableId !== destination.droppableId) {
      movedLead.funnel_stage = destination.droppableId as FunnelStage;
      toast.success(`Moved ${movedLead.name} to ${destCol.title}`);
    }
    
    // Insert the lead in the destination column
    destCol.leads.splice(destination.index, 0, movedLead);
    
    // Update the columns
    newColumns[sourceColIndex] = sourceCpol;
    newColumns[destColIndex] = destCol;
    
    setColumns(newColumns);
  };

  const handleSendMessage = (lead: Lead) => {
    toast.info(`Preparing message for ${lead.name}`);
  };

  const handleCallLead = (lead: Lead) => {
    toast.info(`Initiating call to ${lead.name}`);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold">Sales Funnel</h2>
          <p className="text-sm text-muted-foreground">
            Drag and drop leads between stages to update their status
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => {
            setLoading(true);
            // Simulate API reload
            setTimeout(() => {
              const organizedColumns = columns.map(column => {
                return {
                  ...column,
                  leads: mockLeads.filter(lead => lead.funnel_stage === column.id)
                };
              });
              
              setColumns(organizedColumns);
              setLoading(false);
            }, 1000);
          }}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button size="sm">
            <UserPlus className="h-4 w-4 mr-2" />
            Add Lead
          </Button>
        </div>
      </div>
      
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-96">
          {[1, 2, 3].map((_, index) => (
            <div key={index} className="border rounded-lg bg-card animate-pulse h-full"></div>
          ))}
        </div>
      ) : (
        <DragDropContext onDragEnd={handleDragEnd}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {columns.map((column) => (
              <div key={column.id} className="flex flex-col h-full">
                <Card className="h-full flex flex-col">
                  <CardHeader className={`pb-2 ${
                    column.id === "cold" ? "bg-blue-50" :
                    column.id === "warm" ? "bg-amber-50" :
                    "bg-red-50"
                  }`}>
                    <CardTitle className={
                      column.id === "cold" ? "text-blue-700" :
                      column.id === "warm" ? "text-amber-700" :
                      "text-red-700"
                    }>
                      {column.title}
                      <Badge variant="outline" className="ml-2 bg-white">
                        {column.leads.length}
                      </Badge>
                    </CardTitle>
                    <CardDescription>{column.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="flex-1 overflow-auto p-3">
                    <Droppable droppableId={column.id}>
                      {(provided) => (
                        <div
                          {...provided.droppableProps}
                          ref={provided.innerRef}
                          className="space-y-2 min-h-[400px]"
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
                                    <h3 className="font-medium">{lead.name}</h3>
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
