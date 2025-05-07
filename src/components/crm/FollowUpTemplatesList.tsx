
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
import { 
  MessageCircle, 
  MoreVertical, 
  Pencil, 
  Trash2, 
  Copy, 
  RefreshCw, 
  PlusCircle
} from "lucide-react";
import { FollowUpTemplate, FollowUpType } from "@/types/crm";
import { toast } from "sonner";

// Mock data for follow-up templates
const mockTemplates: FollowUpTemplate[] = [
  {
    id: "1",
    name: "Initial Follow-up",
    title: "Initial Follow-up",
    type: "email",
    content: "Hello {{name}},\n\nThank you for your interest in our gym. We would love to have you visit us for a free trial session.\n\nPlease let me know when would be a convenient time for you.\n\nBest regards,\n{{staffName}}",
    variables: ["name", "staffName"],
    created_by: "Admin",
    createdBy: "Admin",
    created_at: "2023-05-15T10:00:00Z",
    createdAt: "2023-05-15T10:00:00Z",
    isDefault: true
  },
  {
    id: "2",
    name: "Follow-up After Trial",
    title: "Follow-up After Trial",
    type: "email",
    content: "Hello {{name}},\n\nI hope you enjoyed your trial session at our gym on {{trialDate}}. I wanted to follow up and see if you had any questions about our membership options.\n\nWe currently have a special offer that might interest you.\n\nLooking forward to hearing from you,\n{{staffName}}",
    variables: ["name", "trialDate", "staffName"],
    created_by: "Admin",
    createdBy: "Admin",
    created_at: "2023-05-16T11:30:00Z",
    createdAt: "2023-05-16T11:30:00Z",
    isDefault: false
  },
  {
    id: "3",
    name: "Membership Reminder",
    title: "Membership Reminder",
    type: "sms",
    content: "Hi {{name}}! Just a reminder that your trial period ends soon. Call us at {{gymPhone}} to discuss membership options and take advantage of our current promotions.",
    variables: ["name", "gymPhone"],
    created_by: "Admin",
    createdBy: "Admin",
    created_at: "2023-05-17T09:15:00Z",
    createdAt: "2023-05-17T09:15:00Z",
    isDefault: false
  },
  {
    id: "4",
    name: "WhatsApp Introduction",
    title: "WhatsApp Introduction",
    type: "whatsapp",
    content: "Hello {{name}}, this is {{staffName}} from Fitness Gym 👋 Thanks for your interest in our services! Would you like to schedule a visit to see our facilities? We're offering a special promotion for new members this month.",
    variables: ["name", "staffName"],
    created_by: "Admin",
    createdBy: "Admin",
    created_at: "2023-05-20T14:20:00Z",
    createdAt: "2023-05-20T14:20:00Z",
    isDefault: false
  },
  {
    id: "5",
    name: "Special Offer",
    title: "Special Offer",
    type: "email",
    content: "Hello {{name}},\n\nWe miss seeing you at the gym! As a valued lead, we're offering you an exclusive discount: {{discountAmount}} off your first month when you sign up before {{expiryDate}}.\n\nHope to see you soon,\n{{staffName}}",
    variables: ["name", "discountAmount", "expiryDate", "staffName"],
    created_by: "Admin",
    createdBy: "Admin",
    created_at: "2023-05-22T13:40:00Z",
    createdAt: "2023-05-22T13:40:00Z",
    isDefault: false
  }
];

interface FollowUpTemplatesListProps {
  onEdit: (template: FollowUpTemplate) => void;
  onAddNew: () => void;
}

const FollowUpTemplatesList = ({ onEdit, onAddNew }: FollowUpTemplatesListProps) => {
  const [templates, setTemplates] = useState<FollowUpTemplate[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setTemplates(mockTemplates);
      setLoading(false);
    }, 1000);
  }, []);

  const handleDelete = (id: string) => {
    // In a real app, this would be an API call
    const templateToDelete = templates.find(t => t.id === id);
    
    if (templateToDelete?.isDefault) {
      toast.error("Cannot delete default template");
      return;
    }
    
    setTemplates(templates.filter(template => template.id !== id));
    toast.success("Template deleted successfully");
  };

  const handleCopyTemplate = (template: FollowUpTemplate) => {
    // In a real app, this would create a copy in the database
    const newTemplate: FollowUpTemplate = {
      ...template,
      id: `copy-${template.id}`,
      name: `Copy of ${template.name}`,
      title: `Copy of ${template.title}`,
      created_at: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      isDefault: false
    };
    
    setTemplates([...templates, newTemplate]);
    toast.success("Template copied successfully");
  };

  // Format date to readable format
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  // Get badge for template type
  const getTypeBadge = (type: FollowUpType) => {
    switch (type) {
      case "email":
        return <Badge variant="outline" className="bg-blue-50 text-blue-600 border-blue-200">Email</Badge>;
      case "sms":
        return <Badge variant="outline" className="bg-green-50 text-green-600 border-green-200">SMS</Badge>;
      case "whatsapp":
        return <Badge variant="outline" className="bg-emerald-50 text-emerald-600 border-emerald-200">WhatsApp</Badge>;
      case "call":
        return <Badge variant="outline" className="bg-amber-50 text-amber-600 border-amber-200">Call</Badge>;
      case "meeting":
        return <Badge variant="outline" className="bg-purple-50 text-purple-600 border-purple-200">Meeting</Badge>;
      default:
        return <Badge variant="outline">{type}</Badge>;
    }
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <CardTitle>Message Templates</CardTitle>
          <Button onClick={onAddNew}>
            <PlusCircle className="h-4 w-4 mr-2" />
            Create New Template
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="mb-6 flex justify-between items-center">
          <p className="text-sm text-muted-foreground">
            Showing {templates.length} templates
          </p>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => {
              setLoading(true);
              setTimeout(() => {
                setTemplates(mockTemplates);
                setLoading(false);
              }, 1000);
            }}
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>

        {loading ? (
          <div className="h-64 flex items-center justify-center">
            <div className="flex flex-col items-center gap-2">
              <div className="h-6 w-6 rounded-full border-2 border-t-primary animate-spin"></div>
              <p className="text-sm text-muted-foreground">Loading templates...</p>
            </div>
          </div>
        ) : templates.length === 0 ? (
          <div className="text-center py-10">
            <MessageCircle className="h-10 w-10 mx-auto text-muted-foreground" />
            <h3 className="mt-4 text-lg font-medium">No templates found</h3>
            <p className="mt-1 text-sm text-muted-foreground mb-4">
              Create your first message template
            </p>
            <Button onClick={onAddNew}>
              <PlusCircle className="h-4 w-4 mr-2" />
              Create Template
            </Button>
          </div>
        ) : (
          <div className="rounded-md border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Variables</TableHead>
                  <TableHead>Created By</TableHead>
                  <TableHead>Created Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {templates.map((template) => (
                  <TableRow key={template.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center space-x-2">
                        <span>{template.title}</span>
                        {template.isDefault && (
                          <Badge variant="secondary" className="text-xs">Default</Badge>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground mt-1 line-clamp-1">
                        {template.content.substring(0, 60)}...
                      </p>
                    </TableCell>
                    <TableCell>{getTypeBadge(template.type)}</TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {template.variables.map(variable => (
                          <Badge key={variable} variant="outline" className="font-mono text-xs">
                            {`{{${variable}}}`}
                          </Badge>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>{template.createdBy}</TableCell>
                    <TableCell>{formatDate(template.createdAt)}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => onEdit(template)}>
                            <Pencil className="h-4 w-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleCopyTemplate(template)}>
                            <Copy className="h-4 w-4 mr-2" />
                            Duplicate
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => handleDelete(template.id)}
                            className={template.isDefault ? "text-muted-foreground" : "text-destructive focus:text-destructive"}
                            disabled={template.isDefault}
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
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

export default FollowUpTemplatesList;
