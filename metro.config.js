const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// IMPORTANT for Expo Router
config.resolver.sourceExts.push('cjs');

module.exports = config;
