
// Only update the import for Member
import React, { useState } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle, 
  CardFooter 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from 'sonner';
import { SendIcon, Users, MessageSquare, Bell, Check, Loader2 } from 'lucide-react';
import { Member } from '@/types';

interface TrainerAnnouncementFormProps {
  onSubmit: (data: any) => Promise<void>;
  members?: Member[];
}

export const TrainerAnnouncementForm: React.FC<TrainerAnnouncementFormProps> = ({ 
  onSubmit,
  members = [] 
}) => {
  const { user } = useAuth();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
  const [channels, setChannels] = useState<string[]>(['in-app']);
  const [isSelectMembersOpen, setIsSelectMembersOpen] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  
  const availableChannels = [
    { id: 'in-app', label: 'In-App Notification' },
    { id: 'email', label: 'Email' },
    { id: 'sms', label: 'SMS' },
    { id: 'whatsapp', label: 'WhatsApp' }
  ];
  
  const handleToggleMember = (memberId: string) => {
    if (selectedMembers.includes(memberId)) {
      setSelectedMembers(selectedMembers.filter(id => id !== memberId));
    } else {
      setSelectedMembers([...selectedMembers, memberId]);
    }
  };
  
  const handleToggleChannel = (channelId: string) => {
    if (channels.includes(channelId)) {
      setChannels(channels.filter(id => id !== channelId));
    } else {
      setChannels([...channels, channelId]);
    }
  };
  
  const handleSelectAllMembers = () => {
    const allMemberIds = members.map(member => member.id);
    setSelectedMembers(allMemberIds);
  };
  
  const handleClearMemberSelection = () => {
    setSelectedMembers([]);
  };
  
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };
  
  const handleSendAnnouncement = () => {
    if (!title.trim()) {
      toast.error("Please add a title for your announcement");
      return;
    }
    
    if (!content.trim()) {
      toast.error("Please add content for your announcement");
      return;
    }
    
    if (selectedMembers.length === 0) {
      toast.error("Please select at least one member");
      return;
    }
    
    if (channels.length === 0) {
      toast.error("Please select at least one communication channel");
      return;
    }
    
    setIsSending(true);
    
    onSubmit({
      title,
      content,
      priority,
      selectedMembers,
      channels
    }).finally(() => {
      setIsSending(false);
      // Reset form on success is handled by the parent component
    });
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>New Trainer Announcement</CardTitle>
        <CardDescription>Send targeted announcements to your members</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="announcement-title">Title *</Label>
          <Input 
            id="announcement-title" 
            placeholder="Enter announcement title" 
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="announcement-content">Message *</Label>
          <Textarea 
            id="announcement-content" 
            placeholder="Enter your announcement message" 
            rows={5}
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
        </div>
        
        <div className="space-y-2">
          <Label>Priority</Label>
          <RadioGroup 
            value={priority} 
            onValueChange={(value) => setPriority(value as 'low' | 'medium' | 'high')}
            className="flex space-x-4"
          >
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
          <div className="flex justify-between">
            <Label>Recipients *</Label>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => setIsSelectMembersOpen(true)}
            >
              <Users className="h-4 w-4 mr-1" />
              Select Members
            </Button>
          </div>
          
          {selectedMembers.length > 0 ? (
            <div className="border rounded-md p-3">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-muted-foreground">
                  {selectedMembers.length} {selectedMembers.length === 1 ? 'member' : 'members'} selected
                </span>
                <Button variant="ghost" size="sm" onClick={handleClearMemberSelection}>
                  Clear
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {selectedMembers.map((memberId) => {
                  const member = members.find(m => m.id === memberId);
                  if (!member) return null;
                  
                  return (
                    <div 
                      key={memberId}
                      className="flex items-center bg-muted px-2 py-1 rounded-full text-xs"
                    >
                      <span>{member.name}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="text-center border rounded-md p-6">
              <Users className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
              <p className="text-muted-foreground">No members selected</p>
              <p className="text-xs text-muted-foreground mb-2">
                Click "Select Members" to choose recipients
              </p>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setIsSelectMembersOpen(true)}
              >
                Select Members
              </Button>
            </div>
          )}
        </div>
        
        <div className="space-y-2">
          <Label>Communication Channels *</Label>
          <div className="grid grid-cols-2 gap-2">
            {availableChannels.map((channel) => (
              <div key={channel.id} className="flex items-center space-x-2">
                <Checkbox 
                  id={`channel-${channel.id}`} 
                  checked={channels.includes(channel.id)}
                  onCheckedChange={() => handleToggleChannel(channel.id)}
                />
                <Label htmlFor={`channel-${channel.id}`}>{channel.label}</Label>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={() => setShowPreview(true)}>
          <MessageSquare className="h-4 w-4 mr-1" />
          Preview
        </Button>
        <Button 
          onClick={handleSendAnnouncement}
          disabled={isSending || !title || !content || selectedMembers.length === 0 || channels.length === 0}
        >
          {isSending ? (
            <>
              <Loader2 className="h-4 w-4 mr-1 animate-spin" />
              Sending...
            </>
          ) : (
            <>
              <SendIcon className="h-4 w-4 mr-1" />
              Send Announcement
            </>
          )}
        </Button>
      </CardFooter>
      
      {/* Member Selection Dialog */}
      <Dialog open={isSelectMembersOpen} onOpenChange={setIsSelectMembersOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Select Members</DialogTitle>
            <DialogDescription>
              Choose which members will receive this announcement
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            <div className="flex justify-between mb-4">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleSelectAllMembers}
              >
                Select All
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleClearMemberSelection}
              >
                Clear Selection
              </Button>
            </div>
            
            <ScrollArea className="h-[300px] pr-4">
              <div className="space-y-2">
                {members.length > 0 ? (
                  members.map(member => (
                    <div 
                      key={member.id} 
                      className={`flex items-center space-x-3 p-2 rounded-md cursor-pointer hover:bg-muted/50 ${
                        selectedMembers.includes(member.id) ? 'bg-muted' : ''
                      }`}
                      onClick={() => handleToggleMember(member.id)}
                    >
                      <div className="flex items-center space-x-3 flex-1">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={member.avatar} alt={member.name} />
                          <AvatarFallback>{getInitials(member.name)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium leading-none mb-1">{member.name}</p>
                          <p className="text-xs text-muted-foreground">
                            Goal: {member.goal || 'Not specified'}
                          </p>
                        </div>
                      </div>
                      <div className="flex-shrink-0">
                        <Checkbox 
                          checked={selectedMembers.includes(member.id)} 
                          onCheckedChange={() => handleToggleMember(member.id)}
                          onClick={(e) => e.stopPropagation()}
                        />
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-12">
                    <Users className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                    <p className="text-muted-foreground">No members found</p>
                  </div>
                )}
              </div>
            </ScrollArea>
          </div>
          
          <DialogFooter className="flex justify-between">
            <div className="text-sm text-muted-foreground">
              {selectedMembers.length} {selectedMembers.length === 1 ? 'member' : 'members'} selected
            </div>
            <div className="space-x-2">
              <Button variant="outline" onClick={() => setIsSelectMembersOpen(false)}>
                Cancel
              </Button>
              <Button onClick={() => setIsSelectMembersOpen(false)}>
                <Check className="h-4 w-4 mr-1" />
                Confirm Selection
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Preview Dialog */}
      <Dialog open={showPreview} onOpenChange={setShowPreview}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Announcement Preview</DialogTitle>
            <DialogDescription>
              This is how your announcement will appear to members
            </DialogDescription>
          </DialogHeader>
          
          <div className="p-4 border rounded-md mt-2">
            <div className="flex items-start space-x-3">
              <div className="bg-primary/10 p-2 rounded-full">
                <Bell className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-medium">{title || 'Announcement Title'}</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  {content || 'Announcement content will appear here...'}
                </p>
                <div className="flex space-x-2 mt-3">
                  <div className={`text-xs px-2 py-1 rounded-full ${
                    priority === 'high' 
                      ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300' 
                      : priority === 'medium'
                      ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
                      : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                  }`}>
                    {priority.charAt(0).toUpperCase() + priority.slice(1)} Priority
                  </div>
                  <div className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full dark:bg-blue-900 dark:text-blue-300">
                    From: {user?.name || 'Trainer'}
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="space-y-2 mt-2">
            <h4 className="text-sm font-medium">Will be sent via:</h4>
            <div className="flex flex-wrap gap-2">
              {channels.map(channelId => {
                const channel = availableChannels.find(c => c.id === channelId);
                return (
                  <div 
                    key={channelId}
                    className="text-xs bg-muted px-2 py-1 rounded-full"
                  >
                    {channel?.label}
                  </div>
                );
              })}
            </div>
          </div>
          
          <div className="space-y-2">
            <h4 className="text-sm font-medium">Recipients:</h4>
            <div className="text-sm">
              {selectedMembers.length} {selectedMembers.length === 1 ? 'member' : 'members'} selected
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowPreview(false)}>
              Close Preview
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default TrainerAnnouncementForm;
