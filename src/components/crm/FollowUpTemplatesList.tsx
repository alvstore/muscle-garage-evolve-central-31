
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { MoreHorizontal, Plus, Star, Edit, Trash } from 'lucide-react';
import { FollowUpTemplate, FollowUpType } from '@/types/crm';
import FollowUpTemplateForm from './FollowUpTemplateForm';

// Dummy data for templates
const dummyTemplates: FollowUpTemplate[] = [
  {
    id: "1",
    title: "Welcome Email",
    name: "welcome-email",
    type: "email",
    content: "Hello {{name}},\n\nWelcome to our gym! We're excited to have you join our community. Your fitness journey starts now!\n\nBest regards,\nThe Gym Team",
    variables: ["name"],
    created_at: "2023-05-01T00:00:00Z",
    updated_at: "2023-05-01T00:00:00Z",
    isDefault: true
  },
  {
    id: "2",
    title: "Follow-up Email",
    name: "follow-up-email",
    type: "email",
    content: "Dear {{name}}, we noticed you haven't responded to our previous message. Are you still interested?",
    variables: ["name"],
    created_at: "2023-05-02T00:00:00Z",
    updated_at: "2023-05-02T00:00:00Z",
    isDefault: false
  },
  {
    id: "3",
    title: "Appointment Reminder",
    name: "appointment-reminder",
    type: "sms",
    content: "Hi {{name}}, this is a reminder about your appointment on {{date}} at {{time}}.",
    variables: ["name", "date", "time"],
    created_at: "2023-05-03T00:00:00Z",
    updated_at: "2023-05-03T00:00:00Z",
    isDefault: false
  },
  {
    id: "4",
    title: "WhatsApp Welcome",
    name: "whatsapp-welcome",
    type: "whatsapp",
    content: "Hello {{name}}! Welcome to {{company}}. We're glad to have you with us.",
    variables: ["name", "company"],
    created_at: "2023-05-04T00:00:00Z",
    updated_at: "2023-05-04T00:00:00Z",
    isDefault: false
  },
  {
    id: "5",
    title: "Feedback Request",
    name: "feedback-request",
    type: "email",
    content: "Dear {{name}}, we value your feedback. Please let us know how we're doing.",
    variables: ["name"],
    created_at: "2023-05-05T00:00:00Z",
    updated_at: "2023-05-05T00:00:00Z",
    isDefault: false
  }
];

const FollowUpTemplatesList: React.FC = () => {
  const [templates, setTemplates] = useState<FollowUpTemplate[]>(dummyTemplates);
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<FollowUpTemplate | null>(null);
  
  // Filter templates by search term
  const filteredTemplates = templates.filter(template => 
    template.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    template.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddTemplate = () => {
    setEditingTemplate(null);
    setShowForm(true);
  };

  const handleEditTemplate = (template: FollowUpTemplate) => {
    setEditingTemplate(template);
    setShowForm(true);
  };

  const handleSaveTemplate = (template: FollowUpTemplate) => {
    if (editingTemplate) {
      // Update existing template
      setTemplates(templates.map(t => t.id === template.id ? template : t));
    } else {
      // Add new template
      setTemplates([...templates, template]);
    }
    setShowForm(false);
  };

  const handleDeleteTemplate = (id: string) => {
    setTemplates(templates.filter(template => template.id !== id));
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingTemplate(null);
  };

  const getTypeColor = (type: FollowUpType) => {
    switch(type) {
      case "email":
        return 'bg-blue-100 text-blue-800';
      case "sms":
        return 'bg-green-100 text-green-800';
      case "whatsapp":
        return 'bg-emerald-100 text-emerald-800';
      case "call":
        return 'bg-amber-100 text-amber-800';
      case "meeting":
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return `${date.toLocaleDateString()} ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
  };

  return (
    <div className="space-y-4">
      {showForm ? (
        <FollowUpTemplateForm 
          template={editingTemplate} 
          onSave={handleSaveTemplate} 
          onCancel={handleCancel} 
        />
      ) : (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Follow-Up Templates</CardTitle>
              <CardDescription>Manage your follow-up message templates</CardDescription>
            </div>
            <Button onClick={handleAddTemplate}>
              <Plus className="mr-2 h-4 w-4" />
              Add Template
            </Button>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <Input 
                placeholder="Search templates..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-sm"
              />
            </div>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Template Name</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead>Default</TableHead>
                    <TableHead className="w-[80px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTemplates.length > 0 ? (
                    filteredTemplates.map((template) => (
                      <TableRow key={template.id}>
                        <TableCell className="font-medium">{template.title}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className={getTypeColor(template.type)}>
                            {template.type.charAt(0).toUpperCase() + template.type.slice(1)}
                          </Badge>
                        </TableCell>
                        <TableCell>{formatDate(template.created_at)}</TableCell>
                        <TableCell>
                          {template.isDefault && <Star className="h-4 w-4 text-yellow-500" />}
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Open menu</span>
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem 
                                className="cursor-pointer"
                                onClick={() => handleEditTemplate(template)}
                              >
                                <Edit className="mr-2 h-4 w-4" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                className="cursor-pointer text-red-600"
                                onClick={() => handleDeleteTemplate(template.id)}
                              >
                                <Trash className="mr-2 h-4 w-4" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} className="h-24 text-center">
                        No templates found.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default FollowUpTemplatesList;
