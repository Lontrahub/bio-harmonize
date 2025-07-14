
import { initializeApp, getApps, getApp, type FirebaseApp } from "firebase/app";
import { getAuth, type Auth } from "firebase/auth";
import { getFirestore, type Firestore } from "firebase/firestore";

// This configuration is for your "bio-harmonize" project.
const firebaseConfig = {
  apiKey: "AIzaSyBtKXyprVuRWmK84yW7gzQU2nWSt3ccLtM",
  authDomain: "bio.joevanniekerk.com",
  projectId: "bio-harmonize",
  storageBucket: "bio-harmonize.appspot.com",
  messagingSenderId: "1033987752579",
  appId: "1:1033987752579:web:a953cf476632c02af505b2",
};

let app: FirebaseApp;
let auth: Auth;
let db: Firestore;

// This simplified check is more robust for different environments.
if (getApps().length === 0) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApp();
}

auth = getAuth(app);
db = getFirestore(app);

// We add a single boolean to check if the config is valid.
const firebaseEnabled = !!firebaseConfig.apiKey;

export { app, auth, db, firebaseEnabled };
