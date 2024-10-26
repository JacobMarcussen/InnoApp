import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  Alert,
  TouchableOpacity,
} from "react-native";
import { ref, get } from "firebase/database";
import { database } from "../firebase";
import GlobalStyles from "../GlobalStyles";
import { useAuth } from "../components/AuthContext";

const Login = ({ navigation }) => {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    if (!email || !password) {
      Alert.alert("Fejl", "Udfyld venligst alle felter");
      return;
    }

    const usersRef = ref(database, "users");

    get(usersRef)
      .then((snapshot) => {
        if (snapshot.exists()) {
          const usersData = snapshot.val();
          const users = Object.values(usersData);

          // Check if the user exists with the provided email and password
          const user = users.find(
            (user) => user.email === email && user.password === password
          );

          if (user) {
            // If the user exists, navigate to the Locations screen
            Alert.alert("Succes", "Logget ind med succes!");
            login(user);
            navigation.navigate("ProtectedScreen"); // Navigate to the Locations screen
          } else {
            Alert.alert("Fejl", "Ugyldig email eller adgangskode");
          }
        } else {
          Alert.alert("Fejl", "Ingen brugere fundet");
        }
      })
      .catch((error) => {
        Alert.alert(
          "Fejl",
          "Fejl ved hentning af brugerdata: " + error.message
        );
      });
  };

  return (
    <View style={GlobalStyles.container}>
      <Text style={GlobalStyles.title}>Login</Text>

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

      <Button title="Login" onPress={handleLogin} color="#FF4500" />

      <TouchableOpacity
        onPress={() => navigation.navigate("CreateUser")}
        style={{ marginTop: 20 }}
      >
        <Text style={{ color: "#FF4500", textAlign: "center" }}>
          Har du ikke en bruger? Opret her
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default Login;
