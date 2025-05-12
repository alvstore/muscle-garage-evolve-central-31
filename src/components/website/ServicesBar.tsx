import React from "react";
import { Dumbbell, Users, Clock, Award, Smile, Heart } from "lucide-react";

const ServicesBar = () => {
  const services = [
    {
      icon: <Dumbbell size={24} />,
      title: "Weight Training"
    },
    {
      icon: <Users size={24} />,
      title: "Group Classes"
    },
    {
      icon: <Clock size={24} />,
      title: "24/7 Access"
    },
    {
      icon: <Award size={24} />,
      title: "Expert Trainers"
    },
    {
      icon: <Smile size={24} />,
      title: "Community"
    },
    {
      icon: <Heart size={24} />,
      title: "Wellness"
    }
  ];

  return (
    <section className="bg-gym-gray-800 py-4 relative z-10">
      <div className="gym-container">
        <div className="flex flex-wrap justify-center md:justify-between items-center gap-4 md:gap-6">
          {services.map((service, index) => (
            <div key={index} className="flex items-center gap-3">
              <div className="text-gym-yellow">{service.icon}</div>
              <span className="text-white font-semibold">{service.title}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesBar;