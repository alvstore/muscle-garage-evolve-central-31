
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { MotivationalMessage, MotivationalCategory } from '@/types/communication/notification';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Trash, Edit, Check, X } from 'lucide-react';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';

interface MotivationalMessagesListProps {
  messages: MotivationalMessage[];
  onAddMessage: (message: Partial<MotivationalMessage>) => Promise<void>;
  onUpdateMessage: (id: string, message: Partial<MotivationalMessage>) => Promise<void>;
  onDeleteMessage: (id: string) => Promise<void>;
}

export default function MotivationalMessagesList({
  messages,
  onAddMessage,
  onUpdateMessage,
  onDeleteMessage
}: MotivationalMessagesListProps) {
  const [newMessage, setNewMessage] = useState<Partial<MotivationalMessage> & { category: MotivationalCategory }>({
    title: '',
    content: '',
    category: 'general',
    tags: []
  });
  const [editingMessage, setEditingMessage] = useState<string | null>(null);
  const [editFormData, setEditFormData] = useState<Partial<MotivationalMessage> & { category: MotivationalCategory }>({ category: 'general' });
  const [tagInput, setTagInput] = useState('');
  const [filter, setFilter] = useState<MotivationalCategory | 'all'>('all');

  const handleAddTag = () => {
    if (tagInput.trim()) {
      const currentTags = newMessage.tags || [];
      setNewMessage({
        ...newMessage,
        tags: [...currentTags, tagInput.trim()]
      });
      setTagInput('');
    }
  };

  const handleEditTag = (tag: string) => {
    if (tagInput.trim() && editFormData.tags) {
      setEditFormData({
        ...editFormData,
        tags: [...editFormData.tags, tagInput.trim()]
      });
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    if (newMessage.tags) {
      setNewMessage({
        ...newMessage,
        tags: newMessage.tags.filter(tag => tag !== tagToRemove)
      });
    }
  };

  const handleRemoveEditTag = (tagToRemove: string) => {
    if (editFormData.tags) {
      setEditFormData({
        ...editFormData,
        tags: editFormData.tags.filter(tag => tag !== tagToRemove)
      });
    }
  };

  const handleSaveMessage = async () => {
    try {
      await onAddMessage(newMessage);
      setNewMessage({ title: '', content: '', category: 'general', tags: [] });
      toast.success('Message added successfully!');
    } catch (error) {
      toast.error('Failed to add message');
    }
  };

  const handleStartEdit = (message: MotivationalMessage) => {
    setEditingMessage(message.id);
    setEditFormData({
      ...message,
      category: (message.category || 'general') as MotivationalCategory
    });
  };

  const handleCancelEdit = () => {
    setEditingMessage(null);
    setEditFormData({
      category: 'general' as MotivationalCategory
    });
  };

  const handleSaveEdit = async () => {
    if (editingMessage && editFormData) {
      try {
        const messageToSave = {
          ...editFormData,
          category: (editFormData.category || 'general') as MotivationalCategory
        };
        await onUpdateMessage(editingMessage, messageToSave as MotivationalMessage);
        setEditingMessage(null);
        setEditFormData({
          category: 'general' as MotivationalCategory
        });
        toast.success('Message updated successfully!');
      } catch (error) {
        toast.error('Failed to update message');
      }
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await onDeleteMessage(id);
      toast.success('Message deleted successfully!');
    } catch (error) {
      toast.error('Failed to delete message');
    }
  };

  const handleCategoryChange = (value: string) => {
    setNewMessage({ ...newMessage, category: value as MotivationalCategory });
  };

  const handleEditCategoryChange = (value: string) => {
    setEditFormData({ ...editFormData, category: value as MotivationalCategory });
  };

  return (
    <div className="space-y-6">
      {/* Add new message form */}
      <Card>
        <CardHeader>
          <CardTitle>Add New Motivational Message</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid gap-2">
              <label htmlFor="title">Title</label>
              <Input
                id="title"
                value={newMessage.title}
                onChange={(e) => setNewMessage({ ...newMessage, title: e.target.value })}
                placeholder="Message title"
              />
            </div>
            
            <div className="grid gap-2">
              <label htmlFor="category">Category</label>
              <Select
                value={newMessage.category}
                onValueChange={handleCategoryChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="fitness">Fitness</SelectItem>
                  <SelectItem value="nutrition">Nutrition</SelectItem>
                  <SelectItem value="mindfulness">Mindfulness</SelectItem>
                  <SelectItem value="motivation">Motivation</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid gap-2">
              <label htmlFor="content">Content</label>
              <Textarea
                id="content"
                value={newMessage.content}
                onChange={(e) => setNewMessage({ ...newMessage, content: e.target.value })}
                placeholder="Message content"
                rows={5}
              />
            </div>
            
            <div className="grid gap-2">
              <label htmlFor="tags">Tags</label>
              <div className="flex gap-2">
                <Input
                  id="tags"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  placeholder="Add tag"
                  className="flex-1"
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                />
                <Button type="button" onClick={handleAddTag}>Add</Button>
              </div>
              <div className="flex flex-wrap gap-1 mt-2">
                {newMessage.tags?.map((tag) => (
                  <Badge key={tag} className="px-2 py-1 cursor-pointer hover:bg-destructive" onClick={() => handleRemoveTag(tag)}>
                    {tag} <X className="ml-1 h-3 w-3" />
                  </Badge>
                ))}
              </div>
            </div>
            
            <Button onClick={handleSaveMessage}>Save Message</Button>
          </div>
        </CardContent>
      </Card>
      
      {/* Messages list */}
      <div className="grid gap-4 md:grid-cols-2">
        {messages.map((message) => (
          <Card key={message.id} className="transition-all hover:shadow-md">
            {editingMessage === message.id ? (
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div className="grid gap-2">
                    <label htmlFor={`edit-title-${message.id}`}>Title</label>
                    <Input
                      id={`edit-title-${message.id}`}
                      value={editFormData.title}
                      onChange={(e) => setEditFormData({ ...editFormData, title: e.target.value })}
                    />
                  </div>
                  
                  <div className="grid gap-2">
                    <label htmlFor={`edit-category-${message.id}`}>Category</label>
                    <Select
                      value={editFormData.category}
                      onValueChange={handleEditCategoryChange}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="fitness">Fitness</SelectItem>
                        <SelectItem value="nutrition">Nutrition</SelectItem>
                        <SelectItem value="mindfulness">Mindfulness</SelectItem>
                        <SelectItem value="motivation">Motivation</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="grid gap-2">
                    <label htmlFor={`edit-content-${message.id}`}>Content</label>
                    <Textarea
                      id={`edit-content-${message.id}`}
                      value={editFormData.content}
                      onChange={(e) => setEditFormData({ ...editFormData, content: e.target.value })}
                      rows={5}
                    />
                  </div>
                  
                  <div className="grid gap-2">
                    <label htmlFor={`edit-tags-${message.id}`}>Tags</label>
                    <div className="flex gap-2">
                      <Input
                        id={`edit-tags-${message.id}`}
                        value={tagInput}
                        onChange={(e) => setTagInput(e.target.value)}
                        placeholder="Add tag"
                        className="flex-1"
                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleEditTag(e.currentTarget.value))}
                      />
                      <Button type="button" onClick={() => handleEditTag(tagInput)}>Add</Button>
                    </div>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {editFormData.tags?.map((tag) => (
                        <Badge key={tag} className="px-2 py-1 cursor-pointer hover:bg-destructive" onClick={() => handleRemoveEditTag(tag)}>
                          {tag} <X className="ml-1 h-3 w-3" />
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex gap-2 justify-end">
                    <Button variant="outline" onClick={handleCancelEdit}>
                      <X className="mr-1 h-4 w-4" /> Cancel
                    </Button>
                    <Button onClick={handleSaveEdit}>
                      <Check className="mr-1 h-4 w-4" /> Save
                    </Button>
                  </div>
                </div>
              </CardContent>
            ) : (
              <>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle>{message.title}</CardTitle>
                      <Badge className="mt-1">{message.category}</Badge>
                    </div>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="icon" onClick={() => handleStartEdit(message)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(message.id)}>
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-500 mb-3">{message.content}</p>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {message.tags?.map((tag) => (
                      <Badge key={tag} variant="outline" className="px-2 py-1">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </>
            )}
          </Card>
        ))}
        
        {messages.length === 0 && (
          <Card className="col-span-2">
            <CardContent className="py-6 text-center text-gray-500">
              No motivational messages found. Add your first message above!
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
