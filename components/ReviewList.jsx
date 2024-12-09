import React, { useEffect, useState } from "react";
import { View, FlatList, Text, Modal, TouchableOpacity, Image } from "react-native";
import { ref, onValue, get } from "firebase/database";
import { database } from "../firebase";
import ReviewCard from "./ReviewCard";
import GlobalStyles from "../GlobalStyles";

const ReviewsList = ({ locationId }) => {
  const [reviews, setReviews] = useState([]); // State til anmeldelser
  const [selectedReview, setSelectedReview] = useState(null); // State til valgt anmeldelse
  const [modalVisible, setModalVisible] = useState(false); // State til modal synlighed

  useEffect(() => {
    // Reference til anmeldelser for den specifikke location
    const reviewsRef = ref(database, `reviews/${locationId}`);

    // Hent data fra Firebase og lyt til ændringer
    const unsubscribe = onValue(reviewsRef, async (snapshot) => {
      if (snapshot.exists()) {
        const reviewsData = snapshot.val();
        // Konverterer data til et array
        const formattedReviews = Object.keys(reviewsData).map((key) => ({
          id: key,
          ...reviewsData[key],
        }));
        // Hent brugernavne for anmeldelserne
        const reviewsWithNames = await fetchCreatorNames(formattedReviews);
        setReviews(reviewsWithNames);
      } else {
        setReviews([]);
      }
    });

    // Returner unsubscribe-funktion for at stoppe lytning ved unmount
    return () => unsubscribe();
  }, [locationId]);

  // Funktion til at hente brugernavne for anmeldelserne baseret på creator id
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
          console.error("Fejl i hentning af bruger data:", error.message);
        }
        // Hvis der opstår en fejl, eller brugeren ikke findes
        return { ...review, creatorName: "Ukendt" };
      })
    );
  };

  // Funktion til at håndtere klik på en anmeldelse
  const handleReviewPress = (review) => {
    if (review.image) {
      setSelectedReview(review); // Sæt valgt anmeldelse
      setModalVisible(true); // Vis modal
    }
  };

  // Funktion til at rendere en anmeldelse
  const renderReview = ({ item }) => (
    <TouchableOpacity
      onPress={() => handleReviewPress(item)}
      disabled={!item.image} // Deaktiver klik hvis anmeldelsen ikke har et billede
    >
      <ReviewCard image={item.image} review={item.review} rating={item.rating} timestamp={item.timestamp} creator={item.creatorName} />
    </TouchableOpacity>
  );

  // Returner liste af anmeldelser eller en besked hvis ingen findes
  return (
    <View style={[GlobalStyles.cardContainer, { width: "100%", alignItems: "center", backgroundColor: "#121212", paddingTop: 0 }]}>
      {reviews.length > 0 ? (
        // Brug FlatList til at vise anmeldelser horisontalt
        <FlatList style={{ width: "100%" }} contentContainerStyle={{ alignItems: "center" }} inverted={true} data={reviews} renderItem={renderReview} keyExtractor={(item) => item.id} horizontal pagingEnabled showsHorizontalScrollIndicator={false} snapToAlignment='center' />
      ) : (
        <Text>Ingen anmeldelser tilgængelig.</Text>
      )}

      {/* Modal til anmeldelsesdetaljer */}
      <Modal visible={modalVisible} transparent={true} animationType='slide'>
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "rgba(0, 0, 0, 0.8)", // Gennemsigtig baggrund
          }}
        >
          <View style={{ width: "90%", backgroundColor: "#fff", borderRadius: 10, padding: 15 }}>
            {selectedReview && (
              <>
                {/* Vis billede hvis det findes */}
                {selectedReview.image && <Image source={{ uri: selectedReview.image }} style={{ width: "100%", height: 200, borderRadius: 10, marginBottom: 15 }} resizeMode='cover' />}
                {/* Vis brugernavn og anmeldelse */}
                <Text style={{ fontSize: 16, fontWeight: "bold", marginBottom: 10 }}>{selectedReview.creatorName}</Text>
                <Text style={{ fontSize: 14, marginBottom: 10 }}>{selectedReview.review}</Text>
                <Text style={{ fontSize: 14, color: "#888" }}>Rating: {selectedReview.rating}</Text>
              </>
            )}
            {/* Luk knap til modal */}
            <TouchableOpacity
              onPress={() => setModalVisible(false)}
              style={{
                marginTop: 20,
                alignSelf: "center",
                padding: 10,
                backgroundColor: "#FF4500",
                borderRadius: 5,
              }}
            >
              <Text style={{ color: "#fff" }}>Luk</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default ReviewsList;
