
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { BodyMeasurement } from "@/types/measurements";
import { User } from "@/types";
import { toast } from "sonner";
import { format } from "date-fns";
import { Switch } from "@/components/ui/switch";
import { ImagePlus, Trash2, Upload } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { supabase } from "@/integrations/supabase/client";

interface BodyMeasurementFormProps {
  memberId?: string;
  initialData?: Partial<BodyMeasurement>;
  onSave: (data: Partial<BodyMeasurement> & { photos?: string[] }) => void;
  onCancel?: () => void;
  currentUser: User;
  isEditMode?: boolean;
}

const BodyMeasurementForm: React.FC<BodyMeasurementFormProps> = ({
  memberId,
  initialData,
  onSave,
  onCancel,
  currentUser,
  isEditMode = false
}) => {
  const [formData, setFormData] = useState<Partial<BodyMeasurement>>({
    height: initialData?.height || undefined,
    weight: initialData?.weight || undefined,
    chest: initialData?.chest || undefined,
    waist: initialData?.waist || undefined,
    hips: initialData?.hips || undefined,
    biceps: initialData?.biceps || undefined,
    thighs: initialData?.thighs || undefined,
    bodyFat: initialData?.bodyFat || undefined,
    notes: initialData?.notes || "",
    date: format(new Date(), "yyyy-MM-dd"), // Always use current date
    memberId: memberId || initialData?.memberId || "",
  });

  const [calculatedBMI, setCalculatedBMI] = useState<number | undefined>(initialData?.bmi);
  const [includePhotos, setIncludePhotos] = useState<boolean>(false);
  const [photos, setPhotos] = useState<File[]>([]);
  const [photoUrls, setPhotoUrls] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Calculate BMI when height or weight changes
  useEffect(() => {
    if (formData.height && formData.weight) {
      const heightInMeters = formData.height / 100;
      const bmi = formData.weight / (heightInMeters * heightInMeters);
      setCalculatedBMI(parseFloat(bmi.toFixed(1)));
    } else {
      setCalculatedBMI(undefined);
    }
  }, [formData.height, formData.weight]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === "notes" ? value : value ? parseFloat(value) : undefined
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files);
      setPhotos(prev => [...prev, ...newFiles]);
      
      // Create preview URLs for the new files
      const newUrls = newFiles.map(file => URL.createObjectURL(file));
      setPhotoUrls(prev => [...prev, ...newUrls]);
    }
  };

  const removePhoto = (index: number) => {
    setPhotos(prev => prev.filter((_, i) => i !== index));
    
    // Revoke the object URL to avoid memory leaks
    URL.revokeObjectURL(photoUrls[index]);
    setPhotoUrls(prev => prev.filter((_, i) => i !== index));
  };

  const uploadPhotos = async (): Promise<string[]> => {
    if (photos.length === 0) return [];
    
    const uploadedUrls: string[] = [];
    setIsUploading(true);
    
    try {
      for (const photo of photos) {
        const fileName = `${memberId || formData.memberId}/measurements/${Date.now()}-${photo.name}`;
        
        const { data, error } = await supabase.storage
          .from('fitness-photos')
          .upload(fileName, photo, {
            cacheControl: '3600',
            upsert: false
          });
        
        if (error) throw error;
        
        // Get the public URL for the uploaded file
        const { data: urlData } = supabase.storage
          .from('fitness-photos')
          .getPublicUrl(data.path);
        
        uploadedUrls.push(urlData.publicUrl);
      }
      
      return uploadedUrls;
    } catch (error) {
      console.error('Error uploading photos:', error);
      toast.error('Failed to upload photos');
      return [];
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // Validate required fields
    if (!formData.weight || !formData.height) {
      toast.error('Weight and height are required');
      return;
    }
    
    setIsSubmitting(true);
    try {
      // Upload photos if included
      let photoUrlsToSave: string[] = [];
      if (includePhotos && photos.length > 0) {
        photoUrlsToSave = await uploadPhotos();
      }
      
      // Add calculated BMI to the form data
      const finalData = {
        ...formData,
        bmi: calculatedBMI,
        photos: photoUrlsToSave.length > 0 ? photoUrlsToSave : undefined
      };
      
      onSave(finalData);
    } catch (error) {
      console.error('Error saving measurements:', error);
      toast.error('Failed to save measurements');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto overflow-hidden">
      <CardHeader className="p-4 sm:p-6">
        <CardTitle className="text-xl">{isEditMode ? "Edit Body Measurements" : "Record Body Measurements"}</CardTitle>
        <CardDescription>
          Enter the member's current body measurements to track their progress
        </CardDescription>
      </CardHeader>
      <CardContent className="p-4 sm:p-6 overflow-y-auto max-h-[80vh]">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-4">
            <div className="space-y-1 sm:space-y-2">
              <Label htmlFor="weight" className="text-sm">Weight (kg)</Label>
              <Input
                id="weight"
                name="weight"
                type="number"
                step="0.1"
                min="0"
                value={formData.weight || ""}
                onChange={handleChange}
                className="h-9"
              />
            </div>
            <div className="space-y-1 sm:space-y-2">
              <Label htmlFor="height" className="text-sm">Height (cm)</Label>
              <Input
                id="height"
                name="height"
                type="number"
                step="0.1"
                min="0"
                value={formData.height || ""}
                onChange={handleChange}
                className="h-9"
              />
            </div>
          </div>
          
          <div className="mb-4">
            <Label htmlFor="date" className="block mb-2">Measurement Date</Label>
            <div className="text-sm text-muted-foreground">
              {format(new Date(), "MMMM dd, yyyy")} (Today)
            </div>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
            <div className="space-y-1 sm:space-y-2">
              <Label htmlFor="chest" className="text-sm">Chest (cm)</Label>
              <Input
                id="chest"
                name="chest"
                type="number"
                step="0.1"
                placeholder="Chest in cm"
                value={formData.chest || ""}
                onChange={handleChange}
                className="h-9"
              />
            </div>
            
            <div className="space-y-1 sm:space-y-2">
              <Label htmlFor="waist" className="text-sm">Waist (cm)</Label>
              <Input
                id="waist"
                name="waist"
                type="number"
                step="0.1"
                placeholder="Waist in cm"
                value={formData.waist || ""}
                onChange={handleChange}
                className="h-9"
              />
            </div>
            
            <div className="space-y-1 sm:space-y-2">
              <Label htmlFor="hips" className="text-sm">Hips (cm)</Label>
              <Input
                id="hips"
                name="hips"
                type="number"
                step="0.1"
                placeholder="Hips in cm"
                value={formData.hips || ""}
                onChange={handleChange}
                className="h-9"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
            <div className="space-y-1 sm:space-y-2">
              <Label htmlFor="biceps" className="text-sm">Biceps (cm)</Label>
              <Input
                id="biceps"
                name="biceps"
                type="number"
                step="0.1"
                placeholder="Biceps in cm"
                value={formData.biceps || ""}
                onChange={handleChange}
                className="h-9"
              />
            </div>
            
            <div className="space-y-1 sm:space-y-2">
              <Label htmlFor="thighs" className="text-sm">Thighs (cm)</Label>
              <Input
                id="thighs"
                name="thighs"
                type="number"
                step="0.1"
                placeholder="Thighs in cm"
                value={formData.thighs || ""}
                onChange={handleChange}
                className="h-9"
              />
            </div>
            
            <div className="space-y-1 sm:space-y-2">
              <Label htmlFor="bodyFat" className="text-sm">Body Fat %</Label>
              <Input
                id="bodyFat"
                name="bodyFat"
                type="number"
                step="0.1"
                placeholder="Body fat percentage"
                value={formData.bodyFat || ""}
                onChange={handleChange}
                className="h-9"
              />
            </div>
          </div>
          
          <div className="mb-4">
            <Label htmlFor="notes" className="text-sm">Notes</Label>
            <textarea
              id="notes"
              name="notes"
              className="w-full p-2 border rounded-md mt-1 text-sm sm:text-base"
              rows={3}
              value={formData.notes || ""}
              onChange={(e) => handleChange({
                target: {
                  name: "notes",
                  value: e.target.value
                }
              } as React.ChangeEvent<HTMLInputElement>)}
              placeholder="Any additional notes about the measurement"
            />
          </div>
          
          <Separator className="my-4" />
          
          <div className="mb-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="include-photos" className="font-medium">Include Photos</Label>
              <Switch 
                id="include-photos" 
                checked={includePhotos} 
                onCheckedChange={setIncludePhotos} 
              />
            </div>
            
            {includePhotos && (
              <div className="mt-4">
                <div className="flex items-center gap-2 mb-2">
                  <Label htmlFor="photo-upload" className="cursor-pointer">
                    <div className="flex items-center gap-2 px-4 py-2 border rounded-md hover:bg-gray-50">
                      <ImagePlus className="h-4 w-4" />
                      <span>Add Photos</span>
                    </div>
                    <input
                      id="photo-upload"
                      type="file"
                      accept="image/*"
                      multiple
                      className="hidden"
                      onChange={handleFileChange}
                    />
                  </Label>
                  <span className="text-xs text-muted-foreground">
                    Upload before/after photos
                  </span>
                </div>
                
                {photoUrls.length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
                    {photoUrls.map((url, index) => (
                      <div key={index} className="relative group">
                        <img 
                          src={url} 
                          alt={`Photo ${index + 1}`} 
                          className="w-full h-24 object-cover rounded-md border"
                        />
                        <button
                          type="button"
                          className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => removePhoto(index)}
                        >
                          <Trash2 className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
          
          <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2 mt-6">
            {onCancel && (
              <Button 
                type="button" 
                variant="outline" 
                onClick={onCancel} 
                className="w-full sm:w-auto"
              >
                Cancel
              </Button>
            )}
            <Button 
              type="submit" 
              disabled={isSubmitting || isUploading}
              className="w-full sm:w-auto"
            >
              {isSubmitting || isUploading ? (
                <>
                  <span className="animate-spin mr-2">⏳</span>
                  {isUploading ? 'Uploading...' : 'Saving...'}
                </>
              ) : (
                <>{isEditMode ? "Update" : "Save"} Measurements</>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default BodyMeasurementForm;
