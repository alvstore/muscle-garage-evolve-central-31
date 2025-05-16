import React from 'react';
import { Lead } from '@/types/crm';

export interface LeadConversionProps {
  lead: Lead;
  onSuccess?: () => void;
  onCancel?: () => void;
}

const LeadConversion: React.FC<LeadConversionProps> = ({ lead, onSuccess, onCancel }) => {
  return (
    <div>
      <p>Converting lead {lead.name} to a member...</p>
      <p>This feature is under development.</p>
      <button onClick={onSuccess}>Convert</button>
      <button onClick={onCancel}>Cancel</button>
    </div>
  );
};

export default LeadConversion;
