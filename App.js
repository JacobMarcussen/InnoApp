import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { AuthProvider } from "./components/AuthContext";
import AppNavigator from "./screens/AppNavigator";

// App komponent der returnerer AppNavigator wrapped i AuthProvider og NavigationContainer
export default function App() {
  return (
    <AuthProvider>
      <NavigationContainer>
        <AppNavigator />
      </NavigationContainer>
    </AuthProvider>
  );
}
