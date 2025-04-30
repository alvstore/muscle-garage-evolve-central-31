
import React from 'react';

const MembershipPricingPage = () => {
  const pricingPlans = [
    {
      name: 'Basic',
      price: '1,999',
      period: 'month',
      features: [
        'Access to gym floor',
        'Basic equipment use',
        'Locker room access',
        '2 Guest passes per month',
        'Online workout tracking'
      ],
      isPopular: false
    },
    {
      name: 'Premium',
      price: '3,499',
      period: 'month',
      features: [
        'Everything in Basic',
        'Group fitness classes',
        'Swimming pool access',
        '1 Free PT session per month',
        'Sauna & steam room access',
        'Nutrition consultation'
      ],
      isPopular: true
    },
    {
      name: 'Elite',
      price: '5,999',
      period: 'month',
      features: [
        'Everything in Premium',
        'Unlimited PT sessions',
        'All VIP amenities',
        '5 Guest passes per month',
        'Free merchandise',
        'Multi-branch access'
      ],
      isPopular: false
    }
  ];

  return (
    <div className="py-16 bg-gym-black">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gym-yellow mb-4">Membership Plans</h1>
          <p className="text-xl text-white max-w-3xl mx-auto">
            Choose the membership that fits your fitness goals and lifestyle. All plans include 24/7 access and free WiFi.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {pricingPlans.map((plan, index) => (
            <div 
              key={index} 
              className={`rounded-lg overflow-hidden shadow-lg ${
                plan.isPopular ? 'border-2 border-gym-yellow transform scale-105' : 'border border-gym-gray-700'
              } bg-gym-gray-900`}
            >
              {plan.isPopular && (
                <div className="bg-gym-yellow text-black text-center py-1 font-bold">
                  Most Popular
                </div>
              )}
              <div className="p-8">
                <h3 className="text-2xl font-bold text-gym-yellow mb-2">{plan.name}</h3>
                <div className="flex items-end mb-6">
                  <span className="text-4xl font-bold text-white">₹{plan.price}</span>
                  <span className="text-gym-gray-400 ml-2">per {plan.period}</span>
                </div>
                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-center">
                      <svg className="h-5 w-5 text-gym-yellow mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-white">{feature}</span>
                    </li>
                  ))}
                </ul>
                <button className={`w-full py-3 px-4 rounded font-bold ${
                  plan.isPopular 
                    ? 'bg-gym-yellow text-black hover:bg-yellow-400' 
                    : 'bg-gym-gray-800 text-white hover:bg-gym-gray-700'
                }`}>
                  Choose Plan
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <h2 className="text-2xl font-bold text-gym-yellow mb-4">Need Something Else?</h2>
          <p className="text-white mb-6">Contact us for custom plans, corporate memberships, or family discounts.</p>
          <button className="bg-transparent border-2 border-gym-yellow text-gym-yellow hover:bg-gym-yellow hover:text-black py-3 px-8 rounded-full font-bold transition duration-300">
            Contact Sales Team
          </button>
        </div>
      </div>
    </div>
  );
};

export default MembershipPricingPage;
