
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import FitnessPlanManager from '@/components/fitness/FitnessPlanManager';
import ProgressTracker from '@/components/fitness/ProgressTracker';
import WorkoutPlanForm from '@/components/fitness/WorkoutPlanForm';
import DietPlanForm from '@/components/fitness/DietPlanForm';

const FitnessPlanPage = () => {
  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Fitness Plans</h1>
      </div>
      
      <Tabs defaultValue="plans">
        <TabsList className="grid w-full md:w-auto grid-cols-4 h-auto">
          <TabsTrigger value="plans">My Plans</TabsTrigger>
          <TabsTrigger value="progress">Progress</TabsTrigger>
          <TabsTrigger value="workout">Workout</TabsTrigger>
          <TabsTrigger value="diet">Diet</TabsTrigger>
        </TabsList>
        
        <TabsContent value="plans" className="mt-6">
          <FitnessPlanManager />
        </TabsContent>
        
        <TabsContent value="progress" className="mt-6">
          <ProgressTracker />
        </TabsContent>
        
        <TabsContent value="workout" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Workout Plan</CardTitle>
              <CardDescription>Create or update your workout plan</CardDescription>
            </CardHeader>
            <CardContent>
              <WorkoutPlanForm />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="diet" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Diet Plan</CardTitle>
              <CardDescription>Create or update your nutrition plan</CardDescription>
            </CardHeader>
            <CardContent>
              <DietPlanForm />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default FitnessPlanPage;
