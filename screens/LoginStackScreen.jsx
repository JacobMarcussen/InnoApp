import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import Login from "./Login";
import CreateUser from "./CreateUser";

const LoginStack = createStackNavigator();

// Stack navigator til at håndtere navigationen i Login og CreateUser, som menu punkt, hvis brugeren ikke er logget ind
export default function LoginStackScreen() {
  return (
    <LoginStack.Navigator initialRouteName='Login'>
      <LoginStack.Screen name='Login' component={Login} options={{ headerShown: false }} />
      <LoginStack.Screen name='CreateUser' component={CreateUser} options={{ headerShown: false }} />
    </LoginStack.Navigator>
  );
}
