
import api from './api';
import { toast } from 'sonner';

// Type definitions for content
interface Testimonial {
  id: string;
  name: string;
  content: string;
  rating: number;
  image?: string;
  designation?: string;
  date: string;
}

interface GalleryItem {
  id: string;
  title: string;
  description?: string;
  image: string;
  category: string;
  featured: boolean;
}

interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
  order: number;
}

export const contentService = {
  // Fetch all testimonials
  async getTestimonials(): Promise<Testimonial[]> {
    try {
      const response = await api.get<Testimonial[]>('/content/testimonials');
      return response.data;
    } catch (error: any) {
      console.error('Failed to fetch testimonials:', error);
      return [];
    }
  },
  
  // Fetch featured testimonials
  async getFeaturedTestimonials(limit = 5): Promise<Testimonial[]> {
    try {
      const response = await api.get<Testimonial[]>('/content/testimonials/featured', {
        params: { limit }
      });
      return response.data;
    } catch (error: any) {
      console.error('Failed to fetch featured testimonials:', error);
      return [];
    }
  },
  
  // Submit a new testimonial
  async submitTestimonial(data: Omit<Testimonial, 'id' | 'date'>): Promise<Testimonial | null> {
    try {
      const response = await api.post<Testimonial>('/content/testimonials', data);
      toast.success('Testimonial submitted successfully. It will be visible after approval.');
      return response.data;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to submit testimonial';
      toast.error(errorMessage);
      return null;
    }
  },
  
  // Fetch gallery items
  async getGalleryItems(category?: string): Promise<GalleryItem[]> {
    try {
      const params = category ? { category } : {};
      const response = await api.get<GalleryItem[]>('/content/gallery', { params });
      return response.data;
    } catch (error: any) {
      console.error('Failed to fetch gallery items:', error);
      return [];
    }
  },
  
  // Fetch FAQs
  async getFAQs(category?: string): Promise<FAQ[]> {
    try {
      const params = category ? { category } : {};
      const response = await api.get<FAQ[]>('/content/faqs', { params });
      return response.data;
    } catch (error: any) {
      console.error('Failed to fetch FAQs:', error);
      return [];
    }
  },
  
  // Submit a question
  async submitQuestion(name: string, email: string, question: string): Promise<boolean> {
    try {
      await api.post('/content/ask-question', { name, email, question });
      toast.success('Your question has been submitted. We will get back to you soon.');
      return true;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to submit question';
      toast.error(errorMessage);
      return false;
    }
  }
};
