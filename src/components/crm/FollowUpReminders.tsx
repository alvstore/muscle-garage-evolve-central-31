import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { followUpService } from '@/services/followUpService';
import { useBranch } from '@/hooks/use-branch';
import { useAuth } from '@/hooks/use-auth';
import { Skeleton } from '@/components/ui/skeleton';
import { format, isToday, isTomorrow, parseISO } from 'date-fns';
import { toast } from 'sonner';
import { 
  Calendar, 
  Clock, 
  Mail, 
  MessageCircle, 
  Phone, 
  CheckCircle, 
  Bell, 
  BellOff,
  User,
  CheckSquare,
  AlertCircle,
  ArrowUpRight
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';
import { taskService, Task } from '@/services/taskService';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

const FollowUpReminders = () => {
  const { currentBranch } = useBranch();
  const { user } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [showAll, setShowAll] = useState(false);
  const [activeTab, setActiveTab] = useState('followups');

  // Fetch today's follow-ups
  const { data: followUps, isLoading } = useQuery({
    queryKey: ['todaysFollowUps', currentBranch?.id, user?.id],
    queryFn: async () => {
      const allScheduled = await followUpService.getScheduledFollowUps(currentBranch?.id);
      return allScheduled.filter(followUp => {
        const scheduledDate = parseISO(followUp.scheduled_for || followUp.scheduled_at || '');
        return (isToday(scheduledDate) || isTomorrow(scheduledDate)) && 
               (!followUp.sent_by || followUp.sent_by === user?.id);
      });
    },
    enabled: !!currentBranch?.id && !!user?.id,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
  
  // Fetch lead-related tasks
  const { data: leadTasks, isLoading: isLoadingTasks } = useQuery({
    queryKey: ['leadTasks', currentBranch?.id, user?.id],
    queryFn: async () => {
      if (!currentBranch?.id) return [];
      
      const tasks = await taskService.getTasks(currentBranch.id);
      return tasks.filter(task => 
        task.related_to === 'lead' && 
        task.status !== 'completed' && 
        (!task.assigned_to || task.assigned_to === user?.id)
      );
    },
    enabled: !!currentBranch?.id && !!user?.id,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
  
  // Update task status mutation
  const updateTaskMutation = useMutation({
    mutationFn: (params: { id: string, status: string }) => 
      taskService.updateTask(params.id, { status: params.status }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leadTasks'] });
      toast.success('Task status updated');
    },
    onError: () => {
      toast.error('Failed to update task status');
    }
  });

  // Get icon based on follow-up type
  const getFollowUpIcon = (type: string) => {
    switch (type) {
      case 'call':
        return <Phone className="h-4 w-4" />;
      case 'email':
        return <Mail className="h-4 w-4" />;
      case 'meeting':
        return <Calendar className="h-4 w-4" />;
      case 'whatsapp':
        return <MessageCircle className="h-4 w-4" />;
      default:
        return <MessageCircle className="h-4 w-4" />;
    }
  };

  // Format the scheduled time
  const formatScheduledTime = (dateString?: string) => {
    if (!dateString) return 'Not scheduled';
    
    const date = parseISO(dateString);
    
    if (isToday(date)) {
      return `Today at ${format(date, 'h:mm a')}`;
    } else if (isTomorrow(date)) {
      return `Tomorrow at ${format(date, 'h:mm a')}`;
    } else {
      return format(date, 'MMM dd, yyyy h:mm a');
    }
  };

  // Handle mark as complete
  const handleMarkComplete = (id: string) => {
    followUpService.updateFollowUpHistory(id, {
      status: 'sent',
      sent_at: new Date().toISOString()
    }).then(() => {
      toast.success('Follow-up marked as completed');
    }).catch(() => {
      toast.error('Failed to update follow-up status');
    });
  };

  // Handle snooze
  const handleSnooze = (id: string) => {
    // Snooze for 2 hours
    const snoozeTime = new Date();
    snoozeTime.setHours(snoozeTime.getHours() + 2);
    
    followUpService.updateFollowUpHistory(id, {
      scheduled_at: snoozeTime.toISOString()
    }).then(() => {
      toast.success('Follow-up snoozed for 2 hours');
    }).catch(() => {
      toast.error('Failed to snooze follow-up');
    });
  };

  // Navigate to lead detail
  const navigateToLead = (leadId: string) => {
    navigate(`/crm/leads/${leadId}`);
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg font-medium">
            Follow-up & Task Reminders
          </CardTitle>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => setShowAll(!showAll)}
          >
            {showAll ? (
              <>
                <BellOff className="h-4 w-4 mr-2" />
                Hide
              </>
            ) : (
              <>
                <Bell className="h-4 w-4 mr-2" />
                Show All
              </>
            )}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4 w-full">
            <TabsTrigger value="followups" className="flex-1">
              <Calendar className="h-4 w-4 mr-2" />
              Follow-ups
            </TabsTrigger>
            <TabsTrigger value="tasks" className="flex-1">
              <CheckSquare className="h-4 w-4 mr-2" />
              Tasks
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="followups">
            {isLoading ? (
              <div className="space-y-3">
                <Skeleton className="h-20 w-full" />
                <Skeleton className="h-20 w-full" />
                <Skeleton className="h-20 w-full" />
              </div>
            ) : followUps && followUps.length > 0 ? (
              <div className="space-y-3">
                {followUps
                  .slice(0, showAll ? undefined : 5)
                  .map((followUp) => (
                    <div 
                      key={followUp.id}
                      className="flex items-start justify-between p-3 border rounded-lg hover:bg-accent/10 transition-colors"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="flex gap-1 items-center">
                            {getFollowUpIcon(followUp.type)}
                            <span className="capitalize">{followUp.type}</span>
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            {formatScheduledTime(followUp.scheduled_for || followUp.scheduled_at)}
                          </span>
                        </div>
                        
                        <h4 className="font-medium mt-1 cursor-pointer hover:text-primary"
                          onClick={() => followUp.lead_id && navigate(`/crm/leads/${followUp.lead_id}`)}
                        >
                          {followUp.subject || `Follow up with ${followUp.lead?.name || 'Lead'}`}
                        </h4>
                        
                        <p className="text-sm text-muted-foreground line-clamp-1 mt-1">
                          {followUp.content}
                        </p>
                      </div>
                      
                      <div className="flex gap-1">
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button 
                                size="icon" 
                                variant="ghost"
                                onClick={() => handleMarkComplete(followUp.id)}
                              >
                                <CheckCircle className="h-4 w-4 text-green-500" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Mark as completed</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                        
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button 
                                size="icon" 
                                variant="ghost"
                                onClick={() => handleSnooze(followUp.id)}
                              >
                                <Clock className="h-4 w-4 text-amber-500" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Snooze for 2 hours</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                    </div>
                  ))}
                
                {followUps.length > 5 && !showAll && (
                  <Button 
                    variant="ghost" 
                    className="w-full text-xs" 
                    onClick={() => setShowAll(true)}
                  >
                    Show {followUps.length - 5} more
                  </Button>
                )}
              </div>
            ) : (
              <div className="text-center py-6 text-muted-foreground">
                <Calendar className="h-12 w-12 mx-auto mb-2 opacity-20" />
                <p>No follow-ups scheduled for today</p>
                <Button 
                  variant="link" 
                  className="mt-2"
                  onClick={() => navigate('/crm/follow-up')}
                >
                  Schedule a follow-up
                </Button>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="tasks">
            {isLoadingTasks ? (
              <div className="space-y-3">
                <Skeleton className="h-20 w-full" />
                <Skeleton className="h-20 w-full" />
                <Skeleton className="h-20 w-full" />
              </div>
            ) : leadTasks && leadTasks.length > 0 ? (
              <div className="space-y-3">
                {leadTasks
                  .slice(0, showAll ? undefined : 5)
                  .map((task) => (
                    <div 
                      key={task.id}
                      className="flex items-start justify-between p-3 border rounded-lg hover:bg-accent/10 transition-colors"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <Badge 
                            variant={task.priority === 'high' ? 'destructive' : 
                                   task.priority === 'medium' ? 'default' : 'outline'}
                            className="flex gap-1 items-center"
                          >
                            {task.priority === 'high' ? (
                              <AlertCircle className="h-3 w-3" />
                            ) : task.priority === 'medium' ? (
                              <Clock className="h-3 w-3" />
                            ) : (
                              <Calendar className="h-3 w-3" />
                            )}
                            <span className="capitalize">{task.priority} Priority</span>
                          </Badge>
                          {task.due_date && (
                            <span className="text-xs text-muted-foreground">
                              Due: {formatScheduledTime(task.due_date)}
                            </span>
                          )}
                        </div>
                        
                        <div className="flex items-center gap-1">
                          <h4 className="font-medium mt-1">{task.title}</h4>
                          {task.related_id && (
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-5 w-5 ml-1" 
                              onClick={() => navigate(`/crm/leads/${task.related_id}`)}
                            >
                              <ArrowUpRight className="h-3 w-3" />
                            </Button>
                          )}
                        </div>
                        
                        <p className="text-sm text-muted-foreground line-clamp-1 mt-1">
                          {task.description}
                        </p>
                      </div>
                      
                      <div className="flex gap-1">
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button 
                                size="icon" 
                                variant="ghost"
                                onClick={() => updateTaskMutation.mutate({ id: task.id, status: 'completed' })}
                              >
                                <CheckCircle className="h-4 w-4 text-green-500" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Mark as completed</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                    </div>
                  ))}
                
                {leadTasks.length > 5 && !showAll && (
                  <Button 
                    variant="ghost" 
                    className="w-full text-xs" 
                    onClick={() => setShowAll(true)}
                  >
                    Show {leadTasks.length - 5} more
                  </Button>
                )}
              </div>
            ) : (
              <div className="text-center py-6 text-muted-foreground">
                <CheckSquare className="h-12 w-12 mx-auto mb-2 opacity-20" />
                <p>No lead-related tasks</p>
                <Button 
                  variant="link" 
                  className="mt-2"
                  onClick={() => navigate('/crm/leads')}
                >
                  View leads
                </Button>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default FollowUpReminders;
