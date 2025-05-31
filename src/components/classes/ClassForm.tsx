
import { useEffect, useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { format, addHours, parseISO } from "date-fns";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription, 
  DialogFooter 
} from "@/components/ui/dialog";
import { 
  Form, 
  FormControl, 
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
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { GymClass, ClassDifficulty } from "@/types/class";

type ClassFormValues = {
  name: string;
  description: string;
  trainerId: string;
  capacity: number;
  date: Date;
  startTime: string;
  endTime: string;
  type: string;
  location: string;
  difficulty: ClassDifficulty;
  level: string;
  recurring: boolean;
  recurringPattern: string;
};

interface ClassFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialData: GymClass | null;
  onClose: () => void;
}

// ClassFormData type is now defined as ClassFormValues

const ClassForm = ({ 
  open, 
  onOpenChange, 
  initialData, 
  onClose 
}: ClassFormProps) => {
  const [isRecurring, setIsRecurring] = useState(false);
  const [selectedTrainer, setSelectedTrainer] = useState("");
  
  // Mock trainers data - in real app would come from API
  const trainers = [
    { id: "t1", name: "Jane Smith" },
    { id: "t2", name: "Mike Johnson" },
    { id: "t3", name: "Robert Chen" },
    { id: "t4", name: "Sarah Williams" }
  ];
  
  // Class types - in real app might come from API/configuration
  const classTypes = [
    "Yoga", "Pilates", "HIIT", "Strength", "Cardio", 
    "Zumba", "Spinning", "Boxing", "CrossFit", "Other"
  ];
  
  const form = useForm<ClassFormValues>({
    defaultValues: {
      name: "",
      description: "",
      trainerId: "",
      capacity: 10,
      date: new Date(),
      startTime: "08:00",
      endTime: "09:00",
      type: "",
      location: "",
      difficulty: "beginner",
      level: "all",
      recurring: false,
      recurringPattern: "WEEKLY",
    }
  });

  const onSubmit: SubmitHandler<ClassFormValues> = (data) => {
    // In a real app, would send to API
    console.log("Form submitted with data:", data);
    
    // Mock class creation
    const newClass: Partial<GymClass> = {
      name: data.name,
      description: data.description,
      trainerId: data.trainerId,
      trainerName: trainers.find(t => t.id === data.trainerId)?.name || "",
      capacity: data.capacity,
      enrolled: initialData?.enrolled || 0,
      // Combine date and time strings into ISO strings
      startTime: new Date(
        data.date.getFullYear(),
        data.date.getMonth(),
        data.date.getDate(),
        parseInt(data.startTime.split(':')[0]),
        parseInt(data.startTime.split(':')[1])
      ).toISOString(),
      endTime: new Date(
        data.date.getFullYear(),
        data.date.getMonth(),
        data.date.getDate(),
        parseInt(data.endTime.split(':')[0]),
        parseInt(data.endTime.split(':')[1])
      ).toISOString(),
      type: data.type,
      location: data.location,
      difficulty: data.difficulty,
      level: data.level,
      status: "scheduled",
      recurring: data.recurring,
      recurringPattern: data.recurring ? data.recurringPattern : undefined,
    };
    
    console.log("New class data:", newClass);
    
    // Close form
    onClose();
  };
  
  useEffect(() => {
    if (initialData) {
      const startDate = parseISO(initialData.startTime);
      const startTimeStr = format(startDate, "HH:mm");
      const endTimeStr = format(parseISO(initialData.endTime), "HH:mm");
      
      form.reset({
        name: initialData.name,
        description: initialData.description || "",
        trainerId: initialData.trainerId,
        capacity: initialData.capacity,
        date: startDate,
        startTime: startTimeStr,
        endTime: endTimeStr,
        type: initialData.type,
        location: initialData.location || "",
        difficulty: initialData.difficulty as ClassDifficulty || "beginner",
        level: initialData.level || "all",
        recurring: initialData.recurring,
        recurringPattern: initialData.recurringPattern || "WEEKLY",
      });
      
      setIsRecurring(initialData.recurring);
      setSelectedTrainer(initialData.trainerId);
    } else {
      form.reset({
        name: "",
        description: "",
        trainerId: "",
        capacity: 10,
        date: new Date(),
        startTime: "08:00",
        endTime: "09:00",
        type: "",
        location: "",
        difficulty: "beginner",
        level: "all",
        recurring: false,
        recurringPattern: "WEEKLY",
      });
      setIsRecurring(false);
      setSelectedTrainer("");
    }
  }, [initialData, form]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>
            {initialData ? "Edit Class" : "Create New Class"}
          </DialogTitle>
          <DialogDescription>
            {initialData ? "Update the details of this class." : "Fill in the details to create a new class."}
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Class Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter class name" {...field} />
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
                      value={field.value} 
                      onValueChange={(value) => {
                        field.onChange(value);
                        setSelectedTrainer(value);
                      }}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select trainer" />
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
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Enter class description" 
                      className="resize-none" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "pl-3 text-left font-normal",
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
                name="startTime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Start Time</FormLabel>
                    <div className="flex items-center">
                      <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                      <Input 
                        type="time" 
                        {...field} 
                        onChange={(e) => {
                          field.onChange(e);
                          // Automatically set end time to be 1 hour after start time
                          const startTime = e.target.value;
                          if (startTime) {
                            const [hours, minutes] = startTime.split(':').map(Number);
                            const startDate = new Date();
                            startDate.setHours(hours, minutes, 0);
                            const endDate = addHours(startDate, 1);
                            form.setValue("endTime", 
                              `${String(endDate.getHours()).padStart(2, '0')}:${String(endDate.getMinutes()).padStart(2, '0')}`
                            );
                          }
                        }}
                      />
                    </div>
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
                    <div className="flex items-center">
                      <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                      <Input type="time" {...field} />
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Class Type</FormLabel>
                    <Select 
                      value={field.value} 
                      onValueChange={field.onChange}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {classTypes.map((type) => (
                          <SelectItem key={type} value={type}>
                            {type}
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
                name="difficulty"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Difficulty</FormLabel>
                    <Select 
                      value={field.value} 
                      onValueChange={field.onChange}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select difficulty" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="all">All Levels</SelectItem>
                        <SelectItem value="beginner">Beginner</SelectItem>
                        <SelectItem value="intermediate">Intermediate</SelectItem>
                        <SelectItem value="advanced">Advanced</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="level"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Level</FormLabel>
                    <Select 
                      value={field.value} 
                      onValueChange={field.onChange}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select level" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="all">All Levels</SelectItem>
                        <SelectItem value="beginner">Beginner</SelectItem>
                        <SelectItem value="intermediate">Intermediate</SelectItem>
                        <SelectItem value="advanced">Advanced</SelectItem>
                        <SelectItem value="expert">Expert</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="capacity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Capacity</FormLabel>
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
            </div>
            
            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Location</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter class location" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="flex flex-col space-y-4">
              <FormField
                control={form.control}
                name="recurring"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                    <div className="space-y-0.5">
                      <FormLabel>Recurring Class</FormLabel>
                      <div className="text-sm text-muted-foreground">
                        Create a repeating class schedule
                      </div>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={(checked) => {
                          field.onChange(checked);
                          setIsRecurring(checked);
                        }}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              
              {isRecurring && (
                <FormField
                  control={form.control}
                  name="recurringPattern"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Recurrence Pattern</FormLabel>
                      <Select 
                        value={field.value} 
                        onValueChange={field.onChange}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select pattern" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="WEEKLY">Weekly</SelectItem>
                          <SelectItem value="MON,WED,FRI">Monday, Wednesday, Friday</SelectItem>
                          <SelectItem value="TUE,THU">Tuesday, Thursday</SelectItem>
                          <SelectItem value="WEEKEND">Weekends</SelectItem>
                          <SelectItem value="DAILY">Daily</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
            </div>
            
            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit">
                {initialData ? "Update Class" : "Create Class"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default ClassForm;
