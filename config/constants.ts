import { Platform } from 'react-native';
import uuid from '@/utils/uuid';

// Generate a unique session ID for this app instance
export const sessionId = uuid.v4();

// Generate a unique installation ID if needed
export const getInstallationId = () => {
  if (Platform.OS === 'web') {
    const storedId = localStorage.getItem('installationId');
    if (storedId) return storedId;
    
    const newId = uuid.v4();
    localStorage.setItem('installationId', newId);
    return newId;
  }
  return uuid.v4();
};
