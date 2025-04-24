
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
import { Plus, X } from "lucide-react";
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

const InvoiceForm = ({ invoice, onSave, onCancel }: InvoiceFormProps) => {
  const { currentBranch } = useBranch();
  const [formData, setFormData] = useState<Invoice>({
    id: "",
    member_id: "",
    memberName: "",
    amount: 0,
    status: "pending",
    due_date: new Date().toISOString(),
    issued_date: new Date().toISOString(),
    paid_date: null,
    items: [
      {
        id: `item-${Date.now()}`,
        name: "",
        quantity: 1,
        price: 0,
      },
    ],
    branch_id: currentBranch?.id || "branch-1",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  });

  useEffect(() => {
    if (invoice) {
      setFormData({
        ...invoice,
        // Ensure snake_case properties are set
        member_id: invoice.member_id || invoice.memberId,
        due_date: invoice.due_date || invoice.dueDate,
        issued_date: invoice.issued_date || invoice.issuedDate,
        paid_date: invoice.paid_date || invoice.paidDate,
        branch_id: invoice.branch_id || invoice.branchId
      });
    }
  }, [invoice]);

  const handleSelectChange = (name: string, value: string) => {
    if (name === "member_id") {
      const selectedMember = mockMembers.find(member => member.id === value);
      setFormData({
        ...formData,
        member_id: value,
        memberName: selectedMember?.name || "",
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleDateChange = (name: string, date: Date | undefined) => {
    if (date) {
      const dateString = date.toISOString();
      if (name === "issued_date") {
        setFormData({ 
          ...formData, 
          issued_date: dateString
        });
      } else if (name === "due_date") {
        setFormData({ 
          ...formData, 
          due_date: dateString
        });
      }
    }
  };

  const handleItemChange = (id: string, field: keyof InvoiceItem, value: string | number) => {
    const updatedItems = formData.items.map(item => {
      if (item.id === id) {
        const updatedItem = { ...item, [field]: value };
        // Make sure price is always set
        if (field === 'price') {
          updatedItem.price = value as number;
        }
        return updatedItem;
      }
      return item;
    });
    updateTotalAmount(updatedItems);
    setFormData({ ...formData, items: updatedItems });
  };

  const addItem = () => {
    const newItem: InvoiceItem = {
      id: `item-${Date.now()}`,
      name: "",
      quantity: 1,
      price: 0,
    };
    const updatedItems = [...formData.items, newItem];
    setFormData({ ...formData, items: updatedItems });
  };

  const removeItem = (id: string) => {
    if (formData.items.length <= 1) return;
    const updatedItems = formData.items.filter(item => item.id !== id);
    updateTotalAmount(updatedItems);
    setFormData({ ...formData, items: updatedItems });
  };

  const updateTotalAmount = (items: InvoiceItem[]) => {
    const total = items.reduce((sum, item) => sum + (item.quantity * item.price), 0);
    setFormData(prev => ({ ...prev, amount: total }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  // Mock data for member selection - should be moved to API call in the future
  const mockMembers = [
    { id: "member-1", name: "John Doe" },
    { id: "member-2", name: "Jane Smith" },
    { id: "member-3", name: "Alex Johnson" },
  ];

  return (
    <div className="space-y-8 py-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Invoice #</Label>
          <Input disabled value={invoice?.id || 'Auto-generated'} />
        </div>
        <div className="space-y-2">
          <Label>Member</Label>
          <Select value={formData.member_id || ""} onValueChange={(value) => handleSelectChange("member_id", value)}>
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
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Issue Date</Label>
          <DatePicker
            date={formData.issued_date ? new Date(formData.issued_date) : undefined}
            onSelect={(date) => handleDateChange("issued_date", date)}
          />
        </div>
        <div className="space-y-2">
          <Label>Due Date</Label>
          <DatePicker
            date={formData.due_date ? new Date(formData.due_date) : undefined}
            onSelect={(date) => handleDateChange("due_date", date)}
          />
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <Label>Items</Label>
          <Button variant="outline" size="sm" onClick={addItem}>
            <Plus className="w-4 h-4 mr-2" />
            Add Item
          </Button>
        </div>

        {formData.items.map((item, index) => (
          <div key={item.id} className="grid grid-cols-12 gap-4 items-start">
            <div className="col-span-5">
              <Input
                placeholder="Item name"
                value={item.name}
                onChange={(e) => handleItemChange(item.id, "name", e.target.value)}
              />
            </div>
            <div className="col-span-2">
              <Input
                type="number"
                placeholder="Quantity"
                value={item.quantity}
                onChange={(e) => handleItemChange(item.id, "quantity", Number(e.target.value))}
              />
            </div>
            <div className="col-span-3">
              <Input
                type="number"
                placeholder="Unit Price"
                value={item.price}
                onChange={(e) => handleItemChange(item.id, "price", Number(e.target.value))}
              />
            </div>
            <div className="col-span-2 flex justify-end">
              <Button
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

      <div className="space-y-4">
        <div className="flex justify-end">
          <div className="w-1/3 space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">Subtotal:</span>
              <span>${formData.amount}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Tax (0%):</span>
              <span>$0</span>
            </div>
            <div className="flex justify-between font-medium">
              <span>Total:</span>
              <span>${formData.amount}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-4 border-t pt-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label>Payment Terms</Label>
            <Switch />
          </div>
          <div className="flex items-center justify-between">
            <Label>Client Notes</Label>
            <Switch />
          </div>
          <div className="flex items-center justify-between">
            <Label>Payment Stub</Label>
            <Switch />
          </div>
        </div>
        
        <div className="flex justify-between">
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <div className="space-x-2">
            <Button onClick={() => onSave(formData)}>
              Save
            </Button>
            <Button className="bg-indigo-600 hover:bg-indigo-700">
              Send Invoice
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoiceForm;
