import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/sonner';

const requiredBuckets = [
  'avatars',
  'documents',
  'products',
  'equipment',
  'gallery',
  'trainers',
  'workouts'
];

// Function to check if bucket exists
const bucketExists = async (name: string): Promise<boolean> => {
  try {
    const { data, error } = await supabase
      .storage
      .getBucket(name);
    
    return !error && !!data;
  } catch (error) {
    console.error(`Error checking if bucket ${name} exists:`, error);
    return false;
  }
};

// Function to get bucket metadata without needing to create it
const getBucketMetadata = async (name: string) => {
  try {
    const { data, error } = await supabase.storage.getBucket(name);
    if (error) {
      console.error(`Error getting bucket metadata for ${name}:`, error);
      return null;
    }
    return data;
  } catch (error) {
    console.error(`Exception getting bucket metadata for ${name}:`, error);
    return null;
  }
};

// Main function to verify storage buckets exist
export const ensureStorageBucketsExist = async (): Promise<void> => {
  try {
    // Check if user is authenticated
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      console.warn('User not authenticated, skipping bucket verification');
      return;
    }
    
    // Just check if buckets exist but don't try to create them
    // since bucket creation requires admin privileges
    for (const bucket of requiredBuckets) {
      const exists = await bucketExists(bucket);
      if (!exists) {
        console.warn(`Storage bucket ${bucket} does not exist. Admin needs to create it.`);
      } else {
        console.info(`Storage bucket ${bucket} exists.`);
      }
    }
    console.info('Storage bucket verification complete');
  } catch (error) {
    console.error('Error ensuring storage buckets exist:', error);
  }
};

// Function to upload a file to storage
export const uploadFile = async (
  bucketName: string, 
  filePath: string, 
  file: File
): Promise<string | null> => {
  try {
    // Verify bucket exists
    const bucketMetadata = await getBucketMetadata(bucketName);
    if (!bucketMetadata) {
      toast.error(`Storage bucket ${bucketName} not found. Please contact admin.`);
      return null;
    }
    
    // Upload file
    const { data, error } = await supabase
      .storage
      .from(bucketName)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: true,
        contentType: file.type // Explicitly set content-type from file
      });
    
    if (error) {
      throw error;
    }
    
    // Get public URL
    const { data: urlData } = supabase
      .storage
      .from(bucketName)
      .getPublicUrl(data.path);
    
    return urlData.publicUrl;
  } catch (error: any) {
    console.error(`Error uploading file to ${bucketName}/${filePath}:`, error);
    toast.error(`Error uploading file: ${error.message || 'Unknown error'}`);
    return null;
  }
};

// Function to delete a file from storage
export const deleteFile = async (
  bucketName: string,
  filePath: string
): Promise<boolean> => {
  try {
    const { error } = await supabase
      .storage
      .from(bucketName)
      .remove([filePath]);
    
    if (error) {
      throw error;
    }
    
    return true;
  } catch (error: any) {
    console.error(`Error deleting file ${bucketName}/${filePath}:`, error);
    toast.error(`Error deleting file: ${error.message || 'Unknown error'}`);
    return false;
  }
};
