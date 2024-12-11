import { View, type ViewProps, ColorValue } from 'react-native';
import { useThemeColor } from '@/hooks/useThemeColor';
import { Colors } from '@/constants/Colors';
import { useTheme } from '@/contexts/ThemeContext';

export type ThemedViewProps = ViewProps & {
  lightColor?: string;
  darkColor?: string;
  variant?: 'primary' | 'secondary';
};

export function ThemedView({ style, lightColor, darkColor, variant = 'primary', ...otherProps }: ThemedViewProps) {
  const { isDarkMode } = useTheme();
  const backgroundColor = useThemeColor(
    { 
      light: lightColor || (variant === 'primary' ? Colors.light.background : Colors.light.cardBackground), 
      dark: darkColor || (variant === 'primary' ? Colors.dark.background : Colors.dark.cardBackground)
    }, 
    'background'
  ) as ColorValue;

  return <View style={[{ backgroundColor }, style]} {...otherProps} />;
} 