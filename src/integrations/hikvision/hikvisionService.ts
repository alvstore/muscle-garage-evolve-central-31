
// Hikvision Integration Service
import { supabase } from '@/integrations/supabase/client';
import { v4 as uuidv4 } from 'uuid';

export interface HikvisionEvent {
  event_id: string;
  event_type: 'entry' | 'exit' | 'denied';
  event_time: string;
  person_id?: string;
  person_name?: string;
  door_id?: string;
  door_name?: string;
  device_id?: string;
  device_name?: string;
  card_no?: string;
  face_id?: string;
  processed?: boolean;
}

export interface DeviceRegistrationStatus {
  deviceId: string;
  deviceName: string;
  status: 'success' | 'failed' | 'pending';
  message?: string;
  timestamp: string;
}

class HikvisionIntegrationService {
  async getEvents(startTime?: string): Promise<HikvisionEvent[]> {
    try {
      // This would integrate with actual Hikvision API to fetch events
      console.log('Fetching Hikvision events from:', startTime);
      
      // Mock events for demo
      return [
        {
          event_id: uuidv4(),
          event_type: 'entry',
          event_time: new Date().toISOString(),
          person_name: 'John Doe',
          door_name: 'Main Entrance',
          card_no: '12345',
          processed: false
        }
      ];
    } catch (error) {
      console.error('Error fetching Hikvision events:', error);
      return [];
    }
  }

  async processAttendance(events: HikvisionEvent[]): Promise<number> {
    try {
      let processedCount = 0;
      
      for (const event of events) {
        if (event.processed) continue;
        
        // Process event for attendance tracking
        console.log('Processing attendance for event:', event.event_id);
        processedCount++;
      }
      
      return processedCount;
    } catch (error) {
      console.error('Error processing attendance:', error);
      return 0;
    }
  }

  async simulateEvent(memberId: string, eventType: 'entry' | 'exit'): Promise<HikvisionEvent | null> {
    try {
      const event: HikvisionEvent = {
        event_id: uuidv4(),
        event_type: eventType,
        event_time: new Date().toISOString(),
        person_id: memberId,
        person_name: 'Simulated User',
        door_name: 'Main Entrance',
        processed: false
      };
      
      console.log('Simulated Hikvision event:', event);
      return event;
    } catch (error) {
      console.error('Error simulating event:', error);
      return null;
    }
  }
}

export const hikvisionService = new HikvisionIntegrationService();
