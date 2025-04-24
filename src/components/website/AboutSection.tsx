
import { useState, useEffect, useRef } from "react";
import { Waves, Lock, Cloud, Car, Heart, Dumbbell, LucideIcon } from "lucide-react";

interface Facility {
  icon: LucideIcon;
  title: string;
  description: string;
}

interface AboutSectionProps {
  title?: string;
  subtitle?: string;
  description?: string;
  goalTitle?: string;
  goalDescription?: string;
  facilities?: {
    title: string;
    description: string;
    iconType: string;
  }[];
}

const iconMap: Record<string, LucideIcon> = {
  waves: Waves,
  lock: Lock,
  cloud: Cloud,
  car: Car,
  heart: Heart,
  dumbbell: Dumbbell
};

const AboutSection = ({
  title = "ABOUT",
  subtitle = "MUSCLE GARAGE",
  description = "Muscle Garage is the biggest, most advanced GYM in Ahmedabad. The Facility is fully equipped with state of the art Cardio machines, sensorised strength training machines and a variety of training equipment to workout on. The GYM features a Strength zone, Free-weight zone, Cardio zone, Group training studio, crossfit area, swimming pool, steam bath and ICE Bath.",
  goalTitle = "OUR GOAL",
  goalDescription = "Our Mission is to provide a Dynamic Training Facility with state of the art equipments, Pro-instructors & High-level training. All our members are trained by Pro-Trainers who have abundance of knowledge & skills in many aspects of Fitness. Our Focus is a Fitness Experience that builds a stronger You!!",
  facilities = [
    {
      title: "Swimming Pool & Ice Bath",
      description: "Olympic-sized swimming pool and therapeutic ice bath for recovery.",
      iconType: "waves"
    },
    {
      title: "Locker Facility",
      description: "Secure, modern lockers with digital locks for all members.",
      iconType: "lock"
    },
    {
      title: "Steam Room",
      description: "Luxury steam rooms to relax and recover after intense workouts.",
      iconType: "cloud"
    },
    {
      title: "Huge Parking Space",
      description: "Convenient parking for all members with security surveillance.",
      iconType: "car"
    },
    {
      title: "Dedicated Cardio Section",
      description: "State-of-the-art cardio equipment with personal entertainment screens.",
      iconType: "heart"
    },
    {
      title: "Zumba & Yoga Studio",
      description: "Spacious studio for various fitness classes led by certified instructors.",
      iconType: "dumbbell"
    }
  ]
}: AboutSectionProps = {}) => {
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      {
        threshold: 0.1,
      }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  const facilityItems = facilities.map(facility => {
    const IconComponent = iconMap[facility.iconType] || Dumbbell;
    return {
      icon: <IconComponent className="h-8 w-8" />,
      title: facility.title,
      description: facility.description
    };
  });

  return (
    <section id="about" ref={sectionRef} className="section-padding bg-gym-black">
      <div className="gym-container">
        <div className={`text-center max-w-3xl mx-auto mb-8 ${isVisible ? 'animate-fade-in' : 'opacity-0'}`}>
          <h2 className="text-3xl md:text-5xl font-impact mb-4">
            {title} <span className="text-gym-yellow">{subtitle}</span>
          </h2>
          <p className="text-gray-300 mb-6">
            {description}
          </p>
          
          <div className="mt-8 mb-8">
            <h3 className="text-2xl font-impact mb-4">{goalTitle.split(' ')[0]} <span className="text-gym-yellow">{goalTitle.split(' ').slice(1).join(' ')}</span></h3>
            <p className="text-gray-300">
              {goalDescription}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {facilityItems.map((facility, index) => (
            <div
              key={facility.title}
              className={`bg-gym-gray-800 rounded-lg p-6 shadow-lg transition-all duration-500 hover:shadow-xl hover:bg-gym-gray-700 transform hover:-translate-y-1 ${
                isVisible ? 'animate-fade-in' : 'opacity-0'
              }`}
              style={{ 
                animationDelay: `${index * 0.1}s` 
              }}
            >
              <div className="p-3 bg-gym-yellow rounded-full inline-block text-gym-black mb-4">
                {facility.icon}
              </div>
              <h3 className="text-xl font-bold mb-2">{facility.title}</h3>
              <p className="text-gray-400">{facility.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
