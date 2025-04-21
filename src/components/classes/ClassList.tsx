import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Filter, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { GymClass } from '@/types/class';

interface ClassListProps {
  showAddButton?: boolean;
  onAddClass?: () => void;
}

const ClassList: React.FC<ClassListProps> = ({ showAddButton, onAddClass }) => {
  // Mock data for classes
  const classes: GymClass[] = [
    {
      id: '1',
      name: 'HIIT Workout',
      description: 'High-intensity interval training',
      startTime: '2023-07-20T10:00:00Z',
      endTime: '2023-07-20T11:00:00Z',
      capacity: 20,
      enrolled: 15,
      trainer: 'John Doe',
      difficulty: 'intermediate',
      type: 'cardio',
      location: 'Studio A'
    },
    {
      id: '2',
      name: 'Yoga Flow',
      description: 'Vinyasa yoga for all levels',
      startTime: '2023-07-20T14:00:00Z',
      endTime: '2023-07-20T15:00:00Z',
      capacity: 15,
      enrolled: 10,
      trainer: 'Jane Smith',
      difficulty: 'beginner',
      type: 'yoga',
      location: 'Studio B'
    },
    {
      id: '3',
      name: 'Strength Training',
      description: 'Full body strength workout',
      startTime: '2023-07-21T09:00:00Z',
      endTime: '2023-07-21T10:00:00Z',
      capacity: 12,
      enrolled: 8,
      trainer: 'Mike Johnson',
      difficulty: 'advanced',
      type: 'strength',
      location: 'Weights Area'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4 justify-between">
        <div className="flex flex-1 items-center space-x-2">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search classes..."
              className="pl-8"
            />
          </div>
          <Select defaultValue="all">
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="cardio">Cardio</SelectItem>
              <SelectItem value="strength">Strength</SelectItem>
              <SelectItem value="yoga">Yoga</SelectItem>
              <SelectItem value="pilates">Pilates</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
          </Button>
        </div>
        
        {showAddButton && (
          <Button onClick={onAddClass} className="flex items-center gap-1">
            <Plus className="h-4 w-4" />
            Add Class
          </Button>
        )}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {classes.map((classItem) => (
          <Card key={classItem.id} className="overflow-hidden">
            <div className="bg-primary h-2"></div>
            <CardContent className="p-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold text-lg">{classItem.name}</h3>
                  <p className="text-sm text-muted-foreground">{classItem.description}</p>
                </div>
                <span className="bg-primary/10 text-primary text-xs px-2 py-1 rounded-full">
                  {classItem.type}
                </span>
              </div>
              
              <div className="mt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Time:</span>
                  <span>{new Date(classItem.startTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Trainer:</span>
                  <span>{classItem.trainer}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Location:</span>
                  <span>{classItem.location}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Capacity:</span>
                  <span>{classItem.enrolled}/{classItem.capacity}</span>
                </div>
              </div>
              
              <div className="mt-4 flex justify-end gap-2">
                <Button variant="outline" size="sm">View Details</Button>
                <Button size="sm">Book Class</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      {classes.length === 0 && (
        <div className="text-center py-10">
          <p className="text-muted-foreground">No classes found</p>
        </div>
      )}
    </div>
  );
};

export default ClassList;
