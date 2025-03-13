import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Mail, Lock, UserPlus, ArrowLeft, Moon, Star } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '@/components/ThemeProvider';
import { useAuthStore } from '@/stores/authStore';
import GothicTitle from '@/components/GothicTitle';

export default function RegisterScreen() {
  const router = useRouter();
  const { colors, isDarkMode } = useTheme();
  const { register, error, isLoading, clearError } = useAuthStore();
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const handleRegister = async () => {
    if (!name || !email || !password || !confirmPassword) {
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
    
    try {
      await register(email, password, name);
      
      // Show confirmation message for email verification
      Alert.alert(
        'Registration Successful',
        'Please check your email to confirm your account before logging in.',
        [{ text: 'OK', onPress: () => router.replace('/auth/login') }]
      );
    } catch (error) {
      // Error is already handled in the store
      console.log('Registration failed');
    }
  };
  
  const handleBack = () => {
    router.back();
  };
  
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <LinearGradient
        colors={isDarkMode 
          ? [colors.bloodRed, colors.abyssal, colors.background] 
          : [colors.bloodRed, colors.background, colors.background]}
        style={styles.gradient}
      >
        <TouchableOpacity 
          style={styles.backButton}
          onPress={handleBack}
        >
          <ArrowLeft size={20} color={colors.text} />
          <Text style={[styles.backButtonText, { color: colors.text }]}>Back to Login</Text>
        </TouchableOpacity>
        
        <View style={[styles.iconContainer, { backgroundColor: `${colors.bloodRed}30`, borderColor: `${colors.text}20` }]}>
          <Moon size={64} color={colors.text} />
          
          {/* Decorative pentagram */}
          <View style={styles.pentagramBg}>
            <Text style={[styles.pentagramText, { color: colors.text }]}>✴</Text>
          </View>
        </View>
        
        <GothicTitle 
          title="Create Account"
          subtitle="Join the mystical journey"
          variant="ritual"
        />
        
        <View style={styles.formContainer}>
          {error && (
            <View style={[styles.errorContainer, { backgroundColor: `${colors.error}30`, borderColor: colors.error }]}>
              <Text style={[styles.errorText, { color: colors.text }]}>{error}</Text>
              <TouchableOpacity onPress={clearError}>
                <Text style={[styles.errorDismiss, { color: colors.text }]}>Dismiss</Text>
              </TouchableOpacity>
            </View>
          )}
          
          <View style={[styles.inputContainer, { backgroundColor: `${colors.text}10`, borderColor: `${colors.text}20` }]}>
            <UserPlus size={20} color={colors.textSecondary} />
            <TextInput
              style={[styles.input, { color: colors.text }]}
              placeholder="Full Name"
              placeholderTextColor={colors.textSecondary}
              value={name}
              onChangeText={setName}
              autoCapitalize="words"
              textContentType="name"
            />
          </View>

          <View style={[styles.inputContainer, { backgroundColor: `${colors.text}10`, borderColor: `${colors.text}20` }]}>
            <Mail size={20} color={colors.textSecondary} />
            <TextInput
              style={[styles.input, { color: colors.text }]}
              placeholder="Email"
              placeholderTextColor={colors.textSecondary}
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
              textContentType="emailAddress"
              autoComplete="email"
            />
          </View>
          
          <View style={[styles.inputContainer, { backgroundColor: `${colors.text}10`, borderColor: `${colors.text}20` }]}>
            <Lock size={20} color={colors.textSecondary} />
            <TextInput
              style={[styles.input, { color: colors.text }]}
              placeholder="Password (min. 8 characters)"
              placeholderTextColor={colors.textSecondary}
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              textContentType="newPassword"
              autoComplete="new-password"
            />
          </View>
          
          <View style={[styles.inputContainer, { backgroundColor: `${colors.text}10`, borderColor: `${colors.text}20` }]}>
            <Lock size={20} color={colors.textSecondary} />
            <TextInput
              style={[styles.input, { color: colors.text }]}
              placeholder="Confirm Password"
              placeholderTextColor={colors.textSecondary}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry
              textContentType="newPassword"
              autoComplete="new-password"
            />
          </View>
          
          <TouchableOpacity 
            style={[styles.registerButton, { backgroundColor: colors.bloodRed, borderColor: `${colors.text}20` }]}
            onPress={handleRegister}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color={colors.text} />
            ) : (
              <>
                <UserPlus size={20} color={colors.text} />
                <Text style={[styles.registerButtonText, { color: colors.text }]}>Create Account</Text>
              </>
            )}
          </TouchableOpacity>
        </View>
        
        <View style={styles.footer}>
          <Star size={16} color={colors.textSecondary} />
          <Text style={[styles.footerText, { color: colors.textSecondary }]}>
            "As above, so below. As within, so without."
          </Text>
          <Moon size={16} color={colors.textSecondary} />
        </View>
        
        {/* Decorative runes */}
        <View style={styles.runeContainer}>
          <Text style={[styles.rune, { color: colors.text }]}>᛭</Text>
          <Text style={[styles.rune, { color: colors.text }]}>᛫</Text>
          <Text style={[styles.rune, { color: colors.text }]}>᛬</Text>
        </View>
        
        {/* Decorative elements */}
        <View style={[styles.cornerTL, { borderColor: `${colors.text}20` }]} />
        <View style={[styles.cornerTR, { borderColor: `${colors.text}20` }]} />
        <View style={[styles.cornerBL, { borderColor: `${colors.text}20` }]} />
        <View style={[styles.cornerBR, { borderColor: `${colors.text}20` }]} />
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    fontFamily: 'serif',
  },
  iconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
    borderWidth: 1,
    position: 'relative',
  },
  pentagramBg: {
    position: 'absolute',
    opacity: 0.1,
  },
  pentagramText: {
    fontSize: 100,
  },
  formContainer: {
    width: '100%',
    maxWidth: 400,
    marginVertical: 32,
  },
  errorContainer: {
    padding: 12,
    borderRadius: 4,
    marginBottom: 16,
    borderWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  errorText: {
    flex: 1,
    fontSize: 14,
  },
  errorDismiss: {
    fontSize: 14,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 4,
    paddingHorizontal: 16,
    marginBottom: 16,
    borderWidth: 1,
  },
  input: {
    flex: 1,
    height: 50,
    marginLeft: 12,
    fontFamily: 'serif',
  },
  registerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 4,
    padding: 16,
    marginTop: 8,
    borderWidth: 1,
  },
  registerButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
    fontFamily: 'serif',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 'auto',
    gap: 8,
  },
  footerText: {
    fontSize: 14,
    fontFamily: 'serif',
    fontStyle: 'italic',
    textAlign: 'center',
  },
  runeContainer: {
    position: 'absolute',
    bottom: 12,
    right: 12,
    flexDirection: 'row',
    opacity: 0.3,
  },
  rune: {
    fontSize: 16,
    marginLeft: 4,
  },
  cornerTL: {
    position: 'absolute',
    top: 10,
    left: 10,
    width: 20,
    height: 20,
    borderTopWidth: 2,
    borderLeftWidth: 2,
  },
  cornerTR: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 20,
    height: 20,
    borderTopWidth: 2,
    borderRightWidth: 2,
  },
  cornerBL: {
    position: 'absolute',
    bottom: 10,
    left: 10,
    width: 20,
    height: 20,
    borderBottomWidth: 2,
    borderLeftWidth: 2,
  },
  cornerBR: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    width: 20,
    height: 20,
    borderBottomWidth: 2,
    borderRightWidth: 2,
  },
});