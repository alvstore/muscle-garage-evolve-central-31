import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Globe, Home, Users, Dumbbell, CalendarDays, 
  CreditCard, MessageSquare, Info, Phone, ExternalLink, Eye, Loader2
} from 'lucide-react';
import WebsitePreview from '@/components/frontpages/WebsitePreview';
import { useToast } from '@/components/ui/use-toast';
import { websiteContentService, WebsiteContent } from '@/services/websiteContentService';

// Using WebsiteContent interface from websiteContentService

interface FrontPagesManagerProps {
  websiteContent?: Record<string, WebsiteContent[]>;
  updateWebsiteContent?: (section: string, id: string, updates: Partial<WebsiteContent>) => Promise<void>;
  isLoading?: boolean;
}

const FrontPagesManager: React.FC<FrontPagesManagerProps> = ({ 
  websiteContent: propWebsiteContent,
  updateWebsiteContent: propUpdateContent,
  isLoading: propIsLoading
}) => {
  const [showPreview, setShowPreview] = useState(false);
  const [isLoading, setIsLoading] = useState(propIsLoading || false);
  const [websiteContent, setWebsiteContent] = useState<Record<string, WebsiteContent[]>>(propWebsiteContent || {
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
  
  // If props are not provided, fetch data directly
  useEffect(() => {
    if (!propWebsiteContent && !propIsLoading) {
      fetchWebsiteContent();
    }
  }, [propWebsiteContent, propIsLoading]);
  
  // Update local state when props change
  useEffect(() => {
    if (propWebsiteContent) {
      setWebsiteContent(propWebsiteContent);
    }
    if (propIsLoading !== undefined) {
      setIsLoading(propIsLoading);
    }
  }, [propWebsiteContent, propIsLoading]);
  
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
  
  const updateWebsiteContent = async (section: string, id: string, updates: Partial<WebsiteContent>) => {
    if (propUpdateContent) {
      return propUpdateContent(section, id, updates);
    }
    
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
  
  // Helper function to get content for a section
  const getSectionContent = (section: string) => {
    return websiteContent[section] || [];
  };
  
  // Helper function to get a specific field from a section
  const getContentField = (section: string, field: string, defaultValue: string = '') => {
    const sectionContent = getSectionContent(section);
    const item = sectionContent.find(item => item[field as keyof WebsiteContent] !== undefined);
    return item ? (item[field as keyof WebsiteContent] as string) || defaultValue : defaultValue;
  };
  
  if (isLoading) {
    return (
      <div className="container mx-auto py-6">
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2">Loading website content...</span>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto py-6">
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-end">
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setShowPreview(!showPreview)}>
              <Eye className="mr-2 h-4 w-4" />
              {showPreview ? "Hide Preview" : "Show Preview"}
            </Button>
            <Button onClick={() => window.open('https://muscle-garage-evolve.lovable.app', '_blank')}>
              <ExternalLink className="mr-2 h-4 w-4" />
              Visit Website
            </Button>
          </div>
        </div>

        {showPreview && (
          <WebsitePreview url="https://muscle-garage-evolve.lovable.app" />
        )}

        <Tabs defaultValue="home">
          <div className="flex flex-col md:flex-row gap-6">
            <Card className="w-full md:w-64">
              <CardHeader>
                <CardTitle>Pages</CardTitle>
                <CardDescription>Manage website pages</CardDescription>
              </CardHeader>
              <CardContent>
                <TabsList className="flex flex-col h-auto space-y-1">
                  <TabsTrigger value="home" className="w-full justify-start">
                    <Home className="mr-2 h-4 w-4" />
                    Home
                  </TabsTrigger>
                  <TabsTrigger value="about" className="w-full justify-start">
                    <Info className="mr-2 h-4 w-4" />
                    About Us
                  </TabsTrigger>
                  <TabsTrigger value="services" className="w-full justify-start">
                    <Dumbbell className="mr-2 h-4 w-4" />
                    Services
                  </TabsTrigger>
                  <TabsTrigger value="classes" className="w-full justify-start">
                    <CalendarDays className="mr-2 h-4 w-4" />
                    Classes
                  </TabsTrigger>
                  <TabsTrigger value="trainers" className="w-full justify-start">
                    <Users className="mr-2 h-4 w-4" />
                    Trainers
                  </TabsTrigger>
                  <TabsTrigger value="pricing" className="w-full justify-start">
                    <CreditCard className="mr-2 h-4 w-4" />
                    Pricing
                  </TabsTrigger>
                  <TabsTrigger value="testimonials" className="w-full justify-start">
                    <MessageSquare className="mr-2 h-4 w-4" />
                    Testimonials
                  </TabsTrigger>
                  <TabsTrigger value="contact" className="w-full justify-start">
                    <Phone className="mr-2 h-4 w-4" />
                    Contact
                  </TabsTrigger>
                </TabsList>
              </CardContent>
            </Card>

            <div className="flex-1">
              <TabsContent value="home" className="mt-0">
                <Card>
                  <CardHeader>
                    <CardTitle>Home Page</CardTitle>
                    <CardDescription>Manage home page content</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="hero-title">Hero Title</Label>
                      <Input 
                        id="hero-title" 
                        value={getContentField('hero', 'title', 'SHAPE YOUR BODY PERFECT')} 
                        onChange={(e) => {
                          const heroContent = getSectionContent('hero');
                          if (heroContent.length > 0) {
                            updateWebsiteContent('hero', heroContent[0].id, { title: e.target.value });
                          }
                        }}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="hero-subtitle">Hero Subtitle</Label>
                      <Input 
                        id="hero-subtitle" 
                        value={getContentField('hero', 'subtitle', 'Transform your physique and improve your health with our professional trainers')} 
                        onChange={(e) => {
                          const heroContent = getSectionContent('hero');
                          if (heroContent.length > 0) {
                            updateWebsiteContent('hero', heroContent[0].id, { subtitle: e.target.value });
                          }
                        }}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="hero-cta">Call to Action Button</Label>
                      <Input 
                        id="hero-cta" 
                        value={getContentField('hero', 'cta_text', 'Get Started Today')} 
                        onChange={(e) => {
                          const heroContent = getSectionContent('hero');
                          if (heroContent.length > 0) {
                            updateWebsiteContent('hero', heroContent[0].id, { cta_text: e.target.value });
                          }
                        }}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="features-title">Features Section Title</Label>
                      <Input 
                        id="features-title" 
                        value={getContentField('services', 'title', 'WHY CHOOSE US')} 
                        onChange={(e) => {
                          const servicesContent = getSectionContent('services');
                          if (servicesContent.length > 0) {
                            updateWebsiteContent('services', servicesContent[0].id, { title: e.target.value });
                          }
                        }}
                      />
                    </div>
                    
                    {/* Feature items - would be dynamically generated from Supabase data */}
                    {getSectionContent('services').slice(0, 2).map((feature, index) => (
                      <div key={feature.id} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor={`feature${index+1}-title`}>Feature {index+1} Title</Label>
                          <Input 
                            id={`feature${index+1}-title`} 
                            value={feature.title || `Feature ${index+1}`} 
                            onChange={(e) => updateWebsiteContent('services', feature.id, { title: e.target.value })}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor={`feature${index+1}-desc`}>Feature {index+1} Description</Label>
                          <Textarea 
                            id={`feature${index+1}-desc`} 
                            value={feature.content || ''} 
                            onChange={(e) => updateWebsiteContent('services', feature.id, { content: e.target.value })}
                          />
                        </div>
                      </div>
                    ))}
                    
                    {/* If we don't have enough features in the database, show placeholders */}
                    {getSectionContent('services').length < 2 && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="feature-placeholder">Feature Title</Label>
                          <Input id="feature-placeholder" defaultValue="Professional Trainers" disabled />
                          <p className="text-xs text-muted-foreground">Add features in Supabase to edit</p>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="feature-desc-placeholder">Feature Description</Label>
                          <Textarea id="feature-desc-placeholder" defaultValue="Expert trainers to guide you through your fitness journey" disabled />
                        </div>
                      </div>
                    )}
                    
                    <div className="flex justify-end">
                      <Button onClick={fetchWebsiteContent}>Refresh Content</Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="about" className="mt-0">
                <Card>
                  <CardHeader>
                    <CardTitle>About Us Page</CardTitle>
                    <CardDescription>Manage about us content</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="about-title">Page Title</Label>
                        <Input 
                          id="about-title" 
                          value={getContentField('about', 'title', 'About Muscle Garage')} 
                          onChange={(e) => {
                            const aboutContent = getSectionContent('about');
                            if (aboutContent.length > 0) {
                              updateWebsiteContent('about', aboutContent[0].id, { title: e.target.value });
                            }
                          }}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="about-description">Description</Label>
                        <Textarea 
                          id="about-description" 
                          className="w-full h-32 min-h-[8rem]"
                          value={getContentField('about', 'content', 'Muscle Garage is a premier fitness facility dedicated to helping individuals achieve their fitness goals through personalized training programs, state-of-the-art equipment, and a supportive community environment.')}
                          onChange={(e) => {
                            const aboutContent = getSectionContent('about');
                            if (aboutContent.length > 0) {
                              updateWebsiteContent('about', aboutContent[0].id, { content: e.target.value });
                            }
                          }}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Features</Label>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {getSectionContent('about').slice(1, 5).map((feature, index) => (
                            <Input 
                              key={feature.id}
                              value={feature.title || `Feature ${index+1}`}
                              onChange={(e) => updateWebsiteContent('about', feature.id, { title: e.target.value })}
                            />
                          ))}
                          
                          {/* If we don't have enough features in the database, show placeholders */}
                          {Array.from({ length: Math.max(0, 4 - getSectionContent('about').slice(1).length) }).map((_, index) => (
                            <Input 
                              key={`placeholder-${index}`}
                              defaultValue={["Professional Trainers", "Modern Equipment", "Nutrition Guidance", "Personalized Programs"][index]} 
                              disabled
                            />
                          ))}
                        </div>
                      </div>
                      <div className="flex justify-end">
                        <Button onClick={fetchWebsiteContent}>Refresh Content</Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="services" className="mt-0">
                <Card>
                  <CardHeader>
                    <CardTitle>Services Page</CardTitle>
                    <CardDescription>Manage services content</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="services-title">Page Title</Label>
                        <Input id="services-title" defaultValue="Our Services" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="services-desc">Page Description</Label>
                        <Textarea 
                          id="services-desc" 
                          className="min-h-[6rem]"
                          defaultValue="We offer a range of services to help you achieve your fitness goals."
                        />
                      </div>
                      <div className="space-y-4">
                        <Label>Services List</Label>
                        {[1, 2, 3].map((index) => (
                          <Card key={index} className="p-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <Label htmlFor={`service-${index}-title`}>Service Title</Label>
                                <Input id={`service-${index}-title`} defaultValue={`Service ${index}`} />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor={`service-${index}-desc`}>Service Description</Label>
                                <Textarea 
                                  id={`service-${index}-desc`} 
                                  className="min-h-[4rem]"
                                  defaultValue={`Description for service ${index}`}
                                />
                              </div>
                            </div>
                          </Card>
                        ))}
                        <Button variant="outline" className="w-full">Add New Service</Button>
                      </div>
                      <div className="flex justify-end">
                        <Button>Save Changes</Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              {/* Other tabs content would be similar, but include a simpler template for now */}
              {['classes', 'trainers', 'pricing', 'testimonials', 'contact'].map(tab => (
                <TabsContent key={tab} value={tab} className="mt-0">
                  <Card>
                    <CardHeader>
                      <CardTitle>{tab.charAt(0).toUpperCase() + tab.slice(1)} Page</CardTitle>
                      <CardDescription>Manage {tab} page content</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="p-8 text-center">
                        <p className="text-gray-500 mb-4">Content editor for {tab} page will be implemented here.</p>
                        <Button>Save Changes</Button>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              ))}
            </div>
          </div>
        </Tabs>
      </div>
    </div>
  );
};

export default FrontPagesManager;
