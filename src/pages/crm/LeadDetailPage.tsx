import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container } from '@/components/ui/container';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { leadService } from '@/services/leadService';
import { leadScoringService } from '@/services/leadScoringService';
import { leadConversionService } from '@/services/leadConversionService';
import { useBranch } from '@/hooks/use-branches';
import { Skeleton } from '@/components/ui/skeleton';
import { format, parseISO } from 'date-fns';
import { toast } from 'sonner';
import { 
  User, 
  Mail, 
  Phone, 
  Tag, 
  Calendar, 
  Clock, 
  ArrowRight, 
  Edit, 
  Trash2,
  MessageCircle,
  UserPlus,
  BarChart3,
  Loader2
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import LeadTimeline from '@/components/crm/LeadTimeline';
import LeadConversion from '@/components/crm/LeadConversion';
import LeadFollowUpForm from '@/components/crm/LeadFollowUpForm';

const LeadDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState('overview');
  const [showConversionDialog, setShowConversionDialog] = useState(false);

  const { currentBranch } = useBranch();

  // Fetch lead data
  const { data: lead, isLoading, isError, refetch } = useQuery({
    queryKey: ['lead', id, currentBranch?.id],
    queryFn: async () => {
      if (!currentBranch?.id || !id) {
        throw new Error('Branch ID and Lead ID are required');
      }
      const lead = await leadService.getLeadById(id, currentBranch.id);
      if (!lead) throw new Error('Lead not found');
      return lead;
    },
    enabled: !!id && !!currentBranch?.id,
  });

  // Calculate lead score
  const calculateScoreMutation = useMutation({
    mutationFn: () => leadScoringService.calculateLeadScore(id as string),
    onSuccess: (score) => {
      queryClient.invalidateQueries({ queryKey: ['lead', id] });
      toast.success(`Lead score updated: ${score}/100`);
    },
    onError: () => {
      toast.error('Failed to calculate lead score');
    }
  });

  // Update lead stage
  const updateStageMutation = useMutation({
    mutationFn: (stage: 'cold' | 'warm' | 'hot' | 'won' | 'lost') => 
      leadConversionService.updateLeadStage(id as string, stage),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lead', id] });
      toast.success('Lead stage updated successfully');
    },
    onError: () => {
      toast.error('Failed to update lead stage');
    }
  });

  // Schedule follow-up
  const scheduleFollowUpMutation = useMutation({
    mutationFn: (data: {
      type: 'email' | 'sms' | 'call' | 'meeting' | 'whatsapp';
      scheduledFor: string;
      subject: string;
      content: string;
    }) => leadConversionService.scheduleFollowUp(id as string, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['followUpHistory', id] });
      toast.success('Follow-up scheduled successfully');
    },
    onError: () => {
      toast.error('Failed to schedule follow-up');
    }
  });

  // Delete lead
  const deleteLeadMutation = useMutation({
    mutationFn: () => leadService.deleteLead(id as string),
    onSuccess: () => {
      toast.success('Lead deleted successfully');
      navigate('/crm/leads');
    },
    onError: () => {
      toast.error('Failed to delete lead');
    }
  });

  // Get stage badge
  const getStageBadge = (stage: string) => {
    switch (stage) {
      case 'cold':
        return <Badge className="bg-blue-50 text-blue-600">Cold</Badge>;
      case 'warm':
        return <Badge className="bg-yellow-50 text-yellow-600">Warm</Badge>;
      case 'hot':
        return <Badge className="bg-red-50 text-red-600">Hot</Badge>;
      case 'won':
        return <Badge className="bg-green-50 text-green-600">Won</Badge>;
      case 'lost':
        return <Badge className="bg-gray-50 text-gray-600">Lost</Badge>;
      default:
        return <Badge>{stage}</Badge>;
    }
  };

  // Handle quick follow-up
  const handleQuickFollowUp = (type: 'call' | 'email' | 'meeting' | 'whatsapp') => {
    if (!lead) return;

    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    scheduleFollowUpMutation.mutate({
      type,
      scheduledFor: tomorrow.toISOString(),
      subject: `Follow-up with ${lead.name}`,
      content: `Scheduled ${type} follow-up with ${lead.name}`
    });
  };

  if (isLoading) {
    return (
      <Container>
        <div className="py-6">
          <Skeleton className="h-10 w-1/3 mb-6" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-1">
              <Skeleton className="h-64 w-full" />
            </div>
            <div className="md:col-span-2">
              <Skeleton className="h-64 w-full" />
            </div>
          </div>
        </div>
      </Container>
    );
  }

  if (isError || !lead) {
    return (
      <Container>
        <div className="py-6">
          <h1 className="text-2xl font-bold mb-6">Lead not found</h1>
          <Button onClick={() => navigate('/crm/leads')}>Back to Leads</Button>
        </div>
      </Container>
    );
  }

  return (
    <Container>
      <div className="py-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">{lead.name}</h1>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => navigate(`/crm/leads/edit/${id}`)}
            >
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Button>
            <Button 
              variant="destructive" 
              size="sm"
              onClick={() => {
                if (window.confirm('Are you sure you want to delete this lead?')) {
                  deleteLeadMutation.mutate();
                }
              }}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Lead Info Card */}
          <div className="md:col-span-1 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Lead Information</CardTitle>
                <div className="flex items-center gap-2 mt-2">
                  {getStageBadge(lead.funnel_stage)}
                  <Badge variant="outline" className="ml-2">
                    {lead.source}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-3">
                  <Mail className="h-4 w-4 mt-1 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Email</p>
                    <p className="text-sm text-muted-foreground">{lead.email || 'Not provided'}</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <Phone className="h-4 w-4 mt-1 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Phone</p>
                    <p className="text-sm text-muted-foreground">{lead.phone || 'Not provided'}</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <Calendar className="h-4 w-4 mt-1 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Last Contact</p>
                    <p className="text-sm text-muted-foreground">
                      {lead.last_contact_date 
                        ? format(parseISO(lead.last_contact_date), 'MMM dd, yyyy')
                        : 'Never contacted'}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <Clock className="h-4 w-4 mt-1 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Next Follow-up</p>
                    <p className="text-sm text-muted-foreground">
                      {lead.follow_up_date 
                        ? format(parseISO(lead.follow_up_date), 'MMM dd, yyyy')
                        : 'No follow-up scheduled'}
                    </p>
                  </div>
                </div>
                
                {lead.tags && lead.tags.length > 0 && (
                  <div className="flex items-start gap-3">
                    <Tag className="h-4 w-4 mt-1 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Tags</p>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {lead.tags.map((tag, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
                
                {lead.interests && lead.interests.length > 0 && (
                  <div className="flex items-start gap-3">
                    <Tag className="h-4 w-4 mt-1 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Interests</p>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {lead.interests.map((interest, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {interest}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
                
                {lead.notes && (
                  <div className="border-t pt-4 mt-4">
                    <p className="text-sm font-medium mb-1">Notes</p>
                    <p className="text-sm text-muted-foreground whitespace-pre-line">
                      {lead.notes}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Lead Score Card */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Lead Score</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="text-2xl font-bold">{(lead as any).score || 0}/100</div>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => calculateScoreMutation.mutate()}
                    disabled={calculateScoreMutation.isPending}
                  >
                    {calculateScoreMutation.isPending ? (
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    ) : (
                      <BarChart3 className="h-4 w-4 mr-2" />
                    )}
                    Recalculate
                  </Button>
                </div>
                <div className="mt-4">
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div 
                      className="bg-primary h-2.5 rounded-full" 
                      style={{ width: `${(lead as any).score || 0}%` }}
                    ></div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions Card */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="grid grid-cols-2 gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleQuickFollowUp('call')}
                    disabled={scheduleFollowUpMutation.isPending}
                  >
                    <Phone className="h-4 w-4 mr-2" />
                    Call
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleQuickFollowUp('email')}
                    disabled={scheduleFollowUpMutation.isPending}
                  >
                    <Mail className="h-4 w-4 mr-2" />
                    Email
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleQuickFollowUp('meeting')}
                    disabled={scheduleFollowUpMutation.isPending}
                  >
                    <Calendar className="h-4 w-4 mr-2" />
                    Meeting
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleQuickFollowUp('whatsapp')}
                    disabled={scheduleFollowUpMutation.isPending}
                  >
                    <MessageCircle className="h-4 w-4 mr-2" />
                    WhatsApp
                  </Button>
                </div>

                <div className="pt-2 border-t">
                  <p className="text-sm font-medium mb-2">Move to Stage</p>
                  <div className="grid grid-cols-3 gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      className={lead.funnel_stage === 'cold' ? 'border-blue-500' : ''}
                      onClick={() => updateStageMutation.mutate('cold')}
                      disabled={updateStageMutation.isPending}
                    >
                      Cold
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      className={lead.funnel_stage === 'warm' ? 'border-yellow-500' : ''}
                      onClick={() => updateStageMutation.mutate('warm')}
                      disabled={updateStageMutation.isPending}
                    >
                      Warm
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      className={lead.funnel_stage === 'hot' ? 'border-red-500' : ''}
                      onClick={() => updateStageMutation.mutate('hot')}
                      disabled={updateStageMutation.isPending}
                    >
                      Hot
                    </Button>
                  </div>
                </div>

                <div className="pt-2">
                  <Dialog open={showConversionDialog} onOpenChange={setShowConversionDialog}>
                    <DialogTrigger asChild>
                      <Button className="w-full">
                        <UserPlus className="h-4 w-4 mr-2" />
                        Convert to Member
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-3xl" aria-describedby="lead-conversion-description">
                      <DialogHeader>
                        <DialogTitle>Convert Lead to Member</DialogTitle>
                        <p id="lead-conversion-description" className="text-sm text-muted-foreground">
                          Convert this lead to a full member with access to the gym facilities and services.
                        </p>
                      </DialogHeader>
                      <LeadConversion 
                        lead={lead} 
                        onSuccess={() => {
                          setShowConversionDialog(false);
                          navigate('/crm/leads');
                        }}
                        onCancel={() => setShowConversionDialog(false)}
                      />
                    </DialogContent>
                  </Dialog>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content Area */}
          <div className="md:col-span-2">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="mb-4">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="timeline">Timeline</TabsTrigger>
                <TabsTrigger value="followup">Schedule Follow-up</TabsTrigger>
              </TabsList>
              
              <TabsContent value="overview" className="space-y-6">
                <LeadTimeline leadId={id as string} />
              </TabsContent>
              
              <TabsContent value="timeline" className="space-y-6">
                <LeadTimeline leadId={id as string} />
              </TabsContent>

              <TabsContent value="followup" className="space-y-6">
                {lead && (
                  <LeadFollowUpForm 
                    lead={lead} 
                    onSuccess={() => {
                      setActiveTab('timeline');
                      refetch();
                    }}
                    onCancel={() => setActiveTab('timeline')}
                  />
                )}
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </Container>
  );
};

export default LeadDetailPage;
