import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  Animated,
  PanResponder,
  Dimensions,
  StatusBar,
} from "react-native";
import RestaurantCard from "../components/RestaurantCard";
import { get, ref, child } from "firebase/database";
import { database } from "../firebase";
import { useNavigation } from "@react-navigation/native";

// Henter skærmbredden for at bruge den til animationer og layout
const SCREEN_WIDTH = Dimensions.get("window").width;

const Locations = () => {
  // Holder styr på lokationer fra Firebase og det nuværende kort
  const [locations, setLocations] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const navigation = useNavigation();
  // Opretter en ref til at håndtere kortets position med animationer
  const pan = useRef(new Animated.ValueXY()).current;

  // Opretter interpolation til rotation af kortet baseret på, hvor langt det bliver trukket
  const rotation = pan.x.interpolate({
    inputRange: [-SCREEN_WIDTH / 2, 0, SCREEN_WIDTH / 2],
    outputRange: ["-30deg", "0deg", "30deg"], // Drej kortet -30 til 30 grader
    extrapolate: "clamp", // Forhindrer rotation uden for grænserne
  });

  // Opretter en interpolation for at justere gennemsigtigheden af det næste kort
  const nextCardOpacity = pan.x.interpolate({
    inputRange: [-SCREEN_WIDTH / 2, 0, SCREEN_WIDTH / 2],
    outputRange: [1, 0.5, 1], // Gør næste kort halv gennemsigtigt, når der trækkes
    extrapolate: "clamp",
  });

  // Henter data fra Firebase-databasen, når komponenten mountes
  useEffect(() => {
    const fetchLocations = () => {
      const dbRef = ref(database);
      get(child(dbRef, "locations"))
        .then((snapshot) => {
          if (snapshot.exists()) {
            // Konverterer data fra Firebase til et array af lokationer
            const data = snapshot.val();
            const locationsArray = Object.keys(data).map((key) => ({
              id: key,
              ...data[key],
            }));
            setLocations(locationsArray); // Gemmer lokationerne i state
          } else {
            console.log("Ingen lokationer tilgængelige");
          }
        })
        .catch((error) => {
          console.error("Fejl ved hentning af data: ", error);
        });
    };

    fetchLocations(); // Henter lokationer ved opstart
  }, []);

  // Opretter en panResponder, der håndterer touch-bevægelser
  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: () => true, // Begynder at lytte til bevægelser
      onPanResponderMove: Animated.event([null, { dx: pan.x, dy: pan.y }], {
        useNativeDriver: false, // Opdaterer pan.x og pan.y, når kortet trækkes
      }),
      onPanResponderRelease: (e, { dx }) => {
        // Bestemmer, om kortet skal fjernes eller sættes tilbage
        if (dx > 120) {
          forceSwipe("right"); // Fjern kortet til højre
        } else if (dx < -120) {
          forceSwipe("left"); // Fjern kortet til venstre
        } else {
          resetPosition(); // Kortet trækkes ikke nok, sæt det tilbage
        }
      },
    })
  ).current;

  // Animerer kortet væk i en bestemt retning
  const forceSwipe = (direction) => {
    const x = direction === "right" ? SCREEN_WIDTH : -SCREEN_WIDTH;
    Animated.timing(pan, {
      toValue: { x, y: 0 }, // Flytter kortet helt ud til højre eller venstre
      duration: 250, // Hurtig animation på 250 ms
      useNativeDriver: false,
    }).start(() => onSwipeComplete()); // Kald onSwipeComplete efter animationen
  };

  // Nulstiller kortets position, hvis det ikke blev swipet langt nok
  const resetPosition = () => {
    Animated.spring(pan, {
      toValue: { x: 0, y: 0 }, // Returnerer kortet til sin oprindelige position
      useNativeDriver: false,
    }).start();
  };

  // Når swipet er færdigt, opdateres index for at vise næste kort
  const onSwipeComplete = () => {
    pan.setValue({ x: 0, y: 0 }); // Nulstiller animationens position
    // Opdaterer currentIndex for at vise det næste kort i rækken
    setCurrentIndex((prevIndex) =>
      locations.length > 0 && prevIndex === locations.length - 1 ? 0 : prevIndex + 1
    );
  };

  // Funktion til at rendere restaurant-kortene
  const renderCards = () => {
    if (locations.length === 0) {
      // Hvis data stadig indlæses, vises en loading tekst
      return (
        <View>
          <Text style={{ color: "#444", fontSize: 24 }}>Indlæser...</Text>
        </View>
      );
    }

    return locations
      .map((location, i) => {
        if (i < currentIndex) {
          return null; // Skjuler tidligere kort, som er blevet swipet væk
        }
        if (i === currentIndex) {
          // Rendér det nuværende kort, som skal kunne swipes
          return (
            <Animated.View
              key={location.id}
              style={[
                styles.card,
                {
                  transform: [
                    { translateX: pan.x }, // Animerer X-aksens bevægelse
                    { translateY: pan.y }, // Animerer Y-aksens bevægelse
                    { rotate: rotation },  // Animerer rotationen
                  ],
                },
              ]}
              {...panResponder.panHandlers} // Binder touch-bevægelser til kortet
            >
              <RestaurantCard
                name={location.name}
                cuisine={location.cuisine}
                image="https://picsum.photos/500/500" // Placeholder billede
                rating="5"
                address={location.address}
                postalcode={location.postalcode}
                city={location.city}
                type={location.type}
                priceclass={location.priceclass}
                waitlist={location.waitlist}
              />
            </Animated.View>
          );
        }

        // Renderer det næste kort i stakken med mindre opacitet og skalering
        return (
          <Animated.View
            key={location.id}
            style={[
              styles.card,
              {
                opacity: nextCardOpacity,
                transform: [{ scale: nextCardOpacity }],
              },
            ]}
          >
            <RestaurantCard
              name={location.name}
              cuisine={location.cuisine}
              image="https://picsum.photos/500/500" // Placeholder billede
              rating="5"
              address={location.address}
              postalcode={location.postalcode}
              city={location.city}
              type={location.type}
              priceclass={location.priceclass}
              waitlist={location.waitlist}
            />
          </Animated.View>
        );
      })
      .reverse(); // Sikrer at det øverste kort renderes sidst
  };

  return (
    <View style={styles.wrapper}>
      {/* StatusBar til at ændre statuslinjens stil */}
      <StatusBar barStyle="dark-content" backgroundColor="#E3F2FD" />
      {renderCards()} {/* Renderer alle kortene */}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1, // Fylder hele skærmen
    justifyContent: "center", // Centrerer indholdet vertikalt
    alignItems: "center", // Centrerer indholdet horisontalt
    backgroundColor: "#ffffff", // Baggrundsfarve
  },
  card: {
    width: SCREEN_WIDTH - 40, // Kortets bredde
    height: 500, // Kortets højde
    position: "absolute", // Absolut positionering for overlapning
    padding: 20, // Indvendig margin
    borderRadius: 20, // Afrundede hjørner på kortet
    shadowColor: "#000", // Skyggefarve
    shadowOffset: { width: 0, height: 10 }, // Skyggens forskydning
    shadowOpacity: 0.3, // Skyggens gennemsigtighed
    shadowRadius: 8, // Skyggens radius
    elevation: 5, // Skyggens elevation til Android-enheder
    backgroundColor: "#ffffff", // Kortets baggrundsfarve
    borderColor: "#ffffff", // Kortets kantfarve
    borderWidth: 2, // Kortets kantbredde
  },
});

export default Locations;
