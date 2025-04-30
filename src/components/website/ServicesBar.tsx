
import React from 'react';
import { Dumbbell, Users, Clock } from 'lucide-react';

const ServicesBar = () => {
  const services = [
    {
      icon: <Dumbbell className="h-6 w-6" />,
      title: 'Modern Equipment',
      description: 'State-of-the-art fitness equipment for all your training needs'
    },
    {
      icon: <Dumbbell className="h-6 w-6" />,
      title: 'Various Classes',
      description: 'Wide range of fitness classes led by expert trainers'
    },
    {
      icon: <Users className="h-6 w-6" />,
      title: 'Expert Trainers',
      description: 'Professional trainers to guide your fitness journey'
    },
    {
      icon: <Clock className="h-6 w-6" />,
      title: 'Flexible Hours',
      description: 'Open early until late to fit your busy schedule'
    }
  ];

  return (
    <section className="bg-gym-black py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((service, index) => (
            <div key={index} className="flex flex-col items-center text-center">
              <div className="bg-gym-yellow p-4 rounded-full mb-4">
                {service.icon}
              </div>
              <h3 className="text-gym-yellow text-xl font-bold mb-2">{service.title}</h3>
              <p className="text-white">{service.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesBar;
