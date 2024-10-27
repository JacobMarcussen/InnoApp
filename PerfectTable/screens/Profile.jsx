import React, { useState } from "react";
import { View, Text, TextInput, Alert, TouchableOpacity, FlatList, ScrollView } from "react-native";
import { useAuth } from "../components/AuthContext";
import GlobalStyles from "../GlobalStyles";
import { database } from "../firebase";
import { ref, update } from "firebase/database";

const cuisineOptions = ["Indisk", "Thai", "Italiensk", "Kinesisk"];

const Profile = () => {
  const { user, logout } = useAuth();
  const [budget, setBudget] = useState(user?.budget || "1");
  const [cuisines, setCuisines] = useState(user?.cuisines || []);
  const [customCuisine, setCustomCuisine] = useState("");
  const [email, setEmail] = useState(user?.email || "");
  const [gender, setGender] = useState(user?.gender || "");
  const [name, setName] = useState(user?.name || "");
  const [password, setPassword] = useState(user?.password || "");

  const handleSave = () => {
    if (!user) {
      Alert.alert("Fejl", "Brugerdata ikke tilgængelig. Prøv at logge ind igen.");
      return;
    }

    const userRef = ref(database, `users/${user.id}`);

    update(userRef, {
      budget,
      cuisines,
      email,
      gender,
      name,
      password,
    })
      .then(() => {
        Alert.alert("Succes", "Profil opdateret!");
      })
      .catch((error) => {
        Alert.alert("Fejl", "Kunne ikke opdatere profil: " + error.message);
      });
  };

  const handleLogout = () => {
    logout();
  };

  const toggleCuisine = (cuisine) => {
    setCuisines((prev) => (prev.includes(cuisine) ? prev.filter((c) => c !== cuisine) : [...prev, cuisine]));
  };

  const addCustomCuisine = () => {
    if (customCuisine.trim() && !cuisines.includes(customCuisine)) {
      setCuisines((prev) => [...prev, customCuisine.trim()]);
      setCustomCuisine("");
    }
  };

  const renderCuisineOption = ({ item }) => (
    <TouchableOpacity onPress={() => toggleCuisine(item)} style={GlobalStyles.cuisineBox}>
      <Text style={cuisines.includes(item) ? GlobalStyles.selectedCuisine : GlobalStyles.unselectedCuisine}>{item}</Text>
    </TouchableOpacity>
  );

  return (
    <ScrollView style={{ backgroundColor: "#1e1e1e" }}>
      <View style={GlobalStyles.cardContainer}>
        {user ? (
          <>
            <Text style={GlobalStyles.headline}>
              Din <Text style={{ color: "#FF4500" }}>profil</Text>
            </Text>
            <Text style={GlobalStyles.label}>Navn:</Text>
            <TextInput style={GlobalStyles.input} value={name} onChangeText={setName} placeholder='Name' />
            <Text style={GlobalStyles.label}>Email:</Text>
            <TextInput style={GlobalStyles.input} value={email} onChangeText={setEmail} placeholder='Email' keyboardType='email-address' />
            <Text style={GlobalStyles.label}>Køn:</Text>
            <TextInput style={GlobalStyles.input} value={gender} onChangeText={setGender} placeholder='Gender' />
            <Text style={GlobalStyles.label}>Adgangskode:</Text>
            <TextInput style={GlobalStyles.input} value={password} onChangeText={setPassword} placeholder='Password' secureTextEntry />
            <Text style={GlobalStyles.label}>Budget:</Text>
            <View style={GlobalStyles.budgetContainer}>
              {["1", "2", "3"].map((level) => (
                <TouchableOpacity key={level} style={[GlobalStyles.budgetButton, budget === level && GlobalStyles.selectedBudgetButton]} onPress={() => setBudget(level)}>
                  <Text style={GlobalStyles.budgetText}>{"$".repeat(parseInt(level))}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <Text style={GlobalStyles.label}>Køkken (Cuisine):</Text>
            <FlatList data={cuisineOptions} renderItem={renderCuisineOption} keyExtractor={(item) => item} horizontal />
            <TextInput style={GlobalStyles.input} value={customCuisine} onChangeText={setCustomCuisine} placeholder='Tilføj din eget køkken' />
            <TouchableOpacity style={GlobalStyles.button} onPress={addCustomCuisine}>
              <Text style={GlobalStyles.buttonText}>Tilføj køkken</Text>
            </TouchableOpacity>
            <TouchableOpacity style={GlobalStyles.button} onPress={handleSave}>
              <Text style={GlobalStyles.buttonText}>Gem ændringer</Text>
            </TouchableOpacity>
            <TouchableOpacity style={GlobalStyles.button} onPress={handleLogout}>
              <Text style={GlobalStyles.buttonText}>Log ud</Text>
            </TouchableOpacity>
          </>
        ) : (
          <Text>Fejl i hentningen af din data. Prøv at log ind igen.</Text>
        )}
      </View>
    </ScrollView>
  );
};

export default Profile;
