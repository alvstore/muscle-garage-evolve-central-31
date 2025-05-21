
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface UploadImageProps {
  file: File;
  folder: string;
}

interface UseUploadImageReturn {
  uploadImage: (props: UploadImageProps) => Promise<string | null>;
  isUploading: boolean;
  error: Error | null;
}

export const useUploadImage = (): UseUploadImageReturn => {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const uploadImage = async ({ file, folder }: UploadImageProps): Promise<string | null> => {
    try {
      setIsUploading(true);
      setError(null);

      if (!file) {
        throw new Error('No file selected');
      }

      // Validate file type
      if (!file.type.startsWith('image/')) {
        throw new Error('File must be an image');
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        throw new Error('Image size should be less than 5MB');
      }

      // Generate a unique filename
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '')}`;
      const filePath = `${folder}/${fileName}`;

      // Check if images bucket exists, create it if it doesn't
      const { data: buckets } = await supabase.storage.listBuckets();
      
      if (!buckets?.find(bucket => bucket.name === 'images')) {
        const { error: createBucketError } = await supabase.storage.createBucket('images', {
          public: true,
          fileSizeLimit: 5242880 // 5MB
        });
        
        if (createBucketError) {
          console.error('Failed to create bucket:', createBucketError);
          throw new Error(`Failed to create bucket: ${createBucketError.message}`);
        }
      }

      // Upload to Supabase Storage with explicit content type
      const { error: uploadError, data } = await supabase.storage
        .from('images')
        .upload(filePath, file, {
          cacheControl: '3600',
          contentType: file.type, // Ensure content-type is set correctly
          upsert: false
        });

      if (uploadError) {
        console.error('Storage upload error:', uploadError);
        throw new Error(`Failed to upload image: ${uploadError.message}`);
      }

      if (!data?.path) {
        throw new Error('Failed to get upload path');
      }

      // Get the public URL
      const { data: { publicUrl } } = supabase.storage
        .from('images')
        .getPublicUrl(filePath);

      if (!publicUrl) {
        throw new Error('Failed to get image URL');
      }

      return publicUrl;
    } catch (error: any) {
      console.error('Error uploading image:', error);
      setError(error instanceof Error ? error : new Error(error.message || 'Unknown error'));
      toast.error(error.message || 'Failed to upload image');
      return null;
    } finally {
      setIsUploading(false);
    }
  };

  return { uploadImage, isUploading, error };
};
