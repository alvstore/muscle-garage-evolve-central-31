export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      branches: {
        Row: {
          address: string | null
          city: string | null
          country: string | null
          created_at: string | null
          email: string | null
          id: string
          is_active: boolean | null
          manager_id: string | null
          name: string
          phone: string | null
          state: string | null
          updated_at: string | null
        }
        Insert: {
          address?: string | null
          city?: string | null
          country?: string | null
          created_at?: string | null
          email?: string | null
          id?: string
          is_active?: boolean | null
          manager_id?: string | null
          name: string
          phone?: string | null
          state?: string | null
          updated_at?: string | null
        }
        Update: {
          address?: string | null
          city?: string | null
          country?: string | null
          created_at?: string | null
          email?: string | null
          id?: string
          is_active?: boolean | null
          manager_id?: string | null
          name?: string
          phone?: string | null
          state?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      class_bookings: {
        Row: {
          attended: boolean | null
          class_id: string | null
          created_at: string | null
          id: string
          member_id: string | null
          status: string | null
          updated_at: string | null
        }
        Insert: {
          attended?: boolean | null
          class_id?: string | null
          created_at?: string | null
          id?: string
          member_id?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          attended?: boolean | null
          class_id?: string | null
          created_at?: string | null
          id?: string
          member_id?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "class_bookings_class_id_fkey"
            columns: ["class_id"]
            isOneToOne: false
            referencedRelation: "classes"
            referencedColumns: ["id"]
          },
        ]
      }
      class_schedules: {
        Row: {
          branch_id: string | null
          capacity: number
          created_at: string | null
          description: string | null
          difficulty: string
          end_time: string
          enrolled: number | null
          id: string
          location: string
          name: string
          recurring: boolean | null
          recurring_pattern: string | null
          start_time: string
          status: string | null
          trainer_id: string
          type: string
          updated_at: string | null
        }
        Insert: {
          branch_id?: string | null
          capacity: number
          created_at?: string | null
          description?: string | null
          difficulty: string
          end_time: string
          enrolled?: number | null
          id?: string
          location: string
          name: string
          recurring?: boolean | null
          recurring_pattern?: string | null
          start_time: string
          status?: string | null
          trainer_id: string
          type: string
          updated_at?: string | null
        }
        Update: {
          branch_id?: string | null
          capacity?: number
          created_at?: string | null
          description?: string | null
          difficulty?: string
          end_time?: string
          enrolled?: number | null
          id?: string
          location?: string
          name?: string
          recurring?: boolean | null
          recurring_pattern?: string | null
          start_time?: string
          status?: string | null
          trainer_id?: string
          type?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "class_schedules_branch_id_fkey"
            columns: ["branch_id"]
            isOneToOne: false
            referencedRelation: "branches"
            referencedColumns: ["id"]
          },
        ]
      }
      classes: {
        Row: {
          branch_id: string | null
          capacity: number
          created_at: string | null
          description: string | null
          end_time: string
          id: string
          is_active: boolean | null
          name: string
          recurrence: string | null
          start_time: string
          trainer_id: string | null
          updated_at: string | null
        }
        Insert: {
          branch_id?: string | null
          capacity: number
          created_at?: string | null
          description?: string | null
          end_time: string
          id?: string
          is_active?: boolean | null
          name: string
          recurrence?: string | null
          start_time: string
          trainer_id?: string | null
          updated_at?: string | null
        }
        Update: {
          branch_id?: string | null
          capacity?: number
          created_at?: string | null
          description?: string | null
          end_time?: string
          id?: string
          is_active?: boolean | null
          name?: string
          recurrence?: string | null
          start_time?: string
          trainer_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "classes_branch_id_fkey"
            columns: ["branch_id"]
            isOneToOne: false
            referencedRelation: "branches"
            referencedColumns: ["id"]
          },
        ]
      }
      diet_plans: {
        Row: {
          created_at: string | null
          daily_calories: number | null
          description: string | null
          diet_type: string | null
          goal: string | null
          id: string
          is_custom: boolean | null
          is_global: boolean | null
          member_id: string | null
          name: string | null
          notes: string | null
          trainer_id: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          daily_calories?: number | null
          description?: string | null
          diet_type?: string | null
          goal?: string | null
          id?: string
          is_custom?: boolean | null
          is_global?: boolean | null
          member_id?: string | null
          name?: string | null
          notes?: string | null
          trainer_id: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          daily_calories?: number | null
          description?: string | null
          diet_type?: string | null
          goal?: string | null
          id?: string
          is_custom?: boolean | null
          is_global?: boolean | null
          member_id?: string | null
          name?: string | null
          notes?: string | null
          trainer_id?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      exercises: {
        Row: {
          created_at: string | null
          id: string
          media_url: string | null
          muscle_group_tag: string | null
          name: string
          notes: string | null
          reps: number
          rest: number | null
          rest_time: string | null
          sets: number
          updated_at: string | null
          weight: number | null
          workout_day_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          media_url?: string | null
          muscle_group_tag?: string | null
          name: string
          notes?: string | null
          reps: number
          rest?: number | null
          rest_time?: string | null
          sets: number
          updated_at?: string | null
          weight?: number | null
          workout_day_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          media_url?: string | null
          muscle_group_tag?: string | null
          name?: string
          notes?: string | null
          reps?: number
          rest?: number | null
          rest_time?: string | null
          sets?: number
          updated_at?: string | null
          weight?: number | null
          workout_day_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "exercises_workout_day_id_fkey"
            columns: ["workout_day_id"]
            isOneToOne: false
            referencedRelation: "workout_days"
            referencedColumns: ["id"]
          },
        ]
      }
      expense_categories: {
        Row: {
          branch_id: string | null
          created_at: string | null
          description: string | null
          id: string
          is_active: boolean | null
          name: string
          updated_at: string | null
        }
        Insert: {
          branch_id?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          updated_at?: string | null
        }
        Update: {
          branch_id?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "expense_categories_branch_id_fkey"
            columns: ["branch_id"]
            isOneToOne: false
            referencedRelation: "branches"
            referencedColumns: ["id"]
          },
        ]
      }
      global_settings: {
        Row: {
          created_at: string | null
          currency: string
          currency_symbol: string
          date_format: string | null
          email_api_key: string | null
          email_provider: string | null
          id: string
          razorpay_key_id: string | null
          razorpay_key_secret: string | null
          sms_api_key: string | null
          sms_provider: string | null
          time_format: string | null
          updated_at: string | null
          whatsapp_api_key: string | null
          whatsapp_provider: string | null
        }
        Insert: {
          created_at?: string | null
          currency?: string
          currency_symbol?: string
          date_format?: string | null
          email_api_key?: string | null
          email_provider?: string | null
          id?: string
          razorpay_key_id?: string | null
          razorpay_key_secret?: string | null
          sms_api_key?: string | null
          sms_provider?: string | null
          time_format?: string | null
          updated_at?: string | null
          whatsapp_api_key?: string | null
          whatsapp_provider?: string | null
        }
        Update: {
          created_at?: string | null
          currency?: string
          currency_symbol?: string
          date_format?: string | null
          email_api_key?: string | null
          email_provider?: string | null
          id?: string
          razorpay_key_id?: string | null
          razorpay_key_secret?: string | null
          sms_api_key?: string | null
          sms_provider?: string | null
          time_format?: string | null
          updated_at?: string | null
          whatsapp_api_key?: string | null
          whatsapp_provider?: string | null
        }
        Relationships: []
      }
      income_categories: {
        Row: {
          branch_id: string | null
          created_at: string | null
          description: string | null
          id: string
          is_active: boolean | null
          name: string
          updated_at: string | null
        }
        Insert: {
          branch_id?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          updated_at?: string | null
        }
        Update: {
          branch_id?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "income_categories_branch_id_fkey"
            columns: ["branch_id"]
            isOneToOne: false
            referencedRelation: "branches"
            referencedColumns: ["id"]
          },
        ]
      }
      meal_items: {
        Row: {
          calories: number | null
          carbs: number | null
          created_at: string | null
          fats: number | null
          id: string
          meal_plan_id: string
          name: string
          protein: number | null
          updated_at: string | null
        }
        Insert: {
          calories?: number | null
          carbs?: number | null
          created_at?: string | null
          fats?: number | null
          id?: string
          meal_plan_id: string
          name: string
          protein?: number | null
          updated_at?: string | null
        }
        Update: {
          calories?: number | null
          carbs?: number | null
          created_at?: string | null
          fats?: number | null
          id?: string
          meal_plan_id?: string
          name?: string
          protein?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "meal_items_meal_plan_id_fkey"
            columns: ["meal_plan_id"]
            isOneToOne: false
            referencedRelation: "meal_plans"
            referencedColumns: ["id"]
          },
        ]
      }
      meal_plans: {
        Row: {
          created_at: string | null
          diet_plan_id: string
          id: string
          name: string
          time: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          diet_plan_id: string
          id?: string
          name: string
          time?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          diet_plan_id?: string
          id?: string
          name?: string
          time?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "meal_plans_diet_plan_id_fkey"
            columns: ["diet_plan_id"]
            isOneToOne: false
            referencedRelation: "diet_plans"
            referencedColumns: ["id"]
          },
        ]
      }
      measurements: {
        Row: {
          arms: number | null
          bmi: number | null
          body_fat_percentage: number | null
          branch_id: string | null
          chest: number | null
          created_at: string | null
          height: number | null
          hips: number | null
          id: string
          measurement_date: string
          member_id: string | null
          notes: string | null
          recorded_by: string | null
          thighs: number | null
          updated_at: string | null
          waist: number | null
          weight: number | null
        }
        Insert: {
          arms?: number | null
          bmi?: number | null
          body_fat_percentage?: number | null
          branch_id?: string | null
          chest?: number | null
          created_at?: string | null
          height?: number | null
          hips?: number | null
          id?: string
          measurement_date?: string
          member_id?: string | null
          notes?: string | null
          recorded_by?: string | null
          thighs?: number | null
          updated_at?: string | null
          waist?: number | null
          weight?: number | null
        }
        Update: {
          arms?: number | null
          bmi?: number | null
          body_fat_percentage?: number | null
          branch_id?: string | null
          chest?: number | null
          created_at?: string | null
          height?: number | null
          hips?: number | null
          id?: string
          measurement_date?: string
          member_id?: string | null
          notes?: string | null
          recorded_by?: string | null
          thighs?: number | null
          updated_at?: string | null
          waist?: number | null
          weight?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "measurements_branch_id_fkey"
            columns: ["branch_id"]
            isOneToOne: false
            referencedRelation: "branches"
            referencedColumns: ["id"]
          },
        ]
      }
      member_attendance: {
        Row: {
          access_method: string | null
          branch_id: string | null
          check_in: string
          check_out: string | null
          created_at: string | null
          device_id: string | null
          id: string
          member_id: string | null
          recorded_by: string | null
          updated_at: string | null
        }
        Insert: {
          access_method?: string | null
          branch_id?: string | null
          check_in?: string
          check_out?: string | null
          created_at?: string | null
          device_id?: string | null
          id?: string
          member_id?: string | null
          recorded_by?: string | null
          updated_at?: string | null
        }
        Update: {
          access_method?: string | null
          branch_id?: string | null
          check_in?: string
          check_out?: string | null
          created_at?: string | null
          device_id?: string | null
          id?: string
          member_id?: string | null
          recorded_by?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "member_attendance_branch_id_fkey"
            columns: ["branch_id"]
            isOneToOne: false
            referencedRelation: "branches"
            referencedColumns: ["id"]
          },
        ]
      }
      member_memberships: {
        Row: {
          amount_paid: number | null
          branch_id: string | null
          created_at: string | null
          end_date: string
          id: string
          member_id: string | null
          membership_id: string | null
          payment_status: string
          start_date: string
          status: string
          total_amount: number
          trainer_id: string | null
          updated_at: string | null
        }
        Insert: {
          amount_paid?: number | null
          branch_id?: string | null
          created_at?: string | null
          end_date: string
          id?: string
          member_id?: string | null
          membership_id?: string | null
          payment_status?: string
          start_date: string
          status?: string
          total_amount: number
          trainer_id?: string | null
          updated_at?: string | null
        }
        Update: {
          amount_paid?: number | null
          branch_id?: string | null
          created_at?: string | null
          end_date?: string
          id?: string
          member_id?: string | null
          membership_id?: string | null
          payment_status?: string
          start_date?: string
          status?: string
          total_amount?: number
          trainer_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "member_memberships_branch_id_fkey"
            columns: ["branch_id"]
            isOneToOne: false
            referencedRelation: "branches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "member_memberships_membership_id_fkey"
            columns: ["membership_id"]
            isOneToOne: false
            referencedRelation: "memberships"
            referencedColumns: ["id"]
          },
        ]
      }
      member_progress: {
        Row: {
          bmi: number | null
          created_at: string | null
          diet_adherence_percent: number | null
          fat_percent: number | null
          id: string
          last_updated: string | null
          member_id: string
          muscle_mass: number | null
          trainer_id: string
          updated_at: string | null
          weight: number | null
          workout_completion_percent: number | null
        }
        Insert: {
          bmi?: number | null
          created_at?: string | null
          diet_adherence_percent?: number | null
          fat_percent?: number | null
          id?: string
          last_updated?: string | null
          member_id: string
          muscle_mass?: number | null
          trainer_id: string
          updated_at?: string | null
          weight?: number | null
          workout_completion_percent?: number | null
        }
        Update: {
          bmi?: number | null
          created_at?: string | null
          diet_adherence_percent?: number | null
          fat_percent?: number | null
          id?: string
          last_updated?: string | null
          member_id?: string
          muscle_mass?: number | null
          trainer_id?: string
          updated_at?: string | null
          weight?: number | null
          workout_completion_percent?: number | null
        }
        Relationships: []
      }
      memberships: {
        Row: {
          created_at: string | null
          description: string | null
          duration_days: number
          features: Json | null
          id: string
          is_active: boolean | null
          name: string
          price: number
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          duration_days: number
          features?: Json | null
          id?: string
          is_active?: boolean | null
          name: string
          price: number
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          duration_days?: number
          features?: Json | null
          id?: string
          is_active?: boolean | null
          name?: string
          price?: number
          updated_at?: string | null
        }
        Relationships: []
      }
      payment_settings: {
        Row: {
          config: Json
          created_at: string | null
          gateway_name: string
          id: string
          is_enabled: boolean | null
          updated_at: string | null
        }
        Insert: {
          config: Json
          created_at?: string | null
          gateway_name: string
          id?: string
          is_enabled?: boolean | null
          updated_at?: string | null
        }
        Update: {
          config?: Json
          created_at?: string | null
          gateway_name?: string
          id?: string
          is_enabled?: boolean | null
          updated_at?: string | null
        }
        Relationships: []
      }
      payments: {
        Row: {
          amount: number
          branch_id: string | null
          created_at: string | null
          id: string
          member_id: string | null
          membership_id: string | null
          notes: string | null
          payment_date: string | null
          payment_method: string
          razorpay_order_id: string | null
          razorpay_payment_id: string | null
          staff_id: string | null
          status: string
          transaction_id: string | null
          updated_at: string | null
        }
        Insert: {
          amount: number
          branch_id?: string | null
          created_at?: string | null
          id?: string
          member_id?: string | null
          membership_id?: string | null
          notes?: string | null
          payment_date?: string | null
          payment_method: string
          razorpay_order_id?: string | null
          razorpay_payment_id?: string | null
          staff_id?: string | null
          status?: string
          transaction_id?: string | null
          updated_at?: string | null
        }
        Update: {
          amount?: number
          branch_id?: string | null
          created_at?: string | null
          id?: string
          member_id?: string | null
          membership_id?: string | null
          notes?: string | null
          payment_date?: string | null
          payment_method?: string
          razorpay_order_id?: string | null
          razorpay_payment_id?: string | null
          staff_id?: string | null
          status?: string
          transaction_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "payments_branch_id_fkey"
            columns: ["branch_id"]
            isOneToOne: false
            referencedRelation: "branches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payments_membership_id_fkey"
            columns: ["membership_id"]
            isOneToOne: false
            referencedRelation: "memberships"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          accessible_branch_ids: string[] | null
          address: string | null
          avatar_url: string | null
          branch_id: string | null
          city: string | null
          country: string | null
          created_at: string | null
          date_of_birth: string | null
          email: string | null
          full_name: string | null
          gender: string | null
          id: string
          is_branch_manager: boolean | null
          phone: string | null
          role: string
          state: string | null
          updated_at: string | null
        }
        Insert: {
          accessible_branch_ids?: string[] | null
          address?: string | null
          avatar_url?: string | null
          branch_id?: string | null
          city?: string | null
          country?: string | null
          created_at?: string | null
          date_of_birth?: string | null
          email?: string | null
          full_name?: string | null
          gender?: string | null
          id: string
          is_branch_manager?: boolean | null
          phone?: string | null
          role?: string
          state?: string | null
          updated_at?: string | null
        }
        Update: {
          accessible_branch_ids?: string[] | null
          address?: string | null
          avatar_url?: string | null
          branch_id?: string | null
          city?: string | null
          country?: string | null
          created_at?: string | null
          date_of_birth?: string | null
          email?: string | null
          full_name?: string | null
          gender?: string | null
          id?: string
          is_branch_manager?: boolean | null
          phone?: string | null
          role?: string
          state?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_branch_id_fkey"
            columns: ["branch_id"]
            isOneToOne: false
            referencedRelation: "branches"
            referencedColumns: ["id"]
          },
        ]
      }
      staff_attendance: {
        Row: {
          branch_id: string | null
          check_in: string | null
          check_out: string | null
          created_at: string | null
          id: string
          notes: string | null
          staff_id: string | null
          status: string | null
          updated_at: string | null
        }
        Insert: {
          branch_id?: string | null
          check_in?: string | null
          check_out?: string | null
          created_at?: string | null
          id?: string
          notes?: string | null
          staff_id?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          branch_id?: string | null
          check_in?: string | null
          check_out?: string | null
          created_at?: string | null
          id?: string
          notes?: string | null
          staff_id?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "staff_attendance_branch_id_fkey"
            columns: ["branch_id"]
            isOneToOne: false
            referencedRelation: "branches"
            referencedColumns: ["id"]
          },
        ]
      }
      trainer_assignments: {
        Row: {
          branch_id: string | null
          created_at: string | null
          end_date: string | null
          id: string
          is_active: boolean | null
          member_id: string | null
          start_date: string
          trainer_id: string | null
          updated_at: string | null
        }
        Insert: {
          branch_id?: string | null
          created_at?: string | null
          end_date?: string | null
          id?: string
          is_active?: boolean | null
          member_id?: string | null
          start_date: string
          trainer_id?: string | null
          updated_at?: string | null
        }
        Update: {
          branch_id?: string | null
          created_at?: string | null
          end_date?: string | null
          id?: string
          is_active?: boolean | null
          member_id?: string | null
          start_date?: string
          trainer_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "trainer_assignments_branch_id_fkey"
            columns: ["branch_id"]
            isOneToOne: false
            referencedRelation: "branches"
            referencedColumns: ["id"]
          },
        ]
      }
      transactions: {
        Row: {
          amount: number
          branch_id: string | null
          category_id: string | null
          created_at: string | null
          description: string | null
          id: string
          payment_method: string | null
          recorded_by: string | null
          reference_id: string | null
          transaction_date: string | null
          transaction_id: string | null
          type: string
          updated_at: string | null
        }
        Insert: {
          amount: number
          branch_id?: string | null
          category_id?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          payment_method?: string | null
          recorded_by?: string | null
          reference_id?: string | null
          transaction_date?: string | null
          transaction_id?: string | null
          type: string
          updated_at?: string | null
        }
        Update: {
          amount?: number
          branch_id?: string | null
          category_id?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          payment_method?: string | null
          recorded_by?: string | null
          reference_id?: string | null
          transaction_date?: string | null
          transaction_id?: string | null
          type?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "transactions_branch_id_fkey"
            columns: ["branch_id"]
            isOneToOne: false
            referencedRelation: "branches"
            referencedColumns: ["id"]
          },
        ]
      }
      workout_days: {
        Row: {
          created_at: string | null
          day_label: string | null
          description: string | null
          id: string
          name: string
          notes: string | null
          updated_at: string | null
          workout_plan_id: string
        }
        Insert: {
          created_at?: string | null
          day_label?: string | null
          description?: string | null
          id?: string
          name: string
          notes?: string | null
          updated_at?: string | null
          workout_plan_id: string
        }
        Update: {
          created_at?: string | null
          day_label?: string | null
          description?: string | null
          id?: string
          name?: string
          notes?: string | null
          updated_at?: string | null
          workout_plan_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "workout_days_workout_plan_id_fkey"
            columns: ["workout_plan_id"]
            isOneToOne: false
            referencedRelation: "workout_plans"
            referencedColumns: ["id"]
          },
        ]
      }
      workout_plans: {
        Row: {
          created_at: string | null
          description: string | null
          difficulty: string | null
          id: string
          is_custom: boolean | null
          is_global: boolean | null
          member_id: string | null
          name: string
          notes: string | null
          trainer_id: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          difficulty?: string | null
          id?: string
          is_custom?: boolean | null
          is_global?: boolean | null
          member_id?: string | null
          name: string
          notes?: string | null
          trainer_id: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          difficulty?: string | null
          id?: string
          is_custom?: boolean | null
          is_global?: boolean | null
          member_id?: string | null
          name?: string
          notes?: string | null
          trainer_id?: string
          updated_at?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
