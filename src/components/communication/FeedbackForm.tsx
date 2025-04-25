
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import { useFeedback } from '@/hooks/use-feedback';
import { useAuth } from '@/hooks/use-auth';
import { FeedbackType } from '@/types/notification';

export interface FeedbackFormProps {
  onSubmitSuccess?: () => void;
  allowedTypes?: string[];
}

const feedbackTypes = [
  { value: 'general', label: 'General Feedback' },
  { value: 'trainer', label: 'Trainer Feedback' },
  { value: 'class', label: 'Class Feedback' },
  { value: 'facility', label: 'Facility Feedback' },
  { value: 'service', label: 'Service Feedback' },
  { value: 'equipment', label: 'Equipment Feedback' },
  { value: 'fitness-plan', label: 'Fitness Plan Feedback' },
];

const schema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  type: z.string(),
  rating: z.string().transform(Number),
  comments: z.string().optional(),
  anonymous: z.boolean().optional(),
});

const FeedbackForm: React.FC<FeedbackFormProps> = ({ 
  onSubmitSuccess, 
  allowedTypes = feedbackTypes.map(t => t.value)
}) => {
  const { toast } = useToast();
  const { user } = useAuth();
  const { submitFeedback } = useFeedback();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: '',
      type: 'general',
      rating: '5',
      comments: '',
      anonymous: false,
    },
  });

  const onSubmit = async (values: z.infer<typeof schema>) => {
    try {
      setIsSubmitting(true);
      
      const success = await submitFeedback({
        title: values.title,
        type: values.type as FeedbackType,
        rating: values.rating,
        comments: values.comments,
        anonymous: values.anonymous,
        memberName: values.anonymous ? undefined : user?.name,
        memberId: values.anonymous ? undefined : user?.id,
      });
      
      if (success) {
        toast({
          title: "Feedback submitted",
          description: "Thank you for your feedback!",
        });
        
        form.reset();
        
        if (onSubmitSuccess) {
          onSubmitSuccess();
        }
      } else {
        toast({
          title: "Failed to submit feedback",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error submitting feedback:", error);
      toast({
        title: "Error",
        description: "An error occurred while submitting your feedback.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Filter feedback types to only those that are allowed
  const availableFeedbackTypes = feedbackTypes.filter(
    (type) => allowedTypes.includes(type.value)
  );

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="Provide a title for your feedback" {...field} />
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
              <FormLabel>Feedback Type</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {availableFeedbackTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
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
          name="rating"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Rating (1-5)</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a rating" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="1">1 - Poor</SelectItem>
                  <SelectItem value="2">2 - Fair</SelectItem>
                  <SelectItem value="3">3 - Good</SelectItem>
                  <SelectItem value="4">4 - Very Good</SelectItem>
                  <SelectItem value="5">5 - Excellent</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="comments"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Comments</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Share your thoughts and suggestions..."
                  {...field}
                  rows={4}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="anonymous"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center gap-2">
              <FormControl>
                <input
                  type="checkbox"
                  checked={field.value}
                  onChange={(e) => field.onChange(e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                />
              </FormControl>
              <FormLabel className="m-0">Submit anonymously</FormLabel>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <Button type="submit" disabled={isSubmitting} className="w-full">
          {isSubmitting ? 'Submitting...' : 'Submit Feedback'}
        </Button>
      </form>
    </Form>
  );
};

export default FeedbackForm;
