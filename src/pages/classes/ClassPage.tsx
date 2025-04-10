
import { useState } from "react";
import { Container } from "@/components/ui/container";
import ClassList from "@/components/classes/ClassList";
import BookingList from "@/components/classes/BookingList";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { usePermissions } from "@/hooks/use-permissions";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, ClipboardList, BookOpen } from "lucide-react";

const ClassPage = () => {
  const { userRole } = usePermissions();
  const isMember = userRole === "member";

  return (
    <Container>
      <div className="py-6">
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <BookOpen className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
            <h1 className="text-2xl font-bold">
              {isMember ? "Class Bookings" : "Class Management"}
            </h1>
          </div>
          
          <Card className="border dark:border-slate-800">
            <CardContent className="p-0">
              <Tabs defaultValue={isMember ? "bookings" : "classes"} className="w-full">
                <TabsList className="w-full justify-start rounded-none border-b bg-transparent p-0">
                  {!isMember && (
                    <TabsTrigger 
                      value="classes" 
                      className="flex items-center gap-1.5 rounded-none border-b-2 border-transparent px-4 py-3 data-[state=active]:border-indigo-600 data-[state=active]:bg-transparent data-[state=active]:text-indigo-600 dark:data-[state=active]:border-indigo-400 dark:data-[state=active]:text-indigo-400"
                    >
                      <Calendar className="h-4 w-4" />
                      Class Schedule
                    </TabsTrigger>
                  )}
                  <TabsTrigger 
                    value="bookings"
                    className="flex items-center gap-1.5 rounded-none border-b-2 border-transparent px-4 py-3 data-[state=active]:border-indigo-600 data-[state=active]:bg-transparent data-[state=active]:text-indigo-600 dark:data-[state=active]:border-indigo-400 dark:data-[state=active]:text-indigo-400"
                  >
                    <ClipboardList className="h-4 w-4" />
                    {isMember ? "My Bookings" : "All Bookings"}
                  </TabsTrigger>
                </TabsList>
                
                <div className="p-4 sm:p-6">
                  {!isMember && (
                    <TabsContent value="classes" className="mt-0 pt-2">
                      <ClassList />
                    </TabsContent>
                  )}
                  
                  <TabsContent value="bookings" className="mt-0 pt-2">
                    <BookingList />
                  </TabsContent>
                </div>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </Container>
  );
};

export default ClassPage;
