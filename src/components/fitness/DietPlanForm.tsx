
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Trash2 } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Member, DietPlan, MealPlan } from "@/types";
import { toast } from "sonner";

interface DietPlanFormProps {
  member: Member;
  trainerId: string;
  existingPlan?: DietPlan;
  onSave: (plan: DietPlan) => void;
  onCancel: () => void;
  showDaysTabs?: boolean;
}

const generateId = () => Math.random().toString(36).substring(2, 9);

const DietPlanForm = ({ 
  member, 
  trainerId, 
  existingPlan, 
  onSave, 
  onCancel,
  showDaysTabs = false
}: DietPlanFormProps) => {
  const [mealPlans, setMealPlans] = useState<MealPlan[]>(
    existingPlan?.mealPlans || [
      {
        id: generateId(),
        name: "Breakfast",
        time: "08:00",
        items: ["2 eggs, scrambled", "1 slice whole grain toast", "1 cup black coffee"],
        macros: {
          protein: 15,
          carbs: 20,
          fats: 10
        }
      }
    ]
  );

  const addMealPlan = () => {
    setMealPlans([
      ...mealPlans,
      {
        id: generateId(),
        name: "New Meal",
        time: "",
        items: [""],
        macros: {
          protein: 0,
          carbs: 0,
          fats: 0
        }
      }
    ]);
  };

  const removeMealPlan = (mealId: string) => {
    setMealPlans(mealPlans.filter(meal => meal.id !== mealId));
  };

  const updateMealField = (mealId: string, field: keyof MealPlan, value: any) => {
    setMealPlans(
      mealPlans.map(meal => 
        meal.id === mealId ? { ...meal, [field]: value } : meal
      )
    );
  };

  const updateMacros = (mealId: string, macroType: 'protein' | 'carbs' | 'fats', value: number) => {
    setMealPlans(
      mealPlans.map(meal => {
        if (meal.id === mealId) {
          return {
            ...meal,
            macros: {
              ...meal.macros,
              [macroType]: value
            }
          };
        }
        return meal;
      })
    );
  };

  const updateMealItems = (mealId: string, itemsText: string) => {
    const items = itemsText.split('\n').filter(item => item.trim() !== "");
    
    setMealPlans(
      mealPlans.map(meal => {
        if (meal.id === mealId) {
          return {
            ...meal,
            items
          };
        }
        return meal;
      })
    );
  };

  const handleSave = () => {
    // Validate if there are any empty fields
    const hasEmptyFields = mealPlans.some(meal => 
      !meal.name.trim() || !meal.time.trim() || meal.items.length === 0
    );

    if (hasEmptyFields) {
      toast.error("Please fill in all meal plan details");
      return;
    }

    // Create diet plan object
    const dietPlan: DietPlan = {
      id: existingPlan?.id || generateId(),
      memberId: member.id,
      trainerId: trainerId,
      createdAt: existingPlan?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      mealPlans: mealPlans
    };

    onSave(dietPlan);
  };

  const renderMealForm = () => (
    <div className="space-y-6">
      {mealPlans.map((meal) => (
        <Card key={meal.id} className="overflow-hidden">
          <CardHeader className="bg-muted/50 py-3">
            <div className="flex items-center justify-between">
              <div className="flex-1 mr-4">
                <Input
                  placeholder="Meal Name (e.g. Breakfast, Lunch, Post-Workout)"
                  value={meal.name}
                  onChange={(e) => updateMealField(meal.id, "name", e.target.value)}
                  className="font-medium"
                />
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => removeMealPlan(meal.id)}
                className="text-destructive hover:text-destructive/90 hover:bg-destructive/10"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-4 space-y-4">
            <div className="grid gap-4">
              <div>
                <Label htmlFor={`meal-time-${meal.id}`}>Meal Time</Label>
                <Input
                  id={`meal-time-${meal.id}`}
                  placeholder="Time (e.g. 8:00 AM)"
                  value={meal.time}
                  onChange={(e) => updateMealField(meal.id, "time", e.target.value)}
                />
              </div>
              
              <div>
                <Label htmlFor={`meal-items-${meal.id}`}>Food Items</Label>
                <Textarea
                  id={`meal-items-${meal.id}`}
                  placeholder="Enter each food item on a new line"
                  value={meal.items.join('\n')}
                  onChange={(e) => updateMealItems(meal.id, e.target.value)}
                  rows={4}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Enter each food item on a new line, with quantity (e.g. "2 eggs, scrambled")
                </p>
              </div>
              
              <div>
                <Label>Macronutrients (g)</Label>
                <div className="grid grid-cols-3 gap-3 mt-2">
                  <div>
                    <Label htmlFor={`meal-protein-${meal.id}`} className="text-xs">Protein</Label>
                    <Input
                      id={`meal-protein-${meal.id}`}
                      type="number"
                      min="0"
                      value={meal.macros?.protein || 0}
                      onChange={(e) => updateMacros(meal.id, "protein", parseInt(e.target.value))}
                    />
                  </div>
                  <div>
                    <Label htmlFor={`meal-carbs-${meal.id}`} className="text-xs">Carbs</Label>
                    <Input
                      id={`meal-carbs-${meal.id}`}
                      type="number"
                      min="0"
                      value={meal.macros?.carbs || 0}
                      onChange={(e) => updateMacros(meal.id, "carbs", parseInt(e.target.value))}
                    />
                  </div>
                  <div>
                    <Label htmlFor={`meal-fats-${meal.id}`} className="text-xs">Fats</Label>
                    <Input
                      id={`meal-fats-${meal.id}`}
                      type="number"
                      min="0"
                      value={meal.macros?.fats || 0}
                      onChange={(e) => updateMacros(meal.id, "fats", parseInt(e.target.value))}
                    />
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
      
      <Button 
        variant="outline" 
        onClick={addMealPlan}
        className="w-full"
      >
        <Plus className="h-4 w-4 mr-1" />
        Add Another Meal
      </Button>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">
            {existingPlan ? "Edit Diet Plan" : "Create Diet Plan"}
          </h2>
          <p className="text-sm text-muted-foreground">
            For: {member.name}
          </p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            Save Plan
          </Button>
        </div>
      </div>

      {showDaysTabs ? (
        <Tabs defaultValue="everyday">
          <TabsList>
            <TabsTrigger value="everyday">Everyday</TabsTrigger>
            <TabsTrigger value="weekday">Weekdays</TabsTrigger>
            <TabsTrigger value="weekend">Weekends</TabsTrigger>
          </TabsList>
          <TabsContent value="everyday">
            {renderMealForm()}
          </TabsContent>
          <TabsContent value="weekday">
            <div className="p-6 text-center text-muted-foreground">
              <p>Weekday meal plans work the same as everyday plans.</p>
              <p className="mt-2">This is just a UI placeholder for demonstration.</p>
            </div>
          </TabsContent>
          <TabsContent value="weekend">
            <div className="p-6 text-center text-muted-foreground">
              <p>Weekend meal plans work the same as everyday plans.</p>
              <p className="mt-2">This is just a UI placeholder for demonstration.</p>
            </div>
          </TabsContent>
        </Tabs>
      ) : (
        renderMealForm()
      )}
    </div>
  );
};

export default DietPlanForm;
