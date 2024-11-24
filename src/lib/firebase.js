// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: import.meta.env.VITE_API_KEY,
  authDomain: "reactchat-a46ea.firebaseapp.com",
  projectId: "reactchat-a46ea",
  storageBucket: "reactchat-a46ea.appspot.com",
  messagingSenderId: "106609215473",
  appId: "1:106609215473:web:108315e343d492a3d8e650",
  measurementId: "G-53370Y2JF9"
};



// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);


export const auth = getAuth()
export const db = getFirestore()
export const storage = getStorage()

