import React, { createContext, useContext } from 'react';
import Realm from 'realm';
import { Employee } from '../models/Employee';

const RealmContext = createContext<{ realm: Realm | null }>({ realm: null });

export function RealmProvider({ children }: { children: React.ReactNode }) {
  const [realm] = React.useState(() => {
    return new Realm({
      schema: [Employee],
      schemaVersion: 2,
      onMigration: (oldRealm: Realm, newRealm: Realm) => {
        if (oldRealm.schemaVersion < 2) {
          const oldObjects = oldRealm.objects('Employee');
          const newObjects = newRealm.objects('Employee');

          for (let i = 0; i < oldObjects.length; i++) {
            const oldObject = oldObjects[i] as any;
            const newObject = newObjects[i] as any;
            // Migrate dailyRate to dailyWage
            newObject.dailyWage = oldObject.dailyRate || 0;
          }
        }
      },
    });
  });

  React.useEffect(() => {
    return () => {
      if (!realm.isClosed) {
        realm.close();
      }
    };
  }, [realm]);

  return (
    <RealmContext.Provider value={{ realm }}>
      {children}
    </RealmContext.Provider>
  );
}

export function useRealm() {
  return useContext(RealmContext);
}
