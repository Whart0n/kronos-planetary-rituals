import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { PlanetaryHour, PlanetDay, Planet } from '@/types';

// Define a proper interface for the notification trigger
interface NotificationTrigger {
  date: Date;
}

// Define a custom interface for planetary day event
interface PlanetaryDayEvent {
  planet: {
    id: PlanetDay;
    name: string;
  };
  date: string;
}

/**
 * Configure notification settings
 */
export const configureNotifications = () => {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: true,
    }),
  });
};

/**
 * Request permission to send notifications
 * @returns Promise<boolean> - True if permission is granted
 */
export const requestNotificationPermission = async (): Promise<boolean> => {
  const { status } = await Notifications.requestPermissionsAsync();
  return status === 'granted';
};

/**
 * Schedule a notification for a planetary day
 * @param planetaryDay - The planetary day to notify about
 * @returns Promise<string> - Notification ID
 */
export const schedulePlanetaryDayNotification = async (
  planetaryDay: PlanetaryDayEvent
): Promise<string> => {
  try {
    // Set notification for the beginning of the day (midnight)
    const triggerDate = new Date(planetaryDay.date);
    triggerDate.setHours(0, 0, 0, 0);
    
    // Ensure the notification is for the future
    if (triggerDate <= new Date()) {
      console.warn('Cannot schedule notification for past date');
      return '';
    }
    
    // Create notification content
    const content = {
      title: `${planetaryDay.planet.name} Day`,
      body: `Today is a ${planetaryDay.planet.name} day. Rituals and activities associated with ${planetaryDay.planet.name} are more effective today.`,
      data: { planetId: planetaryDay.planet.id },
    };
    
    // Create notification trigger
    const trigger: any = {
      date: triggerDate
    };
    
    // Schedule the notification
    const notificationId = await Notifications.scheduleNotificationAsync({
      content,
      trigger,
    });
    
    return notificationId;
  } catch (error) {
    console.error('Error scheduling planetary day notification:', error);
    throw error;
  }
};

/**
 * Schedule a notification for a planetary hour
 * @param planetaryHour - The planetary hour to notify about
 * @returns Promise<string> - Notification ID
 */
export const schedulePlanetaryHourNotification = async (
  planetaryHour: PlanetaryHour
): Promise<string> => {
  try {
    // Set notification for the beginning of the hour
    const triggerDate = new Date(planetaryHour.startTime);
    
    // Ensure the notification is for the future
    if (triggerDate <= new Date()) {
      console.warn('Cannot schedule notification for past time');
      return '';
    }
    
    // Create notification content
    const content = {
      title: `${planetaryHour.planet} Hour`,
      body: `A ${planetaryHour.planet} hour is starting now. Rituals and activities associated with ${planetaryHour.planet} are more effective during this time.`,
      data: { planetId: planetaryHour.planetId },
    };
    
    // Create notification trigger
    const trigger: any = {
      date: triggerDate
    };
    
    // Schedule the notification
    const notificationId = await Notifications.scheduleNotificationAsync({
      content,
      trigger,
    });
    
    return notificationId;
  } catch (error) {
    console.error('Error scheduling planetary hour notification:', error);
    throw error;
  }
};

/**
 * Cancel all scheduled notifications
 */
export const cancelAllNotifications = async (): Promise<void> => {
  await Notifications.cancelAllScheduledNotificationsAsync();
};
