import React, { useEffect, useState } from "react";
import { View, StatusBar, Text, ScrollView, TouchableOpacity } from "react-native";
import RestaurantCard from "../components/RestaurantCard";
import { set, ref, get, child } from "firebase/database";
import { database } from "../firebase";
import { useNavigation } from "@react-navigation/native";
import GlobalStyles from "../GlobalStyles";
import ModalDropdown from "react-native-modal-dropdown";

const Search = () => {
  const [selectedCity, setSelectedCity] = useState(""); // Byvalg
  const [selectedTime, setSelectedTime] = useState("17:00"); // Tidsvalg
  const [waitlistFilter, setWaitlistFilter] = useState(false); // Venteliste-filter
  const [locations, setLocations] = useState([]); // Lokationer fra databasen
  const [showMap, setShowMap] = useState(false); // Kortvisning toggle
  const navigation = useNavigation();

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

  // Filtrér lokationer baseret på valg
  const filterResults = () => {
    let filteredResults = locations;

    if (selectedCity) {
      filteredResults = filteredResults.filter((location) => location.city.toLowerCase().includes(selectedCity.toLowerCase()));
    }

    filteredResults = filteredResults.filter((location) => location.times[selectedTime]);

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

        <View style={GlobalStyles.container}>
          {/* Byvalg Dropdown */}
          <ModalDropdown
            options={["København", "Aarhus", "Odense", "Roskilde"]}
            defaultValue={selectedCity}
            onSelect={(index, value) => setSelectedCity(value)}
            style={GlobalStyles.dropdown}
            textStyle={GlobalStyles.dropdownText}
            dropdownStyle={GlobalStyles.dropdownMenu}
            dropdownTextStyle={GlobalStyles.dropdownItemText}
            dropdownTextHighlightStyle={GlobalStyles.dropdownItemTextHighlight}
          />

          {/* Tidsvalg Dropdown */}
          <ModalDropdown
            options={["17:00", "18:00", "19:00", "20:00", "21:00"]}
            defaultValue={selectedTime}
            onSelect={(index, value) => setSelectedTime(value)}
            style={GlobalStyles.dropdown}
            textStyle={GlobalStyles.dropdownText}
            dropdownStyle={GlobalStyles.dropdownMenu}
            dropdownTextStyle={GlobalStyles.dropdownItemText}
            dropdownTextHighlightStyle={GlobalStyles.dropdownItemTextHighlight}
          />
        </View>

        {/* Venteliste Filter Toggle */}
        <TouchableOpacity style={[GlobalStyles.button, waitlistFilter ? GlobalStyles.activeButton : null]} onPress={() => setWaitlistFilter(!waitlistFilter)}>
          <Text style={GlobalStyles.buttonText}>{waitlistFilter ? "Venteliste: Aktiv" : "Venteliste: Inaktiv"}</Text>
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
