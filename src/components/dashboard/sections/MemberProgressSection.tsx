
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { ChevronRight, ArrowUpCircle, ArrowDownCircle, Minus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useNavigate } from 'react-router-dom';

interface MemberProgressData {
  id: string;
  name: string;
  goal: string;
  current: number;
  target: number;
  trend: 'up' | 'down' | 'neutral';
}

interface MemberProgressSectionProps {
  data?: MemberProgressData[];
  isLoading?: boolean;
}

const MemberProgressSection: React.FC<MemberProgressSectionProps> = ({ 
  data, 
  isLoading = false 
}) => {
  const navigate = useNavigate();
  
  const mockData = [
    {
      id: '1',
      name: 'John Doe',
      goal: 'Weight Loss',
      current: 78,
      target: 70,
      trend: 'down' as const
    },
    {
      id: '2',
      name: 'Jane Smith',
      goal: 'Muscle Gain',
      current: 62,
      target: 65,
      trend: 'up' as const
    },
    {
      id: '3',
      name: 'Mike Johnson',
      goal: 'Body Composition',
      current: 18,
      target: 15,
      trend: 'down' as const
    }
  ];

  const progressData = data || mockData;
  
  const getProgressPercentage = (current: number, target: number, trend: 'up' | 'down' | 'neutral') => {
    if (trend === 'down') {
      // For goals where lower is better (e.g., weight loss)
      const start = current + (current - target); // Estimating starting point
      return 100 - Math.min(100, Math.max(0, ((current - target) / (start - target)) * 100));
    } else {
      // For goals where higher is better (e.g., muscle gain)
      const start = current - (target - current); // Estimating starting point
      return Math.min(100, Math.max(0, ((current - start) / (target - start)) * 100));
    }
  };

  const getTrendIcon = (trend: 'up' | 'down' | 'neutral') => {
    switch (trend) {
      case 'up':
        return <ArrowUpCircle className="h-4 w-4 text-green-500" />;
      case 'down':
        return <ArrowDownCircle className="h-4 w-4 text-rose-500" />;
      default:
        return <Minus className="h-4 w-4 text-amber-500" />;
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
        <div>
          <CardTitle>Member Progress</CardTitle>
          <CardDescription>
            Fitness goals achievement for top members
          </CardDescription>
        </div>
        <div className="flex items-center gap-2">
          <Select defaultValue="thisMonth">
            <SelectTrigger className="w-[130px] h-8">
              <SelectValue placeholder="Period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="thisWeek">This Week</SelectItem>
              <SelectItem value="thisMonth">This Month</SelectItem>
              <SelectItem value="thisYear">This Year</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-4 w-[250px]" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-[100px]" />
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-6">
            {progressData.map((item) => (
              <div key={item.id} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="font-medium">{item.name}</div>
                  {getTrendIcon(item.trend)}
                </div>
                <div>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-muted-foreground">{item.goal}</span>
                    <span>
                      {item.current} / {item.target}
                      {item.goal.includes('Fat') || item.goal.toLowerCase().includes('fat') ? '%' : ' kg'}
                    </span>
                  </div>
                  <Progress
                    value={getProgressPercentage(item.current, item.target, item.trend)}
                    className="h-2"
                  />
                </div>
              </div>
            ))}
            
            <Button
              variant="ghost"
              size="sm"
              className="w-full text-xs"
              onClick={() => navigate('/fitness/progress')}
            >
              View All Member Progress
              <ChevronRight className="ml-1 h-4 w-4" />
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MemberProgressSection;
