import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import {
  ShoppingBag,
  MoreVertical,
  Pencil,
  Trash2,
  Eye,
  PlusCircle,
  Download,
  RefreshCw,
  Package
} from "lucide-react";
import { Product, ProductCategory, ProductStatus } from "@/types/store";
import { toast } from "sonner";

const mockProducts: Product[] = [
  {
    id: "1",
    name: "Whey Protein - Chocolate",
    description: "Premium whey protein powder, chocolate flavor",
    price: 49.99,
    salePrice: 39.99,
    category: "supplement",
    status: "in-stock",
    stock: 45,
    inventoryId: "inv-101",
    sku: "PROT-CHOC-1",
    barcode: "123456789",
    images: ["/placeholder.svg"],
    features: ["24g protein per serving", "Low sugar", "All natural ingredients"],
    brand: "FitFuel",
    featured: true,
    createdAt: "2023-01-15T10:00:00Z"
  },
  {
    id: "2",
    name: "Resistance Bands Set",
    description: "Set of 5 resistance bands with different strengths",
    price: 29.99,
    category: "equipment",
    status: "in-stock",
    stock: 30,
    inventoryId: "inv-102",
    sku: "EQUIP-RB-1",
    images: ["/placeholder.svg"],
    features: ["5 different resistance levels", "Includes carrying case", "Durable latex material"],
    brand: "FitGear",
    featured: false,
    createdAt: "2023-02-20T10:00:00Z"
  },
  {
    id: "3",
    name: "Gym T-Shirt - Black",
    description: "Quick-dry performance t-shirt with gym logo",
    price: 24.99,
    category: "apparel",
    status: "in-stock",
    stock: 78,
    inventoryId: "inv-103",
    sku: "APP-TS-BLK-M",
    images: ["/placeholder.svg"],
    features: ["Quick-dry fabric", "Anti-odor technology", "Slim fit"],
    brand: "GymWear",
    featured: false,
    createdAt: "2023-03-10T10:00:00Z"
  },
  {
    id: "4",
    name: "Shaker Bottle",
    description: "BPA-free protein shaker with mixer ball",
    price: 12.99,
    salePrice: 9.99,
    category: "accessory",
    status: "in-stock",
    stock: 120,
    inventoryId: "inv-104",
    sku: "ACC-SB-1",
    images: ["/placeholder.svg"],
    brand: "FitFuel",
    featured: true,
    createdAt: "2023-02-05T10:00:00Z"
  },
  {
    id: "5",
    name: "Pre-Workout - Berry Blast",
    description: "Energy-boosting pre-workout formula",
    price: 39.99,
    category: "supplement",
    status: "low-stock",
    stock: 5,
    inventoryId: "inv-105",
    sku: "SUPP-PRE-BB",
    barcode: "987654321",
    images: ["/placeholder.svg"],
    features: ["Caffeine and Beta-Alanine", "Sugar-free", "30 servings"],
    brand: "EnergyFuel",
    featured: false,
    createdAt: "2023-04-01T10:00:00Z"
  },
  {
    id: "6",
    name: "Adjustable Dumbbell Set",
    description: "Space-saving adjustable dumbbells, 5-25kg each",
    price: 299.99,
    category: "equipment",
    status: "out-of-stock",
    stock: 0,
    inventoryId: "inv-106",
    sku: "EQUIP-DB-ADJ",
    images: ["/placeholder.svg"],
    features: ["Adjustable from 5kg to 25kg", "Space-saving design", "Durable construction"],
    brand: "FitGear",
    featured: true,
    createdAt: "2023-01-05T10:00:00Z"
  }
];

interface ProductListProps {
  onEdit: (product: Product) => void;
  onAddNew: () => void;
  isMemberView?: boolean;
}

const ProductList = ({ onEdit, onAddNew, isMemberView = false }: ProductListProps) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<ProductCategory | "all">("all");
  const [statusFilter, setStatusFilter] = useState<ProductStatus | "all">("all");

  useEffect(() => {
    setTimeout(() => {
      setProducts(mockProducts);
      setFilteredProducts(mockProducts);
      setLoading(false);
    }, 1000);
  }, []);

  useEffect(() => {
    let result = products;
    
    if (searchTerm) {
      result = result.filter(product => 
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.sku.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (categoryFilter !== "all") {
      result = result.filter(product => product.category === categoryFilter);
    }
    
    if (statusFilter !== "all") {
      result = result.filter(product => product.status === statusFilter);
    }
    
    setFilteredProducts(result);
  }, [products, searchTerm, categoryFilter, statusFilter]);

  const handleDelete = (id: string) => {
    setProducts(products.filter(product => product.id !== id));
    setFilteredProducts(filteredProducts.filter(product => product.id !== id));
    toast.success("Product deleted successfully");
  };

  const getStatusBadge = (status: ProductStatus) => {
    switch (status) {
      case "in-stock":
        return <Badge variant="outline" className="bg-green-50 text-green-600 border-green-200">In Stock</Badge>;
      case "low-stock":
        return <Badge variant="outline" className="bg-amber-50 text-amber-600 border-amber-200">Low Stock</Badge>;
      case "out-of-stock":
        return <Badge variant="outline" className="bg-red-50 text-red-600 border-red-200">Out of Stock</Badge>;
      case "discontinued":
        return <Badge variant="outline" className="bg-gray-50 text-gray-600 border-gray-200">Discontinued</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const formatPrice = (price: number) => {
    return `$${price.toFixed(2)}`;
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <CardTitle>{isMemberView ? "Available Products" : "Products"}</CardTitle>
          {!isMemberView && (
            <Button onClick={onAddNew}>
              <PlusCircle className="h-4 w-4 mr-2" />
              Add New Product
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="mb-6 space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder="Search products by name, description or SKU..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />
            </div>
            <div className="flex gap-2">
              <Select
                value={categoryFilter}
                onValueChange={(value) => setCategoryFilter(value as ProductCategory | "all")}
              >
                <SelectTrigger className="w-[160px]">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="supplement">Supplements</SelectItem>
                  <SelectItem value="equipment">Equipment</SelectItem>
                  <SelectItem value="apparel">Apparel</SelectItem>
                  <SelectItem value="accessory">Accessories</SelectItem>
                  <SelectItem value="membership">Memberships</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
              
              <Select
                value={statusFilter}
                onValueChange={(value) => setStatusFilter(value as ProductStatus | "all")}
              >
                <SelectTrigger className="w-[160px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="in-stock">In Stock</SelectItem>
                  <SelectItem value="low-stock">Low Stock</SelectItem>
                  <SelectItem value="out-of-stock">Out of Stock</SelectItem>
                  <SelectItem value="discontinued">Discontinued</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="flex justify-between items-center">
            <p className="text-sm text-muted-foreground">
              Showing {filteredProducts.length} products
            </p>
            <div className="flex gap-2">
              {!isMemberView && (
                <>
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Export
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => {
                      setLoading(true);
                      setTimeout(() => {
                        setProducts(mockProducts);
                        setFilteredProducts(mockProducts);
                        setLoading(false);
                      }, 1000);
                    }}
                  >
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Refresh
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>

        {loading ? (
          <div className="h-64 flex items-center justify-center">
            <div className="flex flex-col items-center gap-2">
              <div className="h-6 w-6 rounded-full border-2 border-t-primary animate-spin"></div>
              <p className="text-sm text-muted-foreground">Loading products...</p>
            </div>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-10">
            <Package className="h-10 w-10 mx-auto text-muted-foreground" />
            <h3 className="mt-4 text-lg font-medium">No products found</h3>
            <p className="mt-1 text-sm text-muted-foreground mb-4">
              {searchTerm || categoryFilter !== "all" || statusFilter !== "all" 
                ? "Try changing your filters"
                : isMemberView ? "No products available in this category" : "Start by adding a new product"}
            </p>
            {searchTerm || categoryFilter !== "all" || statusFilter !== "all" ? (
              <Button 
                variant="outline" 
                onClick={() => {
                  setSearchTerm("");
                  setCategoryFilter("all");
                  setStatusFilter("all");
                }}
              >
                Clear Filters
              </Button>
            ) : (!isMemberView && (
              <Button onClick={onAddNew}>
                <PlusCircle className="h-4 w-4 mr-2" />
                Add New Product
              </Button>
            ))}
          </div>
        ) : (
          <div className="rounded-md border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Stock</TableHead>
                  {!isMemberView && <TableHead>SKU</TableHead>}
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProducts.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <div className="bg-gray-100 rounded w-10 h-10 flex items-center justify-center">
                          <ShoppingBag className="h-5 w-5 text-gray-500" />
                        </div>
                        <div>
                          <p className="font-medium">{product.name}</p>
                          <p className="text-xs text-muted-foreground line-clamp-1">{product.description}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="capitalize">{product.category}</TableCell>
                    <TableCell>
                      {product.salePrice ? (
                        <div className="flex flex-col">
                          <span className="line-through text-xs text-muted-foreground">{formatPrice(product.price)}</span>
                          <span className="text-red-600">{formatPrice(product.salePrice)}</span>
                        </div>
                      ) : (
                        formatPrice(product.price)
                      )}
                    </TableCell>
                    <TableCell>{getStatusBadge(product.status)}</TableCell>
                    <TableCell>{product.stock}</TableCell>
                    {!isMemberView && <TableCell className="font-mono text-xs">{product.sku}</TableCell>}
                    <TableCell className="text-right">
                      {isMemberView ? (
                        <Button variant="outline" size="sm">
                          Add to Cart
                        </Button>
                      ) : (
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => onEdit(product)}>
                              <Pencil className="h-4 w-4 mr-2" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Eye className="h-4 w-4 mr-2" />
                              View
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={() => handleDelete(product.id)}
                              className="text-destructive focus:text-destructive"
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ProductList;
