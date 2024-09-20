import React from "react";
import { View, StyleSheet, StatusBar } from "react-native";
import RestaurantCard from "../components/RestaurantCard"; // Adjust the import path as necessary

const Home = () => {
  return (
    <View style={styles.container}>
      <RestaurantCard
        name="Flammen"
        cuisine="Kød"
        image="https://picsum.photos/500/500"
        rating="5"
      />
      <StatusBar style="auto" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
  },
});

export default Home;
