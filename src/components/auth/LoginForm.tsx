
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Checkbox } from '@/components/ui/checkbox';
import Logo from '@/components/Logo';
import { useAuth } from '@/hooks/use-auth';
import { toast } from 'sonner';

// Note: In a production environment, authentication would be handled by a backend service

const loginSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email address' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters' }),
  rememberMe: z.boolean().optional(),
});

type LoginFormValues = z.infer<typeof loginSchema>;

const LoginForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
      rememberMe: false,
    },
  });

  const onSubmit = async (values: LoginFormValues) => {
    setIsLoading(true);
    
    try {
      // For demo purposes, we'll simulate a successful login
      // In production, this would call your actual authentication API
      const { email, password } = values;
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Call the login function from AuthContext
      await login(email, password);
      
      toast.success('Logged in successfully');
      navigate('/dashboard');
    } catch (error) {
      console.error('Login error:', error);
      toast.error("Login failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gym-black">
      {/* Left side - Image */}
      <div 
        className="hidden lg:flex lg:w-1/2 bg-cover bg-center" 
        style={{ 
          backgroundImage: "url('/lovable-uploads/b9ef8aff-1fdd-46f9-84f1-c0d87249ed93.png')",
          backgroundSize: 'cover',
          position: 'relative'
        }}
      >
        <div className="absolute inset-0 bg-gym-black opacity-80"></div>
        <div className="relative z-10 flex flex-col justify-center items-center w-full p-12 text-white">
          <div className="mb-8">
            <Logo variant="white" size="lg" />
          </div>
          <h1 className="text-4xl font-bold mb-6">Welcome to Muscle Garage</h1>
          <p className="text-xl max-w-md text-center">
            Your one-stop destination for fitness management and tracking your progress.
          </p>
          
          <div className="mt-12 bg-white/10 p-6 rounded-lg backdrop-blur-sm">
            <h3 className="text-xl font-semibold mb-3">Why Join Us?</h3>
            <ul className="space-y-2">
              <li className="flex items-center">
                <div className="w-2 h-2 rounded-full bg-white mr-2"></div>
                <span>Personalized fitness plans</span>
              </li>
              <li className="flex items-center">
                <div className="w-2 h-2 rounded-full bg-white mr-2"></div>
                <span>Expert trainers & nutritionists</span>
              </li>
              <li className="flex items-center">
                <div className="w-2 h-2 rounded-full bg-white mr-2"></div>
                <span>State-of-the-art equipment</span>
              </li>
              <li className="flex items-center">
                <div className="w-2 h-2 rounded-full bg-white mr-2"></div>
                <span>Group classes & personal training</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
      
      {/* Right side - Login Form */}
      <div className="w-full lg:w-1/2 flex justify-center items-center p-8 bg-gym-black text-white">
        <div className="w-full max-w-md">
          <div className="mb-8 text-center">
            <div className="lg:hidden mb-6">
              <Logo />
            </div>
            <h1 className="text-3xl font-bold text-white">Sign In</h1>
            <p className="text-gray-400 mt-2">Enter your credentials to access your account</p>
          </div>
          

          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white">Email</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="example@example.com"
                        type="email"
                        autoComplete="email"
                        className="h-12"
                        disabled={isLoading}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex justify-between items-center">
                      <FormLabel className="text-white">Password</FormLabel>
                    </div>
                    <FormControl>
                      <div className="relative">
                        <Input
                          placeholder="••••••••"
                          type={showPassword ? 'text' : 'password'}
                          autoComplete="current-password"
                          className="h-12"
                          disabled={isLoading}
                          {...field}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                        >
                          {showPassword ? (
                            <EyeOff className="h-5 w-5" />
                          ) : (
                            <Eye className="h-5 w-5" />
                          )}
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="flex items-center justify-between">
                <FormField
                  control={form.control}
                  name="rememberMe"
                  render={({ field }) => (
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="rememberMe" 
                        checked={field.value} 
                        onCheckedChange={field.onChange}
                      />
                      <label htmlFor="rememberMe" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                        Remember me
                      </label>
                    </div>
                  )}
                />
                <div className="text-center mt-6">
                  <a href="#" className="text-gym-yellow hover:text-gym-yellow-hover text-sm">
                    Forgot your password?
                  </a>
                </div>
              </div>
              
              <Button 
                type="submit" 
                className="w-full h-12 bg-gym-yellow text-gym-black hover:bg-gym-yellow-hover" 
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> 
                    Signing in...
                  </>
                ) : (
                  "Sign In"
                )}
              </Button>
            </form>
          </Form>
          
          <div className="mt-6 text-center">
            <div className="text-sm text-gray-600">
              New on our platform? {' '}
              <Button variant="link" className="p-0 h-auto font-normal text-indigo-600" type="button">
                Create an account
              </Button>
            </div>
            
            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">or sign in with</span>
                </div>
              </div>
              
              <div className="mt-6 flex justify-center gap-4">
                <Button variant="outline" size="icon" className="rounded-full">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 text-blue-600"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
                </Button>
                <Button variant="outline" size="icon" className="rounded-full">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 text-blue-400"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path></svg>
                </Button>
                <Button variant="outline" size="icon" className="rounded-full">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 text-blue-800"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"></line></svg>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
