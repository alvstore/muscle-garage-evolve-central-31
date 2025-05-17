import React, { useState, useEffect } from 'react';
import { Container } from '@/components/ui/container';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/ui/data-table';
import { 
  DropdownMenu, 
  DropdownMenuTrigger, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator 
} from '@/components/ui/dropdown-menu';
import { 
  Dialog, 
  DialogTrigger, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter 
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  Select, 
  SelectTrigger, 
  SelectValue, 
  SelectContent, 
  SelectItem 
} from '@/components/ui/select';
import { useTransactions } from '@/hooks/finance/use-transactions';
import { FinancialTransaction } from '@/types/finance';
import { useBranch } from '@/hooks/settings/use-branches';
import { ColumnDef } from '@tanstack/react-table';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { CalendarIcon, Download, Filter, MoreHorizontal, PlusCircle, Search, XCircle, RefreshCw } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const IncomeRecordsPage = () => {
  // State
  const { transactions, isLoading, createTransaction, updateTransaction, deleteTransaction, fetchTransactions } = useTransactions();
  const { currentBranch } = useBranch();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<FinancialTransaction | null>(null);
  const [dateFilter, setDateFilter] = useState<{startDate?: Date, endDate?: Date}>({});
  const [categoryFilter, setCategoryFilter] = useState<string>('');
  const [sourceFilter, setSourceFilter] = useState<string>('');
  
  // Form state
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

  // Constants
  const paymentMethods = ['cash', 'card', 'upi', 'netbanking', 'cheque', 'online', 'wallet', 'razorpay'];
  const transactionCategories = ['Membership Fees', 'Personal Training', 'Supplement Sales', 'Merchandise', 'Events', 'Sponsorships', 'Other'];
  const incomeSources = ['Manual Entry', 'Razorpay', 'Online', 'Webhook', 'Member Payment'];
  
  // Fetch transactions
  useEffect(() => {
    if (currentBranch?.id) {
      loadTransactions();
    }
  }, [currentBranch?.id]);
  
  const loadTransactions = async () => {
    try {
      await fetchTransactions();
    } catch (error) {
      console.error('Error fetching transactions:', error);
      toast.error('Failed to load income data');
    }
  };
  
  // Filter transactions
  const filteredTransactions = transactions.filter(transaction => {
    // Only show income transactions
    if (transaction.type !== 'income') return false;
    
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
    
    // Apply category filter - this takes precedence over tab filters
    if (categoryFilter && categoryFilter !== 'all' && transaction.category !== categoryFilter) return false;
    
    // Only apply tab filters if no category filter is active
    if (!categoryFilter || categoryFilter === 'all') {
      if (activeTab === 'membership' && transaction.category !== 'Membership Fees') return false;
      if (activeTab === 'services' && !['Personal Training', 'Events'].includes(transaction.category || '')) return false;
      if (activeTab === 'sales' && !['Supplement Sales', 'Merchandise'].includes(transaction.category || '')) return false;
      if (activeTab === 'other' && !['Other', 'Sponsorships'].includes(transaction.category || '')) return false;
    }
    
    // Apply source filter
    if (sourceFilter && sourceFilter !== 'all' && transaction.source !== sourceFilter) return false;
    
    return true;
  });

  // Calculate total income
  const totalIncome = filteredTransactions.reduce((sum, transaction) => sum + parseFloat(transaction.amount?.toString() || '0'), 0);

  // Form handling functions
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewTransaction(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setNewTransaction(prev => ({ ...prev, [name]: value }));
  };

  const handleDateChange = (date: Date | undefined) => {
    if (date) {
      setNewTransaction(prev => ({ ...prev, transaction_date: date.toISOString() }));
    }
  };

  // Reset form
  const resetForm = () => {
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
  };

  // Handler for adding a new transaction
  const handleAddTransaction = async () => {
    if (!newTransaction.description || !newTransaction.amount || !newTransaction.category) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      await createTransaction({
        ...newTransaction,
        branch_id: currentBranch?.id || '',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      });

      // Close dialog and reset form
      setIsAddDialogOpen(false);
      resetForm();

      toast.success('Income record added successfully');
      loadTransactions(); // Refresh the list
    } catch (error) {
      console.error('Error adding transaction:', error);
      toast.error('Failed to add income record');
    }
  };

  // Handler for editing a transaction
  const handleEditTransaction = async () => {
    if (!selectedTransaction) return;

    try {
      await updateTransaction(selectedTransaction.id, {
        ...selectedTransaction,
        updated_at: new Date().toISOString()
      });

      // Close dialog and reset selection
      setIsEditDialogOpen(false);
      setSelectedTransaction(null);

      toast.success('Transaction updated successfully');
      loadTransactions(); // Refresh the list
    } catch (error) {
      console.error('Error updating transaction:', error);
      toast.error('Failed to update transaction');
    }
  };

  // Handler for deleting a transaction
  const handleDeleteTransaction = async () => {
    if (!selectedTransaction) return;

    try {
      await deleteTransaction(selectedTransaction.id);

      // Update local state by removing the deleted transaction
      setIsDeleteDialogOpen(false);
      setSelectedTransaction(null);

      toast.success('Transaction deleted successfully');
      loadTransactions(); // Refresh the list
    } catch (error) {
      console.error('Error deleting transaction:', error);
      toast.error('Failed to delete transaction');
    }
  };

  // Filter handling
  const handleDateRangeChange = (range: { from?: Date; to?: Date }) => {
    setDateFilter({
      startDate: range.from,
      endDate: range.to
    });
  };

  const resetFilters = () => {
    setSearchTerm('');
    setDateFilter({});
    setCategoryFilter('');
    setSourceFilter('');
    setActiveTab('all');
  };
  
  // Export data function
  const handleExportData = () => {
    if (filteredTransactions.length === 0) {
      toast.error('No data to export');
      return;
    }
    
    try {
      // Create CSV content
      const headers = ['Date', 'Description', 'Category', 'Source', 'Amount', 'Payment Method', 'Status', 'Reference ID'];
      
      let csvContent = headers.join(',') + '\n';
      
      filteredTransactions.forEach(transaction => {
        const date = format(new Date(transaction.transaction_date || transaction.created_at), 'yyyy-MM-dd');
        const description = transaction.description ? `"${transaction.description.replace(/"/g, '""')}"` : '';
        const category = transaction.category || 'Uncategorized';
        const source = transaction.source || 'Manual';
        const amount = transaction.amount.toString();
        const paymentMethod = transaction.payment_method || '';
        const status = transaction.status || '';
        const referenceId = transaction.reference_id || '';
        
        const row = [date, description, category, source, amount, paymentMethod, status, referenceId].join(',');
        csvContent += row + '\n';
      });
      
      // Create a blob and download link
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `income-records-${format(new Date(), 'yyyy-MM-dd')}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast.success('Export successful');
    } catch (error) {
      console.error('Error exporting data:', error);
      toast.error('Failed to export data');
    }
  };

  // Helper function to format currency
  const formatCurrency = (amount: number | string) => {
    const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
    return `₹${numAmount.toFixed(2)}`;
  };
  
  // Define columns for the DataTable
  const columns: ColumnDef<FinancialTransaction>[] = [
    {
      accessorKey: 'transaction_date',
      header: 'Date',
      cell: ({ row }) => {
        return format(new Date(row.original.transaction_date || row.original.created_at), 'dd MMM yyyy');
      },
    },
    {
      accessorKey: 'description',
      header: 'Description',
    },
    {
      accessorKey: 'category',
      header: 'Category',
      cell: ({ row }) => {
        return <Badge variant="outline">{row.original.category || 'Uncategorized'}</Badge>;
      },
    },
    {
      accessorKey: 'source',
      header: 'Source',
      cell: ({ row }) => {
        return <Badge variant="secondary">{row.original.source || 'Manual'}</Badge>;
      },
    },
    {
      accessorKey: 'amount',
      header: 'Amount',
      cell: ({ row }) => {
        return formatCurrency(row.original.amount);
      },
    },
    {
      accessorKey: 'payment_method',
      header: 'Payment Method',
      cell: ({ row }) => {
        return (
          <span className="capitalize">{row.original.payment_method}</span>
        );
      },
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => {
        const status = row.original.status;
        let badgeClass = "";
        
        switch(status) {
          case 'completed':
            badgeClass = "bg-green-100 text-green-800";
            break;
          case 'pending':
            badgeClass = "bg-yellow-100 text-yellow-800";
            break;
          case 'cancelled':
            badgeClass = "bg-red-100 text-red-800";
            break;
          default:
            badgeClass = "bg-gray-100 text-gray-800";
        }
        
        return <Badge className={badgeClass}>{status}</Badge>;
      },
    },
    {
      id: 'actions',
      cell: ({ row }) => {
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>View details</DropdownMenuItem>
              <DropdownMenuItem onClick={() => {
                setSelectedTransaction(row.original);
                setIsEditDialogOpen(true);
              }}>Edit income</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-red-600"
                onClick={() => {
                  setSelectedTransaction(row.original);
                  setIsDeleteDialogOpen(true);
                }}
              >
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  return (
    <Container>
      <div className="py-6">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Income Records</h1>
            <p className="text-muted-foreground">Track and manage all your income sources</p>
          </div>
          <Button onClick={() => setIsAddDialogOpen(true)}>
            <PlusCircle className="h-4 w-4 mr-2" />
            Add Income
          </Button>
        </div>

        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row justify-between gap-4">
              <div>
                <CardTitle>All Income Records</CardTitle>
                <CardDescription>
                  {filteredTransactions.length} income records found
                </CardDescription>
              </div>
              <div className="flex flex-col sm:flex-row gap-2">
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search income..."
                    className="pl-8 w-full sm:w-[200px]"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <Select value={categoryFilter || 'all'} onValueChange={setCategoryFilter}>
                  <SelectTrigger className="w-full sm:w-[200px]">
                    <div className="flex items-center">
                      <Filter className="h-4 w-4 mr-2" />
                      <SelectValue placeholder="All Categories" />
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {transactionCategories.map((category) => (
                      <SelectItem key={category} value={category}>{category}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button variant="outline" onClick={handleExportData}>
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-3">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-20 w-full" />
                <Skeleton className="h-20 w-full" />
                <Skeleton className="h-20 w-full" />
              </div>
            ) : (
              <DataTable 
                columns={columns} 
                data={filteredTransactions} 
              />
            )}
          </CardContent>
        </Card>
        
        {/* Add Income Dialog */}
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Add New Income</DialogTitle>
              <DialogDescription>
                Enter income details to add a new record to the system.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="description" className="required">Description</Label>
                  <Input
                    id="description"
                    name="description"
                    value={newTransaction.description}
                    onChange={handleInputChange}
                    placeholder="Enter income description"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="amount" className="required">Amount</Label>
                  <Input
                    id="amount"
                    name="amount"
                    type="number"
                    value={newTransaction.amount}
                    onChange={handleInputChange}
                    placeholder="0.00"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category" className="required">Category</Label>
                  <Select
                    value={newTransaction.category?.toString() || ''}
                    onValueChange={(value) => handleSelectChange('category', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {transactionCategories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="transaction_date">Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-left font-normal"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {newTransaction.transaction_date ? (
                          format(new Date(newTransaction.transaction_date), 'PPP')
                        ) : (
                          <span>Pick a date</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={newTransaction.transaction_date ? new Date(newTransaction.transaction_date) : undefined}
                        onSelect={handleDateChange}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="payment_method">Payment Method</Label>
                  <Select
                    value={newTransaction.payment_method?.toString() || 'cash'}
                    onValueChange={(value) => handleSelectChange('payment_method', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select payment method" />
                    </SelectTrigger>
                    <SelectContent>
                      {paymentMethods.map((method) => (
                        <SelectItem key={method} value={method}>
                          <span className="capitalize">{method}</span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="source">Source</Label>
                  <Select
                    value={newTransaction.source?.toString() || 'Manual Entry'}
                    onValueChange={(value) => handleSelectChange('source', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select source" />
                    </SelectTrigger>
                    <SelectContent>
                      {incomeSources.map((source) => (
                        <SelectItem key={source} value={source}>
                          {source}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="reference_id">Reference ID</Label>
                  <Input
                    id="reference_id"
                    name="reference_id"
                    value={newTransaction.reference_id}
                    onChange={handleInputChange}
                    placeholder="Optional reference number"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select
                    value={newTransaction.status?.toString() || 'completed'}
                    onValueChange={(value) => handleSelectChange('status', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleAddTransaction}>Add Income</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        
        {/* Edit Income Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Edit Income Record</DialogTitle>
              <DialogDescription>
                Update the details of this income record.
              </DialogDescription>
            </DialogHeader>
            {selectedTransaction && (
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit-description">Description</Label>
                    <Input
                      id="edit-description"
                      value={selectedTransaction.description}
                      onChange={(e) => setSelectedTransaction({...selectedTransaction, description: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-amount">Amount</Label>
                    <Input
                      id="edit-amount"
                      type="number"
                      value={selectedTransaction.amount}
                      onChange={(e) => setSelectedTransaction({...selectedTransaction, amount: parseFloat(e.target.value)})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-category">Category</Label>
                    <Select
                      value={selectedTransaction.category?.toString() || ''}
                      onValueChange={(value) => setSelectedTransaction({...selectedTransaction, category: value})}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {transactionCategories.map((category) => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-status">Status</Label>
                    <Select
                      value={selectedTransaction.status?.toString() || 'completed'}
                      onValueChange={(value) => setSelectedTransaction({...selectedTransaction, status: value})}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="completed">Completed</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="cancelled">Cancelled</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleEditTransaction}>Save Changes</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        
        {/* Delete Confirmation Dialog */}
        <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirm Deletion</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete this income record? This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>Cancel</Button>
              <Button variant="destructive" onClick={handleDeleteTransaction}>Delete</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </Container>
  );
};

export default IncomeRecordsPage;
