import { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useColorScheme } from '@/hooks/useColorScheme';

type ThemeContextType = {
  isDarkMode: boolean;
  useSystemTheme: boolean;
  setIsDarkMode: (value: boolean) => void;
  setUseSystemTheme: (value: boolean) => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const systemScheme = useColorScheme();
  const [isDarkMode, setIsDarkMode] = useState(systemScheme === 'dark');
  const [useSystemTheme, setUseSystemTheme] = useState(true);

  useEffect(() => {
    loadThemeSettings();
  }, []);

  useEffect(() => {
    if (useSystemTheme) {
      setIsDarkMode(systemScheme === 'dark');
    }
  }, [systemScheme, useSystemTheme]);

  const loadThemeSettings = async () => {
    try {
      const useSystem = await AsyncStorage.getItem('useSystemTheme');
      const darkMode = await AsyncStorage.getItem('darkMode');
      setUseSystemTheme(useSystem === 'true');
      if (useSystem !== 'true') {
        setIsDarkMode(darkMode === 'true');
      }
    } catch (error) {
      console.error('Error loading theme settings:', error);
    }
  };

  return (
    <ThemeContext.Provider value={{ isDarkMode, useSystemTheme, setIsDarkMode, setUseSystemTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
} 