import React from 'react';
import { User } from '@/types';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { toast } from 'sonner';

export interface BodyMeasurementFormProps {
  memberId: string;
  currentUser: User;
  onSave: () => void;
}

interface MeasurementFormData {
  weight?: number;
  height?: number;
  chest?: number;
  waist?: number;
  hips?: number;
  biceps?: number;
  thighs?: number;
  bodyFat?: number;
  notes?: string;
}

const BodyMeasurementForm: React.FC<BodyMeasurementFormProps> = ({ memberId, currentUser, onSave }) => {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<MeasurementFormData>();

  const onSubmitForm = async (data: MeasurementFormData) => {
    try {
      // In a real app, this would call an API to save the measurement
      console.log('Saving measurement:', {
        ...data,
        memberId,
        date: new Date().toISOString(),
        addedBy: {
          id: currentUser.id,
          role: currentUser.role,
          name: currentUser.name,
        },
      });
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      toast.success('Measurement saved successfully');
      onSave();
    } catch (error) {
      console.error('Error saving measurement:', error);
      toast.error('Failed to save measurement');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmitForm)}>
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="weight">Weight (kg)</Label>
            <Input
              id="weight"
              type="number"
              step="0.1"
              placeholder="0.0"
              {...register('weight', {
                min: { value: 20, message: 'Weight must be at least 20kg' },
                max: { value: 300, message: 'Weight must be less than 300kg' },
              })}
            />
            {errors.weight && (
              <p className="text-sm text-destructive">{errors.weight.message}</p>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="height">Height (cm)</Label>
            <Input
              id="height"
              type="number"
              step="0.1"
              placeholder="0.0"
              {...register('height', {
                min: { value: 50, message: 'Height must be at least 50cm' },
                max: { value: 250, message: 'Height must be less than 250cm' },
              })}
            />
            {errors.height && (
              <p className="text-sm text-destructive">{errors.height.message}</p>
            )}
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="chest">Chest (cm)</Label>
            <Input
              id="chest"
              type="number"
              step="0.1"
              placeholder="0.0"
              {...register('chest')}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="waist">Waist (cm)</Label>
            <Input
              id="waist"
              type="number"
              step="0.1"
              placeholder="0.0"
              {...register('waist')}
            />
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="hips">Hips (cm)</Label>
            <Input
              id="hips"
              type="number"
              step="0.1"
              placeholder="0.0"
              {...register('hips')}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="bodyFat">Body Fat (%)</Label>
            <Input
              id="bodyFat"
              type="number"
              step="0.1"
              placeholder="0.0"
              {...register('bodyFat', {
                min: { value: 1, message: 'Body fat must be at least 1%' },
                max: { value: 60, message: 'Body fat must be less than 60%' },
              })}
            />
            {errors.bodyFat && (
              <p className="text-sm text-destructive">{errors.bodyFat.message}</p>
            )}
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="biceps">Biceps (cm)</Label>
            <Input
              id="biceps"
              type="number"
              step="0.1"
              placeholder="0.0"
              {...register('biceps')}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="thighs">Thighs (cm)</Label>
            <Input
              id="thighs"
              type="number"
              step="0.1"
              placeholder="0.0"
              {...register('thighs')}
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="notes">Notes</Label>
          <Textarea
            id="notes"
            placeholder="Add any additional notes about this measurement"
            {...register('notes')}
          />
        </div>
        
        <div className="flex justify-end">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Saving...' : 'Save Measurements'}
          </Button>
        </div>
      </div>
    </form>
  );
};

export default BodyMeasurementForm;
