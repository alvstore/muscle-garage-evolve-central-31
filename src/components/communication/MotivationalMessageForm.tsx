import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { CalendarIcon } from "lucide-react"
import { format } from 'date-fns';
import { cn } from "@/lib/utils"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { MotivationalMessage } from '@/types/notification';

interface MotivationalMessageFormProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  onSubmit: (message: MotivationalMessage) => void;
  selectedMessage?: MotivationalMessage | null;
}

const MotivationalMessageForm: React.FC<MotivationalMessageFormProps> = ({ open, setOpen, onSubmit, selectedMessage }) => {
  const [isSaving, setIsSaving] = useState(false);
  const [date, setDate] = useState<Date | undefined>(selectedMessage ? new Date(selectedMessage.scheduledDate) : undefined);

  const [formData, setFormData] = useState<MotivationalMessage>({
    id: selectedMessage?.id || uuidv4(),
    content: selectedMessage?.content || '',
    scheduledDate: selectedMessage?.scheduledDate || new Date().toISOString(),
    targetAudience: selectedMessage?.targetAudience || ['member'],
    isActive: selectedMessage?.isActive ?? true,
    createdBy: 'admin',
    title: selectedMessage?.title || '',
    author: selectedMessage?.author || '',
    category: selectedMessage?.category || '',
    tags: selectedMessage?.tags || [],
  });

  useEffect(() => {
    if (selectedMessage) {
      setFormData({
        id: selectedMessage.id,
        content: selectedMessage.content,
        scheduledDate: selectedMessage.scheduledDate,
        targetAudience: selectedMessage.targetAudience,
        isActive: selectedMessage.isActive,
        createdBy: selectedMessage.createdBy,
        title: selectedMessage.title || '',
        author: selectedMessage.author || '',
        category: selectedMessage.category || '',
        tags: selectedMessage.tags || [],
      });
      setDate(new Date(selectedMessage.scheduledDate));
    } else {
      setFormData({
        id: uuidv4(),
        content: '',
        scheduledDate: new Date().toISOString(),
        targetAudience: ['member'],
        isActive: true,
        createdBy: 'admin',
        title: '',
        author: '',
        category: '',
        tags: [],
      });
      setDate(undefined);
    }
  }, [selectedMessage]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      onSubmit(formData);
      setOpen(false);
    } catch (error) {
      console.error("Failed to save motivational message:", error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[625px]">
        <DialogHeader>
          <DialogTitle>{selectedMessage ? "Edit Motivational Message" : "Create Motivational Message"}</DialogTitle>
          <DialogDescription>
            {selectedMessage
              ? "Update the message details."
              : "Craft a new message to inspire and motivate your members."}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="messageTitle">Title</Label>
              <Input
                id="messageTitle"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="messageAuthor">Author</Label>
              <Input
                id="messageAuthor"
                value={formData.author}
                onChange={(e) => setFormData({ ...formData, author: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="messageContent">Message Content</Label>
            <Textarea
              id="messageContent"
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              placeholder="Enter your motivational message here..."
              rows={3}
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="messageCategory">Category</Label>
              <Input
                id="messageCategory"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="messageTags">Tags (comma-separated)</Label>
              <Input
                id="messageTags"
                value={formData.tags?.join(', ') || ''}
                onChange={(e) => setFormData({ ...formData, tags: e.target.value.split(',').map(tag => tag.trim()) })}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Schedule Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !date && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={(date) => {
                      setDate(date);
                      setFormData({ ...formData, scheduledDate: date?.toISOString() || new Date().toISOString() })
                    }}
                    disabled={(date) =>
                      date < new Date()
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label htmlFor="messageActive">Active</Label>
              <Switch
                id="messageActive"
                checked={formData.isActive}
                onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
              />
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="ghost" onClick={() => setOpen(false)} disabled={isSaving}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving ? "Saving..." : "Save Message"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default MotivationalMessageForm;
