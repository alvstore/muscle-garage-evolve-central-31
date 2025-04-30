
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { BodyMeasurement } from '@/types/measurements';
import { toast } from 'sonner';
import { Label } from '@/components/ui/label';

interface BodyMeasurementFormProps {
  memberId?: string;
  currentUser: any;
  onSave: (measurement: Partial<BodyMeasurement>) => Promise<void>;
  initialData?: Partial<BodyMeasurement>;
}

const BodyMeasurementForm: React.FC<BodyMeasurementFormProps> = ({ 
  memberId, 
  currentUser,
  onSave,
  initialData
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<Partial<BodyMeasurement>>(initialData || {
    memberId: memberId || '',
    date: new Date().toISOString().slice(0, 10),
    weight: undefined,
    height: undefined,
    body_fat_percentage: undefined,
    bmi: undefined,
    chest: undefined,
    waist: undefined,
    arms: undefined,
    thighs: undefined,
    hips: undefined,
    notes: '',
    addedBy: {
      id: currentUser?.id || '',
      role: currentUser?.role || '',
      name: currentUser?.name || currentUser?.full_name || '',
    }
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const calculateBMI = () => {
    if (formData.weight && formData.height) {
      // Height in meters (convert from cm)
      const heightInMeters = Number(formData.height) / 100;
      const weight = Number(formData.weight);
      
      // BMI = weight (kg) / (height (m))^2
      const bmi = weight / (heightInMeters * heightInMeters);
      
      setFormData(prev => ({ 
        ...prev, 
        bmi: parseFloat(bmi.toFixed(2)) 
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.memberId) {
      toast.error("Member ID is required");
      return;
    }

    try {
      setIsSubmitting(true);

      const dataToSubmit = {
        ...formData,
        weight: formData.weight ? Number(formData.weight) : undefined,
        height: formData.height ? Number(formData.height) : undefined,
        body_fat_percentage: formData.body_fat_percentage ? Number(formData.body_fat_percentage) : undefined,
        bmi: formData.bmi ? Number(formData.bmi) : undefined,
        chest: formData.chest ? Number(formData.chest) : undefined,
        waist: formData.waist ? Number(formData.waist) : undefined,
        arms: formData.arms ? Number(formData.arms) : undefined,
        thighs: formData.thighs ? Number(formData.thighs) : undefined,
        hips: formData.hips ? Number(formData.hips) : undefined
      };
      
      await onSave(dataToSubmit);
      
      // Reset form after successful save
      setFormData({
        ...formData,
        weight: undefined,
        height: undefined,
        body_fat_percentage: undefined,
        bmi: undefined,
        chest: undefined,
        waist: undefined,
        arms: undefined,
        thighs: undefined,
        hips: undefined,
        notes: '',
      });
      
      toast.success("Measurement saved successfully");
    } catch (error) {
      console.error("Error saving measurement:", error);
      toast.error("Failed to save measurement");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Record Body Measurements</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                name="date"
                type="date"
                value={formData.date?.toString().slice(0, 10)}
                onChange={handleInputChange}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="weight">Weight (kg)</Label>
              <Input
                id="weight"
                name="weight"
                type="number"
                step="0.1"
                placeholder="Weight in kg"
                value={formData.weight || ''}
                onChange={handleInputChange}
                onBlur={calculateBMI}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="height">Height (cm)</Label>
              <Input
                id="height"
                name="height"
                type="number"
                step="0.1"
                placeholder="Height in cm"
                value={formData.height || ''}
                onChange={handleInputChange}
                onBlur={calculateBMI}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="bmi">BMI (Calculated)</Label>
              <Input
                id="bmi"
                name="bmi"
                type="number"
                step="0.01"
                placeholder="BMI"
                value={formData.bmi || ''}
                onChange={handleInputChange}
                readOnly
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="body_fat_percentage">Body Fat (%)</Label>
              <Input
                id="body_fat_percentage"
                name="body_fat_percentage"
                type="number"
                step="0.1"
                placeholder="Body fat percentage"
                value={formData.body_fat_percentage || ''}
                onChange={handleInputChange}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="chest">Chest (cm)</Label>
              <Input
                id="chest"
                name="chest"
                type="number"
                step="0.1"
                placeholder="Chest circumference in cm"
                value={formData.chest || ''}
                onChange={handleInputChange}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="waist">Waist (cm)</Label>
              <Input
                id="waist"
                name="waist"
                type="number"
                step="0.1"
                placeholder="Waist circumference in cm"
                value={formData.waist || ''}
                onChange={handleInputChange}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="hips">Hips (cm)</Label>
              <Input
                id="hips"
                name="hips"
                type="number"
                step="0.1"
                placeholder="Hips circumference in cm"
                value={formData.hips || ''}
                onChange={handleInputChange}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="arms">Arms (cm)</Label>
              <Input
                id="arms"
                name="arms"
                type="number"
                step="0.1"
                placeholder="Arms circumference in cm"
                value={formData.arms || ''}
                onChange={handleInputChange}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="thighs">Thighs (cm)</Label>
              <Input
                id="thighs"
                name="thighs"
                type="number"
                step="0.1"
                placeholder="Thighs circumference in cm"
                value={formData.thighs || ''}
                onChange={handleInputChange}
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              name="notes"
              placeholder="Additional notes or observations"
              value={formData.notes || ''}
              onChange={handleInputChange}
              rows={3}
            />
          </div>
          
          <Button 
            type="submit" 
            className="w-full"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Saving..." : "Save Measurement"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default BodyMeasurementForm;
