
import React, { useState } from 'react';
import { BodyMeasurement, MeasurementFormData } from '@/types/measurements';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface BodyMeasurementFormProps {
  memberId: string;
  onSubmit: (data: MeasurementFormData) => void;
  onCancel: () => void;
  initialData?: Partial<BodyMeasurement>;
}

const BodyMeasurementForm: React.FC<BodyMeasurementFormProps> = ({
  memberId,
  onSubmit,
  onCancel,
  initialData = {}
}) => {
  const [formData, setFormData] = useState<Partial<BodyMeasurement>>({
    height: initialData.height || undefined,
    weight: initialData.weight || undefined,
    body_fat_percentage: initialData.body_fat_percentage || undefined,
    chest: initialData.chest || undefined,
    waist: initialData.waist || undefined,
    arms: initialData.arms || undefined,
    hips: initialData.hips || undefined,
    thighs: initialData.thighs || undefined,
    notes: initialData.notes || '',
    member_id: memberId
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate that member_id exists
    if (!formData.member_id) {
      console.error('Member ID is required');
      return;
    }

    const measurementData: MeasurementFormData = {
      height: formData.height,
      weight: formData.weight,
      chest: formData.chest,
      waist: formData.waist,
      arms: formData.arms,
      hips: formData.hips,
      thighs: formData.thighs,
      body_fat_percentage: formData.body_fat_percentage,
      notes: formData.notes
    };

    onSubmit(measurementData);
  };

  const handleNumberChange = (field: keyof BodyMeasurement, value: string) => {
    const numValue = value === '' ? undefined : parseFloat(value);
    setFormData(prev => ({ ...prev, [field]: numValue }));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Body Measurements</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="height">Height (cm)</Label>
              <Input
                id="height"
                type="number"
                step="0.1"
                value={formData.height || ''}
                onChange={(e) => handleNumberChange('height', e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="weight">Weight (kg)</Label>
              <Input
                id="weight"
                type="number"
                step="0.1"
                value={formData.weight || ''}
                onChange={(e) => handleNumberChange('weight', e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="chest">Chest (cm)</Label>
              <Input
                id="chest"
                type="number"
                step="0.1"
                value={formData.chest || ''}
                onChange={(e) => handleNumberChange('chest', e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="waist">Waist (cm)</Label>
              <Input
                id="waist"
                type="number"
                step="0.1"
                value={formData.waist || ''}
                onChange={(e) => handleNumberChange('waist', e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label htmlFor="arms">Arms (cm)</Label>
              <Input
                id="arms"
                type="number"
                step="0.1"
                value={formData.arms || ''}
                onChange={(e) => handleNumberChange('arms', e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="hips">Hips (cm)</Label>
              <Input
                id="hips"
                type="number"
                step="0.1"
                value={formData.hips || ''}
                onChange={(e) => handleNumberChange('hips', e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="thighs">Thighs (cm)</Label>
              <Input
                id="thighs"
                type="number"
                step="0.1"
                value={formData.thighs || ''}
                onChange={(e) => handleNumberChange('thighs', e.target.value)}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="body_fat_percentage">Body Fat (%)</Label>
            <Input
              id="body_fat_percentage"
              type="number"
              step="0.1"
              value={formData.body_fat_percentage || ''}
              onChange={(e) => handleNumberChange('body_fat_percentage', e.target.value)}
            />
          </div>

          <div>
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={formData.notes || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              placeholder="Additional notes about measurements..."
            />
          </div>

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button type="submit">
              Save Measurements
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default BodyMeasurementForm;
