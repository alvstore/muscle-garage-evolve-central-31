
import React, { useState, useEffect } from 'react';
import { Container } from '@/components/ui/container';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { PlusCircle, Loader2 } from 'lucide-react';
import { useAnnouncements } from '@/hooks/use-announcements';
import { AnnouncementsList } from '@/components/communication/AnnouncementsList';
import TrainerAnnouncementForm from '@/components/communication/TrainerAnnouncementForm';
import { toast } from 'sonner';

const TrainerAnnouncementPage: React.FC = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { announcements, isLoading, createAnnouncement, fetchAnnouncements } = useAnnouncements();

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const handleCreateAnnouncement = async (data: any) => {
    try {
      setIsSubmitting(true);
      await createAnnouncement({
        title: data.title,
        content: data.content,
        priority: data.priority,
        targetRoles: data.targetRoles || ['member'],
        channels: data.channels || ['app'],
        expiresAt: data.expiresAt,
        authorName: 'Trainer', // This would come from the logged-in trainer
      });
      
      setIsDialogOpen(false);
      toast.success('Announcement created successfully!');

      // Fetch the updated list of announcements
      fetchAnnouncements();
    } catch (error) {
      console.error('Error creating announcement:', error);
      toast.error('Failed to create announcement. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Container>
      <div className="py-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold">Trainer Announcements</h1>
            <p className="text-muted-foreground">
              Create and manage announcements for your members
            </p>
          </div>

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <PlusCircle className="mr-2 h-4 w-4" /> Create Announcement
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <TrainerAnnouncementForm 
                onSubmit={handleCreateAnnouncement}
              />
            </DialogContent>
          </Dialog>
        </div>

        {isLoading ? (
          <Card>
            <CardContent className="flex justify-center items-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </CardContent>
          </Card>
        ) : (
          <AnnouncementsList />
        )}
      </div>
    </Container>
  );
};

export default TrainerAnnouncementPage;
