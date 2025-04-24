import React, { useState, useEffect } from 'react';
import { Container } from '@/components/ui/container';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { FileBarChart, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Member } from '@/types';

const FitnessProgressPage = () => {
  const navigate = useNavigate();
  const [members, setMembers] = useState<Member[]>([]);
  const [selectedMemberId, setSelectedMemberId] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call to fetch members
    setTimeout(() => {
      const fetchedMembers = [
        {
          id: "member1",
          name: "John Doe",
          email: "john@example.com",
          role: "member",
          membershipStatus: "active",
          status: "active" // Add the required status property
        },
        {
          id: "member2",
          name: "Jane Smith",
          email: "jane@example.com",
          role: "member",
          membershipStatus: "active",
          status: "active" // Add the required status property
        }
      ];
      
      setMembers(fetchedMembers);
      if (fetchedMembers.length > 0) {
        setSelectedMemberId(fetchedMembers[0].id);
      }
      setLoading(false);
    }, 1000);
  }, []);

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  return (
    <Container>
      <div className="py-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold">Fitness Progress</h1>
            <p className="text-muted-foreground">Track and analyze fitness progress of your members</p>
          </div>
        </div>

        <Card className="col-span-4">
          <CardHeader className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <CardTitle>Member Progress</CardTitle>
              <CardDescription>
                Track and analyze fitness progress of your members
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-4">
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-36 w-full" />
                <Skeleton className="h-36 w-full" />
              </div>
            ) : members.length > 0 ? (
              <>
                <div className="flex items-center space-x-4 mb-6">
                  <div>
                    <h3 className="text-lg font-medium">Select a Member</h3>
                    <Select value={selectedMemberId} onValueChange={setSelectedMemberId}>
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Select member" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          {members.map(member => (
                            <SelectItem key={member.id} value={member.id}>
                              {member.name}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="space-y-6">
                  <div>
                    <h4 className="text-sm font-medium mb-2">Body Metrics</h4>
                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Weight Loss</span>
                          <span>75%</span>
                        </div>
                      </div>
                  </div>
                </div>
              </div>
            </>
            ) : (
              <div className="text-center py-12">
                <Users className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
                <h3 className="text-lg font-medium mb-2">No Members Found</h3>
                <p className="text-muted-foreground mb-4">
                  You don't have any members assigned to you yet
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </Container>
  );
};

export default FitnessProgressPage;
