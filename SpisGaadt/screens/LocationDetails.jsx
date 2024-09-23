import React from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import Ionicons from "react-native-vector-icons/Ionicons";

const LocationDetails = ({ route }) => {
  const navigation = useNavigation();
  const { name, cuisine, address, postalcode, city, type, priceclass, image } = route.params;

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back" size={24} color="#fff" />
      </TouchableOpacity>
      {/* restaurant detaljer */}
      <Image source={{ uri: image }} style={styles.image} />
      <Text style={styles.title}>{name}</Text>
      <Text style={styles.info}>
        {type} • {cuisine}
      </Text>
      <Text style={styles.info}>
        Address: {address}, {postalcode} {city}
      </Text>
      <Text style={styles.info}>Price Class: {priceclass}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 130,
    backgroundColor: "#fff",
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#313131",
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    top: 60,
    left: 20,
    zIndex: 1,
  },
  image: {
    width: "100%",
    height: 200,
    borderRadius: 10,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  info: {
    fontSize: 18,
    marginBottom: 10,
  },
});

export default LocationDetails;
