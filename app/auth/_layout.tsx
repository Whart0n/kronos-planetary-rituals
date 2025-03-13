import { Stack } from "expo-router";
import { StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useTheme } from "@/components/ThemeProvider";
import { useSettingsStore } from "@/stores/settingsStore";
import { useColorScheme } from "react-native";

export default function AuthLayout() {
  const { colors } = useTheme();
  const colorScheme = useColorScheme();
  const { settings } = useSettingsStore();
  
  // Determine if dark mode should be used
  const isDark = settings?.theme === 'system' 
    ? colorScheme === 'dark' 
    : settings?.theme === 'dark';
  
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: {
          backgroundColor: colors.background,
        },
        headerBackground: () => (
          <LinearGradient
            colors={isDark ? [colors.background, colors.background] : [colors.background, colors.background]}
            style={StyleSheet.absoluteFill}
          />
        ),
        animation: 'slide_from_right',
        presentation: 'card',
      }}
    >
      <Stack.Screen name="index" options={{ title: "Login" }} />
      <Stack.Screen name="register" options={{ title: "Register" }} />
      <Stack.Screen name="onboarding" options={{ title: "Onboarding" }} />
    </Stack>
  );
}