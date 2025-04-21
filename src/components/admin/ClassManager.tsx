
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { TimeInput } from '@/components/ui/time-input';
import { useBranch } from '@/hooks/use-branch';
import { supabase } from '@/services/supabaseClient';

const formSchema = z.object({
  name: z.string().min(3, 'Class name must be at least 3 characters'),
  description: z.string().optional(),
  capacity: z.number().min(1, 'Capacity must be at least 1'),
  startTime: z.string().min(1, 'Start time is required'),
  endTime: z.string().min(1, 'End time is required'),
  trainerId: z.string().optional(),
  branchId: z.string().min(1, 'Branch is required'),
  isActive: z.boolean().default(true),
});

type FormValues = z.infer<typeof formSchema>;

interface ClassManagerProps {
  classId?: string;
  onSuccess?: () => void;
  onCancel?: () => void;
}

const ClassManager = ({ classId, onSuccess, onCancel }: ClassManagerProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { currentBranch, branches } = useBranch();
  const [trainers, setTrainers] = useState<{ id: string; name: string }[]>([]);
  const isEditMode = !!classId;

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      description: '',
      capacity: 10,
      startTime: '09:00',
      endTime: '10:00',
      branchId: currentBranch?.id || '',
      isActive: true,
    },
  });

  useState(() => {
    const fetchTrainers = async () => {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('id, full_name')
          .eq('role', 'trainer');
        
        if (error) throw error;
        
        setTrainers(data.map(trainer => ({
          id: trainer.id,
          name: trainer.full_name || 'Unknown',
        })));
      } catch (error) {
        console.error('Error fetching trainers:', error);
        // Fallback mock data
        setTrainers([
          { id: 'trainer-1', name: 'John Trainer' },
          { id: 'trainer-2', name: 'Sarah Instructor' },
        ]);
      }
    };

    const fetchClassDetails = async () => {
      if (!classId) return;
      
      try {
        const { data, error } = await supabase
          .from('classes')
          .select('*')
          .eq('id', classId)
          .single();
        
        if (error) throw error;
        
        form.reset({
          name: data.name,
          description: data.description || '',
          capacity: data.capacity,
          startTime: new Date(data.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }),
          endTime: new Date(data.end_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }),
          trainerId: data.trainer_id || undefined,
          branchId: data.branch_id || currentBranch?.id || '',
          isActive: data.is_active,
        });
      } catch (error) {
        console.error('Error fetching class details:', error);
        toast.error('Failed to load class details');
      }
    };

    fetchTrainers();
    if (classId) {
      fetchClassDetails();
    }
  }, [classId, currentBranch?.id, form]);

  const onSubmit = async (values: FormValues) => {
    setIsSubmitting(true);
    try {
      const classData = {
        name: values.name,
        description: values.description,
        capacity: values.capacity,
        start_time: `2025-04-21T${values.startTime}:00`,
        end_time: `2025-04-21T${values.endTime}:00`,
        trainer_id: values.trainerId,
        branch_id: values.branchId,
        is_active: values.isActive,
      };
      
      if (isEditMode) {
        const { error } = await supabase
          .from('classes')
          .update(classData)
          .eq('id', classId);
          
        if (error) throw error;
        toast.success('Class updated successfully');
      } else {
        const { error } = await supabase
          .from('classes')
          .insert(classData);
          
        if (error) throw error;
        toast.success('Class created successfully');
      }
      
      if (onSuccess) onSuccess();
    } catch (error: any) {
      toast.error(error.message || 'Failed to save class');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{isEditMode ? 'Edit Class' : 'Create New Class'}</CardTitle>
        <CardDescription>
          {isEditMode
            ? 'Update the details of this fitness class'
            : 'Add a new fitness class to your schedule'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Class Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Yoga for Beginners" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="A gentle introduction to yoga poses..."
                      className="resize-none"
                      rows={3}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="startTime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Start Time</FormLabel>
                    <FormControl>
                      <TimeInput {...field} />
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
                      <TimeInput {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="capacity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Maximum Capacity</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min={1}
                        {...field}
                        onChange={(e) => field.onChange(parseInt(e.target.value))}
                      />
                    </FormControl>
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
                          <SelectValue placeholder="Select a trainer" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {trainers.map((trainer) => (
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
            </div>
            
            <FormField
              control={form.control}
              name="branchId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Branch</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a branch" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {branches.map((branch) => (
                        <SelectItem key={branch.id} value={branch.id}>
                          {branch.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    The branch where this class will be held
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>
      </CardContent>
      <CardFooter className="flex justify-end space-x-2">
        {onCancel && (
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        )}
        <Button
          onClick={form.handleSubmit(onSubmit)}
          disabled={isSubmitting}
        >
          {isSubmitting
            ? isEditMode
              ? 'Updating...'
              : 'Creating...'
            : isEditMode
              ? 'Update Class'
              : 'Create Class'}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ClassManager;
