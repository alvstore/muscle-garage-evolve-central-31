
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
  Eye,
  Loader2,
  RefreshCw
} from 'lucide-react';
import { FollowUpHistory, FollowUpType } from '@/types/crm';
import { followUpService } from '@/services/followUpService';
import { useQuery } from '@tanstack/react-query';
import { useBranch } from '@/hooks/use-branch';

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

const FollowUpHistoryComponent = () => {
  const { currentBranch } = useBranch();
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  
  // Fix the incorrect argument count
  const { data: followUpHistory, isLoading, isError, refetch } = useQuery({
    queryKey: ['followUpHistory', currentBranch?.id],
    queryFn: () => followUpService.getFollowUpHistory(currentBranch?.id),
    enabled: !!currentBranch?.id,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
  
  // Filter the follow-up history based on search term and filters
  const filteredHistory = followUpHistory
    ? followUpHistory.filter(item => {
        // Search term filter
        const matchesSearch = 
          item.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (item.response && item.response.toLowerCase().includes(searchTerm.toLowerCase()));
        
        // Type filter
        const matchesType = typeFilter === 'all' || item.type === typeFilter;
        
        // Status filter
        const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
        
        return matchesSearch && matchesType && matchesStatus;
      })
    : [];

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

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <CardTitle>Follow-up History</CardTitle>
            <CardDescription>View all follow-up communications with leads</CardDescription>
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search follow-ups..."
                className="pl-8 w-full sm:w-[200px] md:w-[250px]"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
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
            <Button variant="outline" size="sm" className="flex items-center gap-1">
              <Download className="h-4 w-4" />
              <span>Export</span>
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 space-y-2 sm:space-y-0">
          <div className="w-full sm:w-auto flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
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
