
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Announcement } from "@/types/notification";
import { format, parseISO } from "date-fns";

interface AnnouncementsProps {
  announcements: Announcement[];
}

const Announcements = ({ announcements }: AnnouncementsProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Announcements</CardTitle>
      </CardHeader>
      <CardContent>
        {announcements.length === 0 ? (
          <p className="text-center text-muted-foreground py-6">No announcements</p>
        ) : (
          <div className="space-y-4">
            {announcements.map((announcement) => (
              <div key={announcement.id} className="space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium">{announcement.title}</h3>
                  <span className="text-xs text-muted-foreground">
                    {format(parseISO(announcement.createdAt), "MMM dd, yyyy")}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">{announcement.content}</p>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default Announcements;
