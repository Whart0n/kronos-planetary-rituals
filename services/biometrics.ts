import * as LocalAuthentication from 'expo-local-authentication';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

const BIOMETRICS_ENABLED_KEY = '@kronos/biometrics_enabled';
const BIOMETRICS_TYPE_KEY = '@kronos/biometrics_type';

export type BiometricsType = 'fingerprint' | 'facial' | 'iris';

export const checkBiometricsAvailability = async () => {
  try {
    const hasHardware = await LocalAuthentication.hasHardwareAsync();
    if (!hasHardware) {
      return { available: false, reason: 'NO_HARDWARE' };
    }

    const isEnrolled = await LocalAuthentication.isEnrolledAsync();
    if (!isEnrolled) {
      return { available: false, reason: 'NOT_ENROLLED' };
    }

    const supportedTypes = await LocalAuthentication.supportedAuthenticationTypesAsync();
    const biometricsType = getBiometricsType(supportedTypes);

    return { 
      available: true, 
      type: biometricsType,
      reason: null 
    };
  } catch (error) {
    console.error('Error checking biometrics:', error);
    return { available: false, reason: 'ERROR' };
  }
};

export const authenticateWithBiometrics = async () => {
  try {
    const result = await LocalAuthentication.authenticateAsync({
      promptMessage: 'Authenticate to access your mystical journey',
      fallbackLabel: 'Use passcode',
      cancelLabel: 'Cancel',
      disableDeviceFallback: false,
    });

    return result;
  } catch (error) {
    console.error('Error authenticating with biometrics:', error);
    throw error;
  }
};

export const enableBiometrics = async () => {
  try {
    const { available, type } = await checkBiometricsAvailability();
    if (!available || !type) {
      throw new Error('Biometrics not available');
    }

    await AsyncStorage.setItem(BIOMETRICS_ENABLED_KEY, 'true');
    await AsyncStorage.setItem(BIOMETRICS_TYPE_KEY, type);

    return true;
  } catch (error) {
    console.error('Error enabling biometrics:', error);
    throw error;
  }
};

export const disableBiometrics = async () => {
  try {
    await AsyncStorage.removeItem(BIOMETRICS_ENABLED_KEY);
    await AsyncStorage.removeItem(BIOMETRICS_TYPE_KEY);
    return true;
  } catch (error) {
    console.error('Error disabling biometrics:', error);
    throw error;
  }
};

export const isBiometricsEnabled = async () => {
  try {
    const enabled = await AsyncStorage.getItem(BIOMETRICS_ENABLED_KEY);
    return enabled === 'true';
  } catch (error) {
    console.error('Error checking if biometrics is enabled:', error);
    return false;
  }
};

const getBiometricsType = (types: LocalAuthentication.AuthenticationType[]): BiometricsType | null => {
  if (types.includes(LocalAuthentication.AuthenticationType.FINGERPRINT)) {
    return 'fingerprint';
  } else if (types.includes(LocalAuthentication.AuthenticationType.FACIAL_RECOGNITION)) {
    return 'facial';
  } else if (types.includes(LocalAuthentication.AuthenticationType.IRIS)) {
    return 'iris';
  }
  return null;
};

export const getBiometricsName = (type: BiometricsType): string => {
  switch (type) {
    case 'fingerprint':
      return Platform.OS === 'ios' ? 'Touch ID' : 'Fingerprint';
    case 'facial':
      return Platform.OS === 'ios' ? 'Face ID' : 'Face Recognition';
    case 'iris':
      return 'Iris Recognition';
    default:
      return 'Biometrics';
  }
};
