
import React from 'react';
import { Shield, Clock, Users, Dumbbell } from 'lucide-react';

export interface AboutSectionProps {
  title: string;
  subtitle: string;
  description: string;
  goalTitle: string;
  goalDescription: string;
  facilities: { 
    id: string;
    title: string;
    description: string;
    iconType: string;
  }[];
}

const AboutSection: React.FC<AboutSectionProps> = ({ 
  title = "ABOUT US",
  subtitle = "WHERE FITNESS MEETS PASSION",
  description = "Muscle Garage is a premier fitness facility dedicated to helping you achieve your fitness goals. Our state-of-the-art equipment, expert trainers, and supportive community create the perfect environment for your fitness journey.",
  goalTitle = "OUR MISSION",
  goalDescription = "To inspire and empower individuals to transform their lives through fitness, providing exceptional facilities, expert guidance, and a supportive community.",
  facilities = [
    {
      id: "1",
      title: "Expert Trainers",
      description: "Certified professionals dedicated to your success",
      iconType: "trainers"
    },
    {
      id: "2",
      title: "Premium Equipment",
      description: "Top-of-the-line machines and free weights",
      iconType: "equipment"
    },
    {
      id: "3",
      title: "24/7 Access",
      description: "Train on your schedule, whenever you want",
      iconType: "hours"
    },
    {
      id: "4",
      title: "Supportive Community",
      description: "Connect with like-minded fitness enthusiasts",
      iconType: "community"
    }
  ]
}) => {
  const renderIcon = (type: string) => {
    switch (type) {
      case "trainers":
        return <Users className="h-10 w-10 text-gym-yellow" />;
      case "equipment":
        return <Dumbbell className="h-10 w-10 text-gym-yellow" />;
      case "hours":
        return <Clock className="h-10 w-10 text-gym-yellow" />;
      case "community":
        return <Shield className="h-10 w-10 text-gym-yellow" />;
      default:
        return <Dumbbell className="h-10 w-10 text-gym-yellow" />;
    }
  };

  return (
    <section id="about" className="section-padding bg-gym-gray-900">
      <div className="gym-container">
        <div className="text-center max-w-3xl mx-auto mb-12 animate-fade-in">
          <h2 className="text-3xl md:text-5xl font-impact mb-4">
            {title} <span className="text-gym-yellow">{subtitle}</span>
          </h2>
          <p className="text-gray-300">{description}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          <div className="animate-fade-in" style={{ animationDelay: "0.2s" }}>
            <img
              src="/about-gym.jpg"
              alt="Gym Interior"
              className="w-full h-full object-cover rounded-lg"
            />
          </div>
          <div className="animate-fade-in" style={{ animationDelay: "0.4s" }}>
            <h3 className="text-2xl font-impact mb-4">
              {goalTitle} <span className="text-gym-yellow">FOR YOU</span>
            </h3>
            <p className="text-gray-300 mb-6">{goalDescription}</p>
            
            <h4 className="text-xl font-impact mb-4">OUR FACILITIES</h4>
            <div className="space-y-4">
              {facilities.map((facility) => (
                <div key={facility.id} className="flex items-start">
                  <div className="mr-4 mt-1">
                    {renderIcon(facility.iconType)}
                  </div>
                  <div>
                    <h5 className="text-lg font-bold">{facility.title}</h5>
                    <p className="text-gray-400">{facility.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
