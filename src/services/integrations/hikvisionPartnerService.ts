
import api from '../api';
import { toast } from 'sonner';
import {
  HikvisionAuthCredentials,
  HikvisionAuthResponse,
  HikvisionDeviceRequest,
  HikvisionDeviceResponse,
  HikvisionChannelResponse,
  HikvisionTransparentRequest,
  HikvisionTransparentResponse,
  HikvisionBatchPropertyRequest,
  HikvisionBatchPropertyResponse,
  HikvisionSubscriptionRequest,
  HikvisionSubscriptionResponse,
  HikvisionEventsResponse,
  HikvisionOffsetRequest,
  HikvisionPerson,
  HikvisionPersonResponse,
  HikvisionAccessPrivilege,
  HikvisionAccessPrivilegeResponse,
  HikvisionApiResponse
} from '@/types/hikvision';

/**
 * Service for interacting with Hikvision Partner Pro OpenAPI
 */
class HikvisionPartnerService {
  private accessToken: string | null = null;
  private tokenExpiry: number | null = null;
  private areaDomain: string | null = null;
  private baseUrl: string = '/hikvision-proxy'; // Proxy URL to avoid CORS issues
  private credentials: HikvisionAuthCredentials | null = null;

  constructor() {
    // Try to load cached token from localStorage
    const cachedToken = localStorage.getItem('hikvision_partner_token');
    const cachedExpiry = localStorage.getItem('hikvision_partner_expiry');
    const cachedDomain = localStorage.getItem('hikvision_partner_domain');
    const cachedCredentials = localStorage.getItem('hikvision_partner_credentials');

    if (cachedToken && cachedExpiry && cachedDomain) {
      this.accessToken = cachedToken;
      this.tokenExpiry = parseInt(cachedExpiry);
      this.areaDomain = cachedDomain;
    }

    if (cachedCredentials) {
      try {
        this.credentials = JSON.parse(cachedCredentials);
      } catch (error) {
        console.error('Failed to parse Hikvision credentials:', error);
      }
    }
  }

  /**
   * Set API credentials
   * @param credentials Hikvision API credentials
   */
  setCredentials(credentials: HikvisionAuthCredentials): void {
    this.credentials = credentials;
    localStorage.setItem('hikvision_partner_credentials', JSON.stringify(credentials));
  }

  /**
   * Get current auth status
   * @returns Boolean indicating if service is authenticated
   */
  isAuthenticated(): boolean {
    if (!this.accessToken || !this.tokenExpiry) return false;
    
    // Check if token is expired (add a 1-hour buffer)
    const currentTime = Date.now();
    return this.tokenExpiry > (currentTime + 3600000);
  }

  /**
   * Authenticate with Hikvision Partner API
   * @param credentials Optional credentials (uses stored ones if not provided)
   */
  async authenticate(credentials?: HikvisionAuthCredentials): Promise<boolean> {
    try {
      const creds = credentials || this.credentials;
      if (!creds) {
        throw new Error('No credentials provided for authentication');
      }

      const response = await api.post<HikvisionAuthResponse>(
        `${this.baseUrl}/api/hpcgw/v1/token/get`,
        creds
      );

      if (response.data.code !== '0' || !response.data.data?.accessToken) {
        throw new Error(`Authentication failed: ${response.data.msg}`);
      }

      this.accessToken = response.data.data.accessToken;
      this.tokenExpiry = response.data.data.expireTime;
      this.areaDomain = response.data.data.areaDomain;

      // Cache token in localStorage
      localStorage.setItem('hikvision_partner_token', this.accessToken);
      localStorage.setItem('hikvision_partner_expiry', this.tokenExpiry.toString());
      localStorage.setItem('hikvision_partner_domain', this.areaDomain);

      return true;
    } catch (error) {
      console.error('Hikvision authentication error:', error);
      toast.error('Failed to authenticate with Hikvision API');
      return false;
    }
  }

  /**
   * Ensure authentication before making API calls
   */
  private async ensureAuthenticated(): Promise<boolean> {
    if (!this.isAuthenticated()) {
      return await this.authenticate();
    }
    return true;
  }

  /**
   * Get authorization headers for API requests
   */
  private getAuthHeaders(): Record<string, string> {
    if (!this.accessToken) {
      throw new Error('Not authenticated with Hikvision API');
    }

    return {
      'Authorization': `Bearer ${this.accessToken}`,
      'Content-Type': 'application/json'
    };
  }

  /**
   * Add a new device
   * @param deviceData Device information to add
   */
  async addDevice(deviceData: HikvisionDeviceRequest): Promise<string | null> {
    try {
      if (!await this.ensureAuthenticated()) return null;

      const response = await api.post<HikvisionDeviceResponse>(
        `${this.baseUrl}/api/hpcgw/v2/device/add`,
        deviceData,
        { headers: this.getAuthHeaders() }
      );

      if (response.data.code !== '0') {
        throw new Error(`Failed to add device: ${response.data.msg}`);
      }

      toast.success('Device added successfully');
      return response.data.data?.deviceId || null;
    } catch (error) {
      console.error('Error adding device:', error);
      toast.error('Failed to add device');
      return null;
    }
  }

  /**
   * Update device information
   * @param deviceData Updated device data
   */
  async updateDevice(deviceData: HikvisionDeviceRequest): Promise<boolean> {
    try {
      if (!await this.ensureAuthenticated()) return false;
      if (!deviceData.deviceId) {
        throw new Error('Device ID is required for updating a device');
      }

      const response = await api.post<HikvisionApiResponse>(
        `${this.baseUrl}/api/hpcgw/v1/device/update`,
        deviceData,
        { headers: this.getAuthHeaders() }
      );

      if (response.data.code !== '0') {
        throw new Error(`Failed to update device: ${response.data.msg}`);
      }

      toast.success('Device updated successfully');
      return true;
    } catch (error) {
      console.error('Error updating device:', error);
      toast.error('Failed to update device');
      return false;
    }
  }

  /**
   * Delete a device
   * @param deviceId ID of the device to delete
   */
  async deleteDevice(deviceId: string): Promise<boolean> {
    try {
      if (!await this.ensureAuthenticated()) return false;

      const response = await api.post<HikvisionApiResponse>(
        `${this.baseUrl}/api/hpcgw/v1/device/delete`,
        { deviceId },
        { headers: this.getAuthHeaders() }
      );

      if (response.data.code !== '0') {
        throw new Error(`Failed to delete device: ${response.data.msg}`);
      }

      toast.success('Device deleted successfully');
      return true;
    } catch (error) {
      console.error('Error deleting device:', error);
      toast.error('Failed to delete device');
      return false;
    }
  }

  /**
   * List all devices
   * @param pageNo Page number for pagination
   * @param pageSize Number of items per page
   */
  async listDevices(pageNo = 1, pageSize = 20): Promise<HikvisionDevice[]> {
    try {
      if (!await this.ensureAuthenticated()) return [];

      const response = await api.post<HikvisionDeviceResponse>(
        `${this.baseUrl}/api/hpcgw/v1/device/list`,
        { pageNo, pageSize },
        { headers: this.getAuthHeaders() }
      );

      if (response.data.code !== '0') {
        throw new Error(`Failed to list devices: ${response.data.msg}`);
      }

      return response.data.data?.devices || [];
    } catch (error) {
      console.error('Error listing devices:', error);
      toast.error('Failed to retrieve device list');
      return [];
    }
  }

  /**
   * Get device channels
   * @param deviceId ID of the device
   */
  async getDeviceChannels(deviceId: string): Promise<HikvisionDeviceChannel[]> {
    try {
      if (!await this.ensureAuthenticated()) return [];

      const response = await api.post<HikvisionChannelResponse>(
        `${this.baseUrl}/api/hpcgw/v1/device/camera/list`,
        { deviceId },
        { headers: this.getAuthHeaders() }
      );

      if (response.data.code !== '0') {
        throw new Error(`Failed to get device channels: ${response.data.msg}`);
      }

      return response.data.data?.channels || [];
    } catch (error) {
      console.error('Error getting device channels:', error);
      toast.error('Failed to retrieve device channels');
      return [];
    }
  }

  /**
   * Make a transparent API call to a device
   * @param request Transparent request parameters
   * @param method HTTP method to use
   */
  async transparentApiCall(
    request: HikvisionTransparentRequest,
    method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'GET'
  ): Promise<HikvisionTransparentResponse> {
    try {
      if (!await this.ensureAuthenticated()) {
        return { code: '401', msg: 'Not authenticated' };
      }

      const { deviceId, uri, body, params } = request;
      const apiUri = `${this.baseUrl}/api/hpcgw/v1/device/transparent/${uri}`;
      
      const requestConfig = {
        headers: this.getAuthHeaders(),
        params: { ...params, deviceId }
      };

      let response;
      switch (method) {
        case 'POST':
          response = await api.post(apiUri, body, requestConfig);
          break;
        case 'PUT':
          response = await api.put(apiUri, body, requestConfig);
          break;
        case 'DELETE':
          response = await api.delete(apiUri, requestConfig);
          break;
        default:
          response = await api.get(apiUri, requestConfig);
      }

      return response.data;
    } catch (error) {
      console.error('Error in transparent API call:', error);
      toast.error('Device command failed');
      return { code: '500', msg: 'Internal error during API call' };
    }
  }

  /**
   * Get multiple device properties in batch
   * @param request Batch property request
   */
  async getBatchProperties(request: HikvisionBatchPropertyRequest): Promise<HikvisionBatchPropertyResponse> {
    try {
      if (!await this.ensureAuthenticated()) {
        return { code: '401', msg: 'Not authenticated' };
      }

      const response = await api.post<HikvisionBatchPropertyResponse>(
        `${this.baseUrl}/api/hpcgw/v2/device/transparent/otap/multi/prop/get/by/shadow`,
        request,
        { headers: this.getAuthHeaders() }
      );

      return response.data;
    } catch (error) {
      console.error('Error getting batch properties:', error);
      toast.error('Failed to retrieve device properties');
      return { code: '500', msg: 'Internal error during batch property retrieval' };
    }
  }

  /**
   * Set multiple device properties in batch
   * @param request Batch property request
   */
  async setBatchProperties(request: HikvisionBatchPropertyRequest): Promise<HikvisionBatchPropertyResponse> {
    try {
      if (!await this.ensureAuthenticated()) {
        return { code: '401', msg: 'Not authenticated' };
      }

      const response = await api.put<HikvisionBatchPropertyResponse>(
        `${this.baseUrl}/api/hpcgw/v2/device/transparent/otap/multi/prop/put/by/shadow`,
        request,
        { headers: this.getAuthHeaders() }
      );

      return response.data;
    } catch (error) {
      console.error('Error setting batch properties:', error);
      toast.error('Failed to update device properties');
      return { code: '500', msg: 'Internal error during batch property update' };
    }
  }

  /**
   * Subscribe to device events
   * @param request Subscription request
   */
  async subscribeToEvents(request: HikvisionSubscriptionRequest): Promise<HikvisionSubscriptionResponse> {
    try {
      if (!await this.ensureAuthenticated()) {
        return { code: '401', msg: 'Not authenticated' };
      }

      const response = await api.post<HikvisionSubscriptionResponse>(
        `${this.baseUrl}/api/hpcgw/v1/mq/subscribe`,
        request,
        { headers: this.getAuthHeaders() }
      );

      if (response.data.code === '0') {
        toast.success('Successfully subscribed to device events');
      }

      return response.data;
    } catch (error) {
      console.error('Error subscribing to events:', error);
      toast.error('Failed to subscribe to device events');
      return { code: '500', msg: 'Internal error during event subscription' };
    }
  }

  /**
   * Get event messages
   * @param subscriptionId Subscription ID
   * @param maxMessages Maximum number of messages to retrieve
   */
  async getEventMessages(subscriptionId: string, maxMessages = 10): Promise<HikvisionEventsResponse> {
    try {
      if (!await this.ensureAuthenticated()) {
        return { code: '401', msg: 'Not authenticated' };
      }

      const response = await api.post<HikvisionEventsResponse>(
        `${this.baseUrl}/api/hpcgw/v1/mq/messages`,
        { 
          subscriptionId,
          maxMessages 
        },
        { headers: this.getAuthHeaders() }
      );

      return response.data;
    } catch (error) {
      console.error('Error getting event messages:', error);
      return { code: '500', msg: 'Internal error retrieving event messages' };
    }
  }

  /**
   * Acknowledge message offset
   * @param request Offset request
   */
  async acknowledgeMessageOffset(request: HikvisionOffsetRequest): Promise<HikvisionApiResponse> {
    try {
      if (!await this.ensureAuthenticated()) {
        return { code: '401', msg: 'Not authenticated' };
      }

      const response = await api.post<HikvisionApiResponse>(
        `${this.baseUrl}/api/hpcgw/v1/mq/offset`,
        request,
        { headers: this.getAuthHeaders() }
      );

      return response.data;
    } catch (error) {
      console.error('Error acknowledging message offset:', error);
      return { code: '500', msg: 'Internal error acknowledging messages' };
    }
  }

  /**
   * Add a person to cloud attendance
   * @param person Person data
   */
  async addPerson(person: HikvisionPerson): Promise<string | null> {
    try {
      if (!await this.ensureAuthenticated()) return null;

      const response = await api.post<HikvisionPersonResponse>(
        `${this.baseUrl}/api/hpcgw/v1/person/add`,
        person,
        { headers: this.getAuthHeaders() }
      );

      if (response.data.code !== '0') {
        throw new Error(`Failed to add person: ${response.data.msg}`);
      }

      toast.success('Person added successfully');
      return response.data.data?.personId || null;
    } catch (error) {
      console.error('Error adding person:', error);
      toast.error('Failed to add person');
      return null;
    }
  }

  /**
   * Update a person in cloud attendance
   * @param person Updated person data
   */
  async updatePerson(person: HikvisionPerson): Promise<boolean> {
    try {
      if (!await this.ensureAuthenticated()) return false;
      if (!person.personId) {
        throw new Error('Person ID is required for updating a person');
      }

      const response = await api.post<HikvisionApiResponse>(
        `${this.baseUrl}/api/hpcgw/v1/person/update`,
        person,
        { headers: this.getAuthHeaders() }
      );

      if (response.data.code !== '0') {
        throw new Error(`Failed to update person: ${response.data.msg}`);
      }

      toast.success('Person updated successfully');
      return true;
    } catch (error) {
      console.error('Error updating person:', error);
      toast.error('Failed to update person');
      return false;
    }
  }

  /**
   * Delete a person from cloud attendance
   * @param personId ID of the person to delete
   */
  async deletePerson(personId: string): Promise<boolean> {
    try {
      if (!await this.ensureAuthenticated()) return false;

      const response = await api.post<HikvisionApiResponse>(
        `${this.baseUrl}/api/hpcgw/v1/person/delete`,
        { personId },
        { headers: this.getAuthHeaders() }
      );

      if (response.data.code !== '0') {
        throw new Error(`Failed to delete person: ${response.data.msg}`);
      }

      toast.success('Person deleted successfully');
      return true;
    } catch (error) {
      console.error('Error deleting person:', error);
      toast.error('Failed to delete person');
      return false;
    }
  }

  /**
   * Configure access control privileges
   * @param privilege Access privilege configuration
   */
  async configureAccessPrivilege(privilege: HikvisionAccessPrivilege): Promise<string | null> {
    try {
      if (!await this.ensureAuthenticated()) return null;

      const response = await api.post<HikvisionAccessPrivilegeResponse>(
        `${this.baseUrl}/api/hpcgw/v1/acs/privilege/config`,
        privilege,
        { headers: this.getAuthHeaders() }
      );

      if (response.data.code !== '0') {
        throw new Error(`Failed to configure access privilege: ${response.data.msg}`);
      }

      toast.success('Access privilege configured successfully');
      return response.data.data?.privilegeId || null;
    } catch (error) {
      console.error('Error configuring access privilege:', error);
      toast.error('Failed to configure access privilege');
      return null;
    }
  }
}

// Export as singleton instance
export const hikvisionPartnerService = new HikvisionPartnerService();
export default hikvisionPartnerService;
