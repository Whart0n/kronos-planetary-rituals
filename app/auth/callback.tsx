import { useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuthStore } from '@/stores/authStore';
import { colors } from '@/constants/colors';
import { supabase } from '@/config/supabase';

export default function AuthCallbackScreen() {
  const router = useRouter();
  const { initialize } = useAuthStore();

  useEffect(() => {
    const handleOAuthCallback = async () => {
      try {
        // Get the session from the URL
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) throw error;

        if (session) {
          // Initialize auth store with the new session
          await initialize();
          
          // Navigate to onboarding if this is a new user
          const { data: profile } = await supabase
            .from('profiles')
            .select('name')
            .eq('id', session.user.id)
            .single();

          if (!profile?.name) {
            router.replace('/auth/onboarding');
          } else {
            router.replace('/');
          }
        } else {
          router.replace('/auth/login');
        }
      } catch (error) {
        console.error('OAuth callback error:', error);
        router.replace('/auth/login');
      }
    };

    handleOAuthCallback();
  }, []);

  return (
    <View style={{
      flex: 1,
      backgroundColor: colors.background,
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      <ActivityIndicator size="large" color={colors.bloodRed} />
    </View>
  );
}
