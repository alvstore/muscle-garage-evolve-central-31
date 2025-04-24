
import React from 'react';
import { Check } from 'lucide-react';

const MembershipSection: React.FC = () => {
  const memberships = [
    {
      name: "Basic",
      price: 999,
      duration: "Monthly",
      features: [
        "Gym Access",
        "Basic Equipment",
        "Locker Access",
        "2 Group Classes/Month",
      ],
      highlight: false
    },
    {
      name: "Pro",
      price: 1999,
      duration: "Monthly",
      features: [
        "Full Gym Access",
        "All Equipment",
        "Locker Access",
        "Unlimited Group Classes",
        "1 PT Session/Month",
        "Nutrition Guidance"
      ],
      highlight: true
    },
    {
      name: "Elite",
      price: 3999,
      duration: "Monthly",
      features: [
        "24/7 Gym Access",
        "All Premium Equipment",
        "Private Locker",
        "Unlimited Classes",
        "4 PT Sessions/Month",
        "Nutrition Plan",
        "Fitness Assessment",
        "Steam & Sauna"
      ],
      highlight: false
    }
  ];

  return (
    <section id="memberships" className="section-padding bg-gym-gray-800">
      <div className="gym-container">
        <div className="text-center max-w-3xl mx-auto mb-12 animate-fade-in">
          <h2 className="text-3xl md:text-5xl font-impact mb-4">
            MEMBERSHIP <span className="text-gym-yellow">PLANS</span>
          </h2>
          <p className="text-gray-300">
            Choose the perfect plan that suits your fitness goals and budget
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {memberships.map((plan, index) => (
            <div 
              key={index}
              className={`animate-fade-in rounded-lg overflow-hidden ${
                plan.highlight 
                  ? 'bg-gym-yellow text-black ring-4 ring-white transform scale-105' 
                  : 'bg-gym-gray-900 text-white'
              }`}
              style={{ animationDelay: `${0.2 * index}s` }}
            >
              <div className="p-6">
                <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                <div className="flex items-end mb-4">
                  <span className="text-4xl font-bold">₹{plan.price}</span>
                  <span className="text-sm ml-1">/{plan.duration}</span>
                </div>
                <ul className="space-y-3">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-center">
                      <Check className={`h-5 w-5 mr-2 ${plan.highlight ? 'text-black' : 'text-gym-yellow'}`} />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="p-6 pt-0">
                <button 
                  className={`w-full py-3 rounded-md font-bold ${
                    plan.highlight 
                      ? 'bg-black text-white hover:bg-opacity-80' 
                      : 'bg-gym-yellow text-black hover:bg-gym-yellow-dark'
                  }`}
                >
                  Choose Plan
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default MembershipSection;
