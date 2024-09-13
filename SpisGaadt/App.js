import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import RestaurantCard from "./components/RestaurantCard";

export default function App() {
  return (
    <View style={styles.container}>
      <RestaurantCard
        name="Flammen"
        cuisine="Kød"
        image="https://picsum.photos/500/500"
        rating="5"
      />
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
  },
});
