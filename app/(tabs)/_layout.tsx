import React from "react";
import { Tabs } from "expo-router";
import { Home, Calendar, BookOpen, User, Settings } from "lucide-react-native";
import { StyleSheet } from "react-native";
import { useTheme } from "../../components/ThemeProvider";
import { useSettingsStore } from "../../stores/settingsStore";
import { useColorScheme } from "react-native";

export default function TabLayout() {
  const { colors } = useTheme();
  const colorScheme = useColorScheme();
  const { settings } = useSettingsStore();
  
  // Determine if dark mode should be used
  const isDarkMode = settings?.theme === 'system' 
    ? colorScheme === 'dark' 
    : settings?.theme === 'dark';
  
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarStyle: {
          backgroundColor: colors.background,
          borderTopColor: colors.border,
          borderTopWidth: StyleSheet.hairlineWidth,
          height: 60,
          paddingBottom: 10,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontFamily: 'System',
        },
        headerStyle: {
          backgroundColor: colors.background,
          borderBottomColor: colors.border,
          borderBottomWidth: StyleSheet.hairlineWidth,
          elevation: 0,
          shadowOpacity: 0,
        },
        headerTitleStyle: {
          fontSize: 20,
          fontWeight: 'bold',
          color: colors.text,
          textTransform: 'uppercase',
          letterSpacing: 2,
          fontFamily: 'System',
        },
        headerTintColor: colors.text,
        headerShown: true,
        tabBarShowLabel: true,
        tabBarHideOnKeyboard: true,
        tabBarIconStyle: {
          marginTop: 5,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Today",
          headerTitle: "Today",
          tabBarIcon: ({ color }) => (
            <Home size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="calendar"
        options={{
          title: "Calendar",
          headerTitle: "Calendar",
          tabBarIcon: ({ color }) => (
            <Calendar size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="learn"
        options={{
          title: "Learn",
          headerTitle: "Learn",
          tabBarIcon: ({ color }) => (
            <BookOpen size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          headerTitle: "Profile",
          tabBarIcon: ({ color }) => (
            <User size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: "Settings",
          headerTitle: "Settings",
          tabBarIcon: ({ color }) => (
            <Settings size={24} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabIconContainer: {
    width: 30,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
});