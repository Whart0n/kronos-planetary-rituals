// Use a type declaration to avoid import issues
type PlanetDay = 'sun' | 'moon' | 'mars' | 'mercury' | 'jupiter' | 'venus' | 'saturn';
type PlanetaryHour = {
  readonly hour: number;
  readonly hourNumber: number;
  readonly planet: PlanetDay;
  readonly planetId: PlanetDay;
  readonly period: 'day' | 'night';
  readonly isDay: boolean;
  readonly startTime: Date;
  readonly endTime: Date;
  isCurrentHour: boolean; // Removed readonly to allow modification
};
import { planets } from '../constants/planets';

// Chaldean order of planets (traditional order used for planetary hours)
const chaldeanOrder: PlanetDay[] = [
  'saturn', 'jupiter', 'mars', 'sun', 'venus', 'mercury', 'moon'
];

// Get the ruling planet for a specific day of the week
export const getRulingPlanetForDay = (dayIndex: number): PlanetDay => {
  // Traditional ruling planets for days of the week
  // 0 = Sunday, 1 = Monday, etc.
  const dayRulers: PlanetDay[] = [
    'sun', 'moon', 'mars', 'mercury', 'jupiter', 'venus', 'saturn'
  ];
  
  return dayRulers[dayIndex % 7];
};

// Get the planetary day ruler for a specific date or current day if no date provided
export const getPlanetaryDayRuler = (date?: Date): PlanetDay => {
  const targetDate = date || new Date();
  const dayOfWeek = targetDate.getDay(); // 0 = Sunday, 1 = Monday, etc.
  return getRulingPlanetForDay(dayOfWeek);
};

// Format hour time for display (e.g., "3:45 PM")
export const formatHourTime = (date: Date): string => {
  try {
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const formattedHours = hours % 12 || 12; // Convert 0 to 12 for 12 AM
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
    return `${formattedHours}:${formattedMinutes} ${ampm}`;
  } catch (error) {
    console.error('Error formatting hour time:', error);
    return '00:00';
  }
};

// Calculate planetary hours for a given date
export const calculatePlanetaryHours = (date: Date, latitude?: number, longitude?: number): PlanetaryHour[] => {
  const hours: PlanetaryHour[] = [];
  
  // Get day of week (0 = Sunday, 1 = Monday, etc.)
  const dayOfWeek = date.getDay();
  
  // Get ruling planet for the day
  const dayRuler = getRulingPlanetForDay(dayOfWeek);
  
  // Calculate sunrise and sunset times (simplified for demo)
  // In a real app, you would use a proper sunrise/sunset calculation based on location
  const now = new Date(date);
  const year = now.getFullYear();
  const month = now.getMonth();
  const day = now.getDate();
  
  // Simplified sunrise/sunset (6 AM and 6 PM)
  const sunrise = new Date(year, month, day, 6, 0, 0);
  const sunset = new Date(year, month, day, 18, 0, 0);
  
  // Calculate length of day and night in milliseconds
  const dayLength = sunset.getTime() - sunrise.getTime();
  const nightLength = (sunrise.getTime() + 24 * 60 * 60 * 1000) - sunset.getTime();
  
  // Calculate length of each planetary hour
  const dayHourLength = dayLength / 12;
  const nightHourLength = nightLength / 12;
  
  // Find the starting planet for the first hour of the day
  // The first hour of the day is ruled by the planet that rules the day
  const startingPlanetIndex = chaldeanOrder.indexOf(dayRuler);
  
  // Generate all 24 planetary hours
  for (let i = 0; i < 24; i++) {
    const isDay = i < 12; // First 12 hours are day hours
    
    // Calculate the planet for this hour
    const planetIndex = (startingPlanetIndex + i) % 7;
    const planet = chaldeanOrder[planetIndex];
    
    // Calculate start and end times for this hour
    const hourStart = new Date(isDay 
      ? sunrise.getTime() + (i * dayHourLength)
      : sunset.getTime() + ((i - 12) * nightHourLength)
    );
    
    const hourEnd = new Date(isDay
      ? sunrise.getTime() + ((i + 1) * dayHourLength)
      : sunset.getTime() + ((i - 11) * nightHourLength)
    );
    
    // Create the planetary hour object
    hours.push({
      hour: i + 1,
      hourNumber: isDay ? i + 1 : i - 11, // 1-12 for day, 1-12 for night
      planet: planet,
      planetId: planet,
      period: isDay ? 'day' : 'night',
      isDay,
      startTime: hourStart,
      endTime: hourEnd,
      isCurrentHour: false, // Will be set later
    });
  }
  
  // Mark the current hour
  // Mark the current hour
  const currentTime = new Date().getTime();
  
  // Create a new array with the current hour marked
  const hoursWithCurrentMarked = hours.map(hour => ({
    ...hour,
    isCurrentHour: currentTime >= hour.startTime.getTime() && currentTime < hour.endTime.getTime()
  }));
  
  return hoursWithCurrentMarked;
};

// Get the current planetary hour
export const getCurrentPlanetaryHour = (date: Date = new Date()): PlanetaryHour | null => {
  const hours = calculatePlanetaryHours(date);
  const now = date.getTime();
  
  // Find the current hour
  for (const hour of hours) {
    if (now >= hour.startTime.getTime() && now < hour.endTime.getTime()) {
      return hour;
    }
  }
  
  return null;
};

// Get planetary hours for a specific day
export const getPlanetaryHoursForDay = (date: Date, latitude?: number, longitude?: number): PlanetaryHour[] => {
  return calculatePlanetaryHours(date, latitude, longitude);
};

// Get the planetary dignity (rulership, exaltation, detriment, fall)
export const getPlanetaryDignity = (planetId: PlanetDay, zodiacSign: string): string | null => {
  // Define rulerships
  const rulerships: Record<PlanetDay, string[]> = {
    'sun': ['Leo'],
    'moon': ['Cancer'],
    'mercury': ['Gemini', 'Virgo'],
    'venus': ['Taurus', 'Libra'],
    'mars': ['Aries', 'Scorpio'],
    'jupiter': ['Sagittarius', 'Pisces'],
    'saturn': ['Capricorn', 'Aquarius']
  };
  
  // Define exaltations
  const exaltations: Record<PlanetDay, string> = {
    'sun': 'Aries',
    'moon': 'Taurus',
    'mercury': 'Virgo',
    'venus': 'Pisces',
    'mars': 'Capricorn',
    'jupiter': 'Cancer',
    'saturn': 'Libra'
  };
  
  // Define detriments (opposite of rulerships)
  const detriments: Record<PlanetDay, string[]> = {
    'sun': ['Aquarius'],
    'moon': ['Capricorn'],
    'mercury': ['Sagittarius', 'Pisces'],
    'venus': ['Aries', 'Scorpio'],
    'mars': ['Libra', 'Taurus'],
    'jupiter': ['Gemini', 'Virgo'],
    'saturn': ['Cancer', 'Leo']
  };
  
  // Define falls (opposite of exaltations)
  const falls: Record<PlanetDay, string> = {
    'sun': 'Libra',
    'moon': 'Scorpio',
    'mercury': 'Pisces',
    'venus': 'Virgo',
    'mars': 'Cancer',
    'jupiter': 'Capricorn',
    'saturn': 'Aries'
  };
  
  // Check dignity
  if (rulerships[planetId]?.includes(zodiacSign)) {
    return 'rulership';
  } else if (exaltations[planetId] === zodiacSign) {
    return 'exaltation';
  } else if (detriments[planetId]?.includes(zodiacSign)) {
    return 'detriment';
  } else if (falls[planetId] === zodiacSign) {
    return 'fall';
  }
  
  return null; // No special dignity
};