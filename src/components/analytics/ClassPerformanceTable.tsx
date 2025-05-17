
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { useSupabaseQuery } from '@/hooks/data/use-supabase-query';
import { useBranch } from '@/hooks/settings/use-branches';

interface ClassPerformance {
  class_name: string;
  class_type: string;
  enrollment_percentage: number;
  attendance_percentage: number;
  performance_category: string;
  branch_id: string;
}

const ClassPerformanceTable: React.FC = () => {
  const { currentBranch } = useBranch();
  const branchId = currentBranch?.id;

  const { data: classesData, isLoading: isLoadingClasses } = useSupabaseQuery<ClassPerformance[]>({
    tableName: 'class_performance',
    ...(branchId && {
      filters: [{
        column: 'branch_id',
        operator: 'eq',
        value: branchId
      }]
    }),
    orderBy: {
      column: 'enrollment_percentage',
      ascending: false
    }
  });

  const getPerformanceColor = (category: string) => {
    switch(category?.toLowerCase()) {
      case 'excellent': return 'bg-green-100 text-green-800 border-green-200';
      case 'good': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'average': return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'poor': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  // Fallback data in case no data from Supabase
  const fallbackData = [
    { class_name: "Morning Yoga", class_type: "Yoga", enrollment_percentage: 95, attendance_percentage: 85, performance_category: "Excellent" },
    { class_name: "CrossFit Elite", class_type: "CrossFit", enrollment_percentage: 85, attendance_percentage: 80, performance_category: "Good" },
    { class_name: "Zumba Dance", class_type: "Cardio", enrollment_percentage: 75, attendance_percentage: 70, performance_category: "Good" },
    { class_name: "Weight Training", class_type: "Strength", enrollment_percentage: 60, attendance_percentage: 55, performance_category: "Average" }
  ];

  const classes = (classesData && classesData.length > 0) ? classesData : fallbackData;

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Class Name</TableHead>
          <TableHead>Type</TableHead>
          <TableHead className="text-right">Enrollment</TableHead>
          <TableHead className="text-right">Performance</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {classes.map((classItem, index) => (
          <TableRow key={index}>
            <TableCell className="font-medium">{classItem.class_name}</TableCell>
            <TableCell>{classItem.class_type}</TableCell>
            <TableCell className="text-right">{classItem.enrollment_percentage}%</TableCell>
            <TableCell className="text-right">
              <Badge 
                variant="outline"
                className={getPerformanceColor(classItem.performance_category)}
              >
                {classItem.performance_category}
              </Badge>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default ClassPerformanceTable;
