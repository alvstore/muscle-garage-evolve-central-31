
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

interface IncomeRecord {
  id: string;
  date: string;
  amount: number;
  category: string;
  description: string;
  source: string;
  paymentMethod: string;
  reference: string;
  attachment?: string;
  branchId: string;
}

const IncomeRecordsPage = () => {
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<IncomeRecord | null>(null);
  
  // Form state
  const [formData, setFormData] = useState<Omit<IncomeRecord, 'id'>>({
    date: new Date().toISOString(),
    amount: 0,
    category: '',
    description: '',
    source: '',
    paymentMethod: 'cash',
    reference: '',
    branchId: 'branch1'
  });

  // Mock data for income records - will be replaced with Supabase data
  const [incomeRecords, setIncomeRecords] = useState<IncomeRecord[]>([
    {
      id: '1',
      date: '2023-04-15T10:30:00.000Z',
      amount: 199900,
      category: 'Membership',
      description: 'Annual membership fee',
      source: 'John Smith',
      paymentMethod: 'credit',
      reference: 'INV-2023-001',
      branchId: 'branch1'
    },
    {
      id: '2',
      date: '2023-04-15T14:45:00.000Z',
      amount: 5000,
      category: 'Store',
      description: 'Protein powder purchase',
      source: 'Jane Doe',
      paymentMethod: 'upi',
      reference: 'POS-2023-042',
      branchId: 'branch1'
    },
    {
      id: '3',
      date: '2023-04-16T09:15:00.000Z',
      amount: 60000,
      category: 'PT Session',
      description: '10 personal training sessions',
      source: 'Robert Johnson',
      paymentMethod: 'cash',
      reference: 'PT-2023-015',
      branchId: 'branch2'
    },
    {
      id: '4',
      date: '2023-04-16T16:20:00.000Z',
      amount: 3500,
      category: 'Store',
      description: 'Gym accessories',
      source: 'Sarah Williams',
      paymentMethod: 'debit',
      reference: 'POS-2023-044',
      branchId: 'branch1'
    },
    {
      id: '5',
      date: '2023-04-17T11:00:00.000Z',
      amount: 99500,
      category: 'Membership',
      description: '6-month membership',
      source: 'Michael Brown',
      paymentMethod: 'credit',
      reference: 'INV-2023-003',
      branchId: 'branch1'
    }
  ]);

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
      source: '',
      paymentMethod: 'cash',
      reference: '',
      branchId: 'branch1'
    });
    setShowCreateDialog(true);
  };

  const handleEditRecord = (record: IncomeRecord) => {
    setSelectedRecord(record);
    setFormData({
      date: record.date,
      amount: record.amount,
      category: record.category,
      description: record.description,
      source: record.source,
      paymentMethod: record.paymentMethod,
      reference: record.reference,
      attachment: record.attachment,
      branchId: record.branchId
    });
    setShowEditDialog(true);
  };

  const handleDeleteRecord = (id: string) => {
    if (window.confirm('Are you sure you want to delete this income record?')) {
      setIncomeRecords(incomeRecords.filter(record => record.id !== id));
      toast.success('Income record deleted successfully');
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
    setIncomeRecords([...incomeRecords, newRecord]);
    setShowCreateDialog(false);
    toast.success('Income record created successfully');
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
    
    setIncomeRecords(incomeRecords.map(record => 
      record.id === selectedRecord.id ? { ...selectedRecord, ...formData } : record
    ));
    setShowEditDialog(false);
    toast.success('Income record updated successfully');
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

  const totalIncome = incomeRecords.reduce((sum, record) => sum + record.amount, 0);

  return (
    <Container>
      <div className="py-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold">Income Records</h1>
            <p className="text-muted-foreground">Track and manage all income sources</p>
          </div>
          <Button onClick={handleCreateRecord}>
            <Plus className="mr-2 h-4 w-4" />
            Add Income Record
          </Button>
        </div>

        <div className="grid gap-4 md:grid-cols-3 mb-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Income
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(totalIncome)}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Membership Income
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatCurrency(
                  incomeRecords
                    .filter(record => record.category === 'Membership')
                    .reduce((sum, record) => sum + record.amount, 0)
                )}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Store Income
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatCurrency(
                  incomeRecords
                    .filter(record => record.category === 'Store')
                    .reduce((sum, record) => sum + record.amount, 0)
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Income Records</CardTitle>
            <CardDescription>
              Revenue from all gym operations
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead className="hidden md:table-cell">Source</TableHead>
                  <TableHead className="hidden md:table-cell">Payment Method</TableHead>
                  <TableHead className="hidden md:table-cell">Reference</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {incomeRecords.map((record) => (
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
                      {record.source}
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      {getPaymentMethodLabel(record.paymentMethod)}
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

      {/* Create Income Record Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Add Income Record</DialogTitle>
            <DialogDescription>
              Record a new income transaction
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="incomeDate">Date</Label>
                <Input 
                  id="incomeDate" 
                  type="date" 
                  value={format(new Date(formData.date), 'yyyy-MM-dd')} 
                  onChange={e => setFormData({
                    ...formData, 
                    date: new Date(e.target.value).toISOString()
                  })}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="incomeAmount">Amount (₹)</Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input 
                    id="incomeAmount" 
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
                <Label htmlFor="incomeCategory">Category</Label>
                <Select 
                  value={formData.category} 
                  onValueChange={value => setFormData({...formData, category: value})}
                >
                  <SelectTrigger id="incomeCategory">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {incomeCategories.map(category => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="paymentMethod">Payment Method</Label>
                <Select 
                  value={formData.paymentMethod} 
                  onValueChange={value => setFormData({...formData, paymentMethod: value})}
                >
                  <SelectTrigger id="paymentMethod">
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
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="incomeSource">Source/Payer</Label>
              <Input 
                id="incomeSource" 
                value={formData.source} 
                onChange={e => setFormData({...formData, source: e.target.value})}
                placeholder="Who paid? (e.g., member name, company, etc.)"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="incomeDescription">Description</Label>
              <Textarea 
                id="incomeDescription" 
                value={formData.description} 
                onChange={e => setFormData({...formData, description: e.target.value})}
                placeholder="Additional details about this income"
                rows={2}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="incomeReference">Reference/Invoice Number</Label>
              <Input 
                id="incomeReference" 
                value={formData.reference} 
                onChange={e => setFormData({...formData, reference: e.target.value})}
                placeholder="e.g., INV-2023-001"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="incomeAttachment">Attachment (optional)</Label>
              <div className="flex gap-2">
                <Input 
                  id="incomeAttachment" 
                  type="file" 
                  className="flex-1"
                />
                <Button variant="outline" size="icon">
                  <FileText className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                Upload receipt or related documents (PDF, JPG, PNG)
              </p>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCreateDialog(false)}>Cancel</Button>
            <Button onClick={handleSaveNewRecord}>Save Record</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Income Record Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Edit Income Record</DialogTitle>
            <DialogDescription>
              Update income transaction details
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="editIncomeDate">Date</Label>
                <Input 
                  id="editIncomeDate" 
                  type="date" 
                  value={format(new Date(formData.date), 'yyyy-MM-dd')} 
                  onChange={e => setFormData({
                    ...formData, 
                    date: new Date(e.target.value).toISOString()
                  })}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="editIncomeAmount">Amount (₹)</Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input 
                    id="editIncomeAmount" 
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
                <Label htmlFor="editIncomeCategory">Category</Label>
                <Select 
                  value={formData.category} 
                  onValueChange={value => setFormData({...formData, category: value})}
                >
                  <SelectTrigger id="editIncomeCategory">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {incomeCategories.map(category => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="editPaymentMethod">Payment Method</Label>
                <Select 
                  value={formData.paymentMethod} 
                  onValueChange={value => setFormData({...formData, paymentMethod: value})}
                >
                  <SelectTrigger id="editPaymentMethod">
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
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="editIncomeSource">Source/Payer</Label>
              <Input 
                id="editIncomeSource" 
                value={formData.source} 
                onChange={e => setFormData({...formData, source: e.target.value})}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="editIncomeDescription">Description</Label>
              <Textarea 
                id="editIncomeDescription" 
                value={formData.description} 
                onChange={e => setFormData({...formData, description: e.target.value})}
                rows={2}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="editIncomeReference">Reference/Invoice Number</Label>
              <Input 
                id="editIncomeReference" 
                value={formData.reference} 
                onChange={e => setFormData({...formData, reference: e.target.value})}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="editIncomeAttachment">Attachment</Label>
              <div className="flex gap-2">
                <Input 
                  id="editIncomeAttachment" 
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

export default IncomeRecordsPage;
