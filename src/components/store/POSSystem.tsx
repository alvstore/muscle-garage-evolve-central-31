// Import necessary modules and components
import React, { useState, useEffect } from 'react';
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";
import { v4 as uuidv4 } from 'uuid';
import { stringToDate, dateToString } from "@/utils/date-utils";

// Define types for products and cart items
type Product = {
  id: string;
  name: string;
  price: number;
};

type CartItem = {
  id: string;
  productId: string;
  name: string;
  price: number;
  quantity: number;
};

// Mock product data
const mockProducts: Product[] = [
  { id: "1", name: "Protein Bar", price: 2.50 },
  { id: "2", name: "Shaker Bottle", price: 8.00 },
  { id: "3", name: "Gym Towel", price: 12.00 },
  { id: "4", name: "Wrist Wraps", price: 15.00 },
];

const POSSystem: React.FC = () => {
  const [products, setProducts] = useState<Product[]>(mockProducts);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [discountCode, setDiscountCode] = useState<string>("");
  const [discountAmount, setDiscountAmount] = useState<number>(0);

  // Function to add a product to the cart
  const addToCart = (product: Product) => {
    const existingCartItemIndex = cart.findIndex(item => item.productId === product.id);

    if (existingCartItemIndex > -1) {
      const updatedCart = [...cart];
      updatedCart[existingCartItemIndex].quantity += 1;
      setCart(updatedCart);
    } else {
      const newCartItem: CartItem = {
        id: uuidv4(),
        productId: product.id,
        name: product.name,
        price: product.price,
        quantity: 1,
      };
      setCart([...cart, newCartItem]);
    }
  };

  // Function to update the quantity of a cart item
  const updateQuantity = (itemId: string, newQuantity: number) => {
    if (newQuantity < 1) return;

    const updatedCart = cart.map(item =>
      item.id === itemId ? { ...item, quantity: newQuantity } : item
    );
    setCart(updatedCart);
  };

  // Function to remove a product from the cart
  const removeFromCart = (itemId: string) => {
    const updatedCart = cart.filter(item => item.id !== itemId);
    setCart(updatedCart);
  };

  // Function to apply a discount code
  const applyDiscount = () => {
    if (discountCode === "SAVE10") {
      setDiscountAmount(10);
      toast.success("Discount code applied!");
    } else {
      setDiscountAmount(0);
      toast.error("Invalid discount code.");
    }
  };

  // Calculate subtotal, discount, and total
  const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const discount = (subtotal * discountAmount) / 100;
  const total = subtotal - discount;

  return (
    <div className="container mx-auto py-10">
      <Card>
        <CardHeader>
          <CardTitle>Point of Sale (POS) System</CardTitle>
          <CardDescription>Manage sales and apply discounts</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Product List */}
          <div>
            <h2 className="text-lg font-semibold mb-4">Products</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {products.map(product => (
                <Card key={product.id} className="cursor-pointer hover:shadow-md transition-shadow duration-200" onClick={() => addToCart(product)}>
                  <CardContent className="p-4">
                    <h3 className="text-md font-medium">{product.name}</h3>
                    <p className="text-gray-600">${product.price.toFixed(2)}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Shopping Cart */}
          <div>
            <h2 className="text-lg font-semibold mb-4">Shopping Cart</h2>
            <ScrollArea className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {cart.map(item => (
                    <TableRow key={item.id}>
                      <TableCell>{item.name}</TableCell>
                      <TableCell>${item.price.toFixed(2)}</TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          value={item.quantity}
                          onChange={(e) => updateQuantity(item.id, parseInt(e.target.value))}
                          className="w-20"
                        />
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm" onClick={() => removeFromCart(item.id)}>
                          Remove
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                  {cart.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center">
                        Cart is empty.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </ScrollArea>

            {/* Discount and Total */}
            <div className="mt-4">
              <div className="flex items-center mb-2">
                <Input
                  type="text"
                  placeholder="Discount Code"
                  value={discountCode}
                  onChange={(e) => setDiscountCode(e.target.value)}
                  className="mr-2"
                />
                <Button onClick={applyDiscount}>Apply</Button>
              </div>
              <div className="font-semibold">Subtotal: ${subtotal.toFixed(2)}</div>
              <div className="font-semibold">Discount: ${discount.toFixed(2)}</div>
              <div className="text-xl font-bold">Total: ${total.toFixed(2)}</div>
            </div>

            {/* Checkout Button */}
            <Button className="w-full mt-4">Checkout</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default POSSystem;
