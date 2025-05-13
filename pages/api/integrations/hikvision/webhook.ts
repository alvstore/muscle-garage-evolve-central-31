import { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '@/integrations/supabase/client';
import hikvisionAccessControlService from '@/services/integrations/hikvisionAccessControlService';

interface HikvisionWebhookEvent {
  msgId: string;
  topic: string;
  timestamp: number;
  data: {
    eventId: string;
    eventType: string;
    eventTime: string;
    personId?: string;
    personName?: string;
    doorId?: string;
    doorName?: string;
    deviceId?: string;
    deviceName?: string;
    cardNo?: string;
    faceId?: string;
    [key: string]: any;
  };
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Only accept POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    // Extract the branch ID from the URL
    const { branchId } = req.query;
    
    if (!branchId || typeof branchId !== 'string') {
      return res.status(400).json({ message: 'Branch ID is required' });
    }

    // Validate the request is from Hikvision
    // In production, you should implement proper authentication
    // This could include validating a shared secret or signature

    // Parse the event data
    const event = req.body as HikvisionWebhookEvent;
    
    if (!event || !event.data || !event.data.eventId) {
      return res.status(400).json({ message: 'Invalid event data' });
    }

    // Map the event type
    let mappedEventType: 'entry' | 'exit' | 'denied' = 'denied';
    
    if (event.data.eventType.includes('entry') || event.data.eventType.includes('access_granted')) {
      mappedEventType = 'entry';
    } else if (event.data.eventType.includes('exit')) {
      mappedEventType = 'exit';
    }

    // Store the event in the database
    const { error } = await supabase.from('hikvision_event').insert({
      event_id: event.data.eventId,
      event_time: event.data.eventTime || new Date().toISOString(),
      event_type: mappedEventType,
      person_id: event.data.personId,
      person_name: event.data.personName,
      door_id: event.data.doorId,
      door_name: event.data.doorName,
      device_id: event.data.deviceId,
      device_name: event.data.deviceName,
      card_no: event.data.cardNo,
      face_id: event.data.faceId,
      processed: false
    });

    if (error) {
      console.error('Error storing Hikvision event:', error);
      return res.status(500).json({ message: 'Error storing event', error: error.message });
    }

    // Process events immediately
    await hikvisionAccessControlService.processEvents(branchId);

    // Return success
    return res.status(200).json({ message: 'Event received and processed' });
  } catch (error) {
    console.error('Error processing Hikvision webhook:', error);
    return res.status(500).json({ message: 'Internal server error', error: error.message });
  }
}
