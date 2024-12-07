import React, { useState } from "react";
import { View, Text, TextInput, Button, Alert, TouchableOpacity } from "react-native";
import { ref, get } from "firebase/database";
import { database } from "../firebase";
import GlobalStyles from "../GlobalStyles";
import { useAuth } from "../components/AuthContext";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Screen komponent til at logge ind
const Login = ({ navigation }) => {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Funktion til at håndtere login
  const handleLogin = () => {
    if (!email || !password) {
      Alert.alert("Fejl", "Udfyld venligst alle felter");
      return;
    }

    const usersRef = ref(database, "users");

    // Henter brugerdata fra Firebase og tjekker om brugeren findes
    get(usersRef)
      .then((snapshot) => {
        if (snapshot.exists()) {
          const usersData = snapshot.val();
          const users = Object.values(usersData);

          const user = users.find((user) => user.email === email && user.password === password);

          if (user) {
            // Gemmer brugerdata i AsyncStorage og logger brugeren ind
            AsyncStorage.setItem("user", JSON.stringify(user))
              .then(() => {
                login(user);
                Alert.alert("Succes", "Logget ind med succes!");
              })
              .catch((error) => {
                console.error("Fejl. Kan ikke gemme bruger:", error);
              });
          } else {
            Alert.alert("Fejl", "Ugyldig email eller adgangskode");
          }
        } else {
          Alert.alert("Fejl", "Ingen brugere fundet");
        }
      })
      .catch((error) => {
        Alert.alert("Fejl", "Fejl ved hentning af brugerdata: " + error.message);
      });
  };

  return (
    <View style={GlobalStyles.container}>
      <Text style={GlobalStyles.title}>Login</Text>

      <TextInput style={GlobalStyles.input} placeholder='Email' value={email} placeholderTextColor='#D3D3D3' onChangeText={setEmail} keyboardType='email-address' />

      <TextInput style={GlobalStyles.input} placeholder='Adgangskode' value={password} placeholderTextColor='#D3D3D3' onChangeText={setPassword} secureTextEntry />

      <Button title='Login' onPress={handleLogin} color='#FF4500' />

      {/* Navigationsknap til CreateUser skærmen */}
      <TouchableOpacity onPress={() => navigation.navigate("CreateUser")} style={{ marginTop: 20 }}>
        <Text style={{ color: "#FF4500", textAlign: "center" }}>Har du ikke en bruger? Opret her</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Login;
