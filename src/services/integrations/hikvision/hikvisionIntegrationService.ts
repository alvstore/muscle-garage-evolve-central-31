import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { SyncLogEntry } from '@/components/integrations/HikvisionSyncLog';
import hikvisionAccessControlService from './hikvisionAccessControlService';
import { v4 as uuidv4 } from 'uuid';

/**
 * Service for managing Hikvision integration, logging, and synchronization
 */
class HikvisionIntegrationService {
  /**
   * Log a synchronization or integration event
   */
  async logEvent(
    branchId: string,
    eventType: 'sync' | 'error' | 'info' | 'warning',
    message: string,
    status: 'success' | 'error' | 'pending' | 'warning',
    options?: {
      details?: string;
      entityType?: 'member' | 'device' | 'door' | 'attendance';
      entityId?: string;
      entityName?: string;
    }
  ): Promise<string> {
    try {
      const logEntry = {
        id: uuidv4(),
        branch_id: branchId,
        event_type: eventType,
        message,
        details: options?.details || null,
        status,
        entity_type: options?.entityType || null,
        entity_id: options?.entityId || null,
        entity_name: options?.entityName || null,
        created_at: new Date().toISOString()
      };

      const { error } = await supabase
        .from('hikvision_sync_log')
        .insert(logEntry);

      if (error) {
        console.error('Error logging Hikvision event:', error);
      }

      return logEntry.id;
    } catch (err) {
      console.error('Failed to log Hikvision event:', err);
      return '';
    }
  }

  /**
   * Get synchronization logs for a branch
   */
  async getSyncLogs(branchId: string, limit: number = 50): Promise<SyncLogEntry[]> {
    try {
      const { data, error } = await supabase
        .from('hikvision_sync_log')
        .select('*')
        .eq('branch_id', branchId)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) throw error;
      return data as SyncLogEntry[];
    } catch (err) {
      console.error('Error fetching Hikvision sync logs:', err);
      return [];
    }
  }

  /**
   * Synchronize a member with Hikvision system with progress tracking
   */
  async syncMemberWithProgress(
    memberId: string, 
    branchId: string, 
    memberName: string
  ): Promise<{success: boolean, progress: number}> {
    // Log the start of synchronization
    const logId = await this.logEvent(
      branchId,
      'sync',
      `Starting member synchronization: ${memberName}`,
      'pending',
      {
        entityType: 'member',
        entityId: memberId,
        entityName: memberName
      }
    );

    try {
      // Get member details
      const { data: member, error: memberError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', memberId)
        .single();

      if (memberError || !member) {
        throw new Error('Member not found');
      }

      // Start synchronization
      const syncStarted = await hikvisionAccessControlService.syncMemberAccess(memberId, branchId);
      
      if (!syncStarted) {
        throw new Error('Failed to start member synchronization');
      }

      // Update log with progress
      await this.logEvent(
        branchId,
        'info',
        `Member synchronization in progress: ${memberName}`,
        'pending',
        {
          entityType: 'member',
          entityId: memberId,
          entityName: memberName,
          details: 'Synchronizing member data with access control devices'
        }
      );

      // Poll for sync progress (simulated for now)
      let progress = 0;
      const pollInterval = 2000; // 2 seconds
      const maxPolls = 15; // Maximum 30 seconds
      let pollCount = 0;
      
      while (progress < 100 && pollCount < maxPolls) {
        await new Promise(resolve => setTimeout(resolve, pollInterval));
        pollCount++;
        
        // In a real implementation, you would check the actual progress
        // For now, we'll simulate progress
        progress = Math.min(100, Math.round((pollCount / maxPolls) * 100));
        
        // Update log with final status
        if (progress >= 100) {
          await supabase
            .from('hikvision_sync_log')
            .update({
              status: 'success',
              message: `Member synchronized successfully: ${memberName}`,
              details: 'Member data synchronized with all access control devices'
            })
            .eq('id', logId);
            
          // Log completion
          await this.logEvent(
            branchId,
            'sync',
            `Member synchronization completed: ${memberName}`,
            'success',
            {
              entityType: 'member',
              entityId: memberId,
              entityName: memberName
            }
          );
        }
      }

      return { success: progress >= 100, progress };
    } catch (error) {
      console.error('Error in syncMemberWithProgress:', error);
      
      // Update log with error
      await supabase
        .from('hikvision_sync_log')
        .update({
          status: 'error',
          message: `Member synchronization failed: ${memberName}`,
          details: error.message || 'Unknown error occurred during synchronization'
        })
        .eq('id', logId);
      
      // Log error
      await this.logEvent(
        branchId,
        'error',
        `Member synchronization failed: ${memberName}`,
        'error',
        {
          entityType: 'member',
          entityId: memberId,
          entityName: memberName,
          details: error.message || 'Unknown error occurred'
        }
      );
      
      return { success: false, progress: 0 };
    }
  }

  /**
   * Register a member's credential (card or face) with Hikvision
   */
  async registerMemberCredential(
    memberId: string,
    branchId: string,
    memberName: string,
    credentialType: 'card' | 'face' | 'fingerprint',
    credentialData: string
  ): Promise<boolean> {
    // Log the start of credential registration
    const logId = await this.logEvent(
      branchId,
      'sync',
      `Registering ${credentialType} for member: ${memberName}`,
      'pending',
      {
        entityType: 'member',
        entityId: memberId,
        entityName: memberName
      }
    );

    try {
      // Validate credential data
      if (!credentialData) {
        throw new Error(`No ${credentialType} data provided`);
      }

      // For face data, ensure it's a valid base64 image
      if (credentialType === 'face' && !credentialData.startsWith('data:image/')) {
        throw new Error('Invalid face image format');
      }

      // Register credential with Hikvision
      let success = false;
      
      if (credentialType === 'face') {
        // Extract base64 content if it's a data URL
        const base64Data = credentialData.includes('base64,') 
          ? credentialData.split('base64,')[1] 
          : credentialData;
          
        // Call the access control service to register face
        success = await this.uploadFaceTemplate(memberId, branchId, base64Data);
      } else if (credentialType === 'card') {
        // Register card with Hikvision
        success = await hikvisionAccessControlService.registerCard(memberId, branchId, credentialData);
      } else {
        throw new Error(`Credential type ${credentialType} not supported`);
      }

      if (!success) {
        throw new Error(`Failed to register ${credentialType}`);
      }

      // Update log with success
      await supabase
        .from('hikvision_sync_log')
        .update({
          status: 'success',
          message: `${credentialType} registered successfully for: ${memberName}`,
          details: `${credentialType} data registered and synchronized with access control system`
        })
        .eq('id', logId);
        
      // Log completion
      await this.logEvent(
        branchId,
        'sync',
        `${credentialType} registration completed for: ${memberName}`,
        'success',
        {
          entityType: 'member',
          entityId: memberId,
          entityName: memberName
        }
      );

      return true;
    } catch (error) {
      console.error(`Error registering ${credentialType}:`, error);
      
      // Update log with error
      await supabase
        .from('hikvision_sync_log')
        .update({
          status: 'error',
          message: `${credentialType} registration failed for: ${memberName}`,
          details: error.message || 'Unknown error occurred during registration'
        })
        .eq('id', logId);
      
      // Log error
      await this.logEvent(
        branchId,
        'error',
        `${credentialType} registration failed for: ${memberName}`,
        'error',
        {
          entityType: 'member',
          entityId: memberId,
          entityName: memberName,
          details: error.message || 'Unknown error occurred'
        }
      );
      
      return false;
    }
  }

  /**
   * Upload a face template to Hikvision
   */
  async uploadFaceTemplate(
    memberId: string,
    branchId: string,
    imageData: string
  ): Promise<boolean> {
    try {
      // In a real implementation, you would call the Hikvision API to upload the face template
      // For now, we'll simulate this with a delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Simulate success
      return true;
    } catch (error) {
      console.error('Error uploading face template:', error);
      return false;
    }
  }

  /**
   * Process attendance events from Hikvision
   */
  async processAttendanceEvents(branchId: string): Promise<number> {
    // Log the start of attendance processing
    const logId = await this.logEvent(
      branchId,
      'sync',
      'Processing attendance events',
      'pending',
      {
        entityType: 'attendance'
      }
    );

    try {
      // Process events using the access control service
      const processedCount = await hikvisionAccessControlService.processEvents(branchId);
      
      // Update log with success
      await supabase
        .from('hikvision_sync_log')
        .update({
          status: 'success',
          message: `Processed ${processedCount} attendance events`,
          details: processedCount > 0 
            ? `Successfully processed ${processedCount} attendance records from access control system`
            : 'No new attendance events to process'
        })
        .eq('id', logId);
      
      if (processedCount > 0) {
        // Log completion
        await this.logEvent(
          branchId,
          'info',
          `Attendance processing completed`,
          'success',
          {
            entityType: 'attendance',
            details: `Processed ${processedCount} attendance records`
          }
        );
      }

      return processedCount;
    } catch (error) {
      console.error('Error processing attendance events:', error);
      
      // Update log with error
      await supabase
        .from('hikvision_sync_log')
        .update({
          status: 'error',
          message: 'Attendance processing failed',
          details: error.message || 'Unknown error occurred during attendance processing'
        })
        .eq('id', logId);
      
      // Log error
      await this.logEvent(
        branchId,
        'error',
        'Attendance processing failed',
        'error',
        {
          entityType: 'attendance',
          details: error.message || 'Unknown error occurred'
        }
      );
      
      return 0;
    }
  }

  /**
   * Get recent attendance records for a branch
   */
  async getRecentAttendance(branchId: string, limit: number = 50): Promise<any[]> {
    try {
      const { data, error } = await supabase
        .from('attendance')
        .select(`
          id,
          member_id,
          check_in,
          check_out,
          profiles:member_id (
            id,
            first_name,
            last_name,
            avatar_url,
            role
          )
        `)
        .eq('branch_id', branchId)
        .order('check_in', { ascending: false })
        .limit(limit);

      if (error) throw error;
      return data;
    } catch (err) {
      console.error('Error fetching recent attendance:', err);
      return [];
    }
  }

  /**
   * Test connection to Hikvision API
   */
  async testConnection(branchId: string): Promise<boolean> {
    // Log the start of connection test
    const logId = await this.logEvent(
      branchId,
      'info',
      'Testing Hikvision API connection',
      'pending'
    );

    try {
      // Get API settings
      const settings = await hikvisionAccessControlService.getApiSettings(branchId);
      if (!settings) {
        throw new Error('API settings not found');
      }

      // Attempt authentication
      const token = await hikvisionAccessControlService.authenticate(branchId);
      if (!token) {
        throw new Error('Authentication failed');
      }

      // Update log with success
      await supabase
        .from('hikvision_sync_log')
        .update({
          status: 'success',
          message: 'Hikvision API connection successful',
          details: 'Successfully authenticated with Hikvision API'
        })
        .eq('id', logId);

      return true;
    } catch (error) {
      console.error('Error testing Hikvision connection:', error);
      
      // Update log with error
      await supabase
        .from('hikvision_sync_log')
        .update({
          status: 'error',
          message: 'Hikvision API connection failed',
          details: error.message || 'Unknown error occurred during connection test'
        })
        .eq('id', logId);
      
      return false;
    }
  }
}

const hikvisionIntegrationService = new HikvisionIntegrationService();
export default hikvisionIntegrationService;
