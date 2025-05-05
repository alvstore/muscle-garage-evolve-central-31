import { hikvisionPartnerService } from './hikvisionPartnerService';
import api from '../api';

class HikvisionEventPoller {
  private pollingInterval: number = 60000; // 1 minute
  private isPolling: boolean = false;
  private intervalId: NodeJS.Timeout | null = null;
  private lastOffset: string | null = null;
  
  /**
   * Start polling for events
   */
  startPolling() {
    if (this.isPolling) return;
    
    this.isPolling = true;
    this.poll();
    
    this.intervalId = setInterval(() => {
      this.poll();
    }, this.pollingInterval);
    
    console.log('Hikvision event polling started');
  }
  
  /**
   * Stop polling for events
   */
  stopPolling() {
    if (!this.isPolling) return;
    
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    
    this.isPolling = false;
    console.log('Hikvision event polling stopped');
  }
  
  /**
   * Poll for events and process them
   */
  private async poll() {
    try {
      const messages = await hikv