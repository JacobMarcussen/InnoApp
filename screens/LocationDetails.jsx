import React from "react";
import { View, Text, Image, TouchableOpacity, Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";
import Ionicons from "react-native-vector-icons/Ionicons";
import GlobalStyles from "../GlobalStyles";
import ReviewsList from "../components/ReviewList";
import { useAuth } from "../components/AuthContext";

// Screen komponent til at vise detaljer om en lokation
const LocationDetails = ({ route }) => {
  // Bruger useNavigation hook'en til at hente navigation objektet, så vi kan navigere videre og tilbage
  const navigation = useNavigation();
  const { isAuthenticated } = useAuth();
  // Henter data fra route.params
  const { name, cuisine, address, postalcode, city, type, priceclass, image, id } = route.params;

  return (
    <View style={GlobalStyles.container}>
      {/* Tilbageknap */}
      <TouchableOpacity style={GlobalStyles.backButton} onPress={() => navigation.goBack()}>
        <Ionicons name='arrow-back' size={24} color='#fff' />
      </TouchableOpacity>
      {/* restaurant detaljer */}
      <Image source={{ uri: image }} style={GlobalStyles.image} />
      <Text style={GlobalStyles.title}>{name}</Text>
      <Text style={GlobalStyles.info}>
        {type} • {cuisine}
      </Text>
      <Text style={GlobalStyles.info}>
        Addresse: {address}, {postalcode} {city}
      </Text>
      {/* Oversætter prisklasse til dansk */}
      <Text style={GlobalStyles.info}>Pris klasse: {priceclass === "High" ? "Høj" : priceclass === "Medium" ? "Mellem" : "Lav"}</Text>
      <TouchableOpacity style={[GlobalStyles.button, { width: "100%", backgroundColor: "#FF4500" }]}>
        <Text style={{ color: "#fff" }}>Book bord</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[GlobalStyles.button, { width: "100%" }]}
        onPress={() => {
          if (isAuthenticated) {
            navigation.navigate("AddReview", { locationId: id });
          } else {
            Alert.alert("Log ind krævet", "Du skal være logget ind for at tilføje en anmeldelse.");
          }
        }}
      >
        <Text style={{ color: "#fff" }}>{isAuthenticated ? "Tilføj anmeldelse" : "Log ind for at anmelde"}</Text>
      </TouchableOpacity>
      <Text style={[GlobalStyles.title, { marginBottom: 0, marginTop: 10 }]}>Anmeldelser</Text>
      <ReviewsList locationId={id} />
    </View>
  );
};

export default LocationDetails;
