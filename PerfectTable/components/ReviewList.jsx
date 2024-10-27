import React, { useEffect, useState } from "react";
import { View, FlatList, Text } from "react-native";
import { ref, onValue } from "firebase/database";
import { database } from "../firebase";
import ReviewCard from "./ReviewCard";
import GlobalStyles from "../GlobalStyles";

const ReviewsList = ({ locationId }) => {
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    // Laver en reference til reviews for den specifikke location
    const reviewsRef = ref(database, `reviews/${locationId}`);

    // Henter data fra reviewsRef
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
    // Returnerer en unsubscribe-funktion, som kaldes når komponenten unmountes
    return () => unsubscribe();
  }, [locationId]);

  // Funktion til at rendere en enkelt review
  const renderReview = ({ item }) => <ReviewCard review={item.review} rating={item.rating} timestamp={item.timestamp} creator={item.creator} />;

  // Returnerer en liste af reviews, hvis der er reviews, ellers vises en besked
  return <View style={GlobalStyles.container}>{reviews.length > 0 ? <FlatList data={reviews} renderItem={renderReview} keyExtractor={(item) => item.id} /> : <Text>Ingen anmeldelser tilgængelig.</Text>}</View>;
};

export default ReviewsList;
