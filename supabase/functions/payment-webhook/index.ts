
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import Stripe from "https://esm.sh/stripe@12.0.0";
import crypto from "https://deno.land/std@0.177.0/node/crypto.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Handle account creation and membership/class assignment
async function handleSuccessfulPayment(supabase, paymentData) {
  const { reference_id, email, name, phone, item_type, item_id, amount } = paymentData;
  
  try {
    // 1. Check if user exists or create new user
    const { data: existingUser, error: userLookupError } = await supabase
      .from('profiles')
      .select('id')
      .eq('email', email)
      .maybeSingle();

    if (userLookupError) {
      throw new Error(`Error looking up user: ${userLookupError.message}`);
    }

    let userId;
    if (!existingUser) {
      // Create new user in auth
      const tempPassword = crypto.randomBytes(12).toString('hex');
      const { data: authUser, error: createUserError } = await supabase.auth.admin.createUser({
        email,
        password: tempPassword,
        email_confirm: true,
        user_metadata: { 
          full_name: name,
          phone
        }
      });

      if (createUserError) {
        throw new Error(`Error creating user: ${createUserError.message}`);
      }

      userId = authUser.user.id;

      // Send password reset email so user can set their own password
      await supabase.auth.admin.generateLink({
        type: 'recovery',
        email
      });
    } else {
      userId = existingUser.id;
    }

    // Get branch ID (use the first active branch if multiple exist)
    const { data: branch, error: branchError } = await supabase
      .from('branches')
      .select('id')
      .eq('is_active', true)
      .limit(1)
      .single();

    if (branchError) {
      throw new Error(`Error getting branch: ${branchError.message}`);
    }
    
    const branchId = branch.id;

    // 2. Assign the item (membership or class) to the user
    if (item_type === 'membership') {
      // Get membership details
      const { data: membership, error: membershipError } = await supabase
        .from('memberships')
        .select('*')
        .eq('id', item_id)
        .single();

      if (membershipError) {
        throw new Error(`Error fetching membership: ${membershipError.message}`);
      }

      // Calculate end date based on duration_days
      const startDate = new Date();
      const endDate = new Date(startDate);
      endDate.setDate(endDate.getDate() + membership.duration_days);

      // Create membership subscription
      const { error: subscriptionError } = await supabase
        .from('membership_subscriptions')
        .insert([{
          user_id: userId,
          plan_id: item_id,
          start_date: startDate.toISOString(),
          end_date: endDate.toISOString(),
          status: 'active',
          amount_paid: amount,
          payment_id: reference_id,
          branch_id: branchId
        }]);

      if (subscriptionError) {
        throw new Error(`Error creating membership subscription: ${subscriptionError.message}`);
      }

      // Update the member's profile
      if (!existingUser) {
        const { error: memberError } = await supabase
          .from('members')
          .insert([{
            user_id: userId,
            name,
            email,
            phone,
            status: 'active',
            branch_id: branchId,
            membership_id: item_id,
            membership_status: 'active',
            membership_start_date: startDate.toISOString(),
            membership_end_date: endDate.toISOString()
          }]);

        if (memberError) {
          throw new Error(`Error creating member: ${memberError.message}`);
        }
      } else {
        // Update existing member profile
        const { error: updateMemberError } = await supabase
          .from('members')
          .update({
            membership_id: item_id,
            membership_status: 'active',
            membership_start_date: startDate.toISOString(),
            membership_end_date: endDate.toISOString()
          })
          .eq('user_id', userId);

        if (updateMemberError) {
          throw new Error(`Error updating member: ${updateMemberError.message}`);
        }
      }

      // Trigger automation rules for membership_assigned event
      const { data: automationRules, error: rulesError } = await supabase
        .from('automation_rules')
        .select('*')
        .eq('trigger_type', 'membership_assigned')
        .eq('is_active', true);

      if (!rulesError && automationRules && automationRules.length > 0) {
        // Process automation rules (simplified implementation)
        for (const rule of automationRules) {
          // Execute actions based on rule.actions
          console.log(`Executing automation rule: ${rule.name}`);
        }
      }

    } else if (item_type === 'class') {
      // Handle class booking
      const { data: classInfo, error: classError } = await supabase
        .from('classes')
        .select('*')
        .eq('id', item_id)
        .single();

      if (classError) {
        throw new Error(`Error fetching class: ${classError.message}`);
      }

      // Create class booking
      const { error: bookingError } = await supabase
        .from('class_bookings')
        .insert([{
          class_id: item_id,
          member_id: userId,
          status: 'confirmed'
        }]);

      if (bookingError) {
        throw new Error(`Error creating class booking: ${bookingError.message}`);
      }

      // Update class enrollment count
      await supabase.rpc('increment_class_enrollment', { class_id: item_id });

      // Trigger automation rules for class_booked event
      const { data: automationRules, error: rulesError } = await supabase
        .from('automation_rules')
        .select('*')
        .eq('trigger_type', 'class_booked')
        .eq('is_active', true);

      if (!rulesError && automationRules && automationRules.length > 0) {
        // Process automation rules (simplified implementation)
        for (const rule of automationRules) {
          console.log(`Executing automation rule: ${rule.name}`);
        }
      }
    }

    // Mark the checkout as completed
    await supabase
      .from('temp_checkout_data')
      .update({ status: 'completed' })
      .eq('reference_id', reference_id);

    return { success: true, user_id: userId };
  } catch (error) {
    console.error('Payment processing error:', error);
    
    // Mark the checkout as failed
    await supabase
      .from('temp_checkout_data')
      .update({ status: 'failed', error: error.message })
      .eq('reference_id', reference_id);
    
    throw error;
  }
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

    // Parse request based on content type
    let payload;
    const contentType = req.headers.get('content-type');
    
    if (contentType?.includes('application/json')) {
      payload = await req.json();
    } else if (contentType?.includes('application/x-www-form-urlencoded')) {
      const formData = await req.formData();
      payload = Object.fromEntries(formData.entries());
    } else {
      const text = await req.text();
      try {
        payload = JSON.parse(text);
      } catch (e) {
        payload = { rawBody: text };
      }
    }

    // Log the webhook payload
    console.log('Received webhook payload:', JSON.stringify(payload));
    
    // Check signature headers for verification
    const signature = req.headers.get('x-razorpay-signature') || req.headers.get('stripe-signature');
    
    // Determine gateway type based on payload or headers
    let gatewayType = '';
    
    if (req.headers.get('x-razorpay-signature')) {
      gatewayType = 'razorpay';
    } else if (req.headers.get('stripe-signature')) {
      gatewayType = 'stripe';
    } else if (payload.type && payload.type.startsWith('checkout.session')) {
      gatewayType = 'stripe';
    } else if (payload.event && payload.payload && payload.payload.payment && payload.payload.payment.entity) {
      gatewayType = 'razorpay';
    }

    // Log webhook to database
    const { data: logData, error: logError } = await supabaseClient
      .from('webhook_logs')
      .insert({
        gateway: gatewayType,
        payload: payload,
        signature: signature,
        event_type: gatewayType === 'razorpay' ? payload.event : payload.type,
        status: 'received',
        ip_address: req.headers.get('x-forwarded-for') || 'unknown'
      })
      .select()
      .single();
    
    if (logError) {
      console.error('Error logging webhook:', logError);
    }

    // Get gateway settings
    const { data: gatewaySettings, error: settingsError } = await supabaseClient
      .from('payment_gateway_settings')
      .select('*')
      .eq('gateway', gatewayType)
      .maybeSingle();

    if (settingsError) {
      throw new Error(`Failed to fetch gateway settings: ${settingsError.message}`);
    }

    if (!gatewaySettings) {
      throw new Error(`No settings found for gateway: ${gatewayType}`);
    }

    // Process based on gateway type
    let isValidSignature = false;
    let reference_id = null;
    let paymentStatus = '';

    if (gatewayType === 'razorpay') {
      // Verify Razorpay signature
      if (signature && gatewaySettings.webhook_secret) {
        const rawBody = await req.text();
        const expectedSignature = crypto
          .createHmac('sha256', gatewaySettings.webhook_secret)
          .update(rawBody)
          .digest('hex');
        
        isValidSignature = signature === expectedSignature;
      }

      // Process Razorpay webhook
      if (payload.event === 'payment.captured') {
        const orderEntity = payload.payload.payment.entity;
        reference_id = orderEntity.notes?.reference_id;
        paymentStatus = 'completed';
      } else if (payload.event === 'payment.failed') {
        const orderEntity = payload.payload.payment.entity;
        reference_id = orderEntity.notes?.reference_id;
        paymentStatus = 'failed';
      }
    } else if (gatewayType === 'stripe') {
      // Verify Stripe signature
      if (signature && gatewaySettings.webhook_secret) {
        const rawBody = await req.text();
        
        try {
          const stripe = new Stripe(gatewaySettings.config.secret_key, {
            apiVersion: '2023-10-16',
          });
          
          const event = stripe.webhooks.constructEvent(
            rawBody,
            signature,
            gatewaySettings.webhook_secret
          );
          
          isValidSignature = true;
        } catch (err) {
          console.error('Stripe signature verification failed:', err);
          isValidSignature = false;
        }
      }

      // Process Stripe webhook
      if (payload.type === 'checkout.session.completed') {
        reference_id = payload.data.object.metadata?.reference_id;
        paymentStatus = 'completed';
      } else if (payload.type === 'checkout.session.expired') {
        reference_id = payload.data.object.metadata?.reference_id;
        paymentStatus = 'failed';
      }
    }

    // Update webhook log status
    await supabaseClient
      .from('webhook_logs')
      .update({
        status: isValidSignature ? 'verified' : 'invalid_signature',
        processed_at: new Date().toISOString()
      })
      .eq('id', logData?.id);

    // If we have a reference ID and payment is completed, process the payment
    if (reference_id && paymentStatus === 'completed') {
      // Get checkout data
      const { data: checkoutData, error: checkoutError } = await supabaseClient
        .from('temp_checkout_data')
        .select('*')
        .eq('reference_id', reference_id)
        .maybeSingle();

      if (checkoutError) {
        throw new Error(`Error fetching checkout data: ${checkoutError.message}`);
      }

      if (!checkoutData) {
        throw new Error(`No checkout data found for reference: ${reference_id}`);
      }

      // Process the payment
      const result = await handleSuccessfulPayment(supabaseClient, checkoutData);

      // Update webhook log status
      await supabaseClient
        .from('webhook_logs')
        .update({
          status: 'processed',
          processed_at: new Date().toISOString()
        })
        .eq('id', logData?.id);

      return new Response(
        JSON.stringify({ success: true, message: "Payment processed successfully" }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    } else if (reference_id && paymentStatus === 'failed') {
      // Update checkout data status
      await supabaseClient
        .from('temp_checkout_data')
        .update({ status: 'failed' })
        .eq('reference_id', reference_id);
    }

    // Always return success to acknowledge receipt of webhook
    return new Response(
      JSON.stringify({ success: true, message: "Webhook received" }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Webhook handling error:', error);
    
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
