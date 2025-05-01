import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FilePlus, X } from "lucide-react";
import { cn } from "@/lib/utils";

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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    // Check file size
    if (selectedFile.size > maxFileSize) {
      setError(`File size must be less than ${maxFileSize / 1024 / 1024}MB`);
      return;
    }

    // Check file type
    if (accept && !accept.split(',').some(type => selectedFile.type.includes(type))) {
      setError(`Invalid file type. Please upload ${accept} files.`);
      return;
    }

    setError(null);
    setFile(selectedFile);
    setPreviewUrl(URL.createObjectURL(selectedFile));
  };

  const handleRemove = () => {
    setFile(null);
    setPreviewUrl(null);
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;
    await onUpload(file);
    handleRemove();
  };

  return (
    <div className={cn("relative", className)}>
      <form onSubmit={handleSubmit} className="space-y-2">
        <div className="flex items-center gap-2">
          <Label htmlFor="file-upload" className="text-sm">
            Upload Image
          </Label>
          {error && (
            <span className="text-sm text-red-500">{error}</span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Input
            id="file-upload"
            type="file"
            accept={accept}
            onChange={handleFileChange}
            className="hidden"
          />
          <Button
            variant="outline"
            type="button"
            onClick={() => document.getElementById("file-upload")?.click()}
          >
            <FilePlus className="h-4 w-4 mr-2" />
            {file ? "Change" : "Upload"}
          </Button>
          {file && (
            <Button
              variant="destructive"
              type="button"
              onClick={handleRemove}
              className="ml-2"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </form>
      {previewUrl && (
        <div className="mt-2">
          <img 
            src={previewUrl} 
            alt="Preview" 
            className="w-32 h-32 object-cover rounded-md"
          />
        </div>
      )}
    </div>
  );
}
