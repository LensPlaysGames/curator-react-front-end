// This is the big daddy file that sets up the Firebase application and
// exposes all the necessary components, like firebaseAuth.

import { getAuth } from "firebase/auth";
import { initializeApp, getApps } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyBKLll6CklsBfv193UsU2ZI2nmp7gi1Nl4",
  authDomain: "curator-vsp.firebaseapp.com",
  projectId: "curator-vsp",
  storageBucket: "curator-vsp.appspot.com",
  messagingSenderId: "409901080163",
  appId: "1:409901080163:web:8eb3237294a811ae432256",
  measurementId: "G-1Y9SEFVW8V"
};

// Initialize the Firebase application
const firebaseApp = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

export const firebaseAuth = getAuth();

