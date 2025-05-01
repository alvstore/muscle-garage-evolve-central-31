import { useState, useEffect } from 'react';
import { financeService } from '@/services/financeService';
import { useBranch } from '@/hooks/use-branch';
import { useAuth } from '@/hooks/use-auth';
import { FinancialTransaction, PaymentMethod } from '@/types/finance';

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

      const records = await financeService.getIncomeRecords(currentBranch?.id);
      setRecords(records);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch income records');
    } finally {
      setIsLoading(false);
    }
  };

  // Create a new income record
  const createRecord = async (record: Omit<IncomeRecord, 'id'>) => {
    try {
      const newRecord = await financeService.createIncomeRecord(record);
      setRecords(prev => [...prev, newRecord]);
      return newRecord;
    } catch (error) {
      throw error;
    }
  };

  // Update an existing record
  const updateRecord = async (id: string, updates: Partial<IncomeRecord>) => {
    try {
      const updatedRecord = await financeService.updateIncomeRecord(id, updates);
      setRecords(prev => 
        prev.map(record => record.id === id ? updatedRecord : record)
      );
      return updatedRecord;
    } catch (error) {
      throw error;
    }
  };

  // Delete a record
  const deleteRecord = async (id: string) => {
    try {
      await financeService.deleteIncomeRecord(id);
      setRecords(prev => prev.filter(record => record.id !== id));
    } catch (error) {
      throw error;
    }
  };

  // Upload attachment
  const uploadAttachment = async (file: File, recordId: string) => {
    try {
      const url = await financeService.uploadAttachment(file, recordId);
      await updateRecord(recordId, { attachment: url });
      return url;
    } catch (error) {
      throw error;
    }
  };

  // Delete attachment
  const deleteAttachment = async (recordId: string) => {
    try {
      await financeService.deleteAttachment(recordId);
    } catch (error) {
      throw error;
    }
  };

  // Initial data fetch
  useEffect(() => {
    if (user) {
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
