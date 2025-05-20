
import { supabase } from '@/services/api/supabaseClient';
import { toast } from 'sonner';

interface UploadImageProps {
  file: File;
  folder: string;
}

export const useUploadImage = () => {
  const uploadImage = async ({ file, folder }: UploadImageProps) => {
    try {
      if (!file) {
        throw new Error('No file selected');
      }

      // Generate a unique filename
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '')}`;
      const filePath = `${folder}/${fileName}`;

      // Upload to Supabase Storage with explicit content type
      const { error: uploadError } = await supabase.storage
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
      toast.error(error.message || 'Failed to upload image');
      throw error;
    }
  };

  return { uploadImage };
};
