import React from "react";
import { View, Text } from "react-native";
import { useAuth } from "../components/AuthContext";

const Profile = () => {
  const { user } = useAuth(); // Access the user object from AuthContext

  return (
    <View>
      {user ? (
        <>
          <Text>Welcome, {user.email}!</Text>
        </>
      ) : (
        <Text>Please log in to see your profile.</Text>
      )}
    </View>
  );
};

export default Profile;
