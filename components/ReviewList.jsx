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
        // Konverterer data til et array
        const formattedReviews = Object.keys(reviewsData).map((key) => ({
          id: key,
          ...reviewsData[key],
        }));
        // Henter brugerenes navne for hvert review
        const reviewsWithNames = await fetchCreatorNames(formattedReviews);

        // Opdaterer state med reviews
        setReviews(reviewsWithNames);
      } else {
        setReviews([]);
      }
    });
    // Returnerer en unsubscribe-funktion, som kaldes når komponenten unmountes
    return () => unsubscribe();
  }, [locationId]);

  // Funktion til at hente brugernavne ud fra creator id'et for hvert review
  const fetchCreatorNames = async (reviews) => {
    return await Promise.all(
      reviews.map(async (review) => {
        const userRef = ref(database, `users/${review.creator}`);
        try {
          const userSnapshot = await get(userRef);
          if (userSnapshot.exists()) {
            const userData = userSnapshot.val();
            // Returnerer et review med brugerens navn som creatorName
            return { ...review, creatorName: userData.name || "Ukendt" };
          }
        } catch (error) {
          // Logger en fejlmeddelelse, hvis der opstår en fejl under hentning af bruger data
          console.error("Fejl i hentning af bruger data:", error.message);
        }
        // Fallback til "Ukendt" hvis brugeren ikke findes
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
        // Bruger flatlist til at vise reviews horisontalt
        <FlatList style={{ width: "100%" }} contentContainerStyle={{ alignItems: "center" }} data={reviews} renderItem={renderReview} keyExtractor={(item) => item.id} horizontal pagingEnabled showsHorizontalScrollIndicator={false} snapToAlignment='center' />
      ) : (
        <Text>Ingen anmeldelser tilgængelig.</Text>
      )}
    </View>
  );
};

export default ReviewsList;
