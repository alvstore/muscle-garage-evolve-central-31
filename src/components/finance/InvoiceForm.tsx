
import { useState, useEffect } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter 
} from "@/components/ui/dialog";
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
import { PlusIcon, Trash2Icon } from "lucide-react";
import { 
  Invoice, 
  InvoiceItem, 
  InvoiceStatus
} from "@/types/finance";
import { useBranch } from "@/hooks/use-branch";

interface InvoiceFormProps {
  invoice: Invoice | null;
  onSave: (invoice: Invoice) => void;
  onCancel: () => void;
}

// Mock data for member selection
const mockMembers = [
  { id: "member-1", name: "John Doe" },
  { id: "member-2", name: "Jane Smith" },
  { id: "member-3", name: "Alex Johnson" },
];

const InvoiceForm = ({ invoice, onSave, onCancel }: InvoiceFormProps) => {
  const { currentBranch } = useBranch();
  const [formData, setFormData] = useState<Invoice>({
    id: "",
    memberId: "",
    memberName: "",
    amount: 0,
    status: "pending",
    dueDate: new Date().toISOString(),
    issuedDate: new Date().toISOString(),
    paidDate: null,
    items: [
      {
        id: `item-${Date.now()}`,
        name: "",
        quantity: 1,
        unitPrice: 0,
      },
    ],
    branchId: currentBranch?.id || "branch-1",
  });

  useEffect(() => {
    if (invoice) {
      setFormData(invoice);
    }
  }, [invoice]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSelectChange = (name: string, value: string) => {
    if (name === "memberId") {
      const selectedMember = mockMembers.find(member => member.id === value);
      setFormData({
        ...formData,
        memberId: value,
        memberName: selectedMember?.name || "",
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleDateChange = (name: string, date: Date | undefined) => {
    if (date) {
      setFormData({ ...formData, [name]: date.toISOString() });
    }
  };

  const handleItemChange = (id: string, field: keyof InvoiceItem, value: string | number) => {
    const updatedItems = formData.items.map(item => {
      if (item.id === id) {
        return { ...item, [field]: value };
      }
      return item;
    });
    
    setFormData({ ...formData, items: updatedItems });
    updateTotalAmount(updatedItems);
  };

  const addItem = () => {
    const newItem: InvoiceItem = {
      id: `item-${Date.now()}`,
      name: "",
      quantity: 1,
      unitPrice: 0,
    };
    
    const updatedItems = [...formData.items, newItem];
    setFormData({ ...formData, items: updatedItems });
  };

  const removeItem = (id: string) => {
    if (formData.items.length <= 1) {
      return; // Keep at least one item
    }
    
    const updatedItems = formData.items.filter(item => item.id !== id);
    setFormData({ ...formData, items: updatedItems });
    updateTotalAmount(updatedItems);
  };

  const updateTotalAmount = (items: InvoiceItem[]) => {
    const total = items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);
    setFormData(prev => ({ ...prev, amount: total }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <Dialog open={true} onOpenChange={onCancel}>
      <DialogContent className="sm:max-w-[700px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>{invoice ? 'Edit' : 'Create'} Invoice</DialogTitle>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="memberId">Member</Label>
                <Select
                  value={formData.memberId}
                  onValueChange={(value) => handleSelectChange("memberId", value)}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select member" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockMembers.map(member => (
                      <SelectItem key={member.id} value={member.id}>
                        {member.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) => handleSelectChange("status", value as InvoiceStatus)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="paid">Paid</SelectItem>
                    <SelectItem value="overdue">Overdue</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="issuedDate">Issue Date</Label>
                <DatePicker
                  date={formData.issuedDate ? new Date(formData.issuedDate) : undefined}
                  onSelect={(date) => handleDateChange("issuedDate", date)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="dueDate">Due Date</Label>
                <DatePicker
                  date={formData.dueDate ? new Date(formData.dueDate) : undefined}
                  onSelect={(date) => handleDateChange("dueDate", date)}
                />
              </div>
            </div>
            
            <div className="mt-4">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-sm font-medium">Invoice Items</h3>
                <Button 
                  type="button" 
                  variant="outline" 
                  size="sm"
                  onClick={addItem}
                  className="flex items-center gap-1"
                >
                  <PlusIcon className="h-4 w-4" /> Add Item
                </Button>
              </div>
              
              {formData.items.map((item, index) => (
                <div key={item.id} className="grid grid-cols-12 gap-2 mb-2">
                  <div className="col-span-6">
                    <Input
                      placeholder="Item name"
                      value={item.name}
                      onChange={(e) => handleItemChange(item.id, "name", e.target.value)}
                      required
                    />
                  </div>
                  
                  <div className="col-span-2">
                    <Input
                      type="number"
                      placeholder="Quantity"
                      value={item.quantity}
                      onChange={(e) => handleItemChange(item.id, "quantity", Number(e.target.value))}
                      min="1"
                      required
                    />
                  </div>
                  
                  <div className="col-span-3">
                    <Input
                      type="number"
                      placeholder="Unit Price"
                      value={item.unitPrice}
                      onChange={(e) => handleItemChange(item.id, "unitPrice", Number(e.target.value))}
                      min="0"
                      required
                    />
                  </div>
                  
                  <div className="col-span-1 flex items-center justify-center">
                    <Button 
                      type="button" 
                      variant="ghost" 
                      size="sm"
                      onClick={() => removeItem(item.id)}
                      disabled={formData.items.length <= 1}
                    >
                      <Trash2Icon className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
              
              <div className="flex justify-end mt-4">
                <div className="bg-gray-50 p-2 rounded">
                  <span className="font-medium">Total Amount: </span>
                  <span className="font-bold">
                    {new Intl.NumberFormat('en-US', {
                      style: 'currency',
                      currency: 'USD',
                    }).format(formData.amount)}
                  </span>
                </div>
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button type="submit">Save</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default InvoiceForm;
