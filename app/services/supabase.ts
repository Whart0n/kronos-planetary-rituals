import { createClient } from '@supabase/supabase-js';
import Constants from 'expo-constants';
import type { 
  Database, 
  RitualLog, 
  RitualLogInsert, 
  Profile, 
  ProfileUpdate, 
  Settings, 
  SettingsUpdate 
} from '../types/database';

const { EXPO_PUBLIC_SUPABASE_URL, EXPO_PUBLIC_SUPABASE_ANON_KEY } = Constants.expoConfig?.extra || {};

// Initialize Supabase client
if (!EXPO_PUBLIC_SUPABASE_URL || !EXPO_PUBLIC_SUPABASE_ANON_KEY) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient<Database>(
  EXPO_PUBLIC_SUPABASE_URL,
  EXPO_PUBLIC_SUPABASE_ANON_KEY,
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: false,
    },
  }
);

// Ritual Logs
export const addRitualLog = async (ritualLog: Omit<RitualLogInsert, 'id' | 'created_at' | 'user_id'>) => {
  try {
    const { data: user } = await supabase.auth.getUser();
    if (!user?.user?.id) {
      throw new Error('User not authenticated');
    }

    const { data, error } = await supabase
      .from('ritual_logs')
      .insert({
        ...ritualLog,
        user_id: user.user.id,
        id: crypto.randomUUID(),
        completed_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error in addRitualLog:', error);
    throw error;
  }
};

export const getRitualLogs = async () => {
  try {
    const { data: user } = await supabase.auth.getUser();
    if (!user?.user?.id) {
      throw new Error('User not authenticated');
    }

    const { data, error } = await supabase
      .from('ritual_logs')
      .select('*')
      .eq('user_id', user.user.id)
      .order('completed_at', { ascending: false });

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error in getRitualLogs:', error);
    throw error;
  }
};

// Default profile data
export const defaultProfile: Omit<Profile, 'id'> = {
  updated_at: new Date().toISOString(),
  name: '',
  bio: '',
  avatar_url: '',
  level: 1,
  experience: 0,
  streak_days: 0,
  created_at: new Date().toISOString()
};

// User Profile
export const getUserProfile = async () => {
  try {
    const { data: user } = await supabase.auth.getUser();
    if (!user?.user?.id) {
      throw new Error('User not authenticated');
    }

    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.user.id)
      .single();

    if (error) {
      // If no profile exists, create one
      if (error.code === 'PGRST116') {
        const newProfile = {
          id: user.user.id,
          ...defaultProfile
        };
        
        const { data: createdProfile, error: createError } = await supabase
          .from('profiles')
          .insert(newProfile)
          .select()
          .single();
          
        if (createError) throw createError;
        return createdProfile;
      } else {
        throw error;
      }
    }
    
    return data;
  } catch (error) {
    console.error('Error in getUserProfile:', error);
    throw error;
  }
};

export const updateUserProfile = async (profile: Omit<ProfileUpdate, 'id' | 'updated_at'>) => {
  try {
    const { data: user } = await supabase.auth.getUser();
    if (!user?.user?.id) {
      throw new Error('User not authenticated');
    }

    const { data, error } = await supabase
      .from('profiles')
      .update({
        ...profile,
        updated_at: new Date().toISOString(),
      })
      .eq('id', user.user.id)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error in updateUserProfile:', error);
    throw error;
  }
};

// Default settings
export const defaultSettings: Omit<Settings, 'user_id'> = {
  dark_mode: false,
  notifications: true,
  auto_detect_location: true,
  location: null,
  sound_enabled: true,
  haptic_feedback_enabled: true,
  language: 'en',
  units: 'metric',
  theme: 'system',
  font_size: 'medium'
};

// Settings
export const getUserSettings = async () => {
  try {
    const { data: user } = await supabase.auth.getUser();
    if (!user?.user?.id) {
      throw new Error('User not authenticated');
    }

    const { data, error } = await supabase
      .from('settings')
      .select('*')
      .eq('user_id', user.user.id)
      .single();

    if (error) {
      // If no settings exist, create default settings
      if (error.code === 'PGRST116') {
        const newSettings = {
          id: crypto.randomUUID(),
          user_id: user.user.id,
          ...defaultSettings
        };
        
        const { data: createdSettings, error: createError } = await supabase
          .from('settings')
          .insert(newSettings)
          .select()
          .single();
          
        if (createError) throw createError;
        return createdSettings;
      } else {
        throw error;
      }
    }
    
    return data;
  } catch (error) {
    console.error('Error in getUserSettings:', error);
    throw error;
  }
};

export const updateUserSettings = async (settings: Omit<SettingsUpdate, 'user_id'>) => {
  try {
    const { data: user } = await supabase.auth.getUser();
    if (!user?.user?.id) {
      throw new Error('User not authenticated');
    }

    const { data: existingSettings } = await supabase
      .from('settings')
      .select('*')
      .eq('user_id', user.user.id)
      .single();

    if (existingSettings) {
      // Update existing settings
      const { data, error } = await supabase
        .from('settings')
        .update({
          ...settings,
          user_id: user.user.id,
        })
        .eq('user_id', user.user.id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } else {
      // Insert new settings
      const { data, error } = await supabase
        .from('settings')
        .insert({
          ...settings,
          user_id: user.user.id,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    }
  } catch (error) {
    console.error('Error in updateUserSettings:', error);
    throw error;
  }
};

// Create Supabase service object
const SupabaseService = {
  supabase,
  addRitualLog,
  getRitualLogs,
  getUserProfile,
  updateUserProfile,
  getUserSettings,
  updateUserSettings
};

// Default export for the Supabase service
export default SupabaseService;
