import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Globe, ExternalLink, Eye } from 'lucide-react';
import WebsitePreview from '@/components/frontpages/WebsitePreview';
import { useToast } from '@/components/ui/use-toast';
import FrontPagesManager from '@/pages/frontpages/FrontPagesManager';
import { websiteContentService, WebsiteContent } from '@/services/websiteContentService';

// Using WebsiteContent interface from websiteContentService

const WebsiteContentManager: React.FC = () => {
  const navigate = useNavigate();
  const [showPreview, setShowPreview] = useState(false);
  const [websiteContent, setWebsiteContent] = useState<Record<string, WebsiteContent[]>>({
    hero: [],
    about: [],
    services: [],
    classes: [],
    trainers: [],
    gallery: [],
    testimonials: [],
    pricing: [],
    contact: []
  });
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  // Fetch website content using the service
  useEffect(() => {
    const fetchWebsiteContent = async () => {
      try {
        setIsLoading(true);
        const contentBySection = await websiteContentService.getAllContent();
        setWebsiteContent(contentBySection);
      } catch (error) {
        console.error('Error fetching website content:', error);
        toast({
          title: 'Error fetching content',
          description: 'Could not load website content. Using default values.',
          variant: 'destructive'
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchWebsiteContent();
  }, [toast]);

  // Function to update website content using the service
  const updateWebsiteContent = async (section: string, id: string, updates: Partial<WebsiteContent>) => {
    try {
      await websiteContentService.updateContent(id, updates);

      // Update local state
      setWebsiteContent(prev => {
        const updatedContent = { ...prev };
        const sectionItems = [...updatedContent[section]];
        const itemIndex = sectionItems.findIndex(item => item.id === id);
        
        if (itemIndex !== -1) {
          sectionItems[itemIndex] = { ...sectionItems[itemIndex], ...updates };
          updatedContent[section] = sectionItems;
        }
        
        return updatedContent;
      });

      toast({
        title: 'Content updated',
        description: 'Website content has been updated successfully.',
      });
    } catch (error) {
      console.error('Error updating website content:', error);
      toast({
        title: 'Update failed',
        description: 'Failed to update website content.',
        variant: 'destructive'
      });
    }
  };

  return (
    <div className="p-6">
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Website Content Management</h1>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setShowPreview(!showPreview)}>
              <Eye className="mr-2 h-4 w-4" />
              {showPreview ? "Hide Preview" : "Show Preview"}
            </Button>
            <Button onClick={() => window.open('https://musclegaraage.in', '_blank')}>
              <ExternalLink className="mr-2 h-4 w-4" />
              Visit Website
            </Button>
          </div>
        </div>

        {showPreview && (
          <WebsitePreview url="https://musclegaraage.in" />
        )}

        <Card>
          <CardHeader>
            <CardTitle>Website Pages</CardTitle>
            <CardDescription>Manage your website's content and appearance</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            {isLoading ? (
              <div className="p-6 text-center">
                <p>Loading website content...</p>
              </div>
            ) : (
              <div className="-m-6">
                {/* Use the updated FrontPagesManager with real Supabase data */}
                <FrontPagesManager 
                  websiteContent={websiteContent} 
                  updateWebsiteContent={updateWebsiteContent} 
                  isLoading={isLoading} 
                />
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default WebsiteContentManager;