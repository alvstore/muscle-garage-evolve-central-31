
import React, { useState } from 'react';
import { Container } from '@/components/ui/container';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/auth/use-auth';
import { Apple, Banana, Beef, Coffee, Egg, Fish, Utensils, Salad } from 'lucide-react';

const DietPlanPage = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('current');
  
  // Mock diet plan data
  const currentPlan = {
    name: "High Protein, Low Carb",
    createdBy: "Dr. Sarah Johnson",
    createdAt: "2023-05-15",
    goals: ["Weight loss", "Muscle maintenance"],
    macros: {
      protein: 40,
      carbs: 20,
      fats: 40
    },
    schedule: [
      {
        time: "7:00 AM",
        meal: "Breakfast",
        items: [
          "3 egg whites + 1 whole egg",
          "1/2 cup oatmeal with berries",
          "Black coffee or green tea"
        ],
        calories: 350
      },
      {
        time: "10:00 AM",
        meal: "Morning Snack",
        items: [
          "Protein shake with almond milk",
          "1 small apple"
        ],
        calories: 200
      },
      {
        time: "1:00 PM",
        meal: "Lunch",
        items: [
          "150g grilled chicken breast",
          "Large green salad with olive oil dressing",
          "1/2 cup brown rice"
        ],
        calories: 450
      },
      {
        time: "4:00 PM",
        meal: "Afternoon Snack",
        items: [
          "20 almonds",
          "1 cup Greek yogurt"
        ],
        calories: 250
      },
      {
        time: "7:00 PM",
        meal: "Dinner",
        items: [
          "180g baked salmon",
          "Steamed broccoli and asparagus",
          "Small sweet potato"
        ],
        calories: 420
      }
    ],
    waterIntake: "3-4 liters per day",
    supplements: [
      "Multivitamin - morning with breakfast",
      "Omega-3 fish oil - morning with breakfast",
      "Protein powder - post-workout",
      "Magnesium - evening before bed"
    ],
    notes: "This diet plan is designed to support your weight loss goals while maintaining muscle mass. Adjust portion sizes based on your hunger levels, but try to maintain the protein-carb-fat ratio. Drink plenty of water throughout the day."
  };

  // Mock progress data
  const progressData = {
    startWeight: 85,
    currentWeight: 79.5,
    targetWeight: 75,
    startDate: "2023-05-15",
    currentDate: "2023-07-15",
    logs: [
      { date: "2023-05-15", weight: 85, notes: "Start of diet plan" },
      { date: "2023-05-22", weight: 83.7, notes: "First week, good progress" },
      { date: "2023-05-29", weight: 82.5, notes: "Stayed consistent with plan" },
      { date: "2023-06-05", weight: 81.8, notes: "Added extra cardio" },
      { date: "2023-06-12", weight: 81, notes: "Had a cheat meal on weekend" },
      { date: "2023-06-19", weight: 80.4, notes: "Back on track" },
      { date: "2023-06-26", weight: 80, notes: "Modified lunch options" },
      { date: "2023-07-03", weight: 79.8, notes: "Increased water intake" },
      { date: "2023-07-10", weight: 79.5, notes: "Consistent progress" }
    ]
  };

  const renderMealIcon = (mealName: string) => {
    switch(mealName.toLowerCase()) {
      case "breakfast": return <Coffee className="h-5 w-5" />;
      case "morning snack": return <Apple className="h-5 w-5" />;
      case "lunch": return <Salad className="h-5 w-5" />;
      case "afternoon snack": return <Banana className="h-5 w-5" />;
      case "dinner": return <Utensils className="h-5 w-5" />;
      default: return <Utensils className="h-5 w-5" />;
    }
  };

  return (
    <Container>
      <div className="py-6">
        <h1 className="text-2xl font-bold mb-6">My Diet Plan</h1>
        
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="current">Current Plan</TabsTrigger>
            <TabsTrigger value="progress">Progress</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
          </TabsList>
          
          <TabsContent value="current" className="mt-6 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>{currentPlan.name}</CardTitle>
                <CardDescription>
                  Created by {currentPlan.createdBy} on {currentPlan.createdAt}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">Goals</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="list-disc pl-5 space-y-1">
                        {currentPlan.goals.map((goal, index) => (
                          <li key={index}>{goal}</li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">Macro Split</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-col space-y-2">
                        <div className="flex justify-between">
                          <span>Protein</span>
                          <span>{currentPlan.macros.protein}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${currentPlan.macros.protein}%` }}></div>
                        </div>
                        
                        <div className="flex justify-between">
                          <span>Carbs</span>
                          <span>{currentPlan.macros.carbs}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div className="bg-green-600 h-2 rounded-full" style={{ width: `${currentPlan.macros.carbs}%` }}></div>
                        </div>
                        
                        <div className="flex justify-between">
                          <span>Fats</span>
                          <span>{currentPlan.macros.fats}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div className="bg-yellow-600 h-2 rounded-full" style={{ width: `${currentPlan.macros.fats}%` }}></div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">Water & Supplements</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <h4 className="font-medium mb-1">Water Intake:</h4>
                        <p>{currentPlan.waterIntake}</p>
                      </div>
                      <div>
                        <h4 className="font-medium mb-1">Supplements:</h4>
                        <ul className="list-disc pl-5 space-y-1 text-sm">
                          {currentPlan.supplements.map((supplement, index) => (
                            <li key={index}>{supplement}</li>
                          ))}
                        </ul>
                      </div>
                    </CardContent>
                  </Card>
                </div>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Daily Meal Schedule</CardTitle>
                    <CardDescription>Approximately {currentPlan.schedule.reduce((total, meal) => total + meal.calories, 0)} calories per day</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {currentPlan.schedule.map((meal, index) => (
                        <div key={index} className="flex">
                          <div className="w-20 text-sm text-muted-foreground">
                            {meal.time}
                          </div>
                          <div className="flex-grow border-l pl-4 pb-6 relative">
                            <div className="absolute w-3 h-3 rounded-full bg-primary -left-[6.5px] top-1"></div>
                            <div className="flex items-center mb-2">
                              {renderMealIcon(meal.meal)}
                              <h3 className="font-medium ml-2">{meal.meal}</h3>
                              <span className="ml-auto text-sm text-muted-foreground">{meal.calories} cal</span>
                            </div>
                            <ul className="list-disc pl-5 space-y-1 text-sm">
                              {meal.items.map((item, idx) => (
                                <li key={idx}>{item}</li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Notes</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p>{currentPlan.notes}</p>
                  </CardContent>
                </Card>
                
                <div className="flex justify-end space-x-2">
                  <Button variant="outline">Print Plan</Button>
                  <Button>Request Modifications</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="progress" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Weight Progress</CardTitle>
                <CardDescription>
                  Started at {progressData.startWeight}kg, currently {progressData.currentWeight}kg, target {progressData.targetWeight}kg
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mb-6">
                  <div className="mb-2 flex justify-between text-sm">
                    <span>Start: {progressData.startWeight}kg</span>
                    <span>Target: {progressData.targetWeight}kg</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-primary h-2 rounded-full" 
                      style={{ 
                        width: `${((progressData.startWeight - progressData.currentWeight) / (progressData.startWeight - progressData.targetWeight)) * 100}%` 
                      }}
                    ></div>
                  </div>
                  <div className="mt-1 text-sm text-right">
                    {((progressData.startWeight - progressData.currentWeight) / (progressData.startWeight - progressData.targetWeight) * 100).toFixed(0)}% complete
                  </div>
                </div>
                
                <div className="border rounded-md overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-muted">
                      <tr>
                        <th className="p-2 text-left">Date</th>
                        <th className="p-2 text-left">Weight (kg)</th>
                        <th className="p-2 text-left">Change</th>
                        <th className="p-2 text-left">Notes</th>
                      </tr>
                    </thead>
                    <tbody>
                      {progressData.logs.map((log, index) => {
                        const previousWeight = index > 0 ? progressData.logs[index - 1].weight : log.weight;
                        const weightChange = log.weight - previousWeight;
                        
                        return (
                          <tr key={index} className="border-t">
                            <td className="p-2">{log.date}</td>
                            <td className="p-2">{log.weight}</td>
                            <td className="p-2">
                              {index === 0 ? (
                                "—"
                              ) : (
                                <span className={weightChange < 0 ? "text-green-600" : weightChange > 0 ? "text-red-600" : "text-gray-600"}>
                                  {weightChange < 0 ? "↓" : weightChange > 0 ? "↑" : "→"}{" "}
                                  {Math.abs(weightChange).toFixed(1)} kg
                                </span>
                              )}
                            </td>
                            <td className="p-2">{log.notes}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
                
                <div className="mt-6 flex justify-end">
                  <Button>Log New Weight</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="history" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Diet Plan History</CardTitle>
                <CardDescription>
                  Track your previous diet plans and changes
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <div className="text-center">
                  <Utensils className="mx-auto h-12 w-12 text-muted-foreground" />
                  <h3 className="mt-4 text-lg font-medium">No previous diet plans</h3>
                  <p className="mt-2 text-sm text-muted-foreground max-w-sm">
                    You're currently on your first diet plan. Previous plans will appear here when you switch to a new plan.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Container>
  );
};

export default DietPlanPage;
