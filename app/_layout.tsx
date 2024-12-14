import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { RealmProvider } from '@/context/RealmContext';
import { useColorScheme } from '@/hooks/useColorScheme';
import { ThemeProvider as AppThemeProvider } from '@/contexts/ThemeContext';
import Realm from 'realm';
import 'react-native-get-random-values';

// Configure Realm
Realm.flags.THROW_ON_GLOBAL_REALM = true;

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <RealmProvider>
      <AppThemeProvider>
        <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
          <RootLayoutNav />
        </ThemeProvider>
      </AppThemeProvider>
    </RealmProvider>
  );
}

function RootLayoutNav() {
  return (
    <>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="employee/[id]" options={{ presentation: 'card' }} />
      </Stack>
    </>
  );
}
