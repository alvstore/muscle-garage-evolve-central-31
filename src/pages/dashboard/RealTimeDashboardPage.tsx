
import { useState, useEffect } from "react";
import { Container } from "@/components/ui/container";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  Activity,
  RefreshCw,
  Search,
  Clock,
  CalendarDays,
  ArrowUpRight,
  ArrowDownRight,
  Users,
  Dumbbell,
  ArrowRight,
  CheckCircle,
  AlertCircle,
  User
} from "lucide-react";

// Mock data generator
const generateMockMembers = () => {
  const statusOptions = ['active', 'inactive', 'expired'];
  const members = [];

  for (let i = 1; i <= 20; i++) {
    const randomStatus = statusOptions[Math.floor(Math.random() * statusOptions.length)];
    const checkInTime = new Date();
    checkInTime.setHours(Math.floor(Math.random() * 12) + 8);
    checkInTime.setMinutes(Math.floor(Math.random() * 60));
    
    members.push({
      id: `member-${i}`,
      name: `Test Member ${i}`,
      plan: ['Silver', 'Gold', 'Platinum'][Math.floor(Math.random() * 3)],
      status: randomStatus,
      checkInTime: checkInTime.toISOString(),
      // Add other required member data
    });
  }
  
  return members;
};

const mockMembers = generateMockMembers();

interface PresenceToggleProps {
  isPresent: boolean;
  memberId: string;
  onToggle: (memberId: string, isPresent: boolean) => void;
}

const PresenceToggle = ({ isPresent, memberId, onToggle }: PresenceToggleProps) => {
  return (
    <Button 
      size="sm" 
      variant={isPresent ? "default" : "outline"}
      className={isPresent ? "bg-green-500 hover:bg-green-600" : ""}
      onClick={() => onToggle(memberId, !isPresent)}
    >
      {isPresent ? (
        <>
          <CheckCircle className="h-4 w-4 mr-1" />
          Present
        </>
      ) : (
        <>
          <User className="h-4 w-4 mr-1" />
          Mark Present
        </>
      )}
    </Button>
  );
};

const RealTimeDashboardPage = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [liveMembers, setLiveMembers] = useState(mockMembers);
  const [searchQuery, setSearchQuery] = useState("");
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  // Create attendance entries for the current members
  const attendanceEntries = liveMembers.map(member => ({
    memberId: member.id,
    memberName: member.name,
    time: new Date(member.checkInTime).toISOString(),
    type: 'check-in' as const,
    location: 'Main Entrance',
    device: 'Hikvision Terminal',
    status: member.status
  }));
  
  const presentCount = liveMembers.filter(m => new Date(m.checkInTime).getDate() === new Date().getDate()).length;
  
  const refreshData = () => {
    setIsRefreshing(true);
    // Simulate API call delay
    setTimeout(() => {
      setLiveMembers(generateMockMembers());
      setIsRefreshing(false);
    }, 800);
  };
  
  const handlePresenceToggle = (memberId: string, isPresent: boolean) => {
    setLiveMembers(members => 
      members.map(member => {
        if (member.id === memberId) {
          return {
            ...member,
            checkInTime: isPresent ? new Date().toISOString() : new Date(0).toISOString()
          };
        }
        return member;
      })
    );
  };
  
  const filteredMembers = liveMembers.filter(member => 
    member.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Container>
      <div className="py-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold">Real-Time Dashboard</h1>
            <p className="text-muted-foreground">
              Live gym activity and member presence tracking
            </p>
          </div>
          <Button 
            onClick={refreshData} 
            disabled={isRefreshing}
            className="flex items-center gap-2"
          >
            <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            {isRefreshing ? 'Refreshing...' : 'Refresh Data'}
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="p-4 flex flex-col items-center justify-center text-center">
              <div className="rounded-full bg-blue-100 dark:bg-blue-900/20 p-3 mb-3">
                <Users className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-3xl font-bold mb-1">{presentCount}</h3>
              <p className="text-sm text-muted-foreground">Members Present Today</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 flex flex-col items-center justify-center text-center">
              <div className="rounded-full bg-green-100 dark:bg-green-900/20 p-3 mb-3">
                <ArrowUpRight className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-3xl font-bold mb-1">12</h3>
              <p className="text-sm text-muted-foreground">Check-ins (Last Hour)</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 flex flex-col items-center justify-center text-center">
              <div className="rounded-full bg-red-100 dark:bg-red-900/20 p-3 mb-3">
                <ArrowDownRight className="h-6 w-6 text-red-600 dark:text-red-400" />
              </div>
              <h3 className="text-3xl font-bold mb-1">8</h3>
              <p className="text-sm text-muted-foreground">Check-outs (Last Hour)</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 flex flex-col items-center justify-center text-center">
              <div className="rounded-full bg-purple-100 dark:bg-purple-900/20 p-3 mb-3">
                <Dumbbell className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="text-3xl font-bold mb-1">3</h3>
              <p className="text-sm text-muted-foreground">Active Classes Now</p>
            </CardContent>
          </Card>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">
              <Activity className="h-4 w-4 mr-2" />
              Activity Overview
            </TabsTrigger>
            <TabsTrigger value="members">
              <Users className="h-4 w-4 mr-2" />
              Member Presence
            </TabsTrigger>
            <TabsTrigger value="classes">
              <CalendarDays className="h-4 w-4 mr-2" />
              Active Classes
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-indigo-500" />
                  Latest Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[350px] pr-4">
                  <div className="space-y-4">
                    {attendanceEntries.slice(0, 10).map((entry, index) => (
                      <div key={index} className="flex items-start gap-4 pb-4 border-b last:border-0">
                        <div className={`rounded-full p-2 ${entry.type === 'check-in' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
                          {entry.type === 'check-in' ? 
                            <ArrowUpRight className="h-4 w-4" /> : 
                            <ArrowDownRight className="h-4 w-4" />
                          }
                        </div>
                        <div className="flex-1">
                          <p className="font-medium">{entry.memberName}</p>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <span>{new Date(entry.time).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                            <span>•</span>
                            <span>{entry.location}</span>
                            <span>•</span>
                            <span>{entry.device}</span>
                          </div>
                        </div>
                        <Badge variant={entry.status === 'active' ? 'default' : 'destructive'}>
                          {entry.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>Popular Times</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Morning (6AM-11AM)</span>
                        <span className="text-sm font-bold">65%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                        <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: '65%' }}></div>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Afternoon (11AM-4PM)</span>
                        <span className="text-sm font-bold">40%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                        <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: '40%' }}></div>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Evening (4PM-9PM)</span>
                        <span className="text-sm font-bold">85%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                        <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: '85%' }}></div>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Night (9PM-12AM)</span>
                        <span className="text-sm font-bold">25%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                        <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: '25%' }}></div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Equipment Usage</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Cardio Zone</span>
                        <span className="text-sm font-bold">70%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                        <div className="bg-green-500 h-2.5 rounded-full" style={{ width: '70%' }}></div>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Weight Machines</span>
                        <span className="text-sm font-bold">82%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                        <div className="bg-green-500 h-2.5 rounded-full" style={{ width: '82%' }}></div>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Free Weights</span>
                        <span className="text-sm font-bold">92%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                        <div className="bg-red-500 h-2.5 rounded-full" style={{ width: '92%' }}></div>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Functional Area</span>
                        <span className="text-sm font-bold">58%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                        <div className="bg-green-500 h-2.5 rounded-full" style={{ width: '58%' }}></div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="members">
            <Card>
              <CardHeader>
                <div className="flex flex-col sm:flex-row justify-between gap-4">
                  <CardTitle>Member Presence</CardTitle>
                  <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="search"
                      placeholder="Search members..."
                      className="pl-8 w-full sm:w-[250px]"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[500px] pr-4">
                  <div className="space-y-4">
                    {filteredMembers.map((member) => {
                      const isPresent = new Date(member.checkInTime).getDate() === new Date().getDate();
                      
                      return (
                        <div key={member.id} className="flex items-center justify-between border-b pb-4 last:border-0">
                          <div className="flex items-center gap-4">
                            <div className={`h-10 w-10 rounded-full flex items-center justify-center ${isPresent ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-400'}`}>
                              {isPresent ? 
                                <CheckCircle className="h-5 w-5" /> : 
                                <User className="h-5 w-5" />
                              }
                            </div>
                            <div>
                              <p className="font-medium">{member.name}</p>
                              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <span>Plan: {member.plan}</span>
                                <span>•</span>
                                <Badge variant={member.status === 'active' ? 'default' : 'destructive'} className="text-xs">
                                  {member.status}
                                </Badge>
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            {isPresent && (
                              <span className="text-sm text-muted-foreground">
                                Arrived: {new Date(member.checkInTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                              </span>
                            )}
                            <PresenceToggle 
                              isPresent={isPresent} 
                              memberId={member.id}
                              onToggle={handlePresenceToggle}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="classes">
            <Card>
              <CardHeader>
                <CardTitle>Active Classes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  <Card>
                    <CardContent className="p-0">
                      <div className="bg-indigo-100 dark:bg-indigo-900/30 p-4">
                        <div className="flex justify-between items-start">
                          <h3 className="font-bold text-lg">Spinning Elite</h3>
                          <Badge>In Progress</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">With Trainer Sarah</p>
                      </div>
                      <div className="p-4 space-y-3">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Time:</span>
                          <span>6:00 PM - 7:00 PM</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Location:</span>
                          <span>Studio 2</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Attendance:</span>
                          <span className="font-medium">18/20</span>
                        </div>
                        <div className="pt-2">
                          <Button variant="outline" className="w-full" asChild>
                            <a href="/classes/details/1">
                              <ArrowRight className="h-4 w-4 mr-2" />
                              View Details
                            </a>
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="p-0">
                      <div className="bg-green-100 dark:bg-green-900/30 p-4">
                        <div className="flex justify-between items-start">
                          <h3 className="font-bold text-lg">Yoga Flow</h3>
                          <Badge>In Progress</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">With Trainer Mike</p>
                      </div>
                      <div className="p-4 space-y-3">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Time:</span>
                          <span>6:15 PM - 7:15 PM</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Location:</span>
                          <span>Studio 1</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Attendance:</span>
                          <span className="font-medium">12/15</span>
                        </div>
                        <div className="pt-2">
                          <Button variant="outline" className="w-full" asChild>
                            <a href="/classes/details/2">
                              <ArrowRight className="h-4 w-4 mr-2" />
                              View Details
                            </a>
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="p-0">
                      <div className="bg-red-100 dark:bg-red-900/30 p-4">
                        <div className="flex justify-between items-start">
                          <h3 className="font-bold text-lg">HIIT Challenge</h3>
                          <Badge>In Progress</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">With Trainer Alex</p>
                      </div>
                      <div className="p-4 space-y-3">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Time:</span>
                          <span>6:30 PM - 7:15 PM</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Location:</span>
                          <span>Main Floor</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Attendance:</span>
                          <span className="font-medium">20/25</span>
                        </div>
                        <div className="pt-2">
                          <Button variant="outline" className="w-full" asChild>
                            <a href="/classes/details/3">
                              <ArrowRight className="h-4 w-4 mr-2" />
                              View Details
                            </a>
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
                
                <div className="mt-6">
                  <Separator className="my-4" />
                  <h3 className="font-medium mb-4">Upcoming Classes</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between border rounded-md p-3">
                      <div>
                        <p className="font-medium">Pilates Fusion</p>
                        <p className="text-sm text-muted-foreground">8:00 PM - 9:00 PM • Studio 3</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800">
                          Starts in 1h 15m
                        </Badge>
                        <Button size="sm" variant="outline" asChild>
                          <a href="/classes/details/4">Details</a>
                        </Button>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between border rounded-md p-3">
                      <div>
                        <p className="font-medium">Strength Training</p>
                        <p className="text-sm text-muted-foreground">8:15 PM - 9:15 PM • Weight Area</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800">
                          Starts in 1h 30m
                        </Badge>
                        <Button size="sm" variant="outline" asChild>
                          <a href="/classes/details/5">Details</a>
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Container>
  );
};

export default RealTimeDashboardPage;
