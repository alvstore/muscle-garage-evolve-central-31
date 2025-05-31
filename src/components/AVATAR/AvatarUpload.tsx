import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Upload, X } from 'lucide-react';

interface AvatarUploadProps {
  /** Current avatar URL or base64 string */
  currentAvatar?: string;
  /** Callback when avatar changes */
  onAvatarChange: (file: File | null) => void;
  /** Whether the upload is disabled */
  disabled?: boolean;
  /** Alternative text for the avatar */
  alt?: string;
  /** Fallback text when no image is available */
  fallbackText?: string;
  /** CSS class for the container */
  className?: string;
  /** Size of the avatar (sm, md, lg) */
  size?: 'sm' | 'md' | 'lg';
}

const sizeClasses = {
  sm: 'h-8 w-8',
  md: 'h-16 w-16',
  lg: 'h-32 w-32',
};

const AvatarUpload: React.FC<AvatarUploadProps> = ({
  currentAvatar,
  onAvatarChange,
  disabled = false,
  alt = 'Profile picture',
  fallbackText = 'NA',
  className = '',
  size = 'md',
}) => {
    const [preview, setPreview] = useState<string>('');
  const [isMounted, setIsMounted] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Set isMounted to true on client-side
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Update preview when currentAvatar changes
  useEffect(() => {
    if (currentAvatar !== undefined) {
      setPreview(currentAvatar);
    }
  }, [currentAvatar]);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
      onAvatarChange(file);
    }
  };

  const handleRemove = () => {
    setPreview('');
    onAvatarChange(null);
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleClick = () => {
    if (!disabled && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  if (!isMounted) {
    return (
      <div className={`flex flex-col items-center space-y-4 ${className}`}>
        <Avatar className={`${sizeClasses[size]} bg-muted`}>
          <AvatarFallback className="bg-muted">
            {fallbackText.substring(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>
      </div>
    );
  }

  return (
    <div className={`flex flex-col items-center space-y-4 ${className}`}>
      <div className="relative">
        <Avatar 
          className={`${sizeClasses[size]} cursor-pointer ${disabled ? 'opacity-50' : 'hover:opacity-80'}`}
          onClick={handleClick}
        >
          {preview ? (
            <AvatarImage src={preview} alt={alt} className="object-cover" />
          ) : (
            <AvatarFallback className="bg-muted">
              {fallbackText.substring(0, 2).toUpperCase()}
            </AvatarFallback>
          )}
        </Avatar>
        
        {!disabled && preview && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleRemove();
            }}
            className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full p-1 hover:bg-destructive/90 transition-colors"
            disabled={disabled}
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {!disabled && (
        <div className="flex space-x-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleClick}
            disabled={disabled}
          >
            <Upload className="h-4 w-4 mr-2" />
            {preview ? 'Change' : 'Upload'}
          </Button>
          
          {preview && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleRemove}
              disabled={disabled}
            >
              <X className="h-4 w-4 mr-2" />
              Remove
            </Button>
          )}
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
        disabled={disabled}
      />
    </div>
  );
};

export default AvatarUpload;
