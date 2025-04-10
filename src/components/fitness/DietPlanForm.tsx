
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Member } from '@/types';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PlusCircle, Trash } from 'lucide-react';

interface MealTime {
  id: string;
  name: string;
  time: string;
  foods: string;
  protein: string;
  carbs: string;
  fats: string;
  calories: string;
  notes: string;
}

interface DailyMealPlan {
  day: string;
  meals: MealTime[];
}

interface DietPlanFormProps {
  member: Member;
  trainerId: string;
  onSave: (plan: any) => void;
  onCancel: () => void;
  existingPlan?: any;
  readOnly?: boolean;
  showDaysTabs?: boolean;
}

const defaultMeal: MealTime = {
  id: `meal-${Date.now()}`,
  name: 'Breakfast',
  time: '08:00',
  foods: '',
  protein: '',
  carbs: '',
  fats: '',
  calories: '',
  notes: '',
};

const weekDays = [
  'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'
];

const DietPlanForm = ({
  member,
  trainerId,
  onSave,
  onCancel,
  existingPlan,
  readOnly = false,
  showDaysTabs = false
}: DietPlanFormProps) => {
  const [activeDay, setActiveDay] = useState('Monday');
  const [dietGoal, setDietGoal] = useState(existingPlan?.goal || '');
  const [calorieTarget, setCalorieTarget] = useState(existingPlan?.calorieTarget || '');
  const [additionalNotes, setAdditionalNotes] = useState(existingPlan?.notes || '');
  
  // Initialize meal plans for each day of the week
  const [dailyMealPlans, setDailyMealPlans] = useState<DailyMealPlan[]>(
    weekDays.map(day => ({
      day,
      meals: existingPlan?.mealPlans?.filter((m: any) => m.day === day) || [{ ...defaultMeal }]
    }))
  );

  const handleAddMeal = (day: string) => {
    const updatedMealPlans = dailyMealPlans.map(plan => {
      if (plan.day === day) {
        return {
          ...plan,
          meals: [...plan.meals, { 
            ...defaultMeal, 
            id: `meal-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            name: `Meal ${plan.meals.length + 1}`
          }]
        };
      }
      return plan;
    });
    setDailyMealPlans(updatedMealPlans);
  };

  const handleRemoveMeal = (day: string, mealId: string) => {
    const updatedMealPlans = dailyMealPlans.map(plan => {
      if (plan.day === day) {
        return {
          ...plan,
          meals: plan.meals.filter(meal => meal.id !== mealId)
        };
      }
      return plan;
    });
    setDailyMealPlans(updatedMealPlans);
  };

  const handleMealChange = (day: string, mealId: string, field: keyof MealTime, value: string) => {
    const updatedMealPlans = dailyMealPlans.map(plan => {
      if (plan.day === day) {
        return {
          ...plan,
          meals: plan.meals.map(meal => 
            meal.id === mealId ? { ...meal, [field]: value } : meal
          )
        };
      }
      return plan;
    });
    setDailyMealPlans(updatedMealPlans);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const dietPlan = {
      id: existingPlan?.id || `diet-plan-${Date.now()}`,
      memberId: member.id,
      trainerId,
      goal: dietGoal,
      calorieTarget,
      notes: additionalNotes,
      createdAt: existingPlan?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      dailyMealPlans
    };
    
    onSave(dietPlan);
  };

  // Render the form for a single day's meal plan
  const renderDayMealPlan = (day: string) => {
    const dayPlan = dailyMealPlans.find(plan => plan.day === day) || { day, meals: [] };
    
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium">{day}'s Meals</h3>
          {!readOnly && (
            <Button 
              type="button" 
              variant="outline" 
              size="sm"
              onClick={() => handleAddMeal(day)}
            >
              <PlusCircle className="h-4 w-4 mr-2" />
              Add Meal
            </Button>
          )}
        </div>
        
        {dayPlan.meals.length === 0 ? (
          <div className="text-center py-4 text-gray-500">
            No meals scheduled for {day}
          </div>
        ) : (
          dayPlan.meals.map((meal, index) => (
            <Card key={meal.id} className="overflow-hidden">
              <CardHeader className="px-4 py-2 bg-gray-50 dark:bg-gray-800">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-base">
                    <Input
                      value={meal.name}
                      onChange={(e) => handleMealChange(day, meal.id, 'name', e.target.value)}
                      placeholder="Meal Name"
                      className="border-0 bg-transparent p-0 h-auto text-base font-semibold focus-visible:ring-0"
                      readOnly={readOnly}
                    />
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    <Input
                      type="time"
                      value={meal.time}
                      onChange={(e) => handleMealChange(day, meal.id, 'time', e.target.value)}
                      className="w-24 h-7 text-xs"
                      readOnly={readOnly}
                    />
                    {!readOnly && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveMeal(day, meal.id)}
                        className="h-7 w-7 p-0"
                      >
                        <Trash className="h-4 w-4 text-gray-500" />
                      </Button>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-4 grid gap-4 md:grid-cols-2">
                <div>
                  <Label htmlFor={`foods-${meal.id}`}>Foods</Label>
                  <Textarea
                    id={`foods-${meal.id}`}
                    value={meal.foods}
                    onChange={(e) => handleMealChange(day, meal.id, 'foods', e.target.value)}
                    placeholder="Enter foods (e.g. 2 eggs, toast, avocado)"
                    className="mt-1"
                    readOnly={readOnly}
                  />
                </div>
                
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <Label htmlFor={`protein-${meal.id}`}>Protein (g)</Label>
                      <Input
                        id={`protein-${meal.id}`}
                        type="number"
                        value={meal.protein}
                        onChange={(e) => handleMealChange(day, meal.id, 'protein', e.target.value)}
                        placeholder="30"
                        className="mt-1"
                        readOnly={readOnly}
                      />
                    </div>
                    <div>
                      <Label htmlFor={`carbs-${meal.id}`}>Carbs (g)</Label>
                      <Input
                        id={`carbs-${meal.id}`}
                        type="number"
                        value={meal.carbs}
                        onChange={(e) => handleMealChange(day, meal.id, 'carbs', e.target.value)}
                        placeholder="40"
                        className="mt-1"
                        readOnly={readOnly}
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <Label htmlFor={`fats-${meal.id}`}>Fats (g)</Label>
                      <Input
                        id={`fats-${meal.id}`}
                        type="number"
                        value={meal.fats}
                        onChange={(e) => handleMealChange(day, meal.id, 'fats', e.target.value)}
                        placeholder="15"
                        className="mt-1"
                        readOnly={readOnly}
                      />
                    </div>
                    <div>
                      <Label htmlFor={`calories-${meal.id}`}>Calories</Label>
                      <Input
                        id={`calories-${meal.id}`}
                        type="number"
                        value={meal.calories}
                        onChange={(e) => handleMealChange(day, meal.id, 'calories', e.target.value)}
                        placeholder="400"
                        className="mt-1"
                        readOnly={readOnly}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    );
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="dietGoal">Diet Goal</Label>
          <Input
            id="dietGoal"
            value={dietGoal}
            onChange={(e) => setDietGoal(e.target.value)}
            placeholder="e.g. Weight loss, muscle gain, maintenance"
            readOnly={readOnly}
          />
        </div>
        
        <div>
          <Label htmlFor="calorieTarget">Daily Calorie Target</Label>
          <Input
            id="calorieTarget"
            type="number"
            value={calorieTarget}
            onChange={(e) => setCalorieTarget(e.target.value)}
            placeholder="e.g. 2000"
            readOnly={readOnly}
          />
        </div>
      </div>
      
      <div>
        <Label htmlFor="additionalNotes">Additional Notes</Label>
        <Textarea
          id="additionalNotes"
          value={additionalNotes}
          onChange={(e) => setAdditionalNotes(e.target.value)}
          placeholder="Any additional instructions or notes about the diet plan"
          className="min-h-[100px]"
          readOnly={readOnly}
        />
      </div>
      
      {showDaysTabs ? (
        <Tabs value={activeDay} onValueChange={setActiveDay}>
          <TabsList className="mb-4 flex flex-wrap h-auto">
            {weekDays.map(day => (
              <TabsTrigger key={day} value={day} className="flex-1 min-w-[100px]">
                {day}
              </TabsTrigger>
            ))}
          </TabsList>
          
          {weekDays.map(day => (
            <TabsContent key={day} value={day}>
              {renderDayMealPlan(day)}
            </TabsContent>
          ))}
        </Tabs>
      ) : (
        // If not showing tabs, just show the first day's plan
        renderDayMealPlan('Monday')
      )}
      
      {!readOnly && (
        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit">
            Save Diet Plan
          </Button>
        </div>
      )}
    </form>
  );
};

export default DietPlanForm;
