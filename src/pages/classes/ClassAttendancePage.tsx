import React from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";

const ClassAttendancePage: React.FC = () => {
  const [date, setDate] = React.useState<Date | undefined>(new Date());
  const [data, setData] = React.useState<any[] | null>(null);

  // Mock data for demonstration
  React.useEffect(() => {
    // Simulate fetching data from an API
    setTimeout(() => {
      setData([
        { id: 1, name: 'John Doe', email: 'john@example.com', phone: '123-456-7890' },
        { id: 2, name: 'Jane Smith', email: 'jane@example.com', phone: '987-654-3210' },
      ]);
    }, 500);
  }, []);
  
  // Fix property access issues
  const attendees = data?.map(record => {
    if (Array.isArray(record) && record.length > 0) {
      return {
        id: record.id,
        name: record.name,
        email: record.email,
        phone: record.phone
      };
    }
    return {
      id: record?.id || '',
      name: record?.name || '',
      email: record?.email || '',
      phone: record?.phone || ''
    };
  }) || [];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Class Attendance</CardTitle>
        <CardDescription>
          Mark attendance for today's class
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap items-center gap-4 py-2">
          <div className="space-x-2">
            <Label htmlFor="search">Search:</Label>
            <Input type="search" id="search" placeholder="Search attendees..." />
          </div>
          <div className="space-x-2">
            <Label htmlFor="date">Date:</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className="w-[240px] justify-start text-left font-normal"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  className="rounded-md border"
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>

        <div className="rounded-md border">
          <Table>
            <TableCaption>A list of class attendees.</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {attendees.map((attendee) => (
                <TableRow key={attendee.id}>
                  <TableCell className="font-medium">{attendee.id}</TableCell>
                  <TableCell>{attendee.name}</TableCell>
                  <TableCell>{attendee.email}</TableCell>
                  <TableCell>{attendee.phone}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost">Mark Present</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default ClassAttendancePage;
