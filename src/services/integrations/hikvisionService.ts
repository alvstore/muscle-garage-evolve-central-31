
import api from '../api';
import { toast } from 'sonner';

export interface HikvisionCredentials {
  apiUrl: string;
  username: string;
  password: string;
}

export interface HikvisionEvent {
  eventId: string;
  eventTime: string;
  eventType: 'entry' | 'exit' | 'denied';
  personId: string;
  personName?: string;
  doorId: string;
  doorName?: string;
  deviceId: string;
  deviceName?: string;
  cardNo?: string;
  faceId?: string;
}

/**
 * Service for interacting with Hikvision Access Control system
 */
export const hikvisionService = {
  
  /**
   * Test connection to Hikvision API
   * @param credentials Hikvision API credentials
   */
  async testConnection(credentials: HikvisionCredentials): Promise<boolean> {
    try {
      // In a real app, this would call your backend which would test the connection
      const response = await api.post('/integrations/hikvision/test-connection', credentials);
      return response.data.success;
    } catch (error) {
      console.error('Hikvision connection test failed:', error);
      return false;
    }
  },
  
  /**
   * Get recent events from Hikvision
   * @param startTime Start time for events query
   * @param endTime End time for events query
   * @param limit Maximum number of events to return
   */
  async getEvents(startTime?: string, endTime?: string, limit: number = 50): Promise<HikvisionEvent[]> {
    try {
      const response = await api.get('/integrations/hikvision/events', {
        params: { startTime, endTime, limit }
      });
      return response.data;
    } catch (error) {
      console.error('Failed to fetch Hikvision events:', error);
      toast.error('Failed to fetch access control events');
      return [];
    }
  },
  
  /**
   * Register member card or face in Hikvision
   * @param memberId Member ID
   * @param credentialType Type of credential (card or face)
   * @param credentialData Card number or face image data
   */
  async registerCredential(
    memberId: string, 
    credentialType: 'card' | 'face', 
    credentialData: string
  ): Promise<boolean> {
    try {
      const response = await api.post('/integrations/hikvision/register-credential', {
        memberId,
        credentialType,
        credentialData
      });
      
      if (response.data.success) {
        toast.success(`${credentialType === 'card' ? 'Access card' : 'Face'} registered successfully`);
        return true;
      } else {
        toast.error(response.data.message || 'Failed to register credential');
        return false;
      }
    } catch (error) {
      console.error('Failed to register credential:', error);
      toast.error('Failed to register credential');
      return false;
    }
  },
  
  /**
   * Process attendance from Hikvision events
   * @param events Hikvision events to process
   */
  async processAttendance(events: HikvisionEvent[]): Promise<number> {
    try {
      const response = await api.post('/integrations/hikvision/process-attendance', { events });
      
      if (response.data.success) {
        const count = response.data.processedCount || 0;
        if (count > 0) {
          toast.success(`Processed ${count} attendance records`);
        }
        return count;
      } else {
        toast.error(response.data.message || 'Failed to process attendance');
        return 0;
      }
    } catch (error) {
      console.error('Failed to process attendance:', error);
      toast.error('Failed to process attendance records');
      return 0;
    }
  },
  
  /**
   * Simulate a webhook event from Hikvision (for testing)
   * @param memberId Member ID to simulate event for
   * @param eventType Type of event to simulate
   */
  async simulateEvent(memberId: string, eventType: 'entry' | 'exit' | 'denied'): Promise<HikvisionEvent | null> {
    try {
      const response = await api.post('/integrations/hikvision/simulate-event', {
        memberId,
        eventType
      });
      
      if (response.data.success) {
        return response.data.event;
      } else {
        toast.error(response.data.message || 'Failed to simulate event');
        return null;
      }
    } catch (error) {
      console.error('Failed to simulate Hikvision event:', error);
      toast.error('Failed to simulate access control event');
      return null;
    }
  }
};
