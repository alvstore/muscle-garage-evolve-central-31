
import React, { useState } from 'react';
import { format, parseISO } from 'date-fns';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription 
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import {
  Mail,
  MessageCircle,
  Phone,
  Calendar,
  Search,
  Filter,
  Download,
  Eye
} from 'lucide-react';
import { FollowUpHistory, FollowUpType } from '@/types/crm';

// Mock follow-up history data
const mockFollowUpHistory: FollowUpHistory[] = [
  {
    id: "1",
    lead_id: "lead1",
    type: "email",
    content: "Hello John, I'm following up on our conversation about our gym membership options. Would you like to schedule a tour of our facilities?",
    sent_by: "user1",
    sent_at: "2023-07-01T10:30:00Z",
    status: "delivered",
    response: "Yes, I would like to schedule a tour for tomorrow afternoon if possible.",
    response_at: "2023-07-01T14:15:00Z",
  },
  {
    id: "2",
    lead_id: "lead2",
    template_id: "template1",
    type: "sms",
    content: "Hi Sarah, just a reminder about your free trial session scheduled for tomorrow at 10 AM. Looking forward to seeing you!",
    sent_by: "user1",
    sent_at: "2023-07-02T09:00:00Z",
    status: "delivered",
  },
  {
    id: "3",
    lead_id: "lead3",
    type: "call",
    content: "Called to discuss membership options, particularly the annual plan with personal training sessions.",
    sent_by: "user2",
    sent_at: "2023-07-03T11:45:00Z",
    status: "delivered",
    response: "Lead was interested in the Gold plan, requested email with detailed pricing.",
    response_at: "2023-07-03T11:55:00Z",
  },
  {
    id: "4",
    lead_id: "lead4",
    template_id: "template2",
    type: "whatsapp",
    content: "Hi Emily, here's the digital brochure for our gym as requested. Let me know if you have any questions!",
    sent_by: "user1",
    sent_at: "2023-07-04T15:20:00Z",
    status: "read",
  },
  {
    id: "5",
    lead_id: "lead2",
    type: "email",
    content: "Follow-up after your trial session yesterday. How was your experience? Would you be interested in joining our gym?",
    sent_by: "user2",
    sent_at: "2023-07-05T14:00:00Z",
    status: "failed",
  }
];

// Map of lead IDs to names for display purpose
const leadNames = {
  "lead1": "John Doe",
  "lead2": "Sarah Johnson",
  "lead3": "Mike Williams",
  "lead4": "Emily Davis"
};

const staffNames = {
  "user1": "Alex Trainer",
  "user2": "Taylor Manager"
};

const FollowUpHistoryComponent: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  
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
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "sent":
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">Sent</Badge>;
      case "delivered":
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Delivered</Badge>;
      case "read":
        return <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">Read</Badge>;
      case "failed":
        return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">Failed</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };
  
  const filteredHistory = mockFollowUpHistory.filter(history => {
    // Filter by search term
    const searchMatch = 
      leadNames[history.lead_id as keyof typeof leadNames]?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      history.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (history.response?.toLowerCase().includes(searchTerm.toLowerCase()) || false);
    
    // Filter by type
    const typeMatch = typeFilter === 'all' || history.type === typeFilter;
    
    // Filter by status
    const statusMatch = statusFilter === 'all' || history.status === statusFilter;
    
    return searchMatch && typeMatch && statusMatch;
  });

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
          <div>
            <CardTitle>Follow-up History</CardTitle>
            <CardDescription>View all previous communications with leads</CardDescription>
          </div>
          <Button variant="outline" size="sm" className="mt-2 sm:mt-0">
            <Download className="h-4 w-4 mr-1" />
            Export
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 space-y-2 sm:space-y-0">
          <div className="w-full sm:w-auto flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
            <div className="relative w-full sm:w-[300px]">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search history..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex space-x-2">
              <Select
                value={typeFilter}
                onValueChange={setTypeFilter}
              >
                <SelectTrigger className="w-[140px]">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Filter type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="email">Email</SelectItem>
                  <SelectItem value="sms">SMS</SelectItem>
                  <SelectItem value="whatsapp">WhatsApp</SelectItem>
                  <SelectItem value="call">Call</SelectItem>
                  <SelectItem value="meeting">Meeting</SelectItem>
                </SelectContent>
              </Select>
              
              <Select
                value={statusFilter}
                onValueChange={setStatusFilter}
              >
                <SelectTrigger className="w-[160px]">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Filter status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="sent">Sent</SelectItem>
                  <SelectItem value="delivered">Delivered</SelectItem>
                  <SelectItem value="read">Read</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
        
        {filteredHistory.length > 0 ? (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Lead</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Content</TableHead>
                  <TableHead>Sent By</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Response</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredHistory.map((history) => (
                  <TableRow key={history.id}>
                    <TableCell className="font-medium">
                      {leadNames[history.lead_id as keyof typeof leadNames] || history.lead_id}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        {getTypeIcon(history.type)}
                        <span className="ml-2 capitalize">{history.type}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      {format(parseISO(history.sent_at), "MMM dd, yyyy HH:mm")}
                    </TableCell>
                    <TableCell className="max-w-[200px] truncate">
                      <div className="tooltip" title={history.content}>
                        {history.content}
                      </div>
                    </TableCell>
                    <TableCell>
                      {staffNames[history.sent_by as keyof typeof staffNames] || history.sent_by}
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(history.status)}
                    </TableCell>
                    <TableCell>
                      {history.response ? (
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4 mr-1" />
                          View
                        </Button>
                      ) : (
                        <span className="text-muted-foreground text-sm">No response</span>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="text-center py-10">
            <MessageCircle className="h-10 w-10 mx-auto text-muted-foreground mb-2" />
            <p className="text-muted-foreground">No follow-up history found</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default FollowUpHistoryComponent;
