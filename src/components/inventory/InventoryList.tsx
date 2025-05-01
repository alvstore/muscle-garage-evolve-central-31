
import { useState } from "react";
import { 
  Table, TableBody, TableCell, TableHead, 
  TableHeader, TableRow 
} from "@/components/ui/table";
import { 
  Card, CardContent, CardHeader, CardTitle 
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, 
  DropdownMenuLabel, DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { 
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue 
} from "@/components/ui/select";
import { SearchIcon, PlusIcon, MoreVerticalIcon, PackageIcon, AlertCircleIcon } from "lucide-react";
import { InventoryItem, InventoryCategory, StockStatus } from "@/types/inventory";
import { format } from "date-fns";
import InventoryForm from "./InventoryForm";
import { toast } from "sonner";
import { supabase } from '@/services/supabaseClient';
import { useUserBranch } from '@/hooks/use-user-branch';

const InventoryList = () => {
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { branchId } = useUserBranch();

  useEffect(() => {
    const fetchInventory = async () => {
      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from('inventory_items')
          .select('*')
          .eq('branch_id', branchId)
          .order('name');

        if (error) throw error;
        setInventory(data || []);
      } catch (error) {
        console.error('Error fetching inventory:', error);
        toast.error('Failed to load inventory');
      } finally {
        setIsLoading(false);
      }
    };

    fetchInventory();
  }, [branchId]);

  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);

  const filteredInventory = inventory.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         item.sku.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === "all" || item.category === categoryFilter;
    const matchesStatus = statusFilter === "all" || item.status === statusFilter;
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const handleAddItem = () => {
    setEditingItem(null);
    setIsFormOpen(true);
  };

  const handleEditItem = (item: InventoryItem) => {
    setEditingItem(item);
    setIsFormOpen(true);
  };

  const handleSaveItem = async (item: InventoryItem) => {
    try {
      setIsLoading(true);
      if (item.id) {
        // Update existing item
        const { error: updateError } = await supabase
          .from('inventory_items')
          .update(item)
          .eq('id', item.id)
          .eq('branch_id', branchId);

        if (updateError) throw updateError;
        toast.success("Inventory item updated successfully");
      } else {
        // Create new item
        const { error: createError } = await supabase
          .from('inventory_items')
          .insert([{
            ...item,
            branch_id: branchId,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            last_stock_update: new Date().toISOString()
          }]);

        if (createError) throw createError;
        toast.success("Inventory item added successfully");
      }

      // Refresh the list
      const { data, error } = await supabase
        .from('inventory_items')
        .select('*')
        .eq('branch_id', branchId)
        .order('name');

      if (error) throw error;
      setInventory(data || []);
    } catch (error) {
      console.error('Error saving inventory item:', error);
      toast.error('Failed to save inventory item');
    } finally {
      setIsFormOpen(false);
      setEditingItem(null);
      setIsLoading(false);
    }
  };

  const handleDelete = async (item: InventoryItem) => {
    try {
      setIsLoading(true);
      const { error } = await supabase
        .from('inventory_items')
        .delete()
        .eq('id', item.id)
        .eq('branch_id', branchId);

      if (error) throw error;

      // Refresh the list
      const { data, error: refreshError } = await supabase
        .from('inventory_items')
        .select('*')
        .eq('branch_id', branchId)
        .order('name');

      if (refreshError) throw refreshError;
      setInventory(data || []);
      toast.success('Inventory item deleted successfully');
    } catch (error) {
      console.error('Error deleting inventory item:', error);
      toast.error('Failed to delete inventory item');
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusBadge = (status: StockStatus) => {
    switch(status) {
      case "in-stock":
        return <Badge variant="success" className="text-xs">In Stock</Badge>;
      case "low-stock":
        return <Badge variant="warning" className="text-xs">Low Stock</Badge>;
      case "out-of-stock":
        return <Badge variant="destructive" className="text-xs">Out of Stock</Badge>;
      case "expired":
        return <Badge variant="destructive" className="text-xs">Expired</Badge>;
      default:
        return <Badge variant="secondary" className="text-xs">Unknown</Badge>;
    }
  };

  const getCategoryBadge = (category: InventoryCategory) => {
    switch(category) {
      case "supplement":
        return <Badge variant="outline" className="text-xs">Supplement</Badge>;
      case "equipment":
        return <Badge variant="outline" className="text-xs">Equipment</Badge>;
      case "merchandise":
        return <Badge variant="outline" className="text-xs">Merchandise</Badge>;
      default:
        return <Badge variant="outline" className="text-xs">Other</Badge>;
    }
  };

  const alertsCount = inventory.filter(item => 
    item.status === "low-stock" || 
    item.status === "out-of-stock" || 
    (item.expiryDate && new Date(item.expiryDate) < new Date(Date.now() + 30 * 24 * 60 * 60 * 1000))
  ).length;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between space-x-4">
        <h2 className="text-2xl font-semibold">Inventory Management</h2>
        <Button
          onClick={handleAddItem}
          className="flex items-center space-x-2"
        >
          <PlusIcon className="h-4 w-4" />
          <span>Add Item</span>
        </Button>
      </div>

      <div className="flex flex-col space-y-4">
        <div className="flex flex-wrap gap-4">
          <div className="flex-1 max-w-[200px]">
            <Label htmlFor="search">Search</Label>
            <Input
              id="search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by name or SKU..."
              className="w-full"
            />
          </div>

          <div className="flex-1 max-w-[200px]">
            <Label htmlFor="category">Category</Label>
            <Select
              value={categoryFilter}
              onValueChange={setCategoryFilter}
            >
              <SelectTrigger>
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="supplement">Supplements</SelectItem>
                <SelectItem value="equipment">Equipment</SelectItem>
                <SelectItem value="merchandise">Merchandise</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex-1 max-w-[200px]">
            <Label htmlFor="status">Status</Label>
            <Select
              value={statusFilter}
              onValueChange={setStatusFilter}
            >
              <SelectTrigger>
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="in-stock">In Stock</SelectItem>
                <SelectItem value="low-stock">Low Stock</SelectItem>
                <SelectItem value="out-of-stock">Out of Stock</SelectItem>
                <SelectItem value="expired">Expired</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="rounded-md border">
          <div className="px-4 py-3">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium">Inventory Items</h3>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  onClick={handleAddItem}
                >
                  <PlusIcon className="h-4 w-4" />
                  Add Item
                </Button>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="px-4 py-2">Name</th>
                  <th className="px-4 py-2">SKU</th>
                  <th className="px-4 py-2">Category</th>
                  <th className="px-4 py-2">Quantity</th>
                  <th className="px-4 py-2">Status</th>
                  <th className="px-4 py-2">Price</th>
                  <th className="px-4 py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredInventory
                  .map((item) => (
                    <tr key={item.id} className="border-b">
                      <td className="px-4 py-2">
                        <div className="flex items-center space-x-3">
                          <PackageIcon className="h-4 w-4 text-gray-500" />
                          <span>{item.name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-2">{item.sku}</td>
                      <td className="px-4 py-2">
                        {getCategoryBadge(item.category)}
                      </td>
                      <td className="px-4 py-2">
                        <div className="flex items-center space-x-2">
                          <span className="font-medium">{item.quantity}</span>
                        </div>
                      </td>
                      <td className="px-4 py-2">
                        {getStatusBadge(item.status)}
                      </td>
                      <td className="px-4 py-2">${item.price.toFixed(2)}</td>
                      <td className="px-4 py-2">
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEditItem(item)}
                          >
                            Edit
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDelete(item)}
                          >
                            Delete
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>

        {isFormOpen && (
          <InventoryForm
            item={editingItem}
            onSave={handleSaveItem}
            onClose={() => {
              setIsFormOpen(false);
              setEditingItem(null);
            }}
          />
        )}
      </div>
    </div>
  );
};

export default InventoryList;
