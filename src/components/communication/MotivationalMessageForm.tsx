
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Form, 
  FormControl, 
  FormDescription, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { toast } from "sonner";
import { MotivationalMessage } from "@/types/notification";

const formSchema = z.object({
  content: z.string().min(5, "Content must be at least 5 characters").max(200, "Content must be less than 200 characters"),
  author: z.string().optional(),
  category: z.enum(["motivation", "fitness", "nutrition", "wellness"]),
  tags: z.string().optional(),
  active: z.boolean().default(true),
});

interface MotivationalMessageFormProps {
  editMessage?: MotivationalMessage | null;
  onComplete: () => void;
}

const MotivationalMessageForm = ({ editMessage, onComplete }: MotivationalMessageFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      content: "",
      author: "",
      category: "motivation",
      tags: "",
      active: true,
    },
  });

  useEffect(() => {
    if (editMessage) {
      form.reset({
        content: editMessage.content,
        author: editMessage.author || "",
        category: editMessage.category,
        tags: editMessage.tags ? editMessage.tags.join(", ") : "",
        active: editMessage.active,
      });
    }
  }, [editMessage, form]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);
    
    try {
      // Process tags
      const processTags = values.tags 
        ? values.tags
            .split(",")
            .map(tag => tag.trim())
            .filter(tag => tag)
        : [];
      
      // Create the message object
      const messageData = {
        ...values,
        tags: processTags,
      };
      
      // Simulate API call
      console.log("Submitting message:", messageData);
      
      // In a real app, this would be an API call to save the message
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast.success(
        editMessage 
          ? "Message updated successfully" 
          : "Message created successfully"
      );
      
      form.reset();
      onComplete();
    } catch (error) {
      console.error("Error submitting message:", error);
      toast.error("There was a problem saving the message");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{editMessage ? "Edit Motivational Message" : "Create New Motivational Message"}</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Message Content</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Enter the motivational message content" 
                      className="min-h-24 resize-none"
                      {...field} 
                    />
                  </FormControl>
                  <FormDescription>
                    {field.value.length}/200 characters
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid gap-6 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="author"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Author (Optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter author name" {...field} />
                    </FormControl>
                    <FormDescription>
                      Who is the original author of this quote?
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="motivation">Motivation</SelectItem>
                        <SelectItem value="fitness">Fitness</SelectItem>
                        <SelectItem value="nutrition">Nutrition</SelectItem>
                        <SelectItem value="wellness">Wellness</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Categorize your message for better organization
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="tags"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tags (Optional)</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Enter tags separated by commas (e.g., workout, motivation, success)" 
                      {...field} 
                    />
                  </FormControl>
                  <FormDescription>
                    Add relevant tags to help categorize and find this message
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="active"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Active Status</FormLabel>
                    <FormDescription>
                      Enable to make this message available for sending to members
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
                    Saving...
                  </span>
                ) : editMessage ? "Update Message" : "Create Message"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default MotivationalMessageForm;
