import React from "react";
import { View, Text, Image } from "react-native";
import GlobalStyles from "../GlobalStyles";
import moment from "moment";

const ReviewCard = ({ image, review, rating, timestamp, creator }) => {
  return (
    <View style={[GlobalStyles.card, { marginRight: 10 }]}>
      {/* Top-right image */}
      {image && <Image source={{ uri: image }} style={GlobalStyles.topRightImage} />}

      {/* Viser creator som id. Optimalt hvis der var en brugernavn ku man vise det i stedet for id. */}
      <Text style={GlobalStyles.creatorText}>{creator}</Text>
      <Text style={GlobalStyles.reviewText}>{review}</Text>
      <Text style={GlobalStyles.ratingText}>Rating: {rating} / 5</Text>
      <Text style={GlobalStyles.timestampText}>{moment(timestamp).fromNow()}</Text>
    </View>
  );
};

export default ReviewCard;
