
import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Camera, Loader2, X } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface ProfileImageUploadProps {
  memberId: string;
  existingImageUrl?: string;
  name?: string;
  onImageUploaded?: (url: string) => void;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

const ProfileImageUpload: React.FC<ProfileImageUploadProps> = ({
  memberId,
  existingImageUrl,
  name = '',
  onImageUploaded,
  size = 'md',
  className = '',
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | undefined>(existingImageUrl);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  // Get initials from name
  const getInitials = (name: string) => {
    if (!name) return '';
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  // Get avatar size class based on size prop
  const getSizeClass = () => {
    switch (size) {
      case 'sm': return 'h-12 w-12';
      case 'md': return 'h-20 w-20';
      case 'lg': return 'h-28 w-28';
      case 'xl': return 'h-36 w-36';
      default: return 'h-20 w-20';
    }
  };

  // Handle file selection
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      toast({
        title: 'Invalid file type',
        description: 'Please upload a JPEG, PNG or WebP image',
        variant: 'destructive',
      });
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: 'File too large',
        description: 'Image must be less than 5MB',
        variant: 'destructive',
      });
      return;
    }

    setIsUploading(true);

    try {
      // Upload to Supabase Storage - using avatars bucket with proper RLS
      const fileExt = file.name.split('.').pop();
      const fileName = `${memberId}-${Date.now()}.${fileExt}`;
      const filePath = `${memberId}/${fileName}`;

      const { data, error } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, {
          contentType: file.type, // Explicitly set content type
          upsert: false
        });

      if (error) throw error;

      // Get public URL
      const { data: publicUrlData } = supabase.storage
        .from('avatars')
        .getPublicUrl(data.path);

      const publicUrl = publicUrlData.publicUrl;
      
      // Update member record with new avatar URL
      const { error: updateError } = await supabase
        .from('members')
        .update({ avatar_url: publicUrl })
        .eq('id', memberId);

      if (updateError) throw updateError;

      // Update state and notify parent
      setImageUrl(publicUrl);
      if (onImageUploaded) {
        onImageUploaded(publicUrl);
      }

      toast({
        title: 'Profile image updated',
        description: 'Your profile image has been updated successfully.',
      });
    } catch (error: any) {
      console.error('Error uploading image:', error);
      toast({
        title: 'Upload failed',
        description: error.message || 'Failed to upload image. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsUploading(false);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const removeImage = async () => {
    if (!imageUrl) return;
    
    setIsUploading(true);
    
    try {
      // Extract file path from URL
      const urlPath = new URL(imageUrl).pathname;
      const filePath = urlPath.split('/').slice(-2).join('/'); // Get the last two segments
      
      // Remove from storage
      const { error } = await supabase.storage
        .from('avatars')
        .remove([filePath]);
        
      if (error) throw error;
      
      // Update member record
      const { error: updateError } = await supabase
        .from('members')
        .update({ avatar_url: null })
        .eq('id', memberId);
        
      if (updateError) throw updateError;
      
      // Update state
      setImageUrl(undefined);
      if (onImageUploaded) {
        onImageUploaded('');
      }
      
      toast({
        title: 'Profile image removed',
        description: 'Your profile image has been removed.',
      });
    } catch (error: any) {
      console.error('Error removing image:', error);
      toast({
        title: 'Failed to remove image',
        description: error.message || 'Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className={`flex flex-col items-center ${className}`}>
      <div className="relative">
        <Avatar className={`${getSizeClass()} border-2 border-primary`}>
          {imageUrl ? (
            <AvatarImage src={imageUrl} alt={name} />
          ) : (
            <AvatarFallback className="bg-primary text-white">
              {getInitials(name)}
            </AvatarFallback>
          )}
          
          {isUploading && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full">
              <Loader2 className="h-6 w-6 text-white animate-spin" />
            </div>
          )}
        </Avatar>
        
        <div className="absolute -bottom-2 -right-2 flex gap-1">
          <Button 
            size="sm" 
            variant="secondary"
            className="h-8 w-8 rounded-full p-0 bg-primary text-white hover:bg-primary/90"
            onClick={triggerFileInput}
            disabled={isUploading}
          >
            <Camera className="h-4 w-4" />
            <span className="sr-only">Upload image</span>
          </Button>
          
          {imageUrl && (
            <Button 
              size="sm" 
              variant="destructive"
              className="h-8 w-8 rounded-full p-0"
              onClick={removeImage}
              disabled={isUploading}
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Remove image</span>
            </Button>
          )}
        </div>
      </div>
      
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/jpg,image/webp"
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  );
};

export default ProfileImageUpload;
