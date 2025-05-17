
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { formatCurrency } from "@/utils/stringUtils";
import { supabase } from '@/services/api/supabaseClient';
import { useAuth } from '@/hooks/use-auth';
import { toast } from 'sonner';

interface MemberInvoiceListProps {
  memberId?: string;
  showPendingOnly?: boolean;
  limit?: number;
}

interface Invoice {
  id: string;
  amount: number;
  issued_date: string;
  due_date: string;
  paid_date?: string;
  status: 'paid' | 'pending' | 'overdue';
  payment_method?: string;
}

const MemberInvoiceList: React.FC<MemberInvoiceListProps> = ({
  memberId,
  showPendingOnly = false,
  limit = 5
}) => {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  
  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        setIsLoading(true);
        
        // If viewing as a member, use current user's ID
        const queryMemberId = memberId || user?.id;
        
        if (!queryMemberId) {
          setInvoices([]);
          return;
        }
        
        // Build query
        let query = supabase
          .from('invoices')
          .select('*');
          
        // Filter by member ID if provided or if user role is member
        if (queryMemberId) {
          query = query.eq('member_id', queryMemberId);
        }
        
        // Filter by pending status if showPendingOnly is true
        if (showPendingOnly) {
          query = query.in('status', ['pending', 'overdue']);
        }
        
        // Order by due date and limit results
        query = query.order('due_date', { ascending: false }).limit(limit);
        
        const { data, error } = await query;
        
        if (error) throw error;
        
        setInvoices(data || []);
      } catch (error) {
        console.error('Error fetching invoices:', error);
        toast.error('Failed to load invoice data');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchInvoices();
  }, [user, memberId, showPendingOnly, limit]);
  
  // Helper function to get badge variant based on status
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'paid':
        return <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">Paid</Badge>;
      case 'pending':
        return <Badge variant="outline" className="border-amber-500 text-amber-500">Pending</Badge>;
      case 'overdue':
        return <Badge variant="destructive">Overdue</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Invoices</CardTitle>
        </CardHeader>
        <CardContent className="flex justify-center py-6">
          <div className="h-10 w-10 rounded-full border-4 border-t-accent animate-spin"></div>
        </CardContent>
      </Card>
    );
  }

  if (invoices.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{showPendingOnly ? "Pending Payments" : "Invoices"}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-muted-foreground py-6">No invoices found</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{showPendingOnly ? "Pending Payments" : "Invoices"}</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Invoice #</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Due Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {invoices.map((invoice) => (
              <TableRow key={invoice.id}>
                <TableCell className="font-medium">{invoice.id.substring(0, 8)}</TableCell>
                <TableCell>{formatCurrency(invoice.amount)}</TableCell>
                <TableCell>
                  {format(new Date(invoice.due_date), 'MMM d, yyyy')}
                </TableCell>
                <TableCell>{getStatusBadge(invoice.status)}</TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      if (invoice.status === 'paid') {
                        toast.info('Invoice is already paid.');
                      } else {
                        toast.info('Payment page will be implemented soon.');
                      }
                    }}
                  >
                    {invoice.status === 'paid' ? 'View' : 'Pay Now'}
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default MemberInvoiceList;
