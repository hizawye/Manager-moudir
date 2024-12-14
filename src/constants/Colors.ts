export type ColorScheme = {
  primary: string;
  secondary: string;
  background: string;
  secondaryBackground: string;
  text: string;
  secondaryText: string;
  border: string;
  tint: string;
  tabIconDefault: string;
  success: string;
  error: string;
  warning: string;
  info: string;
};

export const Colors: { light: ColorScheme; dark: ColorScheme } = {
  light: {
    primary: '#2563EB',
    secondary: '#4F46E5',
    background: '#FFFFFF',
    secondaryBackground: '#F8FAFC',
    text: '#0F172A',
    secondaryText: '#64748B',
    border: '#E2E8F0',
    tint: '#2563EB',
    tabIconDefault: '#94A3B8',
    success: '#10B981',
    error: '#EF4444',
    warning: '#F59E0B',
    info: '#3B82F6',
  },
  dark: {
    primary: '#3B82F6',
    secondary: '#6366F1',
    background: '#0F172A',
    secondaryBackground: '#1E293B',
    text: '#F8FAFC',
    secondaryText: '#94A3B8',
    border: '#334155',
    tint: '#3B82F6',
    tabIconDefault: '#64748B',
    success: '#34D399',
    error: '#F87171',
    warning: '#FBBF24',
    info: '#60A5FA',
  },
};