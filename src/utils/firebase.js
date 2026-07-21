// // src/firebase.js
// import { initializeApp } from "firebase/app";
// import { getAuth, GoogleAuthProvider } from "firebase/auth";

// const firebaseConfig = {
//   apiKey: "AIzaSyAuu2ed5WspBJo13KZVRL6BNBdoooZQiP8",
//   authDomain: "aitechtrackbackend.firebaseapp.com",
//   projectId: "aitechtrackbackend",
// };

// const app = initializeApp(firebaseConfig);
// export const auth = getAuth(app);
// export const googleProvider = new GoogleAuthProvider();




import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBGJNnbqJgRJD9zFZYL4LIDk7odm7vAaX0",
  authDomain: "test-dd3f4.firebaseapp.com",
  projectId: "test-dd3f4",
  storageBucket: "test-dd3f4.firebasestorage.app",
  messagingSenderId: "721509138905",
  appId: "1:721509138905:web:9258fe989b751f221159c8",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();