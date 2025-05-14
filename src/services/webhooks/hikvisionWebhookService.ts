
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';

class HikvisionWebhookService {
  private apiBaseUrl: string | null = null;
  private appKey: string | null = null;
  private appSecret: string | null = null;
  
  constructor() {
    this.loadCredentials();
  }
  
  private loadCredentials(): void {
    try {
      const credentialsStr = localStorage.getItem('hikvision_credentials');
      if (credentialsStr) {
        const credentials = JSON.parse(credentialsStr);
        this.apiBaseUrl = credentials.apiUrl;
        this.appKey = credentials.appKey || credentials.clientId;
        this.appSecret = credentials.secretKey || credentials.clientSecret;
      }
    } catch (error) {
      console.error('Failed to load Hikvision credentials:', error);
    }
  }
  
  public setCredentials(apiUrl: string, appKey: string, appSecret: string): void {
    try {
      this.apiBaseUrl = apiUrl;
      this.appKey = appKey;
      this.appSecret = appSecret;
      
      // Store credentials in local storage
      localStorage.setItem('hikvision_credentials', JSON.stringify({
        apiUrl,
        appKey,
        secretKey: appSecret
      }));
      
      console.log('Hikvision credentials saved');
    } catch (error) {
      console.error('Failed to save Hikvision credentials:', error);
      throw error;
    }
  }
  
  public clearCredentials(): void {
    try {
      localStorage.removeItem('hikvision_credentials');
      this.apiBaseUrl = null;
      this.appKey = null;
      this.appSecret = null;
      
      console.log('Hikvision credentials cleared');
    } catch (error) {
      console.error('Failed to clear Hikvision credentials:', error);
    }
  }
  
  async subscribeToEvents(branchId: string): Promise<boolean> {
    try {
      // Check if credentials are available
      if (!this.apiBaseUrl || !this.appKey || !this.appSecret) {
        console.error('Hikvision API credentials not found');
        toast({
          title: "Error",
          description: "Hikvision API credentials not found",
          variant: "destructive"
        });
        return false;
      }
      
      // Store webhook subscription information in database
      const { error } = await supabase
        .from('hikvision_webhook_subscriptions')
        .upsert({
          api_url: this.apiBaseUrl,
          app_key: this.appKey,
          branch_id: branchId,
          subscription_type: 'access_control',
          is_active: true,
          updated_at: new Date().toISOString()
        });

      if (error) {
        console.error('Failed to update webhook subscription:', error);
        toast({
          title: "Error",
          description: "Failed to update webhook subscription",
          variant: "destructive"
        });
        return false;
      }
      
      console.log('Subscription to Hikvision events updated successfully');
      toast({
        title: "Success",
        description: "Subscription to Hikvision events updated successfully"
      });
      return true;
    } catch (error) {
      console.error('Failed to subscribe to Hikvision events:', error);
      toast({
        title: "Error",
        description: `Failed to subscribe to Hikvision events: ${error.message}`,
        variant: "destructive"
      });
      return false;
    }
  }
  
  async unsubscribeFromEvents(branchId: string): Promise<boolean> {
    try {
      // Delete webhook subscription information from database
      const { error } = await supabase
        .from('hikvision_webhook_subscriptions')
        .delete()
        .eq('branch_id', branchId);
        
      if (error) {
        console.error('Failed to delete webhook subscription:', error);
        toast({
          title: "Error",
          description: "Failed to delete webhook subscription",
          variant: "destructive"
        });
        return false;
      }
        
      console.log('Unsubscribed from Hikvision events');
      toast({
        title: "Success",
        description: "Unsubscribed from Hikvision events"
      });
      return true;
    } catch (error) {
      console.error('Failed to unsubscribe from Hikvision events:', error);
      toast({
        title: "Error",
        description: `Failed to unsubscribe from Hikvision events: ${error.message}`,
        variant: "destructive"
      });
      return false;
    }
  }
  
  async handleWebhook(payload: any): Promise<boolean> {
    try {
      console.log('Received Hikvision webhook:', payload);
      
      // Process webhook payload
      const { error } = await supabase
        .from('hikvision_events')
        .insert({
          event_data: payload,
          processed: false,
          received_at: new Date().toISOString()
        });
      
      if (error) {
        console.error('Failed to store Hikvision event:', error);
        return false;
      }
      
      return true;
    } catch (error) {
      console.error('Failed to handle Hikvision webhook:', error);
      return false;
    }
  }
  
  async getSubscriptionStatus(branchId: string): Promise<{ isActive: boolean, lastUpdated?: string }> {
    try {
      const { data, error } = await supabase
        .from('hikvision_webhook_subscriptions')
        .select('is_active, updated_at')
        .eq('branch_id', branchId)
        .maybeSingle();
      
      if (error) {
        console.error('Error fetching webhook subscription status:', error);
        return { isActive: false };
      }
      
      return { 
        isActive: data?.is_active || false,
        lastUpdated: data?.updated_at
      };
    } catch (error) {
      console.error('Error in getSubscriptionStatus:', error);
      return { isActive: false };
    }
  }
}

export const hikvisionWebhookService = new HikvisionWebhookService();
