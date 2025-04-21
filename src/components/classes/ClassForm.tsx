
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { GymClass } from '@/types/class';

export interface ClassFormProps {
  initialData: GymClass;
  isLoading?: boolean;
  onCancel: () => void;
  handleSubmit: (classData: GymClass) => Promise<void>;
  open?: boolean; 
  onOpenChange?: React.Dispatch<React.SetStateAction<boolean>>;
  onClose?: () => void;
  onSave?: (classData: GymClass) => Promise<void>;
}

const ClassForm: React.FC<ClassFormProps> = ({ 
  initialData, 
  isLoading, 
  onCancel, 
  handleSubmit,
  open,
  onOpenChange,
  onClose,
  onSave 
}) => {
  const [name, setName] = useState(initialData.name || '');
  const [description, setDescription] = useState(initialData.description || '');
  const [trainerId, setTrainerId] = useState(initialData.trainerId || '');
  const [capacity, setCapacity] = useState(initialData.capacity || 0);
  const [startTime, setStartTime] = useState(initialData.startTime || '');
  const [endTime, setEndTime] = useState(initialData.endTime || '');
  const [type, setType] = useState(initialData.type || '');
  const [location, setLocation] = useState(initialData.location || '');
  const [difficulty, setDifficulty] = useState<'beginner' | 'intermediate' | 'advanced' | 'all'>(
    initialData.difficulty as 'beginner' | 'intermediate' | 'advanced' | 'all' || 'intermediate'
  );

  useEffect(() => {
    setName(initialData.name || '');
    setDescription(initialData.description || '');
    setTrainerId(initialData.trainerId || '');
    setCapacity(initialData.capacity || 0);
    setStartTime(initialData.startTime || '');
    setEndTime(initialData.endTime || '');
    setType(initialData.type || '');
    setLocation(initialData.location || '');
    setDifficulty(initialData.difficulty as 'beginner' | 'intermediate' | 'advanced' | 'all' || 'intermediate');
  }, [initialData]);

  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const classData: GymClass = {
      id: initialData.id || '',
      name,
      description,
      trainerId,
      capacity,
      enrolled: initialData.enrolled || 0,
      startTime,
      endTime,
      type,
      location,
      difficulty,
    };

    // Use the appropriate handler - onSave has priority if provided
    if (onSave) {
      await onSave(classData);
    } else {
      await handleSubmit(classData);
    }

    // Call onClose if available after submission
    if (onClose) {
      onClose();
    }
  };

  // Type guard function to handle the string type issues
  const handleDifficultyChange = (value: string) => {
    if (value === 'beginner' || value === 'intermediate' || value === 'advanced' || value === 'all') {
      setDifficulty(value);
    }
  };

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="grid gap-4">
        <div>
          <Label htmlFor="name">Class Name</Label>
          <Input
            id="name"
            type="text"
            placeholder="Class Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div>
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            placeholder="Class Description"
            value={description || ''}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="trainerId">Trainer ID</Label>
          <Input
            id="trainerId"
            type="text"
            placeholder="Trainer ID"
            value={trainerId}
            onChange={(e) => setTrainerId(e.target.value)}
            required
          />
        </div>
        <div>
          <Label htmlFor="capacity">Capacity</Label>
          <Input
            id="capacity"
            type="number"
            placeholder="Capacity"
            value={capacity}
            onChange={(e) => setCapacity(Number(e.target.value))}
            required
          />
        </div>
        <div>
          <Label htmlFor="startTime">Start Time</Label>
          <Input
            id="startTime"
            type="text"
            placeholder="Start Time"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            required
          />
        </div>
        <div>
          <Label htmlFor="endTime">End Time</Label>
          <Input
            id="endTime"
            type="text"
            placeholder="End Time"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            required
          />
        </div>
        <div>
          <Label htmlFor="type">Class Type</Label>
          <Select value={type} onValueChange={setType}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select a type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Yoga">Yoga</SelectItem>
              <SelectItem value="Pilates">Pilates</SelectItem>
              <SelectItem value="Zumba">Zumba</SelectItem>
              <SelectItem value="Strength Training">Strength Training</SelectItem>
              <SelectItem value="Cardio">Cardio</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="difficulty">Difficulty</Label>
          <Select value={difficulty} onValueChange={handleDifficultyChange}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select difficulty" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="beginner">Beginner</SelectItem>
              <SelectItem value="intermediate">Intermediate</SelectItem>
              <SelectItem value="advanced">Advanced</SelectItem>
              <SelectItem value="all">All Levels</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="location">Location</Label>
          <Input
            id="location"
            type="text"
            placeholder="Location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
        </div>
      </div>
      <div className="flex justify-end gap-2">
        <Button type="button" variant="ghost" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            "Save"
          )}
        </Button>
      </div>
    </form>
  );
};

export default ClassForm;
