
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { DatePicker } from "@/components/ui/date-picker";
import { Member, MemberMeasurement } from "@/types/user";
import { usePermissions } from "@/hooks/use-permissions";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { FileUpload, Plus, Camera } from "lucide-react";
import MemberProgressChart from "@/components/dashboard/MemberProgressChart";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { format } from "date-fns";

interface ProgressTrackerProps {
  member: Member;
  onUpdateProgress: (measurement: MemberMeasurement) => void;
}

const ProgressTracker = ({ member, onUpdateProgress }: ProgressTrackerProps) => {
  const { userRole } = usePermissions();
  const [isAdding, setIsAdding] = useState(false);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  
  // Check whether current user can add progress data
  const canAddProgress = () => {
    if (userRole === "admin" || userRole === "staff") return true;
    if (userRole === "trainer" && member.trainerId) return true;
    if (userRole === "member" && !member.trainerId) return true;
    return false;
  };
  
  // Initialize form with react-hook-form
  const form = useForm({
    defaultValues: {
      date: new Date().toISOString(),
      weight: member.weight,
      chest: member.chest,
      waist: member.waist,
      biceps: member.biceps,
      thigh: member.thigh,
      hips: member.hips,
      bodyFat: member.bodyFat,
      notes: "",
      photoUrl: "",
    },
  });
  
  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // In a real app, this would upload to a server and return a URL
      // For now, we use a local URL for the preview
      const imageUrl = URL.createObjectURL(file);
      setPhotoPreview(imageUrl);
      form.setValue("photoUrl", imageUrl);
    }
  };
  
  const onSubmit = (data: any) => {
    const newMeasurement: MemberMeasurement = {
      id: `measurement-${Date.now()}`,
      date: data.date,
      weight: data.weight,
      chest: data.chest,
      waist: data.waist,
      biceps: data.biceps,
      thigh: data.thigh,
      hips: data.hips,
      bodyFat: data.bodyFat,
      notes: data.notes,
      photoUrl: data.photoUrl || photoPreview,
      updatedBy: "current-user-id", // In a real app, this would be the current user's ID
      updatedByRole: userRole || "member", // Current user's role
    };
    
    onUpdateProgress(newMeasurement);
    setIsAdding(false);
    setPhotoPreview(null);
    toast.success("Progress updated successfully");
  };
  
  // Format measurements for the chart component
  const getChartData = () => {
    const initialMeasurement = {
      date: member.membershipStartDate || new Date().toISOString(),
      metrics: {
        weight: member.weight || 0,
        chest: member.chest || 0,
        waist: member.waist || 0,
        biceps: member.biceps || 0,
        thigh: member.thigh || 0,
        hips: member.hips || 0,
        bodyFatPercentage: member.bodyFat || 0,
        bmi: member.weight && member.height ? 
          Math.round((member.weight / Math.pow(member.height/100, 2)) * 10) / 10 : 0,
        muscleGain: 0,
      }
    };
    
    // Add baseline measurement if no progress records exist
    if (!member.measurements || member.measurements.length === 0) {
      return [initialMeasurement];
    }
    
    // Transform measurements history into chart data format
    return [
      initialMeasurement,
      ...member.measurements.map(m => ({
        date: m.date,
        metrics: {
          weight: m.weight || 0,
          chest: m.chest || 0,
          waist: m.waist || 0,
          biceps: m.biceps || 0,
          thigh: m.thigh || 0,
          hips: m.hips || 0,
          bodyFatPercentage: m.bodyFat || 0,
          bmi: m.weight && member.height ? 
            Math.round((m.weight / Math.pow(member.height/100, 2)) * 10) / 10 : 0,
          muscleGain: calculateMuscleMass(m, initialMeasurement.metrics),
        }
      }))
    ];
  };
  
  // Simple muscle mass estimation calculation
  const calculateMuscleMass = (
    measurement: MemberMeasurement, 
    baseline: any
  ) => {
    if (!measurement.weight || !measurement.bodyFat) return 0;
    // This is a simplified calculation - in reality, more factors would be considered
    const currentLeanMass = measurement.weight * (1 - measurement.bodyFat/100);
    const initialLeanMass = baseline.weight * (1 - baseline.bodyFatPercentage/100);
    return Math.round((currentLeanMass - initialLeanMass) * 10) / 10;
  };
  
  // Calculate progress between initial and current measurements
  const calculateProgress = (current?: number, initial?: number) => {
    if (current === undefined || initial === undefined || initial === 0) return "-";
    const diff = current - initial;
    const sign = diff > 0 ? "+" : "";
    return `${sign}${diff.toFixed(1)}`;
  };
  
  // Get latest measurement or return initial values if no measurements exist
  const getLatestMeasurement = () => {
    if (!member.measurements || member.measurements.length === 0) {
      return {
        weight: member.weight,
        chest: member.chest,
        waist: member.waist,
        biceps: member.biceps,
        thigh: member.thigh,
        hips: member.hips,
        bodyFat: member.bodyFat,
      };
    }
    
    // Sort by date and get the most recent
    const sorted = [...member.measurements].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );
    return sorted[0];
  };
  
  const latestMeasurement = getLatestMeasurement();
  const chartData = getChartData();
  
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Progress Tracker</CardTitle>
            <CardDescription>Track body measurements and fitness progress</CardDescription>
          </div>
          {canAddProgress() && !isAdding && (
            <Button 
              onClick={() => setIsAdding(true)} 
              size="sm" 
              className="flex items-center gap-1"
            >
              <Plus className="h-4 w-4" />
              Add Progress Entry
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {isAdding ? (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="date"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <FormLabel>Date</FormLabel>
                      <FormControl>
                        <DatePicker
                          date={field.value ? new Date(field.value) : new Date()}
                          onSelect={(date) => field.onChange(date?.toISOString())}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="weight"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <FormLabel>Weight (kg)</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          step="0.1" 
                          value={field.value || ''} 
                          onChange={(e) => field.onChange(parseFloat(e.target.value) || undefined)} 
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
                    <FormItem className="space-y-2">
                      <FormLabel>Chest (cm)</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          step="0.1" 
                          value={field.value || ''} 
                          onChange={(e) => field.onChange(parseFloat(e.target.value) || undefined)} 
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
                    <FormItem className="space-y-2">
                      <FormLabel>Waist (cm)</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          step="0.1" 
                          value={field.value || ''} 
                          onChange={(e) => field.onChange(parseFloat(e.target.value) || undefined)} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="biceps"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <FormLabel>Biceps (cm)</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          step="0.1" 
                          value={field.value || ''} 
                          onChange={(e) => field.onChange(parseFloat(e.target.value) || undefined)} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="thigh"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <FormLabel>Thigh (cm)</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          step="0.1" 
                          value={field.value || ''} 
                          onChange={(e) => field.onChange(parseFloat(e.target.value) || undefined)} 
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
                    <FormItem className="space-y-2">
                      <FormLabel>Hips (cm)</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          step="0.1" 
                          value={field.value || ''} 
                          onChange={(e) => field.onChange(parseFloat(e.target.value) || undefined)} 
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
                    <FormItem className="space-y-2">
                      <FormLabel>Body Fat %</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          step="0.1" 
                          value={field.value || ''} 
                          onChange={(e) => field.onChange(parseFloat(e.target.value) || undefined)} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="notes"
                  render={({ field }) => (
                    <FormItem className="space-y-2 md:col-span-2">
                      <FormLabel>Notes</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Add notes about diet adherence, workout consistency, etc." 
                          className="min-h-[80px]"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="photo">Progress Photo (Optional)</Label>
                  <div className="flex items-center gap-4">
                    <Label 
                      htmlFor="photo" 
                      className="flex items-center gap-2 px-4 py-2 border rounded-md bg-muted cursor-pointer hover:bg-muted/80 transition-colors"
                    >
                      <Camera className="h-4 w-4" />
                      Choose Photo
                    </Label>
                    <Input 
                      id="photo" 
                      type="file" 
                      accept="image/*" 
                      className="hidden" 
                      onChange={handlePhotoChange}
                    />
                    {photoPreview && (
                      <div className="relative">
                        <img 
                          src={photoPreview} 
                          alt="Progress preview" 
                          className="h-16 w-16 object-cover rounded-md" 
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end gap-2">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setIsAdding(false)}
                >
                  Cancel
                </Button>
                <Button type="submit">Save Progress</Button>
              </div>
            </form>
          </Form>
        ) : (
          <Tabs defaultValue="chart">
            <TabsList className="mb-4">
              <TabsTrigger value="chart">Chart View</TabsTrigger>
              <TabsTrigger value="table">Table View</TabsTrigger>
              <TabsTrigger value="compare">Progress Comparison</TabsTrigger>
            </TabsList>
            
            <TabsContent value="chart">
              <div className="space-y-4">
                <MemberProgressChart 
                  data={chartData}
                  memberId={member.id}
                  memberName={member.name}
                />
              </div>
            </TabsContent>
            
            <TabsContent value="table">
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Weight (kg)</TableHead>
                      <TableHead className="hidden md:table-cell">Chest (cm)</TableHead>
                      <TableHead className="hidden md:table-cell">Waist (cm)</TableHead>
                      <TableHead className="hidden md:table-cell">Biceps (cm)</TableHead>
                      <TableHead className="hidden lg:table-cell">Thigh (cm)</TableHead>
                      <TableHead className="hidden lg:table-cell">Hips (cm)</TableHead>
                      <TableHead className="hidden lg:table-cell">Body Fat %</TableHead>
                      <TableHead>Updated By</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {member.measurements && member.measurements.length > 0 ? (
                      [...member.measurements]
                        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                        .map((measurement) => (
                          <TableRow key={measurement.id}>
                            <TableCell>{format(new Date(measurement.date), "MMM d, yyyy")}</TableCell>
                            <TableCell>{measurement.weight}</TableCell>
                            <TableCell className="hidden md:table-cell">{measurement.chest}</TableCell>
                            <TableCell className="hidden md:table-cell">{measurement.waist}</TableCell>
                            <TableCell className="hidden md:table-cell">{measurement.biceps}</TableCell>
                            <TableCell className="hidden lg:table-cell">{measurement.thigh}</TableCell>
                            <TableCell className="hidden lg:table-cell">{measurement.hips}</TableCell>
                            <TableCell className="hidden lg:table-cell">{measurement.bodyFat}</TableCell>
                            <TableCell>{measurement.updatedByRole}</TableCell>
                          </TableRow>
                        ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={9} className="text-center py-6 text-muted-foreground">
                          No measurement records found. Add a new progress entry to start tracking.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
            
            <TabsContent value="compare">
              <div className="space-y-6">
                <Card className="overflow-hidden">
                  <CardHeader className="bg-muted">
                    <CardTitle className="text-lg">Progress Comparison</CardTitle>
                    <CardDescription>
                      Comparing initial measurements with current values
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-1 p-3 rounded-lg border">
                        <p className="text-sm font-medium text-muted-foreground">Weight</p>
                        <div className="flex items-end justify-between">
                          <p className="text-2xl font-bold">{latestMeasurement?.weight || "-"} kg</p>
                          <div className={`text-sm font-medium px-2 py-1 rounded-full ${
                            calculateProgress(latestMeasurement?.weight, member.weight)?.startsWith("+") ? 
                              "bg-orange-100 text-orange-800" : 
                              "bg-green-100 text-green-800"
                          }`}>
                            {calculateProgress(latestMeasurement?.weight, member.weight)} kg
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-1 p-3 rounded-lg border">
                        <p className="text-sm font-medium text-muted-foreground">Waist</p>
                        <div className="flex items-end justify-between">
                          <p className="text-2xl font-bold">{latestMeasurement?.waist || "-"} cm</p>
                          <div className={`text-sm font-medium px-2 py-1 rounded-full ${
                            calculateProgress(latestMeasurement?.waist, member.waist)?.startsWith("+") ? 
                              "bg-orange-100 text-orange-800" : 
                              "bg-green-100 text-green-800"
                          }`}>
                            {calculateProgress(latestMeasurement?.waist, member.waist)} cm
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-1 p-3 rounded-lg border">
                        <p className="text-sm font-medium text-muted-foreground">Body Fat</p>
                        <div className="flex items-end justify-between">
                          <p className="text-2xl font-bold">{latestMeasurement?.bodyFat || "-"}%</p>
                          <div className={`text-sm font-medium px-2 py-1 rounded-full ${
                            calculateProgress(latestMeasurement?.bodyFat, member.bodyFat)?.startsWith("+") ? 
                              "bg-orange-100 text-orange-800" : 
                              "bg-green-100 text-green-800"
                          }`}>
                            {calculateProgress(latestMeasurement?.bodyFat, member.bodyFat)}%
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-1 p-3 rounded-lg border">
                        <p className="text-sm font-medium text-muted-foreground">Chest</p>
                        <div className="flex items-end justify-between">
                          <p className="text-2xl font-bold">{latestMeasurement?.chest || "-"} cm</p>
                          <div className={`text-sm font-medium px-2 py-1 rounded-full ${
                            calculateProgress(latestMeasurement?.chest, member.chest)?.startsWith("+") ? 
                              "bg-green-100 text-green-800" : 
                              "bg-orange-100 text-orange-800"
                          }`}>
                            {calculateProgress(latestMeasurement?.chest, member.chest)} cm
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-1 p-3 rounded-lg border">
                        <p className="text-sm font-medium text-muted-foreground">Biceps</p>
                        <div className="flex items-end justify-between">
                          <p className="text-2xl font-bold">{latestMeasurement?.biceps || "-"} cm</p>
                          <div className={`text-sm font-medium px-2 py-1 rounded-full ${
                            calculateProgress(latestMeasurement?.biceps, member.biceps)?.startsWith("+") ? 
                              "bg-green-100 text-green-800" : 
                              "bg-orange-100 text-orange-800"
                          }`}>
                            {calculateProgress(latestMeasurement?.biceps, member.biceps)} cm
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-1 p-3 rounded-lg border">
                        <p className="text-sm font-medium text-muted-foreground">Thigh</p>
                        <div className="flex items-end justify-between">
                          <p className="text-2xl font-bold">{latestMeasurement?.thigh || "-"} cm</p>
                          <div className={`text-sm font-medium px-2 py-1 rounded-full ${
                            calculateProgress(latestMeasurement?.thigh, member.thigh)?.startsWith("+") ? 
                              "bg-green-100 text-green-800" : 
                              "bg-orange-100 text-orange-800"
                          }`}>
                            {calculateProgress(latestMeasurement?.thigh, member.thigh)} cm
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {member.measurements && member.measurements.length > 0 && 
                     member.measurements[0].photoUrl && (
                      <div className="mt-6 border-t pt-6">
                        <h3 className="text-sm font-medium mb-3">Latest Progress Photo</h3>
                        <div className="flex justify-center">
                          <img 
                            src={member.measurements[0].photoUrl} 
                            alt="Progress" 
                            className="max-h-64 rounded-lg shadow-md" 
                          />
                        </div>
                      </div>
                    )}
                    
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        )}
      </CardContent>
    </Card>
  );
};

export default ProgressTracker;
