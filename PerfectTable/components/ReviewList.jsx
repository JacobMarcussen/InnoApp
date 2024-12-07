import React, { useEffect, useState } from "react";
import { View, FlatList, Text } from "react-native";
import { ref, onValue, get } from "firebase/database";
import { database } from "../firebase";
import ReviewCard from "./ReviewCard";
import GlobalStyles from "../GlobalStyles";

const ReviewsList = ({ locationId }) => {
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    // Laver en reference til reviews for den specifikke location
    const reviewsRef = ref(database, `reviews/${locationId}`);

    // Henter data fra reviewsRef
    const unsubscribe = onValue(reviewsRef, async (snapshot) => {
      if (snapshot.exists()) {
        const reviewsData = snapshot.val();
        const formattedReviews = Object.keys(reviewsData).map((key) => ({
          id: key,
          ...reviewsData[key],
        }));
        const reviewsWithNames = await fetchCreatorNames(formattedReviews);

        setReviews(reviewsWithNames);
      } else {
        setReviews([]);
      }
    });
    // Returnerer en unsubscribe-funktion, som kaldes når komponenten unmountes
    return () => unsubscribe();
  }, [locationId]);

  const fetchCreatorNames = async (reviews) => {
    return await Promise.all(
      reviews.map(async (review) => {
        const userRef = ref(database, `users/${review.creator}`);
        try {
          const userSnapshot = await get(userRef);
          if (userSnapshot.exists()) {
            const userData = userSnapshot.val();
            return { ...review, creatorName: userData.name || "Ukendt" };
          }
        } catch (error) {
          console.error("Error fetching user data:", error.message); // Log errors
        }
        return { ...review, creatorName: "Ukendt" };
      })
    );
  };

  // Funktion til at rendere en enkelt review
  const renderReview = ({ item }) => <ReviewCard image={item.image} review={item.review} rating={item.rating} timestamp={item.timestamp} creator={item.creatorName} />;

  // Returnerer en liste af reviews, hvis der er reviews, ellers vises en besked
  return (
    <View style={[GlobalStyles.cardContainer, { width: "100%", alignItems: "center", backgroundColor: "#121212", paddingTop: 0 }]}>
      {reviews.length > 0 ? (
        <FlatList
          style={{ width: "100%" }} // Corrected width to take up the full width of the parent
          contentContainerStyle={{ alignItems: "center" }} // Centers the list items
          data={reviews}
          renderItem={renderReview}
          keyExtractor={(item) => item.id}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          snapToAlignment='center'
        />
      ) : (
        <Text>Ingen anmeldelser tilgængelig.</Text>
      )}
    </View>
  );
};

export default ReviewsList;
