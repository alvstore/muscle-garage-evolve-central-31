
import { useState, useEffect } from "react";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { 
  UserPlus, 
  MoreVertical, 
  Pencil, 
  Trash2, 
  Send, 
  Clock, 
  Download, 
  RefreshCw,
  BarChart 
} from "lucide-react";
import { Lead, LeadStatus, FunnelStage, LeadSource } from "@/types/crm";
import { toast } from "sonner";

// Mock data for leads
const mockLeads: Lead[] = [
  {
    id: "1",
    name: "John Smith",
    email: "john.smith@example.com",
    phone: "+1234567890",
    source: "website",
    status: "new",
    funnelStage: "cold",
    assignedTo: "Staff 1",
    notes: "Interested in membership plans",
    createdAt: "2023-04-15T10:30:00Z",
    updatedAt: "2023-04-15T10:30:00Z",
    followUpDate: "2023-04-20T10:30:00Z",
    interests: ["weight loss", "personal training"],
  },
  {
    id: "2",
    name: "Jane Doe",
    email: "jane.doe@example.com",
    phone: "+1987654321",
    source: "referral",
    status: "contacted",
    funnelStage: "warm",
    assignedTo: "Staff 2",
    createdAt: "2023-04-14T14:20:00Z",
    updatedAt: "2023-04-16T09:15:00Z",
    lastContactDate: "2023-04-16T09:15:00Z",
    followUpDate: "2023-04-22T10:00:00Z",
    interests: ["group classes", "nutrition consulting"],
  },
  {
    id: "3",
    name: "Michael Johnson",
    email: "michael.j@example.com",
    phone: "+1122334455",
    source: "walk-in",
    status: "qualified",
    funnelStage: "hot",
    assignedTo: "Staff 1",
    notes: "Ready to sign up, waiting for spouse approval",
    createdAt: "2023-04-10T11:45:00Z",
    updatedAt: "2023-04-17T13:20:00Z",
    lastContactDate: "2023-04-17T13:20:00Z",
    followUpDate: "2023-04-19T15:00:00Z",
    interests: ["premium membership", "personal training"],
  },
  {
    id: "4",
    name: "Emily Wilson",
    email: "emily.w@example.com",
    phone: "+1566778899",
    source: "social-media",
    status: "converted",
    funnelStage: "hot",
    assignedTo: "Staff 3",
    createdAt: "2023-04-05T09:10:00Z",
    updatedAt: "2023-04-18T10:30:00Z",
    lastContactDate: "2023-04-18T10:30:00Z",
    conversionDate: "2023-04-18T10:30:00Z",
    conversionValue: 299.99,
    interests: ["yoga", "nutrition consulting"],
  },
  {
    id: "5",
    name: "Robert Brown",
    email: "rob.brown@example.com",
    phone: "+1112223344",
    source: "event",
    status: "lost",
    funnelStage: "cold",
    assignedTo: "Staff 2",
    notes: "Price too high",
    createdAt: "2023-04-01T15:20:00Z",
    updatedAt: "2023-04-15T16:45:00Z",
    lastContactDate: "2023-04-15T16:45:00Z",
    interests: ["weight loss"],
  }
];

interface LeadsListProps {
  onEdit: (lead: Lead) => void;
  onAddNew: () => void;
}

const LeadsList = ({ onEdit, onAddNew }: LeadsListProps) => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [filteredLeads, setFilteredLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<LeadStatus | "all">("all");
  const [funnelFilter, setFunnelFilter] = useState<FunnelStage | "all">("all");
  const [sourceFilter, setSourceFilter] = useState<LeadSource | "all">("all");

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setLeads(mockLeads);
      setFilteredLeads(mockLeads);
      setLoading(false);
    }, 1000);
  }, []);

  // Apply filters when any filter changes
  useEffect(() => {
    let result = leads;
    
    // Apply search filter
    if (searchTerm) {
      result = result.filter(lead => 
        lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (lead.email && lead.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (lead.phone && lead.phone.includes(searchTerm))
      );
    }
    
    // Apply status filter
    if (statusFilter !== "all") {
      result = result.filter(lead => lead.status === statusFilter);
    }
    
    // Apply funnel filter
    if (funnelFilter !== "all") {
      result = result.filter(lead => lead.funnelStage === funnelFilter);
    }
    
    // Apply source filter
    if (sourceFilter !== "all") {
      result = result.filter(lead => lead.source === sourceFilter);
    }
    
    setFilteredLeads(result);
  }, [leads, searchTerm, statusFilter, funnelFilter, sourceFilter]);

  const handleDelete = (id: string) => {
    // In a real app, this would be an API call
    setLeads(leads.filter(lead => lead.id !== id));
    setFilteredLeads(filteredLeads.filter(lead => lead.id !== id));
    toast.success("Lead deleted successfully");
  };

  const handleScheduleFollowUp = (lead: Lead) => {
    // In a real app, this would open a follow-up scheduling dialog
    toast.info(`Follow-up scheduled for ${lead.name}`);
  };

  const handleSendMessage = (lead: Lead) => {
    // In a real app, this would open a message sending dialog
    toast.info(`Message being sent to ${lead.name}`);
  };

  // Format date to readable format
  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString();
  };

  // Status badge color mapping
  const getStatusBadge = (status: LeadStatus) => {
    switch (status) {
      case "new":
        return <Badge variant="outline" className="bg-blue-50 text-blue-600 border-blue-200">New</Badge>;
      case "contacted":
        return <Badge variant="outline" className="bg-purple-50 text-purple-600 border-purple-200">Contacted</Badge>;
      case "qualified":
        return <Badge variant="outline" className="bg-amber-50 text-amber-600 border-amber-200">Qualified</Badge>;
      case "converted":
        return <Badge variant="outline" className="bg-green-50 text-green-600 border-green-200">Converted</Badge>;
      case "lost":
        return <Badge variant="outline" className="bg-red-50 text-red-600 border-red-200">Lost</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  // Funnel stage badge color mapping
  const getFunnelBadge = (stage: FunnelStage) => {
    switch (stage) {
      case "cold":
        return <Badge variant="outline" className="bg-blue-50 text-blue-600 border-blue-200">Cold</Badge>;
      case "warm":
        return <Badge variant="outline" className="bg-amber-50 text-amber-600 border-amber-200">Warm</Badge>;
      case "hot":
        return <Badge variant="outline" className="bg-red-50 text-red-600 border-red-200">Hot</Badge>;
      default:
        return <Badge variant="outline">{stage}</Badge>;
    }
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <CardTitle>Lead Management</CardTitle>
          <Button onClick={onAddNew}>
            <UserPlus className="h-4 w-4 mr-2" />
            Add New Lead
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="mb-6 space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder="Search by name, email or phone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />
            </div>
            <div className="flex flex-1 gap-2">
              <Select
                value={statusFilter}
                onValueChange={(value) => setStatusFilter(value as LeadStatus | "all")}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="new">New</SelectItem>
                  <SelectItem value="contacted">Contacted</SelectItem>
                  <SelectItem value="qualified">Qualified</SelectItem>
                  <SelectItem value="converted">Converted</SelectItem>
                  <SelectItem value="lost">Lost</SelectItem>
                </SelectContent>
              </Select>
              
              <Select
                value={funnelFilter}
                onValueChange={(value) => setFunnelFilter(value as FunnelStage | "all")}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Funnel Stage" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Stages</SelectItem>
                  <SelectItem value="cold">Cold</SelectItem>
                  <SelectItem value="warm">Warm</SelectItem>
                  <SelectItem value="hot">Hot</SelectItem>
                </SelectContent>
              </Select>
              
              <Select
                value={sourceFilter}
                onValueChange={(value) => setSourceFilter(value as LeadSource | "all")}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Source" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Sources</SelectItem>
                  <SelectItem value="website">Website</SelectItem>
                  <SelectItem value="referral">Referral</SelectItem>
                  <SelectItem value="walk-in">Walk-in</SelectItem>
                  <SelectItem value="phone">Phone</SelectItem>
                  <SelectItem value="social-media">Social Media</SelectItem>
                  <SelectItem value="event">Event</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="flex justify-between items-center">
            <p className="text-sm text-muted-foreground">
              Showing {filteredLeads.length} leads
            </p>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => {
                  setLoading(true);
                  setTimeout(() => {
                    setLeads(mockLeads);
                    setLoading(false);
                  }, 1000);
                }}
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
              <Button variant="outline" size="sm">
                <BarChart className="h-4 w-4 mr-2" />
                Analytics
              </Button>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="h-64 flex items-center justify-center">
            <div className="flex flex-col items-center gap-2">
              <div className="h-6 w-6 rounded-full border-2 border-t-primary animate-spin"></div>
              <p className="text-sm text-muted-foreground">Loading leads...</p>
            </div>
          </div>
        ) : filteredLeads.length === 0 ? (
          <div className="text-center py-10">
            <UserPlus className="h-10 w-10 mx-auto text-muted-foreground" />
            <h3 className="mt-4 text-lg font-medium">No leads found</h3>
            <p className="mt-1 text-sm text-muted-foreground mb-4">
              {searchTerm || statusFilter !== "all" || funnelFilter !== "all" || sourceFilter !== "all" 
                ? "Try changing your filters"
                : "Start by adding a new lead"}
            </p>
            {searchTerm || statusFilter !== "all" || funnelFilter !== "all" || sourceFilter !== "all" ? (
              <Button 
                variant="outline" 
                onClick={() => {
                  setSearchTerm("");
                  setStatusFilter("all");
                  setFunnelFilter("all");
                  setSourceFilter("all");
                }}
              >
                Clear Filters
              </Button>
            ) : (
              <Button onClick={onAddNew}>
                <UserPlus className="h-4 w-4 mr-2" />
                Add New Lead
              </Button>
            )}
          </div>
        ) : (
          <div className="rounded-md border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Source</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Funnel</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Next Follow-Up</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLeads.map((lead) => (
                  <TableRow key={lead.id}>
                    <TableCell className="font-medium">{lead.name}</TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        {lead.email && <span className="text-xs">{lead.email}</span>}
                        {lead.phone && <span className="text-xs">{lead.phone}</span>}
                      </div>
                    </TableCell>
                    <TableCell className="capitalize">{lead.source.replace('-', ' ')}</TableCell>
                    <TableCell>{getStatusBadge(lead.status)}</TableCell>
                    <TableCell>{getFunnelBadge(lead.funnelStage)}</TableCell>
                    <TableCell>{formatDate(lead.createdAt)}</TableCell>
                    <TableCell>{formatDate(lead.followUpDate)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end items-center gap-2">
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => handleSendMessage(lead)}
                        >
                          <Send className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => handleScheduleFollowUp(lead)}
                        >
                          <Clock className="h-4 w-4" />
                        </Button>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => onEdit(lead)}>
                              <Pencil className="h-4 w-4 mr-2" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={() => handleDelete(lead.id)}
                              className="text-destructive focus:text-destructive"
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
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
