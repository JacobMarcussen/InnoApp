import React from "react";
import { View, Text, Image } from "react-native";
import GlobalStyles from "../GlobalStyles";
import moment from "moment";

const ReviewCard = ({ review, rating, timestamp, creator, imageUrl }) => {
  return (
    <View style={GlobalStyles.card}>
      <Text style={GlobalStyles.creatorText}>{creator}</Text>
      <Text style={GlobalStyles.reviewText}>{review}</Text>
      <Text style={GlobalStyles.ratingText}>Rating: {rating} / 5</Text>
      {/* Hvis imageUrl er givet, vises billedet */}
      {imageUrl && <Image source={{ uri: imageUrl }} style={GlobalStyles.reviewImage} />}
      <Text style={GlobalStyles.timestampText}>{moment(timestamp).fromNow()}</Text>
    </View>
  );
};

export default ReviewCard;
