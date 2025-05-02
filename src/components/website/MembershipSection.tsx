import { useState, useEffect, useRef } from "react";
import { Check } from "lucide-react";
const MembershipSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [planType, setPlanType] = useState<'gym' | 'pool' | 'pt'>('gym');
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
  return <section id="membership" ref={sectionRef} className="section-padding bg-gym-black">
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
          {activePlans.map((plan, index) => <div key={`${planType}-${plan.name}`} className={`relative rounded-lg overflow-hidden transition-all duration-500 ${isVisible ? 'animate-fade-in' : 'opacity-0'} ${plan.popular ? 'border-2 border-gym-yellow' : 'border border-gym-gray-700'}`} style={{
          animationDelay: `${index * 0.2}s`
        }}>
              {plan.popular && <div className="absolute top-0 right-0 bg-gym-yellow text-gym-black py-1 px-4 font-bold">
                  Popular
                </div>}
              
              <div className="p-6 bg-gym-gray-800">
                <h3 className="text-xl font-impact mb-2">{plan.name}</h3>
                
                <div className="flex items-end mb-4">
                  <span className="text-4xl font-bold">₹{plan.price.toLocaleString()}</span>
                  <span className="text-gray-400 ml-2">
                    /{plan.name.toLowerCase().includes('month') ? 'plan' : 'plan'}
                  </span>
                </div>
                
                <a href="#contact" className="btn btn-primary w-full mb-6">
                  Get Your Pass
                </a>

                <ul className="space-y-2">
                  {plan.features.map((feature, idx) => <li key={idx} className="flex items-center">
                      <Check className="text-gym-yellow mr-2 h-5 w-5 flex-shrink-0" />
                      <span>{feature}</span>
                    </li>)}
                </ul>
              </div>
            </div>)}
        </div>
      </div>
    </section>;
};
export default MembershipSection;