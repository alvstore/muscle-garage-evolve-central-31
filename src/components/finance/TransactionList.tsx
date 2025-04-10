
import { useState, useEffect } from "react";
import { 
  Table, TableBody, TableCell, TableHead, 
  TableHeader, TableRow 
} from "@/components/ui/table";
import { 
  Card, CardContent, CardHeader, CardTitle 
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, 
  DropdownMenuLabel, DropdownMenuTrigger,
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";
import { 
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue 
} from "@/components/ui/select";
import { 
  SearchIcon, PlusIcon, MoreVerticalIcon, ArrowDownIcon, ArrowUpIcon,
  FilterIcon, TrashIcon, FileIcon, RefreshCcwIcon, CalendarIcon,
  Download
} from "lucide-react";
import { FinancialTransaction } from "@/types/finance";
import { format } from "date-fns";
import TransactionForm from "./TransactionForm";
import { toast } from "sonner";

// Mock data for transactions
const mockTransactions: FinancialTransaction[] = [
  {
    id: "tr-1",
    type: "income",
    amount: 10500,
    date: "2023-06-01T10:00:00Z",
    category: "membership",
    description: "Monthly membership fees - June 2023",
    recurring: true,
    recurringPeriod: "monthly",
    paymentMethod: "bank-transfer",
    createdBy: "admin-1",
    createdAt: "2023-06-01T10:00:00Z",
    updatedAt: "2023-06-01T10:00:00Z",
  },
  {
    id: "tr-2",
    type: "expense",
    amount: 3000,
    date: "2023-06-02T14:30:00Z",
    category: "rent",
    description: "Monthly rent payment - June 2023",
    recurring: true,
    recurringPeriod: "monthly",
    paymentMethod: "bank-transfer",
    createdBy: "admin-1",
    createdAt: "2023-06-02T14:30:00Z",
    updatedAt: "2023-06-02T14:30:00Z",
  },
  {
    id: "tr-3",
    type: "income",
    amount: 1500,
    date: "2023-06-03T15:45:00Z",
    category: "personal-training",
    description: "PT session with client #123 - 10 sessions package",
    recurring: false,
    recurringPeriod: "none",
    paymentMethod: "card",
    relatedInvoiceId: "inv-123",
    createdBy: "staff-1",
    createdAt: "2023-06-03T15:45:00Z",
    updatedAt: "2023-06-03T15:45:00Z",
  },
  {
    id: "tr-4",
    type: "expense",
    amount: 750,
    date: "2023-06-05T09:15:00Z",
    category: "utilities",
    description: "Electricity bill - May 2023",
    recurring: true,
    recurringPeriod: "monthly",
    paymentMethod: "bank-transfer",
    createdBy: "admin-1",
    createdAt: "2023-06-05T09:15:00Z",
    updatedAt: "2023-06-05T09:15:00Z",
  },
  {
    id: "tr-5",
    type: "expense",
    amount: 2500,
    date: "2023-06-10T13:00:00Z",
    category: "equipment",
    description: "New treadmill purchase",
    recurring: false,
    recurringPeriod: "none",
    paymentMethod: "card",
    createdBy: "admin-1",
    createdAt: "2023-06-10T13:00:00Z",
    updatedAt: "2023-06-10T13:00:00Z",
  },
  {
    id: "tr-6",
    type: "income",
    amount: 500,
    date: "2023-06-15T16:30:00Z",
    category: "product-sales",
    description: "Protein supplements sales",
    recurring: false,
    recurringPeriod: "none",
    paymentMethod: "cash",
    createdBy: "staff-2",
    createdAt: "2023-06-15T16:30:00Z",
    updatedAt: "2023-06-15T16:30:00Z",
  }
];

const TransactionList = () => {
  const [transactions, setTransactions] = useState<FinancialTransaction[]>(mockTransactions);
  const [filteredTransactions, setFilteredTransactions] = useState<FinancialTransaction[]>(mockTransactions);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [dateFilter, setDateFilter] = useState<string>("all");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<FinancialTransaction | null>(null);

  useEffect(() => {
    // Simulate loading data
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    // Apply filters whenever they change
    let filtered = transactions;
    
    // Apply search term filter
    if (searchTerm) {
      filtered = filtered.filter(tx => 
        tx.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tx.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Apply type filter
    if (typeFilter !== "all") {
      filtered = filtered.filter(tx => tx.type === typeFilter);
    }
    
    // Apply category filter
    if (categoryFilter !== "all") {
      filtered = filtered.filter(tx => tx.category === categoryFilter);
    }
    
    // Apply date filter
    if (dateFilter !== "all") {
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const thisWeekStart = new Date(today);
      thisWeekStart.setDate(today.getDate() - today.getDay());
      const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
      
      filtered = filtered.filter(tx => {
        const txDate = new Date(tx.date);
        
        switch (dateFilter) {
          case "today":
            return txDate >= today;
          case "this-week":
            return txDate >= thisWeekStart;
          case "this-month":
            return txDate >= thisMonthStart;
          default:
            return true;
        }
      });
    }
    
    setFilteredTransactions(filtered);
  }, [searchTerm, typeFilter, categoryFilter, dateFilter, transactions]);

  const handleAddTransaction = () => {
    setEditingTransaction(null);
    setIsFormOpen(true);
  };

  const handleEditTransaction = (transaction: FinancialTransaction) => {
    setEditingTransaction(transaction);
    setIsFormOpen(true);
  };

  const handleDeleteTransaction = (id: string) => {
    // In a real app, you would make an API call
    setTransactions(transactions.filter(tx => tx.id !== id));
    toast.success("Transaction deleted successfully");
  };

  const handleSaveTransaction = (transaction: FinancialTransaction) => {
    // In a real app, you would make an API call
    if (transaction.id && transactions.some(tx => tx.id === transaction.id)) {
      // Update existing transaction
      setTransactions(transactions.map(tx => 
        tx.id === transaction.id ? transaction : tx
      ));
      toast.success("Transaction updated successfully");
    } else {
      // Add new transaction
      const newTransaction: FinancialTransaction = {
        ...transaction,
        id: transaction.id || `tr-${Date.now()}`,
        createdAt: transaction.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setTransactions([newTransaction, ...transactions]);
      toast.success("Transaction added successfully");
    }
    setIsFormOpen(false);
    setEditingTransaction(null);
  };

  const getTypeIcon = (type: string) => {
    return type === "income" 
      ? <ArrowUpIcon className="h-4 w-4 text-green-500" />
      : <ArrowDownIcon className="h-4 w-4 text-red-500" />;
  };

  const exportTransactions = () => {
    // Create CSV content
    const headers = "ID,Type,Amount,Date,Category,Description,Recurring,Recurring Period,Payment Method,Created By\n";
    const csvContent = filteredTransactions.reduce((content, tx) => {
      return content + `${tx.id},${tx.type},${tx.amount},${tx.date},${tx.category},"${tx.description}",${tx.recurring},${tx.recurringPeriod},${tx.paymentMethod || ""},${tx.createdBy}\n`;
    }, headers);
    
    // Create and trigger download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `transactions_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const resetFilters = () => {
    setSearchTerm("");
    setTypeFilter("all");
    setCategoryFilter("all");
    setDateFilter("all");
  };

  // Calculate income, expense, and balance totals
  const totalIncome = filteredTransactions
    .filter(tx => tx.type === "income")
    .reduce((sum, tx) => sum + tx.amount, 0);
    
  const totalExpense = filteredTransactions
    .filter(tx => tx.type === "expense")
    .reduce((sum, tx) => sum + tx.amount, 0);
    
  const balance = totalIncome - totalExpense;

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardHeader className="py-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Income</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              ${totalIncome.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {filteredTransactions.filter(tx => tx.type === "income").length} transactions
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="py-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Expenses</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              ${totalExpense.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {filteredTransactions.filter(tx => tx.type === "expense").length} transactions
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="py-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Balance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${balance >= 0 ? 'text-blue-600' : 'text-orange-600'}`}>
              ${balance.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {balance >= 0 ? 'Positive balance' : 'Negative balance'}
            </p>
          </CardContent>
        </Card>
      </div>
    
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Financial Transactions</CardTitle>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={exportTransactions}
              className="flex items-center gap-1"
            >
              <Download className="h-4 w-4" />
              Export
            </Button>
            <Button 
              onClick={handleAddTransaction} 
              className="flex items-center gap-1"
            >
              <PlusIcon className="h-4 w-4" /> Add Transaction
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search by description or category..." 
                className="pl-8" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex flex-wrap gap-2">
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-[130px]">
                  <SelectValue placeholder="All Types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="income">Income</SelectItem>
                  <SelectItem value="expense">Expense</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-[130px]">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="membership">Membership</SelectItem>
                  <SelectItem value="personal-training">PT Sessions</SelectItem>
                  <SelectItem value="product-sales">Product Sales</SelectItem>
                  <SelectItem value="class-fees">Class Fees</SelectItem>
                  <SelectItem value="rent">Rent</SelectItem>
                  <SelectItem value="salary">Salary</SelectItem>
                  <SelectItem value="utilities">Utilities</SelectItem>
                  <SelectItem value="equipment">Equipment</SelectItem>
                  <SelectItem value="maintenance">Maintenance</SelectItem>
                  <SelectItem value="marketing">Marketing</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={dateFilter} onValueChange={setDateFilter}>
                <SelectTrigger className="w-[130px]">
                  <SelectValue placeholder="Date Range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Time</SelectItem>
                  <SelectItem value="today">Today</SelectItem>
                  <SelectItem value="this-week">This Week</SelectItem>
                  <SelectItem value="this-month">This Month</SelectItem>
                </SelectContent>
              </Select>
              
              <Button 
                variant="outline" 
                size="icon"
                onClick={resetFilters}
                title="Reset Filters"
              >
                <RefreshCcwIcon className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Recurring</TableHead>
                  <TableHead>Payment Method</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-10">
                      <div className="flex flex-col items-center justify-center space-y-4">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                        <p className="text-muted-foreground">Loading transactions...</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : filteredTransactions.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-10 text-muted-foreground">
                      No transactions found. Try changing your filters or add a new transaction.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredTransactions.map((tx) => (
                    <TableRow key={tx.id}>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <CalendarIcon className="h-3.5 w-3.5 text-muted-foreground" />
                          <span>{format(new Date(tx.date), "MMM d, yyyy")}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          {getTypeIcon(tx.type)}
                          <span className="capitalize">{tx.type}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className={`
                          capitalize
                          ${tx.type === 'income' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}
                        `}>
                          {tx.category.replace('-', ' ')}
                        </Badge>
                      </TableCell>
                      <TableCell>{tx.description}</TableCell>
                      <TableCell className={`font-medium ${tx.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                        {tx.type === 'income' ? '+' : '-'}${tx.amount.toLocaleString()}
                      </TableCell>
                      <TableCell>
                        {tx.recurring ? (
                          <Badge variant="outline" className="bg-blue-50 text-blue-700 capitalize">
                            {tx.recurringPeriod}
                          </Badge>
                        ) : (
                          <span className="text-muted-foreground text-sm">One-time</span>
                        )}
                      </TableCell>
                      <TableCell>
                        {tx.paymentMethod ? (
                          <span className="capitalize">{tx.paymentMethod.replace('-', ' ')}</span>
                        ) : (
                          "-"
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreVerticalIcon className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem onClick={() => handleEditTransaction(tx)}>
                              Edit
                            </DropdownMenuItem>
                            {tx.relatedInvoiceId && (
                              <DropdownMenuItem>
                                <div className="flex items-center gap-1">
                                  <FileIcon className="h-4 w-4" />
                                  <span>View Invoice</span>
                                </div>
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuSeparator />
                            <DropdownMenuItem 
                              className="text-red-600"
                              onClick={() => handleDeleteTransaction(tx.id)}
                            >
                              <div className="flex items-center gap-1">
                                <TrashIcon className="h-4 w-4" />
                                <span>Delete</span>
                              </div>
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {isFormOpen && (
        <TransactionForm
          transaction={editingTransaction}
          onSave={handleSaveTransaction}
          onCancel={() => {
            setIsFormOpen(false);
            setEditingTransaction(null);
          }}
        />
      )}
    </>
  );
};

export default TransactionList;
