import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const SEOManager: React.FC = () => {
  return (
    <div className="p-6">
      <Card>
        <CardHeader>
          <CardTitle>SEO Settings</CardTitle>
          <CardDescription>Configure your website's search engine optimization settings</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="general">
            <TabsList className="mb-4">
              <TabsTrigger value="general">General</TabsTrigger>
              <TabsTrigger value="social">Social Media</TabsTrigger>
              <TabsTrigger value="sitemap">Sitemap</TabsTrigger>
            </TabsList>
            
            <TabsContent value="general" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="site-title">Website Title</Label>
                <Input id="site-title" placeholder="Muscle Garage - Premium Fitness Center" />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="meta-description">Meta Description</Label>
                <Textarea 
                  id="meta-description" 
                  placeholder="Muscle Garage offers premium fitness facilities, expert trainers, and customized workout plans to help you achieve your fitness goals."
                  className="min-h-[100px]"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="meta-keywords">Meta Keywords</Label>
                <Input id="meta-keywords" placeholder="gym, fitness, workout, personal training, muscle building" />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="canonical-url">Canonical URL</Label>
                <Input id="canonical-url" placeholder="https://muscle-garage-evolve.lovable.app" />
              </div>
              
              <Button className="mt-4">Save SEO Settings</Button>
            </TabsContent>
            
            <TabsContent value="social" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="og-title">Open Graph Title</Label>
                <Input id="og-title" placeholder="Muscle Garage - Transform Your Body" />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="og-description">Open Graph Description</Label>
                <Textarea 
                  id="og-description" 
                  placeholder="Join Muscle Garage for premium fitness facilities and expert training to achieve your fitness goals."
                  className="min-h-[100px]"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="og-image">Open Graph Image URL</Label>
                <Input id="og-image" placeholder="https://muscle-garage-evolve.lovable.app/images/og-image.jpg" />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="twitter-card">Twitter Card Type</Label>
                <Input id="twitter-card" placeholder="summary_large_image" />
              </div>
              
              <Button className="mt-4">Save Social Media Settings</Button>
            </TabsContent>
            
            <TabsContent value="sitemap" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="sitemap-url">Sitemap URL</Label>
                <Input id="sitemap-url" placeholder="https://muscle-garage-evolve.lovable.app/sitemap.xml" disabled />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="robots-txt">Robots.txt Content</Label>
                <Textarea 
                  id="robots-txt" 
                  placeholder="User-agent: *\nAllow: /\nSitemap: https://muscle-garage-evolve.lovable.app/sitemap.xml"
                  className="min-h-[150px] font-mono"
                />
              </div>
              
              <div className="flex gap-4">
                <Button>Generate Sitemap</Button>
                <Button>Save Robots.txt</Button>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default SEOManager;