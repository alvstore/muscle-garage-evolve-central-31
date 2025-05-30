
import React, { useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { CartItem } from '@/types/store/store';
import { X, Plus, Minus, ShoppingCart, CreditCard } from 'lucide-react';
import { formatCurrency } from '@/utils/formatters';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { razorpayService } from '@/services/classes/integrations/razorpayService';
import { useNavigate } from 'react-router-dom';

interface ProductCheckoutProps {
  cartItems: CartItem[];
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemoveItem: (productId: string) => void;
  onCheckout: () => void;
}

const ProductCheckout = ({ 
  cartItems, 
  onUpdateQuantity, 
  onRemoveItem, 
  onCheckout 
}: ProductCheckoutProps) => {
  const [processingPayment, setProcessingPayment] = useState(false);
  const [couponCode, setCouponCode] = useState('');
  const [couponApplied, setCouponApplied] = useState(false);
  const [discountAmount, setDiscountAmount] = useState(0);
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'razorpay'>('razorpay');
  const [shippingAddress, setShippingAddress] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const navigate = useNavigate();

  // Calculate cart totals
  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const total = subtotal - discountAmount;
  const itemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const handleApplyCoupon = () => {
    if (!couponCode) {
      toast.error("Please enter a coupon code");
      return;
    }

    // Simulate coupon validation
    if (couponCode.toUpperCase() === 'MUSCLE10') {
      const discount = subtotal * 0.1;
      setDiscountAmount(discount);
      setCouponApplied(true);
      toast.success("Coupon applied successfully!");
    } else if (couponCode.toUpperCase() === 'WELCOMEGYM') {
      const discount = subtotal * 0.15;
      setDiscountAmount(discount);
      setCouponApplied(true);
      toast.success("Coupon applied successfully!");
    } else {
      toast.error("Invalid coupon code");
    }
  };

  const handleRemoveCoupon = () => {
    setCouponCode('');
    setCouponApplied(false);
    setDiscountAmount(0);
  };

  const initiateCheckout = () => {
    if (cartItems.length === 0) {
      toast.error("Your cart is empty");
      return;
    }
    setShowCheckoutModal(true);
  };

  const processRazorpayCheckout = async () => {
    if (!shippingAddress || !contactNumber) {
      toast.error("Please provide shipping address and contact number");
      return;
    }

    setProcessingPayment(true);
    
    try {
      // In a real implementation, this would call the backend to create a Razorpay order
      const order = await razorpayService.createOrder(
        total * 100, // Convert to paisa
        'INR',
        `ORDER-${Date.now()}`
      );
      
      if (order) {
        // Simulate Razorpay integration
        setTimeout(() => {
          setProcessingPayment(false);
          setShowCheckoutModal(false);
          onCheckout();
          toast.success("Payment successful! Your order has been placed.");
          navigate('/dashboard');
        }, 2000);
      } else {
        setProcessingPayment(false);
        toast.error("Failed to create payment order");
      }
    } catch (error) {
      console.error("Payment failed:", error);
      setProcessingPayment(false);
      toast.error("Payment processing failed");
    }
  };

  const handleCompletePurchase = () => {
    if (paymentMethod === 'razorpay') {
      processRazorpayCheckout();
    } else {
      // Handle card payment (simplified for demo)
      setProcessingPayment(true);
      setTimeout(() => {
        setProcessingPayment(false);
        setShowCheckoutModal(false);
        onCheckout();
        toast.success("Payment successful! Your order has been placed.");
        navigate('/dashboard');
      }, 1500);
    }
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5" />
            Your Cart {itemCount > 0 && `(${itemCount} items)`}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {cartItems.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">Your cart is empty</p>
              <p className="text-sm mt-2">Add products to your cart to continue shopping</p>
            </div>
          ) : (
            <>
              <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2">
                {cartItems.map((item) => (
                  <div key={item.productId} className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="flex-shrink-0 w-16 h-16 rounded-md overflow-hidden">
                        <img 
                          src={item.product.images[0] || '/placeholder.svg'} 
                          alt={item.product.name} 
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <h4 className="font-medium">{item.product.name}</h4>
                        <p className="text-sm text-muted-foreground">{formatCurrency(item.price)}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button 
                        variant="outline" 
                        size="icon" 
                        className="h-8 w-8"
                        onClick={() => onUpdateQuantity(item.productId, Math.max(1, item.quantity - 1))}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <span className="w-8 text-center">{item.quantity}</span>
                      <Button 
                        variant="outline" 
                        size="icon" 
                        className="h-8 w-8"
                        onClick={() => onUpdateQuantity(item.productId, item.quantity + 1)}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8 ml-2"
                        onClick={() => onRemoveItem(item.productId)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>

              <Separator className="my-4" />

              <div className="space-y-4">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>{formatCurrency(subtotal)}</span>
                </div>

                {/* Coupon Code */}
                {!couponApplied ? (
                  <div className="flex space-x-2">
                    <Input
                      placeholder="Coupon code"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                    />
                    <Button onClick={handleApplyCoupon}>Apply</Button>
                  </div>
                ) : (
                  <div className="flex justify-between">
                    <div className="flex items-center">
                      <span className="text-green-600">Discount ({couponCode})</span>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-6 w-6 ml-1" 
                        onClick={handleRemoveCoupon}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                    <span className="text-green-600">-{formatCurrency(discountAmount)}</span>
                  </div>
                )}

                <Separator />

                <div className="flex justify-between font-bold">
                  <span>Total</span>
                  <span>{formatCurrency(total)}</span>
                </div>
              </div>
            </>
          )}
        </CardContent>
        <CardFooter>
          <Button 
            className="w-full" 
            disabled={cartItems.length === 0 || processingPayment}
            onClick={initiateCheckout}
          >
            {processingPayment ? "Processing..." : "Checkout"}
          </Button>
        </CardFooter>
      </Card>

      {/* Checkout Modal */}
      <Dialog open={showCheckoutModal} onOpenChange={setShowCheckoutModal}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Complete Your Purchase</DialogTitle>
            <DialogDescription>
              Please provide your shipping details and select a payment method
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="shipping-address">Shipping Address</Label>
              <Textarea 
                id="shipping-address" 
                placeholder="Enter your full address"
                value={shippingAddress}
                onChange={(e) => setShippingAddress(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="contact-number">Contact Number</Label>
              <Input 
                id="contact-number" 
                placeholder="Enter your phone number"
                value={contactNumber}
                onChange={(e) => setContactNumber(e.target.value)}
              />
            </div>

            <div className="space-y-2 mt-4">
              <Label>Payment Method</Label>
              <div className="grid grid-cols-2 gap-4 mt-2">
                <div 
                  className={`border rounded-lg p-4 cursor-pointer ${paymentMethod === 'card' ? 'border-primary bg-primary/5' : ''}`}
                  onClick={() => setPaymentMethod('card')}
                >
                  <div className="flex items-center gap-2">
                    <CreditCard className="h-5 w-5" />
                    <span>Credit/Debit Card</span>
                  </div>
                </div>
                <div 
                  className={`border rounded-lg p-4 cursor-pointer ${paymentMethod === 'razorpay' ? 'border-primary bg-primary/5' : ''}`}
                  onClick={() => setPaymentMethod('razorpay')}
                >
                  <div className="flex items-center gap-2">
                    <img 
                      src="/razorpay-logo.png" 
                      alt="Razorpay" 
                      className="h-5 w-5"
                      onError={(e) => {
                        // If image fails to load, show a fallback
                        e.currentTarget.src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="14" x="2" y="5" rx="2"/><line x1="2" x2="22" y1="10" y2="10"/></svg>';
                      }}  
                    />
                    <span>Razorpay</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-2 bg-muted/30 p-4 rounded-lg">
              <h4 className="font-medium">Order Summary</h4>
              <div className="flex justify-between text-sm">
                <span>Items ({itemCount}):</span>
                <span>{formatCurrency(subtotal)}</span>
              </div>
              {couponApplied && (
                <div className="flex justify-between text-sm text-green-600">
                  <span>Discount:</span>
                  <span>-{formatCurrency(discountAmount)}</span>
                </div>
              )}
              <div className="flex justify-between font-bold">
                <span>Total:</span>
                <span>{formatCurrency(total)}</span>
              </div>
            </div>
          </div>

          <DialogFooter className="gap-2 mt-4">
            <Button variant="outline" onClick={() => setShowCheckoutModal(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleCompletePurchase}
              disabled={processingPayment || !shippingAddress || !contactNumber}
            >
              {processingPayment ? "Processing..." : `Pay ${formatCurrency(total)}`}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ProductCheckout;
