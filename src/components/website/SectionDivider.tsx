
import React from "react";

export interface SectionDividerProps {
  equipmentType: "dumbbell" | "barbell" | "kettlebell" | "proteinShake";
}

const SectionDivider = ({ equipmentType }: SectionDividerProps) => {
  const renderEquipmentIcon = () => {
    switch (equipmentType) {
      case "dumbbell":
        return (
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gym-yellow">
            <path d="M6 7v10"></path>
            <path d="M18 7v10"></path>
            <path d="M8 7h8"></path>
            <path d="M8 17h8"></path>
            <path d="M3 5a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h3"></path>
            <path d="M21 5a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2h-3"></path>
          </svg>
        );
      case "barbell":
        return (
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gym-yellow">
            <path d="M2 13a1 1 0 0 0 1 1h18a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1H3a1 1 0 0 0-1 1v2z"></path>
            <path d="M5 10V8a1 1 0 0 1 1-1h1"></path>
            <path d="M19 10V8a1 1 0 0 0-1-1h-1"></path>
            <path d="M5 14v2a1 1 0 0 0 1 1h1"></path>
            <path d="M19 14v2a1 1 0 0 1-1 1h-1"></path>
          </svg>
        );
      case "kettlebell":
        return (
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gym-yellow">
            <path d="M14 3c0 1.1-.9 2-2 2s-2-.9-2-2 .9-2 2-2 2 .9 2 2z"></path>
            <path d="M20 10c0-4.4-3.6-8-8-8s-8 3.6-8 8 .8 16 8 16 8-11.6 8-16z"></path>
          </svg>
        );
      case "proteinShake":
        return (
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gym-yellow">
            <path d="M8 2h8"></path>
            <path d="M18 7c0 5.333-4 10-10 16"></path>
            <path d="M6 7c0 5.333 4 10 10 16"></path>
            <path d="M12 7h6"></path>
            <path d="M6 7h6"></path>
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <div className="py-10">
      <div className="flex items-center justify-center">
        <div className="h-px bg-gym-gray-700 flex-grow"></div>
        <div className="mx-6 bg-gym-gray-800 p-3 rounded-full">
          {renderEquipmentIcon()}
        </div>
        <div className="h-px bg-gym-gray-700 flex-grow"></div>
      </div>
    </div>
  );
};

export default SectionDivider;
