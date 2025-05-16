import React from 'react';
import { useState, useEffect, useCallback } from 'react';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
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
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from 'date-fns';
import { DatePicker } from "@/components/ui/date-picker";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/components/ui/use-toast";
import { Member } from '@/types';

// We'll mock these imports until they're resolved or created
// import { countries } from 'countries-list';
// import { Country, State } from 'country-state-city';
import membersService from '@/services/membersService';

// Create a mock TrainerSelect component
const TrainerSelect = ({ value, onChange }: { value: string, onChange: (value: string) => void }) => (
  <Select value={value} onValueChange={onChange}>
    <SelectTrigger>
      <SelectValue placeholder="Select a trainer" />
    </SelectTrigger>
    <SelectContent>
      <SelectItem value="trainer-1">John Smith</SelectItem>
      <SelectItem value="trainer-2">Sarah Johnson</SelectItem>
      <SelectItem value="trainer-3">Mike Wilson</SelectItem>
    </SelectContent>
  </Select>
);

const phoneRegExp = new RegExp(
  /^\s*(?:\+?(\d+))[-. (]*(\d{3})[-. )]*(\d{3})[-. ]*(\d{4})(?: *x(\d+))?\s*$/
);

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Invalid email address.",
  }),
  phone: z.string().regex(phoneRegExp, {
    message: "Invalid phone number.",
  }),
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  zip_code: z.string().optional(),
  country: z.string().optional(),
  gender: z.string().optional(),
  date_of_birth: z.string().optional(),
  id_type: z.string().optional(),
  id_number: z.string().optional(),
  membership_id: z.string().optional(),
  membership_status: z.string().optional(),
  membership_start_date: z.string().optional(),
  membership_end_date: z.string().optional(),
  trainer_id: z.string().optional(),
  goal: z.string().optional(),
  occupation: z.string().optional(),
  blood_group: z.string().optional(),
});

interface MemberProfileFormProps {
  member: Member | null;
  onSubmit: (values: z.infer<typeof formSchema>) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
}

const MemberProfileForm: React.FC<MemberProfileFormProps> = ({ 
  member, 
  onSubmit, 
  onCancel, 
  isSubmitting = false 
}) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState<Member>({
    id: member?.id || '',
    name: member?.name || '',
    email: member?.email || '',
    phone: member?.phone || '',
    address: member?.address || '',
    city: member?.city || '',
    state: member?.state || '',
    zip_code: member?.zip_code || member?.zipCode || '',
    country: member?.country || '',
    gender: member?.gender || '',
    date_of_birth: member?.date_of_birth || '',
    id_type: member?.id_type || '',
    id_number: member?.id_number || '',
    membership_id: member?.membership_id || '',
    membership_status: member?.membership_status || '',
    membership_start_date: member?.membership_start_date || '',
    membership_end_date: member?.membership_end_date || '',
    trainer_id: member?.trainer_id || '',
    goal: member?.goal || '',
    occupation: member?.occupation || '',
    blood_group: member?.blood_group || '',
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: member?.name || "",
      email: member?.email || "",
      phone: member?.phone || "",
      address: member?.address || "",
      city: member?.city || "",
      state: member?.state || "",
      zip_code: member?.zip_code || member?.zipCode || "",
      country: member?.country || "",
      gender: member?.gender || "",
      date_of_birth: member?.date_of_birth || member?.dateOfBirth || "",
      id_type: member?.id_type || "",
      id_number: member?.id_number || "",
      membership_id: member?.membership_id || member?.membershipId || "",
      membership_status: member?.membership_status || member?.membershipStatus || "",
      membership_start_date: member?.membership_start_date || member?.membershipStartDate || "",
      membership_end_date: member?.membership_end_date || member?.membershipEndDate || "",
      trainer_id: member?.trainer_id || member?.trainerId || "",
      goal: member?.goal || "",
      occupation: member?.occupation || "",
      blood_group: member?.blood_group || "",
    },
  });

  const updateFormData = (key: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSubmit = async (data: any) => {
    // This function now handles both camelCase and snake_case properties
    const convertedData = {
      id: data.id,
      name: data.name,
      email: data.email,
      phone: data.phone,
      address: data.address,
      city: data.city,
      state: data.state,
      country: data.country,
      zip_code: data.zip_code || data.zipCode,
      gender: data.gender,
      date_of_birth: data.date_of_birth || data.dateOfBirth,
      membership_id: data.membership_id || data.membershipId,
      membership_status: data.membership_status || data.membershipStatus,
      membership_start_date: data.membership_start_date || data.membershipStartDate,
      membership_end_date: data.membership_end_date || data.membershipEndDate,
      trainer_id: data.trainer_id || data.trainerId,
      goal: data.goal,
      occupation: data.occupation,
      blood_group: data.blood_group,
      id_type: data.id_type,
      id_number: data.id_number,
      // Add any other fields that need conversion
    };

    onSubmit({
      ...convertedData,
      address: data.address || '',
      city: data.city || '',
      state: data.state || '',
      zip_code: data.zip_code || '',
      country: data.country || '',
      gender: data.gender || '',
      date_of_birth: data.date_of_birth || '',
      id_type: data.id_type || '',
      id_number: data.id_number || '',
      membership_id: data.membership_id || '',
      membership_status: data.membership_status || '',
      membership_start_date: data.membership_start_date || '',
      membership_end_date: data.membership_end_date || '',
      trainer_id: data.trainer_id || '',
      goal: data.goal || '',
      occupation: data.occupation || '',
      blood_group: data.blood_group || '',
    });
  };
  
  return (
    <form onSubmit={form.handleSubmit(handleSubmit)}>
      <div className="grid gap-4">
        <div className="space-y-2">
          <h3 className="text-lg font-medium">Personal Information</h3>
          <p className="text-sm text-muted-foreground">Update your personal details</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="johndoe@example.com" {...field} />
                </FormControl>
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
                  <Input placeholder="+16479304837" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="gender"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Gender</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a gender" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="date_of_birth"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Date of birth</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-[240px] pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(new Date(field.value), "PPP")
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
                      selected={field.value ? new Date(field.value) : undefined}
                      onSelect={(date) => field.onChange(date?.toISOString())}
                      disabled={(date) =>
                        date > new Date() || date < new Date("1900-01-01")
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>

      {/* Address Section */}
      <div className="grid gap-4 mt-8">
        <div className="space-y-2">
          <h3 className="text-lg font-medium">Address</h3>
          <p className="text-sm text-muted-foreground">Update your address details</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="address"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Address</FormLabel>
                <FormControl>
                  <Input placeholder="123 Main St" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="city"
            render={({ field }) => (
              <FormItem>
                <FormLabel>City</FormLabel>
                <FormControl>
                  <Input placeholder="New York" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="state"
            render={({ field }) => (
              <FormItem>
                <FormLabel>State</FormLabel>
                <FormControl>
                  <Input placeholder="NY" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="zip_code"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Zip Code</FormLabel>
                <FormControl>
                  <Input placeholder="10001" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="country"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Country</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a country" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="max-h-96 overflow-y-auto">
                    {Object.keys(countries).map((key) => (
                      <SelectItem key={key} value={key}>
                        {countries[key].name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>
      
      {/* Membership Section */}
      <div className="grid gap-4 mt-8">
        <div className="space-y-2">
          <h3 className="text-lg font-medium">Membership Details</h3>
          <p className="text-sm text-muted-foreground">Update membership information for this member</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="membershipStartDate">Start Date</Label>
            <Input
              id="membershipStartDate"
              type="date"
              value={formData.membership_start_date || ''}
              onChange={(e) => updateFormData('membership_start_date', e.target.value)}
            />
          </div>
          
          <div>
            <Label htmlFor="membershipEndDate">End Date</Label>
            <Input
              id="membershipEndDate"
              type="date"
              value={formData.membership_end_date || ''}
              onChange={(e) => updateFormData('membership_end_date', e.target.value)}
            />
          </div>
          
          <div>
            <Label htmlFor="trainer">Assigned Trainer</Label>
            <TrainerSelect 
              value={formData.trainer_id || ''}
              onChange={(value) => updateFormData('trainer_id', value)}
            />
          </div>
          
          <FormField
            control={form.control}
            name="goal"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Goal</FormLabel>
                <FormControl>
                  <Input placeholder="Weight Loss" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="occupation"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Occupation</FormLabel>
                <FormControl>
                  <Input placeholder="Engineer" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="blood_group"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Blood Group</FormLabel>
                <FormControl>
                  <Input placeholder="O+" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>
      
      {/* ID Information Section */}
      <div className="grid gap-4 mt-8">
        <div className="space-y-2">
          <h3 className="text-lg font-medium">ID Information</h3>
          <p className="text-sm text-muted-foreground">Provide government-issued ID details</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="id_type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>ID Type</FormLabel>
                <FormControl>
                  <Input placeholder="Passport" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="id_number"
            render={({ field }) => (
              <FormItem>
                <FormLabel>ID Number</FormLabel>
                <FormControl>
                  <Input placeholder="AB1234567" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>
      
      <div className="flex justify-end mt-6 space-x-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>
    </form>
  );
};

export default MemberProfileForm;
