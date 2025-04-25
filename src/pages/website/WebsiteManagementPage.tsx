
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useParams } from 'react-router-dom';

const WebsiteManagementPage: React.FC = () => {
  const { section } = useParams<{ section?: string }>();

  const renderContent = () => {
    switch (section) {
      case 'pages':
        return <div>Website Pages Management</div>;
      case 'seo':
        return <div>SEO Configuration</div>;
      case 'analytics':
        return <div>Website Analytics</div>;
      default:
        return <div>Select a website management section</div>;
    }
  };

  return (
    <div className="p-6">
      <Card>
        <CardHeader>
          <CardTitle>Website Management</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue={section || 'pages'} className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="pages">Pages</TabsTrigger>
              <TabsTrigger value="seo">SEO</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
            </TabsList>
            <TabsContent value="pages">
              {renderContent()}
            </TabsContent>
            <TabsContent value="seo">
              {renderContent()}
            </TabsContent>
            <TabsContent value="analytics">
              {renderContent()}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default WebsiteManagementPage;
