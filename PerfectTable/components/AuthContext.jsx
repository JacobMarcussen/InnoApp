import React, { createContext, useContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Check if user data exists in AsyncStorage when the app loads
    const loadUserData = async () => {
      try {
        const userData = await AsyncStorage.getItem("user");
        console.log("Loaded user data:", userData);
        if (userData) {
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
    setUser(userData);
    setIsAuthenticated(true);
  };

  const logout = async () => {
    setUser(null);
    setIsAuthenticated(false);
    await AsyncStorage.removeItem("user"); // Remove user data from AsyncStorage on logout
  };

  return <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>{children}</AuthContext.Provider>;
};
