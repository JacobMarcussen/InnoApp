import React from "react";
import { View, Text } from "react-native";
import GlobalStyles from "../GlobalStyles";

const RestaurantInfo = ({ title, description }) => {
  return (
    <View style={GlobalStyles.infoContainer}>
      <Text style={GlobalStyles.infoTitle}>{title}</Text>
      <Text style={GlobalStyles.infoDescription}>{description}</Text>
    </View>
  );
};

export default RestaurantInfo;
