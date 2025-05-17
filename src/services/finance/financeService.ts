
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { FinancialTransaction, ExpenseRecord, Invoice, InvoiceStatus } from '@/types/finance';

export const financeService = {
  // Invoice methods
  async getInvoices(branchId: string | undefined): Promise<Invoice[]> {
    try {
      if (!branchId) return [];
      
      const { data, error } = await supabase
        .from('invoices')
        .select('*, members(name)')
        .eq('branch_id', branchId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Transform the data to match the Invoice interface
      return data.map((invoice: any) => ({
        ...invoice,
        member_name: invoice.members?.name || 'Unknown',
        // For backward compatibility
        memberName: invoice.members?.name || 'Unknown',
        memberId: invoice.member_id,
        dueDate: invoice.due_date,
        issuedDate: invoice.created_at,
        membershipPlanId: invoice.membership_plan_id
      }));
    } catch (error: any) {
      console.error('Error fetching invoices:', error);
      toast.error('Failed to load invoices');
      return [];
    }
  },

  async getInvoiceById(id: string): Promise<Invoice | null> {
    try {
      const { data, error } = await supabase
        .from('invoices')
        .select('*, members(name)')
        .eq('id', id)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          toast.error('Invoice not found');
          return null;
        }
        throw error;
      }

      // Transform the data to match the Invoice interface
      return {
        ...data,
        member_name: data.members?.name || 'Unknown',
        // For backward compatibility
        memberName: data.members?.name || 'Unknown',
        memberId: data.member_id,
        dueDate: data.due_date,
        issuedDate: data.created_at,
        membershipPlanId: data.membership_plan_id
      };
    } catch (error: any) {
      console.error('Error fetching invoice:', error);
      toast.error('Failed to load invoice details');
      return null;
    }
  },

  async createInvoice(invoice: Omit<Invoice, 'id' | 'created_at' | 'updated_at'>): Promise<Invoice | null> {
    try {
      // Prepare the invoice data for insertion
      const invoiceData = {
        member_id: invoice.member_id || invoice.memberId,
        amount: invoice.amount,
        description: invoice.description,
        status: invoice.status,
        due_date: invoice.due_date || invoice.dueDate,
        payment_method: invoice.payment_method,
        notes: invoice.notes,
        branch_id: invoice.branch_id,
        membership_plan_id: invoice.membership_plan_id || invoice.membershipPlanId,
        items: invoice.items || []
      };

      const { data, error } = await supabase
        .from('invoices')
        .insert([invoiceData])
        .select()
        .single();

      if (error) throw error;
      
      toast.success('Invoice created successfully');
      return data as Invoice;
    } catch (error: any) {
      console.error('Error creating invoice:', error);
      toast.error(`Failed to create invoice: ${error.message}`);
      return null;
    }
  },

  async updateInvoiceStatus(id: string, status: InvoiceStatus): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('invoices')
        .update({ status, updated_at: new Date().toISOString() })
        .eq('id', id);

      if (error) throw error;
      
      toast.success(`Invoice marked as ${status}`);
      return true;
    } catch (error: any) {
      console.error('Error updating invoice status:', error);
      toast.error(`Failed to update invoice: ${error.message}`);
      return false;
    }
  },

  // Transaction methods
  async getTransactions(branchId: string | undefined): Promise<FinancialTransaction[]> {
    try {
      if (!branchId) return [];
      
      // First try to fetch from transactions table
      const { data: transactionsData, error: transactionsError } = await supabase
        .from('transactions')
        .select('*')
        .eq('branch_id', branchId)
        .order('transaction_date', { ascending: false });
      
      // Initialize arrays to hold data from different sources
      let combinedTransactions: FinancialTransaction[] = [];
      
      // Add transactions from the transactions table if available
      if (!transactionsError && transactionsData && transactionsData.length > 0) {
        const normalizedTransactions = transactionsData.map((transaction: any) => ({
          id: transaction.id,
          type: transaction.type as 'income' | 'expense' | 'refund',
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
        }));
        
        combinedTransactions = [...normalizedTransactions];
      }
      
      // Fetch from income_records table
      const { data: incomeData, error: incomeError } = await supabase
        .from('income_records')
        .select('*')
        .eq('branch_id', branchId)
        .order('date', { ascending: false });
      
      // Add income records if available
      if (!incomeError && incomeData && incomeData.length > 0) {
        const normalizedIncomeRecords = incomeData.map((record: any) => ({
          id: record.id,
          type: 'income' as const,
          amount: record.amount,
          description: record.description || '',
          transaction_date: record.date,
          payment_method: record.payment_method || 'unknown',
          category: record.category || 'Uncategorized',
          branch_id: record.branch_id,
          reference_id: record.reference || '',
          status: 'completed',
          created_at: record.created_at,
          updated_at: record.updated_at,
          source: record.source || 'Unknown'
        }));
        
        combinedTransactions = [...combinedTransactions, ...normalizedIncomeRecords];
      }
      
      // Fetch from expense_records table
      const { data: expenseData, error: expenseError } = await supabase
        .from('expense_records')
        .select('*')
        .eq('branch_id', branchId)
        .order('date', { ascending: false });
      
      // Add expense records if available
      if (!expenseError && expenseData && expenseData.length > 0) {
        const normalizedExpenseRecords = expenseData.map((record: any) => ({
          id: record.id,
          type: 'expense' as const,
          amount: record.amount,
          description: record.description || '',
          transaction_date: record.date,
          payment_method: record.payment_method || 'unknown',
          category: record.category || 'Uncategorized',
          branch_id: record.branch_id,
          reference_id: record.reference || '',
          status: record.status || 'completed',
          created_at: record.created_at,
          updated_at: record.updated_at,
          vendor: record.vendor || 'Unknown'
        }));
        
        combinedTransactions = [...combinedTransactions, ...normalizedExpenseRecords];
      }
      
      // If we have no data from any source, log an error
      if (combinedTransactions.length === 0 && transactionsError && incomeError && expenseError) {
        console.error('Failed to fetch from all financial data sources');
        throw new Error('Failed to fetch financial data');
      }
      
      // Sort all transactions by date, most recent first
      return combinedTransactions.sort((a, b) => {
        const dateA = new Date(a.transaction_date || a.created_at).getTime();
        const dateB = new Date(b.transaction_date || b.created_at).getTime();
        return dateB - dateA;
      });
    } catch (error: any) {
      console.error('Error fetching transactions:', error);
      toast.error('Failed to load transactions');
      return [];
    }
  },

  async createTransaction(transaction: Omit<FinancialTransaction, 'id'>): Promise<FinancialTransaction | null> {
    try {
      const now = new Date().toISOString();
      const transactionType = transaction.type?.toLowerCase() || 'income';
      let result: any = null;
      
      // Determine which table to insert into based on transaction type
      if (transactionType === 'expense') {
        // Insert into expense_records table
        const { data, error } = await supabase
          .from('expense_records')
          .insert([{
            date: transaction.transaction_date || now,
            amount: transaction.amount,
            category: transaction.category || 'Uncategorized',
            description: transaction.description || '',
            vendor: transaction.vendor || 'Unknown',
            payment_method: transaction.payment_method || 'cash',
            reference: transaction.reference_id || '',
            branch_id: transaction.branch_id,
            status: transaction.status || 'completed',
            created_at: now,
            updated_at: now
          }])
          .select()
          .single();
        
        if (error) throw error;
        result = data;
        
        // Convert to FinancialTransaction format
        return {
          id: result.id,
          type: 'expense' as const,
          amount: result.amount,
          description: result.description || '',
          transaction_date: result.date,
          payment_method: result.payment_method || 'unknown',
          category: result.category || 'Uncategorized',
          branch_id: result.branch_id,
          reference_id: result.reference || '',
          status: result.status || 'completed',
          created_at: result.created_at,
          updated_at: result.updated_at,
          vendor: result.vendor || 'Unknown'
        };
      } else if (transactionType === 'income') {
        // Insert into income_records table
        const { data, error } = await supabase
          .from('income_records')
          .insert([{
            date: transaction.transaction_date || now,
            amount: transaction.amount,
            category: transaction.category || 'Uncategorized',
            description: transaction.description || '',
            source: transaction.source || 'Unknown',
            payment_method: transaction.payment_method || 'cash',
            reference: transaction.reference_id || '',
            branch_id: transaction.branch_id,
            created_at: now,
            updated_at: now
          }])
          .select()
          .single();
        
        if (error) throw error;
        result = data;
        
        // Convert to FinancialTransaction format
        return {
          id: result.id,
          type: 'income' as const,
          amount: result.amount,
          description: result.description || '',
          transaction_date: result.date,
          payment_method: result.payment_method || 'unknown',
          category: result.category || 'Uncategorized',
          branch_id: result.branch_id,
          reference_id: result.reference || '',
          status: 'completed',
          created_at: result.created_at,
          updated_at: result.updated_at,
          source: result.source || 'Unknown'
        };
      } else {
        // Insert into transactions table as fallback
        const { data, error } = await supabase
          .from('transactions')
          .insert([{
            ...transaction,
            type: transactionType,
            created_at: now,
            updated_at: now
          }])
          .select()
          .single();
        
        if (error) throw error;
        result = data;
      }
      
      toast.success('Transaction created successfully');
      return result as FinancialTransaction;
    } catch (error: any) {
      console.error('Error creating transaction:', error);
      toast.error(`Failed to create transaction: ${error.message}`);
      return null;
    }
  },

  async updateTransaction(id: string, updates: Partial<FinancialTransaction>): Promise<boolean> {
    try {
      const now = new Date().toISOString();
      const transactionType = updates.type?.toLowerCase() || 'unknown';
      let success = false;
      
      // Determine which table to update based on transaction type
      if (transactionType === 'expense') {
        // Update in expense_records table
        const { error } = await supabase
          .from('expense_records')
          .update({
            date: updates.transaction_date || updates.date,
            amount: updates.amount,
            category: updates.category,
            description: updates.description,
            vendor: updates.vendor,
            payment_method: updates.payment_method,
            reference: updates.reference_id || updates.reference,
            status: updates.status,
            updated_at: now
          })
          .eq('id', id);
        
        if (error) {
          // If failed, try updating in transactions table
          const { error: fallbackError } = await supabase
            .from('transactions')
            .update({
              ...updates,
              updated_at: now
            })
            .eq('id', id);
          
          if (fallbackError) throw fallbackError;
          success = true;
        } else {
          success = true;
        }
      } else if (transactionType === 'income') {
        // Update in income_records table
        const { error } = await supabase
          .from('income_records')
          .update({
            date: updates.transaction_date || updates.date,
            amount: updates.amount,
            category: updates.category,
            description: updates.description,
            source: updates.source,
            payment_method: updates.payment_method,
            reference: updates.reference_id || updates.reference,
            updated_at: now
          })
          .eq('id', id);
        
        if (error) {
          // If failed, try updating in transactions table
          const { error: fallbackError } = await supabase
            .from('transactions')
            .update({
              ...updates,
              updated_at: now
            })
            .eq('id', id);
          
          if (fallbackError) throw fallbackError;
          success = true;
        } else {
          success = true;
        }
      } else {
        // Update in transactions table as fallback
        const { error } = await supabase
          .from('transactions')
          .update({
            ...updates,
            updated_at: now
          })
          .eq('id', id);
        
        if (error) throw error;
        success = true;
      }
      
      if (success) {
        toast.success('Transaction updated successfully');
        return true;
      } else {
        throw new Error('Failed to update transaction in any table');
      }
    } catch (error: any) {
      console.error('Error updating transaction:', error);
      toast.error(`Failed to update transaction: ${error.message}`);
      return false;
    }
  },

  async deleteTransaction(id: string): Promise<boolean> {
    try {
      let success = false;
      
      // Try to delete from all possible tables
      // First try expense_records
      const { error: expenseError } = await supabase
        .from('expense_records')
        .delete()
        .eq('id', id);
      
      if (!expenseError) {
        success = true;
      } else {
        // Try income_records
        const { error: incomeError } = await supabase
          .from('income_records')
          .delete()
          .eq('id', id);
        
        if (!incomeError) {
          success = true;
        } else {
          // Finally try transactions
          const { error: transactionError } = await supabase
            .from('transactions')
            .delete()
            .eq('id', id);
          
          if (!transactionError) {
            success = true;
          } else {
            throw transactionError;
          }
        }
      }
      
      if (success) {
        toast.success('Transaction deleted successfully');
        return true;
      } else {
        throw new Error('Failed to delete transaction from any table');
      }
    } catch (error: any) {
      console.error('Error deleting transaction:', error);
      toast.error(`Failed to delete transaction: ${error.message}`);
      return false;
    }
  },
  // Expense record methods
  async getExpenseRecords(branchId: string | undefined): Promise<ExpenseRecord[]> {
    try {
      if (!branchId) return [];
      
      // Try to get from expense_records table first
      const { data, error } = await supabase
        .from('expense_records')
        .select('*')
        .eq('branch_id', branchId)
        .order('date', { ascending: false });

      // If expense_records table doesn't exist or is empty, try transactions with type=expense
      if (error || !data || data.length === 0) {
        console.log('Falling back to transactions table for expense records');
        
        // Get expense transactions
        const { data: expenseData, error: expenseError } = await supabase
          .from('transactions')
          .select('*')
          .eq('branch_id', branchId)
          .eq('type', 'expense')
          .order('transaction_date', { ascending: false });
          
        if (expenseError) {
          console.error('Error fetching expenses from transactions:', expenseError);
          return [];
        }
        
        // Transform transactions to match ExpenseRecord interface
        return (expenseData || []).map(transaction => ({
          id: transaction.id,
          date: transaction.transaction_date,
          amount: transaction.amount,
          category: transaction.category || 'Other',
          description: transaction.description || '',
          vendor: transaction.vendor || 'Unknown',
          payment_method: transaction.payment_method || 'unknown',
          reference: transaction.reference_id || '',
          branch_id: transaction.branch_id,
          status: transaction.status || 'completed',
          created_at: transaction.created_at,
          updated_at: transaction.updated_at
        }));
      }
      
      return data as ExpenseRecord[];
    } catch (error: any) {
      console.error('Error fetching expense records:', error);
      toast.error('Failed to load expense records');
      return [];
    }
  },

  async getExpenseRecordById(id: string): Promise<ExpenseRecord | null> {
    try {
      const { data, error } = await supabase
        .from('expense_records')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          toast.error('Expense record not found');
          return null;
        }
        throw error;
      }

      return data as ExpenseRecord;
    } catch (error: any) {
      console.error('Error fetching expense record:', error);
      toast.error('Failed to load expense record details');
      return null;
    }
  },

  async createExpenseRecord(expenseRecord: Omit<ExpenseRecord, 'id' | 'created_at' | 'updated_at'>): Promise<ExpenseRecord | null> {
    try {
      const { data, error } = await supabase
        .from('expense_records')
        .insert([expenseRecord])
        .select()
        .single();

      if (error) throw error;
      
      toast.success('Expense record created successfully');
      return data as ExpenseRecord;
    } catch (error: any) {
      console.error('Error creating expense record:', error);
      toast.error(`Failed to create expense record: ${error.message}`);
      return null;
    }
  },

  async updateExpenseRecord(id: string, updates: Partial<ExpenseRecord>): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('expense_records')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', id);

      if (error) throw error;
      
      toast.success('Expense record updated successfully');
      return true;
    } catch (error: any) {
      console.error('Error updating expense record:', error);
      toast.error(`Failed to update expense record: ${error.message}`);
      return false;
    }
  },

  async deleteExpenseRecord(id: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('expense_records')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      toast.success('Expense record deleted successfully');
      return true;
    } catch (error: any) {
      console.error('Error deleting expense record:', error);
      toast.error(`Failed to delete expense record: ${error.message}`);
      return false;
    }
  },

  // Finance dashboard methods
  async getFinanceSummary(branchId: string | undefined) {
    try {
      if (!branchId) return { income: 0, expenses: 0, balance: 0 };
      
      // Try to get income from transactions table first
      const { data: incomeData, error: incomeError } = await supabase
        .from('transactions')
        .select('amount')
        .eq('branch_id', branchId)
        .eq('type', 'income');

      // If no transactions table or error, try income_records table
      let totalIncome = 0;
      if (incomeError || !incomeData || incomeData.length === 0) {
        console.log('Falling back to income_records table');
        const { data: altIncomeData, error: altIncomeError } = await supabase
          .from('income_records')
          .select('amount')
          .eq('branch_id', branchId);
          
        if (!altIncomeError && altIncomeData) {
          totalIncome = altIncomeData.reduce((sum, item) => sum + Number(item.amount), 0);
        }
      } else {
        totalIncome = incomeData.reduce((sum, item) => sum + Number(item.amount), 0);
      }

      // Try to get expenses from expense_records table
      const { data: expenseData, error: expenseError } = await supabase
        .from('expense_records')
        .select('amount')
        .eq('branch_id', branchId);

      // If no expense_records table or error, try transactions table with type='expense'
      let totalExpenses = 0;
      if (expenseError || !expenseData || expenseData.length === 0) {
        console.log('Falling back to transactions table for expenses');
        const { data: altExpenseData, error: altExpenseError } = await supabase
          .from('transactions')
          .select('amount')
          .eq('branch_id', branchId)
          .eq('type', 'expense');
          
        if (!altExpenseError && altExpenseData) {
          totalExpenses = altExpenseData.reduce((sum, item) => sum + Number(item.amount), 0);
        }
      } else {
        totalExpenses = expenseData.reduce((sum, item) => sum + Number(item.amount), 0);
      }

      const balance = totalIncome - totalExpenses;

      return { income: totalIncome, expenses: totalExpenses, balance };
    } catch (error: any) {
      console.error('Error fetching finance summary:', error);
      toast.error('Failed to load finance summary');
      return { income: 0, expenses: 0, balance: 0 };
    }
  }
};
