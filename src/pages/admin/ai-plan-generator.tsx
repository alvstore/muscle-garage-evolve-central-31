import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { aiService, WorkoutPlanParams, DietPlanParams } from '@/services/aiService';
import AdminLayout from '@/layouts/AdminLayout';
import { useAuth } from '@/hooks/use-auth';
import { Loader2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import ReactMarkdown from 'react-markdown';

// Common goals for both workout and diet plans
const commonGoals = [
  { id: 'weight-loss', label: 'Weight Loss' },
  { id: 'muscle-gain', label: 'Muscle Gain' },
  { id: 'strength', label: 'Strength' },
  { id: 'endurance', label: 'Endurance' },
  { id: 'flexibility', label: 'Flexibility' },
  { id: 'general-fitness', label: 'General Fitness' },
  { id: 'athletic-performance', label: 'Athletic Performance' },
];

// Common dietary restrictions
const dietaryRestrictions = [
  { id: 'gluten-free', label: 'Gluten Free' },
  { id: 'dairy-free', label: 'Dairy Free' },
  { id: 'nut-free', label: 'Nut Free' },
  { id: 'low-carb', label: 'Low Carb' },
  { id: 'low-fat', label: 'Low Fat' },
  { id: 'low-sodium', label: 'Low Sodium' },
  { id: 'diabetic-friendly', label: 'Diabetic Friendly' },
];

export default function AIPlanGeneratorPage() {
  const navigate = useNavigate();
  const { user, isAdmin } = useAuth();
  const [activeTab, setActiveTab] = useState<'workout' | 'diet'>('workout');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [generatedPlan, setGeneratedPlan] = useState<string | null>(null);
  
  // Workout plan form
  const workoutForm = useForm<WorkoutPlanParams>({
    defaultValues: {
      title: '',
      description: '',
      fitnessLevel: 'intermediate',
      goals: [],
      restrictions: [],
      daysPerWeek: 4,
      sessionDuration: 60,
      isPublic: true,
    },
  });

  // Diet plan form
  const dietForm = useForm<DietPlanParams>({
    defaultValues: {
      title: '',
      description: '',
      dietType: 'vegetarian',
      cuisineType: 'indian',
      caloriesPerDay: 2000,
      goals: [],
      restrictions: [],
      isPublic: true,
    },
  });

  // Redirect non-admin users
  if (user && !isAdmin) {
    toast.error('Only administrators can access this page');
    navigate('/dashboard');
    return null;
  }

  const generateWorkoutPlan = async (data: WorkoutPlanParams) => {
    try {
      setIsGenerating(true);
      setGeneratedPlan(null);
      
      const plan = await aiService.generateWorkoutPlan(data);
      if (plan) {
        setGeneratedPlan(plan);
        toast.success('Workout plan generated successfully');
      }
    } catch (error) {
      console.error('Error generating workout plan:', error);
      toast.error('Failed to generate workout plan');
    } finally {
      setIsGenerating(false);
    }
  };

  const generateDietPlan = async (data: DietPlanParams) => {
    try {
      setIsGenerating(true);
      setGeneratedPlan(null);
      
      const plan = await aiService.generateDietPlan(data);
      if (plan) {
        setGeneratedPlan(plan);
        toast.success('Diet plan generated successfully');
      }
    } catch (error) {
      console.error('Error generating diet plan:', error);
      toast.error('Failed to generate diet plan');
    } finally {
      setIsGenerating(false);
    }
  };

  const saveWorkoutPlan = async () => {
    try {
      if (!generatedPlan) {
        toast.error('No plan to save. Please generate a plan first.');
        return;
      }
      
      setIsSaving(true);
      const data = workoutForm.getValues();
      await aiService.saveWorkoutPlan(data, generatedPlan);
      
      // Reset form and generated plan after successful save
      workoutForm.reset({
        title: '',
        description: '',
        fitnessLevel: 'intermediate',
        goals: [],
        restrictions: [],
        daysPerWeek: 4,
        sessionDuration: 60,
        isPublic: true,
      });
      setGeneratedPlan(null);
    } catch (error) {
      console.error('Error saving workout plan:', error);
      toast.error('Failed to save workout plan');
    } finally {
      setIsSaving(false);
    }
  };

  const saveDietPlan = async () => {
    try {
      if (!generatedPlan) {
        toast.error('No plan to save. Please generate a plan first.');
        return;
      }
      
      setIsSaving(true);
      const data = dietForm.getValues();
      await aiService.saveDietPlan(data, generatedPlan);
      
      // Reset form and generated plan after successful save
      dietForm.reset({
        title: '',
        description: '',
        dietType: 'vegetarian',
        cuisineType: 'indian',
        caloriesPerDay: 2000,
        goals: [],
        restrictions: [],
        isPublic: true,
      });
      setGeneratedPlan(null);
    } catch (error) {
      console.error('Error saving diet plan:', error);
      toast.error('Failed to save diet plan');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-medium">AI Plan Generator</h3>
          <p className="text-sm text-muted-foreground">
            Generate personalized workout and diet plans using AI
          </p>
        </div>

        <Tabs
          value={activeTab}
          onValueChange={(value) => {
            setActiveTab(value as 'workout' | 'diet');
            setGeneratedPlan(null);
          }}
          className="space-y-4"
        >
          <TabsList>
            <TabsTrigger value="workout">Workout Plan</TabsTrigger>
            <TabsTrigger value="diet">Diet Plan</TabsTrigger>
          </TabsList>

          <TabsContent value="workout" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Create Workout Plan</CardTitle>
                <CardDescription>
                  Configure the parameters for the AI-generated workout plan
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Title</Label>
                    <Input
                      id="title"
                      placeholder="Enter plan title"
                      {...workoutForm.register('title', { required: true })}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="fitnessLevel">Fitness Level</Label>
                    <Select
                      value={workoutForm.watch('fitnessLevel')}
                      onValueChange={(value) => workoutForm.setValue('fitnessLevel', value as any)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select fitness level" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="beginner">Beginner</SelectItem>
                        <SelectItem value="intermediate">Intermediate</SelectItem>
                        <SelectItem value="advanced">Advanced</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Enter plan description"
                    {...workoutForm.register('description')}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="daysPerWeek">Days Per Week</Label>
                    <Input
                      id="daysPerWeek"
                      type="number"
                      min={1}
                      max={7}
                      {...workoutForm.register('daysPerWeek', {
                        required: true,
                        valueAsNumber: true,
                        min: 1,
                        max: 7,
                      })}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="sessionDuration">Session Duration (minutes)</Label>
                    <Input
                      id="sessionDuration"
                      type="number"
                      min={15}
                      max={180}
                      step={5}
                      {...workoutForm.register('sessionDuration', {
                        required: true,
                        valueAsNumber: true,
                        min: 15,
                        max: 180,
                      })}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Goals</Label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {commonGoals.map((goal) => (
                      <div key={goal.id} className="flex items-center space-x-2">
                        <Checkbox
                          id={`workout-goal-${goal.id}`}
                          checked={workoutForm.watch('goals').includes(goal.label)}
                          onCheckedChange={(checked) => {
                            const currentGoals = workoutForm.watch('goals');
                            if (checked) {
                              workoutForm.setValue('goals', [...currentGoals, goal.label]);
                            } else {
                              workoutForm.setValue(
                                'goals',
                                currentGoals.filter((g) => g !== goal.label)
                              );
                            }
                          }}
                        />
                        <Label htmlFor={`workout-goal-${goal.id}`}>{goal.label}</Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Restrictions/Limitations</Label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {['Lower Back Pain', 'Knee Issues', 'Shoulder Pain', 'Limited Equipment', 'Home Workout Only'].map((restriction) => (
                      <div key={restriction} className="flex items-center space-x-2">
                        <Checkbox
                          id={`workout-restriction-${restriction}`}
                          checked={workoutForm.watch('restrictions').includes(restriction)}
                          onCheckedChange={(checked) => {
                            const currentRestrictions = workoutForm.watch('restrictions');
                            if (checked) {
                              workoutForm.setValue('restrictions', [...currentRestrictions, restriction]);
                            } else {
                              workoutForm.setValue(
                                'restrictions',
                                currentRestrictions.filter((r) => r !== restriction)
                              );
                            }
                          }}
                        />
                        <Label htmlFor={`workout-restriction-${restriction}`}>{restriction}</Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="workout-is-public"
                    checked={workoutForm.watch('isPublic')}
                    onCheckedChange={(checked) => workoutForm.setValue('isPublic', checked)}
                  />
                  <Label htmlFor="workout-is-public">Make this plan public</Label>
                </div>

                <div className="flex justify-end">
                  <Button
                    type="button"
                    onClick={() => generateWorkoutPlan(workoutForm.getValues())}
                    disabled={isGenerating}
                  >
                    {isGenerating ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      'Generate Plan'
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="diet" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Create Diet Plan</CardTitle>
                <CardDescription>
                  Configure the parameters for the AI-generated Indian diet plan
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="diet-title">Title</Label>
                    <Input
                      id="diet-title"
                      placeholder="Enter plan title"
                      {...dietForm.register('title', { required: true })}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="dietType">Diet Type</Label>
                    <Select
                      value={dietForm.watch('dietType')}
                      onValueChange={(value) => dietForm.setValue('dietType', value as any)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select diet type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="vegetarian">Vegetarian</SelectItem>
                        <SelectItem value="non-vegetarian">Non-Vegetarian</SelectItem>
                        <SelectItem value="vegan">Vegan</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="diet-description">Description</Label>
                  <Textarea
                    id="diet-description"
                    placeholder="Enter plan description"
                    {...dietForm.register('description')}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="caloriesPerDay">Calories Per Day</Label>
                  <Input
                    id="caloriesPerDay"
                    type="number"
                    min={1000}
                    max={4000}
                    step={100}
                    {...dietForm.register('caloriesPerDay', {
                      required: true,
                      valueAsNumber: true,
                      min: 1000,
                      max: 4000,
                    })}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Goals</Label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {commonGoals.map((goal) => (
                      <div key={goal.id} className="flex items-center space-x-2">
                        <Checkbox
                          id={`diet-goal-${goal.id}`}
                          checked={dietForm.watch('goals').includes(goal.label)}
                          onCheckedChange={(checked) => {
                            const currentGoals = dietForm.watch('goals');
                            if (checked) {
                              dietForm.setValue('goals', [...currentGoals, goal.label]);
                            } else {
                              dietForm.setValue(
                                'goals',
                                currentGoals.filter((g) => g !== goal.label)
                              );
                            }
                          }}
                        />
                        <Label htmlFor={`diet-goal-${goal.id}`}>{goal.label}</Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Dietary Restrictions</Label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {dietaryRestrictions.map((restriction) => (
                      <div key={restriction.id} className="flex items-center space-x-2">
                        <Checkbox
                          id={`diet-restriction-${restriction.id}`}
                          checked={dietForm.watch('restrictions').includes(restriction.label)}
                          onCheckedChange={(checked) => {
                            const currentRestrictions = dietForm.watch('restrictions');
                            if (checked) {
                              dietForm.setValue('restrictions', [...currentRestrictions, restriction.label]);
                            } else {
                              dietForm.setValue(
                                'restrictions',
                                currentRestrictions.filter((r) => r !== restriction.label)
                              );
                            }
                          }}
                        />
                        <Label htmlFor={`diet-restriction-${restriction.id}`}>{restriction.label}</Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="diet-is-public"
                    checked={dietForm.watch('isPublic')}
                    onCheckedChange={(checked) => dietForm.setValue('isPublic', checked)}
                  />
                  <Label htmlFor="diet-is-public">Make this plan public</Label>
                </div>

                <div className="flex justify-end">
                  <Button
                    type="button"
                    onClick={() => generateDietPlan(dietForm.getValues())}
                    disabled={isGenerating}
                  >
                    {isGenerating ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      'Generate Plan'
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {generatedPlan && (
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Generated Plan</CardTitle>
                <CardDescription>
                  {activeTab === 'workout' ? 'Workout' : 'Diet'} plan generated by AI
                </CardDescription>
              </div>
              <Badge variant="outline">
                {activeTab === 'workout' ? workoutForm.watch('fitnessLevel') : dietForm.watch('dietType')}
              </Badge>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-muted p-4 rounded-md max-h-[500px] overflow-y-auto">
                <ReactMarkdown>{generatedPlan}</ReactMarkdown>
              </div>
              
              <div className="flex justify-end">
                <Button
                  type="button"
                  onClick={activeTab === 'workout' ? saveWorkoutPlan : saveDietPlan}
                  disabled={isSaving}
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    'Save Plan'
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </AdminLayout>
  );
}
