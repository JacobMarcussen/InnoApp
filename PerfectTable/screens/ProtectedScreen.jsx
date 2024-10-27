import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import Ionicons from "react-native-vector-icons/Ionicons";
import Search from "./Search";
import Locations from "./Locations";
import LocationDetails from "./LocationDetails";
import MapSearch from "./MapSearch";
import Profile from "./Profile";
import AddReview from "./AddReview";

// Stack navigator til at håndtere navigationen mellem Locations, LocationDetails og AddReview
const LocationsStack = createStackNavigator();
function LocationsStackScreen() {
  return (
    <LocationsStack.Navigator initialRouteName='Locations'>
      <LocationsStack.Screen name='Locations' component={Locations} options={{ headerShown: false }} />
      <LocationsStack.Screen name='LocationDetails' component={LocationDetails} options={{ headerShown: false }} />
      <LocationsStack.Screen name='AddReview' component={AddReview} options={{ headerShown: false }} />
    </LocationsStack.Navigator>
  );
}

// Stack navigator til at håndtere navigationen mellem Search, MapSearch og LocationDetails
const SearchStack = createStackNavigator();
function SearchStackScreen() {
  return (
    <SearchStack.Navigator initialRouteName='Search'>
      <SearchStack.Screen name='Search' component={Search} options={{ headerShown: false }} />
      <SearchStack.Screen name='MapSearch' component={MapSearch} options={{ headerShown: false }} />
      <LocationsStack.Screen name='LocationDetails' component={LocationDetails} options={{ headerShown: false }} />
    </SearchStack.Navigator>
  );
}

// Bottom tab navigator til at navigere mellem Locations, Search og Profile
const Tab = createBottomTabNavigator();
export default function ProtectedScreen() {
  return (
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
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === "Udforsk") {
            iconName = focused ? "home" : "home-outline";
          } else if (route.name === "Søg") {
            iconName = focused ? "search" : "search-outline";
          } else if (route.name === "Profil") {
            iconName = focused ? "person" : "person-outline";
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarLabelStyle: {
          fontSize: 12,
          paddingBottom: 0,
        },
      })}
    >
      <Tab.Screen name='Udforsk' component={LocationsStackScreen} options={{ headerShown: false }} />
      <Tab.Screen name='Søg' component={SearchStackScreen} options={{ headerShown: false }} />
      <Tab.Screen name='Profil' component={Profile} options={{ headerShown: false }} />
    </Tab.Navigator>
  );
}
