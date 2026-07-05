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
        }
        Insert: {
          name: string
          muscle_group: string
          difficulty?: string
          image_url?: string | null
          instructions?: string | null
          common_mistakes?: string | null
        }
        Update: {
          name?: string
          muscle_group?: string
          difficulty?: string
          image_url?: string | null
          instructions?: string | null
          common_mistakes?: string | null
        }
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
      }
      workouts_v5: {
        Row: {
          id: number
          profile_id: string
          start_time: string
          end_time: string | null
          notes: string | null
        }
        Insert: {
          profile_id: string
          start_time: string
          end_time?: string | null
          notes?: string | null
        }
        Update: {
          end_time?: string | null
          notes?: string | null
        }
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
      }
      achievements: { Row: any; Insert: any; Update: any }
      user_achievements: { Row: any; Insert: any; Update: any }
      martial_arts_exercises: { Row: any; Insert: any; Update: any }
      martial_arts_templates: { Row: any; Insert: any; Update: any }
      martial_arts_template_exercises: { Row: any; Insert: any; Update: any }
      muscle_focus_exercises: { Row: any; Insert: any; Update: any }
      muscle_focus_templates: { Row: any; Insert: any; Update: any }
      muscle_focus_template_exercises: { Row: any; Insert: any; Update: any }
      auxiliary_routines: { Row: any; Insert: any; Update: any }
      auxiliary_routine_exercises: { Row: any; Insert: any; Update: any }
      personal_records: { Row: any; Insert: any; Update: any }
      streaks: { Row: any; Insert: any; Update: any }
      body_metrics: { Row: any; Insert: any; Update: any }
      secrets: { Row: any; Insert: any; Update: any }
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
