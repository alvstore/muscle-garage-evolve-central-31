
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useParams, useNavigate } from 'react-router-dom';

const WebsiteManagementPage: React.FC = () => {
  const { section = 'pages' } = useParams<{ section?: string }>();
  const navigate = useNavigate();

  const handleTabChange = (value: string) => {
    navigate(`/website/${value}`);
  };

  const renderContent = () => {
    switch (section) {
      case 'pages':
        return (
          <div className="p-4">
            <h3 className="text-lg font-medium mb-4">Website Pages Management</h3>
            <p className="text-gray-500">Manage your website's pages, content, and layouts.</p>
          </div>
        );
      case 'seo':
        return (
          <div className="p-4">
            <h3 className="text-lg font-medium mb-4">SEO Configuration</h3>
            <p className="text-gray-500">Configure your website's SEO settings, meta tags, and sitemap.</p>
          </div>
        );
      case 'analytics':
        return (
          <div className="p-4">
            <h3 className="text-lg font-medium mb-4">Website Analytics</h3>
            <p className="text-gray-500">View and analyze website visitor data and traffic patterns.</p>
          </div>
        );
      default:
        return (
          <div className="p-4">
            <h3 className="text-lg font-medium mb-4">Website Management</h3>
            <p className="text-gray-500">Select a section to manage your website content.</p>
          </div>
        );
    }
  };

  return (
    <div className="p-6">
      <Card>
        <CardHeader>
          <CardTitle>Website Management</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs 
            defaultValue={section} 
            value={section}
            className="w-full" 
            onValueChange={handleTabChange}
          >
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="pages">Pages</TabsTrigger>
              <TabsTrigger value="seo">SEO</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
            </TabsList>
            <div className="mt-6">
              {renderContent()}
            </div>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default WebsiteManagementPage;
