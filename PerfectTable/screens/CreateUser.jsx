import React, { useState } from "react";
import { View, Text, TextInput, Button, Alert, TouchableOpacity } from "react-native";
import { set, ref, get } from "firebase/database";
import { database } from "../firebase";
import GlobalStyles from "../GlobalStyles";
import DropDownPicker from "react-native-dropdown-picker";

// Komponent til at oprette en ny bruger
const CreateUser = ({ navigation }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [gender, setGender] = useState("");
  const [selectedCuisines, setSelectedCuisines] = useState([]);
  const [budget, setBudget] = useState("");
  const [cuisineOpen, setCuisineOpen] = useState(false); // Controls whether the dropdown is open
  const [cuisineItems, setCuisineItems] = useState([
    { label: "Indisk", value: "Indisk" },
    { label: "Thai", value: "Thai" },
    { label: "Italiensk", value: "Italiensk" },
    { label: "Kinesisk", value: "Kinesisk" },
    { label: "Fine dining", value: "Fine dining" },
    { label: "Dansk", value: "Dansk" },
    { label: "Fransk", value: "Fransk" },
  ]);

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

  // Returnerer JSX komponent med inputfelter og knapper
  return (
    <View style={GlobalStyles.container}>
      <Text style={[GlobalStyles.title, { marginTop: 100 }]}>Opret Ny Bruger</Text>

      <TextInput style={GlobalStyles.input} placeholder='Navn' placeholderTextColor='#D3D3D3' value={name} onChangeText={setName} />

      <TextInput style={GlobalStyles.input} placeholder='Email' placeholderTextColor='#D3D3D3' value={email} onChangeText={setEmail} keyboardType='email-address' />

      <TextInput style={GlobalStyles.input} placeholder='Adgangskode' placeholderTextColor='#D3D3D3' value={password} onChangeText={setPassword} secureTextEntry />

      <Text style={GlobalStyles.label}>Køn:</Text>
      <View style={{ flexDirection: "row", marginBottom: 15, width: "94%", gap: 15 }}>
        {["Mand", "Kvinde"].map((item) => (
          <TouchableOpacity
            key={item}
            style={{
              ...GlobalStyles.button,
              backgroundColor: gender === item ? "#FF4500" : "#121212",
              width: "50%",
            }}
            onPress={() => setGender(item)}
          >
            <Text style={{ color: "#fff" }}>{item}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={GlobalStyles.label}>Favorit Kategorier:</Text>
      <DropDownPicker
        open={cuisineOpen}
        value={selectedCuisines} // Bind selected cuisines
        items={cuisineItems}
        setOpen={setCuisineOpen}
        setValue={setSelectedCuisines} // Updates selected cuisines
        setItems={setCuisineItems}
        multiple={true} // Enable multiple selection
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
      <View style={{ flexDirection: "row", marginBottom: 15, width: "94%", gap: 15 }}>
        {["1", "2", "3"].map((item) => (
          <TouchableOpacity
            key={item}
            style={{
              ...GlobalStyles.button,
              backgroundColor: budget === item ? "#FF4500" : "#121212",
              width: "32%",
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
