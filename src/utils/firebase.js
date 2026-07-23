// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAuu2ed5WspBJo13KZVRL6BNBdoooZQiP8",
  authDomain: "aitechtrackbackend.firebaseapp.com",
  projectId: "aitechtrackbackend",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();