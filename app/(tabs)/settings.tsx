import { StyleSheet, Switch } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Colors } from '@/constants/Colors';
import { useTheme } from '@/contexts/ThemeContext';

export default function SettingsScreen() {
  const { isDarkMode, useSystemTheme, setIsDarkMode, setUseSystemTheme } = useTheme();

  const handleThemeToggle = async (value: boolean) => {
    setIsDarkMode(value);
    try {
      await AsyncStorage.setItem('darkMode', String(value));
    } catch (error) {
      console.error('Error saving theme setting:', error);
    }
  };

  const handleSystemThemeToggle = async (value: boolean) => {
    setUseSystemTheme(value);
    try {
      await AsyncStorage.setItem('useSystemTheme', String(value));
    } catch (error) {
      console.error('Error saving system theme setting:', error);
    }
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title">Settings</ThemedText>
      
      <ThemedView variant="secondary" style={styles.section}>
        <ThemedText type="subtitle">Theme Settings</ThemedText>
        
        <ThemedView style={styles.settingRow}>
          <ThemedText>Use System Theme</ThemedText>
          <Switch
            value={useSystemTheme}
            onValueChange={handleSystemThemeToggle}
            trackColor={{ false: Colors.light.border, true: Colors.light.tint }}
          />
        </ThemedView>

        {!useSystemTheme && (
          <ThemedView style={styles.settingRow}>
            <ThemedText>Dark Mode</ThemedText>
            <Switch
              value={isDarkMode}
              onValueChange={handleThemeToggle}
              trackColor={{ false: Colors.light.border, true: Colors.light.tint }}
            />
          </ThemedView>
        )}
      </ThemedView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  section: {
    marginTop: 24,
    padding: 16,
    borderRadius: 12,
    gap: 16,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
}); 