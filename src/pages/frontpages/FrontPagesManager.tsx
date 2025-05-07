import React, { useState } from 'react';
import { WebsiteContent } from '@/types/website';
import { useToast } from '@/components/ui/use-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";

interface FrontPagesManagerProps {
  websiteContent: Record<string, WebsiteContent[]>;
  updateWebsiteContent: (section: string, id: string, updates: Partial<WebsiteContent>) => Promise<void>;
  isLoading: boolean;
}

const FrontPagesManager: React.FC<FrontPagesManagerProps> = ({ 
  websiteContent, 
  updateWebsiteContent, 
  isLoading 
}) => {
  const { toast } = useToast();
  const [activeSection, setActiveSection] = useState<string>('hero');
  const sections = Object.keys(websiteContent);

  const handleContentChange = (id: string, section: string, field: string, value: string | boolean) => {
    updateWebsiteContent(section, id, { [field]: value });
  };

  return (
    <div className="flex flex-col">
      <div className="flex border-b">
        {sections.map(section => (
          <Button
            key={section}
            variant={activeSection === section ? "default" : "outline"}
            onClick={() => setActiveSection(section)}
            className="rounded-none"
          >
            {section.charAt(0).toUpperCase() + section.slice(1)}
          </Button>
        ))}
      </div>

      <div className="p-4 space-y-4">
        {websiteContent[activeSection]?.map(item => (
          <Card key={item.id} className="shadow-sm">
            <CardHeader>
              <CardTitle>{item.title || 'No Title'}</CardTitle>
              <CardDescription>Manage content for this item.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={item.title || ''}
                  onChange={(e) => handleContentChange(item.id || '', activeSection, 'title', e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="subtitle">Subtitle</Label>
                <Input
                  id="subtitle"
                  value={item.subtitle || ''}
                  onChange={(e) => handleContentChange(item.id || '', activeSection, 'subtitle', e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="content">Content</Label>
                <Textarea
                  id="content"
                  value={item.content || ''}
                  onChange={(e) => handleContentChange(item.id || '', activeSection, 'content', e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="image_url">Image URL</Label>
                <Input
                  id="image_url"
                  type="url"
                  value={item.image_url || ''}
                  onChange={(e) => handleContentChange(item.id || '', activeSection, 'image_url', e.target.value)}
                />
              </div>
              <div className="flex items-center space-x-2">
                <Label htmlFor="is_active">Active</Label>
                <Switch
                  id="is_active"
                  checked={item.is_active || false}
                  onCheckedChange={(checked) => handleContentChange(item.id || '', activeSection, 'is_active', checked)}
                />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default FrontPagesManager;
