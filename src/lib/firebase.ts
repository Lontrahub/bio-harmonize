
import { initializeApp, getApps, getApp, type FirebaseApp } from "firebase/app";
import { getAuth, type Auth } from "firebase/auth";
import { getFirestore, type Firestore } from "firebase/firestore";

// This is the correct and robust way to initialize Firebase.
// It uses a hardcoded configuration which is necessary for the App Hosting environment.
const firebaseConfig = {
  apiKey: "AIzaSyBtKXyprVuRWmK84yW7gzQU2nWSt3ccLtM",
  authDomain: "bio-harmonize.firebaseapp.com",
  projectId: "bio-harmonize",
  storageBucket: "bio-harmonize.appspot.com",
  messagingSenderId: "1033987752579",
  appId: "1:1033987752579:web:1a46641cc285034d1e11b6"
};

let app: FirebaseApp;
let auth: Auth;
let db: Firestore;

// This check prevents re-initializing the app on every hot-reload in development.
if (!getApps().length) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApp();
}

auth = getAuth(app);
db = getFirestore(app);

// We define firebaseEnabled based on whether the projectId is present in the config.
const firebaseEnabled = !!firebaseConfig.projectId;

export { app, auth, db, firebaseEnabled };
