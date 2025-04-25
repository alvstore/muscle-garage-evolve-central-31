import { useState, useEffect } from "react";
import { Play, ChevronRight } from "lucide-react";
import GymEquipment3D from "./GymEquipment3D";
const HeroSection = () => {
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    setLoaded(true);
  }, []);
  return <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden" style={{
    backgroundImage: "linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url('/hero-bg.jpg')",
    backgroundSize: "cover",
    backgroundPosition: "center"
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
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-impact mb-4 text-white">
          <span className="text-gym-yellow">BUILD</span> LIKE A{" "}
          <span className="text-gym-yellow">BEAST</span>
        </h1>
        
        <p className="text-xl md:text-2xl text-gray-300 mb-10 max-w-2xl mx-auto">
          One of the largest premium fitness facilities in Ahmedabad with state-of-the-art equipment and expert trainers.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <a href="#membership" className="btn btn-primary text-lg flex items-center gap-2 group">
            Join Now <ChevronRight className="group-hover:translate-x-1 transition-transform" />
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