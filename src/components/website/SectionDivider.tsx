
import GymEquipment3D from "./GymEquipment3D";

interface SectionDividerProps {
  equipmentType: "dumbbell" | "barbell" | "kettlebell" | "proteinShake";
  className?: string;
}

const SectionDivider = ({ equipmentType, className = "" }: SectionDividerProps) => {
  return (
    <div className={`relative py-12 ${className}`}>
      {/* Center equipment */}
      <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 z-10">
        <GymEquipment3D type={equipmentType} rotationSpeed={1} />
      </div>
      
      {/* Divider lines */}
      <div className="flex items-center justify-center max-w-7xl mx-auto px-4">
        <div className="flex-1 h-0.5 bg-gradient-to-r from-transparent to-gym-yellow/70"></div>
        <div className="w-44 h-20"></div>
        <div className="flex-1 h-0.5 bg-gradient-to-l from-transparent to-gym-yellow/70"></div>
      </div>
    </div>
  );
};

export default SectionDivider;
