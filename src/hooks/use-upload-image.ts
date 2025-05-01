import { supabase } from '@/lib/supabaseClient';
import { toast } from 'sonner';

interface UploadImageProps {
  file: File;
  folder: string;
}

export const useUploadImage = () => {
  const uploadImage = async ({ file, folder }: UploadImageProps) => {
    try {
      // Generate a unique filename
      const fileName = `${Date.now()}-${file.name}`;
      const filePath = `${folder}/${fileName}`;

      // Upload to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('images')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) {
        throw new Error('Failed to upload image');
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
