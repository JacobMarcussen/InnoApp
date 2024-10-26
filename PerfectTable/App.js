import { NavigationContainer } from "@react-navigation/native";
import { AuthProvider } from "./components/AuthContext";
import LoginStackScreen from "./screens/LoginStackScreen";

export default function App() {
  return (
    <AuthProvider>
      <NavigationContainer>
        <LoginStackScreen />
      </NavigationContainer>
    </AuthProvider>
  );
}
