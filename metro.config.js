const { getDefaultConfig } = require('expo/metro-config');
const { withRorkMetro } = require('@rork-ai/toolkit-sdk/metro');

const config = getDefaultConfig(__dirname);

// IMPORTANT for Expo Router
config.resolver.sourceExts.push('cjs');

module.exports = withRorkMetro(config);
