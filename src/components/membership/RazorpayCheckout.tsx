
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { Loader2 } from 'lucide-react';
import { membershipService } from '@/services/membershipService';
import { paymentService } from '@/services/paymentService';
import { useBranch } from '@/hooks/use-branches';

// Define the window interface with Razorpay
declare global {
  interface Window {
    Razorpay: any;
  }
}

interface RazorpayCheckoutProps {
  amount: number;
  membershipId: string;
  memberId: string;
  memberName: string;
  memberEmail?: string;
  memberPhone?: string;
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

const RazorpayCheckout: React.FC<RazorpayCheckoutProps> = ({
  amount,
  membershipId,
  memberId,
  memberName,
  memberEmail,
  memberPhone,
  onSuccess,
  onError
}) => {
  const { toast } = useToast();
  const { currentBranch } = useBranch();
  const [isLoading, setIsLoading] = useState(false);
  const [scriptLoaded, setScriptLoaded] = useState(false);

  // Load Razorpay script
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onload = () => setScriptLoaded(true);
    
    document.body.appendChild(script);
    
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const handlePayment = async () => {
    if (!scriptLoaded) {
      toast({
        title: "Razorpay not loaded",
        description: "Please wait for the payment system to load",
        variant: "destructive",
      });
      return;
    }
    
    if (!currentBranch?.id) {
      toast({
        title: "Branch not selected",
        description: "Please select a branch before proceeding",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Create payment link
      const result = await paymentService.getPaymentLink({
        amount,
        name: memberName,
        email: memberEmail,
        phone: memberPhone,
        description: `Membership payment for ${memberName}`,
        notes: {
          memberId,
          membershipId,
          branchId: currentBranch.id
        }
      });
      
      if (!result.success || !result.data) {
        throw new Error(result.error || 'Failed to create payment link');
      }
      
      const orderId = result.data.id;
      
      // Initialize Razorpay options
      const options = {
        key: process.env.RAZORPAY_KEY_ID, // Replace with actual key from env
        amount: amount * 100, // Amount in smallest currency unit
        currency: 'INR',
        name: 'Gym CRM',
        description: `Membership payment for ${memberName}`,
        order_id: orderId,
        prefill: {
          name: memberName,
          email: memberEmail || '',
          contact: memberPhone || ''
        },
        handler: async function(response: any) {
          try {
            // Verify payment
            const verifyResult = await paymentService.verifyPayment({
              paymentId: response.razorpay_payment_id,
              orderId: response.razorpay_order_id,
              signature: response.razorpay_signature,
              membershipId,
              memberId,
              amount,
              branchId: currentBranch.id
            });
            
            if (verifyResult.success) {
              toast({
                title: "Payment successful",
                description: "Your payment has been processed successfully",
              });
              
              if (onSuccess) {
                onSuccess();
              }
            } else {
              throw new Error(verifyResult.error || 'Payment verification failed');
            }
          } catch (error: any) {
            console.error('Error in payment verification:', error);
            toast({
              title: "Payment verification failed",
              description: error.message || 'There was an issue verifying your payment',
              variant: "destructive",
            });
            
            if (onError) {
              onError(error.message || 'Payment verification failed');
            }
          }
        },
        modal: {
          ondismiss: function() {
            toast({
              title: "Payment cancelled",
              description: "You have cancelled the payment process",
            });
          }
        }
      };
      
      // Initialize Razorpay checkout
      const razorpay = new window.Razorpay(options);
      razorpay.open();
      
    } catch (error: any) {
      console.error('Error in payment process:', error);
      toast({
        title: "Payment initialization failed",
        description: error.message || 'There was an issue setting up the payment',
        variant: "destructive",
      });
      
      if (onError) {
        onError(error.message || 'Payment initialization failed');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button 
      onClick={handlePayment} 
      disabled={isLoading || !scriptLoaded}
      className="w-full"
    >
      {isLoading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Processing...
        </>
      ) : (
        'Pay Now'
      )}
    </Button>
  );
};

export default RazorpayCheckout;
