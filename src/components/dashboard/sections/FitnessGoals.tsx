
import React from 'react';
import { Progress } from "@/components/ui/progress";
import { CheckCircle, Trophy } from 'lucide-react';

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
        <Trophy className="h-10 w-10 mx-auto text-muted-foreground" />
        <h3 className="mt-4 text-lg font-medium">No fitness goals</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Set your first fitness goal to track your progress
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {goals.map((goal) => (
        <div key={goal.id} className="space-y-2">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              {goal.progress >= 100 ? (
                <CheckCircle className="h-5 w-5 text-green-500" />
              ) : (
                <div className="h-5 w-5 flex items-center justify-center">
                  <span className="text-sm font-medium">{goal.progress}%</span>
                </div>
              )}
              <span className="font-medium">{goal.name}</span>
            </div>
            <span className="text-sm text-muted-foreground">{goal.target}</span>
          </div>
          <Progress value={goal.progress} className="h-2" />
        </div>
      ))}
    </div>
  );
};

export default FitnessGoals;
