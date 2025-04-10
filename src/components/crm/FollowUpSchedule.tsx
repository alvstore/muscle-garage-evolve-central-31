
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { format, addDays } from 'date-fns';
import { 
  Calendar, 
  Clock, 
  Send, 
  User, 
  Mail, 
  MessageCircle,
  Phone,
  Plus,
  Calendar as CalendarIcon
} from 'lucide-react';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Calendar as CalendarPicker } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { Lead, FollowUpType } from '@/types/crm';

// Mock scheduled follow-ups data
const mockScheduledFollowUps = [
  {
    id: "1",
    leadId: "lead1",
    leadName: "John Doe",
    type: "email" as FollowUpType,
    scheduledFor: addDays(new Date(), 1).toISOString(),
    subject: "Membership Plan Inquiry",
    content: "Follow up about the Gold Membership plan discussion",
    status: "scheduled"
  },
  {
    id: "2",
    leadId: "lead2",
    leadName: "Sarah Johnson",
    type: "call" as FollowUpType,
    scheduledFor: addDays(new Date(), 2).toISOString(),
    subject: "Personal Training Interest",
    content: "Call to discuss personal training options",
    status: "scheduled"
  },
  {
    id: "3",
    leadId: "lead3",
    leadName: "Mike Williams",
    type: "sms" as FollowUpType,
    scheduledFor: addDays(new Date(), 3).toISOString(),
    subject: "Gym Tour Reminder",
    content: "Reminder about the scheduled gym tour on Friday",
    status: "scheduled"
  }
];

// Mock lead data for dropdown
const mockLeads: Lead[] = [
  {
    id: "lead1",
    name: "John Doe",
    email: "john@example.com",
    phone: "555-1234",
    source: "website",
    status: "contacted",
    funnelStage: "warm",
    createdAt: "2023-06-15T10:30:00Z",
    notes: "Interested in Gold Membership",
  },
  {
    id: "lead2",
    name: "Sarah Johnson",
    email: "sarah@example.com",
    phone: "555-5678",
    source: "referral",
    status: "qualified",
    funnelStage: "hot",
    createdAt: "2023-06-10T14:45:00Z",
    notes: "Looking for personal training options",
  },
  {
    id: "lead3",
    name: "Mike Williams",
    email: "mike@example.com",
    phone: "555-9012",
    source: "walk-in",
    status: "contacted",
    funnelStage: "warm",
    createdAt: "2023-06-12T09:15:00Z",
    notes: "Scheduled for a gym tour",
  }
];

const scheduleSchema = z.object({
  leadId: z.string().min(1, { message: "Lead is required" }),
  type: z.enum(["email", "sms", "whatsapp", "call", "meeting"]),
  scheduledDate: z.date(),
  subject: z.string().min(3, { message: "Subject is required" }),
  content: z.string().min(10, { message: "Content must be at least 10 characters" }),
});

interface ScheduledFollowUp {
  id: string;
  leadId: string;
  leadName: string;
  type: FollowUpType;
  scheduledFor: string;
  subject: string;
  content: string;
  status: "scheduled" | "sent" | "cancelled";
}

const FollowUpSchedule: React.FC = () => {
  const [scheduledFollowUps, setScheduledFollowUps] = useState<ScheduledFollowUp[]>(mockScheduledFollowUps);
  
  const form = useForm<z.infer<typeof scheduleSchema>>({
    resolver: zodResolver(scheduleSchema),
    defaultValues: {
      leadId: "",
      type: "email",
      scheduledDate: new Date(),
      subject: "",
      content: "",
    },
  });
  
  const onSubmit = (values: z.infer<typeof scheduleSchema>) => {
    const lead = mockLeads.find(l => l.id === values.leadId);
    if (!lead) return;
    
    const newFollowUp: ScheduledFollowUp = {
      id: `followup-${Date.now()}`,
      leadId: values.leadId,
      leadName: lead.name,
      type: values.type as FollowUpType,
      scheduledFor: values.scheduledDate.toISOString(),
      subject: values.subject,
      content: values.content,
      status: "scheduled"
    };
    
    setScheduledFollowUps([...scheduledFollowUps, newFollowUp]);
    form.reset();
    toast.success("Follow-up scheduled successfully");
  };

  const getTypeIcon = (type: FollowUpType) => {
    switch (type) {
      case "email":
        return <Mail className="h-4 w-4" />;
      case "sms":
        return <MessageCircle className="h-4 w-4" />;
      case "whatsapp":
        return <MessageCircle className="h-4 w-4" />;
      case "call":
        return <Phone className="h-4 w-4" />;
      case "meeting":
        return <Calendar className="h-4 w-4" />;
    }
  };
  
  const cancelFollowUp = (id: string) => {
    setScheduledFollowUps(scheduledFollowUps.map(f => 
      f.id === id ? { ...f, status: "cancelled" } : f
    ));
    toast.success("Follow-up cancelled");
  };
  
  const sendNow = (id: string) => {
    setScheduledFollowUps(scheduledFollowUps.map(f => 
      f.id === id ? { ...f, status: "sent" } : f
    ));
    toast.success("Follow-up sent successfully");
  };

  return (
    <Tabs defaultValue="scheduled">
      <TabsList className="mb-4">
        <TabsTrigger value="scheduled">Scheduled Follow-ups</TabsTrigger>
        <TabsTrigger value="create">Create New</TabsTrigger>
      </TabsList>
      
      <TabsContent value="scheduled">
        <Card>
          <CardHeader>
            <CardTitle>Scheduled Follow-ups</CardTitle>
            <CardDescription>
              View and manage upcoming follow-ups with leads
            </CardDescription>
          </CardHeader>
          <CardContent>
            {scheduledFollowUps.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Lead</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Scheduled For</TableHead>
                    <TableHead>Subject</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {scheduledFollowUps.map((followUp) => (
                    <TableRow key={followUp.id}>
                      <TableCell className="font-medium">{followUp.leadName}</TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          {getTypeIcon(followUp.type)}
                          <span className="ml-2 capitalize">{followUp.type}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        {format(new Date(followUp.scheduledFor), "MMM dd, yyyy")}
                      </TableCell>
                      <TableCell>{followUp.subject}</TableCell>
                      <TableCell>
                        {followUp.status === "scheduled" && (
                          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                            Scheduled
                          </Badge>
                        )}
                        {followUp.status === "sent" && (
                          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                            Sent
                          </Badge>
                        )}
                        {followUp.status === "cancelled" && (
                          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                            Cancelled
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        {followUp.status === "scheduled" && (
                          <div className="flex justify-end space-x-1">
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => sendNow(followUp.id)}
                            >
                              <Send className="h-4 w-4 mr-1" />
                              Send Now
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => cancelFollowUp(followUp.id)}
                            >
                              Cancel
                            </Button>
                          </div>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="text-center py-10">
                <Calendar className="h-10 w-10 mx-auto text-muted-foreground mb-2" />
                <p className="text-muted-foreground">No scheduled follow-ups</p>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="mt-4"
                  onClick={() => form.reset()}
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Create Follow-up
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </TabsContent>
      
      <TabsContent value="create">
        <Card>
          <CardHeader>
            <CardTitle>Schedule New Follow-up</CardTitle>
            <CardDescription>
              Create a scheduled follow-up for a lead
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="leadId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Lead</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select lead" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {mockLeads.map(lead => (
                              <SelectItem key={lead.id} value={lead.id}>
                                <div className="flex items-center">
                                  <User className="h-4 w-4 mr-2" />
                                  {lead.name}
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="type"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Follow-up Type</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="email">
                              <div className="flex items-center">
                                <Mail className="h-4 w-4 mr-2" />
                                Email
                              </div>
                            </SelectItem>
                            <SelectItem value="sms">
                              <div className="flex items-center">
                                <MessageCircle className="h-4 w-4 mr-2" />
                                SMS
                              </div>
                            </SelectItem>
                            <SelectItem value="whatsapp">
                              <div className="flex items-center">
                                <MessageCircle className="h-4 w-4 mr-2" />
                                WhatsApp
                              </div>
                            </SelectItem>
                            <SelectItem value="call">
                              <div className="flex items-center">
                                <Phone className="h-4 w-4 mr-2" />
                                Call
                              </div>
                            </SelectItem>
                            <SelectItem value="meeting">
                              <div className="flex items-center">
                                <Calendar className="h-4 w-4 mr-2" />
                                Meeting
                              </div>
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="scheduledDate"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Schedule Date</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant={"outline"}
                                className={cn(
                                  "w-full pl-3 text-left font-normal",
                                  !field.value && "text-muted-foreground"
                                )}
                              >
                                {field.value ? (
                                  format(field.value, "PPP")
                                ) : (
                                  <span>Pick a date</span>
                                )}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <CalendarPicker
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
                              initialFocus
                              disabled={(date) => date < new Date()}
                            />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="subject"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Subject</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter subject" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <FormField
                  control={form.control}
                  name="content"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Content</FormLabel>
                      <FormControl>
                        <textarea
                          className="flex min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                          placeholder="Enter follow-up message content"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="flex justify-end">
                  <Button type="submit">
                    <Clock className="h-4 w-4 mr-2" />
                    Schedule Follow-up
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
};

export default FollowUpSchedule;
