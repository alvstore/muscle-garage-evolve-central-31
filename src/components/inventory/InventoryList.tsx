
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

// Mock data for inventory items
const mockInventoryItems: InventoryItem[] = [
  {
    id: "inv-1",
    name: "Whey Protein",
    sku: "SUP-WP-001",
    category: "supplement",
    description: "Premium whey protein isolate - 1kg",
    quantity: 25,
    price: 49.99,
    costPrice: 30.00,
    supplier: "NutriBulk",
    supplierContact: "+1234567890",
    manufactureDate: "2023-01-15T00:00:00Z",
    expiryDate: "2024-01-15T00:00:00Z",
    reorderLevel: 10,
    location: "Shelf A1",
    image: "/placeholder.svg",
    status: "in-stock",
    lastStockUpdate: "2023-06-01T10:00:00Z",
    createdAt: "2023-01-20T12:00:00Z",
    updatedAt: "2023-06-01T10:00:00Z",
  },
  {
    id: "inv-2",
    name: "Dumbbell Set (5-30kg)",
    sku: "EQP-DB-001",
    category: "equipment",
    description: "Set of 6 pairs of dumbbells ranging from 5kg to 30kg",
    quantity: 3,
    price: 599.99,
    costPrice: 350.00,
    supplier: "GymEquip",
    reorderLevel: 1,
    status: "low-stock",
    lastStockUpdate: "2023-05-15T14:00:00Z",
    createdAt: "2023-02-10T15:30:00Z",
    updatedAt: "2023-05-15T14:00:00Z",
  },
  {
    id: "inv-3",
    name: "Muscle Garage T-Shirt",
    sku: "MER-TS-001",
    category: "merchandise",
    description: "Official gym t-shirt with logo - Medium size",
    quantity: 45,
    price: 24.99,
    costPrice: 8.50,
    reorderLevel: 15,
    location: "Storage B2",
    status: "in-stock",
    lastStockUpdate: "2023-06-10T09:30:00Z",
    createdAt: "2023-03-01T11:45:00Z",
    updatedAt: "2023-06-10T09:30:00Z",
  },
  {
    id: "inv-4",
    name: "Pre-Workout Mix",
    sku: "SUP-PW-001",
    category: "supplement",
    description: "Energy-boosting pre-workout formula - 30 servings",
    quantity: 8,
    price: 39.99,
    costPrice: 22.00,
    supplier: "NutriBulk",
    supplierContact: "+1234567890",
    manufactureDate: "2023-02-01T00:00:00Z",
    expiryDate: "2023-08-01T00:00:00Z",
    reorderLevel: 10,
    location: "Shelf A2",
    status: "low-stock",
    lastStockUpdate: "2023-05-20T13:15:00Z",
    createdAt: "2023-02-15T10:20:00Z",
    updatedAt: "2023-05-20T13:15:00Z",
  },
  {
    id: "inv-5",
    name: "Resistance Bands",
    sku: "EQP-RB-001",
    category: "equipment",
    description: "Set of 5 resistance bands with different strengths",
    quantity: 0,
    price: 29.99,
    costPrice: 12.00,
    supplier: "GymEquip",
    reorderLevel: 5,
    status: "out-of-stock",
    lastStockUpdate: "2023-06-05T16:45:00Z",
    createdAt: "2023-03-10T09:00:00Z",
    updatedAt: "2023-06-05T16:45:00Z",
  },
];

const InventoryList = () => {
  const [inventory, setInventory] = useState<InventoryItem[]>(mockInventoryItems);
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

  const handleSaveItem = (item: InventoryItem) => {
    // In a real application, you would make an API call
    if (item.id) {
      setInventory(inventory.map(i => i.id === item.id ? item : i));
      toast.success("Inventory item updated successfully");
    } else {
      const newItem: InventoryItem = {
        ...item,
        id: `inv-${Date.now()}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        lastStockUpdate: new Date().toISOString(),
      };
      setInventory([...inventory, newItem]);
      toast.success("Inventory item added successfully");
    }
    setIsFormOpen(false);
    setEditingItem(null);
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
                    <TableCell colSpan={8} className="text-center py-6 text-muted-foreground">
                      No inventory items found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredInventory.map((item) => (
                    <TableRow key={item.id}>
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
