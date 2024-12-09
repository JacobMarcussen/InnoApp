import React from "react";
import { View, Text } from "react-native";
import GlobalStyles from "../GlobalStyles";

const AvailableTimes = ({ times }) => {
  return (
    <View style={{ flex: 1, justifyContent: "end", flexDirection: "row" }}>
      {Object.entries(times)
        .filter(([time, isAvailable]) => isAvailable) // Filter times where value is true
        .map(([time]) => (
          <View key={time} style={GlobalStyles.resBadge}>
            <Text style={GlobalStyles.badgeText}>{time}</Text>
          </View>
        ))}
    </View>
  );
};

export default AvailableTimes;
