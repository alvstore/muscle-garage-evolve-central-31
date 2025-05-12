-- Migration to add 'scheduled' to class_status enum
-- This needs to be run on your Supabase database

-- Step 1: Create a new type with all the values we want
CREATE TYPE "public"."class_status_new" AS ENUM (
    'active',
    'cancelled',
    'completed',
    'scheduled'
);

-- Step 2: Update all tables that use the old type to use the new one
ALTER TABLE "public"."classes" 
  ALTER COLUMN "status" TYPE "public"."class_status_new" 
  USING ("status"::text::"public"."class_status_new");

-- Step 3: Drop the old type
DROP TYPE "public"."class_status";

-- Step 4: Rename the new type to the old name
ALTER TYPE "public"."class_status_new" RENAME TO "class_status";

-- Step 5: Set the owner of the type
ALTER TYPE "public"."class_status" OWNER TO "postgres";
