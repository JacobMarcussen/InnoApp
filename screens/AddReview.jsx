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
import * as FileSystem from "expo-file-system";

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
        const uri = pickerResult.assets[0].uri;

        // Convert to Base64
        const base64 = await FileSystem.readAsStringAsync(uri, {
          encoding: FileSystem.EncodingType.Base64,
        });

        setImage(`data:image/jpeg;base64,${base64}`); // Base64 string with MIME type
      } else {
        Alert.alert("Error", "No image selected.");
      }
    } else {
      Alert.alert("Adgang krævet", "Tillad adgang til kamerarullen for at vælge et billede.");
    }
  };

  const handleSubmit = async () => {
    if (review && rating) {
      const reviewData = {
        review,
        rating: parseInt(rating),
        timestamp: Date.now(),
        creator: user.id,
        image: image, // Save Base64 string here
      };

      const reviewsRef = ref(database, `reviews/${locationId}`);

      push(reviewsRef, reviewData)
        .then(() => {
          setReview("");
          setRating("");
          setImage(null);
          Alert.alert("Success", "Review added successfully!");
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
      <TouchableOpacity onPress={pickImage} style={GlobalStyles.button}>
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
