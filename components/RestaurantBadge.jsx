import React from "react";
import { View, Text } from "react-native";
import GlobalStyles from "../GlobalStyles";

const RestaurantBadge = ({ text }) => {
  return (
    <View style={GlobalStyles.badge}>
      <Text style={GlobalStyles.badgeText}>{text}</Text>
    </View>
  );
};

export default RestaurantBadge;
