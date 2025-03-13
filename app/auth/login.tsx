import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Mail, Lock, LogIn, Fingerprint } from 'lucide-react-native';
import KronosLogo from '@/components/KronosLogo';
import { useRouter } from 'expo-router';
import { colors } from '@/constants/colors';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { checkBiometricsAvailability, authenticateWithBiometrics, getBiometricsName, isBiometricsEnabled } from '@/services/biometrics';
import { useAuthStore } from '@/stores/authStore';
import GothicTitle from '@/components/GothicTitle';

export default function LoginScreen() {
  const router = useRouter();
  const { login, loginWithGoogle, error, isLoading, clearError } = useAuthStore();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [biometricsAvailable, setBiometricsAvailable] = useState(false);
  const [biometricsType, setBiometricsType] = useState<string | null>(null);
  const [lastEmail, setLastEmail] = useState<string | null>(null);
  
  useEffect(() => {
    const checkBiometrics = async () => {
      const { available, type } = await checkBiometricsAvailability();
      setBiometricsAvailable(available);
      if (type) {
        setBiometricsType(getBiometricsName(type));
      }

      // Check if biometrics is enabled and get last used email
      const enabled = await isBiometricsEnabled();
      if (enabled) {
        const storedEmail = await AsyncStorage.getItem('@kronos/last_email');
        if (storedEmail) {
          setLastEmail(storedEmail);
          setEmail(storedEmail);
        }
      }
    };

    checkBiometrics();
  }, []);

  const handleBiometricLogin = async () => {
    if (!lastEmail) {
      Alert.alert('Login Required', 'Please login with your password first to enable biometric authentication.');
      return;
    }

    try {
      const result = await authenticateWithBiometrics();
      if (!result.success) return;

      await login(lastEmail, null, true);
    } catch (error: any) {
      console.error('Biometric login error:', error);
      Alert.alert('Error', error.message || 'Failed to authenticate. Please try again.');
    }
  };

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Missing Information', 'Please enter both email and password');
      return;
    }
    
    try {
      await login(email, password);
      
      // If login is successful, the auth store will handle the session
      // and the router will automatically navigate to the protected routes
      router.replace('/');
    } catch (error: any) {
      // Error is already handled by the auth store
      console.error('Login failed:', error);
    }
  };
  
  const handleRegister = () => {
    router.push('/auth/register');
  };
  
  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={[colors.bloodRed, colors.abyssal, colors.background]}
        style={styles.gradient}
      >
        <View style={styles.iconContainer}>
          <KronosLogo size={80} />
        </View>
        
        <GothicTitle 
          title="Kronos"
          subtitle="Planetary Magic & Rituals"
          variant="ritual"
        />
        
        <View style={styles.formContainer}>
          {error && (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{error}</Text>
              <TouchableOpacity onPress={clearError}>
                <Text style={styles.errorDismiss}>Dismiss</Text>
              </TouchableOpacity>
            </View>
          )}
          
          <View style={styles.inputContainer}>
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
              returnKeyType="next"
            />
          </View>
          
          <View style={styles.inputContainer}>
            <Lock size={20} color={colors.textSecondary} />
            <TextInput
              style={[styles.input, { color: colors.text }]}
              placeholder="Password"
              placeholderTextColor={colors.textSecondary}
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              textContentType="password"
              autoComplete="password"
              returnKeyType="go"
              onSubmitEditing={handleLogin}
            />
          </View>
          
          <TouchableOpacity 
            style={styles.loginButton}
            onPress={handleLogin}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color={colors.text} />
            ) : (
              <>
                <LogIn size={20} color={colors.text} />
                <Text style={styles.loginButtonText}>Sign In</Text>
              </>
            )}
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.registerButton}
            onPress={handleRegister}
          >
            <Text style={styles.registerButtonText}>Create an Account</Text>
          </TouchableOpacity>

          <View style={styles.socialButtons}>
            {biometricsAvailable && lastEmail && (
              <TouchableOpacity 
                style={[styles.socialButton, { borderColor: colors.text }]}
                onPress={handleBiometricLogin}
                disabled={isLoading}
              >
                <Fingerprint size={24} color={colors.text} />
                <Text style={[styles.socialButtonText, { color: colors.text }]}>
                  {biometricsType}
                </Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity 
              style={[styles.socialButton, { borderColor: colors.text }]}
              onPress={loginWithGoogle}
              disabled={isLoading}
            >
              <View style={styles.googleIcon}>
                <Text style={styles.googleIconText}>G</Text>
              </View>
              <Text style={[styles.socialButtonText, { color: colors.text }]}>
                Continue with Google
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        
        <View style={styles.footer}>
          <KronosLogo size={16} />
          <Text style={styles.footerText}>
            "As above, so below. As within, so without."
          </Text>
          <KronosLogo size={16} />
        </View>
        
        {/* Decorative runes */}
        <View style={styles.runeContainer}>
          <Text style={styles.rune}>᛭</Text>
          <Text style={styles.rune}>᛫</Text>
          <Text style={styles.rune}>᛬</Text>
        </View>
        
        {/* Decorative elements */}
        <View style={styles.cornerTL} />
        <View style={styles.cornerTR} />
        <View style={styles.cornerBL} />
        <View style={styles.cornerBR} />
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
    position: 'relative',
  },
  // Logo styles are now handled by the KronosLogo component
  formContainer: {
    width: '100%',
    maxWidth: 400,
    marginVertical: 32,
  },
  errorContainer: {
    backgroundColor: 'rgba(107, 0, 0, 0.3)',
    padding: 12,
    borderRadius: 4,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.error,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  errorText: {
    color: colors.text,
    flex: 1,
    fontSize: 14,
  },
  errorDismiss: {
    color: colors.text,
    fontSize: 14,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 4,
    paddingHorizontal: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  input: {
    flex: 1,
    height: 50,
    color: colors.text,
    marginLeft: 12,
    fontFamily: 'serif',
  },
  loginButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.bloodRed,
    borderRadius: 4,
    padding: 16,
    marginTop: 8,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  loginButtonText: {
    color: colors.text,
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
    fontFamily: 'serif',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  registerButton: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    marginTop: 16,
  },
  socialButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap',
    gap: 12,
    marginTop: 24,
  },
  socialButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    marginTop: 16,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  socialButtonText: {
    marginLeft: 8,
    fontSize: 16,
    fontFamily: 'serif',
  },
  googleIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.text,
    alignItems: 'center',
    justifyContent: 'center',
  },
  googleIconText: {
    color: colors.background,
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: 'serif',
  },
  registerButtonText: {
    color: colors.text,
    fontSize: 14,
    fontFamily: 'serif',
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 'auto',
    gap: 8,
  },
  footerText: {
    color: colors.textSecondary,
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
    color: colors.text,
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
    borderColor: 'rgba(255,255,255,0.1)',
  },
  cornerTR: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 20,
    height: 20,
    borderTopWidth: 2,
    borderRightWidth: 2,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  cornerBL: {
    position: 'absolute',
    bottom: 10,
    left: 10,
    width: 20,
    height: 20,
    borderBottomWidth: 2,
    borderLeftWidth: 2,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  cornerBR: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    width: 20,
    height: 20,
    borderBottomWidth: 2,
    borderRightWidth: 2,
    borderColor: 'rgba(255,255,255,0.1)',
  },
});