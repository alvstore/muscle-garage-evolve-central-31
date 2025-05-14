import { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '@/integrations/supabase/client';
import hikvisionAccessControlService from '@/services/integrations/hikvision/hikvisionAccessControlService';
import crypto from 'crypto';

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

// Event types mapping
const EVENT_TYPE_MAP = {
  'door.open': 'entry',
  'door.exit': 'exit',
  'access.denied': 'denied',
  'card.swiped': 'entry',
  'face.recognized': 'entry',
  'fingerprint.matched': 'entry'
};

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

    // Get API settings for the branch
    const settings = await hikvisionAccessControlService.getApiSettings(branchId);
    if (!settings) {
      console.error('API settings not found for branch:', branchId);
      return res.status(404).json({ message: 'Branch API settings not found' });
    }

    // Validate the request is from Hikvision using signature verification
    const signature = req.headers['x-hikvision-signature'] as string;
    const timestamp = req.headers['x-hikvision-timestamp'] as string;
    const nonce = req.headers['x-hikvision-nonce'] as string;
    
    if (settings.app_secret && signature && timestamp && nonce) {
      // Verify signature
      const payload = JSON.stringify(req.body);
      const signString = `${timestamp}${nonce}${payload}`;
      const expectedSignature = crypto
        .createHmac('sha256', settings.app_secret)
        .update(signString)
        .digest('hex');
      
      if (signature !== expectedSignature) {
        console.error('Invalid webhook signature');
        return res.status(401).json({ message: 'Invalid signature' });
      }
    } else {
      // In development, we might skip signature verification
      console.warn('Webhook signature verification skipped - missing parameters');
    }

    // Parse the event data
    const event = req.body as HikvisionWebhookEvent;
    
    if (!event || !event.data || !event.data.eventId) {
      return res.status(400).json({ message: 'Invalid event data' });
    }

    // Map the event type
    const eventTypeKey = event.data.eventType.toLowerCase();
    // Find the member associated with this person ID, card number, or face ID
    let memberId: string | null = null;
    
    if (event.data.personId) {
      // Look up by Hikvision person ID
      const { data: memberMap } = await supabase
        .from('hikvision_member_map')
        .select('member_id')
        .eq('hikvision_person_id', event.data.personId)
        .single();
        
      if (memberMap) {
        memberId = memberMap.member_id;
      }
    } else if (event.data.cardNo) {
      // Look up by card number
      const { data: credential } = await supabase
        .from('member_credentials')
        .select('member_id')
        .eq('credential_type', 'card')
        .eq('credential_value', event.data.cardNo)
        .single();
        
      if (credential) {
        memberId = credential.member_id;
      }
    } else if (event.data.faceId) {
      // Look up by face ID
      const { data: credential } = await supabase
        .from('member_credentials')
        .select('member_id')
        .eq('credential_type', 'face')
        .eq('credential_value', event.data.faceId)
        .single();
        
      if (credential) {
        memberId = credential.member_id;
      }
    }
    
    // Find the door associated with this door ID
    let doorId: string | null = null;
    
    if (event.data.doorId) {
      const { data: door } = await supabase
        .from('access_doors')
        .select('id')
        .eq('hikvision_door_id', event.data.doorId)
        .eq('branch_id', branchId)
        .single();
        
      if (door) {
        doorId = door.id;
      }
    }
    
    // If we couldn't find the door by ID, try by name
    if (!doorId && event.data.doorName) {
      const { data: door } = await supabase
        .from('access_doors')
        .select('id')
        .ilike('door_name', event.data.doorName)
        .eq('branch_id', branchId)
        .single();
        
      if (door) {
        doorId = door.id;
      }
    }

    // Map the event type
    let mappedEventType: 'entry' | 'exit' | 'denied' = EVENT_TYPE_MAP[eventTypeKey] || 'denied';
    
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
      person_id: memberId,
      person_name: event.data.personName,
      door_id: doorId,
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
