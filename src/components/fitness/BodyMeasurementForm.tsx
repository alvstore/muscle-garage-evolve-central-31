
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { BodyMeasurement } from "@/types/measurements";
import { User } from "@/types";
import { toast } from "sonner";
import { format } from "date-fns";

interface BodyMeasurementFormProps {
  memberId?: string;
  initialData?: Partial<BodyMeasurement>;
  onSave: (data: Partial<BodyMeasurement>) => void;
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
    date: initialData?.date || format(new Date(), "yyyy-MM-dd"),
    memberId: memberId || initialData?.memberId || "",
  });

  const [calculatedBMI, setCalculatedBMI] = useState<number | undefined>(initialData?.bmi);

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields
    if (!formData.memberId) {
      toast.error("Member ID is required");
      return;
    }

    // Prepare data for submission
    const measurementData: Partial<BodyMeasurement> = {
      ...formData,
      bmi: calculatedBMI,
      addedBy: {
        id: currentUser.id,
        role: currentUser.role,
        name: currentUser.name
      }
    };

    onSave(measurementData);
  };

  const getBMICategory = (bmi: number) => {
    if (bmi < 18.5) return { label: "Underweight", color: "text-blue-500" };
    if (bmi < 25) return { label: "Normal", color: "text-green-500" };
    if (bmi < 30) return { label: "Overweight", color: "text-yellow-500" };
    return { label: "Obese", color: "text-red-500" };
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{isEditMode ? "Edit Body Measurements" : "Record Body Measurements"}</CardTitle>
        <CardDescription>
          Enter the member's current body measurements to track their progress
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="height">Height (cm)</Label>
              <Input
                id="height"
                name="height"
                type="number"
                step="0.1"
                placeholder="Height in cm"
                value={formData.height || ""}
                onChange={handleChange}
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
                value={formData.weight || ""}
                onChange={handleChange}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="bmi">BMI (Calculated)</Label>
              <div className="flex items-center space-x-2">
                <Input
                  id="bmi"
                  readOnly
                  value={calculatedBMI?.toString() || ""}
                  className="bg-gray-50"
                />
                {calculatedBMI && (
                  <span className={`text-sm font-medium ${getBMICategory(calculatedBMI).color}`}>
                    {getBMICategory(calculatedBMI).label}
                  </span>
                )}
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="chest">Chest (cm)</Label>
              <Input
                id="chest"
                name="chest"
                type="number"
                step="0.1"
                placeholder="Chest in cm"
                value={formData.chest || ""}
                onChange={handleChange}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="waist">Waist (cm)</Label>
              <Input
                id="waist"
                name="waist"
                type="number"
                step="0.1"
                placeholder="Waist in cm"
                value={formData.waist || ""}
                onChange={handleChange}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="hips">Hips (cm)</Label>
              <Input
                id="hips"
                name="hips"
                type="number"
                step="0.1"
                placeholder="Hips in cm"
                value={formData.hips || ""}
                onChange={handleChange}
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="biceps">Biceps (cm)</Label>
              <Input
                id="biceps"
                name="biceps"
                type="number"
                step="0.1"
                placeholder="Biceps in cm"
                value={formData.biceps || ""}
                onChange={handleChange}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="thighs">Thighs (cm)</Label>
              <Input
                id="thighs"
                name="thighs"
                type="number"
                step="0.1"
                placeholder="Thighs in cm"
                value={formData.thighs || ""}
                onChange={handleChange}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="bodyFat">Body Fat %</Label>
              <Input
                id="bodyFat"
                name="bodyFat"
                type="number"
                step="0.1"
                placeholder="Body fat percentage"
                value={formData.bodyFat || ""}
                onChange={handleChange}
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Input
              id="notes"
              name="notes"
              placeholder="Additional notes about this measurement"
              value={formData.notes || ""}
              onChange={handleChange}
            />
          </div>
          
          <div className="flex justify-end space-x-2">
            {onCancel && (
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancel
              </Button>
            )}
            <Button type="submit">
              {isEditMode ? "Update Measurements" : "Save Measurements"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default BodyMeasurementForm;
