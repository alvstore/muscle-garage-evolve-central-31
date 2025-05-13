import * as React from 'react';
import { LucideIcon, LucideProps } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface IconProps extends React.HTMLAttributes<HTMLDivElement> {
  name: string;
  className?: string;
}

export function Icon({ name, className, ...props }: IconProps) {
  const IconComponent = React.lazy(() => import('lucide-react').then(mod => ({ default: mod[name as keyof typeof mod] as LucideIcon })));

  return (
    <div className={cn('flex items-center justify-center', className)} {...props}>
      <React.Suspense fallback={<div className="h-4 w-4 animate-pulse rounded-full bg-muted" />}>
        <IconComponent className={className} />
      </React.Suspense>
    </div>
  );
}
