
import { supabase } from "@/integrations/supabase/client";

interface EventPayload {
  deviceSn: string;
  eventType: string;
  eventTime: string;
  eventData?: any;
}

// Initialize the polling timer
let pollingTimer: number | null = null;
let isPolling = false;

// Poll interval in milliseconds (default 30 seconds)
const POLL_INTERVAL = 30 * 1000;

// Start polling for events from all devices
export const startPolling = () => {
  if (isPolling) {
    console.log("Polling already active");
    return;
  }
  
  isPolling = true;
  console.log("Starting Hikvision event polling");
  
  // Immediately poll once on startup
  pollEvents();
  
  // Then set up interval polling
  pollingTimer = window.setInterval(pollEvents, POLL_INTERVAL);
};

// Stop polling
export const stopPolling = () => {
  if (pollingTimer) {
    window.clearInterval(pollingTimer);
    pollingTimer = null;
    isPolling = false;
    console.log("Hikvision event polling stopped");
  }
};

// Poll events from all configured devices
const pollEvents = async () => {
  try {
    // Get all active API settings from the database
    const { data: settings, error } = await supabase
      .from("hikvision_api_settings")
      .select("*")
      .eq("is_active", true);
    
    if (error) {
      console.error("Error fetching Hikvision API settings:", error);
      return;
    }
    
    // No API settings configured
    if (!settings || settings.length === 0) {
      console.log("No active Hikvision API settings configured");
      return;
    }
    
    console.log(`Polling events for ${settings.length} Hikvision API configurations`);
    
    // Poll each API configuration
    const pollingPromises = settings.map(apiSetting => pollEventsForBranch(apiSetting));
    const results = await Promise.allSettled(pollingPromises);
    
    // Log results
    const successful = results.filter(r => r.status === 'fulfilled').length;
    const failed = results.filter(r => r.status === 'rejected').length;
    
    if (failed > 0) {
      console.warn(`Event polling completed with ${successful} successful and ${failed} failed branches`);
    } else {
      console.log(`Event polling completed successfully for ${successful} branches`);
    }
  } catch (err) {
    console.error("Error in event polling process:", err);
  }
};

// Poll events for a branch using its API settings
// Add these imports if needed
import { v4 as uuidv4 } from 'uuid';
import crypto from 'crypto';

// Add this new method to subscribe to events
async function subscribeToEvents(branchId: string): Promise<string | null> {
  try {
    // Get API settings
    const { data: settings, error } = await supabase
      .from('hikvision_api_settings')
      .select('*')
      .eq('branch_id', branchId)
      .eq('is_active', true)
      .single();
    
    if (error || !settings) {
      console.error('Error fetching API settings:', error);
      return null;
    }
    
    // Authenticate
    const authResponse = await fetch(`${settings.api_url}/api/hpcgw/v1/token/get`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        appKey: settings.app_key,
        secretKey: settings.app_secret
      })
    });
    
    if (!authResponse.ok) {
      throw new Error(`Authentication failed: ${authResponse.statusText}`);
    }
    
    const authData = await authResponse.json();
    const accessToken = authData.accessToken;
    
    if (!accessToken) {
      throw new Error('No access token received');
    }
    
    // Subscribe to events
    const subscribeResponse = await fetch(`${settings.api_url}/api/hpcgw/v1/mq/subscribe`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`
      },
      body: JSON.stringify({
        eventTypes: ['acs.event.door_access']
      })
    });
    
    if (!subscribeResponse.ok) {
      throw new Error(`Failed to subscribe to events: ${subscribeResponse.statusText}`);
    }
    
    const subscribeData = await subscribeResponse.json();
    const subscriptionId = subscribeData.subscriptionId;
    
    if (!subscriptionId) {
      throw new Error('No subscription ID received');
    }
    
    // Store subscription ID in database
    await supabase
      .from('hikvision_api_settings')
      .update({ 
        subscription_id: subscriptionId,
        last_sync: new Date().toISOString(),
        last_sync_status: 'success'
      })
      .eq('id', settings.id);
    
    return subscriptionId;
  } catch (error) {
    console.error(`Error subscribing to events for branch ${branchId}:`, error);
    
    // Log error
    await supabase.from('hikvision_sync_log').insert({
      id: uuidv4(),
      branch_id: branchId,
      event_type: 'error',
      message: 'Failed to subscribe to events',
      details: error.message || 'Unknown error',
      status: 'error',
      created_at: new Date().toISOString()
    });
    
    return null;
  }
}

// Modify the pollEventsForBranch function
const pollEventsForBranch = async (apiSetting: any) => {
  try {
    const { branch_id, api_url, app_key, app_secret, subscription_id } = apiSetting;
    console.log(`Polling events for branch ${branch_id} using Hikvision API`);
    
    // Get or create subscription
    let currentSubscriptionId = subscription_id;
    if (!currentSubscriptionId) {
      currentSubscriptionId = await subscribeToEvents(branch_id);
      if (!currentSubscriptionId) {
        throw new Error('Failed to create event subscription');
      }
    }
    
    // Poll for messages
    const events = await pollMessages(branch_id, currentSubscriptionId);
    
    // Process each event
    for (const event of events) {
      await processEvent(event, { branch_id });
    }
    
    // Update last sync time
    await supabase
      .from('hikvision_api_settings')
      .update({ 
        last_sync: new Date().toISOString(),
        last_sync_status: 'success'
      })
      .eq('id', apiSetting.id);
    
    return { branch_id, success: true };
  } catch (error) {
    console.error(`Error polling events for branch ${apiSetting.branch_id}:`, error);
    
    // Update sync status to failed
    await supabase
      .from('hikvision_api_settings')
      .update({ 
        last_sync: new Date().toISOString(),
        last_sync_status: 'failed',
        last_sync_error: error.message
      })
      .eq('id', apiSetting.id);
      
    return { branch_id: apiSetting.branch_id, success: false, error };
  }
};

// Process a single event
const processEvent = async (event: EventPayload, context: { branch_id: string }) => {
  try {
    // Log the event to the database
    const { error } = await supabase.from("hikvision_event").insert([
      {
        branch_id: context.branch_id,
        event_type: event.eventType === 'entry' ? 'entry' : 'exit',
        event_time: event.eventTime,
        device_id: event.deviceSn,
        door_id: event.eventData?.doorId || null,
        door_name: event.eventData?.doorName || null,
        person_id: event.eventData?.personId || null,
        person_name: event.eventData?.personName || null,
        card_no: event.eventData?.cardNo || null,
        processed: false,
        created_at: new Date().toISOString()
      }
    ]);
    
    if (error) {
      console.error("Error recording Hikvision event:", error);
      return false;
    }
    
    console.log(`Recorded ${event.eventType} event for branch ${context.branch_id}`);
    
    // Log to sync log for visibility
    await supabase.from("hikvision_sync_log").insert([
      {
        id: crypto.randomUUID(),
        branch_id: context.branch_id,
        event_type: 'info',
        message: `Received ${event.eventType} event`,
        details: `Event received at ${new Date().toLocaleTimeString()} for device ${event.deviceSn}`,
        status: 'success',
        entity_type: 'event',
        created_at: new Date().toISOString()
      }
    ]);
    
    return true;
  } catch (err) {
    console.error("Error processing event:", err);
    
    // Log error to sync log
    try {
      await supabase.from("hikvision_sync_log").insert([
        {
          id: crypto.randomUUID(),
          branch_id: context.branch_id,
          event_type: 'error',
          message: 'Failed to process event',
          details: `Error: ${err.message}`,
          status: 'error',
          entity_type: 'event',
          created_at: new Date().toISOString()
        }
      ]);
    } catch (logError) {
      console.error("Error logging to sync log:", logError);
    }
    
    return false;
  }
};

// Add this method to poll for messages
async function pollMessages(branchId: string, subscriptionId: string): Promise<EventPayload[]> {
  try {
    // Get API settings
    const { data: settings, error } = await supabase
      .from('hikvision_api_settings')
      .select('*')
      .eq('branch_id', branchId)
      .eq('is_active', true)
      .single();
    
    if (error || !settings) {
      console.error('Error fetching API settings:', error);
      return [];
    }
    
    // Authenticate
    const authResponse = await fetch(`${settings.api_url}/api/hpcgw/v1/token/get`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        appKey: settings.app_key,
        secretKey: settings.app_secret
      })
    });
    
    if (!authResponse.ok) {
      throw new Error(`Authentication failed: ${authResponse.statusText}`);
    }
    
    const authData = await authResponse.json();
    const accessToken = authData.accessToken;
    
    if (!accessToken) {
      throw new Error('No access token received');
    }
    
    // Get last offset from database
    const { data: offsetData } = await supabase
      .from('hikvision_api_settings')
      .select('last_offset')
      .eq('branch_id', branchId)
      .single();
    
    const lastOffset = offsetData?.last_offset || null;
    
    // Poll for messages
    const messagesResponse = await fetch(`${settings.api_url}/api/hpcgw/v1/mq/messages`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`
      },
      body: JSON.stringify({
        subscriptionId,
        offset: lastOffset,
        maxReturnNum: 20
      })
    });
    
    if (!messagesResponse.ok) {
      throw new Error(`Failed to poll messages: ${messagesResponse.statusText}`);
    }
    
    const messagesData = await messagesResponse.json();
    const messages = messagesData.messages || [];
    
    if (messages.length > 0) {
      // Update last offset
      const newOffset = messages[messages.length - 1].offset;
      await supabase
        .from('hikvision_api_settings')
        .update({ last_offset: newOffset })
        .eq('branch_id', branchId);
      
      // Acknowledge the offset
      await acknowledgeOffset(branchId, subscriptionId, newOffset, settings.api_url, accessToken);
    }
    
    // Transform messages to EventPayload format
    return messages.map(msg => ({
      deviceSn: msg.data?.deviceSn || '',
      eventType: mapEventType(msg.data?.eventType),
      eventTime: msg.data?.eventTime || new Date().toISOString(),
      eventData: {
        doorId: msg.data?.doorIndexCode,
        doorName: msg.data?.doorName,
        personId: msg.data?.personId,
        personName: msg.data?.personName,
        cardNo: msg.data?.cardNo
      }
    }));
  } catch (error) {
    console.error(`Error polling messages for branch ${branchId}:`, error);
    
    // Log error
    await supabase.from('hikvision_sync_log').insert({
      id: uuidv4(),
      branch_id: branchId,
      event_type: 'error',
      message: 'Failed to poll messages',
      details: error.message || 'Unknown error',
      status: 'error',
      created_at: new Date().toISOString()
    });
    
    return [];
  }
}

// Helper function to acknowledge message offset
async function acknowledgeOffset(branchId: string, subscriptionId: string, offset: string, apiUrl: string, accessToken: string): Promise<boolean> {
  try {
    const response = await fetch(`${apiUrl}/api/hpcgw/v1/mq/offset`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`
      },
      body: JSON.stringify({
        subscriptionId,
        offset
      })
    });
    
    if (!response.ok) {
      throw new Error(`Failed to acknowledge offset: ${response.statusText}`);
    }
    
    return true;
  } catch (error) {
    console.error(`Error acknowledging offset for branch ${branchId}:`, error);
    return false;
  }
}

// Helper function to map Hikvision event types to our system
function mapEventType(eventType: string): string {
  // Map Hikvision event types to our system
  // Common event types: doorOpen, doorClose, cardVerify, faceVerify
  if (eventType === 'doorOpen' || eventType === 'cardVerify' || eventType === 'faceVerify') {
    return 'entry';
  } else if (eventType === 'doorClose') {
    return 'exit';
  }
  return eventType || 'unknown';
}
