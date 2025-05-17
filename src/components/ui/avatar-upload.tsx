
import { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from './avatar';
import { Button } from './button';
import { Input } from './input';
import { Upload } from 'lucide-react';
import { supabase } from '@/services/api/supabaseClient';
import { toast } from 'sonner';

interface AvatarUploadProps {
  onImageUploaded: (url: string) => void;
  currentImageUrl?: string;
}

export function AvatarUpload({ onImageUploaded, currentImageUrl }: AvatarUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string>(currentImageUrl || '');

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true);
      
      if (!event.target.files || event.target.files.length === 0) {
        throw new Error('You must select an image to upload.');
      }

      const file = event.target.files[0];
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}.${fileExt}`;

      // Upload image to Supabase storage
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(fileName, file, {
          cacheControl: '3600',
          contentType: file.type // Explicitly set content type
        });

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(fileName);

      setPreview(publicUrl);
      onImageUploaded(publicUrl);
      toast.success('Profile picture uploaded successfully');
    } catch (error: any) {
      console.error('Error uploading avatar:', error);
      toast.error(error.message || 'Error uploading image');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <Avatar className="h-24 w-24">
        <AvatarImage src={preview} alt="Profile" />
        <AvatarFallback>
          <Upload className="h-8 w-8 text-muted-foreground" />
        </AvatarFallback>
      </Avatar>
      <Input
        type="file"
        accept="image/*"
        onChange={handleFileUpload}
        disabled={uploading}
        className="hidden"
        id="avatar-upload"
      />
      <Button
        type="button"
        variant="outline"
        onClick={() => document.getElementById('avatar-upload')?.click()}
        disabled={uploading}
      >
        {uploading ? 'Uploading...' : 'Upload Photo'}
      </Button>
    </div>
  );
}
