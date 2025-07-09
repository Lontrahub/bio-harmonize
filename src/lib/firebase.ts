import { initializeApp, getApps, getApp, type FirebaseApp } from "firebase/app";
import { getAuth, type Auth } from "firebase/auth";
import { getFirestore, type Firestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// To find your Firebase config object:
// 1. Go to your Firebase project console.
// 2. In the left-hand menu, click the gear icon next to "Project Overview".
// 3. Click "Project settings".
// 4. In the "Your apps" card, select the web app.
// 5. Under "Firebase SDK snippet", choose "Config".
// 6. Copy the firebaseConfig object and place the values in a .env.local file in your project root.
// Example .env.local:
// NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
// NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
// NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
// ...and so on.


let app: FirebaseApp | null = null;
let auth: Auth | null = null;
let db: Firestore | null = null;

const firebaseEnabled = !!(firebaseConfig.apiKey && firebaseConfig.projectId);

if (firebaseEnabled) {
  try {
    app = getApps().length ? getApp() : initializeApp(firebaseConfig);
    auth = getAuth(app);
    db = getFirestore(app);
  } catch (error: any) {
    console.error("Firebase initialization error:", error.message);
    app = null;
    auth = null;
    db = null;
  }
} else {
    console.warn("Firebase configuration is missing or incomplete. Authentication features are disabled. Please create and configure your .env.local file.");
}

export { app, auth, db, firebaseEnabled };
