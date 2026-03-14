export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      ad_events: {
        Row: {
          created_at: string | null
          event_type: string
          id: string
          page_path: string | null
          slot_id: string
          sponsor_name: string | null
        }
        Insert: {
          created_at?: string | null
          event_type: string
          id?: string
          page_path?: string | null
          slot_id: string
          sponsor_name?: string | null
        }
        Update: {
          created_at?: string | null
          event_type?: string
          id?: string
          page_path?: string | null
          slot_id?: string
          sponsor_name?: string | null
        }
        Relationships: []
      }
      ad_placements: {
        Row: {
          click_url: string
          created_at: string | null
          id: string
          image_url: string | null
          is_active: boolean | null
          priority: number | null
          slot_id: string
          sponsor_name: string
        }
        Insert: {
          click_url: string
          created_at?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          priority?: number | null
          slot_id: string
          sponsor_name: string
        }
        Update: {
          click_url?: string
          created_at?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          priority?: number | null
          slot_id?: string
          sponsor_name?: string
        }
        Relationships: []
      }
      ai_conversations: {
        Row: {
          context_data: Json | null
          conversation_thread_id: string | null
          created_at: string
          id: string
          message_content: string
          message_type: string
          patient_id: string
        }
        Insert: {
          context_data?: Json | null
          conversation_thread_id?: string | null
          created_at?: string
          id?: string
          message_content: string
          message_type: string
          patient_id: string
        }
        Update: {
          context_data?: Json | null
          conversation_thread_id?: string | null
          created_at?: string
          id?: string
          message_content?: string
          message_type?: string
          patient_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "ai_conversations_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
        ]
      }
      alert_escalation_rules: {
        Row: {
          created_at: string | null
          escalation_time_minutes: number
          id: string
          is_active: boolean | null
          notify_email: string[] | null
          reassign_to_role: string | null
          severity: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          escalation_time_minutes?: number
          id?: string
          is_active?: boolean | null
          notify_email?: string[] | null
          reassign_to_role?: string | null
          severity: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          escalation_time_minutes?: number
          id?: string
          is_active?: boolean | null
          notify_email?: string[] | null
          reassign_to_role?: string | null
          severity?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      alert_notifications_log: {
        Row: {
          alert_id: string | null
          created_at: string | null
          delivery_status: string | null
          error_message: string | null
          id: string
          notification_type: string
          recipient_email: string
          recipient_user_id: string | null
          resend_message_id: string | null
          sent_at: string | null
        }
        Insert: {
          alert_id?: string | null
          created_at?: string | null
          delivery_status?: string | null
          error_message?: string | null
          id?: string
          notification_type: string
          recipient_email: string
          recipient_user_id?: string | null
          resend_message_id?: string | null
          sent_at?: string | null
        }
        Update: {
          alert_id?: string | null
          created_at?: string | null
          delivery_status?: string | null
          error_message?: string | null
          id?: string
          notification_type?: string
          recipient_email?: string
          recipient_user_id?: string | null
          resend_message_id?: string | null
          sent_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "alert_notifications_log_alert_id_fkey"
            columns: ["alert_id"]
            isOneToOne: false
            referencedRelation: "scraping_alerts"
            referencedColumns: ["id"]
          },
        ]
      }
      alert_status_history: {
        Row: {
          alert_id: string
          created_at: string
          id: string
          new_status: Database["public"]["Enums"]["alert_status"]
          notes: string | null
          old_status: Database["public"]["Enums"]["alert_status"] | null
          user_id: string | null
        }
        Insert: {
          alert_id: string
          created_at?: string
          id?: string
          new_status: Database["public"]["Enums"]["alert_status"]
          notes?: string | null
          old_status?: Database["public"]["Enums"]["alert_status"] | null
          user_id?: string | null
        }
        Update: {
          alert_id?: string
          created_at?: string
          id?: string
          new_status?: Database["public"]["Enums"]["alert_status"]
          notes?: string | null
          old_status?: Database["public"]["Enums"]["alert_status"] | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "alert_status_history_alert_id_fkey"
            columns: ["alert_id"]
            isOneToOne: false
            referencedRelation: "scraping_alerts"
            referencedColumns: ["id"]
          },
        ]
      }
      appointments: {
        Row: {
          appointment_date: string
          appointment_type: string | null
          created_at: string
          duration_minutes: number | null
          id: string
          location: string | null
          notes: string | null
          patient_id: string
          provider_name: string
          provider_specialty: string | null
          reminder_sent: boolean | null
          status: string | null
          updated_at: string
        }
        Insert: {
          appointment_date: string
          appointment_type?: string | null
          created_at?: string
          duration_minutes?: number | null
          id?: string
          location?: string | null
          notes?: string | null
          patient_id: string
          provider_name: string
          provider_specialty?: string | null
          reminder_sent?: boolean | null
          status?: string | null
          updated_at?: string
        }
        Update: {
          appointment_date?: string
          appointment_type?: string | null
          created_at?: string
          duration_minutes?: number | null
          id?: string
          location?: string | null
          notes?: string | null
          patient_id?: string
          provider_name?: string
          provider_specialty?: string | null
          reminder_sent?: boolean | null
          status?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "appointments_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
        ]
      }
      beds: {
        Row: {
          assigned_at: string | null
          bed_number: string
          bed_type: string | null
          created_at: string
          department_id: string | null
          hospital_id: string
          id: string
          patient_id: string | null
          status: string | null
          updated_at: string
        }
        Insert: {
          assigned_at?: string | null
          bed_number: string
          bed_type?: string | null
          created_at?: string
          department_id?: string | null
          hospital_id: string
          id?: string
          patient_id?: string | null
          status?: string | null
          updated_at?: string
        }
        Update: {
          assigned_at?: string | null
          bed_number?: string
          bed_type?: string | null
          created_at?: string
          department_id?: string | null
          hospital_id?: string
          id?: string
          patient_id?: string | null
          status?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "beds_department_id_fkey"
            columns: ["department_id"]
            isOneToOne: false
            referencedRelation: "departments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "beds_hospital_id_fkey"
            columns: ["hospital_id"]
            isOneToOne: false
            referencedRelation: "hospitals"
            referencedColumns: ["id"]
          },
        ]
      }
      coding_audit_logs: {
        Row: {
          action_type: string
          ai_involved: boolean | null
          created_at: string
          encounter_id: string | null
          id: string
          new_value: Json | null
          original_value: Json | null
          reason: string | null
          user_id: string | null
        }
        Insert: {
          action_type: string
          ai_involved?: boolean | null
          created_at?: string
          encounter_id?: string | null
          id?: string
          new_value?: Json | null
          original_value?: Json | null
          reason?: string | null
          user_id?: string | null
        }
        Update: {
          action_type?: string
          ai_involved?: boolean | null
          created_at?: string
          encounter_id?: string | null
          id?: string
          new_value?: Json | null
          original_value?: Json | null
          reason?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "coding_audit_logs_encounter_id_fkey"
            columns: ["encounter_id"]
            isOneToOne: false
            referencedRelation: "patient_encounters"
            referencedColumns: ["id"]
          },
        ]
      }
      coding_suggestions: {
        Row: {
          accepted: boolean | null
          accepted_at: string | null
          accepted_by: string | null
          ai_model_version: string | null
          confidence_score: number | null
          created_at: string
          documentation_gaps: string[] | null
          encounter_id: string
          estimated_reimbursement_cents: number | null
          id: string
          reasoning: string | null
          suggested_drg_code: string | null
          suggested_primary_diagnosis: string | null
        }
        Insert: {
          accepted?: boolean | null
          accepted_at?: string | null
          accepted_by?: string | null
          ai_model_version?: string | null
          confidence_score?: number | null
          created_at?: string
          documentation_gaps?: string[] | null
          encounter_id: string
          estimated_reimbursement_cents?: number | null
          id?: string
          reasoning?: string | null
          suggested_drg_code?: string | null
          suggested_primary_diagnosis?: string | null
        }
        Update: {
          accepted?: boolean | null
          accepted_at?: string | null
          accepted_by?: string | null
          ai_model_version?: string | null
          confidence_score?: number | null
          created_at?: string
          documentation_gaps?: string[] | null
          encounter_id?: string
          estimated_reimbursement_cents?: number | null
          id?: string
          reasoning?: string | null
          suggested_drg_code?: string | null
          suggested_primary_diagnosis?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "coding_suggestions_encounter_id_fkey"
            columns: ["encounter_id"]
            isOneToOne: false
            referencedRelation: "patient_encounters"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "coding_suggestions_suggested_primary_diagnosis_fkey"
            columns: ["suggested_primary_diagnosis"]
            isOneToOne: false
            referencedRelation: "diagnosis_codes"
            referencedColumns: ["id"]
          },
        ]
      }
      cycle_indicators: {
        Row: {
          created_at: string
          current_phase: string
          cycle_type: string
          historical_context: Json | null
          id: string
          indicator_values: Json | null
          phase_start_date: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          current_phase: string
          cycle_type: string
          historical_context?: Json | null
          id?: string
          indicator_values?: Json | null
          phase_start_date: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          current_phase?: string
          cycle_type?: string
          historical_context?: Json | null
          id?: string
          indicator_values?: Json | null
          phase_start_date?: string
          updated_at?: string
        }
        Relationships: []
      }
      daily_briefings: {
        Row: {
          briefing_data: Json | null
          created_at: string
          id: string
          user_id: string
        }
        Insert: {
          briefing_data?: Json | null
          created_at?: string
          id?: string
          user_id: string
        }
        Update: {
          briefing_data?: Json | null
          created_at?: string
          id?: string
          user_id?: string
        }
        Relationships: []
      }
      departments: {
        Row: {
          bed_count: number | null
          created_at: string
          description: string | null
          head_user_id: string | null
          hospital_id: string
          id: string
          is_active: boolean | null
          name: string
          updated_at: string
        }
        Insert: {
          bed_count?: number | null
          created_at?: string
          description?: string | null
          head_user_id?: string | null
          hospital_id: string
          id?: string
          is_active?: boolean | null
          name: string
          updated_at?: string
        }
        Update: {
          bed_count?: number | null
          created_at?: string
          description?: string | null
          head_user_id?: string | null
          hospital_id?: string
          id?: string
          is_active?: boolean | null
          name?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "departments_hospital_id_fkey"
            columns: ["hospital_id"]
            isOneToOne: false
            referencedRelation: "hospitals"
            referencedColumns: ["id"]
          },
        ]
      }
      diagnosis_codes: {
        Row: {
          category: string | null
          created_at: string
          description: string
          drg_weight: number | null
          icd10_code: string
          id: string
          is_active: boolean | null
          severity_level: number | null
          updated_at: string
        }
        Insert: {
          category?: string | null
          created_at?: string
          description: string
          drg_weight?: number | null
          icd10_code: string
          id?: string
          is_active?: boolean | null
          severity_level?: number | null
          updated_at?: string
        }
        Update: {
          category?: string | null
          created_at?: string
          description?: string
          drg_weight?: number | null
          icd10_code?: string
          id?: string
          is_active?: boolean | null
          severity_level?: number | null
          updated_at?: string
        }
        Relationships: []
      }
      dip_analysis_history: {
        Row: {
          analysis_date: string
          created_at: string | null
          dip_quality_score: number | null
          id: string
          price: number | null
          recommendation: string | null
          symbol: string
        }
        Insert: {
          analysis_date: string
          created_at?: string | null
          dip_quality_score?: number | null
          id?: string
          price?: number | null
          recommendation?: string | null
          symbol: string
        }
        Update: {
          analysis_date?: string
          created_at?: string | null
          dip_quality_score?: number | null
          id?: string
          price?: number | null
          recommendation?: string | null
          symbol?: string
        }
        Relationships: []
      }
      dip_analysis_results: {
        Row: {
          analysis_date: string
          analysis_summary: string | null
          catalyst_data: Json | null
          catalyst_score: number | null
          confidence_level: number | null
          created_at: string | null
          current_price: number | null
          dip_quality_score: number
          dip_type: string
          id: string
          insider_data: Json | null
          insider_score: number | null
          key_opportunities: string[] | null
          key_risks: string[] | null
          market_cap: number | null
          options_data: Json | null
          options_flow_score: number | null
          price_change_percent: number | null
          recommendation: string
          rsi_score: number | null
          sector: string | null
          support_score: number | null
          symbol: string
          technical_data: Json | null
          trend_data: Json | null
          trend_score: number | null
          updated_at: string | null
          volume: number | null
          volume_data: Json | null
          volume_score: number | null
        }
        Insert: {
          analysis_date?: string
          analysis_summary?: string | null
          catalyst_data?: Json | null
          catalyst_score?: number | null
          confidence_level?: number | null
          created_at?: string | null
          current_price?: number | null
          dip_quality_score: number
          dip_type: string
          id?: string
          insider_data?: Json | null
          insider_score?: number | null
          key_opportunities?: string[] | null
          key_risks?: string[] | null
          market_cap?: number | null
          options_data?: Json | null
          options_flow_score?: number | null
          price_change_percent?: number | null
          recommendation: string
          rsi_score?: number | null
          sector?: string | null
          support_score?: number | null
          symbol: string
          technical_data?: Json | null
          trend_data?: Json | null
          trend_score?: number | null
          updated_at?: string | null
          volume?: number | null
          volume_data?: Json | null
          volume_score?: number | null
        }
        Update: {
          analysis_date?: string
          analysis_summary?: string | null
          catalyst_data?: Json | null
          catalyst_score?: number | null
          confidence_level?: number | null
          created_at?: string | null
          current_price?: number | null
          dip_quality_score?: number
          dip_type?: string
          id?: string
          insider_data?: Json | null
          insider_score?: number | null
          key_opportunities?: string[] | null
          key_risks?: string[] | null
          market_cap?: number | null
          options_data?: Json | null
          options_flow_score?: number | null
          price_change_percent?: number | null
          recommendation?: string
          rsi_score?: number | null
          sector?: string | null
          support_score?: number | null
          symbol?: string
          technical_data?: Json | null
          trend_data?: Json | null
          trend_score?: number | null
          updated_at?: string | null
          volume?: number | null
          volume_data?: Json | null
          volume_score?: number | null
        }
        Relationships: []
      }
      dip_watchlist: {
        Row: {
          alert_frequency: string | null
          created_at: string | null
          id: string
          is_active: boolean | null
          symbol: string
          target_dip_score: number | null
          user_id: string | null
        }
        Insert: {
          alert_frequency?: string | null
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          symbol: string
          target_dip_score?: number | null
          user_id?: string | null
        }
        Update: {
          alert_frequency?: string | null
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          symbol?: string
          target_dip_score?: number | null
          user_id?: string | null
        }
        Relationships: []
      }
      documentation_quality_metrics: {
        Row: {
          completeness_score: number | null
          consistency_score: number | null
          created_at: string
          encounter_id: string
          id: string
          improvement_suggestions: string[] | null
          missing_elements: string[] | null
          overall_score: number | null
          specificity_score: number | null
        }
        Insert: {
          completeness_score?: number | null
          consistency_score?: number | null
          created_at?: string
          encounter_id: string
          id?: string
          improvement_suggestions?: string[] | null
          missing_elements?: string[] | null
          overall_score?: number | null
          specificity_score?: number | null
        }
        Update: {
          completeness_score?: number | null
          consistency_score?: number | null
          created_at?: string
          encounter_id?: string
          id?: string
          improvement_suggestions?: string[] | null
          missing_elements?: string[] | null
          overall_score?: number | null
          specificity_score?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "documentation_quality_metrics_encounter_id_fkey"
            columns: ["encounter_id"]
            isOneToOne: false
            referencedRelation: "patient_encounters"
            referencedColumns: ["id"]
          },
        ]
      }
      drg_groups: {
        Row: {
          base_reimbursement_cents: number
          created_at: string
          description: string
          drg_code: string
          expected_los_days: number | null
          id: string
          is_active: boolean | null
          severity_modifier: number | null
          updated_at: string
        }
        Insert: {
          base_reimbursement_cents: number
          created_at?: string
          description: string
          drg_code: string
          expected_los_days?: number | null
          id?: string
          is_active?: boolean | null
          severity_modifier?: number | null
          updated_at?: string
        }
        Update: {
          base_reimbursement_cents?: number
          created_at?: string
          description?: string
          drg_code?: string
          expected_los_days?: number | null
          id?: string
          is_active?: boolean | null
          severity_modifier?: number | null
          updated_at?: string
        }
        Relationships: []
      }
      economic_events: {
        Row: {
          affected_sectors: Json | null
          confidence_score: number | null
          created_at: string
          description: string
          end_date: string | null
          event_type: string
          id: string
          impact_timeline: Json | null
          severity: number | null
          start_date: string
          updated_at: string
        }
        Insert: {
          affected_sectors?: Json | null
          confidence_score?: number | null
          created_at?: string
          description: string
          end_date?: string | null
          event_type: string
          id?: string
          impact_timeline?: Json | null
          severity?: number | null
          start_date: string
          updated_at?: string
        }
        Update: {
          affected_sectors?: Json | null
          confidence_score?: number | null
          created_at?: string
          description?: string
          end_date?: string | null
          event_type?: string
          id?: string
          impact_timeline?: Json | null
          severity?: number | null
          start_date?: string
          updated_at?: string
        }
        Relationships: []
      }
      economic_news: {
        Row: {
          ai_processed: boolean | null
          content: string | null
          created_at: string | null
          id: string
          keywords: string[] | null
          published_at: string | null
          scraped_at: string | null
          sentiment: string | null
          source: string
          summary: string | null
          symbols: string[] | null
          title: string
          updated_at: string | null
          url: string
        }
        Insert: {
          ai_processed?: boolean | null
          content?: string | null
          created_at?: string | null
          id?: string
          keywords?: string[] | null
          published_at?: string | null
          scraped_at?: string | null
          sentiment?: string | null
          source: string
          summary?: string | null
          symbols?: string[] | null
          title: string
          updated_at?: string | null
          url: string
        }
        Update: {
          ai_processed?: boolean | null
          content?: string | null
          created_at?: string | null
          id?: string
          keywords?: string[] | null
          published_at?: string | null
          scraped_at?: string | null
          sentiment?: string | null
          source?: string
          summary?: string | null
          symbols?: string[] | null
          title?: string
          updated_at?: string | null
          url?: string
        }
        Relationships: []
      }
      efficiency_metrics: {
        Row: {
          average_wait_time_minutes: number | null
          bed_occupancy_rate: number | null
          cost_per_patient_cents: number | null
          created_at: string
          department_id: string | null
          hospital_id: string
          id: string
          metric_date: string
          patient_satisfaction_score: number | null
          readmission_rate: number | null
          staff_utilization_rate: number | null
        }
        Insert: {
          average_wait_time_minutes?: number | null
          bed_occupancy_rate?: number | null
          cost_per_patient_cents?: number | null
          created_at?: string
          department_id?: string | null
          hospital_id: string
          id?: string
          metric_date: string
          patient_satisfaction_score?: number | null
          readmission_rate?: number | null
          staff_utilization_rate?: number | null
        }
        Update: {
          average_wait_time_minutes?: number | null
          bed_occupancy_rate?: number | null
          cost_per_patient_cents?: number | null
          created_at?: string
          department_id?: string | null
          hospital_id?: string
          id?: string
          metric_date?: string
          patient_satisfaction_score?: number | null
          readmission_rate?: number | null
          staff_utilization_rate?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "efficiency_metrics_department_id_fkey"
            columns: ["department_id"]
            isOneToOne: false
            referencedRelation: "departments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "efficiency_metrics_hospital_id_fkey"
            columns: ["hospital_id"]
            isOneToOne: false
            referencedRelation: "hospitals"
            referencedColumns: ["id"]
          },
        ]
      }
      email_report_configs: {
        Row: {
          created_at: string
          email: string
          frequency: string
          id: string
          is_active: boolean
          last_sent_at: string | null
          report_types: Json
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          email: string
          frequency: string
          id?: string
          is_active?: boolean
          last_sent_at?: string | null
          report_types?: Json
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          email?: string
          frequency?: string
          id?: string
          is_active?: boolean
          last_sent_at?: string | null
          report_types?: Json
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      encounter_diagnoses: {
        Row: {
          ai_suggested: boolean | null
          clinician_confirmed: boolean | null
          created_at: string
          diagnosis_code_id: string
          encounter_id: string
          id: string
          is_primary: boolean | null
          ruled_out: boolean | null
          sequence_number: number | null
        }
        Insert: {
          ai_suggested?: boolean | null
          clinician_confirmed?: boolean | null
          created_at?: string
          diagnosis_code_id: string
          encounter_id: string
          id?: string
          is_primary?: boolean | null
          ruled_out?: boolean | null
          sequence_number?: number | null
        }
        Update: {
          ai_suggested?: boolean | null
          clinician_confirmed?: boolean | null
          created_at?: string
          diagnosis_code_id?: string
          encounter_id?: string
          id?: string
          is_primary?: boolean | null
          ruled_out?: boolean | null
          sequence_number?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "encounter_diagnoses_diagnosis_code_id_fkey"
            columns: ["diagnosis_code_id"]
            isOneToOne: false
            referencedRelation: "diagnosis_codes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "encounter_diagnoses_encounter_id_fkey"
            columns: ["encounter_id"]
            isOneToOne: false
            referencedRelation: "patient_encounters"
            referencedColumns: ["id"]
          },
        ]
      }
      encounter_procedures: {
        Row: {
          ai_suggested: boolean | null
          clinician_confirmed: boolean | null
          created_at: string
          encounter_id: string
          id: string
          performed_date: string | null
          procedure_code_id: string
        }
        Insert: {
          ai_suggested?: boolean | null
          clinician_confirmed?: boolean | null
          created_at?: string
          encounter_id: string
          id?: string
          performed_date?: string | null
          procedure_code_id: string
        }
        Update: {
          ai_suggested?: boolean | null
          clinician_confirmed?: boolean | null
          created_at?: string
          encounter_id?: string
          id?: string
          performed_date?: string | null
          procedure_code_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "encounter_procedures_encounter_id_fkey"
            columns: ["encounter_id"]
            isOneToOne: false
            referencedRelation: "patient_encounters"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "encounter_procedures_procedure_code_id_fkey"
            columns: ["procedure_code_id"]
            isOneToOne: false
            referencedRelation: "procedure_codes"
            referencedColumns: ["id"]
          },
        ]
      }
      encounter_supplies: {
        Row: {
          created_at: string
          encounter_id: string
          id: string
          quantity: number
          supply_name: string
          total_cost_cents: number | null
          unit_cost_cents: number | null
        }
        Insert: {
          created_at?: string
          encounter_id: string
          id?: string
          quantity?: number
          supply_name: string
          total_cost_cents?: number | null
          unit_cost_cents?: number | null
        }
        Update: {
          created_at?: string
          encounter_id?: string
          id?: string
          quantity?: number
          supply_name?: string
          total_cost_cents?: number | null
          unit_cost_cents?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "encounter_supplies_encounter_id_fkey"
            columns: ["encounter_id"]
            isOneToOne: false
            referencedRelation: "patient_encounters"
            referencedColumns: ["id"]
          },
        ]
      }
      engagement: {
        Row: {
          content: string | null
          id: string
          metadata: Json | null
          stream_id: string
          timestamp: string
          tip_amount_cents: number | null
          type: string
          user_id: string
        }
        Insert: {
          content?: string | null
          id?: string
          metadata?: Json | null
          stream_id: string
          timestamp?: string
          tip_amount_cents?: number | null
          type: string
          user_id: string
        }
        Update: {
          content?: string | null
          id?: string
          metadata?: Json | null
          stream_id?: string
          timestamp?: string
          tip_amount_cents?: number | null
          type?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "engagement_stream_id_fkey"
            columns: ["stream_id"]
            isOneToOne: false
            referencedRelation: "streams"
            referencedColumns: ["id"]
          },
        ]
      }
      hospital_staff: {
        Row: {
          created_at: string
          department: string | null
          hospital_id: string
          id: string
          is_active: boolean | null
          role: Database["public"]["Enums"]["hospital_role"]
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          department?: string | null
          hospital_id: string
          id?: string
          is_active?: boolean | null
          role?: Database["public"]["Enums"]["hospital_role"]
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          department?: string | null
          hospital_id?: string
          id?: string
          is_active?: boolean | null
          role?: Database["public"]["Enums"]["hospital_role"]
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "hospital_staff_hospital_id_fkey"
            columns: ["hospital_id"]
            isOneToOne: false
            referencedRelation: "hospitals"
            referencedColumns: ["id"]
          },
        ]
      }
      hospitals: {
        Row: {
          address: string | null
          bed_count: number | null
          created_at: string
          email: string | null
          id: string
          is_active: boolean | null
          license_number: string | null
          name: string
          phone: string | null
          updated_at: string
        }
        Insert: {
          address?: string | null
          bed_count?: number | null
          created_at?: string
          email?: string | null
          id?: string
          is_active?: boolean | null
          license_number?: string | null
          name: string
          phone?: string | null
          updated_at?: string
        }
        Update: {
          address?: string | null
          bed_count?: number | null
          created_at?: string
          email?: string | null
          id?: string
          is_active?: boolean | null
          license_number?: string | null
          name?: string
          phone?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      insurance_claims: {
        Row: {
          billed_amount_cents: number
          claim_number: string
          covered_amount_cents: number | null
          created_at: string
          id: string
          insurance_provider: string
          notes: string | null
          patient_id: string
          patient_responsibility_cents: number | null
          prior_auth_number: string | null
          prior_auth_required: boolean | null
          provider_name: string
          service_date: string
          service_description: string | null
          status: string | null
          updated_at: string
        }
        Insert: {
          billed_amount_cents: number
          claim_number: string
          covered_amount_cents?: number | null
          created_at?: string
          id?: string
          insurance_provider: string
          notes?: string | null
          patient_id: string
          patient_responsibility_cents?: number | null
          prior_auth_number?: string | null
          prior_auth_required?: boolean | null
          provider_name: string
          service_date: string
          service_description?: string | null
          status?: string | null
          updated_at?: string
        }
        Update: {
          billed_amount_cents?: number
          claim_number?: string
          covered_amount_cents?: number | null
          created_at?: string
          id?: string
          insurance_provider?: string
          notes?: string | null
          patient_id?: string
          patient_responsibility_cents?: number | null
          prior_auth_number?: string | null
          prior_auth_required?: boolean | null
          provider_name?: string
          service_date?: string
          service_description?: string | null
          status?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "insurance_claims_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
        ]
      }
      medications: {
        Row: {
          created_at: string
          dosage: string
          end_date: string | null
          frequency: string
          id: string
          instructions: string | null
          is_active: boolean | null
          medication_name: string
          patient_id: string
          pharmacy_name: string | null
          pharmacy_phone: string | null
          prescribing_doctor: string | null
          refills_remaining: number | null
          start_date: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          dosage: string
          end_date?: string | null
          frequency: string
          id?: string
          instructions?: string | null
          is_active?: boolean | null
          medication_name: string
          patient_id: string
          pharmacy_name?: string | null
          pharmacy_phone?: string | null
          prescribing_doctor?: string | null
          refills_remaining?: number | null
          start_date: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          dosage?: string
          end_date?: string | null
          frequency?: string
          id?: string
          instructions?: string | null
          is_active?: boolean | null
          medication_name?: string
          patient_id?: string
          pharmacy_name?: string | null
          pharmacy_phone?: string | null
          prescribing_doctor?: string | null
          refills_remaining?: number | null
          start_date?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "medications_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
        ]
      }
      news_agent_runs: {
        Row: {
          articles_found: number
          articles_stored: number
          category: string
          completed_at: string | null
          error_message: string | null
          id: string
          run_type: string
          started_at: string
          status: string
        }
        Insert: {
          articles_found?: number
          articles_stored?: number
          category: string
          completed_at?: string | null
          error_message?: string | null
          id?: string
          run_type?: string
          started_at?: string
          status?: string
        }
        Update: {
          articles_found?: number
          articles_stored?: number
          category?: string
          completed_at?: string | null
          error_message?: string | null
          id?: string
          run_type?: string
          started_at?: string
          status?: string
        }
        Relationships: []
      }
      news_articles: {
        Row: {
          category: string
          content_preview: string | null
          created_at: string
          description: string | null
          fetched_at: string
          full_content: string | null
          id: string
          image_url: string | null
          is_breaking: boolean
          is_hero: boolean
          is_sponsored: boolean | null
          position_order: number
          published_at: string | null
          slug: string | null
          source: string
          sponsor_logo_url: string | null
          sponsor_name: string | null
          sponsor_url: string | null
          title: string
          updated_at: string
          urgency: string
          url: string
        }
        Insert: {
          category: string
          content_preview?: string | null
          created_at?: string
          description?: string | null
          fetched_at?: string
          full_content?: string | null
          id?: string
          image_url?: string | null
          is_breaking?: boolean
          is_hero?: boolean
          is_sponsored?: boolean | null
          position_order?: number
          published_at?: string | null
          slug?: string | null
          source: string
          sponsor_logo_url?: string | null
          sponsor_name?: string | null
          sponsor_url?: string | null
          title: string
          updated_at?: string
          urgency?: string
          url: string
        }
        Update: {
          category?: string
          content_preview?: string | null
          created_at?: string
          description?: string | null
          fetched_at?: string
          full_content?: string | null
          id?: string
          image_url?: string | null
          is_breaking?: boolean
          is_hero?: boolean
          is_sponsored?: boolean | null
          position_order?: number
          published_at?: string | null
          slug?: string | null
          source?: string
          sponsor_logo_url?: string | null
          sponsor_name?: string | null
          sponsor_url?: string | null
          title?: string
          updated_at?: string
          urgency?: string
          url?: string
        }
        Relationships: []
      }
      news_sources: {
        Row: {
          base_url: string
          created_at: string | null
          id: string
          is_active: boolean | null
          last_scraped_at: string | null
          name: string
          rss_url: string | null
          scrape_interval_minutes: number | null
          scrape_strategy: Json | null
          scrape_urls: string[]
          updated_at: string | null
        }
        Insert: {
          base_url: string
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          last_scraped_at?: string | null
          name: string
          rss_url?: string | null
          scrape_interval_minutes?: number | null
          scrape_strategy?: Json | null
          scrape_urls: string[]
          updated_at?: string | null
        }
        Update: {
          base_url?: string
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          last_scraped_at?: string | null
          name?: string
          rss_url?: string | null
          scrape_interval_minutes?: number | null
          scrape_strategy?: Json | null
          scrape_urls?: string[]
          updated_at?: string | null
        }
        Relationships: []
      }
      newsletter_subscribers: {
        Row: {
          email: string
          id: string
          source: string | null
          subscribed_at: string | null
        }
        Insert: {
          email: string
          id?: string
          source?: string | null
          subscribed_at?: string | null
        }
        Update: {
          email?: string
          id?: string
          source?: string | null
          subscribed_at?: string | null
        }
        Relationships: []
      }
      newsroom_article_updates: {
        Row: {
          actor: string | null
          article_id: string
          changed_fields: Json | null
          created_at: string
          id: string
          update_note: string | null
        }
        Insert: {
          actor?: string | null
          article_id: string
          changed_fields?: Json | null
          created_at?: string
          id?: string
          update_note?: string | null
        }
        Update: {
          actor?: string | null
          article_id?: string
          changed_fields?: Json | null
          created_at?: string
          id?: string
          update_note?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "newsroom_article_updates_article_id_fkey"
            columns: ["article_id"]
            isOneToOne: false
            referencedRelation: "newsroom_articles"
            referencedColumns: ["id"]
          },
        ]
      }
      newsroom_articles: {
        Row: {
          approved_by: string | null
          auto_published: boolean
          body: string | null
          canonical_url: string | null
          category: string | null
          cluster_id: string | null
          created_at: string
          created_by: string | null
          dek: string | null
          headline: string
          id: string
          og_image_url: string | null
          published_at: string | null
          scheduled_at: string | null
          seo_description: string | null
          seo_title: string | null
          slug: string | null
          status: string
          tags: string[] | null
          updated_at: string
        }
        Insert: {
          approved_by?: string | null
          auto_published?: boolean
          body?: string | null
          canonical_url?: string | null
          category?: string | null
          cluster_id?: string | null
          created_at?: string
          created_by?: string | null
          dek?: string | null
          headline: string
          id?: string
          og_image_url?: string | null
          published_at?: string | null
          scheduled_at?: string | null
          seo_description?: string | null
          seo_title?: string | null
          slug?: string | null
          status?: string
          tags?: string[] | null
          updated_at?: string
        }
        Update: {
          approved_by?: string | null
          auto_published?: boolean
          body?: string | null
          canonical_url?: string | null
          category?: string | null
          cluster_id?: string | null
          created_at?: string
          created_by?: string | null
          dek?: string | null
          headline?: string
          id?: string
          og_image_url?: string | null
          published_at?: string | null
          scheduled_at?: string | null
          seo_description?: string | null
          seo_title?: string | null
          slug?: string | null
          status?: string
          tags?: string[] | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "newsroom_articles_cluster_id_fkey"
            columns: ["cluster_id"]
            isOneToOne: false
            referencedRelation: "newsroom_clusters"
            referencedColumns: ["id"]
          },
        ]
      }
      newsroom_audit_logs: {
        Row: {
          action_type: string
          actor: string | null
          created_at: string
          id: string
          metadata: Json | null
          notes: string | null
          object_id: string
          object_type: string
          source_reference: string | null
        }
        Insert: {
          action_type: string
          actor?: string | null
          created_at?: string
          id?: string
          metadata?: Json | null
          notes?: string | null
          object_id: string
          object_type: string
          source_reference?: string | null
        }
        Update: {
          action_type?: string
          actor?: string | null
          created_at?: string
          id?: string
          metadata?: Json | null
          notes?: string | null
          object_id?: string
          object_type?: string
          source_reference?: string | null
        }
        Relationships: []
      }
      newsroom_cluster_signals: {
        Row: {
          added_at: string
          cluster_id: string
          id: string
          signal_id: string
        }
        Insert: {
          added_at?: string
          cluster_id: string
          id?: string
          signal_id: string
        }
        Update: {
          added_at?: string
          cluster_id?: string
          id?: string
          signal_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "newsroom_cluster_signals_cluster_id_fkey"
            columns: ["cluster_id"]
            isOneToOne: false
            referencedRelation: "newsroom_clusters"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "newsroom_cluster_signals_signal_id_fkey"
            columns: ["signal_id"]
            isOneToOne: false
            referencedRelation: "newsroom_signals"
            referencedColumns: ["id"]
          },
        ]
      }
      newsroom_clusters: {
        Row: {
          category: string | null
          confidence_score: number
          created_at: string
          first_seen_at: string
          id: string
          last_updated_at: string
          official_source_count: number
          risk_score: number
          source_count: number
          status: string
          working_summary: string | null
          working_title: string
        }
        Insert: {
          category?: string | null
          confidence_score?: number
          created_at?: string
          first_seen_at?: string
          id?: string
          last_updated_at?: string
          official_source_count?: number
          risk_score?: number
          source_count?: number
          status?: string
          working_summary?: string | null
          working_title: string
        }
        Update: {
          category?: string | null
          confidence_score?: number
          created_at?: string
          first_seen_at?: string
          id?: string
          last_updated_at?: string
          official_source_count?: number
          risk_score?: number
          source_count?: number
          status?: string
          working_summary?: string | null
          working_title?: string
        }
        Relationships: []
      }
      newsroom_publish_rules: {
        Row: {
          auto_publish_enabled: boolean
          category: string
          created_at: string
          id: string
          max_risk: number
          min_confidence: number
          min_official_sources: number
          min_sources: number
          updated_at: string
        }
        Insert: {
          auto_publish_enabled?: boolean
          category: string
          created_at?: string
          id?: string
          max_risk?: number
          min_confidence?: number
          min_official_sources?: number
          min_sources?: number
          updated_at?: string
        }
        Update: {
          auto_publish_enabled?: boolean
          category?: string
          created_at?: string
          id?: string
          max_risk?: number
          min_confidence?: number
          min_official_sources?: number
          min_sources?: number
          updated_at?: string
        }
        Relationships: []
      }
      newsroom_signals: {
        Row: {
          category: string | null
          cluster_id: string | null
          created_at: string
          entities_json: Json | null
          geography: string | null
          id: string
          ingested_at: string
          locations_json: Json | null
          normalized_text: string | null
          novelty_score: number | null
          processed: boolean
          published_at: string | null
          raw_body: string | null
          raw_title: string
          raw_url: string | null
          source_id: string | null
          urgency_score: number | null
        }
        Insert: {
          category?: string | null
          cluster_id?: string | null
          created_at?: string
          entities_json?: Json | null
          geography?: string | null
          id?: string
          ingested_at?: string
          locations_json?: Json | null
          normalized_text?: string | null
          novelty_score?: number | null
          processed?: boolean
          published_at?: string | null
          raw_body?: string | null
          raw_title: string
          raw_url?: string | null
          source_id?: string | null
          urgency_score?: number | null
        }
        Update: {
          category?: string | null
          cluster_id?: string | null
          created_at?: string
          entities_json?: Json | null
          geography?: string | null
          id?: string
          ingested_at?: string
          locations_json?: Json | null
          normalized_text?: string | null
          novelty_score?: number | null
          processed?: boolean
          published_at?: string | null
          raw_body?: string | null
          raw_title?: string
          raw_url?: string | null
          source_id?: string | null
          urgency_score?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_signal_cluster"
            columns: ["cluster_id"]
            isOneToOne: false
            referencedRelation: "newsroom_clusters"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "newsroom_signals_source_id_fkey"
            columns: ["source_id"]
            isOneToOne: false
            referencedRelation: "newsroom_sources"
            referencedColumns: ["id"]
          },
        ]
      }
      newsroom_sources: {
        Row: {
          active: boolean
          api_config: Json | null
          created_at: string
          credibility_weight: number
          feed_url: string | null
          id: string
          last_fetched_at: string | null
          name: string
          region: string | null
          topic_scope: string[] | null
          type: string
          updated_at: string
        }
        Insert: {
          active?: boolean
          api_config?: Json | null
          created_at?: string
          credibility_weight?: number
          feed_url?: string | null
          id?: string
          last_fetched_at?: string | null
          name: string
          region?: string | null
          topic_scope?: string[] | null
          type?: string
          updated_at?: string
        }
        Update: {
          active?: boolean
          api_config?: Json | null
          created_at?: string
          credibility_weight?: number
          feed_url?: string | null
          id?: string
          last_fetched_at?: string | null
          name?: string
          region?: string | null
          topic_scope?: string[] | null
          type?: string
          updated_at?: string
        }
        Relationships: []
      }
      newsroom_watchlists: {
        Row: {
          active: boolean
          category: string | null
          created_at: string
          entities: string[] | null
          geography: string | null
          id: string
          keywords: string[] | null
          label: string
          priority: number
          updated_at: string
        }
        Insert: {
          active?: boolean
          category?: string | null
          created_at?: string
          entities?: string[] | null
          geography?: string | null
          id?: string
          keywords?: string[] | null
          label: string
          priority?: number
          updated_at?: string
        }
        Update: {
          active?: boolean
          category?: string | null
          created_at?: string
          entities?: string[] | null
          geography?: string | null
          id?: string
          keywords?: string[] | null
          label?: string
          priority?: number
          updated_at?: string
        }
        Relationships: []
      }
      order_items: {
        Row: {
          created_at: string
          id: string
          order_id: string
          platform_item_id: string | null
          product_id: string | null
          quantity: number
          title: string
          total_price_cents: number
          unit_price_cents: number
        }
        Insert: {
          created_at?: string
          id?: string
          order_id: string
          platform_item_id?: string | null
          product_id?: string | null
          quantity?: number
          title: string
          total_price_cents: number
          unit_price_cents: number
        }
        Update: {
          created_at?: string
          id?: string
          order_id?: string
          platform_item_id?: string | null
          product_id?: string | null
          quantity?: number
          title?: string
          total_price_cents?: number
          unit_price_cents?: number
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
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          buyer_username: string | null
          created_at: string
          currency: string | null
          fees_cents: number | null
          id: string
          net_profit_cents: number | null
          order_date: string
          order_status: string | null
          payment_status: string | null
          platform_order_id: string
          shipping_cost_cents: number | null
          shipping_date: string | null
          shipping_status: string | null
          store_id: string
          total_amount_cents: number
        }
        Insert: {
          buyer_username?: string | null
          created_at?: string
          currency?: string | null
          fees_cents?: number | null
          id?: string
          net_profit_cents?: number | null
          order_date: string
          order_status?: string | null
          payment_status?: string | null
          platform_order_id: string
          shipping_cost_cents?: number | null
          shipping_date?: string | null
          shipping_status?: string | null
          store_id: string
          total_amount_cents: number
        }
        Update: {
          buyer_username?: string | null
          created_at?: string
          currency?: string | null
          fees_cents?: number | null
          id?: string
          net_profit_cents?: number | null
          order_date?: string
          order_status?: string | null
          payment_status?: string | null
          platform_order_id?: string
          shipping_cost_cents?: number | null
          shipping_date?: string | null
          shipping_status?: string | null
          store_id?: string
          total_amount_cents?: number
        }
        Relationships: [
          {
            foreignKeyName: "orders_store_id_fkey"
            columns: ["store_id"]
            isOneToOne: false
            referencedRelation: "stores"
            referencedColumns: ["id"]
          },
        ]
      }
      patient_encounters: {
        Row: {
          actual_reimbursement_cents: number | null
          admission_date: string
          chief_complaint: string | null
          created_at: string
          discharge_date: string | null
          discharge_summary: string | null
          documentation_quality:
            | Database["public"]["Enums"]["documentation_completeness"]
            | null
          documentation_quality_score: number | null
          estimated_reimbursement_cents: number | null
          history_present_illness: string | null
          hospital_id: string | null
          id: string
          patient_id: string
          physical_exam_findings: string | null
          status: Database["public"]["Enums"]["encounter_status"] | null
          total_cost_cents: number | null
          treatment_plan: string | null
          updated_at: string
        }
        Insert: {
          actual_reimbursement_cents?: number | null
          admission_date: string
          chief_complaint?: string | null
          created_at?: string
          discharge_date?: string | null
          discharge_summary?: string | null
          documentation_quality?:
            | Database["public"]["Enums"]["documentation_completeness"]
            | null
          documentation_quality_score?: number | null
          estimated_reimbursement_cents?: number | null
          history_present_illness?: string | null
          hospital_id?: string | null
          id?: string
          patient_id: string
          physical_exam_findings?: string | null
          status?: Database["public"]["Enums"]["encounter_status"] | null
          total_cost_cents?: number | null
          treatment_plan?: string | null
          updated_at?: string
        }
        Update: {
          actual_reimbursement_cents?: number | null
          admission_date?: string
          chief_complaint?: string | null
          created_at?: string
          discharge_date?: string | null
          discharge_summary?: string | null
          documentation_quality?:
            | Database["public"]["Enums"]["documentation_completeness"]
            | null
          documentation_quality_score?: number | null
          estimated_reimbursement_cents?: number | null
          history_present_illness?: string | null
          hospital_id?: string | null
          id?: string
          patient_id?: string
          physical_exam_findings?: string | null
          status?: Database["public"]["Enums"]["encounter_status"] | null
          total_cost_cents?: number | null
          treatment_plan?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "patient_encounters_hospital_id_fkey"
            columns: ["hospital_id"]
            isOneToOne: false
            referencedRelation: "hospitals"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "patient_encounters_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
        ]
      }
      patient_flow: {
        Row: {
          actual_discharge: string | null
          bed_id: string | null
          created_at: string
          department_id: string | null
          estimated_discharge: string | null
          hospital_id: string
          id: string
          patient_id: string
          priority_level: number | null
          status: string
          updated_at: string
          wait_time_minutes: number | null
        }
        Insert: {
          actual_discharge?: string | null
          bed_id?: string | null
          created_at?: string
          department_id?: string | null
          estimated_discharge?: string | null
          hospital_id: string
          id?: string
          patient_id: string
          priority_level?: number | null
          status: string
          updated_at?: string
          wait_time_minutes?: number | null
        }
        Update: {
          actual_discharge?: string | null
          bed_id?: string | null
          created_at?: string
          department_id?: string | null
          estimated_discharge?: string | null
          hospital_id?: string
          id?: string
          patient_id?: string
          priority_level?: number | null
          status?: string
          updated_at?: string
          wait_time_minutes?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "patient_flow_bed_id_fkey"
            columns: ["bed_id"]
            isOneToOne: false
            referencedRelation: "beds"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "patient_flow_department_id_fkey"
            columns: ["department_id"]
            isOneToOne: false
            referencedRelation: "departments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "patient_flow_hospital_id_fkey"
            columns: ["hospital_id"]
            isOneToOne: false
            referencedRelation: "hospitals"
            referencedColumns: ["id"]
          },
        ]
      }
      patients: {
        Row: {
          created_at: string
          date_of_birth: string | null
          email: string
          emergency_contact_name: string | null
          emergency_contact_phone: string | null
          first_name: string
          id: string
          insurance_policy_number: string | null
          insurance_provider: string | null
          last_name: string
          medical_record_number: string | null
          phone: string | null
          primary_care_provider: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          date_of_birth?: string | null
          email: string
          emergency_contact_name?: string | null
          emergency_contact_phone?: string | null
          first_name: string
          id?: string
          insurance_policy_number?: string | null
          insurance_provider?: string | null
          last_name: string
          medical_record_number?: string | null
          phone?: string | null
          primary_care_provider?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          date_of_birth?: string | null
          email?: string
          emergency_contact_name?: string | null
          emergency_contact_phone?: string | null
          first_name?: string
          id?: string
          insurance_policy_number?: string | null
          insurance_provider?: string | null
          last_name?: string
          medical_record_number?: string | null
          phone?: string | null
          primary_care_provider?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      predictions: {
        Row: {
          accuracy_score: number | null
          actual_impact: Json | null
          created_at: string
          event_id: string | null
          id: string
          predicted_impact: Json | null
          prediction_date: string
          trade_recommendations: Json | null
        }
        Insert: {
          accuracy_score?: number | null
          actual_impact?: Json | null
          created_at?: string
          event_id?: string | null
          id?: string
          predicted_impact?: Json | null
          prediction_date?: string
          trade_recommendations?: Json | null
        }
        Update: {
          accuracy_score?: number | null
          actual_impact?: Json | null
          created_at?: string
          event_id?: string | null
          id?: string
          predicted_impact?: Json | null
          prediction_date?: string
          trade_recommendations?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "predictions_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "economic_events"
            referencedColumns: ["id"]
          },
        ]
      }
      procedure_codes: {
        Row: {
          category: string | null
          cpt_code: string
          created_at: string
          description: string
          id: string
          is_active: boolean | null
          typical_cost_cents: number | null
          updated_at: string
        }
        Insert: {
          category?: string | null
          cpt_code: string
          created_at?: string
          description: string
          id?: string
          is_active?: boolean | null
          typical_cost_cents?: number | null
          updated_at?: string
        }
        Update: {
          category?: string | null
          cpt_code?: string
          created_at?: string
          description?: string
          id?: string
          is_active?: boolean | null
          typical_cost_cents?: number | null
          updated_at?: string
        }
        Relationships: []
      }
      products: {
        Row: {
          category: string | null
          condition: string | null
          created_at: string
          currency: string | null
          description: string | null
          id: string
          is_active: boolean | null
          platform_product_id: string
          price_cents: number | null
          quantity: number | null
          store_id: string
          title: string
          updated_at: string
        }
        Insert: {
          category?: string | null
          condition?: string | null
          created_at?: string
          currency?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          platform_product_id: string
          price_cents?: number | null
          quantity?: number | null
          store_id: string
          title: string
          updated_at?: string
        }
        Update: {
          category?: string | null
          condition?: string | null
          created_at?: string
          currency?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          platform_product_id?: string
          price_cents?: number | null
          quantity?: number | null
          store_id?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "products_store_id_fkey"
            columns: ["store_id"]
            isOneToOne: false
            referencedRelation: "stores"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          created_at: string | null
          display_name: string | null
          email: string | null
          id: string
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string | null
          display_name?: string | null
          email?: string | null
          id: string
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string | null
          display_name?: string | null
          email?: string | null
          id?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      quant_backtests: {
        Row: {
          completed_at: string | null
          created_at: string
          drawdown_curve: Json | null
          equity_curve: Json | null
          id: string
          metrics: Json | null
          run_config: Json
          started_at: string | null
          status: string
          strategy_id: string
          trades: Json | null
          user_id: string
        }
        Insert: {
          completed_at?: string | null
          created_at?: string
          drawdown_curve?: Json | null
          equity_curve?: Json | null
          id?: string
          metrics?: Json | null
          run_config?: Json
          started_at?: string | null
          status?: string
          strategy_id: string
          trades?: Json | null
          user_id: string
        }
        Update: {
          completed_at?: string | null
          created_at?: string
          drawdown_curve?: Json | null
          equity_curve?: Json | null
          id?: string
          metrics?: Json | null
          run_config?: Json
          started_at?: string | null
          status?: string
          strategy_id?: string
          trades?: Json | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "quant_backtests_strategy_id_fkey"
            columns: ["strategy_id"]
            isOneToOne: false
            referencedRelation: "quant_strategies"
            referencedColumns: ["id"]
          },
        ]
      }
      quant_paper_account: {
        Row: {
          cash_balance: number
          current_equity: number
          daily_pnl: number
          id: string
          is_active: boolean
          kill_switch_triggered: boolean
          last_updated: string
          max_drawdown_pct: number
          starting_capital: number
          strategy_id: string
          total_pnl: number
          user_id: string
        }
        Insert: {
          cash_balance?: number
          current_equity?: number
          daily_pnl?: number
          id?: string
          is_active?: boolean
          kill_switch_triggered?: boolean
          last_updated?: string
          max_drawdown_pct?: number
          starting_capital?: number
          strategy_id: string
          total_pnl?: number
          user_id: string
        }
        Update: {
          cash_balance?: number
          current_equity?: number
          daily_pnl?: number
          id?: string
          is_active?: boolean
          kill_switch_triggered?: boolean
          last_updated?: string
          max_drawdown_pct?: number
          starting_capital?: number
          strategy_id?: string
          total_pnl?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "quant_paper_account_strategy_id_fkey"
            columns: ["strategy_id"]
            isOneToOne: false
            referencedRelation: "quant_strategies"
            referencedColumns: ["id"]
          },
        ]
      }
      quant_paper_orders: {
        Row: {
          commission_cents: number | null
          created_at: string
          filled_at: string | null
          filled_price: number | null
          id: string
          order_type: string
          price: number | null
          quantity: number
          side: string
          slippage: number | null
          status: string
          strategy_id: string
          symbol: string
          user_id: string
        }
        Insert: {
          commission_cents?: number | null
          created_at?: string
          filled_at?: string | null
          filled_price?: number | null
          id?: string
          order_type?: string
          price?: number | null
          quantity: number
          side: string
          slippage?: number | null
          status?: string
          strategy_id: string
          symbol: string
          user_id: string
        }
        Update: {
          commission_cents?: number | null
          created_at?: string
          filled_at?: string | null
          filled_price?: number | null
          id?: string
          order_type?: string
          price?: number | null
          quantity?: number
          side?: string
          slippage?: number | null
          status?: string
          strategy_id?: string
          symbol?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "quant_paper_orders_strategy_id_fkey"
            columns: ["strategy_id"]
            isOneToOne: false
            referencedRelation: "quant_strategies"
            referencedColumns: ["id"]
          },
        ]
      }
      quant_paper_positions: {
        Row: {
          avg_entry_price: number
          closed_at: string | null
          current_price: number | null
          id: string
          opened_at: string
          quantity: number
          realized_pnl: number | null
          status: string
          strategy_id: string
          symbol: string
          unrealized_pnl: number | null
          user_id: string
        }
        Insert: {
          avg_entry_price?: number
          closed_at?: string | null
          current_price?: number | null
          id?: string
          opened_at?: string
          quantity?: number
          realized_pnl?: number | null
          status?: string
          strategy_id: string
          symbol: string
          unrealized_pnl?: number | null
          user_id: string
        }
        Update: {
          avg_entry_price?: number
          closed_at?: string | null
          current_price?: number | null
          id?: string
          opened_at?: string
          quantity?: number
          realized_pnl?: number | null
          status?: string
          strategy_id?: string
          symbol?: string
          unrealized_pnl?: number | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "quant_paper_positions_strategy_id_fkey"
            columns: ["strategy_id"]
            isOneToOne: false
            referencedRelation: "quant_strategies"
            referencedColumns: ["id"]
          },
        ]
      }
      quant_signals: {
        Row: {
          confidence: number | null
          entry_price: number | null
          expires_at: string | null
          generated_at: string
          id: string
          reasoning: string | null
          risk_reward: number | null
          signal_type: string
          status: string
          stop_loss: number | null
          strategy_id: string
          symbol: string
          target_price: number | null
          user_id: string
        }
        Insert: {
          confidence?: number | null
          entry_price?: number | null
          expires_at?: string | null
          generated_at?: string
          id?: string
          reasoning?: string | null
          risk_reward?: number | null
          signal_type?: string
          status?: string
          stop_loss?: number | null
          strategy_id: string
          symbol: string
          target_price?: number | null
          user_id: string
        }
        Update: {
          confidence?: number | null
          entry_price?: number | null
          expires_at?: string | null
          generated_at?: string
          id?: string
          reasoning?: string | null
          risk_reward?: number | null
          signal_type?: string
          status?: string
          stop_loss?: number | null
          strategy_id?: string
          symbol?: string
          target_price?: number | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "quant_signals_strategy_id_fkey"
            columns: ["strategy_id"]
            isOneToOne: false
            referencedRelation: "quant_strategies"
            referencedColumns: ["id"]
          },
        ]
      }
      quant_strategies: {
        Row: {
          created_at: string
          id: string
          is_active: boolean
          name: string
          parameters: Json
          risk_controls: Json
          strategy_type: string
          universe: string[]
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_active?: boolean
          name: string
          parameters?: Json
          risk_controls?: Json
          strategy_type?: string
          universe?: string[]
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          is_active?: boolean
          name?: string
          parameters?: Json
          risk_controls?: Json
          strategy_type?: string
          universe?: string[]
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      readmission_tracking: {
        Row: {
          created_at: string
          discharge_date: string
          hours_until_readmission: number | null
          id: string
          initial_encounter_id: string | null
          patient_id: string
          preventable: boolean | null
          readmission_date: string | null
          readmission_encounter_id: string | null
          risk_factors: string[] | null
          risk_level:
            | Database["public"]["Enums"]["readmission_risk_level"]
            | null
          risk_score: number | null
          root_cause: string | null
        }
        Insert: {
          created_at?: string
          discharge_date: string
          hours_until_readmission?: number | null
          id?: string
          initial_encounter_id?: string | null
          patient_id: string
          preventable?: boolean | null
          readmission_date?: string | null
          readmission_encounter_id?: string | null
          risk_factors?: string[] | null
          risk_level?:
            | Database["public"]["Enums"]["readmission_risk_level"]
            | null
          risk_score?: number | null
          root_cause?: string | null
        }
        Update: {
          created_at?: string
          discharge_date?: string
          hours_until_readmission?: number | null
          id?: string
          initial_encounter_id?: string | null
          patient_id?: string
          preventable?: boolean | null
          readmission_date?: string | null
          readmission_encounter_id?: string | null
          risk_factors?: string[] | null
          risk_level?:
            | Database["public"]["Enums"]["readmission_risk_level"]
            | null
          risk_score?: number | null
          root_cause?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "readmission_tracking_initial_encounter_id_fkey"
            columns: ["initial_encounter_id"]
            isOneToOne: false
            referencedRelation: "patient_encounters"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "readmission_tracking_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "readmission_tracking_readmission_encounter_id_fkey"
            columns: ["readmission_encounter_id"]
            isOneToOne: false
            referencedRelation: "patient_encounters"
            referencedColumns: ["id"]
          },
        ]
      }
      sales_analytics: {
        Row: {
          avg_order_value_cents: number | null
          created_at: string
          id: string
          metric_date: string
          metric_type: string
          net_profit_cents: number | null
          store_id: string
          total_fees_cents: number | null
          total_orders: number | null
          total_sales_cents: number | null
        }
        Insert: {
          avg_order_value_cents?: number | null
          created_at?: string
          id?: string
          metric_date: string
          metric_type: string
          net_profit_cents?: number | null
          store_id: string
          total_fees_cents?: number | null
          total_orders?: number | null
          total_sales_cents?: number | null
        }
        Update: {
          avg_order_value_cents?: number | null
          created_at?: string
          id?: string
          metric_date?: string
          metric_type?: string
          net_profit_cents?: number | null
          store_id?: string
          total_fees_cents?: number | null
          total_orders?: number | null
          total_sales_cents?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "sales_analytics_store_id_fkey"
            columns: ["store_id"]
            isOneToOne: false
            referencedRelation: "stores"
            referencedColumns: ["id"]
          },
        ]
      }
      scraping_alerts: {
        Row: {
          acknowledged_at: string | null
          acknowledged_by: string | null
          alert_type: string
          assigned_at: string | null
          assigned_by: string | null
          assigned_to: string | null
          created_at: string
          details: Json | null
          detected_at: string
          escalated: boolean | null
          escalated_to: string | null
          escalation_count: number | null
          id: string
          last_escalated_at: string | null
          message: string
          resolution_notes: string | null
          resolved_at: string | null
          resolved_by: string | null
          severity: Database["public"]["Enums"]["alert_severity"]
          status: Database["public"]["Enums"]["alert_status"]
          updated_at: string
        }
        Insert: {
          acknowledged_at?: string | null
          acknowledged_by?: string | null
          alert_type: string
          assigned_at?: string | null
          assigned_by?: string | null
          assigned_to?: string | null
          created_at?: string
          details?: Json | null
          detected_at?: string
          escalated?: boolean | null
          escalated_to?: string | null
          escalation_count?: number | null
          id?: string
          last_escalated_at?: string | null
          message: string
          resolution_notes?: string | null
          resolved_at?: string | null
          resolved_by?: string | null
          severity?: Database["public"]["Enums"]["alert_severity"]
          status?: Database["public"]["Enums"]["alert_status"]
          updated_at?: string
        }
        Update: {
          acknowledged_at?: string | null
          acknowledged_by?: string | null
          alert_type?: string
          assigned_at?: string | null
          assigned_by?: string | null
          assigned_to?: string | null
          created_at?: string
          details?: Json | null
          detected_at?: string
          escalated?: boolean | null
          escalated_to?: string | null
          escalation_count?: number | null
          id?: string
          last_escalated_at?: string | null
          message?: string
          resolution_notes?: string | null
          resolved_at?: string | null
          resolved_by?: string | null
          severity?: Database["public"]["Enums"]["alert_severity"]
          status?: Database["public"]["Enums"]["alert_status"]
          updated_at?: string
        }
        Relationships: []
      }
      scraping_logs: {
        Row: {
          articles_found: number | null
          created_at: string | null
          duplicates: number | null
          error_message: string | null
          execution_time_ms: number | null
          id: string
          new_articles: number | null
          source_id: string | null
          source_name: string
          status: string
          triggered_by: string | null
        }
        Insert: {
          articles_found?: number | null
          created_at?: string | null
          duplicates?: number | null
          error_message?: string | null
          execution_time_ms?: number | null
          id?: string
          new_articles?: number | null
          source_id?: string | null
          source_name: string
          status: string
          triggered_by?: string | null
        }
        Update: {
          articles_found?: number | null
          created_at?: string | null
          duplicates?: number | null
          error_message?: string | null
          execution_time_ms?: number | null
          id?: string
          new_articles?: number | null
          source_id?: string | null
          source_name?: string
          status?: string
          triggered_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "scraping_logs_source_id_fkey"
            columns: ["source_id"]
            isOneToOne: false
            referencedRelation: "news_sources"
            referencedColumns: ["id"]
          },
        ]
      }
      sector_impacts: {
        Row: {
          confidence: number | null
          created_at: string
          event_type: string
          historical_examples: Json | null
          id: string
          impact_direction: string | null
          impact_order: number
          sector: string
          typical_delay_days: number | null
        }
        Insert: {
          confidence?: number | null
          created_at?: string
          event_type: string
          historical_examples?: Json | null
          id?: string
          impact_direction?: string | null
          impact_order: number
          sector: string
          typical_delay_days?: number | null
        }
        Update: {
          confidence?: number | null
          created_at?: string
          event_type?: string
          historical_examples?: Json | null
          id?: string
          impact_direction?: string | null
          impact_order?: number
          sector?: string
          typical_delay_days?: number | null
        }
        Relationships: []
      }
      staffing_shifts: {
        Row: {
          created_at: string
          department_id: string | null
          hospital_id: string
          id: string
          patient_ratio: number | null
          shift_end: string
          shift_start: string
          shift_type: string | null
          staff_user_id: string
          status: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          department_id?: string | null
          hospital_id: string
          id?: string
          patient_ratio?: number | null
          shift_end: string
          shift_start: string
          shift_type?: string | null
          staff_user_id: string
          status?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          department_id?: string | null
          hospital_id?: string
          id?: string
          patient_ratio?: number | null
          shift_end?: string
          shift_start?: string
          shift_type?: string | null
          staff_user_id?: string
          status?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "staffing_shifts_department_id_fkey"
            columns: ["department_id"]
            isOneToOne: false
            referencedRelation: "departments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "staffing_shifts_hospital_id_fkey"
            columns: ["hospital_id"]
            isOneToOne: false
            referencedRelation: "hospitals"
            referencedColumns: ["id"]
          },
        ]
      }
      stores: {
        Row: {
          created_at: string
          id: string
          is_active: boolean | null
          last_sync_at: string | null
          platform: Database["public"]["Enums"]["platform_type"]
          store_identifier: string
          store_name: string
          sync_status: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_active?: boolean | null
          last_sync_at?: string | null
          platform: Database["public"]["Enums"]["platform_type"]
          store_identifier: string
          store_name: string
          sync_status?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          is_active?: boolean | null
          last_sync_at?: string | null
          platform?: Database["public"]["Enums"]["platform_type"]
          store_identifier?: string
          store_name?: string
          sync_status?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      stream_locations: {
        Row: {
          approximate_latitude: number | null
          approximate_longitude: number | null
          id: string
          is_live: boolean | null
          last_updated_at: string | null
          latitude: number
          location_consent: boolean | null
          longitude: number
          stream_title: string | null
          user_id: string
        }
        Insert: {
          approximate_latitude?: number | null
          approximate_longitude?: number | null
          id?: string
          is_live?: boolean | null
          last_updated_at?: string | null
          latitude: number
          location_consent?: boolean | null
          longitude: number
          stream_title?: string | null
          user_id: string
        }
        Update: {
          approximate_latitude?: number | null
          approximate_longitude?: number | null
          id?: string
          is_live?: boolean | null
          last_updated_at?: string | null
          latitude?: number
          location_consent?: boolean | null
          longitude?: number
          stream_title?: string | null
          user_id?: string
        }
        Relationships: []
      }
      streams: {
        Row: {
          created_at: string
          earnings_cents: number | null
          ended_at: string | null
          geohash: string | null
          hls_url: string | null
          hot_zone_id: string | null
          id: string
          is_crowdstream: boolean | null
          latitude: number | null
          longitude: number | null
          rtmp_url: string | null
          started_at: string | null
          status: string | null
          stream_key: string | null
          stream_title: string | null
          thumbnail_url: string | null
          total_views: number | null
          updated_at: string
          viewer_count: number | null
          walker_id: string
          webrtc_url: string | null
        }
        Insert: {
          created_at?: string
          earnings_cents?: number | null
          ended_at?: string | null
          geohash?: string | null
          hls_url?: string | null
          hot_zone_id?: string | null
          id?: string
          is_crowdstream?: boolean | null
          latitude?: number | null
          longitude?: number | null
          rtmp_url?: string | null
          started_at?: string | null
          status?: string | null
          stream_key?: string | null
          stream_title?: string | null
          thumbnail_url?: string | null
          total_views?: number | null
          updated_at?: string
          viewer_count?: number | null
          walker_id: string
          webrtc_url?: string | null
        }
        Update: {
          created_at?: string
          earnings_cents?: number | null
          ended_at?: string | null
          geohash?: string | null
          hls_url?: string | null
          hot_zone_id?: string | null
          id?: string
          is_crowdstream?: boolean | null
          latitude?: number | null
          longitude?: number | null
          rtmp_url?: string | null
          started_at?: string | null
          status?: string | null
          stream_key?: string | null
          stream_title?: string | null
          thumbnail_url?: string | null
          total_views?: number | null
          updated_at?: string
          viewer_count?: number | null
          walker_id?: string
          webrtc_url?: string | null
        }
        Relationships: []
      }
      subscribers: {
        Row: {
          created_at: string
          email: string
          id: string
          max_stores: number | null
          stripe_customer_id: string | null
          subscribed: boolean
          subscription_end: string | null
          subscription_tier:
            | Database["public"]["Enums"]["subscription_tier"]
            | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          max_stores?: number | null
          stripe_customer_id?: string | null
          subscribed?: boolean
          subscription_end?: string | null
          subscription_tier?:
            | Database["public"]["Enums"]["subscription_tier"]
            | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          max_stores?: number | null
          stripe_customer_id?: string | null
          subscribed?: boolean
          subscription_end?: string | null
          subscription_tier?:
            | Database["public"]["Enums"]["subscription_tier"]
            | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      telemetry: {
        Row: {
          altitude: number | null
          audio_level: number | null
          battery_level: number | null
          bitrate: number | null
          dropped_frames: number | null
          fps: number | null
          heading: number | null
          id: string
          latitude: number
          longitude: number
          signal_strength: number | null
          speed: number | null
          stream_id: string
          timestamp: string
        }
        Insert: {
          altitude?: number | null
          audio_level?: number | null
          battery_level?: number | null
          bitrate?: number | null
          dropped_frames?: number | null
          fps?: number | null
          heading?: number | null
          id?: string
          latitude: number
          longitude: number
          signal_strength?: number | null
          speed?: number | null
          stream_id: string
          timestamp?: string
        }
        Update: {
          altitude?: number | null
          audio_level?: number | null
          battery_level?: number | null
          bitrate?: number | null
          dropped_frames?: number | null
          fps?: number | null
          heading?: number | null
          id?: string
          latitude?: number
          longitude?: number
          signal_strength?: number | null
          speed?: number | null
          stream_id?: string
          timestamp?: string
        }
        Relationships: [
          {
            foreignKeyName: "telemetry_stream_id_fkey"
            columns: ["stream_id"]
            isOneToOne: false
            referencedRelation: "streams"
            referencedColumns: ["id"]
          },
        ]
      }
      tool_directory: {
        Row: {
          category: string | null
          created_at: string | null
          description: string | null
          id: string
          is_featured: boolean | null
          listing_tier: string | null
          logo_url: string | null
          name: string
          url: string
        }
        Insert: {
          category?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          is_featured?: boolean | null
          listing_tier?: string | null
          logo_url?: string | null
          name: string
          url: string
        }
        Update: {
          category?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          is_featured?: boolean | null
          listing_tier?: string | null
          logo_url?: string | null
          name?: string
          url?: string
        }
        Relationships: []
      }
      walker_profiles: {
        Row: {
          average_rating: number | null
          created_at: string
          device_capabilities: Json | null
          id: string
          is_available: boolean | null
          is_verified: boolean | null
          last_active_at: string | null
          preferred_zones: string[] | null
          reputation_score: number | null
          total_earnings_cents: number | null
          total_streams: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          average_rating?: number | null
          created_at?: string
          device_capabilities?: Json | null
          id?: string
          is_available?: boolean | null
          is_verified?: boolean | null
          last_active_at?: string | null
          preferred_zones?: string[] | null
          reputation_score?: number | null
          total_earnings_cents?: number | null
          total_streams?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          average_rating?: number | null
          created_at?: string
          device_capabilities?: Json | null
          id?: string
          is_available?: boolean | null
          is_verified?: boolean | null
          last_active_at?: string | null
          preferred_zones?: string[] | null
          reputation_score?: number | null
          total_earnings_cents?: number | null
          total_streams?: number | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      webhook_configs: {
        Row: {
          alert_on_consecutive_failures: boolean | null
          alert_on_execution_spike: boolean | null
          alert_on_low_success_rate: boolean | null
          created_at: string | null
          id: string
          is_active: boolean | null
          name: string
          service_type: string
          updated_at: string | null
          webhook_url: string
        }
        Insert: {
          alert_on_consecutive_failures?: boolean | null
          alert_on_execution_spike?: boolean | null
          alert_on_low_success_rate?: boolean | null
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          service_type: string
          updated_at?: string | null
          webhook_url: string
        }
        Update: {
          alert_on_consecutive_failures?: boolean | null
          alert_on_execution_spike?: boolean | null
          alert_on_low_success_rate?: boolean | null
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          service_type?: string
          updated_at?: string | null
          webhook_url?: string
        }
        Relationships: []
      }
      zones: {
        Row: {
          created_at: string
          east_lng: number
          expires_at: string | null
          id: string
          is_active: boolean | null
          metadata: Json | null
          name: string
          north_lat: number
          south_lat: number
          surge_multiplier: number | null
          type: string
          west_lng: number
        }
        Insert: {
          created_at?: string
          east_lng: number
          expires_at?: string | null
          id?: string
          is_active?: boolean | null
          metadata?: Json | null
          name: string
          north_lat: number
          south_lat: number
          surge_multiplier?: number | null
          type: string
          west_lng: number
        }
        Update: {
          created_at?: string
          east_lng?: number
          expires_at?: string | null
          id?: string
          is_active?: boolean | null
          metadata?: Json | null
          name?: string
          north_lat?: number
          south_lat?: number
          surge_multiplier?: number | null
          type?: string
          west_lng?: number
        }
        Relationships: []
      }
    }
    Views: {
      public_stream_locations: {
        Row: {
          id: string | null
          is_live: boolean | null
          last_updated_at: string | null
          latitude: number | null
          longitude: number | null
          stream_title: string | null
        }
        Insert: {
          id?: string | null
          is_live?: boolean | null
          last_updated_at?: string | null
          latitude?: number | null
          longitude?: number | null
          stream_title?: string | null
        }
        Update: {
          id?: string | null
          is_live?: boolean | null
          last_updated_at?: string | null
          latitude?: number | null
          longitude?: number | null
          stream_title?: string | null
        }
        Relationships: []
      }
      safe_profiles: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          display_name: string | null
          id: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          display_name?: string | null
          id?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          display_name?: string | null
          id?: string | null
        }
        Relationships: []
      }
      stream_engagement_stats: {
        Row: {
          comments: number | null
          likes: number | null
          stream_id: string | null
          tips: number | null
          total_interactions: number | null
          total_tips_cents: number | null
        }
        Relationships: [
          {
            foreignKeyName: "engagement_stream_id_fkey"
            columns: ["stream_id"]
            isOneToOne: false
            referencedRelation: "streams"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Functions: {
      check_rate_limit: {
        Args: {
          action_type: string
          max_actions?: number
          time_window?: string
          user_id: string
        }
        Returns: boolean
      }
      get_cron_jobs: {
        Args: never
        Returns: {
          active: boolean
          command: string
          jobid: number
          jobname: string
          schedule: string
        }[]
      }
      obfuscate_coordinates: {
        Args: { lat: number; lng: number }
        Returns: {
          obfuscated_lat: number
          obfuscated_lng: number
        }[]
      }
      toggle_cron_job: {
        Args: { is_active: boolean; job_id: number }
        Returns: undefined
      }
      validate_comment_content: { Args: { content: string }; Returns: boolean }
    }
    Enums: {
      alert_severity: "warning" | "error" | "critical"
      alert_status:
        | "pending"
        | "acknowledged"
        | "investigating"
        | "resolved"
        | "false_positive"
      documentation_completeness:
        | "incomplete"
        | "partial"
        | "complete"
        | "excellent"
      encounter_status:
        | "active"
        | "pending_coding"
        | "coded"
        | "submitted"
        | "paid"
        | "denied"
      hospital_role: "admin" | "department_head" | "nurse_manager" | "staff"
      platform_type: "ebay" | "amazon"
      readmission_risk_level: "low" | "medium" | "high" | "critical"
      subscription_tier: "free" | "pro" | "enterprise"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      alert_severity: ["warning", "error", "critical"],
      alert_status: [
        "pending",
        "acknowledged",
        "investigating",
        "resolved",
        "false_positive",
      ],
      documentation_completeness: [
        "incomplete",
        "partial",
        "complete",
        "excellent",
      ],
      encounter_status: [
        "active",
        "pending_coding",
        "coded",
        "submitted",
        "paid",
        "denied",
      ],
      hospital_role: ["admin", "department_head", "nurse_manager", "staff"],
      platform_type: ["ebay", "amazon"],
      readmission_risk_level: ["low", "medium", "high", "critical"],
      subscription_tier: ["free", "pro", "enterprise"],
    },
  },
} as const
