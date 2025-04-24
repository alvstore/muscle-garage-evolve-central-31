
import React from 'react';
import { Dumbbell, Clock, Users, Award } from 'lucide-react';

const HighlightsSection: React.FC = () => {
  const highlights = [
    {
      icon: <Dumbbell className="h-12 w-12 text-gym-yellow" />,
      title: "Modern Equipment",
      description: "State-of-the-art fitness equipment for all your workout needs"
    },
    {
      icon: <Clock className="h-12 w-12 text-gym-yellow" />,
      title: "24/7 Access",
      description: "Train whenever you want with our round-the-clock access"
    },
    {
      icon: <Users className="h-12 w-12 text-gym-yellow" />,
      title: "Expert Trainers",
      description: "Get guidance from our certified professional trainers"
    },
    {
      icon: <Award className="h-12 w-12 text-gym-yellow" />,
      title: "Premium Classes",
      description: "Join our variety of fitness classes for all levels"
    }
  ];

  return (
    <section className="section-padding bg-gym-gray-900">
      <div className="gym-container">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {highlights.map((item, index) => (
            <div 
              key={index} 
              className="animate-fade-in bg-gym-gray-800 p-6 rounded-lg text-center"
              style={{ animationDelay: `${0.2 * index}s` }}
            >
              <div className="flex justify-center mb-4">
                {item.icon}
              </div>
              <h3 className="text-xl font-bold mb-2">{item.title}</h3>
              <p className="text-gray-400">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HighlightsSection;
