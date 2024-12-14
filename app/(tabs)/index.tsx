import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, View, ScrollView, Pressable, RefreshControl, Animated, Alert, TextInput, Modal } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Button } from '@/components/ui/Button';
import { AddEmployeeModal } from '@/components/AddEmployeeModal';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { Colors } from '@/constants/Colors';
import { useRealm } from '@/context/RealmContext';
import { Employee } from '@/models/Employee';
import Realm, { Results } from 'realm';
import { useTheme } from '@/contexts/ThemeContext';
import { useRouter } from 'expo-router';
import { format } from 'date-fns';

type RealmEmployee = Realm.Object & Employee;

interface ExpandableCardProps {
  employee: RealmEmployee;
  expanded: boolean;
  onToggle: () => void;
  onPayment: (amount: number) => void;
  onViewHistory: () => void;
}

const ExpandableCard: React.FC<ExpandableCardProps> = ({ 
  employee, 
  expanded, 
  onToggle, 
  onPayment,
  onViewHistory 
}) => {
  console.log('Rendering ExpandableCard for employee:', employee._id, employee.name);
  const { isDarkMode } = useTheme();
  const animatedHeight = useRef(new Animated.Value(0)).current;
  const { realm } = useRealm();
  const [unpaidDays, setUnpaidDays] = useState<any[]>([]);
  const [paymentModalVisible, setPaymentModalVisible] = useState(false);
  const [paymentAmount, setPaymentAmount] = useState('');

  useEffect(() => {
    console.log('ExpandableCard useEffect - fetching attendance');
    if (realm) {
      // Fetch attendance records
      const attendance = realm.objects('Attendance')
        .filtered('employeeId == $0 AND paid == false', employee._id)
        .sorted('date', true);
      console.log('Fetched attendance records:', attendance.length);
      console.log('Attendance data:', JSON.stringify(Array.from(attendance), null, 2));
      setUnpaidDays(Array.from(attendance));
    }
  }, [realm, employee]);

  useEffect(() => {
    Animated.timing(animatedHeight, {
      toValue: expanded ? 1 : 0,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [expanded]);

  const markPresent = () => {
    console.log('Marking present for employee:', employee._id);
    if (realm) {
      try {
        realm.write(() => {
          const attendance = realm.create('Attendance', {
            _id: new Realm.BSON.ObjectId(),
            employeeId: employee._id,
            date: new Date(),
            paid: false,
          });
          console.log('Created attendance record:', attendance);
        });
        // Refresh unpaid days immediately
        const attendance = realm.objects('Attendance')
          .filtered('employeeId == $0 AND paid == false', employee._id)
          .sorted('date', true);
        console.log('Updated unpaid days count:', attendance.length);
        setUnpaidDays(Array.from(attendance));
        Alert.alert('Success', 'Attendance marked successfully');
      } catch (error) {
        console.error('Error marking attendance:', error);
        Alert.alert('Error', 'Failed to mark attendance');
      }
    } else {
      console.error('Realm not available for marking attendance');
    }
  };

  const quickPay = () => {
    console.log('Quick pay for employee:', employee._id);
    setPaymentModalVisible(true);
  };

  const handlePayment = () => {
    console.log('Processing payment for employee:', employee._id);
    const amount = Number(paymentAmount);
    console.log('Payment amount:', amount);
    console.log('Total unpaid days:', unpaidDays.length);
    const dailyWage = Math.floor(employee.dailyWage);
    console.log('Daily wage:', dailyWage);
    
    if (!amount || amount <= 0) {
      console.log('Invalid amount entered:', amount);
      Alert.alert('Error', 'Please enter a valid amount');
      return;
    }

    if (amount > dailyWage * unpaidDays.length) {
      console.log('Amount exceeds total unpaid:', amount, '>', dailyWage * unpaidDays.length);
      Alert.alert('Error', 'Amount cannot exceed total unpaid amount');
      return;
    }

    if (realm && unpaidDays.length > 0) {
      try {
        realm.write(() => {
          // Create payment record
          const payment = realm.create('Payment', {
            _id: new Realm.BSON.ObjectId(),
            employeeId: employee._id,
            amount: amount,
            date: new Date(),
            note: `Custom payment of ${amount} DZD`,
          });
          console.log('Created payment record:', payment);

          // Calculate how many days this payment covers
          const daysToMarkPaid = Math.floor(amount / dailyWage);
          console.log('Days to mark as paid:', daysToMarkPaid);
          
          // Mark days as paid starting from the oldest
          const sortedUnpaidDays = [...unpaidDays].sort((a, b) => 
            new Date(a.date).getTime() - new Date(b.date).getTime()
          );
          
          for (let i = 0; i < Math.min(daysToMarkPaid, sortedUnpaidDays.length); i++) {
            sortedUnpaidDays[i].paid = true;
            console.log('Marked day as paid:', sortedUnpaidDays[i].date);
          }
        });

        // Refresh unpaid days immediately
        const attendance = realm.objects('Attendance')
          .filtered('employeeId == $0 AND paid == false', employee._id)
          .sorted('date', true);
        console.log('Updated unpaid days after payment:', attendance.length);
        setUnpaidDays(Array.from(attendance));
        
        Alert.alert('Success', 'Payment processed successfully');
        setPaymentModalVisible(false);
        setPaymentAmount('');
      } catch (error) {
        console.error('Error processing payment:', error);
        Alert.alert('Error', 'Failed to process payment');
      }
    } else {
      console.log('Cannot process payment: realm available:', !!realm, 'unpaid days:', unpaidDays.length);
      Alert.alert('Info', 'No unpaid days to process');
    }
  };

  const dailyWage = Math.floor(employee.dailyWage);
  const totalUnpaid = dailyWage * unpaidDays.length;

  return (
    <Pressable
      style={({ pressed }) => [
        styles.card,
        {
          backgroundColor: isDarkMode ? Colors.dark.secondaryBackground : Colors.light.secondaryBackground,
          opacity: pressed ? 0.9 : 1,
          transform: [{ scale: pressed ? 0.98 : 1 }],
        },
      ]}
      onPress={onToggle}
    >
      <View style={styles.cardHeader}>
        <View style={styles.avatarContainer}>
          <ThemedText style={styles.avatarText}>
            {employee.name.charAt(0).toUpperCase()}
          </ThemedText>
        </View>
        <View style={styles.cardHeaderText}>
          <ThemedText style={styles.employeeName}>{employee.name}</ThemedText>
          <ThemedText style={styles.employeePhone}>{employee.phone}</ThemedText>
        </View>
        <View style={styles.wageContainer}>
          <ThemedText style={styles.wageText}>{dailyWage} DZD/day</ThemedText>
        </View>
      </View>

      <Animated.View style={[
        styles.expandedContent,
        {
          maxHeight: animatedHeight.interpolate({
            inputRange: [0, 1],
            outputRange: [0, 200],
          }),
        },
      ]}>
        <View style={styles.actionButtons}>
          <Button 
            onPress={markPresent}
            style={styles.actionButton}
            variant="primary"
          >
            <IconSymbol name="checkmark.circle.fill" size={20} color="#fff" />
            <ThemedText style={[styles.buttonText, { color: '#fff' }]}>Mark Present</ThemedText>
          </Button>

          <Button 
            onPress={quickPay}
            style={[styles.actionButton, { backgroundColor: Colors.light.success }]}
            variant="primary"
          >
            <IconSymbol name="dollarsign.circle.fill" size={20} color="#fff" />
            <ThemedText style={[styles.buttonText, { color: '#fff' }]}>
              Pay
            </ThemedText>
          </Button>

          <Button 
            onPress={onViewHistory}
            style={styles.actionButton}
            variant="secondary"
          >
            <IconSymbol name="clock.fill" size={20} color={isDarkMode ? Colors.dark.text : Colors.light.text} />
            <ThemedText>History</ThemedText>
          </Button>
        </View>

        {unpaidDays.length > 0 && (
          <View style={styles.unpaidDaysContainer}>
            <ThemedText style={styles.unpaidDaysTitle}>Unpaid Days: {unpaidDays.length}</ThemedText>
            <ThemedText style={styles.unpaidDaysAmount}>
              Total: {totalUnpaid} DZD
            </ThemedText>
          </View>
        )}

        <Modal
          animationType="slide"
          transparent={true}
          visible={paymentModalVisible}
          onRequestClose={() => {
            setPaymentModalVisible(false);
            setPaymentAmount('');
          }}
        >
          <View style={styles.modalOverlay}>
            <View style={[
              styles.modalContent,
              {
                backgroundColor: isDarkMode ? Colors.dark.secondaryBackground : Colors.light.secondaryBackground,
              }
            ]}>
              <ThemedText style={styles.modalTitle}>Enter Payment Amount</ThemedText>
              <TextInput
                style={[
                  styles.paymentInput,
                  {
                    color: isDarkMode ? Colors.dark.text : Colors.light.text,
                    borderColor: isDarkMode ? Colors.dark.border : Colors.light.border,
                  }
                ]}
                placeholder="Amount in DZD"
                placeholderTextColor={isDarkMode ? Colors.dark.textSecondary : Colors.light.textSecondary}
                keyboardType="numeric"
                value={paymentAmount}
                onChangeText={setPaymentAmount}
              />
              <View style={styles.modalButtons}>
                <Button
                  onPress={() => {
                    setPaymentModalVisible(false);
                    setPaymentAmount('');
                  }}
                  style={[styles.modalButton, { backgroundColor: Colors.light.error }]}
                  variant="primary"
                >
                  <ThemedText style={{ color: '#fff' }}>Cancel</ThemedText>
                </Button>
                <Button
                  onPress={handlePayment}
                  style={[styles.modalButton, { backgroundColor: Colors.light.success }]}
                  variant="primary"
                >
                  <ThemedText style={{ color: '#fff' }}>Pay</ThemedText>
                </Button>
              </View>
            </View>
          </View>
        </Modal>
      </Animated.View>
    </Pressable>
  );
};

export default function IndexScreen() {
  const { realm } = useRealm();
  const { isDarkMode } = useTheme();
  const [modalVisible, setModalVisible] = useState(false);
  const [employees, setEmployees] = useState<Realm.Results<RealmEmployee> | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    console.log('IndexScreen mounted, realm:', realm ? 'available' : 'not available');
    if (realm) {
      const results = realm.objects<Employee>('Employee').sorted('createdAt', true);
      console.log('Fetched employees:', results.length);
      console.log('Employee data:', JSON.stringify(Array.from(results), null, 2));
      setEmployees(results as unknown as Realm.Results<RealmEmployee>);

      results.addListener(() => {
        console.log('Employee data changed, refreshing...');
        const updatedResults = realm.objects<Employee>('Employee').sorted('createdAt', true);
        console.log('Updated employees count:', updatedResults.length);
        setEmployees(updatedResults as unknown as Realm.Results<RealmEmployee>);
      });

      return () => {
        console.log('Cleaning up employee listeners');
        results.removeAllListeners();
      };
    }
  }, [realm]);

  const handleAddEmployee = (employee: { name: string; phone: string; dailyWage: number }) => {
    console.log('Adding new employee:', employee);
    if (realm) {
      realm.write(() => {
        realm.create('Employee', {
          _id: new Realm.BSON.ObjectId(),
          name: employee.name,
          phone: employee.phone,
          dailyWage: employee.dailyWage,
          createdAt: new Date(),
        });
      });
    }
    setModalVisible(false);
  };

  const handlePayment = (employeeId: Realm.BSON.ObjectId, amount: number) => {
    console.log('Processing payment for employee:', employeeId);
    if (realm) {
      realm.write(() => {
        realm.create('Payment', {
          _id: new Realm.BSON.ObjectId(),
          employeeId,
          amount: Math.floor(amount),
          date: new Date(),
          note: 'Quick payment',
        });
      });
    }
  };

  const onRefresh = React.useCallback(() => {
    console.log('Refreshing employee list');
    setRefreshing(true);
    if (realm) {
      const results = realm.objects<Employee>('Employee').sorted('createdAt', true);
      console.log('Updated employees count:', results.length);
      setEmployees(results as unknown as Realm.Results<RealmEmployee>);
    }
    setRefreshing(false);
  }, [realm]);

  return (
    <ThemedView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View style={styles.header}>
          <ThemedText style={styles.title}>Team Members</ThemedText>
          <Button
            onPress={() => setModalVisible(true)}
            style={styles.addButton}
            variant="primary"
          >
            <IconSymbol name="plus" size={20} color="#FFFFFF" />
            <ThemedText style={styles.buttonText}>Add Employee</ThemedText>
          </Button>
        </View>

        <View style={styles.grid}>
          {employees?.map((employee) => (
            <ExpandableCard
              key={employee._id.toString()}
              employee={employee}
              expanded={expandedId === employee._id.toString()}
              onToggle={() => setExpandedId(
                expandedId === employee._id.toString() ? null : employee._id.toString()
              )}
              onPayment={(amount) => handlePayment(employee._id, amount)}
              onViewHistory={() => router.push(`/employee/${employee._id.toString()}`)}
            />
          ))}
        </View>
      </ScrollView>

      <AddEmployeeModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSubmit={handleAddEmployee}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  buttonText: {
    color: '#FFFFFF',
    marginLeft: 8,
    fontWeight: '600',
  },
  grid: {
    gap: 16,
  },
  card: {
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatarContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.light.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
  cardHeaderText: {
    flex: 1,
  },
  employeeName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  employeePhone: {
    fontSize: 14,
    opacity: 0.7,
  },
  wageContainer: {
    marginLeft: 'auto',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    backgroundColor: 'rgba(0,0,0,0.05)',
  },
  wageText: {
    fontSize: 14,
    fontWeight: '600',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    gap: 8,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    paddingVertical: 8,
  },
  buttonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  unpaidDaysContainer: {
    backgroundColor: 'rgba(0,0,0,0.05)',
    padding: 12,
    borderRadius: 8,
    marginTop: 8,
  },
  unpaidDaysTitle: {
    fontSize: 14,
    fontWeight: '600',
  },
  unpaidDaysAmount: {
    fontSize: 16,
    fontWeight: '700',
    marginTop: 4,
  },
  expandedContent: {
    overflow: 'hidden',
    marginTop: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.1)',
    paddingTop: 16,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '80%',
    padding: 20,
    borderRadius: 10,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  paymentInput: {
    height: 50,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 20,
    fontSize: 16,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  modalButton: {
    minWidth: 100,
  },
});
