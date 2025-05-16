import React, { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Upload, X } from 'lucide-react';
import { toast } from 'sonner';

interface AvatarUploadProps {
  initialImage?: string;
  onImageChange?: (file: File | null) => void;
  onImageUrl?: (url: string | null) => void;
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  name?: string;
}

const AvatarUpload: React.FC<AvatarUploadProps> = ({
  initialImage,
  onImageChange,
  onImageUrl,
  size = 'md',
  disabled = false,
  name = ''
}) => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(initialImage || null);
  const [isUploading, setIsUploading] = useState(false);

  const sizeClasses = {
    sm: 'h-16 w-16',
    md: 'h-24 w-24',
    lg: 'h-32 w-32'
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    // Check file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      toast.error('Image size should be less than 2MB');
      return;
    }

    // Create preview
    const reader = new FileReader();
    reader.onload = () => {
      setPreviewUrl(reader.result as string);
    };
    reader.readAsDataURL(file);

    // Call the callback
    if (onImageChange) {
      onImageChange(file);
    }
  };

  const handleRemoveImage = () => {
    setPreviewUrl(null);
    if (onImageChange) {
      onImageChange(null);
    }
    if (onImageUrl) {
      onImageUrl(null);
    }
  };

  const getInitials = (name: string) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative">
        <Avatar className={`${sizeClasses[size]} border-2 border-primary/10`}>
          {previewUrl ? (
            <AvatarImage src={previewUrl} alt="Profile" />
          ) : null}
          <AvatarFallback className="bg-primary text-white">
            {getInitials(name)}
          </AvatarFallback>
        </Avatar>
        
        {!disabled && (
          <div className="absolute -bottom-2 -right-2 flex gap-1">
            <label htmlFor="avatar-upload" className="cursor-pointer">
              <div className="rounded-full bg-primary p-1.5 text-white shadow-sm hover:bg-primary/90">
                <Upload className="h-3.5 w-3.5" />
              </div>
              <input
                id="avatar-upload"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
                disabled={isUploading || disabled}
              />
            </label>
            
            {previewUrl && (
              <button
                type="button"
                onClick={handleRemoveImage}
                className="rounded-full bg-destructive p-1.5 text-white shadow-sm hover:bg-destructive/90"
                disabled={isUploading || disabled}
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AvatarUpload;
