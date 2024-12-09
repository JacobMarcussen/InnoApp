import React, { useState } from "react";
import { View, TextInput, Text, Alert, TouchableOpacity, Image } from "react-native";
import { ref, push } from "firebase/database";
import { database } from "../firebase";
import { useAuth } from "../components/AuthContext";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { useNavigation, useRoute } from "@react-navigation/native";
import GlobalStyles from "../GlobalStyles";
// Importerer FileSystem fra expo-file-system til at håndtere billeder som Base64
import * as FileSystem from "expo-file-system";
// Importerer DropdownPicker til rating-valg
import DropDownPicker from "react-native-dropdown-picker";

const AddReview = () => {
  const [review, setReview] = useState(""); // State til anmeldelsestekst
  const [rating, setRating] = useState(null); // State til rating værdi
  const [image, setImage] = useState(null); // State til billede
  const [open, setOpen] = useState(false); // State til at åbne eller lukke dropdown
  const { user } = useAuth(); // Henter brugeroplysninger fra AuthContext
  const navigation = useNavigation();
  const route = useRoute();
  const { locationId } = route.params; // Henter locationId fra navigationens params

  // Funktion til at vælge et billede fra kamerarullen
  const pickImage = async () => {
    // Anmoder om tilladelse til at få adgang til kamerarullen
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status === "granted") {
      // Åbner kamerarullen og lader brugeren vælge et billede
      const pickerResult = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"], // Begrænser valg til billeder
        allowsEditing: true, // Tillader redigering
        aspect: [4, 3], // Angiver billedets aspektforhold
        quality: 1, // Kvalitet på billedet
      });

      if (!pickerResult.canceled) {
        const uri = pickerResult.assets[0].uri;

        // Konverterer billedet til Base64 og gemmer det i state
        const base64 = await FileSystem.readAsStringAsync(uri, {
          encoding: FileSystem.EncodingType.Base64,
        });

        // Tilføjer "data:image/jpeg;base64," foran strengen, så billedet kan vises korrekt
        setImage(`data:image/jpeg;base64,${base64}`);
      } else {
        Alert.alert("Fejl", "Intet billede valgt.");
      }
    } else {
      Alert.alert("Adgang krævet", "Tillad adgang til kamerarullen for at vælge et billede.");
    }
  };

  // Funktion til at indsende anmeldelse
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

      // Firebase reference til den specifikke lokation
      const reviewsRef = ref(database, `reviews/${locationId}`);

      // Skubber anmeldelsen til databasen
      push(reviewsRef, reviewData)
        .then(() => {
          setReview(""); // Nulstiller anmeldelsestekst
          setRating(null); // Nulstiller rating
          setImage(null); // Nulstiller billede
          Alert.alert("Sådan!", "Anmeldelse tilføjet!");
        })
        .catch((error) => {
          console.error("Fejl med tilføjelsen:", error);
          Alert.alert("Fejl", "Kunne ikke tilføje anmeldelse.");
        });
    } else {
      Alert.alert("Fejl", "Udfyld begge felter."); // Advarer hvis felter ikke er udfyldt
    }
  };

  return (
    <View style={GlobalStyles.cardContainer}>
      {/* Tilbage-knap */}
      <TouchableOpacity style={GlobalStyles.backButton} onPress={() => navigation.goBack()}>
        <Ionicons name='arrow-back' size={24} color='#fff' />
      </TouchableOpacity>

      {/* Input til anmeldelse */}
      <View style={{ width: "93%" }}>
        <Text style={GlobalStyles.title}>Tilføj en anmeldelse</Text>
        <TextInput style={GlobalStyles.input} placeholderTextColor='#d3d3d3' placeholder='Skriv din anmeldelse' value={review} onChangeText={setReview} />
      </View>

      {/* Dropdown til rating */}
      <DropDownPicker
        open={open} // Dropdowns åben/lukket state
        value={rating} // Valgte rating
        items={[
          { label: "1", value: "1" },
          { label: "2", value: "2" },
          { label: "3", value: "3" },
          { label: "4", value: "4" },
          { label: "5", value: "5" },
        ]} // Muligheder for rating
        setOpen={setOpen}
        setValue={setRating}
        placeholder='Vælg en rating (1-5)'
        style={{
          backgroundColor: "#121212",
          borderColor: "#FF4500",
          width: "93%",
          alignSelf: "center",
          marginBottom: 40,
        }}
        dropDownContainerStyle={{
          backgroundColor: "#1e1e1e",
        }}
        textStyle={{
          color: "#fff",
        }}
        placeholderStyle={{
          color: "#d3d3d3",
        }}
      />

      {/* Knap til at vælge billede */}
      <TouchableOpacity onPress={pickImage} style={GlobalStyles.button}>
        <Text style={GlobalStyles.buttonText}>Vælg Billede</Text>
      </TouchableOpacity>

      {/* Viser valgt billede */}
      {image && <Image source={{ uri: image }} style={GlobalStyles.imagePreview} />}

      {/* Knap til at indsende anmeldelse */}
      <TouchableOpacity onPress={handleSubmit} style={[GlobalStyles.button, { backgroundColor: "#FF4500" }]}>
        <Text style={GlobalStyles.buttonText}>Indsend</Text>
      </TouchableOpacity>
    </View>
  );
};

export default AddReview;
