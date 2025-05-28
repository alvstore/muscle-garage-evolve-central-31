
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

// Function to check if bucket exists and is accessible
const bucketExists = async (name: string): Promise<{ exists: boolean; error?: string }> => {
  try {
    // Try to list files in the bucket (with minimal data transfer)
    const { data, error } = await supabase
      .storage
      .from(name)
      .list('', { limit: 1, offset: 0 });
    
    if (error) {
      // Check if the error is specifically about the bucket not existing
      if (error.message?.includes('Bucket not found') || error.message?.includes('not found')) {
        return { exists: false, error: 'Bucket does not exist' };
      }
      // For permission errors
      if (error.message?.includes('permission denied') || error.message?.includes('not authorized')) {
        return { 
          exists: false, 
          error: 'Permission denied. Please check your storage permissions.' 
        };
      }
      return { exists: false, error: error.message || 'Unknown error' };
    }
    
    // If we get here, the bucket exists and is accessible
    return { exists: true };
  } catch (error) {
    console.error(`Error checking bucket ${name}:`, error);
    return { 
      exists: false, 
      error: error instanceof Error ? error.message : 'Unknown error occurred' 
    };
  }
};

// Function to check if a bucket is accessible and return basic info
const getBucketMetadata = async (name: string) => {
  try {
    // Try to list files in the bucket (this only requires anon access)
    const { data, error } = await supabase.storage.from(name).list('', {
      limit: 1, // Just get one file to minimize data transfer
      offset: 0,
    });
    
    if (error) {
      return null;
    }
    
    // Return a simplified metadata object
    return {
      name,
      id: name,
      public: true, // Assuming public access since we can list files
      createdAt: new Date().toISOString(),
      // We don't have actual metadata, but this is enough for most use cases
    };
  } catch (error) {
    return null;
  }
};

// Main function to verify storage buckets exist
export const ensureStorageBucketsExist = async (): Promise<void> => {
  try {
    // Check if user is authenticated
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      console.log('User not authenticated, skipping bucket check');
      return;
    }
    
    // Check if buckets are accessible
    const results = await Promise.all(
      requiredBuckets.map(async (bucket) => {
        const { exists, error } = await bucketExists(bucket);
        return { bucket, exists, error };
      })
    );
    
    // Show warnings for any inaccessible buckets
    const inaccessibleBuckets = results.filter(r => !r.exists);
    if (inaccessibleBuckets.length > 0) {
      console.warn('Some storage buckets are not accessible:', inaccessibleBuckets);
      
      // Show a single toast for all inaccessible buckets
      const bucketList = inaccessibleBuckets.map(b => b.bucket).join(', ');
      const errorMessage = inaccessibleBuckets[0].error || 'Bucket not accessible';
      
      toast.warning({
        title: `Storage buckets not accessible: ${bucketList}`,
        description: errorMessage
      });
      
      // Log detailed errors for debugging
      inaccessibleBuckets.forEach(({ bucket, error }) => {
        console.error(`Bucket ${bucket} error:`, error);
      });
    }
  } catch (error) {
    console.error('Error in ensureStorageBucketsExist:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    toast.error(`Error checking storage buckets: ${errorMessage}`);
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
    toast.error(`Error deleting file: ${error.message || 'Unknown error'}`);
    return false;
  }
};
