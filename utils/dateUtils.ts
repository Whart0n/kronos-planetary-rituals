import { Platform } from 'react-native';

// Function to get sunrise and sunset times for a given location and date
export const getLocalSunriseSunset = (
  latitude: number,
  longitude: number,
  date: Date = new Date()
): { sunrise: Date; sunset: Date } => {
  try {
    // This is a simplified calculation for demo purposes
    // In a real app, you would use a more accurate algorithm or API
    
    // Get the day of the year (0-365)
    const start = new Date(date.getFullYear(), 0, 0);
    const diff = date.getTime() - start.getTime();
    const dayOfYear = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    // Calculate approximate sunrise and sunset times
    // This is a very basic approximation
    const baseHours = 12; // Base hours (noon)
    
    // Adjust for latitude (day length varies more at higher latitudes)
    const latitudeAdjustment = Math.abs(latitude) / 90; // 0 at equator, 1 at poles
    
    // Seasonal adjustment (day length varies by season)
    // Northern hemisphere: longer days in summer, shorter in winter
    // Southern hemisphere: opposite
    const seasonalFactor = Math.sin((dayOfYear / 365) * 2 * Math.PI);
    const hemisphereFactor = latitude >= 0 ? 1 : -1; // 1 for northern, -1 for southern
    
    // Combine factors to get day length variation (in hours)
    const dayLengthVariation = 3 * latitudeAdjustment * seasonalFactor * hemisphereFactor;
    
    // Calculate sunrise and sunset times
    const sunriseHour = baseHours - 6 - dayLengthVariation / 2;
    const sunsetHour = baseHours + 6 + dayLengthVariation / 2;
    
    // Create Date objects for sunrise and sunset
    const sunrise = new Date(date);
    sunrise.setHours(Math.floor(sunriseHour), Math.round((sunriseHour % 1) * 60), 0, 0);
    
    const sunset = new Date(date);
    sunset.setHours(Math.floor(sunsetHour), Math.round((sunsetHour % 1) * 60), 0, 0);
    
    return { sunrise, sunset };
  } catch (error) {
    console.error('Error calculating sunrise/sunset:', error);
    
    // Return default values in case of error
    const defaultSunrise = new Date(date);
    defaultSunrise.setHours(6, 0, 0, 0);
    
    const defaultSunset = new Date(date);
    defaultSunset.setHours(18, 0, 0, 0);
    
    return { sunrise: defaultSunrise, sunset: defaultSunset };
  }
};

// Format a date to a readable string
export const formatDate = (date: Date): string => {
  try {
    const options: Intl.DateTimeFormatOptions = { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    return date.toLocaleDateString(undefined, options);
  } catch (error) {
    console.error('Error formatting date:', error);
    return date.toDateString();
  }
};

// Format a time to a readable string
export const formatTime = (date: Date): string => {
  try {
    const options: Intl.DateTimeFormatOptions = { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true
    };
    return date.toLocaleTimeString(undefined, options);
  } catch (error) {
    console.error('Error formatting time:', error);
    return date.toTimeString().substring(0, 5);
  }
};

// Get the day of the week (0-6, where 0 is Sunday)
export const getDayOfWeek = (date: Date = new Date()): number => {
  return date.getDay();
};

// Get the current hour (0-23)
export const getCurrentHour = (): number => {
  return new Date().getHours();
};

// Check if a date is today
export const isToday = (date: Date): boolean => {
  const today = new Date();
  return date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear();
};

// Add days to a date
export const addDays = (date: Date, days: number): Date => {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
};

// Get the start of the day (midnight)
export const startOfDay = (date: Date): Date => {
  const result = new Date(date);
  result.setHours(0, 0, 0, 0);
  return result;
};

// Get the end of the day (23:59:59.999)
export const endOfDay = (date: Date): Date => {
  const result = new Date(date);
  result.setHours(23, 59, 59, 999);
  return result;
};

// Format a duration in minutes to a readable string
export const formatDuration = (minutes: number): string => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  
  if (hours > 0) {
    return `${hours}h ${mins}m`;
  } else {
    return `${mins}m`;
  }
};

// Get the current date in ISO format (YYYY-MM-DD)
export const getCurrentDateISO = (): string => {
  const date = new Date();
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
};

// Parse an ISO date string (YYYY-MM-DD) to a Date object
export const parseISODate = (dateString: string): Date => {
  const [year, month, day] = dateString.split('-').map(Number);
  return new Date(year, month - 1, day);
};