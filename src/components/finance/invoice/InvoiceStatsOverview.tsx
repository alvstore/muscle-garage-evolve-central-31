
import React from 'react';
import { Card } from '@/components/ui/card';
import { User, FileText, DollarSign, BanknoteIcon } from 'lucide-react';

const StatCard = ({ label, value, icon: Icon }: { label: string; value: string | number; icon: any }) => (
  <div className="flex items-center gap-4 p-4 bg-white rounded-lg shadow-sm">
    <div className="p-2 rounded-lg bg-gray-50">
      <Icon className="w-5 h-5 text-gray-600" />
    </div>
    <div>
      <p className="text-2xl font-semibold">{value}</p>
      <p className="text-sm text-gray-500">{label}</p>
    </div>
  </div>
);

export const InvoiceStatsOverview = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
      <StatCard label="Clients" value="24" icon={User} />
      <StatCard label="Invoices" value="165" icon={FileText} />
      <StatCard label="Paid" value="$2.46k" icon={DollarSign} />
      <StatCard label="Unpaid" value="$876" icon={BanknoteIcon} />
    </div>
  );
};
