
import React, { useState, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';
import FrontPagesManager from './FrontPagesManager';
import { websiteContentService } from '@/services/communication/websiteContentService';
import { WebsiteContent } from '@/types/website';

const FrontPagesWrapper = () => {
  const [isLoading, setIsLoading] = useState(true);
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
  const { toast } = useToast();

  useEffect(() => {
    const fetchContent = async () => {
      try {
        setIsLoading(true);
        const content = await websiteContentService.getAllContent();
        setWebsiteContent(content);
      } catch (error) {
        console.error('Error fetching website content:', error);
        toast({
          title: 'Error',
          description: 'Failed to load website content',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchContent();
  }, [toast]);

  const updateWebsiteContent = async (section: string, id: string, updates: Partial<WebsiteContent>) => {
    try {
      await websiteContentService.updateContent(id, updates);
      
      // Update local state
      setWebsiteContent(prev => {
        const updatedContent = { ...prev };
        const sectionItems = [...(updatedContent[section] || [])];
        const itemIndex = sectionItems.findIndex(item => item.id === id);
        
        if (itemIndex !== -1) {
          sectionItems[itemIndex] = { ...sectionItems[itemIndex], ...updates };
          updatedContent[section] = sectionItems;
        }
        
        return updatedContent;
      });

      toast({
        title: 'Success',
        description: 'Website content updated successfully',
      });
    } catch (error) {
      console.error('Error updating website content:', error);
      toast({
        title: 'Error',
        description: 'Failed to update website content',
        variant: 'destructive',
      });
    }
  };

  return (
    <FrontPagesManager
      websiteContent={websiteContent}
      updateWebsiteContent={updateWebsiteContent}
      isLoading={isLoading}
    />
  );
};

export default FrontPagesWrapper;
