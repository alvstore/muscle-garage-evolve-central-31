
import React, { useState } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { Container } from "@/components/ui/container";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Sparkles, CheckCircle } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { usePermissions } from '@/hooks/use-permissions';
import { useToast } from '@/hooks/use-toast';

const AIplanGenerator = () => {
  const { user } = useAuth();
  const { isAdmin, isSuperAdmin } = usePermissions();
  const { toast } = useToast();
  
  const [planType, setPlanType] = useState<'workout' | 'diet'>('workout');
  const [planDetails, setPlanDetails] = useState('');
  const [fitnessLevel, setFitnessLevel] = useState('intermediate');
  const [dietType, setDietType] = useState('balanced');
  const [sessionDuration, setSessionDuration] = useState('60');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedPlan, setGeneratedPlan] = useState<string | null>(null);
  const [planTitle, setPlanTitle] = useState('');
  
  const handleGenerate = async () => {
    if (!planDetails.trim()) {
      toast({
        title: "Missing details",
        description: "Please provide information about the plan you want to generate",
        variant: "destructive"
      });
      return;
    }
    
    setIsGenerating(true);
    
    try {
      // Simulate API call
      setTimeout(() => {
        const plan = planType === 'workout' 
          ? generateMockWorkoutPlan(fitnessLevel, parseInt(sessionDuration))
          : generateMockDietPlan(dietType);
        
        setGeneratedPlan(plan);
        setIsGenerating(false);
      }, 3000);
      
    } catch (error) {
      console.error('Error generating plan:', error);
      toast({
        title: "Generation failed",
        description: "Failed to generate the plan. Please try again later.",
        variant: "destructive"
      });
      setIsGenerating(false);
    }
  };
  
  const handleSavePlan = () => {
    if (!planTitle.trim()) {
      toast({
        title: "Missing title",
        description: "Please provide a title for your plan",
        variant: "destructive"
      });
      return;
    }
    
    // Logic to save the plan would go here
    toast({
      title: "Plan saved",
      description: `Your ${planType} plan has been saved successfully.`
    });
    
    // Reset form
    setGeneratedPlan(null);
    setPlanDetails('');
    setPlanTitle('');
  };
  
  if (!isAdmin()) {
    return (
      <Container>
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Access Denied</CardTitle>
            <CardDescription>
              You don't have permission to access this page.
            </CardDescription>
          </CardHeader>
        </Card>
      </Container>
    );
  }
  
  return (
    <Container>
      <div className="py-6">
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>AI Plan Generator</CardTitle>
            <CardDescription>
              Generate workout or diet plans using AI. Describe your requirements and the AI will create a plan for you.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="planType">Plan Type</Label>
                <Select 
                  value={planType} 
                  onValueChange={(value: 'workout' | 'diet') => setPlanType(value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select plan type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="workout">Workout Plan</SelectItem>
                    <SelectItem value="diet">Diet Plan</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              {planType === 'workout' && (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="fitnessLevel">Fitness Level</Label>
                    <Select 
                      value={fitnessLevel} 
                      onValueChange={setFitnessLevel}
                    >
                      <SelectTrigger id="fitnessLevel">
                        <SelectValue placeholder="Select fitness level" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="beginner">Beginner</SelectItem>
                        <SelectItem value="intermediate">Intermediate</SelectItem>
                        <SelectItem value="advanced">Advanced</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="sessionDuration">Session Duration (minutes)</Label>
                    <Input
                      id="sessionDuration"
                      type="number"
                      value={sessionDuration}
                      onChange={(e) => setSessionDuration(e.target.value)}
                      min="20"
                      max="180"
                    />
                  </div>
                </div>
              )}
              
              {planType === 'diet' && (
                <div className="space-y-2">
                  <Label htmlFor="dietType">Diet Type</Label>
                  <Select 
                    value={dietType} 
                    onValueChange={setDietType}
                  >
                    <SelectTrigger id="dietType">
                      <SelectValue placeholder="Select diet type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="balanced">Balanced</SelectItem>
                      <SelectItem value="vegetarian">Vegetarian</SelectItem>
                      <SelectItem value="vegan">Vegan</SelectItem>
                      <SelectItem value="keto">Keto</SelectItem>
                      <SelectItem value="lowCarb">Low Carb</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
              
              <div className="space-y-2">
                <Label htmlFor="planDetails">
                  Plan Requirements & Goals
                </Label>
                <Textarea
                  id="planDetails"
                  value={planDetails}
                  onChange={(e) => setPlanDetails(e.target.value)}
                  placeholder={
                    planType === 'workout' 
                      ? "Describe the workout plan you need, goals, available equipment, and any specific requirements..."
                      : "Describe dietary preferences, goals, allergies, and any specific requirements for your meal plan..."
                  }
                  rows={6}
                />
              </div>
              
              <Button 
                className="w-full" 
                onClick={handleGenerate} 
                disabled={isGenerating || !planDetails.trim()}
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4 mr-2" />
                    Generate {planType === 'workout' ? 'Workout' : 'Diet'} Plan
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
        
        {generatedPlan && (
          <Card>
            <CardHeader>
              <CardTitle>Generated {planType === 'workout' ? 'Workout' : 'Diet'} Plan</CardTitle>
              <CardDescription>
                Review the plan and make any necessary adjustments before saving.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="planTitle">Plan Title</Label>
                <Input
                  id="planTitle"
                  value={planTitle}
                  onChange={(e) => setPlanTitle(e.target.value)}
                  placeholder="Enter a name for this plan"
                  className="w-full"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="generatedContent">Plan Content</Label>
                <div className="border rounded-md p-4 whitespace-pre-wrap bg-muted/20">
                  {generatedPlan}
                </div>
              </div>
              
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setGeneratedPlan(null)}>
                  Discard
                </Button>
                <Button onClick={handleSavePlan}>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Save Plan
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </Container>
  );
};

// Mock plan generation functions
function generateMockWorkoutPlan(fitnessLevel: string, duration: number): string {
  if (fitnessLevel === "beginner") {
    return `# Beginner Workout Plan (${duration} minute sessions)

## Day 1: Full Body
- Bodyweight Squats: 3 sets of 10 reps
- Push-ups (or knee push-ups): 3 sets of 8 reps
- Dumbbell Rows: 3 sets of 10 reps per arm
- Plank: 3 sets of 20 seconds

## Day 2: Rest or Light Cardio

## Day 3: Full Body
- Lunges: 3 sets of 8 reps per leg
- Dumbbell Shoulder Press: 3 sets of 10 reps
- Glute Bridges: 3 sets of 12 reps
- Bird-dogs: 3 sets of 8 reps per side

## Day 4: Rest or Light Cardio

## Day 5: Full Body
- Step-ups: 3 sets of 10 reps per leg
- Dumbbell Chest Press: 3 sets of 10 reps
- Standing Dumbbell Curls: 3 sets of 10 reps
- Side Planks: 3 sets of 15 seconds per side`;
  } else {
    return `# ${fitnessLevel.charAt(0).toUpperCase() + fitnessLevel.slice(1)} Workout Plan (${duration} minute sessions)

## Day 1: Push (Chest, Shoulders, Triceps)
- Bench Press: 4 sets of 8-10 reps
- Overhead Press: 4 sets of 8-10 reps
- Incline Dumbbell Press: 3 sets of 10-12 reps
- Lateral Raises: 3 sets of 12-15 reps
- Tricep Pushdowns: 3 sets of 12-15 reps
- Overhead Tricep Extensions: 3 sets of 12-15 reps

## Day 2: Pull (Back, Biceps)
- Deadlifts: 4 sets of 8-10 reps
- Pull-ups or Lat Pulldowns: 4 sets of 8-10 reps
- Barbell Rows: 3 sets of 10-12 reps
- Face Pulls: 3 sets of 12-15 reps
- Barbell Curls: 3 sets of 10-12 reps
- Hammer Curls: 3 sets of 10-12 reps

## Day 3: Rest or Light Cardio

## Day 4: Legs
- Squats: 4 sets of 8-10 reps
- Romanian Deadlifts: 4 sets of 8-10 reps
- Leg Press: 3 sets of 10-12 reps
- Leg Extensions: 3 sets of 12-15 reps
- Leg Curls: 3 sets of 12-15 reps
- Calf Raises: 4 sets of 15-20 reps

## Day 5: Upper Body
- Incline Bench Press: 4 sets of 8-10 reps
- Cable Rows: 4 sets of 8-10 reps
- Dips: 3 sets of 10-12 reps
- Pull-ups: 3 sets of 8-10 reps
- Lateral Raises: 3 sets of 12-15 reps
- Tricep Pushdowns: 3 sets of 12-15 reps

## Day 6: Rest or Light Cardio

## Day 7: Rest`;
  }
}

function generateMockDietPlan(dietType: string): string {
  if (dietType === "vegetarian") {
    return `# Vegetarian Diet Plan

## Daily Macros
- Calories: 1800-2200 (adjust based on weight goals)
- Protein: 100-120g
- Carbs: 200-250g
- Fats: 50-65g

## Breakfast Options
- Greek yogurt with berries, honey and granola
- Vegetable omelette with whole grain toast
- Overnight oats with nuts and fruit

## Lunch Options
- Quinoa bowl with roasted vegetables and feta
- Black bean and sweet potato burrito
- Lentil soup with side salad

## Dinner Options
- Chickpea curry with brown rice
- Veggie stir fry with tofu and brown rice
- Eggplant parmesan with side salad

## Snacks
- Apple with almond butter
- Cottage cheese with fruits
- Hummus with vegetable sticks
- Trail mix or mixed nuts`;
  } else {
    return `# ${dietType.charAt(0).toUpperCase() + dietType.slice(1)} Diet Plan

## Daily Macros
${dietType === "keto" ? "- Calories: 1800-2200 (adjust based on weight goals)\n- Protein: 100-120g\n- Carbs: 20-30g\n- Fats: 130-150g" :
  dietType === "lowCarb" ? "- Calories: 1800-2200 (adjust based on weight goals)\n- Protein: 120-140g\n- Carbs: 50-100g\n- Fats: 80-100g" :
  "- Calories: 1800-2200 (adjust based on weight goals)\n- Protein: 100-120g\n- Carbs: 180-220g\n- Fats: 60-70g"}

## Breakfast Options
${dietType === "keto" ? "- Avocado and bacon omelette\n- Greek yogurt with berries and nuts\n- Keto smoothie with almond milk, avocado, and protein powder" :
  dietType === "lowCarb" ? "- Eggs with avocado and turkey bacon\n- Greek yogurt with berries and nuts\n- Protein smoothie with spinach and almond milk" :
  "- Oatmeal with fruit and nuts\n- Whole grain toast with avocado and eggs\n- Smoothie bowl with granola and fruit"}

## Lunch Options
${dietType === "keto" ? "- Cobb salad with ranch dressing\n- Tuna salad lettuce wraps\n- Zucchini noodles with pesto and chicken" :
  dietType === "lowCarb" ? "- Grilled chicken salad with olive oil dressing\n- Turkey and cheese lettuce wraps\n- Cauliflower rice bowl with protein" :
  dietType === "vegan" ? "- Quinoa bowl with roasted vegetables\n- Chickpea and vegetable curry\n- Lentil soup with side salad" :
  "- Chicken breast with sweet potato and vegetables\n- Quinoa bowl with lean protein and vegetables\n- Turkey sandwich on whole grain bread"}

## Dinner Options
${dietType === "keto" ? "- Steak with asparagus and butter\n- Baked salmon with broccoli\n- Chicken thighs with cheesy cauliflower mash" :
  dietType === "lowCarb" ? "- Baked cod with roasted vegetables\n- Steak with asparagus\n- Turkey burger (no bun) with side salad" :
  dietType === "vegan" ? "- Lentil bolognese with zucchini noodles\n- Stuffed bell peppers with beans and rice\n- Tofu stir fry with vegetables" :
  "- Grilled fish with quinoa and vegetables\n- Lean beef stir fry with brown rice\n- Chicken breast with roasted vegetables"}

## Snacks
${dietType === "keto" ? "- Cheese slices\n- Hard-boiled eggs\n- Almonds or macadamia nuts\n- Beef jerky" :
  dietType === "lowCarb" ? "- Greek yogurt\n- Protein shake\n- Handful of nuts\n- Celery with almond butter" :
  dietType === "vegan" ? "- Apple with almond butter\n- Hummus with vegetable sticks\n- Trail mix or mixed nuts\n- Edamame" :
  "- Apple with nut butter\n- Greek yogurt\n- Protein bar\n- Vegetable sticks with hummus"}`;
  }
}

export default AIplanGenerator;
