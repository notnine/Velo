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
      revenuecatIOSKey: process.env.EXPO_PUBLIC_REVENUECAT_IOS_KEY,
      revenuecatAndroidKey: process.env.EXPO_PUBLIC_REVENUECAT_ANDROID_KEY,
      devForcePro: process.env.EXPO_PUBLIC_DEV_FORCE_PRO ?? '0',
    },
    plugins: [
      'expo-router',
      'expo-build-properties'
    ],
    newArchEnabled: true
  }
};

export default config;
