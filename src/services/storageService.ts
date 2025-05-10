
import { supabase } from '@/integrations/supabase/client';

/**
 * Ensures that the required storage buckets exist in Supabase
 * This should be called when the application starts or when a user logs in
 */
export const ensureStorageBucketsExist = async () => {
  try {
    // List of buckets we need for our application
    const requiredBuckets = [
      'avatars',       // For user profile images
      'documents',     // For staff/member documents and IDs
      'equipment',     // For equipment images
      'gallery',       // For gym photos gallery
      'products',      // For store product images
      'trainers',      // For trainer profile images
      'workouts',      // For workout exercise images/videos
    ];

    // Get existing buckets
    const { data: buckets, error } = await supabase.storage.listBuckets();
    
    if (error) {
      console.error('Error listing storage buckets:', error);
      return;
    }

    // Get bucket names
    const existingBucketNames = buckets.map(bucket => bucket.name);

    // Create missing buckets
    for (const bucketName of requiredBuckets) {
      if (!existingBucketNames.includes(bucketName)) {
        console.log(`Creating storage bucket: ${bucketName}`);
        try {
          const { error } = await supabase.storage.createBucket(bucketName, {
            public: true,  // Allow public access to files
            fileSizeLimit: 5242880, // 5MB limit
          });
          
          if (error) {
            console.error(`Error creating bucket ${bucketName}:`, error);
          }
        } catch (err) {
          console.error(`Error creating bucket ${bucketName}:`, err);
        }
      }
    }
    
    console.log('Storage buckets verified');
  } catch (error) {
    console.error('Error ensuring storage buckets exist:', error);
  }
};

/**
 * Uploads a file to a specified Supabase storage bucket
 * @param bucketName - The name of the bucket to upload to
 * @param filePath - The path within the bucket to store the file
 * @param file - The file to upload
 * @returns The URL of the uploaded file
 */
export const uploadFile = async (bucketName: string, filePath: string, file: File) => {
  try {
    const { data, error } = await supabase.storage
      .from(bucketName)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: true
      });

    if (error) {
      throw error;
    }

    // Get the public URL for the file
    const { data: publicUrlData } = supabase.storage
      .from(bucketName)
      .getPublicUrl(filePath);

    return publicUrlData.publicUrl;
  } catch (error) {
    console.error(`Error uploading file to ${bucketName}/${filePath}:`, error);
    throw error;
  }
};

/**
 * Deletes a file from a Supabase storage bucket
 * @param bucketName - The name of the bucket
 * @param filePath - The path of the file to delete
 */
export const deleteFile = async (bucketName: string, filePath: string) => {
  try {
    const { error } = await supabase.storage
      .from(bucketName)
      .remove([filePath]);

    if (error) {
      throw error;
    }
    
    return true;
  } catch (error) {
    console.error(`Error deleting file ${bucketName}/${filePath}:`, error);
    throw error;
  }
};

/**
 * Gets a list of files in a directory within a bucket
 * @param bucketName - The name of the bucket
 * @param directory - The directory path to list
 */
export const listFiles = async (bucketName: string, directory: string = '') => {
  try {
    const { data, error } = await supabase.storage
      .from(bucketName)
      .list(directory);

    if (error) {
      throw error;
    }

    return data;
  } catch (error) {
    console.error(`Error listing files in ${bucketName}/${directory}:`, error);
    throw error;
  }
};
