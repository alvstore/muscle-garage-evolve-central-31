import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Globe, Home, Users, Dumbbell, CalendarDays, 
  CreditCard, MessageSquare, Info, Phone, ExternalLink, Eye
} from 'lucide-react';
import WebsitePreview from '@/components/frontpages/WebsitePreview';

const FrontPagesManager = () => {
  const [showPreview, setShowPreview] = useState(false);

  return (
    <div className="container mx-auto py-6">
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Website Management</h1>
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
                      <Input id="hero-title" defaultValue="SHAPE YOUR BODY PERFECT" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="hero-subtitle">Hero Subtitle</Label>
                      <Input id="hero-subtitle" defaultValue="Transform your physique and improve your health with our professional trainers" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="hero-cta">Call to Action Button</Label>
                      <Input id="hero-cta" defaultValue="Get Started Today" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="features-title">Features Section Title</Label>
                      <Input id="features-title" defaultValue="WHY CHOOSE US" />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="feature1-title">Feature 1 Title</Label>
                        <Input id="feature1-title" defaultValue="Modern Equipment" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="feature1-desc">Feature 1 Description</Label>
                        <Textarea id="feature1-desc" defaultValue="State-of-the-art fitness equipment for effective workouts" />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="feature2-title">Feature 2 Title</Label>
                        <Input id="feature2-title" defaultValue="Professional Trainers" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="feature2-desc">Feature 2 Description</Label>
                        <Textarea id="feature2-desc" defaultValue="Expert trainers to guide you through your fitness journey" />
                      </div>
                    </div>
                    <div className="flex justify-end">
                      <Button>Save Changes</Button>
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
                        <Input id="about-title" defaultValue="About Muscle Garage" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="about-description">Description</Label>
                        <Textarea 
                          id="about-description" 
                          className="w-full h-32 min-h-[8rem]"
                          defaultValue="Muscle Garage is a premier fitness facility dedicated to helping individuals achieve their fitness goals through personalized training programs, state-of-the-art equipment, and a supportive community environment."
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Features</Label>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <Input defaultValue="Professional Trainers" />
                          <Input defaultValue="Modern Equipment" />
                          <Input defaultValue="Nutrition Guidance" />
                          <Input defaultValue="Personalized Programs" />
                        </div>
                      </div>
                      <div className="flex justify-end">
                        <Button>Save Changes</Button>
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
