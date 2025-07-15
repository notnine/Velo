import 'dotenv/config';

const config = {
  expo: {
    name: 'Velo',
    slug: 'velo',
    version: '1.0.0',
    orientation: 'portrait',
    scheme: 'velo',
    userInterfaceStyle: 'light',
    assetBundlePatterns: [
      '**/*'
    ],
    ios: {
      supportsTablet: true,
      bundleIdentifier: 'com.velo.app'
    },
    android: {
      package: 'com.velo.app'
    },
    extra: {
      supabaseUrl: process.env.SUPABASE_URL,
      supabaseAnonKey: process.env.SUPABASE_ANON_KEY,
    },
    plugins: [
      'expo-router'
    ],
    newArchEnabled: true
  }
};

export default config;
