import React, { useState, useEffect } from "react";
import { View, Text, Alert, TouchableOpacity, ScrollView, Modal, StyleSheet, ActivityIndicator } from "react-native";
import { useAuth } from "./AuthContext";
import GlobalStyles from "../GlobalStyles";
import { database } from "../firebase";
import { ref, set, update } from "firebase/database";
import * as Location from "expo-location";
import { OpenAI } from "openai";
import Constants from "expo-constants";

const AI_API_KEY = Constants.expoConfig.extra.AI_API_KEY;

const openai = new OpenAI({ apiKey: AI_API_KEY });

const Recomendations = ({ locations }) => {
  const { user } = useAuth();

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

  const userData = {
    favoriteCuisines: user.cuisines || ["Italiensk", "Thai", "Fransk", "Dansk", "Indisk", "Kinesisk", "Fine dining"],
    priceLevel: convertBudget(user.budget),
  };

  const [geoLocation, setGeoLocation] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  const fetchLocation = async () => {
    try {
      // Request location permissions
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Placeringstilladelse nægtet", "Tillad venligst adgang til placering for at fortsætte.");
        return;
      }

      // Get the current position
      const geoLocation = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      setGeoLocation({
        latitude: geoLocation.coords.latitude,
        longitude: geoLocation.coords.longitude,
      });
    } catch (error) {
      Alert.alert("Fejl ved hentning af placering", error.message);
    }
  };

  useEffect(() => {
    fetchLocation();
  }, []);

  const generateRecommendations = async () => {
    if (!geoLocation) {
      Alert.alert("Placering ikke fundet", "Vent venligst på, at placeringen indlæses.");
      return;
    }
    setModalVisible(true); // Show the modal after fetching recommendations
    setLoading(true);

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

    Vælg den bedste lokation baseret på de tilgængelige spisesteder ud fra brugerprofilens præferencer og placeringen, og beskriv kort hvorfor den passer godt til brugeren.
    `;

    try {
      const response = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 300,
      });
      const recommendationsData = response.choices[0].message?.content;
      setRecommendations(recommendationsData.split("\n").filter((line) => line.trim() !== ""));
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

      {/* Modal for Recommendations */}
      <Modal visible={modalVisible} transparent={true} animationType='slide'>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            {loading ? (
              // Show a spinner while loading
              <View style={styles.loadingContainer}>
                <ActivityIndicator size='large' color='#FF4500' />
                <Text style={styles.loadingText}>Indlæser overraskelse...</Text>
              </View>
            ) : (
              // Show recommendations after loading
              <>
                <Text style={styles.modalTitle}>Dine Anbefaling</Text>
                <ScrollView>
                  {recommendations.map((recommendation, index) => (
                    <Text key={index} style={styles.recommendationText}>
                      {recommendation}
                    </Text>
                  ))}
                </ScrollView>
                <TouchableOpacity style={[GlobalStyles.button, { backgroundColor: "#FF4500", width: "100%" }]}>
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

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: "93%",
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  recommendationText: {
    fontSize: 16,
    marginVertical: 5,
  },
  closeButton: {
    backgroundColor: "#FF4500",
    marginTop: 15,
  },
});

export default Recomendations;
