import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Mail, ArrowLeft, Moon, Star } from 'lucide-react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { colors } from '@/constants/colors';
import { useAuthStore } from '@/stores/authStore';
import { supabase } from '@/config/supabase';
import GothicTitle from '@/components/GothicTitle';

export default function VerifyScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [isVerifying, setIsVerifying] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const verifyEmail = async () => {
      try {
        // Get the token from the URL params
        const token = params.token as string;
        if (!token) {
          setError('No verification token found');
          return;
        }
        
        // Verify the email
        const { error } = await supabase.auth.verifyOtp({
          token_hash: token,
          type: 'email'
        });
        
        if (error) throw error;
        
        // Wait a moment to show success state
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Navigate to login
        router.replace('/auth/login');
      } catch (err: any) {
        console.error('Verification error:', err);
        setError(err.message || 'Failed to verify email');
      } finally {
        setIsVerifying(false);
      }
    };
    
    verifyEmail();
  }, [params.token]);
  
  const handleBack = () => {
    router.back();
  };
  
  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={[colors.bloodRed, colors.abyssal, colors.background]}
        style={styles.gradient}
      >
        <TouchableOpacity 
          style={styles.backButton}
          onPress={handleBack}
        >
          <ArrowLeft size={20} color={colors.text} />
          <Text style={styles.backButtonText}>Back</Text>
        </TouchableOpacity>
        
        <View style={styles.iconContainer}>
          <Mail size={64} color={colors.text} />
        </View>
        
        <GothicTitle 
          title="Email Verification"
          subtitle={isVerifying ? "Verifying your email..." : error ? "Verification Failed" : "Email Verified!"}
          variant="ritual"
        />
        
        <View style={styles.content}>
          {isVerifying ? (
            <ActivityIndicator size="large" color={colors.text} />
          ) : error ? (
            <>
              <Text style={styles.errorText}>{error}</Text>
              <TouchableOpacity 
                style={styles.button}
                onPress={() => router.replace('/auth/login')}
              >
                <Text style={styles.buttonText}>Return to Login</Text>
              </TouchableOpacity>
            </>
          ) : (
            <Text style={styles.successText}>
              Your email has been verified! Redirecting to login...
            </Text>
          )}
        </View>
        
        <View style={styles.footer}>
          <Star size={16} color={colors.textSecondary} />
          <Text style={styles.footerText}>
            "As above, so below. As within, so without."
          </Text>
          <Moon size={16} color={colors.textSecondary} />
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  gradient: {
    flex: 1,
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backButton: {
    position: 'absolute',
    top: 50,
    left: 20,
    flexDirection: 'row',
    alignItems: 'center',
    zIndex: 10,
  },
  backButtonText: {
    marginLeft: 8,
    color: colors.text,
    fontFamily: 'serif',
  },
  iconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(93, 30, 51, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  content: {
    alignItems: 'center',
    marginTop: 32,
  },
  errorText: {
    color: colors.error,
    textAlign: 'center',
    marginBottom: 24,
    fontSize: 16,
  },
  successText: {
    color: colors.text,
    textAlign: 'center',
    fontSize: 16,
  },
  button: {
    backgroundColor: colors.bloodRed,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  buttonText: {
    color: colors.text,
    fontSize: 16,
    marginLeft: 8,
    fontFamily: 'serif',
  },
  footer: {
    position: 'absolute',
    bottom: 32,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  footerText: {
    color: colors.textSecondary,
    fontFamily: 'serif',
    fontSize: 14,
  },
});
