import React, { useEffect, useState } from "react";
import { View, StatusBar, Text, ScrollView, TouchableOpacity } from "react-native";
import RestaurantCard from "../components/RestaurantCard";
import { ref, get, child } from "firebase/database";
import { database } from "../firebase";
import { useNavigation, useRoute } from "@react-navigation/native";
import GlobalStyles from "../GlobalStyles";

const Search = () => {
  const route = useRoute();
  const navigation = useNavigation();

  const [selectedCities, setSelectedCities] = useState(route.params?.selectedCities || []);
  const [selectedTimes, setSelectedTimes] = useState(route.params?.selectedTimes || []);
  const [waitlistFilter, setWaitlistFilter] = useState(route.params?.waitlistFilter || false);
  const [locations, setLocations] = useState([]);
  const [showMap, setShowMap] = useState(false);

  useEffect(() => {
    if (route.params?.selectedCities) setSelectedCities(route.params.selectedCities);
    if (route.params?.selectedTimes) setSelectedTimes(route.params.selectedTimes);
    setWaitlistFilter(route.params?.waitlistFilter || false);
  }, [route.params]);

  // Hent lokationer fra databasen
  useEffect(() => {
    const fetchLocations = () => {
      const dbRef = ref(database);
      get(child(dbRef, "locations"))
        .then((snapshot) => {
          if (snapshot.exists()) {
            const data = snapshot.val();
            const locationsArray = Object.keys(data).map((key) => ({
              id: key,
              ...data[key],
            }));
            setLocations(locationsArray);
          } else {
            console.log("No locations data available");
          }
        })
        .catch((error) => {
          console.error("Error fetching locations:", error);
        });
    };

    fetchLocations();
  }, []);

  // Filtrér resultater
  const filterResults = () => {
    let filteredResults = locations;

    if (selectedCities.length > 0) {
      filteredResults = filteredResults.filter((location) => selectedCities.includes(location.city));
    }

    if (selectedTimes.length > 0) {
      filteredResults = filteredResults.filter((location) => selectedTimes.some((time) => location.times[time]));
    }

    if (waitlistFilter) {
      filteredResults = filteredResults.filter((location) => location.waitlist);
    }

    return filteredResults;
  };

  return (
    <ScrollView style={{ backgroundColor: "#1e1e1e" }} contentContainerStyle={{ paddingBottom: 20 }}>
      <View style={GlobalStyles.cardContainer}>
        <Text style={GlobalStyles.headline}>
          Find dit næste <Text style={{ color: "#FF4500" }}>spisested</Text>
        </Text>

        {/* Navigér til filter-skærm */}
        <TouchableOpacity
          style={[GlobalStyles.button, { backgroundColor: "#FF4500" }]}
          onPress={() =>
            navigation.navigate("Filter", {
              selectedCities,
              selectedTimes,
              waitlistFilter,
            })
          }
        >
          <Text style={GlobalStyles.buttonText}>Åbn Filtre</Text>
        </TouchableOpacity>

        {/* Kortvisning Toggle */}
        <TouchableOpacity style={[GlobalStyles.button, showMap ? GlobalStyles.activeButton : null]} onPress={() => setShowMap(!showMap)}>
          <Text style={GlobalStyles.buttonText}>{showMap ? "Vis Liste" : "Vis Kort"}</Text>
        </TouchableOpacity>

        {/* Vis Kort eller Filterede Resultater */}
        {showMap ? (
          <TouchableOpacity style={GlobalStyles.mapView} onPress={() => navigation.navigate("MapSearch")}>
            <Text style={GlobalStyles.mapText}>Åbn kortvisning</Text>
          </TouchableOpacity>
        ) : (
          filterResults().map((location) => (
            <TouchableOpacity
              key={location.id}
              onPress={() =>
                navigation.navigate("LocationDetails", {
                  id: location.id,
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
              style={GlobalStyles.cardWrapper}
            >
              <RestaurantCard id={location.id} name={location.name} cuisine={location.cuisine} image={location.image} rating='5' address={location.address} postalcode={location.postalcode} city={location.city} type={location.type} priceclass={location.priceclass} waitlist={location.waitlist} />
            </TouchableOpacity>
          ))
        )}

        <StatusBar style='auto' />
      </View>
    </ScrollView>
  );
};

export default Search;
