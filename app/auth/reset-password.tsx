import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Mail, ArrowLeft, Moon, Star } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { colors } from '@/constants/colors';
import { supabase } from '@/config/supabase';
import GothicTitle from '@/components/GothicTitle';

export default function ResetPasswordScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const handleResetPassword = async () => {
    if (!email) {
      Alert.alert('Missing Information', 'Please enter your email address');
      return;
    }

    setIsLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: 'kronos://reset-password/update'
      });
      
      if (error) throw error;
      
      Alert.alert(
        'Check Your Email',
        'If an account exists for this email, you will receive password reset instructions.',
        [{ text: 'OK', onPress: () => router.replace('/auth/login') }]
      );
    } catch (error: any) {
      console.error('Password reset error:', error);
      Alert.alert('Error', error.message || 'Failed to send reset instructions. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
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
          <Text style={styles.backButtonText}>Back to Login</Text>
        </TouchableOpacity>
        
        <View style={styles.iconContainer}>
          <Moon size={64} color={colors.text} />
        </View>
        
        <GothicTitle 
          title="Reset Password"
          subtitle="Restore access to your mystical journey"
          variant="ritual"
        />
        
        <View style={styles.formContainer}>
          <Text style={styles.description}>
            Enter your email address and we'll send you instructions to reset your password.
          </Text>
          
          <View style={styles.inputContainer}>
            <Mail size={20} color={colors.textSecondary} />
            <TextInput
              style={styles.input}
              placeholder="Email"
              placeholderTextColor={colors.textSecondary}
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
              textContentType="emailAddress"
              autoComplete="email"
              returnKeyType="send"
              onSubmitEditing={handleResetPassword}
            />
          </View>
          
          <TouchableOpacity 
            style={styles.resetButton}
            onPress={handleResetPassword}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color={colors.text} />
            ) : (
              <Text style={styles.resetButtonText}>Send Reset Instructions</Text>
            )}
          </TouchableOpacity>
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
  formContainer: {
    width: '100%',
    maxWidth: 400,
    marginTop: 32,
  },
  description: {
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 24,
    fontSize: 16,
    lineHeight: 24,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  input: {
    flex: 1,
    color: colors.text,
    paddingVertical: 12,
    paddingHorizontal: 8,
    fontSize: 16,
  },
  resetButton: {
    backgroundColor: colors.bloodRed,
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  resetButtonText: {
    color: colors.text,
    fontSize: 16,
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
