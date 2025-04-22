import { useState, useEffect } from "react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { Announcement } from "@/types/notification";
import AnnouncementsLoading from "./announcements/AnnouncementsLoading";
import AnnouncementsEmpty from "./announcements/AnnouncementsEmpty";
import AnnouncementsTable from "./announcements/AnnouncementsTable";
import AnnouncementDetailDialog from "./AnnouncementDetailDialog";

const mockAnnouncements: Announcement[] = [
  {
    id: "1",
    title: "Gym Closure for Maintenance",
    content: "The gym will be closed on July 15th for routine maintenance. We apologize for any inconvenience.",
    authorId: "admin1",
    authorName: "Admin",
    createdAt: "2023-07-10T10:00:00Z",
    targetRoles: ["member", "trainer"],
    channels: ["in-app", "email"],
    sentCount: 120,
    priority: "medium",
    forRoles: ["member", "trainer"],
    createdBy: "admin1"
  },
  {
    id: "2",
    title: "New Fitness Classes Added",
    content: "We're excited to announce new Zumba and Pilates classes starting next week!",
    authorId: "admin1",
    authorName: "Admin",
    createdAt: "2023-07-12T14:30:00Z",
    targetRoles: ["member"],
    channels: ["in-app", "email", "sms"],
    expiresAt: "2023-07-26T23:59:59Z",
    sentCount: 98,
    priority: "high",
    forRoles: ["member"],
    createdBy: "admin1"
  },
  {
    id: "3", 
    title: "Holiday Schedule Change",
    content: "Please note our special hours during the upcoming holiday weekend.",
    authorId: "staff1",
    authorName: "Staff Member",
    createdAt: "2023-07-18T09:15:00Z",
    targetRoles: ["member", "trainer", "staff"],
    channels: ["in-app", "whatsapp"],
    sentCount: 215,
    priority: "low",
    forRoles: ["member", "trainer", "staff"],
    createdBy: "staff1"
  }
];

interface AnnouncementsListProps {
  onEdit: (announcement: Announcement) => void;
}

const AnnouncementsList = ({ onEdit }: AnnouncementsListProps) => {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState<Announcement | null>(null);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);

  useEffect(() => {
    loadAnnouncements();
  }, []);

  const loadAnnouncements = () => {
    setLoading(true);
    setTimeout(() => {
      setAnnouncements(mockAnnouncements);
      setLoading(false);
    }, 1000);
  };

  const handleDelete = (id: string) => {
    setAnnouncements(announcements.filter(a => a.id !== id));
    toast.success("Announcement deleted successfully");
  };

  const handleResend = (id: string) => {
    toast.success("Announcement resent successfully");
  };

  const handleView = (announcement: Announcement) => {
    setSelectedAnnouncement(announcement);
    setDetailDialogOpen(true);
  };

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Announcements</CardTitle>
              <CardDescription>Manage and track all gym announcements</CardDescription>
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              disabled={loading}
              onClick={loadAnnouncements}
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <AnnouncementsLoading />
          ) : announcements.length === 0 ? (
            <AnnouncementsEmpty />
          ) : (
            <AnnouncementsTable
              announcements={announcements}
              onEdit={onEdit}
              onView={handleView}
              onDelete={handleDelete}
              onResend={handleResend}
            />
          )}
        </CardContent>
      </Card>

      <AnnouncementDetailDialog
        announcement={selectedAnnouncement}
        isOpen={detailDialogOpen}
        onClose={() => setDetailDialogOpen(false)}
      />
    </>
  );
};

export default AnnouncementsList;
