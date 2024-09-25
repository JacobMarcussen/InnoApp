import React from "react";
import { View, Image, StyleSheet } from "react-native";
import RestaurantBadge from "./RestaurantBadge";
import RestaurantInfo from "./RestaurantInfo";
import RatingInfo from "./RatingInfo";
import DeliveryInfo from "./DeliveryInfo";

const RestaurantCard = ({
  name,
  cuisine,
  image,
  rating,
  address,
  postalcode,
  city,
  type,
  priceclass,
  waitlist,
}) => {
  return (
    <View style={styles.card}>
      {/* Restaurant Image */}
      <Image source={{ uri: image }} style={styles.image} resizeMode="cover" />

      {/* Restaurant Badge */}
      {/* If waitlist is available, show a badge */}
      <RestaurantBadge text={waitlist ? "Venteliste tilgængelig" : ""} />

      <View style={styles.info}>
        {/* Restaurant Info */}
        {/* Combine address, postal code, and city properly */}
        <RestaurantInfo
          title={name}
          description={`${address || ""}, ${postalcode || ""} ${city || ""}`}
        />

        {/* Rating and Pricing Info */}
        <RatingInfo fee="5 kr." priceLevel={priceclass} rating={rating || "8.8"} />

        {/* Delivery Time */}
        {/* Combine type and cuisine properly */}
        <DeliveryInfo time={`${type || ""} • ${cuisine || ""}`} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 10,
    width: "100%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  image: {
    width: "100%",
    height: 150,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  info: {
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
});

export default RestaurantCard;
