import React, { useState, useEffect } from "react";
import { View, Text, Alert, TouchableOpacity, ScrollView } from "react-native";
import { useAuth } from "../components/AuthContext";
import GlobalStyles from "../GlobalStyles";
import { database } from "../firebase";
import { ref, update } from "firebase/database";
import Geolocation from "@react-native-community/geolocation";
import { Configuration, OpenAIApi } from "openai";
import Config from "react-native-config";

const AI_API_KEY = Config.AI_API_KEY;

const configuration = new Configuration({
  apiKey: AI_API_KEY,
});
const openai = new OpenAIApi(configuration);

const Recomendations = () => {
  // Brugerens data og funktioner fra AuthContext
  const { user } = useAuth();

  const userData = {
    favoriteCities: user.favoriteCities || ["København", "Aarhus"],
    favoriteCuisines: user.favoriteCuisines || ["Italiensk", "Asiatisk"],
    priceLevel: user.priceLevel || "Medium",
  };

  const [location, setLocation] = useState(null);
  const [recommendations, setRecommendations] = useState([]);

  // Hent brugerens placering
  useEffect(() => {
    Geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      },
      (error) => Alert.alert("Fejl ved hentning af placering", error.message),
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
    );
  }, []);

  // Generér prompt og hent anbefalinger fra OpenAI
  const generateRecommendations = async () => {
    if (!location) {
      Alert.alert("Placering ikke fundet", "Vent venligst på, at placeringen indlæses.");
      return;
    }

    const prompt = `
    Brugerprofil:
    - Favoritbyer: ${userData.favoriteCities.join(", ")}
    - Foretrukne køkkentyper: ${userData.favoriteCuisines.join(", ")}
    - Prisniveau: ${userData.priceLevel}
    - Brugerens nuværende placering: Latitude ${location.latitude}, Longitude ${location.longitude}

    Vælg de bedste lokationer baseret på disse præferencer og placeringen, og beskriv kort hvorfor de passer godt til brugeren.
    `;

    try {
      const response = await openai.createChatCompletion({
        model: "gpt-4",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 300,
      });

      // Parse OpenAI's response for anbefalinger
      const recommendationsData = response.data.choices[0].message.content;
      setRecommendations(recommendationsData.split("\n").filter((line) => line.trim() !== ""));
    } catch (error) {
      console.error("Fejl ved hentning af anbefalinger:", error);
      Alert.alert("Fejl", "Kunne ikke hente anbefalinger.");
    }
  };

  return (
    <ScrollView style={GlobalStyles.container}>
      <Text style={GlobalStyles.headline}>Anbefalinger baseret på din profil</Text>

      <TouchableOpacity style={[GlobalStyles.button, { backgroundColor: "#FF4500" }]} onPress={generateRecommendations}>
        <Text style={GlobalStyles.buttonText}>Hent Anbefalinger</Text>
      </TouchableOpacity>

      {/* Vis anbefalinger */}
      {recommendations.length > 0 ? (
        recommendations.map((recommendation, index) => (
          <View key={index} style={GlobalStyles.cardWrapper}>
            <Text style={GlobalStyles.cardText}>{recommendation}</Text>
          </View>
        ))
      ) : (
        <Text style={GlobalStyles.infoText}>Ingen anbefalinger fundet. Tryk på knappen for at få nye anbefalinger.</Text>
      )}
    </ScrollView>
  );
};

export default Recomendations;
