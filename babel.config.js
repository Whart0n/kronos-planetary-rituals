module.exports = function (api) {
  api.cache(true);
  
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      [
        'module-resolver',
        {
          root: ['.'],
          extensions: ['.ios.js', '.android.js', '.js', '.ts', '.tsx', '.json'],
          alias: {
            '@': './',
            '@components': './components',
            '@screens': './screens',
            '@utils': './utils',
            '@services': './services',
            '@stores': './stores',
            '@config': './config',
            '@constants': './constants',
            '@assets': './assets',
            '@types': './types',
          },
        },
      ],
      'react-native-reanimated/plugin',
    ],
    // Ignore test files in non-test environments
    ignore: [
      process.env.NODE_ENV !== 'test' ? '**/*.test.ts' : '',
      process.env.NODE_ENV !== 'test' ? '**/*.test.tsx' : '',
      process.env.NODE_ENV !== 'test' ? '**/*.spec.ts' : '',
      process.env.NODE_ENV !== 'test' ? '**/*.spec.tsx' : '',
      process.env.NODE_ENV !== 'test' ? '**/tests/**' : '',
      process.env.NODE_ENV !== 'test' ? '**/__tests__/**' : '',
      process.env.NODE_ENV !== 'test' ? '**/.jest/**' : ''
    ].filter(Boolean)
  };
};
