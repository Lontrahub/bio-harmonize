
import { initializeApp, getApps, getApp, type FirebaseApp } from "firebase/app";
import { getAuth, type Auth } from "firebase/auth";
import { getFirestore, type Firestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBtKXyprVuRWmK84yW7gzQU2nWSt3ccLtM",
  authDomain: "bio-harmonize.firebaseapp.com",
  projectId: "bio-harmonize",
  storageBucket: "bio-harmonize.appspot.com",
  messagingSenderId: "1033987752579",
  appId: "1:1033987752579:web:your_app_id_here", 
};

let app: FirebaseApp;
let auth: Auth;
let db: Firestore;

const firebaseEnabled = !!(firebaseConfig.apiKey && firebaseConfig.projectId);

if (getApps().length === 0 && firebaseEnabled) {
  app = initializeApp(firebaseConfig);
} else if (firebaseEnabled) {
  app = getApp();
} else {
  console.warn("Firebase configuration is missing or incomplete. Authentication features are disabled.");
}

// @ts-ignore
auth = getAuth(app);
// @ts-ignore
db = getFirestore(app);


export { app, auth, db, firebaseEnabled };
