import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { useAuth } from "../components/AuthContext";
import Login from "./Login";
import CreateUser from "./CreateUser";
import ProtectedScreen from "./ProtectedScreen";

const LoginStack = createStackNavigator();

function LoginStackScreen() {
  const { isAuthenticated } = useAuth(); // Få adgang til autentificeringsstatus

  return (
    <LoginStack.Navigator initialRouteName="Login">
      {isAuthenticated ? (
        // Hvis brugeren er logget ind, naviger til beskyttede skærme
        <LoginStack.Screen
          name="ProtectedScreen" // Erstat med din beskyttede skærm
          component={ProtectedScreen} // Erstat med din beskyttede komponent
          options={{ headerShown: false }}
        />
      ) : (
        // Hvis ikke logget ind, vis login og createUser
        <>
          <LoginStack.Screen
            name="Login"
            component={Login}
            options={{ headerShown: false }}
          />
          <LoginStack.Screen
            name="CreateUser"
            component={CreateUser}
            options={{ headerShown: false }}
          />
        </>
      )}
    </LoginStack.Navigator>
  );
}

export default LoginStackScreen;
