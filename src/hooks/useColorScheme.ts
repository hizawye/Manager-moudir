import { useColorScheme as useNativeColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';

export function useColorScheme() {
  const systemColorScheme = useNativeColorScheme();
  const [colorScheme, setColorScheme] = useState<'light' | 'dark'>(systemColorScheme ?? 'light');

  useEffect(() => {
    loadThemeSettings();
  }, [systemColorScheme]);

  const loadThemeSettings = async () => {
    try {
      const useSystem = await AsyncStorage.getItem('useSystemTheme');
      if (useSystem === 'true') {
        setColorScheme(systemColorScheme ?? 'light');
        return;
      }

      const darkMode = await AsyncStorage.getItem('darkMode');
      setColorScheme(darkMode === 'true' ? 'dark' : 'light');
    } catch (error) {
      console.error('Error loading theme settings:', error);
      setColorScheme(systemColorScheme ?? 'light');
    }
  };

  return colorScheme;
} 