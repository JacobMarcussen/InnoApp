import React, { useEffect, useState } from "react";
import { View, StatusBar, Text, ScrollView, TouchableOpacity } from "react-native";
import RestaurantCard from "../components/RestaurantCard";
import { set, ref, get, child } from "firebase/database";
import { database } from "../firebase";
import { useNavigation } from "@react-navigation/native";
import GlobalStyles from "../GlobalStyles";

// const addSampleLocations = () => {
//   const locationData = [
//     {
//       id: "1",
//       name: "Flammen",
//       cuisine: "Kød",
//       city: "København",
//       waitlist: true,
//     },
//     {
//       id: "2",
//       name: "Noma",
//       cuisine: "Nordic",
//       city: "Aarhus",
//       waitlist: false,
//     },
//     {
//       id: "3",
//       name: "Geranium",
//       cuisine: "Fine Dining",
//       city: "København",
//       waitlist: true,
//     },
//   ];

//   locationData.forEach((location) => {
//     set(ref(database, `locations/${location.id}`), location)
//       .then(() => console.log("Location added"))
//       .catch((error) => console.error("Error adding location:", error));
//   });
// };

// addSampleLocations();
const Search = () => {
  const [selectedCity, setSelectedCity] = useState("");
  const [waitlistFilter, setWaitlistFilter] = useState(false);
  const [locations, setLocations] = useState([]);
  const navigation = useNavigation();

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

  // Filter function based on city and waitlist
  const filterResults = () => {
    let filteredResults = locations;

    if (selectedCity) {
      filteredResults = filteredResults.filter((location) => location.city.toLowerCase().includes(selectedCity.toLowerCase()));
    }

    if (waitlistFilter) {
      filteredResults = filteredResults.filter((location) => location.waitlist);
    }

    return filteredResults;
  };

  return (
    <ScrollView style={{ backgroundColor: "#1e1e1e" }}>
      <View style={GlobalStyles.cardContainer}>
        <Text style={GlobalStyles.headline}>
          Vælg en <Text style={{ color: "#FF4500" }}>by</Text>
        </Text>

        {/* City Filter Buttons */}
        <View style={GlobalStyles.buttonContainer}>
          <TouchableOpacity style={[GlobalStyles.cityButton, selectedCity === "København" && GlobalStyles.activeCityButton]} onPress={() => setSelectedCity("København")}>
            <Text style={GlobalStyles.buttonText}>København</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[GlobalStyles.cityButton, selectedCity === "Aarhus" && GlobalStyles.activeCityButton]} onPress={() => setSelectedCity("Aarhus")}>
            <Text style={GlobalStyles.buttonText}>Aarhus</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[GlobalStyles.cityButton, selectedCity === "Odense" && GlobalStyles.activeCityButton]} onPress={() => setSelectedCity("Odense")}>
            <Text style={GlobalStyles.buttonText}>Odense</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[GlobalStyles.cityButton, selectedCity === "Kort" && GlobalStyles.activeCityButton]} onPress={() => navigation.navigate("MapSearch")}>
            <Text style={GlobalStyles.buttonText}>Kort</Text>
          </TouchableOpacity>
        </View>

        {/* Waitlist Filter Toggle */}
        <TouchableOpacity style={[GlobalStyles.button, waitlistFilter ? GlobalStyles.activeButton : null]} onPress={() => setWaitlistFilter(!waitlistFilter)}>
          <Text style={GlobalStyles.buttonText}>{waitlistFilter ? "Venteliste: Aktiv" : "Venteliste: Inaktiv"}</Text>
        </TouchableOpacity>

        {/* Filtered Results */}
        {filterResults().map((location) => (
          <TouchableOpacity
            key={location.id}
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
            style={GlobalStyles.cardWrapper}
          >
            <RestaurantCard
              name={location.name}
              cuisine={location.cuisine}
              image='https://picsum.photos/500/500' // Placeholder image
              rating='5'
              address={location.address}
              postalcode={location.postalcode}
              city={location.city}
              type={location.type}
              priceclass={location.priceclass}
              waitlist={location.waitlist}
            />
          </TouchableOpacity>
        ))}

        <StatusBar style='auto' />
      </View>
    </ScrollView>
  );
};

export default Search;
