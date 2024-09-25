import React from "react";
import { View, Text, StyleSheet } from "react-native";

const RatingInfo = ({ fee, priceLevel, rating }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>{fee}</Text>
      <Text style={styles.text}>{priceLevel}</Text>
      <Text style={styles.text}>😊 {rating}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 5,
  },
  text: {
    marginRight: 10,
    color: "#737373",
    fontSize: 14,
  },
});

export default RatingInfo;
