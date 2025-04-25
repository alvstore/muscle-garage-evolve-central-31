
import { useState, useEffect, useRef } from "react";

const HighlightsSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  
  const highlights = [
    "WEIGHT TRAINING",
    "CARDIO",
    "STRENGTH & CONDITIONING",
    "BOOTCAMP",
    "AEROBICS",
    "ZUMBA",
    "YOGA",
    "CROSSFIT TRAINING",
    "SWIMMING",
    "ICE BATH",
    "STEAM BATH"
  ];

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
      ref={sectionRef}
      className="py-6 md:py-10 bg-gym-gray-800"
    >
      <div className="gym-container">
        <div className={`${isVisible ? 'animate-fade-in' : 'opacity-0'}`}>
          <div className="flex flex-wrap justify-center items-center gap-2 md:gap-4">
            {highlights.map((highlight, index) => (
              <div 
                key={highlight}
                className="inline-block"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <span className="text-gym-yellow font-bold">{highlight}</span>
                {index < highlights.length - 1 && (
                  <span className="mx-2 text-gray-500">|</span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HighlightsSection;
