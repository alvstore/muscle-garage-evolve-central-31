import React from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { GeneralSettingsForm } from '@/components/settings/invoice/GeneralSettingsForm';
import { TaxSettingsForm } from '@/components/settings/invoice/TaxSettingsForm';
import { TemplateSettingsForm } from '@/components/settings/invoice/TemplateSettingsForm';

const InvoiceSettingsPage: React.FC = () => (
  <div className="container mx-auto p-4">
    <h1 className="text-2xl font-semibold mb-6">Invoice Settings</h1>
    <Tabs defaultValue="general">
      <TabsList>
        <TabsTrigger value="general">General</TabsTrigger>
        <TabsTrigger value="tax">Tax</TabsTrigger>
        <TabsTrigger value="templates">Templates</TabsTrigger>
      </TabsList>
      <TabsContent value="general">
        <GeneralSettingsForm />
      </TabsContent>
      <TabsContent value="tax">
        <TaxSettingsForm />
      </TabsContent>
      <TabsContent value="templates">
        <TemplateSettingsForm />
      </TabsContent>
    </Tabs>
  </div>
);

export default InvoiceSettingsPage;