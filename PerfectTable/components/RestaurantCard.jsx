import React from "react";
import { View, Image } from "react-native";
import RestaurantBadge from "./RestaurantBadge";
import RestaurantInfo from "./RestaurantInfo";
import RatingInfo from "./RatingInfo";
import DeliveryInfo from "./DeliveryInfo";
import GlobalStyles from "../GlobalStyles";

// RestaurantCard component
const RestaurantCard = ({ id, name, cuisine, image, rating, address, postalcode, city, type, priceclass, waitlist }) => {
  return (
    <View style={GlobalStyles.resCard}>
      {/* Restaurant Image */}
      <Image source={{ uri: image }} style={GlobalStyles.resImage} resizeMode='cover' />

      {/* Restaurant Badge */}
      {/* If waitlist is available, show a badge */}
      {waitlist && <RestaurantBadge text={"Optjen point!"} />}
      <View style={GlobalStyles.resInfo}>
        {/* Restaurant Info */}
        {/* Combine address, postal code, and city properly */}
        <RestaurantInfo title={name} description={`${address || ""}, ${postalcode || ""} ${city || ""}`} />

        {/* Rating and Pricing Info */}
        <RatingInfo priceLevel={priceclass} rating={rating} id={id} />

        {/* Delivery Time */}
        {/* Combine type and cuisine properly */}
        <DeliveryInfo time={`${type || ""} • ${cuisine || ""}`} />
      </View>
    </View>
  );
};

export default RestaurantCard;
