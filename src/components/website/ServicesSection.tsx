
import { useState, useEffect, useRef } from "react";
import { Dumbbell, Users, Clock, Award, Smile, Heart } from "lucide-react";

const ServicesSection = () => {
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

  const services = [
    {
      icon: <Dumbbell size={48} />,
      title: "Weight Training",
      description:
        "State-of-the-art equipment for strength and muscle building with dedicated zones."
    },
    {
      icon: <Users size={48} />,
      title: "Group Classes",
      description:
        "Energizing classes including Zumba, Aerobics, Yoga, and HIIT."
    },
    {
      icon: <Clock size={48} />,
      title: "24/7 Access",
      description:
        "Flexible workout hours to fit any schedule with secure access."
    },
    {
      icon: <Award size={48} />,
      title: "Expert Trainers",
      description:
        "Certified personal trainers to guide your fitness journey."
    },
    {
      icon: <Smile size={48} />,
      title: "Supportive Community",
      description:
        "Join a motivating community that celebrates every achievement."
    },
    {
      icon: <Heart size={48} />,
      title: "Wellness Programs",
      description:
        "Holistic approach with nutrition plans and recovery facilities."
    }
  ];

  return (
    <section id="services" ref={sectionRef} className="section-padding bg-gym-gray-900">
      <div className="gym-container">
        <div className={`text-center max-w-3xl mx-auto mb-12 ${isVisible ? 'animate-fade-in' : 'opacity-0'}`}>
          <h2 className="text-3xl md:text-5xl font-impact mb-4">
            OUR <span className="text-gym-yellow">SERVICES</span>
          </h2>
          <p className="text-gray-300">
            We offer comprehensive fitness services designed to help you achieve your goals,
            whether you're just starting out or looking to take your training to the next level.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <div
              key={service.title}
              className={`bg-gym-gray-800 rounded-lg p-8 text-center transition-all duration-500 hover:shadow-xl hover:bg-gym-gray-700 transform hover:-translate-y-2 ${
                isVisible ? 'animate-fade-in' : 'opacity-0'
              }`}
              style={{ 
                animationDelay: `${index * 0.1}s` 
              }}
            >
              <div className="inline-block p-4 bg-gym-yellow/10 rounded-full text-gym-yellow mb-6">
                {service.icon}
              </div>
              <h3 className="text-2xl font-bold mb-4">{service.title}</h3>
              <p className="text-gray-400">{service.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
