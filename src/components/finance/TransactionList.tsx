
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { useBranch } from "@/hooks/use-branch";
import { supabase } from "@/services/supabaseClient";
import { toast } from "sonner";
import { formatCurrency } from "@/utils/stringUtils";
import { useTransactions } from "@/hooks/use-transactions";

interface TransactionListProps {
  filterStartDate?: Date;
  filterEndDate?: Date;
  transactionType?: 'income' | 'expense';
  webhookOnly?: boolean;
}

const TransactionList = ({ filterStartDate, filterEndDate, transactionType, webhookOnly }: TransactionListProps) => {
  const { transactions, isLoading } = useTransactions();
  const [filteredTransactions, setFilteredTransactions] = useState<any[]>([]);
  const { currentBranch } = useBranch();

  useEffect(() => {
    if (transactions) {
      let filtered = [...transactions];
      
      // Filter by transaction type if specified
      if (transactionType) {
        filtered = filtered.filter(t => t.type === transactionType);
      }
      
      // Filter by webhook only if specified
      if (webhookOnly) {
        filtered = filtered.filter(t => t.payment_method && t.transaction_id);
      }
      
      // Apply date filters if provided
      if (filterStartDate) {
        filtered = filtered.filter(t => 
          new Date(t.transaction_date) >= filterStartDate
        );
      }
      
      if (filterEndDate) {
        filtered = filtered.filter(t => 
          new Date(t.transaction_date) <= filterEndDate
        );
      }
      
      setFilteredTransactions(filtered);
    }
  }, [transactions, filterStartDate, filterEndDate, transactionType, webhookOnly]);

  const getCategoryName = (transaction: any) => {
    if (transaction.type === 'income') {
      return transaction.income_category?.name || 'Uncategorized';
    } else {
      return transaction.expense_category?.name || 'Uncategorized';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {transactionType === 'income' 
            ? 'Income Transactions' 
            : transactionType === 'expense' 
              ? 'Expense Transactions' 
              : webhookOnly 
                ? 'Webhook Transactions'
                : 'Recent Transactions'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <p>Loading transactions...</p>
          </div>
        ) : filteredTransactions.length > 0 ? (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Payment Method</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTransactions.map((transaction) => (
                  <TableRow key={transaction.id}>
                    <TableCell>{format(new Date(transaction.transaction_date), "MMM d, yyyy")}</TableCell>
                    <TableCell>{transaction.description}</TableCell>
                    <TableCell>{getCategoryName(transaction)}</TableCell>
                    <TableCell>
                      <Badge 
                        variant="outline" 
                        className={transaction.type === 'income' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}
                      >
                        {transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {formatCurrency(transaction.amount)}
                    </TableCell>
                    <TableCell>
                      {transaction.payment_method ? (
                        <Badge variant="outline">
                          {transaction.payment_method.charAt(0).toUpperCase() + transaction.payment_method.slice(1)}
                        </Badge>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="flex items-center justify-center h-64">
            <p className="text-muted-foreground">No transactions found</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TransactionList;
