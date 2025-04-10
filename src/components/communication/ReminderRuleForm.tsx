import React, { useState, useEffect } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from '@/components/ui/form';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter 
} from '@/components/ui/dialog';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Popover, 
  PopoverContent, 
  PopoverTrigger 
} from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { CalendarIcon, Clock, Info } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { ReminderRule } from '@/types/notification';

const reminderRuleSchema = z.object({
  name: z.string().min(3, { message: 'Name must be at least 3 characters' }),
  type: z.enum(['attendance', 'renewal', 'membership-expiry', 'birthday']),
  triggerDays: z.number().min(1, { message: 'Must be at least 1 day' }),
  message: z.string().min(10, { message: 'Message must be at least 10 characters' }),
  active: z.boolean(),
  sendEmail: z.boolean(),
  sendSMS: z.boolean(),
  sendPush: z.boolean(),
  specificDate: z.date().optional(),
  specificTime: z.string().optional(),
  repeatYearly: z.boolean().optional(),
  targetGroups: z.array(z.string()).optional(),
});

type ReminderRuleFormValues = z.infer<typeof reminderRuleSchema>;

interface ReminderRuleFormProps {
  open: boolean;
  onClose: () => void;
  onSave: (rule: ReminderRule) => void;
  editingRule?: ReminderRule;
}

const ReminderRuleForm = ({ open, onClose, onSave, editingRule }: ReminderRuleFormProps) => {
  const [type, setType] = useState<"attendance" | "renewal" | "membership-expiry" | "birthday">('attendance');
  const { toast } = useToast();

  const form = useForm<ReminderRuleFormValues>({
    resolver: zodResolver(reminderRuleSchema),
    defaultValues: {
      name: '',
      type: 'attendance',
      triggerDays: 1,
      message: '',
      active: true,
      sendEmail: true,
      sendSMS: false,
      sendPush: false,
      repeatYearly: false,
      targetGroups: [],
    },
  });

  useEffect(() => {
    if (editingRule) {
      form.reset({
        name: editingRule.name,
        type: editingRule.type,
        triggerDays: editingRule.triggerDays,
        message: editingRule.message,
        active: editingRule.active,
        sendEmail: editingRule.sendEmail,
        sendSMS: editingRule.sendSMS,
        sendPush: editingRule.sendPush,
        specificDate: editingRule.specificDate ? new Date(editingRule.specificDate) : undefined,
        specificTime: editingRule.specificTime,
        repeatYearly: editingRule.repeatYearly,
        targetGroups: editingRule.targetGroups,
      });
      setType(editingRule.type);
    } else {
      form.reset({
        name: '',
        type: 'attendance',
        triggerDays: 1,
        message: '',
        active: true,
        sendEmail: true,
        sendSMS: false,
        sendPush: false,
        repeatYearly: false,
        targetGroups: [],
      });
      setType('attendance');
    }
  }, [editingRule, form]);

  const onSubmit = (values: ReminderRuleFormValues) => {
    const newRule: ReminderRule = {
      id: editingRule?.id || `rule-${Date.now()}`,
      ...values,
      createdAt: editingRule?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    onSave(newRule);
    toast({
      title: editingRule ? "Rule Updated" : "Rule Created",
      description: `Reminder rule has been ${editingRule ? "updated" : "created"} successfully.`,
    });
    onClose();
  };

  const handleTypeChange = (value: string) => {
    setType(value as "attendance" | "renewal" | "membership-expiry" | "birthday");
    form.setValue('type', value as any);
  };

  const memberGroups = [
    { id: 'all', label: 'All Members' },
    { id: 'active', label: 'Active Members' },
    { id: 'inactive', label: 'Inactive Members' },
    { id: 'premium', label: 'Premium Members' },
    { id: 'standard', label: 'Standard Members' },
    { id: 'basic', label: 'Basic Members' },
  ];

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{editingRule ? 'Edit Reminder Rule' : 'Create New Reminder Rule'}</DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Basic Information Section */}
              <div className="space-y-4 md:col-span-2">
                <h3 className="text-lg font-medium">Basic Information</h3>
                
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Rule Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter rule name" {...field} />
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
                      <FormLabel>Reminder Type</FormLabel>
                      <Select 
                        onValueChange={(value) => handleTypeChange(value)} 
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select reminder type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="attendance">Attendance Reminder</SelectItem>
                          <SelectItem value="renewal">Membership Renewal</SelectItem>
                          <SelectItem value="membership-expiry">Membership Expiry</SelectItem>
                          <SelectItem value="birthday">Birthday Reminder</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              {/* Trigger Settings Section */}
              <div className="space-y-4 md:col-span-2">
                <h3 className="text-lg font-medium">Trigger Settings</h3>
                
                {type !== 'birthday' && (
                  <FormField
                    control={form.control}
                    name="triggerDays"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          {type === 'attendance' 
                            ? 'Days Since Last Visit' 
                            : type === 'renewal' 
                              ? 'Days Before Renewal' 
                              : 'Days Before Expiry'}
                        </FormLabel>
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
                )}
                
                {type === 'birthday' && (
                  <>
                    <FormField
                      control={form.control}
                      name="triggerDays"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Days Before Birthday</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              min={0} 
                              max={30} 
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
                      name="repeatYearly"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                          <div className="space-y-0.5">
                            <FormLabel>Repeat Yearly</FormLabel>
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
                  </>
                )}
                
                {type === 'attendance' && (
                  <>
                    <FormField
                      control={form.control}
                      name="specificDate"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel>Specific Date (Optional)</FormLabel>
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
                      name="specificTime"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Specific Time (Optional)</FormLabel>
                          <div className="flex items-center">
                            <FormControl>
                              <Input
                                type="time"
                                placeholder="Select time"
                                {...field}
                              />
                            </FormControl>
                            <Clock className="ml-2 h-4 w-4 text-muted-foreground" />
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </>
                )}
              </div>
              
              {/* Message Content Section */}
              <div className="space-y-4 md:col-span-2">
                <h3 className="text-lg font-medium">Message Content</h3>
                
                <FormField
                  control={form.control}
                  name="message"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Message</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Enter reminder message" 
                          className="min-h-[100px]" 
                          {...field} 
                        />
                      </FormControl>
                      <div className="text-xs text-muted-foreground mt-1">
                        <Info className="h-3 w-3 inline mr-1" />
                        You can use placeholders like {'{name}'}, {'{date}'}, {'{membership_type}'} in your message.
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              {/* Notification Channels Section */}
              <div className="space-y-4 md:col-span-1">
                <h3 className="text-lg font-medium">Notification Channels</h3>
                
                <FormField
                  control={form.control}
                  name="sendEmail"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                      <div className="space-y-0.5">
                        <FormLabel>Send Email</FormLabel>
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
                
                <FormField
                  control={form.control}
                  name="sendSMS"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                      <div className="space-y-0.5">
                        <FormLabel>Send SMS</FormLabel>
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
                
                <FormField
                  control={form.control}
                  name="sendPush"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                      <div className="space-y-0.5">
                        <FormLabel>Send Push Notification</FormLabel>
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
              </div>
              
              {/* Target Groups & Status Section */}
              <div className="space-y-4 md:col-span-1">
                <h3 className="text-lg font-medium">Target Groups & Status</h3>
                
                <FormField
                  control={form.control}
                  name="targetGroups"
                  render={() => (
                    <FormItem>
                      <div className="mb-2">
                        <FormLabel>Target Member Groups</FormLabel>
                      </div>
                      <div className="space-y-2">
                        {memberGroups.map((group) => (
                          <FormField
                            key={group.id}
                            control={form.control}
                            name="targetGroups"
                            render={({ field }) => {
                              return (
                                <FormItem
                                  key={group.id}
                                  className="flex flex-row items-start space-x-3 space-y-0"
                                >
                                  <FormControl>
                                    <Checkbox
                                      checked={field.value?.includes(group.id)}
                                      onCheckedChange={(checked) => {
                                        const currentValues = field.value || [];
                                        if (checked) {
                                          field.onChange([...currentValues, group.id]);
                                        } else {
                                          field.onChange(
                                            currentValues.filter((value) => value !== group.id)
                                          );
                                        }
                                      }}
                                    />
                                  </FormControl>
                                  <FormLabel className="font-normal">
                                    {group.label}
                                  </FormLabel>
                                </FormItem>
                              );
                            }}
                          />
                        ))}
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="active"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                      <div className="space-y-0.5">
                        <FormLabel>Rule Status</FormLabel>
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
              </div>
            </div>
            
            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit">
                {editingRule ? 'Update Rule' : 'Create Rule'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default ReminderRuleForm;
