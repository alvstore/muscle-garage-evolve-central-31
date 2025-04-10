
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Member } from "@/types";
import { toast } from "sonner";
import { Users, Dumbbell, Search, Check, UserPlus } from "lucide-react";

interface PTPlanManagementProps {
  trainerId: string;
  members: Member[];
}

const PTPlanManagement = ({ trainerId, members }: PTPlanManagementProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMemberIds, setSelectedMemberIds] = useState<string[]>([]);
  
  // Mock data for PT plans
  const [ptSubscribers, setPtSubscribers] = useState<{
    memberId: string;
    startDate: string;
    endDate: string;
    sessions: number;
    sessionsUsed: number;
    planType: string;
    status: "active" | "expired" | "pending";
  }[]>([
    {
      memberId: "member-1",
      startDate: "2025-03-01",
      endDate: "2025-05-31",
      sessions: 24,
      sessionsUsed: 10,
      planType: "Premium PT",
      status: "active"
    },
    {
      memberId: "member-2",
      startDate: "2025-01-15",
      endDate: "2025-04-15",
      sessions: 36,
      sessionsUsed: 28,
      planType: "Standard PT",
      status: "active"
    }
  ]);
  
  // Filter members based on search query
  const filteredMembers = members.filter(member => 
    member.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    member.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  // Members assigned to the trainer
  const assignedMembers = members.filter(m => m.trainerId === trainerId);
  
  // PT subscribed members
  const subscribedMembers = members.filter(m => 
    ptSubscribers.some(sub => sub.memberId === m.id)
  );
  
  // Get PT plan for a member
  const getMemberPtPlan = (memberId: string) => {
    return ptSubscribers.find(sub => sub.memberId === memberId);
  };
  
  // Toggle member selection
  const toggleMemberSelection = (memberId: string) => {
    setSelectedMemberIds(prev => 
      prev.includes(memberId) 
        ? prev.filter(id => id !== memberId) 
        : [...prev, memberId]
    );
  };
  
  // Assign PT plan to selected members
  const assignPtPlan = () => {
    // In a real app, this would make API calls
    toast.success(`Assigned PT plan to ${selectedMemberIds.length} members`);
    setSelectedMemberIds([]);
  };
  
  // Get initials for avatar
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };
  
  // Calculate progress percentage
  const calculateProgress = (used: number, total: number) => {
    return Math.round((used / total) * 100);
  };
  
  return (
    <div className="space-y-6">
      <Tabs defaultValue="subscribed">
        <TabsList>
          <TabsTrigger value="subscribed">PT Subscribers</TabsTrigger>
          <TabsTrigger value="assigned">Assigned Members</TabsTrigger>
          <TabsTrigger value="all">All Members</TabsTrigger>
        </TabsList>
        
        <TabsContent value="subscribed" className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Personal Training Subscribers</h2>
            <div className="flex items-center space-x-2">
              <Button variant="outline" className="flex items-center gap-2">
                <Dumbbell className="h-4 w-4" />
                Manage Plans
              </Button>
            </div>
          </div>
          
          {subscribedMembers.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2">
              {subscribedMembers.map(member => {
                const ptPlan = getMemberPtPlan(member.id);
                if (!ptPlan) return null;
                
                const progress = calculateProgress(ptPlan.sessionsUsed, ptPlan.sessions);
                
                return (
                  <Card key={member.id}>
                    <CardContent className="p-4 space-y-4">
                      <div className="flex items-center space-x-4">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={member.avatar} alt={member.name} />
                          <AvatarFallback>{getInitials(member.name)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="font-medium">{member.name}</h3>
                          <p className="text-sm text-muted-foreground">{member.email}</p>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-muted-foreground">Plan:</span>
                          <Badge variant="outline">{ptPlan.planType}</Badge>
                        </div>
                        
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-muted-foreground">Status:</span>
                          <Badge variant={ptPlan.status === "active" ? "default" : "destructive"}>
                            {ptPlan.status}
                          </Badge>
                        </div>
                        
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-muted-foreground">Sessions:</span>
                          <span className="text-sm font-medium">{ptPlan.sessionsUsed} / {ptPlan.sessions}</span>
                        </div>
                        
                        <div className="w-full bg-gray-200 dark:bg-gray-700 h-2 rounded-full overflow-hidden">
                          <div 
                            className={`h-full ${
                              progress > 75 ? "bg-amber-500" : "bg-blue-600"
                            }`}
                            style={{ width: `${progress}%` }}
                          ></div>
                        </div>
                        
                        <div className="flex justify-between items-center text-xs text-muted-foreground">
                          <span>Start: {new Date(ptPlan.startDate).toLocaleDateString()}</span>
                          <span>End: {new Date(ptPlan.endDate).toLocaleDateString()}</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2 pt-2">
                        <Button variant="outline" size="sm" className="flex-1">
                          View Plans
                        </Button>
                        <Button size="sm" className="flex-1">
                          Record Session
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center p-6">
                <Users className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium">No PT subscribers yet</h3>
                <p className="text-sm text-muted-foreground text-center max-w-md mt-1">
                  Members with personal training subscriptions will appear here
                </p>
                <Button className="mt-4">
                  <UserPlus className="h-4 w-4 mr-2" />
                  Assign New Members
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>
        
        <TabsContent value="assigned" className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Assigned Members</h2>
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search members..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          
          {assignedMembers.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {assignedMembers
                .filter(m => 
                  m.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                  m.email?.toLowerCase().includes(searchQuery.toLowerCase())
                )
                .map(member => {
                  const hasPtPlan = ptSubscribers.some(sub => sub.memberId === member.id);
                  
                  return (
                    <Card key={member.id} className={hasPtPlan ? "border-green-500" : ""}>
                      <CardContent className="p-4">
                        <div className="flex items-center space-x-4">
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={member.avatar} alt={member.name} />
                            <AvatarFallback>{getInitials(member.name)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <h3 className="font-medium">{member.name}</h3>
                            <p className="text-sm text-muted-foreground">{member.email}</p>
                          </div>
                        </div>
                        
                        <div className="mt-4 flex justify-between items-center">
                          <span className="text-sm">
                            {hasPtPlan ? (
                              <Badge className="bg-green-500">
                                <Check className="h-3 w-3 mr-1" />
                                PT Subscriber
                              </Badge>
                            ) : (
                              <Badge variant="outline">
                                No PT Plan
                              </Badge>
                            )}
                          </span>
                          
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => toggleMemberSelection(member.id)}
                            className={selectedMemberIds.includes(member.id) ? "border-primary text-primary" : ""}
                          >
                            {selectedMemberIds.includes(member.id) ? "Selected" : "Select"}
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
            </div>
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center p-6">
                <Users className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium">No members assigned yet</h3>
                <p className="text-sm text-muted-foreground text-center max-w-md mt-1">
                  Once members are assigned to you, they will appear here
                </p>
              </CardContent>
            </Card>
          )}
          
          {selectedMemberIds.length > 0 && (
            <div className="sticky bottom-4 flex justify-center">
              <Card className="inline-flex items-center space-x-4 p-4 shadow-lg border-primary">
                <span className="font-medium">{selectedMemberIds.length} members selected</span>
                <Button onClick={assignPtPlan}>
                  Assign PT Plan
                </Button>
                <Button variant="ghost" onClick={() => setSelectedMemberIds([])}>
                  Cancel
                </Button>
              </Card>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="all" className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">All Members</h2>
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search members..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          
          {filteredMembers.length > 0 ? (
            <Card>
              <CardHeader>
                <CardTitle>Available Members</CardTitle>
                <CardDescription>Select members to assign personal training plans</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredMembers.map(member => {
                    const isAssigned = member.trainerId === trainerId;
                    const hasPtPlan = ptSubscribers.some(sub => sub.memberId === member.id);
                    
                    return (
                      <div 
                        key={member.id} 
                        className={`p-3 border rounded-md flex items-center justify-between ${
                          isAssigned ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20" : ""
                        } ${hasPtPlan ? "border-green-500" : ""}`}
                      >
                        <div className="flex items-center space-x-3">
                          <Checkbox 
                            id={`member-${member.id}`}
                            checked={selectedMemberIds.includes(member.id)}
                            onCheckedChange={() => toggleMemberSelection(member.id)}
                          />
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={member.avatar} alt={member.name} />
                            <AvatarFallback>{getInitials(member.name)}</AvatarFallback>
                          </Avatar>
                          <Label htmlFor={`member-${member.id}`} className="font-medium cursor-pointer">
                            {member.name}
                          </Label>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          {isAssigned && (
                            <Badge className="bg-blue-500">
                              Assigned to You
                            </Badge>
                          )}
                          
                          {hasPtPlan && (
                            <Badge className="bg-green-500">
                              <Check className="h-3 w-3 mr-1" />
                              PT Subscriber
                            </Badge>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="p-6 text-center">
                <p className="text-muted-foreground">No members found matching "{searchQuery}"</p>
              </CardContent>
            </Card>
          )}
          
          {selectedMemberIds.length > 0 && (
            <div className="sticky bottom-4 flex justify-center">
              <Card className="inline-flex items-center space-x-4 p-4 shadow-lg border-primary">
                <span className="font-medium">{selectedMemberIds.length} members selected</span>
                <Button onClick={assignPtPlan}>
                  Assign PT Plan
                </Button>
                <Button variant="ghost" onClick={() => setSelectedMemberIds([])}>
                  Cancel
                </Button>
              </Card>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PTPlanManagement;
