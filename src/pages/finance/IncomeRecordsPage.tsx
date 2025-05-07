import React, { useState, useEffect } from 'react';
import { Container } from "@/components/ui/container";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Trash, Download, DollarSign } from "lucide-react";
import { toast } from "sonner";
import { format } from 'date-fns';
import { useIncomeRecords } from '@/hooks/use-income-records';
import { FinancialTransaction, PaymentMethod } from '@/types/finance';
import { useBranch } from '@/hooks/use-branch';

const IncomeRecordsPage = () => {
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<FinancialTransaction | null>(null);
  const { currentBranch } = useBranch();
  
  // Form state with all properties needed
  const [formData, setFormData] = useState<Partial<FinancialTransaction>>({
    type: 'income' as const,
    amount: 0,
    description: '',
    payment_method: 'cash' as PaymentMethod,
    branch_id: currentBranch?.id || '',
    category_id: '',
    reference_id: null,
    transaction_id: null,
    category: '', // Used by some components
    reference: '', // Used by some components
  });

  const {
    records,
    isLoading,
    error,
    createRecord,
    updateRecord,
    deleteRecord,
    uploadAttachment,
    deleteAttachment
  } = useIncomeRecords();

  // Income categories - will be replaced with data from Supabase
  const incomeCategories = [
    'Membership',
    'PT Session',
    'Group Class',
    'Store',
    'Supplements',
    'Merchandise',
    'Events',
    'Other'
  ];

  // Payment methods
  const paymentMethods = [
    { value: 'cash', label: 'Cash' },
    { value: 'credit', label: 'Credit Card' },
    { value: 'debit', label: 'Debit Card' },
    { value: 'upi', label: 'UPI' },
    { value: 'bank_transfer', label: 'Bank Transfer' },
    { value: 'cheque', label: 'Cheque' },
    { value: 'other', label: 'Other' }
  ];

  // Update form data when currentBranch changes
  useEffect(() => {
    if (currentBranch?.id) {
      setFormData(prev => ({
        ...prev,
        branch_id: currentBranch.id
      }));
    }
  }, [currentBranch]);

  const handleCreateRecord = () => {
    setFormData({
      type: 'income' as const,
      amount: 0,
      description: '',
      payment_method: 'cash' as PaymentMethod,
      branch_id: currentBranch?.id || '',
      reference_id: null,
      transaction_id: null,
      category_id: null,
      category: '', // Used by UI
      reference: '', // Used by UI
    });
    setShowCreateDialog(true);
  };

  const handleEditRecord = (record: FinancialTransaction) => {
    setSelectedRecord(record);
    setFormData({
      type: record.type,
      amount: record.amount,
      description: record.description,
      payment_method: record.payment_method as PaymentMethod,
      branch_id: record.branch_id,
      reference_id: record.reference_id,
      transaction_id: record.transaction_id,
      category_id: record.category_id,
      category: record.category, // Used by UI
      reference: record.reference || record.reference_id || '', // Used by UI
    });
    setShowEditDialog(true);
  };

  const handleCreate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const newRecord: Partial<FinancialTransaction> = {
        type: 'income',
        amount: formData.amount,
        description: formData.description,
        payment_method: formData.payment_method as PaymentMethod,
        branch_id: formData.branch_id,
        reference_id: formData.reference_id,
        transaction_id: formData.transaction_id,
        category_id: formData.category_id,
        category: formData.category, // Keep for UI
        reference: formData.reference, // Keep for UI
        transaction_date: formData.transaction_date || new Date().toISOString(),
      };

      await createRecord(newRecord);
      setShowCreateDialog(false);
      toast.success('Income record created successfully');
    } catch (error) {
      console.error('Error creating income record:', error);
      toast.error('Failed to create income record');
    }
  };

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRecord) return;

    try {
      const updatedRecord: Partial<FinancialTransaction> = {
        amount: formData.amount,
        description: formData.description,
        payment_method: formData.payment_method as PaymentMethod,
        branch_id: formData.branch_id,
        reference_id: formData.reference_id,
        transaction_id: formData.transaction_id,
        category_id: formData.category_id,
        category: formData.category, // Keep for UI
        reference: formData.reference, // Keep for UI
      };

      await updateRecord(selectedRecord.id, updatedRecord);
      setShowEditDialog(false);
      toast.success('Income record updated successfully');
    } catch (error) {
      console.error('Error updating income record:', error);
      toast.error('Failed to update income record');
    }
  };

  const handleDelete = async (recordId: string) => {
    try {
      await deleteRecord(recordId);
      toast.success('Income record deleted successfully');
    } catch (error) {
      console.error('Error deleting income record:', error);
      toast.error('Failed to delete income record');
    }
  };

  return (
    <Container>
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>
              <div className="flex items-center gap-2">
                <DollarSign className="h-4 w-4" />
                Income Records
              </div>
            </CardTitle>
            <Button 
              onClick={handleCreateRecord}
              className="flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Add Income
            </Button>
          </div>
          <CardDescription>
            Track all income sources and manage financial records
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <div className="text-destructive mb-4">
              {error}
            </div>
          )}
          {isLoading ? (
            <div className="text-muted-foreground">Loading records...</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Source</TableHead>
                  <TableHead>Payment Method</TableHead>
                  <TableHead>Reference</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {records.map((record) => (
                  <TableRow key={record.id}>
                    <TableCell>
                      {record.transaction_date && format(new Date(record.transaction_date), 'MMM d, yyyy')}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <DollarSign className="h-4 w-4" />
                        {record.amount.toLocaleString()}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{record.category || 'N/A'}</Badge>
                    </TableCell>
                    <TableCell>N/A</TableCell>
                    <TableCell>{record.payment_method}</TableCell>
                    <TableCell>{record.reference || record.reference_id || 'N/A'}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEditRecord(record)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(record.id)}
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
        </CardContent>
      </Card>

      {/* Create Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Income Record</DialogTitle>
            <DialogDescription>
              Enter details for the new income record
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleCreate}>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="transaction_date">Date</Label>
                <Input
                  id="transaction_date"
                  type="datetime-local"
                  value={formData.transaction_date}
                  onChange={(e) => setFormData(prev => ({ ...prev, transaction_date: e.target.value }))}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="amount">Amount</Label>
                <Input
                  id="amount"
                  type="number"
                  value={formData.amount}
                  onChange={(e) => setFormData(prev => ({ ...prev, amount: Number(e.target.value) }))}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="category">Category</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) => setFormData(prev => ({ 
                    ...prev, 
                    category: value,
                    category_id: value // Also set category_id
                  }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {incomeCategories.map(cat => (
                      <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="payment_method">Payment Method</Label>
                <Select
                  value={formData.payment_method as string}
                  onValueChange={(value) => setFormData(prev => ({ 
                    ...prev, 
                    payment_method: value as PaymentMethod 
                  }))}
                >
                  <SelectTrigger>
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
              <div className="grid gap-2">
                <Label htmlFor="reference">Reference</Label>
                <Input
                  id="reference"
                  value={formData.reference}
                  onChange={(e) => setFormData(prev => ({ 
                    ...prev, 
                    reference: e.target.value,
                    reference_id: e.target.value
                  }))}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit">Save</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Income Record</DialogTitle>
            <DialogDescription>
              Update the income record details
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleEdit}>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="edit_transaction_date">Date</Label>
                <Input
                  id="edit_transaction_date"
                  type="datetime-local"
                  value={formData.transaction_date}
                  onChange={(e) => setFormData(prev => ({ ...prev, transaction_date: e.target.value }))}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit_amount">Amount</Label>
                <Input
                  id="edit_amount"
                  type="number"
                  value={formData.amount}
                  onChange={(e) => setFormData(prev => ({ ...prev, amount: Number(e.target.value) }))}
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="edit_payment_method">Payment Method</Label>
                <Select 
                  value={formData.payment_method as string} 
                  onValueChange={(value) => setFormData(prev => ({ 
                    ...prev, 
                    payment_method: value as PaymentMethod 
                  }))}
                >
                  <SelectTrigger id="edit_payment_method">
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
              
              <div className="grid gap-2">
                <Label htmlFor="edit_description">Description</Label>
                <Textarea 
                  id="edit_description" 
                  value={formData.description} 
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  rows={2}
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="edit_reference">Reference/Invoice Number</Label>
                <Input 
                  id="edit_reference" 
                  value={formData.reference} 
                  onChange={(e) => setFormData(prev => ({ 
                    ...prev, 
                    reference: e.target.value,
                    reference_id: e.target.value
                  }))}
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="edit_attachment">Attachment</Label>
                <div className="flex gap-2">
                  <Input 
                    id="edit_attachment" 
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
              <Button type="submit">Update Record</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </Container>
  );
};

export default IncomeRecordsPage;
