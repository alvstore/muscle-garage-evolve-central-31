
import { useContext } from 'react';
import { BranchContext } from '@/contexts/BranchContext';

export const useBranch = () => useContext(BranchContext);
