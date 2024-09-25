import React from "react";
import { View, Text, StyleSheet } from "react-native";

const DeliveryInfo = ({ time }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.time}>{time}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#313131",
    padding: 5,
    borderRadius: 5,
    marginVertical: 5,
    marginTop: 15,
  },
  time: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
  },
});

export default DeliveryInfo;
