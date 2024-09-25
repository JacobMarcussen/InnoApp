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
      <Image source={{ uri: image }} style={styles.image} resizeMode="cover" />
      <RestaurantBadge
        text={waitlist ? "Venteliste tilgængelig" : "Ingen venteliste"}
        color={waitlist ? "#00BFFF" : "#242424"}
      />

      <View style={styles.info}>
        <RestaurantInfo
          title={name}
          description={`${address || ""}, ${postalcode || ""} ${city || ""}`}
        />
        <RatingInfo fee="5 kr." priceLevel={priceclass} rating={rating || "8.8"} />
        <DeliveryInfo time={`${type || ""} • ${cuisine || ""}`} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: "#242424",
    borderRadius: 10,
    width: "100%",
    shadowColor: "#fff",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 5,
  },
  image: {
    width: "100%",
    height: 100,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  info: {
    flex: 1,
    paddingHorizontal: 13,
    paddingVertical: 8,
    justifyContent: "space-between",
    color: "#fff",
  },
});

export default RestaurantCard;
