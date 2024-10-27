import React, { createContext, useContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Laver en context til at holde styr på om brugeren er logget ind
const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Tjekker om brugeren er logget ind ved at kigge i AsyncStorage
    const loadUserData = async () => {
      try {
        const userData = await AsyncStorage.getItem("user");
        console.log("Loaded user data:", userData);
        if (userData) {
          // Hvis der er data i AsyncStorage, så opdaterer vi brugerens data og sætter isAuthenticated til true
          setUser(JSON.parse(userData));
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error("Error loading user data:", error);
      }
    };

    loadUserData();
  }, []);

  const login = (userData) => {
    // Gemmer brugerens data i AsyncStorage ved login
    setUser(userData);
    setIsAuthenticated(true);
  };

  const logout = async () => {
    // Sletter brugerens data og sætter isAuthenticated til false ved logout
    setUser(null);
    setIsAuthenticated(false);
    await AsyncStorage.removeItem("user");
  };
  // Giver "children" adgang til værdierne isAuthenticated, user, login og logout
  return <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>{children}</AuthContext.Provider>;
};
