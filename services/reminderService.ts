import { PlanetDay } from '@/types';
import { getPlanetaryDayRuler } from '@/utils/planetaryHours';
import { addPlanetaryDayToCalendar, addPlanetaryHourToCalendar, requestCalendarPermission } from './calendarService';
import { requestNotificationPermission, schedulePlanetaryDayNotification, schedulePlanetaryHourNotification } from './notificationService';
import { calculatePlanetaryHours } from '@/utils/planetaryHours';
import { supabase } from './supabase';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Interface for reminder settings
interface ReminderSettings {
  calendar_reminders: boolean;
  push_notification_reminders: boolean;
}

/**
 * Get reminder settings for a user
 * @param userId - User ID
 * @returns Promise<ReminderSettings> - Reminder settings
 */
export const getReminderSettings = async (userId: string): Promise<ReminderSettings> => {
  try {
    // Use AsyncStorage instead of database columns
    const calendarRemindersStr = await AsyncStorage.getItem(`${userId}_calendar_reminders`);
    const pushNotificationRemindersStr = await AsyncStorage.getItem(`${userId}_push_notification_reminders`);
    
    return {
      calendar_reminders: calendarRemindersStr === 'true',
      push_notification_reminders: pushNotificationRemindersStr === 'true'
    };
  } catch (error) {
    console.error('Error getting reminder settings:', error);
    return {
      calendar_reminders: false,
      push_notification_reminders: false
    };
  }
};

/**
 * Update reminder settings for a user
 * @param userId - User ID
 * @param settings - Reminder settings to update
 * @returns Promise<void>
 */
export const updateReminderSettings = async (
  userId: string,
  settings: Partial<ReminderSettings>
): Promise<void> => {
  try {
    // Store settings in AsyncStorage instead of database
    if (settings.calendar_reminders !== undefined) {
      await AsyncStorage.setItem(`${userId}_calendar_reminders`, settings.calendar_reminders.toString());
    }
    
    if (settings.push_notification_reminders !== undefined) {
      await AsyncStorage.setItem(`${userId}_push_notification_reminders`, settings.push_notification_reminders.toString());
    }
    
    // If calendar reminders are enabled, request permission
    if (settings.calendar_reminders) {
      await requestCalendarPermission();
    }
    
    // If push notification reminders are enabled, request permission
    if (settings.push_notification_reminders) {
      await requestNotificationPermission();
    }
  } catch (error) {
    console.error('Error updating reminder settings:', error);
    throw error;
  }
};

/**
 * Create a planetary day object for the given date
 * @param date - Date to create planetary day for
 * @returns Object with planet and date
 */
export const createPlanetaryDay = (date: Date) => {
  const planetId = getPlanetaryDayRuler(date);
  const planet = {
    id: planetId,
    name: planetId.charAt(0).toUpperCase() + planetId.slice(1)
  };
  
  return {
    planet,
    date: date.toISOString()
  };
};

/**
 * Schedule reminders for upcoming planetary days
 * @param userId - User ID
 * @param daysToSchedule - Number of days to schedule reminders for
 * @returns Promise<void>
 */
export const scheduleUpcomingDayReminders = async (
  userId: string,
  daysToSchedule: number = 7
): Promise<void> => {
  try {
    // Get user reminder settings
    const settings = await getReminderSettings(userId);
    
    // If no reminders are enabled, return
    if (!settings.calendar_reminders && !settings.push_notification_reminders) {
      return;
    }
    
    // Schedule reminders for upcoming days
    const today = new Date();
    
    for (let i = 0; i < daysToSchedule; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() + i);
      
      const planetaryDay = createPlanetaryDay(date);
      
      // Add to calendar if enabled
      if (settings.calendar_reminders) {
        await addPlanetaryDayToCalendar(planetaryDay);
      }
      
      // Schedule notification if enabled
      if (settings.push_notification_reminders) {
        await schedulePlanetaryDayNotification(planetaryDay);
      }
    }
  } catch (error) {
    console.error('Error scheduling upcoming day reminders:', error);
    throw error;
  }
};

/**
 * Schedule reminders for planetary hours for a specific day
 * @param userId - User ID
 * @param date - Date to schedule reminders for
 * @param latitude - Latitude for calculating planetary hours
 * @param longitude - Longitude for calculating planetary hours
 * @returns Promise<void>
 */
export const scheduleHourReminders = async (
  userId: string,
  date: Date,
  latitude: number,
  longitude: number
): Promise<void> => {
  try {
    // Get user reminder settings
    const settings = await getReminderSettings(userId);
    
    // If no reminders are enabled, return
    if (!settings.calendar_reminders && !settings.push_notification_reminders) {
      return;
    }
    
    // Calculate planetary hours for the day
    const planetaryHours = calculatePlanetaryHours(date, latitude, longitude);
    
    // Schedule reminders for each hour
    for (const hour of planetaryHours) {
      // Skip past hours
      if (hour.startTime < new Date()) {
        continue;
      }
      
      // Add to calendar if enabled
      if (settings.calendar_reminders) {
        await addPlanetaryHourToCalendar(hour);
      }
      
      // Schedule notification if enabled
      if (settings.push_notification_reminders) {
        await schedulePlanetaryHourNotification(hour);
      }
    }
  } catch (error) {
    console.error('Error scheduling hour reminders:', error);
    throw error;
  }
};
