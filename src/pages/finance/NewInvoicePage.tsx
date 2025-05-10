import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Container } from '@/components/ui/container';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format, addDays } from 'date-fns';
import { CalendarIcon, ArrowLeft, Loader2, Plus, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/components/ui/use-toast';
import { useMembers } from '@/hooks/use-members';
import { useBranch } from '@/hooks/use-branch';
import { supabase } from '@/integrations/supabase/client';

interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  amount: number;
}

const NewInvoicePage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const { members, isLoading: isMembersLoading } = useMembers();
  const { currentBranch } = useBranch();
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedMember, setSelectedMember] = useState<string>('');
  const [invoiceDate, setInvoiceDate] = useState<Date>(new Date());
  const [dueDate, setDueDate] = useState<Date>(addDays(new Date(), 7));
  const [invoiceItems, setInvoiceItems] = useState<InvoiceItem[]>([
    { id: '1', description: '', quantity: 1, unitPrice: 0, amount: 0 }
  ]);
  const [invoiceNumber, setInvoiceNumber] = useState(`INV-${Date.now().toString().substring(6)}`);
  const [notes, setNotes] = useState('');
  const [paymentTerms, setPaymentTerms] = useState('7');
  
  // Get member ID from URL query params if available
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const memberId = params.get('memberId');
    if (memberId) {
      setSelectedMember(memberId);
    }
  }, [location]);
  
  // Update due date when payment terms change
  useEffect(() => {
    setDueDate(addDays(invoiceDate, parseInt(paymentTerms)));
  }, [invoiceDate, paymentTerms]);
  
  // Calculate item amount when quantity or unit price changes
  const updateItemAmount = (index: number, quantity: number, unitPrice: number) => {
    const newItems = [...invoiceItems];
    newItems[index].quantity = quantity;
    newItems[index].unitPrice = unitPrice;
    newItems[index].amount = quantity * unitPrice;
    setInvoiceItems(newItems);
  };
  
  // Add a new invoice item
  const addInvoiceItem = () => {
    setInvoiceItems([
      ...invoiceItems,
      {
        id: Date.now().toString(),
        description: '',
        quantity: 1,
        unitPrice: 0,
        amount: 0
      }
    ]);
  };
  
  // Remove an invoice item
  const removeInvoiceItem = (index: number) => {
    if (invoiceItems.length > 1) {
      const newItems = [...invoiceItems];
      newItems.splice(index, 1);
      setInvoiceItems(newItems);
    }
  };
  
  // Calculate invoice subtotal
  const calculateSubtotal = () => {
    return invoiceItems.reduce((total, item) => total + item.amount, 0);
  };
  
  // Create the invoice
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedMember) {
      toast({
        title: "Error",
        description: "Please select a member",
        variant: "destructive"
      });
      return;
    }
    
    if (invoiceItems.some(item => !item.description)) {
      toast({
        title: "Error",
        description: "Please fill in all item descriptions",
        variant: "destructive"
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const subtotal = calculateSubtotal();
      
      // Create invoice in database
      const { data, error } = await supabase
        .from('invoices')
        .insert({
          invoice_number: invoiceNumber,
          member_id: selectedMember,
          branch_id: currentBranch?.id,
          invoice_date: invoiceDate.toISOString(),
          due_date: dueDate.toISOString(),
          subtotal: subtotal,
          total: subtotal, // Add tax calculation if needed
          status: 'unpaid',
          notes: notes,
          created_at: new Date().toISOString()
        })
        .select()
        .single();
      
      if (error) throw error;
      
      // Create invoice items
      const invoiceId = data.id;
      const itemsToInsert = invoiceItems.map(item => ({
        invoice_id: invoiceId,
        description: item.description,
        quantity: item.quantity,
        unit_price: item.unitPrice,
        amount: item.amount
      }));
      
      const { error: itemsError } = await supabase
        .from('invoice_items')
        .insert(itemsToInsert);
      
      if (itemsError) throw itemsError;
      
      toast({
        title: "Success",
        description: "Invoice created successfully",
      });
      
      navigate('/finance/invoices');
    } catch (error: any) {
      console.error('Error creating invoice:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to create invoice",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <Container>
      <div className="py-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <Button
              variant="ghost"
              size="sm"
              className="mr-2"
              onClick={() => navigate('/finance/invoices')}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Invoices
            </Button>
            <h1 className="text-2xl font-semibold">Create New Invoice</h1>
          </div>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Invoice Details</CardTitle>
                <CardDescription>Enter the invoice information</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="invoiceNumber">Invoice Number</Label>
                      <Input
                        id="invoiceNumber"
                        value={invoiceNumber}
                        onChange={(e) => setInvoiceNumber(e.target.value)}
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="member">Member</Label>
                      <Select value={selectedMember} onValueChange={setSelectedMember}>
                        <SelectTrigger id="member">
                          <SelectValue placeholder="Select a member" />
                        </SelectTrigger>
                        <SelectContent>
                          {members.map((member) => (
                            <SelectItem key={member.id} value={member.id}>
                              {member.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Invoice Date</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className="w-full justify-start text-left font-normal"
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {invoiceDate ? format(invoiceDate, 'PPP') : <span>Pick a date</span>}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={invoiceDate}
                            onSelect={(date) => date && setInvoiceDate(date)}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Payment Terms</Label>
                      <Select value={paymentTerms} onValueChange={setPaymentTerms}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select payment terms" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="7">Net 7 Days</SelectItem>
                          <SelectItem value="14">Net 14 Days</SelectItem>
                          <SelectItem value="30">Net 30 Days</SelectItem>
                          <SelectItem value="60">Net 60 Days</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Due Date</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-full justify-start text-left font-normal"
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {dueDate ? format(dueDate, 'PPP') : <span>Pick a date</span>}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={dueDate}
                          onSelect={(date) => date && setDueDate(date)}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span className="font-medium">₹{calculateSubtotal().toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Tax</span>
                    <span className="font-medium">₹0.00</span>
                  </div>
                  <div className="border-t pt-4 flex justify-between">
                    <span className="font-medium">Total</span>
                    <span className="font-semibold text-lg">₹{calculateSubtotal().toFixed(2)}</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex flex-col gap-2">
                <Button 
                  type="submit" 
                  className="w-full"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    'Create Invoice'
                  )}
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  className="w-full"
                  onClick={() => navigate('/finance/invoices')}
                >
                  Cancel
                </Button>
              </CardFooter>
            </Card>
          </div>
          
          <Card className="mt-6">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Invoice Items</CardTitle>
                <CardDescription>Add the items to be invoiced</CardDescription>
              </div>
              <Button type="button" variant="outline" size="sm" onClick={addInvoiceItem}>
                <Plus className="h-4 w-4 mr-2" />
                Add Item
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-12 gap-4 font-medium text-sm text-muted-foreground">
                  <div className="col-span-5">Description</div>
                  <div className="col-span-2">Quantity</div>
                  <div className="col-span-2">Unit Price</div>
                  <div className="col-span-2">Amount</div>
                  <div className="col-span-1"></div>
                </div>
                
                {invoiceItems.map((item, index) => (
                  <div key={item.id} className="grid grid-cols-12 gap-4 items-center">
                    <div className="col-span-5">
                      <Input
                        placeholder="Item description"
                        value={item.description}
                        onChange={(e) => {
                          const newItems = [...invoiceItems];
                          newItems[index].description = e.target.value;
                          setInvoiceItems(newItems);
                        }}
                        required
                      />
                    </div>
                    <div className="col-span-2">
                      <Input
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) => {
                          const quantity = parseInt(e.target.value) || 0;
                          updateItemAmount(index, quantity, item.unitPrice);
                        }}
                        required
                      />
                    </div>
                    <div className="col-span-2">
                      <Input
                        type="number"
                        min="0"
                        step="0.01"
                        value={item.unitPrice}
                        onChange={(e) => {
                          const unitPrice = parseFloat(e.target.value) || 0;
                          updateItemAmount(index, item.quantity, unitPrice);
                        }}
                        required
                      />
                    </div>
                    <div className="col-span-2">
                      <Input
                        type="number"
                        value={item.amount.toFixed(2)}
                        disabled
                      />
                    </div>
                    <div className="col-span-1 text-right">
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeInvoiceItem(index)}
                        disabled={invoiceItems.length === 1}
                      >
                        <Trash2 className="h-4 w-4 text-muted-foreground" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Additional Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  placeholder="Enter any additional notes for this invoice"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={4}
                />
              </div>
            </CardContent>
          </Card>
          
          <div className="mt-6 flex justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/finance/invoices')}
            >
              Cancel
            </Button>
            <Button 
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating Invoice
                </>
              ) : (
                'Create Invoice'
              )}
            </Button>
          </div>
        </form>
      </div>
    </Container>
  );
};

export default NewInvoicePage;
