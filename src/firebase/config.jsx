import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyDO0kiKaLUuP0rM3GHypnVgh-x1IzgEPGk",
  authDomain: "calender-f74f8.firebaseapp.com",
  projectId: "calender-f74f8",
  storageBucket: "calender-f74f8.firebasestorage.app",
  messagingSenderId: "286010014188",
  appId: "1:286010014188:web:209f1756cac8cd0dab28c9",
  measurementId: "G-QNE04Y8KNK",
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const db = getFirestore(app);
