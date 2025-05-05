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

    // Get the event data from the request
    const requestData = await req.json()
    
    // Check if this is a batch of messages from the message queue
    if (Array.isArray(requestData.messages)) {
      // Process each message in the batch
      const results = await Promise.all(
        requestData.messages.map(async (message) => {
          // Extract the event data from the message
          const eventData = typeof message.data === 'string' 
            ? JSON.parse(message.data) 
            : message.data
            
          return await processEvent(supabaseClient, eventData, message.offset)
        })
      )
      
      return new Response(JSON.stringify({ 
        success: true, 
        processed: results.filter(r => r.success).length,
        failed: results.filter(r => !r.success).length
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      })
    } else {
      // Process a single event (legacy webhook or direct API call)
      const result = await processEvent(supabaseClient, requestData)
      
      return new Response(JSON.stringify({ 
        success: result.success,
        message: result.message
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: result.success ? 200 : 400,
      })
    }
  } catch (error) {
    console.error('Error processing webhook:', error)

    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    })
  }
})

// Process a single event
async function processEvent(supabase, eventData, offset = null) {
  try {
    // Process the event data
    const processedEvent = {
      event_id: eventData.eventId || `event-${Date.now()}`,
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
    const { data, error } = await supabase
      .from('hikvision_events')
      .insert(processedEvent)

    if (error) {
      // Check if it's a duplicate event
      if (error.code === '23505') { // Unique violation
        console.log('Duplicate event, skipping:', processedEvent.event_id)
        return { success: true, message: 'Duplicate event skipped' }
      }
      throw error
    }

    // Process attendance if it's an entry or exit event
    if (processedEvent.event_type === 'entry' || processedEvent.event_type === 'exit') {
      await processAttendance(supabase, processedEvent)
    }

    return { success: true, message: 'Event processed successfully' }
  } catch (error) {
    console.error('Error processing event:', error)
    return { success: false, message: error.message }
  }
}

// Helper function to map event types
function mapEventType(hikvisionType: string): 'entry' | 'exit' | 'denied' {
  if (!hikvisionType) return 'denied'
  
  const type = hikvisionType.toLowerCase()
  if (type.includes('entry') || type.includes('in') || type.includes('access')) {
    return 'entry'
  } else if (type.includes('exit') || type.includes('out')) {
    return 'exit'
  } else {
    return 'denied'
  }
}

// Process attendance from an event
async function processAttendance(supabase, event) {
  try {
    // Find the member by person_id
    const { data: member, error: memberError } = await supabase
      .from('members')
      .select('id, name')
      .eq('access_control_id', event.person_id)
      .single()

    if (memberError || !member) {
      console.error('Member not found:', event.person_id)
      return
    }

    // Create attendance record
    const attendanceRecord = {
      member_id: member.id,
      check_in_time: event.event_type === 'entry' ? event.event_time : null,
      check_out_time: event.event_type === 'exit' ? event.event_time : null,
      source: 'access_control',
      device_id: event.device_id,
      created_at: new Date().toISOString()
    }

    // If it's an exit event, try to find and update the most recent entry
    if (event.event_type === 'exit') {
      const { data: recentEntry, error: entryError } = await supabase
        .from('attendance')
        .select('id, check_in_time')
        .eq('member_id', member.id)
        .is('check_out_time', null)
        .order('check_in_time', { ascending: false })
        .limit(1)
        .single()

      if (!entryError && recentEntry) {
        // Update the existing entry with check-out time
        const { error: updateError } = await supabase
          .from('attendance')
          .update({ check_out_time: event.event_time })
          .eq('id', recentEntry.id)

        if (updateError) {
          console.error('Failed to update attendance record:', updateError)
        }
        return
      }
    }

    // Insert new attendance record
    const { error: insertError } = await supabase
      .from('attendance')
      .insert(attendanceRecord)

    if (insertError) {
      console.error('Failed to insert attendance record:', insertError)
    }

    // Mark the event as processed
    await supabase
      .from('hikvision_events')
      .update({ processed: true })
      .eq('event_id', event.event_id)

  } catch (error) {
    console.error('Error processing attendance:', error)
  }
}