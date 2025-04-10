
import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { 
  ShoppingCart, 
  Plus, 
  Minus, 
  Trash, 
  Tag, 
  CreditCard, 
  Printer, 
  Receipt, 
  Save,
  Search,
  User,
  X
} from "lucide-react";
import { 
  Product, 
  CartItem, 
  PaymentMethod 
} from "@/types/store";
import { Member } from "@/types";
import { PromoCode } from "@/types/marketing";
import { toast } from "sonner";

// Mock products data
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
];

// Mock members data
const mockMembers: Member[] = [
  {
    id: "1",
    name: "John Smith",
    email: "john.smith@example.com",
    role: "member",
    membershipStatus: "active",
    membershipStartDate: "2023-01-01T00:00:00Z",
    membershipEndDate: "2023-12-31T23:59:59Z",
  },
  {
    id: "2",
    name: "Sarah Johnson",
    email: "sarah.j@example.com",
    role: "member",
    membershipStatus: "active",
    membershipStartDate: "2023-02-15T00:00:00Z",
    membershipEndDate: "2023-08-15T23:59:59Z",
  },
  {
    id: "3",
    name: "Michael Brown",
    email: "m.brown@example.com",
    role: "member",
    membershipStatus: "active",
    membershipStartDate: "2023-03-10T00:00:00Z",
    membershipEndDate: "2024-03-10T23:59:59Z",
  },
];

// Mock promo codes
const mockPromoCodes: PromoCode[] = [
  {
    id: "1",
    code: "SUMMER25",
    description: "Summer discount 25% off",
    type: "percentage",
    value: 25,
    startDate: "2023-06-01T00:00:00Z",
    endDate: "2023-08-31T23:59:59Z",
    status: "active",
    usageLimit: 100,
    currentUsage: 43,
    applicableProducts: ["all"],
    createdBy: "Admin",
    createdAt: "2023-05-15T10:00:00Z"
  },
  {
    id: "2",
    code: "MEMBER10",
    description: "Member discount $10 off",
    type: "fixed",
    value: 10,
    startDate: "2023-01-01T00:00:00Z",
    endDate: "2023-12-31T23:59:59Z",
    status: "active",
    usageLimit: 0,
    currentUsage: 124,
    applicableProducts: ["all"],
    createdBy: "Admin",
    createdAt: "2023-01-01T00:00:00Z"
  },
];

const POSSystem = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [customerSearchTerm, setCustomerSearchTerm] = useState("");
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [filteredMembers, setFilteredMembers] = useState<Member[]>([]);
  const [showCustomerSearch, setShowCustomerSearch] = useState(false);
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [promoCode, setPromoCode] = useState("");
  const [appliedPromo, setAppliedPromo] = useState<PromoCode | null>(null);
  const [discount, setDiscount] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("cash");
  const [loading, setLoading] = useState(true);
  
  // Calculate totals
  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const taxRate = 0.07; // 7% tax
  const taxAmount = subtotal * taxRate;
  const totalWithoutDiscount = subtotal + taxAmount;
  const total = totalWithoutDiscount - discount;

  useEffect(() => {
    // Simulate API call to load products
    setTimeout(() => {
      setProducts(mockProducts);
      setFilteredProducts(mockProducts);
      setLoading(false);
    }, 1000);
  }, []);

  // Filter products based on search term
  useEffect(() => {
    if (searchTerm) {
      const filtered = products.filter(product => 
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (product.barcode && product.barcode.includes(searchTerm))
      );
      setFilteredProducts(filtered);
    } else {
      setFilteredProducts(products);
    }
  }, [searchTerm, products]);

  // Filter members based on search term
  useEffect(() => {
    if (customerSearchTerm) {
      const filtered = mockMembers.filter(member => 
        member.name.toLowerCase().includes(customerSearchTerm.toLowerCase()) ||
        member.email.toLowerCase().includes(customerSearchTerm.toLowerCase())
      );
      setFilteredMembers(filtered);
    } else {
      setFilteredMembers([]);
    }
  }, [customerSearchTerm]);

  const addToCart = (product: Product) => {
    // Check if product is already in cart
    const existingItem = cart.find(item => item.productId === product.id);
    
    if (existingItem) {
      // Increase quantity if already in cart
      setCart(cart.map(item => 
        item.productId === product.id 
          ? { ...item, quantity: item.quantity + 1 } 
          : item
      ));
    } else {
      // Add new item to cart
      const newItem: CartItem = {
        productId: product.id,
        product,
        quantity: 1,
        price: product.salePrice || product.price,
      };
      setCart([...cart, newItem]);
    }
    
    toast.success(`Added ${product.name} to cart`);
  };

  const removeFromCart = (productId: string) => {
    setCart(cart.filter(item => item.productId !== productId));
  };

  const updateQuantity = (productId: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    
    setCart(cart.map(item => 
      item.productId === productId 
        ? { ...item, quantity: newQuantity } 
        : item
    ));
  };

  const applyPromoCode = () => {
    if (!promoCode) return;
    
    // Find the promo code in our mock data
    const foundPromo = mockPromoCodes.find(p => 
      p.code.toLowerCase() === promoCode.toLowerCase() && 
      p.status === "active"
    );
    
    if (foundPromo) {
      setAppliedPromo(foundPromo);
      
      // Calculate discount based on promo type
      if (foundPromo.type === "percentage") {
        const discountAmount = subtotal * (foundPromo.value / 100);
        // Apply max discount limit if available
        const finalDiscount = foundPromo.maxDiscountAmount 
          ? Math.min(discountAmount, foundPromo.maxDiscountAmount)
          : discountAmount;
        
        setDiscount(parseFloat(finalDiscount.toFixed(2)));
      } else if (foundPromo.type === "fixed") {
        // For fixed discount, ensure it doesn't exceed the subtotal
        setDiscount(Math.min(foundPromo.value, subtotal));
      }
      
      toast.success(`Promo code ${foundPromo.code} applied`);
    } else {
      toast.error("Invalid or expired promo code");
    }
  };

  const removePromoCode = () => {
    setPromoCode("");
    setAppliedPromo(null);
    setDiscount(0);
  };

  const selectMember = (member: Member) => {
    setSelectedMember(member);
    setCustomerName(member.name);
    setCustomerEmail(member.email || "");
    setShowCustomerSearch(false);
    setCustomerSearchTerm("");
  };

  const handleCheckout = () => {
    if (cart.length === 0) {
      toast.error("Cart is empty");
      return;
    }
    
    // In a real app, this would create an order and process payment
    toast.success("Order processed successfully");
    
    // Clear cart and related state
    setCart([]);
    setSelectedMember(null);
    setCustomerName("");
    setCustomerEmail("");
    setPromoCode("");
    setAppliedPromo(null);
    setDiscount(0);
    setPaymentMethod("cash");
  };

  // Format currency
  const formatCurrency = (amount: number) => {
    return `$${amount.toFixed(2)}`;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Product Catalog */}
      <div className="lg:col-span-2">
        <Card className="h-full flex flex-col">
          <CardHeader className="pb-3">
            <CardTitle>Product Catalog</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 flex-grow overflow-auto">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search products by name, SKU or barcode..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
            
            {loading ? (
              <div className="flex items-center justify-center h-64">
                <div className="h-6 w-6 rounded-full border-2 border-t-primary animate-spin"></div>
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="text-center py-10">
                <p className="text-muted-foreground">No products found</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {filteredProducts.map((product) => (
                  <Card key={product.id} className="cursor-pointer hover:bg-secondary/20 transition-colors overflow-hidden" onClick={() => addToCart(product)}>
                    <div className="p-4">
                      <div className="bg-muted rounded-md h-20 flex items-center justify-center mb-2">
                        <ShoppingCart className="h-8 w-8 text-muted-foreground" />
                      </div>
                      <h3 className="font-medium text-sm line-clamp-1">{product.name}</h3>
                      <div className="flex justify-between items-center mt-1">
                        <div>
                          {product.salePrice ? (
                            <div className="flex flex-col">
                              <span className="line-through text-xs text-muted-foreground">{formatCurrency(product.price)}</span>
                              <span className="text-sm font-bold text-red-600">{formatCurrency(product.salePrice)}</span>
                            </div>
                          ) : (
                            <span className="text-sm font-bold">{formatCurrency(product.price)}</span>
                          )}
                        </div>
                        <Badge variant={product.stock > 10 ? "outline" : product.stock > 0 ? "secondary" : "destructive"} className="text-xs">
                          {product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}
                        </Badge>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      
      {/* Shopping Cart */}
      <div>
        <Card className="h-full flex flex-col">
          <CardHeader className="pb-3">
            <div className="flex justify-between items-center">
              <CardTitle>Shopping Cart</CardTitle>
              <Badge variant="outline" className="text-xl px-3 py-1">{cart.length}</Badge>
            </div>
          </CardHeader>
          <CardContent className="flex-grow overflow-auto">
            {/* Customer Section */}
            <div className="mb-6 space-y-3">
              <h3 className="text-sm font-medium">Customer</h3>
              {selectedMember ? (
                <div className="flex justify-between items-center p-3 border rounded-md">
                  <div>
                    <p className="font-medium">{selectedMember.name}</p>
                    <p className="text-xs text-muted-foreground">{selectedMember.email}</p>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => setSelectedMember(null)}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <div className="relative">
                  {showCustomerSearch ? (
                    <div className="border rounded-md overflow-hidden">
                      <div className="relative">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                          placeholder="Search members..."
                          value={customerSearchTerm}
                          onChange={(e) => setCustomerSearchTerm(e.target.value)}
                          className="pl-8 border-0 focus-visible:ring-0"
                          autoFocus
                        />
                      </div>
                      
                      {customerSearchTerm && (
                        <div className="max-h-48 overflow-auto border-t">
                          {filteredMembers.length > 0 ? (
                            filteredMembers.map(member => (
                              <div
                                key={member.id}
                                className="p-2 hover:bg-muted cursor-pointer border-b last:border-0"
                                onClick={() => selectMember(member)}
                              >
                                <p className="font-medium">{member.name}</p>
                                <p className="text-xs text-muted-foreground">{member.email}</p>
                              </div>
                            ))
                          ) : (
                            <div className="p-2 text-sm text-muted-foreground">
                              No members found
                            </div>
                          )}
                        </div>
                      )}
                      
                      <div className="border-t p-2 bg-muted flex justify-between">
                        <Button variant="ghost" size="sm" onClick={() => setShowCustomerSearch(false)}>
                          Cancel
                        </Button>
                        <Button size="sm" onClick={() => setShowCustomerSearch(false)}>
                          Guest Checkout
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <Button 
                      variant="outline" 
                      className="w-full justify-start"
                      onClick={() => setShowCustomerSearch(true)}
                    >
                      <User className="h-4 w-4 mr-2" />
                      Select Customer
                    </Button>
                  )}
                </div>
              )}
            </div>
            
            {/* Cart Items */}
            {cart.length === 0 ? (
              <div className="text-center py-8">
                <ShoppingCart className="h-12 w-12 mx-auto text-muted-foreground" />
                <h3 className="mt-4 font-medium">Your cart is empty</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Add products from the catalog
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Item</TableHead>
                      <TableHead>Qty</TableHead>
                      <TableHead className="text-right">Price</TableHead>
                      <TableHead className="w-[50px]"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {cart.map((item) => (
                      <TableRow key={item.productId}>
                        <TableCell className="font-medium">
                          <div>
                            <p className="line-clamp-1">{item.product.name}</p>
                            <p className="text-xs text-muted-foreground">{item.product.sku}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-1">
                            <Button 
                              variant="outline" 
                              size="icon" 
                              className="h-6 w-6"
                              onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                            >
                              <Minus className="h-3 w-3" />
                            </Button>
                            <Input
                              className="h-8 w-12 text-center"
                              value={item.quantity}
                              onChange={(e) => {
                                const value = parseInt(e.target.value);
                                if (!isNaN(value)) {
                                  updateQuantity(item.productId, value);
                                }
                              }}
                            />
                            <Button 
                              variant="outline" 
                              size="icon" 
                              className="h-6 w-6"
                              onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          {formatCurrency(item.price * item.quantity)}
                        </TableCell>
                        <TableCell>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-6 w-6 text-red-500"
                            onClick={() => removeFromCart(item.productId)}
                          >
                            <Trash className="h-3 w-3" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                
                {/* Promo Code */}
                <div className="border rounded-md p-3 space-y-3">
                  <h3 className="text-sm font-medium flex items-center">
                    <Tag className="h-4 w-4 mr-1" />
                    Promo Code
                  </h3>
                  
                  {appliedPromo ? (
                    <div className="flex justify-between items-center">
                      <div>
                        <Badge variant="outline" className="font-mono">
                          {appliedPromo.code}
                        </Badge>
                        <p className="text-xs text-muted-foreground mt-1">
                          {appliedPromo.description}
                        </p>
                      </div>
                      <Button variant="ghost" size="sm" onClick={removePromoCode}>
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <div className="flex space-x-2">
                      <Input
                        placeholder="Enter promo code"
                        value={promoCode}
                        onChange={(e) => setPromoCode(e.target.value)}
                        className="flex-1"
                      />
                      <Button size="sm" onClick={applyPromoCode}>Apply</Button>
                    </div>
                  )}
                </div>
                
                {/* Order Summary */}
                <div className="border rounded-md p-3 space-y-3">
                  <h3 className="text-sm font-medium">Order Summary</h3>
                  
                  <div className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span>Subtotal</span>
                      <span>{formatCurrency(subtotal)}</span>
                    </div>
                    
                    <div className="flex justify-between text-sm">
                      <span>Tax (7%)</span>
                      <span>{formatCurrency(taxAmount)}</span>
                    </div>
                    
                    {discount > 0 && (
                      <div className="flex justify-between text-sm text-green-600">
                        <span>Discount</span>
                        <span>-{formatCurrency(discount)}</span>
                      </div>
                    )}
                    
                    <div className="border-t my-2"></div>
                    
                    <div className="flex justify-between font-bold">
                      <span>Total</span>
                      <span>{formatCurrency(total)}</span>
                    </div>
                  </div>
                </div>
                
                {/* Payment Method */}
                <div className="border rounded-md p-3 space-y-3">
                  <h3 className="text-sm font-medium flex items-center">
                    <CreditCard className="h-4 w-4 mr-1" />
                    Payment Method
                  </h3>
                  
                  <Select
                    value={paymentMethod}
                    onValueChange={(value) => setPaymentMethod(value as PaymentMethod)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select payment method" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="cash">Cash</SelectItem>
                      <SelectItem value="card">Credit/Debit Card</SelectItem>
                      <SelectItem value="bank-transfer">Bank Transfer</SelectItem>
                      <SelectItem value="wallet">Wallet</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}
          </CardContent>
          <CardFooter className="border-t pt-4 flex flex-col gap-2">
            <div className="grid grid-cols-2 gap-2 w-full">
              <Button variant="outline" disabled={cart.length === 0}>
                <Save className="h-4 w-4 mr-2" />
                Save Order
              </Button>
              <Button variant="outline" disabled={cart.length === 0}>
                <Printer className="h-4 w-4 mr-2" />
                Print
              </Button>
            </div>
            <Button 
              className="w-full" 
              size="lg"
              disabled={cart.length === 0}
              onClick={handleCheckout}
            >
              <Receipt className="h-4 w-4 mr-2" />
              Complete Sale ({formatCurrency(total)})
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default POSSystem;
