// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";
import {getFirestore} from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: "notion-clone-with-ai.firebaseapp.com",
  projectId: "notion-clone-with-ai",
  storageBucket: "notion-clone-with-ai.firebasestorage.app",
  messagingSenderId: "30819999622",
  appId: "1:30819999622:web:ac0d13cc2ded17cd045607"
};

// Initialize Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);

export {db};