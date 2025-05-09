
import { useState, useEffect, useRef } from "react";
import { Check } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";

interface CheckoutFormData {
  name: string;
  email: string;
  phone: string;
}

const MembershipSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [planType, setPlanType] = useState<'gym' | 'pool' | 'pt'>('gym');
  const [selectedPlan, setSelectedPlan] = useState<any>(null);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [formData, setFormData] = useState<CheckoutFormData>({
    name: '',
    email: '',
    phone: ''
  });
  const { toast } = useToast();

  // Initialize Razorpay and Stripe objects
  useEffect(() => {
    // Load Razorpay SDK
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsVisible(true);
        observer.unobserve(entry.target);
      }
    }, {
      threshold: 0.1
    });
    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }
    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleBuyNow = (plan: any) => {
    setSelectedPlan(plan);
    setIsCheckoutOpen(true);
  };

  const handleCheckout = async () => {
    try {
      // Form validation
      if (!formData.name || !formData.email) {
        toast({
          title: "Missing information",
          description: "Please fill in all required fields.",
          variant: "destructive"
        });
        return;
      }

      // Email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        toast({
          title: "Invalid email",
          description: "Please enter a valid email address.",
          variant: "destructive"
        });
        return;
      }

      setIsProcessing(true);

      // Call the payment-checkout function
      const { data, error } = await supabase.functions.invoke('payment-checkout', {
        body: {
          planId: selectedPlan.id || crypto.randomUUID(), // Using dummy ID for demo
          email: formData.email,
          name: formData.name,
          phone: formData.phone || ''
        }
      });

      if (error) {
        throw new Error(error.message);
      }

      if (data.provider === 'razorpay') {
        // Initialize Razorpay checkout
        const options = {
          key: data.key_id,
          amount: data.amount,
          currency: data.currency,
          name: data.name,
          description: data.description,
          order_id: data.order_id,
          prefill: {
            name: data.prefill.name,
            email: data.prefill.email,
            contact: data.prefill.contact
          },
          handler: function(response: any) {
            // Payment successful
            toast({
              title: "Payment successful!",
              description: "Your membership has been activated.",
            });
            setIsCheckoutOpen(false);
          },
          modal: {
            ondismiss: function() {
              // Payment canceled
              setIsProcessing(false);
              toast({
                title: "Payment canceled",
                description: "You can try again later.",
              });
            }
          }
        };

        const razorpay = new (window as any).Razorpay(options);
        razorpay.open();
      } else if (data.provider === 'stripe') {
        // Redirect to Stripe Checkout
        window.location.href = data.url;
      } else {
        throw new Error("Unsupported payment provider");
      }
    } catch (error) {
      console.error('Checkout error:', error);
      toast({
        title: "Payment failed",
        description: error.message || "Something went wrong. Please try again.",
        variant: "destructive"
      });
      setIsProcessing(false);
    }
  };

  const gymPlans = [{
    name: "One Month",
    price: 5000,
    features: ["Full gym access", "Ice Bath", "Steam Bath", "Shower", "Locker access"]
  }, {
    name: "Three Months",
    price: 13500,
    popular: true,
    features: ["Full gym access", "Ice Bath", "Steam Bath", "Shower", "Locker access", "10% discount on quarterly plan"]
  }, {
    name: "Six Months",
    price: 20000,
    features: ["Full gym access", "Ice Bath", "Steam Bath", "Shower", "Locker access", "33% discount on half-yearly plan"]
  }, {
    name: "Annual",
    price: 30000,
    features: ["Full gym access", "Ice Bath", "Steam Bath", "Shower", "Locker access", "50% discount on yearly plan"]
  }];
  
  const poolPlans = [{
    name: "One Month",
    price: 2000,
    features: ["Pool access", "Coaching", "Shower", "Locker access"]
  }, {
    name: "Three Months",
    price: 5000,
    popular: true,
    features: ["Pool access", "Coaching", "Shower", "Locker access", "17% discount on quarterly plan"]
  }, {
    name: "Six Months",
    price: 7000,
    features: ["Pool access", "Coaching", "Shower", "Locker access", "42% discount on half-yearly plan"]
  }, {
    name: "Annual",
    price: 10000,
    features: ["Pool access", "Coaching", "Shower", "Locker access", "58% discount on yearly plan"]
  }];
  
  const ptPlans = [{
    name: "Level One - One Month",
    price: 10000,
    features: ["Personalized training plan", "1-on-1 coaching", "Nutritional guidance", "Progress tracking"]
  }, {
    name: "Level One - Three Months",
    price: 27000,
    popular: true,
    features: ["Personalized training plan", "1-on-1 coaching", "Nutritional guidance", "Progress tracking", "10% discount on quarterly plan"]
  }, {
    name: "Level Two - One Month",
    price: 20000,
    features: ["Advanced personalized training", "Premium 1-on-1 coaching", "Comprehensive nutritional plan", "Detailed progress analytics", "Recovery guidance"]
  }, {
    name: "Level Two - Three Months",
    price: 50000,
    features: ["Advanced personalized training", "Premium 1-on-1 coaching", "Comprehensive nutritional plan", "Detailed progress analytics", "Recovery guidance", "17% discount on quarterly plan"]
  }];
  
  const activePlans = planType === 'gym' ? gymPlans : planType === 'pool' ? poolPlans : ptPlans;
  
  return (
    <>
      <section id="membership" ref={sectionRef} className="section-padding bg-gym-black">
        <div className="gym-container">
          <div className={`text-center max-w-3xl mx-auto mb-12 ${isVisible ? 'animate-fade-in' : 'opacity-0'}`}>
            <h2 className="text-3xl md:text-5xl font-impact mb-4 text-white">
              MEMBERSHIP <span className="text-gym-yellow">PLANS</span>
            </h2>
            <p className="text-gray-300 mb-8">
              Choose the plan that fits your fitness journey and budget. All plans include access to our premium facilities.
            </p>

            {/* Plan type toggle */}
            <div className="flex justify-center items-center space-x-4 mb-8 flex-wrap gap-4">
              <button onClick={() => setPlanType('gym')} className={`px-6 py-3 rounded-md transition-all ${planType === 'gym' ? 'bg-gym-yellow text-gym-black font-bold' : 'bg-gym-gray-800 text-white hover:bg-gym-gray-700'}`}>
                Gym Plans
              </button>
              <button onClick={() => setPlanType('pool')} className={`px-6 py-3 rounded-md transition-all ${planType === 'pool' ? 'bg-gym-yellow text-gym-black font-bold' : 'bg-gym-gray-800 text-white hover:bg-gym-gray-700'}`}>
                Pool Plans
              </button>
              <button onClick={() => setPlanType('pt')} className={`px-6 py-3 rounded-md transition-all ${planType === 'pt' ? 'bg-gym-yellow text-gym-black font-bold' : 'bg-gym-gray-800 text-white hover:bg-gym-gray-700'}`}>
                Personal Training
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8">
            {activePlans.map((plan, index) => (
              <div 
                key={`${planType}-${plan.name}`} 
                className={`relative rounded-lg overflow-hidden transition-all duration-500 ${isVisible ? 'animate-fade-in' : 'opacity-0'} ${plan.popular ? 'border-2 border-gym-yellow' : 'border border-gym-gray-700'}`} 
                style={{
                  animationDelay: `${index * 0.2}s`
                }}
              >
                {plan.popular && (
                  <div className="absolute top-0 right-0 bg-gym-yellow text-gym-black py-1 px-4 font-bold">
                    Popular
                  </div>
                )}
                
                <div className="p-6 bg-gym-gray-800">
                  <h3 className="text-xl font-impact mb-2 text-white">{plan.name}</h3>
                  
                  <div className="flex items-end mb-4">
                    <span className="text-4xl font-bold text-white">₹{plan.price.toLocaleString()}</span>
                    <span className="text-gray-400 ml-2">
                      /{plan.name.toLowerCase().includes('month') ? 'plan' : 'plan'}
                    </span>
                  </div>
                  
                  <button 
                    onClick={() => handleBuyNow(plan)}
                    className="block w-full py-3 px-4 text-center font-bold bg-gym-yellow text-gym-black rounded-md hover:bg-yellow-400 transition-colors mb-6"
                  >
                    Buy Now
                  </button>

                  <ul className="space-y-2">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center">
                        <Check className="text-gym-yellow mr-2 h-5 w-5 flex-shrink-0" />
                        <span className="text-white">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Checkout Dialog */}
      <Dialog open={isCheckoutOpen} onOpenChange={setIsCheckoutOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Complete Your Purchase</DialogTitle>
            <DialogDescription>
              Enter your details to purchase the {selectedPlan?.name} plan for ₹{selectedPlan?.price?.toLocaleString()}.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2 pb-4">
            <div className="space-y-2">
              <h2 className="text-xl font-semibold">Complete Your Purchase</h2>
              <p className="text-sm text-muted-foreground">
                Enter your details to purchase the {selectedPlan?.name} plan for ₹{selectedPlan?.price?.toLocaleString()}.
              </p>
            </div>
            
            <div className="space-y-4 pt-4">
              <div className="grid w-full items-center gap-1.5">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  name="name"
                  placeholder="Your full name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="grid w-full items-center gap-1.5">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="your.email@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="grid w-full items-center gap-1.5">
                <Label htmlFor="phone">Phone (optional)</Label>
                <Input
                  id="phone"
                  name="phone"
                  placeholder="Your phone number"
                  value={formData.phone}
                  onChange={handleChange}
                />
              </div>
            </div>
            
            <div className="flex justify-end gap-2 pt-4">
              <Button 
                variant="outline" 
                onClick={() => setIsCheckoutOpen(false)}
                disabled={isProcessing}
              >
                Cancel
              </Button>
              <Button 
                onClick={handleCheckout}
                disabled={isProcessing}
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  `Pay ₹${selectedPlan?.price?.toLocaleString() || 0}`
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default MembershipSection;
