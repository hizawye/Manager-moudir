/**
 * Learn more about light and dark modes:
 * https://docs.expo.dev/guides/color-schemes/
 */

import { Colors } from '@/constants/Colors';
import { useTheme } from '@/contexts/ThemeContext';
import { ColorValue } from 'react-native';

type ColorKey = keyof typeof Colors.light & keyof typeof Colors.dark;
type ThemeColors = typeof Colors.light | typeof Colors.dark;

export function useThemeColor(
  props: { light?: string; dark?: string },
  colorName: ColorKey
): ColorValue {
  const { isDarkMode } = useTheme();
  const theme = isDarkMode ? Colors.dark : Colors.light;

  if (props.light && props.dark) {
    return isDarkMode ? props.dark : props.light;
  }

  const color = theme[colorName];
  return color as ColorValue;
}
