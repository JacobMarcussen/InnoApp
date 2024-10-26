import React, { useState } from "react";
import { View, Text, TextInput, Button, Alert, TouchableOpacity } from "react-native";
import { set, ref, get } from "firebase/database";
import { database } from "../firebase"; // Adjust the path according to your structure
import GlobalStyles from "../GlobalStyles"; // Adjust the import path based on your folder structure

const CreateUser = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [gender, setGender] = useState("");
  const [selectedCuisines, setSelectedCuisines] = useState([]);
  const [budget, setBudget] = useState("");

  const cuisines = ["Italiensk", "Thailandsk", "Indisk", "Mexicansk", "Sushi"];

  const handleCreateUser = () => {
    if (!name || !email || !password || !gender || !budget) {
      Alert.alert("Fejl", "Udfyld venligst alle felter");
      return;
    }

    const usersRef = ref(database, "users");

    get(usersRef)
      .then((snapshot) => {
        let newUserId = 1;

        if (snapshot.exists()) {
          const usersData = snapshot.val();
          const userIds = Object.keys(usersData).map(Number);
          const maxId = Math.max(...userIds);
          newUserId = maxId + 1;
        }

        set(ref(database, `users/${newUserId}`), {
          id: newUserId,
          name,
          email,
          password, // Consider hashing passwords in a real app!
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

  const toggleCuisine = (cuisine) => {
    if (selectedCuisines.includes(cuisine)) {
      setSelectedCuisines(selectedCuisines.filter((item) => item !== cuisine));
    } else {
      setSelectedCuisines([...selectedCuisines, cuisine]);
    }
  };

  return (
    <View style={GlobalStyles.container}>
      <Text style={GlobalStyles.title}>Opret Ny Bruger</Text>

      <TextInput
        style={GlobalStyles.input}
        placeholder="Navn"
        value={name}
        onChangeText={setName}
      />

      <TextInput
        style={GlobalStyles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />

      <TextInput
        style={GlobalStyles.input}
        placeholder="Adgangskode"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

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
        <TouchableOpacity
          key={cuisine}
          style={GlobalStyles.checkboxContainer}
          onPress={() => toggleCuisine(cuisine)}
        >
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
            <Text style={{ color: budget === item ? "#fff" : "#000" }}>
              {item === "1" ? "💲" : item === "2" ? "💲💲" : "💲💲💲"}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
     

      <Button title="Opret Bruger" onPress={handleCreateUser} color="#FF4500" />
    </View>
  );
};

export default CreateUser;
