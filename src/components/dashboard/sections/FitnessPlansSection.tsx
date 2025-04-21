
import React from 'react';
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from 'sonner';

const FitnessPlansSection = () => {
  return (
    <Card className="lg:col-span-2">
      <CardHeader>
        <CardTitle>Your Fitness Plans</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="workout">
          <TabsList>
            <TabsTrigger value="workout">Workout Plan</TabsTrigger>
            <TabsTrigger value="diet">Diet Plan</TabsTrigger>
          </TabsList>
          <TabsContent value="workout" className="mt-4 space-y-4">
            <div className="border rounded-lg p-4">
              <h3 className="font-medium mb-2">4-Day Full Body Program</h3>
              <div className="grid gap-3 grid-cols-1 sm:grid-cols-2">
                <div className="border p-2 rounded">
                  <p className="font-medium text-sm">Day 1: Upper Body</p>
                  <p className="text-xs text-muted-foreground">8 exercises</p>
                </div>
                <div className="border p-2 rounded">
                  <p className="font-medium text-sm">Day 2: Lower Body</p>
                  <p className="text-xs text-muted-foreground">7 exercises</p>
                </div>
                <div className="border p-2 rounded">
                  <p className="font-medium text-sm">Day 3: Push</p>
                  <p className="text-xs text-muted-foreground">6 exercises</p>
                </div>
                <div className="border p-2 rounded">
                  <p className="font-medium text-sm">Day 4: Pull</p>
                  <p className="text-xs text-muted-foreground">5 exercises</p>
                </div>
              </div>
              <div className="flex justify-end mt-3">
                <Button variant="outline" size="sm" asChild>
                  <a href="/fitness/plans">View Full Plan</a>
                </Button>
              </div>
            </div>
          </TabsContent>
          <TabsContent value="diet" className="mt-4 space-y-4">
            <div className="border rounded-lg p-4">
              <h3 className="font-medium mb-2">High Protein Diet Plan</h3>
              <div className="grid gap-3 grid-cols-1 sm:grid-cols-2">
                <div className="border p-2 rounded">
                  <p className="font-medium text-sm">Breakfast</p>
                  <p className="text-xs text-muted-foreground">Protein: 30g, Carbs: 45g, Fats: 15g</p>
                </div>
                <div className="border p-2 rounded">
                  <p className="font-medium text-sm">Lunch</p>
                  <p className="text-xs text-muted-foreground">Protein: 40g, Carbs: 50g, Fats: 20g</p>
                </div>
                <div className="border p-2 rounded">
                  <p className="font-medium text-sm">Snack</p>
                  <p className="text-xs text-muted-foreground">Protein: 20g, Carbs: 25g, Fats: 10g</p>
                </div>
                <div className="border p-2 rounded">
                  <p className="font-medium text-sm">Dinner</p>
                  <p className="text-xs text-muted-foreground">Protein: 35g, Carbs: 40g, Fats: 15g</p>
                </div>
              </div>
              <div className="flex justify-between mt-3">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => {
                    toast.success("Diet plan PDF generated");
                  }}
                >
                  Print Plan
                </Button>
                <Button variant="outline" size="sm" asChild>
                  <a href="/fitness/diet">View Full Plan</a>
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default FitnessPlansSection;
