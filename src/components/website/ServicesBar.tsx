
import React from 'react';

const ServicesBar: React.FC = () => {
  const features = [
    { id: 1, icon: "🔥", text: "Modern Equipment" },
    { id: 2, icon: "⏰", text: "24/7 Access" },
    { id: 3, icon: "👨‍🏫", text: "Expert Trainers" },
    { id: 4, icon: "🏆", text: "Results Guaranteed" }
  ];

  return (
    <div className="bg-gym-yellow py-6">
      <div className="container mx-auto px-4">
        <div className="flex flex-wrap justify-around items-center">
          {features.map((feature) => (
            <div key={feature.id} className="flex items-center mb-4 md:mb-0">
              <span className="text-2xl mr-2">{feature.icon}</span>
              <span className="text-black font-bold">{feature.text}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ServicesBar;
