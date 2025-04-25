
import React from 'react';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

interface PermissionFooterProps {
  isLoading: boolean;
  onReset: () => void;
  onSave: () => void;
}

export const PermissionFooter: React.FC<PermissionFooterProps> = ({
  isLoading,
  onReset,
  onSave
}) => {
  return (
    <div className="flex justify-end gap-4">
      <Button variant="outline" onClick={onReset} disabled={isLoading}>
        Reset
      </Button>
      <Button onClick={onSave} disabled={isLoading}>
        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        Save Changes
      </Button>
    </div>
  );
};
