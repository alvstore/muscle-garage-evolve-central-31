
import { serve } from 'https://deno.land/std@0.190.0/http/server.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req: Request) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { type, config, test } = await req.json();
    
    // Simulate processing time
    await new Promise(r => setTimeout(r, 800));
    
    console.log(`Testing ${type} integration with config:`, config);
    
    let result = { success: true, message: 'Test successful' };
    
    // Simulate different integration tests
    switch (type) {
      case 'sms':
        if (!config.senderId) {
          result = { success: false, message: 'Sender ID is required' };
        }
        if (config.provider === 'msg91' && !config.msg91AuthKey) {
          result = { success: false, message: 'MSG91 Auth Key is required' };
        }
        if (config.provider === 'twilio' && (!config.twilioAccountSid || !config.twilioAuthToken)) {
          result = { success: false, message: 'Twilio credentials are incomplete' };
        }
        if (result.success) {
          result.message = `Test SMS was sent to ${test.phone || 'your phone'}`;
        }
        break;
        
      case 'email':
        if (!config.from_email) {
          result = { success: false, message: 'Sender email is required' };
        }
        if (config.provider === 'sendgrid' && !config.sendgrid_api_key) {
          result = { success: false, message: 'SendGrid API Key is required' };
        }
        if (config.provider === 'smtp' && (!config.smtp_host || !config.smtp_port)) {
          result = { success: false, message: 'SMTP settings are incomplete' };
        }
        if (result.success) {
          result.message = `Test email was sent to ${test.email || 'your email'}`;
        }
        break;
        
      case 'whatsapp':
        if (!config.apiToken || !config.phoneNumberId) {
          result = { success: false, message: 'WhatsApp API credentials are incomplete' };
        }
        if (result.success) {
          result.message = `Test WhatsApp message was sent to ${test.phone || 'your phone'}`;
        }
        break;
        
      case 'payment':
        if (config.gateway === 'razorpay' && !config.config?.key_id) {
          result = { success: false, message: 'Razorpay Key ID is required' };
        }
        if (config.gateway === 'stripe' && !config.config?.publishable_key) {
          result = { success: false, message: 'Stripe Publishable Key is required' };
        }
        if (result.success) {
          result.message = `Payment gateway test was successful`;
        }
        break;
        
      default:
        result = { success: false, message: 'Unknown integration type' };
    }
    
    return new Response(JSON.stringify(result), { 
      headers: { 
        'Content-Type': 'application/json',
        ...corsHeaders 
      } 
    });
  } catch (error) {
    console.error('Error in test integration function:', error);
    return new Response(
      JSON.stringify({ success: false, message: error.message || 'Unknown error occurred' }),
      { 
        status: 400, 
        headers: { 
          'Content-Type': 'application/json',
          ...corsHeaders 
        } 
      }
    );
  }
});
