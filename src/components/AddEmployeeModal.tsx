import { useState } from 'react';
import { Modal, StyleSheet, TextInput, View } from 'react-native';
import { ThemedText } from './ThemedText';
import { Button } from './ui/Button';
import { Colors } from '../constants/Colors';
import { useTheme } from '@/contexts/ThemeContext';

interface AddEmployeeModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (employee: { name: string; phone: string; dailyWage: number }) => void;
}

export function AddEmployeeModal({ visible, onClose, onSubmit }: AddEmployeeModalProps) {
  const { isDarkMode } = useTheme();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [dailyWage, setDailyWage] = useState('');

  const handleSubmit = () => {
    // Convert dailyWage to integer and validate
    const wageValue = Math.floor(Number(dailyWage));
    if (isNaN(wageValue) || wageValue <= 0) {
      alert('Please enter a valid daily wage');
      return;
    }

    onSubmit({ 
      name, 
      phone, 
      dailyWage: wageValue
    });
    setName('');
    setPhone('');
    setDailyWage('');
    onClose();
  };

  const handleWageChange = (text: string) => {
    // Only allow numbers
    const numericValue = text.replace(/[^0-9]/g, '');
    setDailyWage(numericValue);
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
            onChangeText={handleWageChange}
            keyboardType="number-pad"
          />

          <View style={styles.buttonContainer}>
            <Button 
              onPress={onClose}
              style={[
                styles.cancelButton,
                { backgroundColor: isDarkMode ? Colors.dark.cardBackground : Colors.light.cardBackground }
              ]}
            >
              <ThemedText>Cancel</ThemedText>
            </Button>
            <Button 
              onPress={handleSubmit}
              style={styles.submitButton}
              variant="primary"
            >
              <ThemedText style={{ color: '#fff' }}>Add Employee</ThemedText>
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
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    height: 44,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 16,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
    marginTop: 8,
  },
  cancelButton: {
    flex: 1,
    height: 44,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  submitButton: {
    flex: 1,
    height: 44,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
});