import { StyleSheet, TouchableOpacity, TouchableOpacityProps } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { IconSymbol } from '@/components/ui/IconSymbol';

interface ButtonProps extends TouchableOpacityProps {
  children: string;
  icon?: string;
}

export function Button({ children, style, icon, ...props }: ButtonProps) {
  return (
    <TouchableOpacity 
      style={[styles.button, style]} 
      activeOpacity={0.8}
      {...props}
    >
      {icon && (
        <IconSymbol 
          name="person.badge.plus" 
          size={20} 
          color="#FFFFFF" 
          style={styles.icon}
        />
      )}
      <ThemedText style={styles.text}>{children}</ThemedText>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#0066FF',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  icon: {
    marginRight: 8,
  },
}); 