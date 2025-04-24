
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";

// Define the EmailSettings interface directly within the edge function
export interface EmailSettings {
  id?: string;
  provider: 'sendgrid' | 'mailgun' | 'smtp';
  from_email: string;
  sendgrid_api_key?: string;
  mailgun_api_key?: string;
  mailgun_domain?: string;
  smtp_host?: string;
  smtp_port?: number;
  smtp_username?: string;
  smtp_password?: string;
  smtp_secure?: boolean;
  is_active: boolean;
  notifications: {
    sendOnRegistration: boolean;
    sendOnInvoice: boolean;
    sendClassUpdates: boolean;
  };
  branch_id?: string;
}

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { settings, testEmail } = await req.json();

    // Here you would implement the actual email sending logic based on the provider
    // For now, we'll simulate a successful email send
    console.log('Testing email settings:', { settings, testEmail });

    // Simulate email sending delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    return new Response(
      JSON.stringify({ success: true }),
      { 
        headers: { 
          'Content-Type': 'application/json',
          ...corsHeaders 
        } 
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
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
