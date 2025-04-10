import React from 'react';
import { Waves, Lock, Cloud, Car, Heart, Dumbbell } from 'lucide-react';

interface FacilityCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const FacilityCard = ({ icon, title, description }: FacilityCardProps) => {
  return (
    <div className="gym-feature-card">
      <div className="gym-feature-icon">
        {icon}
      </div>
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <p className="text-gray-400 text-center">{description}</p>
    </div>
  );
};

const FacilitySection = () => {
  return (
    <section className="py-16 bg-black">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <FacilityCard
            icon={<Waves className="h-7 w-7" />}
            title="Swimming Pool & Ice Bath"
            description="Olympic-sized swimming pool and therapeutic ice bath for recovery."
          />
          <FacilityCard
            icon={<Lock className="h-7 w-7" />}
            title="Locker Facility"
            description="Secure, modern lockers with digital locks for all members."
          />
          <FacilityCard
            icon={<Cloud className="h-7 w-7" />}
            title="Steam Room"
            description="Luxury steam rooms to relax and recover after intense workouts."
          />
          <FacilityCard
            icon={<Car className="h-7 w-7" />}
            title="Huge Parking Space"
            description="Convenient parking for all members with security surveillance."
          />
          <FacilityCard
            icon={<Heart className="h-7 w-7" />}
            title="Dedicated Cardio Section"
            description="State-of-the-art cardio equipment with personal entertainment screens."
          />
          <FacilityCard
            icon={<Dumbbell className="h-7 w-7" />}
            title="Zumba & Yoga Studio"
            description="Spacious studio for various fitness classes led by certified instructors."
          />
        </div>
      </div>
    </section>
  );
};

export default FacilitySection;
