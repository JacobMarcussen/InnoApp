import React from "react";
import { View, Text, Image } from "react-native";
import GlobalStyles from "../GlobalStyles";
// Bruger moment til at vise tidsforskellen mellem anmeldelse og nu
import moment from "moment";

// ReviewCard komponent, som viser en anmeldelse og modtager props fra parent
const ReviewCard = ({ image, review, rating, timestamp, creator }) => {
  return (
    <View style={[GlobalStyles.card, { marginRight: 10 }]}>
      {/* Hvis anmeldelses har billede, vises det oppe i højre hjørne */}
      {image && <Image source={{ uri: image }} style={GlobalStyles.topRightImage} />}

      {/* Viser andmeldelsen og brugeren */}
      <Text style={GlobalStyles.creatorText}>{creator}</Text>
      <Text style={GlobalStyles.reviewText}>{review}</Text>
      <Text style={GlobalStyles.ratingText}>Rating: {rating} / 5</Text>
      {/* Viser tidsforskel ffra anmeldelsen til nu med moment */}
      <Text style={GlobalStyles.timestampText}>{moment(timestamp).fromNow()}</Text>
    </View>
  );
};

export default ReviewCard;
