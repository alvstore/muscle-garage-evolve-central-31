import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';

// Interface for website content data
export interface WebsiteContent {
  id: string;
  section: string;
  title?: string;
  subtitle?: string;
  content?: string;
  cta_text?: string;
  image_url?: string;
  order?: number;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

// Service for managing website content
export const websiteContentService = {
  // Fetch all website content
  async getAllContent(): Promise<Record<string, WebsiteContent[]>> {
    try {
      const { data, error } = await supabase
        .from('website_content')
        .select('*')
        .order('order', { ascending: true });

      if (error) throw error;

      // Group content by section
      const contentBySection: Record<string, WebsiteContent[]> = {
        hero: [],
        about: [],
        services: [],
        classes: [],
        trainers: [],
        gallery: [],
        testimonials: [],
        pricing: [],
        contact: []
      };

      if (data) {
        data.forEach((item: WebsiteContent) => {
          if (contentBySection[item.section]) {
            contentBySection[item.section].push(item);
          }
        });
      }

      return contentBySection;
    } catch (error) {
      console.error('Error fetching website content:', error);
      throw error;
    }
  },

  // Fetch content for a specific section
  async getSectionContent(section: string): Promise<WebsiteContent[]> {
    try {
      const { data, error } = await supabase
        .from('website_content')
        .select('*')
        .eq('section', section)
        .order('order', { ascending: true });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error(`Error fetching ${section} content:`, error);
      throw error;
    }
  },

  // Update a content item
  async updateContent(id: string, updates: Partial<WebsiteContent>): Promise<WebsiteContent> {
    try {
      const { data, error } = await supabase
        .from('website_content')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating website content:', error);
      throw error;
    }
  },

  // Add a new content item
  async addContent(content: Omit<WebsiteContent, 'id'>): Promise<WebsiteContent> {
    try {
      const { data, error } = await supabase
        .from('website_content')
        .insert([{
          ...content,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }])
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error adding website content:', error);
      throw error;
    }
  },

  // Upload an image for website content
  async uploadImage(file: File, path: string): Promise<string> {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${path}/${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('website-images')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from('website-images')
        .getPublicUrl(fileName);

      return data.publicUrl;
    } catch (error) {
      console.error('Error uploading image:', error);
      throw error;
    }
  },

  // Delete a content item
  async deleteContent(id: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('website_content')
        .delete()
        .eq('id', id);

      if (error) throw error;
    } catch (error) {
      console.error('Error deleting website content:', error);
      throw error;
    }
  }
};