
import React, { useState, useEffect } from "react";
import { Container } from "@/components/ui/container";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Calendar } from "@/components/ui/calendar";
import { DatePickerWithRange } from "@/components/ui/date-range-picker";
import { format } from "date-fns";
import { Loader2, Plus, Filter } from "lucide-react";

const ClassSchedulePage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [date, setDate] = useState<{
    from: Date;
    to: Date;
  }>({
    from: new Date(),
    to: new Date(new Date().setDate(new Date().getDate() + 7)),
  });
  const [view, setView] = useState("week");

  // Simulate loading data
  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  }, []);

  return (
    <Container>
      <div className="py-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Class Schedule</h1>
            <p className="text-muted-foreground">
              View and manage all fitness classes
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
            <Button size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Add Class
            </Button>
          </div>
        </div>

        <Card>
          <CardHeader className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-2 sm:space-y-0 pb-2">
            <CardTitle>Class Calendar</CardTitle>
            <div className="flex items-center space-x-2">
              <DatePickerWithRange
                date={date}
                setDate={setDate}
              />
              <Tabs value={view} onValueChange={setView}>
                <TabsList>
                  <TabsTrigger value="day">Day</TabsTrigger>
                  <TabsTrigger value="week">Week</TabsTrigger>
                  <TabsTrigger value="month">Month</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center py-32">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : (
              <div>
                <p className="text-muted-foreground text-center py-16">
                  Calendar view will be implemented here.
                  <br />
                  Currently showing {view} view from{" "}
                  {format(date.from, "MMMM d, yyyy")} to{" "}
                  {format(date.to, "MMMM d, yyyy")}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </Container>
  );
};

export default ClassSchedulePage;
