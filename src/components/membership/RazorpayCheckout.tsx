import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AlertCircle, Check, Loader2 } from 'lucide-react';
import { MembershipPlan } from '@/types/membership';
import { membershipService } from '@/services/membershipService';
import { toast } from 'sonner';
import { usePaymentLink, useVerifyPayment } from '@/hooks/use-membership';

interface RazorpayCheckoutProps {
  plan: MembershipPlan;
  memberId: string;
  onSuccess: (subscriptionData: any) => void;
  onCancel: () => void;
}

declare global {
  interface Window {
    Razorpay: any;
  }
}

const RazorpayCheckout: React.FC<RazorpayCheckoutProps> = ({ plan, memberId, onSuccess, onCancel }) => {
  const [loading, setLoading] = useState(false);
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const [promoCode, setPromoCode] = useState('');
  const [promoApplied, setPromoApplied] = useState(false);
  const [discountAmount, setDiscountAmount] = useState(0);
  const [finalAmount, setFinalAmount] = useState(plan.price);
  
  const paymentLinkMutation = usePaymentLink();
  const verifyPaymentMutation = useVerifyPayment();
  
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onload = () => {
      setScriptLoaded(true);
    };
    document.body.appendChild(script);
    
    return () => {
      document.body.removeChild(script);
    };
  }, []);
  
  const handleApplyPromo = async () => {
    if (!promoCode.trim()) {
      toast.error('Please enter a promo code');
      return;
    }
    
    setLoading(true);
    
    try {
      if (promoCode.toUpperCase() === 'WELCOME10') {
        const discount = plan.price * 0.1;
        setDiscountAmount(discount);
        setFinalAmount(plan.price - discount);
        setPromoApplied(true);
        toast.success('Promo code applied successfully!');
      } else {
        toast.error('Invalid promo code');
      }
    } catch (error) {
      toast.error('Failed to apply promo code');
    } finally {
      setLoading(false);
    }
  };
  
  const handleInitiatePayment = async () => {
    setLoading(true);
    
    try {
      const paymentLink = await membershipService.getPaymentLink(
        plan.id, 
        memberId,
        promoApplied ? promoCode : undefined
      );
      
      if (!paymentLink) {
        throw new Error('Failed to generate payment link');
      }
      
      openRazorpayCheckout();
    } catch (error) {
      toast.error('Failed to initiate payment');
      setLoading(false);
    }
  };
  
  const openRazorpayCheckout = () => {
    if (!scriptLoaded) {
      toast.error('Payment system is not ready yet. Please try again.');
      setLoading(false);
      return;
    }
    
    const options = {
      key: 'rzp_test_YourKeyHere',
      amount: finalAmount * 100,
      currency: 'INR',
      name: 'Muscle Garage Evolve',
      description: `${plan.name} Membership`,
      image: '/placeholder.svg',
      handler: function(response: any) {
        const subscriptionData = {
          planId: plan.id,
          memberId: memberId,
          paymentId: response.razorpay_payment_id,
          amount: finalAmount,
          appliedPromo: promoApplied ? promoCode : null
        };
        
        membershipService.verifyPayment(
          response.razorpay_payment_id,
          response.razorpay_order_id,
          response.razorpay_signature,
          subscriptionData
        ).then(() => {
          onSuccess(subscriptionData);
        });
      },
      prefill: {
        name: 'Member Name',
        email: 'member@example.com',
        contact: '9999999999'
      },
      theme: {
        color: '#3B82F6'
      },
      modal: {
        ondismiss: function() {
          setLoading(false);
          toast.info('Payment cancelled');
          onCancel();
        }
      }
    };
    
    const razorpay = new window.Razorpay(options);
    razorpay.open();
  };
  
  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Checkout</CardTitle>
        <CardDescription>Complete your membership purchase</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <div className="font-medium mb-2">Selected Plan</div>
          <div className="bg-muted rounded-md p-3">
            <div className="flex justify-between items-center mb-2">
              <span className="font-semibold">{plan.name}</span>
              <span>₹{plan.price.toFixed(2)}</span>
            </div>
            <div className="text-sm text-muted-foreground">
              {plan.durationLabel} membership
            </div>
          </div>
        </div>
        
        <div className="border-t pt-4">
          <Label htmlFor="promo-code">Promo Code</Label>
          <div className="flex space-x-2 mt-1">
            <Input
              id="promo-code"
              placeholder="Enter promo code"
              value={promoCode}
              onChange={(e) => setPromoCode(e.target.value)}
              disabled={promoApplied || loading}
            />
            <Button 
              onClick={handleApplyPromo} 
              disabled={promoApplied || loading || !promoCode}
              variant="secondary"
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin mr-1" /> : null}
              {promoApplied ? <Check className="h-4 w-4 mr-1" /> : null}
              {promoApplied ? 'Applied' : 'Apply'}
            </Button>
          </div>
          {promoApplied && (
            <div className="text-sm text-green-600 mt-1 flex items-center">
              <Check className="h-4 w-4 mr-1" />
              Discount of ₹{discountAmount.toFixed(2)} applied!
            </div>
          )}
        </div>
        
        <div className="border-t pt-4">
          <div className="flex justify-between mb-2">
            <span>Subtotal</span>
            <span>₹{plan.price.toFixed(2)}</span>
          </div>
          {promoApplied && (
            <div className="flex justify-between mb-2 text-green-600">
              <span>Discount</span>
              <span>-₹{discountAmount.toFixed(2)}</span>
            </div>
          )}
          <div className="flex justify-between font-bold text-lg">
            <span>Total</span>
            <span>₹{finalAmount.toFixed(2)}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={onCancel} disabled={loading}>
          Cancel
        </Button>
        <Button onClick={handleInitiatePayment} disabled={loading || !scriptLoaded}>
          {loading ? <Loader2 className="h-4 w-4 animate-spin mr-1" /> : null}
          Pay Now ₹{finalAmount.toFixed(2)}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default RazorpayCheckout;
