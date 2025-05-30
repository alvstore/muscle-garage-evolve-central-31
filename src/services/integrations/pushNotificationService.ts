
import api from '../../api';
import { toast } from 'sonner';

export interface PushNotification {
  title: string;
  body: string;
  icon?: string;
  image?: string;
  data?: Record<string, any>;
  url?: string;
  badge?: number;
  tag?: string;
}

export interface SubscriptionRequest {
  endpoint: string;
  keys: {
    p256dh: string;
    auth: string;
  };
  userAgent?: string;
}

/**
 * Service for managing push notifications using Firebase or OneSignal
 */
export const pushNotificationService = {

  /**
   * Check if push notifications are supported in the browser
   */
  isSupported(): boolean {
    return 'serviceWorker' in navigator && 'PushManager' in window;
  },
  
  /**
   * Request permission for push notifications
   */
  async requestPermission(): Promise<boolean> {
    if (!this.isSupported()) {
      toast.error('Push notifications are not supported in this browser');
      return false;
    }
    
    try {
      const permission = await Notification.requestPermission();
      return permission === 'granted';
    } catch (error) {
      console.error('Failed to request notification permission:', error);
      return false;
    }
  },
  
  /**
   * Subscribe user to push notifications
   * @param userId User ID to associate with subscription
   */
  async subscribe(userId: string): Promise<boolean> {
    if (!this.isSupported()) {
      toast.error('Push notifications are not supported in this browser');
      return false;
    }
    
    try {
      const permission = await this.requestPermission();
      
      if (!permission) {
        toast.error('Notification permission denied');
        return false;
      }
      
      // Register service worker if not already registered
      const registration = await navigator.serviceWorker.register('/service-worker.js');
      
      // Get subscription
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: await this.getPublicKey()
      });
      
      // Send subscription to server
      return await this.saveSubscription(userId, subscription);
    } catch (error) {
      console.error('Failed to subscribe to push notifications:', error);
      toast.error('Failed to enable push notifications');
      return false;
    }
  },
  
  /**
   * Get public VAPID key from server
   */
  async getPublicKey(): Promise<Uint8Array> {
    try {
      const response = await api.get('/integrations/push/public-key');
      const key = response.data.publicKey;
      
      // Convert base64 string to Uint8Array
      return Uint8Array.from(atob(key), c => c.charCodeAt(0));
    } catch (error) {
      console.error('Failed to get public key:', error);
      throw new Error('Failed to get public key for push notifications');
    }
  },
  
  /**
   * Save push subscription to server
   * @param userId User ID to associate with subscription
   * @param subscription PushSubscription object
   */
  async saveSubscription(userId: string, subscription: PushSubscription): Promise<boolean> {
    try {
      const response = await api.post('/integrations/push/subscribe', {
        userId,
        subscription: subscription.toJSON()
      });
      
      if (response.data.success) {
        return true;
      } else {
        console.error('Failed to save push subscription:', response.data.message);
        return false;
      }
    } catch (error) {
      console.error('Failed to save push subscription:', error);
      return false;
    }
  },
  
  /**
   * Unsubscribe from push notifications
   */
  async unsubscribe(): Promise<boolean> {
    if (!this.isSupported()) {
      return false;
    }
    
    try {
      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.getSubscription();
      
      if (subscription) {
        // Unsubscribe locally
        const result = await subscription.unsubscribe();
        
        if (result) {
          // Unsubscribe on server
          await api.post('/integrations/push/unsubscribe', {
            subscription: subscription.toJSON()
          });
        }
        
        return result;
      }
      
      return false;
    } catch (error) {
      console.error('Failed to unsubscribe from push notifications:', error);
      return false;
    }
  },
  
  /**
   * Send a test notification to the current user
   */
  async sendTestNotification(): Promise<boolean> {
    try {
      const response = await api.post('/integrations/push/test');
      
      if (response.data.success) {
        toast.success('Test notification sent');
        return true;
      } else {
        toast.error(response.data.message || 'Failed to send test notification');
        return false;
      }
    } catch (error) {
      console.error('Failed to send test notification:', error);
      toast.error('Failed to send test notification');
      return false;
    }
  }
};
