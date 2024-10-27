import React, { useEffect, useState } from "react";
import { View, FlatList, Text } from "react-native";
import { ref, onValue } from "firebase/database";
import { database } from "../firebase";
import ReviewCard from "./ReviewCard"; 
import GlobalStyles from "../GlobalStyles";

const ReviewsList = ({ locationId }) => {
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    const reviewsRef = ref(database, `reviews/${locationId}`);

    const unsubscribe = onValue(reviewsRef, (snapshot) => {
      if (snapshot.exists()) {
        const reviewsData = snapshot.val();
        const formattedReviews = Object.keys(reviewsData).map((key) => ({
          id: key,
          ...reviewsData[key],
        }));
        setReviews(formattedReviews);
      } else {
        setReviews([]);
      }
    });

    return () => unsubscribe();
  }, [locationId]);

  const renderReview = ({ item }) => <ReviewCard review={item.review} rating={item.rating} timestamp={item.timestamp} creator={item.creator} />;

  return <View style={GlobalStyles.container}>{reviews.length > 0 ? <FlatList data={reviews} renderItem={renderReview} keyExtractor={(item) => item.id} /> : <Text>No reviews available.</Text>}</View>;
};

export default ReviewsList;