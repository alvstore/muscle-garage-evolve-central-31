
import React from 'react';
import { Branch } from '@/types/branch';

interface BranchInfoProps {
  branch: Branch | null;
}

const BranchInfo = ({ branch }: BranchInfoProps) => {
  if (!branch) return null;

  return (
    <div className="mb-4 p-3 bg-blue-50 rounded-md text-blue-700">
      <p className="text-sm font-medium">
        Viewing feedback for branch: {branch.name}
      </p>
    </div>
  );
};

export default BranchInfo;
