
import { useState } from "react";
import { Container } from "@/components/ui/container";
import ClassList from "@/components/classes/ClassList";
import BookingList from "@/components/classes/BookingList";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { usePermissions } from "@/hooks/use-permissions";

const ClassPage = () => {
  const { userRole } = usePermissions();
  const initialTab = userRole === 'member' ? 'bookings' : 'classes';
  
  return (
    <Container>
      <div className="py-6">
        <h1 className="text-2xl font-bold mb-6">Class Management</h1>
        
        <Tabs defaultValue={initialTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="classes">Class Schedule</TabsTrigger>
            <TabsTrigger value="bookings">Bookings</TabsTrigger>
          </TabsList>
          
          <TabsContent value="classes">
            <ClassList />
          </TabsContent>
          
          <TabsContent value="bookings">
            <BookingList />
          </TabsContent>
        </Tabs>
      </div>
    </Container>
  );
};

export default ClassPage;
