import { Platform } from 'react-native';
import { registerRootComponent } from 'expo';
import { ExpoRoot } from 'expo-router';
import React from 'react';
import 'react-native-gesture-handler';
import { enableScreens } from 'react-native-screens';

// Enable native screens for better performance
enableScreens(true);

// Set up polyfills for web
if (Platform.OS === 'web') {
  require('react-native-url-polyfill/auto');
}

function App() {
  const ctx = require.context('./app');
  return React.createElement(ExpoRoot, { context: ctx });
}

registerRootComponent(App);

export default App;
