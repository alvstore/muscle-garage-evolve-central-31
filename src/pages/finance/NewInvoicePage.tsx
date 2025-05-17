import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format, addDays } from 'date-fns';
import { CalendarIcon, ArrowLeft, Loader2, Plus, Trash2, Info } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/components/ui/use-toast';
import { useMembers } from '@/hooks/use-members';
import { useBranch } from '@/hooks/use-branches';
import { supabase } from '@/integrations/supabase/client';
import { Checkbox } from '@/components/ui/checkbox';
import { GSTTreatment, TaxDetail, TaxType } from '@/types/finance';
import taxService from '@/services/taxService';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  amount: number;
  hsnSacCode?: string;
  gstRate?: number;
  taxAmount?: number;
  cgst?: number;
  sgst?: number;
  igst?: number;
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
  
  // Tax-related state
  const [enableTax, setEnableTax] = useState(true);
  const [taxType, setTaxType] = useState<TaxType>('gst');
  const [gstTreatment, setGstTreatment] = useState<GSTTreatment>('registered_business');
  const [gstNumber, setGstNumber] = useState('');
  const [placeOfSupply, setPlaceOfSupply] = useState('');
  const [isIntraState, setIsIntraState] = useState(true);
  const [isTaxInclusive, setIsTaxInclusive] = useState(false);
  const [taxDetails, setTaxDetails] = useState<TaxDetail[]>([]);
  const [defaultGstRate, setDefaultGstRate] = useState(18); // Default 18% GST
  
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
    
    // Calculate tax if enabled
    if (enableTax && taxType === 'gst') {
      const gstRate = newItems[index].gstRate || defaultGstRate;
      
      if (isIntraState) {
        // Split into CGST and SGST
        const halfRate = gstRate / 2;
        const halfAmount = (newItems[index].amount * halfRate) / 100;
        newItems[index].cgst = halfAmount;
        newItems[index].sgst = halfAmount;
        newItems[index].igst = 0;
        newItems[index].taxAmount = halfAmount * 2;
      } else {
        // Use IGST
        const igstAmount = (newItems[index].amount * gstRate) / 100;
        newItems[index].cgst = 0;
        newItems[index].sgst = 0;
        newItems[index].igst = igstAmount;
        newItems[index].taxAmount = igstAmount;
      }
    } else {
      // No tax
      newItems[index].cgst = 0;
      newItems[index].sgst = 0;
      newItems[index].igst = 0;
      newItems[index].taxAmount = 0;
    }
    
    setInvoiceItems(newItems);
    updateTaxDetails();
  };
  
  // Update HSN/SAC code for an item
  const updateHsnSacCode = (index: number, code: string) => {
    const newItems = [...invoiceItems];
    newItems[index].hsnSacCode = code;
    setInvoiceItems(newItems);
  };
  
  // Update GST rate for an item
  const updateGstRate = (index: number, rate: number) => {
    const newItems = [...invoiceItems];
    newItems[index].gstRate = rate;
    
    // Recalculate tax
    updateItemAmount(index, newItems[index].quantity, newItems[index].unitPrice);
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
        amount: 0,
        gstRate: defaultGstRate,
        hsnSacCode: '',
        taxAmount: 0,
        cgst: 0,
        sgst: 0,
        igst: 0
      }
    ]);
  };
  
  // Remove an invoice item
  const removeInvoiceItem = (index: number) => {
    if (invoiceItems.length > 1) {
      const newItems = [...invoiceItems];
      newItems.splice(index, 1);
      setInvoiceItems(newItems);
      updateTaxDetails();
    }
  };
  
  // Calculate invoice subtotal
  const calculateSubtotal = () => {
    return invoiceItems.reduce((total, item) => total + item.amount, 0);
  };
  
  // Calculate total tax amount
  const calculateTaxAmount = () => {
    if (!enableTax) return 0;
    return invoiceItems.reduce((total, item) => total + (item.taxAmount || 0), 0);
  };
  
  // Calculate invoice total (subtotal + tax)
  const calculateTotal = () => {
    return calculateSubtotal() + calculateTaxAmount();
  };
  
  // Update tax details based on current items
  const updateTaxDetails = () => {
    if (!enableTax) {
      setTaxDetails([]);
      return;
    }
    
    const newTaxDetails: TaxDetail[] = [];
    
    if (taxType === 'gst') {
      if (isIntraState) {
        // Calculate CGST and SGST
        const cgstTotal = invoiceItems.reduce((total, item) => total + (item.cgst || 0), 0);
        const sgstTotal = invoiceItems.reduce((total, item) => total + (item.sgst || 0), 0);
        
        if (cgstTotal > 0) {
          newTaxDetails.push({
            tax_name: 'CGST',
            tax_rate: defaultGstRate / 2,
            tax_amount: cgstTotal,
            taxName: 'CGST',
            taxRate: defaultGstRate / 2,
            taxAmount: cgstTotal
          });
        }
        
        if (sgstTotal > 0) {
          newTaxDetails.push({
            tax_name: 'SGST',
            tax_rate: defaultGstRate / 2,
            tax_amount: sgstTotal,
            taxName: 'SGST',
            taxRate: defaultGstRate / 2,
            taxAmount: sgstTotal
          });
        }
      } else {
        // Calculate IGST
        const igstTotal = invoiceItems.reduce((total, item) => total + (item.igst || 0), 0);
        
        if (igstTotal > 0) {
          newTaxDetails.push({
            tax_name: 'IGST',
            tax_rate: defaultGstRate,
            tax_amount: igstTotal,
            taxName: 'IGST',
            taxRate: defaultGstRate,
            taxAmount: igstTotal
          });
        }
      }
    }
    
    setTaxDetails(newTaxDetails);
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
      const taxAmount = calculateTaxAmount();
      const total = calculateTotal();
      
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
          total: total,
          status: 'unpaid',
          notes: notes,
          created_at: new Date().toISOString(),
          
          // Tax-related fields
          tax_amount: taxAmount,
          tax_rate: defaultGstRate,
          tax_type: enableTax ? taxType : 'none',
          tax_details: enableTax ? taxDetails : [],
          is_tax_inclusive: isTaxInclusive,
          gst_treatment: gstTreatment,
          gst_number: gstNumber,
          place_of_supply: placeOfSupply
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
        amount: item.amount,
        
        // Tax-related fields
        tax_rate: item.gstRate || defaultGstRate,
        tax_amount: item.taxAmount || 0,
        hsn_sac_code: item.hsnSacCode || '',
        cgst: item.cgst || 0,
        sgst: item.sgst || 0,
        igst: item.igst || 0
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
    <div className="container mx-auto p-4">
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
              {/* Invoice items content goes here */}
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
    </div>
  );
};

export default NewInvoicePage;
