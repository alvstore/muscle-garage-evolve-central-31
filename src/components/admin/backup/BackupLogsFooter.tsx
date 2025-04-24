
import React from 'react';
import { Archive } from 'lucide-react';

const BackupLogsFooter = () => {
  return (
    <div className="text-sm text-muted-foreground">
      <p>
        <Archive className="h-3.5 w-3.5 inline mr-1" />
        Backup logs are stored for 30 days and then automatically purged.
      </p>
    </div>
  );
};

export default BackupLogsFooter;
