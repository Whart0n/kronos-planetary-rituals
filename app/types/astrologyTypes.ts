import { PlanetDay } from './index';

// Astrological types for planetary dignities
export interface PlanetaryDignity {
  status: 'Domicile' | 'Exaltation' | 'Detriment' | 'Fall' | 'Peregrine';
  description: string;
}

// Zodiac sign type
export type ZodiacSign = 
  'Aries' | 'Taurus' | 'Gemini' | 'Cancer' | 
  'Leo' | 'Virgo' | 'Libra' | 'Scorpio' | 
  'Sagittarius' | 'Capricorn' | 'Aquarius' | 'Pisces';

// Type for astrological aspects
export interface Aspect {
  type: 'Conjunction' | 'Sextile' | 'Square' | 'Trine' | 'Opposition';
  planet1: PlanetDay;
  planet2: PlanetDay;
  orb: number;
  exact: boolean;
}

// Type for houses in a chart
export interface House {
  number: number;
  sign: ZodiacSign;
  degree: number;
  planets: PlanetDay[];
}

// Full chart type
export interface NatalChart {
  time: Date;
  location: {
    latitude: number;
    longitude: number;
  };
  houses: House[];
  positions: Array<{
    planet: PlanetDay;
    sign: ZodiacSign;
    degree: number;
    house: number;
    isRetrograde: boolean;
  }>;
  aspects: Aspect[];
}
