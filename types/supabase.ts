export interface Profile {
  id?: string;
  name: string;
  bio: string | null;
  avatar_url: string | null;
  level: number;
  experience: number;
  streak_days: number;
  created_at: string;
  updated_at: string;
}

export interface RitualLog {
  id?: string;
  user_id: string;
  ritual_id: string;
  completed_at: string;
  notes?: string | null;
  rating?: number | null;
  created_at: string;
}

export interface Settings {
  user_id: string;
  dark_mode: boolean;
  notifications: boolean;
  auto_detect_location: boolean;
  location: {
    latitude: number;
    longitude: number;
  } | null;
  sound_enabled: boolean;
  haptic_feedback_enabled: boolean;
  language: string;
  units: string;
  theme: string;
  font_size: string;
}
