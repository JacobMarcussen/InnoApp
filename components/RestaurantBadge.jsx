import React from "react";
import { View, Text } from "react-native";
import GlobalStyles from "../GlobalStyles";

// Simpel komponent til at vise et badge med tekst
const RestaurantBadge = ({ text }) => {
  return (
    <View style={GlobalStyles.badge}>
      <Text style={GlobalStyles.badgeText}>{text}</Text>
    </View>
  );
};

export default RestaurantBadge;
