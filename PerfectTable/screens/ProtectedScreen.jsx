import { View } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import Ionicons from "react-native-vector-icons/Ionicons";
import Search from "./Search";
import Locations from "./Locations";
import LocationDetails from "./LocationDetails";
import MapSearch from "./MapSearch";
import Profile from "./Profile"
// Stack Navigator for Locations
const LocationsStack = createStackNavigator();

function LocationsStackScreen() {
  return (
    <LocationsStack.Navigator initialRouteName="Locations">
      <LocationsStack.Screen
        name="Locations"
        component={Locations}
        options={{ headerShown: false }}
      />
      <LocationsStack.Screen
        name="LocationDetails"
        component={LocationDetails}
        options={{ headerShown: false }}
      />
    </LocationsStack.Navigator>
  );
}

const SearchStack = createStackNavigator();

function SearchStackScreen() {
  return (
    <SearchStack.Navigator initialRouteName="Search">
      <SearchStack.Screen
        name="Search"
        component={Search}
        options={{ headerShown: false }}
      />
      <SearchStack.Screen
        name="MapSearch"
        component={MapSearch}
        options={{ headerShown: false }}
      />
      <LocationsStack.Screen
        name="LocationDetails"
        component={LocationDetails}
        options={{ headerShown: false }}
      />
    </SearchStack.Navigator>
  );
}

const Tab = createBottomTabNavigator();

export default function ProtectedScreen() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarStyle: {
          backgroundColor: "#fff",
          borderTopColor: "#EAEAEA",
          paddingBottom: 25,
          paddingTop: 10,
        },
        tabBarActiveTintColor: "#FF4500",
        tabBarInactiveTintColor: "#B0B0B0",
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === "Udforsk") {
            iconName = focused ? "home" : "home-outline";
          } else if (route.name === "Søg") {
            iconName = focused ? "search" : "search-outline";
          } else if (route.name === "Settings") {
            iconName = focused ? "settings" : "settings-outline";
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarLabelStyle: {
          fontSize: 12,
          paddingBottom: 0,
        },
      })}
    >
      <Tab.Screen
        name="Udforsk"
        component={LocationsStackScreen} 
        options={{ headerShown: false }}
      />
      <Tab.Screen
        name="Søg"
        component={SearchStackScreen} 
        options={{ headerShown: false }}
      />
      <Tab.Screen
        name="Profil"
        component={Profile}
        options={{ headerShown: false }}
      />
    </Tab.Navigator>
  );
}
