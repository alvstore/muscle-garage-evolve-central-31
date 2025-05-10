
import { supabase } from '@/integrations/supabase/client';

const requiredBuckets = [
  'avatars',
  'documents',
  'equipment',
  'gallery',
  'products',
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

// Function to create a bucket if it doesn't exist
const createBucketIfNotExists = async (name: string): Promise<void> => {
  try {
    const exists = await bucketExists(name);
    
    if (!exists) {
      console.info(`Creating storage bucket: ${name}`);
      const { error } = await supabase.storage.createBucket(name, {
        public: true, // Make bucket public so files can be accessed without authentication
        fileSizeLimit: 52428800, // 50MB
        allowedMimeTypes: ['image/*', 'video/*', 'application/pdf']
      });
      
      if (error) {
        throw error;
      }
      
      // Set public bucket policy after creation
      const { error: policyError } = await supabase
        .storage
        .from(name)
        .createSignedUrl('dummy.txt', 3600);
      
      if (policyError && !policyError.message.includes('Object not found')) {
        console.error(`Error setting policy for bucket ${name}:`, policyError);
      }
    }
  } catch (error) {
    console.error(`Error creating bucket ${name}:`, error);
  }
};

// Main function to ensure all required buckets exist
export const ensureStorageBucketsExist = async (): Promise<void> => {
  try {
    for (const bucket of requiredBuckets) {
      await createBucketIfNotExists(bucket);
    }
    console.info('Storage buckets verified');
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
    // Ensure bucket exists
    await createBucketIfNotExists(bucketName);
    
    // Upload file
    const { data, error } = await supabase
      .storage
      .from(bucketName)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: true
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
  } catch (error) {
    console.error(`Error uploading file to ${bucketName}/${filePath}:`, error);
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
  } catch (error) {
    console.error(`Error deleting file ${bucketName}/${filePath}:`, error);
    return false;
  }
};
