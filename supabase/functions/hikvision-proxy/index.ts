
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
    const requestData = await req.json()
    const { 
      action, 
      apiUrl, 
      appKey, 
      secretKey, 
      deviceId, 
      accessToken, 
      deviceSn,
      ip, 
      port, 
      username, 
      password,
      personData,
      memberData,
      subscriptionId,
      offset,
      eventTypes,
      topics,
      maxReturnNum
    } = requestData
    
    console.log(`Processing ${action} request`)
    
    // Create a Supabase client with the Auth context of the user that called the function
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: req.headers.get('Authorization')! } } }
    )
    
    // Get user data to verify permissions
    const { data: { user }, error: userError } = await supabaseClient.auth.getUser()
    if (userError || !user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 401,
      })
    }
    
    // Log action for debugging
    await supabaseClient.from('hikvision_sync_log').insert({
      branch_id: requestData.branchId || null,
      event_type: 'info',
      message: `Edge function called with action: ${action}`,
      details: JSON.stringify(requestData, (key, value) => 
        ['secretKey', 'password', 'appSecret', 'accessToken'].includes(key) ? '***REDACTED***' : value
      ),
      status: 'pending',
      created_at: new Date().toISOString()
    }).select()
    
    // Handle different actions
    switch (action) {
      case 'token': {
        // Get token from Hikvision API
        console.log(`Getting token from ${apiUrl}/api/hpcgw/v1/token/get`)
        
        const response = await fetch(`${apiUrl}/api/hpcgw/v1/token/get`, {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify({ appKey, secretKey }),
        })
        
        const responseText = await response.text()
        console.log(`Hikvision token response status: ${response.status}`)
        
        try {
          const data = JSON.parse(responseText)
          console.log(`Hikvision token response: ${JSON.stringify(data, null, 2)}`)
          
          return new Response(JSON.stringify(data), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: response.status,
          })
        } catch (e) {
          console.error(`Error parsing token response: ${e.message}`)
          console.error(`Raw response: ${responseText}`)
          
          return new Response(JSON.stringify({ 
            error: 'Failed to parse token response',
            rawResponse: responseText,
            errorCode: 'PARSE_ERROR'
          }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 500,
          })
        }
      }
      
      case 'test-device': {
        // Test device connection using Hikvision API
        console.log(`Testing device connection for deviceId: ${deviceId}`)
        
        const response = await fetch(`${apiUrl}/api/hpcgw/v1/device/status`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `Bearer ${accessToken}`,
          },
          body: JSON.stringify({ deviceId: deviceId || deviceSn }),
        })
        
        const data = await response.json()
        console.log(`Hikvision device test response: ${JSON.stringify(data, null, 2)}`)
        
        return new Response(JSON.stringify(data), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: response.status,
        })
      }
      
      case 'test-local-device': {
        // Test local device connection using ISAPI
        console.log(`Testing local device connection for IP: ${ip}:${port}`)
        
        try {
          const response = await fetch(`http://${ip}:${port}/ISAPI/System/deviceInfo`, {
            method: 'GET',
            headers: {
              'Authorization': 'Basic ' + btoa(`${username}:${password}`),
            },
          })
          
          const success = response.status === 200
          let deviceInfo = null
          
          if (success) {
            const text = await response.text()
            // Check if it's XML
            if (text.includes('<?xml')) {
              deviceInfo = text
            }
          }
          
          return new Response(JSON.stringify({ 
            success, 
            message: success ? 'Device connection successful' : 'Failed to connect to device',
            deviceInfo
          }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 200,
          })
        } catch (error) {
          console.error(`Error testing local device: ${error.message}`)
          
          return new Response(JSON.stringify({ 
            success: false, 
            message: `Error connecting to device: ${error.message}`,
            error: error.message
          }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 200,
          })
        }
      }
      
      case 'register-person': {
        // Register person with Hikvision API
        console.log(`Registering person with Hikvision API: ${personData?.name || memberData?.name}`)
        
        try {
          // Merge data from personData and memberData
          const person = personData || {
            name: memberData?.name || 'Unknown',
            gender: memberData?.gender || 'unknown',
            cardNo: memberData?.cardNo || memberData?.membership_id || memberData?.id,
            phone: memberData?.phone || '',
            email: memberData?.email || '',
            personType: 1, // Default to normal person
            pictures: memberData?.profile_picture ? [memberData.profile_picture] : []
          }
          
          // Add person to Hikvision
          const response = await fetch(`${apiUrl}/api/hpcgw/v1/person/add`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json',
              'Authorization': `Bearer ${accessToken}`,
            },
            body: JSON.stringify(person),
          })
          
          const data = await response.json()
          console.log(`Hikvision person add response: ${JSON.stringify(data, null, 2)}`)
          
          // Check if the person was added successfully
          if (data.code === '0' && data.data && data.data.personId) {
            // Now synchronize the person to devices
            const syncResponse = await fetch(`${apiUrl}/api/hpcgw/v1/person/synchronize`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Bearer ${accessToken}`,
              },
              body: JSON.stringify({
                personId: data.data.personId,
                deviceIds: [deviceId || deviceSn]
              }),
            })
            
            const syncData = await syncResponse.json()
            console.log(`Hikvision person sync response: ${JSON.stringify(syncData, null, 2)}`)
            
            // If we have member data, store the mapping
            if (memberData && memberData.id && data.data.personId) {
              const { error: mappingError } = await supabaseClient
                .from('member_access_credentials')
                .upsert({
                  member_id: memberData.id,
                  credential_type: 'hikvision',
                  credential_value: data.data.personId,
                  is_active: true,
                  issued_at: new Date().toISOString(),
                  created_at: new Date().toISOString(),
                  updated_at: new Date().toISOString()
                })
              
              if (mappingError) {
                console.error(`Error storing member access credential mapping: ${mappingError.message}`)
              } else {
                console.log(`Successfully stored member access credential mapping for member: ${memberData.id}`)
              }
            }
            
            // Return combined response
            return new Response(JSON.stringify({
              success: true,
              personId: data.data.personId,
              addResponse: data,
              syncResponse: syncData
            }), {
              headers: { ...corsHeaders, 'Content-Type': 'application/json' },
              status: 200,
            })
          } else {
            return new Response(JSON.stringify({
              success: false,
              error: data.msg || 'Unknown error',
              errorCode: data.code || 'UNKNOWN',
              response: data
            }), {
              headers: { ...corsHeaders, 'Content-Type': 'application/json' },
              status: 200,
            })
          }
        } catch (error) {
          console.error(`Error registering person: ${error.message}`)
          
          return new Response(JSON.stringify({ 
            success: false, 
            message: `Error registering person: ${error.message}`,
            error: error.message
          }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 200,
          })
        }
      }
      
      case 'subscribe': {
        // Subscribe to Hikvision events (normally access control events)
        console.log(`Subscribing to events: ${JSON.stringify(eventTypes || topics)}`)
        
        try {
          // Set default topics if not provided
          const topicsToUse = topics || ['acs.event.door_access'];
          
          const response = await fetch(`${apiUrl}/api/hpcgw/v1/mq/subscribe`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json',
              'Authorization': `Bearer ${accessToken}`,
            },
            body: JSON.stringify({
              topics: topicsToUse
            }),
          })
          
          const data = await response.json()
          console.log(`Hikvision subscribe response: ${JSON.stringify(data, null, 2)}`)
          
          return new Response(JSON.stringify(data), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: response.status,
          })
        } catch (error) {
          console.error(`Error subscribing to events: ${error.message}`)
          
          return new Response(JSON.stringify({ 
            success: false, 
            message: `Error subscribing to events: ${error.message}`,
            error: error.message
          }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 200,
          })
        }
      }
      
      case 'pollMessages': {
        // Poll for messages from Hikvision
        console.log(`Polling messages for subscription: ${subscriptionId}`)
        
        try {
          const response = await fetch(`${apiUrl}/api/hpcgw/v1/mq/messages`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json',
              'Authorization': `Bearer ${accessToken}`,
            },
            body: JSON.stringify({
              subscriptionId,
              offset: offset || '',
              maxReturnNum: maxReturnNum || 20
            }),
          })
          
          const data = await response.json()
          console.log(`Hikvision poll messages response: ${JSON.stringify(data, null, 2)}`)
          
          return new Response(JSON.stringify(data), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: response.status,
          })
        } catch (error) {
          console.error(`Error polling messages: ${error.message}`)
          
          return new Response(JSON.stringify({ 
            success: false, 
            message: `Error polling messages: ${error.message}`,
            error: error.message
          }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 200,
          })
        }
      }
      
      case 'acknowledgeOffset': {
        // Acknowledge message offset
        console.log(`Acknowledging offset for subscription: ${subscriptionId}`)
        
        try {
          const response = await fetch(`${apiUrl}/api/hpcgw/v1/mq/offset`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json',
              'Authorization': `Bearer ${accessToken}`,
            },
            body: JSON.stringify({
              subscriptionId,
              topic: topics?.[0] || 'acs.event.door_access',
              offset
            }),
          })
          
          const data = await response.json()
          console.log(`Hikvision acknowledge offset response: ${JSON.stringify(data, null, 2)}`)
          
          return new Response(JSON.stringify(data), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: response.status,
          })
        } catch (error) {
          console.error(`Error acknowledging offset: ${error.message}`)
          
          return new Response(JSON.stringify({ 
            success: false, 
            message: `Error acknowledging offset: ${error.message}`,
            error: error.message
          }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 200,
          })
        }
      }
      
      case 'assign-privileges': {
        // Assign access privileges to a person
        console.log(`Assigning privileges for person: ${requestData.personId} to device: ${deviceId || deviceSn}`)
        
        try {
          const response = await fetch(`${apiUrl}/api/hpcgw/v1/acs/privilege/config`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json',
              'Authorization': `Bearer ${accessToken}`,
            },
            body: JSON.stringify({
              personId: requestData.personId,
              deviceSerialNo: deviceId || deviceSn,
              doorList: requestData.doorList || [1],
              validStartTime: requestData.validStartTime || new Date().toISOString(),
              validEndTime: requestData.validEndTime || new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString()
            }),
          })
          
          const data = await response.json()
          console.log(`Hikvision privilege config response: ${JSON.stringify(data, null, 2)}`)
          
          return new Response(JSON.stringify(data), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: response.status,
          })
        } catch (error) {
          console.error(`Error assigning privileges: ${error.message}`)
          
          return new Response(JSON.stringify({ 
            success: false, 
            message: `Error assigning privileges: ${error.message}`,
            error: error.message
          }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 200,
          })
        }
      }
      
      default:
        return new Response(JSON.stringify({ error: 'Invalid action', action }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400,
        })
    }
  } catch (error) {
    console.error('Error processing request:', error)
    
    return new Response(JSON.stringify({ 
      error: error.message,
      stack: error.stack
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    })
  }
})
