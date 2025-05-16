import React from 'react';
import { format } from 'date-fns';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from "@/components/ui/scroll-area"
import { Transaction } from '@/types';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { ArrowDown, ArrowUp } from 'lucide-react';
import { TransactionType } from '@/types';

interface MemberTransactionHistoryProps {
  transactions: Transaction[];
}

const MemberTransactionHistory: React.FC<MemberTransactionHistoryProps> = ({ transactions }) => {
  if (!transactions || transactions.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Transaction History</CardTitle>
          <CardDescription>Recent transactions for this member</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">No transactions found for this member.</p>
        </CardContent>
      </Card>
    );
  }

// Define a function to get the appropriate color class based on transaction type
const getTypeColorClass = (type: TransactionType): string => {
  switch (type) {
    case 'income':
      return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
    case 'expense':
      return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
    case 'refund':
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
  }
};

// Define a function to get the appropriate text color based on transaction type
const getTextColorClass = (type: TransactionType): string => {
  switch (type) {
    case 'income':
      return 'text-green-600 dark:text-green-400';
    case 'expense':
      return 'text-red-600 dark:text-red-400';
    case 'refund':
      return 'text-blue-600 dark:text-blue-400';
    default:
      return 'text-gray-600 dark:text-gray-400';
  }
};

  return (
    <Card>
      <CardHeader>
        <CardTitle>Transaction History</CardTitle>
        <CardDescription>Recent transactions for this member</CardDescription>
      </CardHeader>
      <CardContent className="overflow-auto">
        <ScrollArea>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">Date</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Type</TableHead>
                <TableHead className="text-right">Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transactions.map((transaction) => (
                <TableRow key={transaction.id}>
                  <TableCell className="font-medium">{format(new Date(transaction.date), 'MMM d, yyyy')}</TableCell>
                  <TableCell>{transaction.description}</TableCell>
                  <TableCell>
                    <Badge className={getTypeColorClass(transaction.type)}>
                      {transaction.type === 'income' ? <ArrowUp className="mr-2 h-4 w-4" /> : transaction.type === 'expense' ? <ArrowDown className="mr-2 h-4 w-4" /> : null}
                      {transaction.type}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right font-medium">
                    <span className={getTextColorClass(transaction.type)}>
                      {transaction.type === 'expense' ? '-' : '+'}
                      {transaction.amount}
                    </span>
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
