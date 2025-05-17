import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Trash, Download, DollarSign, FileText, RefreshCw, Search, Filter } from "lucide-react";
import { toast } from "sonner";
import { format } from 'date-fns';
import { supabase } from '@/integrations/supabase/client';
import { useBranch } from '@/hooks/settings/use-branches';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { ExpenseRecord } from '@/types/finance';
// Using direct styling instead of Container component
// import { Container } from "@/components/ui/container";

const ExpenseRecordsPage = () => {
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<ExpenseRecord | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [expenseRecords, setExpenseRecords] = useState<ExpenseRecord[]>([]);
  const { currentBranch } = useBranch();
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [activeTab, setActiveTab] = useState('all');
  
  // Form state
  const [formData, setFormData] = useState<Omit<ExpenseRecord, 'id'>>({
    date: new Date().toISOString(),
    amount: 0,
    category: 'Uncategorized',
    description: '',
    vendor: '',
    payment_method: 'cash',
    reference: '',
    branch_id: currentBranch?.id || '',
    status: 'pending'
  });

  const expenseCategories = [
    'Rent', 'Utilities', 'Equipment Maintenance', 'Inventory', 'Marketing',
    'Salaries', 'Insurance', 'Taxes', 'Supplies', 'Cleaning', 'Repairs',
    'Software', 'Subscriptions', 'Travel', 'Food', 'Other'
  ];

  const paymentMethods = ['cash', 'card', 'upi', 'netbanking', 'cheque', 'online', 'wallet'];
  const statusOptions = ['pending', 'paid', 'cancelled'];
  
  // Fetch expense records from Supabase
  const fetchExpenseRecords = useCallback(async () => {
    setIsLoading(true);
    try {
      // First try to fetch from expense_records table
      const { data: expenseData, error: expenseError } = await supabase
        .from('expense_records')
        .select('*')
        .eq('branch_id', currentBranch?.id || '')
        .order('date', { ascending: false });
      
      if (expenseError) {
        // If expense_records fails, try transactions table with type=expense
        const { data: transactionsData, error: transactionsError } = await supabase
          .from('transactions')
          .select('*')
          .eq('branch_id', currentBranch?.id || '')
          .eq('type', 'expense')
          .order('transaction_date', { ascending: false });
        
        if (transactionsError) {
          console.error('Error fetching expense data:', transactionsError);
          toast.error('Failed to load expense records');
          return;
        }
        
        // Normalize transaction data to match ExpenseRecord structure
        const normalizedTransactions = transactionsData?.map(transaction => ({
          id: transaction.id,
          date: transaction.transaction_date,
          amount: transaction.amount,
          category: transaction.category || 'Uncategorized',
          description: transaction.description || '',
          vendor: transaction.vendor || 'Unknown',
          payment_method: transaction.payment_method || 'cash',
          reference: transaction.reference_id || '',
          branch_id: transaction.branch_id,
          status: transaction.status || 'completed',
          created_at: transaction.created_at,
          updated_at: transaction.updated_at
        })) || [];
        
        setExpenseRecords(normalizedTransactions);
      } else {
        // Use data from expense_records table
        setExpenseRecords(expenseData || []);
      }
    } catch (error) {
      console.error('Error fetching expense records:', error);
      toast.error('Failed to load expense records');
    } finally {
      setIsLoading(false);
    }
  }, [currentBranch?.id]);

  // Set up real-time subscription for expense records
  useEffect(() => {
    fetchExpenseRecords();
    
    // Set up real-time subscriptions for expense-related tables
    const channel = supabase
      .channel('expense_records_changes')
      // Listen for expense_records changes
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'expense_records',
          ...(currentBranch?.id ? { filter: `branch_id=eq.${currentBranch.id}` } : {})
        }, 
        () => {
          console.log('Expense records updated');
          fetchExpenseRecords();
        }
      )
      // Listen for transactions with type=expense changes
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'transactions',
          ...(currentBranch?.id ? { filter: `branch_id=eq.${currentBranch.id}` } : {})
        }, 
        () => {
          console.log('Transaction records updated');
          fetchExpenseRecords();
        }
      )
      .subscribe();
      
    return () => {
      supabase.removeChannel(channel);
    };
  }, [currentBranch?.id, fetchExpenseRecords]);
  
  // Filter expense records based on search term, category, and status
  const filteredExpenseRecords = expenseRecords.filter(record => {
    // Apply tab filters
    if (activeTab === 'rent' && record.category !== 'Rent') return false;
    if (activeTab === 'utilities' && record.category !== 'Utilities') return false;
    if (activeTab === 'equipment' && record.category !== 'Equipment Maintenance') return false;
    if (activeTab === 'other' && !['Other', 'Marketing', 'Supplies', 'Cleaning'].includes(record.category)) return false;
    
    // Apply search filter
    if (searchTerm && !(
      record.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.vendor?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.reference?.toLowerCase().includes(searchTerm.toLowerCase())
    )) return false;
    
    // Apply category filter
    if (categoryFilter !== 'all' && record.category !== categoryFilter) return false;
    
    // Apply status filter
    if (statusFilter !== 'all' && record.status !== statusFilter) return false;
    
    return true;
  });
  
  // Calculate total expenses
  const totalExpenses = filteredExpenseRecords.reduce((sum, record) => sum + (record.amount || 0), 0);

  const handleCreateRecord = () => {
    setFormData({
      date: new Date().toISOString(),
      amount: 0,
      category: 'Uncategorized',
      description: '',
      vendor: '',
      payment_method: 'cash',
      reference: '',
      branch_id: currentBranch?.id || '',
      status: 'pending'
    });
    setShowCreateDialog(true);
  };

  const handleEditRecord = (record: ExpenseRecord) => {
    setSelectedRecord(record);
    setFormData({
      date: record.date,
      amount: record.amount,
      category: record.category,
      description: record.description,
      vendor: record.vendor,
      payment_method: record.payment_method,
      reference: record.reference,
      branch_id: record.branch_id,
      status: record.status
    });
    setShowEditDialog(true);
  };

  const handleDeleteRecord = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this expense record?')) {
      try {
        // First try to delete from expense_records table
        const { error: expenseError } = await supabase
          .from('expense_records')
          .delete()
          .eq('id', id);
        
        if (expenseError) {
          // If that fails, try deleting from transactions table
          const { error: transactionError } = await supabase
            .from('transactions')
            .delete()
            .eq('id', id);
          
          if (transactionError) {
            console.error('Error deleting expense record:', transactionError);
            toast.error('Failed to delete expense record');
            return;
          }
        }
        
        // Update local state
        setExpenseRecords(expenseRecords.filter(record => record.id !== id));
        toast.success('Expense record deleted successfully');
      } catch (error) {
        console.error('Error deleting expense record:', error);
        toast.error('Failed to delete expense record');
      }
    }
  };

  const handleSaveNewRecord = async () => {
    if (formData.amount <= 0) {
      toast.error('Amount must be greater than zero');
      return;
    }
    
    if (!formData.category) {
      toast.error('Please select a category');
      return;
    }
    
    try {
      // Try to insert into expense_records table first
      const { data, error } = await supabase
        .from('expense_records')
        .insert([{
          date: formData.date,
          amount: formData.amount,
          category: formData.category,
          description: formData.description,
          vendor: formData.vendor,
          payment_method: formData.payment_method,
          reference: formData.reference,
          branch_id: formData.branch_id || currentBranch?.id,
          status: formData.status,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }])
        .select();
      
      if (error) {
        // If that fails, insert into transactions table
        const { data: transactionData, error: transactionError } = await supabase
          .from('transactions')
          .insert([{
            type: 'expense',
            amount: formData.amount,
            description: formData.description,
            transaction_date: formData.date,
            payment_method: formData.payment_method,
            category: formData.category,
            branch_id: formData.branch_id || currentBranch?.id,
            reference_id: formData.reference,
            status: formData.status,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }])
          .select();
        
        if (transactionError) {
          console.error('Error creating expense record:', transactionError);
          toast.error('Failed to create expense record');
          return;
        }
        
        // Add the new record to local state
        if (transactionData && transactionData[0]) {
          const newRecord = {
            id: transactionData[0].id,
            date: transactionData[0].transaction_date,
            amount: transactionData[0].amount,
            category: transactionData[0].category,
            description: transactionData[0].description,
            vendor: formData.vendor,
            payment_method: transactionData[0].payment_method,
            reference: transactionData[0].reference_id,
            branch_id: transactionData[0].branch_id,
            status: transactionData[0].status,
            created_at: transactionData[0].created_at,
            updated_at: transactionData[0].updated_at
          };
          setExpenseRecords([newRecord, ...expenseRecords]);
        }
      } else {
        // Add the new record to local state
        if (data && data[0]) {
          setExpenseRecords([data[0], ...expenseRecords]);
        }
      }
      
      setShowCreateDialog(false);
      toast.success('Expense record created successfully');
    } catch (error) {
      console.error('Error creating expense record:', error);
      toast.error('Failed to create expense record');
    }
  };

  const handleUpdateRecord = async () => {
    if (!selectedRecord) return;
    
    if (formData.amount <= 0) {
      toast.error('Amount must be greater than zero');
      return;
    }
    
    if (!formData.category) {
      toast.error('Please select a category');
      return;
    }
    
    try {
      // Check if the record is from expense_records or transactions table
      const isExpenseRecord = await supabase
        .from('expense_records')
        .select('id')
        .eq('id', selectedRecord.id)
        .single();
      
      if (!isExpenseRecord.error) {
        // Update expense_records table
        const { error } = await supabase
          .from('expense_records')
          .update({
            date: formData.date,
            amount: formData.amount,
            category: formData.category,
            description: formData.description,
            vendor: formData.vendor,
            payment_method: formData.payment_method,
            reference: formData.reference,
            branch_id: formData.branch_id,
            status: formData.status,
            updated_at: new Date().toISOString()
          })
          .eq('id', selectedRecord.id);
        
        if (error) {
          console.error('Error updating expense record:', error);
          toast.error('Failed to update expense record');
          return;
        }
      } else {
        // Update transactions table
        const { error } = await supabase
          .from('transactions')
          .update({
            amount: formData.amount,
            description: formData.description,
            transaction_date: formData.date,
            payment_method: formData.payment_method,
            category: formData.category,
            branch_id: formData.branch_id,
            reference_id: formData.reference,
            status: formData.status,
            updated_at: new Date().toISOString()
          })
          .eq('id', selectedRecord.id);
        
        if (error) {
          console.error('Error updating expense record:', error);
          toast.error('Failed to update expense record');
          return;
        }
      }
      
      // Update local state
      setExpenseRecords(expenseRecords.map(record => 
        record.id === selectedRecord.id ? { 
          ...record, 
          date: formData.date,
          amount: formData.amount,
          category: formData.category,
          description: formData.description,
          vendor: formData.vendor,
          payment_method: formData.payment_method,
          reference: formData.reference,
          branch_id: formData.branch_id,
          status: formData.status,
          updated_at: new Date().toISOString()
        } : record
      ));
      
      setShowEditDialog(false);
      toast.success('Expense record updated successfully');
    } catch (error) {
      console.error('Error updating expense record:', error);
      toast.error('Failed to update expense record');
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0
    }).format(amount / 100);
  };

  const getPaymentMethodLabel = (value: string) => {
    return value.charAt(0).toUpperCase() + value.slice(1);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline">Pending</Badge>;
      case 'paid':
        return <Badge variant="default">Paid</Badge>;
      case 'cancelled':
      case 'canceled':
        return <Badge variant="destructive">Cancelled</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="py-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold">Expense Records</h1>
            <p className="text-muted-foreground">Track and manage all gym expenses</p>
          </div>
          <Button onClick={handleCreateRecord}>
            <Plus className="mr-2 h-4 w-4" />
            Add Expense Record
          </Button>
        </div>

        <div className="grid gap-4 md:grid-cols-3 mb-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Expenses
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(totalExpenses)}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Fixed Expenses
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatCurrency(
                  expenseRecords
                    .filter(record => ['Rent', 'Insurance', 'Staff Salaries'].includes(record.category))
                    .reduce((sum, record) => sum + record.amount, 0)
                )}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Variable Expenses
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatCurrency(
                  expenseRecords
                    .filter(record => !['Rent', 'Insurance', 'Staff Salaries'].includes(record.category))
                    .reduce((sum, record) => sum + record.amount, 0)
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Expense Records</CardTitle>
            <CardDescription>
              All gym expenses and payments
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {isLoading ? (
                <div className="space-y-3">
                  {Array(5).fill(0).map((_, i) => (
                    <div key={i} className="flex gap-4 items-center">
                      <Skeleton className="h-12 w-full" />
                    </div>
                  ))}
                </div>
              ) : filteredExpenseRecords.length === 0 ? (
                <div className="text-center py-10">
                  <p className="text-muted-foreground">No expense records found</p>
                  <Button onClick={handleCreateRecord} className="mt-4">
                    <Plus className="mr-2 h-4 w-4" />
                    Add Expense Record
                  </Button>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Vendor</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Payment Method</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredExpenseRecords.map(record => (
                      <TableRow key={record.id}>
                        <TableCell>{format(new Date(record.date), 'dd/MM/yyyy')}</TableCell>
                        <TableCell>{record.category}</TableCell>
                        <TableCell>{record.description}</TableCell>
                        <TableCell>{record.vendor}</TableCell>
                        <TableCell>{formatCurrency(record.amount)}</TableCell>
                        <TableCell>{getPaymentMethodLabel(record.payment_method)}</TableCell>
                        <TableCell>{getStatusBadge(record.status)}</TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button variant="ghost" size="icon" onClick={() => handleEditRecord(record)}>
                              <Edit className="h-4 w-4" />
                            </Button>
                            {record.attachment && (
                              <Button 
                                variant="ghost" 
                                size="icon"
                                onClick={() => toast.info("Downloading attachment...")}
                              >
                                <Download className="h-4 w-4" />
                              </Button>
                            )}
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              onClick={() => handleDeleteRecord(record.id)}
                            >
                              <Trash className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Create Expense Record Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Add Expense Record</DialogTitle>
            <DialogDescription>
              Record a new expense or payment
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="expenseDate">Date</Label>
                <Input 
                  id="expenseDate" 
                  type="date" 
                  value={format(new Date(formData.date), 'yyyy-MM-dd')} 
                  onChange={e => setFormData({
                    ...formData, 
                    date: new Date(e.target.value).toISOString()
                  })}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="expenseAmount">Amount (₹)</Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input 
                    id="expenseAmount" 
                    type="number" 
                    value={formData.amount / 100} 
                    onChange={e => setFormData({
                      ...formData, 
                      amount: Math.round(parseFloat(e.target.value) * 100) || 0
                    })}
                    className="pl-9"
                    step="0.01"
                    min="0"
                  />
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="expenseCategory">Category</Label>
                <Select 
                  value={formData.category} 
                  onValueChange={value => setFormData({...formData, category: value})}
                >
                  <SelectTrigger id="expenseCategory">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {expenseCategories.map(category => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="expenseStatus">Status</Label>
                <Select 
                  value={formData.status} 
                  onValueChange={value => setFormData({
                    ...formData, 
                    status: value as 'pending' | 'paid' | 'cancelled'
                  })}
                >
                  <SelectTrigger id="expenseStatus">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="paid">Paid</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="expenseVendor">Vendor/Payee</Label>
              <Input 
                id="expenseVendor" 
                value={formData.vendor} 
                onChange={e => setFormData({...formData, vendor: e.target.value})}
                placeholder="Who was paid? (e.g., company name, person, etc.)"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="expenseDescription">Description</Label>
              <Textarea 
                id="expenseDescription" 
                value={formData.description} 
                onChange={e => setFormData({...formData, description: e.target.value})}
                placeholder="Additional details about this expense"
                rows={2}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="expensePaymentMethod">Payment Method</Label>
                <Select 
                  value={formData.paymentMethod} 
                  onValueChange={value => setFormData({...formData, paymentMethod: value})}
                >
                  <SelectTrigger id="expensePaymentMethod">
                    <SelectValue placeholder="Select payment method" />
                  </SelectTrigger>
                  <SelectContent>
                    {paymentMethods.map(method => (
                      <SelectItem key={method.value} value={method.value}>
                        {method.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="expenseReference">Reference/Invoice Number</Label>
                <Input 
                  id="expenseReference" 
                  value={formData.reference} 
                  onChange={e => setFormData({...formData, reference: e.target.value})}
                  placeholder="e.g., INV-2023-001"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="expenseAttachment">Attachment (optional)</Label>
              <div className="flex gap-2">
                <Input 
                  id="expenseAttachment" 
                  type="file" 
                  className="flex-1"
                />
                <Button variant="outline" size="icon">
                  <FileText className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                Upload receipt or invoice (PDF, JPG, PNG)
              </p>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCreateDialog(false)}>Cancel</Button>
            <Button onClick={handleSaveNewRecord}>Save Record</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Expense Record Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Edit Expense Record</DialogTitle>
            <DialogDescription>
              Update expense transaction details
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="editExpenseDate">Date</Label>
                <Input 
                  id="editExpenseDate" 
                  type="date" 
                  value={format(new Date(formData.date), 'yyyy-MM-dd')} 
                  onChange={e => setFormData({
                    ...formData, 
                    date: new Date(e.target.value).toISOString()
                  })}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="editExpenseAmount">Amount (₹)</Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input 
                    id="editExpenseAmount" 
                    type="number" 
                    value={formData.amount / 100} 
                    onChange={e => setFormData({
                      ...formData, 
                      amount: Math.round(parseFloat(e.target.value) * 100) || 0
                    })}
                    className="pl-9"
                    step="0.01"
                    min="0"
                  />
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="editExpenseCategory">Category</Label>
                <Select 
                  value={formData.category} 
                  onValueChange={value => setFormData({...formData, category: value})}
                >
                  <SelectTrigger id="editExpenseCategory">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {expenseCategories.map(category => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="editExpenseStatus">Status</Label>
                <Select 
                  value={formData.status} 
                  onValueChange={value => setFormData({
                    ...formData, 
                    status: value as 'pending' | 'paid' | 'cancelled'
                  })}
                >
                  <SelectTrigger id="editExpenseStatus">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="paid">Paid</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="editExpenseVendor">Vendor/Payee</Label>
              <Input 
                id="editExpenseVendor" 
                value={formData.vendor} 
                onChange={e => setFormData({...formData, vendor: e.target.value})}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="editExpenseDescription">Description</Label>
              <Textarea 
                id="editExpenseDescription" 
                value={formData.description} 
                onChange={e => setFormData({...formData, description: e.target.value})}
                rows={2}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="editExpensePaymentMethod">Payment Method</Label>
                <Select 
                  value={formData.paymentMethod} 
                  onValueChange={value => setFormData({...formData, paymentMethod: value})}
                >
                  <SelectTrigger id="editExpensePaymentMethod">
                    <SelectValue placeholder="Select payment method" />
                  </SelectTrigger>
                  <SelectContent>
                    {paymentMethods.map(method => (
                      <SelectItem key={method.value} value={method.value}>
                        {method.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="editExpenseReference">Reference/Invoice Number</Label>
                <Input 
                  id="editExpenseReference" 
                  value={formData.reference} 
                  onChange={e => setFormData({...formData, reference: e.target.value})}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="editExpenseAttachment">Attachment</Label>
              <div className="flex gap-2">
                <Input 
                  id="editExpenseAttachment" 
                  type="file" 
                  className="flex-1"
                />
                {formData.attachment && (
                  <Button 
                    variant="outline" 
                    size="icon"
                    onClick={() => toast.info("Downloading attachment...")}
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEditDialog(false)}>Cancel</Button>
            <Button onClick={handleUpdateRecord}>Update Record</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ExpenseRecordsPage;
