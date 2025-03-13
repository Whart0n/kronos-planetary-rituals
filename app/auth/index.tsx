import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Mail, Lock, LogIn, Moon, Star } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '@/components/ThemeProvider';
import { useAuthStore } from '@/stores/authStore';
import Container from '@/components/ui/Container';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Title from '@/components/ui/Title';
import PlanetSymbol from '@/components/ui/PlanetSymbol';

export default function LoginScreen() {
  const router = useRouter();
  const { colors, currentDayTheme } = useTheme();
  const { login, error, isLoading, clearError } = useAuthStore();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Missing Information', 'Please enter both email and password');
      return;
    }
    
    try {
      await login(email, password);
      // If we get here, login was successful
      router.replace('/');
    } catch (error) {
      // Error is already handled in the store
      console.log('Login failed');
    }
  };
  
  const handleRegister = () => {
    router.push('/auth/register');
  };
  
  return (
    <SafeAreaView style={styles.container}>
      <Container>
        <View style={styles.content}>
          <View style={styles.iconContainer}>
            <PlanetSymbol 
              symbol={currentDayTheme.symbol} 
              size={64} 
              variant="glowing"
            />
          </View>
          
          <Title 
            title="Kronos"
            subtitle={`Day of ${currentDayTheme.name} • Planetary Magic & Rituals`}
            align="center"
            size="large"
          />
          
          <Card variant="elevated" style={styles.formContainer}>
            {error && (
              <View style={[styles.errorContainer, { backgroundColor: `${colors.error}20` }]}>
                <Text style={[styles.errorText, { color: colors.text }]}>{error}</Text>
                <TouchableOpacity onPress={clearError}>
                  <Text style={[styles.errorDismiss, { color: colors.primary }]}>Dismiss</Text>
                </TouchableOpacity>
              </View>
            )}
            
            <View style={[styles.inputContainer, { borderColor: colors.border }]}>
              <Mail size={20} color={colors.textSecondary} />
              <TextInput
                style={[styles.input, { color: colors.text }]}
                placeholder="Email"
                placeholderTextColor={colors.textSecondary}
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
              />
            </View>
            
            <View style={[styles.inputContainer, { borderColor: colors.border }]}>
              <Lock size={20} color={colors.textSecondary} />
              <TextInput
                style={[styles.input, { color: colors.text }]}
                placeholder="Password"
                placeholderTextColor={colors.textSecondary}
                value={password}
                onChangeText={setPassword}
                secureTextEntry
              />
            </View>
            
            <Button
              variant="primary"
              onPress={handleLogin}
              loading={isLoading}
              icon={<LogIn size={20} color={colors.text} />}
              style={styles.loginButton}
              fullWidth
            >
              Sign In
            </Button>
            
            <Button
              variant="outline"
              onPress={handleRegister}
              style={styles.registerButton}
              fullWidth
            >
              Create an Account
            </Button>
          </Card>
          
          <View style={styles.footer}>
            <Star size={16} color={colors.textSecondary} />
            <Text style={[styles.footerText, { color: colors.textSecondary }]}>
              "As above, so below. As within, so without."
            </Text>
            <Moon size={16} color={colors.textSecondary} />
          </View>
        </View>
      </Container>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconContainer: {
    marginBottom: 24,
  },
  formContainer: {
    width: '100%',
    maxWidth: 400,
    marginVertical: 32,
    padding: 24,
  },
  errorContainer: {
    padding: 12,
    marginBottom: 16,
    borderRadius: 8,
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
    paddingHorizontal: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderRadius: 8,
    height: 50,
  },
  input: {
    flex: 1,
    marginLeft: 12,
  },
  loginButton: {
    marginTop: 8,
  },
  registerButton: {
    marginTop: 8,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 'auto',
    gap: 8,
  },
  footerText: {
    fontSize: 14,
    fontStyle: 'italic',
    textAlign: 'center',
  },
});