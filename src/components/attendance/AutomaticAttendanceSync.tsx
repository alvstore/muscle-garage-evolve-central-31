
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, RefreshCw, Check, AlertCircle, Clock } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import { v4 as uuidv4 } from 'uuid';

interface BiometricAttendanceRecord {
  id: string;
  member_id: string;
  timestamp: string;
  device_id: string;
  status: 'check-in' | 'check-out';
}

interface AutomaticAttendanceSyncProps {
  memberId?: string;
  showAll?: boolean;
  limit?: number;
  className?: string;
}

const AutomaticAttendanceSync: React.FC<AutomaticAttendanceSyncProps> = ({ 
  memberId, 
  showAll = false,
  limit = 5,
  className = ''
}) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState<Date | null>(null);
  const [attendanceRecords, setAttendanceRecords] = useState<BiometricAttendanceRecord[]>([]);

  const fetchAttendanceRecords = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from('attendance')
        .select('*')
        .order('check_in_time', { ascending: false });
      
      if (memberId) {
        query = query.eq('member_id', memberId);
      }
      
      if (!showAll) {
        query = query.limit(limit);
      }
      
      const { data, error } = await query;
      
      if (error) {
        throw error;
      }
      
      setAttendanceRecords(data || []);
      setLastSyncTime(new Date());
    } catch (error: any) {
      console.error('Error fetching attendance records:', error);
      toast.error({
        title: 'Error',
        description: 'Failed to fetch attendance records'
      });
    } finally {
      setLoading(false);
    }
  };

  const syncBiometricData = async () => {
    setSyncing(true);
    try {
      // Simulate API call to biometric system
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast.success({
        title: 'Sync Complete',
        description: 'Attendance data has been synchronized from biometric devices'
      });
      
      // Refresh attendance records after sync
      await fetchAttendanceRecords();
    } catch (error: any) {
      console.error('Error syncing biometric data:', error);
      toast.error({
        title: 'Sync Failed',
        description: error.message || 'Failed to sync attendance data from biometric devices'
      });
    } finally {
      setSyncing(false);
    }
  };

  useEffect(() => {
    fetchAttendanceRecords();
    
    // Set up polling for automatic sync every 5 minutes
    const intervalId = setInterval(() => {
      fetchAttendanceRecords();
    }, 5 * 60 * 1000);
    
    return () => clearInterval(intervalId);
  }, [memberId, limit, showAll]);

  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Biometric Attendance</CardTitle>
            <CardDescription>
              Automatically synced from biometric devices
            </CardDescription>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700"
            onClick={syncBiometricData}
            disabled={syncing}
          >
            {syncing ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Syncing...
              </>
            ) : (
              <>
                <RefreshCw className="h-4 w-4 mr-2" />
                Sync Now
              </>
            )}
          </Button>
        </div>
        {lastSyncTime && (
          <p className="text-xs text-muted-foreground mt-1">
            Last synced: {format(lastSyncTime, 'MMM dd, yyyy HH:mm:ss')}
          </p>
        )}
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : attendanceRecords.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground">No attendance records found</p>
          </div>
        ) : (
          <div className="space-y-4">
            {attendanceRecords.map((record) => (
              <div key={record.id} className="flex items-center justify-between border-b pb-3">
                <div className="flex items-center gap-3">
                  <div className="flex flex-col">
                    <span className="font-medium">
                      {format(new Date(record.timestamp), 'MMM dd, yyyy')}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      {format(new Date(record.timestamp), 'hh:mm a')}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      Device ID: {record.device_id}
                    </span>
                  </div>
                </div>
                <Badge 
                  variant="outline" 
                  className={
                    record.status === 'check-in'
                      ? "bg-green-50 text-green-700 border-green-200"
                      : "bg-blue-50 text-blue-700 border-blue-200"
                  }
                >
                  {record.status === 'check-in' ? (
                    <Check className="h-3 w-3 mr-1" />
                  ) : (
                    <Clock className="h-3 w-3 mr-1" />
                  )}
                  {record.status === 'check-in' ? 'Check In' : 'Check Out'}
                </Badge>
              </div>
            ))}
          </div>
        )}
      </CardContent>
      {showAll && attendanceRecords.length > 0 && (
        <CardFooter className="flex justify-center pt-2">
          <Button 
            variant="outline" 
            size="sm"
            className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700"
            onClick={() => fetchAttendanceRecords()}
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};

export default AutomaticAttendanceSync;
