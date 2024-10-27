import React from "react";
import { View, Text } from "react-native";
import GlobalStyles from "../GlobalStyles";

const RatingInfo = ({ fee, priceLevel, rating }) => {
  return (
    <View style={GlobalStyles.ratingContainer}>
      <Text style={GlobalStyles.ratingText}>{fee}</Text>
      <Text style={GlobalStyles.ratingText}>{priceLevel}</Text>
      <Text style={GlobalStyles.ratingText}>😊 {rating}</Text>
    </View>
  );
};

export default RatingInfo;
