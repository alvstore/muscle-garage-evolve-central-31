import { useState, useEffect } from 'react';
import { websiteContentService, WebsiteContent } from '@/services/websiteContentService';

// Hook for accessing website content in frontend components
export function useWebsiteContent(section?: string) {
  const [content, setContent] = useState<WebsiteContent[]>([]);
  const [allContent, setAllContent] = useState<Record<string, WebsiteContent[]>>({
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
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        if (section) {
          // Fetch content for a specific section
          const sectionContent = await websiteContentService.getSectionContent(section);
          setContent(sectionContent);
        } else {
          // Fetch all content
          const allContentData = await websiteContentService.getAllContent();
          setAllContent(allContentData);
        }
      } catch (err) {
        console.error(`Error fetching website content${section ? ` for ${section}` : ''}:`, err);
        setError(err instanceof Error ? err : new Error('Failed to fetch website content'));
      } finally {
        setIsLoading(false);
      }
    };

    fetchContent();
  }, [section]);

  // Helper function to get a specific field from the first item in a section
  const getField = (sectionName: string, field: keyof WebsiteContent, defaultValue: any = '') => {
    const sectionContent = section ? 
      (sectionName === section ? content : []) : 
      allContent[sectionName] || [];
    
    const item = sectionContent.find(item => item[field] !== undefined);
    return item ? item[field] || defaultValue : defaultValue;
  };

  // Helper function to get all items for a section
  const getItems = (sectionName: string) => {
    return section ?
      (sectionName === section ? content : []) :
      allContent[sectionName] || [];
  };

  return {
    content: section ? content : allContent,
    isLoading,
    error,
    getField,
    getItems,
    refresh: async () => {
      setIsLoading(true);
      try {
        if (section) {
          const sectionContent = await websiteContentService.getSectionContent(section);
          setContent(sectionContent);
        } else {
          const allContentData = await websiteContentService.getAllContent();
          setAllContent(allContentData);
        }
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to refresh website content'));
      } finally {
        setIsLoading(false);
      }
    }
  };
}