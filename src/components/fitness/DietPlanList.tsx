
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  LayoutList, 
  Grid, 
  ChevronRight, 
  Utensils, 
  Clock, 
  Share2, 
  Bookmark, 
  Plus, 
  SlidersHorizontal, 
  Search,
  Loader2
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";

export interface DietPlan {
  id: string;
  title: string;
  description?: string;
  diet_type?: string;
  calories_per_day?: number;
  cuisine_type?: string;
  is_public?: boolean;
  goals?: string[];
  restrictions?: string[];
  created_at?: string;
  updated_at?: string;
  created_by?: string;
}

export const DietPlanList: React.FC = () => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [dietType, setDietType] = useState('all');
  const [cuisine, setCuisine] = useState('all');
  const [isLoading, setIsLoading] = useState(false);
  
  // Mock data
  const dietPlans: DietPlan[] = [
    {
      id: '1',
      title: 'Vegetarian Weight Loss Plan',
      description: 'A balanced vegetarian diet designed for gradual weight loss',
      diet_type: 'vegetarian',
      calories_per_day: 1800,
      cuisine_type: 'indian',
      is_public: true,
      goals: ['weight_loss', 'health'],
      restrictions: ['vegetarian'],
      created_at: '2023-01-15T10:30:00Z'
    },
    {
      id: '2',
      title: 'Keto Power Diet',
      description: 'High fat, low carb diet for rapid weight loss and increased energy',
      diet_type: 'keto',
      calories_per_day: 2200,
      cuisine_type: 'western',
      is_public: true,
      goals: ['weight_loss', 'muscle_retention'],
      restrictions: ['dairy_free'],
      created_at: '2023-02-10T14:20:00Z'
    },
    {
      id: '3',
      title: 'Muscle Building High Protein',
      description: 'Protein-rich diet plan designed for muscle growth',
      diet_type: 'high_protein',
      calories_per_day: 2800,
      cuisine_type: 'mixed',
      is_public: true,
      goals: ['muscle_gain', 'strength'],
      restrictions: [],
      created_at: '2023-03-05T09:45:00Z'
    },
    {
      id: '4',
      title: 'Mediterranean Health Plan',
      description: 'Healthy Mediterranean diet with focus on whole foods',
      diet_type: 'mediterranean',
      calories_per_day: 2000,
      cuisine_type: 'mediterranean',
      is_public: true,
      goals: ['heart_health', 'longevity'],
      restrictions: [],
      created_at: '2023-04-20T16:15:00Z'
    },
    {
      id: '5',
      title: 'Vegan Athlete Diet',
      description: 'Plant-based diet optimized for athletic performance',
      diet_type: 'vegan',
      calories_per_day: 2500,
      cuisine_type: 'mixed',
      is_public: true,
      goals: ['performance', 'recovery'],
      restrictions: ['vegan'],
      created_at: '2023-05-12T11:30:00Z'
    }
  ];
  
  // Filter Diet Plans
  const filteredDietPlans = dietPlans.filter(plan => {
    const matchesSearch = plan.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         (plan.description?.toLowerCase().includes(searchQuery.toLowerCase()) || false);
    const matchesDietType = dietType === 'all' || plan.diet_type === dietType;
    const matchesCuisine = cuisine === 'all' || plan.cuisine_type === cuisine;
    
    return matchesSearch && matchesDietType && matchesCuisine;
  });
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between gap-4 items-start sm:items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Diet Plans</h1>
          <p className="text-muted-foreground">Browse and manage diet plans for your members</p>
        </div>
        <div className="flex gap-2">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Create New Plan
          </Button>
        </div>
      </div>
      
      <Tabs defaultValue="all" className="w-full">
        <div className="flex flex-col sm:flex-row justify-between gap-4 mb-4">
          <TabsList className="mb-2 sm:mb-0">
            <TabsTrigger value="all">All Plans</TabsTrigger>
            <TabsTrigger value="my-plans">My Plans</TabsTrigger>
            <TabsTrigger value="recommended">Recommended</TabsTrigger>
            <TabsTrigger value="favorites">Favorites</TabsTrigger>
          </TabsList>
          
          <div className="flex gap-2">
            <Button 
              variant={viewMode === 'grid' ? 'default' : 'outline'} 
              size="icon"
              onClick={() => setViewMode('grid')}
            >
              <Grid className="h-4 w-4" />
            </Button>
            <Button 
              variant={viewMode === 'list' ? 'default' : 'outline'} 
              size="icon"
              onClick={() => setViewMode('list')}
            >
              <LayoutList className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search plans..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <Select value={dietType} onValueChange={setDietType}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Diet Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="keto">Keto</SelectItem>
                <SelectItem value="vegetarian">Vegetarian</SelectItem>
                <SelectItem value="vegan">Vegan</SelectItem>
                <SelectItem value="mediterranean">Mediterranean</SelectItem>
                <SelectItem value="high_protein">High Protein</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={cuisine} onValueChange={setCuisine}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Cuisine" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Cuisines</SelectItem>
                <SelectItem value="indian">Indian</SelectItem>
                <SelectItem value="western">Western</SelectItem>
                <SelectItem value="mediterranean">Mediterranean</SelectItem>
                <SelectItem value="asian">Asian</SelectItem>
                <SelectItem value="mixed">Mixed</SelectItem>
              </SelectContent>
            </Select>
            
            <Button variant="outline" size="icon">
              <SlidersHorizontal className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        <TabsContent value="all" className="m-0">
          {isLoading ? (
            <div className="flex justify-center items-center p-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : viewMode === 'grid' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredDietPlans.map(plan => (
                <Card key={plan.id} className="overflow-hidden h-full flex flex-col">
                  <CardHeader className="p-4 pb-2">
                    <CardTitle className="text-lg line-clamp-1">{plan.title}</CardTitle>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {plan.diet_type && (
                        <Badge variant="outline">{plan.diet_type}</Badge>
                      )}
                      {plan.cuisine_type && (
                        <Badge variant="outline">{plan.cuisine_type}</Badge>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="p-4 pt-2 flex-1">
                    <CardDescription className="line-clamp-2 mb-2">
                      {plan.description}
                    </CardDescription>
                    <div className="flex items-center gap-2 text-sm">
                      <Utensils className="h-4 w-4 text-muted-foreground" />
                      <span className="text-muted-foreground">{plan.calories_per_day} kcal/day</span>
                    </div>
                  </CardContent>
                  <CardFooter className="p-4 pt-0 flex justify-between">
                    <div className="flex gap-1">
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Bookmark className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Share2 className="h-4 w-4" />
                      </Button>
                    </div>
                    <Button variant="outline" size="sm">
                      View Plan
                      <ChevronRight className="ml-1 h-4 w-4" />
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <div className="space-y-2">
              {filteredDietPlans.map(plan => (
                <Card key={plan.id} className="overflow-hidden">
                  <div className="flex flex-col sm:flex-row sm:items-center p-4 gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold">{plan.title}</h3>
                        <div className="flex gap-1">
                          {plan.diet_type && (
                            <Badge variant="outline" className="text-xs">{plan.diet_type}</Badge>
                          )}
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-1 mb-2">
                        {plan.description}
                      </p>
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1 text-sm">
                          <Utensils className="h-3 w-3 text-muted-foreground" />
                          <span className="text-muted-foreground">{plan.calories_per_day} kcal</span>
                        </div>
                        <div className="flex items-center gap-1 text-sm">
                          <Clock className="h-3 w-3 text-muted-foreground" />
                          <span className="text-muted-foreground">7 meals/day</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center justify-end gap-2 mt-2 sm:mt-0">
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Bookmark className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Share2 className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        View
                        <ChevronRight className="ml-1 h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
          
          {filteredDietPlans.length === 0 && (
            <div className="text-center p-12">
              <p className="text-muted-foreground">No diet plans found matching your criteria.</p>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="my-plans" className="m-0">
          <div className="text-center p-12 border rounded-md">
            <p className="text-muted-foreground">You haven't created any diet plans yet.</p>
            <Button className="mt-4">
              <Plus className="h-4 w-4 mr-2" />
              Create Your First Plan
            </Button>
          </div>
        </TabsContent>
        
        <TabsContent value="recommended" className="m-0">
          <div className="text-center p-12 border rounded-md">
            <p className="text-muted-foreground">No recommended plans available yet.</p>
          </div>
        </TabsContent>
        
        <TabsContent value="favorites" className="m-0">
          <div className="text-center p-12 border rounded-md">
            <p className="text-muted-foreground">You haven't saved any favorites yet.</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
