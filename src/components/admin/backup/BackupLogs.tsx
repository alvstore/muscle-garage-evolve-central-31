
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { BackupLogEntry } from '@/types/notification';
import { getBackupLogs } from '@/services/backupService';
import BackupLogsHeader from './BackupLogsHeader';
import BackupLogsFilters from './BackupLogsFilters';
import BackupLogsTable from './BackupLogsTable';
import BackupLogsFooter from './BackupLogsFooter';

const BackupLogs = () => {
  const [logs, setLogs] = useState<BackupLogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentTab, setCurrentTab] = useState('all');

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const backupLogs = await getBackupLogs();
      setLogs(backupLogs);
    } catch (error) {
      console.error('Failed to fetch backup logs:', error);
      setLogs([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredLogs = logs
    .filter(log => {
      if (currentTab === 'all') return true;
      return log.action === currentTab;
    })
    .filter(log => {
      if (filter === 'all') return true;
      if (filter === 'success') return log.success;
      if (filter === 'failed') return !log.success;
      return true;
    })
    .filter(log => {
      if (!searchTerm) return true;
      const term = searchTerm.toLowerCase();
      return (
        log.user_name.toLowerCase().includes(term) ||
        log.modules.some(m => m.toLowerCase().includes(term))
      );
    });

  return (
    <div className="space-y-6">
      <BackupLogsHeader />
      
      <Card className="overflow-hidden">
        <div className="p-4 border-b">
          <BackupLogsFilters
            currentTab={currentTab}
            setCurrentTab={setCurrentTab}
            filter={filter}
            setFilter={setFilter}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
          />
        </div>
        
        <div className="max-h-[500px] overflow-auto">
          <BackupLogsTable logs={filteredLogs} loading={loading} />
        </div>
      </Card>
      
      <BackupLogsFooter />
    </div>
  );
};

export default BackupLogs;
