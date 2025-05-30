import React, { useState } from 'react';
import { DietPlan, MealPlan } from '@/types/fitness/diet';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Plus, X } from 'lucide-react';

interface DietPlanFormProps {
  onSubmit: (data: Omit<DietPlan, 'id' | 'created_at' | 'updated_at'>) => void;
  onCancel: () => void;
  initialData?: Partial<DietPlan>;
  trainerId: string;
  memberId?: string;
}

const DietPlanForm: React.FC<DietPlanFormProps> = ({
  onSubmit,
  onCancel,
  initialData = {},
  trainerId,
  memberId
}) => {
  const [formData, setFormData] = useState<Omit<DietPlan, 'id' | 'created_at' | 'updated_at'>>({
    name: initialData.name || '',
    description: initialData.description || '',
    trainer_id: trainerId,
    member_id: memberId || initialData.member_id,
    is_global: initialData.is_global || false,
    is_custom: initialData.is_custom || true,
    diet_type: initialData.diet_type || '',
    goal: initialData.goal || '',
    daily_calories: initialData.daily_calories || undefined,
    notes: initialData.notes || '',
    meal_plans: initialData.meal_plans || []
  });

  const [newMeal, setNewMeal] = useState<Partial<MealPlan>>({
    meal_type: 'breakfast',
    name: '',
    description: '',
    calories: undefined,
    protein: undefined,
    carbs: undefined,
    fat: undefined,
    ingredients: [],
    instructions: ''
  });

  const addMeal = () => {
    if (newMeal.name) {
      setFormData(prev => ({
        ...prev,
        meal_plans: [...(prev.meal_plans || []), newMeal as Omit<MealPlan, 'id' | 'diet_plan_id' | 'created_at' | 'updated_at'>]
      }));
      setNewMeal({
        meal_type: 'breakfast',
        name: '',
        description: '',
        calories: undefined,
        protein: undefined,
        carbs: undefined,
        fat: undefined,
        ingredients: [],
        instructions: ''
      });
    }
  };

  const removeMeal = (index: number) => {
    setFormData(prev => ({
      ...prev,
      meal_plans: prev.meal_plans?.filter((_, i) => i !== index) || []
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {initialData.id ? 'Edit Diet Plan' : 'Create Diet Plan'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Plan Name</Label>
              <Input
                id="name"
                value={formData.name || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                required
              />
            </div>

            <div>
              <Label htmlFor="diet_type">Diet Type</Label>
              <Select 
                value={formData.diet_type || ''} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, diet_type: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select diet type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="weight_loss">Weight Loss</SelectItem>
                  <SelectItem value="muscle_gain">Muscle Gain</SelectItem>
                  <SelectItem value="maintenance">Maintenance</SelectItem>
                  <SelectItem value="cutting">Cutting</SelectItem>
                  <SelectItem value="bulking">Bulking</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Describe the diet plan..."
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="goal">Goal</Label>
              <Input
                id="goal"
                value={formData.goal || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, goal: e.target.value }))}
                placeholder="e.g., Lose 10kg in 3 months"
              />
            </div>

            <div>
              <Label htmlFor="daily_calories">Daily Calories</Label>
              <Input
                id="daily_calories"
                type="number"
                value={formData.daily_calories || ''}
                onChange={(e) => setFormData(prev => ({ 
                  ...prev, 
                  daily_calories: e.target.value ? parseInt(e.target.value) : undefined 
                }))}
                placeholder="e.g., 2000"
              />
            </div>
          </div>

          {/* Meal Plans Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Meal Plans</h3>
            
            {/* Existing meals */}
            <div className="space-y-2">
              {formData.meal_plans?.map((meal, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline">{meal.meal_type}</Badge>
                      <span className="font-medium">{meal.name}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">{meal.description}</p>
                  </div>
                  <Button 
                    type="button" 
                    variant="ghost" 
                    size="sm"
                    onClick={() => removeMeal(index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>

            {/* Add new meal */}
            <div className="border rounded-lg p-4 space-y-3">
              <h4 className="font-medium">Add New Meal</h4>
              <div className="grid grid-cols-2 gap-3">
                <Select 
                  value={newMeal.meal_type} 
                  onValueChange={(value) => setNewMeal(prev => ({ ...prev, meal_type: value as any }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="breakfast">Breakfast</SelectItem>
                    <SelectItem value="lunch">Lunch</SelectItem>
                    <SelectItem value="dinner">Dinner</SelectItem>
                    <SelectItem value="snack">Snack</SelectItem>
                  </SelectContent>
                </Select>

                <Input
                  placeholder="Meal name"
                  value={newMeal.name || ''}
                  onChange={(e) => setNewMeal(prev => ({ ...prev, name: e.target.value }))}
                />
              </div>

              <Input
                placeholder="Description"
                value={newMeal.description || ''}
                onChange={(e) => setNewMeal(prev => ({ ...prev, description: e.target.value }))}
              />

              <div className="flex justify-end">
                <Button type="button" onClick={addMeal} size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Meal
                </Button>
              </div>
            </div>
          </div>

          <div>
            <Label htmlFor="notes">Additional Notes</Label>
            <Textarea
              id="notes"
              value={formData.notes || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              placeholder="Any additional notes or instructions..."
            />
          </div>

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button type="submit">
              {initialData.id ? 'Update' : 'Create'} Diet Plan
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default DietPlanForm;
