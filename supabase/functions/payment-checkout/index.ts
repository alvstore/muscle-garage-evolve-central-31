
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import Stripe from "https://esm.sh/stripe@12.0.0";
import Razorpay from "https://esm.sh/razorpay@2.8.6";

// CORS headers for browser requests
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface CheckoutRequest {
  planId?: string;
  classId?: string;
  email: string;
  name: string;
  phone?: string;
}

serve(async (req: Request) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    // Parse request body
    const { planId, classId, email, name, phone } = await req.json() as CheckoutRequest;

    if ((!planId && !classId) || !email || !name) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Fetch payment gateway settings from Supabase
    const { data: paymentSettings, error: settingsError } = await supabaseClient
      .from('payment_gateway_settings')
      .select('*')
      .eq('is_active', true)
      .maybeSingle();

    if (settingsError) {
      throw new Error(`Failed to fetch payment settings: ${settingsError.message}`);
    }

    if (!paymentSettings) {
      return new Response(
        JSON.stringify({ error: "No active payment gateway configured" }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    let planData = null;
    let classData = null;
    let amount = 0;
    let description = "";
    let itemType = "";
    let itemId = "";

    // Fetch plan or class details
    if (planId) {
      const { data: membership, error: membershipError } = await supabaseClient
        .from('memberships')
        .select('*')
        .eq('id', planId)
        .single();

      if (membershipError) {
        throw new Error(`Failed to fetch membership plan: ${membershipError.message}`);
      }

      planData = membership;
      amount = membership.price;
      description = `${membership.name} Membership`;
      itemType = "membership";
      itemId = planId;
    } else if (classId) {
      const { data: classInfo, error: classError } = await supabaseClient
        .from('classes')
        .select('*')
        .eq('id', classId)
        .single();

      if (classError) {
        throw new Error(`Failed to fetch class: ${classError.message}`);
      }

      classData = classInfo;
      // Assuming classes have a price field - adjust if different
      amount = classInfo.price || 0;
      description = `${classInfo.name} Class`;
      itemType = "class";
      itemId = classId;
    }

    // Generate a unique reference ID for this transaction
    const referenceId = crypto.randomUUID();

    // Store temporary checkout data for later use
    const { error: tempDataError } = await supabaseClient
      .from('temp_checkout_data')
      .insert([
        {
          reference_id: referenceId,
          email,
          name,
          phone,
          item_type: itemType,
          item_id: itemId,
          amount,
          description,
          status: 'pending',
          expires_at: new Date(Date.now() + 1000 * 60 * 30).toISOString() // 30 minutes expiry
        }
      ]);

    if (tempDataError) {
      throw new Error(`Failed to store temporary checkout data: ${tempDataError.message}`);
    }

    // Initialize payment gateway and create checkout session based on gateway type
    const gateway = paymentSettings.gateway;
    let checkoutUrl;
    let orderId;

    switch (gateway) {
      case 'razorpay':
        const razorpay = new Razorpay({
          key_id: paymentSettings.config.key_id,
          key_secret: paymentSettings.config.key_secret
        });

        const orderOptions = {
          amount: amount * 100, // Convert to paisa
          currency: "INR",
          receipt: referenceId,
          notes: {
            description,
            email,
            name,
            type: itemType,
            id: itemId,
            reference_id: referenceId
          }
        };

        const razorpayOrder = await razorpay.orders.create(orderOptions);
        orderId = razorpayOrder.id;

        // Update temp data with order ID
        await supabaseClient
          .from('temp_checkout_data')
          .update({ external_id: orderId })
          .eq('reference_id', referenceId);

        // Return data to initialize Razorpay checkout
        return new Response(
          JSON.stringify({ 
            provider: 'razorpay',
            key_id: paymentSettings.config.key_id,
            order_id: orderId,
            amount: orderOptions.amount,
            currency: orderOptions.currency,
            name: "Muscle Garaage",
            description,
            prefill: {
              name,
              email,
              contact: phone || ""
            },
            reference_id: referenceId
          }),
          { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );

      case 'stripe':
        const stripe = new Stripe(paymentSettings.config.secret_key, {
          apiVersion: '2023-10-16',
        });

        const session = await stripe.checkout.sessions.create({
          payment_method_types: ['card'],
          line_items: [
            {
              price_data: {
                currency: 'inr',
                product_data: {
                  name: description,
                },
                unit_amount: amount * 100, // Convert to paisa/cents
              },
              quantity: 1,
            },
          ],
          mode: 'payment',
          success_url: `${req.headers.get('origin')}/payment-success?reference=${referenceId}`,
          cancel_url: `${req.headers.get('origin')}/payment-cancel`,
          metadata: {
            reference_id: referenceId,
            type: itemType,
            id: itemId,
            email,
            name
          }
        });

        orderId = session.id;
        checkoutUrl = session.url;

        // Update temp data with order ID
        await supabaseClient
          .from('temp_checkout_data')
          .update({ external_id: orderId })
          .eq('reference_id', referenceId);

        // Return checkout URL for Stripe
        return new Response(
          JSON.stringify({ 
            provider: 'stripe',
            url: checkoutUrl,
            reference_id: referenceId
          }),
          { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );

      default:
        return new Response(
          JSON.stringify({ error: "Unsupported payment gateway" }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
    }
  } catch (error) {
    console.error('Payment checkout error:', error);
    
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
