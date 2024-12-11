import React from "react";
import { SafeAreaView, StatusBar } from "react-native";
import { RealmProvider } from "./src/context/RealmContext";
import EmployeeScreen from "./src/screens/EmployeeScreen";

export default function App() {
  return (
    <RealmProvider>
      <SafeAreaView style={{ flex: 1 }}>
        <StatusBar barStyle="dark-content" />
        <EmployeeScreen />
      </SafeAreaView>
    </RealmProvider>
  );
}
