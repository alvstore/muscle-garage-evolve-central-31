
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { mockUsers } from "@/data/mockData";
import Logo from "@/components/Logo";
import { toast } from "sonner";

interface OTPFormProps {
  email: string;
  onBack: () => void;
}

const OTPForm = ({ email, onBack }: OTPFormProps) => {
  const [otp, setOTP] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Simulate API call
    setTimeout(() => {
      const user = mockUsers.find((user) => user.email === email);

      if (user && otp === "123456") {
        // Store user in localStorage
        localStorage.setItem("user", JSON.stringify(user));
        navigate("/dashboard");
        toast.success("Login successful!");
      } else {
        toast.error("Invalid OTP. For demo purposes, use 123456.");
      }
      setLoading(false);
    }, 1000);
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="space-y-1 flex flex-col items-center justify-center">
        <div className="mb-2">
          <Logo size="lg" />
        </div>
        <CardTitle className="text-2xl font-bold">OTP Verification</CardTitle>
        <CardDescription>
          Enter the 6-digit code sent to {email}
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="flex justify-center py-4">
            <InputOTP
              maxLength={6}
              value={otp}
              onChange={(value) => setOTP(value)}
              render={({ slots }) => (
                <InputOTPGroup>
                  {slots.map((slot, index) => (
                    <InputOTPSlot key={index} {...slot} index={index} />
                  ))}
                </InputOTPGroup>
              )}
            />
          </div>
          
          <p className="text-sm text-center text-muted-foreground">
            Demo OTP: 123456
          </p>
        </CardContent>
        <CardFooter className="flex flex-col space-y-2">
          <Button className="w-full" type="submit" disabled={loading}>
            {loading ? "Verifying..." : "Verify & Login"}
          </Button>
          <Button
            variant="ghost" 
            type="button" 
            className="w-full"
            onClick={onBack}
          >
            Back to Login
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default OTPForm;
