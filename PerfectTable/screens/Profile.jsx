import React, { useState } from "react";
import { View, Text, TextInput, Alert, TouchableOpacity, FlatList, ScrollView } from "react-native";
import { useAuth } from "../components/AuthContext";
import GlobalStyles from "../GlobalStyles";
import { database } from "../firebase";
import { ref, update } from "firebase/database";
import DropDownPicker from "react-native-dropdown-picker";

const Profile = () => {
  // Brugerens data og funktioner fra AuthContext
  const { user, logout } = useAuth();

  // State variabler til at holde værdierne af brugerens profil
  const [budget, setBudget] = useState(user?.budget || "1");
  const [email, setEmail] = useState(user?.email || "");
  const [gender, setGender] = useState(user?.gender || "");
  const [name, setName] = useState(user?.name || "");
  const [password, setPassword] = useState(user?.password || "");
  const [cuisineOpen, setCusisineOpen] = useState(false);
  const [cuisines, setCuisines] = useState(user?.cuisines || []);
  const [cuisineItems, setCuisineItems] = useState([
    { label: "Indisk", value: "Indisk" },
    { label: "Thai", value: "Thai" },
    { label: "Italiensk", value: "Italiensk" },
    { label: "Kinesisk", value: "Kinesisk" },
    { label: "Fine dining", value: "Fine dining" },
    { label: "Dansk", value: "Dansk" },
    { label: "Fransk", value: "Fransk" },
  ]);

  const handleSave = () => {
    if (!user) {
      Alert.alert("Fejl", "Brugerdata ikke tilgængelig. Prøv at logge ind igen.");
      return;
    }

    // Opretter en reference til brugeren i databasen
    const userRef = ref(database, `users/${user.id}`);

    console.log(cuisines);
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

  return (
    <ScrollView style={{ backgroundColor: "#1e1e1e" }}>
      <View style={GlobalStyles.cardContainer}>
        {user ? (
          <>
            <View style={{ width: "93%", zIndex: 1000 }}>
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
              <Text style={GlobalStyles.label}>Køkken (Cuisine):</Text>
              <DropDownPicker
                open={cuisineOpen}
                value={cuisines}
                items={cuisineItems}
                setOpen={setCusisineOpen}
                setValue={setCuisines}
                setItems={setCuisineItems}
                multiple={true}
                mode='BADGE'
                placeholder='Vælg Køkken(er)'
                badgeColors='#FF4500'
                badgeTextStyle={{ color: "#FFF" }}
                textStyle={{ color: "#fff", fontWeight: "bold" }}
                style={[GlobalStyles.dropdown, { width: "100%" }]}
                zIndex={3000}
                zIndexInverse={1000}
                dropDownContainerStyle={[GlobalStyles.dropdownContainer, { width: "100%" }]}
                listMode='SCROLLVIEW'
                scrollViewProps={{ nestedScrollEnabled: true }}
              />
              <Text style={GlobalStyles.label}>Budget:</Text>
              <View style={GlobalStyles.budgetContainer}>
                {["1", "2", "3"].map((level) => (
                  <TouchableOpacity key={level} style={[GlobalStyles.budgetButton, budget === level && GlobalStyles.selectedBudgetButton]} onPress={() => setBudget(level)}>
                    <Text style={GlobalStyles.budgetText}>{"$".repeat(parseInt(level))}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
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
