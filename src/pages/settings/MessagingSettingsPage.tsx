
import React, { useState } from 'react';
import { Container } from "@/components/ui/container";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink } from "@/components/ui/breadcrumb";
import { ChevronRight, MessageCircle, MessageSquare, Settings } from "lucide-react";
import SmsSettings from '@/components/settings/SmsSettings';
import WhatsAppSettings from '@/components/settings/WhatsAppSettings';
import { usePermissions } from '@/hooks/use-permissions';

const MessagingSettingsPage = () => {
  const [activeTab, setActiveTab] = useState("sms");
  const { can } = usePermissions();
  
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
            <BreadcrumbLink href="/settings/integrations">
              Integrations
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbItem>
            <ChevronRight className="h-4 w-4" />
          </BreadcrumbItem>
          <BreadcrumbItem>
            <BreadcrumbLink href="/settings/integrations/messaging" isCurrentPage>
              Messaging Services
            </BreadcrumbLink>
          </BreadcrumbItem>
        </Breadcrumb>

        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold">Messaging Services</h1>
            <p className="text-muted-foreground">Configure SMS and WhatsApp integration settings</p>
          </div>
        </div>
        
        <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <Card>
            <CardContent className="p-6">
              <TabsList className="grid grid-cols-2 w-full md:w-auto">
                <TabsTrigger value="sms" className="flex items-center gap-2">
                  <MessageCircle className="h-4 w-4" />
                  <span>SMS</span>
                </TabsTrigger>
                <TabsTrigger value="whatsapp" className="flex items-center gap-2">
                  <MessageSquare className="h-4 w-4" />
                  <span>WhatsApp</span>
                </TabsTrigger>
              </TabsList>
            </CardContent>
          </Card>

          <TabsContent value="sms">
            <SmsSettings onClose={() => {}} />
          </TabsContent>
          
          <TabsContent value="whatsapp">
            <WhatsAppSettings />
          </TabsContent>
        </Tabs>
      </div>
    </Container>
  );
};

export default MessagingSettingsPage;
