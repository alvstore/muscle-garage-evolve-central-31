
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
    // Get all active devices from the database
    const { data: devices, error } = await supabase
      .from("hikvision_devices")
      .select("*")
      .eq("is_active", true);
    
    if (error) {
      console.error("Error fetching devices:", error);
      return;
    }
    
    // No devices configured
    if (!devices || devices.length === 0) {
      console.log("No Hikvision devices configured");
      return;
    }
    
    console.log(`Polling ${devices.length} Hikvision devices for events`);
    
    // Poll each device in parallel
    const pollingPromises = devices.map(device => pollDeviceEvents(device));
    const results = await Promise.allSettled(pollingPromises);
    
    // Log results
    const successful = results.filter(r => r.status === 'fulfilled').length;
    const failed = results.filter(r => r.status === 'rejected').length;
    
    if (failed > 0) {
      console.warn(`Event polling completed with ${successful} successful and ${failed} failed devices`);
    } else {
      console.log(`Event polling completed successfully for ${successful} devices`);
    }
  } catch (err) {
    console.error("Error in event polling process:", err);
  }
};

// Poll events for a single device
const pollDeviceEvents = async (device: any) => {
  try {
    console.log(`Polling device ${device.name} (${device.ip_address})`);
    
    // Here you would normally make API calls to the device
    // For now we just simulate receiving events
    
    // Process any events found
    // This is just a placeholder - actual implementation would vary
    const mockEvents: EventPayload[] = [];
    
    // Process each event
    for (const event of mockEvents) {
      await processEvent(event, device);
    }
    
    return { device, success: true };
  } catch (error) {
    console.error(`Error polling device ${device.name}:`, error);
    return { device, success: false, error };
  }
};

// Process a single event
const processEvent = async (event: EventPayload, device: any) => {
  try {
    // Log the event to the database
    const { error } = await supabase.from("hikvision_events").insert([
      {
        device_id: device.id,
        event_type: event.eventType,
        event_time: event.eventTime,
        device_sn: event.deviceSn,
        event_data: event.eventData
      }
    ]);
    
    if (error) {
      console.error("Error recording event:", error);
      return false;
    }
    
    console.log(`Recorded ${event.eventType} event from device ${device.name}`);
    return true;
  } catch (err) {
    console.error("Error processing event:", err);
    return false;
  }
};
