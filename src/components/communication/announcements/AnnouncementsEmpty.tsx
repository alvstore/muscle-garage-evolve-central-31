
import { Megaphone } from "lucide-react";

const AnnouncementsEmpty = () => {
  return (
    <div className="text-center py-10">
      <Megaphone className="h-10 w-10 mx-auto text-muted-foreground" />
      <h3 className="mt-4 text-lg font-medium">No announcements found</h3>
      <p className="mt-1 text-sm text-muted-foreground">
        Create your first announcement to notify members and staff
      </p>
    </div>
  );
};

export default AnnouncementsEmpty;
