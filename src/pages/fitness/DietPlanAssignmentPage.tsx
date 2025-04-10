
import React, { useState } from 'react';
import { Container } from '@/components/ui/container';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/hooks/use-auth';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Apple, Banana, Beef, Coffee, Egg, Fish, Utensils, Salad, Search, Plus, Edit, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { Member } from '@/types';

const DietPlanAssignmentPage = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('templates');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMember, setSelectedMember] = useState<string | null>(null);
  
  // Mock members data
  const mockMembers: Member[] = [
    {
      id: 'member-1',
      name: 'John Doe',
      email: 'john.doe@example.com',
      role: 'member',
      membershipStatus: 'active',
      avatar: '',
      goal: 'Weight loss'
    },
    {
      id: 'member-2',
      name: 'Jane Smith',
      email: 'jane.smith@example.com',
      role: 'member',
      membershipStatus: 'active',
      avatar: '',
      goal: 'Muscle gain'
    },
    {
      id: 'member-3',
      name: 'Mark Johnson',
      email: 'mark.johnson@example.com',
      role: 'member',
      membershipStatus: 'active',
      avatar: '',
      goal: 'General fitness'
    }
  ];
  
  // Mock diet plan templates
  const dietTemplates = [
    {
      id: 'diet-1',
      name: 'High Protein Weight Loss',
      category: 'Weight Loss',
      description: 'A high protein diet designed for weight loss while preserving muscle mass.',
      mealCount: 5,
      totalCalories: 1800,
      macros: { protein: 40, carbs: 30, fats: 30 }
    },
    {
      id: 'diet-2',
      name: 'Muscle Building Plan',
      category: 'Muscle Gain',
      description: 'Balanced macronutrient plan with surplus calories for muscle growth.',
      mealCount: 6,
      totalCalories: 3000,
      macros: { protein: 30, carbs: 50, fats: 20 }
    },
    {
      id: 'diet-3',
      name: 'Balanced Maintenance',
      category: 'Maintenance',
      description: 'Well-balanced diet for maintaining current weight and overall health.',
      mealCount: 4,
      totalCalories: 2200,
      macros: { protein: 25, carbs: 45, fats: 30 }
    },
    {
      id: 'diet-4',
      name: 'Ketogenic Diet',
      category: 'Specialized',
      description: 'Very low carb, high fat diet for ketosis and fat loss.',
      mealCount: 3,
      totalCalories: 2000,
      macros: { protein: 25, carbs: 5, fats: 70 }
    }
  ];
  
  // Mock member-diet assignments
  const [assignments, setAssignments] = useState([
    { memberId: 'member-1', dietId: 'diet-1', assignedOn: '2023-11-15', assignedBy: 'Trainer Smith' }
  ]);
  
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };
  
  const handleAssignDiet = (memberId: string, dietId: string) => {
    // Check if already assigned
    const existingAssignment = assignments.find(a => a.memberId === memberId);
    
    if (existingAssignment) {
      // Update existing assignment
      setAssignments(assignments.map(a => 
        a.memberId === memberId ? { 
          ...a, 
          dietId, 
          assignedOn: new Date().toISOString().split('T')[0],
          assignedBy: user?.name || 'Current User' 
        } : a
      ));
      toast.success('Diet plan updated for member');
    } else {
      // Create new assignment
      setAssignments([
        ...assignments,
        {
          memberId,
          dietId,
          assignedOn: new Date().toISOString().split('T')[0],
          assignedBy: user?.name || 'Current User'
        }
      ]);
      toast.success('Diet plan assigned to member');
    }
  };
  
  const handleRemoveAssignment = (memberId: string) => {
    setAssignments(assignments.filter(a => a.memberId !== memberId));
    toast.success('Diet plan removed from member');
  };
  
  const filteredMembers = mockMembers.filter(member => 
    member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.email.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const getMemberById = (id: string) => mockMembers.find(m => m.id === id);
  const getDietById = (id: string) => dietTemplates.find(d => d.id === id);
  
  const renderDietIcon = (category: string) => {
    switch(category.toLowerCase()) {
      case 'weight loss': return <Salad className="h-5 w-5" />;
      case 'muscle gain': return <Beef className="h-5 w-5" />;
      case 'maintenance': return <Apple className="h-5 w-5" />;
      case 'specialized': return <Fish className="h-5 w-5" />;
      default: return <Utensils className="h-5 w-5" />;
    }
  };

  return (
    <Container>
      <div className="py-6">
        <h1 className="text-2xl font-bold mb-6">Diet Plan Assignment</h1>
        
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="templates">Diet Templates</TabsTrigger>
            <TabsTrigger value="assign">Assign Plans</TabsTrigger>
            <TabsTrigger value="current">Current Assignments</TabsTrigger>
          </TabsList>
          
          {/* Diet Templates Tab */}
          <TabsContent value="templates" className="mt-6 space-y-6">
            <div className="flex justify-between items-center">
              <div className="space-y-1">
                <h2 className="text-xl font-semibold">Diet Plan Templates</h2>
                <p className="text-sm text-muted-foreground">Create and manage diet plan templates to assign to members</p>
              </div>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Create Template
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {dietTemplates.map(template => (
                <Card key={template.id}>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center">
                        {renderDietIcon(template.category)}
                        <CardTitle className="text-lg ml-2">{template.name}</CardTitle>
                      </div>
                      <div className="flex space-x-1">
                        <Button variant="ghost" size="icon">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <CardDescription>{template.category}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm mb-4">{template.description}</p>
                    
                    <div className="grid grid-cols-3 gap-2 mb-4">
                      <div className="bg-muted p-2 rounded-md text-center">
                        <p className="text-xs text-muted-foreground">Meals</p>
                        <p className="font-medium">{template.mealCount}/day</p>
                      </div>
                      <div className="bg-muted p-2 rounded-md text-center">
                        <p className="text-xs text-muted-foreground">Calories</p>
                        <p className="font-medium">{template.totalCalories}</p>
                      </div>
                      <div className="bg-muted p-2 rounded-md text-center">
                        <p className="text-xs text-muted-foreground">Type</p>
                        <p className="font-medium">General</p>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Protein</span>
                        <span>{template.macros.protein}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${template.macros.protein}%` }}></div>
                      </div>
                      
                      <div className="flex justify-between text-sm">
                        <span>Carbs</span>
                        <span>{template.macros.carbs}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-green-600 h-2 rounded-full" style={{ width: `${template.macros.carbs}%` }}></div>
                      </div>
                      
                      <div className="flex justify-between text-sm">
                        <span>Fats</span>
                        <span>{template.macros.fats}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-yellow-600 h-2 rounded-full" style={{ width: `${template.macros.fats}%` }}></div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
          
          {/* Assign Plans Tab */}
          <TabsContent value="assign" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Assign Diet Plans to Members</CardTitle>
                <CardDescription>
                  Select members and assign appropriate diet plans based on their goals
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search members..."
                    className="pl-8"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                
                <div className="border rounded-md">
                  <div className="bg-muted px-4 py-2 border-b">
                    <h3 className="font-medium">Members ({filteredMembers.length})</h3>
                  </div>
                  <div className="divide-y">
                    {filteredMembers.length > 0 ? (
                      filteredMembers.map(member => {
                        const assignment = assignments.find(a => a.memberId === member.id);
                        const assignedDiet = assignment ? getDietById(assignment.dietId) : null;
                        
                        return (
                          <div 
                            key={member.id} 
                            className={`p-4 flex items-center justify-between hover:bg-muted/50 ${selectedMember === member.id ? 'bg-muted/50' : ''}`}
                            onClick={() => setSelectedMember(member.id)}
                          >
                            <div className="flex items-center space-x-3">
                              <Avatar>
                                <AvatarImage src={member.avatar} />
                                <AvatarFallback>{getInitials(member.name)}</AvatarFallback>
                              </Avatar>
                              <div>
                                <h4 className="font-medium">{member.name}</h4>
                                <p className="text-sm text-muted-foreground">{member.email}</p>
                                <p className="text-xs text-muted-foreground">Goal: {member.goal}</p>
                              </div>
                            </div>
                            <div>
                              {assignedDiet && (
                                <div className="text-sm flex items-center">
                                  <span className="mr-2">Current: {assignedDiet.name}</span>
                                  <Button 
                                    variant="ghost" 
                                    size="icon"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleRemoveAssignment(member.id);
                                    }}
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <div className="p-8 text-center text-muted-foreground">
                        No members found matching your search criteria
                      </div>
                    )}
                  </div>
                </div>
                
                {selectedMember && (
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">Assign Diet Plan</CardTitle>
                      <CardDescription>
                        {getMemberById(selectedMember)?.name}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="diet-plan">Select Diet Plan</Label>
                          <Select 
                            onValueChange={(value) => handleAssignDiet(selectedMember, value)}
                            defaultValue={assignments.find(a => a.memberId === selectedMember)?.dietId}
                          >
                            <SelectTrigger id="diet-plan">
                              <SelectValue placeholder="Choose a diet plan" />
                            </SelectTrigger>
                            <SelectContent>
                              {dietTemplates.map(diet => (
                                <SelectItem key={diet.id} value={diet.id}>
                                  {diet.name} ({diet.category})
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div className="flex justify-between">
                          <Button 
                            variant="outline"
                            onClick={() => setSelectedMember(null)}
                          >
                            Cancel
                          </Button>
                          <Button
                            onClick={() => {
                              toast.success("Diet plan assignment saved");
                              setSelectedMember(null);
                            }}
                          >
                            Save Assignment
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Current Assignments Tab */}
          <TabsContent value="current" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Current Diet Plan Assignments</CardTitle>
                <CardDescription>
                  View all member diet plan assignments and their details
                </CardDescription>
              </CardHeader>
              <CardContent>
                {assignments.length > 0 ? (
                  <div className="border rounded-md overflow-hidden">
                    <table className="w-full">
                      <thead className="bg-muted">
                        <tr>
                          <th className="text-left py-3 px-4">Member</th>
                          <th className="text-left py-3 px-4">Assigned Plan</th>
                          <th className="text-left py-3 px-4">Assigned On</th>
                          <th className="text-left py-3 px-4">Assigned By</th>
                          <th className="text-left py-3 px-4">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y">
                        {assignments.map(assignment => {
                          const member = getMemberById(assignment.memberId);
                          const diet = getDietById(assignment.dietId);
                          
                          return (
                            <tr key={assignment.memberId}>
                              <td className="py-3 px-4">
                                <div className="flex items-center">
                                  <Avatar className="h-8 w-8 mr-2">
                                    <AvatarFallback>{member ? getInitials(member.name) : 'XX'}</AvatarFallback>
                                  </Avatar>
                                  <div>
                                    {member?.name || 'Unknown Member'}
                                    <p className="text-xs text-muted-foreground">
                                      Goal: {member?.goal || 'Not specified'}
                                    </p>
                                  </div>
                                </div>
                              </td>
                              <td className="py-3 px-4">
                                <div className="flex items-center">
                                  {diet ? (
                                    <>
                                      {renderDietIcon(diet.category)}
                                      <span className="ml-2">{diet.name}</span>
                                    </>
                                  ) : (
                                    'Unknown Plan'
                                  )}
                                </div>
                              </td>
                              <td className="py-3 px-4">{assignment.assignedOn}</td>
                              <td className="py-3 px-4">{assignment.assignedBy}</td>
                              <td className="py-3 px-4">
                                <div className="flex space-x-2">
                                  <Button variant="ghost" size="sm">
                                    <Edit className="h-4 w-4 mr-1" />
                                    Edit
                                  </Button>
                                  <Button 
                                    variant="ghost" 
                                    size="sm"
                                    onClick={() => handleRemoveAssignment(assignment.memberId)}
                                  >
                                    <Trash2 className="h-4 w-4 mr-1" />
                                    Remove
                                  </Button>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Utensils className="h-12 w-12 mx-auto text-muted-foreground" />
                    <h3 className="mt-4 text-lg font-medium">No Diet Plans Assigned</h3>
                    <p className="mt-2 text-sm text-muted-foreground max-w-sm mx-auto">
                      No members currently have diet plans assigned to them. You can assign diet plans from the "Assign Plans" tab.
                    </p>
                    <Button 
                      className="mt-4"
                      onClick={() => setActiveTab('assign')}
                    >
                      Assign Plans
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Container>
  );
};

export default DietPlanAssignmentPage;
