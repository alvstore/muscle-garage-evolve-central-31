
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useClassPerformance } from '@/hooks/use-stats';

const ClassPerformanceTable: React.FC = () => {
  const { classes, isLoading, error } = useClassPerformance();

  const getPerformanceBadge = (category: string) => {
    switch (category) {
      case 'excellent':
        return <Badge className="bg-green-500 hover:bg-green-600">Excellent</Badge>;
      case 'good':
        return <Badge className="bg-blue-500 hover:bg-blue-600">Good</Badge>;
      case 'average':
        return <Badge className="bg-amber-500 hover:bg-amber-600">Average</Badge>;
      default:
        return <Badge variant="outline" className="text-red-500 border-red-500">Poor</Badge>;
    }
  };

  const getEnrollmentColor = (percentage: number) => {
    if (percentage >= 80) return "bg-green-500";
    if (percentage >= 60) return "bg-blue-500";
    if (percentage >= 40) return "bg-amber-500";
    return "bg-red-500";
  };

  const getAttendanceColor = (percentage: number) => {
    if (percentage >= 80) return "bg-green-500";
    if (percentage >= 60) return "bg-blue-500";
    if (percentage >= 40) return "bg-amber-500";
    return "bg-red-500";
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-medium">Class Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Skeleton className="h-8 w-full" />
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-medium">Class Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-destructive">Error loading class performance data</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-medium">Class Performance</CardTitle>
      </CardHeader>
      <CardContent>
        {classes.length === 0 ? (
          <p className="text-muted-foreground">No class performance data available</p>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Class Name</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Capacity</TableHead>
                  <TableHead>Enrollment</TableHead>
                  <TableHead>Attendance</TableHead>
                  <TableHead>Rating</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {classes.slice(0, 5).map((cls) => (
                  <TableRow key={cls.class_id}>
                    <TableCell className="font-medium">{cls.class_name}</TableCell>
                    <TableCell>{cls.class_type}</TableCell>
                    <TableCell>{cls.capacity}</TableCell>
                    <TableCell>
                      <div className="w-32">
                        <div className="flex justify-between text-xs mb-1">
                          <span>{cls.enrolled}/{cls.capacity}</span>
                          <span>{cls.enrollment_percentage}%</span>
                        </div>
                        <Progress 
                          value={cls.enrollment_percentage} 
                          className="h-1.5" 
                          indicatorClassName={getEnrollmentColor(cls.enrollment_percentage)}
                        />
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="w-32">
                        <div className="flex justify-between text-xs mb-1">
                          <span>{cls.actual_attendance}/{cls.enrolled}</span>
                          <span>{cls.attendance_percentage}%</span>
                        </div>
                        <Progress 
                          value={cls.attendance_percentage} 
                          className="h-1.5" 
                          indicatorClassName={getAttendanceColor(cls.attendance_percentage)}
                        />
                      </div>
                    </TableCell>
                    <TableCell>{getPerformanceBadge(cls.performance_category)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ClassPerformanceTable;
