import { Platform } from 'react-native';
import { PlanetaryPosition, PlanetDay } from '@/types';

// API configuration
const API_HOST = 'astrologer.p.rapidapi.com';
const API_KEY = 'fcd5545544msh9720d2b5a98d578p17daecjsn524fcd4c8648';

// Base URL for the API
const BASE_URL = 'https://astrologer.p.rapidapi.com/api/v4';

// Headers for API requests
const headers = {
  'X-RapidAPI-Host': API_HOST,
  'X-RapidAPI-Key': API_KEY,
  'Accept': 'application/json'
};

/**
 * Fetches the current planetary positions
 */
export const getCurrentPlanetaryPositions = async (): Promise<PlanetaryPosition[]> => {
  try {
    // Make API request
    const response = await fetch(`${BASE_URL}/now`, {
      method: 'GET',
      headers
    });

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    const data = await response.json();
    
    // Extract and format planetary positions
    const planetaryPositions: PlanetaryPosition[] = [];
    
    if (data && data.data && data.data.planets) {
      // Map API response to our PlanetPosition type
      const planets = data.data.planets;
      
      // Process each planet from the API response
      Object.keys(planets).forEach(planetName => {
        const apiPlanet = planets[planetName];
        
        // Convert planet name to our PlanetDay type
        const planetId = convertApiPlanetNameToId(planetName);
        
        if (planetId) {
          planetaryPositions.push({
            planet: planetId,
            sign: apiPlanet.sign,
            degree: apiPlanet.position.longitude,
            isRetrograde: apiPlanet.retrograde
          });
        }
      });
    }
    
    return planetaryPositions;
  } catch (error) {
    console.error('Error fetching planetary positions:', error);
    
    // Return mock data in case of error
    return getMockPlanetaryPositions();
  }
};

/**
 * Converts API planet name to our internal planet ID
 */
const convertApiPlanetNameToId = (apiPlanetName: string): PlanetDay | null => {
  const mapping: Record<string, PlanetDay> = {
    'sun': 'sun',
    'moon': 'moon',
    'mercury': 'mercury',
    'venus': 'venus',
    'mars': 'mars',
    'jupiter': 'jupiter',
    'saturn': 'saturn'
  };
  
  return mapping[apiPlanetName.toLowerCase()] || null;
};

/**
 * Returns mock planetary positions for testing or when API fails
 */
const getMockPlanetaryPositions = (): PlanetaryPosition[] => {
  return [
    { planet: 'sun', sign: 'Leo', degree: 15.5, isRetrograde: false },
    { planet: 'moon', sign: 'Taurus', degree: 8.2, isRetrograde: false },
    { planet: 'mercury', sign: 'Virgo', degree: 3.7, isRetrograde: true },
    { planet: 'venus', sign: 'Libra', degree: 22.1, isRetrograde: false },
    { planet: 'mars', sign: 'Aries', degree: 10.9, isRetrograde: false },
    { planet: 'jupiter', sign: 'Cancer', degree: 17.3, isRetrograde: false },
    { planet: 'saturn', sign: 'Aquarius', degree: 5.6, isRetrograde: true }
  ];
};