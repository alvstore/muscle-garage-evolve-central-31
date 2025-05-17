
import React, { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { User, FileText, DollarSign, BanknoteIcon } from 'lucide-react';
import { supabase } from '@/services/supabaseClient';
import { useBranch } from '@/hooks/use-branches';
import { formatCurrency } from '@/utils/stringUtils';

const StatCard = ({ label, value, icon: Icon, loading = false }: { label: string; value: string | number; icon: any; loading?: boolean }) => (
  <div className="flex items-center justify-between p-6 bg-white rounded-lg shadow-sm">
    <div className="flex items-center gap-3">
      <div className="p-3 bg-gray-50 rounded-md">
        <Icon className="w-6 h-6 text-gray-600" />
      </div>
      <div>
        {loading ? (
          <div className="h-7 w-16 bg-gray-200 rounded animate-pulse"></div>
        ) : (
          <p className="text-2xl font-semibold">{value}</p>
        )}
        <p className="text-sm text-gray-500">{label}</p>
      </div>
    </div>
  </div>
);

export const InvoiceStatsOverview = () => {
  const [stats, setStats] = useState({
    clients: 0,
    invoices: 0,
    paid: 0,
    unpaid: 0
  });
  const [loading, setLoading] = useState(true);
  const { currentBranch } = useBranch();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        
        // Fetch total number of unique clients with invoices
        const clientsQuery = supabase
          .from('invoices')
          .select('member_id', { count: 'exact', head: true })
          .eq('branch_id', currentBranch?.id || '')
          .not('member_id', 'is', null);
        
        const { count: clientsCount, error: clientsError } = await clientsQuery;
        
        if (clientsError) throw clientsError;
        
        // Fetch total invoices
        const invoicesQuery = supabase
          .from('invoices')
          .select('id', { count: 'exact', head: true })
          .eq('branch_id', currentBranch?.id || '');
          
        const { count: invoicesCount, error: invoicesError } = await invoicesQuery;
        
        if (invoicesError) throw invoicesError;
        
        // Fetch paid amount sum
        const { data: paidData, error: paidError } = await supabase
          .from('invoices')
          .select('amount')
          .eq('branch_id', currentBranch?.id || '')
          .eq('status', 'paid');
          
        if (paidError) throw paidError;
        
        const paidSum = paidData.reduce((sum, invoice) => sum + (invoice.amount || 0), 0);
        
        // Fetch unpaid amount sum (pending and overdue)
        const { data: unpaidData, error: unpaidError } = await supabase
          .from('invoices')
          .select('amount')
          .eq('branch_id', currentBranch?.id || '')
          .in('status', ['pending', 'overdue', 'partial']);
          
        if (unpaidError) throw unpaidError;
        
        const unpaidSum = unpaidData.reduce((sum, invoice) => sum + (invoice.amount || 0), 0);
        
        setStats({
          clients: clientsCount || 0,
          invoices: invoicesCount || 0,
          paid: paidSum || 0,
          unpaid: unpaidSum || 0
        });
        
      } catch (error) {
        console.error('Error fetching invoice statistics:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchStats();
    
    // Set up real-time subscription
    const channel = supabase
      .channel('invoice_stats_changes')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'invoices',
          ...(currentBranch?.id ? { filter: `branch_id=eq.${currentBranch.id}` } : {})
        }, 
        () => {
          fetchStats();
        }
      )
      .subscribe();
      
    return () => {
      supabase.removeChannel(channel);
    };
  }, [currentBranch]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
      <StatCard label="Clients" value={stats.clients} icon={User} loading={loading} />
      <StatCard label="Invoices" value={stats.invoices} icon={FileText} loading={loading} />
      <StatCard label="Paid" value={formatCurrency(stats.paid)} icon={DollarSign} loading={loading} />
      <StatCard label="Unpaid" value={formatCurrency(stats.unpaid)} icon={BanknoteIcon} loading={loading} />
    </div>
  );
};
