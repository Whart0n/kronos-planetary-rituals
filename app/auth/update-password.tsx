import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Lock, ArrowLeft, Moon, Star } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { colors } from '@/constants/colors';
import { supabase } from '@/config/supabase';
import GothicTitle from '@/components/GothicTitle';

export default function UpdatePasswordScreen() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const handleUpdatePassword = async () => {
    if (!password || !confirmPassword) {
      Alert.alert('Missing Information', 'Please fill in all fields');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Password Mismatch', 'Passwords do not match');
      return;
    }

    if (password.length < 8) {
      Alert.alert('Invalid Password', 'Password must be at least 8 characters long');
      return;
    }

    setIsLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({
        password: password
      });
      
      if (error) throw error;
      
      Alert.alert(
        'Password Updated',
        'Your password has been successfully updated. Please login with your new password.',
        [{ text: 'OK', onPress: () => router.replace('/auth/login') }]
      );
    } catch (error: any) {
      console.error('Password update error:', error);
      Alert.alert('Error', error.message || 'Failed to update password. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleBack = () => {
    router.replace('/auth/login');
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
          title="Update Password"
          subtitle="Choose your new mystical key"
          variant="ritual"
        />
        
        <View style={styles.formContainer}>
          <Text style={styles.description}>
            Enter your new password. Choose wisely, as this will be your key to accessing your spiritual journey.
          </Text>
          
          <View style={styles.inputContainer}>
            <Lock size={20} color={colors.textSecondary} />
            <TextInput
              style={styles.input}
              placeholder="New Password (min. 8 characters)"
              placeholderTextColor={colors.textSecondary}
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              textContentType="newPassword"
              autoComplete="new-password"
              returnKeyType="next"
            />
          </View>
          
          <View style={styles.inputContainer}>
            <Lock size={20} color={colors.textSecondary} />
            <TextInput
              style={styles.input}
              placeholder="Confirm New Password"
              placeholderTextColor={colors.textSecondary}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry
              textContentType="newPassword"
              autoComplete="new-password"
              returnKeyType="done"
              onSubmitEditing={handleUpdatePassword}
            />
          </View>
          
          <TouchableOpacity 
            style={styles.updateButton}
            onPress={handleUpdatePassword}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color={colors.text} />
            ) : (
              <Text style={styles.updateButtonText}>Update Password</Text>
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
  updateButton: {
    backgroundColor: colors.bloodRed,
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  updateButtonText: {
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
