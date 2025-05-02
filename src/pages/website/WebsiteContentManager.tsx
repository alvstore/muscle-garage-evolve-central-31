import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Globe, ExternalLink, Eye } from 'lucide-react';
import WebsitePreview from '@/components/frontpages/WebsitePreview';
import FrontPagesManager from '@/pages/frontpages/FrontPagesManager';

const WebsiteContentManager: React.FC = () => {
  const navigate = useNavigate();
  const [showPreview, setShowPreview] = React.useState(false);

  return (
    <div className="p-6">
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Website Content Management</h1>
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

        <Card>
          <CardHeader>
            <CardTitle>Website Pages</CardTitle>
            <CardDescription>Manage your website's content and appearance</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            {/* Remove padding to allow FrontPagesManager to render properly */}
            <div className="-m-6">
              <FrontPagesManager />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default WebsiteContentManager;