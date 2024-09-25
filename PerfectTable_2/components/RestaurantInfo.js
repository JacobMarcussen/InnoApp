import React from "react";
import { View, Text, StyleSheet } from "react-native";

const RestaurantInfo = ({ title, description }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 5,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
  },
  description: {
    color: "#737373",
    fontSize: 14,
    marginTop: 5,
  },
});

export default RestaurantInfo;
