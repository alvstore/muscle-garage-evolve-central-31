import React, { useState } from 'react';
import { Container } from "@/components/ui/container";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink } from "@/components/ui/breadcrumb";
import { ChevronRight, Mail, Settings, Plus } from "lucide-react";
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import EmailTemplateDialog from '@/components/templates/EmailTemplateDialog';
import EmailTemplatesList from '@/components/templates/EmailTemplatesList';
import EmailTemplatePreview from '@/components/templates/EmailTemplatePreview';
import EmailHistoryPage from './EmailHistoryPage';

const EmailSettingsPage = () => {
  const [isCreating, setIsCreating] = useState(false);
  const [previewTemplate, setPreviewTemplate] = useState<any>(null);
  const [editingTemplate, setEditingTemplate] = useState<any>(null);
  const [isEnabled, setIsEnabled] = useState(true);
  const [activeTab, setActiveTab] = useState('templates');

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
            <BreadcrumbLink href="/settings/email-integration">
              <Mail className="h-4 w-4 mr-1" />
              Email Integration
            </BreadcrumbLink>
          </BreadcrumbItem>
        </Breadcrumb>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-semibold">Email Integration</h1>
            <p className="text-muted-foreground">Configure email notifications and templates</p>
          </div>
          <div className="flex items-center gap-2">
            <span className={isEnabled ? "text-primary" : "text-muted-foreground"}>
              {isEnabled ? "Enabled" : "Disabled"}
            </span>
            <Switch 
              checked={isEnabled} 
              onCheckedChange={setIsEnabled} 
              className="data-[state=checked]:bg-primary"
            />
          </div>
        </div>

        <Card>
          <CardContent className="p-0">
            <Tabs 
              defaultValue="templates" 
              value={activeTab}
              onValueChange={setActiveTab}
              className="w-full"
            >
              <div className="border-b">
                <div className="px-6">
                  <TabsList className="mt-0 h-12 w-full justify-start rounded-none border-b-0 bg-transparent p-0">
                    <TabsTrigger
                      value="templates"
                      className="rounded-none border-b-2 border-transparent px-4 py-3 data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none"
                    >
                      Templates
                    </TabsTrigger>
                    <TabsTrigger
                      value="email-history"
                      className="rounded-none border-b-2 border-transparent px-4 py-3 data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none"
                    >
                      Email History
                    </TabsTrigger>
                    <TabsTrigger
                      value="settings"
                      className="rounded-none border-b-2 border-transparent px-4 py-3 data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none"
                    >
                      Settings
                    </TabsTrigger>
                  </TabsList>
                </div>
              </div>
              
              <TabsContent value="templates" className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h2 className="text-xl font-semibold">Email Templates</h2>
                    <p className="text-muted-foreground">Manage email templates for different notifications</p>
                  </div>
                  <Button onClick={handleCreateNew}>
                    <Plus className="h-4 w-4 mr-2" />
                    New Template
                  </Button>
                </div>
                <EmailTemplatesList onEdit={handleEdit} onPreview={handlePreview} />
              </TabsContent>
              
              <TabsContent value="email-history" className="p-6">
                <EmailHistoryPage />
              </TabsContent>
              
              <TabsContent value="settings" className="p-6">
                <div className="space-y-6">
                  <div>
                    <h2 className="text-xl font-semibold">Email Settings</h2>
                    <p className="text-muted-foreground">Configure your email service provider and settings</p>
                  </div>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle>SMTP Configuration</CardTitle>
                      <CardDescription>
                        Configure your SMTP server for sending emails
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <form className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <label className="text-sm font-medium">SMTP Host</label>
                            <input 
                              type="text" 
                              className="w-full px-3 py-2 border rounded-md"
                              placeholder="smtp.example.com"
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="text-sm font-medium">SMTP Port</label>
                            <input 
                              type="text" 
                              className="w-full px-3 py-2 border rounded-md"
                              placeholder="587"
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="text-sm font-medium">Username</label>
                            <input 
                              type="text" 
                              className="w-full px-3 py-2 border rounded-md"
                              placeholder="your-email@example.com"
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="text-sm font-medium">Password</label>
                            <input 
                              type="password" 
                              className="w-full px-3 py-2 border rounded-md"
                              placeholder="••••••••"
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="text-sm font-medium">From Email</label>
                            <input 
                              type="email" 
                              className="w-full px-3 py-2 border rounded-md"
                              placeholder="noreply@yourgym.com"
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="text-sm font-medium">From Name</label>
                            <input 
                              type="text" 
                              className="w-full px-3 py-2 border rounded-md"
                              placeholder="Muscle Garage"
                            />
                          </div>
                        </div>
                        <div className="flex items-center space-x-2 pt-2">
                          <Switch id="encryption" />
                          <label htmlFor="encryption" className="text-sm font-medium">
                            Use SSL/TLS Encryption
                          </label>
                        </div>
                        <div className="pt-4">
                          <Button>Save Settings</Button>
                        </div>
                      </form>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle>Notification Settings</CardTitle>
                      <CardDescription>
                        Configure which events trigger email notifications
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="font-medium">New Member Registration</h3>
                            <p className="text-sm text-muted-foreground">Send welcome email when a new member registers</p>
                          </div>
                          <Switch defaultChecked />
                        </div>
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="font-medium">Membership Renewal</h3>
                            <p className="text-sm text-muted-foreground">Send reminder emails before membership expires</p>
                          </div>
                          <Switch defaultChecked />
                        </div>
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="font-medium">New Invoice</h3>
                            <p className="text-sm text-muted-foreground">Send email notification when a new invoice is generated</p>
                          </div>
                          <Switch defaultChecked />
                        </div>
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="font-medium">Payment Confirmation</h3>
                            <p className="text-sm text-muted-foreground">Send email receipt after successful payment</p>
                          </div>
                          <Switch defaultChecked />
                        </div>
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="font-medium">Class Booking</h3>
                            <p className="text-sm text-muted-foreground">Send confirmation email when a member books a class</p>
                          </div>
                          <Switch />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Template Edit Dialog */}
        <EmailTemplateDialog 
          isOpen={isCreating} 
          onClose={handleCloseDialog} 
          template={editingTemplate} 
        />

        {/* Template Preview Dialog */}
        <EmailTemplatePreview 
          isOpen={!!previewTemplate} 
          onClose={handleClosePreview} 
          template={previewTemplate} 
        />
      </div>
    </Container>
  );
};

export default EmailSettingsPage;
