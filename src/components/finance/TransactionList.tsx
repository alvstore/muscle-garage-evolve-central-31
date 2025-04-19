
import React, { useState, useEffect } from 'react';
import { 
  Table, 
  TableHeader, 
  TableRow, 
  TableHead, 
  TableBody, 
  TableCell 
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  FinancialTransaction, 
  TransactionType, 
  PaymentMethod 
} from '@/types/finance';
import { formatCurrency } from '@/utils/formatters';

interface TransactionListProps {
  webhookOnly?: boolean;
  transactionType?: string;
}

const TransactionList: React.FC<TransactionListProps> = ({ 
  webhookOnly = false,
  transactionType 
}) => {
  const [transactions, setTransactions] = useState<FinancialTransaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // In a real app, this would fetch data from an API
    // For now, we'll use mock data
    setTimeout(() => {
      const mockTransactions: FinancialTransaction[] = [
        {
          id: 'txn-1',
          type: 'income',
          amount: 15000,
          date: '2024-01-15',
          category: 'membership',
          description: 'Monthly membership - John Doe',
          recurring: true,
          recurringPeriod: 'monthly',
          paymentMethod: 'razorpay',
          createdBy: 'admin',
          createdAt: '2024-01-15T10:30:00',
          updatedAt: '2024-01-15T10:30:00'
        },
        {
          id: 'txn-2',
          type: 'expense',
          amount: 5000,
          date: '2024-01-18',
          category: 'utilities',
          description: 'Electricity bill - January',
          recurring: true,
          recurringPeriod: 'monthly',
          paymentMethod: 'bank-transfer',
          createdBy: 'admin',
          createdAt: '2024-01-18T14:20:00',
          updatedAt: '2024-01-18T14:20:00'
        },
        {
          id: 'txn-3',
          type: 'income',
          amount: 2500,
          date: '2024-01-20',
          category: 'personal-training',
          description: 'PT Session - Jane Smith',
          recurring: false,
          recurringPeriod: 'none',
          paymentMethod: 'cash',
          createdBy: 'staff-1',
          createdAt: '2024-01-20T16:45:00',
          updatedAt: '2024-01-20T16:45:00'
        }
      ];
      
      // Apply filters based on props
      let filteredTransactions = mockTransactions;
      
      // Filter by transaction type if specified
      if (transactionType) {
        filteredTransactions = filteredTransactions.filter(t => t.type === transactionType);
      }
      
      // Filter by webhook only if requested
      if (webhookOnly) {
        filteredTransactions = filteredTransactions.filter(t => t.paymentMethod === 'razorpay');
      }
        
      setTransactions(filteredTransactions);
      setLoading(false);
    }, 1000);
  }, [webhookOnly, transactionType]);

  const getPaymentMethodLabel = (method?: PaymentMethod) => {
    switch (method) {
      case 'razorpay': return 'Razorpay';
      case 'card': return 'Card';
      case 'cash': return 'Cash';
      case 'bank-transfer': return 'Bank Transfer';
      default: return 'Other';
    }
  };

  const getTransactionTypeColor = (type: TransactionType) => {
    return type === 'income' ? 'bg-green-500' : 'bg-red-500';
  };

  if (loading) {
    return <div className="text-center py-10">Loading transactions...</div>;
  }

  if (transactions.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-muted-foreground mb-4">No transactions found</p>
        <Button>Add Transaction</Button>
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Payment Method</TableHead>
            <TableHead>Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {transactions.map((transaction) => (
            <TableRow key={transaction.id}>
              <TableCell>{new Date(transaction.date).toLocaleDateString()}</TableCell>
              <TableCell>{transaction.description}</TableCell>
              <TableCell className="capitalize">{transaction.category.replace('-', ' ')}</TableCell>
              <TableCell>
                <div className="flex items-center">
                  <div className={`w-2 h-2 rounded-full mr-2 ${getTransactionTypeColor(transaction.type)}`} />
                  <span>{formatCurrency(transaction.amount)}</span>
                </div>
              </TableCell>
              <TableCell>
                <Badge variant="outline">{getPaymentMethodLabel(transaction.paymentMethod)}</Badge>
              </TableCell>
              <TableCell>
                <Button variant="ghost" size="sm">View</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default TransactionList;
