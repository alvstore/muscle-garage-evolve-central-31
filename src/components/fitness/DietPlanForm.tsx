
import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Member, DietPlan, MealPlan } from "@/types";
import { Plus, Trash2, GripVertical, ArrowUp, ArrowDown } from "lucide-react";

interface DietPlanFormProps {
  member: Member;
  trainerId: string;
  existingPlan?: DietPlan;
  onSave: (plan: DietPlan) => void;
  onCancel: () => void;
}

const DietPlanForm = ({ member, trainerId, existingPlan, onSave, onCancel }: DietPlanFormProps) => {
  const [mealPlans, setMealPlans] = useState<MealPlan[]>(
    existingPlan?.mealPlans || [
      {
        id: uuidv4(),
        name: "Breakfast",
        time: "8:00 AM",
        items: ["Oatmeal with berries", "Greek yogurt", "Black coffee"],
        macros: {
          protein: 25,
          carbs: 40,
          fats: 10,
        },
      },
    ]
  );

  const handleSave = () => {
    const plan: DietPlan = {
      id: existingPlan?.id || uuidv4(),
      memberId: member.id,
      trainerId,
      createdAt: existingPlan?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      mealPlans,
    };
    onSave(plan);
  };

  const addMeal = () => {
    setMealPlans([
      ...mealPlans,
      {
        id: uuidv4(),
        name: "New Meal",
        time: "12:00 PM",
        items: ["Add food items"],
        macros: {
          protein: 0,
          carbs: 0,
          fats: 0,
        },
      },
    ]);
  };

  const removeMeal = (mealId: string) => {
    setMealPlans(mealPlans.filter((meal) => meal.id !== mealId));
  };

  const updateMeal = (mealId: string, field: string, value: any) => {
    setMealPlans(
      mealPlans.map((meal) => {
        if (meal.id === mealId) {
          if (field === "items") {
            // Handle array of items from textarea
            const items = value.split("\n").filter((item: string) => item.trim() !== "");
            return { ...meal, items };
          } else if (field.startsWith("macros.")) {
            // Handle nested macros object properties
            const macroField = field.split(".")[1];
            return {
              ...meal,
              macros: {
                ...meal.macros,
                [macroField]: value,
              },
            };
          }
          return { ...meal, [field]: value };
        }
        return meal;
      })
    );
  };

  const moveMeal = (index: number, direction: "up" | "down") => {
    if (
      (direction === "up" && index === 0) ||
      (direction === "down" && index === mealPlans.length - 1)
    ) {
      return;
    }

    const newIndex = direction === "up" ? index - 1 : index + 1;
    const newMeals = [...mealPlans];
    [newMeals[index], newMeals[newIndex]] = [newMeals[newIndex], newMeals[index]];
    setMealPlans(newMeals);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{existingPlan ? "Edit" : "Create"} Diet Plan for {member.name}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {mealPlans.map((meal, mealIndex) => (
          <div key={meal.id} className="border rounded-lg p-4 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <GripVertical className="h-5 w-5 text-muted-foreground" />
                <span className="font-medium">Meal {mealIndex + 1}</span>
              </div>
              
              <div className="flex items-center space-x-1">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => moveMeal(mealIndex, "up")}
                  disabled={mealIndex === 0}
                >
                  <ArrowUp className="h-4 w-4" />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => moveMeal(mealIndex, "down")}
                  disabled={mealIndex === mealPlans.length - 1}
                >
                  <ArrowDown className="h-4 w-4" />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="text-destructive"
                  onClick={() => removeMeal(meal.id)}
                  disabled={mealPlans.length === 1}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <Label htmlFor={`meal-name-${meal.id}`}>Meal Name</Label>
                <Input
                  id={`meal-name-${meal.id}`}
                  value={meal.name}
                  onChange={(e) => updateMeal(meal.id, "name", e.target.value)}
                />
              </div>
              
              <div className="space-y-1">
                <Label htmlFor={`meal-time-${meal.id}`}>Time</Label>
                <Input
                  id={`meal-time-${meal.id}`}
                  value={meal.time}
                  onChange={(e) => updateMeal(meal.id, "time", e.target.value)}
                />
              </div>
              
              <div className="space-y-1 md:col-span-2">
                <Label htmlFor={`meal-items-${meal.id}`}>Food Items (One per line)</Label>
                <Textarea
                  id={`meal-items-${meal.id}`}
                  className="min-h-[120px]"
                  value={meal.items.join("\n")}
                  onChange={(e) => updateMeal(meal.id, "items", e.target.value)}
                />
              </div>
              
              <div className="md:col-span-2">
                <Label>Macronutrients (grams)</Label>
                <div className="grid grid-cols-3 gap-4 mt-2">
                  <div className="space-y-1">
                    <Label htmlFor={`meal-protein-${meal.id}`}>Protein</Label>
                    <Input
                      id={`meal-protein-${meal.id}`}
                      type="number"
                      min="0"
                      value={meal.macros?.protein || 0}
                      onChange={(e) => updateMeal(meal.id, "macros.protein", Number(e.target.value))}
                    />
                  </div>
                  
                  <div className="space-y-1">
                    <Label htmlFor={`meal-carbs-${meal.id}`}>Carbs</Label>
                    <Input
                      id={`meal-carbs-${meal.id}`}
                      type="number"
                      min="0"
                      value={meal.macros?.carbs || 0}
                      onChange={(e) => updateMeal(meal.id, "macros.carbs", Number(e.target.value))}
                    />
                  </div>
                  
                  <div className="space-y-1">
                    <Label htmlFor={`meal-fats-${meal.id}`}>Fats</Label>
                    <Input
                      id={`meal-fats-${meal.id}`}
                      type="number"
                      min="0"
                      value={meal.macros?.fats || 0}
                      onChange={(e) => updateMeal(meal.id, "macros.fats", Number(e.target.value))}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
        
        <Button
          type="button"
          variant="outline"
          onClick={addMeal}
        >
          <Plus className="h-4 w-4 mr-1" />
          Add Meal
        </Button>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="button" onClick={handleSave}>
          Save Diet Plan
        </Button>
      </CardFooter>
    </Card>
  );
};

export default DietPlanForm;
