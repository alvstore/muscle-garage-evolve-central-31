import { toast } from 'sonner';
import api from '../../api';
import { HikvisionEvent, HikvisionCredentials } from './hikvisionService';

export interface WebhookConfig {
  enabled: boolean;
  endpoint: string;
  secret: string;
}

export const hikvisionWebhookService = {
  // Add these property declarations
  isPolling: false,
  lastOffset: null as string | null,
  
  /**
   * Get stored API credentials
   */
  async getCredentials(): Promise<HikvisionCredentials | null> {
    // In a real app, this would get from secure storage or API
    const credentials = localStorage.getItem('hikvision_credentials');
    return credentials ? JSON.parse(credentials) : null;
  },
  
  /**
   * Authenticate with Hikvision API and get access token
   */
  async authenticate(credentials?: HikvisionCredentials): Promise<{accessToken: string, expiresIn: number} | null> {
    try {
      // Use provided credentials or get stored ones
      const creds = credentials || await this.getCredentials();
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
   * Subscribe to message queue for events
   */
  async subscribeToEvents(): Promise<boolean> {
    try {
      const credentials = await this.getCredentials();
      if (!credentials) {
        throw new Error('No credentials found');
      }
      
      const authResult = await this.authenticate(credentials);
      if (!authResult) {
        throw new Error('Authentication failed');
      }
      
      const response = await fetch(`${credentials.apiUrl}/api/hpcgw/v1/mq/subscribe`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authResult.accessToken}`
        },
        body: JSON.stringify({
          topics: ['ACS_EVENT', 'FACE_MATCH']
        })
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Failed to subscribe to events: ${JSON.stringify(errorData)}`);
      }
      
      return true;
    } catch (error) {
      console.error('Failed to subscribe to events:', error);
      return false;
    }
  },  // Add this comma here
  
  /**
   * Poll for messages (long polling)
   */
  async pollMessages(): Promise<any[]> {
    if (this.isPolling) return [];
    
    this.isPolling = true;
    
    try {
      const credentials = await this.getCredentials();
      if (!credentials) {
        throw new Error('No credentials found');
      }
      
      const authResult = await this.authenticate(credentials);
      if (!authResult) {
        throw new Error('Authentication failed');
      }
      
      const response = await fetch(`${credentials.apiUrl}/api/hpcgw/v1/mq/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authResult.accessToken}`
        },
        body: JSON.stringify({
          offset: this.lastOffset,
          maxReturnNum: 10
        })
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Failed to poll messages: ${JSON.stringify(errorData)}`);
      }
      
      const data = await response.json();
      
      if (data.messages && data.messages.length > 0) {
        // Update the last offset
        this.lastOffset = data.messages[data.messages.length - 1].offset;
        
        // Process the messages
        await this.processMessages(data.messages);
        
        // Acknowledge the offset
        await this.acknowledgeOffset(this.lastOffset);
      }
      
      return data.messages || [];
    } catch (error) {
      console.error('Failed to poll messages:', error);
      return [];
    } finally {
      this.isPolling = false;
    }
  },  // Add this comma here
  
  /**
   * Process received messages
   */
  async processMessages(messages: any[]): Promise<void> {  // Remove 'private' keyword
    try {
      // Send the messages to the backend for processing
      await api.post('/integrations/hikvision/process-events', { messages });
    } catch (error) {
      console.error('Failed to process messages:', error);
    }
  },  // Add this comma here
  
  /**
   * Acknowledge message offset
   */
  async acknowledgeOffset(offset: string): Promise<boolean> {
    try {
      const credentials = await this.getCredentials();
      if (!credentials) {
        throw new Error('No credentials found');
      }
      
      const authResult = await this.authenticate(credentials);
      if (!authResult) {
        throw new Error('Authentication failed');
      }
      
      const response = await fetch(`${credentials.apiUrl}/api/hpcgw/v1/mq/offset`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authResult.accessToken}`
        },
        body: JSON.stringify({
          offset: offset
        })
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Failed to acknowledge offset: ${JSON.stringify(errorData)}`);
      }
      
      return true;
    } catch (error) {
      console.error('Failed to acknowledge offset:', error);
      return false;
    }
  }
};