
import { supabase } from '@/integrations/supabase/client';

export const ensureStorageBucketsExist = async () => {
  try {
    // Check if documents bucket exists
    const { data: buckets } = await supabase.storage.listBuckets();
    
    // Create documents bucket if it doesn't exist
    if (!buckets?.find(bucket => bucket.name === 'documents')) {
      await supabase.storage.createBucket('documents', {
        public: true,
        fileSizeLimit: 5242880 // 5MB in bytes
      });
      console.log('Created documents bucket');
    }
    
    return true;
  } catch (error) {
    console.error('Error ensuring storage buckets exist:', error);
    return false;
  }
};
