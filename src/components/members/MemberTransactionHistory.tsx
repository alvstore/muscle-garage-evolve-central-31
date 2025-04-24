
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { format } from 'date-fns';
import { TransactionType, FinancialTransaction } from '@/types/finance';

interface MemberTransactionHistoryProps {
  memberId: string;
}

const MemberTransactionHistory = ({ memberId }: MemberTransactionHistoryProps) => {
  // This would normally fetch data from an API or database
  const transactions: FinancialTransaction[] = [
    {
      id: '1',
      type: 'income',
      amount: 5000,
      description: 'Monthly membership fee',
      transaction_date: new Date().toISOString(),
      payment_method: 'credit_card',
      recorded_by: 'John Doe',
      branch_id: 'branch-1',
      category_id: 'cat-1',
      reference_id: null,
      recurring: false,
      recurring_period: null,
      transaction_id: 'txn-123'
    },
    {
      id: '2',
      type: 'income',
      amount: 1500,
      description: 'Personal training session',
      transaction_date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      payment_method: 'cash',
      recorded_by: 'Sarah Smith',
      branch_id: 'branch-1',
      category_id: 'cat-2',
      reference_id: null,
      recurring: false,
      recurring_period: null,
      transaction_id: 'txn-124'
    },
    {
      id: '3',
      type: 'expense',
      amount: -250,
      description: 'Refund - unused sessions',
      transaction_date: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
      payment_method: 'card',
      recorded_by: 'Mike Johnson',
      branch_id: 'branch-1',
      category_id: 'cat-3',
      reference_id: null,
      recurring: false,
      recurring_period: null,
      transaction_id: 'txn-125'
    }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Transaction History</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Method</TableHead>
              <TableHead>Type</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transactions.length > 0 ? (
              transactions.map((transaction) => (
                <TableRow key={transaction.id}>
                  <TableCell>
                    {format(new Date(transaction.transaction_date), 'PP')}
                  </TableCell>
                  <TableCell>{transaction.description}</TableCell>
                  <TableCell className={transaction.type === 'income' ? 'text-green-600' : 'text-red-600'}>
                    {transaction.type === 'income' ? '+' : '-'} ₹{Math.abs(transaction.amount).toLocaleString()}
                  </TableCell>
                  <TableCell className="capitalize">{transaction.payment_method}</TableCell>
                  <TableCell className="capitalize">
                    <span className={`px-2 py-1 rounded-full text-xs ${transaction.type === 'income' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {transaction.type}
                    </span>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-4 text-muted-foreground">
                  No transaction history found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default MemberTransactionHistory;
