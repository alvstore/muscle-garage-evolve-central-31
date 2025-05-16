
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

export interface EmptyStateProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  onAction?: () => void;
  actionLabel?: string;
  actionElement?: React.ReactNode;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  icon,
  onAction,
  actionLabel,
  actionElement
}) => {
  return (
    <Card>
      <CardContent className="flex flex-col items-center justify-center py-10 text-center">
        <div className="mb-4 text-muted-foreground">
          {icon}
        </div>
        <h3 className="text-lg font-medium mb-2">{title}</h3>
        <p className="text-muted-foreground mb-6 max-w-sm">{description}</p>
        {actionElement}
        {!actionElement && onAction && actionLabel && (
          <button 
            className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
            onClick={onAction}
          >
            {actionLabel}
          </button>
        )}
      </CardContent>
    </Card>
  );
};

export default EmptyState;
