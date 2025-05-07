import React, { useState, useEffect, useCallback } from 'react';
import { Container } from '@/components/ui/container';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Checkbox } from '@/components/ui/checkbox';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/use-auth';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/components/ui/use-toast';

interface WebsiteContent {
  id: string;
  page: string;
  section: string;
  content: any;
  created_at: string;
  updated_at: string;
}

const FrontPagesManager = () => {
  const [heroContent, setHeroContent] = useState<WebsiteContent[]>([]);
  const [featuresContent, setFeaturesContent] = useState<WebsiteContent[]>([]);
  const [testimonialsContent, setTestimonialsContent] = useState<WebsiteContent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
	const [isHeroSectionActive, setIsHeroSectionActive] = useState(true);
	const [heroSectionOpacity, setHeroSectionOpacity] = useState<number>(70);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchWebsiteContent = useCallback(async () => {
    setIsLoading(true);
    try {
      const { data: hero, error: heroError } = await supabase
        .from('website_content')
        .select('*')
        .eq('page', 'home')
        .eq('section', 'hero');

      if (heroError) throw heroError;
      setHeroContent(hero || []);

      const { data: features, error: featuresError } = await supabase
        .from('website_content')
        .select('*')
        .eq('page', 'home')
        .eq('section', 'features');

      if (featuresError) throw featuresError;
      setFeaturesContent(features || []);

      const { data: testimonials, error: testimonialsError } = await supabase
        .from('website_content')
        .select('*')
        .eq('page', 'home')
        .eq('section', 'testimonials');

      if (testimonialsError) throw testimonialsError;
      setTestimonialsContent(testimonials || []);
    } catch (error: any) {
      console.error('Error fetching website content:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to fetch website content.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchWebsiteContent();
  }, [fetchWebsiteContent]);

  const updateWebsiteContent = async (section: string, id: string, content: any) => {
    setIsSaving(true);
    try {
      const { error } = await supabase
        .from('website_content')
        .update({ content })
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Success",
        description: `Successfully updated ${section} section.`,
      })

      fetchWebsiteContent();
    } catch (error: any) {
      console.error(`Error updating ${section} section:`, error);
      toast({
        title: "Error",
        description: error.message || `Failed to update ${section} section.`,
        variant: "destructive",
      })
    } finally {
      setIsSaving(false);
    }
  };

  const handleHeroSectionActiveChange = async (checked: boolean) => {
		setIsSaving(true);
    try {
      const { error } = await supabase
        .from('website_content')
        .update({ content: { is_active: checked } })
        .eq('page', 'home')
        .eq('section', 'hero');

      if (error) throw error;

      toast({
        title: "Success",
        description: `Successfully updated hero section active status.`,
      })

      fetchWebsiteContent();
    } catch (error: any) {
      console.error(`Error updating hero section active status:`, error);
      toast({
        title: "Error",
        description: error.message || `Failed to update hero section active status.`,
        variant: "destructive",
      })
    } finally {
      setIsSaving(false);
    }
    setIsHeroSectionActive(checked);
  };

	const handleHeroSectionOpacityChange = async (value: number[]) => {
		const opacity = value[0];
		setIsSaving(true);
		try {
			const { error } = await supabase
				.from('website_content')
				.update({ content: { opacity: opacity } })
				.eq('page', 'home')
				.eq('section', 'hero');

			if (error) throw error;

			toast({
				title: "Success",
				description: `Successfully updated hero section opacity.`,
			})

			fetchWebsiteContent();
		} catch (error: any) {
			console.error(`Error updating hero section opacity:`, error);
			toast({
				title: "Error",
				description: error.message || `Failed to update hero section opacity.`,
				variant: "destructive",
			})
		} finally {
			setIsSaving(false);
		}
		setHeroSectionOpacity(opacity);
	};

  if (isLoading) {
    return (
      <Container>
        <div className="py-6">
          <h1 className="text-2xl font-bold mb-6">Front Pages Manager</h1>
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Hero Section</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Skeleton className="w-full h-10" />
                <Skeleton className="w-full h-10" />
                <Skeleton className="w-full h-24" />
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Features Section</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Skeleton className="w-full h-10" />
                <Skeleton className="w-full h-10" />
                <Skeleton className="w-full h-24" />
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Testimonials Section</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Skeleton className="w-full h-10" />
                <Skeleton className="w-full h-10" />
                <Skeleton className="w-full h-24" />
              </CardContent>
            </Card>
          </div>
        </div>
      </Container>
    );
  }

  return (
    <Container>
      <div className="py-6">
        <h1 className="text-2xl font-bold mb-6">Front Pages Manager</h1>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Hero Section</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {heroContent.length > 0 ? (
                <>
                  <div className="flex items-center space-x-2">
                    <Label htmlFor="hero-active">Hero Section Active</Label>
                    <Switch
                      id="hero-active"
                      checked={heroContent[0].content?.is_active || false}
                      onCheckedChange={(checked) => handleHeroSectionActiveChange(checked)}
                    />
                  </div>
									<div className="grid w-full max-w-sm items-center gap-1.5">
										<Label htmlFor="opacity">Hero Section Opacity</Label>
										<Slider
											defaultValue={[heroContent[0].content?.opacity || 70]}
											max={100}
											min={0}
											step={1}
											onValueChange={(value) => handleHeroSectionOpacityChange(value)}
											aria-label="Opacity"
										/>
									</div>
                  <div>
                    <Label htmlFor="hero-title">Title</Label>
                    <Input
                      type="text"
                      id="hero-title"
                      defaultValue={heroContent[0].content?.title || ''}
                      onChange={(e) => updateWebsiteContent('hero', heroContent[0].id, { title: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="hero-subtitle">Subtitle</Label>
                    <Textarea
                      id="hero-subtitle"
                      defaultValue={heroContent[0].content?.subtitle || ''}
                      onChange={(e) => updateWebsiteContent('hero', heroContent[0].id, { subtitle: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="hero-cta">Call to Action Text</Label>
                    <Input
                      type="text"
                      id="hero-cta"
                      defaultValue={heroContent[0].content?.cta_text || ''}
                      onChange={(e) => updateWebsiteContent('hero', heroContent[0].id, { cta_text: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="hero-cta-link">Call to Action Link</Label>
                    <Input
                      type="text"
                      id="hero-cta-link"
                      defaultValue={heroContent[0].content?.cta_link || ''}
                      onChange={(e) => updateWebsiteContent('hero', heroContent[0].id, { cta_link: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="hero-image">Image URL</Label>
                    <Input
                      type="text"
                      id="hero-image"
                      defaultValue={heroContent[0].content?.image_url || ''}
                      onChange={(e) => updateWebsiteContent('hero', heroContent[0].id, { image_url: e.target.value })}
                    />
                  </div>
                </>
              ) : (
                <p>No hero section content found.</p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Features Section</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {featuresContent.length > 0 ? (
                <ScrollArea className="h-[400px] w-full rounded-md border">
                  <div className="space-y-4 p-4">
                    {featuresContent.map((feature, index) => (
                      <div key={feature.id} className="border p-4 rounded-md">
                        <h3 className="text-lg font-semibold mb-2">Feature {index + 1}</h3>
                        <div>
                          <Label htmlFor={`feature-${index}-title`}>Title</Label>
                          <Input
                            type="text"
                            id={`feature-${index}-title`}
                            defaultValue={feature.content?.title || ''}
                            onChange={(e) => updateWebsiteContent('features', feature.id, { title: e.target.value })}
                          />
                        </div>
                        <div>
                          <Label htmlFor={`feature-${index}-description`}>Description</Label>
                          <Textarea
                            id={`feature-${index}-description`}
                            defaultValue={feature.content?.description || ''}
                            onChange={(e) => updateWebsiteContent('features', feature.id, { description: e.target.value })}
                          />
                        </div>
                        <div>
                          <Label htmlFor={`feature-${index}-image`}>Image URL</Label>
                          <Input
                            type="text"
                            id={`feature-${index}-image`}
                            defaultValue={feature.content?.image_url || ''}
                            onChange={(e) => updateWebsiteContent('features', feature.id, { image_url: e.target.value })}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              ) : (
                <p>No features section content found.</p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Testimonials Section</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {testimonialsContent.length > 0 ? (
                <ScrollArea className="h-[400px] w-full rounded-md border">
                  <div className="space-y-4 p-4">
                    {testimonialsContent.map((testimonial, index) => (
                      <div key={testimonial.id} className="border p-4 rounded-md">
                        <h3 className="text-lg font-semibold mb-2">Testimonial {index + 1}</h3>
                        <div>
                          <Label htmlFor={`testimonial-${index}-quote`}>Quote</Label>
                          <Textarea
                            id={`testimonial-${index}-quote`}
                            defaultValue={testimonial.content?.quote || ''}
                            onChange={(e) => updateWebsiteContent('testimonials', testimonial.id, { quote: e.target.value })}
                          />
                        </div>
                        <div>
                          <Label htmlFor={`testimonial-${index}-author`}>Author</Label>
                          <Input
                            type="text"
                            id={`testimonial-${index}-author`}
                            defaultValue={testimonial.content?.author || ''}
                            onChange={(e) => updateWebsiteContent('testimonials', testimonial.id, { author: e.target.value })}
                          />
                        </div>
                        <div>
                          <Label htmlFor={`testimonial-${index}-image`}>Image URL</Label>
                          <Input
                            type="text"
                            id={`testimonial-${index}-image`}
                            defaultValue={testimonial.content?.image_url || ''}
                            onChange={(e) => updateWebsiteContent('testimonials', testimonial.id, { image_url: e.target.value })}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              ) : (
                <p>No testimonials section content found.</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </Container>
  );
};

export default FrontPagesManager;
