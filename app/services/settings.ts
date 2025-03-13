import { supabase } from '../config/supabase';

export interface UserSettings {
  user_id: string;
  dark_mode: boolean;
  notifications: boolean;
  auto_detect_location: boolean;
  location: {
    latitude: number;
    longitude: number;
    timezone: string;
  };
  sound_enabled: boolean;
  haptic_feedback_enabled: boolean;
  language: string;
  units: string;
  theme: string;
  font_size: string;
}

// Service functions
export const getUserSettings = async (): Promise<UserSettings> => {
  try {
    const session = await supabase.auth.getSession();
    if (!session.data.session) {
      throw new Error('User not authenticated');
    }

    const { data, error } = await supabase
      .from('settings')
      .select('*')
      .eq('user_id', session.data.session.user.id)
      .single();

    if (error) {
      // If no settings exist, create default settings
      if (error.code === 'PGRST116') {
        const defaultSettings = {
          user_id: session.data.session.user.id,
          dark_mode: false,
          notifications: true,
          auto_detect_location: true,
          location: {
            latitude: 0,
            longitude: 0,
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
          },
          sound_enabled: true,
          haptic_feedback_enabled: true,
          language: 'en',
          units: 'metric',
          theme: 'light',
          font_size: 'medium'
        };
        
        // Create new settings in the database
        const { data: createdSettings, error: createError } = await supabase
          .from('settings')
          .insert(defaultSettings)
          .select()
          .single();
          
        if (createError) {
          console.error('Error creating default settings:', createError);
          return defaultSettings; // Return default settings even if saving fails
        }
        
        return createdSettings as UserSettings;
      } else {
        throw error;
      }
    }

    return data as UserSettings;
  } catch (error) {
    console.error('Error in getUserSettings:', error);
    // Return default settings on error to prevent app crashes
    return {
      user_id: 'unknown', // Cannot reference session here as it might be undefined
      dark_mode: false,
      notifications: true,
      auto_detect_location: true,
      location: {
        latitude: 0,
        longitude: 0,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
      },
      sound_enabled: true,
      haptic_feedback_enabled: true,
      language: 'en',
      units: 'metric',
      theme: 'light',
      font_size: 'medium'
    };
  }
};

export const updateUserSettings = async (settings: Partial<UserSettings>): Promise<UserSettings> => {
  try {
    const session = await supabase.auth.getSession();
    if (!session.data.session) {
      throw new Error('User not authenticated');
    }

    const { data, error } = await supabase
      .from('settings')
      .upsert({
        user_id: session.data.session.user.id,
        ...settings,
        updated_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) {
      throw error;
    }

    return data as UserSettings;
  } catch (error) {
    console.error('Error in updateUserSettings:', error);
    throw error;
  }
};

// Default export for Expo Router
const SettingsService = {
  getUserSettings,
  updateUserSettings
};

export default SettingsService;
