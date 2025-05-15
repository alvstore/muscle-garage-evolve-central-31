
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { Transaction, FinancialTransaction } from '@/types/finance';

interface TransactionHistoryProps {
  transactions: Transaction[];
  isLoading?: boolean;
}

// Sample transactions if none provided
const sampleTransactions: Transaction[] = [
  {
    id: '1',
    type: 'income',
    amount: 5000,
    description: 'Membership Payment',
    transaction_date: new Date().toISOString(),
    payment_method: 'card',
  },
  {
    id: '2',
    type: 'income',
    amount: 1200,
    description: 'Personal Training Session',
    transaction_date: new Date(Date.now() - 86400000 * 7).toISOString(),
    payment_method: 'cash',
  },
  {
    id: '3',
    type: 'income',
    amount: 800,
    description: 'Supplement Purchase',
    transaction_date: new Date(Date.now() - 86400000 * 14).toISOString(),
    payment_method: 'online',
  }
];

const MemberTransactionHistory: React.FC<TransactionHistoryProps> = ({ 
  transactions = [], 
  isLoading = false 
}) => {
  
  // Use sample data if no transactions are provided (for demo purposes only)
  const displayTransactions = transactions.length > 0 ? transactions : sampleTransactions;
  
  // Format date
  const formatDate = (date: string) => {
    return format(new Date(date), 'PP');
  };
  
  // Format transaction type
  const getTypeColor = (type: 'income' | 'expense') => {
    return type === 'income' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';
  };
  
  // Format amount with currency symbol
  const formatAmount = (amount: number, type: 'income' | 'expense') => {
    return `${type === 'income' ? '+' : '-'} ₹${amount.toLocaleString()}`;
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Transaction History</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {isLoading ? (
            <div className="text-center py-6">Loading transactions...</div>
          ) : displayTransactions.length === 0 ? (
            <div className="text-center py-6 text-muted-foreground">
              No transactions found for this member.
            </div>
          ) : (
            displayTransactions.map((transaction) => (
              <div 
                key={transaction.id || transaction.transaction_id} 
                className="p-3 border rounded-lg hover:bg-accent/5 transition-colors"
              >
                <div className="flex justify-between">
                  <div>
                    <p className="font-medium">{transaction.description}</p>
                    <p className="text-sm text-muted-foreground">
                      {formatDate(transaction.transaction_date)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{formatAmount(transaction.amount, transaction.type)}</p>
                    <Badge variant="outline" className={`text-xs ${getTypeColor(transaction.type)}`}>
                      {transaction.payment_method || 'Unknown'}
                    </Badge>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default MemberTransactionHistory;
