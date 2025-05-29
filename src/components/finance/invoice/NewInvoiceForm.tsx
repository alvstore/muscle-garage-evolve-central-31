import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { DatePicker } from "@/components/ui/date-picker";
import { Switch } from "@/components/ui/switch";
import { Plus, X, Send, Eye, Save, Cog } from "lucide-react";
import { 
  Invoice, 
  InvoiceItem, 
  InvoiceStatus
} from "@/types/finance";
import { useBranch } from "@/hooks/settings/use-branches";
import { supabase } from "@/services/api/supabaseClient";
import { useAuth } from "@/hooks/auth/use-auth";
import { toast } from "sonner";
import { v4 as uuidv4 } from "uuid";
import { formatCurrency } from "@/utils/stringUtils";

interface NewInvoiceFormProps {
  invoice: Invoice | null;
  onSave: (invoice: any) => void;
  onCancel: () => void;
}

const NewInvoiceForm = ({ invoice, onSave, onCancel }: NewInvoiceFormProps) => {
  const { currentBranch } = useBranch();
  const { user } = useAuth();
  const [members, setMembers] = useState<any[]>([]);
  const [paymentTermsEnabled, setPaymentTermsEnabled] = useState(false);
  const [clientNotesEnabled, setClientNotesEnabled] = useState(false);
  const [paymentStubEnabled, setPaymentStubEnabled] = useState(false);
  
  const [formData, setFormData] = useState<any>({
    id: "",
    memberId: "",
    amount: 0,
    status: "pending" as InvoiceStatus,
    dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    issuedDate: new Date().toISOString(),
    paidDate: null,
    items: [
      {
        id: uuidv4(),
        name: "",
        description: "",
        quantity: 1,
        price: 0,
        amount: 0,
        discount: 0
      },
    ],
    branchId: currentBranch?.id || "",
    notes: "",
    subtotal: 0,
    discount: 0,
    tax: 0,
    total: 0,
    bankName: "American Bank",
    accountNumber: "",
    swift: "BR91905",
    iban: "ETD95476213"
  });

  useEffect(() => {
    fetchMembers();
    
    if (invoice) {
      const items = invoice.items.map((item: InvoiceItem) => ({
        ...item,
        amount: item.quantity * (item.price || 0),
        discount: 0,
        id: item.id || uuidv4()
      }));
      
      setFormData({
        ...invoice,
        items,
        subtotal: items.reduce((sum: number, item: any) => sum + (item.quantity * (item.price || 0)), 0),
        discount: 0,
        tax: 0,
        total: invoice.amount,
        bankName: "American Bank",
        accountNumber: "",
        swift: "BR91905",
        iban: "ETD95476213"
      });
    }
  }, [invoice, currentBranch?.id]);

  const fetchMembers = async () => {
    try {
      const { data, error } = await supabase
        .from('members')
        .select('id, name')
        .eq('branch_id', currentBranch?.id || '')
        .eq('status', 'active');
        
      if (error) throw error;
      
      setMembers(data || []);
    } catch (error) {
      console.error('Error fetching members:', error);
      toast.error('Failed to fetch members');
    }
  };

  const handleMemberChange = async (memberId: string) => {
    try {
      const { data, error } = await supabase
        .from('members')
        .select('*')
        .eq('id', memberId)
        .single();
        
      if (error) throw error;
      
      if (data) {
        setFormData({
          ...formData,
          memberId: data.id,
          memberName: data.name
        });
      }
    } catch (error) {
      console.error('Error fetching member details:', error);
    }
  };

  const handleDateChange = (name: string, date: Date | undefined) => {
    if (date) {
      setFormData({ ...formData, [name]: date.toISOString() });
    }
  };

  const handleItemChange = (id: string, field: string, value: string | number) => {
    const updatedItems = formData.items.map((item: any) => {
      if (item.id === id) {
        const updatedItem = { ...item, [field]: value };
        
        // Recalculate amount if quantity or price changes
        if (field === 'quantity' || field === 'price') {
          updatedItem.amount = Number(updatedItem.quantity) * Number(updatedItem.price || 0);
        }
        
        return updatedItem;
      }
      return item;
    });
    
    updateTotals(updatedItems);
  };

  const updateTotals = (items: any[]) => {
    const subtotal = items.reduce((sum: number, item: any) => sum + (Number(item.amount) || 0), 0);
    const discount = formData.discount || 0;
    const tax = formData.tax || 0;
    const total = subtotal - discount + tax;
    
    setFormData({
      ...formData,
      items,
      subtotal,
      total,
      amount: total
    });
  };

  const addItem = () => {
    const newItem = {
      id: uuidv4(),
      name: "",
      description: "",
      quantity: 1,
      price: 0,
      amount: 0,
      discount: 0
    };
    
    const updatedItems = [...formData.items, newItem];
    setFormData({ ...formData, items: updatedItems });
  };

  const removeItem = (id: string) => {
    if (formData.items.length <= 1) return;
    
    const updatedItems = formData.items.filter((item: any) => item.id !== id);
    updateTotals(updatedItems);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields
    if (!formData.memberId) {
      toast.error('Please select a member');
      return;
    }
    
    if (formData.items.some((item: any) => !item.name)) {
      toast.error('All items must have a name');
      return;
    }
    
    onSave(formData);
  };

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="flex justify-end gap-2 mb-6">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button variant="outline">
          <Eye className="w-4 h-4 mr-2" /> Preview
        </Button>
        <Button variant="outline" onClick={handleSubmit}>
          <Save className="w-4 h-4 mr-2" /> Save
        </Button>
        <Button className="bg-primary" onClick={handleSubmit}>
          <Send className="w-4 h-4 mr-2" /> Send Invoice
        </Button>
        <Button variant="ghost" size="icon">
          <Cog className="w-4 h-4" />
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto">
        <form onSubmit={handleSubmit}>
          <div className="bg-gray-100 p-8 rounded-lg mb-8">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-2xl font-bold mb-4">{currentBranch?.name || 'Your Gym'}</h2>
                <p className="text-gray-600">{currentBranch?.address || 'Office 149, 450 South Brand'}</p>
                <p className="text-gray-600">{currentBranch?.city}, {currentBranch?.state}</p>
                <p className="text-gray-600">{currentBranch?.phone || 'N/A'}</p>
              </div>
              
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-3">
                  <Label className="w-32 text-right">Invoice:</Label>
                  <Input className="bg-white" value={invoice?.id || 'Auto-generated'} disabled />
                </div>
                
                <div className="flex items-center gap-3">
                  <Label className="w-32 text-right">Date Issued:</Label>
                  <DatePicker
                    date={formData.issuedDate ? new Date(formData.issuedDate) : undefined}
                    onSelect={(date) => handleDateChange("issuedDate", date)}
                    className="bg-white"
                  />
                </div>
                
                <div className="flex items-center gap-3">
                  <Label className="w-32 text-right">Due Date:</Label>
                  <DatePicker
                    date={formData.dueDate ? new Date(formData.dueDate) : undefined}
                    onSelect={(date) => handleDateChange("dueDate", date)}
                    className="bg-white"
                  />
                </div>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-8 mb-8">
            <div>
              <h3 className="text-lg font-medium mb-3">Invoice To:</h3>
              <Select 
                value={formData.memberId} 
                onValueChange={(value) => handleMemberChange(value)}
              >
                <SelectTrigger>
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
              
              {formData.memberName && (
                <div className="mt-4 bg-gray-50 p-4 rounded-lg">
                  <p className="font-medium">{formData.memberName}</p>
                  <p className="text-gray-600">Member ID: {formData.memberId}</p>
                </div>
              )}
            </div>
            
            <div>
              <h3 className="text-lg font-medium mb-3">Bill To:</h3>
              <div className="space-y-2 bg-gray-50 p-4 rounded-lg">
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Due:</span>
                  <span className="font-medium">{formatCurrency(formData.total)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Bank Name:</span>
                  <span>American Bank</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Country:</span>
                  <span>United States</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">IBAN:</span>
                  <span>ETD95476213</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">SWIFT Code:</span>
                  <span>BR91905</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mb-8">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-lg font-medium">Items</h3>
              <Button type="button" variant="outline" size="sm" onClick={addItem}>
                <Plus className="w-4 h-4 mr-2" /> Add Item
              </Button>
            </div>
            
            <div className="space-y-3">
              <div className="grid grid-cols-12 gap-3 font-medium text-sm text-gray-600">
                <div className="col-span-5 px-2">Item</div>
                <div className="col-span-1 text-center">Cost</div>
                <div className="col-span-1 text-center">Hours</div>
                <div className="col-span-3 text-center">Price</div>
                <div className="col-span-2 text-right"></div>
              </div>
              
              {formData.items.map((item: any, index: number) => (
                <div key={item.id} className="grid grid-cols-12 gap-3 items-center bg-gray-50 p-3 rounded-lg">
                  <div className="col-span-5">
                    <Select 
                      value={item.name || ""}
                      onValueChange={(value) => handleItemChange(item.id, "name", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select item" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Monthly Membership">Monthly Membership</SelectItem>
                        <SelectItem value="Quarterly Membership">Quarterly Membership</SelectItem>
                        <SelectItem value="Annual Membership">Annual Membership</SelectItem>
                        <SelectItem value="Personal Training">Personal Training</SelectItem>
                        <SelectItem value="Fitness Assessment">Fitness Assessment</SelectItem>
                      </SelectContent>
                    </Select>
                    <Input 
                      className="mt-2"
                      placeholder="Item description" 
                      value={item.description || ""}
                      onChange={(e) => handleItemChange(item.id, "description", e.target.value)}
                    />
                  </div>
                  
                  <div className="col-span-1">
                    <Input 
                      type="number"
                      value={item.price}
                      onChange={(e) => handleItemChange(item.id, "price", Number(e.target.value))}
                    />
                  </div>
                  
                  <div className="col-span-1">
                    <Input 
                      type="number"
                      value={item.quantity}
                      onChange={(e) => handleItemChange(item.id, "quantity", Number(e.target.value))}
                    />
                  </div>
                  
                  <div className="col-span-3 text-center">
                    <div className="font-medium">{formatCurrency(item.amount || 0)}</div>
                    {index === 0 && (
                      <div className="text-xs text-gray-500 mt-2">
                        <span className="mr-1">Discount</span>
                        <span className="inline-block mx-1">0%</span>
                        <span className="inline-block mx-1">0%</span>
                        <span className="inline-block mx-1">0%</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="col-span-2 text-right">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeItem(item.id)}
                      disabled={formData.items.length <= 1}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-8 mb-8">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>Salesperson:</Label>
                <Input 
                  className="max-w-[200px]" 
                  value={user?.email || ""} 
                  disabled
                />
              </div>
              
              <div>
                <Label>Notes:</Label>
                <textarea
                  className="mt-1 w-full p-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary"
                  rows={3}
                  placeholder="Thanks for your business"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                ></textarea>
              </div>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg space-y-2">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span>{formatCurrency(formData.subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span>Discount:</span>
                <span>{formatCurrency(formData.discount)}</span>
              </div>
              <div className="flex justify-between">
                <span>Tax:</span>
                <div className="flex items-center">
                  <Input 
                    type="number"
                    className="max-w-[60px] mr-2"
                    value={formData.taxRate || 0}
                    onChange={(e) => {
                      const taxRate = Number(e.target.value);
                      const taxAmount = (formData.subtotal - formData.discount) * (taxRate / 100);
                      setFormData({
                        ...formData,
                        taxRate,
                        tax: taxAmount,
                        total: formData.subtotal - formData.discount + taxAmount,
                        amount: formData.subtotal - formData.discount + taxAmount
                      });
                    }}
                  />
                  <span>% ({formatCurrency(formData.tax)})</span>
                </div>
              </div>
              <div className="border-t border-gray-300 my-2 pt-2 flex justify-between font-bold">
                <span>Total:</span>
                <span>{formatCurrency(formData.total)}</span>
              </div>
            </div>
          </div>
          
          <div className="border-t pt-6 space-y-4">
            <div className="flex items-center justify-between">
              <Label>Payment Terms</Label>
              <Switch checked={paymentTermsEnabled} onCheckedChange={setPaymentTermsEnabled} />
            </div>
            
            <div className="flex items-center justify-between">
              <Label>Client Notes</Label>
              <Switch checked={clientNotesEnabled} onCheckedChange={setClientNotesEnabled} />
            </div>
            
            <div className="flex items-center justify-between">
              <Label>Payment Stub</Label>
              <Switch checked={paymentStubEnabled} onCheckedChange={setPaymentStubEnabled} />
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewInvoiceForm;
