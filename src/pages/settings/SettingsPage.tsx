
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import GeneralSettings from "@/components/settings/GeneralSettings";
import NotificationSettings from "@/components/settings/NotificationSettings";
import CompanySettings from "@/components/settings/CompanySettings";
import ThemeSettings from "@/components/settings/ThemeSettings";

const SettingsPage = () => {
  return (
    <div className="container mx-auto py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">
          Manage your account settings and set preferences.
        </p>
      </div>
      <Separator className="my-6" />
      
      <Tabs defaultValue="general" className="w-full">
        <TabsList className="mb-6 grid w-full grid-cols-2 md:grid-cols-4 lg:w-auto">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="appearance">Appearance</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="company">Company</TabsTrigger>
        </TabsList>
        
        <TabsContent value="general" className="space-y-6">
          <GeneralSettings />
        </TabsContent>
        
        <TabsContent value="appearance" className="space-y-6">
          <ThemeSettings />
        </TabsContent>
        
        <TabsContent value="notifications" className="space-y-6">
          <NotificationSettings />
        </TabsContent>
        
        <TabsContent value="company" className="space-y-6">
          <CompanySettings />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SettingsPage;
