
import React from 'react';

interface BackupLogsHeaderProps {
  title?: string;
}

const BackupLogsHeader = ({ title = "Backup Activity Logs" }: BackupLogsHeaderProps) => {
  return (
    <div className="space-y-1">
      <h3 className="text-xl font-medium">{title}</h3>
      <p className="text-sm text-muted-foreground">
        View a history of all import and export activities
      </p>
    </div>
  );
};

export default BackupLogsHeader;
