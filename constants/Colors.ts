/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 */

export type ColorScheme = {
  text: string;
  background: string;
  cardBackground: string;
  tint: string;
  border: string;
  tabIconDefault: string;
  tabIconSelected: string;
  accent: string;
  success: string;
  warning: string;
  error: string;
};

export const Colors: { light: ColorScheme; dark: ColorScheme } = {
  light: {
    text: '#000000',
    background: '#FFFFFF',
    cardBackground: '#F3F4F6',
    tint: '#0891B2',
    border: '#D1D5DB',
    tabIconDefault: '#6B7280',
    tabIconSelected: '#0891B2',
    accent: '#06B6D4',
    success: '#10B981',
    warning: '#F59E0B',
    error: '#EF4444',
  },
  dark: {
    text: '#FFFFFF',
    background: '#1F2937',
    cardBackground: '#374151',
    tint: '#06B6D4',
    border: '#4B5563',
    tabIconDefault: '#9CA3AF',
    tabIconSelected: '#06B6D4',
    accent: '#22D3EE',
    success: '#34D399',
    warning: '#FBBF24',
    error: '#F87171',
  },
};
