import React, { useEffect, useState } from "react";
import { View, StatusBar, Text, ScrollView, TouchableOpacity } from "react-native";
import RestaurantCard from "../components/RestaurantCard";
import { set, ref, get, child } from "firebase/database";
import { database } from "../firebase";
import { useNavigation } from "@react-navigation/native";
import GlobalStyles from "../GlobalStyles";

// function addTestLocation() {
//   set(ref(database, "locations/1"), {
//     name: "Firebase test restaurant",
//     address: "Bredgade 1",
//     postalcode: "1260",
//     city: "København K",
//     type: "Restaurant",
//     cuisine: "Dansk",
//     priceclass: "Mellem",
//     waitlist: true,
//   })
//     .then(() => {
//       console.log("Test data added successfully!");
//     })
//     .catch((error) => {
//       console.error("Error adding test data: ", error);
//     });
// }

// addTestLocation();

const Locations = () => {
  const [locations, setLocations] = useState([]);
  const navigation = useNavigation();

  // Fetching locations from Firebase
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
          console.error("Error fetching data: ", error);
        });
    };

    fetchLocations();
  }, []);

  return (
    <ScrollView style={{ backgroundColor: "#1e1e1e" }}>
      <View style={GlobalStyles.cardContainer}>
        <Text style={GlobalStyles.headline}>
          Anbefalede <Text style={{ color: "#FF4500" }}>lokationer</Text>
        </Text>
        {locations.map((location) => (
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
            <RestaurantCard id={location.id} name={location.name} cuisine={location.cuisine} image={location.image} address={location.address} postalcode={location.postalcode} city={location.city} type={location.type} priceclass={location.priceclass} waitlist={location.waitlist} />
          </TouchableOpacity>
        ))}
        <StatusBar style='auto' />
      </View>

      <View style={GlobalStyles.containerWaitlist}>
        <Text style={GlobalStyles.headline}>
          Mulighed for <Text style={{ color: "#FF4500" }}>venteliste</Text>
        </Text>
        {locations
          .filter((location) => location.waitlist)
          .map((location) => (
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
              <RestaurantCard id={location.id} name={location.name} cuisine={location.cuisine} image={location.image} address={location.address} postalcode={location.postalcode} city={location.city} type={location.type} priceclass={location.priceclass} waitlist={location.waitlist} />
            </TouchableOpacity>
          ))}
        <StatusBar style='auto' />
      </View>
    </ScrollView>
  );
};

export default Locations;
