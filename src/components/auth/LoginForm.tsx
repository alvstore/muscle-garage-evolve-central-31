import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AlertCircle, Mail, Lock, ArrowLeft } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { z } from "zod";
import { toast } from 'sonner';
import { motion } from "framer-motion";
import GymEquipment3D from "@/components/website/GymEquipment3D";
import { useAuthActions } from "@/hooks/auth/use-auth-actions";

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters")
});

const LoginForm = () => {
  const navigate = useNavigate();
  const { login, isLoading } = useAuthActions();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<{
    email?: string;
    password?: string;
  }>({});
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  
  // Add effect to monitor online status
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
  
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
  
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const validateForm = () => {
    try {
      loginSchema.parse({
        email,
        password
      });
      setValidationErrors({});
      return true;
    } catch (err) {
      if (err instanceof z.ZodError) {
        const errors: {
          email?: string;
          password?: string;
        } = {};
        err.errors.forEach(error => {
          const path = error.path[0] as string;
          errors[path as 'email' | 'password'] = error.message;
        });
        setValidationErrors(errors);
      }
      return false;
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!validateForm()) return;
  
    if (!isOnline) {
      setError('You are currently offline. Please check your internet connection and try again.');
      toast.error('No internet connection');
      return;
    }
  
    try {
      const result = await login(email, password);
      if (!result.error) {
        toast.success("Login successful");
        // Login is successful - navigation will be handled by the Login page component
      } else {
        setError(result.error || "Login failed. Please check your credentials.");
        toast.error(result.error || "Login failed");
      }
    } catch (error: any) {
      console.error("Login error:", error);
      setError(error.message || "Failed to login. Please try again.");
      toast.error("Login error: " + (error.message || "Unknown error"));
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-4 sm:p-6 md:p-8 relative overflow-hidden bg-gradient-to-br from-gray-900 to-black">
      {/* 3D Gym Equipment Background */}
      <div className="absolute top-20 right-10 w-40 h-40 opacity-30 hidden md:block">
        <GymEquipment3D type="dumbbell" rotationSpeed={0.5} />
      </div>
      <div className="absolute bottom-40 left-10 w-32 h-32 opacity-30 hidden md:block">
        <GymEquipment3D type="kettlebell" rotationSpeed={0.3} />
      </div>
      <div className="absolute top-1/3 left-1/4 w-24 h-24 opacity-20 hidden lg:block">
        <GymEquipment3D type="barbell" rotationSpeed={0.2} />
      </div>
      <div className="absolute bottom-1/4 right-1/4 w-28 h-28 opacity-20 hidden lg:block">
        <GymEquipment3D type="proteinShake" rotationSpeed={0.4} />
      </div>
      
      {/* Overlay gradient */}
      <div className="absolute inset-0 bg-gradient-radial from-transparent to-black opacity-80"></div>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md relative z-10"
      >
        <Card className="overflow-hidden shadow-2xl rounded-xl border-0 backdrop-blur-sm bg-white/10 dark:bg-gray-900/50">
          <div className="relative p-6 sm:p-8">
            {/* Logo or Brand */}
            <div className="mb-8 text-center">
              <motion.div 
                className="mx-auto w-20 h-20 bg-gradient-to-br from-yellow-500 to-yellow-300 rounded-full flex items-center justify-center mb-4 shadow-lg"
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{ 
                  type: "spring", 
                  stiffness: 260, 
                  damping: 20,
                  delay: 0.2 
                }}
              >
                <span className="text-3xl font-bold text-white">MG</span>
              </motion.div>
              <motion.h2 
                className="text-2xl sm:text-3xl font-bold tracking-tight text-white dark:text-white"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                Welcome Back
              </motion.h2>
              <motion.p 
                className="mt-2 text-center text-sm text-gray-300 dark:text-gray-400"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                Sign in to access your account
              </motion.p>
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                transition={{ duration: 0.3 }}
              >
                <Alert variant="destructive" className="mb-6 bg-red-500/10 border-red-500/20 text-red-200">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              </motion.div>
            )}

            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-200 dark:text-gray-300 mb-1">
                    Email address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-gray-400" />
                    </div>
                    <Input 
                      id="email" 
                      name="email" 
                      type="email" 
                      autoComplete="email" 
                      required 
                      value={email} 
                      onChange={e => setEmail(e.target.value)} 
                      className={`pl-10 bg-white/10 border-gray-700 text-white placeholder:text-gray-500 ${validationErrors.email ? 'border-red-500 focus:ring-red-500' : 'focus:border-yellow-500 focus:ring-yellow-500'}`} 
                      placeholder="you@example.com" 
                    />
                  </div>
                  {validationErrors.email && (
                    <motion.p 
                      initial={{ opacity: 0 }} 
                      animate={{ opacity: 1 }} 
                      className="mt-1 text-sm text-red-400"
                    >
                      {validationErrors.email}
                    </motion.p>
                  )}
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label htmlFor="password" className="block text-sm font-medium text-gray-200 dark:text-gray-300">
                      Password
                    </label>
                    <Link 
                      to="/forgot-password" 
                      className="text-xs font-medium text-yellow-400 hover:text-yellow-300 dark:text-yellow-400 transition-colors"
                    >
                      Forgot password?
                    </Link>
                  </div>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-gray-400" />
                    </div>
                    <Input 
                      id="password" 
                      name="password" 
                      type="password"
                      autoComplete="current-password"
                      required
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      className={`pl-10 bg-white/10 border-gray-700 text-white placeholder:text-gray-500 ${validationErrors.password ? 'border-red-500 focus:ring-red-500' : 'focus:border-yellow-500 focus:ring-yellow-500'}`}
                      placeholder="••••••••"
                    />
                  </div>
                  {validationErrors.password && (
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="mt-1 text-sm text-red-400"
                    >
                      {validationErrors.password}
                    </motion.p>
                  )}
                </div>
              </div>

              <Button
                type="submit"
                className="w-full bg-yellow-500 hover:bg-yellow-600 text-white font-medium focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 focus:ring-offset-gray-900"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-b-transparent"></div>
                    Signing in...
                  </>
                ) : "Sign in"}
              </Button>

              <p className="text-center text-sm text-gray-400 mt-6">
                Don't have an account?{' '}
                <Link
                  to="/register"
                  className="text-yellow-400 hover:text-yellow-300 dark:text-yellow-400 font-medium"
                >
                  Create one now
                </Link>
              </p>
            </form>

            <div className="mt-8 pt-6 border-t border-gray-700/30 text-center">
              <Link
                to="/"
                className="inline-flex items-center text-sm text-gray-400 hover:text-yellow-400 transition-colors"
              >
                <ArrowLeft className="mr-1 h-4 w-4" />
                Back to home
              </Link>
            </div>
          </div>
        </Card>
      </motion.div>
    </div>
  );
};

export default LoginForm;
