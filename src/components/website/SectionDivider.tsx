
import React from 'react';

export interface SectionDividerProps {
  equipmentType?: 'dumbbells' | 'barbell' | 'kettlebell' | 'proteinShake' | 'dumbbell' | 'none';
  className?: string;
}

const SectionDivider: React.FC<SectionDividerProps> = ({ equipmentType = 'dumbbells', className = '' }) => {
  return (
    <div className={`py-8 flex items-center justify-center ${className}`}>
      <div className="w-1/4 h-px bg-gym-yellow"></div>
      <div className="mx-4">
        {equipmentType === 'dumbbells' && (
          <span className="text-4xl text-gym-yellow">🏋️‍♂️</span>
        )}
        {equipmentType === 'dumbbell' && (
          <span className="text-4xl text-gym-yellow">🏋️‍♂️</span>
        )}
        {equipmentType === 'barbell' && (
          <span className="text-4xl text-gym-yellow">🏋️‍♀️</span>
        )}
        {equipmentType === 'kettlebell' && (
          <span className="text-4xl text-gym-yellow">⚡</span>
        )}
        {equipmentType === 'proteinShake' && (
          <span className="text-4xl text-gym-yellow">🥤</span>
        )}
        {equipmentType === 'none' && (
          <span className="text-4xl text-gym-yellow">•</span>
        )}
      </div>
      <div className="w-1/4 h-px bg-gym-yellow"></div>
    </div>
  );
};

export default SectionDivider;
