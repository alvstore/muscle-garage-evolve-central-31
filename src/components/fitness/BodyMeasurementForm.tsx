
import React from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { BodyMeasurement } from '@/types/measurements';
import { User } from '@/types';
import { useBranch } from '@/hooks/use-branch';

const formSchema = z.object({
  weight: z.string().transform((val) => (val === '' ? undefined : Number(val))).optional(),
  bodyFat: z.string().transform((val) => (val === '' ? undefined : Number(val))).optional(),
  waist: z.string().transform((val) => (val === '' ? undefined : Number(val))).optional(),
  chest: z.string().transform((val) => (val === '' ? undefined : Number(val))).optional(),
  hips: z.string().transform((val) => (val === '' ? undefined : Number(val))).optional(),
  arms: z.string().transform((val) => (val === '' ? undefined : Number(val))).optional(),
  thighs: z.string().transform((val) => (val === '' ? undefined : Number(val))).optional(),
  notes: z.string().optional(),
});

interface BodyMeasurementFormProps {
  memberId?: string;
  currentUser: User;
  onSave: (measurement: Partial<BodyMeasurement>) => Promise<void>;
}

const BodyMeasurementForm: React.FC<BodyMeasurementFormProps> = ({
  memberId,
  currentUser,
  onSave
}) => {
  const { currentBranch } = useBranch();
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      weight: '',
      bodyFat: '',
      waist: '',
      chest: '',
      hips: '',
      arms: '',
      thighs: '',
      notes: '',
    },
  });

  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!memberId) return;

    setIsSubmitting(true);
    try {
      const measurement: Partial<BodyMeasurement> = {
        memberId,
        date: new Date().toISOString(),
        weight: values.weight,
        body_fat_percentage: values.bodyFat,
        waist: values.waist,
        chest: values.chest,
        hips: values.hips,
        arms: values.arms,
        thighs: values.thighs,
        notes: values.notes,
        recorded_by: currentUser.id,
        branch_id: currentBranch?.id,
        addedBy: {
          id: currentUser.id,
          role: currentUser.role,
          name: currentUser.name || '',
        },
      };

      await onSave(measurement);
      form.reset();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add New Measurement</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <FormField
                control={form.control}
                name="weight"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Weight (kg)</FormLabel>
                    <FormControl>
                      <Input 
                        {...field} 
                        type="number" 
                        step="0.1" 
                        placeholder="0.0" 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="bodyFat"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Body Fat (%)</FormLabel>
                    <FormControl>
                      <Input 
                        {...field} 
                        type="number" 
                        step="0.1" 
                        placeholder="0.0" 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="chest"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Chest (cm)</FormLabel>
                    <FormControl>
                      <Input 
                        {...field} 
                        type="number" 
                        step="0.1" 
                        placeholder="0.0" 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="waist"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Waist (cm)</FormLabel>
                    <FormControl>
                      <Input 
                        {...field} 
                        type="number" 
                        step="0.1" 
                        placeholder="0.0" 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="hips"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Hips (cm)</FormLabel>
                    <FormControl>
                      <Input 
                        {...field} 
                        type="number" 
                        step="0.1" 
                        placeholder="0.0" 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="arms"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Arms (cm)</FormLabel>
                    <FormControl>
                      <Input 
                        {...field} 
                        type="number" 
                        step="0.1" 
                        placeholder="0.0" 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="thighs"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Thighs (cm)</FormLabel>
                    <FormControl>
                      <Input 
                        {...field} 
                        type="number" 
                        step="0.1" 
                        placeholder="0.0" 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes</FormLabel>
                  <FormControl>
                    <Textarea 
                      {...field} 
                      placeholder="Enter any additional observations or notes"
                    />
                  </FormControl>
                  <FormDescription>
                    Add any important observations about the member's progress
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                'Save Measurement'
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default BodyMeasurementForm;
