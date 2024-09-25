import React, { useEffect, useState } from "react";
import { View, StyleSheet, StatusBar, Text, ScrollView, TouchableOpacity } from "react-native";
import RestaurantCard from "../components/RestaurantCard";
import { set, ref, get, child } from "firebase/database";
import { database } from "../firebase";

// const addSampleLocations = () => {
//   const locationData = [
//     {
//       id: "1",
//       name: "Firebase Test Restaurant",
//       address: "Bredgade 1",
//       postalcode: "1260",
//       city: "København K",
//       type: "Restaurant",
//       cuisine: "Dansk",
//       priceclass: "Mellem",
//       waitlist: true,
//     },
//     {
//       id: "2",
//       name: "Noma",
//       address: "Refshalevej 96",
//       postalcode: "1432",
//       city: "København K",
//       type: "Restaurant",
//       cuisine: "Nordic",
//       priceclass: "High",
//       waitlist: false,
//     },
//     {
//       id: "3",
//       name: "Geranium",
//       address: "Per Henrik Lings Allé 4",
//       postalcode: "2100",
//       city: "København Ø",
//       type: "Restaurant",
//       cuisine: "Fine Dining",
//       priceclass: "High",
//       waitlist: true,
//     },
//   ];

//   locationData.forEach((location) => {
//     set(ref(database, `locations/${location.id}`), location)
//       .then(() => console.log("Location added successfully!"))
//       .catch((error) => console.error("Error adding location:", error));
//   });
// };

// // Call this function to insert the sample data into the database
// addSampleLocations();

const Search = () => {
  const [selectedCity, setSelectedCity] = useState("");
  const [waitlistFilter, setWaitlistFilter] = useState(false);
  const [locations, setLocations] = useState([]);

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
      filteredResults = filteredResults.filter((location) =>
        location.city.toLowerCase().includes(selectedCity.toLowerCase())
      );
    }

    if (waitlistFilter) {
      filteredResults = filteredResults.filter((location) => location.waitlist);
    }

    return filteredResults;
  };

  return (
    <ScrollView>
      <View style={styles.container}>
        <Text style={styles.headline}>
          Vælg en <Text style={{ color: "#FF4500" }}>by</Text>
        </Text>

        {/* City Filter Buttons */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.cityButton, selectedCity === "København" && styles.activeCityButton]}
            onPress={() => setSelectedCity("København")}
          >
            <Text style={styles.buttonText}>København</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.cityButton, selectedCity === "Aarhus" && styles.activeCityButton]}
            onPress={() => setSelectedCity("Aarhus")}
          >
            <Text style={styles.buttonText}>Aarhus</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.cityButton, selectedCity === "Odense" && styles.activeCityButton]}
            onPress={() => setSelectedCity("Odense")}
          >
            <Text style={styles.buttonText}>Odense</Text>
          </TouchableOpacity>
        </View>

        {/* Waitlist Filter Toggle */}
        <TouchableOpacity
          style={[styles.button, waitlistFilter ? styles.activeButton : null]}
          onPress={() => setWaitlistFilter(!waitlistFilter)}
        >
          <Text style={styles.buttonText}>
            {waitlistFilter ? "Venteliste: Aktiv" : "Venteliste: Inaktiv"}
          </Text>
        </TouchableOpacity>

        {/* Filtered Results */}
        {filterResults().map((location) => (
          <RestaurantCard
            key={location.id}
            name={location.name}
            cuisine={location.cuisine}
            image="https://picsum.photos/500/500" // Placeholder image
            rating="5" // Replace with actual rating if available
          />
        ))}

        <StatusBar style="auto" />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 85,
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    backgroundColor: "#fff",
  },
  headline: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    width: "93%",
    marginBottom: 15,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    marginBottom: 15,
  },
  cityButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: "#ccc",
    borderRadius: 5,
  },
  activeCityButton: {
    backgroundColor: "#FF4500",
  },
  button: {
    width: "90%",
    padding: 15,
    backgroundColor: "#ccc",
    borderRadius: 5,
    marginBottom: 15,
    alignItems: "center",
  },
  activeButton: {
    backgroundColor: "#FF4500",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
  },
});

export default Search;
