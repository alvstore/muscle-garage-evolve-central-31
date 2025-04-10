
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AreaChart, Tooltip, Area, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts";
import { toast } from "sonner";
import { Member } from "@/types";

interface ProgressRecord {
  date: string;
  weight: number;
  bodyFat?: number;
  bmi: number;
}

interface ProgressTrackerProps {
  member: Member;
}

const ProgressTracker = ({ member }: ProgressTrackerProps) => {
  const [activeTab, setActiveTab] = useState("overview");
  const [weight, setWeight] = useState("");
  const [bodyFat, setBodyFat] = useState("");
  const [height, setHeight] = useState("175"); // cm
  
  // Mock progress data
  const [progressData, setProgressData] = useState<ProgressRecord[]>([
    { date: "2025-03-01", weight: 85, bodyFat: 22, bmi: 27.8 },
    { date: "2025-03-08", weight: 84, bodyFat: 21.5, bmi: 27.4 },
    { date: "2025-03-15", weight: 83, bodyFat: 21, bmi: 27.1 },
    { date: "2025-03-22", weight: 82, bodyFat: 20.5, bmi: 26.8 },
    { date: "2025-03-29", weight: 81, bodyFat: 20, bmi: 26.5 },
    { date: "2025-04-05", weight: 80, bodyFat: 19.5, bmi: 26.1 },
  ]);

  const calculateBMI = (weightKg: number, heightCm: number): number => {
    const heightM = heightCm / 100;
    return Number((weightKg / (heightM * heightM)).toFixed(1));
  };

  const recordProgress = () => {
    if (!weight) {
      toast.error("Please enter your weight");
      return;
    }
    
    const weightNum = parseFloat(weight);
    const bodyFatNum = bodyFat ? parseFloat(bodyFat) : undefined;
    const heightNum = parseFloat(height);
    
    const bmi = calculateBMI(weightNum, heightNum);
    
    const newRecord: ProgressRecord = {
      date: new Date().toISOString().split("T")[0],
      weight: weightNum,
      bodyFat: bodyFatNum,
      bmi: bmi
    };
    
    setProgressData([...progressData, newRecord]);
    toast.success("Progress recorded successfully");
    
    // Reset form
    setWeight("");
    setBodyFat("");
  };

  // Format data for charts
  const chartData = progressData.map(record => ({
    date: new Date(record.date).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
    weight: record.weight,
    bodyFat: record.bodyFat || 0,
    bmi: record.bmi
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Fitness Progress Tracker</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="record">Record Progress</TabsTrigger>
            <TabsTrigger value="charts">Charts</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview">
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-accent/20 p-4 rounded-lg text-center">
                  <h3 className="text-sm font-medium text-muted-foreground">Current Weight</h3>
                  <p className="text-2xl font-bold">{progressData[progressData.length - 1]?.weight || "N/A"} kg</p>
                  {progressData.length > 1 && (
                    <p className="text-xs">
                      {progressData[progressData.length - 1].weight < progressData[progressData.length - 2].weight 
                        ? `↓ ${(progressData[progressData.length - 2].weight - progressData[progressData.length - 1].weight).toFixed(1)} kg` 
                        : `↑ ${(progressData[progressData.length - 1].weight - progressData[progressData.length - 2].weight).toFixed(1)} kg`}
                    </p>
                  )}
                </div>
                <div className="bg-accent/20 p-4 rounded-lg text-center">
                  <h3 className="text-sm font-medium text-muted-foreground">Body Fat %</h3>
                  <p className="text-2xl font-bold">{progressData[progressData.length - 1]?.bodyFat || "N/A"}%</p>
                  {progressData.length > 1 && progressData[progressData.length - 1].bodyFat && progressData[progressData.length - 2].bodyFat && (
                    <p className="text-xs">
                      {progressData[progressData.length - 1].bodyFat < progressData[progressData.length - 2].bodyFat 
                        ? `↓ ${(progressData[progressData.length - 2].bodyFat - progressData[progressData.length - 1].bodyFat).toFixed(1)}%` 
                        : `↑ ${(progressData[progressData.length - 1].bodyFat - progressData[progressData.length - 2].bodyFat).toFixed(1)}%`}
                    </p>
                  )}
                </div>
                <div className="bg-accent/20 p-4 rounded-lg text-center">
                  <h3 className="text-sm font-medium text-muted-foreground">BMI</h3>
                  <p className="text-2xl font-bold">{progressData[progressData.length - 1]?.bmi || "N/A"}</p>
                  <p className="text-xs">
                    {progressData[progressData.length - 1]?.bmi < 18.5
                      ? "Underweight"
                      : progressData[progressData.length - 1]?.bmi < 25
                      ? "Normal"
                      : progressData[progressData.length - 1]?.bmi < 30
                      ? "Overweight"
                      : "Obese"}
                  </p>
                </div>
              </div>
              
              <div className="mt-6">
                <h3 className="font-medium mb-2">Recent Progress</h3>
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[500px]">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-2 font-medium">Date</th>
                        <th className="text-left py-2 font-medium">Weight (kg)</th>
                        <th className="text-left py-2 font-medium">Body Fat (%)</th>
                        <th className="text-left py-2 font-medium">BMI</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[...progressData].reverse().slice(0, 5).map((record, idx) => (
                        <tr key={idx} className="border-b">
                          <td className="py-2">{new Date(record.date).toLocaleDateString()}</td>
                          <td className="py-2">{record.weight}</td>
                          <td className="py-2">{record.bodyFat || "N/A"}</td>
                          <td className="py-2">{record.bmi}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="record">
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="weight">Weight (kg) *</Label>
                  <Input
                    id="weight"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                    type="number"
                    step="0.1"
                    placeholder="Enter weight in kg"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bodyFat">Body Fat % (optional)</Label>
                  <Input
                    id="bodyFat"
                    value={bodyFat}
                    onChange={(e) => setBodyFat(e.target.value)}
                    type="number"
                    step="0.1"
                    placeholder="Enter body fat percentage"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="height">Height (cm)</Label>
                  <Input
                    id="height"
                    value={height}
                    onChange={(e) => setHeight(e.target.value)}
                    type="number"
                    step="0.1"
                    placeholder="Enter height in cm"
                  />
                </div>
              </div>
              
              <Button onClick={recordProgress} className="mt-4">
                Record Progress
              </Button>
              
              <div className="rounded-md bg-muted p-3 mt-4">
                <h4 className="font-medium">Tips for Accurate Measurement</h4>
                <ul className="list-disc list-inside text-sm mt-2 space-y-1">
                  <li>Weigh yourself at the same time each day</li>
                  <li>Use the same scale for consistency</li>
                  <li>For body fat, use calipers or a smart scale</li>
                  <li>Take measurements before eating or drinking</li>
                </ul>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="charts">
            <div className="space-y-6">
              <div>
                <h3 className="font-medium mb-2">Weight Progress</h3>
                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis domain={['auto', 'auto']} />
                      <Tooltip />
                      <Area type="monotone" dataKey="weight" stroke="#8884d8" fill="#8884d8" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
              
              <div>
                <h3 className="font-medium mb-2">Body Fat Progress</h3>
                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis domain={['auto', 'auto']} />
                      <Tooltip />
                      <Area type="monotone" dataKey="bodyFat" stroke="#82ca9d" fill="#82ca9d" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
              
              <div>
                <h3 className="font-medium mb-2">BMI Progress</h3>
                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis domain={['auto', 'auto']} />
                      <Tooltip />
                      <Area type="monotone" dataKey="bmi" stroke="#ffc658" fill="#ffc658" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default ProgressTracker;
