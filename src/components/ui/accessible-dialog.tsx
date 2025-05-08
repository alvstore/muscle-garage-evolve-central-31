
import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface AccessibleDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  children: React.ReactNode;
}

export function AccessibleDialog({ 
  open, 
  onOpenChange, 
  title, 
  description, 
  children 
}: AccessibleDialogProps) {
  const dialogDescriptionId = description ? `${title.replace(/\s+/g, '-').toLowerCase()}-description` : undefined;
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent 
        aria-describedby={dialogDescriptionId}
      >
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description && (
            <DialogDescription id={dialogDescriptionId}>
              {description}
            </DialogDescription>
          )}
        </DialogHeader>
        {children}
      </DialogContent>
    </Dialog>
  );
}
