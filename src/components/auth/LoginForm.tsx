
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { mockUsers } from "@/data/mockData";
import Logo from "@/components/Logo";
import { toast } from "sonner";
import OTPForm from "./OTPForm";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [useOTP, setUseOTP] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Simulate API call
    setTimeout(() => {
      const user = mockUsers.find((user) => user.email === email);

      if (user && password === "password") {
        // Store user in localStorage (in a real app, you'd store a token)
        localStorage.setItem("user", JSON.stringify(user));
        navigate("/dashboard");
        toast.success("Login successful!");
      } else {
        toast.error("Invalid email or password. Try using one of the mock user emails with 'password'.");
      }
      setLoading(false);
    }, 1000);
  };

  const handleRequestOTP = () => {
    const user = mockUsers.find((user) => user.email === email);
    
    if (!user) {
      toast.error("Email not found. Please use one of the demo email addresses.");
      return;
    }
    
    toast.success("OTP sent to your email (for demo, use 123456)");
    setUseOTP(true);
  };

  if (useOTP) {
    return <OTPForm email={email} onBack={() => setUseOTP(false)} />;
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="space-y-1 flex flex-col items-center justify-center">
        <div className="mb-2">
          <Logo size="lg" />
        </div>
        <CardTitle className="text-2xl font-bold">Welcome back</CardTitle>
        <CardDescription>
          Enter your credentials to access your account
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="name@example.com"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Password</Label>
              <Button variant="link" className="px-0" type="button">
                Forgot password?
              </Button>
            </div>
            <Input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          
          <div className="text-sm text-muted-foreground">
            <p>Demo login credentials:</p>
            <ul className="list-disc list-inside">
              <li>Admin: admin@musclegarage.com</li>
              <li>Staff: staff@musclegarage.com</li>
              <li>Trainer: trainer@musclegarage.com</li>
              <li>Member: member@example.com</li>
            </ul>
            <p className="mt-1">Password: "password" for all users</p>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col space-y-2">
          <Button className="w-full" type="submit" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </Button>
          <div className="relative w-full">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">Or</span>
            </div>
          </div>
          <Button 
            type="button" 
            variant="outline" 
            className="w-full"
            onClick={handleRequestOTP}
            disabled={!email}
          >
            Login with OTP
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default LoginForm;
