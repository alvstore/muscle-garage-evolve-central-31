
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { useBranch } from "@/hooks/use-branch";
import { supabase } from "@/services/supabaseClient";
import { toast } from "sonner";
import { formatCurrency } from "@/utils/stringUtils";

interface TransactionListProps {
  filterStartDate?: Date;
  filterEndDate?: Date;
}

const TransactionList = ({ filterStartDate, filterEndDate }: TransactionListProps) => {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const { currentBranch } = useBranch();

  useEffect(() => {
    fetchTransactions();
    
    // Set up real-time subscription
    const channel = supabase
      .channel('transaction_list_changes')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'transactions',
          ...(currentBranch?.id ? { filter: `branch_id=eq.${currentBranch.id}` } : {})
        }, 
        () => {
          fetchTransactions();
        }
      )
      .subscribe();
      
    return () => {
      supabase.removeChannel(channel);
    };
  }, [currentBranch, filterStartDate, filterEndDate]);

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      
      let query = supabase
        .from('transactions')
        .select(`
          *,
          income_category:income_categories(name),
          expense_category:expense_categories(name),
          recorder:profiles(full_name)
        `)
        .eq('branch_id', currentBranch?.id || '');
      
      // Apply date filters if provided
      if (filterStartDate) {
        query = query.gte('transaction_date', filterStartDate.toISOString());
      }
      
      if (filterEndDate) {
        query = query.lte('transaction_date', filterEndDate.toISOString());
      }
      
      // Sort by date, newest first
      query = query.order('transaction_date', { ascending: false });
      
      const { data, error } = await query;
      
      if (error) throw error;
      
      setTransactions(data || []);
    } catch (error: any) {
      console.error('Error fetching transactions:', error);
      toast.error('Failed to fetch transactions');
    } finally {
      setLoading(false);
    }
  };

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
        <CardTitle>Recent Transactions</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <p>Loading transactions...</p>
          </div>
        ) : transactions.length > 0 ? (
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
                {transactions.map((transaction) => (
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
