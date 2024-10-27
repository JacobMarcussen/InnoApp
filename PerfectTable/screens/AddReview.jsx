import React, { useState } from "react";
import { View, TextInput, Button, Text, Alert, TouchableOpacity, Image } from "react-native";
import { ref, push, update } from "firebase/database";
import { ref as storageRef, uploadBytes, getDownloadURL } from "firebase/storage";
import { database, storage } from "../firebase";
import { useAuth } from "../components/AuthContext";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { useNavigation, useRoute } from "@react-navigation/native";
import GlobalStyles from "../GlobalStyles";

const AddReview = () => {
  // State variabler til at holde værdierne af anmeldelsen
  const [review, setReview] = useState("");
  const [rating, setRating] = useState("");
  const [image, setImage] = useState(null);
  const { user } = useAuth();
  const navigation = useNavigation();
  const route = useRoute();
  const { locationId } = route.params;

  // Mulighed for at vælge et billede fra kamerarullen
  const pickImage = async () => {
    const result = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (result.granted) {
      let pickerResult = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!pickerResult.canceled) {
        setImage(pickerResult.uri);
      }
    } else {
      Alert.alert("Adgang krævet", "Tillad adgang til kamerarullen for at vælge et billede.");
    }
  };

  const handleSubmit = async () => {
    if (review && rating) {
      let imageUrl = null;

      // Upload billede til storage hvis der er et billede
      if (image) {
        try {
          const imageBlob = await (await fetch(image)).blob();
          const imageRef = storageRef(storage, `reviewImages/${Date.now()}_${user.id}`);
          await uploadBytes(imageRef, imageBlob);
          imageUrl = await getDownloadURL(imageRef);

          console.log("Image uploaded successfully:", imageUrl);
        } catch (error) {
          console.error("Error uploading image:", error);
          Alert.alert("Error", "Failed to upload image.");
          return;
        }
      }

      // Opretter et objekt med anmeldelsesdata
      const reviewData = {
        review,
        rating: parseInt(rating),
        timestamp: Date.now(),
        creator: user.id,
        imageUrl,
      };

      const reviewsRef = ref(database, `reviews/${locationId}`);

      // Tilføjer anmeldelsen til databasen
      push(reviewsRef, reviewData)
        .then((snapshot) => {
          const reviewId = snapshot.key;

          const userReviewsRef = ref(database, `users/${user.id}/reviews`);

          // Tilføjer anmeldelsen til brugerens reviews
          update(userReviewsRef, {
            [reviewId]: { locationId, rating: reviewData.rating, timestamp: reviewData.timestamp, imageUrl },
          })
            .then(() => {
              setReview("");
              setRating("");
              setImage(null);
              Alert.alert("Success", "Review added successfully!");
            })
            .catch((error) => {
              console.error("Error updating user reviews:", error);
              Alert.alert("Error", "Failed to add review under user.");
            });
        })
        .catch((error) => {
          console.error("Error adding review:", error);
          Alert.alert("Error", "Failed to add review.");
        });
    } else {
      Alert.alert("Error", "Please fill out both fields.");
    }
  };

  return (
    <View style={GlobalStyles.container}>
      <TouchableOpacity style={GlobalStyles.backButton} onPress={() => navigation.goBack()}>
        <Ionicons name='arrow-back' size={24} color='#fff' />
      </TouchableOpacity>
      <Text style={GlobalStyles.label}>Tilføj en anmeldelse</Text>
      <TextInput style={GlobalStyles.input} placeholder='Write your review' value={review} onChangeText={setReview} />
      <TextInput style={GlobalStyles.input} placeholder='Rating (1-5)' value={rating} onChangeText={setRating} keyboardType='numeric' />

      {/* Image Picker */}
      <TouchableOpacity onPress={pickImage} style={GlobalStyles.button}>
        <Text style={GlobalStyles.buttonText}>Vælg Billede</Text>
      </TouchableOpacity>
      {image && <Image source={{ uri: image }} style={GlobalStyles.imagePreview} />}

      <Button title='Submit' onPress={handleSubmit} />
    </View>
  );
};

export default AddReview;
