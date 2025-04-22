
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Eye, Pencil } from "lucide-react";
import { Badge } from "@/components/ui/badge";

// Mock SMS templates data
const mockTemplates = [
  {
    id: "1",
    name: "Membership Expiry Alert",
    content: "Hi {member_name}, your {plan_name} at {gym_name} expires on {expiry_date}. Please renew to continue enjoying our facilities.",
    isDltRequired: true,
    dltTemplateId: "1234567890",
    dltCategory: "TRANSACTIONAL",
    senderId: "GYMAPP",
    createdAt: "2023-06-15T10:30:00Z",
    updatedAt: "2023-06-15T10:30:00Z"
  },
  {
    id: "2",
    name: "Payment Reminder",
    content: "Reminder: Your {gym_name} payment of ₹{amount} is due on {due_date}. Please pay to avoid service interruption.",
    isDltRequired: true,
    dltTemplateId: "2345678901",
    dltCategory: "TRANSACTIONAL",
    senderId: "GYMAPP",
    createdAt: "2023-06-20T14:15:00Z",
    updatedAt: "2023-07-05T09:45:00Z"
  },
  {
    id: "3",
    name: "Class Reminder",
    content: "Don't forget! Your {class_name} at {gym_name} starts at {class_time} tomorrow. We're looking forward to seeing you!",
    isDltRequired: false,
    createdAt: "2023-07-01T11:20:00Z",
    updatedAt: "2023-07-01T11:20:00Z"
  }
];

interface SmsTemplatesListProps {
  onEdit: (template: any) => void;
  onPreview: (template: any) => void;
}

const SmsTemplatesList: React.FC<SmsTemplatesListProps> = ({ onEdit, onPreview }) => {
  return (
    <div className="space-y-6">
      {mockTemplates.map((template) => (
        <Card key={template.id}>
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <div className="flex items-center gap-2">
                  <CardTitle>{template.name}</CardTitle>
                  {template.isDltRequired && (
                    <Badge variant="outline" className="bg-blue-50">DLT Registered</Badge>
                  )}
                </div>
                {template.isDltRequired && (
                  <CardDescription className="mt-1">
                    DLT ID: {template.dltTemplateId} | Category: {template.dltCategory}
                  </CardDescription>
                )}
              </div>
              <div className="flex space-x-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex items-center gap-1"
                  onClick={() => onPreview(template)}
                >
                  <Eye className="h-4 w-4" />
                  Preview
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex items-center gap-1"
                  onClick={() => onEdit(template)}
                >
                  <Pencil className="h-4 w-4" />
                  Edit
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="whitespace-pre-line text-sm text-muted-foreground border-l-4 border-muted pl-4 py-2">
              {template.content}
            </div>
            <div className="flex justify-between mt-2">
              <div className="text-xs text-muted-foreground">
                Characters: {template.content.length}/160
              </div>
              <div className="text-xs text-muted-foreground">
                Last updated: {new Date(template.updatedAt).toLocaleDateString()}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default SmsTemplatesList;
