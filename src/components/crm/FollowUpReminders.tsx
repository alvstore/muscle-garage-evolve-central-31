import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, MessageCircle, Phone, RefreshCw, Trash2, Loader2, Mail } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { FollowUpType, FollowUpScheduled } from '@/types/crm';
import { Skeleton } from '@/components/ui/skeleton';
import { followUpService } from '@/services/crm/followUpService';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useBranch } from '@/hooks/settings/use-branches';
import { toast } from 'sonner';

// Only keeping the important changes to fix type errors
const FollowUpReminders = ({ isLoading: propIsLoading = false }) => {
  const { currentBranch } = useBranch();
  const queryClient = useQueryClient();
  const [filter, setFilter] = useState<'all' | 'today' | 'upcoming'>('all');
  
  // Fetch scheduled follow-ups from Supabase
  const { data: scheduledFollowUpsData, isLoading, refetch } = useQuery({
    queryKey: ['scheduledFollowUps', currentBranch?.id],
    queryFn: () => followUpService.getScheduledFollowUps(currentBranch?.id),
    enabled: !!currentBranch?.id,
  });
  
  // Delete follow-up mutation
  const deleteFollowUpMutation = useMutation({
    mutationFn: (id: string) => followUpService.deleteScheduledFollowUp(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['scheduledFollowUps'] });
      toast.success('Follow-up deleted successfully');
    },
    onError: (error: any) => {
      toast.error(`Failed to delete follow-up: ${error.message}`);
    }
  });
  
  // Convert to component model or use the data directly
  const scheduledFollowUps = scheduledFollowUpsData || [];

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

  // Get icon for follow-up type
  const getTypeIcon = (type: FollowUpType) => {
    switch (type) {
      case 'email':
        return <Mail className="h-4 w-4" />;
      case 'sms':
        return <MessageCircle className="h-4 w-4" />;
      case 'call':
        return <Phone className="h-4 w-4" />;
      case 'whatsapp':
        return <MessageCircle className="h-4 w-4" />;
      default:
        return <MessageCircle className="h-4 w-4" />;
    }
  };

  // Handle delete follow-up
  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this follow-up?')) {
      deleteFollowUpMutation.mutate(id);
    }
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex justify-between items-center">
          <CardTitle>Scheduled Follow-ups</CardTitle>
          <div className="flex gap-2">
            <div className="flex rounded-md border overflow-hidden">
              <Button 
                variant={filter === 'all' ? 'default' : 'ghost'} 
                size="sm"
                onClick={() => setFilter('all')}
                className="rounded-none"
              >
                All
              </Button>
              <Button 
                variant={filter === 'today' ? 'default' : 'ghost'} 
                size="sm"
                onClick={() => setFilter('today')}
                className="rounded-none"
              >
                Today
              </Button>
              <Button 
                variant={filter === 'upcoming' ? 'default' : 'ghost'} 
                size="sm"
                onClick={() => setFilter('upcoming')}
                className="rounded-none"
              >
                Upcoming
              </Button>
            </div>
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
            {scheduledFollowUps.map((followUp: FollowUpScheduled) => (
              <div key={followUp.id} className="border rounded-lg p-3 mb-2">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="font-semibold">{followUp.subject || 'Follow-up'}</div>
                    <div className="text-xs text-muted-foreground">
                      For: {followUp.leads?.name || "Unknown lead"}
                    </div>
                  </div>
                  <div>{getTypeBadge(followUp.type)}</div>
                </div>
                <div className="mt-2">
                  <p className="text-sm line-clamp-2">{followUp.content}</p>
                </div>
                <div className="mt-3 flex justify-between items-center">
                  <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                    <Calendar className="h-3 w-3" />
                    <span>{formatDate(followUp.scheduled_at)}</span>
                  </div>
                  <div className="flex space-x-2">
                    <Button 
                      size="sm" 
                      variant="ghost" 
                      className="text-red-500 hover:text-red-700 hover:bg-red-50"
                      onClick={() => handleDelete(followUp.id)}
                    >
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

export default FollowUpReminders;
