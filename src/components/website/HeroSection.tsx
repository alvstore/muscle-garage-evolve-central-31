
import React from 'react';
import { Link } from 'react-router-dom';

const HeroSection: React.FC = () => {
  return (
    <section className="min-h-screen bg-gym-gray-900 flex items-center relative overflow-hidden">
      <div className="absolute inset-0 z-0">
        <img 
          src="/hero-bg.jpg"
          alt="Gym Background" 
          className="w-full h-full object-cover opacity-30"
        />
      </div>
      <div className="gym-container z-10 relative">
        <div className="max-w-3xl">
          <div className="animate-fade-in">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-impact tracking-wide text-white mb-4">
              UNLOCK YOUR <span className="text-gym-yellow">POTENTIAL</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-8">
              Transform your body and mind with the ultimate fitness experience at Muscle Garage.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/register" className="bg-gym-yellow hover:bg-gym-yellow-dark text-black font-bold py-3 px-8 rounded-md text-center">
                START YOUR JOURNEY
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
