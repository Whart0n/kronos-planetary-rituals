/**
 * @jest-environment node
 */

// Set environment variables before any imports
process.env.EXPO_PUBLIC_SUPABASE_URL = 'https://mock-supabase-url.com';
process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY = 'mock-anon-key';

// Mock React Native URL polyfill
jest.mock('react-native-url-polyfill/auto', () => ({}));

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () => ({
  setItem: jest.fn(() => Promise.resolve()),
  getItem: jest.fn(() => Promise.resolve(null)),
  removeItem: jest.fn(() => Promise.resolve()),
  clear: jest.fn(() => Promise.resolve())
}));

// Mock Supabase client
jest.mock('@supabase/supabase-js', () => {
  const mockSettings = {
    user_id: 'test-user-id',
    dark_mode: true,
    notifications: true,
    auto_detect_location: false,
    location: {
      latitude: 37.7749,
      longitude: -122.4194,
      timezone: 'America/Los_Angeles'
    },
    sound_enabled: true,
    haptic_feedback_enabled: true,
    language: 'en',
    units: 'metric',
    theme: 'dark',
    font_size: 'medium'
  };

  return {
    createClient: jest.fn(() => ({
      auth: {
        getSession: jest.fn().mockResolvedValue({
          data: {
            session: {
              user: { id: mockSettings.user_id },
              access_token: 'mock-token',
              refresh_token: 'mock-refresh-token'
            }
          },
          error: null
        }),
        getUser: jest.fn().mockResolvedValue({
          data: { user: { id: mockSettings.user_id } },
          error: null
        }),
        signInWithPassword: jest.fn(),
        signOut: jest.fn()
      },
      from: jest.fn((table) => ({
        select: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnThis(),
          order: jest.fn().mockReturnThis(),
          limit: jest.fn().mockReturnThis(),
          single: jest.fn().mockResolvedValue({
            data: table === 'settings' ? mockSettings : [],
            error: null
          })
        }),
        insert: jest.fn().mockResolvedValue({ data: [], error: null }),
        update: jest.fn().mockResolvedValue({ data: [], error: null }),
        upsert: jest.fn().mockResolvedValue({ data: [], error: null })
      }))
    }))
  };
});
