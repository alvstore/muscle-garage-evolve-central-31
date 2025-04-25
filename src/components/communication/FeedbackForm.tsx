
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/hooks/use-auth";
import { useFeedback } from "@/hooks/use-feedback";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { FeedbackType } from "@/types/notification";

const feedbackSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  type: z.enum(["general", "trainer", "class", "facility", "service", "equipment"] as const),
  rating: z.coerce.number().min(1).max(5),
  comments: z.string().optional(),
  anonymous: z.boolean().default(false),
});

export interface FeedbackFormProps {
  onComplete: () => void;
  allowedFeedbackTypes: string[];
}

const FeedbackForm: React.FC<FeedbackFormProps> = ({ 
  onComplete, 
  allowedFeedbackTypes = ["general", "trainer", "class", "facility", "service", "equipment"] 
}) => {
  const { user } = useAuth();
  const { submitFeedback } = useFeedback();

  const form = useForm<z.infer<typeof feedbackSchema>>({
    resolver: zodResolver(feedbackSchema),
    defaultValues: {
      title: "",
      type: "general" as FeedbackType,
      rating: 5,
      comments: "",
      anonymous: false,
    },
  });

  const onSubmit = async (data: z.infer<typeof feedbackSchema>) => {
    const success = await submitFeedback({
      ...data,
      memberId: user?.id,
      memberName: user?.name || user?.email,
    });

    if (success) {
      onComplete();
    }
  };

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
                <Input placeholder="Brief title for your feedback" {...field} />
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
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="grid grid-cols-3 gap-4"
                >
                  {allowedFeedbackTypes.map((type) => (
                    <FormItem key={type} className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value={type} />
                      </FormControl>
                      <FormLabel className="font-normal">
                        {type.charAt(0).toUpperCase() + type.slice(1)}
                      </FormLabel>
                    </FormItem>
                  ))}
                </RadioGroup>
              </FormControl>
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
              <FormControl>
                <div className="flex items-center space-x-2">
                  {[1, 2, 3, 4, 5].map((rating) => (
                    <Button
                      key={rating}
                      type="button"
                      variant={field.value === rating ? "default" : "outline"}
                      onClick={() => field.onChange(rating)}
                      className="w-10 h-10 rounded-full"
                    >
                      {rating}
                    </Button>
                  ))}
                </div>
              </FormControl>
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
                  placeholder="Please share your thoughts in detail"
                  className="min-h-[120px]"
                  {...field}
                  value={field.value || ''}
                />
              </FormControl>
              <FormDescription>
                Your detailed feedback helps us improve our services
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end space-x-4">
          <Button type="button" variant="outline" onClick={onComplete}>
            Cancel
          </Button>
          <Button type="submit">Submit Feedback</Button>
        </div>
      </form>
    </Form>
  );
};

export default FeedbackForm;
