
import { supabase } from '@/integrations/supabase/client';
import { v4 as uuidv4 } from 'uuid';
import { SyncLogEntry } from '@/components/integrations/HikvisionSyncLog';

const SYNC_LOG_TABLE = 'hikvision_sync_logs';

class HikvisionIntegrationService {
  /**
   * Get sync logs for Hikvision integration
   */
  async getSyncLogs(branchId: string, limit: number = 50): Promise<SyncLogEntry[]> {
    try {
      const { data, error } = await supabase
        .from(SYNC_LOG_TABLE)
        .select('*')
        .eq('branch_id', branchId)
        .order('created_at', { ascending: false })
        .limit(limit);
      
      if (error) {
        console.error('Error fetching Hikvision sync logs:', error);
        throw error;
      }
      
      return data as SyncLogEntry[];
    } catch (error) {
      console.error('Error in getSyncLogs:', error);
      throw error;
    }
  }
  
  /**
   * Create a sync log entry
   */
  async createSyncLog(log: Partial<SyncLogEntry>): Promise<SyncLogEntry> {
    try {
      const entry = {
        id: uuidv4(),
        created_at: new Date().toISOString(),
        ...log
      };
      
      const { data, error } = await supabase
        .from(SYNC_LOG_TABLE)
        .insert(entry)
        .select()
        .single();
      
      if (error) {
        console.error('Error creating Hikvision sync log:', error);
        throw error;
      }
      
      return data as SyncLogEntry;
    } catch (error) {
      console.error('Error in createSyncLog:', error);
      throw error;
    }
  }
  
  /**
   * Log a successful operation
   */
  async logSuccess(
    branchId: string, 
    message: string, 
    details?: string,
    entityType?: 'member' | 'device' | 'door' | 'attendance',
    entityId?: string,
    entityName?: string
  ): Promise<SyncLogEntry> {
    return this.createSyncLog({
      branch_id: branchId,
      event_type: 'sync',
      status: 'success',
      message,
      details,
      entity_type: entityType,
      entity_id: entityId,
      entity_name: entityName
    });
  }
  
  /**
   * Log an error
   */
  async logError(
    branchId: string, 
    message: string, 
    details?: string,
    entityType?: 'member' | 'device' | 'door' | 'attendance',
    entityId?: string,
    entityName?: string
  ): Promise<SyncLogEntry> {
    return this.createSyncLog({
      branch_id: branchId,
      event_type: 'error',
      status: 'error',
      message,
      details,
      entity_type: entityType,
      entity_id: entityId,
      entity_name: entityName
    });
  }
  
  /**
   * Log a warning
   */
  async logWarning(
    branchId: string, 
    message: string, 
    details?: string,
    entityType?: 'member' | 'device' | 'door' | 'attendance',
    entityId?: string,
    entityName?: string
  ): Promise<SyncLogEntry> {
    return this.createSyncLog({
      branch_id: branchId,
      event_type: 'warning',
      status: 'warning',
      message,
      details,
      entity_type: entityType,
      entity_id: entityId,
      entity_name: entityName
    });
  }
  
  /**
   * Log information
   */
  async logInfo(
    branchId: string, 
    message: string, 
    details?: string,
    entityType?: 'member' | 'device' | 'door' | 'attendance',
    entityId?: string,
    entityName?: string
  ): Promise<SyncLogEntry> {
    return this.createSyncLog({
      branch_id: branchId,
      event_type: 'info',
      status: 'success',
      message,
      details,
      entity_type: entityType,
      entity_id: entityId,
      entity_name: entityName
    });
  }
}

const hikvisionIntegrationService = new HikvisionIntegrationService();
export default hikvisionIntegrationService;
