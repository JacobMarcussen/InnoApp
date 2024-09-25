import React from "react";
import { View, Text, StyleSheet } from "react-native";

const RestaurantBadge = ({ text }) => {
  return (
    <View style={styles.badge}>
      <Text style={styles.badgeText}>{text}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    backgroundColor: "#008000",
    paddingVertical: 5,
    paddingHorizontal: 10,
    margin: 20,
    borderRadius: 5,
    position: "absolute",
  },
  badgeText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 12,
  },
});

export default RestaurantBadge;
