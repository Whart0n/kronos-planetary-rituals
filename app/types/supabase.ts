export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

// Supabase types object for default export
const SupabaseTypes = {};

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          name: string | null;
          bio: string | null;
          avatar_url: string | null;
          level: number;
          experience: number;
          streak_days: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          name?: string | null;
          bio?: string | null;
          avatar_url?: string | null;
          level?: number;
          experience?: number;
          streak_days?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string | null;
          bio?: string | null;
          avatar_url?: string | null;
          level?: number;
          experience?: number;
          streak_days?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      ritual_logs: {
        Row: {
          id: string;
          user_id: string;
          ritual_id: string;
          completed_at: string;
          notes: string | null;
          rating: number | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          ritual_id: string;
          completed_at: string;
          notes?: string | null;
          rating?: number | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          ritual_id?: string;
          completed_at?: string;
          notes?: string | null;
          rating?: number | null;
          created_at?: string;
        };
      };
      settings: {
        Row: {
          user_id: string;
          dark_mode: boolean;
          notifications: boolean;
          auto_detect_location: boolean;
          location: Json | null;
          sound_enabled: boolean;
          haptic_feedback_enabled: boolean;
          language: string;
          units: string;
          theme: string;
          font_size: string;
        };
        Insert: {
          user_id: string;
          dark_mode?: boolean;
          notifications?: boolean;
          auto_detect_location?: boolean;
          location?: Json | null;
          sound_enabled?: boolean;
          haptic_feedback_enabled?: boolean;
          language?: string;
          units?: string;
          theme?: string;
          font_size?: string;
        };
        Update: {
          user_id?: string;
          dark_mode?: boolean;
          notifications?: boolean;
          auto_detect_location?: boolean;
          location?: Json | null;
          sound_enabled?: boolean;
          haptic_feedback_enabled?: boolean;
          language?: string;
          units?: string;
          theme?: string;
          font_size?: string;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
  };
}

// Default export for the supabase types
export default SupabaseTypes;
