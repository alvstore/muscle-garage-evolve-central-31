
import React, { useState, useEffect } from 'react';
import { 
  Card, CardContent, CardDescription, CardHeader, CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Search, Plus, Filter, Dumbbell, Calendar, User, ArrowUpDown 
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/use-auth';
import { toast } from 'sonner';
import { Skeleton } from '@/components/ui/skeleton';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import WorkoutPlanDetails from './WorkoutPlanDetails';

interface WorkoutPlan {
  id: string;
  name: string;
  description?: string;
  trainer_id: string;
  difficulty?: string;
  notes?: string;
  is_global: boolean;
  is_custom: boolean;
  created_at: string;
  updated_at: string;
  member_id?: string;
}

export function WorkoutPlanList() {
  const [workoutPlans, setWorkoutPlans] = useState<WorkoutPlan[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPlan, setSelectedPlan] = useState<WorkoutPlan | null>(null);
  const [filterType, setFilterType] = useState<'all' | 'global' | 'custom'>('all');
  const [sortOrder, setSortOrder] = useState<'desc' | 'asc'>('desc');
  const { user } = useAuth();
  
  useEffect(() => {
    const fetchWorkoutPlans = async () => {
      try {
        setIsLoading(true);
        
        let query = supabase
          .from('workout_plans')
          .select('*')
          .order('created_at', { ascending: sortOrder === 'asc' });
        
        // Filter based on user role and current filter settings
        if (user) {
          if (user.role === 'trainer') {
            // Trainers see their own plans + global plans
            if (filterType === 'global') {
              query = query.eq('is_global', true);
            } else if (filterType === 'custom') {
              query = query.eq('trainer_id', user.id).eq('is_custom', true);
            } else {
              query = query.or(`trainer_id.eq.${user.id},is_global.eq.true`);
            }
          } else if (user.role === 'member') {
            // Members see plans assigned to them + global plans
            if (filterType === 'global') {
              query = query.eq('is_global', true);
            } else if (filterType === 'custom') {
              query = query.eq('member_id', user.id);
            } else {
              query = query.or(`member_id.eq.${user.id},is_global.eq.true`);
            }
          } else if (user.role === 'admin' || user.role === 'staff') {
            // Admins and staff see all plans, but can filter
            if (filterType === 'global') {
              query = query.eq('is_global', true);
            } else if (filterType === 'custom') {
              query = query.eq('is_custom', true).eq('is_global', false);
            }
          }
        } else {
          // Unauthenticated users just see global plans
          query = query.eq('is_global', true);
        }
        
        const { data, error } = await query;
        
        if (error) throw error;
        
        setWorkoutPlans(data || []);
      } catch (error: any) {
        console.error('Error fetching workout plans:', error);
        toast.error('Failed to load workout plans');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchWorkoutPlans();
  }, [user, filterType, sortOrder]);
  
  const filteredPlans = workoutPlans.filter(plan => 
    plan.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (plan.description && plan.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );
  
  const handleSelectPlan = (plan: WorkoutPlan) => {
    setSelectedPlan(plan);
  };
  
  const handleBackToList = () => {
    setSelectedPlan(null);
  };
  
  const canCreatePlan = () => {
    if (!user) return false;
    return ['admin', 'trainer', 'staff'].includes(user.role);
  };
  
  if (selectedPlan) {
    return (
      <div className="space-y-4">
        <div className="flex items-center">
          <Button variant="ghost" onClick={handleBackToList} className="mr-2">
            &larr; Back to Plans
          </Button>
        </div>
        <WorkoutPlanDetails workoutPlan={selectedPlan} />
      </div>
    );
  }
  
  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search workout plans..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-10">
                <Filter className="mr-2 h-4 w-4" />
                {filterType === 'all' ? 'All Plans' : filterType === 'global' ? 'Global Plans' : 'Custom Plans'}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setFilterType('all')}>
                All Plans
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilterType('global')}>
                Global Plans
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilterType('custom')}>
                Custom Plans
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          <Button 
            variant="outline" 
            size="sm"
            className="h-10"
            onClick={() => setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc')}
          >
            <ArrowUpDown className="mr-2 h-4 w-4" />
            {sortOrder === 'desc' ? 'Newest' : 'Oldest'}
          </Button>
          
          {canCreatePlan() && (
            <Button size="sm" className="h-10">
              <Plus className="mr-2 h-4 w-4" /> New Plan
            </Button>
          )}
        </div>
      </div>
      
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="overflow-hidden">
              <CardHeader className="pb-3">
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-4 w-1/2" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-24 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : filteredPlans.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredPlans.map((plan) => (
            <Card 
              key={plan.id} 
              className="overflow-hidden cursor-pointer hover:shadow-md transition-all"
              onClick={() => handleSelectPlan(plan)}
            >
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="line-clamp-1">{plan.name}</CardTitle>
                    {plan.description && (
                      <CardDescription className="line-clamp-2 mt-1">
                        {plan.description}
                      </CardDescription>
                    )}
                  </div>
                  <Dumbbell className="h-5 w-5 text-primary opacity-60" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2 mb-4">
                  {plan.difficulty && (
                    <Badge variant="outline" className="bg-primary/10">
                      {plan.difficulty}
                    </Badge>
                  )}
                  {plan.is_global && (
                    <Badge variant="outline" className="bg-secondary/10">
                      Global
                    </Badge>
                  )}
                  {plan.is_custom && !plan.is_global && (
                    <Badge variant="outline" className="bg-accent/10">
                      Custom
                    </Badge>
                  )}
                </div>
                <div className="flex justify-between text-xs text-muted-foreground mt-4">
                  <span className="flex items-center">
                    <Calendar className="h-3 w-3 mr-1" />
                    {new Date(plan.created_at).toLocaleDateString()}
                  </span>
                  <span className="flex items-center">
                    <User className="h-3 w-3 mr-1" />
                    Trainer ID: {plan.trainer_id.slice(0, 5)}...
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <Dumbbell className="h-12 w-12 mb-4 text-muted-foreground opacity-30" />
          <h3 className="text-lg font-medium">No workout plans found</h3>
          <p className="text-sm text-muted-foreground mt-1">
            {searchTerm ? "Try adjusting your search" : "No workout plans are available for you yet"}
          </p>
          {canCreatePlan() && (
            <Button className="mt-4">
              <Plus className="mr-2 h-4 w-4" /> Create First Plan
            </Button>
          )}
        </div>
      )}
    </div>
  );
}

export default WorkoutPlanList;
