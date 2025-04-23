
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Image, Upload, X } from 'lucide-react';
import { toast } from 'sonner';

interface ImageUploadProps {
  value: string;
  onChange: (value: string) => void;
  onRemove: () => void;
}

export const ImageUpload = ({ value, onChange, onRemove }: ImageUploadProps) => {
  const [loading, setLoading] = useState(false);

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    
    if (!file) return;
    
    if (!file.type.includes('image')) {
      toast.error('File must be an image');
      return;
    }
    
    setLoading(true);
    
    // In a real implementation, you would use your backend/storage solution
    // This is a mock that simulates file upload after a delay
    setTimeout(() => {
      // This creates a local data URL as a mock for the uploaded image
      const reader = new FileReader();
      reader.onloadend = () => {
        onChange(reader.result as string);
        setLoading(false);
        toast.success('Image uploaded successfully');
      };
      reader.readAsDataURL(file);
    }, 1000);
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => document.getElementById('imageUpload')?.click()}
          disabled={loading}
          className="flex gap-2"
        >
          <Upload className="h-4 w-4" />
          {loading ? 'Uploading...' : 'Upload Image'}
        </Button>
        <Input
          id="imageUpload"
          type="file"
          accept="image/*"
          onChange={handleUpload}
          className="hidden"
        />
        {value && !loading && (
          <Button
            type="button"
            variant="outline"
            onClick={onRemove}
            className="flex gap-2"
          >
            <X className="h-4 w-4" />
            Remove
          </Button>
        )}
      </div>
      {value && (
        <div className="relative aspect-video w-full max-w-[400px] overflow-hidden rounded-md border">
          {value.startsWith('data:') || value.startsWith('http') ? (
            <img src={value} alt="Uploaded" className="object-cover" />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-secondary">
              <Image className="h-10 w-10 text-muted-foreground" />
              <span className="ml-2 text-sm text-muted-foreground">{value}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
