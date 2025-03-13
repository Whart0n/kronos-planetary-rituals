import { create } from 'zustand';
import { getUserSettings, updateUserSettings, getDefaultSettings, supabase } from '../services/supabase';
import { storeEvents } from './events';

// Import Settings type from database.ts
import type { Settings } from '../app/types/database';

interface SettingsState {
  settings: Settings | null;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  initializeSettings: () => Promise<void>;
  updateSettings: (newSettings: Partial<Settings>) => Promise<void>;
  resetSettings: () => Promise<void>;
  fetchSettings: () => Promise<void>;
}



export const useSettingsStore = create<SettingsState>((set, get) => {
  // Subscribe to auth events
  storeEvents.on('auth:initialized', () => get().fetchSettings());
  storeEvents.on('auth:login', () => get().fetchSettings());
  storeEvents.on('auth:logout', () => set({ settings: null }));

  return {
    settings: null,
    isLoading: false,
    error: null,
  
    fetchSettings: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        // Silently use default settings when not authenticated
        set({ settings: getDefaultSettings('default'), isLoading: false, error: null });
        return;
      }
    
      set({ isLoading: true, error: null });
      try {
        const { data, error } = await getUserSettings(user.id);
        if (error) {
          // For new users or no settings found, use defaults
          // Check if it's a Postgres error with code PGRST116 (no rows returned)
          if (error && typeof error === 'object' && 'code' in error && error.code === 'PGRST116') {
            set({ settings: getDefaultSettings(user.id) });
            return;
          }
          throw error;
        }
        
        set({ settings: data || getDefaultSettings(user.id) });
      } catch (error) {
        // Don't set error state for authentication issues
        if (error instanceof Error && error.message !== 'User not authenticated') {
          set({ error: error instanceof Error ? error.message : 'Failed to fetch settings' });
        }
        console.error('Error fetching settings:', error);
        // Fall back to default settings
        set({ settings: getDefaultSettings('default') });
      } finally {
        set({ isLoading: false });
      }
    },
  
    initializeSettings: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        set({ settings: getDefaultSettings('default') });
        return;
      }
      
      await get().fetchSettings();
    },
  
    updateSettings: async (newSettings) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      
      set({ isLoading: true, error: null });
      try {
        const { data, error } = await updateUserSettings(user.id, newSettings);
        if (error) throw error;
        
        // Ensure all required fields are present in the data
        const completeSettings: Settings = {
          ...getDefaultSettings(user.id),
          ...data as Partial<Settings>
        };
        set({ settings: completeSettings });
      } catch (error) {
        set({ error: error instanceof Error ? error.message : 'Failed to update settings' });
        console.error('Error updating settings:', error);
      } finally {
        set({ isLoading: false });
      }
    },
  
    resetSettings: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        set({ settings: getDefaultSettings('default') });
        return;
      }
      
      await get().updateSettings(getDefaultSettings(user.id));
    }
  };
});