import React, { useState } from 'react';
import { Container } from "@/components/ui/container";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink } from "@/components/ui/breadcrumb";
import { ChevronRight, Mail, Settings, Search, Filter, Download, Eye } from "lucide-react";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

// Mock email history data
const mockEmailHistory = [
  {
    id: "1",
    recipient: "john.doe@example.com",
    subject: "Welcome to Muscle Garage!",
    template: "Welcome Email",
    status: "delivered",
    sentAt: "2023-11-15T10:30:00Z",
    openedAt: "2023-11-15T11:45:00Z"
  },
  {
    id: "2",
    recipient: "jane.smith@example.com",
    subject: "Your Muscle Garage membership is expiring soon",
    template: "Membership Renewal Reminder",
    status: "delivered",
    sentAt: "2023-11-14T14:15:00Z",
    openedAt: "2023-11-14T16:20:00Z"
  },
  {
    id: "3",
    recipient: "mike.johnson@example.com",
    subject: "Your Muscle Garage Invoice",
    template: "New Invoice Notification",
    status: "delivered",
    sentAt: "2023-11-13T11:20:00Z",
    openedAt: null
  },
  {
    id: "4",
    recipient: "sarah.williams@example.com",
    subject: "Welcome to Muscle Garage!",
    template: "Welcome Email",
    status: "bounced",
    sentAt: "2023-11-12T09:45:00Z",
    openedAt: null
  },
  {
    id: "5",
    recipient: "robert.brown@example.com",
    subject: "Your Muscle Garage membership is expiring soon",
    template: "Membership Renewal Reminder",
    status: "delivered",
    sentAt: "2023-11-11T16:30:00Z",
    openedAt: "2023-11-11T18:10:00Z"
  }
];

const EmailHistoryPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [templateFilter, setTemplateFilter] = useState('all');
  const [viewingEmail, setViewingEmail] = useState<any>(null);

  // Filter emails based on search and filters
  const filteredEmails = mockEmailHistory.filter(email => {
    // Search filter
    const matchesSearch = searchQuery === '' || 
      email.recipient.toLowerCase().includes(searchQuery.toLowerCase()) ||
      email.subject.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Status filter
    const matchesStatus = statusFilter === 'all' || email.status === statusFilter;
    
    // Template filter
    const matchesTemplate = templateFilter === 'all' || email.template === templateFilter;
    
    return matchesSearch && matchesStatus && matchesTemplate;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'delivered':
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Delivered</Badge>;
      case 'bounced':
        return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">Bounced</Badge>;
      case 'pending':
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">Pending</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Email History</h1>
          <p className="text-muted-foreground">View sent email logs</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="h-9">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search emails..."
                className="pl-8 w-full"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[150px]">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="delivered">Delivered</SelectItem>
                  <SelectItem value="bounced">Bounced</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                </SelectContent>
              </Select>
              <Select value={templateFilter} onValueChange={setTemplateFilter}>
                <SelectTrigger className="w-[180px]">
                  <Mail className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Template" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Templates</SelectItem>
                  <SelectItem value="Welcome Email">Welcome Email</SelectItem>
                  <SelectItem value="Membership Renewal Reminder">Renewal Reminder</SelectItem>
                  <SelectItem value="New Invoice Notification">Invoice Notification</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Recipient</TableHead>
                  <TableHead>Subject</TableHead>
                  <TableHead>Template</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Sent Date</TableHead>
                  <TableHead>Opened</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredEmails.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                      No email logs found.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredEmails.map((email) => (
                    <TableRow key={email.id}>
                      <TableCell className="font-medium">{email.recipient}</TableCell>
                      <TableCell>{email.subject}</TableCell>
                      <TableCell>{email.template}</TableCell>
                      <TableCell>{getStatusBadge(email.status)}</TableCell>
                      <TableCell>{format(new Date(email.sentAt), 'MMM dd, yyyy HH:mm')}</TableCell>
                      <TableCell>
                        {email.openedAt 
                          ? format(new Date(email.openedAt), 'MMM dd, yyyy HH:mm')
                          : <span className="text-muted-foreground">Not opened</span>
                        }
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setViewingEmail(email)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Email View Dialog */}
      <Dialog open={!!viewingEmail} onOpenChange={(open) => !open && setViewingEmail(null)}>
        <DialogContent className="sm:max-w-[700px]">
          <DialogHeader>
            <DialogTitle>Email Details</DialogTitle>
          </DialogHeader>
          {viewingEmail && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Recipient</p>
                  <p>{viewingEmail.recipient}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Template</p>
                  <p>{viewingEmail.template}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Status</p>
                  <div>{getStatusBadge(viewingEmail.status)}</div>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Sent Date</p>
                  <p>{format(new Date(viewingEmail.sentAt), 'MMM dd, yyyy HH:mm')}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-sm font-medium text-muted-foreground">Subject</p>
                  <p>{viewingEmail.subject}</p>
                </div>
              </div>
              <div className="border rounded-md p-4 bg-gray-50">
                <p className="text-sm font-medium text-muted-foreground mb-2">Email Content</p>
                <div className="whitespace-pre-wrap">
                  {/* This would normally contain the actual email content */}
                  <p>Dear Member,</p>
                  <p>This is a preview of the email content that was sent to the recipient.</p>
                  <p>Best regards,<br />The Muscle Garage Team</p>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EmailHistoryPage;
