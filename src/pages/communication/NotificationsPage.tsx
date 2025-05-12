import React, { useState } from 'react';
import { Container } from '@/components/ui/container';
import NotificationsPanel from '@/components/notifications/NotificationsPanel';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/hooks/use-auth';
import { Bell, Users, User, Briefcase, Dumbbell } from 'lucide-react';

const NotificationsPage = () => {
  const { user } = useAuth();
  const [activeCategory, setActiveCategory] = useState<string>('all');
  
  // Define notification categories
  const categories = [
    { id: 'all', name: 'All', icon: Bell, description: 'All notifications across the system' },
    { id: 'gym', name: 'Gym', icon: Dumbbell, description: 'Gym-wide announcements and updates' },
    { id: 'member', name: 'Member', icon: User, description: 'Member-specific notifications' },
    { id: 'staff', name: 'Staff', icon: Briefcase, description: 'Staff-related communications' },
    { id: 'trainer', name: 'Trainer', icon: Users, description: 'Trainer-specific notifications' },
  ];
  
  return (
    <Container>
      <div className="py-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Notifications</h1>
        </div>
        
        <Card>
          <CardHeader className="pb-3">
            <CardTitle>Notification Center</CardTitle>
            <CardDescription>
              Stay updated with all activities and communications
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="all" value={activeCategory} onValueChange={setActiveCategory} className="w-full">
              <TabsList className="grid grid-cols-5 mb-6">
                {categories.map(category => (
                  <TabsTrigger 
                    key={category.id} 
                    value={category.id}
                    className="flex items-center gap-2"
                  >
                    <category.icon className="h-4 w-4" />
                    <span>{category.name}</span>
                  </TabsTrigger>
                ))}
              </TabsList>
              
              {categories.map(category => (
                <TabsContent key={category.id} value={category.id} className="mt-0">
                  <div className="mb-4">
                    <h3 className="text-lg font-medium flex items-center gap-2">
                      <category.icon className="h-5 w-5" />
                      {category.name} Notifications
                    </h3>
                    <p className="text-sm text-muted-foreground">{category.description}</p>
                  </div>
                  
                  <NotificationsPanel categoryFilter={category.id} />
                </TabsContent>
              ))}
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </Container>
  );
};

export default NotificationsPage;
