import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ExternalLink } from 'lucide-react';

interface WebsitePreviewProps {
  url?: string;
}

const WebsitePreview = ({ url = 'https://muscle-garage-evolve.lovable.app' }: WebsitePreviewProps) => {
  return (
    <Card className="shadow-md">
      <CardContent className="p-4 flex flex-col gap-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold">Website Preview</h3>
          <Button variant="outline" size="sm" onClick={() => window.open(url, '_blank')}>
            <ExternalLink className="mr-2 h-4 w-4" />
            Open in New Tab
          </Button>
        </div>
        <div className="w-full rounded-md overflow-hidden border border-gray-200 bg-white shadow aspect-video">
          <iframe 
            src={url} 
            title="Website Preview" 
            className="w-full h-full"
            sandbox="allow-same-origin allow-scripts"
          />
        </div>
        <p className="text-sm text-gray-500">
          This is a preview of your website. To make changes, use the editing tools in the admin panel.
        </p>
      </CardContent>
    </Card>
  );
};

export default WebsitePreview;
