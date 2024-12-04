import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import Ionicons from "react-native-vector-icons/Ionicons";
import Search from "./Search";
import Locations from "./Locations";
import LocationDetails from "./LocationDetails";
import MapSearch from "./MapSearch";
import FilterScreen from "./SearchFilter";
import Profile from "./Profile";
import AddReview from "./AddReview";

// Stack navigator til at håndtere navigationen mellem Locations, LocationDetails og AddReview
const LocationsStack = createStackNavigator();
function LocationsStackScreen() {
  return (
    <LocationsStack.Navigator initialRouteName='Locations'>
      <LocationsStack.Screen
        name='Locations'
        component={Locations}
        options={{
          title: false,
          headerStyle: {
            backgroundColor: "#1e1e1e",
            shadowColor: "transparent",
            height: 60,
          },
        }}
      />
      <LocationsStack.Screen
        name='LocationDetails'
        component={LocationDetails}
        options={{
          title: false,
          headerStyle: {
            backgroundColor: "#121212",
            shadowColor: "transparent",
            height: 60,
          },
          headerLeft: () => null,
        }}
      />
      <LocationsStack.Screen
        name='AddReview'
        component={AddReview}
        options={{
          title: false,
          headerStyle: {
            backgroundColor: "#1e1e1e",
            shadowColor: "transparent",
            height: 60,
          },
          headerLeft: () => null,
        }}
      />
    </LocationsStack.Navigator>
  );
}

// Stack navigator til at håndtere navigationen mellem Search, MapSearch og LocationDetails
const SearchStack = createStackNavigator();
function SearchStackScreen() {
  return (
    <SearchStack.Navigator initialRouteName='Filter'>
      <SearchStack.Screen
        name='Search'
        component={Search}
        options={{
          title: false,
          headerStyle: {
            backgroundColor: "#1e1e1e",
            shadowColor: "transparent",
            height: 60,
          },
          headerLeft: () => null,
        }}
      />
      <SearchStack.Screen
        name='MapSearch'
        component={MapSearch}
        options={{
          title: false,
          headerStyle: {
            backgroundColor: "#1e1e1e",
            shadowColor: "transparent",
            height: 60,
          },
          headerLeft: () => null,
        }}
      />
      <SearchStack.Screen
        name='LocationDetails'
        component={LocationDetails}
        options={{
          title: false,
          headerStyle: {
            backgroundColor: "#1e1e1e",
            shadowColor: "transparent",
            height: 60,
          },
          headerLeft: () => null,
        }}
      />
      <SearchStack.Screen
        name='Filter'
        component={FilterScreen}
        options={{
          title: "Filtre",
          headerStyle: {
            backgroundColor: "#1e1e1e",
            shadowColor: "transparent",
            height: 60,
          },
          headerLeft: () => null,
        }}
      />
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
      <Tab.Screen
        name='Profil'
        component={Profile}
        options={{
          headerStyle: {
            backgroundColor: "#1e1e1e",
            shadowColor: "transparent",
            height: 60,
          },
        }}
      />
    </Tab.Navigator>
  );
}
