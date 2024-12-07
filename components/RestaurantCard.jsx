import React from "react";
import { View, Image } from "react-native";
import RestaurantBadge from "./RestaurantBadge";
import RestaurantInfo from "./RestaurantInfo";
import RatingInfo from "./RatingInfo";
import DeliveryInfo from "./DeliveryInfo";
import GlobalStyles from "../GlobalStyles";

// RestaurantCard komponent, som kombinerer mange af de andre komponenter og modtager en masse props fra parent
const RestaurantCard = ({ id, name, cuisine, image, rating, address, postalcode, city, type, priceclass, waitlist }) => {
  return (
    <View style={GlobalStyles.resCard}>
      {/* Restaurant Billede */}
      <Image source={{ uri: image }} style={GlobalStyles.resImage} resizeMode='cover' />

      {/* Hvis loyalitetsprogram(waitlist) er tilgængelig, vis et badge */}
      {waitlist && <RestaurantBadge text={"Optjen point!"} />}
      <View style={GlobalStyles.resInfo}>
        {/* Kombiner adresse, postnummer og by korrekt */}
        <RestaurantInfo title={name} description={`${address || ""}, ${postalcode || ""} ${city || ""}`} />

        {/* Gennemsnitsrating og prisklasse */}
        <RatingInfo priceLevel={priceclass} rating={rating} id={id} />

        {/* Kombiner type og køkken korrekt */}
        <DeliveryInfo time={`${type || ""} • ${cuisine || ""}`} />
      </View>
    </View>
  );
};

export default RestaurantCard;
