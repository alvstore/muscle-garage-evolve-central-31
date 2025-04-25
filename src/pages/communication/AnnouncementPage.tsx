
import { useState } from "react";
import { Container } from "@/components/ui/container";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AnnouncementsList } from "@/components/communication/AnnouncementsList";
import CreateAnnouncementForm from "@/components/communication/CreateAnnouncementForm";
import { Announcement } from "@/types/notification";
import { usePermissions } from "@/hooks/use-permissions";

export default function AnnouncementPage() {
  const [activeTab, setActiveTab] = useState("list");
  const [editAnnouncement, setEditAnnouncement] = useState<Announcement | null>(null);
  const { userRole } = usePermissions();
  
  const isMember = userRole === "member";

  return (
    <Container>
      <div className="py-6">
        <h1 className="text-2xl font-bold mb-6">Announcements</h1>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList>
            <TabsTrigger value="list">All Announcements</TabsTrigger>
            {!isMember && (
              <TabsTrigger value="create">Create Announcement</TabsTrigger>
            )}
          </TabsList>
          
          <TabsContent value="list" className="space-y-4">
            <AnnouncementsList />
          </TabsContent>
          
          {!isMember && (
            <TabsContent value="create" className="space-y-4">
              <CreateAnnouncementForm 
                onSuccess={() => {
                  setActiveTab("list");
                  setEditAnnouncement(null);
                }} 
              />
            </TabsContent>
          )}
        </Tabs>
      </div>
    </Container>
  );
}
