
import React, { useState } from 'react';
import { Container } from "@/components/ui/container";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink } from "@/components/ui/breadcrumb";
import { ChevronRight, MessageCircle, Plus, Settings } from "lucide-react";
import { Button } from '@/components/ui/button';
import SmsTemplateDialog from '@/components/templates/SmsTemplateDialog';
import SmsTemplatesList from '@/components/templates/SmsTemplatesList';
import SmsTemplatePreview from '@/components/templates/SmsTemplatePreview';

const SmsTemplatesPage = () => {
  const [isCreating, setIsCreating] = useState(false);
  const [previewTemplate, setPreviewTemplate] = useState<any>(null);
  const [editingTemplate, setEditingTemplate] = useState<any>(null);

  const handleCreateNew = () => {
    setEditingTemplate(null);
    setIsCreating(true);
  };

  const handleEdit = (template: any) => {
    setEditingTemplate(template);
    setIsCreating(true);
  };

  const handlePreview = (template: any) => {
    setPreviewTemplate(template);
  };

  const handleCloseDialog = () => {
    setIsCreating(false);
    setEditingTemplate(null);
  };

  const handleClosePreview = () => {
    setPreviewTemplate(null);
  };

  return (
    <Container>
      <div className="py-6">
        <Breadcrumb className="mb-6">
          <BreadcrumbItem>
            <BreadcrumbLink href="/settings">
              <Settings className="h-4 w-4 mr-1" />
              Settings
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbItem>
            <ChevronRight className="h-4 w-4" />
          </BreadcrumbItem>
          <BreadcrumbItem>
            <BreadcrumbLink href="/settings/templates">
              Templates
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbItem>
            <ChevronRight className="h-4 w-4" />
          </BreadcrumbItem>
          <BreadcrumbItem>
            <BreadcrumbLink href="/settings/templates/sms" isCurrentPage>
              SMS Templates
            </BreadcrumbLink>
          </BreadcrumbItem>
        </Breadcrumb>

        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold">SMS Templates</h1>
            <p className="text-muted-foreground">Manage SMS notification templates with custom tags and DLT compliance</p>
          </div>
          <Button onClick={handleCreateNew} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Create Template
          </Button>
        </div>
        
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Available Tags</CardTitle>
            <CardDescription>
              Use these tags in your templates to personalize messages (160 character limit for SMS)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-sm">{"{member_name}"}</span>
              <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-sm">{"{gym_name}"}</span>
              <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-sm">{"{plan_name}"}</span>
              <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-sm">{"{expiry_date}"}</span>
              <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-sm">{"{branch_name}"}</span>
              <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-sm">{"{trainer_name}"}</span>
            </div>
          </CardContent>
        </Card>
        
        <SmsTemplatesList onEdit={handleEdit} onPreview={handlePreview} />
        
        {isCreating && (
          <SmsTemplateDialog 
            isOpen={isCreating} 
            onClose={handleCloseDialog} 
            template={editingTemplate} 
          />
        )}
        
        {previewTemplate && (
          <SmsTemplatePreview 
            isOpen={!!previewTemplate} 
            onClose={handleClosePreview} 
            template={previewTemplate} 
          />
        )}
      </div>
    </Container>
  );
};

export default SmsTemplatesPage;
