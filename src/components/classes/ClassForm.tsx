
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useBranch } from "@/hooks/use-branch";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { CalendarIcon, Clock } from "lucide-react";

interface ClassFormProps {
  classItem: any;
  onSave: (classData: any) => void;
  onCancel: () => void;
}

const ClassForm = ({ classItem, onSave, onCancel }: ClassFormProps) => {
  const { currentBranch } = useBranch();
  const [trainers, setTrainers] = useState<{ id: string; name: string }[]>([]);
  const [formData, setFormData] = useState({
    name: classItem?.name || "",
    description: classItem?.description || "",
    trainer_id: classItem?.trainer_id || "",
    trainerName: classItem?.trainerName || "",
    type: classItem?.type || "fitness",
    difficulty: classItem?.difficulty || "beginner",
    capacity: classItem?.capacity || 10,
    location: classItem?.location || "",
    start_time: classItem?.start_time || new Date().toISOString(),
    end_time: classItem?.end_time || new Date(Date.now() + 60 * 60 * 1000).toISOString(),
    recurring: classItem?.recurring || false,
    recurring_pattern: classItem?.recurring_pattern || "weekly",
    status: classItem?.status || "scheduled",
  });

  // Format date for display
  const [startDate, setStartDate] = useState<Date | undefined>(
    classItem?.start_time ? new Date(classItem.start_time) : new Date()
  );
  const [endDate, setEndDate] = useState<Date | undefined>(
    classItem?.end_time ? new Date(classItem.end_time) : new Date(Date.now() + 60 * 60 * 1000)
  );
  const [startTime, setStartTime] = useState(
    classItem?.start_time ? format(new Date(classItem.start_time), "HH:mm") : format(new Date(), "HH:mm")
  );
  const [endTime, setEndTime] = useState(
    classItem?.end_time 
      ? format(new Date(classItem.end_time), "HH:mm") 
      : format(new Date(Date.now() + 60 * 60 * 1000), "HH:mm")
  );

  // Fetch trainers on component mount
  useEffect(() => {
    const fetchTrainers = async () => {
      try {
        let query = supabase
          .from('profiles')
          .select('id, full_name')
          .eq('role', 'trainer');
        
        if (currentBranch?.id) {
          query = query.eq('branch_id', currentBranch.id);
        }
        
        const { data, error } = await query;
        
        if (error) throw error;
        
        if (data) {
          setTrainers(
            data.map(trainer => ({
              id: trainer.id,
              name: trainer.full_name || 'Unnamed Trainer'
            }))
          );
        }
      } catch (error) {
        console.error('Error fetching trainers:', error);
      }
    };
    
    fetchTrainers();
  }, [currentBranch?.id]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData({ ...formData, [name]: value });
    
    // Update trainer name if trainer is selected
    if (name === 'trainer_id') {
      const selectedTrainer = trainers.find(trainer => trainer.id === value);
      if (selectedTrainer) {
        setFormData(prev => ({ ...prev, trainerName: selectedTrainer.name }));
      }
    }
  };

  const handleStartDateSelect = (date: Date | undefined) => {
    if (date) {
      setStartDate(date);
      // Update the start_time in formData by combining date and time
      const currentTime = startTime.split(':');
      const newDate = new Date(date);
      newDate.setHours(parseInt(currentTime[0], 10), parseInt(currentTime[1], 10));
      setFormData({ ...formData, start_time: newDate.toISOString() });
    }
  };

  const handleEndDateSelect = (date: Date | undefined) => {
    if (date) {
      setEndDate(date);
      // Update the end_time in formData by combining date and time
      const currentTime = endTime.split(':');
      const newDate = new Date(date);
      newDate.setHours(parseInt(currentTime[0], 10), parseInt(currentTime[1], 10));
      setFormData({ ...formData, end_time: newDate.toISOString() });
    }
  };

  const handleStartTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = e.target.value;
    setStartTime(newTime);
    // Update the start_time in formData by combining date and time
    if (startDate) {
      const timeParts = newTime.split(':');
      const newDateTime = new Date(startDate);
      newDateTime.setHours(parseInt(timeParts[0], 10), parseInt(timeParts[1], 10));
      setFormData({ ...formData, start_time: newDateTime.toISOString() });
    }
  };

  const handleEndTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = e.target.value;
    setEndTime(newTime);
    // Update the end_time in formData by combining date and time
    if (endDate) {
      const timeParts = newTime.split(':');
      const newDateTime = new Date(endDate);
      newDateTime.setHours(parseInt(timeParts[0], 10), parseInt(timeParts[1], 10));
      setFormData({ ...formData, end_time: newDateTime.toISOString() });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <Dialog open={true} onOpenChange={onCancel}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>{classItem ? 'Edit Class' : 'Add New Class'}</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Class Name</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Enter class name"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="type">Class Type</Label>
              <Select
                value={formData.type}
                onValueChange={(value) => handleSelectChange('type', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="fitness">Fitness</SelectItem>
                  <SelectItem value="yoga">Yoga</SelectItem>
                  <SelectItem value="cardio">Cardio</SelectItem>
                  <SelectItem value="strength">Strength</SelectItem>
                  <SelectItem value="hiit">HIIT</SelectItem>
                  <SelectItem value="pilates">Pilates</SelectItem>
                  <SelectItem value="dance">Dance</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Enter class description"
              rows={3}
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="trainer">Trainer</Label>
              <Select
                value={formData.trainer_id}
                onValueChange={(value) => handleSelectChange('trainer_id', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select trainer" />
                </SelectTrigger>
                <SelectContent>
                  {trainers.map((trainer) => (
                    <SelectItem key={trainer.id} value={trainer.id}>
                      {trainer.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="difficulty">Difficulty</Label>
              <Select
                value={formData.difficulty}
                onValueChange={(value) => handleSelectChange('difficulty', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select difficulty" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="beginner">Beginner</SelectItem>
                  <SelectItem value="intermediate">Intermediate</SelectItem>
                  <SelectItem value="advanced">Advanced</SelectItem>
                  <SelectItem value="all-levels">All Levels</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="capacity">Capacity</Label>
              <Input
                id="capacity"
                name="capacity"
                type="number"
                value={formData.capacity}
                onChange={handleInputChange}
                min="1"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                placeholder="Room or area"
                required
              />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Start Date</Label>
              <div className="flex space-x-2">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {startDate ? format(startDate, "PPP") : "Select date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={startDate}
                      onSelect={handleStartDateSelect}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="startTime">Start Time</Label>
              <div className="flex items-center">
                <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="startTime"
                  type="time"
                  value={startTime}
                  onChange={handleStartTimeChange}
                  required
                />
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>End Date</Label>
              <div className="flex space-x-2">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {endDate ? format(endDate, "PPP") : "Select date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={endDate}
                      onSelect={handleEndDateSelect}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="endTime">End Time</Label>
              <div className="flex items-center">
                <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="endTime"
                  type="time"
                  value={endTime}
                  onChange={handleEndTimeChange}
                  required
                />
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value) => handleSelectChange('status', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="scheduled">Scheduled</SelectItem>
                  <SelectItem value="in-progress">In Progress</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="recurring">Recurring</Label>
              <Select
                value={formData.recurring ? "true" : "false"}
                onValueChange={(value) => handleSelectChange('recurring', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Is recurring?" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="false">No</SelectItem>
                  <SelectItem value="true">Yes</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          {formData.recurring && (
            <div className="space-y-2">
              <Label htmlFor="recurring_pattern">Recurring Pattern</Label>
              <Select
                value={formData.recurring_pattern}
                onValueChange={(value) => handleSelectChange('recurring_pattern', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select pattern" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="daily">Daily</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="biweekly">Bi-weekly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button type="submit">{classItem ? 'Update Class' : 'Create Class'}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ClassForm;
