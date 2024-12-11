import { useState } from 'react';
import { Modal, StyleSheet, TextInput, View } from 'react-native';
import { ThemedText } from './ThemedText';
import { Button } from './ui/Button';
import { Colors } from '../constants/Colors';
import { useTheme } from '@/contexts/ThemeContext';

interface AddEmployeeModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (employee: { name: string; phone: string; dailyWage: string }) => void;
}

export function AddEmployeeModal({ visible, onClose, onSubmit }: AddEmployeeModalProps) {
  const { isDarkMode } = useTheme();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [dailyWage, setDailyWage] = useState('');

  const handleSubmit = () => {
    onSubmit({ name, phone, dailyWage });
    setName('');
    setPhone('');
    setDailyWage('');
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.modalContainer}>
        <View style={[
          styles.modalContent,
          { 
            backgroundColor: isDarkMode ? Colors.dark.background : Colors.light.background,
            borderColor: isDarkMode ? Colors.dark.border : Colors.light.border,
          }
        ]}>
          <ThemedText type="subtitle" style={styles.modalTitle}>
            Add New Employee
          </ThemedText>
          
          <TextInput
            style={[
              styles.input,
              {
                borderColor: isDarkMode ? Colors.dark.border : Colors.light.border,
                backgroundColor: isDarkMode ? Colors.dark.cardBackground : Colors.light.cardBackground,
                color: isDarkMode ? Colors.dark.text : Colors.light.text,
              }
            ]}
            placeholder="Full Name"
            placeholderTextColor={isDarkMode ? Colors.dark.border : Colors.light.border}
            value={name}
            onChangeText={setName}
          />
          
          <TextInput
            style={[
              styles.input,
              {
                borderColor: isDarkMode ? Colors.dark.border : Colors.light.border,
                backgroundColor: isDarkMode ? Colors.dark.cardBackground : Colors.light.cardBackground,
                color: isDarkMode ? Colors.dark.text : Colors.light.text,
              }
            ]}
            placeholder="Phone Number"
            placeholderTextColor={isDarkMode ? Colors.dark.border : Colors.light.border}
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
          />
          
          <TextInput
            style={[
              styles.input,
              {
                borderColor: isDarkMode ? Colors.dark.border : Colors.light.border,
                backgroundColor: isDarkMode ? Colors.dark.cardBackground : Colors.light.cardBackground,
                color: isDarkMode ? Colors.dark.text : Colors.light.text,
              }
            ]}
            placeholder="Daily Wage (DZD)"
            placeholderTextColor={isDarkMode ? Colors.dark.border : Colors.light.border}
            value={dailyWage}
            onChangeText={setDailyWage}
            keyboardType="numeric"
          />

          <View style={styles.buttonContainer}>
            <Button 
              onPress={onClose}
              style={[
                styles.cancelButton,
                { backgroundColor: isDarkMode ? Colors.dark.cardBackground : Colors.light.cardBackground }
              ]}
            >
              Cancel
            </Button>
            <Button 
              onPress={handleSubmit}
              style={[
                styles.submitButton,
                { backgroundColor: isDarkMode ? Colors.dark.tint : Colors.light.tint }
              ]}
            >
              Add Employee
            </Button>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    width: '90%',
    borderRadius: 12,
    padding: 20,
    gap: 16,
    borderWidth: 1,
  },
  modalTitle: {
    textAlign: 'center',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  cancelButton: {
    flex: 1,
  },
  submitButton: {
    flex: 1,
  },
}); 