import { NavigationContainer } from "@react-navigation/native";
import { AuthProvider } from "./components/AuthContext";
import LoginStackScreen from "./screens/LoginStackScreen";
import * as SystemUI from "expo-system-ui";
import React, { useEffect } from "react";

export default function App() {
  return (
    <AuthProvider>
      <NavigationContainer>
        <LoginStackScreen />
      </NavigationContainer>
    </AuthProvider>
  );
}
