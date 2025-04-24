
import React from 'react';
import { Link } from 'react-router-dom';

export interface HeroSectionProps {
  title: string;
  subtitle: string;
  ctaButtonText: string;
  ctaButtonLink: string;
  backgroundImage: string;
}

const HeroSection: React.FC<HeroSectionProps> = ({
  title = "UNLOCK YOUR",
  subtitle = "POTENTIAL",
  ctaButtonText = "START YOUR JOURNEY",
  ctaButtonLink = "/register",
  backgroundImage = "/hero-bg.jpg"
}) => {
  return (
    <section className="min-h-screen bg-gym-gray-900 flex items-center relative overflow-hidden">
      <div className="absolute inset-0 z-0">
        <img 
          src={backgroundImage}
          alt="Gym Background" 
          className="w-full h-full object-cover opacity-30"
        />
      </div>
      <div className="gym-container z-10 relative">
        <div className="max-w-3xl">
          <div className="animate-fade-in">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-impact tracking-wide text-white mb-4">
              {title} <span className="text-gym-yellow">{subtitle}</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-8">
              Transform your body and mind with the ultimate fitness experience at Muscle Garage.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to={ctaButtonLink} className="bg-gym-yellow hover:bg-gym-yellow-dark text-black font-bold py-3 px-8 rounded-md text-center">
                {ctaButtonText}
              </Link>
              <Link to="#memberships" className="border border-gym-yellow text-gym-yellow hover:bg-gym-yellow hover:text-black font-bold py-3 px-8 rounded-md text-center">
                VIEW MEMBERSHIPS
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
