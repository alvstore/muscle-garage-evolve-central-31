
import React from 'react';
import { Dumbbell, ShoppingBag, Award, Droplet } from 'lucide-react';

type EquipmentType = 'barbell' | 'dumbbell' | 'kettlebell' | 'proteinShake';

interface SectionDividerProps {
  equipmentType: EquipmentType;
  className?: string;
}

const SectionDivider: React.FC<SectionDividerProps> = ({ equipmentType, className = '' }) => {
  const renderEquipment = () => {
    switch (equipmentType) {
      case 'barbell':
        return <Dumbbell className="h-8 w-8 text-gym-yellow" />; // Changed from Barbell to Dumbbell
      case 'dumbbell':
        return <Dumbbell className="h-8 w-8 text-gym-yellow" />;
      case 'kettlebell':
        return <ShoppingBag className="h-8 w-8 text-gym-yellow" />;
      case 'proteinShake':
        return <Droplet className="h-8 w-8 text-gym-yellow" />;
      default:
        return <Award className="h-8 w-8 text-gym-yellow" />;
    }
  };

  return (
    <div className={`py-6 ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-center">
        <div className="w-full max-w-sm flex items-center">
          <div className="flex-1 h-px bg-gym-gray-700"></div>
          <div className="px-4">{renderEquipment()}</div>
          <div className="flex-1 h-px bg-gym-gray-700"></div>
        </div>
      </div>
    </div>
  );
};

export default SectionDivider;
