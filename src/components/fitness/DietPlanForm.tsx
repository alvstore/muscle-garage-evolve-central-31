import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Plus, Trash, ArrowLeft } from "lucide-react";
import { Member, DietPlan, MealPlan } from "@/types";
import { v4 as uuidv4 } from 'uuid';

interface DietPlanFormProps {
  member: Member;
  existingPlan?: DietPlan;
  trainerId: string;
  onSave: (plan: DietPlan) => void;
  onCancel: () => void;
}

const DietPlanForm: React.FC<DietPlanFormProps> = ({
  member,
  existingPlan,
  trainerId,
  onSave,
  onCancel
}) => {
  const [formData, setFormData] = useState<Omit<DietPlan, 'id' | 'createdAt' | 'updatedAt'>>({
    name: existingPlan?.name || `Diet Plan for ${member.name}`,
    memberId: member.id,
    trainer_id: trainerId, // Changed from trainerId to trainer_id
    mealPlans: existingPlan?.mealPlans || [createEmptyMeal()],
    notes: existingPlan?.notes || '',
    is_custom: existingPlan?.is_custom || false // Changed from isCustom to is_custom
  });

  function createEmptyMeal(): MealPlan {
    return {
      id: uuidv4(),
      name: '',
      time: '',
      items: [''],
      macros: {
        protein: 0,
        carbs: 0,
        fats: 0,
        calories: 0 // Added calories to the macros object
      }
    };
  }

  const handleAddMeal = () => {
    setFormData({
      ...formData,
      mealPlans: [...formData.mealPlans, createEmptyMeal()]
    });
  };

  const handleRemoveMeal = (index: number) => {
    setFormData({
      ...formData,
      mealPlans: formData.mealPlans.filter((_, i) => i !== index)
    });
  };

  const handleMealChange = (index: number, field: keyof MealPlan, value: any) => {
    const updatedMeals = [...formData.mealPlans];
    updatedMeals[index] = {
      ...updatedMeals[index],
      [field]: value
    };
    setFormData({
      ...formData,
      mealPlans: updatedMeals
    });
  };

  const handleAddMealItem = (mealIndex: number) => {
    const updatedMeals = [...formData.mealPlans];
    updatedMeals[mealIndex] = {
      ...updatedMeals[mealIndex],
      items: [...updatedMeals[mealIndex].items, '']
    };
    setFormData({
      ...formData,
      mealPlans: updatedMeals
    });
  };

  const handleRemoveMealItem = (mealIndex: number, itemIndex: number) => {
    const updatedMeals = [...formData.mealPlans];
    updatedMeals[mealIndex] = {
      ...updatedMeals[mealIndex],
      items: updatedMeals[mealIndex].items.filter((_, i) => i !== itemIndex)
    };
    setFormData({
      ...formData,
      mealPlans: updatedMeals
    });
  };

  const handleMealItemChange = (mealIndex: number, itemIndex: number, value: string) => {
    const updatedMeals = [...formData.mealPlans];
    const updatedItems = [...updatedMeals[mealIndex].items];
    updatedItems[itemIndex] = value;
    updatedMeals[mealIndex] = {
      ...updatedMeals[mealIndex],
      items: updatedItems
    };
    setFormData({
      ...formData,
      mealPlans: updatedMeals
    });
  };

  const handleMacrosChange = (mealIndex: number, macroField: keyof typeof formData.mealPlans[0]['macros'], value: number) => {
    const updatedMeals = [...formData.mealPlans];
    updatedMeals[mealIndex] = {
      ...updatedMeals[mealIndex],
      macros: {
        ...updatedMeals[mealIndex].macros,
        [macroField]: value
      }
    };
    setFormData({
      ...formData,
      mealPlans: updatedMeals
    });
  };

  const handleSubmit = () => {
    const mealPlansWithCalories = formData.mealPlans.map(meal => {
      if (!meal.macros.calories) {
        const calculatedCalories = 
          meal.macros.protein * 4 + 
          meal.macros.carbs * 4 + 
          meal.macros.fats * 9;
        
        return {
          ...meal,
          macros: {
            ...meal.macros,
            calories: calculatedCalories
          }
        };
      }
      return meal;
    });

    const finalPlan: DietPlan = {
      id: existingPlan?.id || uuidv4(),
      name: formData.name,
      memberId: member.id,
      trainer_id: trainerId, // Changed from trainerId to trainer_id
      mealPlans: mealPlansWithCalories,
      notes: formData.notes,
      is_custom: formData.is_custom, // Changed from isCustom to is_custom
      createdAt: existingPlan?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    onSave(finalPlan);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>{existingPlan ? 'Edit Diet Plan' : 'Create New Diet Plan'}</CardTitle>
            <CardDescription>
              {existingPlan 
                ? `Modify diet plan for ${member.name}` 
                : `Create a new diet plan for ${member.name}`}
            </CardDescription>
          </div>
          <Button variant="ghost" size="sm" onClick={onCancel}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="plan-name">Plan Name</Label>
          <Input
            id="plan-name"
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
            placeholder="Enter a name for this diet plan"
          />
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium">Meal Plans</h3>
            <Button size="sm" onClick={handleAddMeal}>
              <Plus className="mr-2 h-4 w-4" />
              Add Meal
            </Button>
          </div>

          {formData.mealPlans.map((meal, mealIndex) => (
            <Card key={meal.id} className="border border-gray-200">
              <CardHeader className="py-3 px-4 bg-gray-50">
                <div className="flex justify-between items-center">
                  <div className="grid grid-cols-2 gap-2 flex-1">
                    <div>
                      <Label htmlFor={`meal-name-${mealIndex}`}>Meal Name</Label>
                      <Input
                        id={`meal-name-${mealIndex}`}
                        placeholder="e.g., Breakfast, Lunch, etc."
                        value={meal.name}
                        onChange={(e) => handleMealChange(mealIndex, 'name', e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor={`meal-time-${mealIndex}`}>Time</Label>
                      <Input
                        id={`meal-time-${mealIndex}`}
                        placeholder="e.g., 8:00 AM"
                        value={meal.time}
                        onChange={(e) => handleMealChange(mealIndex, 'time', e.target.value)}
                      />
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveMeal(mealIndex)}
                    className="ml-2 text-destructive hover:text-destructive hover:bg-destructive/10"
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-4">
                <div className="space-y-4">
                  <div>
                    <Label>Food Items</Label>
                    <div className="space-y-2 mt-2">
                      {meal.items.map((item, itemIndex) => (
                        <div key={itemIndex} className="flex gap-2">
                          <Input
                            placeholder="Food item description"
                            value={item}
                            onChange={(e) => handleMealItemChange(mealIndex, itemIndex, e.target.value)}
                            className="flex-1"
                          />
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleRemoveMealItem(mealIndex, itemIndex)}
                            disabled={meal.items.length <= 1}
                            className="text-destructive hover:text-destructive hover:bg-destructive/10"
                          >
                            <Trash className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleAddMealItem(mealIndex)}
                      className="mt-2"
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Add Food Item
                    </Button>
                  </div>

                  <div>
                    <Label>Macronutrients</Label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-2">
                      <div>
                        <Label htmlFor={`protein-${mealIndex}`} className="text-xs">Protein (g)</Label>
                        <Input
                          id={`protein-${mealIndex}`}
                          type="number"
                          value={meal.macros.protein}
                          onChange={(e) => handleMacrosChange(mealIndex, 'protein', Number(e.target.value))}
                          min="0"
                        />
                      </div>
                      <div>
                        <Label htmlFor={`carbs-${mealIndex}`} className="text-xs">Carbs (g)</Label>
                        <Input
                          id={`carbs-${mealIndex}`}
                          type="number"
                          value={meal.macros.carbs}
                          onChange={(e) => handleMacrosChange(mealIndex, 'carbs', Number(e.target.value))}
                          min="0"
                        />
                      </div>
                      <div>
                        <Label htmlFor={`fats-${mealIndex}`} className="text-xs">Fats (g)</Label>
                        <Input
                          id={`fats-${mealIndex}`}
                          type="number"
                          value={meal.macros.fats}
                          onChange={(e) => handleMacrosChange(mealIndex, 'fats', Number(e.target.value))}
                          min="0"
                        />
                      </div>
                      <div>
                        <Label htmlFor={`calories-${mealIndex}`} className="text-xs">Calories (kcal)</Label>
                        <Input
                          id={`calories-${mealIndex}`}
                          type="number"
                          value={meal.macros.calories || meal.macros.protein * 4 + meal.macros.carbs * 4 + meal.macros.fats * 9}
                          onChange={(e) => handleMacrosChange(mealIndex, 'calories', Number(e.target.value))}
                          min="0"
                          className="bg-gray-50"
                          readOnly
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="space-y-2">
          <Label htmlFor="diet-notes">Additional Notes</Label>
          <Textarea
            id="diet-notes"
            placeholder="Add any instructions, restrictions, or guidelines..."
            value={formData.notes}
            onChange={(e) => setFormData({...formData, notes: e.target.value})}
            rows={4}
          />
        </div>

        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="diet-plan-custom"
            checked={formData.is_custom}
            onChange={(e) => setFormData({...formData, is_custom: e.target.checked})}
            className="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          />
          <Label htmlFor="diet-plan-custom" className="cursor-pointer">
            This is a custom plan specific for this member
          </Label>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={onCancel}>Cancel</Button>
        <Button onClick={handleSubmit}>
          {existingPlan ? 'Update Plan' : 'Create Plan'}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default DietPlanForm;
