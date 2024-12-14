import React, { useEffect, useState } from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Button } from '@/components/ui/Button';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { Colors } from '@/constants/Colors';
import { useRealm } from '@/context/RealmContext';
import { format } from 'date-fns';
import Realm from 'realm';
import { Employee } from '@/models/Employee';
import { Payment } from '@/models/Payment';
import { Attendance } from '@/models/Attendance';

export default function EmployeeHistoryScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { realm } = useRealm();
  const [employee, setEmployee] = useState<(Realm.Object & Employee) | null>(null);
  const [payments, setPayments] = useState<(Realm.Object & Payment)[]>([]);
  const [attendance, setAttendance] = useState<(Realm.Object & Attendance)[]>([]);

  useEffect(() => {
    if (realm && id) {
      const employeeObj = realm.objectForPrimaryKey<Employee>(
        'Employee',
        new Realm.BSON.ObjectId(id as string)
      );
      setEmployee(employeeObj);

      if (employeeObj) {
        const employeePayments = realm.objects<Payment>('Payment')
          .filtered('employeeId == $0', employeeObj._id)
          .sorted('date', true);
        
        const employeeAttendance = realm.objects<Attendance>('Attendance')
          .filtered('employeeId == $0', employeeObj._id)
          .sorted('date', true);

        setPayments(Array.from(employeePayments));
        setAttendance(Array.from(employeeAttendance));
      }
    }
  }, [realm, id]);

  if (!employee) {
    return (
      <ThemedView style={styles.container}>
        <ThemedText>Employee not found</ThemedText>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <View style={styles.header}>
        <Button
          onPress={() => router.back()}
          style={styles.backButton}
          variant="secondary"
        >
          <IconSymbol name="chevron.left" size={20} color={Colors.light.text} />
          <ThemedText>Back</ThemedText>
        </Button>
        <ThemedText style={styles.title}>{employee.name}</ThemedText>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>Payment History</ThemedText>
          {payments.map((payment) => (
            <View key={payment._id.toString()} style={styles.historyItem}>
              <View>
                <ThemedText style={styles.amount}>${payment.amount}</ThemedText>
                <ThemedText style={styles.date}>
                  {format(payment.date, 'MMM d, yyyy')}
                </ThemedText>
              </View>
              {payment.note && (
                <ThemedText style={styles.note}>{payment.note}</ThemedText>
              )}
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>Attendance History</ThemedText>
          {attendance.map((record) => (
            <View key={record._id.toString()} style={styles.historyItem}>
              <ThemedText style={styles.date}>
                {format(record.date, 'MMM d, yyyy')}
              </ThemedText>
              <View style={[
                styles.status,
                { backgroundColor: record.paid ? Colors.light.success : Colors.light.error }
              ]}>
                <ThemedText style={styles.statusText}>
                  {record.paid ? 'Paid' : 'Unpaid'}
                </ThemedText>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
  },
  content: {
    flex: 1,
  },
  section: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  historyItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
  amount: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.light.success,
  },
  date: {
    fontSize: 14,
    opacity: 0.7,
  },
  note: {
    fontSize: 14,
    opacity: 0.7,
    fontStyle: 'italic',
  },
  status: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  statusText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
});