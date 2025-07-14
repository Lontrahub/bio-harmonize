
import { initializeApp, getApps, getApp, type FirebaseApp } from "firebase/app";
import { getAuth, type Auth } from "firebase/auth";
import { getFirestore, type Firestore } from "firebase/firestore";

// This configuration is for your "bio-harmonize" project.
const firebaseConfig = {
  apiKey: "AIzaSyBtKXyprVuRWmK84yW7gzQU2nWSt3ccLtM",
  authDomain: "bio-harmonize.firebaseapp.com",
  projectId: "bio-harmonize",
  storageBucket: "bio-harmonize.appspot.com",
  messagingSenderId: "1033987752579",
  appId: "1:1033987752579:web:a953cf476632c02af505b2", // Using a valid App ID format
};

let app: FirebaseApp;
let auth: Auth;
let db: Firestore;
let firebaseEnabled = true;

if (getApps().length === 0) {
  try {
    app = initializeApp(firebaseConfig);
  } catch (e) {
    console.error("Firebase initialization error", e);
    firebaseEnabled = false;
  }
} else {
  app = getApp();
}

// @ts-ignore - These will be assigned if initialization succeeds
auth = getAuth(app);
// @ts-ignore
db = getFirestore(app);


export { app, auth, db, firebaseEnabled };
