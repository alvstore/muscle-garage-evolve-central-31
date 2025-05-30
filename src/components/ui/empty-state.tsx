
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

export interface EmptyStateProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  onAction?: () => void;
  actionLabel?: string;
  actionElement?: React.ReactNode;
  action?: React.ReactNode; // Support directly passing an action element
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  icon,
  onAction,
  actionLabel,
  actionElement,
  action // Support this prop
}) => {
  return (
    <Card>
      <CardContent className="flex flex-col items-center justify-center py-10 text-center">
        <div className="mb-4 text-muted-foreground">
          {icon}
        </div>
        <h3 className="text-lg font-medium mb-2">{title}</h3>
        <p className="text-muted-foreground mb-6 max-w-sm">{description}</p>
        {action || actionElement || (onAction && actionLabel && (
          <button 
            className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-6 py-2 cursor-pointer shadow-sm"
            onClick={onAction}
            type="button"
          >
            {actionLabel}
          </button>
        ))}
      </CardContent>
    </Card>
  );
};

export default EmptyState;
