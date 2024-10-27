import React, { useEffect, useState } from "react";
import { View, ActivityIndicator, TouchableOpacity } from "react-native";
import MapView, { Marker } from "react-native-maps";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "react-native-vector-icons";
import GlobalStyles from "../GlobalStyles";

const API_KEY = "AIzaSyDnO5fAAiOqwGxk14zbI4SrOmao9vyv0Gk";

const MapSearch = () => {
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  useEffect(() => {
    const geocodeLocations = async (locationsArray) => {
      const geocodedLocations = await Promise.all(
        locationsArray.map(async (location) => {
          if (!location.latitude || !location.longitude) {
            const address = `${location.address}, ${location.postalcode}, Copenhagen`;
            console.log("Attempting to geocode address:", address);
            try {
              const response = await axios.get(`https://maps.googleapis.com/maps/api/geocode/json`, {
                params: {
                  address: address,
                  key: API_KEY,
                },
              });
              console.log("Full Geocode API Response:", response.data);

              if (response.data.results.length > 0) {
                const { lat, lng } = response.data.results[0].geometry.location;
                console.log("Geocoding successful:", { lat, lng });
                return { ...location, latitude: lat, longitude: lng };
              } else {
                console.log("No results from geocoding for address:", address);
              }
            } catch (error) {
              console.error("Error geocoding address:", address, error);
            }
          } else {
            console.log("Coordinates already available for:", location.name);
          }
          return location;
        })
      );
      return geocodedLocations;
    };

    const loadLocations = async () => {
      setLoading(true);
      try {
        const storedLocations = await AsyncStorage.getItem("markers");
        let locationsArray = storedLocations ? JSON.parse(storedLocations) : [];

        if (locationsArray.some((location) => !location.latitude || !location.longitude)) {
          console.log("Some locations lack coordinates, starting geocoding...");
          locationsArray = await geocodeLocations(locationsArray);
          await AsyncStorage.setItem("markers", JSON.stringify(locationsArray));
        }

        setLocations(locationsArray);
      } catch (error) {
        console.error("Error loading markers from AsyncStorage:", error);
      }
      setLoading(false);
    };

    loadLocations();
  }, []);

  if (loading) {
    return (
      <View style={GlobalStyles.loadingContainer}>
        <ActivityIndicator size='large' color='#0000ff' />
      </View>
    );
  }

  return (
    <View style={GlobalStyles.cardContainer}>
      <TouchableOpacity style={GlobalStyles.backButton} onPress={() => navigation.goBack()}>
        <Ionicons name='arrow-back' size={24} color='#fff' />
      </TouchableOpacity>
      <MapView
        style={GlobalStyles.map}
        initialRegion={{
          latitude: 55.6761,
          longitude: 12.5683,
          latitudeDelta: 0.5,
          longitudeDelta: 0.5,
        }}
      >
        {locations.map((location) => (
          <Marker
            key={location.id}
            coordinate={{
              latitude: location.latitude,
              longitude: location.longitude,
            }}
            title={location.name}
            description={`Address: ${location.address}\nCuisine: ${location.cuisine}\nPrice Class: ${location.priceclass}\nType: ${location.type}`}
            onPress={() =>
              navigation.navigate("LocationDetails", {
                name: location.name,
                cuisine: location.cuisine,
                address: location.address,
                postalcode: location.postalcode,
                city: location.city,
                type: location.type,
                priceclass: location.priceclass,
                image: "https://picsum.photos/500/500",
              })
            }
          />
        ))}
      </MapView>
    </View>
  );
};

export default MapSearch;
