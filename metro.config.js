// Learn more https://docs.expo.io/guides/customizing-metro
const { getDefaultConfig } = require('expo/metro-config');

/** @type {import('metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

// Exclude test files from the bundle
config.resolver.blacklistRE = [
  /\.test\.[jt]sx?$/,
  /\.spec\.[jt]sx?$/,
  /\/tests\//,
  /\/__tests__\//,
  /\/.jest\//,
];

module.exports = config;
