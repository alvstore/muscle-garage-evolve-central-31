
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { TrendingUp } from 'lucide-react';

interface GoalItem {
  id: string;
  name: string;
  target: string;
  progress: number;
}

interface FitnessGoalsProps {
  goals: GoalItem[];
}

const FitnessGoals: React.FC<FitnessGoalsProps> = ({ goals }) => {
  if (!goals || goals.length === 0) {
    return (
      <div className="text-center py-10">
        <TrendingUp className="h-10 w-10 mx-auto text-muted-foreground" />
        <h3 className="mt-4 text-lg font-medium">No fitness goals</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Set your fitness goals to track your progress
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {goals.map((goal) => (
        <div key={goal.id} className="p-3 border rounded-lg">
          <div className="flex justify-between mb-2">
            <h3 className="font-medium">{goal.name}</h3>
            <span className="text-sm font-medium">{goal.progress}%</span>
          </div>
          <p className="text-xs text-muted-foreground mb-2">Target: {goal.target}</p>
          <Progress value={goal.progress} className="h-2" />
        </div>
      ))}
    </div>
  );
};

export default FitnessGoals;
