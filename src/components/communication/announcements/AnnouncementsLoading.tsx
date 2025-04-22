
import { Loader2 } from "lucide-react";

const AnnouncementsLoading = () => {
  return (
    <div className="h-80 flex items-center justify-center">
      <div className="text-center">
        <Loader2 className="h-8 w-8 animate-spin mx-auto text-muted-foreground" />
        <p className="mt-2 text-sm text-muted-foreground">Loading announcements...</p>
      </div>
    </div>
  );
};

export default AnnouncementsLoading;
