
import React, { useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useSearchParams, useNavigate } from 'react-router-dom';
import WebsiteContentManager from './WebsiteContentManager';
import SEOManager from './SEOManager';
import WebsiteAnalytics from './WebsiteAnalytics';

const WebsiteManagementPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const section = searchParams.get('section') || 'pages';

  const handleTabChange = (value: string) => {
    // Use search params instead of navigation to avoid full page reloads
    setSearchParams({ section: value });
  };

  const renderContent = () => {
    switch (section) {
      case 'pages':
        return (
          <div className="p-0">
            <React.Suspense fallback={<div className="p-4">Loading website content manager...</div>}>
              <WebsiteContentManager />
            </React.Suspense>
          </div>
        );
      case 'seo':
        return (
          <div className="p-0">
            <React.Suspense fallback={<div className="p-4">Loading SEO manager...</div>}>
              <SEOManager />
            </React.Suspense>
          </div>
        );
      case 'analytics':
        return (
          <div className="p-0">
            <React.Suspense fallback={<div className="p-4">Loading analytics...</div>}>
              <WebsiteAnalytics />
            </React.Suspense>
          </div>
        );
      default:
        return (
          <div className="p-4">
            <h3 className="text-lg font-medium mb-4">Content Management</h3>
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
