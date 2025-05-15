
import api from '../api';
import { toast } from '@/hooks/use-toast';

/**
 * Service for proxying requests to the Hikvision Partner Pro API
 * This service forwards requests to our backend proxy to avoid CORS issues
 */
class HikvisionProxyService {
  private baseUrl: string = '/api/integrations/proxy/hikvision';

  /**
   * Forward API requests to the Hikvision API through our backend proxy
   * @param endpoint API endpoint path
   * @param data Request data
   * @param method HTTP method
   * @param headers Additional headers
   */
  async forwardRequest(
    endpoint: string, 
    data: any = null, 
    method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'POST',
    headers: Record<string, string> = {}
  ): Promise<any> {
    try {
      const requestConfig = {
        headers: {
          'Content-Type': 'application/json',
          ...headers
        }
      };

      // Construct full URL
      const url = `${this.baseUrl}${endpoint}`;

      console.log(`Sending ${method} request to ${url}`, data);

      let response;
      switch (method) {
        case 'GET':
          response = await api.get(url, { ...requestConfig, params: data });
          break;
        case 'PUT':
          response = await api.put(url, data, requestConfig);
          break;
        case 'DELETE':
          response = await api.delete(url, { ...requestConfig, data });
          break;
        default: // POST
          response = await api.post(url, data, requestConfig);
      }

      // Validate response format
      if (!response.data) {
        console.error('Empty response from Hikvision API');
        throw new Error('Empty response from Hikvision API');
      }
      
      // Check if the response is HTML instead of JSON
      if (typeof response.data === 'string' && response.data.trim().startsWith('<!DOCTYPE html>')) {
        console.error('Received HTML response instead of JSON from Hikvision API');
        throw new Error('Invalid response format from Hikvision API (received HTML instead of JSON)');
      }

      // Check if response data is not an object (might be a string or other type)
      if (typeof response.data !== 'object') {
        console.error('Invalid response format from Hikvision API:', response.data);
        try {
          // Try to parse string response as JSON
          const parsedData = JSON.parse(response.data);
          return parsedData;
        } catch (parseError) {
          throw new Error('Invalid JSON response from Hikvision API');
        }
      }

      return response.data;
    } catch (error: any) {
      console.error('Hikvision proxy error:', error);
      
      // Extract error message
      const errorMessage = error.response?.data?.msg 
        || error.response?.data?.message 
        || error.message 
        || 'Unknown error';
      
      toast.error(`API request failed: ${errorMessage}`);
      throw error;
    }
  }

  /**
   * Test if the proxy is properly configured
   */
  async testProxyConnection(): Promise<boolean> {
    try {
      const response = await api.get(`${this.baseUrl}/status`);
      return response.data?.success === true;
    } catch (error) {
      console.error('Hikvision proxy connection test failed:', error);
      return false;
    }
  }
}

export const hikvisionProxyService = new HikvisionProxyService();
export default hikvisionProxyService;
