import React from "react";
import { View, Image, StyleSheet } from "react-native";
import RestaurantBadge from "./RestaurantBadge";
import RestaurantInfo from "./RestaurantInfo";
import RatingInfo from "./RatingInfo";
import DeliveryInfo from "./DeliveryInfo";

const RestaurantCard = () => {
  return (
    <View style={styles.card}>
      {/* Restaurant Image */}
      <Image source={{ uri: "https://picsum.photos/500/300" }} style={styles.image} />

      {/* Restaurant Badge */}
      <RestaurantBadge text="0 KR. I LEVERINGSGEBYR" />
      <View style={styles.info}>
        {/* Restaurant Info */}
        <RestaurantInfo title="Dinner Sushi" description="Sushi af friske råvarer & mere..." />

        {/* Rating and Pricing Info */}
        <RatingInfo fee="0,00 kr." priceLevel="$$$$" rating="8,8" />

        {/* Delivery Time */}
        <DeliveryInfo time="40-50 min." />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 10,
    marginBottom: 20,
    marginVertical: 10,
    width: "95%",
    // Shadow for iOS
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    // Shadow for Android
    elevation: 5,
  },
  image: {
    width: "100%",
    height: 200,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  info: {
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
});

export default RestaurantCard;
