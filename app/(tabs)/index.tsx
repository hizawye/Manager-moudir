import React, { useState, useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
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

type RealmEmployee = Realm.Object & Employee;

export default function IndexScreen() {
  const { realm } = useRealm();
  const { isDarkMode } = useTheme();
  const [modalVisible, setModalVisible] = useState(false);
  const [employees, setEmployees] = useState<Realm.Results<RealmEmployee> | null>(null);

  useEffect(() => {
    if (realm) {
      const results = realm.objects<Employee>('Employee').sorted('createdAt', true);
      setEmployees(results as unknown as Realm.Results<RealmEmployee>);

      results.addListener(() => {
        setEmployees(realm.objects<Employee>('Employee').sorted('createdAt', true) as unknown as Realm.Results<RealmEmployee>);
      });

      return () => {
        results.removeAllListeners();
      };
    }
  }, [realm]);

  const handleAddEmployee = (employee: { name: string; phone: string; dailyWage: string }) => {
    if (realm) {
      realm.write(() => {
        realm.create('Employee', {
          _id: new Realm.BSON.ObjectId(),
          name: employee.name,
          phone: employee.phone,
          dailyWage: parseInt(employee.dailyWage, 10),
          createdAt: new Date(),
        });
      });
    }
    setModalVisible(false);
  };

  return (
    <ThemedView variant="secondary" style={styles.container}>
      <View style={styles.header}>
        <ThemedText type="title">Employees</ThemedText>
        <Button 
          onPress={() => setModalVisible(true)}
          icon="person.badge.plus"
          style={styles.addButton}
        >
          Add Employee
        </Button>
      </View>

      {!employees || employees.length === 0 ? (
        <ThemedView variant="primary" style={styles.emptyState}>
          <IconSymbol 
            name="person.2.fill" 
            size={48} 
            color={isDarkMode ? Colors.dark.text : Colors.light.text} 
          />
          <ThemedText style={styles.emptyText}>No employees added yet</ThemedText>
        </ThemedView>
      ) : (
        <View style={styles.employeeList}>
          {Array.from(employees).map((employee) => (
            <ThemedView 
              key={employee._id.toHexString()} 
              variant="secondary"
              style={styles.employeeCard}
            >
              <View style={styles.employeeHeader}>
                <ThemedText type="defaultSemiBold" style={styles.employeeName}>
                  {employee.name}
                </ThemedText>
                <ThemedView style={styles.badge}>
                  <ThemedText style={styles.badgeText}>
                    {employee.dailyWage} DZD/day
                  </ThemedText>
                </ThemedView>
              </View>
              <ThemedText style={styles.employeeInfo}>
                📱 {employee.phone}
              </ThemedText>
            </ThemedView>
          ))}
        </View>
      )}

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
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  addButton: {
    backgroundColor: Colors.light.tint,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
    margin: 8,
    borderRadius: 16,
    borderWidth: 1,
  },
  emptyText: {
    fontSize: 16,
  },
  employeeList: {
    gap: 12,
  },
  employeeCard: {
    padding: 16,
    borderRadius: 16,
    gap: 8,
    borderWidth: 1,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 3,
  },
  employeeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  employeeName: {
    fontSize: 18,
  },
  employeeInfo: {
    fontSize: 15,
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  badgeText: {
    fontSize: 14,
    fontWeight: '600',
  },
});
