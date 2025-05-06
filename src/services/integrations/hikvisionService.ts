import api from '../api';
import { toast } from 'sonner';

export interface HikvisionCredentials {
  apiUrl: string;
  username?: string;  // Add username for backwards compatibility
  password?: string;  // Add password for backwards compatibility
  clientId: string;
  clientSecret: string;
  appKey?: string;   // Add for backward compatibility
  secretKey?: string; // Add for backward compatibility
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
  },

  /**
   * Get stored API credentials
   */
  async getStoredCredentials(): Promise<HikvisionCredentials | null> {
    // In a real app, this would get from secure storage or API
    const credentials = localStorage.getItem('hikvision_credentials');
    return credentials ? JSON.parse(credentials) : null;
  },

  /**
   * Authenticate with Hikvision API and get access token
   * @param credentials Hikvision API credentials
   */
  async authenticate(credentials?: HikvisionCredentials): Promise<{accessToken: string, expiresIn: number} | null> {
    try {
      // Use provided credentials or get stored ones
      const creds = credentials || await this.getStoredCredentials();
      if (!creds) {
        throw new Error('No credentials found');
      }
      
      // Using the Partner Cloud Gateway endpoint
      const response = await fetch(`${creds.apiUrl}/api/hpcgw/v1/token/get`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          clientId: creds.clientId,
          clientSecret: creds.clientSecret
        })
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        console.error('Authentication failed:', errorData);
        return null;
      }
      
      const data = await response.json();
      return {
        accessToken: data.accessToken || data.access_token,
        expiresIn: data.expiresIn || data.expires_in || 7200
      };
    } catch (error) {
      console.error('Authentication error:', error);
      return null;
    }
  },

  /**
   * Register a person in Hikvision
   * @param memberId Member ID
   * @param memberName Member name
   * @param gender Member gender
   */
  async registerPerson(memberId: string, memberName: string, gender: string = 'unknown'): Promise<boolean> {
    try {
      const credentials = await this.getStoredCredentials();
      if (!credentials) {
        throw new Error('No credentials found');
      }
      
      const authResult = await this.authenticate(credentials);
      if (!authResult) {
        throw new Error('Authentication failed');
      }
      
      const response = await fetch(`${credentials.apiUrl}/api/hpcgw/v1/person/add`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authResult.accessToken}`
        },
        body: JSON.stringify({
          personId: memberId,
          personName: memberName,
          gender: gender
        })
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Failed to register person: ${JSON.stringify(errorData)}`);
      }
      
      return true;
    } catch (error) {
      console.error('Failed to register person:', error);
      return false;
    }
  },

  /**
   * Configure access privileges for a person
   * @param personId Person ID
   * @param deviceIds Array of device IDs to grant access to
   * @param startTime Start time for access privilege (ISO format)
   * @param endTime End time for access privilege (ISO format)
   */
  async configureAccessPrivileges(personId: string, deviceIds: string[], startTime?: string, endTime?: string): Promise<boolean> {
    try {
      const credentials = await this.getStoredCredentials();
      if (!credentials) {
        throw new Error('No credentials found');
      }
      
      const authResult = await this.authenticate(credentials);
      if (!authResult) {
        throw new Error('Authentication failed');
      }
      
      const response = await fetch(`${credentials.apiUrl}/api/hpcgw/v1/acs/privilege/config`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authResult.accessToken}`
        },
        body: JSON.stringify({
          personId: personId,
          deviceIds: deviceIds,
          startTime: startTime || new Date().toISOString(),
          endTime: endTime || new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString() // Default 1 year
        })
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Failed to configure access privileges: ${JSON.stringify(errorData)}`);
      }
      
      // Synchronize the person data to devices
      await this.synchronizePerson(personId);
      
      return true;
    } catch (error) {
      console.error('Failed to configure access privileges:', error);
      return false;
    }
  },

  /**
   * Synchronize person data to devices
   * @param personId Person ID to synchronize
   */
  async synchronizePerson(personId: string): Promise<boolean> {
    try {
      const credentials = await this.getStoredCredentials();
      if (!credentials) {
        throw new Error('No credentials found');
      }
      
      const authResult = await this.authenticate(credentials);
      if (!authResult) {
        throw new Error('Authentication failed');
      }
      
      const response = await fetch(`${credentials.apiUrl}/api/hpcgw/v1/person/synchronize`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authResult.accessToken}`
        },
        body: JSON.stringify({
          personIds: [personId]
        })
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Failed to synchronize person: ${JSON.stringify(errorData)}`);
      }
      
      return true;
    } catch (error) {
      console.error('Failed to synchronize person:', error);
      return false;
    }
  }
};
