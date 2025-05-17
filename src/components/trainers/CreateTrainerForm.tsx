import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useBranch } from "@/hooks/use-branches";

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  email: z.string().email("Please enter a valid email address."),
  phone: z.string().min(6, "Please enter a valid phone number.").optional(),
  specialization: z.string().min(2, "Specialization must be at least 2 characters."),
  bio: z.string().min(10, "Bio must be at least 10 characters.").max(500, "Bio must not exceed 500 characters."),
});

type FormData = z.infer<typeof formSchema>;

interface CreateTrainerFormProps {
  onSuccess?: () => void;
}

export const CreateTrainerForm = ({ onSuccess }: CreateTrainerFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { currentBranch } = useBranch();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      specialization: "",
      bio: "",
    },
  });

  async function onSubmit(values: FormData) {
    if (!currentBranch?.id) {
      toast.error("Please select a branch first");
      return;
    }

    setIsSubmitting(true);

    try {
      // Generate a secure random password (at least 8 characters with numbers and letters)
      const tempPassword = `${Math.random().toString(36).slice(2)}${Math.random().toString(36).slice(2)}`.substring(0, 12) + "A1!";
      
      // First create auth user with required metadata
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: values.email,
        password: tempPassword,
        options: {
          data: {
            full_name: values.name,
            role: 'trainer',
            phone: values.phone || null
          },
        },
      });

      if (authError) {
        console.error('Error creating user:', authError);
        toast.error(`Failed to create trainer: ${authError.message}`);
        return;
      }

      if (!authData.user) {
        toast.error('Failed to create user account');
        return;
      }

      // Update the profile with additional trainer info
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          full_name: values.name,
          phone: values.phone || null,
          department: values.specialization,
          bio: values.bio,
          role: 'trainer',
          branch_id: currentBranch.id
        })
        .eq('id', authData.user.id);

      if (profileError) {
        console.error('Error updating profile:', profileError);
        toast.error(`Failed to update trainer profile: ${profileError.message}`);
        return;
      }

      toast.success("Trainer created successfully!");
      form.reset();
      
      if (onSuccess) {
        onSuccess();
      }
    } catch (error: any) {
      console.error('Error in trainer creation:', error);
      toast.error(`An error occurred: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="John Doe" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="john.doe@example.com" {...field} />
                </FormControl>
                <FormDescription>
                  They will receive login information at this address
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone Number</FormLabel>
                <FormControl>
                  <Input placeholder="+1234567890" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="specialization"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Specialization</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select specialization" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="weight-training">Weight Training</SelectItem>
                  <SelectItem value="cardio">Cardio</SelectItem>
                  <SelectItem value="yoga">Yoga</SelectItem>
                  <SelectItem value="crossfit">CrossFit</SelectItem>
                  <SelectItem value="nutrition">Nutrition</SelectItem>
                  <SelectItem value="physiotherapy">Physiotherapy</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="bio"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Bio</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Brief trainer description and experience" 
                  rows={4}
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Briefly describe the trainer's experience and expertise.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Creating...
            </>
          ) : (
            "Create Trainer"
          )}
        </Button>
      </form>
    </Form>
  );
};
