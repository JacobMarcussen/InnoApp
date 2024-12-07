import React from "react";
import { TouchableOpacity, Text } from "react-native";
import GlobalStyles from "../GlobalStyles";

const RedButton = ({ onPress, title }) => {
  return (
    <TouchableOpacity style={GlobalStyles.redButton} onPress={onPress}>
      <Text style={GlobalStyles.redButtonText}>{title}</Text>
    </TouchableOpacity>
  );
};

export default RedButton;
