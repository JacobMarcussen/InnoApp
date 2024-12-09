import React, { useState, useEffect } from "react";
import { View, Text, Alert, TouchableOpacity, ScrollView, Modal, ActivityIndicator } from "react-native";
import { useAuth } from "./AuthContext";
import GlobalStyles from "../GlobalStyles";
// Bruger Expo Location til at hente brugerens placering
import * as Location from "expo-location";
import { OpenAI } from "openai";
//Burger expo constants for at hente API nøgle fra app.json, da .env filer ikke understøttes i Expo
import Constants from "expo-constants";

// INDSÆT GPT API NØGLE HERUNDER: (AI_API_KEY="api_nøgle_her")
const AI_API_KEY = Constants.expoConfig.extra.AI_API_KEY;

// Opretter en instans af OpenAI med API nøglen
const openai = new OpenAI({ apiKey: AI_API_KEY });

const Recomendations = ({ locations }) => {
  // Henter brugerens data fra AuthContext
  const { user } = useAuth();

  // Funktion til at konvertere brugerens budget til en tekstværdi
  const convertBudget = (budget) => {
    switch (budget) {
      case "1":
        return "Lav";
      case "2":
        return "Medium";
      case "3":
        return "Høj";
      default:
        return "Medium";
    }
  };

  // Sætter brugerens data i et objekt med fallback-værdier, hvis brugerens data mangler
  const userData = {
    favoriteCuisines: user.cuisines || ["Italiensk", "Thai", "Fransk", "Dansk", "Indisk", "Kinesisk", "Fine dining"],
    priceLevel: convertBudget(user.budget),
  };

  // State til at holde brugerens placering, anbefalinger, synlighed og indlæsningsstatus
  const [geoLocation, setGeoLocation] = useState(null);
  const [recommendations, setRecommendations] = useState({});
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  const fetchLocation = async () => {
    try {
      // Forespørg brugeren om placeringstilladelse
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Placeringstilladelse nægtet", "Tillad venligst adgang til placering for at fortsætte.");
        return;
      }

      // Henter brugerens nuværende placering
      const geoLocation = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      // Opdaterer state med brugerens placering
      setGeoLocation({
        latitude: geoLocation.coords.latitude,
        longitude: geoLocation.coords.longitude,
      });
    } catch (error) {
      Alert.alert("Fejl ved hentning af placering", error.message);
    }
  };

  // Kører fetchLocation, når komponenten renderes første gang
  useEffect(() => {
    fetchLocation();
  }, []);

  // Funktion som anbefalder en restaurant baseret på brugerens præferencer og placering med Open Ai's GPT-4o-mini
  const generateRecommendations = async () => {
    if (!geoLocation) {
      Alert.alert("Placering ikke fundet", "Vent venligst på, at placeringen indlæses.");
      return;
    }
    // Sætter modalen til synlig og viser en spinner, imens anbefalingen hentes
    setModalVisible(true);
    setLoading(true);

    // Prompt til OpenAI's GPT-4o-mini model med brugerens data, placering og alle restuaranter fra databasen
    const prompt = `
      Brugerprofil:
      - Foretrukne køkkentyper: ${userData.favoriteCuisines.join(", ")}
      - Prisniveau: ${userData.priceLevel}
      - Brugerens nuværende placering: Latitude ${geoLocation.latitude}, Longitude ${geoLocation.longitude}
      - Tilgængelige spisesteder:
      ${locations
        .map(
          (location) => `
        - Navn: ${location.name}
          Køkken: ${location.cuisine}
          Adresse: ${location.address}
          Postnummer: ${location.postalcode}
          By: ${location.city}
          Type: ${location.type}
          Prisniveau: ${location.priceclass}`
        )
        .join("\n")}

      Ud fra ovenstående data, vælg den bedste lokation baseret på brugerprofilens præferencer og placeringen, og returnér resultatet i følgende JSON-format uden ekstra formatteing eller markdown:

      {
        "name": "Restaurantens navn",
        "cuisine": "Køkken",
        "address": "Adresse",
        "postalcode": "Postnummer",
        "city": "By",
        "type": "Type",
        "priceclass": "Prisniveau",
        "reason": "Hvorfor passer denne lokation godt til brugeren"
      }
    `;

    // Sender anmodning til OpenAI's GPT-4o-mini model
    try {
      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 300,
      });
      let recommendationsData = response.choices[0].message?.content;
      recommendationsData = recommendationsData.replace(/```/g, "").trim();
      const recommendationsJSON = JSON.parse(recommendationsData);

      // Opdaterer state med anbefalingen
      setRecommendations(recommendationsJSON);
    } catch (error) {
      console.error("Fejl ved hentning af anbefalinger:", error);
      Alert.alert("Fejl", "Kunne ikke hente anbefalinger.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <TouchableOpacity style={[GlobalStyles.button, { backgroundColor: "#FF4500" }]} onPress={generateRecommendations}>
        <Text style={GlobalStyles.buttonText}>Overrask mig!</Text>
      </TouchableOpacity>

      {/* Modal til anbefalingen */}
      <Modal visible={modalVisible} transparent={true} animationType='slide'>
        <View style={GlobalStyles.modalContainer}>
          <View style={GlobalStyles.modalContent}>
            {loading ? (
              // Visser en spinner under indlæsning af anbefaling
              <View style={GlobalStyles.loadingContainer}>
                <ActivityIndicator size='large' color='#FF4500' />
                <Text style={GlobalStyles.loadingText}>Indlæser overraskelse...</Text>
              </View>
            ) : (
              // Viser anbefalingen, når den er hentet
              <>
                <ScrollView>
                  <Text style={[GlobalStyles.title, { marginTop: 10 }]}>{recommendations.name}</Text>
                  <View style={{ flexDirection: "column", justifyContent: "center", alignItems: "center", marginBottom: 10 }}>
                    <Text style={[GlobalStyles.resBadge]}>
                      {recommendations.address}, {recommendations.city}
                    </Text>
                    <View style={{ flexDirection: "row", justifyContent: "center" }}>
                      <Text style={GlobalStyles.resBadge}>{recommendations.cuisine}</Text>
                      <Text style={GlobalStyles.resBadge}>$: {recommendations.priceclass}</Text>
                    </View>
                  </View>
                  <Text style={{ color: "white" }}>{recommendations.reason}</Text>
                </ScrollView>
                <TouchableOpacity style={[GlobalStyles.button, { backgroundColor: "#FF4500", width: "100%", marginTop: 35 }]}>
                  <Text style={{ color: "#fff", textAlign: "center" }}>Book bord</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[GlobalStyles.button, { width: "100%" }]} onPress={() => setModalVisible(false)}>
                  <Text style={{ color: "#fff", textAlign: "center" }}>Luk</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </Modal>
    </>
  );
};

export default Recomendations;
