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
      // Added other tables here to satisfy the typescript compiler for now
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
