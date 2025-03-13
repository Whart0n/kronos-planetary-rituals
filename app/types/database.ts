export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

// Define zodiac sign types
export interface ZodiacInfo {
  sunSign: string;
  moonSign: string;
  risingSign: string;
}

// Define location type with zodiac information
export interface LocationInfo {
  latitude?: number;
  longitude?: number;
  city?: string;
  country?: string;
  timezone?: string;
  zodiac?: ZodiacInfo;
}

// Database types object for default export
const DatabaseTypes = {};

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
          location: LocationInfo | null;
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
          location?: LocationInfo | null;
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
          location?: LocationInfo | null;
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

// Type aliases for common database types
export type Profile = Database['public']['Tables']['profiles']['Row'];
export type RitualLog = Database['public']['Tables']['ritual_logs']['Row'];
export type Settings = Database['public']['Tables']['settings']['Row'];

// Type aliases for insert operations
export type ProfileInsert = Database['public']['Tables']['profiles']['Insert'];
export type RitualLogInsert = Database['public']['Tables']['ritual_logs']['Insert'];
export type SettingsInsert = Database['public']['Tables']['settings']['Insert'];

// Type aliases for update operations
export type ProfileUpdate = Database['public']['Tables']['profiles']['Update'];
export type RitualLogUpdate = Database['public']['Tables']['ritual_logs']['Update'];
export type SettingsUpdate = Database['public']['Tables']['settings']['Update'];

// Default export for the database types
export default DatabaseTypes;
