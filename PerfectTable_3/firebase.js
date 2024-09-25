import { getApps, initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyC6HD7P-cAbiWaorxUt7V5CBzxwJdh1rU0",
  authDomain: "spisgaadt-7af47.firebaseapp.com",
  projectId: "spisgaadt-7af47",
  storageBucket: "spisgaadt-7af47.appspot.com",
  messagingSenderId: "41873558589",
  appId: "1:41873558589:web:d5830a42ffa05ed579ae54",
  databaseURL: "https://spisgaadt-7af47-default-rtdb.europe-west1.firebasedatabase.app",
};

let app;
if (getApps().length < 1) {
  app = initializeApp(firebaseConfig);
}

const database = getDatabase(app);

export { database };
