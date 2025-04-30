
import React from 'react';

export interface SectionDividerProps {
  equipmentType: string;
}

const SectionDivider: React.FC<SectionDividerProps> = ({ equipmentType }) => {
  return (
    <div className="relative py-8">
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-full border-t border-gym-gray-700"></div>
      </div>
      <div className="relative flex justify-center">
        <span className="bg-gym-black px-4 text-gym-yellow text-2xl">
          {equipmentType}
        </span>
      </div>
    </div>
  );
};

export default SectionDivider;
