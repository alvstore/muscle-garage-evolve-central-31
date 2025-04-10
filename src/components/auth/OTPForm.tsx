
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
// Updated import
import { mockMembers } from '@/data/mockData';

const OTPForm = ({ email, onVerified }: { email: string; onVerified: () => void }) => {
  const [otp, setOtp] = useState('');
  const [timeLeft, setTimeLeft] = useState(30);
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  
  useEffect(() => {
    if (timeLeft > 0) {
      const timerId = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
      return () => clearTimeout(timerId);
    }
  }, [timeLeft]);
  
  const handleOtpChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '');
    if (value.length <= 6) {
      setOtp(value);
    }
  };
  
  const verifyOtp = async () => {
    if (otp.length !== 6) {
      toast.error('Please enter a valid 6-digit OTP');
      return;
    }
    
    setIsLoading(true);
    
    try {
      // In a real app, this would make an API call to verify the OTP
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Check if a user with the provided email exists in mock data
      const userExists = mockMembers.some(user => user.email === email);
      
      if (userExists) {
        toast.success('OTP verified successfully');
        onVerified();
      } else {
        toast.error('Invalid OTP. Please try again.');
      }
    } catch (error) {
      toast.error('Failed to verify OTP. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  const resendOtp = async () => {
    setIsResending(true);
    
    try {
      // In a real app, this would make an API call to resend OTP
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setTimeLeft(30);
      toast.success('OTP has been resent to your email');
    } catch (error) {
      toast.error('Failed to resend OTP. Please try again.');
    } finally {
      setIsResending(false);
    }
  };
  
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">Enter OTP</h2>
      <p className="text-sm text-muted-foreground">
        We have sent a one-time password to {email}. Please enter it below to continue.
      </p>
      
      <div className="space-y-2">
        <Input
          type="text"
          placeholder="Enter 6-digit OTP"
          value={otp}
          onChange={handleOtpChange}
          className="text-center text-lg tracking-widest"
          maxLength={6}
          inputMode="numeric"
        />
        
        <div className="text-sm text-muted-foreground text-center">
          {timeLeft > 0 ? (
            <p>Resend OTP in {timeLeft} seconds</p>
          ) : (
            <button
              type="button"
              onClick={resendOtp}
              className="text-primary hover:underline"
              disabled={isResending}
            >
              {isResending ? 'Resending...' : 'Resend OTP'}
            </button>
          )}
        </div>
      </div>
      
      <Button
        className="w-full"
        onClick={verifyOtp}
        disabled={otp.length !== 6 || isLoading}
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Verifying
          </>
        ) : (
          'Verify OTP'
        )}
      </Button>
    </div>
  );
};

export default OTPForm;
