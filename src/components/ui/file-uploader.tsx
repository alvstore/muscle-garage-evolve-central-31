
import React, { forwardRef, InputHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';
import { Button } from './button';
import { Upload } from 'lucide-react';

interface FileUploaderProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'onChange'> {
  onFileSelected: (file: File | null) => void;
  buttonText?: string;
  maxSize?: number; // in MB
  accept?: string;
  className?: string;
}

export const FileUploader = forwardRef<HTMLInputElement, FileUploaderProps>(
  ({ onFileSelected, buttonText = 'Upload file', maxSize, accept, className, ...props }, ref) => {
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0] || null;
      
      // Check file size if maxSize is provided
      if (file && maxSize && file.size > maxSize * 1024 * 1024) {
        alert(`File size exceeds ${maxSize}MB limit.`);
        e.target.value = '';
        return;
      }
      
      onFileSelected(file);
    };

    return (
      <div className={cn("flex flex-col space-y-2", className)}>
        <div className="flex items-center justify-center w-full">
          <label className="w-full flex flex-col items-center px-4 py-6 bg-background text-primary rounded-lg border-2 border-dashed border-border cursor-pointer hover:bg-muted/50">
            <Upload className="w-8 h-8" />
            <span className="mt-2 text-sm">{buttonText}</span>
            <span className="text-xs text-muted-foreground mt-1">
              {accept && `Accepted formats: ${accept.replace(/\./g, '').split(',').join(', ')}`}
              {maxSize && ` (Max ${maxSize}MB)`}
            </span>
            <input
              ref={ref}
              type="file"
              className="hidden"
              onChange={handleFileChange}
              accept={accept}
              {...props}
            />
          </label>
        </div>
      </div>
    );
  }
);

FileUploader.displayName = 'FileUploader';
