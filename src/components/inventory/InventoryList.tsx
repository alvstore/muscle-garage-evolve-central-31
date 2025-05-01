
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

const InventoryList = () => {
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
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
        return <Badge variant="outline" className="bg-green-100 text-green-800">In Stock</Badge>;
      case "low-stock":
        return <Badge variant="outline" className="bg-yellow-100 text-yellow-800">Low Stock</Badge>;
      case "out-of-stock":
        return <Badge variant="outline" className="bg-red-100 text-red-800">Out of Stock</Badge>;
      case "expired":
        return <Badge variant="outline" className="bg-purple-100 text-purple-800">Expired</Badge>;
      default:
        return null;
    }
  };

  const getCategoryBadge = (category: InventoryCategory) => {
    switch(category) {
      case "supplement":
        return <Badge variant="outline" className="bg-blue-100 text-blue-800">Supplement</Badge>;
      case "equipment":
        return <Badge variant="outline" className="bg-gray-100 text-gray-800">Equipment</Badge>;
      case "merchandise":
        return <Badge variant="outline" className="bg-indigo-100 text-indigo-800">Merchandise</Badge>;
      default:
        return null;
    }
  };

  const alertsCount = inventory.filter(item => 
    item.status === "low-stock" || 
    item.status === "out-of-stock" || 
    (item.expiryDate && new Date(item.expiryDate) < new Date(Date.now() + 30 * 24 * 60 * 60 * 1000))
  ).length;

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardHeader className="py-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Items</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {inventory.length}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {inventory.reduce((sum, item) => sum + item.quantity, 0)} units in total
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="py-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Inventory Value</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${inventory.reduce((sum, item) => sum + (item.quantity * item.price), 0).toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Cost: ${inventory.reduce((sum, item) => sum + (item.quantity * (item.costPrice || 0)), 0).toFixed(2)}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="py-3">
            <CardTitle className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <AlertCircleIcon className="h-4 w-4 text-yellow-500" />
              Alerts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-500">
              {alertsCount}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Items requiring attention
            </p>
          </CardContent>
        </Card>
      </div>
    
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <PackageIcon className="h-5 w-5" />
            Inventory Management
          </CardTitle>
          <Button onClick={handleAddItem} className="flex items-center gap-1">
            <PlusIcon className="h-4 w-4" /> Add Item
          </Button>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search by name or SKU..." 
                className="pl-8" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-[130px]">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="supplement">Supplements</SelectItem>
                  <SelectItem value="equipment">Equipment</SelectItem>
                  <SelectItem value="merchandise">Merchandise</SelectItem>
                </SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[130px]">
                  <SelectValue placeholder="Status" />
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
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Image</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>SKU</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Last Updated</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredInventory.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center py-6 text-muted-foreground">
                      No inventory items found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredInventory.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>
                        <div className="w-12 h-12 rounded-md overflow-hidden">
                          <img 
                            src={item.image || '/placeholder.svg'} 
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">{item.name}</TableCell>
                      <TableCell>{item.sku}</TableCell>
                      <TableCell>{getCategoryBadge(item.category)}</TableCell>
                      <TableCell>{item.quantity}</TableCell>
                      <TableCell>${item.price.toFixed(2)}</TableCell>
                      <TableCell>{getStatusBadge(item.status)}</TableCell>
                      <TableCell>{format(new Date(item.lastStockUpdate), "MMM d, yyyy")}</TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreVerticalIcon className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem onClick={() => handleEditItem(item)}>
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem>Stock In</DropdownMenuItem>
                            <DropdownMenuItem>Stock Out</DropdownMenuItem>
                            <DropdownMenuItem>Transaction History</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {isFormOpen && (
        <InventoryForm
          item={editingItem}
          onSave={handleSaveItem}
          onCancel={() => {
            setIsFormOpen(false);
            setEditingItem(null);
          }}
        />
      )}
    </>
  );
};

export default InventoryList;
