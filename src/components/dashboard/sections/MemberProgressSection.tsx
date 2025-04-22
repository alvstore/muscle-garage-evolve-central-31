
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { Button } from '@/components/ui/button';
import { 
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  BarChart,
  LineChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { Calendar, FileBarChart, LineChart as LineChartIcon, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// Mock data
const members = [
  {
    id: 'member1',
    name: 'John Doe',
    goal: 'Weight Loss',
    avatar: '/placeholder-avatar.jpg'
  },
  {
    id: 'member2',
    name: 'Jane Smith',
    goal: 'Muscle Gain',
    avatar: '/placeholder-avatar.jpg'
  }
];

const progressData = [
  { date: '2025-01-01', metrics: { weight: 80, bodyFatPercentage: 22, bmi: 26.4, muscleGain: 0 } },
  { date: '2025-02-01', metrics: { weight: 78, bodyFatPercentage: 21, bmi: 25.8, muscleGain: 1.5 } },
  { date: '2025-03-01', metrics: { weight: 77, bodyFatPercentage: 20, bmi: 25.4, muscleGain: 2.2 } },
  { date: '2025-04-01', metrics: { weight: 76, bodyFatPercentage: 19, bmi: 25.1, muscleGain: 2.8 } },
  { date: '2025-05-01', metrics: { weight: 75, bodyFatPercentage: 18, bmi: 24.8, muscleGain: 3.5 } },
  { date: '2025-06-01', metrics: { weight: 74, bodyFatPercentage: 17, bmi: 24.4, muscleGain: 4.2 } }
];

const progressMetrics = [
  { name: 'Jan', weight: 80, bodyFat: 22, bmi: 26.4 },
  { name: 'Feb', weight: 78, bodyFat: 21, bmi: 25.8 },
  { name: 'Mar', weight: 77, bodyFat: 20, bmi: 25.4 },
  { name: 'Apr', weight: 76, bodyFat: 19, bmi: 25.1 },
  { name: 'May', weight: 75, bodyFat: 18, bmi: 24.8 },
  { name: 'Jun', weight: 74, bodyFat: 17, bmi: 24.4 },
];

const workoutProgressData = [
  { name: 'W1', chest: 45, back: 50, legs: 40, arms: 30 },
  { name: 'W2', chest: 50, back: 55, legs: 45, arms: 35 },
  { name: 'W3', chest: 55, back: 60, legs: 50, arms: 40 },
  { name: 'W4', chest: 60, back: 65, legs: 55, arms: 45 },
  { name: 'W5', chest: 65, back: 70, legs: 60, arms: 50 },
  { name: 'W6', chest: 70, back: 75, legs: 65, arms: 55 },
];

const goalProgressData = [
  { name: 'Strength', target: 100, achieved: 65 },
  { name: 'Cardio', target: 100, achieved: 80 },
  { name: 'Flexibility', target: 100, achieved: 45 },
  { name: 'Weight', target: 100, achieved: 75 },
];

const MemberProgressSection = () => {
  const navigate = useNavigate();
  const [selectedMemberId, setSelectedMemberId] = useState(members[0]?.id || '');
  const [selectedMetric, setSelectedMetric] = useState('weight');
  
  const selectedMember = members.find(m => m.id === selectedMemberId);
  
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };
  
  return (
    <Card className="col-span-4">
      <CardHeader className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <CardTitle>Member Progress</CardTitle>
          <CardDescription>
            Track and analyze fitness progress of your members
          </CardDescription>
        </div>
        <div className="flex gap-2 items-center">
          <Label htmlFor="member-select" className="sr-only">Select Member</Label>
          <Select value={selectedMemberId} onValueChange={setSelectedMemberId}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select member" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {members.map(member => (
                  <SelectItem key={member.id} value={member.id}>
                    {member.name}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm" onClick={() => navigate('/members/progress')}>
            <FileBarChart className="h-4 w-4 mr-1" />
            Detailed View
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {selectedMember ? (
          <>
            <div className="flex items-center space-x-4 mb-6">
              <Avatar className="h-12 w-12">
                <AvatarImage src={selectedMember.avatar} alt={selectedMember.name} />
                <AvatarFallback>{getInitials(selectedMember.name)}</AvatarFallback>
              </Avatar>
              <div>
                <h3 className="text-lg font-medium">{selectedMember.name}</h3>
                <p className="text-sm text-muted-foreground">Goal: {selectedMember.goal}</p>
              </div>
            </div>
            
            <Tabs defaultValue="overview">
              <TabsList className="mb-6">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="body">Body Metrics</TabsTrigger>
                <TabsTrigger value="strength">Strength Progress</TabsTrigger>
                <TabsTrigger value="goals">Goal Completion</TabsTrigger>
              </TabsList>
              
              <TabsContent value="overview">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-6">
                    <div>
                      <h4 className="text-sm font-medium mb-2">Body Metrics</h4>
                      <div className="space-y-3">
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span>Weight Loss</span>
                            <span>75%</span>
                          </div>
                          <Progress value={75} className="h-2" />
                        </div>
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span>Body Fat Reduction</span>
                            <span>62%</span>
                          </div>
                          <Progress value={62} className="h-2" />
                        </div>
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span>BMI Improvement</span>
                            <span>55%</span>
                          </div>
                          <Progress value={55} className="h-2" />
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium mb-2">Workout Adherence</h4>
                      <div className="space-y-3">
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span>Workout Completion</span>
                            <span>85%</span>
                          </div>
                          <Progress value={85} className="h-2" />
                        </div>
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span>Class Attendance</span>
                            <span>70%</span>
                          </div>
                          <Progress value={70} className="h-2" />
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium mb-2">Recent Milestones</h4>
                      <div className="space-y-3">
                        <div className="flex items-center p-2 bg-muted/40 rounded">
                          <Calendar className="h-4 w-4 text-muted-foreground mr-2" />
                          <div className="text-sm">
                            <p>Lost 5kg since starting</p>
                            <p className="text-xs text-muted-foreground">Apr 15, 2023</p>
                          </div>
                        </div>
                        <div className="flex items-center p-2 bg-muted/40 rounded">
                          <LineChartIcon className="h-4 w-4 text-muted-foreground mr-2" />
                          <div className="text-sm">
                            <p>Reduced body fat by 5%</p>
                            <p className="text-xs text-muted-foreground">May 20, 2023</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="h-72">
                    <h4 className="text-sm font-medium mb-2">6-Month Progress</h4>
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={progressMetrics}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line type="monotone" dataKey="weight" stroke="#8884d8" />
                        <Line type="monotone" dataKey="bodyFat" stroke="#82ca9d" />
                        <Line type="monotone" dataKey="bmi" stroke="#ffc658" />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="body">
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <h4 className="text-sm font-medium">Body Measurements Over Time</h4>
                    <Select value={selectedMetric} onValueChange={setSelectedMetric}>
                      <SelectTrigger className="w-[160px]">
                        <SelectValue placeholder="Select metric" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="weight">Weight</SelectItem>
                        <SelectItem value="bodyFat">Body Fat %</SelectItem>
                        <SelectItem value="bmi">BMI</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="h-72">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={progressMetrics}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        {selectedMetric === 'weight' && (
                          <Line type="monotone" dataKey="weight" stroke="#8884d8" />
                        )}
                        {selectedMetric === 'bodyFat' && (
                          <Line type="monotone" dataKey="bodyFat" stroke="#82ca9d" />
                        )}
                        {selectedMetric === 'bmi' && (
                          <Line type="monotone" dataKey="bmi" stroke="#ffc658" />
                        )}
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="p-4 border rounded-lg text-center">
                      <p className="text-sm text-muted-foreground mb-1">Current Weight</p>
                      <p className="text-2xl font-bold">74 kg</p>
                      <p className="text-xs text-green-500">↓ 6 kg</p>
                    </div>
                    <div className="p-4 border rounded-lg text-center">
                      <p className="text-sm text-muted-foreground mb-1">Body Fat</p>
                      <p className="text-2xl font-bold">17%</p>
                      <p className="text-xs text-green-500">↓ 5%</p>
                    </div>
                    <div className="p-4 border rounded-lg text-center">
                      <p className="text-sm text-muted-foreground mb-1">BMI</p>
                      <p className="text-2xl font-bold">24.4</p>
                      <p className="text-xs text-green-500">↓ 2.0</p>
                    </div>
                    <div className="p-4 border rounded-lg text-center">
                      <p className="text-sm text-muted-foreground mb-1">Muscle Gain</p>
                      <p className="text-2xl font-bold">4.2 kg</p>
                      <p className="text-xs text-green-500">↑ 4.2 kg</p>
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="strength">
                <div className="space-y-6">
                  <h4 className="text-sm font-medium">Strength Progress by Muscle Group</h4>
                  <div className="h-72">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={workoutProgressData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="chest" fill="#8884d8" />
                        <Bar dataKey="back" fill="#82ca9d" />
                        <Bar dataKey="legs" fill="#ffc658" />
                        <Bar dataKey="arms" fill="#ff8042" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="p-4 border rounded-lg">
                      <p className="text-sm text-muted-foreground mb-1">Bench Press</p>
                      <p className="font-bold">70 kg</p>
                      <p className="text-xs text-green-500">↑ 25 kg</p>
                    </div>
                    <div className="p-4 border rounded-lg">
                      <p className="text-sm text-muted-foreground mb-1">Deadlift</p>
                      <p className="font-bold">120 kg</p>
                      <p className="text-xs text-green-500">↑ 40 kg</p>
                    </div>
                    <div className="p-4 border rounded-lg">
                      <p className="text-sm text-muted-foreground mb-1">Squat</p>
                      <p className="font-bold">90 kg</p>
                      <p className="text-xs text-green-500">↑ 30 kg</p>
                    </div>
                    <div className="p-4 border rounded-lg">
                      <p className="text-sm text-muted-foreground mb-1">Pull-ups</p>
                      <p className="font-bold">10 reps</p>
                      <p className="text-xs text-green-500">↑ 6 reps</p>
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="goals">
                <div className="space-y-6">
                  <h4 className="text-sm font-medium">Goal Completion</h4>
                  <div className="h-72">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={goalProgressData} layout="vertical">
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis type="number" />
                        <YAxis dataKey="name" type="category" />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="target" stackId="a" fill="#8884d8" />
                        <Bar dataKey="achieved" stackId="a" fill="#82ca9d" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Overall Goal Completion</span>
                        <span>68%</span>
                      </div>
                      <Progress value={68} className="h-2" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <h5 className="text-sm font-medium">Current Goals</h5>
                        <ul className="space-y-1">
                          <li className="text-sm">• Lose 5 more kg</li>
                          <li className="text-sm">• Bench press 80kg</li>
                          <li className="text-sm">• Run 5km in 25 min</li>
                        </ul>
                      </div>
                      <div className="space-y-2">
                        <h5 className="text-sm font-medium">Achieved Goals</h5>
                        <ul className="space-y-1">
                          <li className="text-sm">• Lost first 5kg</li>
                          <li className="text-sm">• Reduced body fat by 5%</li>
                          <li className="text-sm">• Completed first 10km run</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </>
        ) : (
          <div className="text-center py-12">
            <Users className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
            <h3 className="text-lg font-medium mb-2">No Members Found</h3>
            <p className="text-muted-foreground mb-4">
              You don't have any members assigned to you yet
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MemberProgressSection;
