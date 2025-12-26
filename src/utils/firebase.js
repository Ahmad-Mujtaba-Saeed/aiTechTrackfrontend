// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBRUxf-vO_8SjzWoGY41BsZkG5nOzUPILA",
  authDomain: "pathfinder-a1c84.firebaseapp.com",
  projectId: "pathfinder-a1c84",
  // ...other config from Firebase console
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
