
import { useState } from "react";
import { Container } from "@/components/ui/container";
import ClassList from "@/components/classes/ClassList";
import BookingList from "@/components/classes/BookingList";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { usePermissions } from "@/hooks/use-permissions";

const ClassPage = () => {
  const { userRole } = usePermissions();
  const isMember = userRole === "member";

  return (
    <Container>
      <div className="py-6">
        <h1 className="text-2xl font-bold mb-6">
          {isMember ? "Class Bookings" : "Class Management"}
        </h1>
        
        <Tabs defaultValue={isMember ? "bookings" : "classes"}>
          <TabsList className="mb-6">
            {!isMember && (
              <TabsTrigger value="classes">Class Schedule</TabsTrigger>
            )}
            <TabsTrigger value="bookings">
              {isMember ? "My Bookings" : "All Bookings"}
            </TabsTrigger>
          </TabsList>
          
          {!isMember && (
            <TabsContent value="classes">
              <ClassList />
            </TabsContent>
          )}
          
          <TabsContent value="bookings">
            <BookingList />
          </TabsContent>
        </Tabs>
      </div>
    </Container>
  );
};

export default ClassPage;
