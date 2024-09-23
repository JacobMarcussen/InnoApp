import React from "react";
import { View, StyleSheet, StatusBar, Text, ScrollView } from "react-native";
import RestaurantCard from "../components/RestaurantCard"; // Adjust the import path as necessary

const Home = () => {
  return (
    <ScrollView>
      <View style={styles.container}>
        <Text style={styles.headline}>
          Anbefalede <Text style={{ color: "#FF4500" }}>lokationer</Text>
        </Text>
        <RestaurantCard
          name="Flammen"
          cuisine="Kød"
          image="https://picsum.photos/500/500"
          rating="5"
        />
        <StatusBar style="auto" />
      </View>
      <View style={styles.containerWaitlist}>
        <Text style={styles.headline}>
          Mulighed for <Text style={{ color: "#FF4500" }}>venteliste</Text>
        </Text>
        <RestaurantCard
          name="Flammen"
          cuisine="Kød"
          image="https://picsum.photos/500/500"
          rating="5"
        />
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
    justifyContent: "start",
    width: "100%",
    backgroundColor: "#fff",
  },
  headline: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "start",
    width: "93%",
    marginBottom: 15,
  },
  containerWaitlist: {
    flex: 1,
    paddingTop: 20,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "start",
    width: "100%",
    backgroundColor: "#fff",
  },
});

export default Home;
