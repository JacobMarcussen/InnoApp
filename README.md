
# PerfectTable

REPO: https://github.com/JacobMarcussen/PerfectTable

**PerfectTable** er en mobilapplikation, der hjælper brugere med at finde og anmelde restauranter. Brugere kan søge efter restauranter baseret på forskellige kriterier, se detaljer, tilføje anmeldelser og få personlige anbefalinger baseret på deres præferencer og placering.

---

## Funktioner

- **Søgning:** 
  - Find restauranter baseret på:
    - By
    - Tidspunkter
    - Loyalitetsprogrammer
- **Detaljer:**
  - Se detaljeret information om restauranter, herunder:
    - Adresse
    - Køkken
    - Prisklasse
    - Anmeldelser fra andre brugere
- **Anmeldelser:**
  - Tilføj egne anmeldelser med mulighed for billede
  - Læs anmeldelser fra andre brugere
- **Anbefalinger:**
  - Få skræddersyede anbefalinger baseret på:
    - Dine præferencer (fx favorittyper af restauranter)
    - Din placering
- **Profil:**
  - Administrer din brugerprofil, herunder:
    - Navn og email
    - Køn
    - Favoritkøkkener
    - Budget

---

## Installation

Følg disse trin for at installere og køre PerfectTable:

1. **Klon projektet fra GitHub**:
   ```bash
   git clone https://github.com/JacobMarcussen/PerfectTable.git
   ```

2. **Installer afhængigheder**:
   ```bash
   npm install
   ```
   
3. **Opsæt udviklingsmøljø | API NØGLE!**:
   - Opret filen app.json i root
   - Indsætfølgende i filen:
     
       ```bash
       {
        "expo": {
          "name": "PerfectTable",
          "slug": "PerfectTable",
          "version": "1.0.0",
          "orientation": "portrait",
          "icon": "./assets/icon.png",
          "userInterfaceStyle": "light",
          "splash": {
            "image": "./assets/splash.png",
            "resizeMode": "contain",
            "backgroundColor": "#000"
          },
          "newArchEnabled": true,
          "ios": {
            "supportsTablet": true
          },
          "android": {
            "adaptiveIcon": {
              "foregroundImage": "./assets/adaptive-icon.png",
              "backgroundColor": "#000"
            }
          },
          "web": {
            "favicon": "./assets/favicon.png"
          },
          "extra": {
            "AI_API_KEY": "INDSÆT_OPEN_AI_API_NØGLE_HER",
          },
          "plugins": [
            [
              "expo-image-picker",
              {
                "photosPermission": "Tillad adgang til dine billeder for at vælge og uploade dem."
              }
            ]
          ]
        }
      }
       ```

4. **Start applikationen**:
   ```bash
   npm start
   ```

### API Setup
For at kunne køre og bruge appens funktioner skal der indsættes en api nøgle fra Open AI.
Enten kan den indsættes via app.json som beskrevet tidligere. Ellers kan den indsættes manuelt som vist herunder:

**/components/Recomendations.jsx**

Erstat:
 ```bash
 const AI_API_KEY = Constants.expoConfig.extra.AI_API_KEY;
 ```

Med:
 ```bash
 const AI_API_KEY = "INDSÆT_NØGLE_HER";
 ```
---

## Mappestruktur

Projektets mappestruktur er som følger:

```
PerfectTable/
├── .expo/                # Expo-konfigurationer
├── .gitignore            # Filer og mapper, der ignoreres af Git
├── App.js                # Hovedindgangspunkt for applikationen
├── app.json              # Expo projektindstillinger
├── assets/               # Billeder og andre statiske filer
├── babel.config.js       # Babel-konfiguration
├── components/           # Reusable React-komponenter
├── firebase.js           # Firebase-konfiguration og initialisering
├── GlobalStyles.js       # Global styling til applikationen
├── package.json          # Projektets metadata og afhængigheder
├── README.md             # Dokumentation
└── screens/              # Skærmbilleder (React-komponenter til views)
```

---

## Komponenter

### **Components**
- **AuthContext.jsx**: Håndterer brugerens autentificering.
- **DeliveryInfo.jsx**: Viser type og køkken (overvej nyt navn for mere klarhed).
- **RatingInfo.jsx**: Viser gennemsnitlig rating og prisklasse (overvej nyt navn for mere klarhed).
- **Recomendation.jsx**: Håndterer anbefalinger baseret på brugerens præferencer og placering.
- **RestaurantBadge.jsx**: Viser et badge med tekst.
- **RestaurantCard.jsx**: Viser information om en restaurant.
- **RestaurantInfo.jsx**: Viser restaurantens navn og beskrivelse.
- **ReviewCard.jsx**: Viser en anmeldelse.
- **ReviewList.jsx**: Viser en liste af anmeldelser.

### **Screens**
- **AddReview.jsx**: Skærm til at tilføje en anmeldelse.
- **AppNavigator.jsx**: Håndterer navigation i applikationen.
- **CreateUser.jsx**: Skærm til at oprette en ny bruger.
- **LocationDetails.jsx**: Skærm til at vise detaljer om en lokation.
- **Locations.jsx**: Skærm til at vise alle lokationer.
- **Login.jsx**: Skærm til at logge ind.
- **LoginStackScreen.jsx**: Håndterer navigation i login og oprettelse af bruger.
- **MapSearch.jsx**: Skærm til at søge efter lokationer på et kort.
- **Profile.jsx**: Skærm til at administrere brugerens profil.
- **Search.jsx**: Skærm til at søge efter restauranter.
- **SearchFilter.jsx**: Skærm til at filtrere søgeresultater.

---

## Database (Firebase)

Applikationen bruger Firebase til at gemme og hente data via deres Realtime Database. Konfigurationsoplysningerne findes i `firebase.js`.

### Database-struktur

Firebase Realtime Database er struktureret som følger:

```
root/
├── locations/                         # Indeholder information om restauranter
│   ├── locationId1/                   # Unikt ID for en restaurant
│   │   ├── id: "1"                    # Restaurantens id
│   │   ├── name: "Navn"               # Restaurantens navn
│   │   ├── address: "Adresse"         # Restaurantens adresse
│   │   ├── city: "By"                 # Byen hvor restauranten ligger
│   │   ├── postalcode: "1432"         # Restaurantens postnummer
│   │   ├── cuisine: "Køkken"          # Type af køkken (fx Italiensk)
│   │   ├── priceclass: "$$"           # Prisklasse
│   │   ├── image: "URL"               # Url til billede
│   │   ├── type: "Restaurant"         # Type af lokation (altid Restaurant)
│   │   ├── waitlist: true             # Indikerer om der er loyalitetsprogram
│   │   └── times: {}                  # Åbningstider
│   └── locationId2/                   # Flere restauranter
├── reviews/                           # Indeholder anmeldelser
│   ├── locationId1/                   # ID for den tilknyttede restaurant
│   │   ├── reviewId1: "locationId1"   # Unikt ID for en anmeldelse
│   │   │    ├── creator: "userId1"    # ID for den bruger, der skrev anmeldelsen
│   │   │    ├── rating: 5             # Rating givet af brugeren
│   │   │    ├── review: "Kommentar"   # Brugerens kommentar
│   │   │    ├── timestamp: "173000"   # Tidspunkt
├── users/                             # Indeholder brugerdata
│   ├── userId1/                       # Unikt ID for en bruger
│   │   ├── id: "userId1"              # Brugerens id
│   │   ├── name: "Navn"               # Brugerens navn
│   │   ├── email: "Email"             # Brugerens email
│   │   ├── password: "password"       # brugerens IKKE hashede password
│   │   ├── budget: "$$"               # Brugerens budget
│   │   ├── cuisines: []               # Array over brugerens valgte køkkener (cuisines)
```

---

## Styling

Alle globale stilarter findes i `GlobalStyles.js`. For bedre overskuelighed kunne det være en god idé at opdele det i mindre stylesheets og importere dem i de relevante komponenter. Dette er dog en mindre app, så vi fandt det ikke nødvendigt.

---

## Fremtidige Forbedringer

- **Komponentnavne**:
  - Opdatere navne som `DeliveryInfo` og `RatingInfo` for at gøre deres funktioner mere tydelige.
  - F.eks.: `DeliveryInfo` -> `CuisineInfo`, `RatingInfo` -> `PriceAndRatingInfo`.

- **Styling**:
  - Implementer mere specifikke stylesheets for individuelle komponenter.
 
- **Kode**:
  - Opdatere navn på variabler til at stemme overens med deres oprigtige funktionalitet.
 
- **Bruger data**:
  - Kryptere bruger data. Dog følte vi det ikke nødvendigt, da det ikke fremhæver nogen væsentlig funktionalitet
