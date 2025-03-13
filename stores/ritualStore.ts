import { create } from 'zustand';
import { createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ritual, RitualLog } from '@/types';
import { getRitualLogs, addRitualLog } from '@/services/supabase';
import { useAuthStore } from './authStore';
import { ritualData } from '@/constants/rituals';
import uuid from '@/utils/uuid';

interface CompletedRitual {
  id: string;
  ritualId: string;
  name: string;
  completedAt: Date;
  notes: string;
  rating: number;
}

const mockCompletedRituals: CompletedRitual[] = [];

interface RitualState {
  rituals: Ritual[];
  completedRituals: RitualLog[];
  loading: boolean;
  error: string | null;
  
  // Actions
  fetchRituals: () => Promise<void>;
  fetchCompletedRituals: () => Promise<void>;
  completeRitual: (ritualData: { id: string, planetId: string, completedAt: string, notes?: string, rating?: number }) => Promise<void>;
  getRitualById: (id: string) => Ritual | undefined;
}



export const useRitualStore = create<RitualState>()((set, get) => ({
  rituals: [],
  completedRituals: [],
  loading: false,
  error: null,
      
  fetchRituals: async () => {
    try {
      set({ loading: true, error: null });
      // Use rituals from constants
      set({ rituals: ritualData, loading: false });
    } catch (error: any) {
      console.error('Error fetching rituals:', error);
      set({ error: 'Failed to fetch rituals', loading: false });
    }
  },
      
      fetchCompletedRituals: async () => {
        try {
          set({ loading: true, error: null });
          
          const user = useAuthStore.getState().user;
          if (!user) {
            // If no user is logged in, use mock data
            set({ completedRituals: mockCompletedRituals, loading: false });
            return;
          }
          
          // If user is logged in, try to get ritual logs from Supabase
          const { data, error } = await getRitualLogs(user.id);
          
          if (error) {
            console.error('Error fetching ritual logs:', error);
            throw error;
          }
          
          // Convert ritual logs to completed rituals
          const completedRituals: CompletedRitual[] = data.map((log: any) => ({
            id: log.id,
            ritualId: log.ritual_id,
            name: `${log.ritual_id.charAt(0).toUpperCase() + log.ritual_id.slice(1)} Ritual`,
            completedAt: new Date(log.completed_at),
            notes: log.notes || '',
            rating: log.rating || 5
          }));
          
          set({ completedRituals, loading: false });
        } catch (error: any) {
          console.error('Error fetching completed rituals:', error);
          
          // Fallback to mock data on error
          set({ 
            completedRituals: mockCompletedRituals, 
            error: 'Failed to fetch completed rituals, using mock data', 
            loading: false 
          });
        }
      },
      
      completeRitual: async (ritualData) => {
        try {
          set({ loading: true, error: null });
          
          const user = useAuthStore.getState().user;
          const userId = user?.id || 'anonymous';
          
          // Create a ritual log to save to Supabase
          const ritualLog = {
            id: ritualData.id,
            user_id: userId,
            ritual_id: ritualData.planetId,
            completed_at: ritualData.completedAt,
            notes: ritualData.notes || '',
            rating: 5, // Default rating
            created_at: new Date().toISOString()
          };
          
          // Try to add the ritual log to Supabase
          await addRitualLog(ritualLog);
          
          // Create a completed ritual for local state
          const completedRitual: CompletedRitual = {
            id: ritualData.id,
            ritualId: ritualData.planetId,
            name: `${ritualData.planetId.charAt(0).toUpperCase() + ritualData.planetId.slice(1)} Ritual`,
            completedAt: new Date(ritualData.completedAt),
            notes: ritualData.notes || '',
            rating: 5 // Default rating
          };
          
          set(state => ({
            completedRituals: [...state.completedRituals, completedRitual],
            loading: false
          }));
          
          return Promise.resolve();
        } catch (error: any) {
          console.error('Error completing ritual:', error);
          set({ error: 'Failed to complete ritual', loading: false });
          return Promise.reject(error);
        }
      },
      
      getRitualById: (id: string) => {
        return get().rituals.find(ritual => ritual.id === id);
      }
    })
);