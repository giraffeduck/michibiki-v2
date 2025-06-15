// src/lib/database.types.ts

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json }
  | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          name: string | null
          gender: string | null
          birth_date: string | null
          weight_kg: number
          ftp: number | null
          run_5k_time: string | null
          swim_400m_time: string | null
          week_start_day: string
          email: string | null
          timezone: string
        }
        Insert: {
          id: string
          name?: string | null
          gender?: string | null
          birth_date?: string | null
          weight_kg: number
          ftp?: number | null
          run_5k_time?: string | null
          swim_400m_time?: string | null
          week_start_day: string
          email?: string | null
          timezone: string
        }
        Update: Partial<Database['public']['Tables']['users']['Insert']>
      }
    }
    Views: Record<string, never>
    Functions: Record<string, never>
    Enums: Record<string, never>
  }
}
