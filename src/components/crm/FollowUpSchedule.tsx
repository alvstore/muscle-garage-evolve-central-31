
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, MessageCircle, Phone, RefreshCw, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Lead, FollowUpType, FollowUpScheduled, ScheduledFollowUp } from '@/types/crm';
import { Skeleton } from '@/components/ui/skeleton';

// Convert the database model to the component model
const convertToScheduledFollowUp = (item: FollowUpScheduled): ScheduledFollowUp => {
  return {
    id: item.id,
    leadId: item.lead_id,
    leadName: item.lead_name || "Unknown Lead",
    type: item.type,
    scheduledFor: item.scheduled_for,
    subject: item.subject,
    content: item.content,
    status: item.status,
  };
};

// Mock data for scheduled follow-ups
const mockScheduledFollowUps: FollowUpScheduled[] = [
  {
    id: "1",
    lead_id: "lead-1",
    lead_name: "John Smith",
    type: "email",
    scheduled_for: "2023-06-10T10:00:00Z",
    subject: "Follow up on membership options",
    content: "Hi John,\n\nI wanted to follow up on our conversation about membership options. Let me know if you have any questions.\n\nBest,\nJane",
    status: "scheduled",
    // Add camelCase aliases
    leadId: "lead-1",
    leadName: "John Smith",
    scheduledFor: "2023-06-10T10:00:00Z"
  },
  {
    id: "2",
    lead_id: "lead-2",
    lead_name: "Sarah Johnson",
    type: "sms",
    scheduled_for: "2023-06-12T14:30:00Z",
    subject: "PT session reminder",
    content: "Hi Sarah, just a reminder about your free PT trial session tomorrow at 3pm. Looking forward to meeting you! - Fitness Gym",
    status: "scheduled",
    // Add camelCase aliases
    leadId: "lead-2",
    leadName: "Sarah Johnson",
    scheduledFor: "2023-06-12T14:30:00Z"
  },
  {
    id: "3",
    lead_id: "lead-3",
    lead_name: "David Lee",
    type: "call",
    scheduled_for: "2023-06-09T16:00:00Z",
    subject: "Membership renewal discussion",
    content: "Call to discuss membership renewal options and current promotions.",
    status: "sent",
    // Add camelCase aliases
    leadId: "lead-3",
    leadName: "David Lee",
    scheduledFor: "2023-06-09T16:00:00Z"
  }
];

// Mock data for lead options
const mockLeadOptions: Lead[] = [
  {
    id: "lead-1",
    name: "John Smith",
    email: "john.smith@example.com",
    phone: "555-1234",
    status: "contacted",
    funnel_stage: "qualified",
    source: "website",
    created_at: "2023-05-15T08:30:00Z",
    updated_at: "2023-06-05T14:15:00Z",
    branch_id: "default-branch-id", // Added branch_id field
    // Add camelCase aliases
    funnelStage: "qualified",
  },
  {
    id: "lead-2",
    name: "Sarah Johnson",
    email: "sarah.j@example.com",
    phone: "555-5678",
    status: "new",
    funnel_stage: "warm",
    source: "referral",
    created_at: "2023-06-01T11:45:00Z",
    updated_at: "2023-06-01T11:45:00Z",
    branch_id: "default-branch-id", // Added branch_id field
    // Add camelCase aliases
    funnelStage: "warm",
  },
  {
    id: "lead-3",
    name: "David Lee",
    email: "david.lee@example.com",
    phone: "555-9012",
    status: "contacted",
    funnel_stage: "hot",
    source: "walk-in",
    created_at: "2023-05-20T09:15:00Z",
    updated_at: "2023-06-07T16:30:00Z",
    branch_id: "default-branch-id", // Added branch_id field
    // Add camelCase aliases
    funnelStage: "hot",
  }
];

interface FollowUpScheduleProps {
  isLoading?: boolean;
}

const FollowUpSchedule: React.FC<FollowUpScheduleProps> = ({ isLoading = false }) => {
  const [scheduledFollowUps, setScheduledFollowUps] = React.useState<ScheduledFollowUp[]>([]);
  
  React.useEffect(() => {
    // In a real app, we would fetch from API
    // For now, use mock data but convert to the component model
    setScheduledFollowUps(mockScheduledFollowUps.map(convertToScheduledFollowUp));
  }, []);
  
  // Format date to readable format
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };
  
  // Format time to readable format
  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Get badge for follow-up type
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
        <div className="flex justify-between items-center">
          <CardTitle>Scheduled Follow-ups</CardTitle>
          <Button variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-start space-x-4">
                <Skeleton className="h-12 w-12 rounded-full" />
                <div className="space-y-2 flex-1">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : scheduledFollowUps.length === 0 ? (
          <div className="text-center py-6">
            <MessageCircle className="h-12 w-12 mx-auto text-gray-400" />
            <h3 className="mt-2 text-lg font-medium">No scheduled follow-ups</h3>
            <p className="text-sm text-gray-500 mt-1">Create a follow-up task to get started</p>
          </div>
        ) : (
          <div className="space-y-4">
            {scheduledFollowUps.map((followUp) => (
              <div key={followUp.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="font-medium">{followUp.subject}</div>
                    <div className="text-sm text-muted-foreground">For: {followUp.leadName}</div>
                  </div>
                  <div className="flex space-x-1">
                    {getTypeBadge(followUp.type)}
                    {followUp.status === "sent" && (
                      <Badge variant="secondary">Sent</Badge>
                    )}
                  </div>
                </div>
                <div className="mt-2">
                  <div className="text-sm text-muted-foreground line-clamp-2">{followUp.content}</div>
                </div>
                <div className="mt-3 flex justify-between items-center">
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4 mr-1" />
                    <span>{formatDate(followUp.scheduledFor)}</span>
                    <Clock className="h-4 w-4 ml-3 mr-1" />
                    <span>{formatTime(followUp.scheduledFor)}</span>
                  </div>
                  <div className="flex space-x-2">
                    {followUp.type === "call" && (
                      <Button size="sm" variant="outline">
                        <Phone className="h-4 w-4 mr-1" />
                        Call
                      </Button>
                    )}
                    <Button size="sm" variant="ghost" className="text-red-500 hover:text-red-700 hover:bg-red-50">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default FollowUpSchedule;
