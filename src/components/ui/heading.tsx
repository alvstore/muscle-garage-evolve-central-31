
import React from 'react';

interface HeadingProps {
  title: string;
  description: string;
}

export function Heading({ title, description }: HeadingProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  );
}
