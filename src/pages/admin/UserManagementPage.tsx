
import React, { useState, useEffect } from 'react';
import { Container } from "@/components/ui/container";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { PlusCircle, Search, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/services/api/supabaseClient";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// Define user interface
interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
}

const UserManagementPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [users, setUsers] = useState<User[]>([]);
  const [activeTab, setActiveTab] = useState('all');
  const [isLoading, setIsLoading] = useState(true);

  // Fetch users from Supabase
  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      
      // Query profiles table
      const { data, error } = await supabase
        .from('profiles')
        .select('id, full_name, email, role, status');
      
      if (error) throw error;
      
      // Map the data to match our User interface
      const formattedUsers = data.map(user => ({
        id: user.id,
        name: user.full_name || 'Unnamed User',
        email: user.email || '',
        role: user.role || 'member',
        status: user.status || 'active'
      }));
      
      setUsers(formattedUsers);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Failed to load users');
    } finally {
      setIsLoading(false);
    }
  };

  // Initial data fetch
  useEffect(() => {
    fetchUsers();
  }, []);

  // Filter users based on search term and active tab
  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesTab = 
      activeTab === 'all' || 
      user.role === activeTab ||
      (activeTab === 'active' && user.status === 'active') ||
      (activeTab === 'inactive' && user.status === 'inactive');
    
    return matchesSearch && matchesTab;
  });

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  return (
    <Container>
      <div className="space-y-6 py-6">
        <h1 className="text-3xl font-bold">User Management</h1>
        
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Users</CardTitle>
              <Button>
                <PlusCircle className="mr-2 h-4 w-4" />
                Add User
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between">
                <div className="relative w-72">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search users..."
                    className="pl-8"
                    value={searchTerm}
                    onChange={handleSearch}
                  />
                </div>
                <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
                  <TabsList>
                    <TabsTrigger value="all">All Users</TabsTrigger>
                    <TabsTrigger value="admin">Admin</TabsTrigger>
                    <TabsTrigger value="staff">Staff</TabsTrigger>
                    <TabsTrigger value="trainer">Trainers</TabsTrigger>
                    <TabsTrigger value="member">Members</TabsTrigger>
                    <TabsTrigger value="active">Active</TabsTrigger>
                    <TabsTrigger value="inactive">Inactive</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>

              {isLoading ? (
                <div className="flex justify-center items-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  <span className="ml-2">Loading users...</span>
                </div>
              ) : (
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredUsers.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={5} className="text-center py-4">
                            No users found
                          </TableCell>
                        </TableRow>
                      ) : (
                        filteredUsers.map(user => (
                          <TableRow key={user.id}>
                            <TableCell className="font-medium">{user.name}</TableCell>
                            <TableCell>{user.email}</TableCell>
                            <TableCell>
                              <Badge variant={
                                user.role === 'admin' ? 'default' :
                                user.role === 'staff' ? 'secondary' :
                                user.role === 'trainer' ? 'outline' : 'secondary'
                              }>
                                {user.role}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <Badge variant={user.status === 'active' ? 'success' : 'destructive'}>
                                {user.status}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right">
                              <Button variant="ghost" size="sm">Edit</Button>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </Container>
  );
};

export default UserManagementPage;
