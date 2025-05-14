
import React, { useState, useEffect } from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Search, Edit, Trash, Copy, Plus } from "lucide-react";
import { FollowUpTemplate, FollowUpType } from '@/types/crm';

interface FollowUpTemplatesListProps {
  templates?: FollowUpTemplate[];
  isLoading?: boolean;
  onEdit?: (template: FollowUpTemplate) => void;
  onDelete?: (templateId: string) => void;
  onDuplicate?: (template: FollowUpTemplate) => void;
  onAdd?: () => void;
}

const defaultTemplates: FollowUpTemplate[] = [
  {
    id: '1',
    name: 'Welcome Email',
    title: 'Welcome Email',
    type: 'email',
    content: 'Hello {{name}},\n\nWelcome to our gym! We are excited to have you join our fitness community.',
    variables: ['name'],
    created_at: '2023-01-15T09:30:00Z',
    isDefault: true
  },
  {
    id: '2',
    name: 'Follow-up Email',
    title: 'Follow-up Email',
    type: 'email',
    content: 'Hello {{name}},\n\nJust checking in to see how your fitness journey is going. Do you have any questions?',
    variables: ['name'],
    created_at: '2023-01-16T10:15:00Z',
    isDefault: false
  },
  {
    id: '3',
    name: 'Reminder SMS',
    title: 'Reminder SMS',
    type: 'sms',
    content: 'Hi {{name}}, this is a reminder about your upcoming appointment at {{time}} tomorrow.',
    variables: ['name', 'time'],
    created_at: '2023-01-17T14:20:00Z',
    isDefault: false
  },
  {
    id: '4',
    name: 'WhatsApp Welcome',
    title: 'WhatsApp Welcome',
    type: 'whatsapp',
    content: 'Hello {{name}}! Welcome to our fitness family. Feel free to reach out if you need anything!',
    variables: ['name'],
    created_at: '2023-01-18T16:45:00Z',
    isDefault: false
  },
  {
    id: '5',
    name: 'Special Offer',
    title: 'Special Offer',
    type: 'email',
    content: 'Hello {{name}},\n\nWe have a special offer for you! Upgrade your membership and get 20% off.',
    variables: ['name'],
    created_at: '2023-01-19T11:30:00Z',
    isDefault: false
  }
];

// Duplicate templates to make the list look more populated
const moreTemplates: FollowUpTemplate[] = [
  {
    id: '6',
    name: 'Membership Renewal',
    title: 'Membership Renewal',
    type: 'email',
    content: 'Hello {{name}},\n\nYour membership is expiring soon. Would you like to renew?',
    variables: ['name'],
    isDefault: true,
    created_at: '2023-02-01T09:30:00Z'
  },
  {
    id: '7',
    name: 'Class Announcement',
    title: 'Class Announcement',
    type: 'email',
    content: 'Hello {{name}},\n\nWe are launching a new {{class_type}} class starting next week!',
    variables: ['name', 'class_type'],
    isDefault: false,
    created_at: '2023-02-05T10:15:00Z'
  },
  {
    id: '8',
    name: 'Payment Reminder',
    title: 'Payment Reminder',
    type: 'sms',
    content: 'Hi {{name}}, your payment of ${{amount}} is due on {{date}}.',
    variables: ['name', 'amount', 'date'],
    isDefault: false,
    created_at: '2023-02-10T14:20:00Z'
  },
  {
    id: '9',
    name: 'WhatsApp Achievement',
    title: 'WhatsApp Achievement',
    type: 'whatsapp',
    content: 'Congratulations {{name}}! You\'ve reached your fitness milestone of {{goal}}!',
    variables: ['name', 'goal'],
    isDefault: false,
    created_at: '2023-02-15T16:45:00Z'
  },
  {
    id: '10',
    name: 'Feedback Request',
    title: 'Feedback Request',
    type: 'email',
    content: 'Hello {{name}},\n\nWe value your opinion. Please take a moment to provide feedback on your recent experience.',
    variables: ['name'],
    isDefault: false,
    created_at: '2023-02-20T11:30:00Z'
  }
];

const allTemplates = [...defaultTemplates, ...moreTemplates];

export const FollowUpTemplatesList = ({
  templates = allTemplates,
  isLoading = false,
  onEdit,
  onDelete,
  onDuplicate,
  onAdd
}: FollowUpTemplatesListProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredTemplates, setFilteredTemplates] = useState<FollowUpTemplate[]>(templates);
  
  useEffect(() => {
    if (searchTerm) {
      const filtered = templates.filter(
        template => 
          template.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          template.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
          template.content.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredTemplates(filtered);
    } else {
      setFilteredTemplates(templates);
    }
  }, [searchTerm, templates]);

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

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="relative w-72">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search templates..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button onClick={onAdd}>
          <Plus className="mr-2 h-4 w-4" />
          Add Template
        </Button>
      </div>

      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[250px]">Template Name</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Preview</TableHead>
              <TableHead>Variables</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  Loading templates...
                </TableCell>
              </TableRow>
            ) : filteredTemplates.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  No templates found.
                </TableCell>
              </TableRow>
            ) : (
              filteredTemplates.map((template) => (
                <TableRow key={template.id}>
                  <TableCell className="font-medium">
                    {template.title}
                    {template.isDefault && (
                      <Badge variant="outline" className="ml-2">Default</Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${getTypeColor(template.type)}`}>
                      {template.type}
                    </span>
                  </TableCell>
                  <TableCell className="max-w-[300px] truncate">
                    {template.content.substring(0, 50)}...
                  </TableCell>
                  <TableCell>
                    {template.variables.map(variable => (
                      <Badge key={variable} variant="secondary" className="mr-1">
                        {variable}
                      </Badge>
                    ))}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onEdit && onEdit(template)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onDuplicate && onDuplicate(template)}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onDelete && onDelete(template.id)}
                      disabled={template.isDefault}
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default FollowUpTemplatesList;
