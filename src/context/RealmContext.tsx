import React, { createContext, useContext } from 'react';
import Realm from 'realm';
import { Employee } from '../models/Employee';
import { Payment } from '../models/Payment';
import { Attendance } from '../models/Attendance';

const RealmContext = createContext<{ realm: Realm | null }>({ realm: null });

const RealmConfig: Realm.Configuration = {
  schema: [Employee, Payment, Attendance],
  schemaVersion: 4,
  migration: (oldRealm, newRealm) => {
    if (oldRealm.schemaVersion < 4) {
      const oldObjects = oldRealm.objects('Employee');
      const newObjects = newRealm.objects('Employee');

      for (let i = 0; i < oldObjects.length; i++) {
        newObjects[i] = oldObjects[i];
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
        // Delete the realm file to start fresh with new schema
        await Realm.deleteFile(RealmConfig);
        
        const realmInstance = await Realm.open(RealmConfig);
        if (isActive) {
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
