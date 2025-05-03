
import React from 'react';
import { Card } from '@/components/ui/card';

const ServicesSection: React.FC = () => {
  const services = [
    {
      id: 1,
      title: "Personal Training",
      description: "One-on-one coaching tailored to your fitness goals with expert trainers.",
      icon: "🏋️‍♂️"
    },
    {
      id: 2,
      title: "Group Classes",
      description: "High-energy group workouts for all fitness levels led by professional instructors.",
      icon: "👥"
    },
    {
      id: 3,
      title: "Strength Training",
      description: "Build muscle and strength with our comprehensive strength training programs.",
      icon: "💪"
    },
    {
      id: 4,
      title: "Cardio Fitness",
      description: "Improve your cardiovascular health with state-of-the-art equipment and guided sessions.",
      icon: "❤️"
    }
  ];

  return (
    <section className="py-16 bg-gym-black">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-impact mb-12 text-center">
          OUR <span className="text-gym-yellow">SERVICES</span>
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map(service => (
            <Card key={service.id} className="bg-gray-900 border-0 hover:bg-gray-800 transition-colors p-6">
              <div className="text-4xl mb-4">{service.icon}</div>
              <h3 className="text-xl font-bold text-white mb-2">{service.title}</h3>
              <p className="text-gray-400">{service.description}</p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
