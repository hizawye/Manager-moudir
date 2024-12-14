import { PropsWithChildren, useState } from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Colors } from '@/constants/Colors';
import { useTheme } from '@/contexts/ThemeContext';

type CollapsibleProps = PropsWithChildren & {
  title: string;
  summary?: React.ReactNode;
};

export function Collapsible({ children, title, summary }: CollapsibleProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { isDarkMode } = useTheme();

  return (
    <ThemedView>
      <TouchableOpacity
        style={styles.heading}
        onPress={() => setIsOpen((value) => !value)}
        activeOpacity={0.8}>
        <Feather
          name="chevron-right"
          size={18}
          color={isDarkMode ? Colors.dark.text : Colors.light.text}
          style={{ transform: [{ rotate: isOpen ? '90deg' : '0deg' }] }}
        />

        {summary ?? <ThemedText type="defaultSemiBold">{title}</ThemedText>}
      </TouchableOpacity>
      {isOpen && <ThemedView style={styles.content}>{children}</ThemedView>}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  heading: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  content: {
    marginTop: 6,
    marginLeft: 24,
  },
});
