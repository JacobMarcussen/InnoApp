import React, { useEffect, useState } from "react";
import { View, ActivityIndicator, TouchableOpacity, Alert } from "react-native";
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";
import { useNavigation, useRoute } from "@react-navigation/native";
import { Ionicons } from "react-native-vector-icons";
import GlobalStyles from "../GlobalStyles";

const MapSearch = () => {
  // State til at holde alle lokationer og filtrerede lokationer
  const [locations, setLocations] = useState([]);
  const [filteredLocations, setFilteredLocations] = useState([]);

  // State til at indikere, om data indlæses
  const [loading, setLoading] = useState(true);

  const navigation = useNavigation();
  const route = useRoute();

  // Modtager lokationer og valgte byer fra route.params
  const { locations: passedLocations, selectedCities } = route.params;

  // Effekt: Håndterer geokodning og indlæsning af lokationer
  useEffect(() => {
    const geocodeLocations = async (locationsArray) => {
      const geocodedLocations = [];

      for (const location of locationsArray) {
        if (!location.latitude || !location.longitude) {
          const address = `${location.address}, ${location.postalcode}`;
          try {
            const geocodeResults = await Location.geocodeAsync(address);
            if (geocodeResults.length > 0) {
              const { latitude, longitude } = geocodeResults[0];
              geocodedLocations.push({ ...location, latitude, longitude });
            } else {
              console.log("Ingen resultater fra geokodning for adresse:", address);
            }
          } catch (error) {
            console.error("Fejl ved geokodning af adresse:", address, error);
          }

          // Sætter delay, så vi ikke overskrider geokodningsgrænser
          await new Promise((resolve) => setTimeout(resolve, 500)); // 500ms
        } else {
          geocodedLocations.push(location);
        }
      }

      return geocodedLocations;
    };

    const loadLocations = async () => {
      try {
        // Hvis der ikke er nogen lokationer, returner en tom liste
        if (!passedLocations || passedLocations.length === 0) {
          console.log("Ingen lokationer sendt til MapSearch skærmen.");
          setLocations([]);
          setFilteredLocations([]);
          setLoading(false);
          return;
        }

        // Geokoder lokationer, hvis nogen mangler koordinater
        if (passedLocations.some((location) => !location.latitude || !location.longitude)) {
          console.log("Nogle lokationer mangler koordinater, starter geokodning...");
          const updatedLocations = await geocodeLocations(passedLocations);
          setLocations(updatedLocations);
        } else {
          setLocations(passedLocations); // Sætter direkte, hvis alle lokationer allerede har koordinater
        }
      } catch (error) {
        console.error("Fejl ved indlæsning af lokationer:", error);
      } finally {
        // Stopper indlæsning
        setLoading(false);
      }
    };

    const requestPermissions = async () => {
      // Anmoder om tilladelse til at bruge lokationstjenester
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Adgang nægtet", "Adgang til lokation kræves for at bruge denne funktion.");
        setLoading(false); // Stopper indlæsning, hvis tilladelse nægtes
      } else {
        await loadLocations(); // Indlæser lokationer, hvis tilladelse gives
      }
    };

    requestPermissions();
  }, []);

  // Effekt: Filtrerer lokationer baseret på valgte byer
  useEffect(() => {
    if (selectedCities && selectedCities.length > 0) {
      // Filtrerer kun lokationer, der matcher de valgte byer
      const filtered = locations.filter((location) => selectedCities.includes(location.city));
      setFilteredLocations(filtered);
    } else {
      // Viser alle lokationer, hvis der ikke er valgt nogen byer
      setFilteredLocations(locations);
    }
  }, [locations, selectedCities]);

  // Viser loading spinner, mens data indlæses
  if (loading) {
    return (
      <View style={GlobalStyles.loadingContainer}>
        <ActivityIndicator size='small' color='#0000ff' />
      </View>
    );
  }

  return (
    <View style={GlobalStyles.cardContainer}>
      {/* Tilbage-knap */}
      <TouchableOpacity style={GlobalStyles.backButton} onPress={() => navigation.goBack()}>
        <Ionicons name='arrow-back' size={24} color='#fff' />
      </TouchableOpacity>

      {/* MapView der viser lokationer */}
      <MapView
        style={GlobalStyles.map}
        initialRegion={{
          latitude: 55.6761,
          longitude: 12.5683,
          latitudeDelta: 0.1,
          longitudeDelta: 0.1,
        }}
      >
        {/* Viser marker for hver filtreret lokation */}
        {filteredLocations.map((location) => (
          <Marker
            key={location.id}
            coordinate={{
              latitude: location.latitude,
              longitude: location.longitude,
            }}
            title={location.name}
            description={`Adresse: ${location.address}\nKøkken: ${location.cuisine}\nPrisklasse: ${location.priceclass}\nType: ${location.type}`}
            onPress={() =>
              navigation.navigate("LocationDetails", {
                name: location.name,
                cuisine: location.cuisine,
                address: location.address,
                postalcode: location.postalcode,
                city: location.city,
                type: location.type,
                priceclass: location.priceclass,
                image: location.image,
              })
            }
          />
        ))}
      </MapView>
    </View>
  );
};

export default MapSearch;
