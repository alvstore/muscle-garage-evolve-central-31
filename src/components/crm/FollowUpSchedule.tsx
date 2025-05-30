
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar, Clock, Phone, Mail, MessageCircle, Video, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { Lead, FollowUp, FollowUpType } from '@/types/crm/crm';

const FollowUpSchedule = () => {
  const [followUps, setFollowUps] = useState<FollowUp[]>([]);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [newFollowUp, setNewFollowUp] = useState({
    lead_id: '',
    type: 'email' as FollowUpType,
    content: '',
    scheduled_at: '',
  });

  // Mock lead for development
  const mockLead: Lead = {
    id: 'mock-lead-1',
    name: 'John Doe',
    email: 'john@example.com',
    status: 'new',
    source: 'website',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    funnel_stage: 'cold',
  };

  useEffect(() => {
    fetchFollowUps();
    fetchLeads();
  }, []);

  const fetchFollowUps = async () => {
    try {
      const { data, error } = await supabase
        .from('follow_up_history')
        .select('*')
        .order('scheduled_at', { ascending: true });

      if (error) throw error;
      setFollowUps(data || []);
    } catch (error) {
      console.error('Error fetching follow-ups:', error);
      toast.error('Failed to fetch follow-ups');
    }
  };

  const fetchLeads = async () => {
    try {
      const { data, error } = await supabase
        .from('leads')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // Add mock lead for development
      const leadsWithMock = data ? [mockLead, ...data] : [mockLead];
      setLeads(leadsWithMock);
    } catch (error) {
      console.error('Error fetching leads:', error);
      setLeads([mockLead]); // Fallback to mock data
    } finally {
      setIsLoading(false);
    }
  };

  const handleScheduleFollowUp = async () => {
    try {
      if (!newFollowUp.lead_id || !newFollowUp.content || !newFollowUp.scheduled_at) {
        toast.error('Please fill in all required fields');
        return;
      }

      const { data, error } = await supabase
        .from('follow_up_history')
        .insert([{
          ...newFollowUp,
          status: 'pending',
        }])
        .select();

      if (error) throw error;

      if (data) {
        setFollowUps([...followUps, data[0]]);
        setNewFollowUp({
          lead_id: '',
          type: 'email' as FollowUpType,
          content: '',
          scheduled_at: '',
        });
        setShowForm(false);
        toast.success('Follow-up scheduled successfully');
      }
    } catch (error) {
      console.error('Error scheduling follow-up:', error);
      toast.error('Failed to schedule follow-up');
    }
  };

  const handleDeleteFollowUp = async (id: string) => {
    try {
      const { error } = await supabase
        .from('follow_up_history')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setFollowUps(followUps.filter(f => f.id !== id));
      toast.success('Follow-up deleted successfully');
    } catch (error) {
      console.error('Error deleting follow-up:', error);
      toast.error('Failed to delete follow-up');
    }
  };

  const getTypeIcon = (type: FollowUpType) => {
    switch (type) {
      case 'email': return <Mail className="h-4 w-4" />;
      case 'call': return <Phone className="h-4 w-4" />;
      case 'sms': return <MessageCircle className="h-4 w-4" />;
      case 'whatsapp': return <MessageCircle className="h-4 w-4" />;
      case 'meeting': return <Video className="h-4 w-4" />;
      default: return <Mail className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      case 'sent': return 'text-blue-600 bg-blue-100';
      case 'responded': return 'text-green-600 bg-green-100';
      case 'failed': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  if (isLoading) {
    return <div>Loading follow-ups...</div>;
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Follow-up Schedule
          </CardTitle>
          <Button onClick={() => setShowForm(!showForm)}>
            Schedule Follow-up
          </Button>
        </CardHeader>
        <CardContent>
          {showForm && (
            <div className="mb-6 p-4 border rounded-lg space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="lead">Lead</Label>
                  <Select
                    value={newFollowUp.lead_id}
                    onValueChange={(value) => setNewFollowUp({ ...newFollowUp, lead_id: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a lead" />
                    </SelectTrigger>
                    <SelectContent>
                      {leads.map((lead) => (
                        <SelectItem key={lead.id} value={lead.id}>
                          {lead.name} - {lead.email}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="type">Type</Label>
                  <Select
                    value={newFollowUp.type}
                    onValueChange={(value: FollowUpType) => setNewFollowUp({ ...newFollowUp, type: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="email">Email</SelectItem>
                      <SelectItem value="call">Phone Call</SelectItem>
                      <SelectItem value="sms">SMS</SelectItem>
                      <SelectItem value="whatsapp">WhatsApp</SelectItem>
                      <SelectItem value="meeting">Meeting</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label htmlFor="scheduled_at">Scheduled Date & Time</Label>
                <Input
                  id="scheduled_at"
                  type="datetime-local"
                  value={newFollowUp.scheduled_at}
                  onChange={(e) => setNewFollowUp({ ...newFollowUp, scheduled_at: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="content">Content</Label>
                <Textarea
                  id="content"
                  placeholder="Enter follow-up content..."
                  value={newFollowUp.content}
                  onChange={(e) => setNewFollowUp({ ...newFollowUp, content: e.target.value })}
                  rows={3}
                />
              </div>
              <div className="flex gap-2">
                <Button onClick={handleScheduleFollowUp}>Schedule</Button>
                <Button variant="outline" onClick={() => setShowForm(false)}>Cancel</Button>
              </div>
            </div>
          )}

          <div className="space-y-4">
            {followUps.length === 0 ? (
              <p className="text-center text-gray-500 py-8">No follow-ups scheduled</p>
            ) : (
              followUps.map((followUp) => {
                const lead = leads.find(l => l.id === followUp.lead_id);
                return (
                  <div key={followUp.id} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        {getTypeIcon(followUp.type)}
                        <div>
                          <h4 className="font-medium">{lead?.name || 'Unknown Lead'}</h4>
                          <p className="text-sm text-gray-600">{lead?.email}</p>
                          <p className="text-sm mt-2">{followUp.content}</p>
                          <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {new Date(followUp.scheduled_at).toLocaleString()}
                            </span>
                            <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(followUp.status)}`}>
                              {followUp.status}
                            </span>
                          </div>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteFollowUp(followUp.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FollowUpSchedule;
