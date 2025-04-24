
import React, { useRef, useState, useEffect } from "react";

const AboutSection = () => {
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

  return (
    <section 
      id="about" 
      ref={sectionRef}
      className="section-padding bg-gym-gray-900"
    >
      <div className="gym-container">
        <div className={`text-center max-w-3xl mx-auto mb-12 ${isVisible ? 'animate-fade-in' : 'opacity-0'}`}>
          <h2 className="text-3xl md:text-5xl font-impact mb-4">
            ABOUT <span className="text-gym-yellow">MUSCLE GARAGE</span>
          </h2>
          <p className="text-gray-300">
            Discover the ultimate fitness experience at Muscle Garage. We are dedicated to helping you achieve your fitness goals.
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className={`${isVisible ? 'animate-fade-in' : 'opacity-0'}`} style={{ animationDelay: '0.2s' }}>
            <div className="rounded-lg overflow-hidden">
              <img src="/about-img.jpg" alt="Muscle Garage Gym" className="w-full h-auto" />
            </div>
          </div>
          
          <div className={`${isVisible ? 'animate-fade-in' : 'opacity-0'}`} style={{ animationDelay: '0.4s' }}>
            <h3 className="text-2xl font-bold mb-4">Welcome to Muscle Garage</h3>
            <p className="mb-4">
              Founded in 2015, Muscle Garage has grown to become one of the most trusted fitness centers in Ahmedabad. 
              Our mission is to provide a comprehensive fitness experience for all, from beginners to experienced athletes.
            </p>
            <p className="mb-4">
              With state-of-the-art equipment, specialized training programs, and expert trainers, 
              we ensure that every member receives personalized attention and achieves their fitness goals.
            </p>
            <div className="grid grid-cols-2 gap-4 mt-8">
              <div className="bg-gym-gray-800 p-6 rounded-lg text-center">
                <div className="text-4xl font-bold text-gym-yellow mb-2">5+</div>
                <p>Years Experience</p>
              </div>
              <div className="bg-gym-gray-800 p-6 rounded-lg text-center">
                <div className="text-4xl font-bold text-gym-yellow mb-2">1500+</div>
                <p>Members</p>
              </div>
              <div className="bg-gym-gray-800 p-6 rounded-lg text-center">
                <div className="text-4xl font-bold text-gym-yellow mb-2">25+</div>
                <p>Professional Trainers</p>
              </div>
              <div className="bg-gym-gray-800 p-6 rounded-lg text-center">
                <div className="text-4xl font-bold text-gym-yellow mb-2">10+</div>
                <p>Fitness Programs</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
