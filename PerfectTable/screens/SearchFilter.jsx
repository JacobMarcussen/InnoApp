// FilterScreen.js
import React, { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import ModalDropdown from "react-native-modal-dropdown";
import GlobalStyles from "../GlobalStyles";
import { useNavigation } from "@react-navigation/native";

const FilterScreen = ({ route }) => {
  const navigation = useNavigation();

  // Hent eksisterende filtervalg fra route params eller brug standardværdier
  const [selectedCity, setSelectedCity] = useState(route.params?.selectedCity || "");
  const [selectedTime, setSelectedTime] = useState(route.params?.selectedTime || "17:00");
  const [waitlistFilter, setWaitlistFilter] = useState(route.params?.waitlistFilter || false);

  // Gem filtervalg og gå tilbage til søgningsskærmen
  const applyFilters = () => {
    navigation.navigate("Search", {
      selectedCity,
      selectedTime,
      waitlistFilter,
    });
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#1e1e1e", padding: 20 }}>
      <Text style={GlobalStyles.headline}>Filtrer Søgeresultater</Text>

      {/* Byvalg Dropdown */}
      <ModalDropdown
        options={["København", "Aarhus", "Odense", "Roskilde"]}
        defaultValue={selectedCity || "Vælg By"}
        onSelect={(index, value) => setSelectedCity(value)}
        style={GlobalStyles.dropdown}
        textStyle={GlobalStyles.dropdownText}
        dropdownStyle={GlobalStyles.dropdownMenu}
        dropdownTextStyle={GlobalStyles.dropdownItemText}
        dropdownTextHighlightStyle={GlobalStyles.dropdownItemTextHighlight}
      />

      {/* Tidsvalg Dropdown */}
      <ModalDropdown
        options={["17:00", "18:00", "19:00", "20:00", "21:00"]}
        defaultValue={selectedTime || "Vælg Tid"}
        onSelect={(index, value) => setSelectedTime(value)}
        style={GlobalStyles.dropdown}
        textStyle={GlobalStyles.dropdownText}
        dropdownStyle={GlobalStyles.dropdownMenu}
        dropdownTextStyle={GlobalStyles.dropdownItemText}
        dropdownTextHighlightStyle={GlobalStyles.dropdownItemTextHighlight}
      />

      {/* Venteliste Toggle */}
      <TouchableOpacity style={[GlobalStyles.button, waitlistFilter ? GlobalStyles.activeButton : null]} onPress={() => setWaitlistFilter(!waitlistFilter)}>
        <Text style={GlobalStyles.buttonText}>{waitlistFilter ? "Venteliste: Aktiv" : "Venteliste: Inaktiv"}</Text>
      </TouchableOpacity>

      {/* Anvend filtre knap */}
      <TouchableOpacity style={GlobalStyles.applyButton} onPress={applyFilters}>
        <Text style={GlobalStyles.applyButtonText}>Anvend Filtre</Text>
      </TouchableOpacity>
    </View>
  );
};

export default FilterScreen;
