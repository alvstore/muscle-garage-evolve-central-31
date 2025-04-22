
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { useMemberProgress } from '@/hooks/use-member-progress';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Select, 
  SelectContent, 
  SelectGroup, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { format } from 'date-fns';
import { Container } from "@/components/ui/container";
import { mockMembers } from '@/data/mockData';

const TrainerMemberProgressPage = () => {
  const { user } = useAuth();
  const [selectedMemberId, setSelectedMemberId] = useState<string>('');
  
  // Filter members assigned to this trainer
  const trainerMembers = mockMembers.filter(member => member.trainerId === user?.id);
  
  const { 
    progress, 
    isLoading, 
    error 
  } = useMemberProgress(selectedMemberId);
  
  return (
    <Container>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Member Progress</h1>
            <p className="text-muted-foreground">
              Track fitness metrics for your assigned members
            </p>
          </div>
        </div>
        
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Progress Tracking</CardTitle>
                <CardDescription>
                  Select a member to view their detailed progress
                </CardDescription>
              </div>
              <Select 
                value={selectedMemberId} 
                onValueChange={setSelectedMemberId}
              >
                <SelectTrigger className="w-[280px]">
                  <SelectValue placeholder="Select Member" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {trainerMembers.map(member => (
                      <SelectItem 
                        key={member.id} 
                        value={member.id}
                      >
                        {member.name}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          
          <CardContent>
            {selectedMemberId && progress ? (
              <div className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-4">
                      Fitness Goals & Body Metrics
                    </h3>
                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Weight</span>
                          <span>{progress.weight} kg</span>
                        </div>
                        <Progress value={progress.weight / 100 * 100} />
                      </div>
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>BMI</span>
                          <span>{progress.bmi}</span>
                        </div>
                        <Progress value={progress.bmi / 40 * 100} />
                      </div>
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Body Fat %</span>
                          <span>{progress.fat_percent}%</span>
                        </div>
                        <Progress value={progress.fat_percent} />
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold mb-4">
                      Workout & Diet Progress
                    </h3>
                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Workout Completion</span>
                          <span>{progress.workout_completion_percent}%</span>
                        </div>
                        <Progress value={progress.workout_completion_percent} />
                      </div>
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Diet Adherence</span>
                          <span>{progress.diet_adherence_percent}%</span>
                        </div>
                        <Progress value={progress.diet_adherence_percent} />
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="text-sm text-muted-foreground">
                  Last Updated: {format(new Date(progress.last_updated), 'PPpp')}
                </div>
              </div>
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                Select a member to view their progress
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </Container>
  );
};

export default TrainerMemberProgressPage;
