
import React from 'react';
import GymEquipment3D from './GymEquipment3D';

export interface SectionDividerProps {
  equipmentType?: 'dumbbells' | 'barbell' | 'kettlebell' | 'proteinShake' | 'dumbbell' | 'none';
  className?: string;
}

const SectionDivider: React.FC<SectionDividerProps> = ({ equipmentType = 'dumbbells', className = '' }) => {
  // Map equipment types to the correct type for GymEquipment3D
  const getEquipmentType = () => {
    if (equipmentType === 'dumbbells') return 'dumbbell';
    if (equipmentType === 'dumbbell') return 'dumbbell';
    if (equipmentType === 'barbell') return 'barbell';
    if (equipmentType === 'kettlebell') return 'kettlebell';
    if (equipmentType === 'proteinShake') return 'proteinShake';
    return 'dumbbell'; // Default
  };

  return (
    <div className={`py-8 flex items-center justify-center ${className}`}>
      <div className="w-1/4 h-px bg-gym-yellow"></div>
      {/* Increased size from w-16 h-16 to w-20 h-20 */}
      <div className="mx-4 w-20 h-20 -mt-2 flex items-center justify-center">
        {equipmentType !== 'none' ? (
          <GymEquipment3D 
            type={getEquipmentType() as any} 
            rotationSpeed={0.5} 
            className="opacity-80"
          />
        ) : (
          <span className="text-4xl text-gym-yellow flex items-center justify-center h-full">•</span>
        )}
      </div>
      <div className="w-1/4 h-px bg-gym-yellow"></div>
    </div>
  );
};

export default SectionDivider;
