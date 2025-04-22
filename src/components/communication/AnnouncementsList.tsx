import { useState, useEffect } from "react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { format, parseISO } from "date-fns";
import { Announcement } from "@/types/notification";
import { Megaphone, MoreVertical, Eye, RefreshCw, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { usePermissions } from "@/hooks/use-permissions";

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
    forRoles: ["member", "trainer"], // For compatibility
    createdBy: "admin1" // For compatibility
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
    forRoles: ["member"], // For compatibility
    createdBy: "admin1" // For compatibility
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
    forRoles: ["member", "trainer", "staff"], // For compatibility
    createdBy: "staff1" // For compatibility
  }
];

interface AnnouncementsListProps {
  onEdit: (announcement: Announcement) => void;
}

const AnnouncementsList = ({ onEdit }: AnnouncementsListProps) => {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const { userRole } = usePermissions();

  useEffect(() => {
    setTimeout(() => {
      setAnnouncements(mockAnnouncements);
      setLoading(false);
    }, 1000);
  }, []);

  const handleDelete = (id: string) => {
    setAnnouncements(announcements.filter(a => a.id !== id));
    toast.success("Announcement deleted successfully");
  };

  const handleResend = (id: string) => {
    toast.success("Announcement resent successfully");
  };

  const canEdit = userRole !== 'member';
  const canResend = userRole === 'admin' || userRole === 'staff';

  return (
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
            onClick={() => {
              setLoading(true);
              setTimeout(() => {
                setAnnouncements(mockAnnouncements);
                setLoading(false);
              }, 1000);
            }}
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="h-80 flex items-center justify-center">
            <div className="text-center">
              <div className="h-8 w-8 rounded-full border-4 border-t-primary mx-auto animate-spin"></div>
              <p className="mt-2 text-sm text-muted-foreground">Loading announcements...</p>
            </div>
          </div>
        ) : announcements.length === 0 ? (
          <div className="text-center py-10">
            <Megaphone className="h-10 w-10 mx-auto text-muted-foreground" />
            <h3 className="mt-4 text-lg font-medium">No announcements</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Create your first announcement to notify members and staff
            </p>
          </div>
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Target</TableHead>
                  <TableHead>Channels</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Expires</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {announcements.map((announcement) => (
                  <TableRow key={announcement.id}>
                    <TableCell className="font-medium">{announcement.title}</TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {announcement.targetRoles.map((role) => (
                          <Badge key={role} variant="outline" className="capitalize">
                            {role}
                          </Badge>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {announcement.channels.map((channel) => (
                          <Badge key={channel} variant="secondary" className="capitalize">
                            {channel}
                          </Badge>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>{format(parseISO(announcement.createdAt), "MMM dd, yyyy")}</TableCell>
                    <TableCell>
                      {announcement.expiresAt 
                        ? format(parseISO(announcement.expiresAt), "MMM dd, yyyy")
                        : "Never"
                      }
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => toast.info(`Viewing announcement: ${announcement.title}`)}>
                            <Eye className="h-4 w-4 mr-2" />
                            View
                          </DropdownMenuItem>
                          
                          {canEdit && (
                            <DropdownMenuItem onClick={() => onEdit(announcement)}>
                              <Pencil className="h-4 w-4 mr-2" />
                              Edit
                            </DropdownMenuItem>
                          )}
                          
                          {canResend && (
                            <DropdownMenuItem onClick={() => handleResend(announcement.id)}>
                              <RefreshCw className="h-4 w-4 mr-2" />
                              Resend
                            </DropdownMenuItem>
                          )}
                          
                          {canEdit && (
                            <DropdownMenuItem 
                              onClick={() => handleDelete(announcement.id)}
                              className="text-destructive focus:text-destructive"
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AnnouncementsList;
