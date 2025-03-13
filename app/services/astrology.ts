import { PlanetaryPosition, PlanetDay } from '@/types';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Define the PlanetaryDignity interface
export interface PlanetaryDignity {
  status: 'Domicile' | 'Exaltation' | 'Detriment' | 'Fall' | 'Peregrine';
  description: string;
}

// API key should be stored in environment variables in a production app
const API_KEY = 'fcd5545544msh9720d2b5a98d578p17daecjsn524fcd4c8648';
const API_HOST = 'astrologer.p.rapidapi.com';

// Cache key for storing planetary positions
const PLANETARY_POSITIONS_CACHE_KEY = 'planetary_positions_cache';
const CACHE_EXPIRY_TIME = 6 * 60 * 60 * 1000; // 6 hours in milliseconds

/**
 * Fetches the current planetary positions from the Astrologer API with caching
 */
export const getCurrentPlanetaryPositions = async (): Promise<PlanetaryPosition[]> => {
  try {
    // Check cache first
    const cachedData = await getCachedPlanetaryPositions();
    if (cachedData) {
      console.log('Using cached planetary positions');
      return cachedData;
    }
    
    // Log that we're attempting to fetch data
    console.log('Cache expired or not found. Fetching planetary positions from API...');
    
    const response = await fetch('https://astrologer.p.rapidapi.com/api/v4/now', {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'X-RapidAPI-Host': API_HOST,
        'X-RapidAPI-Key': API_KEY
      }
    });

    if (!response.ok) {
      console.error(`API request failed with status ${response.status}`);
      return getMockPlanetaryPositions();
    }

    const data = await response.json();
    console.log('API response received');
    
    // Validate the response data structure
    if (!data || !data.data || data.status !== 'OK') {
      console.error('Invalid API response structure');
      return getMockPlanetaryPositions();
    }
    
    // Extract and format the planetary positions
    const planets: PlanetDay[] = ['sun', 'moon', 'mercury', 'venus', 'mars', 'jupiter', 'saturn'];
    const results = planets.map(planetId => {
      const planetData = data.data[planetId.toLowerCase()];
      
      if (!planetData) {
        console.error(`No data found for planet: ${planetId}`);
        return {
          planet: planetId,
          sign: 'Unknown',
          degree: 0,
          isRetrograde: false
        };
      }
      
      // Extract the sign from the API response
      // The sign is in the format 'Ari', 'Tau', etc. and needs to be converted to full name
      const signMap: Record<string, string> = {
        'Ari': 'Aries',
        'Tau': 'Taurus',
        'Gem': 'Gemini',
        'Can': 'Cancer',
        'Leo': 'Leo',
        'Vir': 'Virgo',
        'Lib': 'Libra',
        'Sco': 'Scorpio',
        'Sag': 'Sagittarius',
        'Cap': 'Capricorn',
        'Aqu': 'Aquarius',
        'Pis': 'Pisces'
      };
      
      const signCode = planetData.sign;
      const fullSignName = signMap[signCode] || signCode || 'Unknown';
      
      const result = {
        planet: planetId,
        sign: fullSignName,
        degree: planetData.abs_pos || 0,
        isRetrograde: !!planetData.retrograde
      };
      
      console.log(`Planet ${planetId} is in ${result.sign} at ${result.degree}° ${result.isRetrograde ? '(R)' : ''}`);
      return result;
    });
    
    console.log('Successfully parsed planetary positions');
    
    // Cache the results
    await cachePlanetaryPositions(results);
    
    return results;
  } catch (error) {
    console.error('Error fetching planetary positions:', error);
    // Return mock data in case of error
    return getMockPlanetaryPositions();
  }
};

/**
 * Caches planetary positions with timestamp
 */
const cachePlanetaryPositions = async (positions: PlanetaryPosition[]): Promise<void> => {
  try {
    const cacheData = {
      positions,
      timestamp: Date.now()
    };
    await AsyncStorage.setItem(PLANETARY_POSITIONS_CACHE_KEY, JSON.stringify(cacheData));
    console.log('Planetary positions cached successfully');
  } catch (error) {
    console.error('Error caching planetary positions:', error);
  }
};

/**
 * Retrieves cached planetary positions if they exist and are not expired
 */
const getCachedPlanetaryPositions = async (): Promise<PlanetaryPosition[] | null> => {
  try {
    const cachedData = await AsyncStorage.getItem(PLANETARY_POSITIONS_CACHE_KEY);
    
    if (!cachedData) {
      console.log('No cached planetary positions found');
      return null;
    }
    
    const { positions, timestamp } = JSON.parse(cachedData);
    const now = Date.now();
    
    // Check if cache is expired (older than CACHE_EXPIRY_TIME)
    if (now - timestamp > CACHE_EXPIRY_TIME) {
      console.log('Cached planetary positions expired');
      return null;
    }
    
    console.log('Using cached planetary positions from', new Date(timestamp).toLocaleString());
    return positions;
  } catch (error) {
    console.error('Error retrieving cached planetary positions:', error);
    return null;
  }
};

/**
 * Provides mock planetary positions for testing or when the API fails
 */
const getMockPlanetaryPositions = (): PlanetaryPosition[] => {
  // Updated mock positions to match March 2025 placements
  const mockPositions: PlanetaryPosition[] = [
    { planet: 'sun', sign: 'Pisces', degree: 22, isRetrograde: false },
    { planet: 'moon', sign: 'Virgo', degree: 6, isRetrograde: false },
    { planet: 'mercury', sign: 'Aries', degree: 9, isRetrograde: false },
    { planet: 'venus', sign: 'Aries', degree: 8, isRetrograde: true },
    { planet: 'mars', sign: 'Cancer', degree: 19, isRetrograde: false },
    { planet: 'jupiter', sign: 'Gemini', degree: 13, isRetrograde: false },
    { planet: 'saturn', sign: 'Pisces', degree: 22, isRetrograde: false }
  ];
  
  console.log('Using mock planetary positions for March 2025');
  return mockPositions;
};

/**
 * Determines the dignity of a planet based on its current sign
 */
export const getPlanetaryDignity = (planetId: string, sign: string): PlanetaryDignity => {
  // Define the dignities for each planet
  const dignities = {
    sun: {
      domicile: ['Leo'],
      exaltation: ['Aries'],
      detriment: ['Aquarius'],
      fall: ['Libra']
    },
    moon: {
      domicile: ['Cancer'],
      exaltation: ['Taurus'],
      detriment: ['Capricorn'],
      fall: ['Scorpio']
    },
    mars: {
      domicile: ['Aries', 'Scorpio'],
      exaltation: ['Capricorn'],
      detriment: ['Libra', 'Taurus'],
      fall: ['Cancer']
    },
    mercury: {
      domicile: ['Gemini', 'Virgo'],
      exaltation: ['Virgo'],
      detriment: ['Sagittarius', 'Pisces'],
      fall: ['Pisces']
    },
    jupiter: {
      domicile: ['Sagittarius', 'Pisces'],
      exaltation: ['Cancer'],
      detriment: ['Gemini', 'Virgo'],
      fall: ['Capricorn']
    },
    venus: {
      domicile: ['Taurus', 'Libra'],
      exaltation: ['Pisces'],
      detriment: ['Scorpio', 'Aries'],
      fall: ['Virgo']
    },
    saturn: {
      domicile: ['Capricorn', 'Aquarius'],
      exaltation: ['Libra'],
      detriment: ['Cancer', 'Leo'],
      fall: ['Aries']
    }
  };

  // Get the dignity for the planet
  const planetDignities = dignities[planetId as keyof typeof dignities];
  
  if (!planetDignities) {
    return {
      status: 'Peregrine',
      description: `${planetId} is in ${sign}`
    };
  }

  if (planetDignities.domicile.includes(sign)) {
    return {
      status: 'Domicile',
      description: `${planetId} is in its own sign of ${sign}`
    };
  }

  if (planetDignities.exaltation.includes(sign)) {
    return {
      status: 'Exaltation',
      description: `${planetId} is exalted in ${sign}`
    };
  }

  if (planetDignities.detriment.includes(sign)) {
    return {
      status: 'Detriment',
      description: `${planetId} is in detriment in ${sign}`
    };
  }

  if (planetDignities.fall.includes(sign)) {
    return {
      status: 'Fall',
      description: `${planetId} is in fall in ${sign}`
    };
  }

  return {
    status: 'Peregrine',
    description: `${planetId} is peregrine in ${sign}`
  };
};
