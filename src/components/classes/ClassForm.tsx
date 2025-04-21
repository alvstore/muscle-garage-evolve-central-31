import React from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DatePicker } from '@/components/ui/date-picker';
import { TimeInput } from '@/components/ui/time-input';
import { FormField, FormItem, FormLabel, FormControl, FormMessage, Form } from '@/components/ui/form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useBranch } from '@/hooks/use-branch';
import { toast } from 'sonner';
import { addHours, format } from 'date-fns';

export interface ClassFormProps {
  onSave?: () => void;
  classData?: any;
}

const classFormSchema = z.object({
  name: z.string().min(2, { message: "Class name is required" }),
  description: z.string().optional(),
  trainerId: z.string().min(1, { message: "Trainer is required" }),
  capacity: z.coerce.number().min(1, { message: "Capacity must be at least 1" }),
  startDate: z.date(),
  startTime: z.string(),
  duration: z.coerce.number().min(15, { message: "Duration must be at least 15 minutes" }),
  type: z.string().min(1, { message: "Class type is required" }),
  difficulty: z.enum(["beginner", "intermediate", "advanced", "all"]),
  location: z.string().optional(),
  recurring: z.boolean().default(false),
  recurringPattern: z.string().optional(),
});

type ClassFormValues = z.infer<typeof classFormSchema>;

const ClassForm: React.FC<ClassFormProps> = ({ onSave, classData }) => {
  const { currentBranch } = useBranch();
  
  // Mock data for trainers and class types
  const trainers = [
    { id: "trainer1", name: "John Smith" },
    { id: "trainer2", name: "Sarah Johnson" },
    { id: "trainer3", name: "Mike Williams" },
  ];
  
  const classTypes = [
    { id: "yoga", name: "Yoga" },
    { id: "hiit", name: "HIIT" },
    { id: "strength", name: "Strength Training" },
    { id: "cardio", name: "Cardio" },
    { id: "pilates", name: "Pilates" },
    { id: "zumba", name: "Zumba" },
  ];
  
  const defaultValues: Partial<ClassFormValues> = {
    name: classData?.name || "",
    description: classData?.description || "",
    trainerId: classData?.trainerId || "",
    capacity: classData?.capacity || 10,
    startDate: classData?.startDate ? new Date(classData.startDate) : new Date(),
    startTime: classData?.startTime || "09:00",
    duration: classData?.duration || 60,
    type: classData?.type || "",
    difficulty: classData?.difficulty || "all",
    location: classData?.location || "",
    recurring: classData?.recurring || false,
    recurringPattern: classData?.recurringPattern || "weekly",
  };
  
  const form = useForm<ClassFormValues>({
    resolver: zodResolver(classFormSchema),
    defaultValues,
  });
  
  const onSubmit = async (data: ClassFormValues) => {
    try {
      // Calculate end time based on start time and duration
      const startDateTime = new Date(data.startDate);
      const [hours, minutes] = data.startTime.split(':').map(Number);
      startDateTime.setHours(hours, minutes);
      
      const endDateTime = addHours(startDateTime, data.duration / 60);
      
      const classPayload = {
        ...data,
        branchId: currentBranch?.id,
        startDateTime: startDateTime.toISOString(),
        endDateTime: endDateTime.toISOString(),
      };
      
      console.log('Class data to submit:', classPayload);
      
      // Here you would make an API call to save the class
      // await createClass(classPayload);
      
      toast.success('Class saved successfully');
      if (onSave) onSave();
    } catch (error: any) {
      console.error('Error saving class:', error);
      toast.error(error.message || 'Failed to save class');
    }
  };
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Class Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter class name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Class Type</FormLabel>
                <Select 
                  onValueChange={field.onChange} 
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select class type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {classTypes.map(type => (
                      <SelectItem key={type.id} value={type.id}>
                        {type.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="trainerId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Trainer</FormLabel>
                <Select 
                  onValueChange={field.onChange} 
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select trainer" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {trainers.map(trainer => (
                      <SelectItem key={trainer.id} value={trainer.id}>
                        {trainer.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="capacity"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Capacity</FormLabel>
                <FormControl>
                  <Input type="number" min={1} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="startDate"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Start Date</FormLabel>
                <DatePicker
                  date={field.value}
                  onSelect={field.onChange}
                />
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="startTime"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Start Time</FormLabel>
                <FormControl>
                  <Input type="time" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="duration"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Duration (minutes)</FormLabel>
                <FormControl>
                  <Input type="number" min={15} step={15} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="difficulty"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Difficulty Level</FormLabel>
                <Select 
                  onValueChange={field.onChange} 
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select difficulty" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="beginner">Beginner</SelectItem>
                    <SelectItem value="intermediate">Intermediate</SelectItem>
                    <SelectItem value="advanced">Advanced</SelectItem>
                    <SelectItem value="all">All Levels</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="location"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Location</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., Studio 1" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Enter class description" 
                  className="min-h-[120px]" 
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline" onClick={() => form.reset()}>
            Reset
          </Button>
          <Button type="submit">
            Save Class
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default ClassForm;
