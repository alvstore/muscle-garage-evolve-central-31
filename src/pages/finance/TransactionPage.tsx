
import { useState, useEffect } from "react";
import { Container } from "@/components/ui/container";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import TransactionList from "@/components/finance/TransactionList";
import WebhookLogs from "@/components/finance/WebhookLogs";
import { supabase } from '@/services/api/supabaseClient';
import { useBranch } from '@/hooks/use-branches';
import { toast } from 'sonner';
import { FinancialTransaction } from "@/types/finance";

const TransactionPage = () => {
  const [activeTab, setActiveTab] = useState("transactions");
  const [transactions, setTransactions] = useState<FinancialTransaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { currentBranch } = useBranch();

  useEffect(() => {
    fetchTransactions();
    
    // Set up real-time subscriptions for all finance-related tables
    const channel = supabase
      .channel('finance_changes')
      // Listen for transactions table changes
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'transactions',
          ...(currentBranch?.id ? { filter: `branch_id=eq.${currentBranch.id}` } : {})
        }, 
        () => {
          console.log('Transactions table updated');
          fetchTransactions();
        }
      )
      // Listen for income_records table changes
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'income_records',
          ...(currentBranch?.id ? { filter: `branch_id=eq.${currentBranch.id}` } : {})
        }, 
        () => {
          console.log('Income records table updated');
          fetchTransactions();
        }
      )
      // Listen for expense_records table changes
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'expense_records',
          ...(currentBranch?.id ? { filter: `branch_id=eq.${currentBranch.id}` } : {})
        }, 
        () => {
          console.log('Expense records table updated');
          fetchTransactions();
        }
      )
      .subscribe();
      
    return () => {
      supabase.removeChannel(channel);
    };
  }, [currentBranch]);

  const fetchTransactions = async () => {
    try {
      setIsLoading(true);
      
      // Try to fetch from transactions table first
      const { data: transactionsData, error: transactionsError } = await supabase
        .from('transactions')
        .select('*')
        .eq('branch_id', currentBranch?.id || '');
      
      if (transactionsError) {
        console.warn('Error fetching from transactions table, trying income_records and expense_records');
        
        // If transactions table fails, try fetching from income_records
        const { data: incomeData, error: incomeError } = await supabase
          .from('income_records')
          .select('*')
          .eq('branch_id', currentBranch?.id || '');
        
        // And expense_records
        const { data: expenseData, error: expenseError } = await supabase
          .from('expense_records')
          .select('*')
          .eq('branch_id', currentBranch?.id || '');
        
        if (incomeError && expenseError) {
          console.error('Failed to fetch from both income and expense records');
          throw new Error('Failed to fetch financial data');
        }
        
        // Normalize income records to match FinancialTransaction structure
        const normalizedIncomeRecords = (incomeData || []).map(record => ({
          id: record.id,
          type: 'income',
          amount: record.amount,
          description: record.description,
          transaction_date: record.date,
          payment_method: record.payment_method,
          category: record.category,
          branch_id: record.branch_id,
          reference_id: record.reference,
          status: 'completed',
          created_at: record.created_at,
          updated_at: record.updated_at,
          source: record.source
        }));
        
        // Normalize expense records to match FinancialTransaction structure
        const normalizedExpenseRecords = (expenseData || []).map(record => ({
          id: record.id,
          type: 'expense',
          amount: record.amount,
          description: record.description,
          transaction_date: record.date,
          payment_method: record.payment_method,
          category: record.category,
          branch_id: record.branch_id,
          reference_id: record.reference,
          status: record.status,
          created_at: record.created_at,
          updated_at: record.updated_at,
          vendor: record.vendor
        }));
        
        setTransactions([...normalizedIncomeRecords, ...normalizedExpenseRecords]);
      } else {
        // If transactions table succeeds, normalize the data
        setTransactions((transactionsData || []).map(transaction => ({
          id: transaction.id,
          type: transaction.type,
          amount: transaction.amount,
          description: transaction.description || '',
          transaction_date: transaction.transaction_date,
          payment_method: transaction.payment_method || 'unknown',
          category: transaction.category || 'Uncategorized',
          branch_id: transaction.branch_id,
          reference_id: transaction.reference_id || '',
          status: transaction.status || 'completed',
          created_at: transaction.created_at,
          updated_at: transaction.updated_at,
          webhook_processed: transaction.webhook_processed
        })));
      }
    } catch (error) {
      console.error('Error fetching transactions:', error);
      toast.error('Failed to fetch transactions');
      setTransactions([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddTransaction = async (transaction: Partial<FinancialTransaction>) => {
    try {
      const now = new Date().toISOString();
      const transactionType = transaction.type?.toLowerCase() || 'income';
      
      // Determine which table to insert into based on transaction type
      if (transactionType === 'expense') {
        // Insert into expense_records table
        const { error } = await supabase
          .from('expense_records')
          .insert([
            {
              date: transaction.transaction_date || transaction.date || now,
              amount: transaction.amount,
              category: transaction.category || 'Uncategorized',
              description: transaction.description || '',
              vendor: transaction.vendor || 'Unknown',
              payment_method: transaction.payment_method || 'cash',
              reference: transaction.reference_id || '',
              branch_id: currentBranch?.id,
              status: transaction.status || 'completed',
              created_at: now,
              updated_at: now
            }
          ]);
        
        if (error) throw error;
      } else if (transactionType === 'income') {
        // Insert into income_records table
        const { error } = await supabase
          .from('income_records')
          .insert([
            {
              date: transaction.transaction_date || transaction.date || now,
              amount: transaction.amount,
              category: transaction.category || 'Uncategorized',
              description: transaction.description || '',
              source: transaction.source || 'Unknown',
              payment_method: transaction.payment_method || 'cash',
              reference: transaction.reference_id || '',
              branch_id: currentBranch?.id,
              created_at: now,
              updated_at: now
            }
          ]);
        
        if (error) throw error;
      } else {
        // Insert into transactions table as fallback
        const { error } = await supabase
          .from('transactions')
          .insert([
            {
              ...transaction,
              type: transactionType,
              branch_id: currentBranch?.id,
              created_at: now,
              updated_at: now
            }
          ]);
        
        if (error) throw error;
      }
      
      toast.success('Transaction added successfully');
      await fetchTransactions();
    } catch (error) {
      console.error('Error adding transaction:', error);
      toast.error('Failed to add transaction');
    }
  };

  const handleUpdateTransaction = async (id: string, transaction: Partial<FinancialTransaction>) => {
    try {
      const now = new Date().toISOString();
      const transactionType = transaction.type?.toLowerCase() || 'unknown';
      
      // Determine which table to update based on transaction type
      if (transactionType === 'expense') {
        // Update in expense_records table
        const { error } = await supabase
          .from('expense_records')
          .update({
            date: transaction.transaction_date || transaction.date,
            amount: transaction.amount,
            category: transaction.category,
            description: transaction.description,
            vendor: transaction.vendor,
            payment_method: transaction.payment_method,
            reference: transaction.reference_id || transaction.reference,
            status: transaction.status,
            updated_at: now
          })
          .eq('id', id);
        
        if (error) {
          // If failed, try updating in transactions table
          const { error: fallbackError } = await supabase
            .from('transactions')
            .update({
              ...transaction,
              updated_at: now
            })
            .eq('id', id);
          
          if (fallbackError) throw fallbackError;
        }
      } else if (transactionType === 'income') {
        // Update in income_records table
        const { error } = await supabase
          .from('income_records')
          .update({
            date: transaction.transaction_date || transaction.date,
            amount: transaction.amount,
            category: transaction.category,
            description: transaction.description,
            source: transaction.source,
            payment_method: transaction.payment_method,
            reference: transaction.reference_id || transaction.reference,
            updated_at: now
          })
          .eq('id', id);
        
        if (error) {
          // If failed, try updating in transactions table
          const { error: fallbackError } = await supabase
            .from('transactions')
            .update({
              ...transaction,
              updated_at: now
            })
            .eq('id', id);
          
          if (fallbackError) throw fallbackError;
        }
      } else {
        // Update in transactions table as fallback
        const { error } = await supabase
          .from('transactions')
          .update({
            ...transaction,
            updated_at: now
          })
          .eq('id', id);
        
        if (error) throw error;
      }
      
      toast.success('Transaction updated successfully');
      await fetchTransactions();
    } catch (error) {
      console.error('Error updating transaction:', error);
      toast.error('Failed to update transaction');
    }
  };

  const handleDeleteTransaction = async (id: string) => {
    try {
      // Try to delete from all possible tables
      // First try expense_records
      const { error: expenseError } = await supabase
        .from('expense_records')
        .delete()
        .eq('id', id);
      
      if (expenseError) {
        // Try income_records
        const { error: incomeError } = await supabase
          .from('income_records')
          .delete()
          .eq('id', id);
        
        if (incomeError) {
          // Finally try transactions
          const { error: transactionError } = await supabase
            .from('transactions')
            .delete()
            .eq('id', id);
          
          if (transactionError) throw transactionError;
        }
      }
      
      toast.success('Transaction deleted successfully');
      await fetchTransactions();
    } catch (error) {
      console.error('Error deleting transaction:', error);
      toast.error('Failed to delete transaction');
    }
  };

  // Filter transactions based on the active tab
  const filteredTransactions = transactions.filter(t => {
    if (activeTab === 'transactions') return true;
    if (activeTab === 'income' && t.type?.toLowerCase() === 'income') return true;
    if (activeTab === 'expenses' && t.type?.toLowerCase() === 'expense') return true;
    if (activeTab === 'webhook-transactions' && t.webhook_processed) return true;
    return false;
  });

  return (
    <Container>
      <div className="py-6">
        <h1 className="text-2xl font-bold mb-6">Financial Transactions</h1>
        
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="transactions">All Transactions</TabsTrigger>
            <TabsTrigger value="income">Income</TabsTrigger>
            <TabsTrigger value="expenses">Expenses</TabsTrigger>
            <TabsTrigger value="webhook-transactions">Webhook Transactions</TabsTrigger>
          </TabsList>
          
          <TabsContent value="transactions">
            <TransactionList 
              transactions={filteredTransactions}
              onAddTransaction={handleAddTransaction}
              onUpdateTransaction={handleUpdateTransaction}
              onDeleteTransaction={handleDeleteTransaction}
              isLoading={isLoading}
            />
          </TabsContent>
          
          <TabsContent value="income">
            <TransactionList 
              transactions={filteredTransactions}
              onAddTransaction={handleAddTransaction}
              onUpdateTransaction={handleUpdateTransaction}
              onDeleteTransaction={handleDeleteTransaction}
              isLoading={isLoading}
            />
          </TabsContent>
          
          <TabsContent value="expenses">
            <TransactionList 
              transactions={filteredTransactions}
              onAddTransaction={handleAddTransaction}
              onUpdateTransaction={handleUpdateTransaction}
              onDeleteTransaction={handleDeleteTransaction}
              isLoading={isLoading}
            />
          </TabsContent>
          
          <TabsContent value="webhook-transactions">
            <div className="space-y-6">
              <p className="text-muted-foreground">
                These transactions were automatically created or updated by Razorpay webhooks.
              </p>
              <TransactionList 
                transactions={filteredTransactions}
                onAddTransaction={handleAddTransaction}
                onUpdateTransaction={handleUpdateTransaction}
                onDeleteTransaction={handleDeleteTransaction}
                isLoading={isLoading}
              />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Container>
  );
};

export default TransactionPage;
