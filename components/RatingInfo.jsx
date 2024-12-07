import React, { useEffect, useState } from "react";
import { View, Text } from "react-native";
import GlobalStyles from "../GlobalStyles";
import { ref, get, child } from "firebase/database";
import { database } from "../firebase";

const RatingInfo = ({ id, priceLevel }) => {
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    const fetchReviews = () => {
      const dbRef = ref(database);
      get(child(dbRef, `reviews/${id}`))
        .then((snapshot) => {
          if (snapshot.exists()) {
            const data = snapshot.val();
            const reviewsArray = Object.keys(data).map((key) => ({
              id: key,
              ...data[key],
            }));
            setReviews(reviewsArray);
          }
        })
        .catch((error) => {
          console.error("Error fetching data: ", error);
        });
    };

    fetchReviews();
  }, []);

  let ReviewsAvg = 0;
  reviews.forEach((review) => {
    ReviewsAvg += review.rating;
  });
  ReviewsAvg = ReviewsAvg / reviews.length;

  // Funktion til at bestemme antal dollar-tegn baseret på prisniveau
  const getPriceLevel = (level) => {
    switch (level) {
      case "Low":
        return "$";
      case "Medium":
        return "$$";
      case "High":
        return "$$$";
      default:
        return "";
    }
  };

  return (
    <View style={GlobalStyles.ratingContainer}>
      <Text style={GlobalStyles.ratingText}>{getPriceLevel(priceLevel)}</Text>
      <Text style={GlobalStyles.ratingText}>😊 {ReviewsAvg || "Ingen anmeldelser"}</Text>
    </View>
  );
};

export default RatingInfo;
