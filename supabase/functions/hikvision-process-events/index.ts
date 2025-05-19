
// @deno-types="https://deno.land/x/supabase_js@v2.2.1/mod.d.ts"
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

// Define environment variables
const SUPABASE_URL = Deno.env.get('SUPABASE_URL') || '';
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';

// Define interfaces for request types
interface ProcessEventRequest {
  eventId: string;
  branchId: string;
}

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization'
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
    // Parse the request body
    const requestData: ProcessEventRequest = await req.json();
    const { eventId, branchId } = requestData;
    
    if (!eventId) {
      throw new Error('eventId is required');
    }
    
    // Initialize Supabase client
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    // Get the event details
    const { data: event, error: eventError } = await supabase
      .from('hikvision_events')
      .select('*')
      .eq('event_id', eventId)
      .single();
    
    if (eventError || !event) {
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Event not found'
        }),
        {
          status: 404,
          headers: {
            'Content-Type': 'application/json',
            ...corsHeaders
          }
        }
      );
    }
    
    // Check if the event is already processed
    if (event.processed) {
      return new Response(
        JSON.stringify({
          success: true,
          message: 'Event already processed'
        }),
        {
          status: 200,
          headers: {
            'Content-Type': 'application/json',
            ...corsHeaders
          }
        }
      );
    }
    
    // Process the event based on its type
    let result;
    switch (event.event_type) {
      case 'entry':
        result = await processEntryEvent(event, branchId, supabase);
        break;
      case 'exit':
        result = await processExitEvent(event, branchId, supabase);
        break;
      case 'denied':
        result = await processDeniedEvent(event, branchId, supabase);
        break;
      default:
        result = {
          success: false,
          message: `Unsupported event type: ${event.event_type}`
        };
    }
    
    // Update the event record as processed
    if (result.success) {
      const { error: updateError } = await supabase
        .from('hikvision_events')
        .update({
          processed: true,
          processed_at: new Date().toISOString()
        })
        .eq('id', event.id);
      
      if (updateError) {
        console.error('Error marking event as processed:', updateError);
      }
    }
    
    return new Response(
      JSON.stringify(result),
      {
        status: result.success ? 200 : 400,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders
        }
      }
    );
    
  } catch (error) {
    console.error('Error processing event:', error);
    const errorMessage = error instanceof Error ? error.message : 'Internal server error';
    
    return new Response(
      JSON.stringify({
        success: false,
        error: errorMessage
      }),
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

async function processEntryEvent(event: any, branchId: string, supabase: any) {
  try {
    // Get the person associated with this event
    const personId = event.person_id;
    if (!personId) {
      return {
        success: false,
        message: 'No person ID associated with this event'
      };
    }
    
    // Get member ID from hikvision_persons table
    const { data: person, error: personError } = await supabase
      .from('hikvision_persons')
      .select('member_id')
      .eq('person_id', personId)
      .single();
    
    const memberId = person?.member_id;
    
    // If we couldn't find a mapping, try to use person_id directly as member_id
    if (!memberId) {
      // Check if this personId is a valid member ID
      const { data: directMember, error: directMemberError } = await supabase
        .from('members')
        .select('id')
        .eq('id', personId)
        .single();
      
      if (directMemberError || !directMember) {
        return {
          success: false,
          message: 'Could not determine member ID from person ID'
        };
      }
    }
    
    const finalMemberId = memberId || personId;
    
    // Create an attendance record for this member
    const { data: attendance, error: attendanceError } = await supabase
      .from('member_attendance')
      .insert({
        member_id: finalMemberId,
        branch_id: branchId,
        check_in: event.event_time,
        device_id: event.device_id,
        access_method: 'access_control',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single();
    
    if (attendanceError) {
      return {
        success: false,
        message: `Failed to create attendance record: ${attendanceError.message}`
      };
    }
    
    return {
      success: true,
      message: 'Entry processed successfully',
      attendanceId: attendance.id
    };
    
  } catch (error) {
    console.error('Error processing entry event:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Unknown error processing entry event'
    };
  }
}

async function processExitEvent(event: any, branchId: string, supabase: any) {
  try {
    // Get the person associated with this event
    const personId = event.person_id;
    if (!personId) {
      return {
        success: false,
        message: 'No person ID associated with this event'
      };
    }
    
    // Get member ID from hikvision_persons table
    const { data: person, error: personError } = await supabase
      .from('hikvision_persons')
      .select('member_id')
      .eq('person_id', personId)
      .single();
    
    const memberId = person?.member_id;
    
    // If we couldn't find a mapping, try to use person_id directly as member_id
    const finalMemberId = memberId || personId;
    
    // Find the latest attendance record for this member that doesn't have a check_out
    const { data: attendanceRecords, error: attendanceError } = await supabase
      .from('member_attendance')
      .select('*')
      .eq('member_id', finalMemberId)
      .is('check_out', null)
      .order('check_in', { ascending: false })
      .limit(1);
    
    if (attendanceError) {
      return {
        success: false,
        message: `Failed to find attendance record: ${attendanceError.message}`
      };
    }
    
    if (!attendanceRecords || attendanceRecords.length === 0) {
      // No open attendance record found, create a new one with just check_out
      const { data: newAttendance, error: newAttendanceError } = await supabase
        .from('member_attendance')
        .insert({
          member_id: finalMemberId,
          branch_id: branchId,
          check_out: event.event_time,
          device_id: event.device_id,
          access_method: 'access_control',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select()
        .single();
      
      if (newAttendanceError) {
        return {
          success: false,
          message: `Failed to create exit attendance record: ${newAttendanceError.message}`
        };
      }
      
      return {
        success: true,
        message: 'Exit processed successfully (new record)',
        attendanceId: newAttendance.id
      };
    }
    
    // Update the existing attendance record with check_out
    const { data: updatedAttendance, error: updateError } = await supabase
      .from('member_attendance')
      .update({
        check_out: event.event_time,
        updated_at: new Date().toISOString()
      })
      .eq('id', attendanceRecords[0].id)
      .select()
      .single();
    
    if (updateError) {
      return {
        success: false,
        message: `Failed to update attendance record: ${updateError.message}`
      };
    }
    
    return {
      success: true,
      message: 'Exit processed successfully',
      attendanceId: updatedAttendance.id
    };
    
  } catch (error) {
    console.error('Error processing exit event:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Unknown error processing exit event'
    };
  }
}

async function processDeniedEvent(event: any, branchId: string, supabase: any) {
  try {
    // For denied events, we simply log them
    const { error: logError } = await supabase
      .from('access_denial_logs')
      .insert({
        person_id: event.person_id,
        door_id: event.door_id,
        device_id: event.device_id,
        event_time: event.event_time,
        event_id: event.event_id,
        branch_id: branchId,
        raw_data: event.raw_data,
        created_at: new Date().toISOString()
      });
    
    if (logError) {
      return {
        success: false,
        message: `Failed to log denial event: ${logError.message}`
      };
    }
    
    return {
      success: true,
      message: 'Denied access event logged successfully'
    };
    
  } catch (error) {
    console.error('Error processing denied event:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Unknown error processing denied event'
    };
  }
}
