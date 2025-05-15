
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

/**
 * Verify if storage bucket exists and create it if needed
 */
export const ensureBucketExists = async (bucketName: string): Promise<boolean> => {
  try {
    // First check if bucket exists
    const { data: buckets, error: bucketError } = await supabase
      .storage
      .listBuckets();
    
    if (bucketError) {
      console.error('Error checking buckets:', bucketError);
      return false;
    }
    
    const bucketExists = buckets.some(bucket => bucket.name === bucketName);
    
    // If bucket doesn't exist, create it
    if (!bucketExists) {
      console.log(`Bucket '${bucketName}' not found, creating...`);
      const { error: createError } = await supabase
        .storage
        .createBucket(bucketName, {
          public: true, // Make files publicly accessible by default
        });
      
      if (createError) {
        // If we hit an error here, it might be a permission issue or RLS policy
        console.error(`Error creating bucket '${bucketName}':`, createError);
        return false;
      }
      
      console.log(`Bucket '${bucketName}' created successfully`);
    } else {
      console.log(`Bucket '${bucketName}' already exists`);
    }
    
    return true;
  } catch (error) {
    console.error('Error in ensureBucketExists:', error);
    return false;
  }
};

/**
 * Upload file to storage
 */
export const uploadFile = async (
  bucketName: string, 
  filePath: string,
  file: File,
  contentType?: string
): Promise<string | null> => {
  try {
    // Ensure bucket exists first
    const bucketExists = await ensureBucketExists(bucketName);
    if (!bucketExists) {
      toast.error(`Storage bucket '${bucketName}' not accessible`);
      return null;
    }
    
    // Upload the file
    const { data, error } = await supabase.storage
      .from(bucketName)
      .upload(filePath, file, {
        contentType: contentType || file.type,
        upsert: true
      });
    
    if (error) {
      console.error('Error uploading file:', error);
      return null;
    }
    
    // Get public URL
    const { data: publicUrlData } = supabase.storage
      .from(bucketName)
      .getPublicUrl(data.path);
    
    return publicUrlData.publicUrl;
  } catch (error) {
    console.error('Error in uploadFile:', error);
    return null;
  }
};

/**
 * Delete file from storage
 */
export const deleteFile = async (
  bucketName: string, 
  filePath: string
): Promise<boolean> => {
  try {
    const { error } = await supabase.storage
      .from(bucketName)
      .remove([filePath]);
    
    if (error) {
      console.error('Error deleting file:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error in deleteFile:', error);
    return false;
  }
};

/**
 * Extract file path from URL
 */
export const getFilePathFromUrl = (url: string, bucketName: string): string | null => {
  try {
    const urlObj = new URL(url);
    const pathSegments = urlObj.pathname.split('/');
    
    // Find position of bucket name in path
    const bucketIndex = pathSegments.findIndex(segment => segment === bucketName);
    if (bucketIndex === -1) return null;
    
    // Return path segments after bucket name
    return pathSegments.slice(bucketIndex + 1).join('/');
  } catch (error) {
    console.error('Error parsing URL:', error);
    return null;
  }
};
