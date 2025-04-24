import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MotivationalMessage } from "@/types/notification";
import { useMotivationalMessages } from "@/hooks/use-motivational-messages";

const formSchema = z.object({
  title: z.string().min(5, {
    message: "Title must be at least 5 characters.",
  }),
  content: z.string().min(10, {
    message: "Message content must be at least 10 characters.",
  }),
  author: z.string().optional(),
  category: z.enum(["motivation", "fitness", "nutrition", "wellness"]),
  active: z.boolean().default(true),
  tags: z.string().optional()
});

interface MotivationalMessageFormProps {
  editMessage?: MotivationalMessage | null;
  onComplete: () => void;
}

const MotivationalMessageForm = ({ editMessage, onComplete }: MotivationalMessageFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { createMessage, updateMessage } = useMotivationalMessages();
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: editMessage?.title || "",
      content: editMessage?.content || "",
      author: editMessage?.author || "",
      category: editMessage?.category || "motivation",
      active: editMessage?.active ?? true,
      tags: editMessage?.tags?.join(", ") || ""
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    
    try {
      const messageData = {
        title: values.title,
        content: values.content,
        author: values.author || "Unknown",
        category: values.category,
        active: values.active,
        tags: values.tags ? values.tags.split(",").map(tag => tag.trim()) : [],
      };
      
      if (editMessage) {
        await updateMessage.mutateAsync({
          id: editMessage.id,
          ...messageData
        });
      } else {
        await createMessage.mutateAsync(messageData);
      }
      
      form.reset();
      onComplete();
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{editMessage ? "Edit Message" : "Create New Message"}</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Message title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Message Content</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Enter the motivational message content" 
                      className="min-h-32"
                      {...field} 
                    />
                  </FormControl>
                  <FormDescription>
                    This is the message that will be sent to members.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="flex flex-col md:flex-row gap-6">
              <FormField
                control={form.control}
                name="author"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Author (Optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="Message author" {...field} value={field.value || ''} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Category</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
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
                      placeholder="Enter tags separated by commas" 
                      {...field} 
                      value={field.value || ''} 
                    />
                  </FormControl>
                  <FormDescription>
                    Enter tags separated by commas (e.g., workout, motivation, health)
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
                      When active, this message can be sent to members.
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
            
            <CardFooter className="px-0 pt-6 flex justify-between">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => {
                  form.reset();
                  onComplete();
                }}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Saving...' : (editMessage ? 'Update Message' : 'Create Message')}
              </Button>
            </CardFooter>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default MotivationalMessageForm;
