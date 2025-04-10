
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue 
} from "@/components/ui/select";
import { InventoryItem, InventoryCategory, StockStatus } from "@/types/inventory";

interface InventoryFormProps {
  item: InventoryItem | null;
  onSave: (item: InventoryItem) => void;
  onCancel: () => void;
}

const defaultItem: Omit<InventoryItem, 'id' | 'createdAt' | 'updatedAt' | 'lastStockUpdate'> = {
  name: "",
  sku: "",
  category: "supplement",
  description: "",
  quantity: 0,
  price: 0,
  costPrice: 0,
  reorderLevel: 5,
  status: "in-stock",
  supplier: "",
  supplierContact: "",
  location: "",
  manufactureDate: "",
  expiryDate: "",
};

const InventoryForm: React.FC<InventoryFormProps> = ({ item, onSave, onCancel }) => {
  const [formData, setFormData] = useState<Omit<InventoryItem, 'id' | 'createdAt' | 'updatedAt' | 'lastStockUpdate'> & { id?: string }>(defaultItem);
  const [open, setOpen] = useState(true);

  useEffect(() => {
    if (item) {
      const { createdAt, updatedAt, lastStockUpdate, ...rest } = item;
      setFormData(rest);
    } else {
      setFormData(defaultItem);
    }
  }, [item]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    if (name === "quantity" || name === "price" || name === "costPrice" || name === "reorderLevel") {
      setFormData({ ...formData, [name]: parseFloat(value) || 0 });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Determine status based on quantity and reorder level
    let calculatedStatus: StockStatus = formData.status;
    if (formData.quantity <= 0) {
      calculatedStatus = "out-of-stock";
    } else if (formData.quantity <= formData.reorderLevel) {
      calculatedStatus = "low-stock";
    } else {
      calculatedStatus = "in-stock";
    }
    
    // Check if item is expired
    if (formData.expiryDate && new Date(formData.expiryDate) < new Date()) {
      calculatedStatus = "expired";
    }
    
    const submissionData: InventoryItem = {
      ...formData,
      id: formData.id || `temp-${Date.now()}`,
      status: calculatedStatus,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      lastStockUpdate: new Date().toISOString(),
    };
    
    onSave(submissionData);
    setOpen(false);
  };

  const handleClose = () => {
    setOpen(false);
    onCancel();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{item ? "Edit Inventory Item" : "Add New Inventory Item"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Item Name *</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="sku">SKU *</Label>
              <Input
                id="sku"
                name="sku"
                value={formData.sku}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="category">Category *</Label>
              <Select 
                value={formData.category} 
                onValueChange={(value) => handleSelectChange("category", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="supplement">Supplement</SelectItem>
                  <SelectItem value="equipment">Equipment</SelectItem>
                  <SelectItem value="merchandise">Merchandise</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="location">Storage Location</Label>
              <Input
                id="location"
                name="location"
                value={formData.location || ""}
                onChange={handleChange}
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description || ""}
              onChange={handleChange}
              rows={3}
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="quantity">Quantity *</Label>
              <Input
                id="quantity"
                name="quantity"
                type="number"
                value={formData.quantity}
                onChange={handleChange}
                required
                min="0"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="price">Selling Price *</Label>
              <Input
                id="price"
                name="price"
                type="number"
                value={formData.price}
                onChange={handleChange}
                required
                min="0"
                step="0.01"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="costPrice">Cost Price *</Label>
              <Input
                id="costPrice"
                name="costPrice"
                type="number"
                value={formData.costPrice}
                onChange={handleChange}
                required
                min="0"
                step="0.01"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="supplier">Supplier</Label>
              <Input
                id="supplier"
                name="supplier"
                value={formData.supplier || ""}
                onChange={handleChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="supplierContact">Supplier Contact</Label>
              <Input
                id="supplierContact"
                name="supplierContact"
                value={formData.supplierContact || ""}
                onChange={handleChange}
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="reorderLevel">Reorder Level *</Label>
              <Input
                id="reorderLevel"
                name="reorderLevel"
                type="number"
                value={formData.reorderLevel}
                onChange={handleChange}
                required
                min="0"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="manufactureDate">Manufacture Date</Label>
              <Input
                id="manufactureDate"
                name="manufactureDate"
                type="date"
                value={formData.manufactureDate ? new Date(formData.manufactureDate).toISOString().split('T')[0] : ""}
                onChange={handleChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="expiryDate">Expiry Date</Label>
              <Input
                id="expiryDate"
                name="expiryDate"
                type="date"
                value={formData.expiryDate ? new Date(formData.expiryDate).toISOString().split('T')[0] : ""}
                onChange={handleChange}
              />
            </div>
          </div>
          
          <div className="flex justify-end space-x-2 pt-4">
            <Button variant="outline" type="button" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit">
              {item ? "Update Item" : "Add Item"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default InventoryForm;
