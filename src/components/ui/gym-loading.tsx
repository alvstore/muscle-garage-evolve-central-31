import React from 'react';
import { Dumbbell } from 'lucide-react';

interface GymLoadingProps {
  message?: string;
  className?: string;
}

export const GymLoading: React.FC<GymLoadingProps> = ({
  message = 'Loading your dashboard...',
  className = '',
}) => {
  return (
    <div className={`flex flex-col items-center justify-center space-y-6 py-12 ${className}`}>
      <div className="relative">
        {/* Animated dumbbell */}
        <div className="relative flex items-center justify-center">
          <div className="absolute -left-8 w-6 h-3 bg-primary-500 rounded-full animate-bounce" style={{
            animationDelay: '0s',
            animationDuration: '1s',
          }} />
          <Dumbbell className="h-12 w-12 text-primary-500 animate-pulse" />
          <div className="absolute -right-8 w-6 h-3 bg-primary-500 rounded-full animate-bounce" style={{
            animationDelay: '0.5s',
            animationDuration: '1s',
          }} />
        </div>
        
        {/* Pulse effect */}
        <div className="absolute inset-0 rounded-full bg-primary-100 opacity-70 animate-ping" style={{
          animationDuration: '1.5s'
        }} />
      </div>
      
      {message && (
        <p className="text-center text-muted-foreground max-w-md">
          {message}
        </p>
      )}
      
      <div className="w-48 h-1 bg-gray-200 rounded-full overflow-hidden">
        <div 
          className="h-full bg-primary-500 rounded-full animate-progress"
          style={{
            width: '100%',
            animation: 'progress 2s ease-in-out infinite',
          }}
        />
      </div>
      
      <style dangerouslySetInnerHTML={{
        __html: `
          @keyframes progress {
            0% { transform: translateX(-100%); }
            100% { transform: translateX(100%); }
          }
          
          @keyframes bounce {
            0%, 100% { transform: translateY(-25%); }
            50% { transform: translateY(0); }
          }
          
          .animate-bounce {
            animation: bounce 1s infinite;
          }
          
          .animate-progress {
            background: linear-gradient(90deg, transparent, rgba(99, 102, 241, 0.7), transparent);
          }
        `
      }} />
    </div>
  );
};

export default GymLoading;
