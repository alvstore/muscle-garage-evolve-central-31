
import api from '../api';
import { toast } from 'sonner';
import { hikvisionProxyService } from './hikvisionProxyService';
import {
  HikvisionAuthCredentials,
  HikvisionAuthResponse,
  HikvisionDeviceRequest,
  HikvisionDeviceResponse,
  HikvisionDevice,
  HikvisionDeviceChannel,
  HikvisionChannelResponse,
  HikvisionTransparentRequest,
  HikvisionTransparentResponse,
  HikvisionPropertyItem,
  HikvisionBatchPropertyRequest,
  HikvisionBatchPropertyResponse,
  HikvisionSubscriptionRequest,
  HikvisionSubscriptionResponse,
  HikvisionEventMessage,
  HikvisionEventsResponse,
  HikvisionPerson,
  HikvisionAccessPrivilege,
  HikvisionApiResponse
} from '@/types/hikvision';

/**
 * Service for managing communications with the Hikvision Partner Pro OpenAPI
 */
class HikvisionPartnerService {
  private accessToken: string | null = null;
  private areaDomain: string | null = null;
  private expireTime: number | null = null;
  private subscriptionId: string | null = null;
  
  /**
   * Initialize the service and check for saved credentials
   */
  constructor() {
    // Check for saved token in localStorage or session
    const savedToken = localStorage.getItem('hikvision_token');
    const savedDomain = localStorage.getItem('hikvision_domain');
    const savedExpireTime = localStorage.getItem('hikvision_expire');
    
    if (savedToken && savedDomain && savedExpireTime) {
      const expireTimeNum = parseInt(savedExpireTime, 10);
      // Only use the saved token if it's not expired
      if (expireTimeNum > Date.now()) {
        this.accessToken = savedToken;
        this.areaDomain = savedDomain;
        this.expireTime = expireTimeNum;
      } else {
        // Clean up expired tokens
        this.clearAuthData();
      }
    }
  }
  
  /**
   * Test if the service can connect to the Hikvision API
   */
  async testConnection(): Promise<boolean> {
    try {
      // If we have a token, test if it's still valid
      if (this.accessToken) {
        // Try to make a simple API call to check token validity
        await this.listDevices();
        return true;
      }
      return false;
    } catch (error) {
      console.error('Hikvision connection test failed:', error);
      return false;
    }
  }
  
  /**
   * Clear authentication data from memory and storage
   */
  private clearAuthData(): void {
    this.accessToken = null;
    this.areaDomain = null;
    this.expireTime = null;
    localStorage.removeItem('hikvision_token');
    localStorage.removeItem('hikvision_domain');
    localStorage.removeItem('hikvision_expire');
  }
  
  /**
   * Save authentication data to memory and storage
   */
  private saveAuthData(token: string, domain: string, expireTime: number): void {
    this.accessToken = token;
    this.areaDomain = domain;
    this.expireTime = expireTime;
    localStorage.setItem('hikvision_token', token);
    localStorage.setItem('hikvision_domain', domain);
    localStorage.setItem('hikvision_expire', expireTime.toString());
  }
  
  /**
   * Authenticate with the Hikvision API using the provided credentials
   * @param credentials API credentials
   */
  async authenticate(credentials: HikvisionAuthCredentials): Promise<boolean> {
    try {
      const response = await hikvisionProxyService.forwardRequest(
        '/api/hpcgw/v1/token/get',
        credentials,
        'POST'
      );
      
      if (response.code === '0' && response.data?.accessToken) {
        const { accessToken, areaDomain, expireTime } = response.data;
        // Convert expireTime to milliseconds and store
        const expiryTimeMs = Date.now() + (expireTime * 1000);
        this.saveAuthData(accessToken, areaDomain, expiryTimeMs);
        return true;
      } else {
        toast.error(`Authentication failed: ${response.msg}`);
        return false;
      }
    } catch (error: any) {
      console.error('Hikvision authentication error:', error);
      toast.error(`Authentication error: ${error.message || 'Unknown error'}`);
      return false;
    }
  }
  
  /**
   * Check if currently authenticated
   */
  isAuthenticated(): boolean {
    return !!(this.accessToken && this.expireTime && this.expireTime > Date.now());
  }
  
  /**
   * Get the current authentication headers
   */
  private getAuthHeaders(): Record<string, string> {
    if (!this.accessToken) {
      throw new Error('Not authenticated with Hikvision API');
    }
    
    return {
      'Authorization': `Bearer ${this.accessToken}`,
    };
  }
  
  /**
   * Add a new device to the system
   * @param device Device information
   */
  async addDevice(device: HikvisionDeviceRequest): Promise<boolean> {
    try {
      const response = await hikvisionProxyService.forwardRequest(
        '/api/hpcgw/v2/device/add',
        device,
        'POST',
        this.getAuthHeaders()
      );
      
      if (response.code === '0') {
        return true;
      } else {
        toast.error(`Failed to add device: ${response.msg}`);
        return false;
      }
    } catch (error: any) {
      console.error('Error adding device:', error);
      toast.error(`Error adding device: ${error.message || 'Unknown error'}`);
      return false;
    }
  }
  
  /**
   * Delete a device from the system
   * @param deviceId Device ID to delete
   */
  async deleteDevice(deviceId: string): Promise<boolean> {
    try {
      const response = await hikvisionProxyService.forwardRequest(
        '/api/hpcgw/v1/device/delete',
        { deviceId },
        'POST',
        this.getAuthHeaders()
      );
      
      if (response.code === '0') {
        return true;
      } else {
        toast.error(`Failed to delete device: ${response.msg}`);
        return false;
      }
    } catch (error: any) {
      console.error('Error deleting device:', error);
      toast.error(`Error deleting device: ${error.message || 'Unknown error'}`);
      return false;
    }
  }
  
  /**
   * Update device information
   * @param device Device information to update
   */
  async updateDevice(device: HikvisionDeviceRequest): Promise<boolean> {
    try {
      const response = await hikvisionProxyService.forwardRequest(
        '/api/hpcgw/v1/device/update',
        device,
        'POST',
        this.getAuthHeaders()
      );
      
      if (response.code === '0') {
        return true;
      } else {
        toast.error(`Failed to update device: ${response.msg}`);
        return false;
      }
    } catch (error: any) {
      console.error('Error updating device:', error);
      toast.error(`Error updating device: ${error.message || 'Unknown error'}`);
      return false;
    }
  }
  
  /**
   * List all devices in the system
   * @param pageNo Optional page number for pagination
   * @param pageSize Optional page size for pagination
   */
  async listDevices(pageNo: number = 1, pageSize: number = 100): Promise<HikvisionDevice[]> {
    try {
      const response: HikvisionDeviceResponse = await hikvisionProxyService.forwardRequest(
        '/api/hpcgw/v1/device/list',
        { pageNo, pageSize },
        'POST',
        this.getAuthHeaders()
      );
      
      if (response.code === '0' && response.data?.devices) {
        return response.data.devices;
      } else {
        toast.error(`Failed to list devices: ${response.msg}`);
        return [];
      }
    } catch (error: any) {
      console.error('Error listing devices:', error);
      toast.error(`Error listing devices: ${error.message || 'Unknown error'}`);
      return [];
    }
  }
  
  /**
   * List all channels for a specific device
   * @param deviceId Device ID to get channels for
   */
  async listDeviceChannels(deviceId: string): Promise<HikvisionDeviceChannel[]> {
    try {
      const response: HikvisionChannelResponse = await hikvisionProxyService.forwardRequest(
        '/api/hpcgw/v1/device/camera/list',
        { deviceId },
        'POST',
        this.getAuthHeaders()
      );
      
      if (response.code === '0' && response.data?.channels) {
        return response.data.channels;
      } else {
        toast.error(`Failed to list channels: ${response.msg}`);
        return [];
      }
    } catch (error: any) {
      console.error('Error listing channels:', error);
      toast.error(`Error listing channels: ${error.message || 'Unknown error'}`);
      return [];
    }
  }
  
  /**
   * Make a transparent API call to a device
   * @param request Transparent API request
   * @param method HTTP method
   */
  async transparentApiCall(
    request: HikvisionTransparentRequest, 
    method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'GET'
  ): Promise<HikvisionTransparentResponse> {
    try {
      const uri = encodeURIComponent(request.uri);
      const endpoint = `/api/hpcgw/v1/device/transparent/${uri}`;
      
      const response = await hikvisionProxyService.forwardRequest(
        endpoint,
        { 
          deviceId: request.deviceId,
          body: request.body,
          params: request.params
        },
        method,
        {
          ...this.getAuthHeaders(),
          ...(request.headers || {})
        }
      );
      
      return response;
    } catch (error: any) {
      console.error('Error in transparent API call:', error);
      toast.error(`API call error: ${error.message || 'Unknown error'}`);
      throw error;
    }
  }
  
  /**
   * Get properties from multiple devices in batch
   * @param properties Property items to retrieve
   */
  async getBatchProperties(properties: HikvisionPropertyItem[]): Promise<HikvisionBatchPropertyResponse> {
    try {
      const request: HikvisionBatchPropertyRequest = {
        properties
      };
      
      const response = await hikvisionProxyService.forwardRequest(
        '/api/hpcgw/v2/device/transparent/otap/multi/prop/get/by/shadow',
        request,
        'POST',
        this.getAuthHeaders()
      );
      
      return response;
    } catch (error: any) {
      console.error('Error getting batch properties:', error);
      toast.error(`Batch properties error: ${error.message || 'Unknown error'}`);
      throw error;
    }
  }
  
  /**
   * Set properties on multiple devices in batch
   * @param properties Property items to set
   */
  async setBatchProperties(properties: HikvisionPropertyItem[]): Promise<HikvisionBatchPropertyResponse> {
    try {
      const request: HikvisionBatchPropertyRequest = {
        properties
      };
      
      const response = await hikvisionProxyService.forwardRequest(
        '/api/hpcgw/v2/device/transparent/otap/multi/prop/put/by/shadow',
        request,
        'PUT',
        this.getAuthHeaders()
      );
      
      return response;
    } catch (error: any) {
      console.error('Error setting batch properties:', error);
      toast.error(`Batch properties error: ${error.message || 'Unknown error'}`);
      throw error;
    }
  }
  
  /**
   * Subscribe to device events
   * @param topics Event topics to subscribe to
   * @param duration Subscription duration in seconds (default: 7 days)
   */
  async subscribeToEvents(
    topics: string[], 
    duration: number = 604800 // 7 days in seconds
  ): Promise<boolean> {
    try {
      const request: HikvisionSubscriptionRequest = {
        topics,
        subscriptionDuration: duration
      };
      
      const response: HikvisionSubscriptionResponse = await hikvisionProxyService.forwardRequest(
        '/api/hpcgw/v1/mq/subscribe',
        request,
        'POST',
        this.getAuthHeaders()
      );
      
      if (response.code === '0' && response.data?.subscriptionId) {
        this.subscriptionId = response.data.subscriptionId;
        return true;
      } else {
        toast.error(`Failed to subscribe to events: ${response.msg}`);
        return false;
      }
    } catch (error: any) {
      console.error('Error subscribing to events:', error);
      toast.error(`Subscription error: ${error.message || 'Unknown error'}`);
      return false;
    }
  }
  
  /**
   * Unsubscribe from events
   */
  async unsubscribeFromEvents(): Promise<boolean> {
    if (!this.subscriptionId) {
      return true; // No subscription to cancel
    }
    
    try {
      const response = await hikvisionProxyService.forwardRequest(
        '/api/hpcgw/v1/mq/unsubscribe',
        { subscriptionId: this.subscriptionId },
        'POST',
        this.getAuthHeaders()
      );
      
      if (response.code === '0') {
        this.subscriptionId = null;
        return true;
      } else {
        toast.error(`Failed to unsubscribe: ${response.msg}`);
        return false;
      }
    } catch (error: any) {
      console.error('Error unsubscribing from events:', error);
      toast.error(`Unsubscribe error: ${error.message || 'Unknown error'}`);
      return false;
    }
  }
  
  /**
   * Get events from the subscription
   * @param lastOffset Last offset for pagination
   * @param maxMessages Maximum number of messages to retrieve
   */
  async getEvents(
    lastOffset?: string, 
    maxMessages: number = 10
  ): Promise<HikvisionEventMessage[]> {
    if (!this.subscriptionId) {
      toast.error('No active subscription for events');
      return [];
    }
    
    try {
      const request: any = {
        subscriptionId: this.subscriptionId,
        maxMessages
      };
      
      if (lastOffset) {
        request.lastOffset = lastOffset;
      }
      
      const response: HikvisionEventsResponse = await hikvisionProxyService.forwardRequest(
        '/api/hpcgw/v1/mq/messages',
        request,
        'POST',
        this.getAuthHeaders()
      );
      
      if (response.code === '0' && response.data?.messages) {
        return response.data.messages;
      } else {
        if (response.code !== '1460') { // 1460 is "no new messages", don't show error for this
          toast.error(`Failed to get events: ${response.msg}`);
        }
        return [];
      }
    } catch (error: any) {
      console.error('Error getting events:', error);
      toast.error(`Events error: ${error.message || 'Unknown error'}`);
      return [];
    }
  }
  
  /**
   * Acknowledge the processing of an event to update the offset
   */
  async acknowledgeEvent(topic: string, offset: string): Promise<boolean> {
    if (!this.subscriptionId) {
      toast.error('No active subscription for events');
      return false;
    }
    
    try {
      const response = await hikvisionProxyService.forwardRequest(
        '/api/hpcgw/v1/mq/offset',
        {
          subscriptionId: this.subscriptionId,
          topic,
          offset
        },
        'POST',
        this.getAuthHeaders()
      );
      
      if (response.code === '0') {
        return true;
      } else {
        toast.error(`Failed to acknowledge event: ${response.msg}`);
        return false;
      }
    } catch (error: any) {
      console.error('Error acknowledging event:', error);
      toast.error(`Acknowledge error: ${error.message || 'Unknown error'}`);
      return false;
    }
  }
  
  /**
   * Add a person to the attendance system
   */
  async addPerson(person: HikvisionPerson): Promise<string | null> {
    try {
      const response: HikvisionApiResponse<{personId: string}> = await hikvisionProxyService.forwardRequest(
        '/api/hpcgw/v1/person/add',
        person,
        'POST',
        this.getAuthHeaders()
      );
      
      if (response.code === '0' && response.data?.personId) {
        return response.data.personId;
      } else {
        toast.error(`Failed to add person: ${response.msg}`);
        return null;
      }
    } catch (error: any) {
      console.error('Error adding person:', error);
      toast.error(`Person error: ${error.message || 'Unknown error'}`);
      return null;
    }
  }
  
  /**
   * Update a person in the attendance system
   */
  async updatePerson(person: HikvisionPerson): Promise<boolean> {
    try {
      const response = await hikvisionProxyService.forwardRequest(
        '/api/hpcgw/v1/person/update',
        person,
        'POST',
        this.getAuthHeaders()
      );
      
      if (response.code === '0') {
        return true;
      } else {
        toast.error(`Failed to update person: ${response.msg}`);
        return false;
      }
    } catch (error: any) {
      console.error('Error updating person:', error);
      toast.error(`Person update error: ${error.message || 'Unknown error'}`);
      return false;
    }
  }
  
  /**
   * Delete a person from the attendance system
   */
  async deletePerson(personId: string): Promise<boolean> {
    try {
      const response = await hikvisionProxyService.forwardRequest(
        '/api/hpcgw/v1/person/delete',
        { personId },
        'POST',
        this.getAuthHeaders()
      );
      
      if (response.code === '0') {
        return true;
      } else {
        toast.error(`Failed to delete person: ${response.msg}`);
        return false;
      }
    } catch (error: any) {
      console.error('Error deleting person:', error);
      toast.error(`Person delete error: ${error.message || 'Unknown error'}`);
      return false;
    }
  }
  
  /**
   * Get a list of persons from the attendance system
   */
  async listPersons(pageNo: number = 1, pageSize: number = 20): Promise<HikvisionPerson[]> {
    try {
      const response: HikvisionApiResponse<{persons: HikvisionPerson[], total: number}> = await hikvisionProxyService.forwardRequest(
        '/api/hpcgw/v1/person/list',
        { pageNo, pageSize },
        'POST',
        this.getAuthHeaders()
      );
      
      if (response.code === '0' && response.data?.persons) {
        return response.data.persons;
      } else {
        toast.error(`Failed to list persons: ${response.msg}`);
        return [];
      }
    } catch (error: any) {
      console.error('Error listing persons:', error);
      toast.error(`Person list error: ${error.message || 'Unknown error'}`);
      return [];
    }
  }
  
  /**
   * Set access privileges for a person
   */
  async setAccessPrivilege(privilege: HikvisionAccessPrivilege): Promise<boolean> {
    try {
      const response = await hikvisionProxyService.forwardRequest(
        '/api/hpcgw/v1/acs/privilege/config',
        privilege,
        'POST',
        this.getAuthHeaders()
      );
      
      if (response.code === '0') {
        return true;
      } else {
        toast.error(`Failed to set access privilege: ${response.msg}`);
        return false;
      }
    } catch (error: any) {
      console.error('Error setting access privilege:', error);
      toast.error(`Privilege error: ${error.message || 'Unknown error'}`);
      return false;
    }
  }
}

export const hikvisionPartnerService = new HikvisionPartnerService();
export default hikvisionPartnerService;
