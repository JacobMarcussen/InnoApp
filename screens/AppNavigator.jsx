// AppNavigator viser screens afhængig af om brugeren er logget ind eller ej

import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { useAuth } from "../components/AuthContext";
import Profile from "./Profile";
import LoginStackScreen from "./LoginStackScreen";
import Locations from "./Locations";
import LocationDetails from "./LocationDetails";
import AddReview from "./AddReview";
import Search from "./Search";
import MapSearch from "./MapSearch";
import FilterScreen from "./SearchFilter";
import { createStackNavigator } from "@react-navigation/stack";
import Ionicons from "react-native-vector-icons/Ionicons";

const Tab = createBottomTabNavigator();
const LocationsStack = createStackNavigator();
const SearchStack = createStackNavigator();

// Stack navigator til at håndtere navigationen i Locations (udforsk)
function LocationsStackScreen() {
  return (
    <LocationsStack.Navigator initialRouteName='Locations'>
      <LocationsStack.Screen name='Locations' component={Locations} options={{ headerShown: false }} />
      <LocationsStack.Screen name='LocationDetails' component={LocationDetails} options={{ headerShown: false }} />
      <LocationsStack.Screen name='AddReview' component={AddReview} options={{ headerShown: false }} />
    </LocationsStack.Navigator>
  );
}

// Stack navigator til at håndtere navigationen i Søg
function SearchStackScreen() {
  return (
    <SearchStack.Navigator initialRouteName='Filter'>
      <SearchStack.Screen name='Filter' component={FilterScreen} options={{ headerShown: false }} />
      <SearchStack.Screen name='Search' component={Search} options={{ headerShown: false }} />
      <SearchStack.Screen name='MapSearch' component={MapSearch} options={{ headerShown: false }} />
      <SearchStack.Screen name='LocationDetails' component={LocationDetails} options={{ headerShown: false }} />
    </SearchStack.Navigator>
  );
}

export default function AppNavigator() {
  // Bruger useAuth hook'en til at hente isAuthenticated state
  const { isAuthenticated } = useAuth();

  return (
    // Bottom tab navigator til at vise Udforsk, Søg og Profil screens og viser icon baseret på route navn
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarStyle: {
          backgroundColor: "#1e1e1e",
          borderTopColor: "#1e1e1e",
          paddingBottom: 25,
          paddingTop: 10,
        },
        tabBarActiveTintColor: "#FF4500",
        tabBarInactiveTintColor: "#B0B0B0",
        tabBarLabelStyle: {
          fontSize: 12,
          paddingBottom: 0,
        },
        // Viser forskellige ikoner baseret på route navn, så den aktive screen bliver highlightet
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === "Udforsk") {
            iconName = focused ? "home" : "home-outline";
          } else if (route.name === "Søg") {
            iconName = focused ? "search" : "search-outline";
          } else if (route.name === "Profil") {
            iconName = focused ? "person" : "person-outline";
          } else if (route.name === "Login") {
            iconName = focused ? "log-in" : "log-in-outline";
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      {/* Viser Udforsk, Søg og Profil screens, hvis brugeren er logget ind, ellers vises Søg og Login */}
      {isAuthenticated ? (
        <>
          <Tab.Screen name='Udforsk' component={LocationsStackScreen} options={{ headerShown: false }} />
          <Tab.Screen name='Søg' component={SearchStackScreen} options={{ headerShown: false }} />
          <Tab.Screen name='Profil' component={Profile} options={{ headerShown: false }} />
        </>
      ) : (
        <>
          <Tab.Screen name='Søg' component={SearchStackScreen} options={{ headerShown: false }} />
          <Tab.Screen name='Login' component={LoginStackScreen} options={{ headerShown: false, tabBarLabel: "Log ind" }} />
        </>
      )}
    </Tab.Navigator>
  );
}
