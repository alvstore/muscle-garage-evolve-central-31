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
      announcements: {
        Row: {
          author: string | null
          author_id: string | null
          author_name: string | null
          branch_id: string | null
          channel: string | null
          channels: string[]
          content: string
          created_at: string
          expires_at: string | null
          id: string
          priority: string
          target_roles: string[]
          title: string
          updated_at: string
        }
        Insert: {
          author?: string | null
          author_id?: string | null
          author_name?: string | null
          branch_id?: string | null
          channel?: string | null
          channels?: string[]
          content: string
          created_at?: string
          expires_at?: string | null
          id?: string
          priority: string
          target_roles?: string[]
          title: string
          updated_at?: string
        }
        Update: {
          author?: string | null
          author_id?: string | null
          author_name?: string | null
          branch_id?: string | null
          channel?: string | null
          channels?: string[]
          content?: string
          created_at?: string
          expires_at?: string | null
          id?: string
          priority?: string
          target_roles?: string[]
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "announcements_branch_id_fkey"
            columns: ["branch_id"]
            isOneToOne: false
            referencedRelation: "branches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "announcements_branch_id_fkey"
            columns: ["branch_id"]
            isOneToOne: false
            referencedRelation: "member_attendance_heatmap"
            referencedColumns: ["branch_id"]
          },
        ]
      }
      automation_rules: {
        Row: {
          actions: Json
          branch_id: string | null
          created_at: string
          created_by: string | null
          description: string | null
          id: string
          is_active: boolean
          name: string
          trigger_condition: Json
          trigger_type: string
          updated_at: string
        }
        Insert: {
          actions: Json
          branch_id?: string | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          is_active?: boolean
          name: string
          trigger_condition: Json
          trigger_type: string
          updated_at?: string
        }
        Update: {
          actions?: Json
          branch_id?: string | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          is_active?: boolean
          name?: string
          trigger_condition?: Json
          trigger_type?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "automation_rules_branch_id_fkey"
            columns: ["branch_id"]
            isOneToOne: false
            referencedRelation: "branches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "automation_rules_branch_id_fkey"
            columns: ["branch_id"]
            isOneToOne: false
            referencedRelation: "member_attendance_heatmap"
            referencedColumns: ["branch_id"]
          },
        ]
      }
      backup_logs: {
        Row: {
          action: string
          created_at: string
          failed_count: number | null
          id: string
          modules: string[]
          success: boolean
          success_count: number | null
          timestamp: string
          total_records: number | null
          updated_at: string
          user_id: string | null
          user_name: string | null
        }
        Insert: {
          action: string
          created_at?: string
          failed_count?: number | null
          id?: string
          modules?: string[]
          success?: boolean
          success_count?: number | null
          timestamp?: string
          total_records?: number | null
          updated_at?: string
          user_id?: string | null
          user_name?: string | null
        }
        Update: {
          action?: string
          created_at?: string
          failed_count?: number | null
          id?: string
          modules?: string[]
          success?: boolean
          success_count?: number | null
          timestamp?: string
          total_records?: number | null
          updated_at?: string
          user_id?: string | null
          user_name?: string | null
        }
        Relationships: []
      }
      body_measurements: {
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
          measurement_date: string | null
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
          measurement_date?: string | null
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
          measurement_date?: string | null
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
            foreignKeyName: "body_measurements_member_id_fkey"
            columns: ["member_id"]
            isOneToOne: false
            referencedRelation: "member_churn_risk"
            referencedColumns: ["member_id"]
          },
          {
            foreignKeyName: "body_measurements_member_id_fkey"
            columns: ["member_id"]
            isOneToOne: false
            referencedRelation: "members"
            referencedColumns: ["id"]
          },
        ]
      }
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
          {
            foreignKeyName: "class_schedules_branch_id_fkey"
            columns: ["branch_id"]
            isOneToOne: false
            referencedRelation: "member_attendance_heatmap"
            referencedColumns: ["branch_id"]
          },
        ]
      }
      class_types: {
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
            foreignKeyName: "class_types_branch_id_fkey"
            columns: ["branch_id"]
            isOneToOne: false
            referencedRelation: "branches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "class_types_branch_id_fkey"
            columns: ["branch_id"]
            isOneToOne: false
            referencedRelation: "member_attendance_heatmap"
            referencedColumns: ["branch_id"]
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
          enrolled: number | null
          id: string
          is_active: boolean | null
          location: string | null
          name: string
          recurrence: string | null
          start_time: string
          status: Database["public"]["Enums"]["class_status"] | null
          trainer: string | null
          trainer_id: string | null
          type: string | null
          updated_at: string | null
        }
        Insert: {
          branch_id?: string | null
          capacity: number
          created_at?: string | null
          description?: string | null
          end_time: string
          enrolled?: number | null
          id?: string
          is_active?: boolean | null
          location?: string | null
          name: string
          recurrence?: string | null
          start_time: string
          status?: Database["public"]["Enums"]["class_status"] | null
          trainer?: string | null
          trainer_id?: string | null
          type?: string | null
          updated_at?: string | null
        }
        Update: {
          branch_id?: string | null
          capacity?: number
          created_at?: string | null
          description?: string | null
          end_time?: string
          enrolled?: number | null
          id?: string
          is_active?: boolean | null
          location?: string | null
          name?: string
          recurrence?: string | null
          start_time?: string
          status?: Database["public"]["Enums"]["class_status"] | null
          trainer?: string | null
          trainer_id?: string | null
          type?: string | null
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
          {
            foreignKeyName: "classes_branch_id_fkey"
            columns: ["branch_id"]
            isOneToOne: false
            referencedRelation: "member_attendance_heatmap"
            referencedColumns: ["branch_id"]
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
      email_settings: {
        Row: {
          branch_id: string | null
          created_at: string
          from_email: string
          id: string
          is_active: boolean
          mailgun_api_key: string | null
          mailgun_domain: string | null
          notifications: Json
          provider: string
          sendgrid_api_key: string | null
          smtp_host: string | null
          smtp_password: string | null
          smtp_port: number | null
          smtp_secure: boolean | null
          smtp_username: string | null
          updated_at: string
        }
        Insert: {
          branch_id?: string | null
          created_at?: string
          from_email: string
          id?: string
          is_active?: boolean
          mailgun_api_key?: string | null
          mailgun_domain?: string | null
          notifications?: Json
          provider: string
          sendgrid_api_key?: string | null
          smtp_host?: string | null
          smtp_password?: string | null
          smtp_port?: number | null
          smtp_secure?: boolean | null
          smtp_username?: string | null
          updated_at?: string
        }
        Update: {
          branch_id?: string | null
          created_at?: string
          from_email?: string
          id?: string
          is_active?: boolean
          mailgun_api_key?: string | null
          mailgun_domain?: string | null
          notifications?: Json
          provider?: string
          sendgrid_api_key?: string | null
          smtp_host?: string | null
          smtp_password?: string | null
          smtp_port?: number | null
          smtp_secure?: boolean | null
          smtp_username?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "email_settings_branch_id_fkey"
            columns: ["branch_id"]
            isOneToOne: false
            referencedRelation: "branches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "email_settings_branch_id_fkey"
            columns: ["branch_id"]
            isOneToOne: false
            referencedRelation: "member_attendance_heatmap"
            referencedColumns: ["branch_id"]
          },
        ]
      }
      email_templates: {
        Row: {
          branch_id: string | null
          category: string
          content: string
          created_at: string
          id: string
          is_active: boolean
          name: string
          subject: string
          updated_at: string
          variables: Json | null
        }
        Insert: {
          branch_id?: string | null
          category: string
          content: string
          created_at?: string
          id?: string
          is_active?: boolean
          name: string
          subject: string
          updated_at?: string
          variables?: Json | null
        }
        Update: {
          branch_id?: string | null
          category?: string
          content?: string
          created_at?: string
          id?: string
          is_active?: boolean
          name?: string
          subject?: string
          updated_at?: string
          variables?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "email_templates_branch_id_fkey"
            columns: ["branch_id"]
            isOneToOne: false
            referencedRelation: "branches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "email_templates_branch_id_fkey"
            columns: ["branch_id"]
            isOneToOne: false
            referencedRelation: "member_attendance_heatmap"
            referencedColumns: ["branch_id"]
          },
        ]
      }
      essl_device_settings: {
        Row: {
          api_password: string | null
          api_url: string | null
          api_username: string | null
          branch_id: string
          created_at: string
          device_name: string
          device_serial: string
          devices: Json
          id: string
          is_active: boolean
          push_url: string | null
          updated_at: string
        }
        Insert: {
          api_password?: string | null
          api_url?: string | null
          api_username?: string | null
          branch_id: string
          created_at?: string
          device_name: string
          device_serial: string
          devices?: Json
          id?: string
          is_active?: boolean
          push_url?: string | null
          updated_at?: string
        }
        Update: {
          api_password?: string | null
          api_url?: string | null
          api_username?: string | null
          branch_id?: string
          created_at?: string
          device_name?: string
          device_serial?: string
          devices?: Json
          id?: string
          is_active?: boolean
          push_url?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "essl_device_settings_branch_id_fkey"
            columns: ["branch_id"]
            isOneToOne: false
            referencedRelation: "branches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "essl_device_settings_branch_id_fkey"
            columns: ["branch_id"]
            isOneToOne: false
            referencedRelation: "member_attendance_heatmap"
            referencedColumns: ["branch_id"]
          },
        ]
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
          {
            foreignKeyName: "expense_categories_branch_id_fkey"
            columns: ["branch_id"]
            isOneToOne: false
            referencedRelation: "member_attendance_heatmap"
            referencedColumns: ["branch_id"]
          },
        ]
      }
      expense_records: {
        Row: {
          amount: number
          branch_id: string
          category: string
          created_at: string | null
          date: string
          description: string
          id: string
          payment_method: string
          reference: string
          status: string
          updated_at: string | null
          vendor: string
        }
        Insert: {
          amount: number
          branch_id: string
          category: string
          created_at?: string | null
          date: string
          description: string
          id?: string
          payment_method: string
          reference: string
          status: string
          updated_at?: string | null
          vendor: string
        }
        Update: {
          amount?: number
          branch_id?: string
          category?: string
          created_at?: string | null
          date?: string
          description?: string
          id?: string
          payment_method?: string
          reference?: string
          status?: string
          updated_at?: string | null
          vendor?: string
        }
        Relationships: []
      }
      feedback: {
        Row: {
          anonymous: boolean | null
          branch_id: string | null
          comments: string | null
          created_at: string | null
          id: string
          member_id: string | null
          member_name: string | null
          rating: number
          related_id: string | null
          title: string
          type: string
        }
        Insert: {
          anonymous?: boolean | null
          branch_id?: string | null
          comments?: string | null
          created_at?: string | null
          id?: string
          member_id?: string | null
          member_name?: string | null
          rating: number
          related_id?: string | null
          title: string
          type: string
        }
        Update: {
          anonymous?: boolean | null
          branch_id?: string | null
          comments?: string | null
          created_at?: string | null
          id?: string
          member_id?: string | null
          member_name?: string | null
          rating?: number
          related_id?: string | null
          title?: string
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "feedback_branch_id_fkey"
            columns: ["branch_id"]
            isOneToOne: false
            referencedRelation: "branches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "feedback_branch_id_fkey"
            columns: ["branch_id"]
            isOneToOne: false
            referencedRelation: "member_attendance_heatmap"
            referencedColumns: ["branch_id"]
          },
          {
            foreignKeyName: "feedback_member_id_fkey"
            columns: ["member_id"]
            isOneToOne: false
            referencedRelation: "member_churn_risk"
            referencedColumns: ["member_id"]
          },
          {
            foreignKeyName: "feedback_member_id_fkey"
            columns: ["member_id"]
            isOneToOne: false
            referencedRelation: "members"
            referencedColumns: ["id"]
          },
        ]
      }
      fitness_progress: {
        Row: {
          body_fat_percentage: number | null
          branch_id: string | null
          created_at: string | null
          created_by: string | null
          date: string | null
          diet_adherence: number | null
          id: string
          member_id: string | null
          muscle_mass: number | null
          notes: string | null
          updated_at: string | null
          weight: number | null
          workout_completion: number | null
        }
        Insert: {
          body_fat_percentage?: number | null
          branch_id?: string | null
          created_at?: string | null
          created_by?: string | null
          date?: string | null
          diet_adherence?: number | null
          id?: string
          member_id?: string | null
          muscle_mass?: number | null
          notes?: string | null
          updated_at?: string | null
          weight?: number | null
          workout_completion?: number | null
        }
        Update: {
          body_fat_percentage?: number | null
          branch_id?: string | null
          created_at?: string | null
          created_by?: string | null
          date?: string | null
          diet_adherence?: number | null
          id?: string
          member_id?: string | null
          muscle_mass?: number | null
          notes?: string | null
          updated_at?: string | null
          weight?: number | null
          workout_completion?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "fitness_progress_branch_id_fkey"
            columns: ["branch_id"]
            isOneToOne: false
            referencedRelation: "branches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fitness_progress_branch_id_fkey"
            columns: ["branch_id"]
            isOneToOne: false
            referencedRelation: "member_attendance_heatmap"
            referencedColumns: ["branch_id"]
          },
          {
            foreignKeyName: "fitness_progress_member_id_fkey"
            columns: ["member_id"]
            isOneToOne: false
            referencedRelation: "member_churn_risk"
            referencedColumns: ["member_id"]
          },
          {
            foreignKeyName: "fitness_progress_member_id_fkey"
            columns: ["member_id"]
            isOneToOne: false
            referencedRelation: "members"
            referencedColumns: ["id"]
          },
        ]
      }
      follow_up_history: {
        Row: {
          content: string
          id: string
          lead_id: string | null
          response: string | null
          response_at: string | null
          sent_at: string | null
          sent_by: string | null
          status: string
          template_id: string | null
          type: string
        }
        Insert: {
          content: string
          id?: string
          lead_id?: string | null
          response?: string | null
          response_at?: string | null
          sent_at?: string | null
          sent_by?: string | null
          status: string
          template_id?: string | null
          type: string
        }
        Update: {
          content?: string
          id?: string
          lead_id?: string | null
          response?: string | null
          response_at?: string | null
          sent_at?: string | null
          sent_by?: string | null
          status?: string
          template_id?: string | null
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "follow_up_history_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "follow_up_history_sent_by_fkey"
            columns: ["sent_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "follow_up_history_sent_by_fkey"
            columns: ["sent_by"]
            isOneToOne: false
            referencedRelation: "trainer_utilization"
            referencedColumns: ["trainer_id"]
          },
        ]
      }
      follow_up_templates: {
        Row: {
          content: string
          created_at: string | null
          created_by: string | null
          id: string
          name: string
        }
        Insert: {
          content: string
          created_at?: string | null
          created_by?: string | null
          id?: string
          name: string
        }
        Update: {
          content?: string
          created_at?: string | null
          created_by?: string | null
          id?: string
          name?: string
        }
        Relationships: [
          {
            foreignKeyName: "follow_up_templates_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "follow_up_templates_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "trainer_utilization"
            referencedColumns: ["trainer_id"]
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
      hikvision_api_settings: {
        Row: {
          api_url: string
          app_key: string
          app_secret: string
          branch_id: string
          created_at: string
          devices: Json
          id: string
          is_active: boolean
          updated_at: string
        }
        Insert: {
          api_url: string
          app_key: string
          app_secret: string
          branch_id: string
          created_at?: string
          devices?: Json
          id?: string
          is_active?: boolean
          updated_at?: string
        }
        Update: {
          api_url?: string
          app_key?: string
          app_secret?: string
          branch_id?: string
          created_at?: string
          devices?: Json
          id?: string
          is_active?: boolean
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "hikvision_api_settings_branch_id_fkey"
            columns: ["branch_id"]
            isOneToOne: false
            referencedRelation: "branches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "hikvision_api_settings_branch_id_fkey"
            columns: ["branch_id"]
            isOneToOne: false
            referencedRelation: "member_attendance_heatmap"
            referencedColumns: ["branch_id"]
          },
        ]
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
          {
            foreignKeyName: "income_categories_branch_id_fkey"
            columns: ["branch_id"]
            isOneToOne: false
            referencedRelation: "member_attendance_heatmap"
            referencedColumns: ["branch_id"]
          },
        ]
      }
      income_records: {
        Row: {
          amount: number
          branch_id: string
          category: string
          created_at: string | null
          date: string
          description: string
          id: string
          payment_method: string
          reference: string
          source: string
          updated_at: string | null
        }
        Insert: {
          amount: number
          branch_id: string
          category: string
          created_at?: string | null
          date: string
          description: string
          id?: string
          payment_method: string
          reference: string
          source: string
          updated_at?: string | null
        }
        Update: {
          amount?: number
          branch_id?: string
          category?: string
          created_at?: string | null
          date?: string
          description?: string
          id?: string
          payment_method?: string
          reference?: string
          source?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      inventory_items: {
        Row: {
          barcode: string | null
          branch_id: string | null
          category: string | null
          cost_price: number
          created_at: string | null
          description: string | null
          expiry_date: string | null
          id: string
          image: string | null
          last_stock_update: string | null
          location: string | null
          manufacture_date: string | null
          name: string
          price: number
          quantity: number
          reorder_level: number
          sku: string
          status: string
          supplier: string | null
          supplier_contact: string | null
          updated_at: string | null
        }
        Insert: {
          barcode?: string | null
          branch_id?: string | null
          category?: string | null
          cost_price: number
          created_at?: string | null
          description?: string | null
          expiry_date?: string | null
          id?: string
          image?: string | null
          last_stock_update?: string | null
          location?: string | null
          manufacture_date?: string | null
          name: string
          price: number
          quantity?: number
          reorder_level?: number
          sku: string
          status: string
          supplier?: string | null
          supplier_contact?: string | null
          updated_at?: string | null
        }
        Update: {
          barcode?: string | null
          branch_id?: string | null
          category?: string | null
          cost_price?: number
          created_at?: string | null
          description?: string | null
          expiry_date?: string | null
          id?: string
          image?: string | null
          last_stock_update?: string | null
          location?: string | null
          manufacture_date?: string | null
          name?: string
          price?: number
          quantity?: number
          reorder_level?: number
          sku?: string
          status?: string
          supplier?: string | null
          supplier_contact?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "inventory_items_branch_id_fkey"
            columns: ["branch_id"]
            isOneToOne: false
            referencedRelation: "branches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "inventory_items_branch_id_fkey"
            columns: ["branch_id"]
            isOneToOne: false
            referencedRelation: "member_attendance_heatmap"
            referencedColumns: ["branch_id"]
          },
        ]
      }
      invoices: {
        Row: {
          amount: number
          branch_id: string | null
          created_at: string
          created_by: string | null
          description: string | null
          due_date: string
          id: string
          issued_date: string
          items: Json
          member_id: string | null
          membership_plan_id: string | null
          notes: string | null
          paid_date: string | null
          payment_method: string | null
          razorpay_order_id: string | null
          razorpay_payment_id: string | null
          status: string
          updated_at: string
        }
        Insert: {
          amount: number
          branch_id?: string | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          due_date: string
          id?: string
          issued_date?: string
          items?: Json
          member_id?: string | null
          membership_plan_id?: string | null
          notes?: string | null
          paid_date?: string | null
          payment_method?: string | null
          razorpay_order_id?: string | null
          razorpay_payment_id?: string | null
          status: string
          updated_at?: string
        }
        Update: {
          amount?: number
          branch_id?: string | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          due_date?: string
          id?: string
          issued_date?: string
          items?: Json
          member_id?: string | null
          membership_plan_id?: string | null
          notes?: string | null
          paid_date?: string | null
          payment_method?: string | null
          razorpay_order_id?: string | null
          razorpay_payment_id?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "invoices_branch_id_fkey"
            columns: ["branch_id"]
            isOneToOne: false
            referencedRelation: "branches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invoices_branch_id_fkey"
            columns: ["branch_id"]
            isOneToOne: false
            referencedRelation: "member_attendance_heatmap"
            referencedColumns: ["branch_id"]
          },
          {
            foreignKeyName: "invoices_member_id_fkey"
            columns: ["member_id"]
            isOneToOne: false
            referencedRelation: "member_churn_risk"
            referencedColumns: ["member_id"]
          },
          {
            foreignKeyName: "invoices_member_id_fkey"
            columns: ["member_id"]
            isOneToOne: false
            referencedRelation: "members"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invoices_membership_plan_id_fkey"
            columns: ["membership_plan_id"]
            isOneToOne: false
            referencedRelation: "memberships"
            referencedColumns: ["id"]
          },
        ]
      }
      leads: {
        Row: {
          assigned_to: string | null
          conversion_date: string | null
          conversion_value: number | null
          created_at: string | null
          email: string | null
          follow_up_date: string | null
          funnel_stage: string
          id: string
          interests: string[] | null
          last_contact_date: string | null
          name: string
          notes: string | null
          phone: string | null
          source: string
          status: string
          tags: string[] | null
          updated_at: string | null
        }
        Insert: {
          assigned_to?: string | null
          conversion_date?: string | null
          conversion_value?: number | null
          created_at?: string | null
          email?: string | null
          follow_up_date?: string | null
          funnel_stage: string
          id?: string
          interests?: string[] | null
          last_contact_date?: string | null
          name: string
          notes?: string | null
          phone?: string | null
          source: string
          status: string
          tags?: string[] | null
          updated_at?: string | null
        }
        Update: {
          assigned_to?: string | null
          conversion_date?: string | null
          conversion_value?: number | null
          created_at?: string | null
          email?: string | null
          follow_up_date?: string | null
          funnel_stage?: string
          id?: string
          interests?: string[] | null
          last_contact_date?: string | null
          name?: string
          notes?: string | null
          phone?: string | null
          source?: string
          status?: string
          tags?: string[] | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "leads_assigned_to_fkey"
            columns: ["assigned_to"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "leads_assigned_to_fkey"
            columns: ["assigned_to"]
            isOneToOne: false
            referencedRelation: "trainer_utilization"
            referencedColumns: ["trainer_id"]
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
          {
            foreignKeyName: "measurements_branch_id_fkey"
            columns: ["branch_id"]
            isOneToOne: false
            referencedRelation: "member_attendance_heatmap"
            referencedColumns: ["branch_id"]
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
          {
            foreignKeyName: "member_attendance_branch_id_fkey"
            columns: ["branch_id"]
            isOneToOne: false
            referencedRelation: "member_attendance_heatmap"
            referencedColumns: ["branch_id"]
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
            foreignKeyName: "member_memberships_branch_id_fkey"
            columns: ["branch_id"]
            isOneToOne: false
            referencedRelation: "member_attendance_heatmap"
            referencedColumns: ["branch_id"]
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
      members: {
        Row: {
          blood_group: string | null
          branch_id: string | null
          created_at: string | null
          date_of_birth: string | null
          email: string | null
          gender: string | null
          goal: string | null
          id: string
          membership_end_date: string | null
          membership_id: string | null
          membership_start_date: string | null
          membership_status: string | null
          name: string
          occupation: string | null
          phone: string | null
          status: string | null
          trainer_id: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          blood_group?: string | null
          branch_id?: string | null
          created_at?: string | null
          date_of_birth?: string | null
          email?: string | null
          gender?: string | null
          goal?: string | null
          id?: string
          membership_end_date?: string | null
          membership_id?: string | null
          membership_start_date?: string | null
          membership_status?: string | null
          name: string
          occupation?: string | null
          phone?: string | null
          status?: string | null
          trainer_id?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          blood_group?: string | null
          branch_id?: string | null
          created_at?: string | null
          date_of_birth?: string | null
          email?: string | null
          gender?: string | null
          goal?: string | null
          id?: string
          membership_end_date?: string | null
          membership_id?: string | null
          membership_start_date?: string | null
          membership_status?: string | null
          name?: string
          occupation?: string | null
          phone?: string | null
          status?: string | null
          trainer_id?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "members_branch_id_fkey"
            columns: ["branch_id"]
            isOneToOne: false
            referencedRelation: "branches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "members_branch_id_fkey"
            columns: ["branch_id"]
            isOneToOne: false
            referencedRelation: "member_attendance_heatmap"
            referencedColumns: ["branch_id"]
          },
        ]
      }
      membership_subscriptions: {
        Row: {
          amount_paid: number
          branch_id: string | null
          created_at: string | null
          end_date: string
          id: string
          invoice_id: string | null
          payment_id: string | null
          plan_id: string
          start_date: string
          status: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          amount_paid: number
          branch_id?: string | null
          created_at?: string | null
          end_date: string
          id?: string
          invoice_id?: string | null
          payment_id?: string | null
          plan_id: string
          start_date?: string
          status?: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          amount_paid?: number
          branch_id?: string | null
          created_at?: string | null
          end_date?: string
          id?: string
          invoice_id?: string | null
          payment_id?: string | null
          plan_id?: string
          start_date?: string
          status?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "membership_subscriptions_branch_id_fkey"
            columns: ["branch_id"]
            isOneToOne: false
            referencedRelation: "branches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "membership_subscriptions_branch_id_fkey"
            columns: ["branch_id"]
            isOneToOne: false
            referencedRelation: "member_attendance_heatmap"
            referencedColumns: ["branch_id"]
          },
          {
            foreignKeyName: "membership_subscriptions_plan_id_fkey"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "memberships"
            referencedColumns: ["id"]
          },
        ]
      }
      memberships: {
        Row: {
          branch_id: string | null
          created_at: string | null
          description: string | null
          duration_days: number
          features: Json | null
          id: string
          is_active: boolean | null
          name: string
          plan_name: string | null
          price: number
          updated_at: string | null
        }
        Insert: {
          branch_id?: string | null
          created_at?: string | null
          description?: string | null
          duration_days: number
          features?: Json | null
          id?: string
          is_active?: boolean | null
          name: string
          plan_name?: string | null
          price: number
          updated_at?: string | null
        }
        Update: {
          branch_id?: string | null
          created_at?: string | null
          description?: string | null
          duration_days?: number
          features?: Json | null
          id?: string
          is_active?: boolean | null
          name?: string
          plan_name?: string | null
          price?: number
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "memberships_branch_id_fkey"
            columns: ["branch_id"]
            isOneToOne: false
            referencedRelation: "branches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "memberships_branch_id_fkey"
            columns: ["branch_id"]
            isOneToOne: false
            referencedRelation: "member_attendance_heatmap"
            referencedColumns: ["branch_id"]
          },
        ]
      }
      motivational_messages: {
        Row: {
          active: boolean | null
          author: string | null
          category: string
          content: string
          created_at: string | null
          id: string
          tags: string[] | null
          title: string
          updated_at: string | null
        }
        Insert: {
          active?: boolean | null
          author?: string | null
          category: string
          content: string
          created_at?: string | null
          id?: string
          tags?: string[] | null
          title: string
          updated_at?: string | null
        }
        Update: {
          active?: boolean | null
          author?: string | null
          category?: string
          content?: string
          created_at?: string | null
          id?: string
          tags?: string[] | null
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      notifications: {
        Row: {
          created_at: string | null
          id: string
          message: string | null
          read: boolean | null
          title: string
          type: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          message?: string | null
          read?: boolean | null
          title: string
          type?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          message?: string | null
          read?: boolean | null
          title?: string
          type?: string | null
          user_id?: string
        }
        Relationships: []
      }
      orders: {
        Row: {
          branch_id: string | null
          completed_at: string | null
          created_at: string | null
          customer_email: string | null
          customer_name: string
          customer_phone: string | null
          discount: number | null
          id: string
          items: Json
          member_id: string | null
          notes: string | null
          payment_method: string
          payment_status: string
          promo_code: string | null
          promo_code_id: string | null
          staff_id: string | null
          status: string
          subtotal: number
          tax: number
          total: number
          updated_at: string | null
        }
        Insert: {
          branch_id?: string | null
          completed_at?: string | null
          created_at?: string | null
          customer_email?: string | null
          customer_name: string
          customer_phone?: string | null
          discount?: number | null
          id?: string
          items?: Json
          member_id?: string | null
          notes?: string | null
          payment_method: string
          payment_status: string
          promo_code?: string | null
          promo_code_id?: string | null
          staff_id?: string | null
          status: string
          subtotal: number
          tax?: number
          total: number
          updated_at?: string | null
        }
        Update: {
          branch_id?: string | null
          completed_at?: string | null
          created_at?: string | null
          customer_email?: string | null
          customer_name?: string
          customer_phone?: string | null
          discount?: number | null
          id?: string
          items?: Json
          member_id?: string | null
          notes?: string | null
          payment_method?: string
          payment_status?: string
          promo_code?: string | null
          promo_code_id?: string | null
          staff_id?: string | null
          status?: string
          subtotal?: number
          tax?: number
          total?: number
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "orders_branch_id_fkey"
            columns: ["branch_id"]
            isOneToOne: false
            referencedRelation: "branches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orders_branch_id_fkey"
            columns: ["branch_id"]
            isOneToOne: false
            referencedRelation: "member_attendance_heatmap"
            referencedColumns: ["branch_id"]
          },
          {
            foreignKeyName: "orders_member_id_fkey"
            columns: ["member_id"]
            isOneToOne: false
            referencedRelation: "member_churn_risk"
            referencedColumns: ["member_id"]
          },
          {
            foreignKeyName: "orders_member_id_fkey"
            columns: ["member_id"]
            isOneToOne: false
            referencedRelation: "members"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orders_promo_code_id_fkey"
            columns: ["promo_code_id"]
            isOneToOne: false
            referencedRelation: "promo_codes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orders_staff_id_fkey"
            columns: ["staff_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orders_staff_id_fkey"
            columns: ["staff_id"]
            isOneToOne: false
            referencedRelation: "trainer_utilization"
            referencedColumns: ["trainer_id"]
          },
        ]
      }
      payment_gateway_settings: {
        Row: {
          allowed_ips: string[] | null
          config: Json
          created_at: string
          gateway: string
          id: string
          is_active: boolean
          updated_at: string
          webhook_secret: string | null
          webhook_url: string | null
        }
        Insert: {
          allowed_ips?: string[] | null
          config: Json
          created_at?: string
          gateway: string
          id?: string
          is_active?: boolean
          updated_at?: string
          webhook_secret?: string | null
          webhook_url?: string | null
        }
        Update: {
          allowed_ips?: string[] | null
          config?: Json
          created_at?: string
          gateway?: string
          id?: string
          is_active?: boolean
          updated_at?: string
          webhook_secret?: string | null
          webhook_url?: string | null
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
            foreignKeyName: "payments_branch_id_fkey"
            columns: ["branch_id"]
            isOneToOne: false
            referencedRelation: "member_attendance_heatmap"
            referencedColumns: ["branch_id"]
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
          department: string | null
          email: string | null
          full_name: string | null
          gender: string | null
          id: string
          is_active: boolean | null
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
          department?: string | null
          email?: string | null
          full_name?: string | null
          gender?: string | null
          id: string
          is_active?: boolean | null
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
          department?: string | null
          email?: string | null
          full_name?: string | null
          gender?: string | null
          id?: string
          is_active?: boolean | null
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
          {
            foreignKeyName: "profiles_branch_id_fkey"
            columns: ["branch_id"]
            isOneToOne: false
            referencedRelation: "member_attendance_heatmap"
            referencedColumns: ["branch_id"]
          },
        ]
      }
      promo_codes: {
        Row: {
          applicable_memberships: string[] | null
          applicable_products: string[] | null
          branch_id: string | null
          code: string
          created_at: string | null
          created_by: string | null
          current_usage: number | null
          description: string | null
          end_date: string
          id: string
          max_discount_amount: number | null
          min_purchase_amount: number | null
          start_date: string
          status: string
          type: string
          updated_at: string | null
          usage_limit: number | null
          value: number
        }
        Insert: {
          applicable_memberships?: string[] | null
          applicable_products?: string[] | null
          branch_id?: string | null
          code: string
          created_at?: string | null
          created_by?: string | null
          current_usage?: number | null
          description?: string | null
          end_date: string
          id?: string
          max_discount_amount?: number | null
          min_purchase_amount?: number | null
          start_date: string
          status: string
          type: string
          updated_at?: string | null
          usage_limit?: number | null
          value: number
        }
        Update: {
          applicable_memberships?: string[] | null
          applicable_products?: string[] | null
          branch_id?: string | null
          code?: string
          created_at?: string | null
          created_by?: string | null
          current_usage?: number | null
          description?: string | null
          end_date?: string
          id?: string
          max_discount_amount?: number | null
          min_purchase_amount?: number | null
          start_date?: string
          status?: string
          type?: string
          updated_at?: string | null
          usage_limit?: number | null
          value?: number
        }
        Relationships: [
          {
            foreignKeyName: "promo_codes_branch_id_fkey"
            columns: ["branch_id"]
            isOneToOne: false
            referencedRelation: "branches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "promo_codes_branch_id_fkey"
            columns: ["branch_id"]
            isOneToOne: false
            referencedRelation: "member_attendance_heatmap"
            referencedColumns: ["branch_id"]
          },
          {
            foreignKeyName: "promo_codes_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "promo_codes_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "trainer_utilization"
            referencedColumns: ["trainer_id"]
          },
        ]
      }
      referrals: {
        Row: {
          converted_at: string | null
          created_at: string | null
          id: string
          promo_code: string | null
          promo_code_id: string | null
          referred_email: string
          referred_id: string | null
          referred_name: string | null
          referrer_id: string | null
          referrer_name: string
          reward_amount: number | null
          reward_description: string | null
          reward_status: string | null
          status: string
        }
        Insert: {
          converted_at?: string | null
          created_at?: string | null
          id?: string
          promo_code?: string | null
          promo_code_id?: string | null
          referred_email: string
          referred_id?: string | null
          referred_name?: string | null
          referrer_id?: string | null
          referrer_name: string
          reward_amount?: number | null
          reward_description?: string | null
          reward_status?: string | null
          status: string
        }
        Update: {
          converted_at?: string | null
          created_at?: string | null
          id?: string
          promo_code?: string | null
          promo_code_id?: string | null
          referred_email?: string
          referred_id?: string | null
          referred_name?: string | null
          referrer_id?: string | null
          referrer_name?: string
          reward_amount?: number | null
          reward_description?: string | null
          reward_status?: string | null
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "referrals_promo_code_id_fkey"
            columns: ["promo_code_id"]
            isOneToOne: false
            referencedRelation: "promo_codes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "referrals_referred_id_fkey"
            columns: ["referred_id"]
            isOneToOne: false
            referencedRelation: "member_churn_risk"
            referencedColumns: ["member_id"]
          },
          {
            foreignKeyName: "referrals_referred_id_fkey"
            columns: ["referred_id"]
            isOneToOne: false
            referencedRelation: "members"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "referrals_referrer_id_fkey"
            columns: ["referrer_id"]
            isOneToOne: false
            referencedRelation: "member_churn_risk"
            referencedColumns: ["member_id"]
          },
          {
            foreignKeyName: "referrals_referrer_id_fkey"
            columns: ["referrer_id"]
            isOneToOne: false
            referencedRelation: "members"
            referencedColumns: ["id"]
          },
        ]
      }
      reminder_rules: {
        Row: {
          conditions: Json
          created_at: string
          description: string | null
          id: string
          is_active: boolean
          message: string | null
          notification_channel: string | null
          send_via: string[]
          target_roles: string[]
          title: string
          trigger_type: string
          trigger_value: number | null
          updated_at: string
        }
        Insert: {
          conditions?: Json
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          message?: string | null
          notification_channel?: string | null
          send_via?: string[]
          target_roles?: string[]
          title: string
          trigger_type: string
          trigger_value?: number | null
          updated_at?: string
        }
        Update: {
          conditions?: Json
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          message?: string | null
          notification_channel?: string | null
          send_via?: string[]
          target_roles?: string[]
          title?: string
          trigger_type?: string
          trigger_value?: number | null
          updated_at?: string
        }
        Relationships: []
      }
      settings: {
        Row: {
          branch_id: string | null
          category: string
          created_at: string | null
          description: string | null
          id: string
          key: string
          updated_at: string | null
          value: Json | null
        }
        Insert: {
          branch_id?: string | null
          category: string
          created_at?: string | null
          description?: string | null
          id?: string
          key: string
          updated_at?: string | null
          value?: Json | null
        }
        Update: {
          branch_id?: string | null
          category?: string
          created_at?: string | null
          description?: string | null
          id?: string
          key?: string
          updated_at?: string | null
          value?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "settings_branch_id_fkey"
            columns: ["branch_id"]
            isOneToOne: false
            referencedRelation: "branches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "settings_branch_id_fkey"
            columns: ["branch_id"]
            isOneToOne: false
            referencedRelation: "member_attendance_heatmap"
            referencedColumns: ["branch_id"]
          },
        ]
      }
      sms_templates: {
        Row: {
          branch_id: string | null
          category: string
          content: string
          created_at: string
          dlt_template_id: string | null
          id: string
          is_active: boolean
          name: string
          updated_at: string
          variables: Json | null
        }
        Insert: {
          branch_id?: string | null
          category: string
          content: string
          created_at?: string
          dlt_template_id?: string | null
          id?: string
          is_active?: boolean
          name: string
          updated_at?: string
          variables?: Json | null
        }
        Update: {
          branch_id?: string | null
          category?: string
          content?: string
          created_at?: string
          dlt_template_id?: string | null
          id?: string
          is_active?: boolean
          name?: string
          updated_at?: string
          variables?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "sms_templates_branch_id_fkey"
            columns: ["branch_id"]
            isOneToOne: false
            referencedRelation: "branches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sms_templates_branch_id_fkey"
            columns: ["branch_id"]
            isOneToOne: false
            referencedRelation: "member_attendance_heatmap"
            referencedColumns: ["branch_id"]
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
          {
            foreignKeyName: "staff_attendance_branch_id_fkey"
            columns: ["branch_id"]
            isOneToOne: false
            referencedRelation: "member_attendance_heatmap"
            referencedColumns: ["branch_id"]
          },
        ]
      }
      store_products: {
        Row: {
          barcode: string | null
          branch_id: string | null
          brand: string | null
          category: string
          created_at: string | null
          description: string | null
          featured: boolean | null
          features: string[] | null
          id: string
          images: string[] | null
          inventory_id: string | null
          name: string
          price: number
          sale_price: number | null
          sku: string
          status: string
          stock: number
          updated_at: string | null
        }
        Insert: {
          barcode?: string | null
          branch_id?: string | null
          brand?: string | null
          category: string
          created_at?: string | null
          description?: string | null
          featured?: boolean | null
          features?: string[] | null
          id?: string
          images?: string[] | null
          inventory_id?: string | null
          name: string
          price: number
          sale_price?: number | null
          sku: string
          status: string
          stock?: number
          updated_at?: string | null
        }
        Update: {
          barcode?: string | null
          branch_id?: string | null
          brand?: string | null
          category?: string
          created_at?: string | null
          description?: string | null
          featured?: boolean | null
          features?: string[] | null
          id?: string
          images?: string[] | null
          inventory_id?: string | null
          name?: string
          price?: number
          sale_price?: number | null
          sku?: string
          status?: string
          stock?: number
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "store_products_branch_id_fkey"
            columns: ["branch_id"]
            isOneToOne: false
            referencedRelation: "branches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "store_products_branch_id_fkey"
            columns: ["branch_id"]
            isOneToOne: false
            referencedRelation: "member_attendance_heatmap"
            referencedColumns: ["branch_id"]
          },
          {
            foreignKeyName: "store_products_inventory_id_fkey"
            columns: ["inventory_id"]
            isOneToOne: false
            referencedRelation: "inventory_alerts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "store_products_inventory_id_fkey"
            columns: ["inventory_id"]
            isOneToOne: false
            referencedRelation: "inventory_items"
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
          {
            foreignKeyName: "trainer_assignments_branch_id_fkey"
            columns: ["branch_id"]
            isOneToOne: false
            referencedRelation: "member_attendance_heatmap"
            referencedColumns: ["branch_id"]
          },
        ]
      }
      trainer_attendance: {
        Row: {
          branch_id: string
          check_in: string | null
          check_out: string | null
          created_at: string | null
          date: string
          id: string
          notes: string | null
          status: string | null
          trainer_id: string
          updated_at: string | null
        }
        Insert: {
          branch_id: string
          check_in?: string | null
          check_out?: string | null
          created_at?: string | null
          date?: string
          id?: string
          notes?: string | null
          status?: string | null
          trainer_id: string
          updated_at?: string | null
        }
        Update: {
          branch_id?: string
          check_in?: string | null
          check_out?: string | null
          created_at?: string | null
          date?: string
          id?: string
          notes?: string | null
          status?: string | null
          trainer_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "trainer_attendance_branch_id_fkey"
            columns: ["branch_id"]
            isOneToOne: false
            referencedRelation: "branches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "trainer_attendance_branch_id_fkey"
            columns: ["branch_id"]
            isOneToOne: false
            referencedRelation: "member_attendance_heatmap"
            referencedColumns: ["branch_id"]
          },
        ]
      }
      trainers: {
        Row: {
          avatar: string | null
          bio: string | null
          email: string
          id: string
          name: string
          phone: string | null
          rating: number | null
          role: string | null
          specialty: string | null
          status: string | null
        }
        Insert: {
          avatar?: string | null
          bio?: string | null
          email: string
          id: string
          name: string
          phone?: string | null
          rating?: number | null
          role?: string | null
          specialty?: string | null
          status?: string | null
        }
        Update: {
          avatar?: string | null
          bio?: string | null
          email?: string
          id?: string
          name?: string
          phone?: string | null
          rating?: number | null
          role?: string | null
          specialty?: string | null
          status?: string | null
        }
        Relationships: []
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
          {
            foreignKeyName: "transactions_branch_id_fkey"
            columns: ["branch_id"]
            isOneToOne: false
            referencedRelation: "member_attendance_heatmap"
            referencedColumns: ["branch_id"]
          },
        ]
      }
      webhook_logs: {
        Row: {
          branch_id: string | null
          created_at: string
          error: string | null
          event_type: string
          gateway: string
          id: string
          ip_address: string | null
          payload: Json
          processed_at: string | null
          signature: string | null
          status: string
          updated_at: string
        }
        Insert: {
          branch_id?: string | null
          created_at?: string
          error?: string | null
          event_type: string
          gateway: string
          id?: string
          ip_address?: string | null
          payload: Json
          processed_at?: string | null
          signature?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          branch_id?: string | null
          created_at?: string
          error?: string | null
          event_type?: string
          gateway?: string
          id?: string
          ip_address?: string | null
          payload?: Json
          processed_at?: string | null
          signature?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "webhook_logs_branch_id_fkey"
            columns: ["branch_id"]
            isOneToOne: false
            referencedRelation: "branches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "webhook_logs_branch_id_fkey"
            columns: ["branch_id"]
            isOneToOne: false
            referencedRelation: "member_attendance_heatmap"
            referencedColumns: ["branch_id"]
          },
        ]
      }
      whatsapp_templates: {
        Row: {
          branch_id: string | null
          category: string
          content: string
          created_at: string
          footer_text: string | null
          header_text: string | null
          id: string
          is_active: boolean
          name: string
          updated_at: string
          variables: Json | null
          whatsapp_template_name: string | null
        }
        Insert: {
          branch_id?: string | null
          category: string
          content: string
          created_at?: string
          footer_text?: string | null
          header_text?: string | null
          id?: string
          is_active?: boolean
          name: string
          updated_at?: string
          variables?: Json | null
          whatsapp_template_name?: string | null
        }
        Update: {
          branch_id?: string | null
          category?: string
          content?: string
          created_at?: string
          footer_text?: string | null
          header_text?: string | null
          id?: string
          is_active?: boolean
          name?: string
          updated_at?: string
          variables?: Json | null
          whatsapp_template_name?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "whatsapp_templates_branch_id_fkey"
            columns: ["branch_id"]
            isOneToOne: false
            referencedRelation: "branches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "whatsapp_templates_branch_id_fkey"
            columns: ["branch_id"]
            isOneToOne: false
            referencedRelation: "member_attendance_heatmap"
            referencedColumns: ["branch_id"]
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
      analytics_dashboard_stats: {
        Row: {
          active_members: number | null
          branch_id: string | null
          cancelled_members_monthly: number | null
          membership_revenue: number | null
          merchandise_revenue: number | null
          monthly_check_ins: number | null
          new_members_daily: number | null
          new_members_monthly: number | null
          new_members_weekly: number | null
          supplements_revenue: number | null
          total_revenue: number | null
          upcoming_renewals: number | null
          weekly_check_ins: number | null
        }
        Relationships: []
      }
      class_performance: {
        Row: {
          actual_attendance: number | null
          attendance_percentage: number | null
          branch_id: string | null
          capacity: number | null
          class_id: string | null
          class_name: string | null
          class_type: string | null
          enrolled: number | null
          enrollment_percentage: number | null
          performance_category: string | null
        }
        Relationships: [
          {
            foreignKeyName: "class_schedules_branch_id_fkey"
            columns: ["branch_id"]
            isOneToOne: false
            referencedRelation: "branches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "class_schedules_branch_id_fkey"
            columns: ["branch_id"]
            isOneToOne: false
            referencedRelation: "member_attendance_heatmap"
            referencedColumns: ["branch_id"]
          },
        ]
      }
      inventory_alerts: {
        Row: {
          branch_id: string | null
          id: string | null
          is_low_stock: boolean | null
          name: string | null
          quantity: number | null
          reorder_level: number | null
          stock_status: string | null
        }
        Insert: {
          branch_id?: string | null
          id?: string | null
          is_low_stock?: never
          name?: string | null
          quantity?: number | null
          reorder_level?: number | null
          stock_status?: never
        }
        Update: {
          branch_id?: string | null
          id?: string | null
          is_low_stock?: never
          name?: string | null
          quantity?: number | null
          reorder_level?: number | null
          stock_status?: never
        }
        Relationships: [
          {
            foreignKeyName: "inventory_items_branch_id_fkey"
            columns: ["branch_id"]
            isOneToOne: false
            referencedRelation: "branches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "inventory_items_branch_id_fkey"
            columns: ["branch_id"]
            isOneToOne: false
            referencedRelation: "member_attendance_heatmap"
            referencedColumns: ["branch_id"]
          },
        ]
      }
      member_attendance_heatmap: {
        Row: {
          attendance_count: number | null
          branch_id: string | null
          day_of_week: number | null
          hour_of_day: number | null
        }
        Relationships: []
      }
      member_churn_risk: {
        Row: {
          branch_id: string | null
          churn_risk_score: number | null
          days_since_last_visit: number | null
          days_until_expiry: number | null
          member_id: string | null
          member_name: string | null
          primary_risk_factor: string | null
          status: string | null
          visits_last_30_days: number | null
        }
        Relationships: [
          {
            foreignKeyName: "members_branch_id_fkey"
            columns: ["branch_id"]
            isOneToOne: false
            referencedRelation: "branches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "members_branch_id_fkey"
            columns: ["branch_id"]
            isOneToOne: false
            referencedRelation: "member_attendance_heatmap"
            referencedColumns: ["branch_id"]
          },
        ]
      }
      trainer_utilization: {
        Row: {
          branch_id: string | null
          minutes_utilized: number | null
          sessions_conducted: number | null
          total_capacity_minutes: number | null
          trainer_id: string | null
          trainer_name: string | null
          utilization_percentage: number | null
        }
        Relationships: [
          {
            foreignKeyName: "class_schedules_branch_id_fkey"
            columns: ["branch_id"]
            isOneToOne: false
            referencedRelation: "branches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "class_schedules_branch_id_fkey"
            columns: ["branch_id"]
            isOneToOne: false
            referencedRelation: "member_attendance_heatmap"
            referencedColumns: ["branch_id"]
          },
        ]
      }
    }
    Functions: {
      can_book_class: {
        Args: { user_uuid: string }
        Returns: boolean
      }
      get_attendance_trend: {
        Args: { branch_id_param: string; start_date: string; end_date: string }
        Returns: {
          date_point: string
          attendance_count: number
        }[]
      }
      get_membership_trend: {
        Args: { branch_id_param: string; start_date: string; end_date: string }
        Returns: {
          date_point: string
          new_members: number
          cancelled_members: number
          net_change: number
        }[]
      }
      get_revenue_breakdown: {
        Args: { branch_id_param: string; start_date: string; end_date: string }
        Returns: {
          category: string
          amount: number
        }[]
      }
      get_user_role: {
        Args: Record<PropertyKey, never> | { user_id: string }
        Returns: string
      }
      is_admin: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      trainer_is_assigned_to_member: {
        Args: { trainer_uuid: string; member_uuid: string }
        Returns: boolean
      }
      upsert_settings_batch: {
        Args: { settings_array: Json }
        Returns: undefined
      }
      user_belongs_to_branch: {
        Args: { branch_id: string }
        Returns: boolean
      }
      user_has_active_membership: {
        Args: { user_uuid: string }
        Returns: boolean
      }
      user_has_branch_access: {
        Args: { branch_id: string }
        Returns: boolean
      }
    }
    Enums: {
      class_status: "active" | "cancelled" | "completed"
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
    Enums: {
      class_status: ["active", "cancelled", "completed"],
    },
  },
} as const
