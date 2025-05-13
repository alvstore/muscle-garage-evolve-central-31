
import React from 'react';
import { Button } from '@/components/ui/button';

const pricingPlans = [
  {
    name: 'Basic',
    price: '$29',
    description: 'Perfect for beginners',
    features: ['Access to gym equipment', 'Locker access', 'Fitness assessment'],
    highlighted: false
  },
  {
    name: 'Pro',
    price: '$59',
    description: 'Most popular choice',
    features: ['Basic features', 'Group classes', 'Personalized workout plan', 'Nutrition consultation'],
    highlighted: true
  },
  {
    name: 'Elite',
    price: '$99',
    description: 'For serious athletes',
    features: ['Pro features', 'Personal training sessions', '24/7 access', 'Recovery facilities', 'Priority booking'],
    highlighted: false
  }
];

const PricingSection: React.FC = () => {
  return (
    <section id="pricing" className="py-16 bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Membership Plans</h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Choose the perfect plan for your fitness journey
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {pricingPlans.map((plan) => (
            <div 
              key={plan.name}
              className={`rounded-lg overflow-hidden shadow-lg transition-transform hover:scale-105 ${
                plan.highlighted 
                  ? 'border-2 border-primary bg-white dark:bg-gray-800' 
                  : 'bg-white dark:bg-gray-800'
              }`}
            >
              <div className="p-6 md:p-8">
                <h3 className="text-xl md:text-2xl font-bold mb-2">{plan.name}</h3>
                <div className="text-3xl md:text-4xl font-bold mb-4">{plan.price}<span className="text-sm text-gray-500">/month</span></div>
                <p className="text-gray-600 dark:text-gray-400 mb-6">{plan.description}</p>
                
                <ul className="mb-8 space-y-2">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-center">
                      <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>
                
                <Button 
                  className={`w-full ${plan.highlighted ? 'bg-primary hover:bg-primary/90' : ''}`}
                  variant={plan.highlighted ? 'default' : 'outline'}
                >
                  Choose Plan
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
