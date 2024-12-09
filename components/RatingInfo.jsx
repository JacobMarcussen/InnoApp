import React, { useEffect, useState } from "react";
import { View, Text } from "react-native";
import GlobalStyles from "../GlobalStyles";
import { ref, get, child } from "firebase/database";
import { database } from "../firebase";

// Komponent til at vise prisniveau og gennemsnitlig rating, igen med lidt misvisende navn
const RatingInfo = ({ id, priceLevel }) => {
  // State til anmeldelserne
  const [reviews, setReviews] = useState([]);

  /**
   * Bruger useEffect hook'en som kører, når komponenten renderes første gang, som
   * Henter anmeldelser fra firebase databasen baseret på det givne id.
   * Hvis der findes anmeldelser, konverteres de til et array og gemmes i state.
   * Logger en fejlmeddelelse, hvis der opstår en fejl under hentning af data.
   */
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

  // Udregner gennemsnittet af anmeldelserne
  let ReviewsAvg = 0;
  reviews.forEach((review) => {
    ReviewsAvg += review.rating;
  });
  ReviewsAvg = (ReviewsAvg / reviews.length).toFixed(2);

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

  // Returnerer jsx med prisniveau og gennemsnitlig rating
  return (
    <View style={GlobalStyles.ratingContainer}>
      <Text style={GlobalStyles.ratingText}>{getPriceLevel(priceLevel)}</Text>
      <Text style={GlobalStyles.ratingText}>😊 {ReviewsAvg || "Ingen anmeldelser"}</Text>
    </View>
  );
};

export default RatingInfo;
