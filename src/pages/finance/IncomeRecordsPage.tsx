import React, { useState, useEffect } from 'react';
import { Container } from '@/components/ui/container';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { CalendarIcon, Download, Filter, Search, RefreshCw } from 'lucide-react';
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
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';

const IncomeRecordsPage = () => {
  const { transactions, isLoading, createTransaction, updateTransaction, deleteTransaction, fetchTransactions } = useTransactions();
  const { currentBranch } = useBranch();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<FinancialTransaction | null>(null);
  const [activeTab, setActiveTab] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState<{startDate?: Date, endDate?: Date}>({});
  const [categoryFilter, setCategoryFilter] = useState<string>('');
  const [sourceFilter, setSourceFilter] = useState<string>('');

  const [newTransaction, setNewTransaction] = useState<Partial<FinancialTransaction>>({
    type: 'income',
    amount: 0,
    description: '',
    transaction_date: new Date().toISOString(),
    payment_method: 'cash',
    category: '',
    branch_id: currentBranch?.id || '',
    reference_id: '',
    status: 'completed',
    source: 'Manual Entry'
  });

  const paymentMethods = ['cash', 'card', 'upi', 'netbanking', 'cheque', 'online', 'wallet', 'razorpay'];
  const transactionCategories = ['Membership Fees', 'Personal Training', 'Supplement Sales', 'Merchandise', 'Events', 'Sponsorships', 'Other'];
  const incomeSources = ['Manual Entry', 'Razorpay', 'Online', 'Webhook', 'Member Payment'];

  // Filter transactions
  const filteredTransactions = transactions.filter(transaction => {
    // Only show income transactions
    if (transaction.type !== 'income') return false;
    
    // Apply tab filters
    if (activeTab === 'membership' && transaction.category !== 'Membership Fees') return false;
    if (activeTab === 'services' && !['Personal Training', 'Events'].includes(transaction.category || '')) return false;
    if (activeTab === 'sales' && !['Supplement Sales', 'Merchandise'].includes(transaction.category || '')) return false;
    if (activeTab === 'other' && !['Other', 'Sponsorships'].includes(transaction.category || '')) return false;
    
    // Apply search filter
    if (searchTerm && !(
      transaction.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.source?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.reference_id?.toLowerCase().includes(searchTerm.toLowerCase())
    )) return false;
    
    // Apply date filter
    if (dateFilter.startDate && new Date(transaction.transaction_date) < dateFilter.startDate) return false;
    if (dateFilter.endDate) {
      const endDate = new Date(dateFilter.endDate);
      endDate.setHours(23, 59, 59, 999); // Set to end of day
      if (new Date(transaction.transaction_date) > endDate) return false;
    }
    
    // Apply category filter
    if (categoryFilter && transaction.category !== categoryFilter) return false;
    
    // Apply source filter
    if (sourceFilter && transaction.source !== sourceFilter) return false;
    
    return true;
  });

  // Calculate total income
  const totalIncome = filteredTransactions.reduce((sum, transaction) => sum + (transaction.amount || 0), 0);

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
      category: transaction.category,
      reference_id: transaction.reference_id
    });
    setIsDialogOpen(true);
  };

  // Handle saving the edited transaction
  const handleSave = async () => {
    if (!editingTransaction) return;

    try {
      await updateTransaction(editingTransaction.id, {
        ...editingTransaction,
        category: editingTransaction.category,
        reference_id: editingTransaction.reference_id,
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
        category: newTransaction.category,
        reference_id: newTransaction.reference_id,
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
        category: '',
        branch_id: currentBranch?.id || '',
        reference_id: '',
        status: 'completed',
        source: 'Manual Entry'
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

  const handleRefresh = () => {
    fetchTransactions();
    toast.success('Refreshing income records...');
  };

  const resetFilters = () => {
    setSearchTerm('');
    setDateFilter({});
    setCategoryFilter('all');
    setSourceFilter('all');
    setActiveTab('all');
  };

  return (
    <Container>
      <div className="py-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold">Income Records</h1>
            <p className="text-muted-foreground">Manage all your gym income sources</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="icon" onClick={handleRefresh} title="Refresh data">
              <RefreshCw className="h-4 w-4" />
            </Button>
            <Button onClick={() => setIsDialogOpen(true)}>Add Income</Button>
          </div>
        </div>

        <div className="mb-6">
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row gap-4 justify-between mb-6">
                <div className="flex flex-1 gap-2">
                  <div className="relative flex-1">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search income records..."
                      className="pl-8"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <Button variant="outline" onClick={resetFilters} className="shrink-0">
                    Reset
                  </Button>
                </div>
                <div className="flex gap-2">
                  <Select value={categoryFilter || "all"} onValueChange={setCategoryFilter}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Filter by category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      {transactionCategories.map(category => (
                        <SelectItem key={category} value={category}>{category}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select value={sourceFilter || "all"} onValueChange={setSourceFilter}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Filter by source" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Sources</SelectItem>
                      {incomeSources.map(source => (
                        <SelectItem key={source} value={source}>{source}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                  <TabsList className="w-full justify-start">
                    <TabsTrigger value="all">All Income</TabsTrigger>
                    <TabsTrigger value="membership">Membership</TabsTrigger>
                    <TabsTrigger value="services">Services</TabsTrigger>
                    <TabsTrigger value="sales">Sales</TabsTrigger>
                    <TabsTrigger value="other">Other</TabsTrigger>
                  </TabsList>
                </Tabs>
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground">Total:</span>
                  <span className="font-bold text-lg">₹{totalIncome.toFixed(2)}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Income Records</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              // Loading skeleton
              <div className="space-y-2">
                {Array(5).fill(0).map((_, i) => (
                  <div key={i} className="flex items-center space-x-4">
                    <Skeleton className="h-12 w-12" />
                    <Skeleton className="h-4 w-[250px]" />
                    <Skeleton className="h-4 w-[100px]" />
                    <Skeleton className="h-4 w-[80px]" />
                  </div>
                ))}
              </div>
            ) : filteredTransactions.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[120px]">Date</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Source</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Payment Method</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTransactions.map((transaction) => (
                    <TableRow key={transaction.id}>
                      <TableCell className="font-medium">
                        {format(new Date(transaction.transaction_date || transaction.created_at), 'MMM dd, yyyy')}
                      </TableCell>
                      <TableCell>{transaction.description}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{transaction.category || 'Uncategorized'}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">{transaction.source || 'Manual'}</Badge>
                      </TableCell>
                      <TableCell className="font-medium">₹{transaction.amount.toFixed(2)}</TableCell>
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
                <TableFooter>
                  <TableRow>
                    <TableCell colSpan={4}>Total</TableCell>
                    <TableCell className="font-medium">₹{totalIncome.toFixed(2)}</TableCell>
                    <TableCell colSpan={2}></TableCell>
                  </TableRow>
                </TableFooter>
              </Table>
            ) : (
              <div className="text-center py-10">
                <p className="text-muted-foreground">No income records found</p>
                <Button variant="outline" className="mt-4" onClick={() => setIsDialogOpen(true)}>
                  Add your first income record
                </Button>
              </div>
            )}
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
