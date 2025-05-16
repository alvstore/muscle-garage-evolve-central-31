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
      access_doors: {
        Row: {
          branch_id: string
          created_at: string | null
          device_id: string
          door_name: string
          door_number: string | null
          hikvision_door_id: string
          id: string
          is_active: boolean | null
          updated_at: string | null
          zone_id: string | null
        }
        Insert: {
          branch_id: string
          created_at?: string | null
          device_id: string
          door_name: string
          door_number?: string | null
          hikvision_door_id: string
          id?: string
          is_active?: boolean | null
          updated_at?: string | null
          zone_id?: string | null
        }
        Update: {
          branch_id?: string
          created_at?: string | null
          device_id?: string
          door_name?: string
          door_number?: string | null
          hikvision_door_id?: string
          id?: string
          is_active?: boolean | null
          updated_at?: string | null
          zone_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "access_doors_branch_id_fkey"
            columns: ["branch_id"]
            isOneToOne: false
            referencedRelation: "branches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "access_doors_zone_id_fkey"
            columns: ["zone_id"]
            isOneToOne: false
            referencedRelation: "access_zones"
            referencedColumns: ["id"]
          },
        ]
      }
      access_zones: {
        Row: {
          branch_id: string
          created_at: string | null
          description: string | null
          id: string
          name: string
          updated_at: string | null
        }
        Insert: {
          branch_id: string
          created_at?: string | null
          description?: string | null
          id?: string
          name: string
          updated_at?: string | null
        }
        Update: {
          branch_id?: string
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "access_zones_branch_id_fkey"
            columns: ["branch_id"]
            isOneToOne: false
            referencedRelation: "branches"
            referencedColumns: ["id"]
          },
        ]
      }
      announcements: {
        Row: {
          branch_id: string | null
          content: string
          created_at: string | null
          created_by: string | null
          expire_date: string | null
          id: string
          is_active: boolean | null
          publish_date: string
          target_audience: string[] | null
          title: string
          updated_at: string | null
        }
        Insert: {
          branch_id?: string | null
          content: string
          created_at?: string | null
          created_by?: string | null
          expire_date?: string | null
          id?: string
          is_active?: boolean | null
          publish_date?: string
          target_audience?: string[] | null
          title: string
          updated_at?: string | null
        }
        Update: {
          branch_id?: string | null
          content?: string
          created_at?: string | null
          created_by?: string | null
          expire_date?: string | null
          id?: string
          is_active?: boolean | null
          publish_date?: string
          target_audience?: string[] | null
          title?: string
          updated_at?: string | null
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
            foreignKeyName: "announcements_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      attendance: {
        Row: {
          branch_id: string
          check_in: string
          check_out: string | null
          class_id: string | null
          created_at: string | null
          id: string
          member_id: string
          notes: string | null
          updated_at: string | null
        }
        Insert: {
          branch_id: string
          check_in: string
          check_out?: string | null
          class_id?: string | null
          created_at?: string | null
          id?: string
          member_id: string
          notes?: string | null
          updated_at?: string | null
        }
        Update: {
          branch_id?: string
          check_in?: string
          check_out?: string | null
          class_id?: string | null
          created_at?: string | null
          id?: string
          member_id?: string
          notes?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "attendance_branch_id_fkey"
            columns: ["branch_id"]
            isOneToOne: false
            referencedRelation: "branches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "attendance_class_id_fkey"
            columns: ["class_id"]
            isOneToOne: false
            referencedRelation: "classes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "attendance_member_id_fkey"
            columns: ["member_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      branches: {
        Row: {
          address: string | null
          city: string | null
          created_at: string | null
          email: string | null
          id: string
          is_active: boolean | null
          name: string
          phone: string | null
          state: string | null
          updated_at: string | null
          zip_code: string | null
        }
        Insert: {
          address?: string | null
          city?: string | null
          created_at?: string | null
          email?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          phone?: string | null
          state?: string | null
          updated_at?: string | null
          zip_code?: string | null
        }
        Update: {
          address?: string | null
          city?: string | null
          created_at?: string | null
          email?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          phone?: string | null
          state?: string | null
          updated_at?: string | null
          zip_code?: string | null
        }
        Relationships: []
      }
      class_bookings: {
        Row: {
          class_id: string
          created_at: string | null
          id: string
          member_id: string
          status: string | null
          updated_at: string | null
        }
        Insert: {
          class_id: string
          created_at?: string | null
          id?: string
          member_id: string
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          class_id?: string
          created_at?: string | null
          id?: string
          member_id?: string
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
          {
            foreignKeyName: "class_bookings_member_id_fkey"
            columns: ["member_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      class_types: {
        Row: {
          branch_id: string | null
          color: string | null
          created_at: string | null
          description: string | null
          id: string
          name: string
          updated_at: string | null
        }
        Insert: {
          branch_id?: string | null
          color?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          name: string
          updated_at?: string | null
        }
        Update: {
          branch_id?: string | null
          color?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
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
        ]
      }
      classes: {
        Row: {
          branch_id: string
          class_type_id: string | null
          created_at: string | null
          description: string | null
          end_time: string
          id: string
          is_recurring: boolean | null
          max_capacity: number | null
          name: string
          recurring_pattern: Json | null
          start_time: string
          trainer_id: string | null
          updated_at: string | null
        }
        Insert: {
          branch_id: string
          class_type_id?: string | null
          created_at?: string | null
          description?: string | null
          end_time: string
          id?: string
          is_recurring?: boolean | null
          max_capacity?: number | null
          name: string
          recurring_pattern?: Json | null
          start_time: string
          trainer_id?: string | null
          updated_at?: string | null
        }
        Update: {
          branch_id?: string
          class_type_id?: string | null
          created_at?: string | null
          description?: string | null
          end_time?: string
          id?: string
          is_recurring?: boolean | null
          max_capacity?: number | null
          name?: string
          recurring_pattern?: Json | null
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
          {
            foreignKeyName: "classes_class_type_id_fkey"
            columns: ["class_type_id"]
            isOneToOne: false
            referencedRelation: "class_types"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "classes_trainer_id_fkey"
            columns: ["trainer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      communication_tasks: {
        Row: {
          assigned_to: string | null
          branch_id: string | null
          created_at: string | null
          created_by: string | null
          description: string | null
          due_date: string | null
          id: string
          priority: string | null
          status: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          assigned_to?: string | null
          branch_id?: string | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          due_date?: string | null
          id?: string
          priority?: string | null
          status?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          assigned_to?: string | null
          branch_id?: string | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          due_date?: string | null
          id?: string
          priority?: string | null
          status?: string | null
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "communication_tasks_assigned_to_fkey"
            columns: ["assigned_to"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "communication_tasks_branch_id_fkey"
            columns: ["branch_id"]
            isOneToOne: false
            referencedRelation: "branches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "communication_tasks_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      contacts: {
        Row: {
          branch_id: string | null
          created_at: string | null
          email: string
          id: string
          last_contact: string | null
          name: string
          notes: string | null
          phone: string | null
          source: string | null
          status: string | null
          tags: string[] | null
          updated_at: string | null
        }
        Insert: {
          branch_id?: string | null
          created_at?: string | null
          email: string
          id?: string
          last_contact?: string | null
          name: string
          notes?: string | null
          phone?: string | null
          source?: string | null
          status?: string | null
          tags?: string[] | null
          updated_at?: string | null
        }
        Update: {
          branch_id?: string | null
          created_at?: string | null
          email?: string
          id?: string
          last_contact?: string | null
          name?: string
          notes?: string | null
          phone?: string | null
          source?: string | null
          status?: string | null
          tags?: string[] | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "contacts_branch_id_fkey"
            columns: ["branch_id"]
            isOneToOne: false
            referencedRelation: "branches"
            referencedColumns: ["id"]
          },
        ]
      }
      deals: {
        Row: {
          branch_id: string | null
          closing_date: string | null
          contact: string | null
          contact_id: string | null
          created_at: string | null
          id: string
          notes: string | null
          owner_id: string | null
          probability: number | null
          stage: string
          title: string
          updated_at: string | null
          value: number
        }
        Insert: {
          branch_id?: string | null
          closing_date?: string | null
          contact?: string | null
          contact_id?: string | null
          created_at?: string | null
          id?: string
          notes?: string | null
          owner_id?: string | null
          probability?: number | null
          stage?: string
          title: string
          updated_at?: string | null
          value: number
        }
        Update: {
          branch_id?: string | null
          closing_date?: string | null
          contact?: string | null
          contact_id?: string | null
          created_at?: string | null
          id?: string
          notes?: string | null
          owner_id?: string | null
          probability?: number | null
          stage?: string
          title?: string
          updated_at?: string | null
          value?: number
        }
        Relationships: [
          {
            foreignKeyName: "deals_branch_id_fkey"
            columns: ["branch_id"]
            isOneToOne: false
            referencedRelation: "branches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "deals_contact_id_fkey"
            columns: ["contact_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "deals_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "profiles"
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
      expense_records: {
        Row: {
          amount: number
          branch_id: string
          category: string | null
          created_at: string | null
          date: string
          description: string | null
          id: string
          payment_method: string | null
          recorded_by: string | null
          reference: string | null
          status: string | null
          updated_at: string | null
          vendor: string | null
        }
        Insert: {
          amount: number
          branch_id: string
          category?: string | null
          created_at?: string | null
          date?: string
          description?: string | null
          id?: string
          payment_method?: string | null
          recorded_by?: string | null
          reference?: string | null
          status?: string | null
          updated_at?: string | null
          vendor?: string | null
        }
        Update: {
          amount?: number
          branch_id?: string
          category?: string | null
          created_at?: string | null
          date?: string
          description?: string | null
          id?: string
          payment_method?: string | null
          recorded_by?: string | null
          reference?: string | null
          status?: string | null
          updated_at?: string | null
          vendor?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "expense_records_branch_id_fkey"
            columns: ["branch_id"]
            isOneToOne: false
            referencedRelation: "branches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "expense_records_recorded_by_fkey"
            columns: ["recorded_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      feedback: {
        Row: {
          branch_id: string | null
          content: string
          created_at: string | null
          feedback_type: Database["public"]["Enums"]["feedback_type"]
          id: string
          member_id: string | null
          rating: number | null
          responded_at: string | null
          responded_by: string | null
          response: string | null
          status: string | null
          subject: string
          updated_at: string | null
        }
        Insert: {
          branch_id?: string | null
          content: string
          created_at?: string | null
          feedback_type?: Database["public"]["Enums"]["feedback_type"]
          id?: string
          member_id?: string | null
          rating?: number | null
          responded_at?: string | null
          responded_by?: string | null
          response?: string | null
          status?: string | null
          subject: string
          updated_at?: string | null
        }
        Update: {
          branch_id?: string | null
          content?: string
          created_at?: string | null
          feedback_type?: Database["public"]["Enums"]["feedback_type"]
          id?: string
          member_id?: string | null
          rating?: number | null
          responded_at?: string | null
          responded_by?: string | null
          response?: string | null
          status?: string | null
          subject?: string
          updated_at?: string | null
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
            foreignKeyName: "feedback_member_id_fkey"
            columns: ["member_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "feedback_responded_by_fkey"
            columns: ["responded_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      follow_up_history: {
        Row: {
          content: string | null
          created_at: string | null
          created_by: string | null
          id: string
          lead_id: string
          response: string | null
          response_at: string | null
          scheduled_at: string | null
          sent_at: string | null
          sent_by: string | null
          status: string | null
          subject: string | null
          template_id: string | null
          type: string
          updated_at: string | null
        }
        Insert: {
          content?: string | null
          created_at?: string | null
          created_by?: string | null
          id?: string
          lead_id: string
          response?: string | null
          response_at?: string | null
          scheduled_at?: string | null
          sent_at?: string | null
          sent_by?: string | null
          status?: string | null
          subject?: string | null
          template_id?: string | null
          type: string
          updated_at?: string | null
        }
        Update: {
          content?: string | null
          created_at?: string | null
          created_by?: string | null
          id?: string
          lead_id?: string
          response?: string | null
          response_at?: string | null
          scheduled_at?: string | null
          sent_at?: string | null
          sent_by?: string | null
          status?: string | null
          subject?: string | null
          template_id?: string | null
          type?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "follow_up_history_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
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
        ]
      }
      follow_up_templates: {
        Row: {
          branch_id: string | null
          content: string
          created_at: string | null
          created_by: string | null
          id: string
          name: string
          subject: string | null
          updated_at: string | null
        }
        Insert: {
          branch_id?: string | null
          content: string
          created_at?: string | null
          created_by?: string | null
          id?: string
          name: string
          subject?: string | null
          updated_at?: string | null
        }
        Update: {
          branch_id?: string | null
          content?: string
          created_at?: string | null
          created_by?: string | null
          id?: string
          name?: string
          subject?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "follow_up_templates_branch_id_fkey"
            columns: ["branch_id"]
            isOneToOne: false
            referencedRelation: "branches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "follow_up_templates_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      hikvision_api_settings: {
        Row: {
          api_url: string
          app_key: string
          app_secret: string
          branch_id: string
          created_at: string | null
          devices: Json | null
          id: string
          is_active: boolean | null
          updated_at: string | null
        }
        Insert: {
          api_url: string
          app_key: string
          app_secret: string
          branch_id: string
          created_at?: string | null
          devices?: Json | null
          id?: string
          is_active?: boolean | null
          updated_at?: string | null
        }
        Update: {
          api_url?: string
          app_key?: string
          app_secret?: string
          branch_id?: string
          created_at?: string | null
          devices?: Json | null
          id?: string
          is_active?: boolean | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "hikvision_api_settings_branch_id_fkey"
            columns: ["branch_id"]
            isOneToOne: true
            referencedRelation: "branches"
            referencedColumns: ["id"]
          },
        ]
      }
      hikvision_tokens: {
        Row: {
          access_token: string
          area_domain: string | null
          branch_id: string
          created_at: string | null
          expire_time: number
          id: string
        }
        Insert: {
          access_token: string
          area_domain?: string | null
          branch_id: string
          created_at?: string | null
          expire_time: number
          id?: string
        }
        Update: {
          access_token?: string
          area_domain?: string | null
          branch_id?: string
          created_at?: string | null
          expire_time?: number
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "hikvision_tokens_branch_id_fkey"
            columns: ["branch_id"]
            isOneToOne: true
            referencedRelation: "branches"
            referencedColumns: ["id"]
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
        ]
      }
      income_records: {
        Row: {
          amount: number
          branch_id: string
          category: string | null
          created_at: string | null
          date: string
          description: string | null
          id: string
          payment_method: string | null
          recorded_by: string | null
          reference: string | null
          source: string | null
          status: string | null
          updated_at: string | null
        }
        Insert: {
          amount: number
          branch_id: string
          category?: string | null
          created_at?: string | null
          date?: string
          description?: string | null
          id?: string
          payment_method?: string | null
          recorded_by?: string | null
          reference?: string | null
          source?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          amount?: number
          branch_id?: string
          category?: string | null
          created_at?: string | null
          date?: string
          description?: string | null
          id?: string
          payment_method?: string | null
          recorded_by?: string | null
          reference?: string | null
          source?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "income_records_branch_id_fkey"
            columns: ["branch_id"]
            isOneToOne: false
            referencedRelation: "branches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "income_records_category_fkey"
            columns: ["category"]
            isOneToOne: false
            referencedRelation: "income_categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "income_records_recorded_by_fkey"
            columns: ["recorded_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      invoices: {
        Row: {
          amount_paid: number | null
          amount_total: number
          branch_id: string
          created_at: string | null
          due_date: string | null
          id: string
          invoice_date: string
          invoice_number: string | null
          items: Json
          member_id: string
          membership_id: string | null
          status: string | null
          updated_at: string | null
        }
        Insert: {
          amount_paid?: number | null
          amount_total: number
          branch_id: string
          created_at?: string | null
          due_date?: string | null
          id?: string
          invoice_date?: string
          invoice_number?: string | null
          items?: Json
          member_id: string
          membership_id?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          amount_paid?: number | null
          amount_total?: number
          branch_id?: string
          created_at?: string | null
          due_date?: string | null
          id?: string
          invoice_date?: string
          invoice_number?: string | null
          items?: Json
          member_id?: string
          membership_id?: string | null
          status?: string | null
          updated_at?: string | null
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
            foreignKeyName: "invoices_member_id_fkey"
            columns: ["member_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invoices_membership_id_fkey"
            columns: ["membership_id"]
            isOneToOne: false
            referencedRelation: "member_memberships"
            referencedColumns: ["id"]
          },
        ]
      }
      leads: {
        Row: {
          assigned_to: string | null
          branch_id: string | null
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
          branch_id?: string | null
          conversion_date?: string | null
          conversion_value?: number | null
          created_at?: string | null
          email?: string | null
          follow_up_date?: string | null
          funnel_stage?: string
          id?: string
          interests?: string[] | null
          last_contact_date?: string | null
          name: string
          notes?: string | null
          phone?: string | null
          source: string
          status?: string
          tags?: string[] | null
          updated_at?: string | null
        }
        Update: {
          assigned_to?: string | null
          branch_id?: string | null
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
            foreignKeyName: "leads_branch_id_fkey"
            columns: ["branch_id"]
            isOneToOne: false
            referencedRelation: "branches"
            referencedColumns: ["id"]
          },
        ]
      }
      member_measurements: {
        Row: {
          arms: number | null
          body_fat_percentage: number | null
          chest: number | null
          created_at: string | null
          height: number | null
          hips: number | null
          id: string
          measurement_date: string
          member_id: string
          muscle_mass: number | null
          thighs: number | null
          updated_at: string | null
          waist: number | null
          weight: number | null
        }
        Insert: {
          arms?: number | null
          body_fat_percentage?: number | null
          chest?: number | null
          created_at?: string | null
          height?: number | null
          hips?: number | null
          id?: string
          measurement_date?: string
          member_id: string
          muscle_mass?: number | null
          thighs?: number | null
          updated_at?: string | null
          waist?: number | null
          weight?: number | null
        }
        Update: {
          arms?: number | null
          body_fat_percentage?: number | null
          chest?: number | null
          created_at?: string | null
          height?: number | null
          hips?: number | null
          id?: string
          measurement_date?: string
          member_id?: string
          muscle_mass?: number | null
          thighs?: number | null
          updated_at?: string | null
          waist?: number | null
          weight?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "member_measurements_member_id_fkey"
            columns: ["member_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      member_memberships: {
        Row: {
          branch_id: string
          created_at: string | null
          end_date: string
          id: string
          is_active: boolean | null
          member_id: string
          payment_status: string | null
          plan_id: string
          start_date: string
          updated_at: string | null
        }
        Insert: {
          branch_id: string
          created_at?: string | null
          end_date: string
          id?: string
          is_active?: boolean | null
          member_id: string
          payment_status?: string | null
          plan_id: string
          start_date?: string
          updated_at?: string | null
        }
        Update: {
          branch_id?: string
          created_at?: string | null
          end_date?: string
          id?: string
          is_active?: boolean | null
          member_id?: string
          payment_status?: string | null
          plan_id?: string
          start_date?: string
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
            foreignKeyName: "member_memberships_member_id_fkey"
            columns: ["member_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "member_memberships_plan_id_fkey"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "membership_plans"
            referencedColumns: ["id"]
          },
        ]
      }
      membership_plans: {
        Row: {
          branch_id: string | null
          created_at: string | null
          description: string | null
          duration_days: number
          features: Json | null
          id: string
          is_active: boolean | null
          is_recurring: boolean | null
          name: string
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
          is_recurring?: boolean | null
          name: string
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
          is_recurring?: boolean | null
          name?: string
          price?: number
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "membership_plans_branch_id_fkey"
            columns: ["branch_id"]
            isOneToOne: false
            referencedRelation: "branches"
            referencedColumns: ["id"]
          },
        ]
      }
      motivational_messages: {
        Row: {
          active: boolean | null
          author: string | null
          branch_id: string | null
          category: Database["public"]["Enums"]["motivational_category"]
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
          branch_id?: string | null
          category?: Database["public"]["Enums"]["motivational_category"]
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
          branch_id?: string | null
          category?: Database["public"]["Enums"]["motivational_category"]
          content?: string
          created_at?: string | null
          id?: string
          tags?: string[] | null
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "motivational_messages_branch_id_fkey"
            columns: ["branch_id"]
            isOneToOne: false
            referencedRelation: "branches"
            referencedColumns: ["id"]
          },
        ]
      }
      order_items: {
        Row: {
          created_at: string | null
          id: string
          order_id: string
          price_per_unit: number
          product_id: string
          quantity: number
          total_price: number
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          order_id: string
          price_per_unit: number
          product_id: string
          quantity: number
          total_price: number
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          order_id?: string
          price_per_unit?: number
          product_id?: string
          quantity?: number
          total_price?: number
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "order_items_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "store_products"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          branch_id: string
          completed_date: string | null
          created_at: string | null
          created_by: string | null
          id: string
          member_id: string | null
          notes: string | null
          order_date: string | null
          order_number: string | null
          payment_method: string | null
          status: string | null
          total_amount: number
          updated_at: string | null
        }
        Insert: {
          branch_id: string
          completed_date?: string | null
          created_at?: string | null
          created_by?: string | null
          id?: string
          member_id?: string | null
          notes?: string | null
          order_date?: string | null
          order_number?: string | null
          payment_method?: string | null
          status?: string | null
          total_amount: number
          updated_at?: string | null
        }
        Update: {
          branch_id?: string
          completed_date?: string | null
          created_at?: string | null
          created_by?: string | null
          id?: string
          member_id?: string | null
          notes?: string | null
          order_date?: string | null
          order_number?: string | null
          payment_method?: string | null
          status?: string | null
          total_amount?: number
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
            foreignKeyName: "orders_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orders_member_id_fkey"
            columns: ["member_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      payments: {
        Row: {
          amount: number
          branch_id: string
          created_at: string | null
          id: string
          invoice_id: string | null
          member_id: string
          payment_date: string
          payment_method: string | null
          payment_status: string | null
          transaction_id: string | null
          updated_at: string | null
        }
        Insert: {
          amount: number
          branch_id: string
          created_at?: string | null
          id?: string
          invoice_id?: string | null
          member_id: string
          payment_date?: string
          payment_method?: string | null
          payment_status?: string | null
          transaction_id?: string | null
          updated_at?: string | null
        }
        Update: {
          amount?: number
          branch_id?: string
          created_at?: string | null
          id?: string
          invoice_id?: string | null
          member_id?: string
          payment_date?: string
          payment_method?: string | null
          payment_status?: string | null
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
            foreignKeyName: "payments_invoice_id_fkey"
            columns: ["invoice_id"]
            isOneToOne: false
            referencedRelation: "invoices"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payments_member_id_fkey"
            columns: ["member_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          branch_id: string | null
          created_at: string | null
          email: string
          first_name: string | null
          id: string
          last_name: string | null
          phone: string | null
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          branch_id?: string | null
          created_at?: string | null
          email: string
          first_name?: string | null
          id: string
          last_name?: string | null
          phone?: string | null
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          branch_id?: string | null
          created_at?: string | null
          email?: string
          first_name?: string | null
          id?: string
          last_name?: string | null
          phone?: string | null
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
      reminder_rules: {
        Row: {
          branch_id: string | null
          created_at: string | null
          created_by: string | null
          days_before: number | null
          description: string | null
          event_type: string
          id: string
          is_active: boolean | null
          message_template: string
          name: string
          updated_at: string | null
        }
        Insert: {
          branch_id?: string | null
          created_at?: string | null
          created_by?: string | null
          days_before?: number | null
          description?: string | null
          event_type: string
          id?: string
          is_active?: boolean | null
          message_template: string
          name: string
          updated_at?: string | null
        }
        Update: {
          branch_id?: string | null
          created_at?: string | null
          created_by?: string | null
          days_before?: number | null
          description?: string | null
          event_type?: string
          id?: string
          is_active?: boolean | null
          message_template?: string
          name?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "reminder_rules_branch_id_fkey"
            columns: ["branch_id"]
            isOneToOne: false
            referencedRelation: "branches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reminder_rules_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      store_products: {
        Row: {
          branch_id: string | null
          category: string | null
          cost_price: number | null
          created_at: string | null
          description: string | null
          id: string
          image_url: string | null
          inventory_count: number | null
          is_active: boolean | null
          name: string
          price: number
          sku: string | null
          updated_at: string | null
        }
        Insert: {
          branch_id?: string | null
          category?: string | null
          cost_price?: number | null
          created_at?: string | null
          description?: string | null
          id?: string
          image_url?: string | null
          inventory_count?: number | null
          is_active?: boolean | null
          name: string
          price: number
          sku?: string | null
          updated_at?: string | null
        }
        Update: {
          branch_id?: string | null
          category?: string | null
          cost_price?: number | null
          created_at?: string | null
          description?: string | null
          id?: string
          image_url?: string | null
          inventory_count?: number | null
          is_active?: boolean | null
          name?: string
          price?: number
          sku?: string | null
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
        ]
      }
      user_roles: {
        Row: {
          branch_id: string | null
          created_at: string | null
          id: string
          role: Database["public"]["Enums"]["user_role"]
          updated_at: string | null
          user_id: string
        }
        Insert: {
          branch_id?: string | null
          created_at?: string | null
          id?: string
          role: Database["public"]["Enums"]["user_role"]
          updated_at?: string | null
          user_id: string
        }
        Update: {
          branch_id?: string | null
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_roles_branch_id_fkey"
            columns: ["branch_id"]
            isOneToOne: false
            referencedRelation: "branches"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      user_has_role: {
        Args: {
          user_id: string
          check_role: Database["public"]["Enums"]["user_role"]
        }
        Returns: boolean
      }
    }
    Enums: {
      feedback_type:
        | "suggestion"
        | "complaint"
        | "praise"
        | "question"
        | "other"
      motivational_category:
        | "fitness"
        | "health"
        | "nutrition"
        | "mindfulness"
        | "general"
      user_role: "admin" | "manager" | "staff" | "member" | "trainer"
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
      feedback_type: ["suggestion", "complaint", "praise", "question", "other"],
      motivational_category: [
        "fitness",
        "health",
        "nutrition",
        "mindfulness",
        "general",
      ],
      user_role: ["admin", "manager", "staff", "member", "trainer"],
    },
  },
} as const
