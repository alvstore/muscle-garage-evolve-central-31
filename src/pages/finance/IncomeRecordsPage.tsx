import React, { useState, useEffect } from 'react';
import { Container } from '@/components/ui/container';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { CalendarIcon } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { useTransactions } from '@/hooks/use-transactions';
import { FinancialTransaction } from '@/types/finance';
import { toast } from 'sonner';
import { useBranch } from '@/hooks/use-branch';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

const IncomeRecordsPage = () => {
  const { transactions, isLoading, createTransaction, updateTransaction, deleteTransaction } = useTransactions();
  const { currentBranch } = useBranch();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<FinancialTransaction | null>(null);

  const [newTransaction, setNewTransaction] = useState<Partial<FinancialTransaction>>({
    type: 'income',
    amount: 0,
    description: '',
    transaction_date: new Date().toISOString(),
    payment_method: 'cash',
    category: '', // Use category instead of category_id
    branch_id: currentBranch?.id || '',
    reference_id: '',
    status: 'completed'
  });

  const paymentMethods = ['cash', 'credit_card', 'bank_transfer', 'mobile_payment'];
  const transactionCategories = ['sales', 'services', 'membership_fees', 'other'];

  // Handle input change for new transaction
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewTransaction(prev => ({ ...prev, [name]: value }));
  };

  // Handle select change for new transaction
  const handleSelectChange = (name: string, value: string) => {
    setNewTransaction(prev => ({ ...prev, [name]: value }));
  };

  // Handle date change for new transaction
  const handleDateChange = (date: Date | undefined) => {
    if (date) {
      setNewTransaction(prev => ({ ...prev, transaction_date: date.toISOString() }));
    }
  };

  // Handle editing a transaction
  const handleEdit = (transaction: FinancialTransaction) => {
    setEditingTransaction({
      ...transaction,
      category: transaction.category, // Keep category as is
      reference_id: transaction.reference_id // Keep reference_id as is
    });
    setIsDialogOpen(true);
  };

  // Handle saving the edited transaction
  const handleSave = async () => {
    if (!editingTransaction) return;

    try {
      await updateTransaction(editingTransaction.id, {
        ...editingTransaction,
        category: editingTransaction.category, // Use category instead of category_id
        reference_id: editingTransaction.reference_id, // Use reference_id instead of reference
        updated_at: new Date().toISOString()
      });
      setEditingTransaction(null);
      setIsDialogOpen(false);
      toast.success('Transaction updated successfully');
    } catch (error) {
      console.error('Error updating transaction:', error);
      toast.error('Failed to update transaction');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteTransaction(id);
      toast.success('Transaction deleted successfully');
    } catch (error) {
      console.error('Error deleting transaction:', error);
      toast.error('Failed to delete transaction');
    }
  };

  const handleCreate = async () => {
    try {
      const result = await createTransaction({
        ...newTransaction as Omit<FinancialTransaction, 'id'>,
        category: newTransaction.category, // Use category instead of category_id
        reference_id: newTransaction.reference_id, // Use reference_id instead of reference
        transaction_date: newTransaction.transaction_date || new Date().toISOString(),
        status: 'completed',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      });

      // Reset form and close dialog
      setNewTransaction({
        type: 'income',
        amount: 0,
        description: '',
        transaction_date: new Date().toISOString(),
        payment_method: 'cash',
        category: '', // Use category instead of category_id
        branch_id: currentBranch?.id || '',
        reference_id: '',
        status: 'completed'
      });
      setIsDialogOpen(false);
      toast.success('Transaction created successfully');
      return result;
    } catch (error) {
      console.error('Error creating transaction:', error);
      toast.error('Failed to create transaction');
      return null;
    }
  };

  return (
    <Container>
      <div className="py-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Income Records</h1>
          <Button onClick={() => setIsDialogOpen(true)}>Add Income</Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Recent Income</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">Date</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Payment Method</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactions.map((transaction) => (
                  <TableRow key={transaction.id}>
                    <TableCell className="font-medium">{format(new Date(transaction.transaction_date), 'MMM dd, yyyy')}</TableCell>
                    <TableCell>{transaction.description}</TableCell>
                    <TableCell>{transaction.category}</TableCell>
                    <TableCell>${transaction.amount.toFixed(2)}</TableCell>
                    <TableCell>{transaction.payment_method}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm" onClick={() => handleEdit(transaction)}>
                        Edit
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleDelete(transaction.id)}>
                        Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{editingTransaction ? 'Edit Income' : 'Add Income'}</DialogTitle>
              <DialogDescription>
                {editingTransaction ? 'Edit the income details.' : 'Enter the income details.'}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="description" className="text-right">
                  Description
                </Label>
                <Input
                  type="text"
                  id="description"
                  name="description"
                  value={editingTransaction ? editingTransaction.description : newTransaction.description || ''}
                  onChange={editingTransaction ? (e) => setEditingTransaction({ ...editingTransaction, description: e.target.value }) : handleInputChange}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="amount" className="text-right">
                  Amount
                </Label>
                <Input
                  type="number"
                  id="amount"
                  name="amount"
                  value={editingTransaction ? editingTransaction.amount : newTransaction.amount || 0}
                  onChange={editingTransaction ? (e) => setEditingTransaction({ ...editingTransaction, amount: parseFloat(e.target.value) }) : handleInputChange}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="payment_method" className="text-right">
                  Payment Method
                </Label>
                <Select
                  value={editingTransaction ? editingTransaction.payment_method : newTransaction.payment_method || 'cash'}
                  onValueChange={value => editingTransaction ? setEditingTransaction({ ...editingTransaction, payment_method: value }) : handleSelectChange('payment_method', value)}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select payment method" />
                  </SelectTrigger>
                  <SelectContent>
                    {paymentMethods.map(method => (
                      <SelectItem key={method} value={method}>{method}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="category" className="text-right">
                  Category
                </Label>
                <Select
                  value={editingTransaction ? editingTransaction.category : newTransaction.category || ''}
                  onValueChange={value => editingTransaction ? setEditingTransaction({ ...editingTransaction, category: value }) : handleSelectChange('category', value)}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {transactionCategories.map(category => (
                      <SelectItem key={category} value={category}>{category}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="transaction_date" className="text-right">
                  Transaction Date
                </Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "col-span-3 pl-3 text-left font-normal",
                        !newTransaction.transaction_date && "text-muted-foreground"
                      )}
                    >
                      {newTransaction.transaction_date ? (
                        format(new Date(newTransaction.transaction_date), "MMM dd, yyyy")
                      ) : (
                        <span>Pick a date</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      defaultMonth={new Date()}
                      selected={newTransaction.transaction_date ? new Date(newTransaction.transaction_date) : undefined}
                      onSelect={handleDateChange}
                      disabled={false}
                      className="rounded-md border"
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
            <div className="flex justify-end space-x-2">
              <Button type="button" variant="secondary" onClick={() => {
                setIsDialogOpen(false);
                setEditingTransaction(null);
              }}>
                Cancel
              </Button>
              <Button type="submit" onClick={editingTransaction ? handleSave : handleCreate}>
                {editingTransaction ? 'Update Income' : 'Add Income'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </Container>
  );
};

export default IncomeRecordsPage;
