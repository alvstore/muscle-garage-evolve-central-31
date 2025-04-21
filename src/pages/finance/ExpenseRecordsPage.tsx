
import React, { useState } from 'react';
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
import { Plus, Edit, Trash, Download, DollarSign, FileText } from "lucide-react";
import { toast } from "sonner";
import { format } from 'date-fns';

interface ExpenseRecord {
  id: string;
  date: string;
  amount: number;
  category: string;
  description: string;
  vendor: string;
  paymentMethod: string;
  reference: string;
  attachment?: string;
  branchId: string;
  status: 'pending' | 'paid' | 'cancelled';
}

const ExpenseRecordsPage = () => {
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<ExpenseRecord | null>(null);
  
  // Form state
  const [formData, setFormData] = useState<Omit<ExpenseRecord, 'id'>>({
    date: new Date().toISOString(),
    amount: 0,
    category: '',
    description: '',
    vendor: '',
    paymentMethod: 'cash',
    reference: '',
    branchId: 'branch1',
    status: 'pending'
  });

  // Mock data for expense records - will be replaced with Supabase data
  const [expenseRecords, setExpenseRecords] = useState<ExpenseRecord[]>([
    {
      id: '1',
      date: '2023-04-15T10:30:00.000Z',
      amount: 5000000,
      category: 'Rent',
      description: 'Monthly rent payment',
      vendor: 'ABC Properties',
      paymentMethod: 'bank',
      reference: 'RENT-APR-2023',
      branchId: 'branch1',
      status: 'paid'
    },
    {
      id: '2',
      date: '2023-04-15T14:45:00.000Z',
      amount: 35000,
      category: 'Utilities',
      description: 'Electricity bill',
      vendor: 'Power Supply Co.',
      paymentMethod: 'bank',
      reference: 'ELEC-042023',
      branchId: 'branch1',
      status: 'paid'
    },
    {
      id: '3',
      date: '2023-04-16T09:15:00.000Z',
      amount: 25000,
      category: 'Equipment Maintenance',
      description: 'Treadmill repair',
      vendor: 'Fitness Equipment Services',
      paymentMethod: 'cash',
      reference: 'SER-2023-042',
      branchId: 'branch1',
      status: 'pending'
    },
    {
      id: '4',
      date: '2023-04-17T11:00:00.000Z',
      amount: 75000,
      category: 'Inventory',
      description: 'Protein powder stock',
      vendor: 'Supplement Wholesale Ltd.',
      paymentMethod: 'credit',
      reference: 'INV-2023-156',
      branchId: 'branch1',
      status: 'paid'
    },
    {
      id: '5',
      date: '2023-04-18T15:30:00.000Z',
      amount: 15000,
      category: 'Cleaning Supplies',
      description: 'Monthly cleaning supplies',
      vendor: 'CleanCo',
      paymentMethod: 'cash',
      reference: 'PUR-2023-067',
      branchId: 'branch1',
      status: 'paid'
    }
  ]);

  // Expense categories - will be replaced with data from Supabase
  const expenseCategories = [
    'Rent',
    'Utilities',
    'Equipment Maintenance',
    'Staff Salaries',
    'Marketing',
    'Insurance',
    'Cleaning Supplies',
    'Inventory',
    'Software',
    'Office Supplies',
    'Other'
  ];

  // Payment methods
  const paymentMethods = [
    { value: 'cash', label: 'Cash' },
    { value: 'credit', label: 'Credit Card' },
    { value: 'debit', label: 'Debit Card' },
    { value: 'upi', label: 'UPI' },
    { value: 'bank', label: 'Bank Transfer' },
    { value: 'cheque', label: 'Cheque' },
    { value: 'other', label: 'Other' }
  ];

  const handleCreateRecord = () => {
    setFormData({
      date: new Date().toISOString(),
      amount: 0,
      category: '',
      description: '',
      vendor: '',
      paymentMethod: 'cash',
      reference: '',
      branchId: 'branch1',
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
      paymentMethod: record.paymentMethod,
      reference: record.reference,
      attachment: record.attachment,
      branchId: record.branchId,
      status: record.status
    });
    setShowEditDialog(true);
  };

  const handleDeleteRecord = (id: string) => {
    if (window.confirm('Are you sure you want to delete this expense record?')) {
      setExpenseRecords(expenseRecords.filter(record => record.id !== id));
      toast.success('Expense record deleted successfully');
    }
  };

  const handleSaveNewRecord = () => {
    if (formData.amount <= 0) {
      toast.error('Amount must be greater than zero');
      return;
    }
    
    if (!formData.category) {
      toast.error('Please select a category');
      return;
    }
    
    const newRecord = {
      ...formData,
      id: Date.now().toString()
    };
    setExpenseRecords([...expenseRecords, newRecord]);
    setShowCreateDialog(false);
    toast.success('Expense record created successfully');
  };

  const handleUpdateRecord = () => {
    if (!selectedRecord) return;
    
    if (formData.amount <= 0) {
      toast.error('Amount must be greater than zero');
      return;
    }
    
    if (!formData.category) {
      toast.error('Please select a category');
      return;
    }
    
    setExpenseRecords(expenseRecords.map(record => 
      record.id === selectedRecord.id ? { ...selectedRecord, ...formData } : record
    ));
    setShowEditDialog(false);
    toast.success('Expense record updated successfully');
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0
    }).format(amount / 100);
  };

  const getPaymentMethodLabel = (value: string) => {
    const method = paymentMethods.find(method => method.value === value);
    return method?.label || value;
  };

  const getStatusBadge = (status: 'pending' | 'paid' | 'cancelled') => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline">Pending</Badge>;
      case 'paid':
        return <Badge variant="default">Paid</Badge>;
      case 'cancelled':
        return <Badge variant="destructive">Cancelled</Badge>;
    }
  };

  const totalExpenses = expenseRecords.reduce((sum, record) => sum + record.amount, 0);

  return (
    <Container>
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
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead className="hidden md:table-cell">Vendor</TableHead>
                  <TableHead className="hidden md:table-cell">Status</TableHead>
                  <TableHead className="hidden md:table-cell">Reference</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {expenseRecords.map((record) => (
                  <TableRow key={record.id}>
                    <TableCell>
                      {format(new Date(record.date), 'dd MMM yyyy')}
                    </TableCell>
                    <TableCell className="font-medium">
                      {formatCurrency(record.amount)}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{record.category}</Badge>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      {record.vendor}
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      {getStatusBadge(record.status)}
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      {record.reference}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => handleEditRecord(record)}
                        >
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
    </Container>
  );
};

export default ExpenseRecordsPage;
