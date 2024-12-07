import React, { useState } from "react";
import { View, TextInput, Button, Text, Alert, TouchableOpacity, Image } from "react-native";
import { ref, push, update } from "firebase/database";
import { database, storage } from "../firebase";
import { useAuth } from "../components/AuthContext";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { useNavigation, useRoute } from "@react-navigation/native";
import GlobalStyles from "../GlobalStyles";
// Importerer FileSystem fra expo-file-system til at læse billederne som Base64
import * as FileSystem from "expo-file-system";

// Screen komponent til at tilføje en anmeldelse
const AddReview = () => {
  // State variabler til at holde værdierne af anmeldelsen
  const [review, setReview] = useState("");
  const [rating, setRating] = useState("");
  const [image, setImage] = useState(null);
  // Bruger useAuth hook'en fra authContext til at hente brugerens data
  const { user } = useAuth();
  const navigation = useNavigation();
  const route = useRoute();
  // Henter locationId fra route params
  const { locationId } = route.params;

  // Funktion til at vælge et billede fra kamerarullen
  const pickImage = async () => {
    // Forespørg adgang til kamerarullen
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status === "granted") {
      // Åbn kamerarullen og vent på brugerens valg
      const pickerResult = await ImagePicker.launchImageLibraryAsync({
        // Begrænser valg til billeder
        mediaTypes: ["images"],
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!pickerResult.canceled) {
        const uri = pickerResult.assets[0].uri;

        // Læser billedet som Base64 og gemmer det i state
        const base64 = await FileSystem.readAsStringAsync(uri, {
          encoding: FileSystem.EncodingType.Base64,
        });

        // Gemmer billedet som en Base64-kodet streng i state. Tilføjer "data:image/jpeg;base64," foran strengen, så det kan vises som et billede
        setImage(`data:image/jpeg;base64,${base64}`);
      } else {
        Alert.alert("Fejl", "Intet billede valgt.");
      }
    } else {
      Alert.alert("Adgang krævet", "Tillad adgang til kamerarullen for at vælge et billede.");
    }
  };

  // Funktion til at håndtere push af anmeldelsen
  const handleSubmit = async () => {
    if (review && rating) {
      // Opretter et objekt med anmeldelsesdata
      const reviewData = {
        review,
        rating: parseInt(rating),
        timestamp: Date.now(),
        creator: user.id,
        image: image,
      };

      const reviewsRef = ref(database, `reviews/${locationId}`);

      push(reviewsRef, reviewData)
        .then(() => {
          setReview("");
          setRating("");
          setImage(null);
          Alert.alert("Sådan!", "Anmeldelse tilføjet!");
        })
        .catch((error) => {
          console.error("Fejl med tilføjelsen:", error);
          Alert.alert("Fejl", "Kunne ikke tilføje anmeldelse.");
        });
    } else {
      Alert.alert("Fejl", "Udfyld begge felter.");
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
      {/* Viser billedet, hvis der er et valgt */}
      {image && <Image source={{ uri: image }} style={GlobalStyles.imagePreview} />}

      <TouchableOpacity onPress={handleSubmit} style={[GlobalStyles.button, { backgroundColor: "#FF4500" }]}>
        <Text style={GlobalStyles.buttonText}>Indsend</Text>
      </TouchableOpacity>
    </View>
  );
};

export default AddReview;
