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
      activities: {
        Row: {
          average_cadence: number | null
          average_heartrate: number | null
          average_watts: number | null
          created_at: string
          distance_m: number | null
          duration_s: number | null
          external_id: string
          id: number
          max_heartrate: number | null
          name: string | null
          provider: string
          raw_data: Json | null
          start_date: string | null
          total_elevation_gain_m: number | null
          type: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          average_cadence?: number | null
          average_heartrate?: number | null
          average_watts?: number | null
          created_at?: string
          distance_m?: number | null
          duration_s?: number | null
          external_id: string
          id?: number
          max_heartrate?: number | null
          name?: string | null
          provider: string
          raw_data?: Json | null
          start_date?: string | null
          total_elevation_gain_m?: number | null
          type?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          average_cadence?: number | null
          average_heartrate?: number | null
          average_watts?: number | null
          created_at?: string
          distance_m?: number | null
          duration_s?: number | null
          external_id?: string
          id?: number
          max_heartrate?: number | null
          name?: string | null
          provider?: string
          raw_data?: Json | null
          start_date?: string | null
          total_elevation_gain_m?: number | null
          type?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "activities_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      external_connections: {
        Row: {
          created_at: string
          credentials: Json | null
          id: string
          provider: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          credentials?: Json | null
          id?: string
          provider: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          credentials?: Json | null
          id?: string
          provider?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      goals: {
        Row: {
          bike_distance_km: number | null
          bike_target_time: unknown | null
          created_at: string
          id: string
          priority: string | null
          race_date: string | null
          race_name: string | null
          run_distance_km: number | null
          run_target_time: unknown | null
          swim_distance_m: number | null
          swim_target_time: unknown | null
          total_target_time: unknown | null
          updated_at: string
          user_id: string
        }
        Insert: {
          bike_distance_km?: number | null
          bike_target_time?: unknown | null
          created_at?: string
          id?: string
          priority?: string | null
          race_date?: string | null
          race_name?: string | null
          run_distance_km?: number | null
          run_target_time?: unknown | null
          swim_distance_m?: number | null
          swim_target_time?: unknown | null
          total_target_time?: unknown | null
          updated_at?: string
          user_id: string
        }
        Update: {
          bike_distance_km?: number | null
          bike_target_time?: unknown | null
          created_at?: string
          id?: string
          priority?: string | null
          race_date?: string | null
          race_name?: string | null
          run_distance_km?: number | null
          run_target_time?: unknown | null
          swim_distance_m?: number | null
          swim_target_time?: unknown | null
          total_target_time?: unknown | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "goals_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      race_result_bulk_entry: {
        Row: {
          age: number | null
          bib_number: string | null
          bike_rank: number | null
          bike_time: unknown | null
          category: string | null
          category_rank: number | null
          club: string | null
          created_at: string | null
          gender: string | null
          id: string
          name: string | null
          overall_rank: number | null
          race_id: string
          residence: string | null
          run_rank: number | null
          run_time: unknown | null
          split_rank: number | null
          split_time: unknown | null
          swim_rank: number | null
          swim_time: unknown | null
          total_time: unknown | null
        }
        Insert: {
          age?: number | null
          bib_number?: string | null
          bike_rank?: number | null
          bike_time?: unknown | null
          category?: string | null
          category_rank?: number | null
          club?: string | null
          created_at?: string | null
          gender?: string | null
          id?: string
          name?: string | null
          overall_rank?: number | null
          race_id: string
          residence?: string | null
          run_rank?: number | null
          run_time?: unknown | null
          split_rank?: number | null
          split_time?: unknown | null
          swim_rank?: number | null
          swim_time?: unknown | null
          total_time?: unknown | null
        }
        Update: {
          age?: number | null
          bib_number?: string | null
          bike_rank?: number | null
          bike_time?: unknown | null
          category?: string | null
          category_rank?: number | null
          club?: string | null
          created_at?: string | null
          gender?: string | null
          id?: string
          name?: string | null
          overall_rank?: number | null
          race_id?: string
          residence?: string | null
          run_rank?: number | null
          run_time?: unknown | null
          split_rank?: number | null
          split_time?: unknown | null
          swim_rank?: number | null
          swim_time?: unknown | null
          total_time?: unknown | null
        }
        Relationships: []
      }
      users: {
        Row: {
          birth_date: string | null
          created_at: string
          email: string | null
          ftp: number | null
          gender: string | null
          id: string
          language: string | null
          name: string | null
          plan: string
          run_5k_time: unknown | null
          swim_400m_time: unknown | null
          timezone: string | null
          updated_at: string
          week_start_day: string
          weight_kg: number | null
        }
        Insert: {
          birth_date?: string | null
          created_at?: string
          email?: string | null
          ftp?: number | null
          gender?: string | null
          id: string
          language?: string | null
          name?: string | null
          plan?: string
          run_5k_time?: unknown | null
          swim_400m_time?: unknown | null
          timezone?: string | null
          updated_at?: string
          week_start_day?: string
          weight_kg?: number | null
        }
        Update: {
          birth_date?: string | null
          created_at?: string
          email?: string | null
          ftp?: number | null
          gender?: string | null
          id?: string
          language?: string | null
          name?: string | null
          plan?: string
          run_5k_time?: unknown | null
          swim_400m_time?: unknown | null
          timezone?: string | null
          updated_at?: string
          week_start_day?: string
          weight_kg?: number | null
        }
        Relationships: []
      }
      weekly_feedbacks: {
        Row: {
          created_at: string
          feedback_text: string | null
          id: string
          total_distance_km: number | null
          total_duration: unknown | null
          total_tss: number | null
          updated_at: string
          user_id: string
          week_start_date: string
        }
        Insert: {
          created_at?: string
          feedback_text?: string | null
          id?: string
          total_distance_km?: number | null
          total_duration?: unknown | null
          total_tss?: number | null
          updated_at?: string
          user_id: string
          week_start_date: string
        }
        Update: {
          created_at?: string
          feedback_text?: string | null
          id?: string
          total_distance_km?: number | null
          total_duration?: unknown | null
          total_tss?: number | null
          updated_at?: string
          user_id?: string
          week_start_date?: string
        }
        Relationships: [
          {
            foreignKeyName: "weekly_feedbacks_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
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
