
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

// Define types
interface HikvisionEvent {
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
}

// CORS headers for cross-origin requests
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { 
      status: 204, 
      headers: corsHeaders 
    });
  }

  try {
    // Parse request data
    const requestData = await req.json();
    
    // Create Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL') as string;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') as string;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Process based on request type
    if (requestData.action === 'process-events') {
      return await processEvents(requestData.branchId, supabase, corsHeaders);
    } else if (requestData.action === 'simulate-event') {
      return await simulateEvent(requestData, supabase, corsHeaders);
    } else {
      return new Response(
        JSON.stringify({ success: false, error: 'Invalid action' }),
        { 
          status: 400, 
          headers: { 
            'Content-Type': 'application/json',
            ...corsHeaders 
          } 
        }
      );
    }
  } catch (error) {
    console.error('Error processing request:', error);
    
    return new Response(
      JSON.stringify({ success: false, error: error.message || 'Unknown error' }),
      { 
        status: 500, 
        headers: { 
          'Content-Type': 'application/json',
          ...corsHeaders 
        } 
      }
    );
  }
});

// Process Hikvision events
async function processEvents(branchId: string, supabase: any, corsHeaders: any) {
  if (!branchId) {
    return new Response(
      JSON.stringify({ success: false, error: 'Branch ID is required' }),
      { 
        status: 400, 
        headers: { 
          'Content-Type': 'application/json',
          ...corsHeaders 
        } 
      }
    );
  }

  try {
    // Get unprocessed events
    const { data: events, error: eventsError } = await supabase
      .from('hikvision_event')
      .select('*')
      .eq('processed', false)
      .order('event_time', { ascending: true })
      .limit(50);
    
    if (eventsError) {
      throw new Error(`Error fetching events: ${eventsError.message}`);
    }
    
    if (!events || events.length === 0) {
      return new Response(
        JSON.stringify({ success: true, message: 'No events to process', processed: 0 }),
        { 
          status: 200, 
          headers: { 
            'Content-Type': 'application/json',
            ...corsHeaders 
          } 
        }
      );
    }
    
    // Process events and create attendance records
    let processedCount = 0;
    const logs = [];
    
    for (const event of events) {
      try {
        // Get member by access credential
        let member = null;
        
        if (event.person_id) {
          const { data: memberByCredential } = await supabase
            .from('member_access_credentials')
            .select('member_id')
            .eq('credential_type', 'hikvision')
            .eq('credential_value', event.person_id)
            .eq('is_active', true)
            .maybeSingle();
          
          if (memberByCredential) {
            const { data: memberData } = await supabase
              .from('members')
              .select('*')
              .eq('id', memberByCredential.member_id)
              .maybeSingle();
              
            member = memberData;
          }
        }
        
        // If no member found by credential, try by card number
        if (!member && event.card_no) {
          const { data: memberByCard } = await supabase
            .from('members')
            .select('*')
            .eq('id', event.card_no)
            .maybeSingle();
            
          member = memberByCard;
        }
        
        if (!member) {
          logs.push(`No member found for event ${event.event_id}`);
          continue;
        }
        
        // Process event based on type
        if (event.event_type === 'entry') {
          // Create attendance record
          await supabase
            .from('attendance')
            .insert({
              member_id: member.id,
              check_in_time: event.event_time,
              source: 'access_control',
              device_id: event.device_id,
              event_id: event.event_id
            });
            
          logs.push(`Created check-in for ${member.name}`);
        } else if (event.event_type === 'exit') {
          // Find most recent unclosed check-in
          const { data: recentEntry } = await supabase
            .from('attendance')
            .select('id')
            .eq('member_id', member.id)
            .is('check_out_time', null)
            .order('check_in_time', { ascending: false })
            .limit(1)
            .maybeSingle();
            
          if (recentEntry) {
            // Update with check-out time
            await supabase
              .from('attendance')
              .update({ check_out_time: event.event_time })
              .eq('id', recentEntry.id);
              
            logs.push(`Updated check-out for ${member.name}`);
          } else {
            // Create a new record with check-out only
            await supabase
              .from('attendance')
              .insert({
                member_id: member.id,
                check_out_time: event.event_time,
                source: 'access_control',
                device_id: event.device_id,
                event_id: event.event_id
              });
              
            logs.push(`Created check-out for ${member.name} (no check-in found)`);
          }
        }
        
        // Mark event as processed
        await supabase
          .from('hikvision_event')
          .update({ processed: true })
          .eq('id', event.id);
          
        processedCount++;
      } catch (eventError) {
        console.error(`Error processing event ${event.event_id}:`, eventError);
        logs.push(`Error processing event ${event.event_id}: ${eventError.message}`);
      }
    }
    
    // Log summary to hikvision_sync_logs
    await supabase
      .from('hikvision_sync_logs')
      .insert({
        branch_id: branchId,
        event_type: 'process',
        status: processedCount > 0 ? 'success' : 'warning',
        message: `Processed ${processedCount} of ${events.length} events`,
        details: logs.join('\n')
      });
    
    return new Response(
      JSON.stringify({ 
        success: true, 
        message: `Processed ${processedCount} of ${events.length} events`,
        processed: processedCount,
        logs
      }),
      { 
        status: 200, 
        headers: { 
          'Content-Type': 'application/json',
          ...corsHeaders 
        } 
      }
    );
  } catch (error) {
    console.error('Error processing events:', error);
    
    // Log error
    try {
      await supabase
        .from('hikvision_sync_logs')
        .insert({
          branch_id: branchId,
          event_type: 'error',
          status: 'error',
          message: `Error processing events: ${error.message}`,
          details: error.stack
        });
    } catch (logError) {
      console.error('Failed to log error:', logError);
    }
    
    return new Response(
      JSON.stringify({ success: false, error: error.message || 'Unknown error' }),
      { 
        status: 500, 
        headers: { 
          'Content-Type': 'application/json',
          ...corsHeaders 
        } 
      }
    );
  }
}

// Simulate a Hikvision event (for testing)
async function simulateEvent(requestData: any, supabase: any, corsHeaders: any) {
  const { memberId, eventType = 'entry', branchId } = requestData;
  
  if (!memberId || !branchId) {
    return new Response(
      JSON.stringify({ success: false, error: 'Member ID and Branch ID are required' }),
      { 
        status: 400, 
        headers: { 
          'Content-Type': 'application/json',
          ...corsHeaders 
        } 
      }
    );
  }

  try {
    // Get member data
    const { data: member, error: memberError } = await supabase
      .from('members')
      .select('id, name, access_control_id')
      .eq('id', memberId)
      .maybeSingle();
    
    if (memberError || !member) {
      return new Response(
        JSON.stringify({ success: false, error: `Member not found: ${memberError?.message || 'Not found'}` }),
        { 
          status: 404, 
          headers: { 
            'Content-Type': 'application/json',
            ...corsHeaders 
          } 
        }
      );
    }
    
    // Create simulated event
    const event: HikvisionEvent = {
      event_id: `sim-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      event_type: eventType as 'entry' | 'exit' | 'denied',
      event_time: new Date().toISOString(),
      person_id: member.access_control_id || member.id,
      person_name: member.name,
      door_id: 'door-1',
      door_name: 'Main Entrance',
      device_id: 'device-simulator',
      device_name: 'Simulator Device'
    };
    
    // Insert event
    const { data: insertedEvent, error: insertError } = await supabase
      .from('hikvision_event')
      .insert(event)
      .select()
      .single();
    
    if (insertError) {
      throw new Error(`Error creating event: ${insertError.message}`);
    }
    
    // Process the event immediately
    if (eventType === 'entry') {
      await supabase
        .from('attendance')
        .insert({
          member_id: member.id,
          check_in_time: event.event_time,
          source: 'access_control_simulation',
          device_id: event.device_id,
          event_id: event.event_id
        });
    } else if (eventType === 'exit') {
      // Find most recent unclosed check-in
      const { data: recentEntry } = await supabase
        .from('attendance')
        .select('id')
        .eq('member_id', member.id)
        .is('check_out_time', null)
        .order('check_in_time', { ascending: false })
        .limit(1)
        .maybeSingle();
        
      if (recentEntry) {
        // Update with check-out time
        await supabase
          .from('attendance')
          .update({ check_out_time: event.event_time })
          .eq('id', recentEntry.id);
      } else {
        // Create a new record with check-out only
        await supabase
          .from('attendance')
          .insert({
            member_id: member.id,
            check_out_time: event.event_time,
            source: 'access_control_simulation',
            device_id: event.device_id,
            event_id: event.event_id
          });
      }
    }
    
    // Mark as processed
    await supabase
      .from('hikvision_event')
      .update({ processed: true })
      .eq('id', insertedEvent.id);
    
    // Log success
    await supabase
      .from('hikvision_sync_logs')
      .insert({
        branch_id: branchId,
        event_type: 'simulation',
        status: 'success',
        message: `Simulated ${eventType} event for ${member.name}`,
        entity_type: 'member',
        entity_id: member.id,
        entity_name: member.name
      });
    
    return new Response(
      JSON.stringify({ 
        success: true, 
        message: `Simulated ${eventType} event for ${member.name}`,
        event: insertedEvent
      }),
      { 
        status: 200, 
        headers: { 
          'Content-Type': 'application/json',
          ...corsHeaders 
        } 
      }
    );
  } catch (error) {
    console.error('Error simulating event:', error);
    
    return new Response(
      JSON.stringify({ success: false, error: error.message || 'Unknown error' }),
      { 
        status: 500, 
        headers: { 
          'Content-Type': 'application/json',
          ...corsHeaders 
        } 
      }
    );
  }
}
