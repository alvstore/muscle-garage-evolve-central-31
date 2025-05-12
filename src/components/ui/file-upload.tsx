
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FilePlus, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface FileUploadProps {
  onUpload: (file: File) => Promise<void>;
  accept?: string;
  maxFileSize?: number;
  className?: string;
}

export function FileUpload({ 
  onUpload, 
  accept = "image/*", 
  maxFileSize = 5 * 1024 * 1024, // 5MB
  className
}: FileUploadProps) {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState<boolean>(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    
    if (!e.target.files || e.target.files.length === 0) {
      setFile(null);
      setPreviewUrl(null);
      return;
    }
    
    const selectedFile = e.target.files[0];
    
    // Check file size
    if (selectedFile.size > maxFileSize) {
      setError(`File is too large. Maximum size is ${maxFileSize / (1024 * 1024)}MB.`);
      return;
    }
    
    setFile(selectedFile);
    
    // Create preview for image files
    if (selectedFile.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(selectedFile);
    } else {
      setPreviewUrl(null);
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    
    try {
      setIsUploading(true);
      await onUpload(file);
      setFile(null);
      setPreviewUrl(null);
    } catch (error: any) {
      setError(error.message || 'An error occurred during upload');
      toast.error(error.message || 'Upload failed');
      console.error('Upload error:', error);
    } finally {
      setIsUploading(false);
    }
  };

  const clearFile = () => {
    setFile(null);
    setPreviewUrl(null);
    setError(null);
  };

  return (
    <div className={cn("space-y-4", className)}>
      {!file ? (
        <div className="flex flex-col items-center">
          <Label 
            htmlFor="file-upload" 
            className="flex flex-col items-center justify-center w-full p-6 border-2 border-dashed rounded-lg cursor-pointer bg-background hover:bg-muted/50"
          >
            <FilePlus className="w-8 h-8 mb-2 text-muted-foreground" />
            <span className="text-sm font-medium">Choose a file</span>
            <span className="mt-1 text-xs text-muted-foreground">
              {accept === "image/*" ? "Images" : accept.replace(/\./g, '').split(',').join(', ')} 
              up to {maxFileSize / (1024 * 1024)}MB
            </span>
            
            <Input
              id="file-upload"
              type="file"
              accept={accept}
              onChange={handleFileChange}
              className="hidden"
            />
          </Label>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium truncate max-w-[200px]">{file.name}</span>
              <span className="text-xs text-muted-foreground">({(file.size / 1024).toFixed(1)} KB)</span>
            </div>
            
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={clearFile} 
              disabled={isUploading}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          
          {previewUrl && (
            <div className="relative aspect-video w-full max-h-[200px] overflow-hidden rounded-md border">
              <img 
                src={previewUrl} 
                alt="File preview" 
                className="object-contain w-full h-full"
              />
            </div>
          )}
          
          {error && (
            <div className="text-sm text-red-500">{error}</div>
          )}
          
          <div className="flex justify-end space-x-2">
            <Button variant="default" onClick={handleUpload} disabled={isUploading}>
              {isUploading ? "Uploading..." : "Upload"}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
