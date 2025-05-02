
import React from 'react';

interface ContainerProps {
  children: React.ReactNode;
  className?: string;
}

export const Container = ({
  children,
  className = '',
}: ContainerProps) => {
  return (
    <div className={`container mx-auto p-4 ${className}`}>
      {children}
    </div>
  );
};
