import { NavigationContainer } from "@react-navigation/native";
import { AuthProvider } from "./components/AuthContext"; // Juster stien til AuthContext
import LoginStackScreen from "./screens/LoginStackScreen"; // Juster stien til din LoginStackScreen

export default function App() {
  return (
    <AuthProvider>
      <NavigationContainer>
        <LoginStackScreen />
      </NavigationContainer>
    </AuthProvider>
  );
}
