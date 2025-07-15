
import { initializeApp, getApps, getApp, type FirebaseApp } from "firebase/app";
import { getAuth, type Auth } from "firebase/auth";
import { getFirestore, type Firestore } from "firebase/firestore";

// Hardcoded Firebase configuration for the "bio-harmonize" project.
// This is necessary for the App Hosting environment, which does not use .env files.
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "bio-harmonize.firebaseapp.com",
  projectId: "bio-harmonize",
  storageBucket: "bio-harmonize.appspot.com",
  messagingSenderId: "1057863583626",
  appId: "1:1057863583626:web:10c14b13bf1f016f40c765",
};

let app: FirebaseApp;
let auth: Auth;
let db: Firestore;

// Robust initialization check for all environments.
if (getApps().length === 0) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApp();
}

auth = getAuth(app);
db = getFirestore(app);

// We confirm Firebase is enabled by checking if the config has a projectId.
const firebaseEnabled = !!firebaseConfig.projectId;

export { app, auth, db, firebaseEnabled };
