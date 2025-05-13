
import React from 'react';
import { Link } from 'react-router-dom';

interface LogoProps {
  variant?: 'default' | 'white';
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

const Logo: React.FC<LogoProps> = ({ 
  variant = 'default', 
  className = '', 
  size = 'md' 
}) => {
  const textColor = variant === 'white' ? 'text-white' : 'text-primary dark:text-white';
  
  // Define size classes based on the size prop
  const sizeClasses = {
    sm: 'text-lg md:text-xl',
    md: 'text-xl md:text-2xl',
    lg: 'text-2xl md:text-3xl'
  };
  
  return (
    <Link to="/" className={`flex items-center ${className}`}>
      <span className={`font-bold tracking-tight ${textColor} ${sizeClasses[size]}`}>
        Muscle<span className="text-accent">Garage</span>
      </span>
    </Link>
  );
};

export default Logo;
