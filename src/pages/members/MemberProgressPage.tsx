
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Container } from "@/components/ui/container";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { format, parseISO } from "date-fns";
import { CalendarIcon, Plus, Save, BarChart3, LineChart, Ruler, Weight, Activity } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ProgressMetrics } from "@/types/class";
import MemberProgressChart from "@/components/dashboard/MemberProgressChart";
import { mockMembers } from "@/data/mockData";
import { toast } from "sonner";

interface ProgressEntry {
  date: string;
  metrics: ProgressMetrics;
}

const MemberProgressPage = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [member, setMember] = useState<any>(null);
  const [progressData, setProgressData] = useState<ProgressEntry[]>([]);
  const [showEntryForm, setShowEntryForm] = useState(false);
  const [activeMetric, setActiveMetric] = useState<keyof ProgressMetrics>("weight");
  
  // Form state for new entry
  const [newEntry, setNewEntry] = useState<ProgressEntry>({
    date: format(new Date(), 'yyyy-MM-dd'),
    metrics: {
      weight: 0,
      bodyFatPercentage: 0,
      bmi: 0,
      muscleGain: 0
    }
  });
  
  useEffect(() => {
    // Simulate API call to get member details
    setTimeout(() => {
      // If no ID or if current user is a member viewing their own data
      let targetId = id;
      if (!targetId && user?.role === 'member') {
        targetId = user.id;
      }
      
      const foundMember = mockMembers.find(m => m.id === targetId);
      
      if (foundMember) {
        setMember(foundMember);
        
        // Mock progress data
        const mockProgressData = [
          { date: '2025-01-01', metrics: { weight: 80, bodyFatPercentage: 22, bmi: 26.4, muscleGain: 0 } },
          { date: '2025-02-01', metrics: { weight: 78, bodyFatPercentage: 21, bmi: 25.8, muscleGain: 1.5 } },
          { date: '2025-03-01', metrics: { weight: 77, bodyFatPercentage: 20, bmi: 25.4, muscleGain: 2.2 } },
          { date: '2025-04-01', metrics: { weight: 76, bodyFatPercentage: 19, bmi: 25.1, muscleGain: 2.8 } },
          { date: '2025-05-01', metrics: { weight: 75, bodyFatPercentage: 18, bmi: 24.8, muscleGain: 3.5 } },
          { date: '2025-06-01', metrics: { weight: 74, bodyFatPercentage: 17, bmi: 24.4, muscleGain: 4.2 } }
        ];
        
        setProgressData(mockProgressData);
      }
      
      setIsLoading(false);
    }, 1000);
  }, [id, user]);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    setNewEntry(prev => ({
      ...prev,
      metrics: {
        ...prev.metrics,
        [name]: parseFloat(value) || 0
      }
    }));
  };
  
  const handleSaveEntry = () => {
    // Add the new entry to the progress data
    const updatedProgressData = [...progressData, newEntry].sort((a, b) => {
      return new Date(a.date).getTime() - new Date(b.date).getTime();
    });
    
    setProgressData(updatedProgressData);
    setShowEntryForm(false);
    
    // Reset form
    setNewEntry({
      date: format(new Date(), 'yyyy-MM-dd'),
      metrics: {
        weight: 0,
        bodyFatPercentage: 0,
        bmi: 0,
        muscleGain: 0
      }
    });
    
    toast.success("Progress entry added successfully");
  };
  
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };
  
  const calculateProgress = (metricKey: keyof ProgressMetrics) => {
    if (progressData.length < 2) return { value: 0, improved: false };
    
    const latest = progressData[progressData.length - 1].metrics[metricKey];
    const first = progressData[0].metrics[metricKey];
    const diff = latest - first;
    
    // For weight and body fat, lower is better. For muscle gain, higher is better.
    const improved = metricKey === 'muscleGain' ? diff > 0 : diff < 0;
    
    return {
      value: Math.abs(diff),
      improved
    };
  };
  
  // Calculate progress for each metric
  const weightProgress = calculateProgress('weight');
  const bodyFatProgress = calculateProgress('bodyFatPercentage');
  const muscleGainProgress = calculateProgress('muscleGain');
  
  const getMetricIcon = (type: keyof ProgressMetrics) => {
    switch(type) {
      case 'weight': return <Weight className="h-5 w-5" />;
      case 'bodyFatPercentage': return <Ruler className="h-5 w-5" />;
      case 'bmi': return <Activity className="h-5 w-5" />;
      case 'muscleGain': return <BarChart3 className="h-5 w-5" />;
      default: return <LineChart className="h-5 w-5" />;
    }
  };
  
  if (isLoading) {
    return (
      <Container>
        <div className="py-6">
          <h1 className="text-2xl font-bold mb-6">Member Progress</h1>
          <div className="h-96 w-full animate-pulse bg-muted rounded-md"></div>
        </div>
      </Container>
    );
  }
  
  if (!member) {
    return (
      <Container>
        <div className="py-6">
          <h1 className="text-2xl font-bold mb-6">Member Progress</h1>
          <Card>
            <CardContent className="py-12">
              <div className="text-center">
                <h2 className="text-xl font-semibold mb-2">Member Not Found</h2>
                <p className="text-muted-foreground">The member you're looking for doesn't exist or you don't have permission to view their data.</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </Container>
    );
  }
  
  return (
    <Container>
      <div className="py-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div>
            <h1 className="text-2xl font-bold">Member Progress</h1>
            <p className="text-muted-foreground">Track fitness metrics and progress over time</p>
          </div>
          
          {(user?.role === 'admin' || user?.role === 'trainer') && (
            <Button onClick={() => setShowEntryForm(true)} disabled={showEntryForm}>
              <Plus className="mr-2 h-4 w-4" />
              Add New Entry
            </Button>
          )}
        </div>
        
        <div className="grid gap-6 mb-6">
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row gap-6 items-center">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={member.avatar} alt={member.name} />
                  <AvatarFallback>{getInitials(member.name)}</AvatarFallback>
                </Avatar>
                
                <div className="text-center md:text-left">
                  <h2 className="text-xl font-bold">{member.name}</h2>
                  <p className="text-muted-foreground">Goal: {member.goal || "General fitness"}</p>
                </div>
                
                <div className="md:ml-auto grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="text-center p-3 border rounded">
                    <div className="flex items-center justify-center mb-1">
                      <Weight className="h-4 w-4 text-primary mr-1" />
                      <span className="font-semibold text-sm">Weight</span>
                    </div>
                    <div className={`text-xl font-bold ${weightProgress.improved ? 'text-green-500' : 'text-amber-500'}`}>
                      {weightProgress.improved ? "-" : "+"}{weightProgress.value.toFixed(1)} kg
                    </div>
                  </div>
                  
                  <div className="text-center p-3 border rounded">
                    <div className="flex items-center justify-center mb-1">
                      <Ruler className="h-4 w-4 text-primary mr-1" />
                      <span className="font-semibold text-sm">Body Fat</span>
                    </div>
                    <div className={`text-xl font-bold ${bodyFatProgress.improved ? 'text-green-500' : 'text-amber-500'}`}>
                      {bodyFatProgress.improved ? "-" : "+"}{bodyFatProgress.value.toFixed(1)}%
                    </div>
                  </div>
                  
                  <div className="text-center p-3 border rounded">
                    <div className="flex items-center justify-center mb-1">
                      <BarChart3 className="h-4 w-4 text-primary mr-1" />
                      <span className="font-semibold text-sm">Muscle</span>
                    </div>
                    <div className={`text-xl font-bold ${muscleGainProgress.improved ? 'text-green-500' : 'text-amber-500'}`}>
                      {muscleGainProgress.improved ? "+" : "-"}{muscleGainProgress.value.toFixed(1)} kg
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {showEntryForm && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Add New Progress Entry</CardTitle>
              <CardDescription>Record the latest fitness metrics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="date">Entry Date</Label>
                    <div className="flex">
                      <Input
                        id="date"
                        type="date"
                        value={newEntry.date}
                        onChange={(e) => setNewEntry({...newEntry, date: e.target.value})}
                      />
                      <Button variant="ghost" className="px-2">
                        <CalendarIcon className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="weight">Weight (kg)</Label>
                    <Input
                      id="weight"
                      name="weight"
                      type="number"
                      step="0.1"
                      value={newEntry.metrics.weight || ''}
                      onChange={handleInputChange}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="bodyFatPercentage">Body Fat (%)</Label>
                    <Input
                      id="bodyFatPercentage"
                      name="bodyFatPercentage"
                      type="number"
                      step="0.1"
                      value={newEntry.metrics.bodyFatPercentage || ''}
                      onChange={handleInputChange}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="bmi">BMI</Label>
                    <Input
                      id="bmi"
                      name="bmi"
                      type="number"
                      step="0.1"
                      value={newEntry.metrics.bmi || ''}
                      onChange={handleInputChange}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="muscleGain">Muscle Gain (kg)</Label>
                    <Input
                      id="muscleGain"
                      name="muscleGain"
                      type="number"
                      step="0.1"
                      value={newEntry.metrics.muscleGain || ''}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
                
                <div className="flex justify-end space-x-2 pt-4">
                  <Button variant="outline" onClick={() => setShowEntryForm(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleSaveEntry}>
                    <Save className="mr-2 h-4 w-4" />
                    Save Entry
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
        
        <Tabs defaultValue={activeMetric} onValueChange={(v) => setActiveMetric(v as keyof ProgressMetrics)}>
          <div className="flex justify-between items-center mb-4">
            <TabsList>
              <TabsTrigger value="weight" className="flex items-center gap-1">
                <Weight className="h-4 w-4" />
                <span className="hidden sm:inline">Weight</span>
              </TabsTrigger>
              <TabsTrigger value="bodyFatPercentage" className="flex items-center gap-1">
                <Ruler className="h-4 w-4" />
                <span className="hidden sm:inline">Body Fat</span>
              </TabsTrigger>
              <TabsTrigger value="bmi" className="flex items-center gap-1">
                <Activity className="h-4 w-4" />
                <span className="hidden sm:inline">BMI</span>
              </TabsTrigger>
              <TabsTrigger value="muscleGain" className="flex items-center gap-1">
                <BarChart3 className="h-4 w-4" />
                <span className="hidden sm:inline">Muscle</span>
              </TabsTrigger>
            </TabsList>
            
            <Select defaultValue="all">
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Time Range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Time</SelectItem>
                <SelectItem value="6m">Last 6 Months</SelectItem>
                <SelectItem value="3m">Last 3 Months</SelectItem>
                <SelectItem value="1m">Last Month</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <Card>
            <CardContent className="pt-6 pb-0">
              <div className="h-[300px]">
                <MemberProgressChart 
                  data={progressData}
                  memberId={member.id}
                  memberName={member.name}
                  metricType={activeMetric}
                />
              </div>
            </CardContent>
          </Card>
          
          <div className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Progress History</CardTitle>
                <CardDescription>Detailed record of all progress entries</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="relative overflow-x-auto">
                  <table className="w-full text-sm text-left">
                    <thead className="bg-muted">
                      <tr>
                        <th scope="col" className="px-4 py-3">Date</th>
                        <th scope="col" className="px-4 py-3">Weight (kg)</th>
                        <th scope="col" className="px-4 py-3">Body Fat (%)</th>
                        <th scope="col" className="px-4 py-3">BMI</th>
                        <th scope="col" className="px-4 py-3">Muscle Gain (kg)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {progressData.slice().reverse().map((entry, index) => (
                        <tr key={index} className="border-b">
                          <td className="px-4 py-3 font-medium">{format(parseISO(entry.date), 'MMM d, yyyy')}</td>
                          <td className="px-4 py-3">{entry.metrics.weight.toFixed(1)}</td>
                          <td className="px-4 py-3">{entry.metrics.bodyFatPercentage.toFixed(1)}</td>
                          <td className="px-4 py-3">{entry.metrics.bmi.toFixed(1)}</td>
                          <td className="px-4 py-3">{entry.metrics.muscleGain.toFixed(1)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>
        </Tabs>
      </div>
    </Container>
  );
};

export default MemberProgressPage;
