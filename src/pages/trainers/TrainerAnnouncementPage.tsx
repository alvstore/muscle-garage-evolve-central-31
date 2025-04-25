
import React, { useState, useEffect } from 'react';
import { Container } from '@/components/ui/container';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlusIcon } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import { useAnnouncements } from '@/hooks/use-announcements';
import TrainerAnnouncementForm from '@/components/communication/TrainerAnnouncementForm';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

const TrainerAnnouncementPage = () => {
  const [activeTab, setActiveTab] = useState('published');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const { user } = useAuth();
  const { announcements, createAnnouncement, isLoading, fetchAnnouncements } = useAnnouncements();
  
  useEffect(() => {
    fetchAnnouncements();
  }, [fetchAnnouncements]);
  
  const trainerAnnouncements = [
    {
      id: '1',
      title: 'New Training Protocol',
      content: 'Starting next week, we will be implementing a new training protocol for cardio sessions.',
      authorName: user?.name || 'Trainer',
      createdAt: new Date().toISOString(),
      priority: 'high' as const,
      channels: ['app', 'email'],
      targetRoles: ['member'],
    },
    {
      id: '2',
      title: 'Schedule Changes',
      content: 'Please note that the weekend schedule will be modified during the upcoming holiday season.',
      authorName: user?.name || 'Trainer',
      createdAt: new Date().toISOString(),
      priority: 'medium' as const,
      channels: ['app'],
      targetRoles: ['member'],
    }
  ];
  
  const handleCreateAnnouncement = async (formData) => {
    const success = await createAnnouncement({
      ...formData,
      authorName: user?.name,
      authorId: user?.id,
      targetRoles: ['member'],
      priority: formData.priority || 'medium',
    });
    
    if (success) {
      setShowCreateForm(false);
      fetchAnnouncements();
    }
  };
  
  const myTrainerAnnouncements = announcements?.filter(a => a.authorId === user?.id) || [];
  
  const publishedAnnouncements = myTrainerAnnouncements.filter(a => 
    new Date(a.expiresAt || '2099-12-31') > new Date()
  );
  
  const expiredAnnouncements = myTrainerAnnouncements.filter(a => 
    new Date(a.expiresAt || '2099-12-31') <= new Date()
  );
  
  return (
    <Container>
      <div className="py-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold">Trainer Announcements</h1>
            <p className="text-muted-foreground">Create and manage announcements for your members</p>
          </div>
          
          <Button onClick={() => setShowCreateForm(true)}>
            <PlusIcon className="w-4 h-4 mr-2" />
            New Announcement
          </Button>
        </div>
        
        <Tabs defaultValue={activeTab} value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList>
            <TabsTrigger value="published">Active</TabsTrigger>
            <TabsTrigger value="expired">Expired</TabsTrigger>
          </TabsList>
          
          <TabsContent value="published" className="space-y-4">
            {isLoading ? (
              <div className="text-center py-10">Loading announcements...</div>
            ) : publishedAnnouncements.length > 0 ? (
              publishedAnnouncements.map(announcement => (
                <Card key={announcement.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <CardTitle>{announcement.title}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <p>{announcement.content}</p>
                      <div className="flex justify-between text-sm text-muted-foreground">
                        <span>
                          {new Date(announcement.createdAt).toLocaleDateString()}
                        </span>
                        {announcement.expiresAt && (
                          <span>
                            Expires: {new Date(announcement.expiresAt).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Card>
                <CardContent className="text-center py-8">
                  <p className="text-muted-foreground">No active announcements</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
          
          <TabsContent value="expired" className="space-y-4">
            {isLoading ? (
              <div className="text-center py-10">Loading announcements...</div>
            ) : expiredAnnouncements.length > 0 ? (
              expiredAnnouncements.map(announcement => (
                <Card key={announcement.id}>
                  <CardHeader>
                    <CardTitle>{announcement.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <p>{announcement.content}</p>
                      <div className="flex justify-between text-sm text-muted-foreground">
                        <span>
                          Created: {new Date(announcement.createdAt).toLocaleDateString()}
                        </span>
                        {announcement.expiresAt && (
                          <span>
                            Expired: {new Date(announcement.expiresAt).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Card>
                <CardContent className="text-center py-8">
                  <p className="text-muted-foreground">No expired announcements</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
      
      <Dialog open={showCreateForm} onOpenChange={setShowCreateForm}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Create New Announcement</DialogTitle>
          </DialogHeader>
          <TrainerAnnouncementForm onSubmit={handleCreateAnnouncement} />
        </DialogContent>
      </Dialog>
    </Container>
  );
};

export default TrainerAnnouncementPage;
