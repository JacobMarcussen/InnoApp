import { View } from "react-native";
import { getApps, initializeApp } from "firebase/app";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import Ionicons from "react-native-vector-icons/Ionicons";
import Home from "./screens/Home";

const Notifications = () => {
  return <View />;
};

const Profile = () => {
  return <View />;
};

const Settings = () => {
  return <View />;
};

const firebaseConfig = {
  apiKey: "AIzaSyC6HD7P-cAbiWaorxUt7V5CBzxwJdh1rU0",
  authDomain: "spisgaadt-7af47.firebaseapp.com",
  projectId: "spisgaadt-7af47",
  storageBucket: "spisgaadt-7af47.appspot.com",
  messagingSenderId: "41873558589",
  appId: "1:41873558589:web:d5830a42ffa05ed579ae54",
};

if (getApps().length < 1) {
  initializeApp(firebaseConfig);
  console.log("Firebase On!");
  // Initialize other firebase products here
}

export default function App() {
  const Stack = createStackNavigator();
  const Tab = createBottomTabNavigator();

  function StackNavigator() {
    return (
      <Stack.Navigator>
        <Stack.Screen name="Notifications" component={Notifications} />
        <Stack.Screen name="Profile" component={Profile} />
        <Stack.Screen name="Settings" component={Settings} />
      </Stack.Navigator>
    );
  }

  return (
    <>
      <NavigationContainer>
        <Tab.Navigator>
          <Tab.Screen
            name={"Home"}
            component={Home}
            options={{ tabBarIcon: () => <Ionicons name="home" size={20} />, headerShown: false }}
          />
          <Tab.Screen
            name="Settings"
            component={Settings}
            options={{ tabBarIcon: () => <Ionicons name="settings" size={20} /> }}
          />
        </Tab.Navigator>
      </NavigationContainer>
    </>
  );
}
