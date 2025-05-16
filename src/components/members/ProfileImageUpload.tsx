
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Upload, X } from 'lucide-react';

export interface ProfileImageUploadProps {
  onChange: (file: File) => void;
  disabled?: boolean;
  initialImage?: string;
}

const ProfileImageUpload: React.FC<ProfileImageUploadProps> = ({
  onChange,
  disabled = false,
  initialImage
}) => {
  const [preview, setPreview] = useState<string | undefined>(initialImage);
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Create a preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
    
    // Call the onChange prop
    onChange(file);
  };
  
  const clearImage = () => {
    setPreview(undefined);
  };
  
  return (
    <div className="flex flex-col items-center">
      <div className="relative mb-4">
        {preview ? (
          <>
            <img
              src={preview}
              alt="Profile"
              className="w-32 h-32 rounded-full object-cover border-2 border-primary"
            />
            <button
              type="button"
              onClick={clearImage}
              className="absolute -top-2 -right-2 bg-destructive text-white p-1 rounded-full hover:bg-destructive/80"
              disabled={disabled}
            >
              <X size={16} />
            </button>
          </>
        ) : (
          <div className="w-32 h-32 rounded-full bg-muted flex items-center justify-center border-2 border-dashed border-primary/50">
            <Upload size={24} className="text-muted-foreground" />
          </div>
        )}
      </div>
      
      <input
        type="file"
        id="profile-image"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
        disabled={disabled}
      />
      
      <label htmlFor="profile-image">
        <Button
          type="button"
          variant="outline"
          className="cursor-pointer"
          asChild
          disabled={disabled}
        >
          <span>Upload Photo</span>
        </Button>
      </label>
    </div>
  );
};

export default ProfileImageUpload;
