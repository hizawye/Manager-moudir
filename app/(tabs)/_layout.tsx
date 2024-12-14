import { Tabs } from 'expo-router';
import { useTheme } from '../../src/contexts/ThemeContext';
import { Colors } from '../../src/constants/Colors';
import { IconSymbol } from '../../src/components/ui/IconSymbol';
import { Platform } from 'react-native';
import { HapticTab } from '../../components/HapticTab';

export default function TabLayout() {
  const { isDarkMode } = useTheme();
  const isIOS = Platform.OS === 'ios';

  return (
    <Tabs
      screenOptions={{
        headerShown: true,
        headerStyle: {
          backgroundColor: isDarkMode ? Colors.dark.background : Colors.light.background,
          borderBottomWidth: 1,
          borderBottomColor: isDarkMode ? Colors.dark.border : Colors.light.border,
        },
        headerTitleStyle: {
          fontSize: 20,
          fontWeight: '600',
          color: isDarkMode ? Colors.dark.text : Colors.light.text,
        },
        tabBarStyle: {
          backgroundColor: isDarkMode ? Colors.dark.background : Colors.light.background,
          borderTopWidth: 1,
          borderTopColor: isDarkMode ? Colors.dark.border : Colors.light.border,
          height: isIOS ? 88 : 65,
          paddingBottom: isIOS ? 28 : 8,
          paddingTop: 8,
          elevation: 0,
          shadowOpacity: 0,
        },
        tabBarButton: (props) => <HapticTab {...props} />,
        tabBarActiveTintColor: isDarkMode ? Colors.dark.primary : Colors.light.primary,
        tabBarInactiveTintColor: isDarkMode ? Colors.dark.tabIconDefault : Colors.light.tabIconDefault,
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
          marginTop: 4,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Employees',
          headerTitleAlign: 'left',
          tabBarLabel: 'Employees',
          tabBarIcon: ({ color, size }) => (
            <IconSymbol 
              name="person.2.fill" 
              size={size} 
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          headerTitleAlign: 'left',
          tabBarLabel: 'Settings',
          tabBarIcon: ({ color, size }) => (
            <IconSymbol 
              name="gear" 
              size={size} 
              color={color}
            />
          ),
        }}
      />
    </Tabs>
  );
}
