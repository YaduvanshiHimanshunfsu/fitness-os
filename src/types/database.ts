export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          name: string
          email: string
          avatar_url: string | null
          xp_total: number
          role: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          name: string
          email: string
          avatar_url?: string | null
          xp_total?: number
          role?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          email?: string
          avatar_url?: string | null
          xp_total?: number
          role?: string
          created_at?: string
          updated_at?: string
        }
        Relationships: any[]
      }
      exercises: {
        Row: {
          id: number
          name: string
          muscle_group: string
          difficulty: string
          image_url: string | null
          instructions: string | null
          common_mistakes: string | null
          created_at: string
          is_deleted: boolean
        }
        Insert: {
          name: string
          muscle_group: string
          difficulty?: string
          image_url?: string | null
          instructions?: string | null
          common_mistakes?: string | null
          created_at?: string
          is_deleted?: boolean
        }
        Update: {
          name?: string
          muscle_group?: string
          difficulty?: string
          image_url?: string | null
          instructions?: string | null
          common_mistakes?: string | null
          created_at?: string
          is_deleted?: boolean
        }
        Relationships: any[]
      }

      admin_logs: {
        Row: {
          id: number
          admin_id: string
          action: string
          details: string | null
          created_at: string
        }
        Insert: {
          admin_id: string
          action: string
          details?: string | null
        }
        Update: {
          action?: string
          details?: string | null
        }
        Relationships: any[]
      }
      app_settings: {
        Row: {
          id: number
          key: string
          value: any
          updated_at: string
        }
        Insert: {
          key: string
          value: any
        }
        Update: {
          value?: any
        }
        Relationships: any[]
      }
      workouts_v5: {
        Row: {
          id: string
          profile_id: string
          name: string
          start_time: string
          end_time: string
          xp_earned: number
          sets_skipped: number
          exercises_skipped: number
          estimated_calories: number
          created_at: string
        }
        Insert: any
        Update: any
        Relationships: any[]
      }
      workout_exercises_v5: {
        Row: {
          id: number
          workout_id: number
          exercise_id: number
          order_index: number
        }
        Insert: any
        Update: any
        Relationships: any[]
      }
      workout_sets_v5: {
        Row: {
          id: number
          workout_exercise_id: number
          weight_lbs: number
          reps: number
          completed: boolean
        }
        Insert: any
        Update: any
        Relationships: any[]
      }
      workout_templates: { Row: any; Insert: any; Update: any; Relationships: any[] }
      workout_template_exercises: { Row: any; Insert: any; Update: any; Relationships: any[] }
      achievements: { Row: any; Insert: any; Update: any; Relationships: any[] }
      user_achievements: { Row: any; Insert: any; Update: any
        Relationships: any[] }
      martial_arts_exercises: { Row: any; Insert: any; Update: any
        Relationships: any[] }
      martial_arts_templates: { Row: any; Insert: any; Update: any
        Relationships: any[] }
      martial_arts_template_exercises: { Row: any; Insert: any; Update: any
        Relationships: any[] }
      muscle_focus_exercises: { Row: any; Insert: any; Update: any
        Relationships: any[] }
      muscle_focus_templates: { Row: any; Insert: any; Update: any
        Relationships: any[] }
      muscle_focus_template_exercises: { Row: any; Insert: any; Update: any
        Relationships: any[] }
      auxiliary_routines: { Row: any; Insert: any; Update: any
        Relationships: any[] }
      auxiliary_routine_exercises: { Row: any; Insert: any; Update: any
        Relationships: any[] }
      personal_records: { Row: any; Insert: any; Update: any
        Relationships: any[] }
      streaks: { Row: any; Insert: any; Update: any
        Relationships: any[] }
      body_metrics: { Row: any; Insert: any; Update: any
        Relationships: any[] }
      secrets: { Row: any; Insert: any; Update: any
        Relationships: any[] }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      increment_xp: {
        Args: { amount: number }
        Returns: void
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
