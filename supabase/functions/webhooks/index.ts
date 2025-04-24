
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Webhook handler for different payment gateways
serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!, 
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  )

  try {
    const { gateway } = await req.json()
    
    // Validate webhook source and signature
    const { data: gatewayConfig } = await supabase
      .from('payment_gateway_settings')
      .select('*')
      .eq('gateway', gateway)
      .single()

    if (!gatewayConfig || !gatewayConfig.is_active) {
      return new Response(JSON.stringify({ error: 'Invalid or inactive gateway' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    // Gateway-specific webhook processing
    switch (gateway) {
      case 'razorpay':
        return await processRazorpayWebhook(req, supabase)
      case 'payu':
        return await processPayuWebhook(req, supabase)
      case 'ccavenue':
        return await processCCAvenueWebhook(req, supabase)
      case 'phonepe':
        return await processPhonePeWebhook(req, supabase)
      default:
        return new Response(JSON.stringify({ error: 'Unsupported gateway' }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        })
    }
  } catch (error) {
    console.error('Webhook processing error:', error)
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
})

// Individual gateway webhook processors
async function processRazorpayWebhook(req: Request, supabase: any) {
  const payload = await req.json()
  const signature = req.headers.get('x-razorpay-signature')

  // Verify Razorpay signature 
  // Implement signature verification logic here

  const { error } = await supabase.from('webhook_logs').insert({
    gateway: 'razorpay',
    event_type: payload.event,
    payload,
    signature,
    status: 'success'
  })

  // Process specific Razorpay event types
  switch (payload.event) {
    case 'payment.captured':
      // Update transactions, invoices
      break
    case 'refund.processed':
      // Handle refund logic
      break
  }

  return new Response(JSON.stringify({ received: true }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
  })
}

// Similar processors for PayU, CCAvenue, PhonePe
async function processPayuWebhook(req: Request, supabase: any) {
  // Placeholder for PayU webhook processing
  return new Response(JSON.stringify({ received: true }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
  })
}

async function processCCAvenueWebhook(req: Request, supabase: any) {
  // Placeholder for CCAvenue webhook processing
  return new Response(JSON.stringify({ received: true }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
  })
}

async function processPhonePeWebhook(req: Request, supabase: any) {
  // Placeholder for PhonePe webhook processing
  return new Response(JSON.stringify({ received: true }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
  })
}
