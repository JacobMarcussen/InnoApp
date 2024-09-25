import React from "react";
import { View, Text, StyleSheet } from "react-native";

const RestaurantBadge = ({ text, color }) => {
  return (
    <View style={[styles.badge, { backgroundColor: color || "#000" }]}>
      <Text style={styles.badgeText}>{text}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    margin: 7,
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
