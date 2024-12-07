import { getApps, initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyC6HD7P-cAbiWaorxUt7V5CBzxwJdh1rU0",
  authDomain: "spisgaadt-7af47.firebaseapp.com",
  projectId: "spisgaadt-7af47",
  storageBucket: "spisgaadt-7af47.firebasestorage.app",
  messagingSenderId: "41873558589",
  appId: "1:41873558589:web:d5830a42ffa05ed579ae54",
  databaseURL: "https://spisgaadt-7af47-default-rtdb.europe-west1.firebasedatabase.app",
};

let app;
if (getApps().length < 1) {
  app = initializeApp(firebaseConfig);
}

export const storage = getStorage(app);
const database = getDatabase(app);
export { database };
