import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Form, 
  FormControl, 
  FormDescription, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "sonner";
import { Feedback } from "@/types/notification";

const formSchema = z.object({
  type: z.enum(["class", "trainer", "fitness-plan", "general"]),
  relatedId: z.string().optional(),
  rating: z.string().min(1, "Please select a rating"),
  comments: z.string().min(10, "Please provide comments (min 10 characters)").max(500, "Comments must be less than 500 characters"),
  anonymous: z.boolean().default(false),
  title: z.string().min(3, "Please provide a title for your feedback")
});

interface FeedbackFormProps {
  onComplete: () => void;
}

// Mock data
const mockClasses = [
  { id: "class1", name: "HIIT Extreme" },
  { id: "class2", name: "Yoga Flow" },
  { id: "class3", name: "Spin Class" },
];

const mockTrainers = [
  { id: "trainer1", name: "Alex Johnson" },
  { id: "trainer2", name: "Maria Garcia" },
  { id: "trainer3", name: "David Williams" },
];

const mockPlans = [
  { id: "plan1", name: "Weight Loss Plan" },
  { id: "plan2", name: "Muscle Building Plan" },
  { id: "plan3", name: "Endurance Training Plan" },
];

const FeedbackForm = ({ onComplete }: FeedbackFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      type: "general",
      rating: "",
      comments: "",
      anonymous: false,
      title: ""
    },
  });

  const watchType = form.watch("type");

  const getRelatedOptions = () => {
    switch (watchType) {
      case "class":
        return mockClasses;
      case "trainer":
        return mockTrainers;
      case "fitness-plan":
        return mockPlans;
      default:
        return [];
    }
  };

  const relatedOptions = getRelatedOptions();

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);
    
    try {
      // Simulate API call
      console.log("Submitting feedback:", values);
      
      // In a real app, this would be an API call to save the feedback
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast.success("Feedback submitted successfully");
      
      form.reset({
        type: "general",
        rating: "",
        comments: "",
        anonymous: false,
        title: ""
      });
      
      onComplete();
    } catch (error) {
      console.error("Error submitting feedback:", error);
      toast.error("There was a problem submitting your feedback");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Submit Feedback</CardTitle>
        <CardDescription>
          Share your experience to help us improve
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Feedback Title</FormLabel>
                  <FormControl>
                    <input
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      placeholder="Enter a title for your feedback"
                      {...field}
                    />
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
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select feedback type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="general">General Feedback</SelectItem>
                      <SelectItem value="class">Class Feedback</SelectItem>
                      <SelectItem value="trainer">Trainer Feedback</SelectItem>
                      <SelectItem value="fitness-plan">Fitness Plan Feedback</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Select what you want to provide feedback on
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {watchType !== "general" && relatedOptions.length > 0 && (
              <FormField
                control={form.control}
                name="relatedId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {watchType === "class" 
                        ? "Select Class" 
                        : watchType === "trainer" 
                        ? "Select Trainer" 
                        : "Select Fitness Plan"}
                    </FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder={`Select ${watchType}`} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {relatedOptions.map(option => (
                          <SelectItem key={option.id} value={option.id}>
                            {option.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            
            <FormField
              control={form.control}
              name="rating"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>Rating</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex space-x-1"
                    >
                      {[1, 2, 3, 4, 5].map((rating) => (
                        <FormItem key={rating} className="flex items-center space-x-0 space-y-0">
                          <FormControl>
                            <RadioGroupItem 
                              value={rating.toString()} 
                              className="sr-only" 
                              id={`rating-${rating}`}
                            />
                          </FormControl>
                          <FormLabel
                            htmlFor={`rating-${rating}`}
                            className={`
                              flex h-10 w-10 items-center justify-center rounded-full 
                              cursor-pointer hover:bg-secondary
                              ${field.value === rating.toString() ? 'text-primary-foreground bg-primary' : 'bg-muted'}
                            `}
                          >
                            {rating}
                          </FormLabel>
                        </FormItem>
                      ))}
                    </RadioGroup>
                  </FormControl>
                  <FormDescription>
                    Rate your experience from 1 (poor) to 5 (excellent)
                  </FormDescription>
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
                      placeholder="Please share your thoughts and suggestions..."
                      className="min-h-32 resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    {field.value.length}/500 characters
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="anonymous"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Submit Anonymously</FormLabel>
                    <FormDescription>
                      Your feedback will be kept anonymous and won't be linked to your account
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
            
            <div className="flex justify-end space-x-2">
              <Button 
                variant="outline" 
                type="button" 
                onClick={onComplete}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <span className="flex items-center">
                    <span className="h-4 w-4 rounded-full border-2 border-current border-r-transparent animate-spin mr-2"></span>
                    Submitting...
                  </span>
                ) : "Submit Feedback"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default FeedbackForm;
