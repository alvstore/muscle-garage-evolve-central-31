
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Download, MoreHorizontal, Eye, Edit, Trash, Search } from 'lucide-react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { FinancialTransaction } from '@/types/finance';
import { formatCurrency } from '@/lib/utils';
import { format } from 'date-fns';
import TransactionForm from './TransactionForm';

interface TransactionListProps {
  transactions: FinancialTransaction[];
  onAddTransaction: (transaction: Partial<FinancialTransaction>) => Promise<void>;
  onUpdateTransaction: (id: string, transaction: Partial<FinancialTransaction>) => Promise<void>;
  onDeleteTransaction: (id: string) => Promise<void>;
  isLoading?: boolean;
}

export default function TransactionList({
  transactions,
  onAddTransaction,
  onUpdateTransaction,
  onDeleteTransaction,
  isLoading = false
}: TransactionListProps) {
  const [search, setSearch] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<FinancialTransaction | null>(null);
  
  const filteredTransactions = transactions.filter(t => 
    t.description?.toLowerCase().includes(search.toLowerCase()) ||
    t.type?.toLowerCase().includes(search.toLowerCase()) ||
    (t.reference_id && search !== '' && t.reference_id.includes(search))
  );
  
  const handleAddClick = () => {
    setIsAddDialogOpen(true);
  };
  
  const handleEditClick = (transaction: FinancialTransaction) => {
    setSelectedTransaction(transaction);
    setIsEditDialogOpen(true);
  };
  
  const handleDeleteClick = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this transaction?')) {
      await onDeleteTransaction(id);
    }
  };
  
  const getTransactionBadge = (type: string) => {
    switch (type.toLowerCase()) {
      case 'income':
        return <Badge className="bg-green-500">Income</Badge>;
      case 'expense':
        return <Badge className="bg-red-500">Expense</Badge>;
      case 'transfer':
        return <Badge className="bg-blue-500">Transfer</Badge>;
      default:
        return <Badge>{type}</Badge>;
    }
  };
  
  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Transactions</CardTitle>
          <Button onClick={handleAddClick}>
            <Plus className="mr-2 h-4 w-4" />
            Add Transaction
          </Button>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search transactions..."
                className="pl-8"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            
            <Button variant="outline" size="sm">
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
          </div>
          
          {isLoading ? (
            <div className="flex justify-center items-center h-48">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          ) : filteredTransactions.length === 0 ? (
            <div className="flex flex-col items-center justify-center text-center p-8 border rounded-lg bg-muted/50">
              <div className="p-3 bg-background rounded-full mb-3">
                <Search className="h-6 w-6 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-medium">No transactions found</h3>
              <p className="text-sm text-muted-foreground mt-1 mb-4">
                {search ? 'Try adjusting your search terms' : 'Get started by adding your first transaction'}
              </p>
              {!search && (
                <Button onClick={handleAddClick} variant="outline">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Transaction
                </Button>
              )}
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Transaction ID</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTransactions.map((transaction) => (
                    <TableRow key={transaction.id}>
                      <TableCell>
                        {transaction.transaction_date && format(new Date(transaction.transaction_date), 'MMM dd, yyyy')}
                      </TableCell>
                      <TableCell>{transaction.description}</TableCell>
                      <TableCell>{transaction.id}</TableCell>
                      <TableCell>{getTransactionBadge(transaction.type)}</TableCell>
                      <TableCell className="text-right">
                        <span className={transaction.type.toLowerCase() === 'expense' ? 'text-red-500' : 'text-green-500'}>
                          {transaction.type.toLowerCase() === 'expense' ? '-' : '+'}{formatCurrency(transaction.amount)}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="h-4 w-4" />
                              <span className="sr-only">Open menu</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleEditClick(transaction)}>
                              <Edit className="mr-2 h-4 w-4" />
                              <span>Edit</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleDeleteClick(transaction.id)}>
                              <Trash className="mr-2 h-4 w-4" />
                              <span>Delete</span>
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Add Transaction Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="max-w-md">
          <TransactionForm 
            onSave={async (data) => {
              await onAddTransaction(data);
              setIsAddDialogOpen(false);
            }}
            onCancel={() => setIsAddDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>
      
      {/* Edit Transaction Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-md">
          {selectedTransaction && (
            <TransactionForm 
              transaction={selectedTransaction}
              onSave={async (data) => {
                await onUpdateTransaction(selectedTransaction.id, data);
                setIsEditDialogOpen(false);
                setSelectedTransaction(null);
              }}
              onCancel={() => {
                setIsEditDialogOpen(false);
                setSelectedTransaction(null);
              }}
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
