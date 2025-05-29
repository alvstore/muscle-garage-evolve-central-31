
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface EventProcessRequest {
  branchId: string;
  action: 'fetch' | 'process' | 'webhook';
  eventData?: any;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { branchId, action, eventData }: EventProcessRequest = await req.json();

    console.log(`[Hikvision Events] Processing ${action} for branch: ${branchId}`);

    switch (action) {
      case 'fetch':
        return await fetchEvents(supabase, branchId);
      
      case 'process':
        return await processEvents(supabase, branchId);
      
      case 'webhook':
        return await handleWebhook(supabase, branchId, eventData);
      
      default:
        return new Response(
          JSON.stringify({ error: 'Invalid action' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
    }

  } catch (error) {
    console.error('[Hikvision Events] Error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

async function fetchEvents(supabase: any, branchId: string) {
  // Fetch events from Hikvision API
  const proxyResponse = await fetch(`${Deno.env.get('SUPABASE_URL')}/functions/v1/hikvision-proxy`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${Deno.env.get('SUPABASE_ANON_KEY')}`
    },
    body: JSON.stringify({
      branchId,
      endpoint: '/api/hpcgw/v1/mq/messages',
      method: 'POST',
      data: {
        startTime: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // Last 24 hours
        endTime: new Date().toISOString()
      }
    })
  });

  const result = await proxyResponse.json();
  
  if (!result.success) {
    return new Response(
      JSON.stringify({ error: 'Failed to fetch events from Hikvision' }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }

  // Store events in database
  const events = result.data.events || [];
  let processedCount = 0;

  for (const event of events) {
    try {
      const { error } = await supabase
        .from('hikvision_events')
        .upsert({
          event_id: event.eventId,
          event_type: event.eventType,
          event_time: event.eventTime,
          person_id: event.personId,
          device_id: event.deviceId,
          door_id: event.doorId,
          door_name: event.doorName,
          card_no: event.cardNo,
          face_id: event.faceId,
          picture_url: event.pictureUrl,
          raw_data: event,
          processed: false
        }, {
          onConflict: 'event_id'
        });

      if (!error) {
        processedCount++;
      }
    } catch (err) {
      console.error('[Hikvision Events] Error storing event:', err);
    }
  }

  return new Response(
    JSON.stringify({
      success: true,
      fetched: events.length,
      stored: processedCount
    }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  );
}

async function processEvents(supabase: any, branchId: string) {
  // Get unprocessed events
  const { data: events, error } = await supabase
    .from('hikvision_events')
    .select('*')
    .eq('processed', false)
    .order('event_time', { ascending: true })
    .limit(100);

  if (error) {
    return new Response(
      JSON.stringify({ error: 'Failed to fetch unprocessed events' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }

  let processedCount = 0;

  for (const event of events) {
    try {
      // Find member by person_id or card_no
      let member = null;
      
      if (event.person_id) {
        const { data: hikvisionPerson } = await supabase
          .from('hikvision_persons')
          .select('member_id')
          .eq('person_id', event.person_id)
          .single();
        
        if (hikvisionPerson?.member_id) {
          const { data: memberData } = await supabase
            .from('members')
            .select('*')
            .eq('id', hikvisionPerson.member_id)
            .single();
          
          member = memberData;
        }
      }

      // Create attendance record if it's an entry/exit event
      if (member && (event.event_type === 'entry' || event.event_type === 'exit')) {
        const { error: attendanceError } = await supabase
          .from('member_attendance')
          .insert({
            member_id: member.id,
            branch_id: branchId,
            check_in: event.event_type === 'entry' ? event.event_time : null,
            check_out: event.event_type === 'exit' ? event.event_time : null,
            attendance_date: new Date(event.event_time).toISOString().split('T')[0],
            method: 'hikvision_access_control'
          });

        if (attendanceError) {
          console.error('[Hikvision Events] Failed to create attendance record:', attendanceError);
        }
      }

      // Create access denial log if access was denied
      if (event.event_type === 'denied') {
        const { error: denialError } = await supabase
          .from('access_denial_logs')
          .insert({
            person_id: event.person_id,
            event_id: event.event_id,
            device_id: event.device_id,
            door_id: event.door_id,
            event_time: event.event_time,
            branch_id: branchId,
            raw_data: event.raw_data
          });

        if (denialError) {
          console.error('[Hikvision Events] Failed to create denial log:', denialError);
        }
      }

      // Mark event as processed
      await supabase
        .from('hikvision_events')
        .update({ 
          processed: true, 
          processed_at: new Date().toISOString() 
        })
        .eq('id', event.id);

      processedCount++;

    } catch (err) {
      console.error('[Hikvision Events] Error processing event:', err);
    }
  }

  return new Response(
    JSON.stringify({
      success: true,
      totalEvents: events.length,
      processedCount
    }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  );
}

async function handleWebhook(supabase: any, branchId: string, eventData: any) {
  // Handle incoming webhook from Hikvision device
  console.log('[Hikvision Events] Webhook received:', eventData);

  try {
    // Store the event
    const { error } = await supabase
      .from('hikvision_events')
      .insert({
        event_id: eventData.eventId || `webhook_${Date.now()}`,
        event_type: eventData.eventType || 'unknown',
        event_time: eventData.eventTime || new Date().toISOString(),
        person_id: eventData.personId,
        device_id: eventData.deviceId,
        door_id: eventData.doorId,
        door_name: eventData.doorName,
        card_no: eventData.cardNo,
        face_id: eventData.faceId,
        picture_url: eventData.pictureUrl,
        raw_data: eventData,
        processed: false
      });

    if (error) {
      console.error('[Hikvision Events] Failed to store webhook event:', error);
      return new Response(
        JSON.stringify({ error: 'Failed to store event' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Trigger immediate processing for real-time events
    setTimeout(async () => {
      await processEvents(supabase, branchId);
    }, 100);

    return new Response(
      JSON.stringify({ success: true, message: 'Event received and queued for processing' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('[Hikvision Events] Webhook error:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to process webhook' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
}
