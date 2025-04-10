
import React, { useState } from 'react';
import { Check } from 'lucide-react';
import { Link } from 'react-router-dom';

interface PlanProps {
  title: string;
  price: string;
  features: string[];
  discount?: string;
  isPopular?: boolean;
}

const PlanCard = ({ title, price, features, discount, isPopular = false }: PlanProps) => {
  return (
    <div className={`relative overflow-hidden ${isPopular ? 'border-l-4 border-l-yellow-500' : ''}`}>
      {isPopular && (
        <div className="absolute top-0 right-0 bg-yellow-500 text-black font-bold px-4 py-1">
          Popular
        </div>
      )}
      <div className="bg-gray-800 p-8 h-full flex flex-col">
        <h3 className="text-2xl font-bold mb-3">{title}</h3>
        <div className="mb-6">
          <span className="text-4xl font-bold text-white">₹{price}</span>
          <span className="text-gray-400 ml-1">/plan</span>
        </div>
        <Link to="/join-now" className="inline-block bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-3 px-4 rounded-md transition-colors mb-6 text-center">
          Get Your Pass
        </Link>
        <ul className="flex-1 space-y-4">
          {features.map((feature, index) => (
            <li key={index} className="flex items-start gap-2">
              <Check className="h-5 w-5 text-yellow-500 flex-shrink-0 mt-0.5" />
              <span className="text-gray-300">{feature}</span>
            </li>
          ))}
          {discount && (
            <li className="flex items-start gap-2">
              <Check className="h-5 w-5 text-yellow-500 flex-shrink-0 mt-0.5" />
              <span className="text-gray-300">{discount}</span>
            </li>
          )}
        </ul>
      </div>
    </div>
  );
};

const MembershipSection = () => {
  const [activeTab, setActiveTab] = useState('gym');

  return (
    <section id="membership" className="py-20 bg-black">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-4xl font-bold mb-2">MEMBERSHIP <span className="text-yellow-500">PLANS</span></h2>
          <p className="text-lg text-gray-300 mt-4">Choose the plan that fits your fitness journey and budget. All plans include access to our premium facilities.</p>
        </div>
        
        <div className="flex justify-center mb-10">
          <div className="inline-flex rounded-md shadow-sm" role="group">
            <button
              onClick={() => setActiveTab('gym')}
              className={`px-6 py-3 text-sm font-medium rounded-l-lg ${activeTab === 'gym' ? 'bg-yellow-500 text-black' : 'bg-gray-800 text-white hover:bg-gray-700'}`}
            >
              Gym Plans
            </button>
            <button
              onClick={() => setActiveTab('pool')}
              className={`px-6 py-3 text-sm font-medium ${activeTab === 'pool' ? 'bg-yellow-500 text-black' : 'bg-gray-800 text-white hover:bg-gray-700'}`}
            >
              Pool Plans
            </button>
            <button
              onClick={() => setActiveTab('pt')}
              className={`px-6 py-3 text-sm font-medium rounded-r-lg ${activeTab === 'pt' ? 'bg-yellow-500 text-black' : 'bg-gray-800 text-white hover:bg-gray-700'}`}
            >
              Personal Training
            </button>
          </div>
        </div>
        
        {activeTab === 'gym' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <PlanCard
              title="One Month"
              price="5,000"
              features={[
                "Full gym access",
                "Ice Bath",
                "Steam Bath",
                "Shower",
                "Locker access"
              ]}
            />
            <PlanCard
              title="Three Months"
              price="13,500"
              features={[
                "Full gym access",
                "Ice Bath",
                "Steam Bath",
                "Shower",
                "Locker access"
              ]}
              discount="10% discount on quarterly plan"
              isPopular={true}
            />
            <PlanCard
              title="Six Months"
              price="20,000"
              features={[
                "Full gym access",
                "Ice Bath",
                "Steam Bath",
                "Shower",
                "Locker access"
              ]}
              discount="33% discount on half-yearly plan"
            />
            <PlanCard
              title="Annual"
              price="30,000"
              features={[
                "Full gym access",
                "Ice Bath",
                "Steam Bath",
                "Shower",
                "Locker access"
              ]}
              discount="50% discount on yearly plan"
            />
          </div>
        )}
        
        {activeTab === 'pool' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <PlanCard
              title="Pool Monthly"
              price="3,000"
              features={[
                "Swimming Pool access",
                "Shower",
                "Locker access",
                "Towel service"
              ]}
            />
            <PlanCard
              title="Pool Quarterly"
              price="8,000"
              features={[
                "Swimming Pool access",
                "Shower",
                "Locker access",
                "Towel service",
                "One steam session per week"
              ]}
              isPopular={true}
            />
            <PlanCard
              title="Pool Annual"
              price="24,000"
              features={[
                "Swimming Pool access",
                "Shower",
                "Locker access",
                "Towel service",
                "Unlimited steam sessions",
                "25% discount on swimming lessons"
              ]}
            />
          </div>
        )}
        
        {activeTab === 'pt' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <PlanCard
              title="4 Sessions"
              price="6,000"
              features={[
                "One-on-one training",
                "Customized workout plan",
                "Nutrition guidance",
                "Progress tracking"
              ]}
            />
            <PlanCard
              title="12 Sessions"
              price="15,000"
              features={[
                "One-on-one training",
                "Customized workout plan",
                "Detailed nutrition plan",
                "Progress tracking",
                "Body composition analysis"
              ]}
              isPopular={true}
            />
            <PlanCard
              title="24 Sessions"
              price="28,000"
              features={[
                "One-on-one training",
                "Customized workout plan",
                "Detailed nutrition plan",
                "Progress tracking",
                "Body composition analysis",
                "24/7 trainer support"
              ]}
            />
          </div>
        )}
      </div>
    </section>
  );
};

export default MembershipSection;
