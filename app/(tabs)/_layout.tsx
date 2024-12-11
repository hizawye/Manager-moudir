import { Tabs } from 'expo-router';
import { useTheme } from '@/contexts/ThemeContext';
import { Colors } from '@/constants/Colors';

export default function TabLayout() {
  const { isDarkMode } = useTheme();

  return (
    <Tabs
      screenOptions={{
        headerStyle: {
          backgroundColor: isDarkMode ? Colors.dark.background : Colors.light.background,
        },
        headerTintColor: isDarkMode ? Colors.dark.text : Colors.light.text,
        tabBarStyle: {
          backgroundColor: isDarkMode ? Colors.dark.background : Colors.light.background,
        },
        tabBarActiveTintColor: isDarkMode ? Colors.dark.tint : Colors.light.tint,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
        }}
      />
      <Tabs.Screen
        name="employees"
        options={{
          title: 'Employees',
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
        }}
      />
    </Tabs>
  );
}
