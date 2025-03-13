import * as Font from 'expo-font';

// Define font assets
export const fontsToLoad = {
  'Inter-Regular': require('../../assets/fonts/Inter-Regular.ttf'),
  'Inter-Medium': require('../../assets/fonts/Inter-Medium.ttf'),
  'Inter-SemiBold': require('../../assets/fonts/Inter-SemiBold.ttf'),
  'Inter-Bold': require('../../assets/fonts/Inter-Bold.ttf'),
};

// Load fonts asynchronously
export const loadFonts = async () => {
  await Font.loadAsync(fontsToLoad);
};

// Default export for Expo Router
export default {
  loadFonts,
  fontsToLoad
};
