
import React from 'react';
import { format } from 'date-fns';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Transaction } from '@/types/finance';

interface MemberTransactionHistoryProps {
  transactions: Transaction[];
}

const MemberTransactionHistory: React.FC<MemberTransactionHistoryProps> = ({ transactions }) => {

const formatDate = (transaction: Transaction) => {
  const dateString = transaction.transaction_date || transaction.date || transaction.created_at;
  if (!dateString) return 'N/A';
  
  try {
    return format(new Date(dateString), 'PP');
  } catch (error) {
    console.error('Error formatting date:', error);
    return dateString;
  }
};

// Update the badge function to accept the extended TransactionType
const getBadgeVariant = (type: string) => {
  switch(type) {
    case 'income': return 'success';
    case 'expense': return 'destructive';
    case 'refund': return 'warning';
    default: return 'secondary';
  }
};

  return (
    <Card>
      <CardHeader>
        <CardTitle>Transaction History</CardTitle>
        <CardDescription>A history of all transactions for this member.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <ScrollArea className="h-[400px] w-full rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">Date</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Type</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transactions.map((transaction) => (
                <TableRow key={transaction.id}>
                  <TableCell className="font-medium">{formatDate(transaction)}</TableCell>
                  <TableCell>{transaction.description}</TableCell>
                  <TableCell>{transaction.amount}</TableCell>
                  <TableCell>
                    <Badge variant={getBadgeVariant(transaction.type)}>
                      {transaction.type}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default MemberTransactionHistory;
