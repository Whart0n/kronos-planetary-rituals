import type { PlanetInfo } from '../types';

/**
 * Planetary Constants
 * Contains all planet-related constants and configurations
 */

// Chaldean order of the planets (from slowest to fastest)
const chaldeanOrder = [
  'saturn',  // ♄ Saturn
  'jupiter', // ♃ Jupiter
  'mars',    // ♂ Mars
  'sun',     // ☉ Sun
  'venus',   // ♀ Venus
  'mercury', // ☿ Mercury
  'moon'     // ☽ Moon
] as const;

// Planetary day rulers (starting with Sunday)
const planetaryDayRulers = [
  'sun',     // Sunday
  'moon',    // Monday
  'mars',    // Tuesday
  'mercury', // Wednesday
  'jupiter', // Thursday
  'venus',   // Friday
  'saturn'   // Saturday
] as const;

// Planet day mappings with display names
const planetDayMap: Record<typeof chaldeanOrder[number], PlanetInfo> = {
  saturn: { name: 'Saturn', ruler: 'saturn' },
  jupiter: { name: 'Jupiter', ruler: 'jupiter' },
  mars: { name: 'Mars', ruler: 'mars' },
  sun: { name: 'Sun', ruler: 'sun' },
  venus: { name: 'Venus', ruler: 'venus' },
  mercury: { name: 'Mercury', ruler: 'mercury' },
  moon: { name: 'Moon', ruler: 'moon' }
};

// Planetary colors for UI theming
const planetaryColors = {
  saturn: {
    light: '#4A4A4A', // Dark gray
    dark: '#1A1A1A'   // Very dark gray
  },
  jupiter: {
    light: '#4B0082', // Indigo
    dark: '#240041'   // Dark indigo
  },
  mars: {
    light: '#FF0000', // Red
    dark: '#8B0000'   // Dark red
  },
  sun: {
    light: '#FFD700', // Gold
    dark: '#B8860B'   // Dark goldenrod
  },
  venus: {
    light: '#00FF00', // Green
    dark: '#006400'   // Dark green
  },
  mercury: {
    light: '#4169E1', // Royal blue
    dark: '#00008B'   // Dark blue
  },
  moon: {
    light: '#FFFFFF', // White
    dark: '#C0C0C0'   // Silver
  }
} as const;

// Planetary symbols for display
const planetarySymbols = {
  saturn: '♄',
  jupiter: '♃',
  mars: '♂',
  sun: '☉',
  venus: '♀',
  mercury: '☿',
  moon: '☽'
} as const;

// Planetary metals
const planetaryMetals = {
  saturn: 'lead',
  jupiter: 'tin',
  mars: 'iron',
  sun: 'gold',
  venus: 'copper',
  mercury: 'mercury',
  moon: 'silver'
} as const;

// Planetary incense
const planetaryIncense = {
  saturn: ['myrrh', 'cypress', 'benzoin'],
  jupiter: ['frankincense', 'cedar', 'nutmeg'],
  mars: ['dragon\'s blood', 'tobacco', 'galangal'],
  sun: ['frankincense', 'cinnamon', 'copal'],
  venus: ['rose', 'vanilla', 'benzoin'],
  mercury: ['lavender', 'mastic', 'white sage'],
  moon: ['jasmine', 'sandalwood', 'camphor']
} as const;

// Planetary stones
const planetaryStones = {
  saturn: ['onyx', 'obsidian', 'jet'],
  jupiter: ['amethyst', 'lapis lazuli', 'sapphire'],
  mars: ['ruby', 'garnet', 'bloodstone'],
  sun: ['diamond', 'citrine', 'amber'],
  venus: ['emerald', 'jade', 'rose quartz'],
  mercury: ['opal', 'agate', 'clear quartz'],
  moon: ['moonstone', 'pearl', 'selenite']
} as const;

/**
 * Planetary Constants
 * Contains all planet-related constants and configurations
 */
const PlanetaryConstants = {
  chaldeanOrder,
  planetaryDayRulers,
  planetDayMap,
  planetaryColors,
  planetarySymbols,
  planetaryMetals,
  planetaryIncense,
  planetaryStones
};

export default PlanetaryConstants;
export {
  chaldeanOrder,
  planetaryDayRulers,
  planetDayMap,
  planetaryColors,
  planetarySymbols,
  planetaryMetals,
  planetaryIncense,
  planetaryStones
};

// Export types for the planet constants
export type PlanetName = typeof chaldeanOrder[number];
export type DayName = typeof planetaryDayRulers[number];
