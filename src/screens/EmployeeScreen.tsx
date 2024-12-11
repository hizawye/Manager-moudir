import React, { useState, useEffect } from "react";
import { View, Text, TextInput, Button, FlatList } from "react-native";
import Realm from "realm";
import { useRealm } from "../context/RealmContext";
import { Employee } from "../models/Employee";

type RealmEmployee = Realm.Object & Employee;
type EmployeeItem = {
  _id: Realm.BSON.ObjectId;
  name: string;
  phone: string;
  dailyWage: number;
  createdAt: Date;
};

const EmployeeScreen = () => {
  const { realm } = useRealm();
  const [employees, setEmployees] = useState<Realm.Results<RealmEmployee>>();
  const [newEmployeeName, setNewEmployeeName] = useState("");

  useEffect(() => {
    if (realm) {
      const allEmployees = realm.objects<Employee>("Employee");
      setEmployees(allEmployees as unknown as Realm.Results<RealmEmployee>);
    }
  }, [realm]);

  const addEmployee = () => {
    if (realm && newEmployeeName) {
      realm.write(() => {
        realm.create<Employee>("Employee", {
          _id: new Realm.BSON.ObjectId(),
          name: newEmployeeName,
          createdAt: new Date(),
        });
      });
      setNewEmployeeName("");
    }
  };

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <TextInput
        placeholder="Employee Name"
        value={newEmployeeName}
        onChangeText={setNewEmployeeName}
        style={{
          borderWidth: 1,
          borderColor: "gray",
          padding: 10,
          marginBottom: 10,
        }}
      />
      <Button title="Add Employee" onPress={addEmployee} />

      <FlatList<EmployeeItem>
        data={employees?.toJSON() as EmployeeItem[]}
        keyExtractor={(item) => item._id.toString()}
        renderItem={({ item }) => (
          <View style={{ padding: 10, borderBottomWidth: 1 }}>
            <Text>{item.name}</Text>
          </View>
        )}
      />
    </View>
  );
};

export default EmployeeScreen;
