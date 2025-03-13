import * as Location from 'expo-location';
import { Platform } from 'react-native';

// Format location for display
export const formatLocation = (location: { latitude: number; longitude: number; name?: string }): string => {
  if (location.name) {
    return location.name;
  }
  
  if (location.latitude && location.longitude) {
    return `${location.latitude.toFixed(2)}, ${location.longitude.toFixed(2)}`;
  }
  
  return 'Unknown location';
};

// Get current location
export const getCurrentLocation = async (): Promise<{ latitude: number; longitude: number; name?: string } | null> => {
  try {
    // Request permission
    const { status } = await Location.requestForegroundPermissionsAsync();
    
    if (status !== 'granted') {
      console.log('Location permission denied');
      return null;
    }
    
    // Get current position
    const location = await Location.getCurrentPositionAsync({
      accuracy: Platform.OS === 'android' ? Location.Accuracy.Balanced : Location.Accuracy.Lowest
    });
    
    const { latitude, longitude } = location.coords;
    
    // Try to get location name
    try {
      const geocode = await Location.reverseGeocodeAsync({ latitude, longitude });
      
      if (geocode && geocode.length > 0) {
        const { city, region, country } = geocode[0];
        let name = '';
        
        if (city) name += city;
        if (region && !name.includes(region)) name += name ? `, ${region}` : region;
        if (country && !name.includes(country)) name += name ? `, ${country}` : country;
        
        return { latitude, longitude, name };
      }
    } catch (error) {
      console.error('Error getting location name:', error);
    }
    
    // Return coordinates if geocoding fails
    return { latitude, longitude };
  } catch (error) {
    console.error('Error getting location:', error);
    return null;
  }
};

// Check if location services are enabled
export const checkLocationServices = async (): Promise<boolean> => {
  try {
    const enabled = await Location.hasServicesEnabledAsync();
    return enabled;
  } catch (error) {
    console.error('Error checking location services:', error);
    return false;
  }
};