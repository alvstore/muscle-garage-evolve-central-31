import { useState } from "react";
import { Container } from "@/components/ui/container";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AnnouncementsList from "@/components/communication/AnnouncementsList";
import AnnouncementForm from "@/components/communication/AnnouncementForm";
import { Announcement } from "@/types/notification";
import { usePermissions } from "@/hooks/use-permissions";
const AnnouncementPage = () => {
  const [activeTab, setActiveTab] = useState("list");
  const [editAnnouncement, setEditAnnouncement] = useState<Announcement | null>(null);
  const {
    userRole
  } = usePermissions();
  const isMember = userRole === "member";
  const handleEdit = (announcement: Announcement) => {
    if (isMember) return; // Members can't edit announcements

    setEditAnnouncement(announcement);
    setActiveTab("create");
  };
  return <Container>
      <div className="py-6">
        <h1 className="text-2xl font-bold mb-6">Announcements</h1>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList>
            <TabsTrigger value="list">All Announcements</TabsTrigger>
            {!isMember}
          </TabsList>
          
          <TabsContent value="list" className="space-y-4">
            <AnnouncementsList onEdit={handleEdit} />
          </TabsContent>
          
          {!isMember && <TabsContent value="create" className="space-y-4">
              <AnnouncementForm editAnnouncement={editAnnouncement} onComplete={() => {
            setActiveTab("list");
            setEditAnnouncement(null);
          }} />
            </TabsContent>}
        </Tabs>
      </div>
    </Container>;
};
export default AnnouncementPage;