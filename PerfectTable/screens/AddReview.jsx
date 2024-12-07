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

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status === "granted") {
      const pickerResult = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!pickerResult.canceled) {
        setImage(pickerResult.assets[0].uri);
      }
    } else {
      Alert.alert("Adgang krævet", "Tillad adgang til kamerarullen for at vælge et billede.");
    }
  };

  const handleImageUpload = async () => {
    try {
      const imageUri = await pickImage(); // Select the image
      if (imageUri) {
        const downloadURL = await uploadImage(imageUri); // Upload the image
        Alert.alert("Success", "Image uploaded successfully: " + downloadURL);
      } else {
        Alert.alert("Error", "No image selected.");
      }
    } catch (error) {
      Alert.alert("Error", error.message || "An unknown error occurred.");
    }
  };

  const convertToBlob = async (uri) => {
    try {
      const response = await fetch(uri);
      if (!response.ok) {
        throw new Error("Failed to fetch the image.");
      }
      return await response.blob();
    } catch (error) {
      console.error("Error converting image to blob:", error);
      throw error;
    }
  };

  const uploadImage = async (uri) => {
    try {
      const blob = await convertToBlob(uri); // Convert URI to blob
      const storagePath = `images/${Date.now()}.jpg`;
      const imageRef = storageRef(storage, storagePath);

      await uploadBytes(imageRef, blob); // Upload blob to Firebase
      const downloadURL = await getDownloadURL(imageRef); // Get download URL

      console.log("Image uploaded successfully:", downloadURL);
      return downloadURL;
    } catch (error) {
      console.error("Error uploading image:", error);
      throw error;
    }
  };

  const handleSubmit = async () => {
    if (review && rating) {
      let imageUrl = null;

      // Upload image if available
      if (image) {
        try {
          imageUrl = await uploadImage(image);
        } catch (error) {
          console.error("Error payload:", error);
          Alert.alert("Upload Error", error.message || "Unknown error occurred.");
        }
      }

      // Create the review object
      const reviewData = {
        review,
        rating: parseInt(rating),
        timestamp: Date.now(),
        creator: user.id,
        imageUrl,
      };

      const reviewsRef = ref(database, `reviews/${locationId}`);

      // Add the review to the database
      push(reviewsRef, reviewData)
        .then((snapshot) => {
          const reviewId = snapshot.key;

          const userReviewsRef = ref(database, `users/${user.id}/reviews`);

          // Add the review to the user's profile
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
    <View style={GlobalStyles.cardContainer}>
      <TouchableOpacity style={GlobalStyles.backButton} onPress={() => navigation.goBack()}>
        <Ionicons name='arrow-back' size={24} color='#fff' />
      </TouchableOpacity>
      <View style={{ width: "93%" }}>
        <Text style={GlobalStyles.title}>Tilføj en anmeldelse</Text>
        <TextInput style={GlobalStyles.input} placeholderTextColor='#d3d3d3' placeholder='Write your review' value={review} onChangeText={setReview} />
        <TextInput style={GlobalStyles.input} placeholderTextColor='#d3d3d3' placeholder='Rating (1-5)' value={rating} onChangeText={setRating} keyboardType='numeric' />
      </View>
      {/* Image Picker */}
      <TouchableOpacity onPress={handleImageUpload} style={GlobalStyles.button}>
        <Text style={GlobalStyles.buttonText}>Vælg Billede</Text>
      </TouchableOpacity>
      {image && <Image source={{ uri: image }} style={GlobalStyles.imagePreview} />}

      <TouchableOpacity onPress={handleSubmit} style={[GlobalStyles.button, { backgroundColor: "#FF4500" }]}>
        <Text style={GlobalStyles.buttonText}>Indsend</Text>
      </TouchableOpacity>
    </View>
  );
};

export default AddReview;
