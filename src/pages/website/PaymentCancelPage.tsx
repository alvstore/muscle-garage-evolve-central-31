
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';

const PaymentCancelPage = () => {
  const navigate = useNavigate();
  
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-6 text-center">
        <div className="flex flex-col items-center justify-center space-y-4">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
            <X className="h-10 w-10 text-red-500" />
          </div>
          <h2 className="text-xl font-semibold text-red-600">Payment Cancelled</h2>
          <p className="text-gray-500">Your payment process was cancelled.</p>
          <div className="pt-6 space-y-2">
            <Button onClick={() => navigate('/membership')}>Try Again</Button>
            <Button variant="outline" onClick={() => navigate('/')}>
              Return to Homepage
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentCancelPage;
