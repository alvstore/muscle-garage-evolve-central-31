import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Create a Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: req.headers.get('Authorization')! } } }
    )

    // Get the events data from the request
    const { events } = await req.json()
    
    // Process each event
    const processedCount = await processEvents(supabaseClient, events)

    return new Response(JSON.stringify({ success: true, processedCount }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })
  } catch (error) {
    console.error('Error processing events:', error)

    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    })
  }
})

// Process multiple events
async function processEvents(supabase, events) {
  let processedCount = 0
  
  for (const eventData of events) {
    try {
      // Transform the event data to match our schema
      const processedEvent = {
        event_id: eventData.eventId || `event-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
        event_time: eventData.eventTime || new Date().toISOString(),
        event_type: mapEventType(eventData.eventType),
        person_id: eventData.personId,
        person_name: eventData.personName,
        door_id: eventData.doorIndexCode,
        door_name: eventData.doorName,
        device_id: eventData.deviceId,
        device_name: eventData.deviceName,
        card_no: eventData.cardNo,
        face_id: eventData.faceId,
        processed: false,
        created_at: new Date().toISOString()
      }

      // Store the event in the database
      const { error } = await supabase
        .from('hikvision_events')
        .insert(processedEvent)

      if (error) {
        console.error('Failed to insert event:', error)
        continue
      }

      // Process attendance if it's an entry or exit event
      if (processedEvent.event_type === 'entry' || processedEvent.event_type === 'exit') {
        await processAttendance(supabase, processedEvent)
      }
      
      processedCount++
    } catch (eventError) {
      console.error('Error processing individual event:', eventError)
    }
  }
  
  return processedCount
}

// Helper function to map event types
function mapEventType(hikvisionType) {
  if (hikvisionType?.includes('entry') || hikvisionType?.includes('in')) {
    return 'entry'
  } else if (hikvisionType?.includes('exit') || hikvisionType?.includes('out')) {
    return 'exit'
  } else {
    return 'denied'
  }
}

// Process attendance from an event
async function processAttendance(supabase, event) {
  // This function is the same as in your hikvision-webhook function
  // ... copy the implementation from there ...
}