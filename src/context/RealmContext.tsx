import React, { createContext, useContext } from 'react';
import Realm from 'realm';
import { Employee } from '../models/Employee';
import { Payment } from '../models/Payment';
import { Attendance } from '../models/Attendance';

const RealmContext = createContext<{ realm: Realm | null }>({ realm: null });

const RealmConfig: Realm.Configuration = {
  schema: [Employee, Payment, Attendance],
  schemaVersion: 4,
  onMigration: (oldRealm, newRealm) => {
    // Only migrate if schema version is less than current
    if (oldRealm.schemaVersion < 4) {
      const oldEmployees = oldRealm.objects('Employee');
      const newEmployees = newRealm.objects('Employee');

      // Copy old data to new schema
      for (let i = 0; i < oldEmployees.length; i++) {
        const oldEmployee = oldEmployees[i];
        newEmployees[i] = {
          _id: oldEmployee._id,
          name: oldEmployee.name,
          phone: oldEmployee.phone,
          dailyWage: oldEmployee.dailyWage,
          createdAt: oldEmployee.createdAt,
        };
      }
    }
  },
};

export function RealmProvider({ children }: { children: React.ReactNode }) {
  const [realm, setRealm] = React.useState<Realm | null>(null);

  React.useEffect(() => {
    let isActive = true;

    const openRealm = async () => {
      try {
        console.log('Opening Realm database...');
        const realmInstance = await Realm.open(RealmConfig);
        if (isActive) {
          console.log('Realm opened successfully');
          setRealm(realmInstance);
        }
      } catch (error) {
        console.error('Failed to open realm:', error);
      }
    };

    openRealm();

    return () => {
      isActive = false;
      if (realm && !realm.isClosed) {
        console.log('Closing Realm database...');
        realm.close();
      }
    };
  }, []);

  return (
    <RealmContext.Provider value={{ realm }}>
      {children}
    </RealmContext.Provider>
  );
}

export function useRealm() {
  return useContext(RealmContext);
}
