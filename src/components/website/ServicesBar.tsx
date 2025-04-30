
import React, { useState, useEffect, useRef } from "react";
import { ArrowRight } from "lucide-react";

const ServicesBar = () => {
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
      { threshold: 0.1 }
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
      icon: "🏋️",
      title: "Personal Training",
      description: "One-on-one sessions with expert trainers",
      link: "#",
    },
    {
      icon: "⚡",
      title: "HIIT Classes",
      description: "High intensity interval training for maximum results",
      link: "#",
    },
    {
      icon: "🧘",
      title: "Yoga & Flexibility",
      description: "Improve strength, balance and mindfulness",
      link: "#",
    },
    {
      icon: "💪",
      title: "Strength Training",
      description: "Build muscle and increase your strength",
      link: "#",
    },
  ];

  return (
    <section
      ref={sectionRef}
      className={`py-16 bg-gym-gray-800 ${
        isVisible ? "animate-fade-in" : "opacity-0"
      }`}
    >
      <div className="gym-container">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service, index) => (
            <div
              key={index}
              className="bg-gym-gray-900 p-6 rounded-lg hover:bg-gym-yellow hover:text-gym-black transition-colors duration-300 group"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="text-4xl mb-4">{service.icon}</div>
              <h3 className="text-xl font-bold mb-2">{service.title}</h3>
              <p className="text-gray-300 group-hover:text-gym-black mb-4">
                {service.description}
              </p>
              <a
                href={service.link}
                className="inline-flex items-center text-gym-yellow group-hover:text-gym-black"
              >
                Learn More <ArrowRight className="ml-2 h-4 w-4" />
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesBar;
