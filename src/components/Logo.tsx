
import { Dumbbell } from "lucide-react";

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  variant?: 'full' | 'icon';
}

const Logo = ({ size = 'md', variant = 'full' }: LogoProps) => {
  const sizeClasses = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-3xl'
  };

  const iconSizes = {
    sm: 16,
    md: 24,
    lg: 32
  };

  return (
    <div className="flex items-center gap-2">
      <div className="bg-accent rounded-lg p-1.5 flex items-center justify-center">
        <Dumbbell className="text-accent-foreground" size={iconSizes[size]} />
      </div>
      
      {variant === 'full' && (
        <div className={`font-bold tracking-tight ${sizeClasses[size]}`}>
          <span>Muscle</span>
          <span className="text-accent">Garage</span>
        </div>
      )}
    </div>
  );
};

export default Logo;
