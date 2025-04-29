
import { useState, useEffect, useRef } from "react";
import { Check } from "lucide-react";

const PricingSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'annual'>('monthly');

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      {
        threshold: 0.1,
      }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  const pricingPlans = [
    {
      name: "Basic",
      monthlyPrice: 999,
      annualPrice: 8990,
      tagline: "For beginners",
      features: [
        "Full gym access",
        "Basic workout plan",
        "Locker access",
        "1 Fitness assessment",
      ],
      recommended: false
    },
    {
      name: "Premium",
      monthlyPrice: 1999,
      annualPrice: 19990,
      tagline: "Most popular choice",
      features: [
        "Full gym access",
        "Custom workout plan",
        "Locker access",
        "Monthly fitness assessment",
        "1 PT session per week",
        "Group classes access"
      ],
      recommended: true
    },
    {
      name: "Elite",
      monthlyPrice: 2999,
      annualPrice: 29990,
      tagline: "For serious athletes",
      features: [
        "Full gym access 24/7",
        "Custom workout & nutrition plan",
        "Premium locker",
        "Weekly fitness assessment",
        "3 PT sessions per week",
        "Unlimited group classes",
        "Access to swimming pool & spa"
      ],
      recommended: false
    }
  ];

  return (
    <section id="pricing" ref={sectionRef} className="section-padding bg-gym-black">
      <div className="gym-container">
        <div className={`text-center max-w-3xl mx-auto mb-12 ${isVisible ? 'animate-fade-in' : 'opacity-0'}`}>
          <h2 className="text-3xl md:text-5xl font-impact mb-4">
            MEMBERSHIP <span className="text-gym-yellow">PLANS</span>
          </h2>
          <p className="text-gray-300">
            Choose the membership plan that fits your fitness goals and budget.
            Join today and start your fitness journey with us!
          </p>
          
          <div className="mt-8 inline-flex items-center p-1 bg-gym-gray-800 rounded-full">
            <button
              onClick={() => setBillingPeriod('monthly')}
              className={`py-2 px-4 rounded-full transition-all ${
                billingPeriod === 'monthly'
                  ? 'bg-gym-yellow text-gym-black'
                  : 'text-gray-400'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingPeriod('annual')}
              className={`py-2 px-4 rounded-full transition-all ${
                billingPeriod === 'annual'
                  ? 'bg-gym-yellow text-gym-black'
                  : 'text-gray-400'
              }`}
            >
              Annual <span className="text-xs font-bold ml-1">SAVE 25%</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {pricingPlans.map((plan, index) => (
            <div
              key={plan.name}
              className={`
                relative
                ${plan.recommended ? 'transform -translate-y-4 scale-105 z-10' : ''} 
                ${isVisible ? 'animate-fade-in' : 'opacity-0'}
                bg-gym-gray-800 rounded-lg overflow-hidden transition-all duration-500 hover:shadow-xl hover:transform hover:-translate-y-2
              `}
              style={{ 
                animationDelay: `${index * 0.2}s` 
              }}
            >
              {plan.recommended && (
                <div className="absolute top-0 right-0 bg-gym-yellow text-gym-black py-1 px-4 font-bold text-sm">
                  RECOMMENDED
                </div>
              )}
              
              <div className="p-8">
                <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                <p className="text-gray-400 mb-6">{plan.tagline}</p>
                
                <div className="mb-8">
                  <p className="text-4xl font-bold">
                    <span className="text-gym-yellow">₹{billingPeriod === 'monthly' ? plan.monthlyPrice : plan.annualPrice}</span>
                    <span className="text-base text-gray-400">
                      {billingPeriod === 'monthly' ? '/mo' : '/year'}
                    </span>
                  </p>
                  {billingPeriod === 'annual' && (
                    <p className="text-sm text-gym-yellow mt-1">Save ₹{(plan.monthlyPrice * 12) - plan.annualPrice} annually</p>
                  )}
                </div>
                
                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center">
                      <Check size={18} className="text-gym-yellow mr-2" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <button className={`w-full py-3 px-6 rounded-full font-bold transition-colors ${
                  plan.recommended 
                    ? 'bg-gym-yellow text-gym-black hover:bg-white' 
                    : 'bg-gym-gray-700 text-white hover:bg-gym-yellow hover:text-gym-black'
                }`}>
                  Choose Plan
                </button>
              </div>
            </div>
          ))}
        </div>
        
        <div className={`mt-12 text-center max-w-2xl mx-auto ${isVisible ? 'animate-fade-in' : 'opacity-0'}`} style={{ animationDelay: '0.6s' }}>
          <p className="text-gray-400 mb-4">
            All plans include access to basic gym facilities. Cancellation policy applies.
            Prices subject to GST. Please contact us for corporate membership options.
          </p>
          <button className="text-gym-yellow hover:underline">View Full Membership Details</button>
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
