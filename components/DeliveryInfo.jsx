import React from "react";
import { View, Text } from "react-native";
import GlobalStyles from "../GlobalStyles";

const DeliveryInfo = ({ time }) => {
  return (
    <View style={GlobalStyles.timeContainer}>
      <Text style={GlobalStyles.locationTime}>{time}</Text>
    </View>
  );
};

export default DeliveryInfo;
