
import React from 'react';
import { Container } from "@/components/ui/container";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Heading } from "@/components/ui/heading";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Globe } from "lucide-react";
import HomePageEditor from './HomePageEditor';
import AboutPageEditor from './AboutPageEditor';
import ServicesPageEditor from './ServicesPageEditor';
import ClassesPageEditor from './ClassesPageEditor';
import TestimonialsEditor from './TestimonialsEditor';
import ContactPageEditor from './ContactPageEditor';
import { useParams, useNavigate } from 'react-router-dom';

const WebsiteManagementPage = () => {
  const { section } = useParams<{ section?: string }>();
  const navigate = useNavigate();
  
  const handleTabChange = (value: string) => {
    navigate(`/website/${value}`);
  };

  const currentTab = section || 'home';

  return (
    <Container>
      <div className="flex items-center justify-between mb-6">
        <Heading title="Website Management" description="Manage your public-facing website content" />
        <a 
          href="#preview" 
          target="_blank" 
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
        >
          <Globe className="h-4 w-4" />
          Preview Website
        </a>
      </div>

      <Alert className="mb-6">
        <Globe className="h-4 w-4" />
        <AlertTitle>Website Content Management</AlertTitle>
        <AlertDescription>
          Changes made here will be reflected on your public website. All content is stored in your database and can be updated at any time.
        </AlertDescription>
      </Alert>

      <Card>
        <CardHeader>
          <CardTitle>Website Pages</CardTitle>
          <CardDescription>
            Select a page to edit its content. Use the preview button to see your changes on the live site.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs 
            defaultValue={currentTab} 
            onValueChange={handleTabChange} 
            className="w-full"
          >
            <TabsList className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
              <TabsTrigger value="home">Home</TabsTrigger>
              <TabsTrigger value="about">About Us</TabsTrigger>
              <TabsTrigger value="services">Services</TabsTrigger>
              <TabsTrigger value="classes">Classes</TabsTrigger>
              <TabsTrigger value="testimonials">Testimonials</TabsTrigger>
              <TabsTrigger value="contact">Contact</TabsTrigger>
            </TabsList>
            <TabsContent value="home">
              <HomePageEditor />
            </TabsContent>
            <TabsContent value="about">
              <AboutPageEditor />
            </TabsContent>
            <TabsContent value="services">
              <ServicesPageEditor />
            </TabsContent>
            <TabsContent value="classes">
              <ClassesPageEditor />
            </TabsContent>
            <TabsContent value="testimonials">
              <TestimonialsEditor />
            </TabsContent>
            <TabsContent value="contact">
              <ContactPageEditor />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </Container>
  );
};

export default WebsiteManagementPage;
