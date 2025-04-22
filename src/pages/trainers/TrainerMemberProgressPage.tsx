
import React, { useState, useEffect } from 'react';
import { Container } from '@/components/ui/container';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { Loader2, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import MemberProgressChart from '@/components/dashboard/MemberProgressChart';
import { useAuth } from '@/hooks/use-auth';
import { supabase } from '@/services/supabaseClient';
import { useMemberProgress, MemberProgress } from '@/hooks/use-member-progress';

interface Member {
  id: string;
  full_name: string;
  gender: string;
  avatar?: string;
}

const TrainerMemberProgressPage = () => {
  const { user } = useAuth();
  const [members, setMembers] = useState<Member[]>([]);
  const [filteredMembers, setFilteredMembers] = useState<Member[]>([]);
  const [selectedMember, setSelectedMember] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  
  const { progress, isLoading: progressLoading } = useMemberProgress(selectedMember || '');
  
  // Mock data for the chart
  const progressData = [
    { date: '2025-01-01', metrics: { weight: 80, bodyFatPercentage: 22, bmi: 26.4, muscleGain: 0 } },
    { date: '2025-02-01', metrics: { weight: 78, bodyFatPercentage: 21, bmi: 25.8, muscleGain: 1.5 } },
    { date: '2025-03-01', metrics: { weight: 77, bodyFatPercentage: 20, bmi: 25.4, muscleGain: 2.2 } },
    { date: '2025-04-01', metrics: { weight: 76, bodyFatPercentage: 19, bmi: 25.1, muscleGain: 2.8 } },
    { date: '2025-05-01', metrics: { weight: 75, bodyFatPercentage: 18, bmi: 24.8, muscleGain: 3.5 } },
    { date: '2025-06-01', metrics: { weight: 74, bodyFatPercentage: 17, bmi: 24.4, muscleGain: 4.2 } }
  ];
  
  useEffect(() => {
    const fetchMembers = async () => {
      if (!user) return;
      
      try {
        // Get the trainer's members
        const { data, error } = await supabase
          .from('members')
          .select('id, full_name, gender, avatar')
          .eq('trainer_id', user.id);
          
        if (error) throw error;
        
        if (data) {
          setMembers(data);
          setFilteredMembers(data);
          // Select the first member by default if there are members
          if (data.length > 0) {
            setSelectedMember(data[0].id);
          }
        }
      } catch (error) {
        console.error('Error fetching members:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchMembers();
  }, [user]);
  
  // Filter members when search query changes
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredMembers(members);
    } else {
      const filtered = members.filter(member => 
        member.full_name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredMembers(filtered);
    }
  }, [searchQuery, members]);
  
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };
  
  const getInitials = (name: string) => {
    return name.split(" ").map(n => n[0]).join("").toUpperCase();
  };
  
  return (
    <Container>
      <div className="py-6">
        <h1 className="text-2xl font-bold mb-6">Member Progress Tracking</h1>
        
        <div className="grid gap-6 md:grid-cols-12">
          {/* Member selection sidebar */}
          <Card className="md:col-span-4">
            <CardHeader>
              <CardTitle>My Members</CardTitle>
              <CardDescription>Select a member to view their progress</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="relative mb-4">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search members..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={handleSearch}
                />
              </div>
              
              {isLoading ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : filteredMembers.length > 0 ? (
                <div className="space-y-2 max-h-[calc(100vh-300px)] overflow-y-auto pr-2">
                  {filteredMembers.map((member) => (
                    <div
                      key={member.id}
                      className={`flex items-center p-3 rounded-md cursor-pointer ${
                        selectedMember === member.id 
                          ? 'bg-primary/10 text-primary'
                          : 'hover:bg-accent/50'
                      }`}
                      onClick={() => setSelectedMember(member.id)}
                    >
                      <Avatar className="h-10 w-10 mr-3">
                        <AvatarImage src={member.avatar} />
                        <AvatarFallback>{getInitials(member.full_name)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{member.full_name}</p>
                        <p className="text-xs text-muted-foreground">
                          {member.gender}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">No members found</p>
                </div>
              )}
            </CardContent>
          </Card>
          
          {/* Progress details */}
          <div className="md:col-span-8 space-y-6">
            {selectedMember ? (
              <>
                <Card>
                  <CardHeader>
                    <CardTitle>Progress Overview</CardTitle>
                    <CardDescription>
                      {members.find(m => m.id === selectedMember)?.full_name}'s fitness journey
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {progressLoading ? (
                      <div className="flex justify-center py-8">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                      </div>
                    ) : progress ? (
                      <div className="space-y-4">
                        <div>
                          <div className="flex justify-between mb-1">
                            <span className="text-sm font-medium">Weight Progress</span>
                            <span className="text-sm text-muted-foreground">
                              {progress.weight} kg
                            </span>
                          </div>
                          <Progress value={75} className="h-2" />
                        </div>
                        
                        <div>
                          <div className="flex justify-between mb-1">
                            <span className="text-sm font-medium">Body Fat</span>
                            <span className="text-sm text-muted-foreground">
                              {progress.fat_percent}%
                            </span>
                          </div>
                          <Progress value={60} className="h-2" />
                        </div>
                        
                        <div>
                          <div className="flex justify-between mb-1">
                            <span className="text-sm font-medium">Muscle Mass</span>
                            <span className="text-sm text-muted-foreground">
                              {progress.muscle_mass} kg
                            </span>
                          </div>
                          <Progress value={45} className="h-2" />
                        </div>
                        
                        <div>
                          <div className="flex justify-between mb-1">
                            <span className="text-sm font-medium">BMI</span>
                            <span className="text-sm text-muted-foreground">
                              {progress.bmi}
                            </span>
                          </div>
                          <Progress value={85} className="h-2" />
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <p className="text-muted-foreground">No progress data available</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
                
                <Tabs defaultValue="measurements">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="measurements">Measurements</TabsTrigger>
                    <TabsTrigger value="workouts">Workout Adherence</TabsTrigger>
                    <TabsTrigger value="diet">Diet Adherence</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="measurements" className="space-y-4 mt-6">
                    <Card>
                      <CardHeader>
                        <CardTitle>Body Measurements</CardTitle>
                        <CardDescription>
                          Tracking progress over time
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="h-[300px]">
                          <MemberProgressChart 
                            data={progressData}
                            memberId={selectedMember}
                            memberName={members.find(m => m.id === selectedMember)?.full_name || ''}
                          />
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                  
                  <TabsContent value="workouts" className="space-y-4 mt-6">
                    <Card>
                      <CardHeader>
                        <CardTitle>Workout Completion</CardTitle>
                        <CardDescription>
                          Consistency in following workout plan
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        {progress ? (
                          <div className="space-y-6">
                            <div className="flex flex-col items-center">
                              <div className="relative h-24 w-24">
                                <svg className="h-full w-full" viewBox="0 0 100 100">
                                  <circle
                                    className="text-gray-200 dark:text-gray-700"
                                    strokeWidth="10"
                                    stroke="currentColor"
                                    fill="transparent"
                                    r="40"
                                    cx="50"
                                    cy="50"
                                  />
                                  <circle
                                    className="text-primary"
                                    strokeWidth="10"
                                    strokeDasharray={251.2}
                                    strokeDashoffset={251.2 * (1 - progress.workout_completion_percent / 100)}
                                    strokeLinecap="round"
                                    stroke="currentColor"
                                    fill="transparent"
                                    r="40"
                                    cx="50"
                                    cy="50"
                                  />
                                </svg>
                                <div className="absolute inset-0 flex items-center justify-center">
                                  <span className="text-2xl font-bold">{progress.workout_completion_percent}%</span>
                                </div>
                              </div>
                              <p className="mt-4 text-center text-sm text-muted-foreground">
                                Overall workout plan adherence
                              </p>
                            </div>
                            
                            <div className="space-y-2">
                              <h3 className="text-sm font-medium">Recent Workouts</h3>
                              <div className="space-y-2">
                                {[...Array(5)].map((_, i) => {
                                  const date = new Date();
                                  date.setDate(date.getDate() - i);
                                  return (
                                    <div key={i} className="flex justify-between items-center p-2 bg-accent/10 rounded">
                                      <span>{date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</span>
                                      <span className={`text-xs px-2 py-0.5 rounded-full ${i % 4 === 0 ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300' : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'}`}>
                                        {i % 4 === 0 ? 'Missed' : 'Completed'}
                                      </span>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div className="text-center py-8">
                            <p className="text-muted-foreground">No workout data available</p>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </TabsContent>
                  
                  <TabsContent value="diet" className="space-y-4 mt-6">
                    <Card>
                      <CardHeader>
                        <CardTitle>Diet Adherence</CardTitle>
                        <CardDescription>
                          Consistency in following diet plan
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        {progress ? (
                          <div className="space-y-6">
                            <div className="flex flex-col items-center">
                              <div className="relative h-24 w-24">
                                <svg className="h-full w-full" viewBox="0 0 100 100">
                                  <circle
                                    className="text-gray-200 dark:text-gray-700"
                                    strokeWidth="10"
                                    stroke="currentColor"
                                    fill="transparent"
                                    r="40"
                                    cx="50"
                                    cy="50"
                                  />
                                  <circle
                                    className="text-primary"
                                    strokeWidth="10"
                                    strokeDasharray={251.2}
                                    strokeDashoffset={251.2 * (1 - progress.diet_adherence_percent / 100)}
                                    strokeLinecap="round"
                                    stroke="currentColor"
                                    fill="transparent"
                                    r="40"
                                    cx="50"
                                    cy="50"
                                  />
                                </svg>
                                <div className="absolute inset-0 flex items-center justify-center">
                                  <span className="text-2xl font-bold">{progress.diet_adherence_percent}%</span>
                                </div>
                              </div>
                              <p className="mt-4 text-center text-sm text-muted-foreground">
                                Overall diet plan adherence
                              </p>
                            </div>
                            
                            <div className="space-y-4">
                              <h3 className="text-sm font-medium">Nutrition Overview</h3>
                              <div className="grid grid-cols-3 gap-2">
                                <div className="p-3 bg-accent/10 rounded text-center">
                                  <p className="text-xs text-muted-foreground">Protein</p>
                                  <p className="text-lg font-medium">120g</p>
                                  <p className="text-xs text-green-600">90% Target</p>
                                </div>
                                <div className="p-3 bg-accent/10 rounded text-center">
                                  <p className="text-xs text-muted-foreground">Carbs</p>
                                  <p className="text-lg font-medium">180g</p>
                                  <p className="text-xs text-amber-600">75% Target</p>
                                </div>
                                <div className="p-3 bg-accent/10 rounded text-center">
                                  <p className="text-xs text-muted-foreground">Fats</p>
                                  <p className="text-lg font-medium">45g</p>
                                  <p className="text-xs text-green-600">95% Target</p>
                                </div>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div className="text-center py-8">
                            <p className="text-muted-foreground">No diet data available</p>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>
              </>
            ) : (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <Search className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium">No Member Selected</h3>
                  <p className="text-sm text-muted-foreground mt-2 max-w-md text-center">
                    {members.length > 0 
                      ? "Please select a member from the list to view their progress details."
                      : "You don't have any members assigned to you yet."}
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </Container>
  );
};

export default TrainerMemberProgressPage;
