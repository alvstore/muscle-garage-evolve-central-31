
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import TrainerClassList from '@/components/trainers/TrainerClassList';
import TrainerBookingList from '@/components/trainers/TrainerBookingList';
import TrainerClassForm from '@/components/trainers/TrainerClassForm';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';

const TrainerClassesPage = () => {
  const [isCreatingClass, setIsCreatingClass] = useState(false);
  const { user } = useAuth();

  if (isCreatingClass) {
    return (
      <div className="container mx-auto py-6">
        <TrainerClassForm 
          trainerId={user?.id || ''}
          onSave={() => setIsCreatingClass(false)}
          onCancel={() => setIsCreatingClass(false)}
        />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Class Management</h1>
          <p className="text-muted-foreground">Create and manage your fitness classes</p>
        </div>
        <Button onClick={() => setIsCreatingClass(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Create New Class
        </Button>
      </div>
      
      <Tabs defaultValue="classes">
        <TabsList className="mb-6">
          <TabsTrigger value="classes">My Classes</TabsTrigger>
          <TabsTrigger value="bookings">Bookings</TabsTrigger>
        </TabsList>
        
        <TabsContent value="classes">
          <TrainerClassList trainerId={user?.id || ''} />
        </TabsContent>
        
        <TabsContent value="bookings">
          <TrainerBookingList trainerId={user?.id || ''} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TrainerClassesPage;
