
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

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
      
      // First make sure the user has the right role/permissions
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('User not authenticated');
      }
      
      // Check if user is an admin
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();
        
      if (profileError) {
        console.error('Error checking user role:', profileError);
        throw new Error('Could not verify user permissions');
      }
      
      if (profile?.role !== 'admin') {
        console.warn('User is not an admin, might not have permission to create buckets');
      }
      
      const { error } = await supabase.storage.createBucket(name, {
        public: true, // Make bucket public so files can be accessed without authentication
        fileSizeLimit: 52428800, // 50MB
        allowedMimeTypes: ['image/*', 'video/*', 'application/pdf']
      });
      
      if (error) {
        console.error(`Error creating bucket ${name}:`, error);
        
        // If we get a permission error, try to add permissions
        if (error.message.includes('permission')) {
          console.info('Attempting to set permissions for bucket...');
          
          // Use SQL to set permissions (this may require the user to be a super admin)
          const { error: sqlError } = await supabase.rpc('create_storage_bucket', { 
            bucket_name: name,
            public_access: true
          });
          
          if (sqlError) {
            console.error('Error creating bucket via RPC:', sqlError);
          } else {
            console.info('Created bucket via RPC');
          }
        }
      }
    }
  } catch (error) {
    console.error(`Error creating bucket ${name}:`, error);
    // Don't throw here, just log the error and continue with other buckets
  }
};

// Main function to ensure all required buckets exist
export const ensureStorageBucketsExist = async (): Promise<void> => {
  try {
    // Check if user is authenticated
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      console.warn('User not authenticated, skipping bucket creation');
      return;
    }
    
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
  } catch (error) {
    console.error(`Error deleting file ${bucketName}/${filePath}:`, error);
    toast.error(`Error deleting file: ${error.message || 'Unknown error'}`);
    return false;
  }
};
