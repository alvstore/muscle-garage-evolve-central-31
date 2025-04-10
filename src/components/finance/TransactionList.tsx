
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { PlusIcon, FileTextIcon } from "lucide-react";
import { format } from "date-fns";
import { FinancialTransaction } from "@/types/finance";
import TransactionForm from "./TransactionForm";
import { toast } from "sonner";

const mockTransactions: FinancialTransaction[] = [
  {
    id: "transaction-1",
    type: "income",
    amount: 5999,
    date: new Date(2023, 3, 15).toISOString(),
    category: "membership",
    description: "3-month membership payment - Jane Smith",
    recurring: false,
    recurringPeriod: "none",
    createdBy: "staff-1",
    createdAt: new Date(2023, 3, 15).toISOString(),
    updatedAt: new Date(2023, 3, 15).toISOString(),
  },
  {
    id: "transaction-2",
    type: "expense",
    amount: 3500,
    date: new Date(2023, 3, 1).toISOString(),
    category: "rent",
    description: "Monthly rent payment",
    recurring: true,
    recurringPeriod: "monthly",
    createdBy: "admin-1",
    createdAt: new Date(2023, 3, 1).toISOString(),
    updatedAt: new Date(2023, 3, 1).toISOString(),
  },
  {
    id: "transaction-3",
    type: "expense",
    amount: 1200,
    date: new Date(2023, 3, 10).toISOString(),
    category: "utilities",
    description: "Electricity bill",
    recurring: true,
    recurringPeriod: "monthly",
    createdBy: "admin-1",
    createdAt: new Date(2023, 3, 10).toISOString(),
    updatedAt: new Date(2023, 3, 10).toISOString(),
  },
  {
    id: "transaction-4",
    type: "income",
    amount: 2000,
    date: new Date(2023, 3, 20).toISOString(),
    category: "personal-training",
    description: "10 PT sessions - Alex Johnson",
    recurring: false,
    recurringPeriod: "none",
    createdBy: "staff-1",
    createdAt: new Date(2023, 3, 20).toISOString(),
    updatedAt: new Date(2023, 3, 20).toISOString(),
  },
];

const TransactionList = () => {
  const [transactions, setTransactions] = useState<FinancialTransaction[]>(mockTransactions);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<FinancialTransaction | null>(null);
  const [activeTab, setActiveTab] = useState<"all" | "income" | "expense">("all");

  const handleAddTransaction = (type: "income" | "expense") => {
    setEditingTransaction(null);
    setIsFormOpen(true);
    // Pre-set the transaction type based on which button was clicked
    setEditingTransaction({
      id: "",
      type,
      amount: 0,
      date: new Date().toISOString(),
      category: type === "income" ? "membership" : "rent",
      description: "",
      recurring: false,
      recurringPeriod: "none",
      createdBy: "user-1", // This would come from auth in a real app
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
  };

  const handleEditTransaction = (transaction: FinancialTransaction) => {
    setEditingTransaction(transaction);
    setIsFormOpen(true);
  };

  const handleSaveTransaction = (transaction: FinancialTransaction) => {
    // In a real application, you would make an API call
    if (transaction.id) {
      setTransactions(transactions.map(t => t.id === transaction.id ? transaction : t));
      toast.success("Transaction updated successfully");
    } else {
      const newTransaction: FinancialTransaction = {
        ...transaction,
        id: `transaction-${Date.now()}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setTransactions([...transactions, newTransaction]);
      toast.success("Transaction created successfully");
    }
    setIsFormOpen(false);
    setEditingTransaction(null);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };

  const getTypeColor = (type: string) => {
    return type === 'income' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';
  };

  const getRecurringBadge = (recurring: boolean, period: string) => {
    if (!recurring) return null;
    return (
      <Badge variant="outline" className="bg-blue-100 text-blue-800">
        {period.charAt(0).toUpperCase() + period.slice(1)}
      </Badge>
    );
  };

  const filteredTransactions = activeTab === "all" 
    ? transactions 
    : transactions.filter(t => t.type === activeTab);

  const totalIncome = transactions
    .filter(t => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpense = transactions
    .filter(t => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);

  const netAmount = totalIncome - totalExpense;

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Income</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{formatPrice(totalIncome)}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Expenses</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{formatPrice(totalExpense)}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Net Amount</CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${netAmount >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {formatPrice(netAmount)}
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Financial Transactions</CardTitle>
          <div className="flex gap-2">
            <Button 
              onClick={() => handleAddTransaction("income")} 
              variant="outline"
              className="flex items-center gap-1"
            >
              <PlusIcon className="h-4 w-4" /> Income
            </Button>
            <Button 
              onClick={() => handleAddTransaction("expense")} 
              className="flex items-center gap-1"
            >
              <PlusIcon className="h-4 w-4" /> Expense
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as "all" | "income" | "expense")}>
            <TabsList className="mb-4">
              <TabsTrigger value="all">All Transactions</TabsTrigger>
              <TabsTrigger value="income">Income</TabsTrigger>
              <TabsTrigger value="expense">Expenses</TabsTrigger>
            </TabsList>
            
            <TabsContent value={activeTab}>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Recurring</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTransactions.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-4 text-muted-foreground">
                        No transactions found
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredTransactions.map((transaction) => (
                      <TableRow key={transaction.id}>
                        <TableCell>{format(new Date(transaction.date), "MMM d, yyyy")}</TableCell>
                        <TableCell className="max-w-[200px] truncate">{transaction.description}</TableCell>
                        <TableCell className="capitalize">{transaction.category}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className={getTypeColor(transaction.type)}>
                            {transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1)}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {getRecurringBadge(transaction.recurring, transaction.recurringPeriod)}
                        </TableCell>
                        <TableCell className={`font-medium ${transaction.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                          {transaction.type === 'income' ? '+' : '-'} {formatPrice(transaction.amount)}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm" onClick={() => handleEditTransaction(transaction)}>
                            <FileTextIcon className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TabsContent>
          </Tabs>
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
