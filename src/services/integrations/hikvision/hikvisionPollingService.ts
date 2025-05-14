
import { hikvisionService } from './hikvisionService';

interface PollingConfig {
  interval: number;
  isActive: boolean;
}

class HikvisionPollingService {
  private pollingInterval: number = 60000; // Default to 1 minute
  private intervalId: NodeJS.Timeout | null = null;
  
  constructor() {
    // Try to load polling status from localStorage
    const pollingEnabled = localStorage.getItem('hikvision_polling_enabled');
    if (pollingEnabled === 'true') {
      this.startPolling();
    }
  }

  startPolling(interval?: number): void {
    if (this.intervalId) {
      this.stopPolling();
    }
    
    if (interval) {
      this.pollingInterval = interval;
    }
    
    this.intervalId = setInterval(this.pollEvents.bind(this), this.pollingInterval);
    console.log(`Hikvision polling started with interval: ${this.pollingInterval}ms`);
  }

  stopPolling(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
      console.log('Hikvision polling stopped');
    }
  }
  
  isPolling(): boolean {
    return this.intervalId !== null;
  }
  
  setPollingInterval(interval: number): void {
    this.pollingInterval = interval;
    if (this.intervalId) {
      this.stopPolling();
      this.startPolling();
    }
  }

  async pollEvents(): Promise<void> {
    try {
      console.log('Polling Hikvision events...');
      // Add your event polling logic here
      // Example:
      // const events = await hikvisionService.getRecentEvents();
      // Process events...
    } catch (error) {
      console.error('Error polling Hikvision events:', error);
    }
  }
  
  getConfig(): PollingConfig {
    return {
      interval: this.pollingInterval,
      isActive: this.isPolling()
    };
  }
}

export const hikvisionPollingService = new HikvisionPollingService();
