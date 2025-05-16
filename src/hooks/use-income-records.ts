
import { useState, useEffect } from 'react';
import { financeService } from '@/services/financeService';
import { useBranch } from '@/hooks/use-branch';
import { useAuth } from '@/hooks/use-auth';
import { FinancialTransaction, TransactionType } from '@/types/finance';

export const useIncomeRecords = () => {
  const [records, setRecords] = useState<FinancialTransaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { currentBranch } = useBranch();
  const { user } = useAuth();

  // Fetch income records
  const fetchRecords = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const records = await financeService.getTransactions(currentBranch?.id || "");
      setRecords(records.filter(record => record.type === 'income'));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch income records');
    } finally {
      setIsLoading(false);
    }
  };

  // Create a new income record
  const createRecord = async (record: Partial<FinancialTransaction>) => {
    try {
      // Set the transaction type to income for this hook
      const incomeRecord = {
        ...record,
        type: 'income' as TransactionType
      };
      
      const newRecord = await financeService.createTransaction(incomeRecord as any);
      if (newRecord) {
        setRecords(prev => [...prev, newRecord as FinancialTransaction]);
      }
      return newRecord;
    } catch (error) {
      throw error;
    }
  };

  // Update an existing record
  const updateRecord = async (id: string, updates: Partial<FinancialTransaction>) => {
    try {
      // Make sure we don't include attachment in the update
      const { attachment, ...updateData } = updates;
      
      const updated = await financeService.updateTransaction(id, updateData);
      if (updated) {
        setRecords(prev => 
          prev.map(record => record.id === id ? { ...record, ...updates } : record)
        );
      }
      return updated;
    } catch (error) {
      throw error;
    }
  };

  // Delete a record
  const deleteRecord = async (id: string) => {
    try {
      await financeService.deleteTransaction(id);
      setRecords(prev => prev.filter(record => record.id !== id));
      return true;
    } catch (error) {
      throw error;
    }
  };

  // Upload attachment
  const uploadAttachment = async (file: File, recordId: string) => {
    try {
      // Replace with actual upload functionality
      const url = await new Promise<string>(resolve => {
        setTimeout(() => {
          resolve(`https://example.com/attachments/${file.name}`);
        }, 1000);
      });
      
      // Update the record with the attachment URL, not the File object
      await updateRecord(recordId, { attachment: url as any });
      return url;
    } catch (error) {
      throw error;
    }
  };

  // Delete attachment
  const deleteAttachment = async (recordId: string) => {
    try {
      await updateRecord(recordId, { attachment: null as unknown as undefined });
      return true;
    } catch (error) {
      throw error;
    }
  };

  // Initial data fetch
  useEffect(() => {
    if (user && currentBranch?.id) {
      fetchRecords();
    }
  }, [user, currentBranch?.id]);

  return {
    records,
    isLoading,
    error,
    createRecord,
    updateRecord,
    deleteRecord,
    uploadAttachment,
    deleteAttachment,
    fetchRecords
  };
};
