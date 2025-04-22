
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Eye, Pencil } from "lucide-react";

// Mock email templates data
const mockTemplates = [
  {
    id: "1",
    name: "Welcome Email",
    subject: "Welcome to {gym_name}!",
    content: "Hi {member_name},\n\nWelcome to {gym_name}! We're excited to have you join our fitness community.\n\nYou can log in to your account at {login_url}.\n\nBest regards,\nThe {gym_name} Team",
    createdAt: "2023-06-15T10:30:00Z",
    updatedAt: "2023-06-15T10:30:00Z"
  },
  {
    id: "2",
    name: "Membership Renewal Reminder",
    subject: "Your {gym_name} membership is expiring soon",
    content: "Dear {member_name},\n\nThis is a friendly reminder that your {plan_name} membership at {gym_name} will expire on {expiry_date}.\n\nPlease visit our front desk or log in to your account to renew your membership.\n\nThank you for being a valued member!\n\nBest regards,\nThe {gym_name} Team",
    createdAt: "2023-06-20T14:15:00Z",
    updatedAt: "2023-07-05T09:45:00Z"
  },
  {
    id: "3",
    name: "New Invoice Notification",
    subject: "Your {gym_name} Invoice",
    content: "Hello {member_name},\n\nYour new invoice for {plan_name} at {gym_name} has been generated.\n\nYou can view and download your invoice at: {invoice_link}\n\nThank you for your business!\n\nBest regards,\nThe {gym_name} Team",
    createdAt: "2023-07-01T11:20:00Z",
    updatedAt: "2023-07-01T11:20:00Z"
  }
];

interface EmailTemplatesListProps {
  onEdit: (template: any) => void;
  onPreview: (template: any) => void;
}

const EmailTemplatesList: React.FC<EmailTemplatesListProps> = ({ onEdit, onPreview }) => {
  return (
    <div className="space-y-6">
      {mockTemplates.map((template) => (
        <Card key={template.id}>
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle>{template.name}</CardTitle>
                <CardDescription className="mt-1">
                  Subject: {template.subject}
                </CardDescription>
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
              {template.content.length > 200 
                ? `${template.content.substring(0, 200)}...` 
                : template.content}
            </div>
            <div className="mt-2 text-xs text-muted-foreground">
              Last updated: {new Date(template.updatedAt).toLocaleDateString()}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default EmailTemplatesList;
