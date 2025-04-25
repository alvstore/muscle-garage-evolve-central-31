
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useBranch } from '@/hooks/use-branch';
import { supabase } from '@/integrations/supabase/client';
import { Announcement } from '@/types/notification';

export interface CreateAnnouncementFormProps {
  onSuccess?: () => void;
  editAnnouncement?: Announcement | null;
}

const CreateAnnouncementForm: React.FC<CreateAnnouncementFormProps> = ({ 
  onSuccess,
  editAnnouncement 
}) => {
  const { currentBranch } = useBranch();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [title, setTitle] = useState(editAnnouncement?.title || '');
  const [content, setContent] = useState(editAnnouncement?.content || '');
  const [priority, setPriority] = useState<string>(editAnnouncement?.priority || 'medium');
  const [selectedChannels, setSelectedChannels] = useState<string[]>(editAnnouncement?.channels || ['app']);
  const [targetRoles, setTargetRoles] = useState<string[]>(editAnnouncement?.targetRoles || ['member', 'trainer']);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title || !content) {
      toast.error('Please fill in all required fields');
      return;
    }

    setIsSubmitting(true);

    try {
      const userId = (await supabase.auth.getUser()).data.user?.id || 'unknown';
      const userName = 'Admin'; // In a real app, you would fetch the user's name
      
      const announcementData = {
        title,
        content,
        author_id: userId,
        author_name: userName,
        priority,
        channels: selectedChannels,
        target_roles: targetRoles,
        branch_id: currentBranch?.id || '',
        channel: selectedChannels.join(',')
      };
      
      if (editAnnouncement) {
        await supabase
          .from('announcements')
          .update(announcementData)
          .eq('id', editAnnouncement.id);
        
        toast.success('Announcement updated successfully');
      } else {
        await supabase
          .from('announcements')
          .insert([announcementData]);
          
        toast.success('Announcement created successfully');
      }
      
      // Reset form
      setTitle('');
      setContent('');
      setPriority('medium');
      setSelectedChannels(['app']);
      
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error('Error creating announcement:', error);
      toast.error('Failed to create announcement');
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleChannel = (channel: string) => {
    setSelectedChannels(prev =>
      prev.includes(channel)
        ? prev.filter(c => c !== channel)
        : [...prev, channel]
    );
  };

  const toggleRole = (role: string) => {
    setTargetRoles(prev =>
      prev.includes(role)
        ? prev.filter(r => r !== role)
        : [...prev, role]
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{editAnnouncement ? 'Edit Announcement' : 'Create New Announcement'}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              placeholder="Announcement title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="content">Content</Label>
            <Textarea
              id="content"
              placeholder="Announcement content..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
              rows={5}
            />
          </div>
          
          <div className="space-y-2">
            <Label>Priority</Label>
            <RadioGroup value={priority} onValueChange={setPriority} className="flex space-x-4">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="low" id="low" />
                <Label htmlFor="low">Low</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="medium" id="medium" />
                <Label htmlFor="medium">Medium</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="high" id="high" />
                <Label htmlFor="high">High</Label>
              </div>
            </RadioGroup>
          </div>
          
          <div className="space-y-2">
            <Label>Communication Channels</Label>
            <div className="grid grid-cols-2 gap-2">
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="app" 
                  checked={selectedChannels.includes('app')}
                  onCheckedChange={() => toggleChannel('app')}
                />
                <Label htmlFor="app">In-App</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="email" 
                  checked={selectedChannels.includes('email')}
                  onCheckedChange={() => toggleChannel('email')}
                />
                <Label htmlFor="email">Email</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="sms" 
                  checked={selectedChannels.includes('sms')}
                  onCheckedChange={() => toggleChannel('sms')}
                />
                <Label htmlFor="sms">SMS</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="whatsapp" 
                  checked={selectedChannels.includes('whatsapp')}
                  onCheckedChange={() => toggleChannel('whatsapp')}
                />
                <Label htmlFor="whatsapp">WhatsApp</Label>
              </div>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label>Target Audience</Label>
            <div className="grid grid-cols-2 gap-2">
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="member" 
                  checked={targetRoles.includes('member')}
                  onCheckedChange={() => toggleRole('member')}
                />
                <Label htmlFor="member">Members</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="trainer" 
                  checked={targetRoles.includes('trainer')}
                  onCheckedChange={() => toggleRole('trainer')}
                />
                <Label htmlFor="trainer">Trainers</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="staff" 
                  checked={targetRoles.includes('staff')}
                  onCheckedChange={() => toggleRole('staff')}
                />
                <Label htmlFor="staff">Staff</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="manager" 
                  checked={targetRoles.includes('manager')}
                  onCheckedChange={() => toggleRole('manager')}
                />
                <Label htmlFor="manager">Managers</Label>
              </div>
            </div>
          </div>
          
          <Button 
            type="submit" 
            disabled={isSubmitting || !title || !content}
            className="w-full"
          >
            {isSubmitting 
              ? 'Saving...' 
              : editAnnouncement 
                ? 'Update Announcement' 
                : 'Create Announcement'
            }
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default CreateAnnouncementForm;
