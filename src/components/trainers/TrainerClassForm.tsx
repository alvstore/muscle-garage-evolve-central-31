
import React, { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  Form, 
  FormControl, 
  FormDescription, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from '@/components/ui/form';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { CalendarIcon, Clock, Info } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';

interface TrainerClassFormProps {
  trainerId: string;
  onSave: () => void;
  onCancel: () => void;
}

const formSchema = z.object({
  name: z.string().min(3, { message: 'Class name must be at least 3 characters.' }),
  description: z.string().optional(),
  type: z.string().min(1, { message: 'Please select a class type.' }),
  difficulty: z.string().min(1, { message: 'Please select a difficulty level.' }),
  capacity: z.coerce.number().min(1, { message: 'Capacity must be at least 1.' }),
  location: z.string().min(1, { message: 'Location is required.' }),
  classDate: z.date({ required_error: 'Please select a date.' }),
  startTime: z.string().min(1, { message: 'Start time is required.' }),
  endTime: z.string().min(1, { message: 'End time is required.' }),
  recurring: z.boolean().default(false),
  recurringPattern: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

const TrainerClassForm: React.FC<TrainerClassFormProps> = ({ trainerId, onSave, onCancel }) => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      description: '',
      type: '',
      difficulty: 'all',
      capacity: 10,
      location: '',
      recurring: false,
      recurringPattern: '',
    },
  });

  const watchRecurring = form.watch('recurring');

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);

    try {
      const startDateTime = new Date(data.classDate);
      const [startHours, startMinutes] = data.startTime.split(':').map(Number);
      startDateTime.setHours(startHours, startMinutes);

      const endDateTime = new Date(data.classDate);
      const [endHours, endMinutes] = data.endTime.split(':').map(Number);
      endDateTime.setHours(endHours, endMinutes);

      if (endDateTime <= startDateTime) {
        form.setError('endTime', { 
          type: 'manual', 
          message: 'End time must be after start time.' 
        });
        setIsSubmitting(false);
        return;
      }

      const newClass = {
        name: data.name,
        description: data.description,
        type: data.type,
        difficulty: data.difficulty,
        capacity: data.capacity,
        location: data.location,
        trainerId,
        startTime: startDateTime.toISOString(),
        endTime: endDateTime.toISOString(),
        recurring: data.recurring,
        recurringPattern: data.recurringPattern,
        enrolled: 0,
        status: 'scheduled',
      };

      // In a real app, this would be an API call
      console.log('Creating new class:', newClass);
      
      // Simulate API call
      setTimeout(() => {
        toast.success('Class created successfully!');
        setIsSubmitting(false);
        onSave();
      }, 1000);
    } catch (error) {
      console.error('Error creating class:', error);
      toast.error('Failed to create class. Please try again.');
      setIsSubmitting(false);
    }
  };

  const classTypes = [
    'Yoga', 
    'HIIT', 
    'Strength', 
    'Cardio', 
    'Pilates', 
    'Cycling', 
    'Boxing', 
    'Zumba', 
    'Meditation',
    'CrossFit',
    'Dance',
    'Martial Arts'
  ];

  const locations = [
    'Studio 1', 
    'Studio 2', 
    'Main Floor', 
    'Weights Room', 
    'Outdoor Area', 
    'Swimming Pool',
    'Yoga Room',
    'Functional Training Area'
  ];

  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>Create New Class</CardTitle>
        <CardDescription>
          Set up a new class session for members to join
        </CardDescription>
      </CardHeader>
      <CardContent>
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
                      <Input placeholder="Morning Yoga Flow" {...field} />
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
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select class type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {classTypes.map(type => (
                          <SelectItem key={type} value={type}>{type}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
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
                      placeholder="Provide details about the class content, what to bring, etc." 
                      className="resize-none min-h-[100px]" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="difficulty"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Difficulty Level</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select difficulty level" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="all">All Levels</SelectItem>
                        <SelectItem value="beginner">Beginner</SelectItem>
                        <SelectItem value="intermediate">Intermediate</SelectItem>
                        <SelectItem value="advanced">Advanced</SelectItem>
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
                    <FormLabel>
                      Maximum Capacity
                      <HoverCard>
                        <HoverCardTrigger asChild>
                          <Info className="h-4 w-4 ml-1 inline-block text-muted-foreground" />
                        </HoverCardTrigger>
                        <HoverCardContent className="w-80">
                          <p className="text-sm">The maximum number of members who can book this class.</p>
                        </HoverCardContent>
                      </HoverCard>
                    </FormLabel>
                    <FormControl>
                      <Input type="number" min={1} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Location</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select location" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {locations.map(location => (
                        <SelectItem key={location} value={location}>{location}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <FormField
                control={form.control}
                name="classDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
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
                name="endTime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>End Time</FormLabel>
                    <FormControl>
                      <Input type="time" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="recurring"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Recurring Class</FormLabel>
                    <FormDescription>
                      Set this class to repeat on a weekly basis
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            {watchRecurring && (
              <FormField
                control={form.control}
                name="recurringPattern"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Recurring Pattern</FormLabel>
                    <div className="flex flex-wrap gap-2">
                      {['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'].map(day => {
                        const isSelected = field.value?.includes(day);
                        return (
                          <Badge
                            key={day}
                            variant={isSelected ? "default" : "outline"}
                            className="cursor-pointer"
                            onClick={() => {
                              const currentDays = field.value?.split(',').filter(Boolean) || [];
                              const newDays = isSelected
                                ? currentDays.filter(d => d !== day)
                                : [...currentDays, day];
                              field.onChange(newDays.join(','));
                            }}
                          >
                            {day}
                          </Badge>
                        );
                      })}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <div className="flex justify-end space-x-2">
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting || !form.formState.isValid}
              >
                {isSubmitting ? 'Creating...' : 'Create Class'}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default TrainerClassForm;
