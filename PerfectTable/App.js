import { NavigationContainer } from "@react-navigation/native";
import { AuthProvider } from "./components/AuthContext";
import LoginStackScreen from "./screens/LoginStackScreen";
import * as SystemUI from "expo-system-ui";
import React, { useEffect } from "react";

export default function App() {
  useEffect(() => {
    //Sætter baggrundsfarven til sort i hele appen
    SystemUI.setBackgroundColorAsync("#121212");
  }, []);
  return (
    <AuthProvider>
      <NavigationContainer>
        <LoginStackScreen />
      </NavigationContainer>
    </AuthProvider>
  );
}
