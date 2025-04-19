
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DatePicker } from "@/components/ui/date-picker";
import { Label } from "@/components/ui/label";
import { Invoice, InvoiceItem, InvoiceStatus } from "@/types/finance";
import { useBranch } from "@/hooks/use-branch";
import { InvoiceFormHeader } from "./InvoiceFormHeader";
import { InvoiceMemberSelect } from "./InvoiceMemberSelect";
import { InvoiceItemList } from "./InvoiceItemList";
import { InvoiceTotal } from "./InvoiceTotal";

interface InvoiceFormProps {
  invoice: Invoice | null;
  onSave: (invoice: Invoice) => void;
  onCancel: () => void;
}

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
    updateTotalAmount(updatedItems);
    setFormData({ ...formData, items: updatedItems });
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
    if (formData.items.length <= 1) return;
    const updatedItems = formData.items.filter(item => item.id !== id);
    updateTotalAmount(updatedItems);
    setFormData({ ...formData, items: updatedItems });
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
          <InvoiceFormHeader isEditing={!!invoice} />
          
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <InvoiceMemberSelect 
                memberId={formData.memberId}
                onMemberSelect={(value) => handleSelectChange("memberId", value)}
              />
              
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
            
            <InvoiceItemList 
              items={formData.items}
              onAddItem={addItem}
              onUpdateItem={handleItemChange}
              onRemoveItem={removeItem}
            />
            
            <InvoiceTotal amount={formData.amount} />
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

