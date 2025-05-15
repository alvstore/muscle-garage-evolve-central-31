
import { format, parseISO } from "date-fns";
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
import { MoreVertical, Eye, Pencil, RefreshCw, Trash2 } from "lucide-react";
import { Announcement } from "@/types/notification";
import { usePermissions } from "@/hooks/use-permissions";

interface AnnouncementsTableProps {
  announcements: Announcement[];
  onEdit: (announcement: Announcement) => void;
  onView: (announcement: Announcement) => void;
  onDelete: (id: string) => void;
  onResend: (id: string) => void;
}

const AnnouncementsTable = ({
  announcements,
  onEdit,
  onView,
  onDelete,
  onResend,
}: AnnouncementsTableProps) => {
  const { userRole } = usePermissions();
  const canEdit = userRole !== 'member';
  const canResend = userRole === 'admin' || userRole === 'staff';

  return (
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
                  {announcement.target_roles?.map((role) => (
                    <Badge key={role} variant="outline" className="capitalize">
                      {role}
                    </Badge>
                  ))}
                </div>
              </TableCell>
              <TableCell>
                <div className="flex flex-wrap gap-1">
                  {announcement.channels?.map((channel) => (
                    <Badge key={channel} variant="secondary" className="capitalize">
                      {channel}
                    </Badge>
                  ))}
                </div>
              </TableCell>
              <TableCell>{format(parseISO(announcement.created_at), "MMM dd, yyyy")}</TableCell>
              <TableCell>
                {announcement.expires_at 
                  ? format(parseISO(announcement.expires_at), "MMM dd, yyyy")
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
                    <DropdownMenuItem onClick={() => onView(announcement)}>
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
                      <DropdownMenuItem onClick={() => onResend(announcement.id)}>
                        <RefreshCw className="h-4 w-4 mr-2" />
                        Resend
                      </DropdownMenuItem>
                    )}
                    
                    {canEdit && (
                      <DropdownMenuItem 
                        onClick={() => onDelete(announcement.id)}
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
  );
};

export default AnnouncementsTable;
