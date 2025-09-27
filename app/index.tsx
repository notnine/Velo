import { Redirect } from 'expo-router';

export default function Index() {
  // This will redirect to the auth screen by default
  // The auth screen will handle the actual authentication logic
  return <Redirect href="/(auth)/" />;
}
