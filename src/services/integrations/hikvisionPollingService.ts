import { hikvisionWebhookService } from './hikvisionWebhookService';
import api from '../api';

let pollingInterval: NodeJS.Timeout | null = null;
const POLLING_INTERVAL_MS = 30000; // 30 seconds

export const hikvisionPollingService = {
  /**
   * Start polling for Hikvision events
   */
  startPolling(): void {
    // Stop any existing polling
    this.stopPolling();
    
    // Start new polling interval
    pollingInterval = setInterval(async () => {
      try {
        // Poll for messages
        const messages = await hikvisionWebhookService.pollMessages();
        
        if (messages.length > 0) {
          console.log(`Received ${messages.length} Hikvision events`);
          
          // Process messages
          await this.processMessages(messages);
          
          // Acknowledge the last message offset
          if (messages.length > 0 && messages[messages.length - 1].offset) {
            await hikvisionWebhookService.acknowledgeOffset(messages[messages.length - 1].offset);
          }
        }
      } catch (error) {
        console.error('Error polling Hikvision events:', error);
      }
    }, POLLING_INTERVAL_MS);
    
    console.log('Hikvision event polling started');
  },
  
  /**
   * Stop polling for Hikvision events
   */
  stopPolling(): void {
    if (pollingInterval) {
      clearInterval(pollingInterval);
      pollingInterval = null;
      console.log('Hikvision event polling stopped');
    }
  },
  
  /**
   * Process received messages
   */
  async processMessages(messages: any[]): Promise<void> {
    try {
      // Send messages to backend for processing
      await api.post('/integrations/hikvision/process-events', { events: messages });
    } catch (error) {
      console.error('Error processing Hikvision events:', error);
    }
  }
};