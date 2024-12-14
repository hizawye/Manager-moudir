import React from 'react';
import { StyleSheet, TouchableOpacity, TouchableOpacityProps, ViewStyle } from 'react-native';
import { Colors } from '../../constants/Colors';

interface ButtonProps extends TouchableOpacityProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary';
  style?: ViewStyle;
}

export function Button({ children, style, variant = 'primary', ...props }: ButtonProps) {
  return (
    <TouchableOpacity 
      style={[
        styles.button,
        variant === 'primary' ? styles.primaryButton : styles.secondaryButton,
        style,
      ]} 
      activeOpacity={0.8}
      {...props}
    >
      {children}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButton: {
    backgroundColor: Colors.light.primary,
  },
  secondaryButton: {
    backgroundColor: 'rgba(0,0,0,0.05)',
  },
});