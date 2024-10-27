import React, { useState } from "react";
import { View, Text, TextInput, Button, Alert, TouchableOpacity } from "react-native";
import { set, ref, get } from "firebase/database";
import { database } from "../firebase";
import GlobalStyles from "../GlobalStyles";

// Komponent til at oprette en ny bruger
const CreateUser = ({ navigation }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [gender, setGender] = useState("");
  const [selectedCuisines, setSelectedCuisines] = useState([]);
  const [budget, setBudget] = useState("");

  const cuisines = ["Italiensk", "Thailandsk", "Indisk", "Mexicansk", "Sushi"];

  const handleCreateUser = () => {
    // Tjekker om alle felter er udfyldt
    if (!name || !email || !password || !gender || !budget) {
      Alert.alert("Fejl", "Udfyld venligst alle felter");
      return;
    }

    const usersRef = ref(database, "users");

    // Henter brugerdata fra Firebase for at finde det næste ledige bruger-id
    get(usersRef)
      .then((snapshot) => {
        let newUserId = 1;

        // Hvis der allerede er brugere i databasen, findes det højeste bruger-id og det næste ledige id beregnes
        if (snapshot.exists()) {
          const usersData = snapshot.val();
          const userIds = Object.keys(usersData).map(Number);
          const maxId = Math.max(...userIds);
          newUserId = maxId + 1;
        }

        // Opretter brugerobjekt og gemmer i Firebase
        set(ref(database, `users/${newUserId}`), {
          id: newUserId,
          name,
          email,
          password, // Bliver bliver ikke hashet i, da det blot er til test
          gender,
          cuisines: selectedCuisines,
          budget,
        })
          .then(() => {
            Alert.alert("Succes", "Bruger oprettet med succes!");
            setName("");
            setEmail("");
            setPassword("");
            setGender("");
            setSelectedCuisines([]);
            setBudget("");
          })
          .catch((error) => {
            Alert.alert("Fejl", "Fejl under oprettelse af bruger: " + error.message);
          });
      })
      .catch((error) => {
        Alert.alert("Fejl", "Fejl ved hentning af brugerdata: " + error.message);
      });
  };

  // Funktion til at tilføje eller fjerne en kategori fra brugerens favoritter
  const toggleCuisine = (cuisine) => {
    if (selectedCuisines.includes(cuisine)) {
      setSelectedCuisines(selectedCuisines.filter((item) => item !== cuisine));
    } else {
      setSelectedCuisines([...selectedCuisines, cuisine]);
    }
  };

  // Returnerer JSX komponent med inputfelter og knapper
  return (
    <View style={GlobalStyles.container}>
      <Text style={GlobalStyles.title}>Opret Ny Bruger</Text>

      <TextInput style={GlobalStyles.input} placeholder='Navn' value={name} onChangeText={setName} />

      <TextInput style={GlobalStyles.input} placeholder='Email' value={email} onChangeText={setEmail} keyboardType='email-address' />

      <TextInput style={GlobalStyles.input} placeholder='Adgangskode' value={password} onChangeText={setPassword} secureTextEntry />

      <Text style={GlobalStyles.label}>Køn:</Text>
      <View style={{ flexDirection: "row", marginBottom: 15 }}>
        {["Mand", "Kvinde"].map((item) => (
          <TouchableOpacity
            key={item}
            style={{
              ...GlobalStyles.button,
              backgroundColor: gender === item ? "#FF4500" : "#ccc",
              marginHorizontal: 5,
            }}
            onPress={() => setGender(item)}
          >
            <Text style={{ color: gender === item ? "#fff" : "#000" }}>{item}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={GlobalStyles.label}>Favorit Kategorier:</Text>
      {cuisines.map((cuisine) => (
        <TouchableOpacity key={cuisine} style={GlobalStyles.checkboxContainer} onPress={() => toggleCuisine(cuisine)}>
          <View
            style={{
              width: 20,
              height: 20,
              borderColor: "#FF4500",
              borderWidth: 2,
              backgroundColor: selectedCuisines.includes(cuisine) ? "#FF4500" : "#fff",
              marginRight: 10,
              borderRadius: 3,
            }}
          />
          <Text style={GlobalStyles.label}>{cuisine}</Text>
        </TouchableOpacity>
      ))}

      <Text style={GlobalStyles.label}>Budget:</Text>
      <View style={{ flexDirection: "row", marginBottom: 15 }}>
        {["1", "2", "3"].map((item) => (
          <TouchableOpacity
            key={item}
            style={{
              ...GlobalStyles.button,
              backgroundColor: budget === item ? "#FF4500" : "#ccc",
              marginHorizontal: 5,
            }}
            onPress={() => setBudget(item)}
          >
            <Text style={{ color: budget === item ? "#fff" : "#000" }}>{item === "1" ? "💲" : item === "2" ? "💲💲" : "💲💲💲"}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Button title='Opret Bruger' onPress={handleCreateUser} color='#FF4500' />

      {/* Button for existing users to login */}
      <TouchableOpacity onPress={() => navigation.navigate("Login")} style={{ marginTop: 20 }}>
        <Text style={{ color: "#FF4500", textAlign: "center" }}>Har du allerede en bruger? Login her</Text>
      </TouchableOpacity>
    </View>
  );
};

export default CreateUser;
