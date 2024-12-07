import React from "react";
import { View, Text } from "react-native";
import GlobalStyles from "../GlobalStyles";

// Simpel komponent til at vise type og køkken(cuisine)
// Navngivning er lidt misvisene, da det er jo ikke delevery info der bliver vist
const DeliveryInfo = ({ time }) => {
  return (
    <View style={GlobalStyles.timeContainer}>
      <Text style={GlobalStyles.locationTime}>{time}</Text>
    </View>
  );
};

export default DeliveryInfo;
