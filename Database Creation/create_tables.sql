

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;


COMMENT ON SCHEMA "public" IS 'standard public schema';



CREATE EXTENSION IF NOT EXISTS "pg_graphql" WITH SCHEMA "graphql";






CREATE EXTENSION IF NOT EXISTS "pg_stat_statements" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "pgcrypto" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "pgjwt" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "supabase_vault" WITH SCHEMA "vault";






CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA "extensions";






CREATE TYPE "public"."class_status" AS ENUM (
    'active',
    'cancelled',
    'completed'
);


ALTER TYPE "public"."class_status" OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."can_book_class"("user_uuid" "uuid") RETURNS boolean
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO 'public'
    AS $$
BEGIN
  RETURN public.user_has_active_membership(user_uuid);
END;
$$;


ALTER FUNCTION "public"."can_book_class"("user_uuid" "uuid") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."get_all_website_content"() RETURNS TABLE("section" "text", "content" "jsonb")
    LANGUAGE "sql" SECURITY DEFINER
    AS $$
  SELECT 
    section,
    jsonb_agg(
      jsonb_build_object(
        'id', id,
        'title', title,
        'subtitle', subtitle,
        'content', content,
        'image_url', image_url,
        'order_index', order_index,
        'is_active', is_active,
        'created_at', created_at,
        'updated_at', updated_at
      )
    ) as content
  FROM public.website_content
  WHERE is_active = true
  GROUP BY section
  ORDER BY section;
$$;


ALTER FUNCTION "public"."get_all_website_content"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."get_attendance_trend"("branch_id_param" "uuid", "start_date" "date", "end_date" "date") RETURNS TABLE("date_point" "date", "attendance_count" integer)
    LANGUAGE "plpgsql"
    AS $$
BEGIN
    RETURN QUERY
    WITH date_series AS (
        SELECT generate_series(start_date::timestamp, end_date::timestamp, '1 day'::interval)::date AS date_point
    ),
    attendance_data AS (
        SELECT
            check_in::date as date_point,
            COUNT(*) as count
        FROM member_attendance
        WHERE 
            branch_id = branch_id_param AND
            check_in >= start_date AND
            check_in <= end_date + INTERVAL '1 day'
        GROUP BY date_point
    )
    SELECT
        ds.date_point,
        COALESCE(ad.count, 0) as attendance_count
    FROM
        date_series ds
        LEFT JOIN attendance_data ad ON ds.date_point = ad.date_point
    ORDER BY
        ds.date_point;
END;
$$;


ALTER FUNCTION "public"."get_attendance_trend"("branch_id_param" "uuid", "start_date" "date", "end_date" "date") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."get_membership_trend"("branch_id_param" "uuid", "start_date" "date", "end_date" "date") RETURNS TABLE("date_point" "date", "new_members" integer, "cancelled_members" integer, "net_change" integer)
    LANGUAGE "plpgsql"
    AS $$
BEGIN
    RETURN QUERY
    WITH date_series AS (
        SELECT generate_series(start_date::timestamp, end_date::timestamp, '1 day'::interval)::date AS date_point
    ),
    new_members_data AS (
        SELECT
            created_at::date as date_point,
            COUNT(*) as count
        FROM members
        WHERE 
            branch_id = branch_id_param AND
            created_at >= start_date AND
            created_at <= end_date + INTERVAL '1 day'
        GROUP BY date_point
    ),
    cancelled_members_data AS (
        SELECT
            updated_at::date as date_point,
            COUNT(*) as count
        FROM members
        WHERE 
            branch_id = branch_id_param AND
            status = 'cancelled' AND
            updated_at >= start_date AND
            updated_at <= end_date + INTERVAL '1 day'
        GROUP BY date_point
    )
    SELECT
        ds.date_point,
        COALESCE(nm.count, 0) as new_members,
        COALESCE(cm.count, 0) as cancelled_members,
        COALESCE(nm.count, 0) - COALESCE(cm.count, 0) as net_change
    FROM
        date_series ds
        LEFT JOIN new_members_data nm ON ds.date_point = nm.date_point
        LEFT JOIN cancelled_members_data cm ON ds.date_point = cm.date_point
    ORDER BY
        ds.date_point;
END;
$$;


ALTER FUNCTION "public"."get_membership_trend"("branch_id_param" "uuid", "start_date" "date", "end_date" "date") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."get_revenue_breakdown"("branch_id_param" "uuid", "start_date" "date", "end_date" "date") RETURNS TABLE("category" "text", "amount" numeric)
    LANGUAGE "plpgsql"
    AS $$
BEGIN
    RETURN QUERY
    SELECT
        COALESCE(category, 'Other') as category,
        SUM(amount) as amount
    FROM income_records
    WHERE 
        branch_id = branch_id_param AND
        date >= start_date AND
        date <= end_date + INTERVAL '1 day'
    GROUP BY category
    ORDER BY amount DESC;
END;
$$;


ALTER FUNCTION "public"."get_revenue_breakdown"("branch_id_param" "uuid", "start_date" "date", "end_date" "date") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."get_user_role"() RETURNS "text"
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO 'public'
    AS $$
BEGIN
  RETURN (SELECT role FROM profiles WHERE id = auth.uid());
END;
$$;


ALTER FUNCTION "public"."get_user_role"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."get_user_role"("user_id" "uuid") RETURNS "text"
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO 'public'
    AS $$
BEGIN
  RETURN (SELECT role FROM profiles WHERE id = user_id);
END;
$$;


ALTER FUNCTION "public"."get_user_role"("user_id" "uuid") OWNER TO "postgres";

SET default_tablespace = '';

SET default_table_access_method = "heap";


CREATE TABLE IF NOT EXISTS "public"."website_content" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "section" "text" NOT NULL,
    "title" "text",
    "subtitle" "text",
    "content" "text",
    "image_url" "text",
    "order_index" integer DEFAULT 0,
    "is_active" boolean DEFAULT true,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."website_content" OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."get_website_section_content"("section_name" "text") RETURNS SETOF "public"."website_content"
    LANGUAGE "sql" SECURITY DEFINER
    AS $$
  SELECT * FROM public.website_content 
  WHERE section = section_name AND is_active = true
  ORDER BY order_index ASC;
$$;


ALTER FUNCTION "public"."get_website_section_content"("section_name" "text") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."handle_new_membership"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO 'public'
    AS $$
DECLARE
  membership_plan RECORD;
  income_record_id UUID;
  invoice_id UUID;
  user_profile RECORD;
BEGIN
  -- Get membership plan details
  SELECT * INTO membership_plan FROM public.memberships WHERE id = NEW.plan_id;
  
  -- Get user profile details
  SELECT * INTO user_profile FROM public.profiles WHERE id = NEW.user_id;
  
  -- Create income record
  INSERT INTO public.income_records (
    source, 
    description, 
    category, 
    amount, 
    payment_method, 
    reference,
    branch_id,
    date
  ) VALUES (
    COALESCE(user_profile.full_name, 'Online Purchase'),
    COALESCE(membership_plan.name, 'Membership Subscription'),
    'Membership',
    NEW.amount_paid,
    CASE 
      WHEN NEW.payment_id IS NOT NULL THEN 'online'
      ELSE 'manual'
    END,
    NEW.payment_id,
    NEW.branch_id,
    CURRENT_TIMESTAMP
  )
  RETURNING id INTO income_record_id;
  
  -- Create invoice
  INSERT INTO public.invoices (
    member_id,
    amount,
    status,
    due_date,
    issued_date,
    paid_date,
    payment_method,
    razorpay_payment_id,
    branch_id,
    items,
    description
  ) VALUES (
    NEW.user_id,
    NEW.amount_paid,
    'paid',
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP,
    CASE 
      WHEN NEW.payment_id IS NOT NULL THEN 'online'
      ELSE 'manual'
    END,
    NEW.payment_id,
    NEW.branch_id,
    jsonb_build_array(
      jsonb_build_object(
        'id', gen_random_uuid(),
        'name', COALESCE(membership_plan.name, 'Membership Subscription'),
        'description', 'From ' || to_char(NEW.start_date, 'YYYY-MM-DD') || ' to ' || to_char(NEW.end_date, 'YYYY-MM-DD'),
        'quantity', 1,
        'price', NEW.amount_paid
      )
    ),
    'Membership Subscription'
  )
  RETURNING id INTO invoice_id;
  
  -- Update the membership subscription with the invoice ID
  UPDATE public.membership_subscriptions
  SET invoice_id = invoice_id
  WHERE id = NEW.id;
  
  RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."handle_new_membership"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."handle_new_user"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO 'public'
    AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, email, role)
  VALUES (new.id, new.raw_user_meta_data->>'full_name', new.email, COALESCE(new.raw_user_meta_data->>'role', 'member'));
  RETURN new;
END;
$$;


ALTER FUNCTION "public"."handle_new_user"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."is_admin"() RETURNS boolean
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO 'public'
    AS $$
DECLARE
  result BOOLEAN;
BEGIN
  PERFORM set_config('row_security', 'off', true); -- ⛔ Disable RLS inside the function

  SELECT role = 'admin'
  INTO result
  FROM profiles
  WHERE id = auth.uid();

  RETURN result;
END;
$$;


ALTER FUNCTION "public"."is_admin"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."trainer_is_assigned_to_member"("trainer_uuid" "uuid", "member_uuid" "uuid") RETURNS boolean
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO 'public'
    AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM trainer_assignments
    WHERE trainer_id = trainer_uuid AND
          member_id = member_uuid AND
          is_active = true
  );
END;
$$;


ALTER FUNCTION "public"."trainer_is_assigned_to_member"("trainer_uuid" "uuid", "member_uuid" "uuid") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."update_payment_settings_timestamp"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO 'public'
    AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."update_payment_settings_timestamp"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."update_updated_at_column"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."update_updated_at_column"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."update_updated_at_column_for_website_content"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
   NEW.updated_at = now(); 
   RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."update_updated_at_column_for_website_content"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."upsert_settings_batch"("settings_array" "jsonb") RETURNS "void"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
DECLARE
    setting_item jsonb;
BEGIN
    -- Loop through each setting in the array
    FOR setting_item IN SELECT * FROM jsonb_array_elements(settings_array)
    LOOP
        -- Upsert each setting
        INSERT INTO public.settings (
            category, 
            key, 
            value, 
            branch_id, 
            description, 
            updated_at
        )
        VALUES (
            (setting_item->>'category')::text,
            (setting_item->>'key')::text,
            (setting_item->>'value')::jsonb,
            (CASE 
                WHEN setting_item->>'branch_id' IS NOT NULL 
                THEN (setting_item->>'branch_id')::uuid 
                ELSE NULL 
            END),
            (setting_item->>'description')::text,
            now()
        )
        ON CONFLICT (category, key, branch_id) 
        DO UPDATE SET
            value = (setting_item->>'value')::jsonb,
            updated_at = now();
    END LOOP;
END;
$$;


ALTER FUNCTION "public"."upsert_settings_batch"("settings_array" "jsonb") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."user_belongs_to_branch"("branch_id" "uuid") RETURNS boolean
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $_$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid()
    AND (
      branch_id = $1 
      OR role = 'admin' 
      OR $1 = ANY(accessible_branch_ids)
    )
  );
END;
$_$;


ALTER FUNCTION "public"."user_belongs_to_branch"("branch_id" "uuid") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."user_has_active_membership"("user_uuid" "uuid") RETURNS boolean
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO 'public'
    AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.membership_subscriptions
    WHERE user_id = user_uuid
    AND status = 'active'
    AND end_date > now()
  );
END;
$$;


ALTER FUNCTION "public"."user_has_active_membership"("user_uuid" "uuid") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."user_has_branch_access"("branch_id" "uuid") RETURNS boolean
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO 'public'
    AS $$
DECLARE
  user_role text;
  user_branch_id uuid;
  user_branch_ids uuid[];
  is_manager boolean;
BEGIN
  -- Get current user's role and branch information
  SELECT 
    p.role,
    p.branch_id,
    p.accessible_branch_ids,
    p.is_branch_manager
  INTO 
    user_role,
    user_branch_id,
    user_branch_ids,
    is_manager
  FROM profiles p
  WHERE p.id = auth.uid();

  -- Admin has access to all branches
  IF user_role = 'admin' THEN
    RETURN TRUE;
  END IF;

  -- User has access to their own branch
  IF user_branch_id = branch_id THEN
    RETURN TRUE;
  END IF;

  -- Branch manager or staff with multiple branch access
  IF user_role IN ('staff', 'trainer') AND user_branch_ids IS NOT NULL AND branch_id = ANY(user_branch_ids) THEN
    RETURN TRUE;
  END IF;

  -- Default: no access
  RETURN FALSE;
END;
$$;


ALTER FUNCTION "public"."user_has_branch_access"("branch_id" "uuid") OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."income_records" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "date" timestamp without time zone NOT NULL,
    "amount" numeric NOT NULL,
    "category" "text" NOT NULL,
    "description" "text" NOT NULL,
    "source" "text" NOT NULL,
    "payment_method" "text" NOT NULL,
    "reference" "text" NOT NULL,
    "branch_id" "uuid" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."income_records" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."member_attendance" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "member_id" "uuid",
    "branch_id" "uuid",
    "check_in" timestamp with time zone DEFAULT "now"() NOT NULL,
    "check_out" timestamp with time zone,
    "access_method" "text" DEFAULT 'manual'::"text",
    "device_id" "text",
    "recorded_by" "uuid",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."member_attendance" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."member_memberships" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "member_id" "uuid",
    "membership_id" "uuid",
    "branch_id" "uuid",
    "start_date" "date" NOT NULL,
    "end_date" "date" NOT NULL,
    "status" "text" DEFAULT 'active'::"text" NOT NULL,
    "trainer_id" "uuid",
    "total_amount" numeric(10,2) NOT NULL,
    "amount_paid" numeric(10,2) DEFAULT 0,
    "payment_status" "text" DEFAULT 'pending'::"text" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."member_memberships" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."members" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" "uuid",
    "name" "text" NOT NULL,
    "email" "text",
    "phone" "text",
    "gender" "text",
    "blood_group" "text",
    "occupation" "text",
    "date_of_birth" "date",
    "goal" "text",
    "membership_id" "text",
    "membership_status" "text" DEFAULT 'active'::"text",
    "membership_start_date" timestamp with time zone DEFAULT "now"(),
    "membership_end_date" timestamp with time zone,
    "trainer_id" "uuid",
    "branch_id" "uuid",
    "status" "text" DEFAULT 'active'::"text",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."members" OWNER TO "postgres";


CREATE OR REPLACE VIEW "public"."analytics_dashboard_stats" WITH ("security_invoker"='on') AS
 WITH "member_stats" AS (
         SELECT "members"."branch_id",
            "count"(*) FILTER (WHERE ("members"."status" = 'active'::"text")) AS "active_members",
            "count"(*) FILTER (WHERE ("members"."created_at" >= ("now"() - '24:00:00'::interval))) AS "new_members_daily",
            "count"(*) FILTER (WHERE ("members"."created_at" >= ("now"() - '7 days'::interval))) AS "new_members_weekly",
            "count"(*) FILTER (WHERE ("members"."created_at" >= ("now"() - '30 days'::interval))) AS "new_members_monthly",
            "count"(*) FILTER (WHERE (("members"."status" = 'cancelled'::"text") AND ("members"."updated_at" >= ("now"() - '30 days'::interval)))) AS "cancelled_members_monthly"
           FROM "public"."members"
          GROUP BY "members"."branch_id"
        ), "revenue_stats" AS (
         SELECT "income_records"."branch_id",
            "sum"("income_records"."amount") FILTER (WHERE (("income_records"."category" = 'Membership'::"text") AND ("income_records"."date" >= ("now"() - '30 days'::interval)))) AS "membership_revenue",
            "sum"("income_records"."amount") FILTER (WHERE (("income_records"."category" = 'Supplements'::"text") AND ("income_records"."date" >= ("now"() - '30 days'::interval)))) AS "supplements_revenue",
            "sum"("income_records"."amount") FILTER (WHERE (("income_records"."category" = 'Merchandise'::"text") AND ("income_records"."date" >= ("now"() - '30 days'::interval)))) AS "merchandise_revenue",
            "sum"("income_records"."amount") FILTER (WHERE ("income_records"."date" >= ("now"() - '30 days'::interval))) AS "total_revenue"
           FROM "public"."income_records"
          GROUP BY "income_records"."branch_id"
        ), "attendance_stats" AS (
         SELECT "member_attendance"."branch_id",
            "count"(*) FILTER (WHERE ("member_attendance"."check_in" >= ("now"() - '7 days'::interval))) AS "weekly_check_ins",
            "count"(*) FILTER (WHERE ("member_attendance"."check_in" >= ("now"() - '30 days'::interval))) AS "monthly_check_ins"
           FROM "public"."member_attendance"
          GROUP BY "member_attendance"."branch_id"
        ), "renewals_stats" AS (
         SELECT "member_memberships"."branch_id",
            "count"(*) FILTER (WHERE (("member_memberships"."end_date" >= "now"()) AND ("member_memberships"."end_date" <= ("now"() + '15 days'::interval)))) AS "upcoming_renewals"
           FROM "public"."member_memberships"
          WHERE ("member_memberships"."status" = 'active'::"text")
          GROUP BY "member_memberships"."branch_id"
        )
 SELECT COALESCE("m"."branch_id", "r"."branch_id", "a"."branch_id", "rn"."branch_id") AS "branch_id",
    COALESCE("m"."active_members", (0)::bigint) AS "active_members",
    COALESCE("m"."new_members_daily", (0)::bigint) AS "new_members_daily",
    COALESCE("m"."new_members_weekly", (0)::bigint) AS "new_members_weekly",
    COALESCE("m"."new_members_monthly", (0)::bigint) AS "new_members_monthly",
    COALESCE("m"."cancelled_members_monthly", (0)::bigint) AS "cancelled_members_monthly",
    COALESCE("r"."membership_revenue", (0)::numeric) AS "membership_revenue",
    COALESCE("r"."supplements_revenue", (0)::numeric) AS "supplements_revenue",
    COALESCE("r"."merchandise_revenue", (0)::numeric) AS "merchandise_revenue",
    COALESCE("r"."total_revenue", (0)::numeric) AS "total_revenue",
    COALESCE("a"."weekly_check_ins", (0)::bigint) AS "weekly_check_ins",
    COALESCE("a"."monthly_check_ins", (0)::bigint) AS "monthly_check_ins",
    COALESCE("rn"."upcoming_renewals", (0)::bigint) AS "upcoming_renewals"
   FROM ((("member_stats" "m"
     FULL JOIN "revenue_stats" "r" ON (("m"."branch_id" = "r"."branch_id")))
     FULL JOIN "attendance_stats" "a" ON ((COALESCE("m"."branch_id", "r"."branch_id") = "a"."branch_id")))
     FULL JOIN "renewals_stats" "rn" ON ((COALESCE("m"."branch_id", "r"."branch_id", "a"."branch_id") = "rn"."branch_id")));


ALTER TABLE "public"."analytics_dashboard_stats" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."announcements" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "title" "text" NOT NULL,
    "content" "text" NOT NULL,
    "priority" "text" NOT NULL,
    "author_id" "uuid",
    "author_name" "text",
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "expires_at" timestamp with time zone,
    "channel" "text",
    "branch_id" "uuid",
    "target_roles" "text"[] DEFAULT '{}'::"text"[] NOT NULL,
    "channels" "text"[] DEFAULT '{}'::"text"[] NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "author" "text",
    CONSTRAINT "announcements_priority_check" CHECK (("priority" = ANY (ARRAY['low'::"text", 'medium'::"text", 'high'::"text"])))
);


ALTER TABLE "public"."announcements" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."attendance_settings" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "hikvision_enabled" boolean DEFAULT false,
    "qr_enabled" boolean DEFAULT true,
    "device_config" "jsonb" DEFAULT '{}'::"jsonb",
    "branch_id" "uuid",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);

ALTER TABLE ONLY "public"."attendance_settings" REPLICA IDENTITY FULL;


ALTER TABLE "public"."attendance_settings" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."automation_rules" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "name" "text" NOT NULL,
    "description" "text",
    "trigger_type" "text" NOT NULL,
    "trigger_condition" "jsonb" NOT NULL,
    "actions" "jsonb" NOT NULL,
    "is_active" boolean DEFAULT true NOT NULL,
    "branch_id" "uuid",
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "created_by" "uuid"
);

ALTER TABLE ONLY "public"."automation_rules" REPLICA IDENTITY FULL;


ALTER TABLE "public"."automation_rules" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."backup_logs" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "action" "text" NOT NULL,
    "user_id" "uuid",
    "user_name" "text",
    "timestamp" timestamp with time zone DEFAULT "now"() NOT NULL,
    "modules" "text"[] DEFAULT '{}'::"text"[] NOT NULL,
    "success" boolean DEFAULT false NOT NULL,
    "total_records" integer,
    "success_count" integer,
    "failed_count" integer,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    CONSTRAINT "backup_logs_action_check" CHECK (("action" = ANY (ARRAY['export'::"text", 'import'::"text"])))
);


ALTER TABLE "public"."backup_logs" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."body_measurements" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "member_id" "uuid",
    "measurement_date" "date" DEFAULT CURRENT_DATE,
    "height" numeric,
    "weight" numeric,
    "bmi" numeric,
    "body_fat_percentage" numeric,
    "chest" numeric,
    "waist" numeric,
    "hips" numeric,
    "arms" numeric,
    "thighs" numeric,
    "notes" "text",
    "recorded_by" "uuid",
    "branch_id" "uuid",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."body_measurements" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."branches" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "name" "text" NOT NULL,
    "address" "text",
    "city" "text",
    "state" "text",
    "country" "text" DEFAULT 'India'::"text",
    "phone" "text",
    "email" "text",
    "manager_id" "uuid",
    "is_active" boolean DEFAULT true,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);

ALTER TABLE ONLY "public"."branches" REPLICA IDENTITY FULL;


ALTER TABLE "public"."branches" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."class_bookings" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "class_id" "uuid",
    "member_id" "uuid",
    "status" "text" DEFAULT 'confirmed'::"text",
    "attended" boolean DEFAULT false,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."class_bookings" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."class_schedules" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "name" "text" NOT NULL,
    "description" "text",
    "trainer_id" "uuid" NOT NULL,
    "type" "text" NOT NULL,
    "difficulty" "text" NOT NULL,
    "capacity" integer NOT NULL,
    "location" "text" NOT NULL,
    "start_time" timestamp with time zone NOT NULL,
    "end_time" timestamp with time zone NOT NULL,
    "recurring" boolean DEFAULT false,
    "recurring_pattern" "text",
    "status" "text" DEFAULT 'scheduled'::"text",
    "enrolled" integer DEFAULT 0,
    "branch_id" "uuid",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    CONSTRAINT "class_schedules_capacity_check" CHECK (("capacity" > 0))
);


ALTER TABLE "public"."class_schedules" OWNER TO "postgres";


CREATE OR REPLACE VIEW "public"."class_performance" AS
 WITH "class_stats" AS (
         SELECT "cs"."id" AS "class_id",
            "cs"."name" AS "class_name",
            "cs"."type" AS "class_type",
            "cs"."branch_id",
            "cs"."capacity",
            "cs"."enrolled",
            "count"("cb"."id") AS "actual_attendance",
                CASE
                    WHEN ("cs"."capacity" > 0) THEN "round"(((("cs"."enrolled")::numeric / ("cs"."capacity")::numeric) * (100)::numeric), 2)
                    ELSE (0)::numeric
                END AS "enrollment_percentage",
                CASE
                    WHEN ("cs"."enrolled" > 0) THEN "round"(((("count"("cb"."id"))::numeric / ("cs"."enrolled")::numeric) * (100)::numeric), 2)
                    ELSE (0)::numeric
                END AS "attendance_percentage"
           FROM ("public"."class_schedules" "cs"
             LEFT JOIN "public"."class_bookings" "cb" ON ((("cs"."id" = "cb"."class_id") AND ("cb"."attended" = true))))
          WHERE ("cs"."start_time" >= ("now"() - '30 days'::interval))
          GROUP BY "cs"."id", "cs"."name", "cs"."type", "cs"."branch_id", "cs"."capacity", "cs"."enrolled"
        )
 SELECT "class_stats"."class_id",
    "class_stats"."class_name",
    "class_stats"."class_type",
    "class_stats"."branch_id",
    "class_stats"."capacity",
    "class_stats"."enrolled",
    "class_stats"."actual_attendance",
    "class_stats"."enrollment_percentage",
    "class_stats"."attendance_percentage",
        CASE
            WHEN (("class_stats"."enrollment_percentage" >= (80)::numeric) AND ("class_stats"."attendance_percentage" >= (80)::numeric)) THEN 'excellent'::"text"
            WHEN (("class_stats"."enrollment_percentage" >= (60)::numeric) AND ("class_stats"."attendance_percentage" >= (60)::numeric)) THEN 'good'::"text"
            WHEN (("class_stats"."enrollment_percentage" >= (40)::numeric) AND ("class_stats"."attendance_percentage" >= (40)::numeric)) THEN 'average'::"text"
            ELSE 'poor'::"text"
        END AS "performance_category"
   FROM "class_stats";


ALTER TABLE "public"."class_performance" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."class_types" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "name" "text" NOT NULL,
    "description" "text",
    "is_active" boolean DEFAULT true,
    "branch_id" "uuid",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."class_types" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."classes" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "name" "text" NOT NULL,
    "description" "text",
    "trainer_id" "uuid",
    "branch_id" "uuid",
    "capacity" integer NOT NULL,
    "start_time" timestamp with time zone NOT NULL,
    "end_time" timestamp with time zone NOT NULL,
    "recurrence" "text",
    "is_active" boolean DEFAULT true,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    "status" "public"."class_status",
    "trainer" "text",
    "enrolled" integer DEFAULT 0,
    "location" "text",
    "type" "text"
);


ALTER TABLE "public"."classes" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."communication_tasks" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "title" "text" NOT NULL,
    "description" "text",
    "due_date" timestamp with time zone,
    "status" "text" DEFAULT 'todo'::"text" NOT NULL,
    "priority" "text" DEFAULT 'medium'::"text",
    "assigned_to" "uuid",
    "created_by" "uuid",
    "branch_id" "uuid",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."communication_tasks" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."company_settings" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "gym_name" "text" NOT NULL,
    "contact_email" "text",
    "contact_phone" "text",
    "business_hours_start" "text",
    "business_hours_end" "text",
    "currency" "text" DEFAULT 'INR'::"text" NOT NULL,
    "currency_symbol" "text" DEFAULT '₹'::"text" NOT NULL,
    "tax_rate" numeric DEFAULT 18,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);

ALTER TABLE ONLY "public"."company_settings" REPLICA IDENTITY FULL;


ALTER TABLE "public"."company_settings" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."diet_plans" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "name" "text",
    "description" "text",
    "member_id" "uuid",
    "trainer_id" "uuid" NOT NULL,
    "notes" "text",
    "is_custom" boolean DEFAULT true,
    "is_global" boolean DEFAULT false,
    "diet_type" "text",
    "goal" "text",
    "daily_calories" integer,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    CONSTRAINT "diet_plans_diet_type_check" CHECK (("diet_type" = ANY (ARRAY['standard'::"text", 'vegetarian'::"text", 'vegan'::"text", 'keto'::"text", 'paleo'::"text", 'gluten-free'::"text"]))),
    CONSTRAINT "diet_plans_goal_check" CHECK (("goal" = ANY (ARRAY['weight-loss'::"text", 'maintenance'::"text", 'muscle-gain'::"text"])))
);


ALTER TABLE "public"."diet_plans" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."email_settings" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "provider" "text" NOT NULL,
    "from_email" "text" NOT NULL,
    "sendgrid_api_key" "text",
    "mailgun_api_key" "text",
    "mailgun_domain" "text",
    "smtp_host" "text",
    "smtp_port" integer,
    "smtp_username" "text",
    "smtp_password" "text",
    "smtp_secure" boolean,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "branch_id" "uuid",
    "is_active" boolean DEFAULT true NOT NULL,
    "notifications" "jsonb" DEFAULT '{"sendOnInvoice": true, "sendClassUpdates": true, "sendOnRegistration": true}'::"jsonb" NOT NULL,
    CONSTRAINT "email_settings_provider_check" CHECK (("provider" = ANY (ARRAY['sendgrid'::"text", 'mailgun'::"text", 'smtp'::"text"])))
);

ALTER TABLE ONLY "public"."email_settings" REPLICA IDENTITY FULL;


ALTER TABLE "public"."email_settings" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."email_templates" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "name" "text" NOT NULL,
    "subject" "text" NOT NULL,
    "content" "text" NOT NULL,
    "variables" "jsonb" DEFAULT '{}'::"jsonb",
    "is_active" boolean DEFAULT true NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "branch_id" "uuid",
    "category" "text" NOT NULL
);

ALTER TABLE ONLY "public"."email_templates" REPLICA IDENTITY FULL;


ALTER TABLE "public"."email_templates" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."essl_device_settings" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "branch_id" "uuid" NOT NULL,
    "device_name" "text" NOT NULL,
    "device_serial" "text" NOT NULL,
    "api_url" "text",
    "push_url" "text",
    "api_username" "text",
    "api_password" "text",
    "devices" "jsonb" DEFAULT '[]'::"jsonb" NOT NULL,
    "is_active" boolean DEFAULT false NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."essl_device_settings" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."exercises" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "workout_day_id" "uuid" NOT NULL,
    "name" "text" NOT NULL,
    "sets" integer NOT NULL,
    "reps" integer NOT NULL,
    "weight" numeric,
    "rest" integer,
    "rest_time" "text",
    "notes" "text",
    "media_url" "text",
    "muscle_group_tag" "text",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."exercises" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."expense_categories" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "name" "text" NOT NULL,
    "description" "text",
    "is_active" boolean DEFAULT true,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    "branch_id" "uuid"
);


ALTER TABLE "public"."expense_categories" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."expense_records" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "date" timestamp without time zone NOT NULL,
    "amount" numeric NOT NULL,
    "category" "text" NOT NULL,
    "description" "text" NOT NULL,
    "vendor" "text" NOT NULL,
    "payment_method" "text" NOT NULL,
    "reference" "text" NOT NULL,
    "branch_id" "uuid" NOT NULL,
    "status" "text" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."expense_records" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."feedback" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "member_id" "uuid",
    "member_name" "text",
    "type" "text" NOT NULL,
    "related_id" "uuid",
    "rating" integer NOT NULL,
    "comments" "text",
    "anonymous" boolean DEFAULT false,
    "title" "text" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "branch_id" "uuid",
    CONSTRAINT "feedback_rating_check" CHECK ((("rating" >= 1) AND ("rating" <= 5))),
    CONSTRAINT "feedback_type_check" CHECK (("type" = ANY (ARRAY['general'::"text", 'trainer'::"text", 'class'::"text", 'fitness-plan'::"text"])))
);


ALTER TABLE "public"."feedback" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."fitness_progress" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "member_id" "uuid",
    "date" "date" DEFAULT CURRENT_DATE,
    "weight" numeric,
    "body_fat_percentage" numeric,
    "muscle_mass" numeric,
    "workout_completion" numeric,
    "diet_adherence" numeric,
    "notes" "text",
    "created_by" "uuid",
    "branch_id" "uuid",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."fitness_progress" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."follow_up_history" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "lead_id" "uuid",
    "template_id" "uuid",
    "type" "text" NOT NULL,
    "content" "text" NOT NULL,
    "sent_by" "uuid",
    "sent_at" timestamp with time zone DEFAULT "timezone"('utc'::"text", "now"()),
    "status" "text" NOT NULL,
    "response" "text",
    "response_at" timestamp with time zone,
    CONSTRAINT "follow_up_history_status_check" CHECK (("status" = ANY (ARRAY['sent'::"text", 'delivered'::"text", 'read'::"text", 'failed'::"text"])))
);


ALTER TABLE "public"."follow_up_history" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."follow_up_templates" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "name" "text" NOT NULL,
    "content" "text" NOT NULL,
    "created_by" "uuid",
    "created_at" timestamp with time zone DEFAULT "timezone"('utc'::"text", "now"())
);


ALTER TABLE "public"."follow_up_templates" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."global_settings" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "currency" "text" DEFAULT 'INR'::"text" NOT NULL,
    "currency_symbol" "text" DEFAULT '₹'::"text" NOT NULL,
    "date_format" "text" DEFAULT 'DD/MM/YYYY'::"text",
    "time_format" "text" DEFAULT '24h'::"text",
    "razorpay_key_id" "text",
    "razorpay_key_secret" "text",
    "sms_provider" "text",
    "sms_api_key" "text",
    "email_provider" "text",
    "email_api_key" "text",
    "whatsapp_provider" "text",
    "whatsapp_api_key" "text",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."global_settings" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."hikvision_api_settings" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "branch_id" "uuid" NOT NULL,
    "api_url" "text" NOT NULL,
    "app_key" "text" NOT NULL,
    "app_secret" "text" NOT NULL,
    "devices" "jsonb" DEFAULT '[]'::"jsonb" NOT NULL,
    "is_active" boolean DEFAULT false NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."hikvision_api_settings" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."income_categories" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "name" "text" NOT NULL,
    "description" "text",
    "is_active" boolean DEFAULT true,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    "branch_id" "uuid"
);


ALTER TABLE "public"."income_categories" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."integration_statuses" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "integration_key" "text" NOT NULL,
    "name" "text" NOT NULL,
    "description" "text" NOT NULL,
    "status" "text" DEFAULT 'not-configured'::"text" NOT NULL,
    "icon" "text",
    "config" "jsonb" DEFAULT '{}'::"jsonb",
    "branch_id" "uuid",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);

ALTER TABLE ONLY "public"."integration_statuses" REPLICA IDENTITY FULL;


ALTER TABLE "public"."integration_statuses" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."inventory_items" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "name" "text" NOT NULL,
    "sku" "text" NOT NULL,
    "category" "text",
    "description" "text",
    "quantity" integer DEFAULT 0 NOT NULL,
    "price" numeric NOT NULL,
    "cost_price" numeric NOT NULL,
    "supplier" "text",
    "supplier_contact" "text",
    "manufacture_date" timestamp with time zone,
    "expiry_date" timestamp with time zone,
    "reorder_level" integer DEFAULT 10 NOT NULL,
    "location" "text",
    "image" "text",
    "barcode" "text",
    "status" "text" NOT NULL,
    "last_stock_update" timestamp with time zone DEFAULT "now"(),
    "branch_id" "uuid",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    CONSTRAINT "inventory_items_category_check" CHECK (("category" = ANY (ARRAY['supplement'::"text", 'equipment'::"text", 'merchandise'::"text"]))),
    CONSTRAINT "inventory_items_status_check" CHECK (("status" = ANY (ARRAY['in-stock'::"text", 'low-stock'::"text", 'out-of-stock'::"text", 'expired'::"text"])))
);


ALTER TABLE "public"."inventory_items" OWNER TO "postgres";


CREATE OR REPLACE VIEW "public"."inventory_alerts" AS
 SELECT "inventory_items"."id",
    "inventory_items"."name",
    "inventory_items"."branch_id",
    "inventory_items"."quantity",
    "inventory_items"."reorder_level",
    ("inventory_items"."quantity" <= "inventory_items"."reorder_level") AS "is_low_stock",
        CASE
            WHEN ("inventory_items"."quantity" = 0) THEN 'out_of_stock'::"text"
            WHEN (("inventory_items"."quantity")::numeric <= (("inventory_items"."reorder_level")::numeric * 0.5)) THEN 'critical'::"text"
            WHEN ("inventory_items"."quantity" <= "inventory_items"."reorder_level") THEN 'low'::"text"
            ELSE 'normal'::"text"
        END AS "stock_status"
   FROM "public"."inventory_items"
  WHERE ("inventory_items"."quantity" <= "inventory_items"."reorder_level");


ALTER TABLE "public"."inventory_alerts" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."invoices" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "member_id" "uuid",
    "amount" numeric NOT NULL,
    "status" "text" NOT NULL,
    "issued_date" timestamp with time zone DEFAULT "now"() NOT NULL,
    "due_date" timestamp with time zone NOT NULL,
    "paid_date" timestamp with time zone,
    "items" "jsonb" DEFAULT '[]'::"jsonb" NOT NULL,
    "branch_id" "uuid",
    "membership_plan_id" "uuid",
    "description" "text",
    "notes" "text",
    "payment_method" "text",
    "razorpay_order_id" "text",
    "razorpay_payment_id" "text",
    "created_by" "uuid",
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL
);

ALTER TABLE ONLY "public"."invoices" REPLICA IDENTITY FULL;


ALTER TABLE "public"."invoices" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."leads" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "name" "text" NOT NULL,
    "email" "text",
    "phone" "text",
    "source" "text" NOT NULL,
    "status" "text" NOT NULL,
    "funnel_stage" "text" NOT NULL,
    "assigned_to" "uuid",
    "notes" "text",
    "created_at" timestamp with time zone DEFAULT "timezone"('utc'::"text", "now"()),
    "updated_at" timestamp with time zone,
    "follow_up_date" timestamp with time zone,
    "last_contact_date" timestamp with time zone,
    "conversion_date" timestamp with time zone,
    "conversion_value" numeric,
    "interests" "text"[],
    "tags" "text"[],
    CONSTRAINT "leads_funnel_stage_check" CHECK (("funnel_stage" = ANY (ARRAY['cold'::"text", 'warm'::"text", 'hot'::"text", 'won'::"text", 'lost'::"text"]))),
    CONSTRAINT "leads_source_check" CHECK (("source" = ANY (ARRAY['website'::"text", 'referral'::"text", 'walk-in'::"text", 'phone'::"text", 'social-media'::"text", 'event'::"text", 'other'::"text"]))),
    CONSTRAINT "leads_status_check" CHECK (("status" = ANY (ARRAY['new'::"text", 'contacted'::"text", 'qualified'::"text", 'lost'::"text", 'converted'::"text"])))
);


ALTER TABLE "public"."leads" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."meal_items" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "meal_plan_id" "uuid" NOT NULL,
    "name" "text" NOT NULL,
    "calories" integer,
    "protein" numeric,
    "carbs" numeric,
    "fats" numeric,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."meal_items" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."meal_plans" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "diet_plan_id" "uuid" NOT NULL,
    "name" "text" NOT NULL,
    "time" "text",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."meal_plans" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."measurements" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "member_id" "uuid",
    "measurement_date" "date" DEFAULT CURRENT_DATE NOT NULL,
    "weight" numeric(5,2),
    "height" numeric(5,2),
    "bmi" numeric(5,2),
    "body_fat_percentage" numeric(5,2),
    "chest" numeric(5,2),
    "waist" numeric(5,2),
    "hips" numeric(5,2),
    "arms" numeric(5,2),
    "thighs" numeric(5,2),
    "notes" "text",
    "recorded_by" "uuid",
    "branch_id" "uuid",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."measurements" OWNER TO "postgres";


CREATE OR REPLACE VIEW "public"."member_attendance_heatmap" WITH ("security_invoker"='on') AS
 WITH "days" AS (
         SELECT "generate_series"(0, 6) AS "day_of_week"
        ), "hours" AS (
         SELECT "generate_series"(6, 22) AS "hour_of_day"
        ), "attendance_counts" AS (
         SELECT "member_attendance"."branch_id",
            EXTRACT(dow FROM "member_attendance"."check_in") AS "day_of_week",
            EXTRACT(hour FROM "member_attendance"."check_in") AS "hour_of_day",
            "count"(*) AS "attendance_count"
           FROM "public"."member_attendance"
          WHERE ("member_attendance"."check_in" >= ("now"() - '30 days'::interval))
          GROUP BY "member_attendance"."branch_id", (EXTRACT(dow FROM "member_attendance"."check_in")), (EXTRACT(hour FROM "member_attendance"."check_in"))
        )
 SELECT "d"."day_of_week",
    "h"."hour_of_day",
    "b"."id" AS "branch_id",
    COALESCE("ac"."attendance_count", (0)::bigint) AS "attendance_count"
   FROM ((("days" "d"
     CROSS JOIN "hours" "h")
     CROSS JOIN "public"."branches" "b")
     LEFT JOIN "attendance_counts" "ac" ON (((("d"."day_of_week")::numeric = "ac"."day_of_week") AND (("h"."hour_of_day")::numeric = "ac"."hour_of_day") AND ("b"."id" = "ac"."branch_id"))))
  ORDER BY "b"."id", "d"."day_of_week", "h"."hour_of_day";


ALTER TABLE "public"."member_attendance_heatmap" OWNER TO "postgres";


CREATE OR REPLACE VIEW "public"."member_churn_risk" WITH ("security_invoker"='on') AS
 WITH "member_engagement" AS (
         SELECT "m"."id" AS "member_id",
            "m"."name" AS "member_name",
            "m"."branch_id",
            "m"."status",
            EXTRACT(day FROM ("now"() - "max"("ma"."check_in"))) AS "days_since_last_visit",
            "count"("ma"."id") FILTER (WHERE ("ma"."check_in" >= ("now"() - '30 days'::interval))) AS "visits_last_30_days",
                CASE
                    WHEN ("mm"."end_date" IS NOT NULL) THEN EXTRACT(day FROM (("mm"."end_date")::timestamp with time zone - "now"()))
                    ELSE NULL::numeric
                END AS "days_until_expiry"
           FROM (("public"."members" "m"
             LEFT JOIN "public"."member_attendance" "ma" ON (("m"."id" = "ma"."member_id")))
             LEFT JOIN "public"."member_memberships" "mm" ON ((("m"."id" = "mm"."member_id") AND ("mm"."status" = 'active'::"text"))))
          WHERE ("m"."status" = 'active'::"text")
          GROUP BY "m"."id", "m"."name", "m"."branch_id", "m"."status", "mm"."end_date"
        )
 SELECT "member_engagement"."member_id",
    "member_engagement"."member_name",
    "member_engagement"."branch_id",
    "member_engagement"."status",
    "member_engagement"."days_since_last_visit",
    "member_engagement"."visits_last_30_days",
    "member_engagement"."days_until_expiry",
        CASE
            WHEN (("member_engagement"."days_since_last_visit" > (21)::numeric) AND ("member_engagement"."days_until_expiry" < (15)::numeric)) THEN 85
            WHEN ("member_engagement"."days_since_last_visit" > (21)::numeric) THEN 75
            WHEN (("member_engagement"."days_since_last_visit" > (14)::numeric) AND ("member_engagement"."days_until_expiry" < (15)::numeric)) THEN 70
            WHEN ("member_engagement"."days_since_last_visit" > (14)::numeric) THEN 60
            WHEN (("member_engagement"."days_since_last_visit" > (7)::numeric) AND ("member_engagement"."days_until_expiry" < (15)::numeric)) THEN 50
            WHEN ("member_engagement"."days_since_last_visit" > (7)::numeric) THEN 40
            WHEN (("member_engagement"."visits_last_30_days" < 4) AND ("member_engagement"."days_until_expiry" < (15)::numeric)) THEN 45
            WHEN ("member_engagement"."visits_last_30_days" < 4) THEN 35
            WHEN (("member_engagement"."days_until_expiry" < (7)::numeric) AND ("member_engagement"."visits_last_30_days" < 8)) THEN 55
            WHEN (("member_engagement"."days_until_expiry" < (15)::numeric) AND ("member_engagement"."visits_last_30_days" < 8)) THEN 40
            WHEN ("member_engagement"."days_until_expiry" < (15)::numeric) THEN 30
            ELSE 20
        END AS "churn_risk_score",
        CASE
            WHEN ("member_engagement"."visits_last_30_days" < 4) THEN 'low_engagement'::"text"
            WHEN ("member_engagement"."days_since_last_visit" > (14)::numeric) THEN 'absence'::"text"
            WHEN ("member_engagement"."days_until_expiry" < (15)::numeric) THEN 'expiring_soon'::"text"
            ELSE NULL::"text"
        END AS "primary_risk_factor"
   FROM "member_engagement"
  ORDER BY
        CASE
            WHEN (("member_engagement"."days_since_last_visit" > (21)::numeric) AND ("member_engagement"."days_until_expiry" < (15)::numeric)) THEN 85
            WHEN ("member_engagement"."days_since_last_visit" > (21)::numeric) THEN 75
            WHEN (("member_engagement"."days_since_last_visit" > (14)::numeric) AND ("member_engagement"."days_until_expiry" < (15)::numeric)) THEN 70
            WHEN ("member_engagement"."days_since_last_visit" > (14)::numeric) THEN 60
            WHEN (("member_engagement"."days_since_last_visit" > (7)::numeric) AND ("member_engagement"."days_until_expiry" < (15)::numeric)) THEN 50
            WHEN ("member_engagement"."days_since_last_visit" > (7)::numeric) THEN 40
            WHEN (("member_engagement"."visits_last_30_days" < 4) AND ("member_engagement"."days_until_expiry" < (15)::numeric)) THEN 45
            WHEN ("member_engagement"."visits_last_30_days" < 4) THEN 35
            WHEN (("member_engagement"."days_until_expiry" < (7)::numeric) AND ("member_engagement"."visits_last_30_days" < 8)) THEN 55
            WHEN (("member_engagement"."days_until_expiry" < (15)::numeric) AND ("member_engagement"."visits_last_30_days" < 8)) THEN 40
            WHEN ("member_engagement"."days_until_expiry" < (15)::numeric) THEN 30
            ELSE 20
        END DESC;


ALTER TABLE "public"."member_churn_risk" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."member_progress" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "member_id" "uuid" NOT NULL,
    "trainer_id" "uuid" NOT NULL,
    "weight" numeric,
    "bmi" numeric,
    "fat_percent" numeric,
    "muscle_mass" numeric,
    "workout_completion_percent" integer,
    "diet_adherence_percent" integer,
    "last_updated" timestamp with time zone DEFAULT "now"(),
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);

ALTER TABLE ONLY "public"."member_progress" REPLICA IDENTITY FULL;


ALTER TABLE "public"."member_progress" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."membership_subscriptions" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" "uuid" NOT NULL,
    "plan_id" "uuid" NOT NULL,
    "start_date" timestamp with time zone DEFAULT "now"() NOT NULL,
    "end_date" timestamp with time zone NOT NULL,
    "status" "text" DEFAULT 'active'::"text" NOT NULL,
    "amount_paid" numeric NOT NULL,
    "payment_id" "text",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    "branch_id" "uuid",
    "invoice_id" "uuid"
);


ALTER TABLE "public"."membership_subscriptions" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."memberships" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "name" "text" NOT NULL,
    "description" "text",
    "duration_days" integer NOT NULL,
    "price" numeric(10,2) NOT NULL,
    "features" "jsonb",
    "is_active" boolean DEFAULT true,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    "branch_id" "uuid",
    "plan_name" "text",
    CONSTRAINT "positive_price" CHECK (("price" >= (0)::numeric))
);


ALTER TABLE "public"."memberships" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."motivational_messages" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "title" "text" NOT NULL,
    "content" "text" NOT NULL,
    "author" "text" DEFAULT 'Unknown'::"text",
    "category" "text" NOT NULL,
    "tags" "text"[] DEFAULT '{}'::"text"[],
    "active" boolean DEFAULT true,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    CONSTRAINT "motivational_messages_category_check" CHECK (("category" = ANY (ARRAY['motivation'::"text", 'fitness'::"text", 'nutrition'::"text", 'wellness'::"text"])))
);


ALTER TABLE "public"."motivational_messages" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."notifications" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" "text" NOT NULL,
    "title" "text" NOT NULL,
    "message" "text",
    "type" "text",
    "read" boolean DEFAULT false,
    "created_at" timestamp without time zone DEFAULT "now"()
);


ALTER TABLE "public"."notifications" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."orders" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "member_id" "uuid",
    "customer_name" "text" NOT NULL,
    "customer_email" "text",
    "customer_phone" "text",
    "items" "jsonb" DEFAULT '[]'::"jsonb" NOT NULL,
    "subtotal" numeric NOT NULL,
    "discount" numeric DEFAULT 0,
    "promo_code_id" "uuid",
    "promo_code" "text",
    "tax" numeric DEFAULT 0 NOT NULL,
    "total" numeric NOT NULL,
    "status" "text" NOT NULL,
    "payment_method" "text" NOT NULL,
    "payment_status" "text" NOT NULL,
    "branch_id" "uuid",
    "staff_id" "uuid",
    "notes" "text",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    "completed_at" timestamp with time zone,
    CONSTRAINT "orders_payment_method_check" CHECK (("payment_method" = ANY (ARRAY['cash'::"text", 'card'::"text", 'bank-transfer'::"text", 'wallet'::"text", 'other'::"text"]))),
    CONSTRAINT "orders_payment_status_check" CHECK (("payment_status" = ANY (ARRAY['pending'::"text", 'paid'::"text", 'failed'::"text", 'refunded'::"text"]))),
    CONSTRAINT "orders_status_check" CHECK (("status" = ANY (ARRAY['pending'::"text", 'processing'::"text", 'completed'::"text", 'cancelled'::"text", 'refunded'::"text"])))
);


ALTER TABLE "public"."orders" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."payment_gateway_settings" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "gateway" "text" NOT NULL,
    "is_active" boolean DEFAULT false NOT NULL,
    "config" "jsonb" NOT NULL,
    "webhook_secret" "text",
    "webhook_url" "text",
    "allowed_ips" "text"[],
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."payment_gateway_settings" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."payment_settings" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "gateway_name" "text" NOT NULL,
    "is_enabled" boolean DEFAULT false,
    "config" "jsonb" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."payment_settings" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."payments" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "member_id" "uuid",
    "membership_id" "uuid",
    "amount" numeric(10,2) NOT NULL,
    "payment_date" timestamp with time zone DEFAULT "now"(),
    "payment_method" "text" NOT NULL,
    "transaction_id" "text",
    "razorpay_payment_id" "text",
    "razorpay_order_id" "text",
    "status" "text" DEFAULT 'completed'::"text" NOT NULL,
    "branch_id" "uuid",
    "staff_id" "uuid",
    "notes" "text",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."payments" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."profiles" (
    "id" "uuid" NOT NULL,
    "full_name" "text",
    "email" "text",
    "avatar_url" "text",
    "phone" "text",
    "address" "text",
    "city" "text",
    "state" "text",
    "country" "text" DEFAULT 'India'::"text",
    "date_of_birth" "date",
    "gender" "text",
    "role" "text" DEFAULT 'member'::"text" NOT NULL,
    "branch_id" "uuid",
    "accessible_branch_ids" "uuid"[] DEFAULT '{}'::"uuid"[],
    "is_branch_manager" boolean DEFAULT false,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    "department" "text",
    "is_active" boolean DEFAULT true,
    "rating" numeric
);


ALTER TABLE "public"."profiles" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."promo_codes" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "code" "text" NOT NULL,
    "description" "text",
    "type" "text" NOT NULL,
    "value" numeric NOT NULL,
    "min_purchase_amount" numeric,
    "max_discount_amount" numeric,
    "start_date" timestamp with time zone NOT NULL,
    "end_date" timestamp with time zone NOT NULL,
    "status" "text" NOT NULL,
    "usage_limit" integer,
    "current_usage" integer DEFAULT 0,
    "applicable_products" "text"[],
    "applicable_memberships" "text"[],
    "created_by" "uuid",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    "branch_id" "uuid",
    CONSTRAINT "promo_codes_status_check" CHECK (("status" = ANY (ARRAY['active'::"text", 'inactive'::"text", 'expired'::"text", 'scheduled'::"text"]))),
    CONSTRAINT "promo_codes_type_check" CHECK (("type" = ANY (ARRAY['percentage'::"text", 'fixed'::"text", 'free-product'::"text"])))
);


ALTER TABLE "public"."promo_codes" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."referrals" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "referrer_id" "uuid",
    "referrer_name" "text" NOT NULL,
    "referred_email" "text" NOT NULL,
    "referred_name" "text",
    "referred_id" "uuid",
    "status" "text" NOT NULL,
    "promo_code_id" "uuid",
    "promo_code" "text",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "converted_at" timestamp with time zone,
    "reward_amount" numeric,
    "reward_description" "text",
    "reward_status" "text",
    CONSTRAINT "referrals_reward_status_check" CHECK (("reward_status" = ANY (ARRAY['pending'::"text", 'processed'::"text", 'cancelled'::"text"]))),
    CONSTRAINT "referrals_status_check" CHECK (("status" = ANY (ARRAY['pending'::"text", 'approved'::"text", 'rejected'::"text", 'rewarded'::"text"])))
);


ALTER TABLE "public"."referrals" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."reminder_rules" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "title" "text" NOT NULL,
    "description" "text",
    "trigger_type" "text" NOT NULL,
    "trigger_value" integer,
    "message" "text",
    "notification_channel" "text",
    "send_via" "text"[] DEFAULT '{}'::"text"[] NOT NULL,
    "target_roles" "text"[] DEFAULT '{}'::"text"[] NOT NULL,
    "conditions" "jsonb" DEFAULT '{}'::"jsonb" NOT NULL,
    "is_active" boolean DEFAULT true NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL
);

ALTER TABLE ONLY "public"."reminder_rules" REPLICA IDENTITY FULL;


ALTER TABLE "public"."reminder_rules" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."settings" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "category" "text" NOT NULL,
    "key" "text" NOT NULL,
    "value" "jsonb",
    "description" "text",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    "branch_id" "uuid"
);


ALTER TABLE "public"."settings" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."sms_settings" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "branch_id" "uuid",
    "provider" "text" NOT NULL,
    "sender_id" "text" NOT NULL,
    "is_active" boolean DEFAULT true NOT NULL,
    "msg91_auth_key" "text",
    "twilio_account_sid" "text",
    "twilio_auth_token" "text",
    "custom_api_url" "text",
    "custom_api_headers" "text",
    "custom_api_params" "text",
    "templates" "jsonb" DEFAULT '{"membershipAlert": false, "otpVerification": false, "renewalReminder": false, "attendanceConfirmation": false}'::"jsonb" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL
);

ALTER TABLE ONLY "public"."sms_settings" REPLICA IDENTITY FULL;


ALTER TABLE "public"."sms_settings" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."sms_templates" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "name" "text" NOT NULL,
    "content" "text" NOT NULL,
    "variables" "jsonb" DEFAULT '{}'::"jsonb",
    "is_active" boolean DEFAULT true NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "branch_id" "uuid",
    "category" "text" NOT NULL,
    "dlt_template_id" "text"
);

ALTER TABLE ONLY "public"."sms_templates" REPLICA IDENTITY FULL;


ALTER TABLE "public"."sms_templates" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."staff_attendance" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "staff_id" "uuid",
    "branch_id" "uuid",
    "check_in" timestamp with time zone,
    "check_out" timestamp with time zone,
    "status" "text" DEFAULT 'present'::"text",
    "notes" "text",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."staff_attendance" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."store_products" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "name" "text" NOT NULL,
    "description" "text",
    "price" numeric NOT NULL,
    "sale_price" numeric,
    "category" "text" NOT NULL,
    "status" "text" NOT NULL,
    "stock" integer DEFAULT 0 NOT NULL,
    "inventory_id" "uuid",
    "sku" "text" NOT NULL,
    "barcode" "text",
    "images" "text"[],
    "features" "text"[],
    "brand" "text",
    "featured" boolean DEFAULT false,
    "branch_id" "uuid",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    CONSTRAINT "store_products_category_check" CHECK (("category" = ANY (ARRAY['supplement'::"text", 'equipment'::"text", 'apparel'::"text", 'accessory'::"text", 'membership'::"text", 'other'::"text"]))),
    CONSTRAINT "store_products_status_check" CHECK (("status" = ANY (ARRAY['in-stock'::"text", 'low-stock'::"text", 'out-of-stock'::"text", 'discontinued'::"text"])))
);


ALTER TABLE "public"."store_products" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."trainer_assignments" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "trainer_id" "uuid",
    "member_id" "uuid",
    "branch_id" "uuid",
    "start_date" "date" NOT NULL,
    "end_date" "date",
    "is_active" boolean DEFAULT true,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."trainer_assignments" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."trainer_attendance" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "trainer_id" "uuid" NOT NULL,
    "branch_id" "uuid" NOT NULL,
    "check_in" timestamp with time zone,
    "check_out" timestamp with time zone,
    "date" "date" DEFAULT CURRENT_DATE NOT NULL,
    "status" "text" DEFAULT 'present'::"text",
    "notes" "text",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."trainer_attendance" OWNER TO "postgres";


CREATE OR REPLACE VIEW "public"."trainer_utilization" WITH ("security_invoker"='on') AS
 WITH "trainer_capacity" AS (
         SELECT "class_schedules"."trainer_id",
            "class_schedules"."branch_id",
            ("count"(*) * 60) AS "total_capacity_minutes"
           FROM "public"."class_schedules"
          WHERE ("class_schedules"."start_time" >= ("now"() - '30 days'::interval))
          GROUP BY "class_schedules"."trainer_id", "class_schedules"."branch_id"
        ), "trainer_utilization" AS (
         SELECT "class_schedules"."trainer_id",
            "class_schedules"."branch_id",
            "count"(*) AS "sessions_conducted",
            "sum"((EXTRACT(epoch FROM ("class_schedules"."end_time" - "class_schedules"."start_time")) / (60)::numeric)) AS "minutes_utilized"
           FROM "public"."class_schedules"
          WHERE (("class_schedules"."start_time" >= ("now"() - '30 days'::interval)) AND ("class_schedules"."start_time" <= "now"()) AND ("class_schedules"."status" = 'completed'::"text"))
          GROUP BY "class_schedules"."trainer_id", "class_schedules"."branch_id"
        )
 SELECT "p"."id" AS "trainer_id",
    "p"."full_name" AS "trainer_name",
    "tc"."branch_id",
    COALESCE("tu"."sessions_conducted", (0)::bigint) AS "sessions_conducted",
    COALESCE("tc"."total_capacity_minutes", (0)::bigint) AS "total_capacity_minutes",
    COALESCE("tu"."minutes_utilized", (0)::numeric) AS "minutes_utilized",
        CASE
            WHEN ("tc"."total_capacity_minutes" > 0) THEN "round"(((COALESCE("tu"."minutes_utilized", (0)::numeric) / ("tc"."total_capacity_minutes")::numeric) * (100)::numeric), 2)
            ELSE (0)::numeric
        END AS "utilization_percentage"
   FROM (("public"."profiles" "p"
     LEFT JOIN "trainer_capacity" "tc" ON (("p"."id" = "tc"."trainer_id")))
     LEFT JOIN "trainer_utilization" "tu" ON ((("p"."id" = "tu"."trainer_id") AND ("tc"."branch_id" = "tu"."branch_id"))))
  WHERE ("p"."role" = 'trainer'::"text");


ALTER TABLE "public"."trainer_utilization" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."trainers" (
    "id" "text" NOT NULL,
    "email" "text" NOT NULL,
    "name" "text" NOT NULL,
    "role" "text",
    "avatar" "text",
    "phone" "text",
    "specialty" "text",
    "bio" "text",
    "status" "text",
    "rating" numeric
);


ALTER TABLE "public"."trainers" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."transactions" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "type" "text" NOT NULL,
    "amount" numeric(10,2) NOT NULL,
    "transaction_date" timestamp with time zone DEFAULT "now"(),
    "category_id" "uuid",
    "description" "text",
    "reference_id" "uuid",
    "payment_method" "text",
    "transaction_id" "text",
    "branch_id" "uuid",
    "recorded_by" "uuid",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    CONSTRAINT "transactions_type_check" CHECK (("type" = ANY (ARRAY['income'::"text", 'expense'::"text"])))
);


ALTER TABLE "public"."transactions" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."webhook_logs" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "gateway" "text" NOT NULL,
    "event_type" "text" NOT NULL,
    "payload" "jsonb" NOT NULL,
    "signature" "text",
    "status" "text" DEFAULT 'pending'::"text" NOT NULL,
    "processed_at" timestamp with time zone,
    "error" "text",
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "branch_id" "uuid",
    "ip_address" "text"
);


ALTER TABLE "public"."webhook_logs" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."whatsapp_settings" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "branch_id" "uuid",
    "api_token" "text" NOT NULL,
    "phone_number_id" "text" NOT NULL,
    "business_account_id" "text" NOT NULL,
    "is_active" boolean DEFAULT true NOT NULL,
    "notifications" "jsonb" DEFAULT '{"sendClassReminders": true, "sendWelcomeMessages": true, "sendRenewalReminders": true, "sendBirthdayGreetings": false}'::"jsonb" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL
);

ALTER TABLE ONLY "public"."whatsapp_settings" REPLICA IDENTITY FULL;


ALTER TABLE "public"."whatsapp_settings" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."whatsapp_templates" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "name" "text" NOT NULL,
    "content" "text" NOT NULL,
    "variables" "jsonb" DEFAULT '{}'::"jsonb",
    "is_active" boolean DEFAULT true NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "branch_id" "uuid",
    "category" "text" NOT NULL,
    "whatsapp_template_name" "text",
    "header_text" "text",
    "footer_text" "text"
);

ALTER TABLE ONLY "public"."whatsapp_templates" REPLICA IDENTITY FULL;


ALTER TABLE "public"."whatsapp_templates" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."workout_days" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "workout_plan_id" "uuid" NOT NULL,
    "name" "text" NOT NULL,
    "day_label" "text",
    "description" "text",
    "notes" "text",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."workout_days" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."workout_plans" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "name" "text" NOT NULL,
    "description" "text",
    "trainer_id" "uuid" NOT NULL,
    "member_id" "uuid",
    "difficulty" "text",
    "is_global" boolean DEFAULT false,
    "is_custom" boolean DEFAULT true,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    "notes" "text",
    CONSTRAINT "workout_plans_difficulty_check" CHECK (("difficulty" = ANY (ARRAY['beginner'::"text", 'intermediate'::"text", 'advanced'::"text"])))
);


ALTER TABLE "public"."workout_plans" OWNER TO "postgres";


ALTER TABLE ONLY "public"."announcements"
    ADD CONSTRAINT "announcements_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."attendance_settings"
    ADD CONSTRAINT "attendance_settings_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."automation_rules"
    ADD CONSTRAINT "automation_rules_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."backup_logs"
    ADD CONSTRAINT "backup_logs_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."body_measurements"
    ADD CONSTRAINT "body_measurements_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."branches"
    ADD CONSTRAINT "branches_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."class_bookings"
    ADD CONSTRAINT "class_bookings_class_id_member_id_key" UNIQUE ("class_id", "member_id");



ALTER TABLE ONLY "public"."class_schedules"
    ADD CONSTRAINT "class_schedules_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."class_types"
    ADD CONSTRAINT "class_types_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."classes"
    ADD CONSTRAINT "classes_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."communication_tasks"
    ADD CONSTRAINT "communication_tasks_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."company_settings"
    ADD CONSTRAINT "company_settings_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."diet_plans"
    ADD CONSTRAINT "diet_plans_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."email_settings"
    ADD CONSTRAINT "email_settings_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."email_templates"
    ADD CONSTRAINT "email_templates_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."essl_device_settings"
    ADD CONSTRAINT "essl_device_settings_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."exercises"
    ADD CONSTRAINT "exercises_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."expense_categories"
    ADD CONSTRAINT "expense_categories_name_branch_id_key" UNIQUE ("name", "branch_id");



ALTER TABLE ONLY "public"."expense_categories"
    ADD CONSTRAINT "expense_categories_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."expense_records"
    ADD CONSTRAINT "expense_records_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."feedback"
    ADD CONSTRAINT "feedback_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."fitness_progress"
    ADD CONSTRAINT "fitness_progress_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."follow_up_history"
    ADD CONSTRAINT "follow_up_history_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."follow_up_templates"
    ADD CONSTRAINT "follow_up_templates_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."global_settings"
    ADD CONSTRAINT "global_settings_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."hikvision_api_settings"
    ADD CONSTRAINT "hikvision_api_settings_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."income_categories"
    ADD CONSTRAINT "income_categories_name_branch_id_key" UNIQUE ("name", "branch_id");



ALTER TABLE ONLY "public"."income_categories"
    ADD CONSTRAINT "income_categories_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."income_records"
    ADD CONSTRAINT "income_records_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."integration_statuses"
    ADD CONSTRAINT "integration_statuses_integration_key_key" UNIQUE ("integration_key");



ALTER TABLE ONLY "public"."integration_statuses"
    ADD CONSTRAINT "integration_statuses_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."inventory_items"
    ADD CONSTRAINT "inventory_items_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."inventory_items"
    ADD CONSTRAINT "inventory_items_sku_key" UNIQUE ("sku");



ALTER TABLE ONLY "public"."invoices"
    ADD CONSTRAINT "invoices_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."leads"
    ADD CONSTRAINT "leads_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."meal_items"
    ADD CONSTRAINT "meal_items_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."meal_plans"
    ADD CONSTRAINT "meal_plans_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."measurements"
    ADD CONSTRAINT "measurements_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."member_attendance"
    ADD CONSTRAINT "member_attendance_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."member_memberships"
    ADD CONSTRAINT "member_memberships_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."member_progress"
    ADD CONSTRAINT "member_progress_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."members"
    ADD CONSTRAINT "members_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."membership_subscriptions"
    ADD CONSTRAINT "membership_subscriptions_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."memberships"
    ADD CONSTRAINT "memberships_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."motivational_messages"
    ADD CONSTRAINT "motivational_messages_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."notifications"
    ADD CONSTRAINT "notifications_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."orders"
    ADD CONSTRAINT "orders_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."payment_gateway_settings"
    ADD CONSTRAINT "payment_gateway_settings_gateway_key" UNIQUE ("gateway");



ALTER TABLE ONLY "public"."payment_gateway_settings"
    ADD CONSTRAINT "payment_gateway_settings_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."payment_settings"
    ADD CONSTRAINT "payment_settings_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."payments"
    ADD CONSTRAINT "payments_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."profiles"
    ADD CONSTRAINT "profiles_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."promo_codes"
    ADD CONSTRAINT "promo_codes_code_key" UNIQUE ("code");



ALTER TABLE ONLY "public"."promo_codes"
    ADD CONSTRAINT "promo_codes_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."referrals"
    ADD CONSTRAINT "referrals_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."reminder_rules"
    ADD CONSTRAINT "reminder_rules_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."settings"
    ADD CONSTRAINT "settings_category_key_branch_id_key" UNIQUE ("category", "key", "branch_id");



ALTER TABLE ONLY "public"."settings"
    ADD CONSTRAINT "settings_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."sms_settings"
    ADD CONSTRAINT "sms_settings_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."sms_templates"
    ADD CONSTRAINT "sms_templates_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."staff_attendance"
    ADD CONSTRAINT "staff_attendance_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."store_products"
    ADD CONSTRAINT "store_products_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."store_products"
    ADD CONSTRAINT "store_products_sku_key" UNIQUE ("sku");



ALTER TABLE ONLY "public"."trainer_assignments"
    ADD CONSTRAINT "trainer_assignments_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."trainer_assignments"
    ADD CONSTRAINT "trainer_assignments_trainer_id_member_id_branch_id_key" UNIQUE ("trainer_id", "member_id", "branch_id");



ALTER TABLE ONLY "public"."trainer_attendance"
    ADD CONSTRAINT "trainer_attendance_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."trainers"
    ADD CONSTRAINT "trainers_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."transactions"
    ADD CONSTRAINT "transactions_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."webhook_logs"
    ADD CONSTRAINT "webhook_logs_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."website_content"
    ADD CONSTRAINT "website_content_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."whatsapp_settings"
    ADD CONSTRAINT "whatsapp_settings_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."whatsapp_templates"
    ADD CONSTRAINT "whatsapp_templates_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."workout_days"
    ADD CONSTRAINT "workout_days_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."workout_plans"
    ADD CONSTRAINT "workout_plans_pkey" PRIMARY KEY ("id");



CREATE INDEX "idx_follow_up_lead_id" ON "public"."follow_up_history" USING "btree" ("lead_id");



CREATE INDEX "idx_leads_created_at" ON "public"."leads" USING "btree" ("created_at");



CREATE INDEX "idx_leads_funnel_stage" ON "public"."leads" USING "btree" ("funnel_stage");



CREATE INDEX "idx_leads_status" ON "public"."leads" USING "btree" ("status");



CREATE OR REPLACE TRIGGER "on_membership_created" AFTER INSERT ON "public"."membership_subscriptions" FOR EACH ROW EXECUTE FUNCTION "public"."handle_new_membership"();



CREATE OR REPLACE TRIGGER "set_timestamp_class_types" BEFORE UPDATE ON "public"."class_types" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "set_timestamp_fitness_progress" BEFORE UPDATE ON "public"."fitness_progress" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "set_timestamp_inventory_items" BEFORE UPDATE ON "public"."inventory_items" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "set_timestamp_motivational_messages" BEFORE UPDATE ON "public"."motivational_messages" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "set_timestamp_orders" BEFORE UPDATE ON "public"."orders" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "set_timestamp_promo_codes" BEFORE UPDATE ON "public"."promo_codes" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "set_timestamp_store_products" BEFORE UPDATE ON "public"."store_products" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_communication_tasks_updated_at" BEFORE UPDATE ON "public"."communication_tasks" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_email_settings_timestamp" BEFORE UPDATE ON "public"."email_settings" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_invoices_updated_at" BEFORE UPDATE ON "public"."invoices" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_member_attendance_updated_at" BEFORE UPDATE ON "public"."member_attendance" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_payment_gateway_settings_timestamp" BEFORE UPDATE ON "public"."payment_gateway_settings" FOR EACH ROW EXECUTE FUNCTION "public"."update_payment_settings_timestamp"();



CREATE OR REPLACE TRIGGER "update_payment_settings_timestamp" BEFORE UPDATE ON "public"."payment_settings" FOR EACH ROW EXECUTE FUNCTION "public"."update_payment_settings_timestamp"();



CREATE OR REPLACE TRIGGER "update_profiles_updated_at" BEFORE UPDATE ON "public"."profiles" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_trainer_attendance_updated_at" BEFORE UPDATE ON "public"."trainer_attendance" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_website_content_updated_at" BEFORE UPDATE ON "public"."website_content" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column_for_website_content"();



ALTER TABLE ONLY "public"."announcements"
    ADD CONSTRAINT "announcements_author_id_fkey" FOREIGN KEY ("author_id") REFERENCES "auth"."users"("id");



ALTER TABLE ONLY "public"."announcements"
    ADD CONSTRAINT "announcements_branch_id_fkey" FOREIGN KEY ("branch_id") REFERENCES "public"."branches"("id");



ALTER TABLE ONLY "public"."attendance_settings"
    ADD CONSTRAINT "attendance_settings_branch_id_fkey" FOREIGN KEY ("branch_id") REFERENCES "public"."branches"("id");



ALTER TABLE ONLY "public"."automation_rules"
    ADD CONSTRAINT "automation_rules_branch_id_fkey" FOREIGN KEY ("branch_id") REFERENCES "public"."branches"("id");



ALTER TABLE ONLY "public"."automation_rules"
    ADD CONSTRAINT "automation_rules_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "auth"."users"("id");



ALTER TABLE ONLY "public"."backup_logs"
    ADD CONSTRAINT "backup_logs_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id");



ALTER TABLE ONLY "public"."body_measurements"
    ADD CONSTRAINT "body_measurements_member_id_fkey" FOREIGN KEY ("member_id") REFERENCES "public"."members"("id");



ALTER TABLE ONLY "public"."class_bookings"
    ADD CONSTRAINT "class_bookings_class_id_fkey" FOREIGN KEY ("class_id") REFERENCES "public"."classes"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."class_bookings"
    ADD CONSTRAINT "class_bookings_member_id_fkey" FOREIGN KEY ("member_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."class_schedules"
    ADD CONSTRAINT "class_schedules_branch_id_fkey" FOREIGN KEY ("branch_id") REFERENCES "public"."branches"("id");



ALTER TABLE ONLY "public"."class_schedules"
    ADD CONSTRAINT "class_schedules_trainer_id_fkey" FOREIGN KEY ("trainer_id") REFERENCES "auth"."users"("id");



ALTER TABLE ONLY "public"."class_types"
    ADD CONSTRAINT "class_types_branch_id_fkey" FOREIGN KEY ("branch_id") REFERENCES "public"."branches"("id");



ALTER TABLE ONLY "public"."classes"
    ADD CONSTRAINT "classes_branch_id_fkey" FOREIGN KEY ("branch_id") REFERENCES "public"."branches"("id");



ALTER TABLE ONLY "public"."classes"
    ADD CONSTRAINT "classes_trainer_id_fkey" FOREIGN KEY ("trainer_id") REFERENCES "auth"."users"("id");



ALTER TABLE ONLY "public"."communication_tasks"
    ADD CONSTRAINT "communication_tasks_assigned_to_fkey" FOREIGN KEY ("assigned_to") REFERENCES "auth"."users"("id");



ALTER TABLE ONLY "public"."communication_tasks"
    ADD CONSTRAINT "communication_tasks_branch_id_fkey" FOREIGN KEY ("branch_id") REFERENCES "public"."branches"("id");



ALTER TABLE ONLY "public"."communication_tasks"
    ADD CONSTRAINT "communication_tasks_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "auth"."users"("id");



ALTER TABLE ONLY "public"."diet_plans"
    ADD CONSTRAINT "diet_plans_member_id_fkey" FOREIGN KEY ("member_id") REFERENCES "auth"."users"("id");



ALTER TABLE ONLY "public"."diet_plans"
    ADD CONSTRAINT "diet_plans_trainer_id_fkey" FOREIGN KEY ("trainer_id") REFERENCES "auth"."users"("id");



ALTER TABLE ONLY "public"."email_settings"
    ADD CONSTRAINT "email_settings_branch_id_fkey" FOREIGN KEY ("branch_id") REFERENCES "public"."branches"("id");



ALTER TABLE ONLY "public"."email_templates"
    ADD CONSTRAINT "email_templates_branch_id_fkey" FOREIGN KEY ("branch_id") REFERENCES "public"."branches"("id");



ALTER TABLE ONLY "public"."essl_device_settings"
    ADD CONSTRAINT "essl_device_settings_branch_id_fkey" FOREIGN KEY ("branch_id") REFERENCES "public"."branches"("id");



ALTER TABLE ONLY "public"."exercises"
    ADD CONSTRAINT "exercises_workout_day_id_fkey" FOREIGN KEY ("workout_day_id") REFERENCES "public"."workout_days"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."expense_categories"
    ADD CONSTRAINT "expense_categories_branch_id_fkey" FOREIGN KEY ("branch_id") REFERENCES "public"."branches"("id");



ALTER TABLE ONLY "public"."feedback"
    ADD CONSTRAINT "feedback_branch_id_fkey" FOREIGN KEY ("branch_id") REFERENCES "public"."branches"("id");



ALTER TABLE ONLY "public"."feedback"
    ADD CONSTRAINT "feedback_member_id_fkey" FOREIGN KEY ("member_id") REFERENCES "public"."members"("id");



ALTER TABLE ONLY "public"."fitness_progress"
    ADD CONSTRAINT "fitness_progress_branch_id_fkey" FOREIGN KEY ("branch_id") REFERENCES "public"."branches"("id");



ALTER TABLE ONLY "public"."fitness_progress"
    ADD CONSTRAINT "fitness_progress_member_id_fkey" FOREIGN KEY ("member_id") REFERENCES "public"."members"("id");



ALTER TABLE ONLY "public"."follow_up_history"
    ADD CONSTRAINT "follow_up_history_lead_id_fkey" FOREIGN KEY ("lead_id") REFERENCES "public"."leads"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."follow_up_history"
    ADD CONSTRAINT "follow_up_history_sent_by_fkey" FOREIGN KEY ("sent_by") REFERENCES "public"."profiles"("id");



ALTER TABLE ONLY "public"."follow_up_templates"
    ADD CONSTRAINT "follow_up_templates_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "public"."profiles"("id");



ALTER TABLE ONLY "public"."hikvision_api_settings"
    ADD CONSTRAINT "hikvision_api_settings_branch_id_fkey" FOREIGN KEY ("branch_id") REFERENCES "public"."branches"("id");



ALTER TABLE ONLY "public"."income_categories"
    ADD CONSTRAINT "income_categories_branch_id_fkey" FOREIGN KEY ("branch_id") REFERENCES "public"."branches"("id");



ALTER TABLE ONLY "public"."integration_statuses"
    ADD CONSTRAINT "integration_statuses_branch_id_fkey" FOREIGN KEY ("branch_id") REFERENCES "public"."branches"("id");



ALTER TABLE ONLY "public"."inventory_items"
    ADD CONSTRAINT "inventory_items_branch_id_fkey" FOREIGN KEY ("branch_id") REFERENCES "public"."branches"("id");



ALTER TABLE ONLY "public"."invoices"
    ADD CONSTRAINT "invoices_branch_id_fkey" FOREIGN KEY ("branch_id") REFERENCES "public"."branches"("id");



ALTER TABLE ONLY "public"."invoices"
    ADD CONSTRAINT "invoices_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "auth"."users"("id");



ALTER TABLE ONLY "public"."invoices"
    ADD CONSTRAINT "invoices_member_id_fkey" FOREIGN KEY ("member_id") REFERENCES "public"."members"("id");



ALTER TABLE ONLY "public"."invoices"
    ADD CONSTRAINT "invoices_membership_plan_id_fkey" FOREIGN KEY ("membership_plan_id") REFERENCES "public"."memberships"("id");



ALTER TABLE ONLY "public"."leads"
    ADD CONSTRAINT "leads_assigned_to_fkey" FOREIGN KEY ("assigned_to") REFERENCES "public"."profiles"("id");



ALTER TABLE ONLY "public"."meal_items"
    ADD CONSTRAINT "meal_items_meal_plan_id_fkey" FOREIGN KEY ("meal_plan_id") REFERENCES "public"."meal_plans"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."meal_plans"
    ADD CONSTRAINT "meal_plans_diet_plan_id_fkey" FOREIGN KEY ("diet_plan_id") REFERENCES "public"."diet_plans"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."measurements"
    ADD CONSTRAINT "measurements_branch_id_fkey" FOREIGN KEY ("branch_id") REFERENCES "public"."branches"("id");



ALTER TABLE ONLY "public"."measurements"
    ADD CONSTRAINT "measurements_member_id_fkey" FOREIGN KEY ("member_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."measurements"
    ADD CONSTRAINT "measurements_recorded_by_fkey" FOREIGN KEY ("recorded_by") REFERENCES "auth"."users"("id");



ALTER TABLE ONLY "public"."member_attendance"
    ADD CONSTRAINT "member_attendance_branch_id_fkey" FOREIGN KEY ("branch_id") REFERENCES "public"."branches"("id");



ALTER TABLE ONLY "public"."member_attendance"
    ADD CONSTRAINT "member_attendance_member_id_fkey" FOREIGN KEY ("member_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."member_attendance"
    ADD CONSTRAINT "member_attendance_recorded_by_fkey" FOREIGN KEY ("recorded_by") REFERENCES "auth"."users"("id");



ALTER TABLE ONLY "public"."member_memberships"
    ADD CONSTRAINT "member_memberships_branch_id_fkey" FOREIGN KEY ("branch_id") REFERENCES "public"."branches"("id");



ALTER TABLE ONLY "public"."member_memberships"
    ADD CONSTRAINT "member_memberships_member_id_fkey" FOREIGN KEY ("member_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."member_memberships"
    ADD CONSTRAINT "member_memberships_membership_id_fkey" FOREIGN KEY ("membership_id") REFERENCES "public"."memberships"("id");



ALTER TABLE ONLY "public"."member_memberships"
    ADD CONSTRAINT "member_memberships_trainer_id_fkey" FOREIGN KEY ("trainer_id") REFERENCES "auth"."users"("id");



ALTER TABLE ONLY "public"."member_progress"
    ADD CONSTRAINT "member_progress_member_id_fkey" FOREIGN KEY ("member_id") REFERENCES "auth"."users"("id");



ALTER TABLE ONLY "public"."member_progress"
    ADD CONSTRAINT "member_progress_trainer_id_fkey" FOREIGN KEY ("trainer_id") REFERENCES "auth"."users"("id");



ALTER TABLE ONLY "public"."members"
    ADD CONSTRAINT "members_branch_id_fkey" FOREIGN KEY ("branch_id") REFERENCES "public"."branches"("id");



ALTER TABLE ONLY "public"."members"
    ADD CONSTRAINT "members_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id");



ALTER TABLE ONLY "public"."membership_subscriptions"
    ADD CONSTRAINT "membership_subscriptions_branch_id_fkey" FOREIGN KEY ("branch_id") REFERENCES "public"."branches"("id");



ALTER TABLE ONLY "public"."membership_subscriptions"
    ADD CONSTRAINT "membership_subscriptions_plan_id_fkey" FOREIGN KEY ("plan_id") REFERENCES "public"."memberships"("id");



ALTER TABLE ONLY "public"."membership_subscriptions"
    ADD CONSTRAINT "membership_subscriptions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id");



ALTER TABLE ONLY "public"."memberships"
    ADD CONSTRAINT "memberships_branch_id_fkey" FOREIGN KEY ("branch_id") REFERENCES "public"."branches"("id");



ALTER TABLE ONLY "public"."orders"
    ADD CONSTRAINT "orders_branch_id_fkey" FOREIGN KEY ("branch_id") REFERENCES "public"."branches"("id");



ALTER TABLE ONLY "public"."orders"
    ADD CONSTRAINT "orders_member_id_fkey" FOREIGN KEY ("member_id") REFERENCES "public"."members"("id");



ALTER TABLE ONLY "public"."orders"
    ADD CONSTRAINT "orders_promo_code_id_fkey" FOREIGN KEY ("promo_code_id") REFERENCES "public"."promo_codes"("id");



ALTER TABLE ONLY "public"."orders"
    ADD CONSTRAINT "orders_staff_id_fkey" FOREIGN KEY ("staff_id") REFERENCES "public"."profiles"("id");



ALTER TABLE ONLY "public"."payments"
    ADD CONSTRAINT "payments_branch_id_fkey" FOREIGN KEY ("branch_id") REFERENCES "public"."branches"("id");



ALTER TABLE ONLY "public"."payments"
    ADD CONSTRAINT "payments_member_id_fkey" FOREIGN KEY ("member_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."payments"
    ADD CONSTRAINT "payments_membership_id_fkey" FOREIGN KEY ("membership_id") REFERENCES "public"."memberships"("id");



ALTER TABLE ONLY "public"."payments"
    ADD CONSTRAINT "payments_staff_id_fkey" FOREIGN KEY ("staff_id") REFERENCES "auth"."users"("id");



ALTER TABLE ONLY "public"."profiles"
    ADD CONSTRAINT "profiles_branch_id_fkey" FOREIGN KEY ("branch_id") REFERENCES "public"."branches"("id");



ALTER TABLE ONLY "public"."profiles"
    ADD CONSTRAINT "profiles_id_fkey" FOREIGN KEY ("id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."promo_codes"
    ADD CONSTRAINT "promo_codes_branch_id_fkey" FOREIGN KEY ("branch_id") REFERENCES "public"."branches"("id");



ALTER TABLE ONLY "public"."promo_codes"
    ADD CONSTRAINT "promo_codes_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "public"."profiles"("id");



ALTER TABLE ONLY "public"."referrals"
    ADD CONSTRAINT "referrals_promo_code_id_fkey" FOREIGN KEY ("promo_code_id") REFERENCES "public"."promo_codes"("id");



ALTER TABLE ONLY "public"."referrals"
    ADD CONSTRAINT "referrals_referred_id_fkey" FOREIGN KEY ("referred_id") REFERENCES "public"."members"("id");



ALTER TABLE ONLY "public"."referrals"
    ADD CONSTRAINT "referrals_referrer_id_fkey" FOREIGN KEY ("referrer_id") REFERENCES "public"."members"("id");



ALTER TABLE ONLY "public"."settings"
    ADD CONSTRAINT "settings_branch_id_fkey" FOREIGN KEY ("branch_id") REFERENCES "public"."branches"("id");



ALTER TABLE ONLY "public"."sms_settings"
    ADD CONSTRAINT "sms_settings_branch_id_fkey" FOREIGN KEY ("branch_id") REFERENCES "public"."branches"("id");



ALTER TABLE ONLY "public"."sms_templates"
    ADD CONSTRAINT "sms_templates_branch_id_fkey" FOREIGN KEY ("branch_id") REFERENCES "public"."branches"("id");



ALTER TABLE ONLY "public"."staff_attendance"
    ADD CONSTRAINT "staff_attendance_branch_id_fkey" FOREIGN KEY ("branch_id") REFERENCES "public"."branches"("id");



ALTER TABLE ONLY "public"."staff_attendance"
    ADD CONSTRAINT "staff_attendance_staff_id_fkey" FOREIGN KEY ("staff_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."store_products"
    ADD CONSTRAINT "store_products_branch_id_fkey" FOREIGN KEY ("branch_id") REFERENCES "public"."branches"("id");



ALTER TABLE ONLY "public"."store_products"
    ADD CONSTRAINT "store_products_inventory_id_fkey" FOREIGN KEY ("inventory_id") REFERENCES "public"."inventory_items"("id");



ALTER TABLE ONLY "public"."trainer_assignments"
    ADD CONSTRAINT "trainer_assignments_branch_id_fkey" FOREIGN KEY ("branch_id") REFERENCES "public"."branches"("id");



ALTER TABLE ONLY "public"."trainer_assignments"
    ADD CONSTRAINT "trainer_assignments_member_id_fkey" FOREIGN KEY ("member_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."trainer_assignments"
    ADD CONSTRAINT "trainer_assignments_trainer_id_fkey" FOREIGN KEY ("trainer_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."trainer_attendance"
    ADD CONSTRAINT "trainer_attendance_branch_id_fkey" FOREIGN KEY ("branch_id") REFERENCES "public"."branches"("id");



ALTER TABLE ONLY "public"."trainer_attendance"
    ADD CONSTRAINT "trainer_attendance_trainer_id_fkey" FOREIGN KEY ("trainer_id") REFERENCES "auth"."users"("id");



ALTER TABLE ONLY "public"."transactions"
    ADD CONSTRAINT "transactions_branch_id_fkey" FOREIGN KEY ("branch_id") REFERENCES "public"."branches"("id");



ALTER TABLE ONLY "public"."transactions"
    ADD CONSTRAINT "transactions_recorded_by_fkey" FOREIGN KEY ("recorded_by") REFERENCES "auth"."users"("id");



ALTER TABLE ONLY "public"."webhook_logs"
    ADD CONSTRAINT "webhook_logs_branch_id_fkey" FOREIGN KEY ("branch_id") REFERENCES "public"."branches"("id");



ALTER TABLE ONLY "public"."whatsapp_settings"
    ADD CONSTRAINT "whatsapp_settings_branch_id_fkey" FOREIGN KEY ("branch_id") REFERENCES "public"."branches"("id");



ALTER TABLE ONLY "public"."whatsapp_templates"
    ADD CONSTRAINT "whatsapp_templates_branch_id_fkey" FOREIGN KEY ("branch_id") REFERENCES "public"."branches"("id");



ALTER TABLE ONLY "public"."workout_days"
    ADD CONSTRAINT "workout_days_workout_plan_id_fkey" FOREIGN KEY ("workout_plan_id") REFERENCES "public"."workout_plans"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."workout_plans"
    ADD CONSTRAINT "workout_plans_member_id_fkey" FOREIGN KEY ("member_id") REFERENCES "auth"."users"("id");



ALTER TABLE ONLY "public"."workout_plans"
    ADD CONSTRAINT "workout_plans_trainer_id_fkey" FOREIGN KEY ("trainer_id") REFERENCES "auth"."users"("id");



CREATE POLICY "Access to workout days via plan" ON "public"."workout_days" FOR SELECT USING ((EXISTS ( SELECT 1
   FROM "public"."workout_plans"
  WHERE (("workout_plans"."id" = "workout_days"."workout_plan_id") AND ("workout_plans"."trainer_id" = "auth"."uid"())))));



CREATE POLICY "Admin users can insert payment settings" ON "public"."payment_settings" FOR INSERT WITH CHECK ((("auth"."jwt"() ->> 'role'::"text") = 'admin'::"text"));



CREATE POLICY "Admin users can manage SMS settings" ON "public"."sms_settings" USING ("public"."is_admin"());



CREATE POLICY "Admin users can manage SMS templates" ON "public"."sms_templates" USING ("public"."is_admin"());



CREATE POLICY "Admin users can manage WhatsApp settings" ON "public"."whatsapp_settings" USING ("public"."is_admin"());



CREATE POLICY "Admin users can manage WhatsApp templates" ON "public"."whatsapp_templates" USING ("public"."is_admin"());



CREATE POLICY "Admin users can manage automation rules" ON "public"."automation_rules" USING ("public"."is_admin"());



CREATE POLICY "Admin users can manage email settings" ON "public"."email_settings" USING ("public"."is_admin"());



CREATE POLICY "Admin users can manage email templates" ON "public"."email_templates" USING ("public"."is_admin"());



CREATE POLICY "Admin users can manage payment gateway settings" ON "public"."payment_gateway_settings" USING ("public"."is_admin"());



CREATE POLICY "Admin users can manage reminder rules" ON "public"."reminder_rules" USING ("public"."is_admin"());



CREATE POLICY "Admin users can read payment settings" ON "public"."payment_settings" FOR SELECT USING ((("auth"."jwt"() ->> 'role'::"text") = 'admin'::"text"));



CREATE POLICY "Admin users can update payment settings" ON "public"."payment_settings" FOR UPDATE USING ((("auth"."jwt"() ->> 'role'::"text") = 'admin'::"text")) WITH CHECK ((("auth"."jwt"() ->> 'role'::"text") = 'admin'::"text"));



CREATE POLICY "Admins and staff can manage announcements" ON "public"."announcements" TO "authenticated" USING ((( SELECT "profiles"."role"
   FROM "public"."profiles"
  WHERE ("profiles"."id" = "auth"."uid"())) = ANY (ARRAY['admin'::"text", 'staff'::"text"])));



CREATE POLICY "Admins and staff can manage motivational messages" ON "public"."motivational_messages" TO "authenticated" USING ((( SELECT "profiles"."role"
   FROM "public"."profiles"
  WHERE ("profiles"."id" = "auth"."uid"())) = ANY (ARRAY['admin'::"text", 'staff'::"text"])));



CREATE POLICY "Admins and staff can manage reminder rules" ON "public"."reminder_rules" TO "authenticated" USING ((( SELECT "profiles"."role"
   FROM "public"."profiles"
  WHERE ("profiles"."id" = "auth"."uid"())) = ANY (ARRAY['admin'::"text", 'staff'::"text"])));



CREATE POLICY "Admins and staff can view all feedback" ON "public"."feedback" FOR SELECT TO "authenticated" USING ((( SELECT "profiles"."role"
   FROM "public"."profiles"
  WHERE ("profiles"."id" = "auth"."uid"())) = ANY (ARRAY['admin'::"text", 'staff'::"text"])));



CREATE POLICY "Admins can SELECT any profile" ON "public"."profiles" FOR SELECT USING ((EXISTS ( SELECT 1
   FROM "public"."profiles" "p"
  WHERE (("p"."id" = "auth"."uid"()) AND ("p"."role" = 'admin'::"text")))));



CREATE POLICY "Admins can UPDATE any profile" ON "public"."profiles" FOR UPDATE USING ((EXISTS ( SELECT 1
   FROM "public"."profiles" "p"
  WHERE (("p"."id" = "auth"."uid"()) AND ("p"."role" = 'admin'::"text")))));



CREATE POLICY "Admins can access all backup logs" ON "public"."backup_logs" TO "authenticated" USING (((( SELECT "profiles"."role"
   FROM "public"."profiles"
  WHERE ("profiles"."id" = "auth"."uid"())) = 'admin'::"text") OR (( SELECT "profiles"."role"
   FROM "public"."profiles"
  WHERE ("profiles"."id" = "auth"."uid"())) = 'staff'::"text")));



CREATE POLICY "Admins can access all profiles" ON "public"."profiles" FOR SELECT USING ((("auth"."jwt"() ->> 'role'::"text") = 'admin'::"text"));



CREATE POLICY "Admins can do anything with feedback" ON "public"."feedback" USING (("auth"."uid"() IN ( SELECT "profiles"."id"
   FROM "public"."profiles"
  WHERE ("profiles"."role" = 'admin'::"text"))));



CREATE POLICY "Admins can do anything with inventory_items" ON "public"."inventory_items" USING (("auth"."uid"() IN ( SELECT "profiles"."id"
   FROM "public"."profiles"
  WHERE ("profiles"."role" = 'admin'::"text"))));



CREATE POLICY "Admins can do anything with motivational_messages" ON "public"."motivational_messages" USING (("auth"."uid"() IN ( SELECT "profiles"."id"
   FROM "public"."profiles"
  WHERE ("profiles"."role" = 'admin'::"text"))));



CREATE POLICY "Admins can do anything with orders" ON "public"."orders" USING (("auth"."uid"() IN ( SELECT "profiles"."id"
   FROM "public"."profiles"
  WHERE ("profiles"."role" = 'admin'::"text"))));



CREATE POLICY "Admins can do anything with promo_codes" ON "public"."promo_codes" USING (("auth"."uid"() IN ( SELECT "profiles"."id"
   FROM "public"."profiles"
  WHERE ("profiles"."role" = 'admin'::"text"))));



CREATE POLICY "Admins can do anything with referrals" ON "public"."referrals" USING (("auth"."uid"() IN ( SELECT "profiles"."id"
   FROM "public"."profiles"
  WHERE ("profiles"."role" = 'admin'::"text"))));



CREATE POLICY "Admins can do anything with store_products" ON "public"."store_products" USING (("auth"."uid"() IN ( SELECT "profiles"."id"
   FROM "public"."profiles"
  WHERE ("profiles"."role" = 'admin'::"text"))));



CREATE POLICY "Admins can do anything with trainer_attendance" ON "public"."trainer_attendance" USING (("public"."get_user_role"() = 'admin'::"text"));



CREATE POLICY "Admins can manage all invoices" ON "public"."invoices" USING (("public"."get_user_role"() = 'admin'::"text")) WITH CHECK (("public"."get_user_role"() = 'admin'::"text"));



CREATE POLICY "Admins can manage email settings" ON "public"."email_settings" USING (("public"."get_user_role"() = 'admin'::"text"));



CREATE POLICY "Admins can manage settings" ON "public"."settings" USING (("public"."get_user_role"() = 'admin'::"text"));



CREATE POLICY "Admins can update all profiles" ON "public"."profiles" FOR UPDATE USING ("public"."is_admin"());



CREATE POLICY "Admins can view all profiles" ON "public"."profiles" FOR SELECT USING ("public"."is_admin"());



CREATE POLICY "Admins have full access" ON "public"."class_bookings" USING (("auth"."uid"() IN ( SELECT "profiles"."id"
   FROM "public"."profiles"
  WHERE ("profiles"."role" = 'admin'::"text"))));



CREATE POLICY "Admins have full access" ON "public"."classes" USING (("auth"."uid"() IN ( SELECT "profiles"."id"
   FROM "public"."profiles"
  WHERE ("profiles"."role" = 'admin'::"text"))));



CREATE POLICY "Admins have full access" ON "public"."expense_categories" USING (("auth"."uid"() IN ( SELECT "profiles"."id"
   FROM "public"."profiles"
  WHERE ("profiles"."role" = 'admin'::"text"))));



CREATE POLICY "Admins have full access" ON "public"."global_settings" USING (("auth"."uid"() IN ( SELECT "profiles"."id"
   FROM "public"."profiles"
  WHERE ("profiles"."role" = 'admin'::"text"))));



CREATE POLICY "Admins have full access" ON "public"."income_categories" USING (("auth"."uid"() IN ( SELECT "profiles"."id"
   FROM "public"."profiles"
  WHERE ("profiles"."role" = 'admin'::"text"))));



CREATE POLICY "Admins have full access" ON "public"."measurements" USING (("auth"."uid"() IN ( SELECT "profiles"."id"
   FROM "public"."profiles"
  WHERE ("profiles"."role" = 'admin'::"text"))));



CREATE POLICY "Admins have full access" ON "public"."member_memberships" USING (("auth"."uid"() IN ( SELECT "profiles"."id"
   FROM "public"."profiles"
  WHERE ("profiles"."role" = 'admin'::"text"))));



CREATE POLICY "Admins have full access" ON "public"."payments" USING (("auth"."uid"() IN ( SELECT "profiles"."id"
   FROM "public"."profiles"
  WHERE ("profiles"."role" = 'admin'::"text"))));



CREATE POLICY "Admins have full access" ON "public"."profiles" USING ((EXISTS ( SELECT 1
   FROM "public"."profiles" "p"
  WHERE (("p"."id" = "auth"."uid"()) AND ("p"."role" = 'admin'::"text")))));



CREATE POLICY "Admins have full access" ON "public"."staff_attendance" USING (("auth"."uid"() IN ( SELECT "profiles"."id"
   FROM "public"."profiles"
  WHERE ("profiles"."role" = 'admin'::"text"))));



CREATE POLICY "Admins have full access" ON "public"."trainer_assignments" USING (("auth"."uid"() IN ( SELECT "profiles"."id"
   FROM "public"."profiles"
  WHERE ("profiles"."role" = 'admin'::"text"))));



CREATE POLICY "Admins have full access" ON "public"."transactions" USING (("auth"."uid"() IN ( SELECT "profiles"."id"
   FROM "public"."profiles"
  WHERE ("profiles"."role" = 'admin'::"text"))));



CREATE POLICY "Admins have full access to ESSL device settings" ON "public"."essl_device_settings" USING (("public"."get_user_role"() = 'admin'::"text"));



CREATE POLICY "Admins have full access to Hikvision settings" ON "public"."hikvision_api_settings" USING (("public"."get_user_role"() = 'admin'::"text"));



CREATE POLICY "Admins have full access to SMS templates" ON "public"."sms_templates" USING (("public"."get_user_role"() = 'admin'::"text"));



CREATE POLICY "Admins have full access to WhatsApp templates" ON "public"."whatsapp_templates" USING (("public"."get_user_role"() = 'admin'::"text"));



CREATE POLICY "Admins have full access to attendance" ON "public"."member_attendance" USING (("public"."get_user_role"() = 'admin'::"text"));



CREATE POLICY "Admins have full access to automation rules" ON "public"."automation_rules" USING (("public"."get_user_role"() = 'admin'::"text"));



CREATE POLICY "Admins have full access to branches" ON "public"."branches" USING (("public"."get_user_role"() = 'admin'::"text"));



CREATE POLICY "Admins have full access to email templates" ON "public"."email_templates" USING (("public"."get_user_role"() = 'admin'::"text"));



CREATE POLICY "Admins have full access to members" ON "public"."members" USING (("public"."get_user_role"() = 'admin'::"text"));



CREATE POLICY "Admins have full access to memberships" ON "public"."memberships" USING (("public"."get_user_role"() = 'admin'::"text"));



CREATE POLICY "Allow admins full access to members" ON "public"."members" TO "authenticated" USING ((EXISTS ( SELECT 1
   FROM "public"."profiles"
  WHERE (("profiles"."id" = "auth"."uid"()) AND ("profiles"."role" = 'admin'::"text")))));



CREATE POLICY "Allow admins full access to referrals" ON "public"."referrals" TO "authenticated" USING (("auth"."uid"() IN ( SELECT "profiles"."id"
   FROM "public"."profiles"
  WHERE ("profiles"."role" = 'admin'::"text"))));



CREATE POLICY "Allow admins to modify website content" ON "public"."website_content" USING (("auth"."uid"() IN ( SELECT "profiles"."id"
   FROM "public"."profiles"
  WHERE ("profiles"."role" = 'admin'::"text"))));



CREATE POLICY "Allow admins to read payment gateway settings" ON "public"."payment_gateway_settings" FOR SELECT USING ((( SELECT "profiles"."role"
   FROM "public"."profiles"
  WHERE ("profiles"."id" = "auth"."uid"())) = 'admin'::"text"));



CREATE POLICY "Allow admins to read webhook logs" ON "public"."webhook_logs" FOR SELECT USING ((( SELECT "profiles"."role"
   FROM "public"."profiles"
  WHERE ("profiles"."id" = "auth"."uid"())) = 'admin'::"text"));



CREATE POLICY "Allow admins to update payment gateway settings" ON "public"."payment_gateway_settings" FOR UPDATE USING ((( SELECT "profiles"."role"
   FROM "public"."profiles"
  WHERE ("profiles"."id" = "auth"."uid"())) = 'admin'::"text"));



CREATE POLICY "Allow all to view website content" ON "public"."website_content" FOR SELECT USING (true);



CREATE POLICY "Allow logged-in users to read their profile" ON "public"."profiles" FOR SELECT USING (("auth"."uid"() = "id"));



CREATE POLICY "Allow staff to manage branch referrals" ON "public"."referrals" FOR INSERT TO "authenticated" WITH CHECK ((EXISTS ( SELECT 1
   FROM "public"."profiles"
  WHERE (("profiles"."id" = "auth"."uid"()) AND ("profiles"."role" = ANY (ARRAY['staff'::"text", 'admin'::"text"]))))));



CREATE POLICY "Allow staff to read webhook logs" ON "public"."webhook_logs" FOR SELECT USING ((( SELECT "profiles"."role"
   FROM "public"."profiles"
  WHERE ("profiles"."id" = "auth"."uid"())) = 'staff'::"text"));



CREATE POLICY "Allow staff to view all branch referrals" ON "public"."referrals" FOR SELECT TO "authenticated" USING ((EXISTS ( SELECT 1
   FROM "public"."profiles"
  WHERE (("profiles"."id" = "auth"."uid"()) AND ("profiles"."role" = ANY (ARRAY['staff'::"text", 'admin'::"text"]))))));



CREATE POLICY "Anyone can view active memberships" ON "public"."memberships" FOR SELECT USING (("is_active" = true));



CREATE POLICY "Anyone can view branches" ON "public"."branches" FOR SELECT USING (true);



CREATE POLICY "Branch managers can manage their branch email settings" ON "public"."email_settings" USING ((("public"."get_user_role"() = 'staff'::"text") AND (( SELECT "profiles"."is_branch_manager"
   FROM "public"."profiles"
  WHERE ("profiles"."id" = "auth"."uid"())) = true) AND ("branch_id" = ( SELECT "profiles"."branch_id"
   FROM "public"."profiles"
  WHERE ("profiles"."id" = "auth"."uid"())))));



CREATE POLICY "Branch managers can view branch settings" ON "public"."settings" FOR SELECT USING (("auth"."uid"() IN ( SELECT "profiles"."id"
   FROM "public"."profiles"
  WHERE (("profiles"."is_branch_manager" = true) AND ("profiles"."branch_id" = "settings"."branch_id")))));



CREATE POLICY "Delete workout days via plan" ON "public"."workout_days" FOR DELETE USING ((EXISTS ( SELECT 1
   FROM "public"."workout_plans"
  WHERE (("workout_plans"."id" = "workout_days"."workout_plan_id") AND ("workout_plans"."trainer_id" = "auth"."uid"())))));



CREATE POLICY "Enable delete for admin only" ON "public"."class_types" FOR DELETE USING ((("auth"."role"() = 'authenticated'::"text") AND (( SELECT "profiles"."role"
   FROM "public"."profiles"
  WHERE ("profiles"."id" = "auth"."uid"())) = 'admin'::"text")));



CREATE POLICY "Enable insert fitness_progress for authorized users" ON "public"."fitness_progress" FOR INSERT WITH CHECK ((("auth"."role"() = 'authenticated'::"text") AND ((( SELECT "profiles"."role"
   FROM "public"."profiles"
  WHERE ("profiles"."id" = "auth"."uid"())) = ANY (ARRAY['admin'::"text", 'staff'::"text"])) OR ((( SELECT "profiles"."role"
   FROM "public"."profiles"
  WHERE ("profiles"."id" = "auth"."uid"())) = 'trainer'::"text") AND ("member_id" IN ( SELECT "trainer_assignments"."member_id"
   FROM "public"."trainer_assignments"
  WHERE ("trainer_assignments"."trainer_id" = "auth"."uid"())))))));



CREATE POLICY "Enable insert for staff and admin" ON "public"."class_types" FOR INSERT WITH CHECK ((("auth"."role"() = 'authenticated'::"text") AND (( SELECT "profiles"."role"
   FROM "public"."profiles"
  WHERE ("profiles"."id" = "auth"."uid"())) = ANY (ARRAY['admin'::"text", 'staff'::"text"]))));



CREATE POLICY "Enable read fitness_progress for authorized users" ON "public"."fitness_progress" FOR SELECT USING ((("auth"."role"() = 'authenticated'::"text") AND ((( SELECT "profiles"."role"
   FROM "public"."profiles"
  WHERE ("profiles"."id" = "auth"."uid"())) = 'admin'::"text") OR ((( SELECT "profiles"."role"
   FROM "public"."profiles"
  WHERE ("profiles"."id" = "auth"."uid"())) = 'staff'::"text") AND (( SELECT "profiles"."branch_id"
   FROM "public"."profiles"
  WHERE ("profiles"."id" = "auth"."uid"())) = "branch_id")) OR ((( SELECT "profiles"."role"
   FROM "public"."profiles"
  WHERE ("profiles"."id" = "auth"."uid"())) = 'trainer'::"text") AND ("member_id" IN ( SELECT "trainer_assignments"."member_id"
   FROM "public"."trainer_assignments"
  WHERE ("trainer_assignments"."trainer_id" = "auth"."uid"())))) OR ((( SELECT "profiles"."role"
   FROM "public"."profiles"
  WHERE ("profiles"."id" = "auth"."uid"())) = 'member'::"text") AND ("member_id" = ( SELECT "members"."id"
   FROM "public"."members"
  WHERE ("members"."user_id" = "auth"."uid"())))))));



CREATE POLICY "Enable read for all authenticated users" ON "public"."class_types" FOR SELECT USING (("auth"."role"() = 'authenticated'::"text"));



CREATE POLICY "Enable update fitness_progress for authorized users" ON "public"."fitness_progress" FOR UPDATE USING ((("auth"."role"() = 'authenticated'::"text") AND ((( SELECT "profiles"."role"
   FROM "public"."profiles"
  WHERE ("profiles"."id" = "auth"."uid"())) = ANY (ARRAY['admin'::"text", 'staff'::"text"])) OR ((( SELECT "profiles"."role"
   FROM "public"."profiles"
  WHERE ("profiles"."id" = "auth"."uid"())) = 'trainer'::"text") AND ("member_id" IN ( SELECT "trainer_assignments"."member_id"
   FROM "public"."trainer_assignments"
  WHERE ("trainer_assignments"."trainer_id" = "auth"."uid"())))))));



CREATE POLICY "Enable update for staff and admin" ON "public"."class_types" FOR UPDATE USING ((("auth"."role"() = 'authenticated'::"text") AND (( SELECT "profiles"."role"
   FROM "public"."profiles"
  WHERE ("profiles"."id" = "auth"."uid"())) = ANY (ARRAY['admin'::"text", 'staff'::"text"]))));



CREATE POLICY "Everyone can view active motivational messages" ON "public"."motivational_messages" FOR SELECT TO "authenticated" USING (("active" = true));



CREATE POLICY "Everyone can view announcements for their branch or role" ON "public"."announcements" FOR SELECT TO "authenticated" USING ((("branch_id" IS NULL) OR ("branch_id" = ( SELECT "profiles"."branch_id"
   FROM "public"."profiles"
  WHERE ("profiles"."id" = "auth"."uid"()))) OR (( SELECT "profiles"."role"
   FROM "public"."profiles"
  WHERE ("profiles"."id" = "auth"."uid"())) = ANY ("target_roles")) OR ('all'::"text" = ANY ("target_roles"))));



CREATE POLICY "Insert workout days via plan" ON "public"."workout_days" FOR INSERT WITH CHECK ((EXISTS ( SELECT 1
   FROM "public"."workout_plans"
  WHERE (("workout_plans"."id" = "workout_days"."workout_plan_id") AND ("workout_plans"."trainer_id" = "auth"."uid"())))));



CREATE POLICY "Members can create their own feedback" ON "public"."feedback" FOR INSERT WITH CHECK (("auth"."uid"() = "member_id"));



CREATE POLICY "Members can only view and edit their own profile" ON "public"."members" FOR SELECT TO "authenticated" USING ((("user_id" = "auth"."uid"()) OR (EXISTS ( SELECT 1
   FROM "public"."profiles"
  WHERE (("profiles"."id" = "auth"."uid"()) AND ("profiles"."role" = ANY (ARRAY['staff'::"text", 'trainer'::"text", 'admin'::"text"])))))));



CREATE POLICY "Members can read their own feedback" ON "public"."feedback" FOR SELECT USING (("auth"."uid"() = "member_id"));



CREATE POLICY "Members can see their own referrals" ON "public"."referrals" FOR SELECT USING (("auth"."uid"() = "referrer_id"));



CREATE POLICY "Members can view and create their own feedback" ON "public"."feedback" TO "authenticated" USING (("member_id" = "auth"."uid"()));



CREATE POLICY "Members can view own attendance" ON "public"."member_attendance" FOR SELECT USING ((EXISTS ( SELECT 1
   FROM "public"."members"
  WHERE (("members"."id" = "member_attendance"."member_id") AND ("members"."user_id" = "auth"."uid"())))));



CREATE POLICY "Members can view own record" ON "public"."members" FOR SELECT USING ((("public"."get_user_role"() = 'member'::"text") AND ("user_id" = "auth"."uid"())));



CREATE POLICY "Members can view store_products" ON "public"."store_products" FOR SELECT USING (("auth"."uid"() IN ( SELECT "profiles"."id"
   FROM "public"."profiles"
  WHERE ("profiles"."role" = 'member'::"text"))));



CREATE POLICY "Members can view their own invoices" ON "public"."invoices" FOR SELECT USING (("member_id" IN ( SELECT "members"."id"
   FROM "public"."members"
  WHERE ("members"."user_id" = "auth"."uid"()))));



CREATE POLICY "Members can view their own orders" ON "public"."orders" FOR SELECT USING (("auth"."uid"() = "member_id"));



CREATE POLICY "Members can view their own referrals" ON "public"."referrals" FOR SELECT TO "authenticated" USING ((("referrer_id" = "auth"."uid"()) OR (EXISTS ( SELECT 1
   FROM "public"."profiles"
  WHERE (("profiles"."id" = "auth"."uid"()) AND ("profiles"."role" = ANY (ARRAY['staff'::"text", 'trainer'::"text", 'admin'::"text"])))))));



CREATE POLICY "Staff and trainers can read feedback" ON "public"."feedback" FOR SELECT USING (("auth"."uid"() IN ( SELECT "profiles"."id"
   FROM "public"."profiles"
  WHERE ("profiles"."role" = ANY (ARRAY['staff'::"text", 'trainer'::"text"])))));



CREATE POLICY "Staff can insert subscriptions" ON "public"."membership_subscriptions" FOR INSERT WITH CHECK ("public"."user_has_branch_access"("branch_id"));



CREATE POLICY "Staff can manage attendance in their branch" ON "public"."member_attendance" USING ((("public"."get_user_role"() = 'staff'::"text") AND "public"."user_has_branch_access"("branch_id")));



CREATE POLICY "Staff can manage inventory_items in their branch" ON "public"."inventory_items" USING (("auth"."uid"() IN ( SELECT "profiles"."id"
   FROM "public"."profiles"
  WHERE (("profiles"."role" = 'staff'::"text") AND ("profiles"."branch_id" = "inventory_items"."branch_id")))));



CREATE POLICY "Staff can manage invoices in their branch" ON "public"."invoices" USING ((("public"."get_user_role"() = 'staff'::"text") AND "public"."user_has_branch_access"("branch_id"))) WITH CHECK ((("public"."get_user_role"() = 'staff'::"text") AND "public"."user_has_branch_access"("branch_id")));



CREATE POLICY "Staff can manage members in their branch" ON "public"."members" USING ((("public"."get_user_role"() = 'staff'::"text") AND "public"."user_has_branch_access"("branch_id")));



CREATE POLICY "Staff can manage memberships in their branch" ON "public"."memberships" USING ((("public"."get_user_role"() = 'staff'::"text") AND (("branch_id" IS NULL) OR "public"."user_has_branch_access"("branch_id"))));



CREATE POLICY "Staff can manage motivational_messages" ON "public"."motivational_messages" USING (("auth"."uid"() IN ( SELECT "profiles"."id"
   FROM "public"."profiles"
  WHERE ("profiles"."role" = 'staff'::"text"))));



CREATE POLICY "Staff can manage orders" ON "public"."orders" USING (("auth"."uid"() IN ( SELECT "profiles"."id"
   FROM "public"."profiles"
  WHERE ("profiles"."role" = 'staff'::"text"))));



CREATE POLICY "Staff can manage trainer attendance within their branch" ON "public"."trainer_attendance" USING ((("public"."get_user_role"() = 'staff'::"text") AND "public"."user_has_branch_access"("branch_id")));



CREATE POLICY "Staff can read all referrals" ON "public"."referrals" FOR SELECT USING (("auth"."uid"() IN ( SELECT "profiles"."id"
   FROM "public"."profiles"
  WHERE ("profiles"."role" = 'staff'::"text"))));



CREATE POLICY "Staff can read inventory_items" ON "public"."inventory_items" FOR SELECT USING (("auth"."uid"() IN ( SELECT "profiles"."id"
   FROM "public"."profiles"
  WHERE ("profiles"."role" = ANY (ARRAY['staff'::"text", 'trainer'::"text"])))));



CREATE POLICY "Staff can read motivational_messages" ON "public"."motivational_messages" FOR SELECT USING (("auth"."uid"() IN ( SELECT "profiles"."id"
   FROM "public"."profiles"
  WHERE ("profiles"."role" = ANY (ARRAY['staff'::"text", 'trainer'::"text"])))));



CREATE POLICY "Staff can read orders" ON "public"."orders" FOR SELECT USING (("auth"."uid"() IN ( SELECT "profiles"."id"
   FROM "public"."profiles"
  WHERE ("profiles"."role" = 'staff'::"text"))));



CREATE POLICY "Staff can read promo_codes" ON "public"."promo_codes" FOR SELECT USING (("auth"."uid"() IN ( SELECT "profiles"."id"
   FROM "public"."profiles"
  WHERE ("profiles"."role" = 'staff'::"text"))));



CREATE POLICY "Staff can read store_products" ON "public"."store_products" FOR SELECT USING (("auth"."uid"() IN ( SELECT "profiles"."id"
   FROM "public"."profiles"
  WHERE ("profiles"."role" = ANY (ARRAY['staff'::"text", 'trainer'::"text"])))));



CREATE POLICY "Staff can update subscriptions" ON "public"."membership_subscriptions" FOR UPDATE USING ("public"."user_has_branch_access"("branch_id"));



CREATE POLICY "Staff can view ESSL device settings in their branch" ON "public"."essl_device_settings" FOR SELECT USING ((("public"."get_user_role"() = 'staff'::"text") AND "public"."user_has_branch_access"("branch_id")));



CREATE POLICY "Staff can view Hikvision settings in their branch" ON "public"."hikvision_api_settings" FOR SELECT USING ((("public"."get_user_role"() = 'staff'::"text") AND "public"."user_has_branch_access"("branch_id")));



CREATE POLICY "Staff can view SMS templates in their branch" ON "public"."sms_templates" FOR SELECT USING ((("public"."get_user_role"() = 'staff'::"text") AND (("branch_id" IS NULL) OR "public"."user_has_branch_access"("branch_id"))));



CREATE POLICY "Staff can view WhatsApp templates in their branch" ON "public"."whatsapp_templates" FOR SELECT USING ((("public"."get_user_role"() = 'staff'::"text") AND (("branch_id" IS NULL) OR "public"."user_has_branch_access"("branch_id"))));



CREATE POLICY "Staff can view all members in their branch" ON "public"."members" FOR SELECT TO "authenticated" USING ((EXISTS ( SELECT 1
   FROM "public"."profiles" "p"
  WHERE (("p"."id" = "auth"."uid"()) AND ("p"."role" = ANY (ARRAY['staff'::"text", 'admin'::"text"])) AND (("p"."branch_id" = "members"."branch_id") OR ("p"."role" = 'admin'::"text"))))));



CREATE POLICY "Staff can view and update their own branch" ON "public"."branches" USING ((("public"."get_user_role"() = 'staff'::"text") AND "public"."user_has_branch_access"("id")));



CREATE POLICY "Staff can view automation rules in their branch" ON "public"."automation_rules" FOR SELECT USING ((("public"."get_user_role"() = 'staff'::"text") AND (("branch_id" IS NULL) OR "public"."user_has_branch_access"("branch_id"))));



CREATE POLICY "Staff can view email settings" ON "public"."email_settings" FOR SELECT USING ((("public"."get_user_role"() = ANY (ARRAY['admin'::"text", 'staff'::"text"])) AND (("branch_id" IS NULL) OR ("branch_id" = ( SELECT "profiles"."branch_id"
   FROM "public"."profiles"
  WHERE ("profiles"."id" = "auth"."uid"()))) OR ("public"."get_user_role"() = 'admin'::"text"))));



CREATE POLICY "Staff can view email templates in their branch" ON "public"."email_templates" FOR SELECT USING ((("public"."get_user_role"() = 'staff'::"text") AND (("branch_id" IS NULL) OR "public"."user_has_branch_access"("branch_id"))));



CREATE POLICY "Staff can view trainer attendance within their branch" ON "public"."trainer_attendance" FOR SELECT USING ((("public"."get_user_role"() = 'staff'::"text") AND "public"."user_has_branch_access"("branch_id")));



CREATE POLICY "Trainers can access their assigned members" ON "public"."members" FOR SELECT TO "authenticated" USING (((("trainer_id" = "auth"."uid"()) AND (EXISTS ( SELECT 1
   FROM "public"."profiles"
  WHERE (("profiles"."id" = "auth"."uid"()) AND ("profiles"."role" = 'trainer'::"text"))))) OR (EXISTS ( SELECT 1
   FROM "public"."profiles"
  WHERE (("profiles"."id" = "auth"."uid"()) AND ("profiles"."role" = ANY (ARRAY['staff'::"text", 'admin'::"text"])))))));



CREATE POLICY "Trainers can create classes" ON "public"."class_schedules" FOR INSERT WITH CHECK (("auth"."uid"() = "trainer_id"));



CREATE POLICY "Trainers can create diet plans" ON "public"."diet_plans" FOR INSERT WITH CHECK (("auth"."uid"() = "trainer_id"));



CREATE POLICY "Trainers can create workout plans" ON "public"."workout_plans" FOR INSERT WITH CHECK (("auth"."uid"() = "trainer_id"));



CREATE POLICY "Trainers can delete their own classes" ON "public"."class_schedules" FOR DELETE USING (("auth"."uid"() = "trainer_id"));



CREATE POLICY "Trainers can delete their own diet plans" ON "public"."diet_plans" FOR DELETE USING (("auth"."uid"() = "trainer_id"));



CREATE POLICY "Trainers can delete their own workout plans" ON "public"."workout_plans" FOR DELETE USING (("auth"."uid"() = "trainer_id"));



CREATE POLICY "Trainers can insert progress for assigned members" ON "public"."member_progress" FOR INSERT WITH CHECK (("auth"."uid"() = "trainer_id"));



CREATE POLICY "Trainers can update assigned members' progress" ON "public"."member_progress" FOR UPDATE USING (("auth"."uid"() = "trainer_id"));



CREATE POLICY "Trainers can update their own classes" ON "public"."class_schedules" FOR UPDATE USING (("auth"."uid"() = "trainer_id"));



CREATE POLICY "Trainers can update their own diet plans" ON "public"."diet_plans" FOR UPDATE USING (("auth"."uid"() = "trainer_id"));



CREATE POLICY "Trainers can update their own workout plans" ON "public"."workout_plans" FOR UPDATE USING (("auth"."uid"() = "trainer_id"));



CREATE POLICY "Trainers can view assigned members" ON "public"."members" FOR SELECT USING ((("public"."get_user_role"() = 'trainer'::"text") AND (("trainer_id" = "auth"."uid"()) OR (EXISTS ( SELECT 1
   FROM "public"."trainer_assignments"
  WHERE (("trainer_assignments"."trainer_id" = "auth"."uid"()) AND ("trainer_assignments"."member_id" = "members"."id") AND ("trainer_assignments"."is_active" = true)))))));



CREATE POLICY "Trainers can view assigned members attendance" ON "public"."member_attendance" FOR SELECT USING ((("public"."get_user_role"() = 'trainer'::"text") AND (EXISTS ( SELECT 1
   FROM "public"."members"
  WHERE (("members"."id" = "member_attendance"."member_id") AND (("members"."trainer_id" = "auth"."uid"()) OR (EXISTS ( SELECT 1
           FROM "public"."trainer_assignments"
          WHERE (("trainer_assignments"."trainer_id" = "auth"."uid"()) AND ("trainer_assignments"."member_id" = "member_attendance"."member_id") AND ("trainer_assignments"."is_active" = true))))))))));



CREATE POLICY "Trainers can view assigned members' progress" ON "public"."member_progress" FOR SELECT USING (("auth"."uid"() = "trainer_id"));



CREATE POLICY "Trainers can view feedback about themselves" ON "public"."feedback" FOR SELECT TO "authenticated" USING ((("type" = 'trainer'::"text") AND ("related_id" = "auth"."uid"()) AND (( SELECT "profiles"."role"
   FROM "public"."profiles"
  WHERE ("profiles"."id" = "auth"."uid"())) = 'trainer'::"text")));



CREATE POLICY "Trainers can view their own attendance" ON "public"."trainer_attendance" FOR SELECT USING (("trainer_id" = "auth"."uid"()));



CREATE POLICY "Trainers can view their own classes" ON "public"."class_schedules" FOR SELECT USING (("auth"."uid"() = "trainer_id"));



CREATE POLICY "Trainers can view their own diet plans" ON "public"."diet_plans" FOR SELECT USING (("auth"."uid"() = "trainer_id"));



CREATE POLICY "Trainers can view their own workout plans" ON "public"."workout_plans" FOR SELECT USING (("auth"."uid"() = "trainer_id"));



CREATE POLICY "Update workout days via plan" ON "public"."workout_days" FOR UPDATE USING ((EXISTS ( SELECT 1
   FROM "public"."workout_plans"
  WHERE (("workout_plans"."id" = "workout_days"."workout_plan_id") AND ("workout_plans"."trainer_id" = "auth"."uid"())))));



CREATE POLICY "Users can SELECT their own profile" ON "public"."profiles" FOR SELECT USING (("auth"."uid"() = "id"));



CREATE POLICY "Users can UPDATE their own profile" ON "public"."profiles" FOR UPDATE USING (("auth"."uid"() = "id"));



CREATE POLICY "Users can create tasks" ON "public"."communication_tasks" FOR INSERT WITH CHECK (("auth"."uid"() IS NOT NULL));



CREATE POLICY "Users can update assigned tasks" ON "public"."communication_tasks" FOR UPDATE USING ((("auth"."uid"() IN ( SELECT "profiles"."id"
   FROM "public"."profiles"
  WHERE (("profiles"."branch_id" = "communication_tasks"."branch_id") OR ("profiles"."role" = 'admin'::"text") OR ("communication_tasks"."branch_id" = ANY ("profiles"."accessible_branch_ids"))))) OR ("auth"."uid"() = "assigned_to") OR ("auth"."uid"() = "created_by")));



CREATE POLICY "Users can update their own profile" ON "public"."profiles" FOR UPDATE USING (("auth"."uid"() = "id"));



CREATE POLICY "Users can view own subscriptions" ON "public"."membership_subscriptions" FOR SELECT USING ((("auth"."uid"() = "user_id") OR "public"."user_has_branch_access"("branch_id")));



CREATE POLICY "Users can view their branch tasks" ON "public"."communication_tasks" FOR SELECT USING ((("auth"."uid"() IN ( SELECT "profiles"."id"
   FROM "public"."profiles"
  WHERE (("profiles"."branch_id" = "communication_tasks"."branch_id") OR ("profiles"."role" = 'admin'::"text") OR ("communication_tasks"."branch_id" = ANY ("profiles"."accessible_branch_ids"))))) OR ("auth"."uid"() = "assigned_to") OR ("auth"."uid"() = "created_by")));



CREATE POLICY "Users can view their own profile" ON "public"."profiles" FOR SELECT USING (("auth"."uid"() = "id"));



ALTER TABLE "public"."announcements" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."automation_rules" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."backup_logs" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."body_measurements" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."branches" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."class_bookings" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."class_schedules" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."class_types" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."classes" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."communication_tasks" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."diet_plans" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."email_settings" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."email_templates" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."essl_device_settings" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."exercises" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."expense_categories" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."feedback" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."fitness_progress" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."global_settings" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."hikvision_api_settings" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."income_categories" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."inventory_items" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."invoices" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."leads" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."meal_items" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."meal_plans" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."measurements" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."member_attendance" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."member_memberships" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."member_progress" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."members" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."membership_subscriptions" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."memberships" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."motivational_messages" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."orders" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."payment_gateway_settings" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."payment_settings" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."payments" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."promo_codes" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."referrals" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."reminder_rules" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."settings" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."sms_settings" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."sms_templates" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."staff_attendance" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."store_products" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."trainer_assignments" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."trainer_attendance" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."trainers" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."transactions" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."webhook_logs" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."website_content" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."whatsapp_settings" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."whatsapp_templates" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."workout_days" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."workout_plans" ENABLE ROW LEVEL SECURITY;




ALTER PUBLICATION "supabase_realtime" OWNER TO "postgres";






ALTER PUBLICATION "supabase_realtime" ADD TABLE ONLY "public"."attendance_settings";



ALTER PUBLICATION "supabase_realtime" ADD TABLE ONLY "public"."automation_rules";



ALTER PUBLICATION "supabase_realtime" ADD TABLE ONLY "public"."branches";



ALTER PUBLICATION "supabase_realtime" ADD TABLE ONLY "public"."class_bookings";



ALTER PUBLICATION "supabase_realtime" ADD TABLE ONLY "public"."company_settings";



ALTER PUBLICATION "supabase_realtime" ADD TABLE ONLY "public"."email_settings";



ALTER PUBLICATION "supabase_realtime" ADD TABLE ONLY "public"."email_templates";



ALTER PUBLICATION "supabase_realtime" ADD TABLE ONLY "public"."integration_statuses";



ALTER PUBLICATION "supabase_realtime" ADD TABLE ONLY "public"."invoices";



ALTER PUBLICATION "supabase_realtime" ADD TABLE ONLY "public"."member_progress";



ALTER PUBLICATION "supabase_realtime" ADD TABLE ONLY "public"."reminder_rules";



ALTER PUBLICATION "supabase_realtime" ADD TABLE ONLY "public"."sms_settings";



ALTER PUBLICATION "supabase_realtime" ADD TABLE ONLY "public"."sms_templates";



ALTER PUBLICATION "supabase_realtime" ADD TABLE ONLY "public"."staff_attendance";



ALTER PUBLICATION "supabase_realtime" ADD TABLE ONLY "public"."whatsapp_settings";



ALTER PUBLICATION "supabase_realtime" ADD TABLE ONLY "public"."whatsapp_templates";



GRANT USAGE ON SCHEMA "public" TO "postgres";
GRANT USAGE ON SCHEMA "public" TO "anon";
GRANT USAGE ON SCHEMA "public" TO "authenticated";
GRANT USAGE ON SCHEMA "public" TO "service_role";











































































































































































GRANT ALL ON FUNCTION "public"."can_book_class"("user_uuid" "uuid") TO "anon";
GRANT ALL ON FUNCTION "public"."can_book_class"("user_uuid" "uuid") TO "authenticated";
GRANT ALL ON FUNCTION "public"."can_book_class"("user_uuid" "uuid") TO "service_role";



GRANT ALL ON FUNCTION "public"."get_all_website_content"() TO "anon";
GRANT ALL ON FUNCTION "public"."get_all_website_content"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_all_website_content"() TO "service_role";



GRANT ALL ON FUNCTION "public"."get_attendance_trend"("branch_id_param" "uuid", "start_date" "date", "end_date" "date") TO "anon";
GRANT ALL ON FUNCTION "public"."get_attendance_trend"("branch_id_param" "uuid", "start_date" "date", "end_date" "date") TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_attendance_trend"("branch_id_param" "uuid", "start_date" "date", "end_date" "date") TO "service_role";



GRANT ALL ON FUNCTION "public"."get_membership_trend"("branch_id_param" "uuid", "start_date" "date", "end_date" "date") TO "anon";
GRANT ALL ON FUNCTION "public"."get_membership_trend"("branch_id_param" "uuid", "start_date" "date", "end_date" "date") TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_membership_trend"("branch_id_param" "uuid", "start_date" "date", "end_date" "date") TO "service_role";



GRANT ALL ON FUNCTION "public"."get_revenue_breakdown"("branch_id_param" "uuid", "start_date" "date", "end_date" "date") TO "anon";
GRANT ALL ON FUNCTION "public"."get_revenue_breakdown"("branch_id_param" "uuid", "start_date" "date", "end_date" "date") TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_revenue_breakdown"("branch_id_param" "uuid", "start_date" "date", "end_date" "date") TO "service_role";



GRANT ALL ON FUNCTION "public"."get_user_role"() TO "anon";
GRANT ALL ON FUNCTION "public"."get_user_role"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_user_role"() TO "service_role";



GRANT ALL ON FUNCTION "public"."get_user_role"("user_id" "uuid") TO "anon";
GRANT ALL ON FUNCTION "public"."get_user_role"("user_id" "uuid") TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_user_role"("user_id" "uuid") TO "service_role";



GRANT ALL ON TABLE "public"."website_content" TO "anon";
GRANT ALL ON TABLE "public"."website_content" TO "authenticated";
GRANT ALL ON TABLE "public"."website_content" TO "service_role";



GRANT ALL ON FUNCTION "public"."get_website_section_content"("section_name" "text") TO "anon";
GRANT ALL ON FUNCTION "public"."get_website_section_content"("section_name" "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_website_section_content"("section_name" "text") TO "service_role";



GRANT ALL ON FUNCTION "public"."handle_new_membership"() TO "anon";
GRANT ALL ON FUNCTION "public"."handle_new_membership"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."handle_new_membership"() TO "service_role";



GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "anon";
GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "service_role";



GRANT ALL ON FUNCTION "public"."is_admin"() TO "anon";
GRANT ALL ON FUNCTION "public"."is_admin"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."is_admin"() TO "service_role";



GRANT ALL ON FUNCTION "public"."trainer_is_assigned_to_member"("trainer_uuid" "uuid", "member_uuid" "uuid") TO "anon";
GRANT ALL ON FUNCTION "public"."trainer_is_assigned_to_member"("trainer_uuid" "uuid", "member_uuid" "uuid") TO "authenticated";
GRANT ALL ON FUNCTION "public"."trainer_is_assigned_to_member"("trainer_uuid" "uuid", "member_uuid" "uuid") TO "service_role";



GRANT ALL ON FUNCTION "public"."update_payment_settings_timestamp"() TO "anon";
GRANT ALL ON FUNCTION "public"."update_payment_settings_timestamp"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."update_payment_settings_timestamp"() TO "service_role";



GRANT ALL ON FUNCTION "public"."update_updated_at_column"() TO "anon";
GRANT ALL ON FUNCTION "public"."update_updated_at_column"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."update_updated_at_column"() TO "service_role";



GRANT ALL ON FUNCTION "public"."update_updated_at_column_for_website_content"() TO "anon";
GRANT ALL ON FUNCTION "public"."update_updated_at_column_for_website_content"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."update_updated_at_column_for_website_content"() TO "service_role";



GRANT ALL ON FUNCTION "public"."upsert_settings_batch"("settings_array" "jsonb") TO "anon";
GRANT ALL ON FUNCTION "public"."upsert_settings_batch"("settings_array" "jsonb") TO "authenticated";
GRANT ALL ON FUNCTION "public"."upsert_settings_batch"("settings_array" "jsonb") TO "service_role";



GRANT ALL ON FUNCTION "public"."user_belongs_to_branch"("branch_id" "uuid") TO "anon";
GRANT ALL ON FUNCTION "public"."user_belongs_to_branch"("branch_id" "uuid") TO "authenticated";
GRANT ALL ON FUNCTION "public"."user_belongs_to_branch"("branch_id" "uuid") TO "service_role";



GRANT ALL ON FUNCTION "public"."user_has_active_membership"("user_uuid" "uuid") TO "anon";
GRANT ALL ON FUNCTION "public"."user_has_active_membership"("user_uuid" "uuid") TO "authenticated";
GRANT ALL ON FUNCTION "public"."user_has_active_membership"("user_uuid" "uuid") TO "service_role";



GRANT ALL ON FUNCTION "public"."user_has_branch_access"("branch_id" "uuid") TO "anon";
GRANT ALL ON FUNCTION "public"."user_has_branch_access"("branch_id" "uuid") TO "authenticated";
GRANT ALL ON FUNCTION "public"."user_has_branch_access"("branch_id" "uuid") TO "service_role";


















GRANT ALL ON TABLE "public"."income_records" TO "anon";
GRANT ALL ON TABLE "public"."income_records" TO "authenticated";
GRANT ALL ON TABLE "public"."income_records" TO "service_role";



GRANT ALL ON TABLE "public"."member_attendance" TO "anon";
GRANT ALL ON TABLE "public"."member_attendance" TO "authenticated";
GRANT ALL ON TABLE "public"."member_attendance" TO "service_role";



GRANT ALL ON TABLE "public"."member_memberships" TO "anon";
GRANT ALL ON TABLE "public"."member_memberships" TO "authenticated";
GRANT ALL ON TABLE "public"."member_memberships" TO "service_role";



GRANT ALL ON TABLE "public"."members" TO "anon";
GRANT ALL ON TABLE "public"."members" TO "authenticated";
GRANT ALL ON TABLE "public"."members" TO "service_role";



GRANT ALL ON TABLE "public"."analytics_dashboard_stats" TO "anon";
GRANT ALL ON TABLE "public"."analytics_dashboard_stats" TO "authenticated";
GRANT ALL ON TABLE "public"."analytics_dashboard_stats" TO "service_role";



GRANT ALL ON TABLE "public"."announcements" TO "anon";
GRANT ALL ON TABLE "public"."announcements" TO "authenticated";
GRANT ALL ON TABLE "public"."announcements" TO "service_role";



GRANT ALL ON TABLE "public"."attendance_settings" TO "anon";
GRANT ALL ON TABLE "public"."attendance_settings" TO "authenticated";
GRANT ALL ON TABLE "public"."attendance_settings" TO "service_role";



GRANT ALL ON TABLE "public"."automation_rules" TO "anon";
GRANT ALL ON TABLE "public"."automation_rules" TO "authenticated";
GRANT ALL ON TABLE "public"."automation_rules" TO "service_role";



GRANT ALL ON TABLE "public"."backup_logs" TO "anon";
GRANT ALL ON TABLE "public"."backup_logs" TO "authenticated";
GRANT ALL ON TABLE "public"."backup_logs" TO "service_role";



GRANT ALL ON TABLE "public"."body_measurements" TO "anon";
GRANT ALL ON TABLE "public"."body_measurements" TO "authenticated";
GRANT ALL ON TABLE "public"."body_measurements" TO "service_role";



GRANT ALL ON TABLE "public"."branches" TO "anon";
GRANT ALL ON TABLE "public"."branches" TO "authenticated";
GRANT ALL ON TABLE "public"."branches" TO "service_role";



GRANT ALL ON TABLE "public"."class_bookings" TO "anon";
GRANT ALL ON TABLE "public"."class_bookings" TO "authenticated";
GRANT ALL ON TABLE "public"."class_bookings" TO "service_role";



GRANT ALL ON TABLE "public"."class_schedules" TO "anon";
GRANT ALL ON TABLE "public"."class_schedules" TO "authenticated";
GRANT ALL ON TABLE "public"."class_schedules" TO "service_role";



GRANT ALL ON TABLE "public"."class_performance" TO "anon";
GRANT ALL ON TABLE "public"."class_performance" TO "authenticated";
GRANT ALL ON TABLE "public"."class_performance" TO "service_role";



GRANT ALL ON TABLE "public"."class_types" TO "anon";
GRANT ALL ON TABLE "public"."class_types" TO "authenticated";
GRANT ALL ON TABLE "public"."class_types" TO "service_role";



GRANT ALL ON TABLE "public"."classes" TO "anon";
GRANT ALL ON TABLE "public"."classes" TO "authenticated";
GRANT ALL ON TABLE "public"."classes" TO "service_role";



GRANT ALL ON TABLE "public"."communication_tasks" TO "anon";
GRANT ALL ON TABLE "public"."communication_tasks" TO "authenticated";
GRANT ALL ON TABLE "public"."communication_tasks" TO "service_role";



GRANT ALL ON TABLE "public"."company_settings" TO "anon";
GRANT ALL ON TABLE "public"."company_settings" TO "authenticated";
GRANT ALL ON TABLE "public"."company_settings" TO "service_role";



GRANT ALL ON TABLE "public"."diet_plans" TO "anon";
GRANT ALL ON TABLE "public"."diet_plans" TO "authenticated";
GRANT ALL ON TABLE "public"."diet_plans" TO "service_role";



GRANT ALL ON TABLE "public"."email_settings" TO "anon";
GRANT ALL ON TABLE "public"."email_settings" TO "authenticated";
GRANT ALL ON TABLE "public"."email_settings" TO "service_role";



GRANT ALL ON TABLE "public"."email_templates" TO "anon";
GRANT ALL ON TABLE "public"."email_templates" TO "authenticated";
GRANT ALL ON TABLE "public"."email_templates" TO "service_role";



GRANT ALL ON TABLE "public"."essl_device_settings" TO "anon";
GRANT ALL ON TABLE "public"."essl_device_settings" TO "authenticated";
GRANT ALL ON TABLE "public"."essl_device_settings" TO "service_role";



GRANT ALL ON TABLE "public"."exercises" TO "anon";
GRANT ALL ON TABLE "public"."exercises" TO "authenticated";
GRANT ALL ON TABLE "public"."exercises" TO "service_role";



GRANT ALL ON TABLE "public"."expense_categories" TO "anon";
GRANT ALL ON TABLE "public"."expense_categories" TO "authenticated";
GRANT ALL ON TABLE "public"."expense_categories" TO "service_role";



GRANT ALL ON TABLE "public"."expense_records" TO "anon";
GRANT ALL ON TABLE "public"."expense_records" TO "authenticated";
GRANT ALL ON TABLE "public"."expense_records" TO "service_role";



GRANT ALL ON TABLE "public"."feedback" TO "anon";
GRANT ALL ON TABLE "public"."feedback" TO "authenticated";
GRANT ALL ON TABLE "public"."feedback" TO "service_role";



GRANT ALL ON TABLE "public"."fitness_progress" TO "anon";
GRANT ALL ON TABLE "public"."fitness_progress" TO "authenticated";
GRANT ALL ON TABLE "public"."fitness_progress" TO "service_role";



GRANT ALL ON TABLE "public"."follow_up_history" TO "anon";
GRANT ALL ON TABLE "public"."follow_up_history" TO "authenticated";
GRANT ALL ON TABLE "public"."follow_up_history" TO "service_role";



GRANT ALL ON TABLE "public"."follow_up_templates" TO "anon";
GRANT ALL ON TABLE "public"."follow_up_templates" TO "authenticated";
GRANT ALL ON TABLE "public"."follow_up_templates" TO "service_role";



GRANT ALL ON TABLE "public"."global_settings" TO "anon";
GRANT ALL ON TABLE "public"."global_settings" TO "authenticated";
GRANT ALL ON TABLE "public"."global_settings" TO "service_role";



GRANT ALL ON TABLE "public"."hikvision_api_settings" TO "anon";
GRANT ALL ON TABLE "public"."hikvision_api_settings" TO "authenticated";
GRANT ALL ON TABLE "public"."hikvision_api_settings" TO "service_role";



GRANT ALL ON TABLE "public"."income_categories" TO "anon";
GRANT ALL ON TABLE "public"."income_categories" TO "authenticated";
GRANT ALL ON TABLE "public"."income_categories" TO "service_role";



GRANT ALL ON TABLE "public"."integration_statuses" TO "anon";
GRANT ALL ON TABLE "public"."integration_statuses" TO "authenticated";
GRANT ALL ON TABLE "public"."integration_statuses" TO "service_role";



GRANT ALL ON TABLE "public"."inventory_items" TO "anon";
GRANT ALL ON TABLE "public"."inventory_items" TO "authenticated";
GRANT ALL ON TABLE "public"."inventory_items" TO "service_role";



GRANT ALL ON TABLE "public"."inventory_alerts" TO "anon";
GRANT ALL ON TABLE "public"."inventory_alerts" TO "authenticated";
GRANT ALL ON TABLE "public"."inventory_alerts" TO "service_role";



GRANT ALL ON TABLE "public"."invoices" TO "anon";
GRANT ALL ON TABLE "public"."invoices" TO "authenticated";
GRANT ALL ON TABLE "public"."invoices" TO "service_role";



GRANT ALL ON TABLE "public"."leads" TO "anon";
GRANT ALL ON TABLE "public"."leads" TO "authenticated";
GRANT ALL ON TABLE "public"."leads" TO "service_role";



GRANT ALL ON TABLE "public"."meal_items" TO "anon";
GRANT ALL ON TABLE "public"."meal_items" TO "authenticated";
GRANT ALL ON TABLE "public"."meal_items" TO "service_role";



GRANT ALL ON TABLE "public"."meal_plans" TO "anon";
GRANT ALL ON TABLE "public"."meal_plans" TO "authenticated";
GRANT ALL ON TABLE "public"."meal_plans" TO "service_role";



GRANT ALL ON TABLE "public"."measurements" TO "anon";
GRANT ALL ON TABLE "public"."measurements" TO "authenticated";
GRANT ALL ON TABLE "public"."measurements" TO "service_role";



GRANT ALL ON TABLE "public"."member_attendance_heatmap" TO "anon";
GRANT ALL ON TABLE "public"."member_attendance_heatmap" TO "authenticated";
GRANT ALL ON TABLE "public"."member_attendance_heatmap" TO "service_role";



GRANT ALL ON TABLE "public"."member_churn_risk" TO "anon";
GRANT ALL ON TABLE "public"."member_churn_risk" TO "authenticated";
GRANT ALL ON TABLE "public"."member_churn_risk" TO "service_role";



GRANT ALL ON TABLE "public"."member_progress" TO "anon";
GRANT ALL ON TABLE "public"."member_progress" TO "authenticated";
GRANT ALL ON TABLE "public"."member_progress" TO "service_role";



GRANT ALL ON TABLE "public"."membership_subscriptions" TO "anon";
GRANT ALL ON TABLE "public"."membership_subscriptions" TO "authenticated";
GRANT ALL ON TABLE "public"."membership_subscriptions" TO "service_role";



GRANT ALL ON TABLE "public"."memberships" TO "anon";
GRANT ALL ON TABLE "public"."memberships" TO "authenticated";
GRANT ALL ON TABLE "public"."memberships" TO "service_role";



GRANT ALL ON TABLE "public"."motivational_messages" TO "anon";
GRANT ALL ON TABLE "public"."motivational_messages" TO "authenticated";
GRANT ALL ON TABLE "public"."motivational_messages" TO "service_role";



GRANT ALL ON TABLE "public"."notifications" TO "anon";
GRANT ALL ON TABLE "public"."notifications" TO "authenticated";
GRANT ALL ON TABLE "public"."notifications" TO "service_role";



GRANT ALL ON TABLE "public"."orders" TO "anon";
GRANT ALL ON TABLE "public"."orders" TO "authenticated";
GRANT ALL ON TABLE "public"."orders" TO "service_role";



GRANT ALL ON TABLE "public"."payment_gateway_settings" TO "anon";
GRANT ALL ON TABLE "public"."payment_gateway_settings" TO "authenticated";
GRANT ALL ON TABLE "public"."payment_gateway_settings" TO "service_role";



GRANT ALL ON TABLE "public"."payment_settings" TO "anon";
GRANT ALL ON TABLE "public"."payment_settings" TO "authenticated";
GRANT ALL ON TABLE "public"."payment_settings" TO "service_role";



GRANT ALL ON TABLE "public"."payments" TO "anon";
GRANT ALL ON TABLE "public"."payments" TO "authenticated";
GRANT ALL ON TABLE "public"."payments" TO "service_role";



GRANT ALL ON TABLE "public"."profiles" TO "anon";
GRANT ALL ON TABLE "public"."profiles" TO "authenticated";
GRANT ALL ON TABLE "public"."profiles" TO "service_role";



GRANT ALL ON TABLE "public"."promo_codes" TO "anon";
GRANT ALL ON TABLE "public"."promo_codes" TO "authenticated";
GRANT ALL ON TABLE "public"."promo_codes" TO "service_role";



GRANT ALL ON TABLE "public"."referrals" TO "anon";
GRANT ALL ON TABLE "public"."referrals" TO "authenticated";
GRANT ALL ON TABLE "public"."referrals" TO "service_role";



GRANT ALL ON TABLE "public"."reminder_rules" TO "anon";
GRANT ALL ON TABLE "public"."reminder_rules" TO "authenticated";
GRANT ALL ON TABLE "public"."reminder_rules" TO "service_role";



GRANT ALL ON TABLE "public"."settings" TO "anon";
GRANT ALL ON TABLE "public"."settings" TO "authenticated";
GRANT ALL ON TABLE "public"."settings" TO "service_role";



GRANT ALL ON TABLE "public"."sms_settings" TO "anon";
GRANT ALL ON TABLE "public"."sms_settings" TO "authenticated";
GRANT ALL ON TABLE "public"."sms_settings" TO "service_role";



GRANT ALL ON TABLE "public"."sms_templates" TO "anon";
GRANT ALL ON TABLE "public"."sms_templates" TO "authenticated";
GRANT ALL ON TABLE "public"."sms_templates" TO "service_role";



GRANT ALL ON TABLE "public"."staff_attendance" TO "anon";
GRANT ALL ON TABLE "public"."staff_attendance" TO "authenticated";
GRANT ALL ON TABLE "public"."staff_attendance" TO "service_role";



GRANT ALL ON TABLE "public"."store_products" TO "anon";
GRANT ALL ON TABLE "public"."store_products" TO "authenticated";
GRANT ALL ON TABLE "public"."store_products" TO "service_role";



GRANT ALL ON TABLE "public"."trainer_assignments" TO "anon";
GRANT ALL ON TABLE "public"."trainer_assignments" TO "authenticated";
GRANT ALL ON TABLE "public"."trainer_assignments" TO "service_role";



GRANT ALL ON TABLE "public"."trainer_attendance" TO "anon";
GRANT ALL ON TABLE "public"."trainer_attendance" TO "authenticated";
GRANT ALL ON TABLE "public"."trainer_attendance" TO "service_role";



GRANT ALL ON TABLE "public"."trainer_utilization" TO "anon";
GRANT ALL ON TABLE "public"."trainer_utilization" TO "authenticated";
GRANT ALL ON TABLE "public"."trainer_utilization" TO "service_role";



GRANT ALL ON TABLE "public"."trainers" TO "anon";
GRANT ALL ON TABLE "public"."trainers" TO "authenticated";
GRANT ALL ON TABLE "public"."trainers" TO "service_role";



GRANT ALL ON TABLE "public"."transactions" TO "anon";
GRANT ALL ON TABLE "public"."transactions" TO "authenticated";
GRANT ALL ON TABLE "public"."transactions" TO "service_role";



GRANT ALL ON TABLE "public"."webhook_logs" TO "anon";
GRANT ALL ON TABLE "public"."webhook_logs" TO "authenticated";
GRANT ALL ON TABLE "public"."webhook_logs" TO "service_role";



GRANT ALL ON TABLE "public"."whatsapp_settings" TO "anon";
GRANT ALL ON TABLE "public"."whatsapp_settings" TO "authenticated";
GRANT ALL ON TABLE "public"."whatsapp_settings" TO "service_role";



GRANT ALL ON TABLE "public"."whatsapp_templates" TO "anon";
GRANT ALL ON TABLE "public"."whatsapp_templates" TO "authenticated";
GRANT ALL ON TABLE "public"."whatsapp_templates" TO "service_role";



GRANT ALL ON TABLE "public"."workout_days" TO "anon";
GRANT ALL ON TABLE "public"."workout_days" TO "authenticated";
GRANT ALL ON TABLE "public"."workout_days" TO "service_role";



GRANT ALL ON TABLE "public"."workout_plans" TO "anon";
GRANT ALL ON TABLE "public"."workout_plans" TO "authenticated";
GRANT ALL ON TABLE "public"."workout_plans" TO "service_role";









ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "service_role";






























RESET ALL;
