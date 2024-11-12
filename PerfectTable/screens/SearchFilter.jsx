// FilterScreen.js
import React, { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
import GlobalStyles from "../GlobalStyles";
import { useNavigation } from "@react-navigation/native";
import Ionicons from "react-native-vector-icons/Ionicons";

const FilterScreen = ({ route }) => {
  const navigation = useNavigation();

  // Hent eksisterende værdier fra route params, eller sæt dem til tomme arrays
  const [cityValue, setCityValue] = useState(route.params?.selectedCities || []);
  const [timeValue, setTimeValue] = useState(route.params?.selectedTimes || []);

  const [cityOpen, setCityOpen] = useState(false);
  const [cityItems, setCityItems] = useState([
    { label: "København", value: "København" },
    { label: "Aarhus", value: "Aarhus" },
    { label: "Odense", value: "Odense" },
    { label: "Roskilde", value: "Roskilde" },
  ]);

  const [timeOpen, setTimeOpen] = useState(false);
  const [timeItems, setTimeItems] = useState([
    { label: "17:00", value: "17:00" },
    { label: "18:00", value: "18:00" },
    { label: "19:00", value: "19:00" },
    { label: "20:00", value: "20:00" },
    { label: "21:00", value: "21:00" },
  ]);

  const [waitlistFilter, setWaitlistFilter] = useState(route.params?.waitlistFilter || false);

  // Gem filtervalg og gå tilbage til søgningsskærmen
  const applyFilters = () => {
    navigation.navigate("Search", {
      selectedCities: cityValue,
      selectedTimes: timeValue,
      waitlistFilter,
    });
  };

  return (
    <View style={GlobalStyles.cardContainer}>
      <TouchableOpacity style={GlobalStyles.backButton} onPress={() => navigation.goBack()}>
        <Ionicons name='arrow-back' size={24} color='#fff' />
      </TouchableOpacity>
      <Text style={GlobalStyles.headline}>
        Filtrer <Text style={{ color: "#FF4500" }}>søgeresultater</Text>
      </Text>
      {/* Byvalg Multiselect Dropdown */}
      <View style={{ zIndex: 3000 }}>
        <DropDownPicker
          open={cityOpen}
          value={cityValue}
          items={cityItems}
          setOpen={setCityOpen}
          setValue={setCityValue}
          setItems={setCityItems}
          multiple={true}
          mode='BADGE'
          placeholder='Vælg By(er)'
          badgeColors='#FF4500'
          badgeTextStyle={{ color: "#FFF" }}
          textStyle={{ color: "#fff", fontWeight: "bold" }}
          style={GlobalStyles.dropdown}
          dropDownContainerStyle={GlobalStyles.dropdownContainer}
          listMode='SCROLLVIEW'
          scrollViewProps={{ nestedScrollEnabled: true }}
        />
      </View>

      {/* Tidsvalg Multiselect Dropdown */}
      <View style={{ zIndex: 2000, marginTop: cityOpen ? 160 : 10, marginBottom: timeOpen ? 210 : 10 }}>
        <DropDownPicker
          open={timeOpen}
          value={timeValue}
          items={timeItems}
          setOpen={setTimeOpen}
          setValue={setTimeValue}
          setItems={setTimeItems}
          multiple={true}
          mode='BADGE'
          placeholder='Vælg Tid(er)'
          badgeColors='#FF4500'
          badgeTextStyle={{ color: "#FFF" }}
          textStyle={{ color: "#fff", fontWeight: "bold" }}
          style={GlobalStyles.dropdown}
          dropDownContainerStyle={GlobalStyles.dropdownContainer}
          listMode='SCROLLVIEW'
          scrollViewProps={{ nestedScrollEnabled: true }}
        />
      </View>

      {/* Venteliste Toggle */}
      <TouchableOpacity style={[GlobalStyles.button, waitlistFilter ? GlobalStyles.activeButton : null]} onPress={() => setWaitlistFilter(!waitlistFilter)}>
        <Text style={GlobalStyles.buttonText}>{waitlistFilter ? "Venteliste: Aktiv" : "Venteliste: Inaktiv"}</Text>
      </TouchableOpacity>

      {/* Anvend filtre knap */}
      <TouchableOpacity style={[GlobalStyles.button, { backgroundColor: "#FF4500" }]} onPress={applyFilters}>
        <Text style={GlobalStyles.applyButtonText}>Anvend Filtre</Text>
      </TouchableOpacity>
    </View>
  );
};

export default FilterScreen;