module.exports = {
  expo: {
    name: 'Kronos Planetary Rituals',
    slug: 'kronos-planetary-rituals',
    version: '1.0.0',
    orientation: 'portrait',
    icon: './assets/images/icon.png',
    scheme: 'kronos',
    userInterfaceStyle: 'automatic',
    splash: {
      image: './assets/images/splash-icon.png',
      resizeMode: 'contain',
      backgroundColor: '#ffffff'
    },
    ios: {
      supportsTablet: true,
      bundleIdentifier: 'com.kronos.planetaryrituals'
    },
    android: {
      adaptiveIcon: {
        foregroundImage: './assets/images/adaptive-icon.png',
        backgroundColor: '#ffffff'
      },
      package: 'com.kronos.planetaryrituals'
    },
    web: {
      bundler: 'metro',
      favicon: './assets/images/favicon.png',
      output: 'static',
      build: {
        babel: {
          include: [
            '@expo/vector-icons',
            'react-native-web',
            'expo-modules-core'
          ]
        }
      }
    },
    plugins: [
      'expo-router',
      [
        'expo-build-properties',
        {
          web: {
            polyfills: ['url']
          }
        }
      ]
    ],
    experiments: {
      typedRoutes: true,
      tsconfigPaths: true
    }
  }
};
