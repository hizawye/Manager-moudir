import { useState } from 'react';
import { Modal, StyleSheet, TextInput, View } from 'react-native';
import { ThemedText } from './ThemedText';
import { Button } from './ui/Button';
import { Colors } from '@/constants/Colors';
import { useTheme } from '@/contexts/ThemeContext';

interface AddPaymentModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (employeeId: Realm.BSON.ObjectId, amount: number) => void;
  employeeId: Realm.BSON.ObjectId;
}

export function AddPaymentModal({ visible, onClose, onSubmit, employeeId }: AddPaymentModalProps) {
  const { isDarkMode } = useTheme();
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');

  const handleSubmit = () => {
    onSubmit(employeeId, parseFloat(amount));
    setAmount('');
    setNote('');
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
            Add Payment
          </ThemedText>
          
          <TextInput
            style={[styles.input, { color: isDarkMode ? Colors.dark.text : Colors.light.text }]}
            placeholder="Amount (DZD)"
            placeholderTextColor={isDarkMode ? Colors.dark.border : Colors.light.border}
            value={amount}
            onChangeText={setAmount}
            keyboardType="numeric"
          />

          <TextInput
            style={[styles.input, { color: isDarkMode ? Colors.dark.text : Colors.light.text }]}
            placeholder="Note (optional)"
            placeholderTextColor={isDarkMode ? Colors.dark.border : Colors.light.border}
            value={note}
            onChangeText={setNote}
            multiline
          />

          <View style={styles.buttonContainer}>
            <Button onPress={onClose} style={styles.cancelButton}>
              Cancel
            </Button>
            <Button onPress={handleSubmit} style={styles.submitButton}>
              Add Payment
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