import { useState, useEffect } from "react";
import { Play, ChevronRight } from "lucide-react";
import GymEquipment3D from "@/components/website/GymEquipment3D";

interface HeroSectionProps {
  title?: string;
  subtitle?: string;
  ctaButtonText?: string;
  ctaButtonLink?: string;
  backgroundImage?: string;
}

const HeroSection = ({
  title = "TRANSFORM YOUR BODY AT MUSCLE GARAGE",
  subtitle = "The biggest, most advanced GYM in Ahmedabad with state-of-the-art equipment and professional trainers",
  ctaButtonText = "JOIN NOW",
  ctaButtonLink = "#membership",
  backgroundImage = "/hero-bg.jpg"
}: HeroSectionProps = {}) => {
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    setLoaded(true);
  }, []);
  return <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden" style={{
    backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url('${backgroundImage}')`,
    backgroundSize: "cover",
    backgroundPosition: "center",
  }}>
      {/* Overlay gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-gym-black opacity-90"></div>

      {/* 3D Gym Equipment Background */}
      <div className="absolute top-20 right-10 w-40 h-40 opacity-60">
        <GymEquipment3D type="dumbbell" rotationSpeed={0.5} />
      </div>
      <div className="absolute bottom-40 left-10 w-32 h-32 opacity-60">
        <GymEquipment3D type="kettlebell" rotationSpeed={0.3} />
      </div>

      {/* Content */}
      <div className={`gym-container relative z-10 text-center max-w-5xl transition-all duration-700 transform ${loaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
        <h1 className="text-4xl md:text-6xl font-impact mb-4 leading-tight">
          {title.split(' ').map((word, i) => 
            i === title.split(' ').length - 2 ? <span key={i}>{word} <span className="text-gym-yellow">{title.split(' ')[i+1]}</span></span> : 
            i === title.split(' ').length - 1 ? null : 
            <span key={i}>{word} </span>
          )}
        </h1>
        <p className="text-gray-300 mb-8 max-w-2xl text-center">
          {subtitle}
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <a href={ctaButtonLink} className="btn btn-primary flex items-center gap-2">
            {ctaButtonText}
            <ChevronRight className="h-5 w-5" />
          </a>
        </div>
      </div>

      {/* Animated scroll indicator */}
      <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-8 h-12 rounded-full border-2 border-gym-yellow flex items-start justify-center pt-2">
          <div className="w-1 h-3 bg-gym-yellow rounded-full animate-pulse-soft"></div>
        </div>
      </div>
    </section>;
};
export default HeroSection;