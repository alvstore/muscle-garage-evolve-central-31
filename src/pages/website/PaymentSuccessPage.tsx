
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { CheckCircle, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';

const PaymentSuccessPage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [paymentDetails, setPaymentDetails] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const location = useLocation();
  const navigate = useNavigate();
  
  // Extract reference ID from URL parameters
  const queryParams = new URLSearchParams(location.search);
  const referenceId = queryParams.get('reference');

  useEffect(() => {
    const checkPaymentStatus = async () => {
      if (!referenceId) {
        setError("Payment reference not found");
        setIsLoading(false);
        return;
      }

      try {
        // Get payment status from temp_checkout_data
        const { data, error } = await supabase
          .from('temp_checkout_data')
          .select('*')
          .eq('reference_id', referenceId)
          .single();

        if (error) {
          throw new Error(error.message);
        }

        if (!data) {
          setError("Payment information not found");
          setIsLoading(false);
          return;
        }

        if (data.status !== 'completed') {
          // Payment is still processing or failed
          setError("Payment is still processing. Please wait a moment.");
          
          // Poll again in 3 seconds
          setTimeout(checkPaymentStatus, 3000);
          return;
        }

        setPaymentDetails(data);
        setIsLoading(false);
      } catch (err) {
        console.error('Error checking payment status:', err);
        setError("Could not verify payment status");
        setIsLoading(false);
      }
    };

    checkPaymentStatus();
  }, [referenceId]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-6 text-center">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center space-y-4">
            <div className="w-16 h-16 border-4 border-gray-200 border-t-blue-500 rounded-full animate-spin"></div>
            <h2 className="text-xl font-semibold">Verifying your payment...</h2>
            <p className="text-gray-500">Please wait a moment</p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center space-y-4">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
              <X className="h-10 w-10 text-red-500" />
            </div>
            <h2 className="text-xl font-semibold text-red-600">Payment Verification Failed</h2>
            <p className="text-gray-500">{error}</p>
            <div className="pt-6">
              <Button onClick={() => navigate('/')}>Return to Homepage</Button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center space-y-4">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle className="h-10 w-10 text-green-500" />
            </div>
            <h2 className="text-2xl font-bold text-green-600">Payment Successful!</h2>
            <p className="text-lg">Thank you for your purchase</p>
            
            <div className="border-t border-gray-200 w-full my-4 pt-4">
              <div className="flex justify-between">
                <span className="text-gray-600">Item:</span>
                <span className="font-medium">{paymentDetails?.description}</span>
              </div>
              <div className="flex justify-between mt-2">
                <span className="text-gray-600">Amount:</span>
                <span className="font-medium">₹{paymentDetails?.amount?.toLocaleString()}</span>
              </div>
              <div className="flex justify-between mt-2">
                <span className="text-gray-600">Reference:</span>
                <span className="font-medium">{paymentDetails?.reference_id}</span>
              </div>
            </div>
            
            <div className="bg-blue-50 p-4 rounded-lg w-full mt-4">
              <h3 className="font-medium text-blue-800">What's Next?</h3>
              <p className="text-sm text-blue-600 mt-1">
                We've created an account for you. Check your email for login instructions to access your membership benefits.
              </p>
            </div>
            
            <div className="pt-6">
              <Button onClick={() => navigate('/')}>Return to Homepage</Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentSuccessPage;
